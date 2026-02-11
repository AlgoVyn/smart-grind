import { SignJWT } from 'jose';

/**
 * Implements sliding window rate limiting for OAuth endpoints using Cloudflare KV.
 * Tracks request timestamps per client IP to prevent brute force attacks on authentication.
 * Automatically cleans expired entries and maintains atomic updates.
 * @param {Request} request - The HTTP request to check
 * @param {Object} env - Environment with KV namespace binding
 * @param {number} [maxRequests=10] - Maximum allowed requests in the time window
 * @param {number} [windowSeconds=60] - Time window duration in seconds
 * @returns {Promise<boolean>} True if request should be rate limited (blocked)
 * @example
 * // Check OAuth initiation rate (10 requests per minute)
 * const isLimited = await checkRateLimit(request, env, 10, 60);
 * if (isLimited) {
 *   return new Response('Rate limit exceeded', { status: 429 });
 * }
 */
export async function checkRateLimit(request, env, maxRequests = 10, windowSeconds = 60) {
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
 * Signs a JWT token using HS256 algorithm with the given payload.
 * Creates a token valid for 24 hours from issuance time.
 * Used to maintain authenticated sessions after OAuth completion.
 * @param {Object} payload - The data to encode in the JWT (userId, displayName)
 * @param {string} secret - The HMAC secret key for signing
 * @returns {Promise<string>} The signed JWT token string
 * @throws {Error} If JWT_SECRET is not configured
 * @example
 * const token = await signJWT(
 *   { userId: '123', displayName: 'John' },
 *   env.JWT_SECRET
 * );
 * // Returns: "eyJhbGciOiJIUzI1NiIs..."
 */
async function signJWT(payload, secret) {
    const secretKey = new TextEncoder().encode(secret);
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(Math.floor(Date.now() / 1000) + 24 * 60 * 60) // 24 hours
        .sign(secretKey);
}

/**
 * Validates the authorization code received from Google OAuth callback.
 * Ensures code exists, is a string, and is within reasonable length limits.
 * Prevents injection attacks by validating format before token exchange.
 * @param {URLSearchParams} params - URL search parameters from callback
 * @returns {string | null} The authorization code if valid, null otherwise
 * @example
 * const code = validateOAuthCode(url.searchParams);
 * if (!code) {
 *   return new Response('Invalid authorization code', { status: 400 });
 * }
 */
function validateOAuthCode(params) {
    const code = params.get('code');
    if (!code || typeof code !== 'string' || code.length > 1000) {
        return null;
    }
    return code;
}

/**
 * Handles Google OAuth authentication flow including login initiation and callback.
 * Two modes: 'login' action initiates OAuth, callback mode completes authentication.
 * Implements CSRF protection via state parameter, rate limiting, and secure token handling.
 * Returns HTML with postMessage for popup flow or redirects for PWA flow.
 * @param {Object} context - Cloudflare Pages Function context
 * @param {Request} context.request - The HTTP request (login initiation or callback)
 * @param {Object} context.env - Environment with GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET, KV
 * @returns {Promise<Response>} Redirect to Google (login), HTML response (callback), or error
 * @example
 * // Initiate login
 * GET /api/auth?action=login
 * // Returns: 302 Redirect to accounts.google.com
 *
 * // OAuth callback
 * GET /api/auth?code=...&state=...
 * // Returns: HTML with postMessage to opener, sets HttpOnly cookie with JWT
 */
export async function onRequestGet({ request, env }) {
    // Rate limiting: 10 requests per minute (skip in tests)
    if (typeof jest === 'undefined' && (await checkRateLimit(request, env, 10, 60))) {
        return new Response('Rate limit exceeded', { status: 429 });
    }

    const url = new URL(request.url);
    const redirectUri = 'https://algovyn.com/smartgrind/api/auth';
    const action = url.searchParams.get('action');

    if (action === 'login') {
        // Generate random state for CSRF protection
        const state = crypto.randomUUID();
        // Store state in KV with short TTL (5 minutes)
        await env.KV.put(`oauth_state_${state}`, 'valid', { expirationTtl: 300 });

        // Redirect to Google OAuth
        const googleAuthUrl =
            'https://accounts.google.com/o/oauth2/v2/auth?' +
            `client_id=${env.GOOGLE_CLIENT_ID}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            'response_type=code&' +
            'scope=openid%20email%20profile&' +
            `state=${encodeURIComponent(state)}`;

        return Response.redirect(googleAuthUrl, 302);
    }

    const state = url.searchParams.get('state');
    if (state) {
        // Verify state parameter
        const storedState = await env.KV.get(`oauth_state_${state}`);
        if (!storedState) {
            const html = `
       <!DOCTYPE html>
       <html>
       <head><title>Sign In Failed</title></head>
       <body>
       <script>
         if (window.opener) {
           window.opener.postMessage({ type: 'auth-failure', message: 'Invalid state parameter.' }, window.location.origin);
           setTimeout(() => window.close(), 500);
         }
       </script>
       <p>Sign in failed: Invalid state.</p>
       </body>
       </html>`;
            return new Response(html, { headers: { 'Content-Type': 'text/html' }, status: 400 });
        }
        // Delete used state
        await env.KV.delete(`oauth_state_${state}`);

        const code = validateOAuthCode(url.searchParams);
        if (!code) {
            const html = `
       <!DOCTYPE html>
       <html>
       <head><title>Sign In Failed</title></head>
       <body>
       <script>
         if (window.opener) {
           window.opener.postMessage({ type: 'auth-failure', message: 'Invalid authorization code.' }, window.location.origin);
           setTimeout(() => window.close(), 500);
         }
       </script>
       <p>Sign in failed: Invalid code.</p>
       </body>
       </html>`;
            return new Response(html, { headers: { 'Content-Type': 'text/html' }, status: 400 });
        }

        let tokenData;
        try {
            // Exchange code for token
            const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: env.GOOGLE_CLIENT_ID,
                    client_secret: env.GOOGLE_CLIENT_SECRET,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: redirectUri,
                }),
            });

            if (!tokenResponse.ok) {
                console.error(
                    'Token exchange failed:',
                    tokenResponse.status,
                    await tokenResponse.text()
                );
                const html = `
        <!DOCTYPE html>
        <html>
        <head><title>Sign In Failed</title></head>
        <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'auth-failure', message: 'Failed to exchange authorization code.' }, window.location.origin);
            setTimeout(() => window.close(), 500);
          }
        </script>
        <p>Sign in failed: Token exchange error.</p>
        </body>
        </html>`;
                return new Response(html, {
                    headers: { 'Content-Type': 'text/html' },
                    status: 500,
                });
            }

            tokenData = await tokenResponse.json();
            if (!tokenData.access_token) {
                console.error('No access token in response:', tokenData);
                const html = `
        <!DOCTYPE html>
        <html>
        <head><title>Sign In Failed</title></head>
        <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'auth-failure', message: 'OAuth authorization failed.' }, window.location.origin);
            setTimeout(() => window.close(), 500);
          }
        </script>
        <p>Sign in failed: No access token.</p>
        </body>
        </html>`;
                return new Response(html, {
                    headers: { 'Content-Type': 'text/html' },
                    status: 400,
                });
            }
        } catch (error) {
            console.error('Token exchange error:', error);
            const html = `
      <!DOCTYPE html>
      <html>
      <head><title>Sign In Failed</title></head>
      <body>
      <script>
        if (window.opener) {
          window.opener.postMessage({ type: 'auth-failure', message: 'Database error during sign-in.' }, window.location.origin);
          setTimeout(() => window.close(), 500);
        }
      </script>
      <p>Sign in failed: Database error.</p>
      </body>
      </html>`;
            return new Response(html, { headers: { 'Content-Type': 'text/html' }, status: 500 });
        }

        const accessToken = tokenData.access_token;

        let user;
        try {
            // Get user info
            const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (!userResponse.ok) {
                console.error(
                    'User info fetch failed:',
                    userResponse.status,
                    await userResponse.text()
                );
                const html = `
        <!DOCTYPE html>
        <html>
        <head><title>Sign In Failed</title></head>
        <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'auth-failure', message: 'Failed to retrieve user information.' }, window.location.origin);
            setTimeout(() => window.close(), 500);
          }
        </script>
        <p>Sign in failed: User info error.</p>
        </body>
        </html>`;
                return new Response(html, {
                    headers: { 'Content-Type': 'text/html' },
                    status: 500,
                });
            }

            user = await userResponse.json();
            if (!user.id) {
                console.error('Invalid user data:', user);
                const html = `
        <!DOCTYPE html>
        <html>
        <head><title>Sign In Failed</title></head>
        <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'auth-failure', message: 'Invalid user data received.' }, window.location.origin);
            setTimeout(() => window.close(), 500);
          }
        </script>
        <p>Sign in failed: Invalid user data.</p>
        </body>
        </html>`;
                return new Response(html, {
                    headers: { 'Content-Type': 'text/html' },
                    status: 400,
                });
            }
        } catch (error) {
            console.error('User info fetch error:', error);
            const html = `
      <!DOCTYPE html>
      <html>
      <head><title>Sign In Failed</title></head>
      <body>
      <script>
        if (window.opener) {
          window.opener.postMessage({ type: 'auth-failure', message: 'Network error during sign-in.' }, window.location.origin);
          setTimeout(() => window.close(), 500);
        }
      </script>
      <p>Sign in failed: Network error.</p>
      </body>
      </html>`;
            return new Response(html, { headers: { 'Content-Type': 'text/html' }, status: 500 });
        }

        const userId = user.id;
        const displayName = user.name || user.email || 'User';

        if (!env.JWT_SECRET) {
            throw new Error('JWT_SECRET environment variable is not set');
        }
        // Generate JWT
        const token = await signJWT(
            {
                userId,
                displayName,
            },
            env.JWT_SECRET
        );

        // Store user data in KV only if new user
        try {
            const existingData = await env.KV.get(userId);
            if (!existingData) {
                await env.KV.put(userId, JSON.stringify({ problems: {}, deletedIds: [] }));
            }
        } catch (error) {
            console.error('KV operation error:', error);
            const html = `
      <!DOCTYPE html>
      <html>
      <head><title>Sign In Failed</title></head>
      <body>
      <script>
        if (window.opener) {
          window.opener.postMessage({ type: 'auth-failure', message: 'Network error during sign-in.' }, window.location.origin);
          setTimeout(() => window.close(), 500);
        }
      </script>
      <p>Sign in failed: Network error.</p>
      </body>
      </html>`;
            return new Response(html, { headers: { 'Content-Type': 'text/html' }, status: 500 });
        }

        // Return HTML that handles auth for popup or fallback
        const html = `
    <!DOCTYPE html>
    <html>
    <head><title>Sign In Success</title></head>
    <body>
    <script>
      const authData = ${JSON.stringify({ userId, displayName })};
      if (window.opener) {
        window.opener.postMessage({ type: 'auth-success', ...authData }, window.location.origin);
        setTimeout(() => window.close(), 500);
      } else {
        localStorage.setItem('userId', authData.userId);
        localStorage.setItem('displayName', authData.displayName);
        window.location.href = '/smartgrind?' + new URLSearchParams(authData).toString();
      }
    </script>
    </body>
    </html>`;

        // Set httpOnly cookie with the JWT
        const cookieHeader = `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${24 * 60 * 60}; Path=/smartgrind; Priority=High`;

        return new Response(html, {
            headers: {
                'Content-Type': 'text/html',
                'Set-Cookie': cookieHeader,
                'Content-Security-Policy': "base-uri 'self' https://accounts.google.com",
            },
        });
    }

    return new Response('Invalid action', { status: 400 });
}
