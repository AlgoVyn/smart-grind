// --- INIT MODULE TESTS ---
// Tests for initialization, auth, and service worker event handling

import { checkAuth } from '../src/init';
import { state } from '../src/state';
import * as swRegister from '../src/sw-register';
import { showToast } from '../src/utils';

// Mock dependencies
jest.mock('../src/sw-register', () => ({
    on: jest.fn(),
}));

jest.mock('../src/state', () => ({
    state: {
        user: { type: 'local', id: null, displayName: 'Local User' },
        problems: new Map(),
        deletedProblemIds: new Set(),
        ui: {
            activeTopicId: '',
            activeAlgorithmCategoryId: null,
            activeSQLCategoryId: null,
            currentFilter: 'all',
            searchQuery: '',
        },
        elements: {},
        loadFromStorage: jest.fn(),
        hasValidData: jest.fn().mockReturnValue(false),
    },
}));

jest.mock('../src/utils', () => ({
    showToast: jest.fn(),
    scrollToTop: jest.fn(),
    sanitizeInput: jest.fn((str) => str),
}));

jest.mock('../src/data', () => ({
    data: {
        topicsData: [],
        algorithmsData: [],
        sqlData: [],
        resetTopicsData: jest.fn(),
        LOCAL_STORAGE_KEYS: { USER_TYPE: 'user_type' },
    },
}));

jest.mock('../src/api/api-load', () => ({
    loadData: jest.fn(),
}));

jest.mock('../src/ui/ui-modals', () => ({
    openSigninModal: jest.fn(),
    showAlert: jest.fn(),
}));

jest.mock('../src/api', () => ({
    initOfflineDetection: jest.fn().mockResolvedValue(jest.fn()),
    syncPlan: jest.fn().mockResolvedValue(undefined),
    mergeStructure: jest.fn(),
    queueOperation: jest.fn().mockResolvedValue(undefined),
    forceSync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../src/renderers', () => ({
    renderers: {
        renderSidebar: jest.fn(),
        renderMainView: jest.fn().mockResolvedValue(undefined),
        renderCombinedView: jest.fn().mockResolvedValue(undefined),
        renderAlgorithmsView: jest.fn().mockResolvedValue(undefined),
        renderSQLView: jest.fn().mockResolvedValue(undefined),
        updateStats: jest.fn(),
    },
    renderSidebar: jest.fn(),
    renderMainView: jest.fn().mockResolvedValue(undefined),
    renderCombinedView: jest.fn().mockResolvedValue(undefined),
    updateStats: jest.fn(),
    setActiveTopic: jest.fn(),
    setActiveAlgorithmCategory: jest.fn(),
    setActiveSQLCategory: jest.fn(),
}));

jest.mock('../src/ui/ui', () => ({
    ui: {
        showAlert: jest.fn(),
        showConfirm: jest.fn().mockResolvedValue(true),
        updateAuthUI: jest.fn(),
        initScrollButton: jest.fn(),
    },
    showAlert: jest.fn(),
    showConfirm: jest.fn().mockResolvedValue(true),
    updateAuthUI: jest.fn(),
    initScrollButton: jest.fn(),
}));

jest.mock('../src/sw/connectivity-checker', () => ({
    getConnectivityChecker: jest.fn().mockReturnValue({
        isOnline: jest.fn().mockResolvedValue(true),
        startMonitoring: jest.fn(),
        stopMonitoring: jest.fn(),
        onConnectivityChange: jest.fn().mockReturnValue(jest.fn()),
        forceFreshCheck: jest.fn().mockResolvedValue(true),
        setOnlineStatus: jest.fn(),
    }),
}));

jest.mock('../src/app', () => ({
    fetchCsrfToken: jest.fn().mockResolvedValue('test-csrf-token'),
    getCsrfToken: jest.fn().mockResolvedValue('test-csrf-token'),
    getCachedCsrfToken: jest.fn().mockReturnValue('test-csrf-token'),
    clearCsrfToken: jest.fn(),
    initializeLocalUser: jest.fn().mockResolvedValue(undefined),
    exportProgress: jest.fn(),
    getCategoryStats: jest.fn(),
    getProblemsByCategory: jest.fn().mockReturnValue([]),
    getAllProblems: jest.fn().mockReturnValue([]),
}));

describe('Init Module - Service Worker Events', () => {
    // Store registered event handlers
    const eventHandlers: Map<string, ((data: unknown) => void)[]> = new Map();

    beforeEach(() => {
        jest.clearAllMocks();
        eventHandlers.clear();

        // Capture event handlers when swRegister.on is called
        (swRegister.on as jest.Mock).mockImplementation((event: string, handler: (data: unknown) => void) => {
            if (!eventHandlers.has(event)) {
                eventHandlers.set(event, []);
            }
            eventHandlers.get(event)!.push(handler);
        });
    });

    describe('bundleReady event', () => {
        test('should show toast when bundle is ready', async () => {
            await checkAuth();

            // Get the bundleReady handler
            const bundleReadyHandlers = eventHandlers.get('bundleReady');
            expect(bundleReadyHandlers).toBeDefined();
            expect(bundleReadyHandlers!.length).toBe(1);

            // Simulate bundle ready event
            bundleReadyHandlers![0]({
                version: '1.0.0',
                downloadedAt: Date.now(),
            });

            expect(showToast).toHaveBeenCalledWith(
                'New version is ready, reload',
                'success',
                15000
            );
        });

        test('should show toast only once even if bundleReady fires multiple times', async () => {
            await checkAuth();

            const bundleReadyHandlers = eventHandlers.get('bundleReady');
            
            // Fire bundleReady twice
            bundleReadyHandlers![0]({ version: '1.0.0', downloadedAt: Date.now() });
            bundleReadyHandlers![0]({ version: '1.0.1', downloadedAt: Date.now() });

            // Toast should only be shown once
            expect(showToast).toHaveBeenCalledTimes(1);
        });
    });

    describe('updateAvailable event', () => {
        test('should show toast for non-first-install updates', async () => {
            await checkAuth();

            const updateHandlers = eventHandlers.get('updateAvailable');
            expect(updateHandlers).toBeDefined();

            // Simulate update available (not first install)
            updateHandlers![0]({ reason: 'update', worker: null });

            expect(showToast).toHaveBeenCalledWith(
                'New version is ready, reload',
                'success',
                15000
            );
        });

        test('should NOT show toast for first install (waits for bundleReady)', async () => {
            await checkAuth();

            const updateHandlers = eventHandlers.get('updateAvailable');
            
            // First install - should not show toast yet
            updateHandlers![0]({ reason: 'first-install', worker: null });

            expect(showToast).not.toHaveBeenCalled();
        });

        test('should show toast only once when both events fire', async () => {
            await checkAuth();

            const updateHandlers = eventHandlers.get('updateAvailable');
            const bundleReadyHandlers = eventHandlers.get('bundleReady');

            // First install event fires (no toast)
            updateHandlers![0]({ reason: 'first-install', worker: null });
            expect(showToast).not.toHaveBeenCalled();

            // Then bundleReady fires (should show toast)
            bundleReadyHandlers![0]({ version: '1.0.0', downloadedAt: Date.now() });
            expect(showToast).toHaveBeenCalledTimes(1);

            // If updateAvailable fires again, no additional toast
            updateHandlers![0]({ reason: 'update', worker: null });
            expect(showToast).toHaveBeenCalledTimes(1);
        });
    });

    describe('authRequired event', () => {
        test('should show auth error toast when auth is required', async () => {
            const { openSigninModal } = require('../src/ui/ui-modals');
            
            await checkAuth();

            const authHandlers = eventHandlers.get('authRequired');
            expect(authHandlers).toBeDefined();

            // Simulate auth required event
            authHandlers![0]({ message: 'Session expired' });

            expect(openSigninModal).toHaveBeenCalled();
            expect(showToast).toHaveBeenCalledWith(
                'Session expired. Please sign in again.',
                'error'
            );
        });
    });
});
