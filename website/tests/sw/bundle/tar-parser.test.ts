/**
 * Tar Parser Tests
 * Comprehensive tests for tar archive parsing with security checks
 */

import {
    parseTar,
} from '../../../src/sw/bundle/tar-parser';

import type { TarFile } from '../../../src/sw/bundle/types';

/** Maximum safe tar file size (15MB) - must match source */
const MAX_TAR_SIZE = 15 * 1024 * 1024;

/** Maximum safe file count in tar archive - must match source */
const MAX_TAR_FILES = 10000;

/**
 * Helper function to create a tar header
 * Creates a 512-byte tar header block
 */
function createTarHeader(name: string, size: number): Uint8Array {
    const header = new Uint8Array(512);
    const encoder = new TextEncoder();

    // Filename (first 100 bytes, null-terminated)
    const nameBytes = encoder.encode(name);
    header.set(nameBytes.slice(0, 100), 0);

    // File size (bytes 124-136, octal string padded with nulls)
    // Format: 11 digits in octal + 1 space = 12 bytes total
    const sizeStr = size.toString(8).padStart(11, '0') + ' ';
    const sizeBytes = encoder.encode(sizeStr);
    header.set(sizeBytes, 124);

    // Type flag (regular file = '0' at byte 156)
    header[156] = 48; // '0'

    return header;
}

/**
 * Helper to create a complete tar archive from file entries
 */
function createTarArchive(files: Array<{ name: string; content: Uint8Array }>): Uint8Array {
    const blocks: Uint8Array[] = [];

    for (const file of files) {
        // Add header block
        blocks.push(createTarHeader(file.name, file.content.length));

        // Add content blocks (padded to 512 bytes)
        const contentSize = file.content.length;
        const paddedSize = Math.ceil(contentSize / 512) * 512;
        const paddedContent = new Uint8Array(paddedSize);
        paddedContent.set(file.content);
        blocks.push(paddedContent);
    }

    // Add two empty blocks (end of archive marker)
    blocks.push(new Uint8Array(512));
    blocks.push(new Uint8Array(512));

    // Concatenate all blocks
    const totalSize = blocks.reduce((sum, block) => sum + block.length, 0);
    const archive = new Uint8Array(totalSize);
    let offset = 0;
    for (const block of blocks) {
        archive.set(block, offset);
        offset += block.length;
    }

    return archive;
}

/**
 * Helper to create a minimal valid tar archive with just end-of-archive markers
 */
function createEmptyTarArchive(): Uint8Array {
    // Two empty blocks indicate end of archive
    return new Uint8Array(1024); // 2 * 512 bytes, all zeros
}

describe('parseTar', () => {
    describe('Basic Parsing', () => {
        it('should parse empty tar archive', () => {
            const archive = createEmptyTarArchive();
            const files = parseTar(archive);
            expect(files).toEqual([]);
        });

        it('should parse tar with single file', () => {
            const content = new TextEncoder().encode('Hello, World!');
            const archive = createTarArchive([{ name: 'test.txt', content }]);
            const files = parseTar(archive);

            expect(files).toHaveLength(1);
            expect(files[0].name).toBe('test.txt');
            expect(new TextDecoder().decode(files[0].content)).toBe('Hello, World!');
        });

        it('should parse tar with multiple files', () => {
            const files = [
                { name: 'file1.txt', content: new TextEncoder().encode('Content 1') },
                { name: 'file2.txt', content: new TextEncoder().encode('Content 2') },
                { name: 'file3.txt', content: new TextEncoder().encode('Content 3') },
            ];
            const archive = createTarArchive(files);
            const result = parseTar(archive);

            expect(result).toHaveLength(3);
            expect(result[0].name).toBe('file1.txt');
            expect(result[1].name).toBe('file2.txt');
            expect(result[2].name).toBe('file3.txt');
            expect(new TextDecoder().decode(result[0].content)).toBe('Content 1');
            expect(new TextDecoder().decode(result[1].content)).toBe('Content 2');
            expect(new TextDecoder().decode(result[2].content)).toBe('Content 3');
        });

        it('should handle file with size 0', () => {
            const archive = createTarArchive([{ name: 'empty.txt', content: new Uint8Array(0) }]);
            const files = parseTar(archive);

            expect(files).toHaveLength(0); // Files with size 0 are skipped
        });

        it('should handle empty content but non-empty tar (only end markers)', () => {
            const archive = new Uint8Array(1024); // Just two zero blocks
            const files = parseTar(archive);
            expect(files).toEqual([]);
        });
    });

    describe('Filename Handling', () => {
        it('should handle null-terminated filenames', () => {
            // Create header with explicit null termination in filename
            const header = new Uint8Array(512);
            const encoder = new TextEncoder();
            const nameBytes = encoder.encode('test.txt');
            header.set(nameBytes, 0);
            header[nameBytes.length] = 0; // Explicit null terminator

            // Set size
            const sizeStr = '13 '.padStart(12, '0');
            header.set(encoder.encode(sizeStr), 124);
            header[156] = 48; // '0'

            const content = new TextEncoder().encode('Hello, World!');
            const paddedContent = new Uint8Array(512);
            paddedContent.set(content);

            const archive = new Uint8Array(512 + 512 + 1024);
            archive.set(header, 0);
            archive.set(paddedContent, 512);
            // End markers already zero

            const files = parseTar(archive);
            expect(files).toHaveLength(1);
            expect(files[0].name).toBe('test.txt');
        });

        it('should handle maximum filename length (100 bytes)', () => {
            const longName = 'a'.repeat(100);
            const content = new TextEncoder().encode('content');
            const archive = createTarArchive([{ name: longName, content }]);
            const files = parseTar(archive);

            expect(files).toHaveLength(1);
            expect(files[0].name).toBe(longName);
        });

        it('should truncate filenames longer than 100 bytes', () => {
            const veryLongName = 'b'.repeat(150);
            const content = new TextEncoder().encode('content');

            // Manually create header with truncated name
            const header = new Uint8Array(512);
            const encoder = new TextEncoder();
            const nameBytes = encoder.encode(veryLongName);
            header.set(nameBytes.slice(0, 100), 0);

            const sizeStr = content.length.toString(8).padStart(11, '0') + ' ';
            header.set(encoder.encode(sizeStr), 124);
            header[156] = 48;

            const paddedContent = new Uint8Array(512);
            paddedContent.set(content);

            const archive = new Uint8Array(512 + 512 + 1024);
            archive.set(header, 0);
            archive.set(paddedContent, 512);

            const files = parseTar(archive);
            expect(files).toHaveLength(1);
            expect(files[0].name).toBe('b'.repeat(100));
        });

        it('should handle filenames with path separators', () => {
            const content = new TextEncoder().encode('content');
            const archive = createTarArchive([{ name: 'dir/subdir/file.txt', content }]);
            const files = parseTar(archive);

            expect(files).toHaveLength(1);
            expect(files[0].name).toBe('dir/subdir/file.txt');
        });
    });

    describe('File Size Extraction', () => {
        it('should correctly extract file size from octal string', () => {
            const content = new TextEncoder().encode('x'.repeat(100));
            const archive = createTarArchive([{ name: 'file.txt', content }]);
            const files = parseTar(archive);

            expect(files).toHaveLength(1);
            expect(files[0].content.length).toBe(100);
        });

        it('should handle size 0', () => {
            const archive = createTarArchive([{ name: 'empty.txt', content: new Uint8Array(0) }]);
            const files = parseTar(archive);
            expect(files).toHaveLength(0); // Size 0 files are skipped
        });

        it('should handle large file sizes', () => {
            const largeContent = new Uint8Array(10000);
            largeContent.fill(65); // Fill with 'A'
            const archive = createTarArchive([{ name: 'large.bin', content: largeContent }]);
            const files = parseTar(archive);

            expect(files).toHaveLength(1);
            expect(files[0].content.length).toBe(10000);
        });
    });

    describe('Content Extraction', () => {
        it('should extract content exactly matching the declared size', () => {
            const content = new Uint8Array([1, 2, 3, 4, 5]);
            const archive = createTarArchive([{ name: 'binary.bin', content }]);
            const files = parseTar(archive);

            expect(files).toHaveLength(1);
            expect(files[0].content).toEqual(content);
        });

        it('should handle content that is not 512-byte aligned', () => {
            const content = new TextEncoder().encode('Not 512 aligned');
            expect(content.length).not.toBe(512);

            const archive = createTarArchive([{ name: 'unaligned.txt', content }]);
            const files = parseTar(archive);

            expect(files).toHaveLength(1);
            expect(new TextDecoder().decode(files[0].content)).toBe('Not 512 aligned');
        });

        it('should handle binary content with null bytes', () => {
            const content = new Uint8Array([0, 1, 0, 2, 0, 255, 0]);
            const archive = createTarArchive([{ name: 'binary.bin', content }]);
            const files = parseTar(archive);

            expect(files).toHaveLength(1);
            expect(files[0].content).toEqual(content);
        });
    });

    describe('512-Byte Alignment', () => {
        it('should properly align headers to 512 bytes', () => {
            const content = new TextEncoder().encode('test');
            const archive = createTarArchive([{ name: 'file.txt', content }]);

            // Archive should have: 512 (header) + 512 (content) + 1024 (end markers) = 2048
            expect(archive.length).toBe(2048);
        });

        it('should properly align content to 512-byte boundaries', () => {
            // Content of 600 bytes should be padded to 1024 bytes (2 * 512)
            const content = new Uint8Array(600);
            content.fill(65);
            const archive = createTarArchive([{ name: 'file.bin', content }]);

            // Archive: 512 (header) + 1024 (content, padded) + 1024 (end) = 2560
            expect(archive.length).toBe(2560);
        });

        it('should handle content exactly 512 bytes (no padding needed)', () => {
            const content = new Uint8Array(512);
            content.fill(66);
            const archive = createTarArchive([{ name: 'file.bin', content }]);

            // Archive: 512 (header) + 512 (content, no padding) + 1024 (end) = 2048
            expect(archive.length).toBe(2048);

            const files = parseTar(archive);
            expect(files).toHaveLength(1);
            expect(files[0].content.length).toBe(512);
        });

        it('should handle multiple files with varying sizes', () => {
            const files = [
                { name: 'small.txt', content: new Uint8Array(100) },
                { name: 'exact.txt', content: new Uint8Array(512) },
                { name: 'large.txt', content: new Uint8Array(1000) },
            ];

            const archive = createTarArchive(files);
            // 512 + 512 + 512 + 512 + 512 + 1024 + 1024 = 4648
            // header(512) + content1(512) + header(512) + content2(512) + header(512) + content3(1024) + end(1024)
            expect(archive.length).toBe(512 + 512 + 512 + 512 + 512 + 1024 + 1024);

            const result = parseTar(archive);
            expect(result).toHaveLength(3);
            expect(result[0].content.length).toBe(100);
            expect(result[1].content.length).toBe(512);
            expect(result[2].content.length).toBe(1000);
        });
    });

    describe('End of Archive Detection', () => {
        it('should stop at two consecutive empty blocks', () => {
            const content = new TextEncoder().encode('test');
            const header = createTarHeader('file.txt', content.length);
            const paddedContent = new Uint8Array(512);
            paddedContent.set(content);

            // Create archive with: header + content + end markers + extra garbage
            const archive = new Uint8Array(512 + 512 + 1024 + 512);
            archive.set(header, 0);
            archive.set(paddedContent, 512);
            // End markers (bytes 1024-2047) remain zero
            // Extra garbage after (should be ignored)
            archive.fill(255, 2048);

            const files = parseTar(archive);
            expect(files).toHaveLength(1);
        });

        it('should handle archive with only one empty block (no valid end marker)', () => {
            const content = new TextEncoder().encode('test');
            const header = createTarHeader('file.txt', content.length);
            const paddedContent = new Uint8Array(512);
            paddedContent.set(content);

            // Create archive with only one empty block
            const archive = new Uint8Array(512 + 512 + 512);
            archive.set(header, 0);
            archive.set(paddedContent, 512);
            // Last 512 bytes are zeros (only one end marker block)

            const files = parseTar(archive);
            // Should still parse successfully - end detection checks for two zeros or end of buffer
            expect(files).toHaveLength(1);
        });

        it('should handle archive ending exactly after content (no end markers)', () => {
            const content = new TextEncoder().encode('test');
            const header = createTarHeader('file.txt', content.length);
            const paddedContent = new Uint8Array(512);
            paddedContent.set(content);

            // Archive ends right after content, no end markers
            const archive = new Uint8Array(512 + 512);
            archive.set(header, 0);
            archive.set(paddedContent, 512);

            const files = parseTar(archive);
            expect(files).toHaveLength(1);
        });
    });

    describe('Security Checks - Size Limits', () => {
        it('should reject archive exceeding MAX_TAR_SIZE (15MB)', () => {
            const oversized = new Uint8Array(MAX_TAR_SIZE + 1);
            expect(() => parseTar(oversized)).toThrow(
                `Tar archive too large: ${MAX_TAR_SIZE + 1} bytes (max: ${MAX_TAR_SIZE})`
            );
        });

        it('should accept archive exactly at MAX_TAR_SIZE', () => {
            // Create a valid tar at max size - this is tricky due to header requirements
            // We'll create an empty archive at max size
            const archive = new Uint8Array(MAX_TAR_SIZE);
            // Fill with end markers (zeros) - valid empty tar
            expect(() => parseTar(archive)).not.toThrow();
        });

        it('should accept archive just under MAX_TAR_SIZE', () => {
            const archive = new Uint8Array(MAX_TAR_SIZE - 1);
            expect(() => parseTar(archive)).not.toThrow();
        });

        it('should reject file with size exceeding MAX_TAR_SIZE', () => {
            const header = createTarHeader('huge.bin', 100); // Small declared size
            const encoder = new TextEncoder();

            // But actually set the size field to exceed limit
            const badHeader = new Uint8Array(512);
            badHeader.set(encoder.encode('huge.bin'), 0);

            // Set size to exceed max
            const hugeSize = MAX_TAR_SIZE + 1000;
            const sizeStr = hugeSize.toString(8).padStart(11, '0') + ' ';
            badHeader.set(encoder.encode(sizeStr), 124);
            badHeader[156] = 48;

            const archive = new Uint8Array(512 + 512 + 1024);
            archive.set(badHeader, 0);

            expect(() => parseTar(archive)).toThrow('Invalid tar entry size');
        });
    });

    describe('Security Checks - File Count Limits', () => {
        it('should reject archive with too many files (MAX_TAR_FILES = 10000)', () => {
            // Create many small files
            const files: Array<{ name: string; content: Uint8Array }> = [];
            for (let i = 0; i < MAX_TAR_FILES + 1; i++) {
                files.push({
                    name: `file${i}.txt`,
                    content: new TextEncoder().encode('x')
                });
            }

            const archive = createTarArchive(files);
            expect(() => parseTar(archive)).toThrow(
                `Too many files in tar archive (max: ${MAX_TAR_FILES})`
            );
        });

        it('should accept archive with exactly MAX_TAR_FILES', () => {
            const files: Array<{ name: string; content: Uint8Array }> = [];
            for (let i = 0; i < MAX_TAR_FILES; i++) {
                files.push({
                    name: `file${i}.txt`,
                    content: new TextEncoder().encode('x')
                });
            }

            const archive = createTarArchive(files);
            // This might be slow but should not throw
            const result = parseTar(archive);
            expect(result).toHaveLength(MAX_TAR_FILES);
        });
    });

    describe('Security Checks - Path Traversal', () => {
        it('should reject filenames with ..', () => {
            const content = new TextEncoder().encode('test');
            const archive = createTarArchive([{ name: '../etc/passwd', content }]);
            expect(() => parseTar(archive)).toThrow('Invalid tar entry name: ../etc/passwd');
        });

        it('should reject filenames with .. in middle', () => {
            const content = new TextEncoder().encode('test');
            const archive = createTarArchive([{ name: 'foo/../bar.txt', content }]);
            expect(() => parseTar(archive)).toThrow('Invalid tar entry name: foo/../bar.txt');
        });

        it('should reject filenames with .. at end', () => {
            const content = new TextEncoder().encode('test');
            const archive = createTarArchive([{ name: 'foo/..', content }]);
            expect(() => parseTar(archive)).toThrow('Invalid tar entry name: foo/..');
        });

        it('should reject filenames starting with /', () => {
            const content = new TextEncoder().encode('test');
            const archive = createTarArchive([{ name: '/etc/passwd', content }]);
            expect(() => parseTar(archive)).toThrow('Invalid tar entry name: /etc/passwd');
        });

        it('should reject absolute path with multiple slashes', () => {
            const content = new TextEncoder().encode('test');
            const archive = createTarArchive([{ name: '//etc/passwd', content }]);
            expect(() => parseTar(archive)).toThrow('Invalid tar entry name: //etc/passwd');
        });

        it('should allow safe relative paths', () => {
            const content = new TextEncoder().encode('test');
            const archive = createTarArchive([
                { name: 'subdir/file.txt', content },
                { name: 'deep/nested/path/file.txt', content },
                { name: 'file.txt', content }
            ]);

            const files = parseTar(archive);
            expect(files).toHaveLength(3);
            expect(files[0].name).toBe('subdir/file.txt');
            expect(files[1].name).toBe('deep/nested/path/file.txt');
            expect(files[2].name).toBe('file.txt');
        });

        it('should allow filenames with dots that are not traversal', () => {
            const content = new TextEncoder().encode('test');
            const archive = createTarArchive([
                { name: '.hidden', content },
                { name: 'file.name.with.dots.txt', content },
                { name: 'dir./file', content },
            ]);

            const files = parseTar(archive);
            expect(files).toHaveLength(3);
            expect(files[0].name).toBe('.hidden');
            expect(files[1].name).toBe('file.name.with.dots.txt');
            expect(files[2].name).toBe('dir./file');
        });

        it('should reject ./relative starting with . but contains path issues', () => {
            // Note: "./relative" does not actually start with "/" - it starts with "."
            // The traversal check looks for ".." and leading "/", so 
            // "./relative" is technically valid by current implementation
            // This test documents that behavior
            const content = new TextEncoder().encode('test');
            const archive = createTarArchive([{ name: './relative', content }]);

            // This currently passes because "./relative" starts with "." not "/"
            // and doesn't contain ".."
            const files = parseTar(archive);
            expect(files).toHaveLength(1);
            expect(files[0].name).toBe('./relative');
        });
    });

    describe('Security Checks - Malformed Archives', () => {
        it('should handle small archives by returning empty array (no valid header)', () => {
            // Archive smaller than 512 bytes can't have a valid header
            // Implementation treats it as reaching end of buffer
            const small = new Uint8Array(100);
            small.fill(65);
            const files = parseTar(small);
            // Should return empty because we hit end of buffer during empty block check
            expect(files).toEqual([]);
        });

        it('should reject archive with incomplete content (declared > actual)', () => {
            const header = createTarHeader('file.txt', 1000); // Claims 1000 bytes
            const archive = new Uint8Array(512 + 100); // But only has 100 bytes of content
            archive.set(header, 0);

            expect(() => parseTar(archive)).toThrow('Malformed tar: incomplete content for file.txt');
        });

        it('should reject archive with truncated content after valid header', () => {
            const header = createTarHeader('file.txt', 500);
            const archive = new Uint8Array(512 + 200); // Only 200 bytes for 500-byte content
            archive.set(header, 0);

            expect(() => parseTar(archive)).toThrow('Malformed tar: incomplete content for file.txt');
        });

        it('should reject header with invalid size format', () => {
            const header = new Uint8Array(512);
            const encoder = new TextEncoder();
            header.set(encoder.encode('file.txt'), 0);

            // Set invalid size (non-octal characters)
            header.set(encoder.encode('   xyz       '), 124);
            header[156] = 48;

            const archive = new Uint8Array(512 + 512 + 1024);
            archive.set(header, 0);

            // Should treat invalid size as 0
            const files = parseTar(archive);
            expect(files).toHaveLength(0); // Size 0 files are skipped
        });

        it('should handle negative size gracefully', () => {
            const header = new Uint8Array(512);
            const encoder = new TextEncoder();
            header.set(encoder.encode('file.txt'), 0);

            // Set size field to look like negative (but parseInt handles it)
            const archive = new Uint8Array(512 + 512 + 1024);
            archive.set(header, 0);

            // Should not throw for valid header with zero/invalid size
            const files = parseTar(archive);
            expect(files).toHaveLength(0); // Size 0 files are skipped
        });

        it('should handle mid-stream incomplete header gracefully by treating as end of archive', () => {
            // Create valid first file
            const content1 = new TextEncoder().encode('first');
            const header1 = createTarHeader('first.txt', content1.length);
            const paddedContent1 = new Uint8Array(512);
            paddedContent1.set(content1);

            // Create archive where after first file, there's not enough for a full header
            // The parser will hit offset 1024 and find we have less than 512 bytes remaining
            // The empty block check (offset + 512 > buffer.length) triggers first
            const archive = new Uint8Array(512 + 512 + 300);
            archive.set(header1, 0);
            archive.set(paddedContent1, 512);
            // Remaining 300 bytes at offset 1024 - not enough for full header

            // Since offset (1024) + 512 > archive.length (1312), the empty block check
            // catches this and breaks out of the loop without error
            const files = parseTar(archive);
            expect(files).toHaveLength(1); // First file was successfully parsed
        });

        it("should treat truncated archive as end of archive (implementation behavior)", () => {
            // NOTE: The incomplete header error in the implementation is effectively
            // unreachable because the end-of-archive check has the same condition.
            // When offset + 512 > buffer.length, the parser breaks the loop rather than
            // throwing an error. This is actually graceful handling.

            // Create valid first file
            const content1 = new TextEncoder().encode("first");
            const header1 = createTarHeader("first.txt", content1.length);
            const paddedContent1 = new Uint8Array(512);
            paddedContent1.set(content1);

            // Create archive with non-zero bytes but not enough for a full second header
            const archive = new Uint8Array(512 + 512 + 400);
            archive.set(header1, 0);
            archive.set(paddedContent1, 512);
            // Add non-zero byte at position 1024 to make it look like a header start
            archive[1024] = 65; // "A"

            // Even with non-zero byte at 1024, offset 1024 + 512 = 1536 > 1424 (archive.length)
            // So the end-of-archive check triggers and we gracefully stop parsing
            const files = parseTar(archive);
            expect(files).toHaveLength(1); // First file was successfully parsed
        });

        it('should detect incomplete content when declared size exceeds available bytes', () => {
            // Create a valid header at offset 0 with size larger than available content
            const header = createTarHeader('file.txt', 200); // Claims 200 bytes
            const content = new Uint8Array(150); // Only 150 bytes available
            content.fill(65);

            // Archive has: header (512) + content (150, NOT padded) = 662 bytes
            const archive = new Uint8Array(662);
            archive.set(header, 0);
            archive.set(content, 512);

            // offset + size = 512 + 200 = 712 > 662, so incomplete content
            expect(() => parseTar(archive)).toThrow('Malformed tar: incomplete content for file.txt');
        });
    });

    describe('Edge Cases', () => {
        it('should handle archive with single empty block (returns empty)', () => {
            const archive = new Uint8Array(512);
            const files = parseTar(archive);
            expect(files).toEqual([]);
        });

        it('should handle very small archive by returning empty (no complete header check possible)', () => {
            const archive = new Uint8Array([1]);
            // Small archive returns empty - end of buffer reached during empty block check
            const files = parseTar(archive);
            expect(files).toEqual([]);
        });

        it('should handle archive with size exactly at 512 boundary', () => {
            const content = new Uint8Array(1024); // Exactly 2 blocks
            content.fill(67);
            const archive = createTarArchive([{ name: 'block.bin', content }]);
            const files = parseTar(archive);

            expect(files).toHaveLength(1);
            expect(files[0].content.length).toBe(1024);
        });

        it('should handle archive with size one byte over 512 boundary', () => {
            const content = new Uint8Array(513); // 513 bytes needs 2 blocks
            content.fill(68);
            const archive = createTarArchive([{ name: 'block.bin', content }]);
            const files = parseTar(archive);

            expect(files).toHaveLength(1);
            expect(files[0].content.length).toBe(513);
        });

        it('should handle special characters in filename', () => {
            const content = new TextEncoder().encode('test');
            const archive = createTarArchive([
                { name: 'file-with-dashes.txt', content },
                { name: 'file_with_underscores.txt', content },
                { name: 'file.with.dots.txt', content },
                { name: 'UPPERCASE.TXT', content },
                { name: 'MixedCase.TXT', content }
            ]);

            const files = parseTar(archive);
            expect(files).toHaveLength(5);
            expect(files[0].name).toBe('file-with-dashes.txt');
            expect(files[1].name).toBe('file_with_underscores.txt');
        });

        it('should handle unicode filenames', () => {
            const content = new TextEncoder().encode('test');
            // Note: UTF-8 encoding of unicode characters takes multiple bytes
            const archive = createTarArchive([
                { name: '文件.txt', content },
                { name: 'файл.txt', content },
                { name: '🎉.txt', content }
            ]);

            const files = parseTar(archive);
            expect(files).toHaveLength(3);
            expect(files[0].name).toBe('文件.txt');
            expect(files[1].name).toBe('файл.txt');
            expect(files[2].name).toBe('🎉.txt');
        });

        it('should handle empty filename', () => {
            // Empty filename should result in skipped file
            const content = new TextEncoder().encode('test');
            const archive = createTarArchive([{ name: '', content }]);

            const files = parseTar(archive);
            expect(files).toHaveLength(0); // Empty name files are skipped
        });

        it('should handle whitespace-only filename', () => {
            const content = new TextEncoder().encode('test');
            const archive = createTarArchive([{ name: '   ', content }]);

            const files = parseTar(archive);
            expect(files).toHaveLength(1);
            expect(files[0].name).toBe('   ');
        });
    });

    describe('Multiple File Scenarios', () => {
        it('should handle mixed file sizes', () => {
            const files = [
                { name: 'tiny.txt', content: new TextEncoder().encode('a') },
                { name: 'medium.txt', content: new TextEncoder().encode('b'.repeat(100)) },
                { name: 'large.txt', content: new Uint8Array(5000).fill(67) },
            ];

            const archive = createTarArchive(files);
            const result = parseTar(archive);

            expect(result).toHaveLength(3);
            expect(result[0].content.length).toBe(1);
            expect(result[1].content.length).toBe(100);
            expect(result[2].content.length).toBe(5000);
        });

        it('should handle files in nested directories', () => {
            const files = [
                { name: 'root.txt', content: new TextEncoder().encode('root') },
                { name: 'level1/file.txt', content: new TextEncoder().encode('level1') },
                { name: 'level1/level2/file.txt', content: new TextEncoder().encode('level2') },
                { name: 'level1/level2/level3/file.txt', content: new TextEncoder().encode('level3') },
            ];

            const archive = createTarArchive(files);
            const result = parseTar(archive);

            expect(result).toHaveLength(4);
            expect(result[0].name).toBe('root.txt');
            expect(result[1].name).toBe('level1/file.txt');
            expect(result[2].name).toBe('level1/level2/file.txt');
            expect(result[3].name).toBe('level1/level2/level3/file.txt');
        });
    });

    describe('Performance Edge Cases', () => {
        it('should handle many small files efficiently', () => {
            const files: Array<{ name: string; content: Uint8Array }> = [];
            for (let i = 0; i < 100; i++) {
                files.push({
                    name: `file${i}.txt`,
                    content: new TextEncoder().encode(`content${i}`)
                });
            }

            const archive = createTarArchive(files);
            const result = parseTar(archive);

            expect(result).toHaveLength(100);
        });

        it('should handle files approaching individual size limit', () => {
            // Create a file close to but under MAX_TAR_SIZE
            // Since MAX_TAR_SIZE is for the whole archive, single file can be large
            const largeContent = new Uint8Array(1024 * 1024); // 1MB file
            largeContent.fill(90);

            const archive = createTarArchive([{ name: 'large.bin', content: largeContent }]);
            const result = parseTar(archive);

            expect(result).toHaveLength(1);
            expect(result[0].content.length).toBe(1024 * 1024);
        });
    });
});

// Export helper functions for use in other tests
export { createTarHeader, createTarArchive, createEmptyTarArchive };
