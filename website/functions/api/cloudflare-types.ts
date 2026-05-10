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
 * Sliding window rate limiter for Cloudflare KV.
 * Tracks request timestamps per client IP to prevent brute force attacks.
 * Automatically cleans expired entries and updates KV.
 * 
 * @param request - The HTTP request to check
 * @param env - Environment with KV namespace binding
 * @param maxRequests - Maximum allowed requests in the time window (default: 10)
 * @param windowSeconds - Time window duration in seconds (default: 60)
 * @returns True if request should be rate limited (blocked)
 */
export async function checkRateLimit(
    request: Request,
    env: { KV: KVNamespace },
    maxRequests: number = 10,
    windowSeconds: number = 60
): Promise<boolean> {
    // Use only CF-Connecting-IP since we're behind Cloudflare.
    // X-Forwarded-For is intentionally excluded as it can be spoofed.
    const clientIP =
        request.headers.get('CF-Connecting-IP') ||
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
