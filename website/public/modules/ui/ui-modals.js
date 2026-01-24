// --- MODAL MANAGEMENT ---

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.ui = window.SmartGrind.ui || {};

// Generic modal handler factory
window.SmartGrind.ui.createModalHandler = (modalEl, contentEl, closeCallback) => {
    return (e) => {
        if (e && e.target !== modalEl) {
            if (contentEl) e?.stopPropagation();
            return;
        }
        modalEl.classList.add('hidden');
        closeCallback?.();
    };
};

// Generic modal manager
window.SmartGrind.ui.modalManager = {
    show: (modalEl, setupCallback) => {
        if (setupCallback) setupCallback();
        modalEl.classList.remove('hidden');
    },

    hide: (modalEl, cleanupCallback) => {
        modalEl.classList.add('hidden');
        if (cleanupCallback) cleanupCallback();
    }
};

// Modal functions
window.SmartGrind.ui.openSigninModal = () => {
    window.SmartGrind.ui.modalManager.show(window.SmartGrind.state.elements.signinModal);
};

window.SmartGrind.ui.closeSigninModal = () => {
    window.SmartGrind.ui.modalManager.hide(window.SmartGrind.state.elements.signinModal);
};

const setupAddModal = () => {
    // Populate category dropdown
    window.SmartGrind.state.elements.addProbCategory.innerHTML = `<option value="">-- Select or Type New --</option>` +
        window.SmartGrind.data.topicsData.map(t => `<option value="${t.title}">${t.title}</option>`).join('');

    // Clear inputs
    ['addProbName', 'addProbUrl', 'addProbCategoryNew', 'addProbPatternNew'].forEach(id => {
        window.SmartGrind.state.elements[id].value = '';
    });
    window.SmartGrind.state.elements.addProbCategoryNew.classList.remove('hidden');
    window.SmartGrind.state.elements.addProbPattern.innerHTML = '<option value="">-- Select Category First --</option>';
    window.SmartGrind.state.elements.addProbPatternNew.classList.remove('hidden');
};

window.SmartGrind.ui.openAddModal = () => {
    window.SmartGrind.ui.modalManager.show(window.SmartGrind.state.elements.addProblemModal, setupAddModal);
};

window.SmartGrind.ui.closeAddModal = () => {
    window.SmartGrind.ui.modalManager.hide(window.SmartGrind.state.elements.addProblemModal);
};

// Alert modal functions
window.SmartGrind.ui.showAlert = (message, title = "Alert") => {
    window.SmartGrind.ui.modalManager.show(window.SmartGrind.state.elements.alertModal, () => {
        window.SmartGrind.state.elements.alertTitle.textContent = title;
        window.SmartGrind.state.elements.alertMessage.textContent = message;
    });
};

window.SmartGrind.ui.closeAlertModal = () => {
    window.SmartGrind.ui.modalManager.hide(window.SmartGrind.state.elements.alertModal);
};

// Confirm modal functions
window.SmartGrind.ui.showConfirm = (message, title = "Confirm Action") => {
    return new Promise((resolve) => {
        window.SmartGrind.ui.modalManager.show(window.SmartGrind.state.elements.confirmModal, () => {
            window.SmartGrind.state.elements.confirmTitle.textContent = title;
            window.SmartGrind.state.elements.confirmMessage.textContent = message;
        });
        window.SmartGrind.ui._confirmResolve = resolve;
    });
};

window.SmartGrind.ui.closeConfirmModal = (result) => {
    window.SmartGrind.ui.modalManager.hide(window.SmartGrind.state.elements.confirmModal, () => {
        if (window.SmartGrind.ui._confirmResolve) {
            window.SmartGrind.ui._confirmResolve(result);
            window.SmartGrind.ui._confirmResolve = null;
        }
    });
};

const toggleElementVisibility = (element, hide) => {
    if (hide) {
        element.classList.add('hidden');
    } else {
        element.classList.remove('hidden');
    }
};

window.SmartGrind.ui.handleCategoryChange = (e) => {
    const val = e.target.value;
    const categoryNewEl = window.SmartGrind.state.elements.addProbCategoryNew;
    const patternEl = window.SmartGrind.state.elements.addProbPattern;
    const patternNewEl = window.SmartGrind.state.elements.addProbPatternNew;

    toggleElementVisibility(categoryNewEl, !!val);

    if (val) {
        const topic = window.SmartGrind.data.topicsData.find(t => t.title === val);
        patternEl.innerHTML = topic
            ? `<option value="">-- Select or Type New --</option>` + topic.patterns.map(p => `<option value="${p.name}">${p.name}</option>`).join('')
            : '<option value="">-- No Patterns Found --</option>';
    } else {
        patternEl.innerHTML = '<option value="">-- Select Category First --</option>';
    }
    toggleElementVisibility(patternNewEl, false);
};

window.SmartGrind.ui.handlePatternChange = (e) => {
    toggleElementVisibility(window.SmartGrind.state.elements.addProbPatternNew, !!e.target.value);
};

const getSanitizedInputs = () => {
    const rawName = window.SmartGrind.state.elements.addProbName.value;
    const rawUrl = window.SmartGrind.state.elements.addProbUrl.value;
    let rawCategory = window.SmartGrind.state.elements.addProbCategory.value;
    if (!rawCategory) rawCategory = window.SmartGrind.state.elements.addProbCategoryNew.value;
    let rawPattern = window.SmartGrind.state.elements.addProbPattern.value;
    if (!rawPattern || !window.SmartGrind.state.elements.addProbCategory.value) rawPattern = window.SmartGrind.state.elements.addProbPatternNew.value;
    const name = window.SmartGrind.utils.sanitizeInput(rawName);
    const url = window.SmartGrind.utils.sanitizeUrl(rawUrl);
    const category = window.SmartGrind.utils.sanitizeInput(rawCategory);
    const pattern = window.SmartGrind.utils.sanitizeInput(rawPattern);
    return { name, url, category, pattern };
};

const validateInputs = ({ name, url, category, pattern }) => {
    if (!name.trim()) {
        window.SmartGrind.ui.showAlert("Problem name is required and cannot be empty after sanitization.");
        return false;
    }
    if (!url.trim()) {
        window.SmartGrind.ui.showAlert("Problem URL is required and cannot be empty after sanitization.");
        return false;
    }
    if (!category.trim()) {
        window.SmartGrind.ui.showAlert("Category is required and cannot be empty after sanitization.");
        return false;
    }
    if (!pattern.trim()) {
        window.SmartGrind.ui.showAlert("Pattern is required and cannot be empty after sanitization.");
        return false;
    }
    try {
        new URL(url);
    } catch (e) {
        window.SmartGrind.ui.showAlert("Please enter a valid URL for the problem.");
        return false;
    }
    return true;
};

const createNewProblem = (name, url, category, pattern) => {
    const id = 'custom-' + Date.now();
    return {
        id,
        name,
        url,
        topic: category,
        pattern: pattern,
        status: 'unsolved',
        reviewInterval: 0,
        nextReviewDate: null,
        note: '',
        loading: false
    };
};

const updateUIAfterAddingProblem = () => {
    window.SmartGrind.state.elements.addProblemModal.classList.add('hidden');
    window.SmartGrind.renderers.renderSidebar();
    window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
    window.SmartGrind.utils.showToast("Problem added!");
};

window.SmartGrind.ui.saveNewProblem = async () => {
    const inputs = getSanitizedInputs();
    if (!validateInputs(inputs)) return;

    const newProb = createNewProblem(...Object.values(inputs));

    // Update State
    window.SmartGrind.state.problems.set(newProb.id, newProb);
    // Update In-Memory Structure
    window.SmartGrind.api.mergeStructure();
    // Save to Firebase
    await window.SmartGrind.api.saveProblem(newProb);

    updateUIAfterAddingProblem();
};