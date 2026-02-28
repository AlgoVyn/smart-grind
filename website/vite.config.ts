
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
        {
            name: 'inject-sw-version',
            closeBundle() {
                // Inject version into service worker after build
                // This ensures cache busting happens automatically on every build
                const distPath = path.resolve(__dirname, 'dist');
                const swFile = path.join(distPath, 'smartgrind', 'sw.js');
                const packageJsonPath = path.resolve(__dirname, 'package.json');
                
                if (!fs.existsSync(swFile)) {
                    return; // SW file doesn't exist, skip
                }
                
                try {
                    // Generate version from package.json + timestamp + git hash
                    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
                    const baseVersion = packageJson.version || '1.0.0';
                    
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    const seconds = String(now.getSeconds()).padStart(2, '0');
                    
                    // Try to get git commit hash
                    let gitHash = 'dev';
                    try {
                        const { execSync } = require('child_process');
                        gitHash = execSync('git rev-parse --short HEAD', {
                            encoding: 'utf-8',
                            stdio: ['pipe', 'pipe', 'ignore']
                        }).trim();
                    } catch {
                        // Git not available, use 'dev'
                    }
                    
                    const buildTimestamp = `${year}${month}${day}-${hours}${minutes}${seconds}`;
                    const version = `${baseVersion}-${buildTimestamp}-${gitHash}`;
                    
                    // Read and update SW file
                    const swContent = fs.readFileSync(swFile, 'utf-8');

                    // Replace the SW_VERSION declaration with the actual version
                    // Handles both the dev fallback and any existing version
                    // Use [\s\S] to match across multiple lines (dot doesn't match newlines)
                    const updatedContent = swContent.replace(
                        /const\s+SW_VERSION\s*=\s*[\s\S]+?;/,
                        `const SW_VERSION = '${version}';`
                    );
                    
                    fs.writeFileSync(swFile, updatedContent);
                    console.log(`[vite] Service worker version injected: ${version}`);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.warn('[vite] Failed to inject SW version:', errorMessage);
                }
            },
        },
    ],
    server: {
        port: 3000,
        open: true,
    },
});
