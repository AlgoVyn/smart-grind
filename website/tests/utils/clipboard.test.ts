/**
 * Clipboard Utilities Tests
 * Tests for clipboard operations with fallback support
 */

import { copyToClipboard } from '../../src/utils/clipboard';
import { showToast } from '../../src/utils/toast';

// Mock toast module
jest.mock('../../src/utils/toast', () => ({
    showToast: jest.fn(),
}));

describe('Clipboard Utilities', () => {
    const originalClipboard = navigator.clipboard;
    const originalExecCommand = document.execCommand;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        Object.defineProperty(navigator, 'clipboard', {
            writable: true,
            value: originalClipboard,
        });
        document.execCommand = originalExecCommand;
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
            expect(showToast).toHaveBeenCalledWith('Prompt copied to clipboard', 'success');
        });

        test('should use fallback when Clipboard API fails', async () => {
            const writeTextMock = jest.fn().mockRejectedValue(new Error('Clipboard API failed'));
            Object.defineProperty(navigator, 'clipboard', {
                writable: true,
                value: {
                    writeText: writeTextMock,
                },
            });

            const execCommandMock = jest.fn().mockReturnValue(true);
            document.execCommand = execCommandMock;

            await copyToClipboard('test text');

            expect(execCommandMock).toHaveBeenCalledWith('copy');
            expect(showToast).toHaveBeenCalledWith('Prompt copied to clipboard', 'success');
        });

        test('should show error when both methods fail', async () => {
            Object.defineProperty(navigator, 'clipboard', {
                writable: true,
                value: {
                    writeText: jest.fn().mockRejectedValue(new Error('fail')),
                },
            });

            document.execCommand = jest.fn().mockReturnValue(false);
            await copyToClipboard('test text');
            expect(showToast).toHaveBeenCalledWith('Failed to copy prompt', 'error');
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
