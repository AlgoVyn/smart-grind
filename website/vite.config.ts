
import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

export default defineConfig({
    base: '/smartgrind/',
    root: '.',
    publicDir: 'public',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        // Code splitting configuration for optimal chunking
        rollupOptions: {
            input: {
                main: './index.html',
                sw: './src/sw/service-worker.ts',
            },
            output: {
                manualChunks: {
                    // Feature-based chunks
                    'auth': ['./src/ui/ui-auth.ts', './src/init.ts'],
                    'renderers': ['./src/renderers.ts'],
                    'api': ['./src/api.ts'],
                },
                // Ensure consistent chunk naming
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: (chunkInfo) => {
                    // Output service worker to root as sw.js
                    if (chunkInfo.name === 'sw') {
                        return 'sw.js';
                    }
                    return 'assets/js/[name]-[hash].js';
                },
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name || '';
                    if (info.endsWith('.css')) {
                        return 'assets/css/[name]-[hash][extname]';
                    }
                    return 'assets/[name]-[hash][extname]';
                },
            },
        },
        // Optimize chunk size warnings
        chunkSizeWarningLimit: 500,
        // Enable source maps for debugging
        sourcemap: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    plugins: [
        // basicSsl() // Enable if HTTPS is needed for Google Auth testing locally
        {
            name: 'copy-sw-to-root',
            closeBundle() {
                // Ensure sw.js is at the root of dist
                const distPath = path.resolve(__dirname, 'dist');
                const swPath = path.join(distPath, 'sw.js');
                if (fs.existsSync(swPath)) {
                    console.log('[vite] Service worker built successfully at dist/sw.js');
                }
            },
        },
    ],
    server: {
        port: 3000,
        open: true,
    },
});
