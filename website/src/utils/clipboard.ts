// --- CLIPBOARD UTILITIES MODULE ---
// Clipboard operations with fallback support

import { showToast } from './toast';

/**
 * Copies text to the clipboard with fallback support for older browsers.
 * Shows a toast notification on success or failure.
 * @param text - The text content to copy to clipboard
 * @returns Promise resolving when copy is complete
 * @example
 * await copyToClipboard('Problem solution code here');
 * // Shows success toast if copied, error toast if failed
 */
export const copyToClipboard = async (text: string): Promise<void> => {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Prompt copied to clipboard', 'success');
    } catch (_err) {
        // Fallback for older browsers or when clipboard API fails
        try {
            const textArea = document.createElement('textarea');
            textArea.id = 'clipboard-fallback';
            textArea.name = 'clipboard-fallback';
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (success) {
                showToast('Prompt copied to clipboard', 'success');
            } else {
                throw new Error('execCommand returned false');
            }
        } catch (_fallbackErr) {
            showToast('Failed to copy prompt', 'error');
        }
    }
};
