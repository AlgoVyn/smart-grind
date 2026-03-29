// --- FOCUS TRAP UTILITY ---
// Manages focus within modal dialogs for accessibility

export interface FocusTrapOptions {
    /** Element that contains focusable elements */
    container: HTMLElement;
    /** Optional element to return focus to when trap is deactivated */
    returnFocusTo?: HTMLElement | null;
    /** Class to add to focusable elements for styling */
    focusableClass?: string;
}

export interface FocusTrapInstance {
    /** Activate the focus trap */
    activate: () => void;
    /** Deactivate the focus trap */
    deactivate: () => void;
    /** Check if trap is currently active */
    isActive: () => boolean;
}

/** CSS selectors for focusable elements */
const FOCUSABLE_SELECTORS = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'summary',
    '[contenteditable]',
].join(', ');

/** Gets all focusable elements within a container */
const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    // Handle test environments where container may not have real DOM methods
    if (!container || typeof container.querySelectorAll !== 'function') {
        return [];
    }

    const elements = Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS)) as HTMLElement[];
    // Filter out hidden elements
    return elements.filter((el) => {
        if (!el || typeof window.getComputedStyle !== 'function') return true;
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
    });
};

/** Creates and manages a focus trap within a container element */
export const createFocusTrap = (options: FocusTrapOptions): FocusTrapInstance => {
    const { container, returnFocusTo, focusableClass = 'modal-focusable' } = options;

    let isActive = false;
    let previouslyFocusedElement: Element | null = null;
    let focusableElements: HTMLElement[] = [];
    let firstFocusableElement: HTMLElement | null = null;
    let lastFocusableElement: HTMLElement | null = null;

    /** Update the list of focusable elements */
    const updateFocusableElements = (): void => {
        focusableElements = getFocusableElements(container);
        firstFocusableElement = focusableElements[0] || null;
        lastFocusableElement = focusableElements[focusableElements.length - 1] || null;
    };

    /** Handle Tab key navigation */
    const handleTabKey = (e: KeyboardEvent): void => {
        if (!isActive) return;

        updateFocusableElements();

        if (focusableElements.length === 0) {
            e.preventDefault();
            return;
        }

        const activeElement = document.activeElement;
        const isTabPressed = e.key === 'Tab';
        const isShiftTab = e.shiftKey && isTabPressed;

        if (!isTabPressed) return;

        // If focus is on the last element and Tab is pressed, wrap to first
        if (activeElement === lastFocusableElement && !isShiftTab) {
            e.preventDefault();
            firstFocusableElement?.focus();
            return;
        }

        // If focus is on the first element and Shift+Tab is pressed, wrap to last
        if (activeElement === firstFocusableElement && isShiftTab) {
            e.preventDefault();
            lastFocusableElement?.focus();
            return;
        }

        // If focus is outside the container, move it back inside
        if (!container.contains(activeElement)) {
            e.preventDefault();
            if (isShiftTab) {
                lastFocusableElement?.focus();
            } else {
                firstFocusableElement?.focus();
            }
        }
    };

    /** Handle Escape key to close modal */
    const handleEscapeKey = (e: KeyboardEvent): void => {
        if (e.key === 'Escape' && isActive) {
            // Dispatch custom event that modals can listen for
            const escapeEvent = new CustomEvent('focusTrapEscape', {
                bubbles: true,
                cancelable: true,
            });
            container.dispatchEvent(escapeEvent);
        }
    };

    /** Keyboard event handler */
    const handleKeyDown = (e: KeyboardEvent): void => {
        handleTabKey(e);
        handleEscapeKey(e);
    };

    /** Activate the focus trap */
    const activate = (): void => {
        if (isActive) return;

        // Skip if container doesn't have required DOM methods (e.g., in tests)
        if (!container || typeof container.setAttribute !== 'function') {
            return;
        }

        // Store the currently focused element
        previouslyFocusedElement = document.activeElement;

        // Update focusable elements
        updateFocusableElements();

        // Add focusable class to all focusable elements for styling
        if (focusableClass) {
            focusableElements.forEach((el) => {
                if (el && typeof el.classList?.add === 'function') {
                    el.classList.add(focusableClass);
                }
            });
        }

        // Focus the first focusable element
        if (firstFocusableElement && typeof firstFocusableElement.focus === 'function') {
            firstFocusableElement.focus();
        }

        // Add keyboard event listener
        if (typeof document.addEventListener === 'function') {
            document.addEventListener('keydown', handleKeyDown);
        }

        // Mark container as having active focus trap
        container.setAttribute('data-focus-trap', 'active');

        isActive = true;
    };

    /** Deactivate the focus trap */
    const deactivate = (): void => {
        if (!isActive) return;

        // Remove keyboard event listener
        if (typeof document.removeEventListener === 'function') {
            document.removeEventListener('keydown', handleKeyDown);
        }

        // Remove focusable class
        if (focusableClass) {
            focusableElements.forEach((el) => {
                if (el && typeof el.classList?.remove === 'function') {
                    el.classList.remove(focusableClass);
                }
            });
        }

        // Remove focus trap attribute
        if (container && typeof container.removeAttribute === 'function') {
            container.removeAttribute('data-focus-trap');
        }

        // Return focus to the previously focused element or specified element
        const returnTo = returnFocusTo || (previouslyFocusedElement as HTMLElement);
        if (returnTo && typeof returnTo.focus === 'function') {
            // Small delay to ensure modal is closed
            if (typeof setTimeout === 'function') {
                setTimeout(() => returnTo.focus(), 0);
            }
        }

        isActive = false;
    };

    /** Check if trap is active */
    const getIsActive = (): boolean => isActive;

    return {
        activate,
        deactivate,
        isActive: getIsActive,
    };
};

/** Utility to focus the first focusable element in a container */
export const focusFirstElement = (container: HTMLElement): void => {
    const elements = getFocusableElements(container);
    elements[0]?.focus();
};

/** Utility to focus the last focusable element in a container */
export const focusLastElement = (container: HTMLElement): void => {
    const elements = getFocusableElements(container);
    elements[elements.length - 1]?.focus();
};

/** Utility to check if an element is focusable */
export const isFocusable = (element: HTMLElement): boolean => {
    const selectors = FOCUSABLE_SELECTORS.split(', ');
    return selectors.some((selector) => element.matches(selector));
};
