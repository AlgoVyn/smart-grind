// Simple JWT implementation
async function verifyJWT(token, secret) {
  try {
    const [header, payload, signature] = token.split('.');
    const data = `${header}.${payload}`;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signatureBytes = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, new TextEncoder().encode(data));

    if (!valid) return null;

    const decodedPayload = JSON.parse(atob(payload));
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return decodedPayload;
  } catch (e) {
    return null;
  }
}

async function authenticate(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return await verifyJWT(token, env.JWT_SECRET || 'default-secret');
}

export async function onRequestGet({ request, env }) {
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

export async function onRequestPost({ request, env }) {
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
  } catch (e) {
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