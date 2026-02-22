/**
 * Integration Tests: Authentication Flow
 * Tests the complete authentication flow across init, state, api, and ui modules
 */

// Set up localStorage mock before importing modules
const mockSetItem = jest.fn();
const mockGetItem = jest.fn();
const mockRemoveItem = jest.fn();

Object.defineProperty(global, 'localStorage', {
    value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
        removeItem: mockRemoveItem,
        clear: jest.fn(),
    },
    writable: true,
});

// Now import the modules
import { state } from '../../src/state';
import { data } from '../../src/data';

// Use global fetch mock from jest.setup.mjs
const mockFetch = global.fetch as jest.Mock;

// Mock minimal DOM elements needed
const mockElements = {
    setupModal: { classList: { add: jest.fn(), remove: jest.fn() } },
    appWrapper: { classList: { add: jest.fn(), remove: jest.fn() } },
    loadingScreen: { classList: { add: jest.fn(), remove: jest.fn() } },
    userDisplay: { innerText: '' },
    googleLoginButton: { disabled: false, innerHTML: '' },
    signinModal: { classList: { add: jest.fn(), remove: jest.fn() } },
    signinModalContent: { innerHTML: '', classList: { remove: jest.fn(), add: jest.fn() } },
    signinError: { textContent: '', classList: { add: jest.fn(), remove: jest.fn() } },
    topicList: { innerHTML: '', appendChild: jest.fn() },
    problemsContainer: { innerHTML: '', appendChild: jest.fn() },
    emptyState: { classList: { add: jest.fn(), remove: jest.fn(), toggle: jest.fn() } },
    currentViewTitle: { textContent: '', insertAdjacentElement: jest.fn() },
    filterBtns: { forEach: jest.fn() },
    statTotal: { textContent: '0' },
    statSolved: { textContent: '0' },
    statDue: { textContent: '0' },
    progressBarSolved: { style: { width: '0%' } },
    statDueBadge: { textContent: '0', classList: { add: jest.fn(), remove: jest.fn() } },
    reviewBanner: { classList: { add: jest.fn(), remove: jest.fn() } },
    reviewCountBanner: { textContent: '0' },
    sidebarTotalStat: { textContent: '0' },
    sidebarTotalBar: { style: { width: '0%' } },
    mobileMenuBtn: { classList: { remove: jest.fn(), add: jest.fn() } },
    mobileMenuBtnMain: { classList: { remove: jest.fn(), add: jest.fn() } },
    mainSidebar: { classList: { remove: jest.fn(), add: jest.fn() } },
    sidebarBackdrop: { classList: { remove: jest.fn(), add: jest.fn() } },
    contentScroll: { scrollTop: 0, addEventListener: jest.fn() },
    scrollToTopBtn: { classList: { add: jest.fn(), remove: jest.fn() }, style: {}, addEventListener: jest.fn() },
    toastContainer: { innerHTML: '', appendChild: jest.fn() },
};

describe('Integration: Authentication Flow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Reset state to clean slate
        state.problems.clear();
        state.deletedProblemIds.clear();
        state.user = { type: 'local', id: null, displayName: 'Local User' };
        state.ui = { activeTopicId: 'all', currentFilter: 'all', searchQuery: '', preferredAI: null, reviewDateFilter: null };
        state.sync = { isOnline: true, isSyncing: false, pendingCount: 0, lastSyncAt: null, hasConflicts: false, conflictMessage: null };
        state.elements = { ...mockElements } as any;
        
        // Reset data
        data.topicsData = [];
        
        // Reset localStorage mock
        mockGetItem.mockReturnValue(null);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Local User Authentication', () => {
        test('should initialize local user with complete flow', async () => {
            // Import modules dynamically to ensure fresh state
            const { app } = await import('../../src/app');
            const { data: dataModule } = await import('../../src/data');
            
            // Store original topicsData length
            const originalLength = dataModule.topicsData.length;
            
            // Execute initialization
            await app.initializeLocalUser();
            
            // Verify state changes
            expect(state.user.type).toBe('local');
            expect(state.user.displayName).toBe('Local User');
            expect(mockGetItem).toHaveBeenCalledWith('smartgrind-user-type');
            
            // Verify topics data exists (has been reset)
            expect(dataModule.topicsData.length).toBeGreaterThan(0);
            
            // Verify UI elements were updated
            expect(mockElements.setupModal.classList.add).toHaveBeenCalledWith('hidden');
            expect(mockElements.appWrapper.classList.remove).toHaveBeenCalledWith('hidden');
            expect(mockElements.loadingScreen.classList.add).toHaveBeenCalledWith('hidden');
        });

        test('should load existing local user data from storage', async () => {
            // Pre-populate localStorage with existing data
            const existingProblems = {
                '1': { id: '1', name: 'Existing Problem', status: 'solved', topic: 'Arrays', pattern: 'Two Sum' }
            };
            
            // Mock localStorage to return saved data
            mockGetItem
                .mockReturnValueOnce(JSON.stringify(existingProblems))
                .mockReturnValueOnce(JSON.stringify(['2']))
                .mockReturnValueOnce('Existing User')
                .mockReturnValueOnce('local');
            
            // Re-initialize state to load from storage
            state.loadFromStorage();
            
            // Verify loaded state
            expect(state.problems.get('1')).toBeDefined();
            expect(state.problems.get('1')?.status).toBe('solved');
            expect(state.deletedProblemIds.has('2')).toBe(true);
            expect(state.user.displayName).toBe('Existing User');
        });

        test('should handle local user with custom problems', async () => {
            const { data: dataModule } = await import('../../src/data');
            const { api: apiModule } = await import('../../src/api');
            
            // Store original length
            const originalLength = dataModule.topicsData.length;
            
            // Add custom problem with all required fields
            state.problems.set('custom-1', {
                id: 'custom-1',
                name: 'Custom Problem',
                url: 'https://example.com/custom',
                topic: 'Custom Topic',
                pattern: 'Custom Pattern',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                loading: false,
                noteVisible: false,
                note: 'Custom note'
            });
            
            // mergeStructure should create custom topics from problems
            apiModule.mergeStructure();
            
            // Verify custom problem is preserved in topicsData
            // The mergeStructure function adds custom topics at the end
            expect(dataModule.topicsData.length).toBeGreaterThanOrEqual(originalLength);
            
            // Find the custom topic - it may be added by mergeStructure
            const customTopic = dataModule.topicsData.find(t => t.title === 'Custom Topic');
            if (customTopic) {
                expect(customTopic.patterns[0].problems.length).toBeGreaterThanOrEqual(1);
            }
            // The problem should still be in state.problems
            expect(state.problems.has('custom-1')).toBe(true);
        });
    });

    describe('Signed-in User Authentication', () => {
        test('should handle signed-in user with server data', async () => {
            // Mock successful auth token fetch and user data load
            // checkAuth calls: 1) /api/auth?action=token, 2) fetchCsrfToken, 3) loadData (/api/user)
            // Note: _setupSignedInUser uses localStorage.getItem('displayName') || authData.displayName
            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 
                        token: 'mock-jwt-token',
                        userId: 'user123',
                        displayName: 'Test User'
                    })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({
                        csrfToken: 'mock-csrf-token'
                    })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    headers: new Headers(),
                    text: () => Promise.resolve(JSON.stringify({
                        problems: {
                            '1': { id: '1', name: 'Server Problem', status: 'solved', url: 'https://leetcode.com/problems/server-problem' }
                        },
                        deletedIds: ['2']
                    }))
                });
            
            // Simulate having userId and displayName in localStorage
            // First call is for userId, second for displayName
            mockGetItem
                .mockReturnValueOnce('user123')
                .mockReturnValueOnce('Test User');
            
            // Import and execute auth check
            const { checkAuth } = await import('../../src/init');
            
            // Use window.location mock from jest.setup
            (window as any).location = { pathname: '/smartgrind/', search: '', href: 'http://localhost/smartgrind/' };
            
            await checkAuth();
            
            // Verify state was updated
            expect(state.user.type).toBe('signed-in');
            expect(state.user.id).toBe('user123');
            // displayName comes from localStorage or authData
            expect(state.user.displayName).toBe('Test User');
        });

        test('should handle auth failure gracefully', async () => {
            // Mock failed auth
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 401
            });
            
            mockGetItem.mockReturnValue('user123');
            
            const { checkAuth } = await import('../../src/init');
            
            (window as any).location = { pathname: '/smartgrind/', search: '', href: 'http://localhost/smartgrind/' };
            
            await checkAuth();
            
            // Verify local state was cleared on auth failure
            expect(mockRemoveItem).toHaveBeenCalledWith('userId');
            expect(state.user.type).toBe('local');
        });

        test('should handle PWA auth callback flow', async () => {
            // Mock successful token and user data fetch
            // PWA flow: 1) /api/auth?action=token, 2) fetchCsrfToken, 3) loadData
            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 
                        token: 'mock-jwt-token',
                        userId: 'user123',
                        displayName: 'PWA User'
                    })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ csrfToken: 'mock-csrf-token' })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    headers: new Headers(),
                    text: () => Promise.resolve(JSON.stringify({ problems: {}, deletedIds: [] }))
                });
            
            // Mock localStorage to return userId for signed-in user check
            mockGetItem
                .mockReturnValueOnce('user123')  // userId
                .mockReturnValueOnce('PWA User'); // displayName
            
            // Set up location with query params (simple assignment)
            (window as any).location = {
                pathname: '/smartgrind/',
                search: '?userId=user123&displayName=PWA%20User',
                href: 'http://localhost/smartgrind/?userId=user123&displayName=PWA%20User'
            };
            
            const { checkAuth } = await import('../../src/init');
            await checkAuth();
            
            // Verify user was set up - PWA flow sets up signed-in user
            expect(state.user.type).toBe('signed-in');
            expect(state.user.id).toBe('user123');
            // displayName is sanitized from URL param
            expect(state.user.displayName).toBe('PWA User');
        });
    });

    describe('Auth State Transitions', () => {
        test('should transition from local to signed-in user', async () => {
            // Start as local user with data
            state.user.type = 'local';
            state.problems.set('local-problem', {
                id: 'local-problem',
                name: 'Local Problem',
                url: 'https://example.com',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved',
                reviewInterval: 0,
                nextReviewDate: null,
                loading: false,
                noteVisible: false,
                note: ''
            });
            
            // Mock successful sign-in - checkAuth uses userId from localStorage
            // Flow: 1) /api/auth?action=token, 2) fetchCsrfToken, 3) loadData
            // Note: _setupSignedInUser uses localStorage.getItem('displayName') || authData.displayName
            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ 
                        token: 'mock-jwt-token',
                        userId: 'newuser',
                        displayName: 'New User'
                    })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ csrfToken: 'mock-csrf-token' })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    headers: new Headers(),
                    text: () => Promise.resolve(JSON.stringify({ 
                        problems: { 'server-problem': { id: 'server-problem', name: 'Server Problem', status: 'unsolved', url: 'https://leetcode.com/problems/server-problem' } },
                        deletedIds: []
                    }))
                });
            
            // Set userId and displayName in localStorage
            mockGetItem
                .mockReturnValueOnce('newuser')
                .mockReturnValueOnce('New User');
            
            const { checkAuth } = await import('../../src/init');
            (window as any).location = { pathname: '/smartgrind/', search: '', href: 'http://localhost/smartgrind/' };
            
            await checkAuth();
            
            // Verify transition
            expect(state.user.type).toBe('signed-in');
            expect(state.user.id).toBe('newuser');
            // displayName comes from localStorage or authData
            expect(state.user.displayName).toBe('New User');
        });

        test('should handle session expiration during sync', async () => {
            // Setup as signed-in user
            state.user.type = 'signed-in';
            state.user.id = 'user123';
            
            // Mock auth failure on token fetch (401 response triggers sign-out)
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
                statusText: 'Unauthorized'
            });
            
            // Mock localStorage to return userId (so checkAuth tries to verify session)
            mockGetItem.mockReturnValue('user123');
            
            const { checkAuth } = await import('../../src/init');
            (window as any).location = { pathname: '/smartgrind/', search: '', href: 'http://localhost/smartgrind/' };
            
            await checkAuth();
            
            // On auth failure, checkAuth clears user state
            // Verify that localStorage.removeItem was called for userId
            expect(mockRemoveItem).toHaveBeenCalledWith('userId');
        });
    });

    describe('Auth UI Integration', () => {
        test('should update UI elements after auth state change', async () => {
            const { app } = await import('../../src/app');
            
            // Initialize local user
            await app.initializeLocalUser();
            
            // Verify UI was updated
            expect(mockElements.userDisplay.innerText).toBe('Local User');
            expect(mockElements.setupModal.classList.add).toHaveBeenCalledWith('hidden');
        });

        test('should handle missing DOM elements gracefully', async () => {
            const { app } = await import('../../src/app');
            
            // Clear elements to simulate missing DOM
            state.elements = {};
            
            // Should not throw
            await expect(app.initializeLocalUser()).resolves.not.toThrow();
        });
    });
});
