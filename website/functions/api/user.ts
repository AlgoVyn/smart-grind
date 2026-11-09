import {
    authenticate,
    checkRateLimit,
    CorruptUserDataError,
    createCorsResponse,
    isValidUserId,
    peekUserGeneration,
    RATE_LIMIT_BUCKETS,
    readJsonBody,
    readUserData,
    validateCsrfToken,
    writeUserData,
    type Env,
} from './user/sync-utils';

/**
 * User data API: GET returns the user's data blob (or mints a CSRF token),
 * POST replaces it. Incremental updates live in ./progress.ts,
 * ./progress/batch.ts and ./custom-problems.ts, which share the helpers in
 * ./sync-utils.ts.
 */

/**
 * Handles GET requests for user data retrieval or CSRF token generation.
 * Supports two actions: 'csrf' (generate new token) or default (fetch user data).
 * User data is automatically decompressed if stored with compression.
 * Implements rate limiting and CORS for cross-origin requests.
 * @param context - Cloudflare Pages Function context
 * @param context.request - The incoming HTTP request
 * @param context.env - Environment bindings (JWT_SECRET, KV, ALLOWED_ORIGINS)
 * @returns JSON response with user data or CSRF token, or error response
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
export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
    // Handle CORS preflight requests (in production these are routed to
    // onRequestOptions; this branch keeps direct OPTIONS calls working)
    if (request.method === 'OPTIONS') {
        return createCorsResponse(null, { status: 204 }, request, env);
    }

    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    // Rate limiting: CSRF minting happens before every save (60/min); data
    // reads have their own 30/min budget (skip in tests)
    if (env.NODE_ENV !== 'test') {
        const limited =
            action === 'csrf'
                ? await checkRateLimit(request, env, 60, 60, RATE_LIMIT_BUCKETS.USER_CSRF)
                : await checkRateLimit(request, env, 30, 60, RATE_LIMIT_BUCKETS.USER_DATA_GET);
        if (limited) {
            return createCorsResponse(
                JSON.stringify({ error: 'Rate limit exceeded' }),
                { status: 429 },
                request,
                env
            );
        }
    }

    // Handle CSRF token generation
    if (action === 'csrf') {
        const payload = await authenticate(request, env);
        if (!payload) {
            return createCorsResponse(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401 },
                request,
                env
            );
        }

        if (!isValidUserId(payload.userId)) {
            return createCorsResponse(
                JSON.stringify({ error: 'Invalid userId' }),
                { status: 400 },
                request,
                env
            );
        }

        const csrfToken = crypto.randomUUID();
        // One KV key per token: tokens are multi-use and independent, so
        // concurrent tabs, devices and network retries cannot invalidate each
        // other by overwriting a shared per-user key.
        await env.KV.put(`csrf_${payload.userId}_${csrfToken}`, 'valid', {
            expirationTtl: 3600,
        });
        return createCorsResponse(
            JSON.stringify({ csrfToken }),
            {
                headers: { 'Content-Type': 'application/json' },
            },
            request,
            env
        );
    }

    // Handle user data retrieval
    const payload = await authenticate(request, env);
    if (!payload) {
        return createCorsResponse(
            JSON.stringify({ error: 'Unauthorized' }),
            { status: 401 },
            request,
            env
        );
    }

    if (!isValidUserId(payload.userId)) {
        return createCorsResponse(
            JSON.stringify({ error: 'Invalid userId' }),
            { status: 400 },
            request,
            env
        );
    }

    try {
        // No edge cacheTtl here: reads must reflect the just-written state
        // (KV edge caching with a TTL served stale data after a successful POST)
        const data = await readUserData(env, payload.userId);
        return createCorsResponse(
            JSON.stringify({
                problems: data.problems,
                deletedIds: data.deletedIds,
                flashCardProgress: data.flashCardProgress,
                generation: data.generation,
            }),
            {
                headers: { 'Content-Type': 'application/json' },
            },
            request,
            env
        );
    } catch (e: unknown) {
        if (e instanceof CorruptUserDataError) {
            return createCorsResponse(
                JSON.stringify({ error: 'corrupt_blob', recoverable: true }),
                { status: 500 },
                request,
                env
            );
        }
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        return createCorsResponse(
            JSON.stringify({ error: errorMessage }),
            { status: 500 },
            request,
            env
        );
    }
}

/**
 * Handles POST requests to save user data with compression and CSRF protection.
 * Validates JWT authentication and CSRF token before processing.
 * Automatically compresses data if it reduces size, stores with appropriate metadata.
 * Implements rate limiting to prevent abuse.
 * @param context - Cloudflare Pages Function context
 * @param context.request - The incoming HTTP request with JSON body
 * @param context.env - Environment bindings (JWT_SECRET, KV, ALLOWED_ORIGINS)
 * @returns Success response or error with appropriate status code
 * @example
 * POST /api/user
 * Authorization: Bearer <jwt>
 * X-CSRF-Token: <token>
 * Content-Type: application/json
 *
 * Body: { data: { problems: {...}, deletedIds: [...] } }
 * // Returns: "OK" on success, or { error: "..." } on failure
 */
export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
        return createCorsResponse(null, { status: 204 }, request, env);
    }

    // Rate limiting: 30 saves per minute (skip in tests)
    if (
        env.NODE_ENV !== 'test' &&
        (await checkRateLimit(request, env, 30, 60, RATE_LIMIT_BUCKETS.USER_DATA_SAVE))
    ) {
        return createCorsResponse(
            JSON.stringify({ error: 'Rate limit exceeded' }),
            { status: 429 },
            request,
            env
        );
    }

    const payload = await authenticate(request, env);
    if (!payload) {
        return createCorsResponse(
            JSON.stringify({ error: 'Unauthorized' }),
            { status: 401 },
            request,
            env
        );
    }

    if (!isValidUserId(payload.userId)) {
        return createCorsResponse(
            JSON.stringify({ error: 'Invalid userId' }),
            { status: 400 },
            request,
            env
        );
    }

    // Read the body only after authentication (so unauthenticated callers
    // cannot force buffered allocations). The body is size-checked against the
    // actual bytes received — Content-Length is client-controlled.
    const parsed = await readJsonBody(request);
    if (!parsed.ok) {
        const status = parsed.error === 'too-large' ? 413 : 400;
        const message =
            parsed.error === 'too-large'
                ? 'Payload too large'
                : parsed.error === 'invalid-json'
                  ? 'Invalid JSON'
                  : 'Invalid data';
        return createCorsResponse(JSON.stringify({ error: message }), { status }, request, env);
    }
    const body = parsed.body;

    // Validate CSRF token from header (preferred) or body (fallback for sendBeacon)
    const csrfValid = await validateCsrfToken(
        request,
        env,
        payload.userId,
        typeof body['_csrf'] === 'string' ? (body['_csrf'] as string) : undefined
    );
    if (!csrfValid) {
        return createCorsResponse(
            JSON.stringify({ error: 'Invalid CSRF token' }),
            { status: 403 },
            request,
            env
        );
    }

    const data = body['data'];
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return createCorsResponse(
            JSON.stringify({ error: 'Invalid data' }),
            { status: 400 },
            request,
            env
        );
    }

    const clientGeneration = body['generation'];

    let currentGeneration = 0;
    let existingReadable = true;
    try {
        const existing = await readUserData(env, payload.userId);
        currentGeneration = existing.generation;
    } catch (e: unknown) {
        if (!(e instanceof CorruptUserDataError)) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            return createCorsResponse(
                JSON.stringify({ error: errorMessage }),
                { status: 500 },
                request,
                env
            );
        }
        // Corrupt blob: allow this full save to repair it. Incremental
        // endpoints still reject so they cannot silently persist garbage.
        existingReadable = false;
        const peek = await peekUserGeneration(env, payload.userId);
        currentGeneration = peek.generation;
    }

    if (
        existingReadable &&
        typeof clientGeneration === 'number' &&
        Number.isFinite(clientGeneration) &&
        currentGeneration > 0 &&
        clientGeneration !== currentGeneration
    ) {
        return createCorsResponse(
            JSON.stringify({
                error: 'generation_conflict',
                generation: currentGeneration,
            }),
            { status: 409 },
            request,
            env
        );
    }

    try {
        const nextGeneration = await writeUserData(env, payload.userId, data, {
            currentGeneration,
        });
        return createCorsResponse(
            'OK',
            { headers: { 'X-Data-Generation': String(nextGeneration) } },
            request,
            env
        );
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        return createCorsResponse(
            JSON.stringify({ error: errorMessage }),
            { status: 500 },
            request,
            env
        );
    }
}

/**
 * Handles CORS preflight requests. Method-scoped GET/POST handlers never see
 * OPTIONS in production, so preflights are answered here.
 */
export async function onRequestOptions({ request, env }: { request: Request; env: Env }) {
    return createCorsResponse(null, { status: 204 }, request, env);
}
