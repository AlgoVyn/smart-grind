// --- MARKDOWN RENDERING AND SOLUTION MODAL ---
// Includes pattern to markdown file mapping functionality

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.ui = window.SmartGrind.ui || {};
window.SmartGrind.patterns = window.SmartGrind.patterns || {};

// --- PATTERN TO MARKDOWN FILE MAPPING SYSTEM ---
// Handles naming inconsistencies between pattern names and solution filenames

// Function to get the correct filename for a pattern
window.SmartGrind.patterns.getPatternFilename = function(patternName) {
    // Use the automatic conversion for all patterns
    return this._convertPatternNameToFilename(patternName);
};

// Internal function for automatic pattern name to filename conversion
window.SmartGrind.patterns._convertPatternNameToFilename = function(patternName) {
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
window.SmartGrind.patterns.checkPatternSolutionExists = async function(patternName) {
    const filename = this.getPatternFilename(patternName);
    const solutionFile = `/smartgrind/solutions/${filename}.md`;
    
    try {
        const response = await fetch(solutionFile, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
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

    // Custom renderer to add language class for syntax highlighting and Copy button
    const renderer = new marked.Renderer();
    renderer.code = (code, language, isEscaped) => {
        // Handle both object and string parameters
        if (typeof code === 'object') {
            language = code.lang;
            code = code.text;
        }
        const langClass = language ? `language-${language}` : 'language-python';
        // Escape code for HTML attribute if needed, but innerText usually handles it.
        // However, we are injecting HTML. marked passes escaped code ??
        // marked.js 'code' argument is usually the text content.

        const buttonHtml = `<button class="code-copy-btn" onclick="window.SmartGrind.ui.copyCode(this)" title="Copy Code"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>Copy</button>`;
        return `<pre class="${langClass}">${buttonHtml}<code class="${langClass}">${code}</code></pre>`;
    };

    marked.setOptions({
        breaks: true,
        gfm: true,
        renderer: renderer
    });

    return marked;
};

// Copy code to clipboard
window.SmartGrind.ui.copyCode = (btn) => {
    const pre = btn.closest('pre');
    const code = pre.querySelector('code').innerText;
    navigator.clipboard.writeText(code).then(() => {
        btn.classList.add('copied');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Copied!
        `;
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                Copy
            `;
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

// Open solution modal
window.SmartGrind.ui.openSolutionModal = (problemId) => {
    const modal = document.getElementById('solution-modal');
    const content = document.getElementById('solution-content');
    if (!modal || !content) return;

    // Show loading
    content.innerHTML = '<div class="loading flex items-center justify-center min-h-[200px]"><div class="w-8 h-8 border-4 border-slate-800 border-t-brand-500 rounded-full animate-spin"></div><span class="ml-3 text-theme-muted">Loading solution...</span></div>';
    modal.classList.remove('hidden');

    // Load and render solution
    const solutionFile = `/smartgrind/solutions/${problemId}.md`;
    fetch(solutionFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load solution file (status: ' + response.status + ')');
            }
            return response.text();
        })
        .then(markdown => window.SmartGrind.ui._renderMarkdown(markdown, content))
        .catch(error => {
            content.innerHTML = '<p>Error loading solution: ' + error.message + '</p>' +
                '<p>File: ' + solutionFile + '</p>';
        });
};

// Open pattern solution modal
window.SmartGrind.ui.openPatternSolutionModal = (patternName) => {
    const modal = document.getElementById('solution-modal');
    const content = document.getElementById('solution-content');
    if (!modal || !content) return;

    // Show loading
    content.innerHTML = '<div class="loading flex items-center justify-center min-h-[200px]"><div class="w-8 h-8 border-4 border-slate-800 border-t-brand-500 rounded-full animate-spin"></div><span class="ml-3 text-theme-muted">Loading pattern solution...</span></div>';
    modal.classList.remove('hidden');

    // Use the pattern mapping system to get the correct filename
    const patternFilename = window.SmartGrind.patterns.getPatternFilename(patternName);
    
    // Try to find a pattern solution file
    const solutionFile = `/smartgrind/solutions/${patternFilename}.md`;
    
    fetch(solutionFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load pattern solution file (status: ' + response.status + ')');
            }
            return response.text();
        })
        .then(markdown => window.SmartGrind.ui._renderMarkdown(markdown, content))
        .catch(error => {
            content.innerHTML = '<p>Error loading pattern solution: ' + error.message + '</p>' +
                '<p>File: ' + solutionFile + '</p>' +
                '<p>This pattern may not have a dedicated solution file yet.</p>';
        });
};

// Close solution modal
window.SmartGrind.ui.closeSolutionModal = () => {
    const modal = document.getElementById('solution-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
};