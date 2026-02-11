import { jwtVerify } from 'jose';

// Type definitions for global variables
declare const jest: typeof import('@jest/globals') | undefined;

// Type definition for KVNamespace to avoid TypeScript errors
type KVNamespace = any;

/**
 * Creates a Response with CORS headers to allow credentials
 * @param body - Response body
 * @param init - Response init options
 * @param request - The request to get the origin from
 * @returns Response with CORS headers
 */
function createCorsResponse(
    body: BodyInit | null,
    init?: ResponseInit,
    request?: Request
): Response {
    // Build headers object from init.headers
    const headersObj: Record<string, string> = {};

    // Copy existing headers from init if provided
    if (init?.headers) {
        const existingHeaders = new Headers(init.headers);
        existingHeaders.forEach((value, key) => {
            headersObj[key] = value;
        });
    }

    // When using credentials, we must specify the exact origin, not '*'
    const origin = request?.headers.get('Origin') || '*';
    headersObj['Access-Control-Allow-Origin'] = origin;
    headersObj['Access-Control-Allow-Credentials'] = 'true';
    headersObj['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    headersObj['Access-Control-Allow-Headers'] = 'Content-Type, X-CSRF-Token, Authorization';

    // Create response without headers in init to avoid conflicts
    const { headers: _ignored, ...restInit } = init || {};
    return new Response(body, {
        ...restInit,
        headers: headersObj,
    });
}

/**
 * Compresses data using gzip compression
 * @param {string} data - The data to compress
 * @returns {Promise<ArrayBuffer>} - The compressed binary data
 */
async function compressData(data: string): Promise<ArrayBuffer> {
    try {
        const encoder = new TextEncoder();
        const input = encoder.encode(data);

        // Try Brotli compression first, fall back to deflate-raw
        let compressionStream;
        try {
            compressionStream = new CompressionStream('br' as any);
        } catch (_e) {
            compressionStream = new CompressionStream('deflate-raw');
        }

        const writer = compressionStream.writable.getWriter();
        writer.write(input);
        writer.close();

        const compressed = await new Response(compressionStream.readable).arrayBuffer();
        return compressed;
    } catch (error) {
        console.error('Compression error:', error);
        return new TextEncoder().encode(data).buffer; // Fallback to uncompressed
    }
}

/**
 * Decompresses data if it was compressed with gzip
 * @param {ArrayBuffer | string} data - The data to decompress
 * @param {string | null} contentType - The Content-Type header from KV metadata
 * @returns {Promise<string>} - The decompressed data
 */
async function decompressData(
    data: ArrayBuffer | string,
    contentType: string | null
): Promise<string> {
    // Check if data is compressed using Content-Type header
    if (!contentType || !contentType.includes('br')) {
        // If data is a string, return as-is
        if (typeof data === 'string') {
            return data;
        }
        // If data is ArrayBuffer and not compressed, decode as UTF-8 string
        return new TextDecoder().decode(data);
    }

    try {
        // If data is a string, it might be base64 encoded (backward compatibility)
        let buffer: ArrayBuffer;
        if (typeof data === 'string') {
            // Check if it's the old format with compression marker
            if (data.startsWith('\x00gz\x00')) {
                const base64 = data.slice(4);
                buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer;
            } else {
                // If no compression marker, treat as uncompressed string
                return data;
            }
        } else {
            buffer = data;
        }

        // Try Brotli decompression first, fall back to deflate-raw
        let decompressionStream;
        try {
            decompressionStream = new DecompressionStream('br' as any);
        } catch (_e) {
            decompressionStream = new DecompressionStream('deflate-raw');
        }
        const reader = new Response(buffer).body?.pipeThrough(decompressionStream).getReader();
        if (!reader) {
            throw new Error('Failed to create decompression reader');
        }

        const chunks: Uint8Array[] = [];
        let done = false;
        while (!done) {
            const result = await reader.read();
            done = result.done;
            if (result.value) {
                chunks.push(result.value);
            }
        }

        const decompressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
        let offset = 0;
        for (const chunk of chunks) {
            decompressed.set(chunk, offset);
            offset += chunk.length;
        }

        return new TextDecoder().decode(decompressed);
    } catch (error) {
        console.error('Decompression error:', error);
        // Fallback to returning raw data
        if (typeof data === 'string') {
            return data;
        }
        return new TextDecoder().decode(data);
    }
}

/**
 * Rate limiting function using KV store with sliding window algorithm
 * @param {Request} request - The request object
 * @param {Object} env - Environment variables
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowSeconds - Time window in seconds
 * @returns {boolean} - True if rate limited
 */
export async function checkRateLimit(
    request: Request,
    env: { KV: KVNamespace },
    maxRequests = 30,
    windowSeconds = 60
) {
    const clientIP =
        request.headers.get('CF-Connecting-IP') ||
        request.headers.get('X-Forwarded-For') ||
        'unknown';
    const key = `ratelimit_${clientIP}`;

    try {
        const now = Date.now();
        const windowStart = now - windowSeconds * 1000;
        const requests = await env.KV.get(key);
        const parsedRequests = requests ? JSON.parse(requests) : [];
        const validRequests = parsedRequests.filter((t: number) => t > windowStart);

        if (validRequests.length >= maxRequests) {
            return true; // Rate limited
        }

        validRequests.push(now);
        await env.KV.put(key, JSON.stringify(validRequests), { expirationTtl: windowSeconds });
        return false; // Not rate limited
    } catch (error) {
        console.error('Rate limit check error:', error);
        return false; // Allow request on error
    }
}

/**
 * Verifies a JWT token with the given secret.
 * @param {string} token - The JWT token to verify.
 * @param {string} secret - The secret key used for signing.
 * @returns {Object|null} The decoded payload if valid, null otherwise.
 */
async function verifyJWT(token: string, secret: string) {
    try {
        const secretKey = new TextEncoder().encode(secret);
        const { payload } = await jwtVerify(token, secretKey);
        return payload;
    } catch (_e) {
        return null;
    }
}

/**
 * Authenticates a request by verifying the JWT token from cookie or Bearer header.
 * @param {Request} request - The HTTP request object.
 * @param {Object} env - Environment variables.
 * @returns {Object|null} The decoded JWT payload if authenticated, null otherwise.
 */
async function authenticate(request: Request, env: { JWT_SECRET: string; KV: KVNamespace }) {
    let token = null;

    // Try cookie first
    const cookieHeader = request.headers.get('Cookie');
    if (cookieHeader) {
        const cookies = cookieHeader.split(';').map((c: string) => c.trim());
        const authCookie = cookies.find((c: string) => c.startsWith('auth_token='));
        if (authCookie) {
            token = authCookie.substring('auth_token='.length);
        }
    }

    // Fallback to Authorization header
    if (!token) {
        const authHeader = request.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    if (!token || !env.JWT_SECRET) {
        return null;
    }

    return await verifyJWT(token, env.JWT_SECRET);
}

/**
 * Validates CSRF token for POST requests.
 * @param {Request} request - The HTTP request object.
 * @param {Object} env - Environment variables.
 * @param {string} userId - The user ID.
 * @returns {boolean} True if CSRF token is valid, false otherwise.
 */
async function validateCsrfToken(request: Request, env: { KV: KVNamespace }, userId: string) {
    const providedCsrf = request.headers.get('X-CSRF-Token');
    if (!providedCsrf) {
        return false;
    }

    const storedCsrf = await env.KV.get(`csrf_${userId}`);
    if (!storedCsrf || providedCsrf !== storedCsrf) {
        return false;
    }

    // Delete used CSRF token to prevent replay attacks
    await env.KV.delete(`csrf_${userId}`);
    return true;
}

/**
 * Handles GET requests to retrieve user data or generate CSRF token.
 * @param {Object} context - The request context.
 * @param {Request} context.request - The HTTP request object.
 * @param {Object} context.env - Environment variables.
 * @returns {Response} The HTTP response with user data or error.
 */
export async function onRequestGet({
    request,
    env,
}: {
    request: Request;
    env: { JWT_SECRET: string; KV: KVNamespace };
}) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
        return createCorsResponse(null, { status: 204 }, request);
    }

    // Rate limiting: 30 requests per minute for data access (skip in tests)
    if (typeof jest === 'undefined' && (await checkRateLimit(request, env, 30, 60))) {
        return createCorsResponse(
            JSON.stringify({ error: 'Rate limit exceeded' }),
            { status: 429 },
            request
        );
    }

    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    // Handle CSRF token generation
    if (action === 'csrf') {
        const payload = await authenticate(request, env);
        if (!payload) {
            return createCorsResponse(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401 },
                request
            );
        }

        const userId = payload.userId;
        const userIdRegex = /^[a-zA-Z0-9_-]{1,100}$/;
        if (!userId || typeof userId !== 'string' || !userIdRegex.test(userId)) {
            return createCorsResponse(
                JSON.stringify({ error: 'Invalid userId' }),
                { status: 400 },
                request
            );
        }

        const csrfToken = crypto.randomUUID();
        await env.KV.put(`csrf_${userId}`, csrfToken, { expirationTtl: 3600 });
        return createCorsResponse(
            JSON.stringify({ csrfToken }),
            {
                headers: { 'Content-Type': 'application/json' },
            },
            request
        );
    }

    // Handle user data retrieval
    const payload = await authenticate(request, env);
    if (!payload) {
        return createCorsResponse(
            JSON.stringify({ error: 'Unauthorized' }),
            { status: 401 },
            request
        );
    }

    const userId = payload.userId;
    const userIdRegex = /^[a-zA-Z0-9_-]{1,100}$/;
    if (!userId || typeof userId !== 'string' || !userIdRegex.test(userId)) {
        return createCorsResponse(
            JSON.stringify({ error: 'Invalid userId' }),
            { status: 400 },
            request
        );
    }

    try {
        // Get KV value with metadata
        const { value: data, metadata } = await env.KV.getWithMetadata(userId, 'arrayBuffer', {
            cacheTtl: 30,
        });
        if (data) {
            // Get Content-Encoding from metadata
            const contentEncoding = metadata?.['Content-Encoding'];

            // Determine compression type from metadata
            const compressionType = contentEncoding === 'gzip' ? 'gzip' : null;

            let decompressed: string;

            // Check if data is in old string format (backward compatibility)
            if (typeof data === 'string') {
                decompressed = await decompressData(data, compressionType);
            } else {
                // Decompress based on metadata
                decompressed = await decompressData(data, compressionType);
            }

            // Ensure decompressed is a valid string (handle null/undefined from failed decompression)
            const responseBody = decompressed || JSON.stringify({ problems: {}, deletedIds: [] });
            return createCorsResponse(
                responseBody,
                {
                    headers: { 'Content-Type': 'application/json' },
                },
                request
            );
        }
        return createCorsResponse(
            JSON.stringify({ problems: {}, deletedIds: [] }),
            {
                headers: { 'Content-Type': 'application/json' },
            },
            request
        );
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        return createCorsResponse(
            JSON.stringify({ error: errorMessage }),
            { status: 500 },
            request
        );
    }
}

/**
 * Handles POST requests to save user data.
 * @param {Object} context - The request context.
 * @param {Request} context.request - The HTTP request object.
 * @param {Object} context.env - Environment variables.
 * @returns {Response} The HTTP response indicating success or error.
 */
export async function onRequestPost({
    request,
    env,
}: {
    request: Request;
    env: { JWT_SECRET: string; KV: KVNamespace };
}) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
        return createCorsResponse(null, { status: 204 }, request);
    }

    // Rate limiting: 30 requests per minute for data access (skip in tests)
    if (typeof jest === 'undefined' && (await checkRateLimit(request, env, 30, 60))) {
        return createCorsResponse(
            JSON.stringify({ error: 'Rate limit exceeded' }),
            { status: 429 },
            request
        );
    }

    const payload = await authenticate(request, env);
    if (!payload) {
        return createCorsResponse(
            JSON.stringify({ error: 'Unauthorized' }),
            { status: 401 },
            request
        );
    }

    const userId = payload.userId;
    const userIdRegex = /^[a-zA-Z0-9_-]{1,100}$/;
    if (!userId || typeof userId !== 'string' || !userIdRegex.test(userId)) {
        return createCorsResponse(
            JSON.stringify({ error: 'Invalid userId' }),
            { status: 400 },
            request
        );
    }

    // Validate CSRF token
    const csrfValid = await validateCsrfToken(request, env, userId);
    if (!csrfValid) {
        return createCorsResponse(
            JSON.stringify({ error: 'Invalid CSRF token' }),
            { status: 403 },
            request
        );
    }

    let body;
    try {
        body = await request.json();
    } catch (_e) {
        return createCorsResponse(
            JSON.stringify({ error: 'Invalid JSON' }),
            { status: 400 },
            request
        );
    }

    const { data } = body;
    if (!data || typeof data !== 'object') {
        return createCorsResponse(
            JSON.stringify({ error: 'Invalid data' }),
            { status: 400 },
            request
        );
    }

    try {
        const jsonData = JSON.stringify(data);
        const compressed = await compressData(jsonData);

        // Determine if data should be stored as compressed
        const shouldCompress =
            compressed.byteLength < new TextEncoder().encode(jsonData).byteLength;

        if (shouldCompress) {
            // Store compressed data with metadata indicating brotli encoding
            await env.KV.put(userId, compressed, {
                metadata: {
                    'Content-Type': 'application/json',
                    'Content-Encoding': 'br',
                },
            });
        } else {
            // Store uncompressed data with JSON content type
            await env.KV.put(userId, jsonData, {
                metadata: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return createCorsResponse('OK', undefined, request);
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        return createCorsResponse(
            JSON.stringify({ error: errorMessage }),
            { status: 500 },
            request
        );
    }
}
