// --- MARKDOWN RENDERING AND SOLUTION MODAL ---
// Markdown rendering, syntax highlighting, and solution modal functionality
// NOW USING BUNDLED NPM PACKAGES for offline support

import { getBaseUrl, showToast } from '../utils';
import { data } from '../data';
import { patterns, sqlSolutions } from './pattern-solutions';
import DOMPurify from 'dompurify';

// BUNDLED DEPENDENCIES - Self-hosted for offline PWA support
import { marked, type Tokens } from 'marked';
import Prism from 'prismjs';

// Import Prism language components for syntax highlighting
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';

// Re-export pattern functions for backward compatibility
export { patterns, sqlSolutions };

// --- TABLE OF CONTENTS ---
let currentTOC: { id: string; text: string; level: number }[] = [];

// Helper to escape HTML in code blocks
const escapeHtml = (unsafe: string): string => {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

// Custom renderer using marked's use extension point
const customRenderer = {
    // Handle code blocks with carousel support
    code(token: Tokens.Code): string {
        const { text, lang } = token;
        const code = text;
        const language = lang;

        // CAROUSEL SUPPORT
        if (language === 'carousel') {
            const uniqueId = 'carousel-' + Math.random().toString(36).substr(2, 9);
            const slides = code
                .split(/<!--\s*slide\s*-->/)
                .filter((s: string) => s.trim().length > 0);

            let tabsHtml = '<div class="flex bg-[#1e1e1e] overflow-x-auto">';
            let panesHtml = '<div class="carousel-content bg-[#1e1e1e]">';

            slides.forEach((slide: string, index: number) => {
                const match = slide.match(/```(\S+)\s*\n?([\s\S]*?)```/);
                let innerLang = 'text';
                let innerCode = slide;

                if (match) {
                    innerLang = match[1]!;
                    innerCode = match[2]!;
                }

                innerCode = escapeHtml(innerCode);

                const displayName =
                    innerLang === 'cpp'
                        ? 'C++'
                        : innerLang === 'javascript'
                          ? 'JavaScript'
                          : innerLang.charAt(0).toUpperCase() + innerLang.slice(1);

                const activeTabClass =
                    index === 0
                        ? 'text-brand-400 bg-[#1e1e1e]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50';

                tabsHtml += `
                    <button data-action="carousel-tab" data-carousel-id="${uniqueId}" data-index="${index}"
                            class="carousel-tab-btn-${uniqueId} px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${activeTabClass}" 
                            data-index="${index}">
                        ${displayName}
                    </button>`;

                const displayClass = index === 0 ? 'block' : 'hidden';
                const langClass = `language-${innerLang}`;

                const copyBtn =
                    '<button class="code-copy-btn absolute top-3 right-3 p-1.5 text-white/40 hover:text-white bg-slate-700/30 hover:bg-slate-600 rounded opacity-0 group-hover:opacity-100 transition-all z-10" data-action="copy-code" title="Copy Code"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>';

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
        const escapedCode = escapeHtml(code);

        const copyBtn =
            '<button class="code-copy-btn absolute top-3 right-3 p-1.5 text-white/40 hover:text-white bg-slate-700/30 hover:bg-slate-600 rounded opacity-0 group-hover:opacity-100 transition-all z-10" data-action="copy-code" title="Copy Code"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>';

        return `<div class="relative mb-4 rounded-lg overflow-hidden bg-[#1e1e1e]">
            <pre class="${langClass} !m-0 !border-0 !shadow-none !bg-transparent relative"><code class="${langClass} !bg-transparent !border-0">${escapedCode}</code>${copyBtn}</pre>
        </div>`;
    },

    // Handle headings with TOC support
    heading(token: Tokens.Heading): string {
        const { text, depth } = token;
        const headingText = text;
        const headingLevel = depth;
        const headingRaw = text;

        const idSource = headingRaw || headingText || '';
        let id = String(idSource)
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s/()&`'+-]+/g, '-');

        const existingCount = currentTOC.filter(
            (item) => item.id.replace(/-\d+$/, '') === id
        ).length;
        if (existingCount > 0) {
            id = `${id}-${existingCount}`;
        }

        const plainText = headingText.replace(/<[^>]*>?/gm, '');
        currentTOC.push({ id, text: plainText, level: headingLevel });

        return `<h${headingLevel} id="${id}" class="scroll-mt-24 mb-4 mt-8 font-bold text-theme-bold group flex items-center gap-2">
            ${headingText}
            <a href="#${id}" class="opacity-0 group-hover:opacity-100 text-theme-muted hover:text-brand-500 transition-opacity" data-action="scroll-to-heading" data-target="${id}">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
            </a>
        </h${headingLevel}>`;
    },
};

// Configure marked with custom extensions
marked.use({ renderer: customRenderer });

// Switch Carousel Tab
export const switchCarouselTab = (uniqueId: string, index: number) => {
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
export const copyCode = async (btn: HTMLElement) => {
    const pre = btn.closest('pre');
    if (!pre) return;
    const codeEl = pre.querySelector('code');
    if (!codeEl) return;
    const code = codeEl.innerText;
    const originalHTML = btn.innerHTML;

    try {
        await navigator.clipboard.writeText(code);
        btn.classList.add('copied');
        btn.style.color = '#4da6ff';
        btn.style.opacity = '1';
        btn.innerHTML =
            '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#4da6ff"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.style.color = '';
            btn.style.opacity = '';
            btn.innerHTML = originalHTML;
        }, 2000);
    } catch {
        showToast('Failed to copy code');
    }
};

/**
 * SECURITY: Sets up delegated event handlers for interactive elements in markdown content.
 */
const _setupDelegatedEventHandlers = (container: HTMLElement) => {
    container.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;

        const carouselTab = target.closest('[data-action="carousel-tab"]') as HTMLElement | null;
        if (carouselTab) {
            const carouselId = carouselTab.dataset['carouselId'];
            const index = parseInt(carouselTab.dataset['index'] || '0', 10);
            if (carouselId) {
                switchCarouselTab(carouselId, index);
            }
            return;
        }

        const copyBtn = target.closest('[data-action="copy-code"]') as HTMLElement | null;
        if (copyBtn) {
            copyCode(copyBtn);
            return;
        }

        const scrollLink = target.closest(
            '[data-action="scroll-to-heading"]'
        ) as HTMLElement | null;
        if (scrollLink) {
            e.preventDefault();
            const targetId = scrollLink.dataset['target'];
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
            return;
        }
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
            let paddingLeft = 0.75;
            if (item.level > 2) {
                paddingLeft = (item.level - 2) * 0.75 + 0.75;
            }

            return `
            <a href="#${item.id}" 
               class="toc-link block text-xs py-1.5 border-l-2 border-transparent text-theme-muted hover:text-theme-base transition-colors truncate"
               style="padding-left: ${paddingLeft}rem"
               data-id="${item.id}"
               data-action="scroll-to-heading"
               data-target="${item.id}">
                ${item.text}
            </a>
        `;
        })
        .join('');

    tocList.innerHTML = html;
};

/**
 * Helper to render markdown content
 * SECURITY: Sanitizes HTML with DOMPurify before inserting into DOM
 */
export const _renderMarkdown = (markdown: string, contentElement: HTMLElement) => {
    currentTOC = [];
    const html = marked.parse(markdown) as string;

    const sanitizedHtml = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
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
            'button',
            'svg',
            'path',
            'polyline',
            'line',
            'circle',
            'g',
        ],
        ALLOWED_ATTR: [
            'href',
            'src',
            'alt',
            'title',
            'width',
            'height',
            'id',
            'class',
            'style',
            'data-index',
            'data-id',
            'data-action',
            'data-target',
            'data-carousel-id',
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
            'aria-label',
            'aria-hidden',
            'role',
        ],
        ALLOW_DATA_ATTR: true,
        ALLOWED_URI_REGEXP:
            /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
    });

    contentElement.innerHTML = sanitizedHtml;

    _setupDelegatedEventHandlers(contentElement);
    _renderTOC();

    // Apply syntax highlighting using bundled Prism
    Prism.highlightAllUnder(contentElement);
};

const _loadSolution = async (
    solutionFile: string,
    loadingText: string,
    errorPrefix: string,
    extraErrorText = ''
) => {
    const modal = document.getElementById('solution-modal');
    const content = document.getElementById('solution-content');
    if (!modal || !content) return;

    content.innerHTML = `<div class="loading flex items-center justify-center min-h-[200px]"><div class="w-8 h-8 border-4 border-slate-800 border-t-brand-500 rounded-full animate-spin"></div><span class="ml-3 text-theme-muted">${loadingText}</span></div>`;
    modal.classList.remove('hidden');

    try {
        const response = await fetch(solutionFile);
        if (!response.ok) {
            throw new Error(`Failed to load ${errorPrefix} file (status: ${response.status})`);
        }
        const markdown = await response.text();
        _renderMarkdown(markdown, content);
        content.addEventListener('scroll', updateSolutionScrollProgress);
        updateSolutionScrollProgress();
    } catch (error) {
        content.innerHTML =
            `<p>Error loading ${errorPrefix}: ${error instanceof Error ? error.message : String(error)}</p>` +
            `<p>File: ${solutionFile}</p>${extraErrorText}`;
    }
};

// Open solution modal
export const openSolutionModal = (problemId: string) => {
    const isAlgorithm = data.algorithmsData.some((cat) =>
        cat.algorithms.some((algo) => algo.id === problemId)
    );
    const fileId = isAlgorithm ? problemId.replace(/^algo-/, '') : problemId;
    const solutionFile = isAlgorithm
        ? `${getBaseUrl()}algorithms/${fileId}.md`
        : `${getBaseUrl()}solutions/${fileId}.md`;
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
    const solutionFile = `${getBaseUrl()}patterns/${patternFilename}.md`;
    _loadSolution(
        solutionFile,
        'Loading pattern solution...',
        'pattern solution',
        '<p>This pattern may not have a dedicated solution file yet.</p>'
    );
};

// Open SQL solution modal
export const openSQLSolutionModal = (patternName: string) => {
    const sqlFilename = sqlSolutions.getSQLFilename(patternName);
    const solutionFile = `${getBaseUrl()}sql/patterns/${sqlFilename}.md`;
    _loadSolution(
        solutionFile,
        'Loading SQL solution...',
        'SQL solution',
        '<p>This SQL pattern may not have a dedicated solution file yet.</p>'
    );
};

// Open individual SQL problem solution modal
export const openProblemSQLSolutionModal = (problemName: string) => {
    const fileName = problemName
        .toLowerCase()
        .replace(/[\s/()&`'+-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    const solutionFile = `${getBaseUrl()}sql/solutions/${fileName}.md`;
    _loadSolution(
        solutionFile,
        'Loading SQL problem solution...',
        'SQL problem solution',
        '<p>This SQL problem may not have a dedicated solution file yet.</p>'
    );
};

// Close solution modal
export const closeSolutionModal = () => {
    const modal = document.getElementById('solution-modal');
    if (modal) {
        modal.classList.add('hidden');
    }

    const content = document.getElementById('solution-content');
    if (content) {
        content.removeEventListener('scroll', updateSolutionScrollProgress);
    }
};

// Update solution scroll progress bar and TOC active state
export const updateSolutionScrollProgress = () => {
    const content = document.getElementById('solution-content');
    if (!content) return;

    const scrollTop = content.scrollTop;
    const headers = Array.from(content.querySelectorAll('h1, h2, h3'));
    let activeId = '';
    const offset = 100;

    for (const header of headers) {
        const top = (header as HTMLElement).offsetTop;
        if (scrollTop >= top - offset) {
            activeId = header.id;
        } else {
            break;
        }
    }

    if (!activeId && headers.length > 0 && scrollTop < 100) {
        activeId = headers[0]?.id || '';
    }

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

// Toggle TOC visibility
export const toggleTOC = () => {
    const toc = document.getElementById('solution-toc');
    const container = document.getElementById('solution-container');
    if (!toc) return;

    const isDesktop = window.innerWidth >= 768;

    if (isDesktop) {
        if (toc.classList.contains('md:block')) {
            toc.classList.remove('md:block');
            toc.classList.add('hidden');
            if (container) {
                container.classList.remove('max-w-6xl');
                container.classList.add('max-w-4xl');
            }
        } else {
            toc.classList.add('md:block');
            toc.classList.remove('hidden');
            if (container) {
                container.classList.remove('max-w-4xl');
                container.classList.add('max-w-6xl');
            }
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
        if (toc.classList.contains('hidden')) {
            toc.classList.remove('hidden');
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

// ============================================================================
// BACKWARD COMPATIBILITY EXPORTS
// ============================================================================

/**
 * @deprecated This function is kept for backward compatibility with tests.
 * The markdown renderer is now configured automatically when the module loads.
 * Returns the configured marked instance.
 */
export const _configureMarkdownRenderer = () => {
    return marked;
};
