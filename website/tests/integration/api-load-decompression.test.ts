/**
 * Integration tests for api-load.ts decompression and error handling
 * Targets improving branch coverage for api-load.ts (45% -> higher)
 */

import { _handleApiError, _processUserData } from '../../src/api/api-load';
import { state } from '../../src/state';
import { UserData } from '../../src/types';

describe('API Load - Decompression and Error Handling', () => {
    beforeEach(() => {
        // Reset state
        state.problems = new Map();
        state.deletedProblemIds = new Set();
        jest.clearAllMocks();
    });

    describe('_handleApiError', () => {
        it('should throw error for 500 status', () => {
            const response = new Response('Error', {
                status: 500,
                statusText: 'Internal Server Error',
            });

            expect(() => _handleApiError(response)).toThrow('Server error');
        });

        it('should throw error for 404 status', () => {
            const response = new Response('Not Found', {
                status: 404,
                statusText: 'Not Found',
            });

            expect(() => _handleApiError(response)).toThrow('User data not found');
        });

        it('should throw error for 401 status (auth error)', () => {
            const response = new Response('Unauthorized', {
                status: 401,
                statusText: 'Unauthorized',
            });

            expect(() => _handleApiError(response)).toThrow('Authentication failed');
        });

        it('should throw error for 403 status', () => {
            const response = new Response('Forbidden', {
                status: 403,
                statusText: 'Forbidden',
            });

            expect(() => _handleApiError(response)).toThrow('CSRF token validation failed');
        });

        it('should throw error for 503 status', () => {
            const response = new Response('Service Unavailable', {
                status: 503,
                statusText: 'Service Unavailable',
            });

            expect(() => _handleApiError(response)).toThrow('Failed to load data: Service Unavailable');
        });
    });

    describe('_processUserData', () => {
        it('should process user data and update state', () => {
            const userData: UserData = {
                problems: {
                    'problem-1': {
                        id: 'problem-1',
                        name: 'Test Problem',
                        url: 'https://example.com/problem1',
                        status: 'solved',
                        topic: 'Arrays',
                        pattern: 'Two Pointers',
                        reviewInterval: 1,
                        nextReviewDate: '2024-01-01',
                        note: 'Test note',
                        loading: true,
                        noteVisible: true,
                    },
                    'problem-2': {
                        id: 'problem-2',
                        name: 'Another Problem',
                        url: 'https://example.com/problem2',
                        status: 'unsolved',
                        topic: 'Trees',
                        pattern: 'DFS',
                        reviewInterval: 0,
                        nextReviewDate: null,
                        note: '',
                        loading: true,
                        noteVisible: true,
                    },
                },
                deletedIds: ['deleted-1', 'deleted-2'],

            };

            _processUserData(userData, false);

            expect(state.problems.size).toBe(2);
            expect(state.problems.has('problem-1')).toBe(true);
            expect(state.problems.has('problem-2')).toBe(true);

            // Check that loading and noteVisible are reset
            const problem1 = state.problems.get('problem-1');
            expect(problem1?.loading).toBe(false);
            expect(problem1?.noteVisible).toBe(false);

            // Check deleted IDs
            expect(state.deletedProblemIds.size).toBe(2);
            expect(state.deletedProblemIds.has('deleted-1')).toBe(true);
            expect(state.deletedProblemIds.has('deleted-2')).toBe(true);
        });

        it('should preserve local state during offline fallback when problems exist', () => {
            // Set up existing state
            state.problems.set('existing-problem', {
                id: 'existing-problem',
                name: 'Existing Problem',
                url: 'https://example.com/existing',
                status: 'solved',
                topic: 'Arrays',
                pattern: 'Two Pointers',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                note: 'Existing note',
                loading: false,
                noteVisible: false,
            });

            const newUserData: UserData = {
                problems: {
                    'new-problem': {
                        id: 'new-problem',
                        name: 'New Problem',
                        url: 'https://example.com/new',
                        status: 'unsolved',
                        topic: 'Trees',
                        pattern: 'DFS',
                        reviewInterval: 0,
                        nextReviewDate: null,
                        note: '',
                        loading: false,
                        noteVisible: false,
                    },
                },
                deletedIds: [],

            };

            _processUserData(newUserData, true);

            // Should preserve existing state
            expect(state.problems.size).toBe(1);
            expect(state.problems.has('existing-problem')).toBe(true);
            expect(state.problems.has('new-problem')).toBe(false);
        });

        it('should process new data during offline fallback when no existing problems', () => {
            // Ensure no existing problems
            state.problems = new Map();

            const newUserData: UserData = {
                problems: {
                    'new-problem': {
                        id: 'new-problem',
                        name: 'New Problem',
                        url: 'https://example.com/new',
                        status: 'unsolved',
                        topic: 'Trees',
                        pattern: 'DFS',
                        reviewInterval: 0,
                        nextReviewDate: null,
                        note: '',
                        loading: false,
                        noteVisible: false,
                    },
                },
                deletedIds: ['deleted-1'],

            };

            _processUserData(newUserData, true);

            // Should process new data since no existing problems
            expect(state.problems.size).toBe(1);
            expect(state.problems.has('new-problem')).toBe(true);
            expect(state.deletedProblemIds.has('deleted-1')).toBe(true);
        });

        it('should handle empty user data', () => {
            const userData: UserData = {
                problems: {},
                deletedIds: [],

            };

            _processUserData(userData, false);

            expect(state.problems.size).toBe(0);
            expect(state.deletedProblemIds.size).toBe(0);
        });

        it('should handle undefined problems and deletedIds', () => {
            const userData: UserData = {
                problems: undefined as unknown as Record<string, never>,
                deletedIds: undefined as unknown as string[],

            };

            _processUserData(userData, false);

            expect(state.problems.size).toBe(0);
            expect(state.deletedProblemIds.size).toBe(0);
        });
    });
});
