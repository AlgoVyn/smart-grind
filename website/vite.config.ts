
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
                manualChunks: (id, { getModuleInfo }) => {
                    // Don't split the service worker - inline all dependencies
                    if (id.includes('/sw/') || getModuleInfo(id)?.isEntry) {
                        return undefined;
                    }
                    // Feature-based chunks for main app only
                    if (id.includes('/ui/ui-auth') || id.includes('/init.ts')) {
                        return 'auth';
                    }
                    if (id.includes('/renderers.ts')) {
                        return 'renderers';
                    }
                    if (id.includes('/api.ts') && !id.includes('/sw/')) {
                        return 'api';
                    }
                    // BUNDLED DEPENDENCIES: marked and prismjs for offline support
                    if (id.includes('marked') || id.includes('prismjs')) {
                        return 'markdown';
                    }
                    return undefined;
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
                // Inline all imports for the service worker entry
                inlineDynamicImports: false,
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
            async closeBundle() {
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
            name: 'fix-prism-worker-handler',
            async closeBundle() {
                // Inject prism config at the TOP of the markdown chunk to prevent worker errors
                // The prism.js patch gets wrapped in functions during bundling, so we need to add
                // the fix at the very beginning of the chunk (outside any functions)
                const distPath = path.resolve(__dirname, 'dist');
                const assetsPath = path.join(distPath, 'assets', 'js');
                
                try {
                    const files = fs.readdirSync(assetsPath);
                    const markdownChunk = files.find(f => f.startsWith('markdown-') && f.endsWith('.js'));
                    
                    if (markdownChunk) {
                        const chunkPath = path.join(assetsPath, markdownChunk);
                        let content = fs.readFileSync(chunkPath, 'utf-8');
                        
                        // Add the prism fix at the very beginning (must be before any wrapped code)
                        const prismFix = 'typeof self!=="undefined"&&(self.Prism={disableWorkerMessageHandler:true});';
                        
                        // Only add if not already at the very beginning
                        if (!content.startsWith(prismFix)) {
                            content = prismFix + content;
                            fs.writeFileSync(chunkPath, content);
                            console.log('[vite] Prism worker handler fix injected at top of', markdownChunk);
                        } else {
                            console.log('[vite] Prism fix already at top of', markdownChunk);
                        }
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.warn('[vite] Failed to fix prism worker handler:', errorMessage);
                }
            },
        },
        {
            name: 'fix-sw-imports',
            async closeBundle() {
                // Fix relative imports in service worker to use absolute paths
                // The SW is at /smartgrind/sw.js but imports chunks with ../assets/js/
                // which resolves to /assets/js/ instead of /smartgrind/assets/js/
                const distPath = path.resolve(__dirname, 'dist');
                const swFile = path.join(distPath, 'smartgrind', 'sw.js');
                
                if (!fs.existsSync(swFile)) {
                    return;
                }
                
                try {
                    let swContent = fs.readFileSync(swFile, 'utf-8');
                    
                    // Replace ALL relative imports with absolute imports
                    // Handle both: from"../assets/js/... and import"../assets/js/...
                    swContent = swContent.replace(
                        /(from"|import")\.\.\/assets\/js\//g,
                        '$1/smartgrind/assets/js/'
                    );
                    
                    fs.writeFileSync(swFile, swContent);
                    console.log('[vite] Service worker imports fixed to use absolute paths');
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.warn('[vite] Failed to fix SW imports:', errorMessage);
                }
            },
        },
        {
            name: 'inject-sw-version',
            async closeBundle() {
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
                    // Use dynamic import for ESM compatibility (require is not available in ESM)
                    let gitHash = 'dev';
                    try {
                        const childProcess = await import('node:child_process');
                        gitHash = childProcess.execSync('git rev-parse --short HEAD', {
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

                    // Replace the SW_VERSION placeholder with the actual version
                    // Simple string replacement - more reliable than regex
                    const placeholder = "__SW_VERSION_PLACEHOLDER__";
                    const replacement = `'${version}'`;
                    
                    if (!swContent.includes(placeholder)) {
                        console.warn("[vite] SW_VERSION placeholder not found in service worker");
                        return;
                    }
                    
                    const updatedContent = swContent.replace(placeholder, replacement);
                    
                    fs.writeFileSync(swFile, updatedContent);
                    console.log(`[vite] Service worker version injected: ${version}`);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.warn('[vite] Failed to inject SW version:', errorMessage);
                }
            },
        }
    ],
    server: {
        port: 3000,
        open: true,
    },
});
