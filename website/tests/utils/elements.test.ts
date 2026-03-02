/**
 * @jest-environment jsdom
 *
 * Tests for Element Caching Utility
 */

import {
    cacheElements,
    getElement,
    getElements,
    getCachedElement,
    type ElementCache,
} from '../../src/utils/elements';

describe('Elements Utility', () => {
    beforeEach(() => {
        // Clean up DOM
        document.body.innerHTML = '';
    });

    describe('cacheElements', () => {
        it('should cache modal elements', () => {
            document.body.innerHTML = `
                <div id="setup-modal"></div>
                <div id="add-problem-modal"></div>
                <div id="signin-modal"></div>
            `;

            const elements = cacheElements<Partial<ElementCache>>();

            expect(elements.setupModal).toBeInstanceOf(HTMLElement);
            expect(elements.addProblemModal).toBeInstanceOf(HTMLElement);
            expect(elements.signinModal).toBeInstanceOf(HTMLElement);
        });

        it('should cache app structure elements', () => {
            document.body.innerHTML = `
                <div id="app-wrapper"></div>
                <div id="loading-screen"></div>
                <div id="topic-list"></div>
                <div id="problems-container"></div>
            `;

            const elements = cacheElements<Partial<ElementCache>>();

            expect(elements.appWrapper).toBeInstanceOf(HTMLElement);
            expect(elements.loadingScreen).toBeInstanceOf(HTMLElement);
            expect(elements.topicList).toBeInstanceOf(HTMLElement);
            expect(elements.problemsContainer).toBeInstanceOf(HTMLElement);
        });

        it('should cache auth elements', () => {
            document.body.innerHTML = `
                <button id="google-login-button"></button>
                <div id="user-display"></div>
                <button id="disconnect-btn"></button>
            `;

            const elements = cacheElements<Partial<ElementCache>>();

            expect(elements.googleLoginButton).toBeInstanceOf(HTMLElement);
            expect(elements.userDisplay).toBeInstanceOf(HTMLElement);
            expect(elements.disconnectBtn).toBeInstanceOf(HTMLElement);
        });

        it('should cache stats elements', () => {
            document.body.innerHTML = `
                <div id="stat-total"></div>
                <div id="stat-solved"></div>
                <div id="stat-due"></div>
            `;

            const elements = cacheElements<Partial<ElementCache>>();

            expect(elements.statTotal).toBeInstanceOf(HTMLElement);
            expect(elements.statSolved).toBeInstanceOf(HTMLElement);
            expect(elements.statDue).toBeInstanceOf(HTMLElement);
        });

        it('should cache form input elements', () => {
            document.body.innerHTML = `
                <input id="add-prob-name" type="text">
                <input id="add-prob-url" type="url">
                <input id="problem-search" type="search">
            `;

            const elements = cacheElements<Partial<ElementCache>>();

            expect(elements.addProbName).toBeInstanceOf(HTMLInputElement);
            expect(elements.addProbUrl).toBeInstanceOf(HTMLInputElement);
            expect(elements.problemSearch).toBeInstanceOf(HTMLInputElement);
        });

        it('should cache select elements', () => {
            document.body.innerHTML = `
                <select id="add-prob-category"></select>
                <select id="add-prob-pattern"></select>
                <select id="review-date-filter"></select>
            `;

            const elements = cacheElements<Partial<ElementCache>>();

            expect(elements.addProbCategory).toBeInstanceOf(HTMLSelectElement);
            expect(elements.addProbPattern).toBeInstanceOf(HTMLSelectElement);
            expect(elements.reviewDateFilter).toBeInstanceOf(HTMLSelectElement);
        });

        it('should cache filter button collection', () => {
            document.body.innerHTML = `
                <button class="filter-btn" data-filter="all">All</button>
                <button class="filter-btn" data-filter="solved">Solved</button>
                <button class="filter-btn" data-filter="unsolved">Unsolved</button>
            `;

            const elements = cacheElements<Partial<ElementCache>>();

            expect(elements.filterBtns).toBeInstanceOf(NodeList);
            expect(elements.filterBtns?.length).toBe(3);
        });

        it('should return null for non-existent elements', () => {
            const elements = cacheElements<Partial<ElementCache>>();

            expect(elements.setupModal).toBeNull();
            expect(elements.appWrapper).toBeNull();
            expect(elements.googleLoginButton).toBeNull();
        });

        it('should convert kebab-case IDs to camelCase keys', () => {
            document.body.innerHTML = `
                <div id="signin-modal-content"></div>
                <div id="current-view-title"></div>
                <div id="sidebar-total-stat"></div>
            `;

            const elements = cacheElements<Partial<ElementCache>>();

            expect(elements.signinModalContent).toBeInstanceOf(HTMLElement);
            expect(elements.currentViewTitle).toBeInstanceOf(HTMLElement);
            expect(elements.sidebarTotalStat).toBeInstanceOf(HTMLElement);
        });
    });

    describe('getElement', () => {
        it('should get element by kebab-case ID', () => {
            document.body.innerHTML = '<div id="test-element"></div>';

            const element = getElement('test-element');

            expect(element).toBeInstanceOf(HTMLElement);
            expect(element?.id).toBe('test-element');
        });

        it('should get element by camelCase ID', () => {
            document.body.innerHTML = '<div id="test-element"></div>';

            const element = getElement('testElement');

            expect(element).toBeInstanceOf(HTMLElement);
            expect(element?.id).toBe('test-element');
        });

        it('should return null for non-existent element', () => {
            const element = getElement('non-existent');

            expect(element).toBeNull();
        });

        it('should return typed element', () => {
            document.body.innerHTML = '<input id="test-input" type="text">';

            const element = getElement<HTMLInputElement>('test-input');

            expect(element).toBeInstanceOf(HTMLInputElement);
        });
    });

    describe('getElements', () => {
        it('should get elements by selector', () => {
            document.body.innerHTML = `
                <div class="test-class"></div>
                <div class="test-class"></div>
                <div class="test-class"></div>
            `;

            const elements = getElements('.test-class');

            expect(elements.length).toBe(3);
        });

        it('should return empty NodeList for non-matching selector', () => {
            const elements = getElements('.non-existent');

            expect(elements.length).toBe(0);
        });
    });

    describe('getCachedElement', () => {
        it('should return cached element by key', () => {
            const mockCache: Partial<ElementCache> = {
                setupModal: document.createElement('div'),
                appWrapper: document.createElement('div'),
            };

            const element = getCachedElement(mockCache, 'setupModal');

            expect(element).toBe(mockCache.setupModal);
        });

        it('should return null for missing key', () => {
            const mockCache: Partial<ElementCache> = {};

            const element = getCachedElement(mockCache, 'setupModal');

            expect(element).toBeNull();
        });

        it('should maintain type safety for different element types', () => {
            const input = document.createElement('input');
            const select = document.createElement('select');

            const mockCache: Partial<ElementCache> = {
                addProbName: input as HTMLInputElement,
                addProbCategory: select as HTMLSelectElement,
            };

            const inputElement = getCachedElement(mockCache, 'addProbName');
            const selectElement = getCachedElement(mockCache, 'addProbCategory');

            expect(inputElement).toBe(input);
            expect(selectElement).toBe(select);
        });
    });

    describe('ElementCache interface', () => {
        it('should support all expected element keys', () => {
            const cache: Partial<ElementCache> = {
                // Modals
                setupModal: null,
                addProblemModal: null,
                signinModal: null,
                alertModal: null,
                confirmModal: null,
                solutionModal: null,

                // App structure
                appWrapper: null,
                loadingScreen: null,
                topicList: null,
                problemsContainer: null,
                contentScroll: null,
                emptyState: null,
                currentViewTitle: null,

                // Auth
                googleLoginButton: null,
                userDisplay: null,
                disconnectBtn: null,

                // Stats
                statTotal: null,
                statSolved: null,
                statDue: null,

                // Form inputs
                addProbName: null,
                addProbUrl: null,
                problemSearch: null,

                // Selects
                addProbCategory: null,
                addProbPattern: null,
                reviewDateFilter: null,

                // Collections
                filterBtns: null,
            };

            // Verify all keys are defined
            expect(Object.keys(cache).length).toBeGreaterThan(0);
        });

        it('should support dynamic key access', () => {
            const cache: Partial<ElementCache> = {
                setupModal: document.createElement('div'),
            };

            const key = 'setupModal';
            const element = cache[key];

            expect(element).toBeDefined();
        });
    });
});
