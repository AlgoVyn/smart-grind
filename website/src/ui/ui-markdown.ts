// --- MARKDOWN RENDERING AND SOLUTION MODAL ---
// Includes pattern to markdown file mapping functionality

import { utils } from '../utils';
import { data } from '../data';
import DOMPurify from 'dompurify';

// --- PATTERN TO MARKDOWN FILE MAPPING SYSTEM ---
// Handles naming inconsistencies between pattern names and solution filenames

let currentTOC: { id: string; text: string; level: number }[] = [];

export const patterns = {
    // Function to get the correct filename for a pattern
    getPatternFilename(patternName: string) {
        // Use the automatic conversion for all patterns
        return this._convertPatternNameToFilename(patternName);
    },

    // Internal function for automatic pattern name to filename conversion
    _convertPatternNameToFilename(patternName: string) {
        // Convert to lowercase and replace special characters with hyphens
        let cleaned = patternName
            .toLowerCase()
            .replace(/[\s/()&`'+-]+/g, '-') // Replace spaces and special chars with hyphens
            .replace(/-+/g, '-') // Collapse multiple hyphens
            .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end

        // Remove common suffix patterns that don't add value
        cleaned = cleaned
            .replace(/-pattern$/, '')
            .replace(/-algorithm$/, '')
            .replace(/-approach$/, '')
            .replace(/-method$/, '')
            .replace(/-technique$/, '')
            .replace(/-style$/, '');

        return cleaned;
    },

    // Function to check if a pattern solution file exists
    async checkPatternSolutionExists(patternName: string) {
        const filename = this.getPatternFilename(patternName);
        const solutionFile = `${utils.getBaseUrl()}patterns/${filename}.md`;

        try {
            const response = await fetch(solutionFile, { method: 'HEAD' });
            return response.ok;
        } catch (_error) {
            return false;
        }
    },
};

// Helper to configure markdown renderer
export const _configureMarkdownRenderer = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const marked = (
        window as unknown as {
            marked?: {
                setOptions: (_opts: { breaks: boolean; gfm: boolean }) => void;
                Renderer: new () => {
                    code: (
                        _code: string | { lang: string; text: string },
                        _language: string
                    ) => string;
                };
            };
        }
    ).marked;
    if (!marked) return null;

    marked.setOptions({
        breaks: true,
        gfm: true,
    });

    // Custom renderer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderer = new (window as any).marked.Renderer();

    // Helper to escape HTML in code blocks
    const escapeHtml = (unsafe: string) => {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '<')
            .replace(/>/g, '>')
            .replace(/"/g, '"')
            .replace(/'/g, '&#039;');
    };

    renderer.code = (code: string | { lang: string; text: string }, language: string) => {
        // Handle both object and string parameters (marked update compatibility)
        if (typeof code === 'object') {
            language = code.lang;
            code = code.text;
        }

        // CAROUSEL SUPPORT
        if (language === 'carousel') {
            const uniqueId = 'carousel-' + Math.random().toString(36).substr(2, 9);
            const slides = code
                .split(/<!--\s*slide\s*-->/)
                .filter((s: string) => s.trim().length > 0);

            let tabsHtml = '<div class="flex bg-[#1e1e1e] overflow-x-auto">';
            let panesHtml = '<div class="carousel-content bg-[#1e1e1e]">'; // Default dark background for code

            slides.forEach((slide: string, index: number) => {
                // Extract language and code from the inner fenced block
                // Matches: ```lang \n content ```
                const match = slide.match(/```(\S+)\s*\n?([\s\S]*?)```/);
                let innerLang = 'text';
                let innerCode = slide;

                if (match) {
                    innerLang = match[1]!;
                    innerCode = match[2]!; // inner code
                }

                // Escape the inner code
                innerCode = escapeHtml(innerCode);

                const displayName =
                    innerLang === 'cpp'
                        ? 'C++'
                        : innerLang === 'javascript'
                          ? 'JavaScript'
                          : innerLang.charAt(0).toUpperCase() + innerLang.slice(1);

                // Tab Button
                const activeTabClass =
                    index === 0
                        ? 'text-brand-400 bg-[#1e1e1e]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50';

                tabsHtml += `
                    <button onclick="window.SmartGrind.ui.switchCarouselTab('${uniqueId}', ${index})" 
                            class="carousel-tab-btn-${uniqueId} px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${activeTabClass}" 
                            data-index="${index}">
                        ${displayName}
                    </button>`;

                // Pane Content
                const displayClass = index === 0 ? 'block' : 'hidden';
                const langClass = `language-${innerLang}`;

                // Copy Button (Absolute positioned inside the pane)
                const copyBtn =
                    '<button class="code-copy-btn absolute top-3 right-3 p-1.5 text-white/40 hover:text-white bg-slate-700/30 hover:bg-slate-600 rounded opacity-0 group-hover:opacity-100 transition-all z-10" onclick="window.SmartGrind.ui.copyCode(this)" title="Copy Code"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>';

                panesHtml += `
                    <div id="${uniqueId}-pane-${index}" class="${displayClass}">
                        <pre class="${langClass} !m-0 !rounded-t-none !border-0 !shadow-none !bg-transparent relative"><code class="${langClass} !shadow-none !bg-transparent !border-0">${innerCode}</code>${copyBtn}</pre>
                    </div>`;
            });

            tabsHtml += '</div>';
            panesHtml += '</div>';

            return `<div class="code-carousel mb-6 rounded-lg overflow-hidden">${tabsHtml}${panesHtml}</div>`;
        }

        // STANDARD CODE BLOCK
        const langClass = language ? `language-${language}` : 'language-text';

        // Escape the code for standard blocks
        const escapedCode = escapeHtml(code);

        // Use the same refined copy button style
        const copyBtn =
            '<button class="code-copy-btn absolute top-3 right-3 p-1.5 text-white/40 hover:text-white bg-slate-700/30 hover:bg-slate-600 rounded opacity-0 group-hover:opacity-100 transition-all z-10" onclick="window.SmartGrind.ui.copyCode(this)" title="Copy Code"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>';

        return `<div class="relative mb-4 rounded-lg overflow-hidden bg-[#1e1e1e]">
            <pre class="${langClass} !m-0 !border-0 !shadow-none !bg-transparent relative"><code class="${langClass} !bg-transparent !border-0">${escapedCode}</code>${copyBtn}</pre>
        </div>`;
    };

    renderer.heading = (
        text: string | { text: string; depth?: number; raw?: string },
        level: number,
        raw?: string
    ) => {
        let headingText = '';
        let headingLevel = level;
        let headingRaw = raw;

        // Handle object input (token) from newer marked versions
        if (typeof text === 'object' && text !== null) {
            const token = text as { text: string; depth?: number; raw?: string };
            headingText = token.text || '';
            if (token.depth) headingLevel = token.depth;
            if (token.raw) headingRaw = token.raw;
        } else {
            headingText = String(text || '');
        }

        // Ensure inputs are strings to prevent runtime errors
        const idSource = headingRaw || headingText || '';
        let id = String(idSource)
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');

        // Handle duplicate IDs
        const existingCount = currentTOC.filter(
            (item) => item.id.replace(/-\d+$/, '') === id
        ).length;
        if (existingCount > 0) {
            id = `${id}-${existingCount}`;
        }

        // Strip HTML tags from text for TOC display
        const plainText = headingText.replace(/<[^>]*>?/gm, '');
        currentTOC.push({ id, text: plainText, level: headingLevel });

        return `<h${headingLevel} id="${id}" class="scroll-mt-24 mb-4 mt-8 font-bold text-theme-bold group flex items-center gap-2">
            ${headingText}
            <a href="#${id}" class="opacity-0 group-hover:opacity-100 text-theme-muted hover:text-brand-500 transition-opacity" onclick="event.preventDefault(); document.getElementById('${id}').scrollIntoView({behavior: 'smooth'})">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
            </a>
        </h${headingLevel}>`;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).marked.setOptions({
        renderer: renderer,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).marked;
};

// Switch Carousel Tab
export const switchCarouselTab = (uniqueId: string, index: number) => {
    // Update Buttons
    const buttons = document.querySelectorAll(`.carousel-tab-btn-${uniqueId}`);
    buttons.forEach((btn) => {
        const htmlBtn = btn as HTMLElement;
        if (parseInt(htmlBtn.dataset['index'] || '0') === index) {
            btn.classList.remove('text-slate-400', 'hover:text-slate-200', 'hover:bg-slate-800/50');
            btn.classList.add('text-brand-400', 'bg-[#1e1e1e]');
        } else {
            btn.classList.add('text-slate-400', 'hover:text-slate-200', 'hover:bg-slate-800/50');
            btn.classList.remove('text-brand-400', 'bg-[#1e1e1e]');
        }
    });

    // Update Panes
    // Hide all panes for this carousel first? No, we can just find them by ID pattern or parent
    // But IDs are reliable: uniqueId-pane-X

    // We don't know how many panes, so iterate until element not found, or select by query
    const container = buttons[0]?.closest('.code-carousel');
    if (!container) return;
    const allPanes = container.querySelectorAll('[id^="' + uniqueId + '-pane-"]');

    allPanes.forEach((pane) => {
        pane.classList.add('hidden');
        pane.classList.remove('block');
    });

    const activePane = document.getElementById(`${uniqueId}-pane-${index}`);
    if (activePane) {
        activePane.classList.remove('hidden');
        activePane.classList.add('block');
    }
};

// Copy code to clipboard
export const copyCode = (btn: HTMLElement) => {
    const pre = btn.closest('pre');
    if (!pre) return;
    const codeEl = pre.querySelector('code');
    if (!codeEl) return;
    const code = codeEl.innerText;
    const originalHTML = btn.innerHTML;
    navigator.clipboard
        .writeText(code)
        .then(() => {
            btn.classList.add('copied');
            btn.style.color = '#4da6ff'; // Brand color for success
            btn.style.opacity = '1';
            btn.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#4da6ff"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.style.color = '';
                btn.style.opacity = '';
                btn.innerHTML = originalHTML;
            }, 2000);
        })
        .catch(() => {
            utils.showToast('Failed to copy code');
        });
};

// Helper to separate TOC rendering logic
const _renderTOC = () => {
    const tocList = document.getElementById('toc-list');
    if (!tocList) return;

    if (currentTOC.length === 0) {
        tocList.innerHTML =
            '<li class="text-xs text-theme-muted italic pl-3">No sections found</li>';
        return;
    }

    const html = currentTOC
        .map((item) => {
            // Indent based on level (h1=0, h2=1, etc. relative to min)
            // But usually h1 is title, h2 are sections.
            // Let's just do simple indentation.
            let paddingLeft = 0.75; // default for h1/h2
            if (item.level > 2) {
                paddingLeft = (item.level - 2) * 0.75 + 0.75;
            }

            return `
            <a href="#${item.id}" 
               class="toc-link block text-xs py-1.5 border-l-2 border-transparent text-theme-muted hover:text-theme-base transition-colors truncate"
               style="padding-left: ${paddingLeft}rem"
               data-id="${item.id}"
               onclick="event.preventDefault(); document.getElementById('${item.id}')?.scrollIntoView({behavior: 'smooth'});">
                ${item.text}
            </a>
        `;
        })
        .join('');

    tocList.innerHTML = html;
};

// Helper to render markdown content
// SECURITY: Sanitizes HTML with DOMPurify before inserting into DOM to prevent XSS
export const _renderMarkdown = (markdown: string, contentElement: HTMLElement) => {
    const marked = _configureMarkdownRenderer();
    if (!marked) {
        contentElement.innerHTML =
            '<p>Error: Markdown renderer not loaded. Please check your internet connection.</p>';
        return;
    }

    currentTOC = [];
    const html = marked.parse(markdown);

    // SECURITY: Sanitize HTML before inserting into DOM to prevent XSS attacks
    // Allow specific tags and attributes needed for code highlighting and interactive elements
    const sanitizedHtml = DOMPurify.sanitize(html, {
        // Allow common HTML elements needed for markdown rendering
        ALLOWED_TAGS: [
            // Standard markdown elements
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'p',
            'br',
            'hr',
            'ul',
            'ol',
            'li',
            'blockquote',
            'pre',
            'code',
            'strong',
            'em',
            'b',
            'i',
            'u',
            's',
            'del',
            'ins',
            'a',
            'img',
            'table',
            'thead',
            'tbody',
            'tr',
            'th',
            'td',
            'div',
            'span',
            // Custom elements for code carousel and UI
            'button',
            'svg',
            'path',
            'polyline',
            'line',
            'circle',
            'g',
            // Allow data attributes for syntax highlighting
        ],
        ALLOWED_ATTR: [
            // Standard attributes
            'href',
            'src',
            'alt',
            'title',
            'width',
            'height',
            'id',
            'class',
            'style',
            // Custom data attributes
            'data-index',
            'data-id',
            'data-action',
            // SVG attributes
            'viewBox',
            'fill',
            'stroke',
            'stroke-width',
            'stroke-linecap',
            'stroke-linejoin',
            'd',
            'x1',
            'x2',
            'y1',
            'y2',
            'cx',
            'cy',
            'r',
            'points',
            'xmlns',
            'clip-path',
            'fill-rule',
            'clip-rule',
            // Event handlers (needed for carousel and copy functionality)
            'onclick',
            // Accessibility
            'aria-label',
            'aria-hidden',
            'role',
        ],
        // Allow data: URIs for images (needed for some inline images)
        ALLOW_DATA_ATTR: true,
        // Allow specific URI protocols
        ALLOWED_URI_REGEXP:
            /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
    });

    contentElement.innerHTML = sanitizedHtml;

    _renderTOC();

    // Apply syntax highlighting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prism = (
        window as unknown as { Prism?: { highlightAllUnder: (_element: HTMLElement) => void } }
    ).Prism;
    if (prism) {
        prism.highlightAllUnder(contentElement);
    }
};

const _loadSolution = (
    solutionFile: string,
    loadingText: string,
    errorPrefix: string,
    extraErrorText = ''
) => {
    const modal = document.getElementById('solution-modal');
    const content = document.getElementById('solution-content');
    if (!modal || !content) return;

    // Show loading
    content.innerHTML = `<div class="loading flex items-center justify-center min-h-[200px]"><div class="w-8 h-8 border-4 border-slate-800 border-t-brand-500 rounded-full animate-spin"></div><span class="ml-3 text-theme-muted">${loadingText}</span></div>`;
    modal.classList.remove('hidden');

    fetch(solutionFile)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load ${errorPrefix} file (status: ${response.status})`);
            }
            return response.text();
        })
        .then((markdown) => {
            _renderMarkdown(markdown, content);
        })
        .then(() => {
            content.addEventListener('scroll', updateSolutionScrollProgress);
            updateSolutionScrollProgress();
        })
        .catch((error) => {
            content.innerHTML =
                `<p>Error loading ${errorPrefix}: ${error.message}</p>` +
                `<p>File: ${solutionFile}</p>${extraErrorText}`;
        });
};

// Open solution modal
export const openSolutionModal = (problemId: string) => {
    // Check if this is an algorithm by looking up in algorithms data
    const isAlgorithm = data.algorithmsData.some((cat) =>
        cat.algorithms.some((algo) => algo.id === problemId)
    );
    const solutionFile = isAlgorithm
        ? `${utils.getBaseUrl()}algorithms/${problemId}.md`
        : `${utils.getBaseUrl()}solutions/${problemId}.md`;
    _loadSolution(
        solutionFile,
        isAlgorithm ? 'Loading algorithm...' : 'Loading solution...',
        isAlgorithm ? 'algorithm' : 'solution',
        isAlgorithm ? '<p>This algorithm may not have a dedicated file yet.</p>' : ''
    );
};

// Open pattern solution modal
export const openPatternSolutionModal = (patternName: string) => {
    const patternFilename = patterns.getPatternFilename(patternName);
    const solutionFile = `${utils.getBaseUrl()}patterns/${patternFilename}.md`;
    _loadSolution(
        solutionFile,
        'Loading pattern solution...',
        'pattern solution',
        '<p>This pattern may not have a dedicated solution file yet.</p>'
    );
};

// Close solution modal
export const closeSolutionModal = () => {
    const modal = document.getElementById('solution-modal');
    if (modal) {
        modal.classList.add('hidden');
    }

    // Clean up scroll progress
    const content = document.getElementById('solution-content');
    if (content) {
        content.removeEventListener('scroll', updateSolutionScrollProgress);
    }
    const progressBar = document.getElementById('solution-scroll-progress');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
};

// Update solution scroll progress bar and TOC active state
export const updateSolutionScrollProgress = () => {
    const content = document.getElementById('solution-content');
    if (!content) return;

    const scrollTop = content.scrollTop;
    const scrollHeight = content.scrollHeight;
    const clientHeight = content.clientHeight;
    const maxScroll = scrollHeight - clientHeight;
    const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

    const progressBar = document.getElementById('solution-scroll-progress');
    if (progressBar) {
        progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
    }

    // TOC Scroll Spy
    // Find the current active header
    const headers = Array.from(content.querySelectorAll('h1, h2, h3'));
    let activeId = '';

    // Offset for sticky headers or padding
    const offset = 100;

    for (const header of headers) {
        const top = (header as HTMLElement).offsetTop;
        if (scrollTop >= top - offset) {
            activeId = header.id;
        } else {
            break;
        }
    }

    // If activeId is empty and we are at top, maybe pick first?
    if (!activeId && headers.length > 0 && scrollTop < 100) {
        activeId = headers[0]?.id || '';
    }

    // Update TOC classes
    const tocLinks = document.querySelectorAll('.toc-link');
    tocLinks.forEach((link) => {
        if (link.getAttribute('data-id') === activeId) {
            link.classList.add(
                'text-brand-400',
                'font-medium',
                'border-l-2',
                'border-brand-500',
                'bg-brand-500/10',
                'pl-2'
            );
            link.classList.remove(
                'text-theme-muted',
                'hover:text-theme-base',
                'border-l-2',
                'border-transparent',
                'pl-3'
            );

            // Scroll TOC to keep active item in view
            const tocContainer = document.getElementById('solution-toc');
            if (tocContainer) {
                const linkTop = (link as HTMLElement).offsetTop;
                const containerHeight = tocContainer.clientHeight;
                const containerScroll = tocContainer.scrollTop;

                if (linkTop < containerScroll || linkTop > containerScroll + containerHeight) {
                    (link as HTMLElement).scrollIntoView({ block: 'nearest' });
                }
            }
        } else {
            link.classList.remove(
                'text-brand-400',
                'font-medium',
                'border-l-2',
                'border-brand-500',
                'bg-brand-500/10',
                'pl-2'
            );
            link.classList.add(
                'text-theme-muted',
                'hover:text-theme-base',
                'border-l-2',
                'border-transparent',
                'pl-3'
            );
        }
    });
};

// Toggle TOC visibility with support for both mobile (overlay) and desktop (layout)
export const toggleTOC = () => {
    const toc = document.getElementById('solution-toc');
    const container = document.getElementById('solution-container');
    if (!toc) return;

    const isDesktop = window.innerWidth >= 768; // Tailwind md breakpoint

    if (isDesktop) {
        // Desktop Toggle Logic
        // In desktop, the sidebar is controlled by 'md:block' (visible).
        // To hide it, we must ensure it has 'hidden' and does NOT have 'md:block'.

        if (toc.classList.contains('md:block')) {
            // HIDE
            toc.classList.remove('md:block');
            toc.classList.add('hidden');

            // Shrink container
            if (container) {
                container.classList.remove('max-w-6xl');
                container.classList.add('max-w-4xl');
            }
        } else {
            // SHOW
            toc.classList.add('md:block');
            toc.classList.remove('hidden');

            // Expand container
            if (container) {
                container.classList.remove('max-w-4xl');
                container.classList.add('max-w-6xl');
            }

            // Ensure no leftover mobile overlay classes
            toc.classList.remove(
                'absolute',
                'right-0',
                'top-0',
                'bottom-0',
                'z-50',
                'bg-dark-900',
                'shadow-xl',
                'border-l',
                'border-slate-700',
                'h-full'
            );
        }
    } else {
        // Mobile Toggle Logic (Overlay)
        // Ensure container is wide enough on mobile? Usually max-w-full or similar matters less, but let's keep it consistent.
        // Actually on mobile max-w-6xl or 4xl creates same width (100% usually with padding).

        if (toc.classList.contains('hidden')) {
            // SHOW (Overlay)
            toc.classList.remove('hidden');
            // Increased Z-Index to 50 to beat code blocks
            toc.classList.add(
                'absolute',
                'right-0',
                'top-0',
                'bottom-0',
                'z-50',
                'bg-dark-900',
                'shadow-xl',
                'border-l',
                'border-slate-700',
                'h-full',
                'w-3/4',
                'max-w-xs'
            );
        } else {
            // HIDE
            toc.classList.add('hidden');
            toc.classList.remove(
                'absolute',
                'right-0',
                'top-0',
                'bottom-0',
                'z-50',
                'bg-dark-900',
                'shadow-xl',
                'border-l',
                'border-slate-700',
                'h-full',
                'w-3/4',
                'max-w-xs'
            );
        }
    }
};
