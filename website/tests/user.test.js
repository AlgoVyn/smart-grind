import { onRequestGet, onRequestPost } from '../functions/api/user.js';

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

// Mock atob
global.atob = jest.fn();

describe('User API', () => {
  let mockEnv;
  let mockKV;

  beforeEach(() => {
    mockKV = {
      get: jest.fn(),
      put: jest.fn(),
    };

    mockEnv = {
      JWT_SECRET: 'test-jwt-secret',
      KV: mockKV,
    };

    // Mock crypto.subtle.importKey to return a key
    global.crypto.subtle.importKey.mockResolvedValue('mock-key');

    // Mock crypto.subtle.verify to return true for valid tokens
    global.crypto.subtle.verify.mockResolvedValue(true);

    // Mock atob for JWT payload decoding
    global.atob.mockImplementation((str) => {
      if (str === 'payload') return JSON.stringify({ userId: 'user123' });
      return '';
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onRequestGet', () => {
    test('should return 401 for missing authorization header', async () => {
      const request = new Request('https://example.com/user');

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    test('should return 401 for invalid authorization header', async () => {
      const request = new Request('https://example.com/user', {
        headers: { 'Authorization': 'Invalid' },
      });

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    test('should return 401 for invalid JWT', async () => {
      global.crypto.subtle.verify.mockResolvedValue(false); // Invalid token

      const request = new Request('https://example.com/user', {
        headers: { 'Authorization': 'Bearer header.payload.signature' },
      });

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    test('should return 400 for invalid userId', async () => {
      // Mock valid JWT but invalid userId
      global.crypto.subtle.verify.mockResolvedValue(true);
      global.atob.mockReturnValue(JSON.stringify({ userId: 123 })); // Not string

      const request = new Request('https://example.com/user', {
        headers: { 'Authorization': 'Bearer header.payload.signature' },
      });

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid userId');
    });

    test('should return 400 for userId too long', async () => {
      global.crypto.subtle.verify.mockResolvedValue(true);
      global.atob.mockReturnValue(JSON.stringify({ userId: 'a'.repeat(101) }));

      const request = new Request('https://example.com/user', {
        headers: { 'Authorization': 'Bearer header.payload.signature' },
      });

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid userId');
    });

    test('should return user data from KV', async () => {
      mockKV.get.mockResolvedValue(JSON.stringify({ problems: { '1': {} }, deletedIds: ['2'] }));

      const request = new Request('https://example.com/user', {
        headers: { 'Authorization': 'Bearer header.payload.signature' },
      });

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      const data = await response.json();
      expect(data).toEqual({ problems: { '1': {} }, deletedIds: ['2'] });
    });

    test('should return default data if no KV data', async () => {
      mockKV.get.mockResolvedValue(null);

      const request = new Request('https://example.com/user', {
        headers: { 'Authorization': 'Bearer header.payload.signature' },
      });

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ problems: {}, deletedIds: [] });
    });

    test('should return 500 on KV error', async () => {
      mockKV.get.mockRejectedValue(new Error('KV error'));

      const request = new Request('https://example.com/user', {
        headers: { 'Authorization': 'Bearer header.payload.signature' },
      });

      const response = await onRequestGet({ request, env: mockEnv });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('KV error');
    });
  });

  describe('onRequestPost', () => {
    test('should return 401 for missing authorization', async () => {
      const request = new Request('https://example.com/user', {
        method: 'POST',
        body: JSON.stringify({ data: {} }),
      });

      const response = await onRequestPost({ request, env: mockEnv });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    test('should return 400 for invalid JSON', async () => {
      global.crypto.subtle.verify.mockResolvedValue(true);

      const request = new Request('https://example.com/user', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer header.payload.signature' },
        body: 'invalid json',
      });

      const response = await onRequestPost({ request, env: mockEnv });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid JSON');
    });

    test('should return 400 for missing data', async () => {
      global.crypto.subtle.verify.mockResolvedValue(true);

      const request = new Request('https://example.com/user', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer header.payload.signature' },
        body: JSON.stringify({}),
      });

      const response = await onRequestPost({ request, env: mockEnv });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid data');
    });

    test('should return 400 for invalid data type', async () => {
      global.crypto.subtle.verify.mockResolvedValue(true);

      const request = new Request('https://example.com/user', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer header.payload.signature' },
        body: JSON.stringify({ data: 'string' }),
      });

      const response = await onRequestPost({ request, env: mockEnv });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid data');
    });

    test('should save data to KV and return OK', async () => {
      global.crypto.subtle.verify.mockResolvedValue(true);

      const request = new Request('https://example.com/user', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer header.payload.signature' },
        body: JSON.stringify({ data: { problems: {}, deletedIds: [] } }),
      });

      const response = await onRequestPost({ request, env: mockEnv });

      expect(response.status).toBe(200);
      expect(await response.text()).toBe('OK');
      expect(mockKV.put).toHaveBeenCalledWith('user123', JSON.stringify({ problems: {}, deletedIds: [] }));
    });

    test('should return 500 on KV error', async () => {
      global.crypto.subtle.verify.mockResolvedValue(true);
      mockKV.put.mockRejectedValue(new Error('KV put error'));

      const request = new Request('https://example.com/user', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer header.payload.signature' },
        body: JSON.stringify({ data: {} }),
      });

      const response = await onRequestPost({ request, env: mockEnv });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('KV put error');
    });
  });
});
