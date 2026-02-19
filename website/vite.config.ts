
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
                    // Output service worker to smartgrind folder for correct scope
                    if (chunkInfo.name === 'sw') {
                        return 'smartgrind/sw.js';
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
            name: 'ensure-sw-directory',
            closeBundle() {
                // Ensure sw.js is in the smartgrind directory for correct scope
                const distPath = path.resolve(__dirname, 'dist');
                const swPath = path.join(distPath, 'sw.js');
                const smartgrindPath = path.join(distPath, 'smartgrind');
                const targetPath = path.join(smartgrindPath, 'sw.js');
                
                // Create smartgrind directory if it doesn't exist
                if (!fs.existsSync(smartgrindPath)) {
                    fs.mkdirSync(smartgrindPath, { recursive: true });
                }
                
                // Move sw.js to smartgrind folder if it's at root
                if (fs.existsSync(swPath) && !fs.existsSync(targetPath)) {
                    fs.renameSync(swPath, targetPath);
                    console.log('[vite] Service worker moved to dist/smartgrind/sw.js');
                }
                
                // Also move the source map if it exists
                const swMapPath = path.join(distPath, 'sw.js.map');
                const targetMapPath = path.join(smartgrindPath, 'sw.js.map');
                if (fs.existsSync(swMapPath) && !fs.existsSync(targetMapPath)) {
                    fs.renameSync(swMapPath, targetMapPath);
                }
                
                if (fs.existsSync(targetPath)) {
                    console.log('[vite] Service worker built successfully at dist/smartgrind/sw.js');
                }
            },
        },
    ],
    server: {
        port: 3000,
        open: true,
    },
});
