// --- UI MODULE ---
// UI-specific functions and event handlers

window.SmartGrind = window.SmartGrind || {};

window.SmartGrind.ui = {
    // Pull to refresh functionality
    pullToRefresh: {
        startY: 0,
        isPulling: false,
        threshold: 100, // pixels to pull before refresh

        init: () => {
            document.addEventListener('touchstart', window.SmartGrind.ui.pullToRefresh.handleTouchStart, { passive: false });
            document.addEventListener('touchmove', window.SmartGrind.ui.pullToRefresh.handleTouchMove, { passive: false });
            document.addEventListener('touchend', window.SmartGrind.ui.pullToRefresh.handleTouchEnd, { passive: false });
        },

        handleTouchStart: (e) => {
            if (window.scrollY === 0 && window.SmartGrind.state.elements.contentScroll.scrollTop === 0) {
                window.SmartGrind.ui.pullToRefresh.startY = e.touches[0].clientY;
                window.SmartGrind.ui.pullToRefresh.isPulling = true;
            }
        },

        handleTouchMove: (e) => {
            if (!window.SmartGrind.ui.pullToRefresh.isPulling) return;
            const currentY = e.touches[0].clientY;
            const deltaY = currentY - window.SmartGrind.ui.pullToRefresh.startY;
            if (deltaY > 0) {
                e.preventDefault(); // prevent default scrolling
                const appWrapper = document.getElementById('app-wrapper');
                appWrapper.style.transform = `translateY(${deltaY}px)`;
            } else {
                window.SmartGrind.ui.pullToRefresh.isPulling = false;
            }
        },

        handleTouchEnd: (e) => {
            if (!window.SmartGrind.ui.pullToRefresh.isPulling) return;
            const currentY = e.changedTouches[0].clientY;
            const deltaY = currentY - window.SmartGrind.ui.pullToRefresh.startY;
            const appWrapper = document.getElementById('app-wrapper');
            appWrapper.style.transform = 'translateY(0)';
            if (deltaY > window.SmartGrind.ui.pullToRefresh.threshold) {
                window.location.reload();
            }
            window.SmartGrind.ui.pullToRefresh.isPulling = false;
        }
    },

    // Initialize UI components
    init: () => {
        window.SmartGrind.state.init();
        window.SmartGrind.ui.bindEvents();
        window.SmartGrind.ui.initScrollButton();
        window.SmartGrind.ui.pullToRefresh.init();
        window.SmartGrind.ui.updateAuthUI();
    },

    // Bind all event listeners
    bindEvents: () => {
        // Google login buttons
        window.SmartGrind.state.elements.googleLoginBtn?.addEventListener('click', window.SmartGrind.ui.handleGoogleLogin);
        window.SmartGrind.state.elements.modalGoogleLoginBtn?.addEventListener('click', window.SmartGrind.ui.handleGoogleLogin);

        // Sign in modal
        window.SmartGrind.state.elements.signinModal?.addEventListener('click', (e) => {
            if (e.target === window.SmartGrind.state.elements.signinModal) {
                window.SmartGrind.ui.closeSigninModal();
            }
        });
        window.SmartGrind.state.elements.signinModalContent?.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Alert modal
        window.SmartGrind.state.elements.alertModal?.addEventListener('click', (e) => {
            if (e.target === window.SmartGrind.state.elements.alertModal) {
                window.SmartGrind.ui.closeAlertModal();
            }
        });
        window.SmartGrind.state.elements.alertOkBtn?.addEventListener('click', window.SmartGrind.ui.closeAlertModal);

        // Confirm modal
        window.SmartGrind.state.elements.confirmModal?.addEventListener('click', (e) => {
            if (e.target === window.SmartGrind.state.elements.confirmModal) {
                window.SmartGrind.ui.closeConfirmModal(false);
            }
        });
        window.SmartGrind.state.elements.confirmOkBtn?.addEventListener('click', () => window.SmartGrind.ui.closeConfirmModal(true));
        window.SmartGrind.state.elements.confirmCancelBtn?.addEventListener('click', () => window.SmartGrind.ui.closeConfirmModal(false));

        // Disconnect button
        window.SmartGrind.state.elements.disconnectBtn?.addEventListener('click', window.SmartGrind.ui.handleLogout);

        // Add problem modal
        window.SmartGrind.state.elements.openAddModalBtn?.addEventListener('click', window.SmartGrind.ui.openAddModal);
        window.SmartGrind.state.elements.cancelAddBtn?.addEventListener('click', window.SmartGrind.ui.closeAddModal);
        window.SmartGrind.state.elements.saveAddBtn?.addEventListener('click', window.SmartGrind.ui.saveNewProblem);

        // Category change in add modal
        window.SmartGrind.state.elements.addProbCategory?.addEventListener('change', window.SmartGrind.ui.handleCategoryChange);
        window.SmartGrind.state.elements.addProbPattern?.addEventListener('change', window.SmartGrind.ui.handlePatternChange);

        // Filter buttons
        window.SmartGrind.state.elements.filterBtns?.forEach(btn => {
            btn.addEventListener('click', () => {
                window.SmartGrind.state.ui.currentFilter = btn.dataset.filter;
                window.SmartGrind.renderers.updateFilterBtns();
                window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
            });
        });

        // Search
        window.SmartGrind.state.elements.problemSearch?.addEventListener('input', () => {
            window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
        });

        // Theme toggle
        window.SmartGrind.state.elements.themeToggleBtn?.addEventListener('click', window.SmartGrind.ui.toggleTheme);

        // Mobile menu
        window.SmartGrind.state.elements.mobileMenuBtn?.addEventListener('click', window.SmartGrind.ui.toggleMobileMenu);
        window.SmartGrind.state.elements.mobileMenuBtnMain?.addEventListener('click', window.SmartGrind.ui.toggleMobileMenu);
        window.SmartGrind.state.elements.sidebarBackdrop?.addEventListener('click', window.SmartGrind.ui.toggleMobileMenu);

        // Logo click to load default view
        window.SmartGrind.state.elements.sidebarLogo?.addEventListener('click', window.SmartGrind.ui.loadDefaultView);
        window.SmartGrind.state.elements.mobileLogo?.addEventListener('click', window.SmartGrind.ui.loadDefaultView);

        // Keyboard shortcuts
        document.addEventListener('keydown', window.SmartGrind.ui.handleKeyboard);

        // Browser navigation
        window.addEventListener('popstate', window.SmartGrind.ui.handlePopState);

        // Category delete
        window.SmartGrind.state.elements.topicList?.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (btn && btn.dataset.action === 'delete-category') {
                e.stopPropagation();
                window.SmartGrind.api.deleteCategory(btn.dataset.topicId);
            }
        });

        // Close sidebar on topic click (mobile)
        window.SmartGrind.state.elements.topicList?.addEventListener('click', (e) => {
            if (window.innerWidth < 768 && (e.target.closest('.sidebar-link') || e.target.closest('button'))) {
                window.SmartGrind.ui.toggleMobileMenu();
            }
        });
    },

    // Google login handler
    handleGoogleLogin: () => {
        window.SmartGrind.ui.showError(null);
        window.SmartGrind.state.elements.googleLoginBtn.disabled = true;
        window.SmartGrind.state.elements.googleLoginBtn.innerHTML = "Connecting...";

        // Open popup for auth
        const popup = window.open('/smartgrind/api/auth?action=login', 'auth', 'width=500,height=600');

        // Listen for auth success message
        const messageHandler = (event) => {
            if (event.origin !== window.location.origin) return;
            if (event.data.type === 'auth-success') {
                const { token, userId, displayName } = event.data;
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('displayName', displayName);
                window.SmartGrind.state.user.id = userId;
                window.SmartGrind.state.user.displayName = displayName;
                window.SmartGrind.state.elements.userDisplay.innerText = displayName;
                window.SmartGrind.state.user.type = 'signed-in';
                localStorage.setItem(window.SmartGrind.data.LOCAL_STORAGE_KEYS.USER_TYPE, 'signed-in');
                window.SmartGrind.api.loadData();
                window.SmartGrind.ui.updateAuthUI();
                // Close any open sign-in modals
                window.SmartGrind.state.elements.setupModal.classList.add('hidden');
                window.SmartGrind.state.elements.signinModal.classList.add('hidden');
                window.removeEventListener('message', messageHandler);
                window.SmartGrind.state.elements.googleLoginBtn.disabled = false;
                window.SmartGrind.state.elements.googleLoginBtn.innerHTML = `
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign in with Google
                `;
            }
        };
        window.addEventListener('message', messageHandler);

        // Note: Cannot check popup.closed due to COOP policy when navigating to external sites
    },

    // Logout handler
    handleLogout: async () => {
        if (window.SmartGrind.state.user.type === 'signed-in') {
            // Switch to local user
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            localStorage.removeItem('displayName');
            window.SmartGrind.state.user.id = null;

            // Switch to local user
            window.SmartGrind.state.user.type = 'local';
            localStorage.setItem(window.SmartGrind.data.LOCAL_STORAGE_KEYS.USER_TYPE, 'local');

            // Clear current data and reload local data
            window.SmartGrind.state.problems.clear();
            window.SmartGrind.state.deletedProblemIds.clear();

            // Initialize local user with fresh data
            window.SmartGrind.app.initializeLocalUser();

            // Update the UI to show sign in option
            window.SmartGrind.ui.updateAuthUI();

            window.SmartGrind.utils.showToast('Switched to local mode');
        } else {
            // Open sign in modal for local users
            window.SmartGrind.ui.openSigninModal();
        }
    },

    // Modal functions
    openSigninModal: () => {
        window.SmartGrind.state.elements.signinModal.classList.remove('hidden');
    },

    closeSigninModal: () => {
        window.SmartGrind.state.elements.signinModal.classList.add('hidden');
    },

    openAddModal: () => {
        // Populate category dropdown
        window.SmartGrind.state.elements.addProbCategory.innerHTML = `<option value="">-- Select or Type New --</option>` +
            window.SmartGrind.data.topicsData.map(t => `<option value="${t.title}">${t.title}</option>`).join('');

        // Clear inputs
        window.SmartGrind.state.elements.addProbName.value = '';
        window.SmartGrind.state.elements.addProbUrl.value = '';
        window.SmartGrind.state.elements.addProbCategoryNew.value = '';
        window.SmartGrind.state.elements.addProbPatternNew.value = '';
        window.SmartGrind.state.elements.addProbCategoryNew.classList.remove('hidden');
        window.SmartGrind.state.elements.addProbPattern.innerHTML = '<option value="">-- Select Category First --</option>';
        window.SmartGrind.state.elements.addProbPatternNew.classList.remove('hidden');

        window.SmartGrind.state.elements.addProblemModal.classList.remove('hidden');
    },

    closeAddModal: () => {
        window.SmartGrind.state.elements.addProblemModal.classList.add('hidden');
    },

    // Alert modal functions
    showAlert: (message) => {
        window.SmartGrind.state.elements.alertMessage.textContent = message;
        window.SmartGrind.state.elements.alertModal.classList.remove('hidden');
    },

    closeAlertModal: () => {
        window.SmartGrind.state.elements.alertModal.classList.add('hidden');
    },

    // Confirm modal functions
    showConfirm: (message) => {
        return new Promise((resolve) => {
            window.SmartGrind.state.elements.confirmMessage.textContent = message;
            window.SmartGrind.state.elements.confirmModal.classList.remove('hidden');

            // Store the resolve function to be called when modal is closed
            window.SmartGrind.ui._confirmResolve = resolve;
        });
    },

    closeConfirmModal: (result) => {
        window.SmartGrind.state.elements.confirmModal.classList.add('hidden');
        if (window.SmartGrind.ui._confirmResolve) {
            window.SmartGrind.ui._confirmResolve(result);
            window.SmartGrind.ui._confirmResolve = null;
        }
    },

    handleCategoryChange: (e) => {
        const val = e.target.value;
        if (val) {
            window.SmartGrind.state.elements.addProbCategoryNew.classList.add('hidden');
            const topic = window.SmartGrind.data.topicsData.find(t => t.title === val);
            if (topic) {
                window.SmartGrind.state.elements.addProbPattern.innerHTML = `<option value="">-- Select or Type New --</option>` +
                    topic.patterns.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
            } else {
                window.SmartGrind.state.elements.addProbPattern.innerHTML = '<option value="">-- No Patterns Found --</option>';
            }
        } else {
            window.SmartGrind.state.elements.addProbCategoryNew.classList.remove('hidden');
            window.SmartGrind.state.elements.addProbPattern.innerHTML = '<option value="">-- Select Category First --</option>';
        }
        window.SmartGrind.state.elements.addProbPatternNew.classList.remove('hidden');
    },

    handlePatternChange: (e) => {
        if (e.target.value) window.SmartGrind.state.elements.addProbPatternNew.classList.add('hidden');
        else window.SmartGrind.state.elements.addProbPatternNew.classList.remove('hidden');
    },

    saveNewProblem: async () => {
        const name = window.SmartGrind.state.elements.addProbName.value.trim();
        const url = window.SmartGrind.state.elements.addProbUrl.value.trim();
        let category = window.SmartGrind.state.elements.addProbCategory.value;
        if (!category) category = window.SmartGrind.state.elements.addProbCategoryNew.value.trim();

        let pattern = window.SmartGrind.state.elements.addProbPattern.value;
        if (!pattern || !window.SmartGrind.state.elements.addProbCategory.value) pattern = window.SmartGrind.state.elements.addProbPatternNew.value.trim();

        if (!name || !url || !category || !pattern) {
            window.SmartGrind.ui.showAlert("Please fill in Name, URL, Category and Pattern.");
            return;
        }

        const id = 'custom-' + Date.now();
        const newProb = {
            id, name, url,
            topic: category,
            pattern: pattern,
            status: 'unsolved',
            reviewInterval: 0,
            nextReviewDate: null,
            note: '',
            loading: false
        };

        // Update State
        window.SmartGrind.state.problems.set(id, newProb);

        // Update In-Memory Structure
        window.SmartGrind.api.mergeStructure(); // This handles inserting it into topicsData

        // Save to Firebase
        await window.SmartGrind.api.saveProblem(newProb);

        window.SmartGrind.state.elements.addProblemModal.classList.add('hidden');
        window.SmartGrind.renderers.renderSidebar();
        window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId); // Refresh view
        window.SmartGrind.utils.showToast("Problem added!");
    },

    // Theme toggle
    toggleTheme: () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    },

    // Mobile menu toggle
    toggleMobileMenu: () => {
        const isOpen = window.SmartGrind.state.elements.mainSidebar.classList.contains('translate-x-0');
        if (isOpen) {
            window.SmartGrind.state.elements.mainSidebar.classList.remove('translate-x-0');
            window.SmartGrind.state.elements.mainSidebar.classList.add('-translate-x-full');
            window.SmartGrind.state.elements.sidebarBackdrop.classList.add('hidden');
            window.SmartGrind.state.elements.sidebarBackdrop.classList.remove('opacity-100');
            document.body.style.overflow = '';
        } else {
            window.SmartGrind.state.elements.mainSidebar.classList.add('translate-x-0');
            window.SmartGrind.state.elements.mainSidebar.classList.remove('-translate-x-full');
            window.SmartGrind.state.elements.sidebarBackdrop.classList.remove('hidden');
            setTimeout(() => window.SmartGrind.state.elements.sidebarBackdrop.classList.add('opacity-100'), 10);
            document.body.style.overflow = 'hidden';
        }
    },

    // Load default view (all problems)
    loadDefaultView: () => {
        window.SmartGrind.renderers.setActiveTopic('all');
        window.SmartGrind.utils.updateUrlParameter('category', null);
        window.SmartGrind.renderers.renderMainView('all');
        window.SmartGrind.utils.scrollToTop();
        // Close mobile menu if open
        if (window.innerWidth < 768 && window.SmartGrind.state.elements.mainSidebar.classList.contains('translate-x-0')) {
            window.SmartGrind.ui.toggleMobileMenu();
        }
    },

    // Scroll button
    initScrollButton: () => {
        if (window.SmartGrind.state.elements.contentScroll && window.SmartGrind.state.elements.scrollToTopBtn) {
            window.SmartGrind.state.elements.contentScroll.addEventListener('scroll', () => {
                if (window.SmartGrind.state.elements.contentScroll.scrollTop > 300) {
                    // Show button
                    window.SmartGrind.state.elements.scrollToTopBtn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
                } else {
                    // Hide button
                    window.SmartGrind.state.elements.scrollToTopBtn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
                }
            });

            window.SmartGrind.state.elements.scrollToTopBtn.addEventListener('click', () => {
                window.SmartGrind.utils.scrollToTop(true);
            });
        }
    },

    // Keyboard shortcuts map
    _keyboardShortcuts: {
        '/': () => {
            window.SmartGrind.state.elements.problemSearch.focus();
        },
        'Escape': () => {
            if (!window.SmartGrind.state.elements.setupModal.classList.contains('hidden')) return; // Don't close setup modal
            if (!window.SmartGrind.state.elements.addProblemModal.classList.contains('hidden')) {
                window.SmartGrind.state.elements.addProblemModal.classList.add('hidden');
            }
        },
        'e': () => window.SmartGrind.app.exportProgress(),
        'E': () => window.SmartGrind.app.exportProgress()
    },

    // Keyboard shortcuts
    handleKeyboard: (e) => {
        // Skip if typing in an input/textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            // Allow Escape to close modals even when focused on input
            if (e.key === 'Escape') {
                window.SmartGrind.ui._keyboardShortcuts['Escape']();
                e.preventDefault();
            }
            return;
        }

        const handler = window.SmartGrind.ui._keyboardShortcuts[e.key];
        if (handler) {
            e.preventDefault();
            handler();
        }
    },

    // Browser navigation
    handlePopState: () => {
        const categoryParam = window.SmartGrind.utils.getUrlParameter('category');
        if (categoryParam) {
            // Check if this is a valid category
            const validCategory = window.SmartGrind.data.topicsData.some(t => t.id === categoryParam) || categoryParam === 'all';
            if (validCategory) {
                window.SmartGrind.state.ui.activeTopicId = categoryParam;
                window.SmartGrind.renderers.renderSidebar(); // Re-render sidebar to update active state
                window.SmartGrind.renderers.renderMainView(); // Re-render main view with new category
                window.SmartGrind.utils.scrollToTop();
            }
        } else {
            // No category parameter, show all
            window.SmartGrind.state.ui.activeTopicId = 'all';
            window.SmartGrind.renderers.renderSidebar(); // Re-render sidebar to update active state
            window.SmartGrind.renderers.renderMainView(); // Re-render main view with all problems
            window.SmartGrind.utils.scrollToTop();
        }
    },

    // Update auth UI
    updateAuthUI: () => {
        const disconnectBtn = window.SmartGrind.state.elements.disconnectBtn;
        if (window.SmartGrind.state.user.type === 'local') {
            disconnectBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign In
            `;
            disconnectBtn.title = 'Sign in to sync across devices';
        } else {
            disconnectBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
            `;
            disconnectBtn.title = 'Sign out and switch to local mode';
        }
    },

    // Error display
    showError: (msg) => {
        if (msg) {
            window.SmartGrind.ui.showAlert(msg);
        }
        window.SmartGrind.state.elements.setupError.classList.toggle('hidden', !msg);
        window.SmartGrind.state.elements.setupError.innerText = msg || '';
    },

    showSigninError: (msg) => {
        if (msg) {
            window.SmartGrind.ui.showAlert(msg);
        }
        window.SmartGrind.state.elements.signinError.classList.toggle('hidden', !msg);
        window.SmartGrind.state.elements.signinError.innerText = msg || '';
    }
};

// --- APP MODULE ---
// Additional app-level functions

window.SmartGrind.app = {
    // Initialize local user
    initializeLocalUser: () => {
        window.SmartGrind.state.user.type = 'local';
        localStorage.setItem(window.SmartGrind.data.LOCAL_STORAGE_KEYS.USER_TYPE, 'local');

        window.SmartGrind.state.loadFromStorage();
        const displayName = window.SmartGrind.state.user.displayName;
        window.SmartGrind.state.elements.userDisplay.innerText = displayName;

        // Reset topicsData to original static data
        window.SmartGrind.data.resetTopicsData();

        // Sync with static plan to ensure all problems exist
        window.SmartGrind.api.syncPlan();

        // Merge dynamically added problems into topicsData structure
        window.SmartGrind.api.mergeStructure();

        window.SmartGrind.renderers.renderSidebar();
        window.SmartGrind.renderers.renderMainView('all'); // Show all by default
        window.SmartGrind.renderers.updateStats();

        // Initialize scroll button after DOM is ready
        window.SmartGrind.ui.initScrollButton();

        window.SmartGrind.state.elements.setupModal.classList.add('hidden');
        window.SmartGrind.state.elements.appWrapper.classList.remove('hidden');
        window.SmartGrind.state.elements.loadingScreen.classList.add('hidden');

        // Update auth UI
        window.SmartGrind.ui.updateAuthUI();
    },

    // Export progress
    exportProgress: () => {
        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            problems: Object.fromEntries(window.SmartGrind.state.problems),
            deletedIds: Array.from(window.SmartGrind.state.deletedProblemIds)
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartgrind-progress-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        window.SmartGrind.utils.showToast('Progress exported successfully!', 'success');
    }
};

// --- INITIALIZATION ---

// Helper to apply category from URL
const _applyCategory = (categoryParam) => {
    if (categoryParam) {
        const validCategory = window.SmartGrind.data.topicsData.some(t => t.id === categoryParam) || categoryParam === 'all';
        if (validCategory) {
            window.SmartGrind.state.ui.activeTopicId = categoryParam;
            window.SmartGrind.renderers.renderSidebar();
            window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
            window.SmartGrind.utils.scrollToTop();
        }
    }
};

// Check auth state and initialize app
const checkAuth = async () => {
    // Check for category in URL path before any URL changes
    const path = window.location.pathname;
    let categoryParam = null;
    if (path === '/smartgrind/') {
        categoryParam = 'all';
    } else if (path.startsWith('/smartgrind/c/')) {
        categoryParam = path.split('/smartgrind/c/')[1];
    }

    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlUserId = urlParams.get('userId');
    const urlDisplayName = urlParams.get('displayName');

    // Check if user just signed in via URL (for PWA compatibility)
    if (urlToken && urlUserId && urlDisplayName) {
        localStorage.setItem('token', urlToken);
        localStorage.setItem('userId', urlUserId);
        localStorage.setItem('displayName', urlDisplayName);
        window.SmartGrind.state.user.id = urlUserId;
        window.SmartGrind.state.user.displayName = urlDisplayName;
        window.SmartGrind.state.elements.userDisplay.innerText = urlDisplayName;
        window.SmartGrind.state.user.type = 'signed-in';
        localStorage.setItem(window.SmartGrind.data.LOCAL_STORAGE_KEYS.USER_TYPE, 'signed-in');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        await window.SmartGrind.api.loadData();
        window.SmartGrind.ui.updateAuthUI();
        _applyCategory(categoryParam);
        return;
    }

    // Check if user is already signed in
    const userId = localStorage.getItem('userId');
    if (userId) {
        const displayName = localStorage.getItem('displayName') || 'User';
        window.SmartGrind.state.elements.userDisplay.innerText = displayName;
        window.SmartGrind.state.user.type = 'signed-in';
        localStorage.setItem(window.SmartGrind.data.LOCAL_STORAGE_KEYS.USER_TYPE, 'signed-in');
        await window.SmartGrind.api.loadData();
        window.SmartGrind.ui.updateAuthUI();
        _applyCategory(categoryParam);
        return;
    }

    // Default to local user
    const userType = localStorage.getItem(window.SmartGrind.data.LOCAL_STORAGE_KEYS.USER_TYPE) || 'local';

    if (userType === 'local') {
        window.SmartGrind.app.initializeLocalUser();
        _applyCategory(categoryParam);
    } else {
        // If user type is 'signed-in' but no userId, show setup modal
        window.SmartGrind.state.elements.setupModal.classList.remove('hidden');
        window.SmartGrind.state.elements.appWrapper.classList.add('hidden');
        window.SmartGrind.state.elements.loadingScreen.classList.add('hidden');

        // Reset Login Button State
        window.SmartGrind.state.elements.googleLoginBtn.disabled = false;
        window.SmartGrind.state.elements.googleLoginBtn.innerHTML = `
            <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
        `;
        window.SmartGrind.ui.updateAuthUI();
    }
};

window.SmartGrind.state.init();
checkAuth();
window.SmartGrind.ui.init();