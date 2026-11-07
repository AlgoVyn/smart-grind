// --- SYNC UTILS REGRESSION TESTS ---
// Covers the legacy compression migration: blobs written by older code were
// deflate-raw bytes tagged as `Content-Encoding: br` (the Workers runtime has
// no Brotli CompressionStream), so decompression must fall back.

import { decompressData } from '../../functions/api/user/sync-utils';

describe('decompressData', () => {
    const originalDecompressionStream = (global as unknown as { DecompressionStream: unknown })
        .DecompressionStream;
    const originalResponse = (global as unknown as { Response: unknown }).Response;

    afterEach(() => {
        (global as unknown as { DecompressionStream: unknown }).DecompressionStream =
            originalDecompressionStream;
        (global as unknown as { Response: unknown }).Response = originalResponse;
    });

    it('falls back to deflate-raw for legacy blobs mislabeled as br', async () => {
        const expected = JSON.stringify({
            problems: { 'two-sum': { id: 'two-sum', status: 'solved' } },
            deletedIds: [],
        });
        const attempted: string[] = [];

        // Only deflate-raw is supported, mirroring the Workers runtime where
        // the old writer fell back to deflate-raw but stored 'br' metadata.
        (global as unknown as { DecompressionStream: unknown }).DecompressionStream = class {
            readable: { getReader: () => { read: () => Promise<unknown> } };

            constructor(format: string) {
                attempted.push(format);
                if (format !== 'deflate-raw') {
                    throw new TypeError(`Unsupported compression format: ${format}`);
                }
                const encoded = new TextEncoder().encode(expected);
                let sent = false;
                this.readable = {
                    getReader: () => ({
                        read: async () => {
                            if (sent) return { done: true, value: undefined };
                            sent = true;
                            return { done: false, value: encoded };
                        },
                    }),
                };
            }
        };

        // Minimal Response shim: inflate() only needs body.pipeThrough(stream)
        (global as unknown as { Response: unknown }).Response = class {
            body: { pipeThrough: (stream: unknown) => unknown };

            constructor() {
                this.body = {
                    pipeThrough: (stream: { readable: unknown }) => stream.readable,
                };
            }
        };

        const compressed = new TextEncoder().encode('legacy deflate-raw bytes');
        const result = await decompressData(compressed.buffer, 'br');

        expect(attempted[0]).toBe('br');
        expect(attempted).toContain('deflate-raw');
        expect(JSON.parse(result)).toEqual(JSON.parse(expected));
    });

    it('uses the recorded encoding first when it is supported', async () => {
        const expected = '{"ok":true}';
        (global as unknown as { DecompressionStream: unknown }).DecompressionStream = class {
            readable: { getReader: () => { read: () => Promise<unknown> } };

            constructor(format: string) {
                if (format !== 'gzip') throw new TypeError('unsupported');
                const encoded = new TextEncoder().encode(expected);
                let sent = false;
                this.readable = {
                    getReader: () => ({
                        read: async () => {
                            if (sent) return { done: true, value: undefined };
                            sent = true;
                            return { done: false, value: encoded };
                        },
                    }),
                };
            }
        };
        (global as unknown as { Response: unknown }).Response = class {
            body: { pipeThrough: (stream: unknown) => unknown };

            constructor() {
                this.body = {
                    pipeThrough: (stream: { readable: unknown }) => stream.readable,
                };
            }
        };

        const result = await decompressData(new TextEncoder().encode('gzip bytes').buffer, 'gzip');
        expect(result).toBe(expected);
    });
});
