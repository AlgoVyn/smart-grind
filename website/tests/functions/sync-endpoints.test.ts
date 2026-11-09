import { onRequestPost as progressPost } from '../../functions/api/user/progress.ts';
import { onRequestPost as batchPost } from '../../functions/api/user/progress/batch.ts';
import { onRequestPost as customProblemsPost } from '../../functions/api/user/custom-problems.ts';

// Mock jose
jest.mock('jose', () => ({
    jwtVerify: jest.fn(),
}));

import { jwtVerify } from 'jose';

describe('Incremental sync endpoints', () => {
    let mockKV;
    let mockEnv;

    const validRequest = (url: string, body: unknown, headers: Record<string, string> = {}) =>
        new Request(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer header.payload.signature',
                'X-CSRF-Token': 'test-csrf-token-12345',
                ...headers,
            },
            body: JSON.stringify(body),
        });

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

        jwtVerify.mockResolvedValue({ payload: { userId: 'user123' } });
        mockKV.get.mockResolvedValue('test-csrf-token-12345'); // CSRF token
        mockKV.getWithMetadata.mockResolvedValue({
            value: JSON.stringify({ problems: {}, deletedIds: [] }),
            metadata: { 'Content-Type': 'application/json' },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/user/progress', () => {
        test('applies a progress operation to the stored data', async () => {
            mockKV.getWithMetadata.mockResolvedValue({
                value: JSON.stringify({
                    problems: { two_sum: { id: 'two_sum', status: 'unsolved', name: 'Two Sum' } },
                    deletedIds: [],
                }),
                metadata: { 'Content-Type': 'application/json' },
            });

            const response = await progressPost({
                request: validRequest('https://example.com/api/user/progress', {
                    problemId: 'two_sum',
                    operation: { problemId: 'two_sum', status: 'solved', note: 'done' },
                    timestamp: 123,
                    deviceId: 'd1',
                }),
                env: mockEnv,
            });

            expect(response.status).toBe(200);
            const result = await response.json();
            expect(result.applied).toBe(1);

            const [, storedValue, options] = mockKV.put.mock.calls[0];
            const stored = JSON.parse(storedValue);
            expect(stored.problems['two_sum'].status).toBe('solved');
            expect(stored.problems['two_sum'].name).toBe('Two Sum');
            expect(options.metadata['Content-Type']).toBe('application/json');
        });

        test('seeds a minimal record for an unknown problemId', async () => {
            const response = await progressPost({
                request: validRequest('https://example.com/api/user/progress', {
                    problemId: 'reverse_linked_list',
                    operation: { problemId: 'reverse_linked_list', status: 'solved' },
                    timestamp: 123,
                    deviceId: 'd1',
                }),
                env: mockEnv,
            });

            expect(response.status).toBe(200);
            const [, storedValue] = mockKV.put.mock.calls[0];
            const stored = JSON.parse(storedValue);
            expect(stored.problems['reverse_linked_list']).toEqual({
                id: 'reverse_linked_list',
                status: 'solved',
            });
        });

        test('rejects operations without a problemId', async () => {
            const response = await progressPost({
                request: validRequest('https://example.com/api/user/progress', {
                    operation: { status: 'solved' },
                }),
                env: mockEnv,
            });

            expect(response.status).toBe(400);
        });

        test('requires CSRF token', async () => {
            // The per-token KV key for the supplied token does not exist
            mockKV.get.mockResolvedValue(null);
            const response = await progressPost({
                request: validRequest('https://example.com/api/user/progress', {
                    problemId: 'p1',
                    operation: { problemId: 'p1', status: 'solved' },
                }),
                env: mockEnv,
            });
            expect(response.status).toBe(403);
        });

        test('requires authentication', async () => {
            jwtVerify.mockRejectedValue(new Error('bad token'));
            const response = await progressPost({
                request: validRequest('https://example.com/api/user/progress', {
                    problemId: 'p1',
                    operation: { problemId: 'p1', status: 'solved' },
                }),
                env: mockEnv,
            });
            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/user/progress/batch', () => {
        test('applies a batch of operations in order', async () => {
            const response = await batchPost({
                request: validRequest('https://example.com/api/user/progress/batch', {
                    operations: [
                        {
                            problemId: 'p1',
                            operation: { problemId: 'p1', status: 'solved' },
                            timestamp: 1,
                            deviceId: 'd1',
                        },
                        {
                            problemId: 'p2',
                            operation: {
                                problemId: 'p2',
                                nextReviewDate: '2026-09-07',
                                reviewInterval: 7,
                            },
                            timestamp: 2,
                            deviceId: 'd1',
                        },
                        // reset: nextReviewDate null is meaningful and must be kept
                        {
                            problemId: 'p1',
                            operation: { problemId: 'p1', nextReviewDate: null },
                            timestamp: 3,
                            deviceId: 'd1',
                        },
                    ],
                    clientVersion: 1,
                }),
                env: mockEnv,
            });

            expect(response.status).toBe(200);
            const result = await response.json();
            expect(result.applied).toBe(3);
            expect(result.conflicts).toEqual([]);

            const [, storedValue] = mockKV.put.mock.calls[0];
            const stored = JSON.parse(storedValue);
            expect(stored.problems['p1'].status).toBe('solved');
            expect(stored.problems['p1'].nextReviewDate).toBeNull();
            expect(stored.problems['p2'].reviewInterval).toBe(7);
        });

        test('rejects a body without operations array', async () => {
            const response = await batchPost({
                request: validRequest('https://example.com/api/user/progress/batch', {
                    clientVersion: 1,
                }),
                env: mockEnv,
            });
            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/user/custom-problems', () => {
        test('upserts a custom problem', async () => {
            const problem = { id: 'custom-1', name: 'My Problem', difficulty: 'Medium' };
            const response = await customProblemsPost({
                request: validRequest('https://example.com/api/user/custom-problems', {
                    action: 'upsert',
                    problem,
                }),
                env: mockEnv,
            });

            expect(response.status).toBe(200);
            const [, storedValue] = mockKV.put.mock.calls[0];
            const stored = JSON.parse(storedValue);
            expect(stored.problems['custom-1']).toEqual({ id: 'custom-1', name: 'My Problem' });
        });

        test('deletes a custom problem and records the deleted id', async () => {
            mockKV.getWithMetadata.mockResolvedValue({
                value: JSON.stringify({
                    problems: { 'custom-1': { id: 'custom-1', name: 'My Problem' } },
                    deletedIds: [],
                }),
                metadata: { 'Content-Type': 'application/json' },
            });

            const response = await customProblemsPost({
                request: validRequest('https://example.com/api/user/custom-problems', {
                    action: 'delete',
                    problemId: 'custom-1',
                }),
                env: mockEnv,
            });

            expect(response.status).toBe(200);
            const [, storedValue] = mockKV.put.mock.calls[0];
            const stored = JSON.parse(storedValue);
            expect(stored.problems['custom-1']).toBeUndefined();
            expect(stored.deletedIds).toContain('custom-1');
        });

        test('rejects an unknown action', async () => {
            const response = await customProblemsPost({
                request: validRequest('https://example.com/api/user/custom-problems', {
                    action: 'nuke',
                }),
                env: mockEnv,
            });
            expect(response.status).toBe(400);
        });
    });
});
