/// <reference types="@cloudflare/workers-types" />
/**
 * Shared Cloudflare Workers type definitions.
 * Centralized to avoid duplication across API function files.
 *
 * NOTE: Uses official @cloudflare/workers-types KVNamespace instead of a
 * hand-rolled shim. The global KVNamespace type is provided by the
 * triple-slash reference above.
 */

export type { KVNamespace };

/**
 * Sliding-window rate limiter that does not use Workers KV.
 *
 * State lives in a per-isolate in-memory map and, when available, the Cache
 * API (`caches.default`) so sibling isolates can share a best-effort view.
 * This is not atomic and is only a guard against abuse, not a hard quota.
 *
 * Each caller must pass a distinct `bucket` name so that the limits of
 * different endpoints do not share (and exhaust) each other's budgets.
 *
 * Storage failures always fail open, including on auth endpoints: a Cache API
 * miss must not lock users out of login.
 *
 * @param request - The HTTP request to check
 * @param _env - Retained for call-site compatibility; KV is not used
 * @param maxRequests - Maximum allowed requests in the time window (default: 10)
 * @param windowSeconds - Time window duration in seconds (default: 60)
 * @param bucket - Logical bucket name, keyed per endpoint/action (default: 'api')
 * @param _failClosed - Ignored; cache/memory errors always fail open
 * @returns True if request should be rate limited (blocked)
 */
const rateLimitWindows = new Map<string, number[]>();

/** Test-only: clear in-memory limiter state between cases. */
export function resetRateLimitStateForTests(): void {
    rateLimitWindows.clear();
}

function rateLimitCacheUrl(key: string): string {
    return `https://smartgrind-ratelimit.invalid/${encodeURIComponent(key)}`;
}

function getRateLimitCache(): Cache | null {
    try {
        const cachesObj = (globalThis as { caches?: { default?: Cache } }).caches;
        return cachesObj?.default ?? null;
    } catch {
        return null;
    }
}

function parseTimestamps(value: unknown): number[] {
    if (!Array.isArray(value)) return [];
    return value.filter((t): t is number => typeof t === 'number' && Number.isFinite(t));
}

async function readRateLimitCache(key: string): Promise<number[]> {
    const cache = getRateLimitCache();
    if (!cache) return [];
    const response = await cache.match(rateLimitCacheUrl(key));
    if (!response) return [];
    return parseTimestamps(await response.json());
}

async function writeRateLimitCache(
    key: string,
    timestamps: number[],
    windowSeconds: number
): Promise<void> {
    const cache = getRateLimitCache();
    if (!cache) return;
    const ttl = Math.max(1, windowSeconds);
    await cache.put(
        rateLimitCacheUrl(key),
        new Response(JSON.stringify(timestamps), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': `max-age=${ttl}`,
            },
        })
    );
}

export async function checkRateLimit(
    request: Request,
    _env?: { KV?: KVNamespace },
    maxRequests: number = 10,
    windowSeconds: number = 60,
    bucket: string = 'api',
    _failClosed: boolean = false
): Promise<boolean> {
    try {
        // Use only CF-Connecting-IP since we're behind Cloudflare.
        // X-Forwarded-For is intentionally excluded as it can be spoofed.
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        const key = `ratelimit_${bucket}_${clientIP}`;

        const now = Date.now();
        const windowStart = now - windowSeconds * 1000;
        // Keep duplicate timestamps: many requests can share the same millisecond.
        const fromMemory = (rateLimitWindows.get(key) || []).filter((t) => t > windowStart);
        let cached: number[] = [];
        try {
            cached = (await readRateLimitCache(key)).filter((t) => t > windowStart);
        } catch (error) {
            // Cache is optional; in-memory still enforces the cap in this isolate.
            console.error('Rate limit cache read error:', error);
        }
        // Memory is the source of truth for this isolate. Warm from cache only
        // when this isolate has not seen the key yet, so we do not double-count.
        const validRequests = fromMemory.length > 0 ? fromMemory : cached;

        if (validRequests.length >= maxRequests) {
            rateLimitWindows.set(key, validRequests);
            return true; // Rate limited
        }

        validRequests.push(now);
        rateLimitWindows.set(key, validRequests);
        try {
            await writeRateLimitCache(key, validRequests, windowSeconds);
        } catch (error) {
            console.error('Rate limit cache write error:', error);
        }
        return false; // Not rate limited
    } catch (error) {
        console.error('Rate limit check error:', error);
        return false;
    }
}
