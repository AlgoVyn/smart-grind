import { SignJWT } from 'jose';

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} str - The string to escape.
 * @returns {string} The escaped string.
 */
function escapeHtml(str) {
  const map = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Signs a JWT token with the given payload and secret.
 * @param {Object} payload - The payload to encode in the JWT.
 * @param {string} secret - The secret key for signing.
 * @returns {string} The signed JWT token.
 */
async function signJWT(payload, secret) {
   const secretKey = new TextEncoder().encode(secret);
   return await new SignJWT(payload)
     .setProtectedHeader({ alg: 'HS256' })
     .setExpirationTime(Math.floor(Date.now() / 1000) + (24 * 60 * 60)) // 24 hours
     .sign(secretKey);
}

/**
 * Validates OAuth callback parameters
 * @param {URLSearchParams} params - URL search parameters
 * @returns {string|null} - Code if valid, null otherwise
 */
function validateOAuthCode(params) {
   const code = params.get('code');
   if (!code || typeof code !== 'string' || code.length > 1000) {
     return null;
   }
   return code;
}

/**
 * Handles GET requests for authentication endpoints.
 * Supports login initiation and OAuth callback processing.
 * @param {Object} context - The request context.
 * @param {Request} context.request - The HTTP request object.
 * @param {Object} context.env - Environment variables including OAuth credentials.
 * @returns {Response} The HTTP response.
 */
export async function onRequestGet({ request, env }) {
    const url = new URL(request.url);
    const redirectUri = `https://algovyn.com/smartgrind/api/auth`;
    const action = url.searchParams.get('action');

    if (action === 'login') {
      // Generate random state for CSRF protection
      const state = crypto.randomUUID();
      // Store state in KV with short TTL (5 minutes)
      await env.KV.put(`oauth_state_${state}`, 'valid', { expirationTtl: 300 });

      // Redirect to Google OAuth
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${env.GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=openid%20email%20profile&` +
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
          redirect_uri: redirectUri
        })
      });

      if (!tokenResponse.ok) {
        console.error('Token exchange failed:', tokenResponse.status, await tokenResponse.text());
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
        return new Response(html, { headers: { 'Content-Type': 'text/html' }, status: 500 });
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
        return new Response(html, { headers: { 'Content-Type': 'text/html' }, status: 400 });
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
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!userResponse.ok) {
        console.error('User info fetch failed:', userResponse.status, await userResponse.text());
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
        return new Response(html, { headers: { 'Content-Type': 'text/html' }, status: 500 });
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
        return new Response(html, { headers: { 'Content-Type': 'text/html' }, status: 400 });
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
    const token = await signJWT({
      userId,
      displayName
    }, env.JWT_SECRET);

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
    const escapedDisplayName = escapeHtml(displayName);
    const html = `
    <!DOCTYPE html>
    <html>
    <head><title>Sign In Success</title></head>
    <body>
    <script>
      const userId = '${userId.replace(/'/g, "\\'")}';
      const displayName = '${escapedDisplayName.replace(/'/g, "\\'")}';
      if (window.opener) {
        window.opener.postMessage({ type: 'auth-success', userId, displayName }, window.location.origin);
        setTimeout(() => window.close(), 500);
      } else {
        localStorage.setItem('userId', userId);
        localStorage.setItem('displayName', displayName);
        window.location.href = '/smartgrind?userId=${encodeURIComponent(userId)}&displayName=${encodeURIComponent(displayName)}';
      }
    </script>
    </body>
    </html>`;

    // Set httpOnly cookie with the JWT
    const cookieHeader = `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${24 * 60 * 60}; Path=/`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': cookieHeader,
        'Content-Security-Policy': 'base-uri \'self\' https://accounts.google.com'
      }
    });
  }

  return new Response('Invalid action', { status: 400 });
}