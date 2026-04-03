/**
 * @jest-environment jsdom
 *
 * Tests for Toast Notification Module
 */

import { showToast } from '../../src/utils';

// Mock state module
jest.mock('../../src/state', () => ({
    markDeletedIdsDirty: jest.fn(),
    markProblemDirty: jest.fn(),
    markFlashCardsDirty: jest.fn(),
    state: {
        elements: {
            toastContainer: null, // Will be set in tests
        },
    },
}));

import { state } from '../../src/state';

describe('Toast Utility', () => {
    let toastContainer: HTMLElement;

    beforeEach(() => {
        // Create toast container
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);

        // Update state reference
        state.elements['toastContainer'] = toastContainer;

        // Clear any existing toasts
        toastContainer.innerHTML = '';

        // Use fake timers for animation testing
        jest.useFakeTimers();
    });

    afterEach(() => {
        // Clean up
        toastContainer.remove();
        jest.useRealTimers();
    });

    describe('showToast', () => {
        it('should create a toast element with success styling by default', () => {
            showToast('Test message');

            const toast = toastContainer.querySelector('.toast');
            expect(toast).toBeTruthy();
            expect(toast?.classList.contains('success')).toBe(true);
            expect(toast?.classList.contains('bg-brand-600')).toBe(true);
        });

        it('should display the provided message', () => {
            const message = 'This is a test message';
            showToast(message);

            const toast = toastContainer.querySelector('.toast');
            const span = toast?.querySelector('span');
            expect(span?.textContent).toBe(message);
        });

        it('should create toast with error styling', () => {
            showToast('Error message', 'error');

            const toast = toastContainer.querySelector('.toast');
            expect(toast?.classList.contains('error')).toBe(true);
            expect(toast?.classList.contains('bg-red-500')).toBe(true);
        });

        it('should create toast with warning styling', () => {
            showToast('Warning message', 'warning');

            const toast = toastContainer.querySelector('.toast');
            expect(toast?.classList.contains('warning')).toBe(true);
            expect(toast?.classList.contains('bg-amber-500')).toBe(true);
        });

        it('should create toast with success styling explicitly', () => {
            showToast('Success message', 'success');

            const toast = toastContainer.querySelector('.toast');
            expect(toast?.classList.contains('success')).toBe(true);
            expect(toast?.classList.contains('bg-brand-600')).toBe(true);
        });

        it('should use textContent to prevent XSS', () => {
            const maliciousMessage = '<script>alert("xss")</script>';
            showToast(maliciousMessage);

            const toast = toastContainer.querySelector('.toast');
            const span = toast?.querySelector('span');
            // textContent should contain the literal string, not execute as HTML
            expect(span?.textContent).toBe(maliciousMessage);
            // innerHTML should escape the content
            expect(span?.innerHTML).toContain('&lt;');
        });

        it('should add animation classes', () => {
            showToast('Animated toast');

            const toast = toastContainer.querySelector('.toast');
            expect(toast?.classList.contains('animate-fade-in')).toBe(true);
        });

        it('should apply correct styling classes', () => {
            showToast('Styled toast');

            const toast = toastContainer.querySelector('.toast');
            expect(toast?.classList.contains('px-4')).toBe(true);
            expect(toast?.classList.contains('py-3')).toBe(true);
            expect(toast?.classList.contains('rounded-lg')).toBe(true);
            expect(toast?.classList.contains('shadow-lg')).toBe(true);
            expect(toast?.classList.contains('text-sm')).toBe(true);
            expect(toast?.classList.contains('font-medium')).toBe(true);
            expect(toast?.classList.contains('text-white')).toBe(true);
            expect(toast?.classList.contains('flex')).toBe(true);
            expect(toast?.classList.contains('items-center')).toBe(true);
            expect(toast?.classList.contains('gap-2')).toBe(true);
        });

        it('should remove toast after 3 seconds', () => {
            showToast('Temporary toast');

            expect(toastContainer.querySelector('.toast')).toBeTruthy();

            // Fast forward 3 seconds
            jest.advanceTimersByTime(3000);

            // Toast should still be in DOM but fading out
            expect(toastContainer.querySelector('.toast')).toBeTruthy();

            // Fast forward animation duration
            jest.advanceTimersByTime(300);

            // Toast should be removed
            expect(toastContainer.querySelector('.toast')).toBeFalsy();
        });

        it('should apply fade-out styles before removal', () => {
            showToast('Fade toast');

            jest.advanceTimersByTime(3000);

            const toast = toastContainer.querySelector('.toast') as HTMLElement;
            expect(toast?.style.opacity).toBe('0');
            expect(toast?.style.transform).toBe('translateY(10px)');
        });

        it('should handle multiple toasts', () => {
            showToast('First toast');
            showToast('Second toast');
            showToast('Third toast');

            const toasts = toastContainer.querySelectorAll('.toast');
            expect(toasts.length).toBe(3);
        });

        it('should handle empty message', () => {
            showToast('');

            const toast = toastContainer.querySelector('.toast');
            const span = toast?.querySelector('span');
            expect(span?.textContent).toBe('');
        });

        it('should handle long messages', () => {
            const longMessage = 'A'.repeat(500);
            showToast(longMessage);

            const toast = toastContainer.querySelector('.toast');
            const span = toast?.querySelector('span');
            expect(span?.textContent).toBe(longMessage);
        });

        it('should handle special characters in message', () => {
            const specialMessage = 'Special: @#$%^&*()_+-=[]{}|;\':",./<>?';
            showToast(specialMessage);

            const toast = toastContainer.querySelector('.toast');
            const span = toast?.querySelector('span');
            expect(span?.textContent).toBe(specialMessage);
        });

        it('should handle unicode characters', () => {
            const unicodeMessage = 'Unicode: 你好世界 🌍 ñ é';
            showToast(unicodeMessage);

            const toast = toastContainer.querySelector('.toast');
            const span = toast?.querySelector('span');
            expect(span?.textContent).toBe(unicodeMessage);
        });

        it('should not create toast when container is null', () => {
            state.elements.toastContainer = null;

            showToast('This should not appear');

            // Should not throw and no toast should be created
            expect(document.querySelector('.toast')).toBeFalsy();
        });

        it('should handle rapid successive calls', () => {
            for (let i = 0; i < 10; i++) {
                showToast(`Toast ${i}`);
            }

            const toasts = toastContainer.querySelectorAll('.toast');
            expect(toasts.length).toBe(10);
        });
    });

    describe('Toast lifecycle', () => {
        it('should complete full lifecycle of a toast', () => {
            // Create toast
            showToast('Lifecycle test');
            let toast = toastContainer.querySelector('.toast');
            expect(toast).toBeTruthy();

            // Toast visible for 3 seconds
            jest.advanceTimersByTime(2999);
            toast = toastContainer.querySelector('.toast');
            expect(toast).toBeTruthy();

            // Fade out starts at 3 seconds
            jest.advanceTimersByTime(1);
            toast = toastContainer.querySelector('.toast');
            expect(toast).toBeTruthy();
            expect((toast as HTMLElement).style.opacity).toBe('0');

            // Removed after fade animation
            jest.advanceTimersByTime(300);
            toast = toastContainer.querySelector('.toast');
            expect(toast).toBeFalsy();
        });

        it('should handle toast removal timing correctly', () => {
            showToast('Timing test');

            // At 0ms - toast created
            expect(toastContainer.children.length).toBe(1);

            // At 2999ms - toast still visible
            jest.advanceTimersByTime(2999);
            expect(toastContainer.children.length).toBe(1);

            // At 3000ms - fade out begins
            jest.advanceTimersByTime(1);
            expect(toastContainer.children.length).toBe(1);

            // At 3300ms - toast removed
            jest.advanceTimersByTime(300);
            expect(toastContainer.children.length).toBe(0);
        });
    });
});
