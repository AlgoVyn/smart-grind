// --- MODAL MANAGEMENT ---

import { Topic, Pattern } from '../types.js';
import { state } from '../state.js';
import { data } from '../data.js';
import { utils } from '../utils.js';
import { api } from '../api.js';
import { renderers } from '../renderers.js';

// Generic modal handler factory
export const createModalHandler = (modalEl: HTMLElement, contentEl: HTMLElement | null | undefined, closeCallback?: () => void) => {
    return (e: Event) => {
        if (e && e.target !== modalEl) {
            if (contentEl) e?.stopPropagation();
            return;
        }
        modalEl.classList.add('hidden');
        closeCallback?.();
    };
};

// Generic modal manager
export const modalManager = {
    show: (modalEl: HTMLElement, setupCallback?: () => void) => {
        if (setupCallback) setupCallback();
        modalEl.classList.remove('hidden');
    },

    hide: (modalEl: HTMLElement, cleanupCallback?: () => void) => {
        modalEl.classList.add('hidden');
        if (cleanupCallback) cleanupCallback();
    }
};

// Modal functions
export const openSigninModal = () => {
    const modalEl = state.elements['signinModal'];
    if (modalEl) {
        modalManager.show(modalEl);
    }
};

export const closeSigninModal = () => {
    const modalEl = state.elements['signinModal'];
    if (modalEl) {
        modalManager.hide(modalEl);
    }
};



let _confirmResolve: ((_value: boolean) => void) | null = null;

export const _setupAddModal = () => {
    // Populate category dropdown
    const categoryEl = state.elements['addProbCategory'];
    const categoryNewEl = state.elements['addProbCategoryNew'];
    const patternEl = state.elements['addProbPattern'];
    const patternNewEl = state.elements['addProbPatternNew'];

    if (categoryEl) {
        categoryEl.innerHTML = '<option value="">-- Select or Type New --</option>' +
            data.topicsData.map((t: Topic) => `<option value="${t.title}">${t.title}</option>`).join('');
    }

    // Clear inputs
    ['addProbName', 'addProbUrl', 'addProbCategoryNew', 'addProbPatternNew'].forEach(id => {
        const element = state.elements[id as keyof typeof state.elements] as HTMLInputElement | null;
        if (element) element.value = '';
    });

    if (categoryNewEl) {
        categoryNewEl.classList.remove('hidden');
    }

    if (patternEl) {
        patternEl.innerHTML = '<option value="">-- Select Category First --</option>';
    }

    if (patternNewEl) {
        patternNewEl.classList.remove('hidden');
    }
};

export const openAddModal = () => {
    const modalEl = state.elements['addProblemModal'];
    if (modalEl) {
        modalManager.show(modalEl, _setupAddModal);
    }
};

export const closeAddModal = () => {
    const modalEl = state.elements['addProblemModal'];
    if (modalEl) {
        modalManager.hide(modalEl);
    }
};

// Alert modal functions
let showAlertCalled = false;
let lastShowAlertMessage = '';
let lastShowAlertTitle = '';

export const showAlert = (message: string, title = 'Alert') => {
    showAlertCalled = true;
    lastShowAlertMessage = message;
    lastShowAlertTitle = title;
    const modalEl = state.elements['alertModal'];
    if (modalEl) {
        modalManager.show(modalEl, () => {
            const titleEl = state.elements['alertTitle'];
            const messageEl = state.elements['alertMessage'];
            if (titleEl) {
                titleEl.textContent = title;
            }
            if (messageEl) {
                messageEl.textContent = message;
            }
        });
    }
};

export const getShowAlertHistory = () => ({
    called: showAlertCalled,
    lastMessage: lastShowAlertMessage,
    lastTitle: lastShowAlertTitle
});

export const clearShowAlertHistory = () => {
    showAlertCalled = false;
    lastShowAlertMessage = '';
    lastShowAlertTitle = '';
};

export const closeAlertModal = () => {
    const modalEl = state.elements['alertModal'];
    if (modalEl) {
        modalManager.hide(modalEl);
    }
};

// Confirm modal functions
export const showConfirm = (message: string, title = 'Confirm Action') => {
    return new Promise((resolve: (_value: boolean) => void) => {
        const modalEl = state.elements['confirmModal'];
        if (modalEl) {
            modalManager.show(modalEl, () => {
                const titleEl = state.elements['confirmTitle'];
                const messageEl = state.elements['confirmMessage'];
                if (titleEl) {
                    titleEl.textContent = title;
                }
                if (messageEl) {
                    // Allow basic formatting tags while sanitizing potentially dangerous content
                    // First, escape HTML entities to prevent XSS
                    let sanitized = message
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#039;');
                    // Then restore allowed formatting tags
                    sanitized = sanitized
                        .replace(/&lt;b&gt;/g, '<b>')
                        .replace(/&lt;\/b&gt;/g, '</b>')
                        .replace(/&lt;i&gt;/g, '<i>')
                        .replace(/&lt;\/i&gt;/g, '</i>')
                        .replace(/&lt;u&gt;/g, '<u>')
                        .replace(/&lt;\/u&gt;/g, '</u>')
                        .replace(/&lt;br\s*\/?&gt;/g, '<br>')
                        .replace(/&lt;\/br&gt;/g, '<br>');
                    messageEl.innerHTML = sanitized;
                }
            });
            _confirmResolve = resolve;
        }
    });
};

export const closeConfirmModal = (result: boolean) => {
    const modalEl = state.elements['confirmModal'];
    if (modalEl) {
        modalManager.hide(modalEl, () => {
            if (_confirmResolve) {
                _confirmResolve(result);
                _confirmResolve = null;
            }
        });
    }
};

export const _toggleElementVisibility = (element: HTMLElement, hide: boolean) => {
    if (hide) {
        element.classList.add('hidden');
    } else {
        element.classList.remove('hidden');
    }
};

export const handleCategoryChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const val = target.value;
    const categoryNewEl = state.elements['addProbCategoryNew'];
    const patternEl = state.elements['addProbPattern'];
    const patternNewEl = state.elements['addProbPatternNew'];

    if (categoryNewEl) {
        _toggleElementVisibility(categoryNewEl, !!val);
    }

    if (val && patternEl) {
        const topic = data.topicsData.find((t: Topic) => t.title === val);
        patternEl.innerHTML = topic
            ? '<option value="">-- Select or Type New --</option>' + topic.patterns.map((p: Pattern) => `<option value="${p.name}">${p.name}</option>`).join('')
            : '<option value="">-- No Patterns Found --</option>';
    } else if (patternEl) {
        patternEl.innerHTML = '<option value="">-- Select Category First --</option>';
    }

    if (patternNewEl) {
        _toggleElementVisibility(patternNewEl, false);
    }
};

export const handlePatternChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const patternNewEl = state.elements['addProbPatternNew'];
    if (patternNewEl) {
        _toggleElementVisibility(patternNewEl, !!target.value);
    }
};

export const _getSanitizedInputs = () => {
    const rawName = (state.elements['addProbName'] as HTMLInputElement | null)?.value || '';
    const rawUrl = (state.elements['addProbUrl'] as HTMLInputElement | null)?.value || '';
    let rawCategory = (state.elements['addProbCategory'] as HTMLSelectElement | null)?.value || '';
    if (!rawCategory) rawCategory = (state.elements['addProbCategoryNew'] as HTMLInputElement | null)?.value || '';
    let rawPattern = (state.elements['addProbPattern'] as HTMLSelectElement | null)?.value || '';
    if (!rawPattern || !(state.elements['addProbCategory'] as HTMLSelectElement | null)?.value) rawPattern = (state.elements['addProbPatternNew'] as HTMLInputElement | null)?.value || '';
    const name = utils.sanitizeInput(rawName);
    const url = utils.sanitizeUrl(rawUrl);
    const category = utils.sanitizeInput(rawCategory);
    const pattern = utils.sanitizeInput(rawPattern);
    return { name, url, category, pattern };
};

export const _validateInputs = ({ name, url, category, pattern }: { name: string, url: string, category: string, pattern: string }, alertFunction = showAlert) => {
    if (!name.trim()) {
        alertFunction('Problem name is required and cannot be empty after sanitization.');
        return false;
    }
    if (!url.trim()) {
        alertFunction('Problem URL is required and cannot be empty after sanitization.');
        return false;
    }
    if (!category.trim()) {
        alertFunction('Category is required and cannot be empty after sanitization.');
        return false;
    }
    if (!pattern.trim()) {
        alertFunction('Pattern is required and cannot be empty after sanitization.');
        return false;
    }
    try {
        new URL(url);
    } catch (_e) {
        alertFunction('Please enter a valid URL for the problem.');
        return false;
    }
    return true;
};

export const _createNewProblem = (name: string, url: string, category: string, pattern: string) => {
    const id = 'custom-' + Date.now();
    return {
        id,
        name,
        url,
        topic: category,
        pattern: pattern,
        status: 'unsolved' as const,
        reviewInterval: 0,
        nextReviewDate: null,
        note: '',
        loading: false
    };
};

export const _updateUIAfterAddingProblem = () => {
    const modalEl = state.elements['addProblemModal'];
    if (modalEl) {
        modalEl.classList.add('hidden');
    }
    renderers.renderSidebar();
    renderers.renderMainView(state.ui.activeTopicId);
    utils.showToast('Problem added!');
};

export const saveNewProblem = async () => {
    const inputs = _getSanitizedInputs();
    if (!_validateInputs(inputs)) return;

    const { name, url, category, pattern } = inputs;
    const newProb = _createNewProblem(name, url, category, pattern);

    // Update State
    state.problems.set(newProb.id, newProb);
    // Update In-Memory Structure
    api.mergeStructure();
    // Save to Firebase
    await api.saveProblem(newProb);

    _updateUIAfterAddingProblem();
};