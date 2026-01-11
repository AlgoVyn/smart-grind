// Simple JWT implementation
async function signJWT(payload, secret) {
   const header = { alg: 'HS256', typ: 'JWT' };
   const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
   const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '');

   const data = `${encodedHeader}.${encodedPayload}`;
   const key = await crypto.subtle.importKey(
     'raw',
     new TextEncoder().encode(secret),
     { name: 'HMAC', hash: 'SHA-256' },
     false,
     ['sign']
   );
   const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
   const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '');

   return `${data}.${encodedSignature}`;
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

export async function onRequestGet({ request, env }) {
   const url = new URL(request.url);
   const redirectUri = `https://algovyn.com/smartgrind/api/auth`;
   const action = url.searchParams.get('action');

   if (action === 'login') {
     // Redirect to Google OAuth
     const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
       `client_id=${env.GOOGLE_CLIENT_ID}&` +
       `redirect_uri=${encodeURIComponent(redirectUri)}&` +
       `response_type=code&` +
       `scope=openid%20email%20profile&` +
       `state=callback`;

     return Response.redirect(googleAuthUrl, 302);
   }

  if (url.searchParams.get('state') === 'callback') {
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

    // Generate JWT
    const token = await signJWT({
      userId,
      displayName,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }, env.JWT_SECRET || 'default-secret');

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
      if (window.opener) {
        window.opener.postMessage({ type: 'auth-success', token: '${token}', userId: '${userId}', displayName: '${displayName}' }, window.location.origin);
        setTimeout(() => window.close(), 500);
      } else {
        localStorage.setItem('token', '${token}');
        localStorage.setItem('userId', '${userId}');
        localStorage.setItem('displayName', '${displayName.replace(/'/g, "\\'")}');
        window.location.href = '/smartgrind?token=${encodeURIComponent(token)}&userId=${encodeURIComponent(userId)}&displayName=${encodeURIComponent(displayName)}';
      }
    </script>
    </body>
    </html>`;
    return new Response(html, { headers: { 'Content-Type': 'text/html', 'Content-Security-Policy': 'base-uri \'self\' https://accounts.google.com' } });
  }

  return new Response('Invalid action', { status: 400 });
}