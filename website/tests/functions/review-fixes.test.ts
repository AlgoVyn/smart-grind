import { onRequestGet, onRequestPost } from '../../functions/api/user.ts';
import { onRequestPost as progressPost } from '../../functions/api/user/progress.ts';
import { onRequestPost as customProblemsPost } from '../../functions/api/user/custom-problems.ts';
import { onRequestPost as logoutPost } from '../../functions/api/auth.ts';
import {
    applyProgressOperation,
    applyCustomProblemUpsert,
    defaultUserData,
} from '../../functions/api/user/sync-utils.ts';
import { checkRateLimit } from '../../functions/api/cloudflare-types.ts';
import { jwtVerify } from 'jose';

jest.mock('jose', () => ({
    jwtVerify: jest.fn(),
}));

describe('Review-finding regressions', () => {
    let mockKV: {
        get: jest.Mock;
        getWithMetadata: jest.Mock;
        put: jest.Mock;
        delete: jest.Mock;
    };
    let mockEnv: { NODE_ENV: string; JWT_SECRET: string; KV: typeof mockKV };

    const authHeaders = {
        Authorization: 'Bearer header.payload.signature',
        'X-CSRF-Token': 'test-csrf-token-12345',
    };

    beforeEach(() => {
        mockKV = {
            get: jest.fn(),
            getWithMetadata: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        };
        mockEnv = {
            NODE_ENV: 'test',
            JWT_SECRET: 'test-jwt-secret',
            KV: mockKV,
        };
        (jwtVerify as jest.Mock).mockResolvedValue({ payload: { userId: 'user123' } });
        mockKV.get.mockResolvedValue('test-csrf-token-12345');
        mockKV.getWithMetadata.mockResolvedValue({
            value: JSON.stringify({ problems: {}, deletedIds: [] }),
            metadata: { 'Content-Type': 'application/json' },
        });
        // Ensure a polluted prototype from a previous test cannot leak in
        delete (Object.prototype as Record<string, unknown>).status;
        delete (Object.prototype as Record<string, unknown>).note;
    });

    afterEach(() => {
        delete (Object.prototype as Record<string, unknown>).status;
        delete (Object.prototype as Record<string, unknown>).note;
        jest.clearAllMocks();
    });

    describe('H2 prototype pollution', () => {
        test('rejects __proto__ as a progress problemId and does not pollute Object.prototype', () => {
            const data = defaultUserData();
            const applied = applyProgressOperation(data, {
                problemId: '__proto__',
                operation: { status: 'solved', note: 'pwned' },
            });
            expect(applied).toBe(false);
            expect(({} as { status?: string }).status).toBeUndefined();
            expect(Object.prototype.hasOwnProperty.call(data.problems, '__proto__')).toBe(false);
        });

        test('rejects reserved keys on custom-problem upsert', () => {
            const data = defaultUserData();
            expect(applyCustomProblemUpsert(data, { id: 'constructor', name: 'Nope' })).toBe(false);
            expect(data.problems.constructor).not.toEqual({ id: 'constructor', name: 'Nope' });
        });

        test('POST /api/user/progress returns 400 for reserved ids and does not write', async () => {
            const response = await progressPost({
                request: new Request('https://example.com/api/user/progress', {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify({
                        problemId: '__proto__',
                        operation: { problemId: '__proto__', status: 'solved', note: 'pwned' },
                    }),
                }),
                env: mockEnv,
            });
            expect(response.status).toBe(400);
            expect(mockKV.put).not.toHaveBeenCalled();
            expect(({} as { status?: string }).status).toBeUndefined();
        });

        test('POST /api/user/custom-problems rejects prototype keys', async () => {
            const response = await customProblemsPost({
                request: new Request('https://example.com/api/user/custom-problems', {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify({
                        action: 'upsert',
                        problem: { id: '__proto__', name: 'Evil' },
                    }),
                }),
                env: mockEnv,
            });
            expect(response.status).toBe(400);
            expect(mockKV.put).not.toHaveBeenCalled();
        });
    });

    describe('H3 corrupt blob and generation', () => {
        test('GET returns 500 corrupt_blob instead of an empty dataset', async () => {
            mockKV.getWithMetadata.mockResolvedValue({
                value: new TextEncoder().encode('this is not json').buffer,
                metadata: { 'Content-Type': 'application/json' },
            });
            const response = await onRequestGet({
                request: new Request('https://example.com/user', {
                    headers: { Authorization: 'Bearer header.payload.signature' },
                }),
                env: mockEnv,
            });
            expect(response.status).toBe(500);
            await expect(response.json()).resolves.toEqual({
                error: 'corrupt_blob',
                recoverable: true,
            });
        });

        test('full POST with a mismatched generation returns 409', async () => {
            mockKV.getWithMetadata.mockResolvedValue({
                value: JSON.stringify({ problems: { p1: { id: 'p1' } }, deletedIds: [] }),
                metadata: { 'Content-Type': 'application/json', generation: 5 },
            });
            const response = await onRequestPost({
                request: new Request('https://example.com/user', {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify({
                        generation: 4,
                        data: { problems: {}, deletedIds: [] },
                    }),
                }),
                env: mockEnv,
            });
            expect(response.status).toBe(409);
            await expect(response.json()).resolves.toEqual({
                error: 'generation_conflict',
                generation: 5,
            });
            expect(mockKV.put).not.toHaveBeenCalled();
        });

        test('legacy POST without generation is allowed and writes the next generation', async () => {
            mockKV.getWithMetadata.mockResolvedValue({
                value: JSON.stringify({ problems: {}, deletedIds: [] }),
                metadata: { 'Content-Type': 'application/json', generation: 2 },
            });
            const response = await onRequestPost({
                request: new Request('https://example.com/user', {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify({ data: { problems: {}, deletedIds: [] } }),
                }),
                env: mockEnv,
            });
            expect(response.status).toBe(200);
            expect(response.headers.get('X-Data-Generation')).toBe('3');
            const options = mockKV.put.mock.calls[0][2];
            expect(options.metadata.generation).toBe('3');
        });

        test('a full POST can repair a corrupt blob', async () => {
            mockKV.getWithMetadata.mockResolvedValue({
                value: new TextEncoder().encode('not-json').buffer,
                metadata: { 'Content-Type': 'application/json', generation: 1 },
            });
            const response = await onRequestPost({
                request: new Request('https://example.com/user', {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify({
                        data: { problems: { p1: { id: 'p1', status: 'solved' } }, deletedIds: [] },
                    }),
                }),
                env: mockEnv,
            });
            expect(response.status).toBe(200);
            expect(mockKV.put).toHaveBeenCalled();
        });
    });

    describe('M2 flashcard progress sync', () => {
        test('GET returns flashCardProgress and POST persists it', async () => {
            const flash = {
                'card-1': {
                    cardId: 'card-1',
                    reviewInterval: 2,
                    nextReviewDate: '2026-11-11',
                    lastReviewedAt: '2026-11-10',
                    timesReviewed: 3,
                    timesCorrect: 2,
                },
            };
            mockKV.getWithMetadata.mockResolvedValue({
                value: JSON.stringify({
                    problems: {},
                    deletedIds: [],
                    flashCardProgress: flash,
                }),
                metadata: { 'Content-Type': 'application/json', generation: 1 },
            });
            const getRes = await onRequestGet({
                request: new Request('https://example.com/user', {
                    headers: { Authorization: 'Bearer header.payload.signature' },
                }),
                env: mockEnv,
            });
            expect(getRes.status).toBe(200);
            const body = await getRes.json();
            expect(body.flashCardProgress['card-1'].timesReviewed).toBe(3);
            expect(body.generation).toBe(1);

            const postRes = await onRequestPost({
                request: new Request('https://example.com/user', {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify({
                        generation: 1,
                        data: { problems: {}, deletedIds: [], flashCardProgress: flash },
                    }),
                }),
                env: mockEnv,
            });
            expect(postRes.status).toBe(200);
            const stored = JSON.parse(mockKV.put.mock.calls[0][1]);
            expect(stored.flashCardProgress['card-1'].timesCorrect).toBe(2);
        });
    });

    describe('M3 server-side validation', () => {
        test('strips javascript: URLs and caps note length on write', async () => {
            const longNote = 'n'.repeat(500);
            const response = await onRequestPost({
                request: new Request('https://example.com/user', {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify({
                        data: {
                            problems: {
                                'two-sum': {
                                    id: 'two-sum',
                                    name: 'Two Sum',
                                    url: 'javascript:alert(1)',
                                    note: longNote,
                                    extra: 'drop-me',
                                    status: 'solved',
                                },
                            },
                            deletedIds: [],
                        },
                    }),
                }),
                env: mockEnv,
            });
            expect(response.status).toBe(200);
            const stored = JSON.parse(mockKV.put.mock.calls[0][1]);
            expect(stored.problems['two-sum'].url).toBe('');
            expect(stored.problems['two-sum'].note).toHaveLength(200);
            expect(stored.problems['two-sum'].extra).toBeUndefined();
        });
    });

    describe('H1 logout', () => {
        test('POST /api/auth?action=logout clears the auth cookie', async () => {
            const response = await logoutPost({
                request: new Request('https://example.com/smartgrind/api/auth?action=logout', {
                    method: 'POST',
                }),
                env: mockEnv,
            });
            expect(response.status).toBe(200);
            const cookie = response.headers.get('Set-Cookie') || '';
            expect(cookie).toContain('auth_token=');
            expect(cookie).toContain('Max-Age=0');
            expect(cookie).toContain('Path=/smartgrind');
            expect(cookie).toContain('HttpOnly');
        });

        test('POST /api/auth without logout action returns 400', async () => {
            const response = await logoutPost({
                request: new Request('https://example.com/smartgrind/api/auth', {
                    method: 'POST',
                }),
                env: mockEnv,
            });
            expect(response.status).toBe(400);
        });
    });

    describe('M7 rate limiter failure mode', () => {
        test('fails open by default and fail-closed when requested', async () => {
            const brokenEnv = {
                KV: {
                    get: jest.fn().mockRejectedValue(new Error('kv down')),
                    put: jest.fn(),
                },
            };
            const request = new Request('https://example.com/api/auth', {
                headers: { 'CF-Connecting-IP': '1.2.3.4' },
            });
            await expect(checkRateLimit(request, brokenEnv as never, 10, 60, 'api')).resolves.toBe(
                false
            );
            await expect(
                checkRateLimit(request, brokenEnv as never, 10, 60, 'oauth', true)
            ).resolves.toBe(true);
        });
    });
});
