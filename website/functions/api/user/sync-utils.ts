import { jwtVerify } from 'jose';

import { KVNamespace, checkRateLimit } from '../cloudflare-types';
import { LIMITS } from '../../../src/config/limits';
import {
    isIsoDateString,
    isReservedObjectKey,
    isSafeHttpUrl,
    isSafeProblemId,
} from '../../../src/utils/data-rules';

/**
 * Shared helpers for the user-data API routes (functions/api/user/**).
 * Used by user.ts and the incremental sync endpoints (progress, progress/batch,
 * custom-problems) so that authentication, CORS, CSRF and storage handling
 * stay consistent across all of them.
 */

export { checkRateLimit };

/**
 * Environment interface with CORS configuration
 */
export interface Env {
    NODE_ENV?: string;
    JWT_SECRET: string;
    KV: KVNamespace;
    ALLOWED_ORIGINS?: string;
}

/**
 * Default allowed origins for production
 */
export const DEFAULT_ALLOWED_ORIGINS = ['https://algovyn.com', 'https://www.algovyn.com'];

/** Maximum request body size accepted by POST endpoints (5 MB) */
export const MAX_BODY_SIZE = 5 * 1024 * 1024;

/** Shape of the user data blob stored in KV (one key per userId) */
export interface StoredUserData {
    problems: Record<string, Record<string, unknown>>;
    deletedIds: string[];
    flashCardProgress: Record<string, Record<string, unknown>>;
}

/** Thrown when a stored user blob exists but cannot be decompressed or parsed. */
export class CorruptUserDataError extends Error {
    constructor(message = 'Stored user data is corrupt') {
        super(message);
        this.name = 'CorruptUserDataError';
    }
}

export interface ReadUserDataResult extends StoredUserData {
    generation: number;
}

/** Upper bound for stored deletedIds so incremental deletes cannot grow it unbounded */
const MAX_DELETED_IDS = LIMITS.STORAGE.MAX_DELETED_IDS;

const MAX_PROBLEM_ID_LENGTH = LIMITS.VALIDATION.MAX_PROBLEM_ID_LENGTH;
const MAX_INPUT_LENGTH = LIMITS.STATE.MAX_INPUT_LENGTH;
const MAX_URL_LENGTH = LIMITS.STATE.MAX_URL_LENGTH;

const USER_ID_REGEX = /^[a-zA-Z0-9_-]{1,100}$/;

/** Rate limit bucket names — each endpoint gets its own budget */
export const RATE_LIMIT_BUCKETS = {
    USER_DATA_GET: 'user_data_get',
    USER_DATA_SAVE: 'user_data_save',
    USER_CSRF: 'user_csrf',
    USER_SYNC: 'user_sync',
} as const;

export interface SyncRequestContext {
    request: Request;
    env: Env;
}

/**
 * Shared scaffolding for the incremental sync POST endpoints
 * (/api/user/progress, /api/user/progress/batch, /api/user/custom-problems):
 * rate limiting, JWT auth, body parsing/size check, CSRF validation, then
 * read-modify-write of the stored user data via the `apply` callback.
 * @param apply - Mutates the user data and returns the number of applied ops;
 * throw to reject the request with 400.
 */
export async function handleSyncPost(
    request: Request,
    env: Env,
    apply: (_data: StoredUserData, _body: Record<string, unknown>) => number
): Promise<Response> {
    // Rate limiting: 60 sync writes per minute, in a bucket separate from the
    // full-blob save endpoint (skip in tests)
    if (
        env.NODE_ENV !== 'test' &&
        (await checkRateLimit(request, env, 60, 60, RATE_LIMIT_BUCKETS.USER_SYNC))
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

    // Body is read after authentication and size-checked on the actual bytes
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

    const csrfValid = await validateCsrfToken(
        request,
        env,
        payload.userId,
        typeof parsed.body['_csrf'] === 'string' ? (parsed.body['_csrf'] as string) : undefined
    );
    if (!csrfValid) {
        return createCorsResponse(
            JSON.stringify({ error: 'Invalid CSRF token' }),
            { status: 403 },
            request,
            env
        );
    }

    try {
        const data = await readUserData(env, payload.userId);
        let applied = 0;
        try {
            applied = apply(data, parsed.body);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Invalid operation';
            return createCorsResponse(
                JSON.stringify({ error: message }),
                { status: 400 },
                request,
                env
            );
        }

        const nextGeneration = await writeUserData(env, payload.userId, data, {
            currentGeneration: data.generation,
        });
        return createCorsResponse(
            JSON.stringify({ applied, conflicts: [], generation: nextGeneration }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Data-Generation': String(nextGeneration),
                },
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
 * Validates the JWT-derived userId before it is used as a KV key.
 * @returns True if the userId is a safe string
 */
export function isValidUserId(userId: unknown): boolean {
    return typeof userId === 'string' && USER_ID_REGEX.test(userId);
}

/**
 * Validates if an origin is in the allowed list
 * @param origin - The origin to validate
 * @param allowedOriginsEnv - Comma-separated list of allowed origins from env
 * @returns True if origin is allowed
 */
export function isValidOrigin(origin: string | null, allowedOriginsEnv?: string): boolean {
    if (!origin) return false;

    // Parse allowed origins from env or use defaults
    const allowedOrigins = allowedOriginsEnv
        ? allowedOriginsEnv
              .split(',')
              .map((o) => o.trim())
              .filter(Boolean)
        : DEFAULT_ALLOWED_ORIGINS;

    try {
        const originUrl = new URL(origin);

        // Exact origin match only — a compromised or untrusted subdomain
        // (e.g. https://app.algovyn.com) must not inherit API credentials.
        return allowedOrigins.some((allowed) => {
            try {
                return originUrl.origin === new URL(allowed).origin;
            } catch {
                return false;
            }
        });
    } catch {
        // Invalid URL format
        return false;
    }
}

/**
 * True if the origin is the dev localhost (only allowed when NODE_ENV=development)
 */
function isAllowedLocalhost(origin: string, env?: Env): boolean {
    return (
        env?.NODE_ENV === 'development' &&
        (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))
    );
}

/**
 * Resolves the Access-Control-Allow-Origin value for a request origin.
 * Only allowlisted origins (or localhost in development) are reflected;
 * otherwise the first default origin is used so that attacker-controlled
 * origins are never reflected back with credentials enabled.
 */
export function resolveAllowedOrigin(origin: string | null, env?: Env): string {
    if (
        origin &&
        (isValidOrigin(origin, env?.ALLOWED_ORIGINS) || isAllowedLocalhost(origin, env))
    ) {
        return origin;
    }
    return DEFAULT_ALLOWED_ORIGINS[0]!;
}

/**
 * Creates a Response with CORS headers to allow credentials.
 * SECURITY: The origin is only reflected when it passes the allowlist (this
 * includes preflight/OPTIONS responses — a preflight never carries credentials,
 * but reflecting an arbitrary origin here invites mistakes in future endpoints).
 * @param body - Response body
 * @param init - Response init options
 * @param request - The request to get the origin from
 * @param env - Environment with ALLOWED_ORIGINS for validation
 * @returns Response with CORS headers
 */
export function createCorsResponse(
    body: BodyInit | null,
    init: ResponseInit | undefined,
    request: Request | undefined,
    env: Env | undefined
): Response {
    // Build headers object from init.headers
    const headersObj: Record<string, string> = {};

    // Copy existing headers from init if provided. Plain objects keep their
    // original names so test Response mocks (Map-based, case-sensitive) and
    // browsers both see X-Data-Generation.
    if (init?.headers) {
        if (init.headers instanceof Headers) {
            init.headers.forEach((value, key) => {
                headersObj[key] = value;
            });
        } else if (Array.isArray(init.headers)) {
            for (const entry of init.headers) {
                const [key, value] = entry as [string, string];
                headersObj[key] = value;
            }
        } else {
            Object.assign(headersObj, init.headers);
        }
    }

    const origin = request?.headers.get('Origin');
    const corsOrigin = resolveAllowedOrigin(origin, env);

    headersObj['Access-Control-Allow-Origin'] = corsOrigin;
    headersObj['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    headersObj['Access-Control-Allow-Headers'] = 'Content-Type, X-CSRF-Token, Authorization';
    headersObj['Vary'] = 'Origin';

    // Only allow credentials for specific origins (never with a reflected wildcard)
    if (corsOrigin !== '*') {
        headersObj['Access-Control-Allow-Credentials'] = 'true';
    }

    // Create response without headers in init to avoid conflicts
    const { headers: _ignored, ...restInit } = init || {};
    return new Response(body, {
        ...restInit,
        headers: headersObj,
    });
}

/**
 * Verifies a JWT token using the HS256 algorithm.
 * @returns Decoded JWT payload if valid, null if invalid/expired
 */
export async function verifyJWT(token: string, secret: string) {
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
 * @returns Decoded payload with userId/displayName, or null if unauthenticated
 */
export async function authenticate(request: Request, env: Env) {
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
 * Supports two transmission methods:
 * 1. X-CSRF-Token header (preferred, used by fetch requests)
 * 2. _csrf field in request body (fallback, used by sendBeacon/keepalive)
 *
 * Each mint writes its own `csrf_<userId>_<token>` key with a TTL, so tokens
 * are multi-use and independent: concurrent tabs, devices and network retries
 * cannot invalidate each other. A single shared key would overwrite (and thus
 * invalidate) every previously issued token.
 *
 * @returns True if the provided token is a live token for this user
 */
export async function validateCsrfToken(
    request: Request,
    env: { KV: KVNamespace },
    userId: string,
    bodyCsrf?: string
): Promise<boolean> {
    // SECURITY: Header takes priority; body field is fallback for sendBeacon/keepalive
    const providedCsrf = request.headers.get('X-CSRF-Token') || bodyCsrf;
    if (!providedCsrf || providedCsrf.length > 128) {
        return false;
    }

    const storedCsrf = await env.KV.get(`csrf_${userId}_${providedCsrf}`);
    // Any non-empty value means the token key exists (we write 'valid')
    return !!storedCsrf;
}

/**
 * Reads the request body once as text and parses it as JSON, enforcing the
 * size limit on the actual bytes received (Content-Length is client-controlled
 * and bypassable with chunked encoding).
 * @returns Parsed object, or an error kind describing the failure
 */
export async function readJsonBody(
    request: Request
): Promise<
    | { ok: true; body: Record<string, unknown> }
    | { ok: false; error: 'too-large' | 'invalid-json' | 'not-object' }
> {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_SIZE) {
        return { ok: false, error: 'too-large' };
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch (_e) {
        return { ok: false, error: 'invalid-json' };
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { ok: false, error: 'not-object' };
    }
    return { ok: true, body: parsed as Record<string, unknown> };
}

/**
 * Compresses string data using Brotli, falling back to deflate-raw when the
 * runtime has no Brotli support.
 * @returns The compressed bytes together with the encoding actually used, so
 * the caller can record it in KV metadata ('identity' means uncompressed)
 */
export async function compressData(data: string): Promise<{ data: ArrayBuffer; encoding: string }> {
    try {
        const encoder = new TextEncoder();
        const input = encoder.encode(data);

        let encoding = 'br';
        let compressionStream;
        try {
            compressionStream = new CompressionStream('br' as any);
        } catch (_e) {
            compressionStream = new CompressionStream('deflate-raw');
            encoding = 'deflate-raw';
        }

        const writer = compressionStream.writable.getWriter();
        writer.write(input);
        writer.close();

        const compressed = await new Response(compressionStream.readable).arrayBuffer();
        return { data: compressed, encoding };
    } catch (error) {
        console.error('Compression error:', error);
        return { data: new TextEncoder().encode(data).buffer as ArrayBuffer, encoding: 'identity' };
    }
}

/**
 * Inflates an ArrayBuffer with the given DecompressionStream encoding.
 */
async function inflate(buffer: ArrayBuffer, encoding: string): Promise<string> {
    const decompressionStream = new DecompressionStream(encoding as any);
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
}

const SUPPORTED_ENCODINGS = new Set(['br', 'gzip', 'deflate-raw', 'deflate']);

/**
 * Decompresses data read from KV storage.
 * The encoding is taken from the KV metadata written at PUT time (symmetric
 * with compressData); legacy values written as strings with a '\x00gz\x00'
 * marker are treated as base64-encoded gzip.
 *
 * Legacy blobs were always tagged `Content-Encoding: 'br'` even though the
 * Workers runtime has no Brotli CompressionStream, so the bytes were actually
 * deflate-raw. If the recorded encoding fails we therefore try the other
 * supported encodings (deflate-raw first) before giving up and treating the
 * value as plain text. Without this fallback those blobs decode to garbage and
 * `readUserData` silently returns an empty dataset.
 * @param data - The stored value (binary) or legacy string
 * @param contentEncoding - The 'Content-Encoding' value from KV metadata
 */
export async function decompressData(
    data: ArrayBuffer | string,
    contentEncoding: string | null
): Promise<string> {
    // Legacy string format with an explicit compression marker (base64 gzip)
    if (typeof data === 'string') {
        if (data.startsWith('\x00gz\x00')) {
            const base64 = data.slice(4);
            const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer;
            return inflate(buffer, 'gzip');
        }
        return data;
    }

    // No encoding recorded: the value was stored uncompressed
    if (!contentEncoding) {
        return new TextDecoder().decode(data);
    }

    const candidates = [contentEncoding, 'deflate-raw', 'br', 'gzip', 'deflate'];
    const attempted = new Set<string>();
    let lastError: unknown = null;

    for (const encoding of candidates) {
        if (attempted.has(encoding) || !SUPPORTED_ENCODINGS.has(encoding)) continue;
        attempted.add(encoding);
        try {
            return await inflate(data, encoding);
        } catch (error) {
            lastError = error;
        }
    }

    console.error(
        `Decompression failed for all encodings (recorded: ${contentEncoding}):`,
        lastError
    );
    return new TextDecoder().decode(data);
}

export function defaultUserData(): StoredUserData {
    return {
        problems: Object.create(null) as StoredUserData['problems'],
        deletedIds: [],
        flashCardProgress: Object.create(null) as StoredUserData['flashCardProgress'],
    };
}

export function parseGeneration(metadata: unknown): number {
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
        return 0;
    }
    const raw = (metadata as Record<string, unknown>)['generation'];
    const n = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

/**
 * Reads and decompresses the user data blob from KV.
 * A missing key returns an empty dataset. A present but unreadable blob
 * throws CorruptUserDataError so callers can avoid overwriting progress.
 */
export async function readUserData(env: Env, userId: string): Promise<ReadUserDataResult> {
    const { value: data, metadata } = await env.KV.getWithMetadata(userId, {
        type: 'arrayBuffer',
    });
    const generation = parseGeneration(metadata);
    if (!data) {
        return { ...defaultUserData(), generation };
    }

    const contentEncoding =
        metadata && typeof metadata === 'object' && !Array.isArray(metadata)
            ? String((metadata as Record<string, unknown>)['Content-Encoding'] ?? '')
            : '';

    try {
        const decompressed = await decompressData(data, contentEncoding || null);
        const parsed = JSON.parse(decompressed) as unknown;
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            throw new CorruptUserDataError('Stored user data is not an object');
        }
        return { ...normalizeUserData(parsed, false), generation };
    } catch (error) {
        if (error instanceof CorruptUserDataError) {
            throw error;
        }
        console.error('Failed to parse stored user data:', error);
        throw new CorruptUserDataError(
            error instanceof Error ? error.message : 'Failed to read stored user data'
        );
    }
}

/**
 * Normalizes an arbitrary parsed value into the stored blob shape.
 */
function sanitizeNote(value: unknown): string | undefined {
    if (typeof value !== 'string') return undefined;
    return value.slice(0, MAX_INPUT_LENGTH);
}

function sanitizeProblemRecord(
    id: string,
    raw: unknown,
    strict: boolean
): Record<string, unknown> | null {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return null;
    }
    const src = raw as Record<string, unknown>;
    if (!strict) {
        const copy: Record<string, unknown> = Object.create(null);
        for (const [key, value] of Object.entries(src)) {
            if (isReservedObjectKey(key)) continue;
            copy[key] = value;
        }
        return copy;
    }

    const out: Record<string, unknown> = Object.create(null);
    out['id'] = id;
    if (typeof src['name'] === 'string') {
        out['name'] = src['name'].slice(0, MAX_INPUT_LENGTH);
    }
    if (typeof src['url'] === 'string') {
        const url = src['url'].trim().slice(0, MAX_URL_LENGTH);
        out['url'] = isSafeHttpUrl(url, MAX_URL_LENGTH) ? url : '';
    }
    if (src['status'] === 'solved' || src['status'] === 'unsolved') {
        out['status'] = src['status'];
    }
    if (typeof src['topic'] === 'string') {
        out['topic'] = src['topic'].slice(0, MAX_INPUT_LENGTH);
    }
    if (typeof src['pattern'] === 'string') {
        out['pattern'] = src['pattern'].slice(0, MAX_INPUT_LENGTH);
    }
    if (typeof src['reviewInterval'] === 'number' && Number.isFinite(src['reviewInterval'])) {
        out['reviewInterval'] = Math.max(0, Math.floor(src['reviewInterval']));
    }
    if (src['nextReviewDate'] === null) {
        out['nextReviewDate'] = null;
    } else if (
        typeof src['nextReviewDate'] === 'string' &&
        isIsoDateString(src['nextReviewDate'])
    ) {
        out['nextReviewDate'] = src['nextReviewDate'];
    }
    const note = sanitizeNote(src['note']);
    if (note !== undefined) {
        out['note'] = note;
    }
    return out;
}

function sanitizeFlashCardProgress(raw: unknown): Record<string, Record<string, unknown>> {
    const out: Record<string, Record<string, unknown>> = Object.create(null);
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return out;
    }
    for (const [cardId, value] of Object.entries(raw as Record<string, unknown>)) {
        if (!isSafeProblemId(cardId, MAX_PROBLEM_ID_LENGTH)) continue;
        if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
        const src = value as Record<string, unknown>;
        const record: Record<string, unknown> = Object.create(null);
        record['cardId'] = cardId;
        if (typeof src['reviewInterval'] === 'number' && Number.isFinite(src['reviewInterval'])) {
            record['reviewInterval'] = Math.max(0, Math.min(5, Math.floor(src['reviewInterval'])));
        }
        if (
            src['nextReviewDate'] === null ||
            (typeof src['nextReviewDate'] === 'string' && isIsoDateString(src['nextReviewDate']))
        ) {
            record['nextReviewDate'] = src['nextReviewDate'];
        }
        if (
            src['lastReviewedAt'] === null ||
            (typeof src['lastReviewedAt'] === 'string' && isIsoDateString(src['lastReviewedAt']))
        ) {
            record['lastReviewedAt'] = src['lastReviewedAt'];
        }
        if (typeof src['timesReviewed'] === 'number' && Number.isFinite(src['timesReviewed'])) {
            record['timesReviewed'] = Math.max(0, Math.floor(src['timesReviewed']));
        }
        if (typeof src['timesCorrect'] === 'number' && Number.isFinite(src['timesCorrect'])) {
            record['timesCorrect'] = Math.max(0, Math.floor(src['timesCorrect']));
        }
        out[cardId] = record;
    }
    return out;
}

/**
 * Normalizes an arbitrary parsed value into the stored blob shape.
 * Reserved object keys are dropped so a crafted payload cannot pollute
 * Object.prototype. When `strict` is true (writes), only allowlisted fields
 * with validated types are kept.
 */
export function normalizeUserData(data: unknown, strict = true): StoredUserData {
    const obj =
        data && typeof data === 'object' && !Array.isArray(data)
            ? (data as Partial<StoredUserData>)
            : {};
    const problems: StoredUserData['problems'] = Object.create(null);
    const rawProblems =
        obj.problems && typeof obj.problems === 'object' && !Array.isArray(obj.problems)
            ? obj.problems
            : {};
    for (const [id, record] of Object.entries(rawProblems)) {
        if (!isSafeProblemId(id, MAX_PROBLEM_ID_LENGTH)) continue;
        const sanitized = sanitizeProblemRecord(id, record, strict);
        if (sanitized) {
            problems[id] = sanitized;
        }
    }

    const deletedIds = Array.isArray(obj.deletedIds)
        ? obj.deletedIds.filter((id): id is string => isSafeProblemId(id, MAX_PROBLEM_ID_LENGTH))
        : [];

    return {
        problems,
        deletedIds: deletedIds.slice(-MAX_DELETED_IDS),
        flashCardProgress: sanitizeFlashCardProgress(obj.flashCardProgress),
    };
}

/**
 * Compresses (when it helps) and writes the user data blob to KV. The
 * `Content-Encoding` metadata keeps the legacy `'br'` tag for deflate-raw
 * payloads so older readers (and rollbacks) can still decode them; the
 * current reader supports both the literal and legacy tags.
 */
export async function writeUserData(
    env: Env,
    userId: string,
    data: unknown,
    options?: { currentGeneration?: number }
): Promise<number> {
    const jsonData = JSON.stringify(normalizeUserData(data, true));
    const jsonBytes = new TextEncoder().encode(jsonData).byteLength;

    let storedValue: ArrayBuffer | string = jsonData;
    const nextGeneration = (options?.currentGeneration ?? 0) + 1;
    const metadata: Record<string, string> = {
        'Content-Type': 'application/json',
        generation: String(nextGeneration),
    };

    try {
        const compressed = await compressData(jsonData);
        // An empty compression output for non-empty input is never valid —
        // treat it as a compression failure and store uncompressed.
        if (
            compressed.encoding !== 'identity' &&
            (compressed.data.byteLength > 0 || jsonBytes === 0) &&
            compressed.data.byteLength < jsonBytes
        ) {
            storedValue = compressed.data;
            // Keep the legacy 'br' tag for deflate-raw payloads. Previous
            // releases only attempt decompression when the metadata contains
            // 'br', and their decoder then falls back to deflate-raw; this
            // keeps a rollback able to read blobs written by this release.
            // The current reader tries the recorded encoding and then falls
            // back to the others, so both tags decode correctly.
            metadata['Content-Encoding'] =
                compressed.encoding === 'deflate-raw' ? 'br' : compressed.encoding;
        }
    } catch (error) {
        console.error('Compression failed, storing uncompressed:', error);
    }

    await env.KV.put(userId, storedValue, { metadata });
    return nextGeneration;
}

/**
 * Applies a single progress operation (from /api/user/progress or the batch
 * endpoint) to the stored user data. Unknown problems get a minimal record
 * seeded with the operation fields; known problems are merged field-by-field
 * (last write wins). Only the known progress fields are copied.
 * @returns True if the operation was applied
 */
export function applyProgressOperation(
    data: StoredUserData,
    op: { problemId?: unknown; operation?: unknown }
): boolean {
    const problemId = typeof op?.problemId === 'string' ? op.problemId : '';
    if (!isSafeProblemId(problemId, MAX_PROBLEM_ID_LENGTH)) {
        return false;
    }

    const fields =
        op.operation && typeof op.operation === 'object'
            ? (op.operation as Record<string, unknown>)
            : (op as Record<string, unknown>);

    let record = Object.prototype.hasOwnProperty.call(data.problems, problemId)
        ? data.problems[problemId]
        : undefined;
    if (!record || typeof record !== 'object') {
        record = Object.assign(Object.create(null), { id: problemId });
        data.problems[problemId] = record;
    }

    if (fields['status'] === 'solved' || fields['status'] === 'unsolved') {
        record['status'] = fields['status'];
    }
    if (fields['nextReviewDate'] === null) {
        record['nextReviewDate'] = null;
    } else if (
        typeof fields['nextReviewDate'] === 'string' &&
        isIsoDateString(fields['nextReviewDate'])
    ) {
        record['nextReviewDate'] = fields['nextReviewDate'];
    }
    if (typeof fields['reviewInterval'] === 'number' && Number.isFinite(fields['reviewInterval'])) {
        record['reviewInterval'] = Math.max(0, Math.floor(fields['reviewInterval']));
    }
    const note = sanitizeNote(fields['note']);
    if (note !== undefined) {
        record['note'] = note;
    }
    return true;
}

/**
 * Applies a custom-problem upsert (full problem object sent by the client).
 * @returns True if the problem was applied
 */
export function applyCustomProblemUpsert(data: StoredUserData, problem: unknown): boolean {
    if (!problem || typeof problem !== 'object' || Array.isArray(problem)) {
        return false;
    }
    const record = problem as Record<string, unknown>;
    const id = record['id'];
    if (!isSafeProblemId(id, MAX_PROBLEM_ID_LENGTH)) {
        return false;
    }
    const sanitized = sanitizeProblemRecord(id, record, true);
    if (!sanitized) {
        return false;
    }
    data.problems[id] = sanitized;
    return true;
}

/**
 * Applies a problem deletion: removes the record and records the id in
 * deletedIds so the problem stays hidden on other devices.
 * @returns True if the deletion was applied
 */
export function applyProblemDeletion(data: StoredUserData, problemId: unknown): boolean {
    if (!isSafeProblemId(problemId, MAX_PROBLEM_ID_LENGTH)) {
        return false;
    }
    delete data.problems[problemId];
    if (!data.deletedIds.includes(problemId)) {
        if (data.deletedIds.length >= MAX_DELETED_IDS) {
            data.deletedIds.shift();
        }
        data.deletedIds.push(problemId);
    }
    return true;
}

export async function peekUserGeneration(
    env: Env,
    userId: string
): Promise<{ exists: boolean; generation: number }> {
    const { value, metadata } = await env.KV.getWithMetadata(userId, {
        type: 'arrayBuffer',
    });
    return { exists: !!value, generation: parseGeneration(metadata) };
}
