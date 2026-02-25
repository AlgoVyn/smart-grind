// --- TOAST NOTIFICATIONS MODULE ---
// Toast notification system for user feedback

import { state } from '../state';

/**
 * Displays a temporary toast notification message.
 * Automatically removes after 3 seconds with fade-out animation.
 * Uses textContent to prevent XSS vulnerabilities.
 * @param msg - The message to display
 * @param type - The notification type (affects styling: 'success' | 'error')
 * @returns void
 * @example
 * showToast('Problem saved successfully!', 'success');
 * showToast('Failed to save', 'error');
 */
export const showToast = (msg: string, type: 'success' | 'error' | 'warning' = 'success'): void => {
    const getBgColor = () => {
        switch (type) {
            case 'success':
                return 'bg-brand-600';
            case 'error':
                return 'bg-red-500';
            case 'warning':
                return 'bg-amber-500';
            default:
                return 'bg-brand-600';
        }
    };
    const el = document.createElement('div');
    el.className = `toast ${type} px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white flex items-center gap-2 animate-fade-in ${getBgColor()}`;
    // Use textContent instead of innerHTML to prevent XSS
    const span = document.createElement('span');
    span.textContent = msg;
    el.appendChild(span);
    const toastContainer = state.elements.toastContainer;
    if (toastContainer) {
        toastContainer.appendChild(el);
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
            setTimeout(() => el.remove(), 300);
        }, 3000);
    }
};
