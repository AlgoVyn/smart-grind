// --- MARKDOWN RENDERING AND SOLUTION MODAL ---
// Includes pattern to markdown file mapping functionality

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.ui = window.SmartGrind.ui || {};
window.SmartGrind.patterns = window.SmartGrind.patterns || {};

// --- PATTERN TO MARKDOWN FILE MAPPING SYSTEM ---
// Handles naming inconsistencies between pattern names and solution filenames

// Function to get the correct filename for a pattern
window.SmartGrind.patterns.getPatternFilename = function (patternName) {
    // Use the automatic conversion for all patterns
    return this._convertPatternNameToFilename(patternName);
};

// Internal function for automatic pattern name to filename conversion
window.SmartGrind.patterns._convertPatternNameToFilename = function (patternName) {
    // Convert to lowercase and replace special characters with hyphens
    let cleaned = patternName
        .toLowerCase()
        .replace(/[\s/()&`'+-]+/g, '-')  // Replace spaces and special chars with hyphens
        .replace(/-+/g, '-')             // Collapse multiple hyphens
        .replace(/^-+|-+$/g, '');        // Trim hyphens from start/end

    // Remove common suffix patterns that don't add value
    cleaned = cleaned
        .replace(/-pattern$/, '')
        .replace(/-algorithm$/, '')
        .replace(/-approach$/, '')
        .replace(/-method$/, '')
        .replace(/-technique$/, '')
        .replace(/-style$/, '');

    return cleaned;
};

// Function to check if a pattern solution file exists
window.SmartGrind.patterns.checkPatternSolutionExists = async function (patternName) {
    const filename = this.getPatternFilename(patternName);
    const solutionFile = `/smartgrind/patterns/${filename}.md`;

    try {
        const response = await fetch(solutionFile, { method: 'HEAD' });
        return response.ok;
    } catch (_error) {
        return false;
    }
};

// Helper to configure markdown renderer
window.SmartGrind.ui._configureMarkdownRenderer = () => {
    if (typeof marked === 'undefined') return null;

    marked.setOptions({
        breaks: true,
        gfm: true
    });

    // Custom renderer
    const renderer = new marked.Renderer();

    // Helper to escape HTML in code blocks
    const escapeHtml = (unsafe) => {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    renderer.code = (code, language) => {
    // Handle both object and string parameters (marked update compatibility)
        if (typeof code === 'object') {
            language = code.lang;
            code = code.text;
        }

        // CAROUSEL SUPPORT
        if (language === 'carousel') {
            const uniqueId = 'carousel-' + Math.random().toString(36).substr(2, 9);
            const slides = code.split(/<!--\s*slide\s*-->/).filter(s => s.trim().length > 0);

            let tabsHtml = '<div class="flex bg-[#1e1e1e] overflow-x-auto">';
            let panesHtml = '<div class="carousel-content bg-[#1e1e1e]">'; // Default dark background for code

            slides.forEach((slide, index) => {
                // Extract language and code from the inner fenced block
                // Matches: ```lang \n content ```
                const match = slide.match(/```(\S+)\s*\n?([\s\S]*?)```/);
                let innerLang = 'text';
                let innerCode = slide;

                if (match) {
                    innerLang = match[1];
                    innerCode = match[2]; // inner code
                }

                // Escape the inner code
                innerCode = escapeHtml(innerCode);

                const displayName = innerLang === 'cpp' ? 'C++' :
                    innerLang === 'javascript' ? 'JavaScript' :
                        innerLang.charAt(0).toUpperCase() + innerLang.slice(1);

                // Tab Button
                const activeTabClass = index === 0
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
                const copyBtn = '<button class="code-copy-btn absolute top-3 right-3 p-1.5 text-white/40 hover:text-white bg-slate-700/30 hover:bg-slate-600 rounded opacity-0 group-hover:opacity-100 transition-all z-10" onclick="window.SmartGrind.ui.copyCode(this)" title="Copy Code"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>';

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
        const copyBtn = '<button class="code-copy-btn absolute top-3 right-3 p-1.5 text-white/40 hover:text-white bg-slate-700/30 hover:bg-slate-600 rounded opacity-0 group-hover:opacity-100 transition-all z-10" onclick="window.SmartGrind.ui.copyCode(this)" title="Copy Code"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>';

        return `<div class="relative mb-4 rounded-lg overflow-hidden bg-[#1e1e1e]">
            <pre class="${langClass} !m-0 !border-0 !shadow-none !bg-transparent relative"><code class="${langClass} !bg-transparent !border-0">${escapedCode}</code>${copyBtn}</pre>
        </div>`;
    };

    marked.setOptions({
        renderer: renderer
    });

    return marked;
};

// Switch Carousel Tab
window.SmartGrind.ui.switchCarouselTab = (uniqueId, index) => {
    // Update Buttons
    const buttons = document.querySelectorAll(`.carousel-tab-btn-${uniqueId}`);
    buttons.forEach(btn => {
        if (parseInt((btn).dataset.index) === index) {
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
    const container = buttons[0].closest('.code-carousel');
    const allPanes = container.querySelectorAll('[id^="' + uniqueId + '-pane-"]');

    allPanes.forEach(pane => {
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
window.SmartGrind.ui.copyCode = (btn) => {
    const pre = btn.closest('pre');
    const code = pre.querySelector('code').innerText;
    const originalHTML = btn.innerHTML;
    navigator.clipboard.writeText(code).then(() => {
        btn.classList.add('copied');
        btn.style.color = '#4da6ff'; // Brand color for success
        btn.style.opacity = '1';
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#4da6ff"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.style.color = '';
            btn.style.opacity = '';
            btn.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code: ', err);
        window.SmartGrind.utils.showToast('Failed to copy code');
    });
};

// Helper to render markdown content
window.SmartGrind.ui._renderMarkdown = (markdown, contentElement) => {
    const marked = window.SmartGrind.ui._configureMarkdownRenderer();
    if (!marked) {
        contentElement.innerHTML = '<p>Error: Markdown renderer not loaded. Please check your internet connection.</p>';
        return;
    }

    const html = marked.parse(markdown);
    contentElement.innerHTML = html;

    // Apply syntax highlighting
    if (typeof Prism !== 'undefined') {
        Prism.highlightAllUnder(contentElement);
    }
};

const loadSolution = (solutionFile, loadingText, errorPrefix, extraErrorText = '') => {
    const modal = document.getElementById('solution-modal');
    const content = document.getElementById('solution-content');
    if (!modal || !content) return;

    // Show loading
    content.innerHTML = `<div class="loading flex items-center justify-center min-h-[200px]"><div class="w-8 h-8 border-4 border-slate-800 border-t-brand-500 rounded-full animate-spin"></div><span class="ml-3 text-theme-muted">${loadingText}</span></div>`;
    modal.classList.remove('hidden');

    fetch(solutionFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${errorPrefix} file (status: ${response.status})`);
            }
            return response.text();
        })
        .then(markdown => window.SmartGrind.ui._renderMarkdown(markdown, content))
        .then(() => {
            content.addEventListener('scroll', window.SmartGrind.ui.updateSolutionScrollProgress);
            window.SmartGrind.ui.updateSolutionScrollProgress();
        })
        .catch(error => {
            content.innerHTML = `<p>Error loading ${errorPrefix}: ${error.message}</p>` +
                `<p>File: ${solutionFile}</p>${extraErrorText}`;
        });
};

// Open solution modal
window.SmartGrind.ui.openSolutionModal = (problemId) => {
    const solutionFile = `/smartgrind/solutions/${problemId}.md`;
    loadSolution(solutionFile, 'Loading solution...', 'solution');
};

// Open pattern solution modal
window.SmartGrind.ui.openPatternSolutionModal = (patternName) => {
    const patternFilename = window.SmartGrind.patterns.getPatternFilename(patternName);
    const solutionFile = `/smartgrind/patterns/${patternFilename}.md`;
    loadSolution(solutionFile, 'Loading pattern solution...', 'pattern solution',
        '<p>This pattern may not have a dedicated solution file yet.</p>');
};

// Close solution modal
window.SmartGrind.ui.closeSolutionModal = () => {
    const modal = document.getElementById('solution-modal');
    if (modal) {
        modal.classList.add('hidden');
    }

    // Clean up scroll progress
    const content = document.getElementById('solution-content');
    if (content) {
        content.removeEventListener('scroll', window.SmartGrind.ui.updateSolutionScrollProgress);
    }
    const progressBar = document.getElementById('solution-scroll-progress');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
};

// Update solution scroll progress bar
window.SmartGrind.ui.updateSolutionScrollProgress = () => {
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
};