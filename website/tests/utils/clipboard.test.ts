/**
 * Clipboard Utilities Tests
 * Tests for clipboard operations
 */

import { copyToClipboard } from '../../src/utils';

// Mock showToast
const mockShowToast = jest.fn();
jest.mock('../../src/utils', () => ({
    ...jest.requireActual('../../src/utils'),
    showToast: (...args: unknown[]) => mockShowToast(...args),
}));

describe('Clipboard Utilities', () => {
    const originalClipboard = navigator.clipboard;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        Object.defineProperty(navigator, 'clipboard', {
            writable: true,
            value: originalClipboard,
        });
    });

    describe('copyToClipboard', () => {
        test('should use Clipboard API when available', async () => {
            const writeTextMock = jest.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'clipboard', {
                writable: true,
                value: {
                    writeText: writeTextMock,
                },
            });

            await copyToClipboard('test text');

            expect(writeTextMock).toHaveBeenCalledWith('test text');
        });

        test('should handle empty string', async () => {
            const writeTextMock = jest.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'clipboard', {
                writable: true,
                value: { writeText: writeTextMock },
            });

            await copyToClipboard('');
            expect(writeTextMock).toHaveBeenCalledWith('');
        });
    });
});
