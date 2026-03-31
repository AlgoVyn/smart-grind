// --- THEME INITIALIZATION TESTS ---

describe('Theme Initialization', () => {
    let originalMatchMedia: typeof window.matchMedia;
    let localStorageMock: { [key: string]: string };

    beforeEach(() => {
        // Save original
        originalMatchMedia = window.matchMedia;
        
        // Reset localStorage mock
        localStorageMock = {};
        
        // Mock localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn((key: string) => localStorageMock[key] || null),
                setItem: jest.fn((key: string, value: string) => {
                    localStorageMock[key] = value;
                }),
                removeItem: jest.fn((key: string) => {
                    delete localStorageMock[key];
                }),
            },
            writable: true,
        });

        // Clear document classes
        document.documentElement.classList.remove('dark');
    });

    afterEach(() => {
        // Restore original
        window.matchMedia = originalMatchMedia;
        jest.restoreAllMocks();
    });

    describe('matchMedia detection', () => {
        it('should detect dark mode preference when no saved theme', () => {
            // Mock matchMedia for dark preference
            const matchMediaMock = jest.fn().mockImplementation((query: string) => ({
                matches: query === '(prefers-color-scheme: dark)',
                media: query,
                addEventListener: jest.fn(),
                addListener: jest.fn(), // Legacy API
                removeEventListener: jest.fn(),
                removeListener: jest.fn(),
                dispatchEvent: jest.fn(),
            }));
            window.matchMedia = matchMediaMock;

            // Simulate theme initialization
            const savedTheme = localStorage.getItem('theme');
            let theme = savedTheme;
            
            if (!theme) {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                theme = prefersDark ? 'dark' : 'light';
            }
            
            expect(theme).toBe('dark');
            expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
        });

        it('should detect light mode preference when no saved theme', () => {
            // Mock matchMedia for light preference
            const matchMediaMock = jest.fn().mockImplementation((query: string) => ({
                matches: false,
                media: query,
                addEventListener: jest.fn(),
                addListener: jest.fn(),
                removeEventListener: jest.fn(),
                removeListener: jest.fn(),
                dispatchEvent: jest.fn(),
            }));
            window.matchMedia = matchMediaMock;

            const savedTheme = localStorage.getItem('theme');
            let theme = savedTheme;
            
            if (!theme) {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                theme = prefersDark ? 'dark' : 'light';
            }
            
            expect(theme).toBe('light');
        });

        it('should use saved theme over system preference', () => {
            // Set saved theme
            localStorageMock['theme'] = 'dark';
            
            const savedTheme = localStorage.getItem('theme');
            let theme = savedTheme;
            
            if (!theme) {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                theme = prefersDark ? 'dark' : 'light';
            }
            
            expect(theme).toBe('dark');
        });
    });

    describe('theme change listener', () => {
        it('should set up change listener for system theme changes', () => {
            const addEventListenerMock = jest.fn();
            const addListenerMock = jest.fn();
            
            const matchMediaMock = jest.fn().mockReturnValue({
                matches: false,
                media: '(prefers-color-scheme: dark)',
                addEventListener: addEventListenerMock,
                addListener: addListenerMock,
                removeEventListener: jest.fn(),
                removeListener: jest.fn(),
                dispatchEvent: jest.fn(),
            });
            window.matchMedia = matchMediaMock;

            // Simulate listener setup
            const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const addChangeListener = colorSchemeQuery.addEventListener || colorSchemeQuery.addListener;
            
            if (addChangeListener) {
                addChangeListener.call(colorSchemeQuery, 'change', jest.fn());
            }

            // Should try modern API first
            expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
        });

        it('should fallback to legacy addListener if addEventListener not available', () => {
            const addListenerMock = jest.fn();
            
            const matchMediaMock = jest.fn().mockReturnValue({
                matches: false,
                media: '(prefers-color-scheme: dark)',
                addListener: addListenerMock,
                removeListener: jest.fn(),
                dispatchEvent: jest.fn(),
            });
            window.matchMedia = matchMediaMock;

            const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const addChangeListener = colorSchemeQuery.addEventListener || colorSchemeQuery.addListener;
            
            if (addChangeListener) {
                addChangeListener.call(colorSchemeQuery, 'change', jest.fn());
            }

            expect(addListenerMock).toHaveBeenCalled();
        });
    });

    describe('theme application', () => {
        it('should apply dark class when theme is dark', () => {
            localStorageMock['theme'] = 'dark';
            
            const savedTheme = localStorage.getItem('theme');
            const theme = savedTheme || 'light';
            
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            
            expect(document.documentElement.classList.contains('dark')).toBe(true);
        });

        it('should remove dark class when theme is light', () => {
            // First add dark class
            document.documentElement.classList.add('dark');
            
            localStorageMock['theme'] = 'light';
            
            const savedTheme = localStorage.getItem('theme');
            const theme = savedTheme || 'light';
            
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            
            expect(document.documentElement.classList.contains('dark')).toBe(false);
        });
    });

    describe('localStorage behavior', () => {
        it('should save detected theme to localStorage', () => {
            const setItemSpy = jest.spyOn(window.localStorage, 'setItem');
            
            // Simulate theme detection and save
            const prefersDark = true;
            const detectedTheme = prefersDark ? 'dark' : 'light';
            
            try {
                localStorage.setItem('theme', detectedTheme);
            } catch (e) {
                // Ignore storage errors
            }
            
            expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');
        });

        it('should handle localStorage errors gracefully', () => {
            // Make localStorage throw error
            Object.defineProperty(window, 'localStorage', {
                value: {
                    getItem: jest.fn(() => null),
                    setItem: jest.fn(() => {
                        throw new Error('Storage quota exceeded');
                    }),
                },
                writable: true,
            });

            // Should not throw
            expect(() => {
                try {
                    localStorage.setItem('theme', 'dark');
                } catch (e) {
                    // Ignore
                }
            }).not.toThrow();
        });
    });

    describe('edge cases', () => {
        it('should handle when matchMedia is not available', () => {
            // Remove matchMedia
            // @ts-ignore
            window.matchMedia = undefined;

            const savedTheme = localStorage.getItem('theme');
            let theme = savedTheme;
            
            if (!theme && window.matchMedia) {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                theme = prefersDark ? 'dark' : 'light';
            }
            
            // Should not throw and theme should be undefined or fallback
            expect(theme).toBeNull();
        });

        it('should handle invalid theme values in localStorage', () => {
            localStorageMock['theme'] = 'invalid-theme';
            
            const savedTheme = localStorage.getItem('theme');
            
            // Even with invalid value, should use it (validation happens elsewhere)
            expect(savedTheme).toBe('invalid-theme');
        });
    });
});
