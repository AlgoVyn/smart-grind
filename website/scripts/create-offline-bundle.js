#!/usr/bin/env node

/**
 * Build script to create a compressed offline bundle of all MD files
 * 
 * This script:
 * 1. Collects all pattern and solution MD files
 * 2. Creates a tar archive with a manifest
 * 3. Compresses with Gzip for broad browser compatibility
 * 
 * Output: public/offline-bundle.tar.gz (~1 MB for ~500+ MD files)
 */

import { createGzip, gzip as gzipAsync, constants } from 'zlib';
import { createReadStream, createWriteStream, readdirSync, statSync, readFileSync, mkdirSync, existsSync, writeFileSync } from 'fs';
import { join, relative, basename } from 'path';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

// Configuration
const PUBLIC_DIR = join(process.cwd(), 'public');
const DIST_DIR = join(process.cwd(), 'dist');
const PATTERNS_DIR = join(PUBLIC_DIR, 'patterns');
const SOLUTIONS_DIR = join(PUBLIC_DIR, 'solutions');
const ALGORITHMS_DIR = join(PUBLIC_DIR, 'algorithms');
// Output to dist directory for deployment
const OUTPUT_FILE = join(DIST_DIR, 'offline-bundle.tar.gz');
const MANIFEST_FILE = join(DIST_DIR, 'offline-manifest.json');

// Tar header size is 512 bytes
const TAR_HEADER_SIZE = 512;
const TAR_BLOCK_SIZE = 512;

/**
 * Create a tar header for a file
 */
function createTarHeader(filename, fileSize) {
    const header = Buffer.alloc(TAR_HEADER_SIZE);
    
    // File name (100 bytes)
    const name = filename.slice(0, 100);
    header.write(name, 0, 'ascii');
    
    // File mode (8 bytes) - default 644
    header.write('0000644', 100, 'ascii');
    
    // Owner UID (8 bytes)
    header.write('0000000', 108, 'ascii');
    
    // Owner GID (8 bytes)
    header.write('0000000', 116, 'ascii');
    
    // File size (12 bytes, octal)
    const sizeStr = fileSize.toString(8).padStart(11, '0') + ' ';
    header.write(sizeStr, 124, 'ascii');
    
    // Modification time (12 bytes, octal)
    const mtime = Math.floor(Date.now() / 1000);
    const mtimeStr = mtime.toString(8).padStart(11, '0') + ' ';
    header.write(mtimeStr, 136, 'ascii');
    
    // Checksum placeholder (8 bytes)
    header.write('        ', 148, 'ascii');
    
    // Type flag (1 byte) - '0' for regular file
    header.write('0', 156, 'ascii');
    
    // Calculate checksum
    let checksum = 0;
    for (let i = 0; i < TAR_HEADER_SIZE; i++) {
        checksum += header[i];
    }
    const checksumStr = checksum.toString(8).padStart(6, '0') + '\0 ';
    header.write(checksumStr, 148, 'ascii');
    
    return header;
}

/**
 * Create padding bytes to align to block size
 */
function createPadding(size) {
    const remainder = size % TAR_BLOCK_SIZE;
    if (remainder === 0) return Buffer.alloc(0);
    return Buffer.alloc(TAR_BLOCK_SIZE - remainder);
}

/**
 * Collect all MD files from a directory
 */
function collectMdFiles(dir, baseDir) {
    const files = [];
    
    if (!existsSync(dir)) {
        console.warn(`Directory not found: ${dir}`);
        return files;
    }
    
    const entries = readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory()) {
            files.push(...collectMdFiles(fullPath, baseDir));
        } else if (entry.name.endsWith('.md')) {
            const relativePath = relative(baseDir, fullPath);
            const stats = statSync(fullPath);
            files.push({
                path: fullPath,
                relativePath,
                size: stats.size,
            });
        }
    }
    
    return files;
}

/**
 * Create the tar archive as a buffer
 */
async function createTarArchive(patternFiles, solutionFiles, algorithmFiles) {
    const chunks = [];
    
    // Use timestamp for version - ensures unique version on every build
    const version = new Date().toISOString();
    
    // Add manifest as first file
    const manifest = {
        version,
        createdAt: Date.now(),
        patterns: patternFiles.map(f => f.relativePath),
        solutions: solutionFiles.map(f => f.relativePath),
        algorithms: algorithmFiles.map(f => f.relativePath),
        totalFiles: patternFiles.length + solutionFiles.length + algorithmFiles.length,
    };
    
    const manifestContent = JSON.stringify(manifest, null, 2);
    const manifestBuffer = Buffer.from(manifestContent, 'utf-8');
    
    // Add manifest header and content
    chunks.push(createTarHeader('manifest.json', manifestBuffer.length));
    chunks.push(manifestBuffer);
    chunks.push(createPadding(manifestBuffer.length));
    
    // Add pattern files
    for (const file of patternFiles) {
        const content = readFileSync(file.path);
        const tarPath = `patterns/${file.relativePath}`;
        
        chunks.push(createTarHeader(tarPath, content.length));
        chunks.push(content);
        chunks.push(createPadding(content.length));
    }
    
    // Add solution files
    for (const file of solutionFiles) {
        const content = readFileSync(file.path);
        const tarPath = `solutions/${file.relativePath}`;
        
        chunks.push(createTarHeader(tarPath, content.length));
        chunks.push(content);
        chunks.push(createPadding(content.length));
    }
    
    // Add algorithm files
    for (const file of algorithmFiles) {
        const content = readFileSync(file.path);
        const tarPath = `algorithms/${file.relativePath}`;
        
        chunks.push(createTarHeader(tarPath, content.length));
        chunks.push(content);
        chunks.push(createPadding(content.length));
    }
    
    // Add two empty blocks to mark end of archive
    chunks.push(Buffer.alloc(TAR_BLOCK_SIZE * 2));
    
    return Buffer.concat(chunks);
}

/**
 * Compress buffer with Gzip
 */
async function gzipCompress(buffer) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        const stream = createGzip({
            level: constants.Z_BEST_COMPRESSION,  // Maximum compression (level 9)
        });
        
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
        
        stream.end(buffer);
    });
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Main function
 */
async function main() {
    console.log('📦 Creating offline bundle for MD files...\n');
    
    // Collect all MD files
    console.log('📁 Collecting pattern files...');
    const patternFiles = collectMdFiles(PATTERNS_DIR, PATTERNS_DIR);
    console.log(`   Found ${patternFiles.length} pattern files`);
    
    console.log('📁 Collecting solution files...');
    const solutionFiles = collectMdFiles(SOLUTIONS_DIR, SOLUTIONS_DIR);
    console.log(`   Found ${solutionFiles.length} solution files`);
    
    console.log('📁 Collecting algorithm files...');
    const algorithmFiles = collectMdFiles(ALGORITHMS_DIR, ALGORITHMS_DIR);
    console.log(`   Found ${algorithmFiles.length} algorithm files`);
    
    const totalFiles = patternFiles.length + solutionFiles.length + algorithmFiles.length;
    const totalSize = [...patternFiles, ...solutionFiles, ...algorithmFiles].reduce((sum, f) => sum + f.size, 0);
    
    console.log(`\n📊 Total: ${totalFiles} files, ${formatBytes(totalSize)} uncompressed\n`);
    
    // Create tar archive
    console.log('🗃️  Creating tar archive...');
    const tarBuffer = await createTarArchive(patternFiles, solutionFiles, algorithmFiles);
    console.log(`   Tar size: ${formatBytes(tarBuffer.length)}`);
    
    // Compress with Gzip
    console.log('🗜️  Compressing with Gzip (level 9)...');
    const compressedBuffer = await gzipCompress(tarBuffer);
    console.log(`   Compressed size: ${formatBytes(compressedBuffer.length)}`);
    
    // Calculate compression ratio
    const ratio = ((1 - compressedBuffer.length / tarBuffer.length) * 100).toFixed(1);
    console.log(`   Compression ratio: ${ratio}%\n`);
    
    // Write output file
    writeFileSync(OUTPUT_FILE, compressedBuffer);
    console.log(`✅ Written to: ${OUTPUT_FILE}`);
    
    // Use timestamp for version - ensures unique version on every build
    const version = new Date().toISOString();
    
    // Write manifest for quick access (without downloading bundle)
    const manifest = {
        version: version,
        createdAt: Date.now(),
        bundleUrl: '/offline-bundle.tar.gz',
        bundleSize: compressedBuffer.length,
        uncompressedSize: totalSize,

        patterns: patternFiles.map(f => `patterns/${f.relativePath}`),
        solutions: solutionFiles.map(f => `solutions/${f.relativePath}`),
        algorithms: algorithmFiles.map(f => `algorithms/${f.relativePath}`),
        totalFiles,
    };
    writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
    console.log(`✅ Manifest written to: ${MANIFEST_FILE}`);
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📈 Summary');
    console.log('='.repeat(50));
    console.log(`  Files bundled:    ${totalFiles}`);
    console.log(`  Original size:    ${formatBytes(totalSize)}`);
    console.log(`  Bundle size:      ${formatBytes(compressedBuffer.length)}`);
    console.log(`  Space saved:      ${formatBytes(totalSize - compressedBuffer.length)}`);
    console.log('='.repeat(50));
}

main().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
