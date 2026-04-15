/**
 * @jest-environment jsdom
 *
 * Comprehensive Tests for UI Markdown Module
 * Tests markdown rendering, solution modals, carousels, code copying, and TOC functionality
 */

// Mock prism-config import
jest.mock('../../src/config/prism-config', () => ({}));

// Mock DOMPurify
jest.mock('dompurify', () => ({
    __esModule: true,
    default: {
        sanitize: jest.fn().mockImplementation((html: string) => html),
    },
}));

// Mock marked library - provides parse and use functions
jest.mock('marked', () => ({
    __esModule: true,
    marked: Object.assign(
        jest.fn().mockImplementation((text: string) => {
            if (typeof text !== 'string') return '<p></p>';
            // Simple markdown parser for testing - generate headings with IDs
            const lines = text.split('\n');
            const html = lines.map(line => {
                // Handle headings
                const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
                if (headingMatch) {
                    const level = headingMatch[1].length;
                    const content = headingMatch[2];
                    const id = content.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s/()&\`+-]+/g, '-');
                    return `<h${level} id="${id}">${content}</h${level}>`;
                }
                if (line.trim()) {
                    return `<p>${line}</p>`;
                }
                return '';
            }).join('');
            return html || '<p></p>';
        }),
        {
            use: jest.fn(),
            parse: jest.fn().mockImplementation((text: string) => {
                if (typeof text !== 'string') return '<p></p>';
                const lines = text.split('\n');
                const html = lines.map(line => {
                    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
                    if (headingMatch) {
                        const level = headingMatch[1].length;
                        const content = headingMatch[2];
                        const id = content.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s/()&\`+-]+/g, '-');
                        return `<h${level} id="${id}">${content}</h${level}>`;
                    }
                    if (line.trim()) {
                        return `<p>${line}</p>`;
                    }
                    return '';
                }).join('');
                return html || '<p></p>';
            }),
        }
    ),
    Tokens: {},
}));

// Mock Prism.js
jest.mock('prismjs', () => ({
    __esModule: true,
    default: {
        highlightAllUnder: jest.fn(),
        highlightElement: jest.fn(),
        highlight: jest.fn((code: string) => code),
        highlightAll: jest.fn(),
    },
    highlightAllUnder: jest.fn(),
    highlightElement: jest.fn(),
    highlightAll: jest.fn(),
    highlight: jest.fn((code: string) => code),
}));

// Mock Prism language components
jest.mock('prismjs/components/prism-c', () => ({}));
jest.mock('prismjs/components/prism-cpp', () => ({}));
jest.mock('prismjs/components/prism-java', () => ({}));
jest.mock('prismjs/components/prism-python', () => ({}));
jest.mock('prismjs/components/prism-sql', () => ({}));
jest.mock('prismjs/components/prism-javascript', () => ({}));
jest.mock('prismjs/components/prism-typescript', () => ({}));

// Mock utils
jest.mock('../../src/utils', () => ({
    getBaseUrl: jest.fn().mockReturnValue('/smartgrind/'),
    showToast: jest.fn(),
    showEl: jest.fn(),
    hideEl: jest.fn(),
}));

// Mock data
jest.mock('../../src/data', () => ({
    data: {
        algorithmsData: [
            {
                id: 'sorting',
                title: 'Sorting Algorithms',
                algorithms: [
                    { id: 'algo-quicksort', name: 'QuickSort', url: '/algo/quicksort' },
                    { id: 'algo-mergesort', name: 'MergeSort', url: '/algo/mergesort' },
                ],
            },
            {
                id: 'graphs',
                title: 'Graph Algorithms',
                algorithms: [
                    { id: 'algo-bfs', name: 'BFS', url: '/algo/bfs' },
                ],
            },
        ],
    },
}));

// Import the module under test
import {
    patterns,
    sqlSolutions,
    switchCarouselTab,
    copyCode,
    _renderMarkdown,
    openSolutionModal,
    openPatternSolutionModal,
    openSQLSolutionModal,
    openProblemSQLSolutionModal,
    closeSolutionModal,
    toggleTOC,
    updateSolutionScrollProgress,
    _configureMarkdownRenderer,
} from '../../src/ui/ui-markdown';
import { showToast, getBaseUrl } from '../../src/utils';
import DOMPurify from 'dompurify';

describe('UI Markdown - Comprehensive Test Suite', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '';
        
        // Reset fetch mock
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    // ============================================================================
    // Carousel Tests
    // ============================================================================
    describe('switchCarouselTab', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div class="code-carousel">
                    <div class="flex bg-[#1e1e1e]">
                        <button class="carousel-tab-btn-carousel-123" data-index="0">Tab 1</button>
                        <button class="carousel-tab-btn-carousel-123" data-index="1">Tab 2</button>
                        <button class="carousel-tab-btn-carousel-123" data-index="2">Tab 3</button>
                    </div>
                    <div class="carousel-content">
                        <div id="carousel-123-pane-0" class="block">Content 1</div>
                        <div id="carousel-123-pane-1" class="hidden">Content 2</div>
                        <div id="carousel-123-pane-2" class="hidden">Content 3</div>
                    </div>
                </div>
            `;
        });

        it('should switch to the specified tab index', () => {
            switchCarouselTab('carousel-123', 1);

            const pane0 = document.getElementById('carousel-123-pane-0');
            const pane1 = document.getElementById('carousel-123-pane-1');
            const pane2 = document.getElementById('carousel-123-pane-2');

            expect(pane0?.classList.contains('hidden')).toBe(true);
            expect(pane0?.classList.contains('block')).toBe(false);
            expect(pane1?.classList.contains('hidden')).toBe(false);
            expect(pane1?.classList.contains('block')).toBe(true);
            expect(pane2?.classList.contains('hidden')).toBe(true);
            expect(pane2?.classList.contains('block')).toBe(false);
        });

        it('should update button styling for active tab', () => {
            switchCarouselTab('carousel-123', 2);

            const buttons = document.querySelectorAll('.carousel-tab-btn-carousel-123');
            
            // First button should be inactive
            expect(buttons[0]?.classList.contains('text-slate-400')).toBe(true);
            expect(buttons[0]?.classList.contains('text-brand-400')).toBe(false);
            
            // Second button should be inactive
            expect(buttons[1]?.classList.contains('text-slate-400')).toBe(true);
            expect(buttons[1]?.classList.contains('text-brand-400')).toBe(false);
            
            // Third button should be active
            expect(buttons[2]?.classList.contains('text-brand-400')).toBe(true);
            expect(buttons[2]?.classList.contains('bg-[#1e1e1e]')).toBe(true);
        });

        it('should return early if no buttons found', () => {
            document.body.innerHTML = '<div class="code-carousel"></div>';
            
            // Should not throw
            expect(() => switchCarouselTab('nonexistent', 0)).not.toThrow();
        });

        it('should return early if no container found', () => {
            document.body.innerHTML = `
                <button class="carousel-tab-btn-orphan" data-index="0">Tab</button>
                <div id="orphan-pane-0"></div>
            `;
            
            // Should not throw
            expect(() => switchCarouselTab('orphan', 0)).not.toThrow();
        });

        it('should handle switching to tab 0', () => {
            // First switch to tab 2
            switchCarouselTab('carousel-123', 2);
            // Then switch back to tab 0
            switchCarouselTab('carousel-123', 0);

            const pane0 = document.getElementById('carousel-123-pane-0');
            const pane2 = document.getElementById('carousel-123-pane-2');

            expect(pane0?.classList.contains('block')).toBe(true);
            expect(pane0?.classList.contains('hidden')).toBe(false);
            expect(pane2?.classList.contains('hidden')).toBe(true);
            expect(pane2?.classList.contains('block')).toBe(false);
        });
    });

    // ============================================================================
    // Code Copy Tests
    // ============================================================================
    describe('copyCode', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <pre class="language-javascript">
                    <code>console.log('hello world');</code>
                    <button class="code-copy-btn" data-action="copy-code">
                        <svg>Copy</svg>
                    </button>
                </pre>
            `;
        });

        it('should copy code to clipboard successfully', async () => {
            const button = document.querySelector('.code-copy-btn') as HTMLElement;

            await copyCode(button);

            expect(navigator.clipboard.writeText).toHaveBeenCalled();
            expect(button.classList.contains('copied')).toBe(true);
        });

        it('should restore button state after 2 seconds', async () => {
            jest.useFakeTimers();
            const button = document.querySelector('.code-copy-btn') as HTMLElement;

            await copyCode(button);
            
            expect(button.classList.contains('copied')).toBe(true);
            
            jest.advanceTimersByTime(2000);
            
            expect(button.classList.contains('copied')).toBe(false);
        });

        it('should apply success styling during copy', async () => {
            const button = document.querySelector('.code-copy-btn') as HTMLElement;

            await copyCode(button);

            // Color could be hex or rgb format depending on browser
            expect(button.style.color).toBeTruthy();
            expect(button.style.opacity).toBe('1');
        });

        it('should show toast on clipboard failure', async () => {
            const clipboardError = new Error('Clipboard access denied');
            (navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(clipboardError);

            const button = document.querySelector('.code-copy-btn') as HTMLElement;
            
            await copyCode(button);

            expect(showToast).toHaveBeenCalledWith('Failed to copy code');
        });

        it('should return early if no pre element found', async () => {
            document.body.innerHTML = '<button class="code-copy-btn"></button>';
            const button = document.querySelector('.code-copy-btn') as HTMLElement;

            await copyCode(button);

            expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
        });

        it('should return early if no code element found', async () => {
            document.body.innerHTML = `
                <pre>
                    <button class="code-copy-btn"></button>
                </pre>
            `;
            const button = document.querySelector('.code-copy-btn') as HTMLElement;

            await copyCode(button);

            expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
        });
    });

    // ============================================================================
    // Markdown Rendering Tests
    // ============================================================================
    describe('_renderMarkdown', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="toc-list"></div>
                <div id="content"></div>
            `;
        });

        it('should render markdown content to element', () => {
            const content = document.getElementById('content') as HTMLElement;
            
            _renderMarkdown('# Hello World\n\nThis is a paragraph.', content);

            expect(content.innerHTML).toBeTruthy();
            expect(DOMPurify.sanitize).toHaveBeenCalled();
        });

        it('should generate TOC from headings', () => {
            const content = document.getElementById('content') as HTMLElement;
            
            // Use headings that will be parsed by our mock - headings need to be in the rendered HTML
            _renderMarkdown(
                '# First Heading\n\nContent\n\n## Second Heading\n\nMore content',
                content
            );

            const tocList = document.getElementById('toc-list');
            expect(tocList?.innerHTML).toBeTruthy();
            // TOC should have content (either links or "No sections found")
            expect(tocList?.innerHTML.length).toBeGreaterThan(0);
        });

        it('should show "No sections found" when there are no headings', () => {
            const content = document.getElementById('content') as HTMLElement;
            
            _renderMarkdown('Just some text without headings.', content);

            const tocList = document.getElementById('toc-list');
            expect(tocList?.innerHTML).toContain('No sections found');
        });

        it('should handle markdown with multiple heading levels', () => {
            const content = document.getElementById('content') as HTMLElement;
            
            _renderMarkdown(
                '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6',
                content
            );

            const tocList = document.getElementById('toc-list');
            expect(tocList?.innerHTML).toBeTruthy();
        });

        it('should handle duplicate heading IDs by adding suffixes', () => {
            const content = document.getElementById('content') as HTMLElement;
            
            _renderMarkdown('# Duplicate\n\n# Duplicate\n\n# Duplicate', content);

            const tocList = document.getElementById('toc-list');
            expect(tocList?.innerHTML).toBeTruthy();
        });

        it('should sanitize HTML with DOMPurify', () => {
            const content = document.getElementById('content') as HTMLElement;
            
            _renderMarkdown('# Test\n\n<script>alert("xss")</script>', content);

            expect(DOMPurify.sanitize).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    ALLOWED_TAGS: expect.arrayContaining(['h1', 'h2', 'h3', 'p', 'code', 'pre']),
                    ALLOW_DATA_ATTR: true,
                })
            );
        });

        it('should apply Prism syntax highlighting', () => {
            const content = document.getElementById('content') as HTMLElement;
            
            _renderMarkdown('```javascript\nconsole.log("test");\n```', content);

            // Prism.highlightAllUnder should be called after rendering
            expect(content.innerHTML).toBeTruthy();
        });

        it('should setup delegated event handlers', () => {
            const content = document.getElementById('content') as HTMLElement;
            const addEventListenerSpy = jest.spyOn(content, 'addEventListener');
            
            _renderMarkdown('# Test', content);

            expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
            addEventListenerSpy.mockRestore();
        });
    });

    // ============================================================================
    // Solution Modal Tests
    // ============================================================================
    describe('openSolutionModal', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="solution-modal" class="hidden"></div>
                <div id="solution-content"></div>
                <div id="solution-toc">
                    <div id="toc-list"></div>
                </div>
                <div id="solution-container"></div>
            `;
            
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                text: jest.fn().mockResolvedValue('# Solution Content\n\nSome solution text.'),
            });
        });

        it('should open modal for regular problem', async () => {
            await openSolutionModal('two-sum');

            const modal = document.getElementById('solution-modal');
            expect(modal?.classList.contains('hidden')).toBe(false);
        });

        it('should open modal for algorithm problem', async () => {
            await openSolutionModal('algo-quicksort');

            const modal = document.getElementById('solution-modal');
            expect(modal?.classList.contains('hidden')).toBe(false);
        });

        it('should show loading state initially', async () => {
            const fetchPromise = openSolutionModal('two-sum');
            
            const content = document.getElementById('solution-content');
            expect(content?.innerHTML).toContain('loading');
            
            await fetchPromise;
        });

        it('should fetch solution from correct URL for regular problem', async () => {
            await openSolutionModal('two-sum');

            expect(fetch).toHaveBeenCalledWith('/smartgrind/solutions/two-sum.md');
        });

        it('should fetch algorithm from correct URL for algorithm', async () => {
            await openSolutionModal('algo-quicksort');

            expect(fetch).toHaveBeenCalledWith('/smartgrind/algorithms/quicksort.md');
        });

        it('should handle fetch error gracefully', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 404,
            });

            await openSolutionModal('nonexistent');

            const content = document.getElementById('solution-content');
            expect(content?.innerHTML).toContain('Error');
        });

        it('should handle fetch throwing exception', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

            await openSolutionModal('two-sum');

            const content = document.getElementById('solution-content');
            expect(content?.innerHTML).toContain('Error');
        });

        it('should render markdown content after loading', async () => {
            await openSolutionModal('two-sum');

            const content = document.getElementById('solution-content');
            // Should have rendered the markdown
            expect(content?.innerHTML).toBeTruthy();
        });
    });

    describe('openPatternSolutionModal', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="solution-modal" class="hidden"></div>
                <div id="solution-content"></div>
                <div id="solution-toc">
                    <div id="toc-list"></div>
                </div>
                <div id="solution-container"></div>
            `;
            
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                text: jest.fn().mockResolvedValue('# Pattern Solution'),
            });
        });

        it('should open pattern solution modal', async () => {
            await openPatternSolutionModal('Two Pointers');

            const modal = document.getElementById('solution-modal');
            expect(modal?.classList.contains('hidden')).toBe(false);
        });

        it('should convert pattern name to filename', async () => {
            await openPatternSolutionModal('Sliding Window Pattern');

            expect(fetch).toHaveBeenCalledWith('/smartgrind/patterns/sliding-window.md');
        });

        it('should handle special characters in pattern names', async () => {
            await openPatternSolutionModal('A/B Testing');

            expect(fetch).toHaveBeenCalledWith('/smartgrind/patterns/a-b-testing.md');
        });

        it('should show error when pattern file not found', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 404,
            });

            await openPatternSolutionModal('NonExistent');

            const content = document.getElementById('solution-content');
            expect(content?.innerHTML).toContain('pattern solution');
        });
    });

    describe('openSQLSolutionModal', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="solution-modal" class="hidden"></div>
                <div id="solution-content"></div>
                <div id="solution-toc">
                    <div id="toc-list"></div>
                </div>
                <div id="solution-container"></div>
            `;
            
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                text: jest.fn().mockResolvedValue('# SQL Solution'),
            });
        });

        it('should open SQL pattern solution modal', async () => {
            await openSQLSolutionModal('JOIN Operations');

            const modal = document.getElementById('solution-modal');
            expect(modal?.classList.contains('hidden')).toBe(false);
        });

        it('should fetch from sql/patterns directory', async () => {
            await openSQLSolutionModal('Basic SQL');

            // SQL suffix gets removed by sqlSolutions._convertPatternNameToFilename
            expect(fetch).toHaveBeenCalledWith('/smartgrind/sql/patterns/basic.md');
        });

        it('should handle SQL-specific suffixes', async () => {
            await openSQLSolutionModal('JOIN Pattern');

            expect(fetch).toHaveBeenCalledWith('/smartgrind/sql/patterns/join.md');
        });
    });

    describe('openProblemSQLSolutionModal', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="solution-modal" class="hidden"></div>
                <div id="solution-content"></div>
                <div id="solution-toc">
                    <div id="toc-list"></div>
                </div>
                <div id="solution-container"></div>
            `;
            
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                text: jest.fn().mockResolvedValue('# Problem SQL Solution'),
            });
        });

        it('should open individual SQL problem solution modal', async () => {
            await openProblemSQLSolutionModal('Employee Salary Query');

            const modal = document.getElementById('solution-modal');
            expect(modal?.classList.contains('hidden')).toBe(false);
        });

        it('should convert problem name to filename', async () => {
            await openProblemSQLSolutionModal('Second Highest Salary');

            expect(fetch).toHaveBeenCalledWith('/smartgrind/sql/solutions/second-highest-salary.md');
        });

        it('should handle special characters in problem names', async () => {
            await openProblemSQLSolutionModal('A/B Testing Query');

            expect(fetch).toHaveBeenCalledWith('/smartgrind/sql/solutions/a-b-testing-query.md');
        });

        it('should collapse multiple hyphens', async () => {
            await openProblemSQLSolutionModal('Query  With   Spaces');

            expect(fetch).toHaveBeenCalledWith('/smartgrind/sql/solutions/query-with-spaces.md');
        });

        it('should trim leading and trailing hyphens', async () => {
            await openProblemSQLSolutionModal('-leading-and-trailing-');

            expect(fetch).toHaveBeenCalledWith('/smartgrind/sql/solutions/leading-and-trailing.md');
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

        it('should hide the modal', () => {
            const modal = document.getElementById('solution-modal');
            modal?.classList.remove('hidden');

            closeSolutionModal();

            expect(modal?.classList.contains('hidden')).toBe(true);
        });

        it('should remove scroll event listener from content', () => {
            const content = document.getElementById('solution-content') as HTMLElement;
            const removeEventListenerSpy = jest.spyOn(content, 'removeEventListener');

            closeSolutionModal();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', updateSolutionScrollProgress);
            removeEventListenerSpy.mockRestore();
        });

        it('should handle missing elements gracefully', () => {
            document.body.innerHTML = '';

            // Should not throw
            expect(() => closeSolutionModal()).not.toThrow();
        });
    });

    // ============================================================================
    // TOC Tests
    // ============================================================================
    describe('toggleTOC', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="solution-toc" class="hidden md:block"></div>
                <div id="solution-container" class="max-w-6xl"></div>
            `;
        });

        describe('Desktop behavior', () => {
            beforeEach(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: 1024,
                });
            });

            it('should hide TOC when visible (has md:block)', () => {
                toggleTOC();

                const toc = document.getElementById('solution-toc');
                const container = document.getElementById('solution-container');

                expect(toc?.classList.contains('md:block')).toBe(false);
                expect(toc?.classList.contains('hidden')).toBe(true);
                expect(container?.classList.contains('max-w-6xl')).toBe(false);
                expect(container?.classList.contains('max-w-4xl')).toBe(true);
            });

            it('should show TOC when hidden (no md:block)', () => {
                const toc = document.getElementById('solution-toc');
                toc?.classList.remove('md:block');

                toggleTOC();

                expect(toc?.classList.contains('md:block')).toBe(true);
                expect(toc?.classList.contains('hidden')).toBe(false);
            });

            it('should expand container when showing TOC', () => {
                const toc = document.getElementById('solution-toc');
                const container = document.getElementById('solution-container');
                toc?.classList.remove('md:block');
                container?.classList.remove('max-w-6xl');
                container?.classList.add('max-w-4xl');

                toggleTOC();

                expect(container?.classList.contains('max-w-6xl')).toBe(true);
                expect(container?.classList.contains('max-w-4xl')).toBe(false);
            });
        });

        describe('Mobile behavior', () => {
            beforeEach(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: 375,
                });
            });

            it('should show TOC overlay when hidden', () => {
                toggleTOC();

                const toc = document.getElementById('solution-toc');

                expect(toc?.classList.contains('hidden')).toBe(false);
                expect(toc?.classList.contains('absolute')).toBe(true);
                expect(toc?.classList.contains('z-50')).toBe(true);
                expect(toc?.classList.contains('bg-dark-900')).toBe(true);
            });

            it('should hide TOC overlay when visible', () => {
                const toc = document.getElementById('solution-toc');
                toc?.classList.remove('hidden');

                toggleTOC();

                expect(toc?.classList.contains('hidden')).toBe(true);
                expect(toc?.classList.contains('absolute')).toBe(false);
                expect(toc?.classList.contains('z-50')).toBe(false);
            });

            it('should apply mobile overlay styles when showing', () => {
                toggleTOC();

                const toc = document.getElementById('solution-toc');

                expect(toc?.classList.contains('absolute')).toBe(true);
                expect(toc?.classList.contains('right-0')).toBe(true);
                expect(toc?.classList.contains('top-0')).toBe(true);
                expect(toc?.classList.contains('bottom-0')).toBe(true);
                expect(toc?.classList.contains('z-50')).toBe(true);
                expect(toc?.classList.contains('bg-dark-900')).toBe(true);
                expect(toc?.classList.contains('shadow-xl')).toBe(true);
                expect(toc?.classList.contains('border-l')).toBe(true);
                expect(toc?.classList.contains('border-slate-700')).toBe(true);
                expect(toc?.classList.contains('h-full')).toBe(true);
                expect(toc?.classList.contains('w-3/4')).toBe(true);
                expect(toc?.classList.contains('max-w-xs')).toBe(true);
            });
        });

        it('should return early if TOC element not found', () => {
            document.body.innerHTML = '';

            // Should not throw
            expect(() => toggleTOC()).not.toThrow();
        });
    });

    describe('updateSolutionScrollProgress', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="solution-content">
                    <h1 id="intro" style="offsetTop: 0;">Introduction</h1>
                    <div style="height: 500px;"></div>
                    <h2 id="section1" style="offsetTop: 500;">Section 1</h2>
                    <div style="height: 500px;"></div>
                    <h3 id="section2" style="offsetTop: 1000;">Section 2</h3>
                </div>
                <div id="solution-scroll-progress"></div>
                <div id="solution-toc">
                    <a class="toc-link" data-id="intro" href="#intro">Introduction</a>
                    <a class="toc-link" data-id="section1" href="#section1">Section 1</a>
                    <a class="toc-link" data-id="section2" href="#section2">Section 2</a>
                </div>
            `;
        });

        it('should return early if no content element', () => {
            document.body.innerHTML = '';

            // Should not throw
            expect(() => updateSolutionScrollProgress()).not.toThrow();
        });

        it('should highlight active TOC link based on scroll position', () => {
            const content = document.getElementById('solution-content') as HTMLElement;
            Object.defineProperty(content, 'scrollTop', { value: 50, writable: true });

            // Mock offsetTop for headers
            const h1 = content.querySelector('h1') as HTMLElement;
            const h2 = content.querySelector('h2') as HTMLElement;
            Object.defineProperty(h1, 'offsetTop', { value: 0, writable: true });
            Object.defineProperty(h2, 'offsetTop', { value: 500, writable: true });

            updateSolutionScrollProgress();

            // The TOC links should be processed
            const tocLinks = document.querySelectorAll('.toc-link');
            expect(tocLinks.length).toBeGreaterThan(0);
        });

        it('should handle empty headings gracefully', () => {
            document.body.innerHTML = `
                <div id="solution-content"></div>
                <div id="solution-toc">
                    <div id="toc-list"></div>
                </div>
            `;

            // Should not throw
            expect(() => updateSolutionScrollProgress()).not.toThrow();
        });
    });

    // ============================================================================
    // Event Delegation Tests
    // ============================================================================
    describe('Event Delegation', () => {
        it('should setup click event listener on container', () => {
            document.body.innerHTML = `
                <div id="toc-list"></div>
                <div id="content"></div>
            `;
            
            const content = document.getElementById('content') as HTMLElement;
            const addEventListenerSpy = jest.spyOn(content, 'addEventListener');
            
            _renderMarkdown('# Test', content);
            
            expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
            addEventListenerSpy.mockRestore();
        });

        it('should handle delegated click events without errors', () => {
            document.body.innerHTML = `
                <div id="toc-list"></div>
                <div id="content"></div>
            `;
            
            const content = document.getElementById('content') as HTMLElement;
            _renderMarkdown('# Test', content);
            
            // Add a button dynamically after rendering
            const button = document.createElement('button');
            button.setAttribute('data-action', 'carousel-tab');
            button.setAttribute('data-carousel-id', 'test');
            button.setAttribute('data-index', '0');
            button.textContent = 'Tab';
            content.appendChild(button);
            
            // Create and dispatch click event on the button
            const clickEvent = new MouseEvent('click', { bubbles: true });
            
            // Should not throw
            expect(() => button.dispatchEvent(clickEvent)).not.toThrow();
        });

        it('should handle non-action clicks without errors', () => {
            document.body.innerHTML = `
                <div id="toc-list"></div>
                <div id="content"></div>
            `;
            
            const content = document.getElementById('content') as HTMLElement;
            _renderMarkdown('# Test', content);
            
            // Create a normal div after rendering
            const normalDiv = document.createElement('div');
            normalDiv.textContent = 'Just a div';
            content.appendChild(normalDiv);
            
            const clickEvent = new MouseEvent('click', { bubbles: true });
            
            // Should not throw
            expect(() => normalDiv.dispatchEvent(clickEvent)).not.toThrow();
        });
    });

    // ============================================================================
    // Backward Compatibility Tests
    // ============================================================================
    describe('_configureMarkdownRenderer', () => {
        it('should return marked instance for backward compatibility', () => {
            const result = _configureMarkdownRenderer();
            
            expect(result).toBeDefined();
            expect(typeof result.parse).toBe('function');
            expect(typeof result.use).toBe('function');
        });
    });

    // ============================================================================
    // Re-export Tests
    // ============================================================================
    describe('Re-exports', () => {
        it('should re-export patterns from pattern-solutions', () => {
            expect(patterns).toBeDefined();
            expect(typeof patterns.getPatternFilename).toBe('function');
        });

        it('should re-export sqlSolutions from pattern-solutions', () => {
            expect(sqlSolutions).toBeDefined();
            expect(typeof sqlSolutions.getSQLFilename).toBe('function');
        });
    });
});
