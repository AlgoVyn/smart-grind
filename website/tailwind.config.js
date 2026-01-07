module.exports = {
    darkMode: 'class',
    content: ["./public/**/*.{html,js}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                brand: {
                    50: '#e6f3ff',
                    100: '#b3e0ff',
                    400: '#4da6ff',
                    500: '#0085d0', // Custom blue
                    600: '#006bb3',
                    900: '#003d66',
                },
                amber: {
                    500: '#d97706', // Darker Amber
                },
                accent: {
                    500: '#d97706', // Darker Amber
                },
                dark: {
                    800: 'var(--theme-bg-card)',
                    900: 'var(--theme-bg-sidebar)',
                    950: 'var(--theme-bg-main)',
                }
            },
            textColor: {
                theme: {
                    base: 'var(--theme-text-base)',
                    bold: 'var(--theme-text-bold)',
                    muted: 'var(--theme-text-muted)',
                }
            },
            borderColor: {
                theme: 'var(--theme-border)',
            }
        }
    },
    plugins: [],
}
