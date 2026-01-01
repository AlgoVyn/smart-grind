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
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    400: '#818cf8',
                    500: '#6366f1', // Indigo
                    600: '#4f46e5',
                    900: '#312e81',
                },
                accent: {
                    500: '#f59e0b', // Amber
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
