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

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'login') {
    // Redirect to Google OAuth
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${env.GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent('https://smart-grind.algovyn.com/api/auth')}&` +
      `response_type=code&` +
      `scope=openid%20email%20profile&` +
      `state=callback`;

    return Response.redirect(googleAuthUrl, 302);
  }

  if (url.searchParams.get('state') === 'callback') {
    const code = url.searchParams.get('code');
    if (!code || typeof code !== 'string' || code.length > 1000) {
      return new Response('Invalid code', { status: 400 });
    }

    // Exchange code for token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://smart-grind.algovyn.com/api/auth'
      })
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      return new Response('OAuth failed', { status: 400 });
    }

    const accessToken = tokenData.access_token;

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const user = await userResponse.json();
    if (!user.id) {
      return new Response('Invalid user data', { status: 400 });
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
    const existingData = await env.KV.get(userId);
    if (!existingData) {
      await env.KV.put(userId, JSON.stringify({ problems: {}, deletedIds: [] }));
    }

    // Return HTML that sets token, userId and displayName, then redirects
    const html = `
    <!DOCTYPE html>
    <html>
    <head><title>Logging in...</title></head>
    <body>
    <script>
      localStorage.setItem('token', '${token}');
      localStorage.setItem('userId', '${userId}');
      localStorage.setItem('displayName', '${displayName.replace(/'/g, "\\'")}');
      window.location.href = '/';
    </script>
    </body>
    </html>`;
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
  }

  return new Response('Invalid action', { status: 400 });
}