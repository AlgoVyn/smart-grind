/**
 * @jest-environment jsdom
 *
 * DOM Utility Tests
 * Tests for pure DOM helpers extracted from the utils barrel file.
 */

import {
    hideEl,
    showEl,
    toggleEl,
    cacheElements,
    getElement,
    type ElementCache,
} from '../../src/utils/dom';

describe('DOM Utilities', () => {
    describe('hideEl / showEl / toggleEl', () => {
        let el: HTMLElement;

        beforeEach(() => {
            el = document.createElement('div');
        });

        test('hideEl adds hidden class', () => {
            hideEl(el);
            expect(el.classList.contains('hidden')).toBe(true);
        });

        test('hideEl handles null gracefully', () => {
            expect(() => hideEl(null)).not.toThrow();
        });

        test('hideEl handles undefined gracefully', () => {
            expect(() => hideEl(undefined)).not.toThrow();
        });

        test('showEl removes hidden class', () => {
            el.classList.add('hidden');
            showEl(el);
            expect(el.classList.contains('hidden')).toBe(false);
        });

        test('showEl handles null gracefully', () => {
            expect(() => showEl(null)).not.toThrow();
        });

        test('showEl handles undefined gracefully', () => {
            expect(() => showEl(undefined)).not.toThrow();
        });

        test('toggleEl shows element when visible is true', () => {
            el.classList.add('hidden');
            toggleEl(el, true);
            expect(el.classList.contains('hidden')).toBe(false);
        });

        test('toggleEl hides element when visible is false', () => {
            toggleEl(el, false);
            expect(el.classList.contains('hidden')).toBe(true);
        });

        test('toggleEl handles null gracefully', () => {
            expect(() => toggleEl(null, true)).not.toThrow();
        });
    });

    describe('cacheElements', () => {
        beforeEach(() => {
            // Create a representative subset of expected DOM elements
            const ids = [
                'setup-modal',
                'add-problem-modal',
                'signin-modal',
                'app-wrapper',
                'loading-screen',
                'topic-list',
                'problems-container',
                'content-scroll',
                'empty-state',
                'current-view-title',
                'toast-container',
                'add-prob-name',
                'add-prob-url',
            ];
            ids.forEach((id) => {
                const div = document.createElement('div');
                div.id = id;
                document.body.appendChild(div);
            });

            // Add filter buttons
            const btn1 = document.createElement('button');
            btn1.className = 'filter-btn';
            document.body.appendChild(btn1);
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        test('caches elements by kebab-case id', () => {
            const elements = cacheElements();

            expect(elements.setupModal).not.toBeNull();
            expect(elements.addProblemModal).not.toBeNull();
            expect(elements.appWrapper).not.toBeNull();
            expect(elements.toastContainer).not.toBeNull();
            expect(elements.addProbName).not.toBeNull();
        });

        test('includes filter buttons NodeList', () => {
            const elements = cacheElements();
            expect(elements.filterBtns).not.toBeNull();
            expect(elements.filterBtns?.length).toBe(1);
        });

        test('returns null for missing elements', () => {
            document.body.innerHTML = '';
            const elements = cacheElements();
            expect(elements.setupModal).toBeNull();
            expect(elements.appWrapper).toBeNull();
        });
    });

    describe('getElement', () => {
        test('finds element by camelCase id converted to kebab-case', () => {
            const div = document.createElement('div');
            div.id = 'test-element';
            document.body.appendChild(div);

            const result = getElement('testElement');
            expect(result).toBe(div);

            document.body.removeChild(div);
        });

        test('finds element by raw id that already contains hyphens', () => {
            const div = document.createElement('div');
            div.id = 'already-kebab';
            document.body.appendChild(div);

            const result = getElement('already-kebab');
            expect(result).toBe(div);

            document.body.removeChild(div);
        });

        test('returns null for missing element', () => {
            const result = getElement('nonExistentElement');
            expect(result).toBeNull();
        });
    });
});
