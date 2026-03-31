/**
 * Tar Parser
 * Safe tar archive extraction with bounds checking
 */

import type { TarFile } from './types.js';

/** Maximum safe tar file size (15MB) */
const MAX_TAR_SIZE = 15 * 1024 * 1024;

/** Maximum safe file count in tar archive */
const MAX_TAR_FILES = 10000;

/**
 * Parse a tar archive with bounds checking
 * @param buffer - The tar archive data
 * @returns Array of extracted files
 * @throws Error if archive is malformed or exceeds safety limits
 */
export function parseTar(buffer: Uint8Array): TarFile[] {
    // Safety check: buffer size
    if (buffer.length > MAX_TAR_SIZE) {
        throw new Error(`Tar archive too large: ${buffer.length} bytes (max: ${MAX_TAR_SIZE})`);
    }

    const files: TarFile[] = [];
    let offset = 0;

    while (offset < buffer.length) {
        // Check for end of archive (two empty blocks)
        if (
            offset + 512 > buffer.length ||
            buffer.slice(offset, offset + 512).every((b) => b === 0)
        ) {
            break;
        }

        // Bounds check: ensure we have enough bytes for header
        if (offset + 512 > buffer.length) {
            throw new Error(`Malformed tar: incomplete header at offset ${offset}`);
        }

        // Parse header
        const header = buffer.slice(offset, offset + 512);
        offset += 512;

        // Extract filename (first 100 bytes, null-terminated)
        const name = extractFilename(header);

        // Validate filename for path traversal
        if (isInvalidFilename(name)) {
            throw new Error(`Invalid tar entry name: ${name}`);
        }

        // Extract file size (bytes 124-136, octal string)
        const size = extractFileSize(header);

        // Safety check: file count limit
        if (files.length >= MAX_TAR_FILES) {
            throw new Error(`Too many files in tar archive (max: ${MAX_TAR_FILES})`);
        }

        // Extract content if size > 0
        if (size > 0) {
            const content = extractContent(buffer, offset, size, name);
            if (content) {
                files.push({ name, content });
            }
        }

        // Move to next header (aligned to 512 bytes)
        offset += Math.ceil(size / 512) * 512;
    }

    return files;
}

/** Extract filename from tar header */
function extractFilename(header: Uint8Array): string {
    let nameEnd = 0;
    while (nameEnd < 100 && header[nameEnd] !== 0) {
        nameEnd++;
    }
    return new TextDecoder().decode(header.slice(0, nameEnd));
}

/** Check if filename contains path traversal attempts */
function isInvalidFilename(name: string): boolean {
    return name.includes('..') || name.startsWith('/');
}

/** Extract file size from tar header */
function extractFileSize(header: Uint8Array): number {
    const sizeStr = new TextDecoder().decode(header.slice(124, 136)).trim();
    const size = parseInt(sizeStr, 8) || 0;

    if (size < 0 || size > MAX_TAR_SIZE) {
        throw new Error(`Invalid tar entry size: ${size}`);
    }

    return size;
}

/** Extract file content from tar buffer */
function extractContent(
    buffer: Uint8Array,
    offset: number,
    size: number,
    name: string
): Uint8Array | null {
    // Bounds check: ensure we have enough bytes for content
    if (offset + size > buffer.length) {
        throw new Error(`Malformed tar: incomplete content for ${name}`);
    }

    const content = buffer.slice(offset, offset + size);
    return name ? content : null;
}
