(function () {
    // Ensure trailing slash for Service Worker scope
    // Page: /smartgrind -> Scope: /smartgrind/ (Mismatch)
    // Page: /smartgrind/ -> Scope: /smartgrind/ (Match)
    if (window.location.pathname === '/smartgrind') {
        window.location.pathname = '/smartgrind/';
        return;
    }

    // Theme detection - defaults to light theme
    const savedTheme = localStorage.getItem('theme');
    
    // Default to light theme unless explicitly saved as dark
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
        // Save light as default if no theme set
        if (!savedTheme) {
            try {
                localStorage.setItem('theme', 'light');
            } catch (e) {
                // Ignore storage errors
            }
        }
    }
    
    window.VITE_BASE_URL = '/smartgrind/';
})();
