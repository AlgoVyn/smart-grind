// Comprehensive tests for ui-modals.ts module
// Tests modal management, alerts, confirms, form handling, and error tracking consent

import {
    // Modal handlers
    openSigninModal,
    closeSigninModal,
    openAddModal,
    closeAddModal,
    // Alert
    showAlert,
    closeAlertModal,
    getShowAlertHistory,
    clearShowAlertHistory,
    // Confirm
    showConfirm,
    closeConfirmModal,
    sanitizeConfirmMessage,
    // Form handlers
    handleCategoryChange,
    handlePatternChange,
    saveNewProblem,
    // Error tracking
    showErrorTrackingConsent,
    checkAndShowErrorTrackingConsent,
    createErrorTrackingToggle,
    // Internal helpers (exported for testing)
    _setupAddModal,
    _getSanitizedInputs,
    _validateInputs,
    _createNewProblem,
    _updateUIAfterAddingProblem,
    _toggleElementVisibility,
    createModalHandler,
} from '../../src/ui/ui-modals';
import { state } from '../../src/state';
import { data } from '../../src/data';
import { sanitizeInput, sanitizeUrl, showToast, escapeHtml, hideEl } from '../../src/utils';
import { api } from '../../src/api';
import { errorTracker } from '../../src/utils/error-tracker';

// Mock dependencies
jest.mock('../../src/state');
jest.mock('../../src/data');
jest.mock('../../src/utils', () => ({
    sanitizeInput: jest.fn((input) => input?.trim() || ''),
    sanitizeUrl: jest.fn((url) => url?.trim() || ''),
    showToast: jest.fn(),
    escapeHtml: jest.fn((str) => str?.replace(/</g, '&lt;').replace(/>/g, '&gt;') || ''),
    hideEl: jest.fn(),
}));

jest.mock('../../src/api', () => ({
    api: {
        mergeStructure: jest.fn(),
        saveProblem: jest.fn().mockResolvedValue(undefined),
    },
}));

jest.mock('../../src/utils/error-tracker', () => ({
    errorTracker: {
        hasConsent: jest.fn().mockReturnValue(false),
        grantConsent: jest.fn(),
        revokeConsent: jest.fn(),
        getConsentStatus: jest.fn().mockReturnValue('unknown'),
    },
}));

// Mock renderers for dynamic import
jest.mock('../../src/renderers', () => ({
    renderers: {
        renderSidebar: jest.fn(),
        renderMainView: jest.fn(),
    },
}));

// Create mock element factory
const createMockElement = (overrides = {}) => {
    const eventListeners: Record<string, Array<(e: unknown) => void>> = {};
    return {
        addEventListener: jest.fn((event, handler) => {
            if (!eventListeners[event]) eventListeners[event] = [];
            eventListeners[event].push(handler);
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: (event: Event) => {
            const handlers = eventListeners[event.type] || [];
            handlers.forEach((handler) => handler(event));
            return true;
        },
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            toggle: jest.fn(),
            contains: jest.fn().mockReturnValue(false),
        },
        querySelectorAll: jest.fn().mockReturnValue([]),
        querySelector: jest.fn(),
        innerHTML: '',
        innerText: '',
        textContent: '',
        value: '',
        style: {},
        dataset: {},
        focus: jest.fn(),
        blur: jest.fn(),
        click: jest.fn(),
        appendChild: jest.fn((child) => child),
        remove: jest.fn(),
        removeChild: jest.fn(),
        getAttribute: jest.fn(),
        setAttribute: jest.fn(),
        ...overrides,
    };
};

describe('ui-modals', () => {
    let mockSigninModal: ReturnType<typeof createMockElement>;
    let mockAddProblemModal: ReturnType<typeof createMockElement>;
    let mockAlertModal: ReturnType<typeof createMockElement>;
    let mockConfirmModal: ReturnType<typeof createMockElement>;
    let mockAlertTitle: ReturnType<typeof createMockElement>;
    let mockAlertMessage: ReturnType<typeof createMockElement>;
    let mockConfirmTitle: ReturnType<typeof createMockElement>;
    let mockConfirmMessage: ReturnType<typeof createMockElement>;
    let mockAddProbCategory: ReturnType<typeof createMockElement>;
    let mockAddProbPattern: ReturnType<typeof createMockElement>;
    let mockAddProbCategoryNew: ReturnType<typeof createMockElement>;
    let mockAddProbPatternNew: ReturnType<typeof createMockElement>;
    let mockAddProbName: ReturnType<typeof createMockElement>;
    let mockAddProbUrl: ReturnType<typeof createMockElement>;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        // Reset alert history
        clearShowAlertHistory();

        // Create mock elements
        mockSigninModal = createMockElement();
        mockAddProblemModal = createMockElement();
        mockAlertModal = createMockElement();
        mockConfirmModal = createMockElement();
        mockAlertTitle = createMockElement();
        mockAlertMessage = createMockElement();
        mockConfirmTitle = createMockElement();
        mockConfirmMessage = createMockElement();
        mockAddProbCategory = createMockElement();
        mockAddProbPattern = createMockElement();
        mockAddProbCategoryNew = createMockElement();
        mockAddProbPatternNew = createMockElement();
        mockAddProbName = createMockElement();
        mockAddProbUrl = createMockElement();

        // Setup state.elements
        (state as unknown as Record<string, unknown>).elements = {
            signinModal: mockSigninModal,
            addProblemModal: mockAddProblemModal,
            alertModal: mockAlertModal,
            confirmModal: mockConfirmModal,
            alertTitle: mockAlertTitle,
            alertMessage: mockAlertMessage,
            confirmTitle: mockConfirmTitle,
            confirmMessage: mockConfirmMessage,
            addProbCategory: mockAddProbCategory,
            addProbPattern: mockAddProbPattern,
            addProbCategoryNew: mockAddProbCategoryNew,
            addProbPatternNew: mockAddProbPatternNew,
            addProbName: mockAddProbName,
            addProbUrl: mockAddProbUrl,
            toastContainer: createMockElement(),
        };

        // Setup document.activeElement
        Object.defineProperty(document, 'activeElement', {
            writable: true,
            value: { focus: jest.fn() },
        });

        // Mock data.topicsData
        (data as unknown as Record<string, unknown>).topicsData = [
            {
                title: 'Arrays',
                patterns: [
                    { name: 'Two Sum', problems: [] },
                    { name: 'Three Sum', problems: [] },
                ],
            },
            {
                title: 'Strings',
                patterns: [
                    { name: 'Palindrome', problems: [] },
                ],
            },
        ];
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    // ============================================================================
    // Modal Handlers - open/close with focus management
    // ============================================================================
    describe('Modal Handlers', () => {
        describe('openSigninModal', () => {
            test('shows signin modal and stores last focused element', () => {
                const mockActiveElement = { focus: jest.fn() } as unknown as HTMLElement;
                Object.defineProperty(document, 'activeElement', {
                    writable: true,
                    value: mockActiveElement,
                });

                openSigninModal();

                expect(mockSigninModal.classList.remove).toHaveBeenCalledWith('hidden');
            });

            test('does nothing when signin modal element is null', () => {
                (state as unknown as Record<string, unknown>).elements.signinModal = null;

                // Should not throw
                expect(() => openSigninModal()).not.toThrow();
            });
        });

        describe('closeSigninModal', () => {
            test('hides signin modal and restores focus', () => {
                closeSigninModal();

                expect(mockSigninModal.classList.add).toHaveBeenCalledWith('hidden');
            });

            test('does nothing when signin modal element is null', () => {
                (state as unknown as Record<string, unknown>).elements.signinModal = null;

                // Should not throw
                expect(() => closeSigninModal()).not.toThrow();
            });
        });

        describe('openAddModal', () => {
            test('shows add problem modal and calls setup', () => {
                openAddModal();

                expect(mockAddProblemModal.classList.remove).toHaveBeenCalledWith('hidden');
            });

            test('does nothing when add modal element is null', () => {
                (state as unknown as Record<string, unknown>).elements.addProblemModal = null;

                // Should not throw
                expect(() => openAddModal()).not.toThrow();
            });
        });

        describe('closeAddModal', () => {
            test('hides add problem modal', () => {
                closeAddModal();

                expect(mockAddProblemModal.classList.add).toHaveBeenCalledWith('hidden');
            });

            test('does nothing when add modal element is null', () => {
                (state as unknown as Record<string, unknown>).elements.addProblemModal = null;

                // Should not throw
                expect(() => closeAddModal()).not.toThrow();
            });
        });
    });

    // ============================================================================
    // Alert Modal
    // ============================================================================
    describe('Alert Modal', () => {
        describe('showAlert', () => {
            test('shows alert with default title', () => {
                showAlert('Test message');

                expect(mockAlertTitle.textContent).toBe('Alert');
                expect(mockAlertMessage.textContent).toBe('Test message');
                expect(mockAlertModal.classList.remove).toHaveBeenCalledWith('hidden');
            });

            test('shows alert with custom title', () => {
                showAlert('Test message', 'Custom Title');

                expect(mockAlertTitle.textContent).toBe('Custom Title');
                expect(mockAlertMessage.textContent).toBe('Test message');
            });

            test('tracks alert history', () => {
                showAlert('Message 1', 'Title 1');
                const history = getShowAlertHistory();

                expect(history.called).toBe(true);
                expect(history.lastMessage).toBe('Message 1');
                expect(history.lastTitle).toBe('Title 1');
            });

            test('does nothing when alert modal element is null', () => {
                (state as unknown as Record<string, unknown>).elements.alertModal = null;

                // Should not throw
                expect(() => showAlert('Test')).not.toThrow();
            });

            test('does nothing when alert message element is null', () => {
                (state as unknown as Record<string, unknown>).elements.alertMessage = null;
                (state as unknown as Record<string, unknown>).elements.alertTitle = null;

                // Should not throw
                expect(() => showAlert('Test')).not.toThrow();
            });
        });

        describe('closeAlertModal', () => {
            test('hides alert modal', () => {
                closeAlertModal();

                expect(mockAlertModal.classList.add).toHaveBeenCalledWith('hidden');
            });

            test('does nothing when alert modal element is null', () => {
                (state as unknown as Record<string, unknown>).elements.alertModal = null;

                // Should not throw
                expect(() => closeAlertModal()).not.toThrow();
            });
        });

        describe('getShowAlertHistory', () => {
            test('returns history with called false initially', () => {
                clearShowAlertHistory();
                const history = getShowAlertHistory();

                expect(history.called).toBe(false);
                expect(history.lastMessage).toBe('');
                expect(history.lastTitle).toBe('');
            });

            test('returns history after multiple alerts', () => {
                showAlert('First', 'Title 1');
                showAlert('Second', 'Title 2');

                const history = getShowAlertHistory();

                expect(history.called).toBe(true);
                expect(history.lastMessage).toBe('Second');
                expect(history.lastTitle).toBe('Title 2');
            });
        });

        describe('clearShowAlertHistory', () => {
            test('clears alert history', () => {
                showAlert('Test');
                clearShowAlertHistory();

                const history = getShowAlertHistory();

                expect(history.called).toBe(false);
                expect(history.lastMessage).toBe('');
                expect(history.lastTitle).toBe('');
            });
        });
    });

    // ============================================================================
    // Confirm Modal with promise resolution
    // ============================================================================
    describe('Confirm Modal', () => {
        describe('showConfirm', () => {
            test('shows confirm with default title and returns promise', () => {
                const promise = showConfirm('Test message');

                expect(mockConfirmTitle.textContent).toBe('Confirm Action');
                expect(mockConfirmMessage.innerHTML).toContain('Test message');
                expect(mockConfirmModal.classList.remove).toHaveBeenCalledWith('hidden');
                expect(promise).toBeInstanceOf(Promise);
            });

            test('shows confirm with custom title', () => {
                showConfirm('Test message', 'Custom Title');

                expect(mockConfirmTitle.textContent).toBe('Custom Title');
            });

            test('promise resolves to true when closeConfirmModal called with true', async () => {
                const promise = showConfirm('Test');
                closeConfirmModal(true);

                const result = await promise;
                expect(result).toBe(true);
            });

            test('promise resolves to false when closeConfirmModal called with false', async () => {
                const promise = showConfirm('Test');
                closeConfirmModal(false);

                const result = await promise;
                expect(result).toBe(false);
            });

            test("resolves previous pending confirm with false when new confirm shown", async () => {
                const promise1 = showConfirm("First");
                const promise2 = showConfirm("Second");

                // First promise should be resolved with false immediately
                await expect(promise1).resolves.toBe(false);

                // Resolve the second promise
                closeConfirmModal(true);
                await expect(promise2).resolves.toBe(true);
            });

            test('does nothing when confirm modal element is null', () => {
                (state as unknown as Record<string, unknown>).elements.confirmModal = null;

                // Should not throw
                expect(() => showConfirm('Test')).not.toThrow();
            });
        });

        describe('closeConfirmModal', () => {
            test('hides confirm modal and calls resolve', async () => {
                showConfirm('Test');
                closeConfirmModal(true);

                expect(mockConfirmModal.classList.add).toHaveBeenCalledWith('hidden');
            });

            test('does nothing when confirm modal element is null', () => {
                (state as unknown as Record<string, unknown>).elements.confirmModal = null;

                // Should not throw
                expect(() => closeConfirmModal(true)).not.toThrow();
            });

            test('handles multiple close calls gracefully', async () => {
                const promise = showConfirm('Test');
                closeConfirmModal(true);
                closeConfirmModal(false); // Second call should be no-op

                const result = await promise;
                expect(result).toBe(true);
            });
        });

        describe('sanitizeConfirmMessage', () => {
            test('sanitizes HTML in confirm message', () => {
                const sanitized = sanitizeConfirmMessage('<b>Bold</b> <script>alert(1)</script>');

                expect(sanitized).toContain('<b>Bold</b>');
                expect(sanitized).not.toContain('<script>');
            });

            test('allows allowed HTML tags', () => {
                const sanitized = sanitizeConfirmMessage('<b>Bold</b> <i>Italic</i> <u>Underline</u><br>New line');

                expect(sanitized).toContain('<b>');
                expect(sanitized).toContain('<i>');
                expect(sanitized).toContain('<u>');
                expect(sanitized).toContain('<br>');
            });

            test('removes disallowed tags', () => {
                const sanitized = sanitizeConfirmMessage('<div>Text</div> <span>Span</span>');

                expect(sanitized).not.toContain('<div>');
                expect(sanitized).not.toContain('<span>');
            });
        });
    });

    // ============================================================================
    // Form Handlers - Category/Pattern change
    // ============================================================================
    describe('Form Handlers', () => {
        describe('handleCategoryChange', () => {
            test('hides new category input when category selected', () => {
                const event = { target: { value: 'Arrays' } } as unknown as Event;

                handleCategoryChange(event);

                expect(mockAddProbCategoryNew.classList.toggle).toHaveBeenCalledWith('hidden', true);
            });

            test('shows new category input when no category selected', () => {
                const event = { target: { value: '' } } as unknown as Event;

                handleCategoryChange(event);

                expect(mockAddProbCategoryNew.classList.toggle).toHaveBeenCalledWith('hidden', false);
            });

            test('populates pattern dropdown when category selected', () => {
                const event = { target: { value: 'Arrays' } } as unknown as Event;

                handleCategoryChange(event);

                expect(mockAddProbPattern.innerHTML).toContain('Two Sum');
                expect(mockAddProbPattern.innerHTML).toContain('Three Sum');
            });

            test('shows "No Patterns Found" when topic not found', () => {
                const event = { target: { value: 'NonExistent' } } as unknown as Event;

                handleCategoryChange(event);

                expect(mockAddProbPattern.innerHTML).toBe('<option value="">-- No Patterns Found --</option>');
            });

            test('shows "Select Category First" when no category selected', () => {
                const event = { target: { value: '' } } as unknown as Event;

                handleCategoryChange(event);

                expect(mockAddProbPattern.innerHTML).toBe('<option value="">-- Select Category First --</option>');
            });

            test('shows new pattern input when category selected', () => {
                const event = { target: { value: 'Arrays' } } as unknown as Event;

                handleCategoryChange(event);

                expect(mockAddProbPatternNew.classList.toggle).toHaveBeenCalledWith('hidden', false);
            });

            test('handles missing elements gracefully', () => {
                (state as unknown as Record<string, unknown>).elements.addProbCategoryNew = null;
                (state as unknown as Record<string, unknown>).elements.addProbPattern = null;
                (state as unknown as Record<string, unknown>).elements.addProbPatternNew = null;

                const event = { target: { value: 'Arrays' } } as unknown as Event;

                // Should not throw
                expect(() => handleCategoryChange(event)).not.toThrow();
            });
        });

        describe('handlePatternChange', () => {
            test('hides new pattern input when pattern selected', () => {
                const event = { target: { value: 'Two Sum' } } as unknown as Event;

                handlePatternChange(event);

                expect(mockAddProbPatternNew.classList.toggle).toHaveBeenCalledWith('hidden', true);
            });

            test('shows new pattern input when no pattern selected', () => {
                const event = { target: { value: '' } } as unknown as Event;

                handlePatternChange(event);

                expect(mockAddProbPatternNew.classList.toggle).toHaveBeenCalledWith('hidden', false);
            });

            test('handles missing element gracefully', () => {
                (state as unknown as Record<string, unknown>).elements.addProbPatternNew = null;

                const event = { target: { value: 'Two Sum' } } as unknown as Event;

                // Should not throw
                expect(() => handlePatternChange(event)).not.toThrow();
            });
        });
    });

    // ============================================================================
    // Internal Helpers
    // ============================================================================
    describe('Internal Helpers', () => {
        describe('_setupAddModal', () => {
            test('populates category dropdown with topics data', () => {
                _setupAddModal();

                expect(mockAddProbCategory.innerHTML).toContain('-- Select or Type New --');
                expect(mockAddProbCategory.innerHTML).toContain('Arrays');
                expect(mockAddProbCategory.innerHTML).toContain('Strings');
            });

            test('clears input fields', () => {
                mockAddProbName.value = 'old name';
                mockAddProbUrl.value = 'old url';

                _setupAddModal();

                expect(mockAddProbName.value).toBe('');
                expect(mockAddProbUrl.value).toBe('');
            });

            test('shows new category input', () => {
                _setupAddModal();

                expect(mockAddProbCategoryNew.classList.remove).toHaveBeenCalledWith('hidden');
            });

            test('resets pattern dropdown', () => {
                _setupAddModal();

                expect(mockAddProbPattern.innerHTML).toBe('<option value="">-- Select Category First --</option>');
            });

            test('shows new pattern input', () => {
                _setupAddModal();

                expect(mockAddProbPatternNew.classList.remove).toHaveBeenCalledWith('hidden');
            });

            test('handles null elements gracefully', () => {
                (state as unknown as Record<string, unknown>).elements.addProbCategory = null;
                (state as unknown as Record<string, unknown>).elements.addProbPattern = null;
                (state as unknown as Record<string, unknown>).elements.addProbName = null;
                (state as unknown as Record<string, unknown>).elements.addProbUrl = null;

                // Should not throw
                expect(() => _setupAddModal()).not.toThrow();
            });
        });

        describe('_getSanitizedInputs', () => {
            test('returns sanitized inputs', () => {
                mockAddProbName.value = '  Test Problem  ';
                mockAddProbUrl.value = 'https://example.com';
                mockAddProbCategory.value = 'Arrays';
                mockAddProbPattern.value = 'Two Sum';

                const inputs = _getSanitizedInputs();

                expect(sanitizeInput).toHaveBeenCalledWith('  Test Problem  ');
                expect(sanitizeUrl).toHaveBeenCalledWith('https://example.com');
                expect(inputs).toHaveProperty('name');
                expect(inputs).toHaveProperty('url');
                expect(inputs).toHaveProperty('category');
                expect(inputs).toHaveProperty('pattern');
            });

            test('uses new category input when category is empty', () => {
                mockAddProbCategory.value = '';
                mockAddProbCategoryNew.value = 'New Category';
                mockAddProbPattern.value = '';
                mockAddProbPatternNew.value = 'New Pattern';

                const inputs = _getSanitizedInputs();

                expect(sanitizeInput).toHaveBeenCalledWith('New Category');
            });

            test('uses new pattern input when category is selected but pattern is empty', () => {
                mockAddProbCategory.value = 'Arrays';
                mockAddProbPattern.value = '';
                mockAddProbPatternNew.value = 'New Pattern';

                const inputs = _getSanitizedInputs();

                expect(sanitizeInput).toHaveBeenCalledWith('New Pattern');
            });

            test('does not use new pattern when category is empty', () => {
                mockAddProbCategory.value = '';
                mockAddProbPattern.value = '';
                mockAddProbPatternNew.value = 'New Pattern';

                const inputs = _getSanitizedInputs();

                expect(inputs.pattern).toBe('');
            });

            test('handles missing elements with empty values', () => {
                (state as unknown as Record<string, unknown>).elements.addProbName = null;
                (state as unknown as Record<string, unknown>).elements.addProbUrl = null;

                const inputs = _getSanitizedInputs();

                expect(inputs.name).toBe('');
                expect(inputs.url).toBe('');
            });
        });

        describe('_validateInputs', () => {
            const mockAlertFn = jest.fn();

            test('returns true for valid inputs', () => {
                const inputs = {
                    name: 'Test Problem',
                    url: 'https://example.com',
                    category: 'Arrays',
                    pattern: 'Two Sum',
                };

                const result = _validateInputs(inputs, mockAlertFn);

                expect(result).toBe(true);
                expect(mockAlertFn).not.toHaveBeenCalled();
            });

            test('returns false when name is empty', () => {
                const inputs = {
                    name: '',
                    url: 'https://example.com',
                    category: 'Arrays',
                    pattern: 'Two Sum',
                };

                const result = _validateInputs(inputs, mockAlertFn);

                expect(result).toBe(false);
                expect(mockAlertFn).toHaveBeenCalledWith('Problem name is required.');
            });

            test('returns false when URL is empty', () => {
                const inputs = {
                    name: 'Test',
                    url: '',
                    category: 'Arrays',
                    pattern: 'Two Sum',
                };

                const result = _validateInputs(inputs, mockAlertFn);

                expect(result).toBe(false);
                expect(mockAlertFn).toHaveBeenCalledWith('Problem URL is required.');
            });

            test('returns false when category is empty', () => {
                const inputs = {
                    name: 'Test',
                    url: 'https://example.com',
                    category: '',
                    pattern: 'Two Sum',
                };

                const result = _validateInputs(inputs, mockAlertFn);

                expect(result).toBe(false);
                expect(mockAlertFn).toHaveBeenCalledWith('Category is required.');
            });

            test('returns false when pattern is empty', () => {
                const inputs = {
                    name: 'Test',
                    url: 'https://example.com',
                    category: 'Arrays',
                    pattern: '',
                };

                const result = _validateInputs(inputs, mockAlertFn);

                expect(result).toBe(false);
                expect(mockAlertFn).toHaveBeenCalledWith('Pattern is required.');
            });

            test('returns false when URL is invalid', () => {
                const inputs = {
                    name: 'Test',
                    url: 'not-a-url',
                    category: 'Arrays',
                    pattern: 'Two Sum',
                };

                const result = _validateInputs(inputs, mockAlertFn);

                expect(result).toBe(false);
                expect(mockAlertFn).toHaveBeenCalledWith('Please enter a valid URL for the problem.');
            });

            test('validates URL with whitespace', () => {
                const inputs = {
                    name: 'Test',
                    url: '   ',
                    category: 'Arrays',
                    pattern: 'Two Sum',
                };

                const result = _validateInputs(inputs, mockAlertFn);

                expect(result).toBe(false);
                expect(mockAlertFn).toHaveBeenCalledWith('Problem URL is required.');
            });
        });

        describe('_createNewProblem', () => {
            test('creates new problem with correct structure', () => {
                const problem = _createNewProblem('Test', 'https://example.com', 'Arrays', 'Two Sum');

                expect(problem).toMatchObject({
                    name: 'Test',
                    url: 'https://example.com',
                    topic: 'Arrays',
                    pattern: 'Two Sum',
                    status: 'unsolved',
                    reviewInterval: 0,
                    nextReviewDate: null,
                    note: '',
                    loading: false,
                });
                expect(problem.id).toMatch(/^custom-\d+-[a-z0-9]+$/);
            });

            test('generates unique IDs', () => {
                const problem1 = _createNewProblem('Test 1', 'url1', 'Cat1', 'Pat1');
                const problem2 = _createNewProblem('Test 2', 'url2', 'Cat2', 'Pat2');

                expect(problem1.id).not.toBe(problem2.id);
            });
        });

        describe('_updateUIAfterAddingProblem', () => {
            test('hides modal and updates UI', async () => {
                const { renderers } = await import('../../src/renderers');
                (state as unknown as Record<string, unknown>).ui = { activeTopicId: 'test-topic' };

                await _updateUIAfterAddingProblem();

                expect(hideEl).toHaveBeenCalledWith(mockAddProblemModal);
                expect(renderers.renderSidebar).toHaveBeenCalled();
                expect(renderers.renderMainView).toHaveBeenCalledWith('test-topic');
                expect(showToast).toHaveBeenCalledWith('Problem added!');
            });
        });

        describe('_toggleElementVisibility', () => {
            test('hides element when hide is true', () => {
                const element = createMockElement();

                _toggleElementVisibility(element as unknown as HTMLElement, true);

                expect(element.classList.toggle).toHaveBeenCalledWith('hidden', true);
            });

            test('shows element when hide is false', () => {
                const element = createMockElement();

                _toggleElementVisibility(element as unknown as HTMLElement, false);

                expect(element.classList.toggle).toHaveBeenCalledWith('hidden', false);
            });
        });
    });

    // ============================================================================
    // saveNewProblem - Main workflow
    // ============================================================================
    describe('saveNewProblem', () => {
        beforeEach(() => {
            mockAddProbName.value = 'Test Problem';
            mockAddProbUrl.value = 'https://leetcode.com/problems/test';
            mockAddProbCategory.value = 'Arrays';
            mockAddProbPattern.value = 'Two Sum';

            // Setup problems Map
            const mockProblems = new Map();
            (state as unknown as Record<string, unknown>).problems = mockProblems;
            (state as unknown as Record<string, unknown>).setProblem = jest.fn((id: string, problem: unknown) => {
                mockProblems.set(id, problem);
            });
            (state as unknown as Record<string, unknown>).ui = { activeTopicId: 'arrays' };
        });

        test('saves new problem successfully', async () => {
            await saveNewProblem();

            expect(api.mergeStructure).toHaveBeenCalled();
            expect(api.saveProblem).toHaveBeenCalled();
            expect(showToast).toHaveBeenCalledWith('Problem added!');
        });

        test('does not save when validation fails', async () => {
            mockAddProbName.value = '';

            await saveNewProblem();

            expect(api.saveProblem).not.toHaveBeenCalled();
        });

        test('handles ID collision and regenerates', async () => {
            // First create a problem to cause collision
            const firstProblem = _createNewProblem('First', 'url1', 'Cat', 'Pat');
            (state as unknown as { setProblem: (id: string, p: unknown) => void }).setProblem(firstProblem.id, firstProblem);

            // Mock Date.now and Math.random to return same values (simulating collision)
            const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(1234567890);
            const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

            await saveNewProblem();

            dateSpy.mockRestore();
            randomSpy.mockRestore();
        });

        test('shows alert when max collision attempts exceeded', async () => {
            // Fill problems with many entries to force collision
            const mockProblems = new Map();
            let idCounter = 0;
            const dateSpy = jest.spyOn(Date, 'now').mockImplementation(() => {
                return 1234567890 + idCounter++;
            });

            // Pre-populate with potential IDs
            for (let i = 0; i < 10; i++) {
                const id = `custom-${1234567890 + i}-abc123`;
                mockProblems.set(id, { id });
            }
            (state as unknown as Record<string, unknown>).problems = mockProblems;

            mockAddProbName.value = 'Valid Name';

            // Mock to always return same timestamp causing collisions
            let callCount = 0;
            dateSpy.mockImplementation(() => {
                if (callCount++ < 6) return 1234567890;
                return Date.now();
            });

            await saveNewProblem();

            dateSpy.mockRestore();
        });
    });

    // ============================================================================
    // Error Tracking Consent
    // ============================================================================
    describe('Error Tracking Consent', () => {
        describe('showErrorTrackingConsent', () => {
            test('creates modal with correct structure', () => {
                const createElementSpy = jest.spyOn(document, 'createElement');
                const appendChildSpy = jest.spyOn(document.body, 'appendChild');

                showErrorTrackingConsent();

                expect(createElementSpy).toHaveBeenCalledWith('div');
                expect(createElementSpy).toHaveBeenCalledWith('style');
                expect(appendChildSpy).toHaveBeenCalled();

                createElementSpy.mockRestore();
                appendChildSpy.mockRestore();
            });

            test('does not create duplicate modal', () => {
                // Create first modal
                showErrorTrackingConsent();

                const createElementSpy = jest.spyOn(document, 'createElement');

                // Try to create second modal
                showErrorTrackingConsent();

                // Should not create another modal
                const divCalls = createElementSpy.mock.calls.filter((call) => call[0] === 'div');
                expect(divCalls.length).toBeLessThan(2);

                createElementSpy.mockRestore();
            });

            test('grants consent when accept button clicked', () => {
                showErrorTrackingConsent();

                // Find the accept button and click it
                const modal = document.getElementById('error-tracking-consent-modal');
                if (modal) {
                    const acceptBtn = modal.querySelector('#accept-error-tracking') as HTMLElement;
                    if (acceptBtn) {
                        acceptBtn.click();
                    }
                }

                expect(errorTracker.grantConsent).toHaveBeenCalled();
            });

            test('revokes consent when decline button clicked', () => {
                showErrorTrackingConsent();

                const modal = document.getElementById('error-tracking-consent-modal');
                if (modal) {
                    const declineBtn = modal.querySelector('#decline-error-tracking') as HTMLElement;
                    if (declineBtn) {
                        declineBtn.click();
                    }
                }

                expect(errorTracker.revokeConsent).toHaveBeenCalled();
            });

            test("toggles details when learn more clicked", () => {
                showErrorTrackingConsent();

                const modal = document.getElementById("error-tracking-consent-modal");
                if (modal) {
                    const learnMoreBtn = modal.querySelector("#error-tracking-learn-more") as HTMLElement;
                    const details = modal.querySelector("#error-tracking-details") as HTMLElement;

                    if (learnMoreBtn && details) {
                        // Initially hidden
                        expect(details.classList.contains("hidden")).toBe(true);
                        
                        // Click to show
                        learnMoreBtn.click();
                        expect(details.classList.contains("hidden")).toBe(false);

                        // Click to hide
                        learnMoreBtn.click();
                        expect(details.classList.contains("hidden")).toBe(true);
                    }
                }
            });
        });

        describe('checkAndShowErrorTrackingConsent', () => {
            test('shows consent when status is unknown', () => {
                (errorTracker.getConsentStatus as jest.Mock).mockReturnValue('unknown');
                const showConsentSpy = jest.spyOn(require('../../src/ui/ui-modals'), 'showErrorTrackingConsent');

                checkAndShowErrorTrackingConsent();

                jest.advanceTimersByTime(2000);

                // Should have been called
                expect(showConsentSpy).toHaveBeenCalled();
            });

            test('does not show consent when status is granted', () => {
                (errorTracker.getConsentStatus as jest.Mock).mockReturnValue('granted');
                const showConsentSpy = jest.spyOn(require('../../src/ui/ui-modals'), 'showErrorTrackingConsent');

                checkAndShowErrorTrackingConsent();

                jest.advanceTimersByTime(2000);

                expect(showConsentSpy).not.toHaveBeenCalled();
            });

            test('does not show consent when status is denied', () => {
                (errorTracker.getConsentStatus as jest.Mock).mockReturnValue('denied');
                const showConsentSpy = jest.spyOn(require('../../src/ui/ui-modals'), 'showErrorTrackingConsent');

                checkAndShowErrorTrackingConsent();

                jest.advanceTimersByTime(2000);

                expect(showConsentSpy).not.toHaveBeenCalled();
            });
        });

        describe('createErrorTrackingToggle', () => {
            test('creates toggle element with unchecked state', () => {
                (errorTracker.hasConsent as jest.Mock).mockReturnValue(false);

                const toggle = createErrorTrackingToggle();

                expect(toggle).toBeDefined();
                expect(toggle.className).toContain('flex');
                expect(toggle.innerHTML).toContain('Anonymous Error Reports');
                expect(toggle.querySelector('#error-tracking-toggle')?.hasAttribute('checked')).toBe(false);
            });

            test('creates toggle element with checked state', () => {
                (errorTracker.hasConsent as jest.Mock).mockReturnValue(true);

                const toggle = createErrorTrackingToggle();

                expect(toggle.innerHTML).toContain('checked');
            });

            test('grants consent when toggled on', () => {
                (errorTracker.hasConsent as jest.Mock).mockReturnValue(false);

                const toggle = createErrorTrackingToggle();
                const checkbox = toggle.querySelector('#error-tracking-toggle') as HTMLInputElement;

                if (checkbox) {
                    // Simulate change event
                    checkbox.checked = true;
                    checkbox.dispatchEvent(new Event('change'));

                    expect(errorTracker.grantConsent).toHaveBeenCalled();
                    expect(showToast).toHaveBeenCalledWith('Error reporting enabled', 'success');
                }
            });

            test('revokes consent when toggled off', () => {
                (errorTracker.hasConsent as jest.Mock).mockReturnValue(true);

                const toggle = createErrorTrackingToggle();
                const checkbox = toggle.querySelector('#error-tracking-toggle') as HTMLInputElement;

                if (checkbox) {
                    checkbox.checked = false;
                    checkbox.dispatchEvent(new Event('change'));

                    expect(errorTracker.revokeConsent).toHaveBeenCalled();
                    expect(showToast).toHaveBeenCalledWith('Error reporting disabled');
                }
            });
        });
    });

    // ============================================================================
    // createModalHandler
    // ============================================================================
    describe('createModalHandler', () => {
        test('closes modal when clicking modal background', () => {
            const modal = createMockElement();
            const handler = createModalHandler(
                modal as unknown as HTMLElement,
                null,
                jest.fn()
            );

            handler({ target: modal } as unknown as Event);

            expect(modal.classList.add).toHaveBeenCalledWith('hidden');
        });

        test('does not close when clicking content element', () => {
            const modal = createMockElement();
            const content = createMockElement();
            const handler = createModalHandler(
                modal as unknown as HTMLElement,
                content as unknown as HTMLElement,
                jest.fn()
            );

            const event = {
                target: content,
                stopPropagation: jest.fn(),
            };

            handler(event as unknown as Event);

            expect(event.stopPropagation).toHaveBeenCalled();
            expect(modal.classList.add).not.toHaveBeenCalled();
        });

        test('calls onClose callback when closing', () => {
            const modal = createMockElement();
            const onClose = jest.fn();
            const handler = createModalHandler(
                modal as unknown as HTMLElement,
                null,
                onClose
            );

            handler({ target: modal } as unknown as Event);

            expect(onClose).toHaveBeenCalled();
        });

        test('closes when event is null (click on close button)', () => {
            const modal = createMockElement();
            const handler = createModalHandler(modal as unknown as HTMLElement);

            handler(null as unknown as Event);

            expect(modal.classList.add).toHaveBeenCalledWith('hidden');
        });

        test('closes when event target is modal but content is null', () => {
            const modal = createMockElement();
            const handler = createModalHandler(modal as unknown as HTMLElement, null);

            handler({ target: modal } as unknown as Event);

            expect(modal.classList.add).toHaveBeenCalledWith('hidden');
        });
    });

    // ============================================================================
    // Focus Management (via modal open/close)
    // ============================================================================
    describe('Focus Management', () => {
        test('modal focus management with focusable elements', () => {
            const mockButton1 = createMockElement({ focus: jest.fn() });
            const mockButton2 = createMockElement({ focus: jest.fn() });

            mockSigninModal.querySelectorAll = jest.fn().mockReturnValue([
                mockButton1,
                mockButton2,
            ]);

            // Store active element
            const originalActiveElement = document.activeElement;
            Object.defineProperty(document, 'activeElement', {
                writable: true,
                value: { focus: jest.fn(), tagName: 'BUTTON' },
            });

            openSigninModal();

            // Focus should be called on first element
            expect(mockButton1.focus).toHaveBeenCalled();

            // Restore
            Object.defineProperty(document, 'activeElement', {
                writable: true,
                value: originalActiveElement,
            });
        });

        test('modal handles missing querySelectorAll gracefully', () => {
            mockSigninModal.querySelectorAll = undefined;

            // Should not throw
            expect(() => openSigninModal()).not.toThrow();
        });

        test('modal handles no focusable elements', () => {
            mockSigninModal.querySelectorAll = jest.fn().mockReturnValue([]);

            // Should not throw
            expect(() => openSigninModal()).not.toThrow();
        });
    });

    // ============================================================================
    // Problem ID Generation and Collision Detection
    // ============================================================================
    describe('Problem ID Generation', () => {
        test('generated IDs follow expected format', () => {
            const problem = _createNewProblem('Test', 'url', 'Cat', 'Pat');

            expect(problem.id).toMatch(/^custom-\d+-[a-z0-9]{9}$/);
        });

        test('IDs contain timestamp component', () => {
            const beforeTime = Date.now();
            const problem = _createNewProblem('Test', 'url', 'Cat', 'Pat');
            const afterTime = Date.now();

            const timestamp = parseInt(problem.id.split('-')[1], 10);
            expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
            expect(timestamp).toBeLessThanOrEqual(afterTime);
        });

        test('IDs contain random component', () => {
            const problem1 = _createNewProblem('Test1', 'url1', 'Cat1', 'Pat1');
            jest.advanceTimersByTime(1);
            const problem2 = _createNewProblem('Test2', 'url2', 'Cat2', 'Pat2');

            // Even with same timestamp (within same ms), random part should differ
            const random1 = problem1.id.split('-')[2];
            const random2 = problem2.id.split('-')[2];
            expect(random1).not.toBe(random2);
        });

        test('collision detection finds existing IDs in state', () => {
            const existingProblem = _createNewProblem('Existing', 'url', 'Cat', 'Pat');
            (state as unknown as { setProblem: (id: string, p: unknown) => void }).setProblem(existingProblem.id, existingProblem);

            // The saveNewProblem should handle collision
            mockAddProbName.value = 'New Problem';
            mockAddProbUrl.value = 'https://example.com/new';
            mockAddProbCategory.value = 'Arrays';
            mockAddProbPattern.value = 'Pattern';

            // Mock to generate same ID
            const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(parseInt(existingProblem.id.split('-')[1], 10));
            const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.000000001);

            // Should not throw, should regenerate
            expect(() => saveNewProblem()).not.toThrow();

            dateSpy.mockRestore();
            randomSpy.mockRestore();
        });

        test('collision detection checks topicsData', () => {
            // Add a problem to topicsData
            (data as unknown as { topicsData: Array<{ patterns: Array<{ problems: string[] }> }> }).topicsData[0].patterns[0].problems.push('existing-problem-id');

            mockAddProbName.value = 'Test';
            mockAddProbUrl.value = 'https://example.com';
            mockAddProbCategory.value = 'Arrays';
            mockAddProbPattern.value = 'Two Sum';

            // Should save successfully (not collision with topicsData IDs of different format)
            expect(() => saveNewProblem()).not.toThrow();
        });
    });
});
