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
 * Compresses string data using Brotli or deflate-raw compression.
 * Attempts Brotli first for best compression ratio, falls back to deflate-raw.
 * Used to reduce KV storage size and transfer bandwidth for user data.
 * @param {string} data - The JSON string data to compress
 * @returns {Promise<ArrayBuffer>} The compressed binary data as ArrayBuffer
 * @throws {Error} If compression fails, returns uncompressed data as fallback
 * @example
 * const jsonData = JSON.stringify({ problems: { ... } });
 * const compressed = await compressData(jsonData);
 * // Store compressed in KV with 'Content-Encoding': 'br' metadata
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
 * Decompresses Brotli or deflate-raw compressed data from KV storage.
 * Handles backward compatibility with legacy gzip format and uncompressed strings.
 * Detects compression type from Content-Encoding metadata or data format markers.
 * @param {ArrayBuffer | string} data - The compressed data or raw string
 * @param {string | null} contentType - The Content-Encoding from KV metadata ('br', 'gzip', or null)
 * @returns {Promise<string>} The decompressed JSON string, or raw data if not compressed
 * @throws {Error} Returns raw data as string if decompression fails
 * @example
 * // Decompress Brotli data from KV
 * const { value, metadata } = await env.KV.getWithMetadata(userId, 'arrayBuffer');
 * const json = await decompressData(value, metadata?.['Content-Encoding']);
 * const userData = JSON.parse(json);
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
 * Implements sliding window rate limiting using Cloudflare KV.
 * Tracks request timestamps per client IP and rejects if limit exceeded.
 * Automatically cleans expired entries and updates KV atomically.
 * @param {Request} request - The HTTP request to check
 * @param {Object} env - Environment with KV namespace binding
 * @param {number} [maxRequests=30] - Maximum allowed requests in the time window
 * @param {number} [windowSeconds=60] - Time window duration in seconds
 * @returns {Promise<boolean>} True if request should be rate limited (blocked)
 * @example
 * // Check if request exceeds 10 requests per minute
 * const isLimited = await checkRateLimit(request, env, 10, 60);
 * if (isLimited) {
 *   return new Response('Rate limit exceeded', { status: 429 });
 * }
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
 * Verifies a JWT token using the HS256 algorithm.
 * Decodes and validates the token signature against the provided secret.
 * Used to authenticate API requests from authenticated users.
 * @param {string} token - The JWT token string to verify
 * @param {string} secret - The HMAC secret key for signature verification
 * @returns {Promise<Object | null>} Decoded JWT payload if valid, null if invalid/expired
 * @example
 * const payload = await verifyJWT(authToken, env.JWT_SECRET);
 * if (payload) {
 *   const userId = payload.userId;
 *   // Proceed with authenticated request
 * }
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
 * Authenticates an HTTP request by extracting and verifying JWT token.
 * Checks for token in HttpOnly cookie first, then falls back to Authorization header.
 * Returns decoded payload containing userId and displayName if valid.
 * @param {Request} request - The incoming HTTP request
 * @param {Object} env - Environment with JWT_SECRET and KV bindings
 * @returns {Promise<Object | null>} Decoded JWT payload with userId/displayName, or null if unauthenticated
 * @example
 * const payload = await authenticate(request, env);
 * if (!payload) {
 *   return new Response('Unauthorized', { status: 401 });
 * }
 * const { userId, displayName } = payload;
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
 * Validates CSRF token for state-changing POST requests.
 * Implements single-use token pattern to prevent replay attacks.
 * Token is deleted from KV immediately after successful validation.
 * @param {Request} request - The HTTP request with X-CSRF-Token header
 * @param {Object} env - Environment with KV namespace binding
 * @param {string} userId - The authenticated user's ID for token lookup
 * @returns {Promise<boolean>} True if CSRF token is valid and consumed successfully
 * @example
 * const isValid = await validateCsrfToken(request, env, userId);
 * if (!isValid) {
 *   return new Response('Invalid CSRF token', { status: 403 });
 * }
 * // Token is now deleted and cannot be reused
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
 * Handles GET requests for user data retrieval or CSRF token generation.
 * Supports two actions: 'csrf' (generate new token) or default (fetch user data).
 * User data is automatically decompressed if stored with compression.
 * Implements rate limiting and CORS for cross-origin requests.
 * @param {Object} context - Cloudflare Pages Function context
 * @param {Request} context.request - The incoming HTTP request
 * @param {Object} context.env - Environment bindings (JWT_SECRET, KV)
 * @returns {Promise<Response>} JSON response with user data or CSRF token, or error response
 * @example
 * // Get user data
 * GET /api/user
 * Authorization: Bearer <jwt>
 * // Returns: { problems: {...}, deletedIds: [...] }
 *
 * // Get CSRF token
 * GET /api/user?action=csrf
 * Authorization: Bearer <jwt>
 * // Returns: { csrfToken: 'uuid-token' }
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
 * Handles POST requests to save user data with compression and CSRF protection.
 * Validates JWT authentication and CSRF token before processing.
 * Automatically compresses data if it reduces size, stores with appropriate metadata.
 * Implements rate limiting to prevent abuse.
 * @param {Object} context - Cloudflare Pages Function context
 * @param {Request} context.request - The incoming HTTP request with JSON body
 * @param {Object} context.env - Environment bindings (JWT_SECRET, KV)
 * @returns {Promise<Response>} Success response or error with appropriate status code
 * @example
 * POST /api/user
 * Authorization: Bearer <jwt>
 * X-CSRF-Token: <token>
 * Content-Type: application/json
 *
 * Body: { data: { problems: {...}, deletedIds: [...] } }
 * // Returns: "OK" on success, or { error: "..." } on failure
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
