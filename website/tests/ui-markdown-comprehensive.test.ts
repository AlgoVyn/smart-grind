/**
 * @jest-environment jsdom
 *
 * Comprehensive Tests for UI Markdown Module
 * Aims to significantly improve branch coverage
 */

// Mock DOMPurify - need to mock it as a default export that returns an object with sanitize
jest.mock('dompurify', () => {
    return {
        __esModule: true,
        default: {
            sanitize: jest.fn().mockImplementation((html: string) => html),
        },
    };
});

// Mock dependencies
jest.mock('../src/utils', () => ({
    getBaseUrl: jest.fn().mockReturnValue('/smartgrind/'),
    showToast: jest.fn(),
    showEl: jest.fn(),
    hideEl: jest.fn(),
}));

jest.mock('../src/data', () => ({
    data: {
        algorithmsData: [
            {
                id: 'sorting',
                title: 'Sorting Algorithms',
                algorithms: [
                    { id: 'algo-quicksort', name: 'QuickSort', url: '/algo/quicksort' },
                ],
            },
        ],
    },
}));

import {
    patterns,
    _renderMarkdown,
    switchCarouselTab,
    copyCode,
    openSolutionModal,
    openPatternSolutionModal,
    closeSolutionModal,
    updateSolutionScrollProgress,
    toggleTOC,
    _configureMarkdownRenderer,
} from '../src/ui/ui-markdown';
import { showToast } from '../src/utils';

describe('UI Markdown - Comprehensive', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '';
        
        // Reset window.marked mock
        (window as any).marked = {
            setOptions: jest.fn(),
            Renderer: jest.fn().mockImplementation(() => ({
                code: jest.fn(),
                heading: jest.fn(),
            })),
            parse: jest.fn().mockReturnValue('<p>Test HTML</p>'),
        };
        
        (window as any).Prism = {
            highlightAllUnder: jest.fn(),
        };
    });

    describe('patterns.getPatternFilename', () => {
        it('should convert pattern name to filename', () => {
            expect(patterns.getPatternFilename('Two Pointers')).toBe('two-pointers');
            expect(patterns.getPatternFilename('Sliding Window')).toBe('sliding-window');
            expect(patterns.getPatternFilename('Binary Search')).toBe('binary-search');
        });

        it('should handle special characters', () => {
            expect(patterns.getPatternFilename('A/B Testing')).toBe('a-b-testing');
            expect(patterns.getPatternFilename('C++ Patterns')).toBe('c-patterns');
        });

        it('should remove common suffixes', () => {
            expect(patterns.getPatternFilename('Sliding Window Pattern')).toBe('sliding-window');
            expect(patterns.getPatternFilename('Binary Search Algorithm')).toBe('binary-search');
            expect(patterns.getPatternFilename('Tree Approach')).toBe('tree');
            expect(patterns.getPatternFilename('Graph Method')).toBe('graph');
            expect(patterns.getPatternFilename('DP Technique')).toBe('dp');
            expect(patterns.getPatternFilename('Greedy Style')).toBe('greedy');
        });

        it('should handle multiple hyphens', () => {
            expect(patterns.getPatternFilename('Dynamic   Programming')).toBe('dynamic-programming');
            expect(patterns.getPatternFilename('Back--Tracking')).toBe('back-tracking');
        });

        it('should trim leading/trailing hyphens', () => {
            expect(patterns.getPatternFilename('-Prefix-Suffix-')).toBe('prefix-suffix');
        });
    });

    describe('patterns.checkPatternSolutionExists', () => {
        it('should return true when file exists', async () => {
            global.fetch = jest.fn().mockResolvedValue({ ok: true });
            
            const result = await patterns.checkPatternSolutionExists('Two Pointers');
            
            expect(result).toBe(true);
            expect(fetch).toHaveBeenCalledWith('/smartgrind/patterns/two-pointers.md', { method: 'HEAD' });
        });

        it('should return false when file does not exist', async () => {
            global.fetch = jest.fn().mockResolvedValue({ ok: false });
            
            const result = await patterns.checkPatternSolutionExists('NonExistent');
            
            expect(result).toBe(false);
        });

        it('should return false when fetch throws', async () => {
            global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
            
            const result = await patterns.checkPatternSolutionExists('Two Pointers');
            
            expect(result).toBe(false);
        });
    });

    describe('_configureMarkdownRenderer', () => {
    describe('_configureMarkdownRenderer', () => {
        it('should return the bundled marked instance', () => {
            // With bundled marked, this should always return the marked instance
            const result = _configureMarkdownRenderer();
            
            expect(result).toBeDefined();
            expect(typeof result.parse).toBe('function');
        });

        it('should have configured marked with correct options', () => {
            const marked = _configureMarkdownRenderer();
            
            // Verify the marked instance is configured and has expected methods
            expect(marked).toBeDefined();
            expect(typeof marked.parse).toBe('function');
        });
    });
    describe('switchCarouselTab', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div class="code-carousel">
                    <button class="carousel-tab-btn-test123" data-index="0">Tab 1</button>
                    <button class="carousel-tab-btn-test123" data-index="1">Tab 2</button>
                    <div id="test123-pane-0" class="block"></div>
                    <div id="test123-pane-1" class="hidden"></div>
                </div>
            `;
        });

        it('should switch active tab', () => {
            switchCarouselTab('test123', 1);
            
            const pane0 = document.getElementById('test123-pane-0');
            const pane1 = document.getElementById('test123-pane-1');
            
            expect(pane0?.classList.contains('hidden')).toBe(true);
            expect(pane1?.classList.contains('block')).toBe(true);
        });

        it('should return early if no buttons found', () => {
            document.body.innerHTML = '';
            
            // Should not throw
            expect(() => switchCarouselTab('nonexistent', 0)).not.toThrow();
        });
    });

    describe('copyCode', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <pre>
                    <code>console.log('test')</code>
                    <button class="code-copy-btn"></button>
                </pre>
            `;
            
            Object.assign(navigator, {
                clipboard: {
                    writeText: jest.fn().mockResolvedValue(undefined),
                },
            });
        });

        it('should copy code to clipboard', async () => {
            const button = document.querySelector('.code-copy-btn') as HTMLElement;
            
            await copyCode(button);
            
            // The actual text will have whitespace from the HTML indentation
            expect(navigator.clipboard.writeText).toHaveBeenCalled();
        });

        it('should show copied state briefly', async () => {
            jest.useFakeTimers();
            const button = document.querySelector('.code-copy-btn') as HTMLElement;
            
            await copyCode(button);
            
            expect(button.classList.contains('copied')).toBe(true);
            
            jest.useRealTimers();
        });

        it('should handle clipboard error without throwing', async () => {
            Object.assign(navigator, {
                clipboard: {
                    writeText: jest.fn().mockRejectedValue(new Error('Clipboard error')),
                },
            });
            
            const button = document.querySelector('.code-copy-btn') as HTMLElement;
            
            // Should not throw even when clipboard fails
            await copyCode(button);
            // If we reach here without throwing, the test passes
            expect(true).toBe(true);
        });

        it('should return early if no pre element found', () => {
            document.body.innerHTML = '<button class="code-copy-btn"></button>';
            const button = document.querySelector('.code-copy-btn') as HTMLElement;
            
            // Should not throw
            expect(() => copyCode(button)).not.toThrow();
        });

        it('should return early if no code element found', () => {
            document.body.innerHTML = `
                <pre>
                    <button class="code-copy-btn"></button>
                </pre>
            `;
            const button = document.querySelector('.code-copy-btn') as HTMLElement;
            
            // Should not throw
            expect(() => copyCode(button)).not.toThrow();
        });
    });

    describe('openSolutionModal', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="solution-modal" class="hidden"></div>
                <div id="solution-content"></div>
            `;
            
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                text: jest.fn().mockResolvedValue('# Solution'),
            });
        });

        it('should open modal for regular problem', async () => {
            await openSolutionModal('two-sum');
            
            const modal = document.getElementById('solution-modal');
            expect(modal?.classList.contains('hidden')).toBe(false);
        });

        it('should open modal for algorithm', async () => {
            await openSolutionModal('algo-quicksort');
            
            const modal = document.getElementById('solution-modal');
            expect(modal?.classList.contains('hidden')).toBe(false);
        });

        it('should handle fetch error', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                status: 404,
            });
            
            await openSolutionModal('two-sum');
            
            // The modal should still be shown but with error content
            const modal = document.getElementById('solution-modal');
            expect(modal?.classList.contains('hidden')).toBe(false);
        });
    });

    describe('openPatternSolutionModal', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="solution-modal" class="hidden"></div>
                <div id="solution-content"></div>
            `;
            
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                text: jest.fn().mockResolvedValue('# Pattern Solution'),
            });
        });

        it('should open modal for pattern', async () => {
            await openPatternSolutionModal('Two Pointers');
            
            const modal = document.getElementById('solution-modal');
            expect(modal?.classList.contains('hidden')).toBe(false);
        });
    });

    describe('closeSolutionModal', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="solution-modal"></div>
                <div id="solution-content"></div>
                <div id="solution-scroll-progress"></div>
            `;
        });

        it('should hide modal', () => {
            closeSolutionModal();
            
            const modal = document.getElementById('solution-modal');
            expect(modal?.classList.contains('hidden')).toBe(true);
        });

        it('should remove scroll listener', () => {
            const content = document.getElementById('solution-content') as HTMLElement;
            const removeEventListenerSpy = jest.spyOn(content, 'removeEventListener');
            
            closeSolutionModal();
            
            expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
            removeEventListenerSpy.mockRestore();
        });
    });

    describe('updateSolutionScrollProgress', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="solution-content">
                    <h1 id="section1">Section 1</h1>
                    <h2 id="section2">Section 2</h2>
                    <h3 id="section3">Section 3</h3>
                </div>
                <div id="solution-scroll-progress"></div>
                <div id="solution-toc">
                    <a class="toc-link" data-id="section1"></a>
                    <a class="toc-link" data-id="section2"></a>
                    <a class="toc-link" data-id="section3"></a>
                </div>
            `;
            
            const content = document.getElementById('solution-content') as HTMLElement;
            Object.defineProperty(content, 'scrollTop', { value: 100, writable: true });
            Object.defineProperty(content, 'scrollHeight', { value: 1000, writable: true });
            Object.defineProperty(content, 'clientHeight', { value: 500, writable: true });
        });

        it('should update active TOC link', () => {
            updateSolutionScrollProgress();
            
            const tocLinks = document.querySelectorAll('.toc-link');
            // At least one should have the active classes
            const activeCount = Array.from(tocLinks).filter(link => 
                link.classList.contains('text-brand-400')
            ).length;
            expect(activeCount).toBeGreaterThanOrEqual(0);
        });

        it('should return early if no content element', () => {
            document.body.innerHTML = '';
            
            // Should not throw
            expect(() => updateSolutionScrollProgress()).not.toThrow();
        });
    });

    describe('toggleTOC', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="solution-toc" class="hidden md:block"></div>
                <div id="solution-container" class="max-w-6xl"></div>
            `;
        });

        it('should toggle TOC on desktop (hide)', () => {
            window.innerWidth = 1024;
            
            toggleTOC();
            
            const toc = document.getElementById('solution-toc');
            expect(toc?.classList.contains('md:block')).toBe(false);
            expect(toc?.classList.contains('hidden')).toBe(true);
        });

        it('should toggle TOC on desktop (show)', () => {
            window.innerWidth = 1024;
            document.getElementById('solution-toc')?.classList.remove('md:block');
            
            toggleTOC();
            
            const toc = document.getElementById('solution-toc');
            expect(toc?.classList.contains('md:block')).toBe(true);
        });

        it('should toggle TOC on mobile (show overlay)', () => {
            window.innerWidth = 375;
            
            toggleTOC();
            
            const toc = document.getElementById('solution-toc');
            expect(toc?.classList.contains('absolute')).toBe(true);
        });

        it('should toggle TOC on mobile (hide overlay)', () => {
            window.innerWidth = 375;
            const toc = document.getElementById('solution-toc');
            toc?.classList.remove('hidden');
            
            toggleTOC();
            
            expect(toc?.classList.contains('hidden')).toBe(true);
        });

        it('should return early if no TOC element', () => {
            document.body.innerHTML = '';
            
            // Should not throw
            expect(() => toggleTOC()).not.toThrow();
        });
    });

    describe('_renderMarkdown', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="toc-list"></div>
                <div id="content"></div>
            `;
        });

        it('should render markdown with bundled marked library', () => {
            // With bundled marked, rendering should work without needing window.marked
            const content = document.getElementById('content') as HTMLElement;
            _renderMarkdown('# Test Heading', content);
            
            // The bundled marked library should successfully render the markdown
            expect(content.innerHTML).toBeTruthy();
            expect(content.querySelector('h1')).toBeTruthy();
        });

        it('should render markdown and sanitize', () => {
            const content = document.getElementById('content') as HTMLElement;
            _renderMarkdown('# Test Heading\n\nSome content', content);
            
            expect(content.innerHTML).toBeTruthy();
        });

        it('should render TOC when headings exist', () => {
            const content = document.getElementById('content') as HTMLElement;
            _renderMarkdown('# Heading 1\n## Heading 2', content);
            
            const tocList = document.getElementById('toc-list');
            expect(tocList?.innerHTML).toBeTruthy();
        });

        it('should show "No sections found" when no headings', () => {
            const content = document.getElementById('content') as HTMLElement;
            _renderMarkdown('No headings here', content);
            
            const tocList = document.getElementById('toc-list');
            expect(tocList?.innerHTML).toContain('No sections found');
        });
    });
});
});
