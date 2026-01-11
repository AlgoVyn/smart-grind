import { onRequestGet } from '../functions/api/auth.js';

// Mock Request and Response
global.Request = class Request {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || 'GET';
    this.headers = new Map(Object.entries(options.headers || {}));
    this.body = options.body;
  }

  async json() {
    return JSON.parse(this.body);
  }
};

global.Response = class Response {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.headers = new Map(Object.entries(options.headers || {}));
  }

  async text() {
    return this.body;
  }

  async json() {
    return JSON.parse(this.body);
  }
};

Response.redirect = (url, status) => new Response('', { status, headers: { Location: url } });

// crypto.subtle is mocked in jest.setup.js

describe('Auth API', () => {
  let mockFetch;
  let mockEnv;
  let mockKV;

  beforeEach(() => {
    mockFetch = global.fetch;
    mockFetch.mockClear();

    mockKV = {
      get: jest.fn(),
      put: jest.fn(),
    };

    mockEnv = {
      GOOGLE_CLIENT_ID: 'test-client-id',
      GOOGLE_CLIENT_SECRET: 'test-client-secret',
      JWT_SECRET: 'test-jwt-secret',
      KV: mockKV,
    };

    // Mock crypto.subtle.importKey to return a key
    global.crypto.subtle.importKey.mockResolvedValue('mock-key');

    // Mock crypto.subtle.sign to return a signature
    global.crypto.subtle.sign.mockResolvedValue(new Uint8Array([1, 2, 3, 4]));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onRequestGet', () => {
    test('should redirect to Google OAuth for login action', async () => {
      const request = new Request('https://example.com/auth?action=login');

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toContain('https://accounts.google.com/o/oauth2/v2/auth');
      expect(response.headers.get('Location')).toContain('client_id=test-client-id');
      expect(response.headers.get('Location')).toContain('redirect_uri=https%3A%2F%2Falgovyn.com%2Fsmartgrind%2Fapi%2Fauth');
    });

    test('should return HTML with failure for invalid code in callback', async () => {
      const request = new Request('https://example.com/auth?state=callback&code=');

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(400);
      expect(response.headers.get('Content-Type')).toBe('text/html');
      const html = await response.text();
      expect(html).toContain('auth-failure');
      expect(html).toContain('Invalid authorization code');
    });

    test('should return HTML with failure for code too long', async () => {
      const longCode = 'a'.repeat(1001);
      const request = new Request(`https://example.com/auth?state=callback&code=${longCode}`);

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(400);
      expect(response.headers.get('Content-Type')).toBe('text/html');
      const html = await response.text();
      expect(html).toContain('auth-failure');
      expect(html).toContain('Invalid authorization code');
    });

    test('should return HTML with failure for OAuth failure', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) }); // No access_token

      const request = new Request('https://example.com/auth?state=callback&code=valid-code');

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(400);
      expect(response.headers.get('Content-Type')).toBe('text/html');
      const html = await response.text();
      expect(html).toContain('auth-failure');
      expect(html).toContain('OAuth authorization failed');
    });

    test('should return HTML with failure for invalid user data', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ access_token: 'token' }) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) }); // No id

      const request = new Request('https://example.com/auth?state=callback&code=valid-code');

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(400);
      expect(response.headers.get('Content-Type')).toBe('text/html');
      const html = await response.text();
      expect(html).toContain('auth-failure');
      expect(html).toContain('Invalid user data received');
    });

    test('should handle successful OAuth and return HTML for new user', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ access_token: 'token' }) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: 'user123', name: 'Test User', email: 'test@example.com' }) });

      mockKV.get.mockResolvedValue(null); // New user

      const request = new Request('https://example.com/auth?state=callback&code=valid-code');

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/html');
      const html = await response.text();
      expect(html).toContain('auth-success');
      expect(html).toContain('user123');
      expect(html).toContain('Test User');
      expect(mockKV.put).toHaveBeenCalledWith('user123', JSON.stringify({ problems: {}, deletedIds: [] }));
    });

    test('should handle successful OAuth for existing user without storing again', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ access_token: 'token' }) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: 'user123', name: 'Test User' }) });

      mockKV.get.mockResolvedValue('existing-data'); // Existing user

      const request = new Request('https://example.com/auth?state=callback&code=valid-code');

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(200);
      expect(mockKV.put).not.toHaveBeenCalled();
    });

    test('should return 400 for invalid action', async () => {
      const request = new Request('https://example.com/auth?action=invalid');

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(400);
      expect(await response.text()).toBe('Invalid action');
    });

    test('should handle user without name', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ access_token: 'token' }) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: 'user123', email: 'test@example.com' }) });

      mockKV.get.mockResolvedValue(null);

      const request = new Request('https://example.com/auth?state=callback&code=valid-code');

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(200);
      const html = await response.text();
      expect(html).toContain('test@example.com');
    });

    test('should handle user with no name or email', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ access_token: 'token' }) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: 'user123' }) });

      mockKV.get.mockResolvedValue(null);

      const request = new Request('https://example.com/auth?state=callback&code=valid-code');

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(200);
      const html = await response.text();
      expect(html).toContain('User');
    });

    test('should return HTML with failure message for token exchange network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const request = new Request('https://example.com/auth?state=callback&code=valid-code');

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(500);
      expect(response.headers.get('Content-Type')).toBe('text/html');
      const html = await response.text();
      expect(html).toContain('auth-failure');
      expect(html).toContain('Database error during sign-in');
    });

    test('should return HTML with failure message for user info network error', async () => {
      mockFetch
        .mockResolvedValueOnce({ json: () => Promise.resolve({ access_token: 'token' }) })
        .mockRejectedValueOnce(new Error('Network error'));

      const request = new Request('https://example.com/auth?state=callback&code=valid-code');

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(500);
      expect(response.headers.get('Content-Type')).toBe('text/html');
      const html = await response.text();
      expect(html).toContain('auth-failure');
      expect(html).toContain('Database error during sign-in');
    });

    test('should return HTML with failure message for KV error', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ access_token: 'token' }) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: 'user123', name: 'Test User' }) });

      mockKV.get.mockRejectedValue(new Error('KV error'));

      const request = new Request('https://example.com/auth?state=callback&code=valid-code');

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(500);
      expect(response.headers.get('Content-Type')).toBe('text/html');
      const html = await response.text();
      expect(html).toContain('auth-failure');
      expect(html).toContain('Database error during sign-in');
    });
  });
});