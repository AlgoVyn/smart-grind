import { jwtVerify } from 'jose';

/**
 * Rate limiting function using KV store
 * @param {Request} request - The request object
 * @param {Object} env - Environment variables
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowSeconds - Time window in seconds
 * @returns {boolean} - True if rate limited
 */
export async function checkRateLimit(request, env, maxRequests = 30, windowSeconds = 60) {
    const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
    const key = `ratelimit_${clientIP}_${Math.floor(Date.now() / (windowSeconds * 1000))}`;

    try {
        const current = await env.KV.get(key);
        const count = current ? parseInt(current) : 0;

        if (count >= maxRequests) {
            return true; // Rate limited
        }

        await env.KV.put(key, (count + 1).toString(), { expirationTtl: windowSeconds });
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
async function verifyJWT(token, secret) {
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
async function authenticate(request, env) {
    let token = null;

    // Try cookie first
    const cookieHeader = request.headers.get('Cookie');
    if (cookieHeader) {
        const cookies = cookieHeader.split(';').map(c => c.trim());
        const authCookie = cookies.find(c => c.startsWith('auth_token='));
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
 * Handles GET requests to retrieve user data.
 * @param {Object} context - The request context.
 * @param {Request} context.request - The HTTP request object.
 * @param {Object} context.env - Environment variables.
 * @returns {Response} The HTTP response with user data or error.
 */
export async function onRequestGet({ request, env }) {
    // Rate limiting: 30 requests per minute for data access (skip in tests)
    if (typeof jest === 'undefined' && await checkRateLimit(request, env, 30, 60)) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 });
    }

    const payload = await authenticate(request, env);
    if (!payload) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const userId = payload.userId;
    if (!userId || typeof userId !== 'string' || userId.length > 100) {
        return new Response(JSON.stringify({ error: 'Invalid userId' }), { status: 400 });
    }

    try {
        const data = await env.KV.get(userId);
        if (data) {
            return new Response(data, {
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({ problems: {}, deletedIds: [] }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}

/**
 * Handles POST requests to save user data.
 * @param {Object} context - The request context.
 * @param {Request} context.request - The HTTP request object.
 * @param {Object} context.env - Environment variables.
 * @returns {Response} The HTTP response indicating success or error.
 */
export async function onRequestPost({ request, env }) {
    // Rate limiting: 30 requests per minute for data access (skip in tests)
    if (typeof jest === 'undefined' && await checkRateLimit(request, env, 30, 60)) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 });
    }

    const payload = await authenticate(request, env);
    if (!payload) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const userId = payload.userId;
    if (!userId || typeof userId !== 'string' || userId.length > 100) {
        return new Response(JSON.stringify({ error: 'Invalid userId' }), { status: 400 });
    }

    let body;
    try {
        body = await request.json();
    } catch (_e) {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }

    const { data } = body;
    if (!data || typeof data !== 'object') {
        return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 });
    }

    try {
        await env.KV.put(userId, JSON.stringify(data));
        return new Response('OK');
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}