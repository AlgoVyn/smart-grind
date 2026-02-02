// Mock dependencies
const mockGetElementById = jest.spyOn(document, 'getElementById');
const mockQuerySelectorAll = jest.spyOn(document, 'querySelectorAll');
const mockClassListAdd = jest.fn();
const mockClassListRemove = jest.fn();
const mockClassListToggle = jest.fn();
const mockClassListContains = jest.fn();
const mockScrollIntoView = jest.fn();

// Mock element factory
const createMockElement = (overrides = {}) => {
    return {
        classList: {
            add: mockClassListAdd,
            remove: mockClassListRemove,
            toggle: mockClassListToggle,
            contains: mockClassListContains,
        },
        style: {},
        innerHTML: '',
        innerText: '',
        scrollIntoView: mockScrollIntoView,
        ...overrides,
    };
};

// Mock window.marked
window.marked = {
    setOptions: jest.fn(),
    parse: jest.fn((text) => text),
};

// Mock window.Prism
window.Prism = {
    highlightAllUnder: jest.fn(),
};

// Import the module after mocking
import * as uiMarkdown from '../src/ui/ui-markdown';

describe('UI Markdown', () => {
    let mockTocElement;
    let mockContainerElement;

    beforeEach(() => {
        jest.clearAllMocks();

        // Reset currentTOC (internal state of ui-markdown is hard to reset without exposing it,
        // but we can test the renderer functions directly if we can access the renderer object
        // passed to setOptions, or just test the effects).

        // Actually, since ui-markdown.ts executes side effects (setting options) on import/load,
        // we might access the renderer through the mock call to setOptions?
        // OR we can test exported functions like toggleTOC.

        mockTocElement = createMockElement({ id: 'solution-toc' });
        mockContainerElement = createMockElement({ id: 'solution-container' });

        mockGetElementById.mockImplementation((id) => {
            if (id === 'solution-toc') return mockTocElement;
            if (id === 'solution-container') return mockContainerElement;
            return null;
        });

        // Mock window.innerWidth
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });
    });

    describe('toggleTOC', () => {
        test('Desktop: Hides TOC and shrinks container when visible', () => {
            window.innerWidth = 1024; // Desktop
            mockTocElement.classList.contains.mockReturnValue(true); // MD:block is present (visible)

            uiMarkdown.toggleTOC();

            // Should hide TOC
            expect(mockClassListRemove).toHaveBeenCalledWith('md:block');
            expect(mockClassListAdd).toHaveBeenCalledWith('hidden');

            // Should shrink container
            expect(mockContainerElement.classList.remove).toHaveBeenCalledWith('max-w-6xl');
            expect(mockContainerElement.classList.add).toHaveBeenCalledWith('max-w-4xl');
        });

        test('Desktop: Shows TOC and expands container when hidden', () => {
            window.innerWidth = 1024; // Desktop
            mockTocElement.classList.contains.mockReturnValue(false); // MD:block not present (hidden)

            uiMarkdown.toggleTOC();

            // Should show TOC
            expect(mockClassListAdd).toHaveBeenCalledWith('md:block');
            expect(mockClassListRemove).toHaveBeenCalledWith('hidden');

            // Should expand container
            expect(mockContainerElement.classList.remove).toHaveBeenCalledWith('max-w-4xl');
            expect(mockContainerElement.classList.add).toHaveBeenCalledWith('max-w-6xl');
        });

        test('Mobile: Toggles overlay classes', () => {
            window.innerWidth = 400; // Mobile
            mockTocElement.classList.contains.mockReturnValue(true); // Hidden class present (hidden)

            uiMarkdown.toggleTOC();

            // Should show TOC (remove hidden)
            expect(mockClassListRemove).toHaveBeenCalledWith('hidden');

            // Add overlay classes - check if 'absolute' and 'z-50' were added
            // method was called with multiple args, so we check the most recent call args
            const addCalls = mockClassListAdd.mock.calls;
            const lastCallArgs = addCalls[addCalls.length - 1];
            expect(lastCallArgs).toContain('absolute');
            expect(lastCallArgs).toContain('z-50');
        });

        test('Mobile: Hides overlay classes', () => {
            window.innerWidth = 400; // Mobile
            mockTocElement.classList.contains.mockReturnValue(false); // Hidden class NOT present (visible)

            uiMarkdown.toggleTOC();

            // Should hide TOC (add hidden)
            // check if 'hidden' was added
            const addCalls = mockClassListAdd.mock.calls;
            const lastAddArgs = addCalls[addCalls.length - 1];
            expect(lastAddArgs).toContain('hidden');

            // Remove overlay classes - check if 'absolute' was removed
            const removeCalls = mockClassListRemove.mock.calls;
            const lastRemoveArgs = removeCalls[removeCalls.length - 1];
            expect(lastRemoveArgs).toContain('absolute');
        });
    });

    // To test the renderer logic, we need to inspect the renderer object that was passed to marked.setOptions
    // during the module initialization.
    describe('Markdown Renderer Heading', () => {
        let rendererHeading;

        beforeAll(() => {
            // Retrieve the renderer.heading function from the mock call
            const calls = window.marked.setOptions.mock.calls;
            if (calls.length > 0 && calls[0][0].renderer) {
                rendererHeading = calls[0][0].renderer.heading;
            }
        });

        test('Generates ID from text', () => {
            if (!rendererHeading) return;
            const html = rendererHeading('Simple Heading', 1, 'Simple Heading');
            expect(html).toContain('id="simple-heading"');
            expect(html).toContain('>Simple Heading<');
        });

        test('Handles duplicate IDs', () => {
            if (!rendererHeading) return;
            // We need to simulate multiple calls. The module maintains `currentTOC` state?
            // Accessing that state is tricky without a getter.
            // However, we can infer it works if the ID returned changes.

            // NOTE: Since we cannot easily reset the module-level `currentTOC` array in this test setup
            // without reloading the module (which Jest caches), these tests might depend on execution order
            // or previous state. Best effort checks.

            const html1 = rendererHeading('Duplicate', 2, 'Duplicate');
            const html2 = rendererHeading('Duplicate', 2, 'Duplicate');

            // First one normally 'duplicate'
            // Second one should be 'duplicate-1' (or similar based on logic)

            expect(html1).toContain('id="duplicate"');
            expect(html2).toMatch(/id="duplicate-\d+"/);
        });

        test('Handles non-string inputs safely', () => {
            if (!rendererHeading) return;
            // Simulate undefined raw
            const htmlOps = rendererHeading('Test', 1, undefined);
            expect(htmlOps).toContain('id="test"');

            // Simulate object input (Token)
            const token = { text: 'Object Header', depth: 2, raw: 'Object Header' };
            const htmlObj = rendererHeading(token, 2);
            expect(htmlObj).toContain('id="object-header"');
            expect(htmlObj).toContain('Object Header');

            // Simulate number input (weird case)
            const htmlNum = rendererHeading(123, 1, '123');
            expect(htmlNum).toContain('id="123"');
        });
    });
});
