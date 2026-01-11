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

window.SmartGrind.ui.openAddModal = () => {
    window.SmartGrind.ui.modalManager.show(window.SmartGrind.state.elements.addProblemModal, () => {
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
    });
};

window.SmartGrind.ui.closeAddModal = () => {
    window.SmartGrind.ui.modalManager.hide(window.SmartGrind.state.elements.addProblemModal);
};

// Alert modal functions
window.SmartGrind.ui.showAlert = (message, title = "Alert") => {
    window.SmartGrind.ui.modalManager.show(window.SmartGrind.state.elements.alertModal, () => {
        window.SmartGrind.state.elements.alertTitle.textContent = title;
        window.SmartGrind.state.elements.alertMessage.innerHTML = message;
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
            window.SmartGrind.state.elements.confirmMessage.innerHTML = message;
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

window.SmartGrind.ui.handleCategoryChange = (e) => {
    const val = e.target.value;
    if (val) {
        window.SmartGrind.state.elements.addProbCategoryNew.classList.add('hidden');
        const topic = window.SmartGrind.data.topicsData.find(t => t.title === val);
        if (topic) {
            window.SmartGrind.state.elements.addProbPattern.innerHTML = `<option value="">-- Select or Type New --</option>` +
                topic.patterns.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
        } else {
            window.SmartGrind.state.elements.addProbPattern.innerHTML = '<option value="">-- No Patterns Found --</option>';
        }
    } else {
        window.SmartGrind.state.elements.addProbCategoryNew.classList.remove('hidden');
        window.SmartGrind.state.elements.addProbPattern.innerHTML = '<option value="">-- Select Category First --</option>';
    }
    window.SmartGrind.state.elements.addProbPatternNew.classList.remove('hidden');
};

window.SmartGrind.ui.handlePatternChange = (e) => {
    if (e.target.value) window.SmartGrind.state.elements.addProbPatternNew.classList.add('hidden');
    else window.SmartGrind.state.elements.addProbPatternNew.classList.remove('hidden');
};

window.SmartGrind.ui.saveNewProblem = async () => {
    const name = window.SmartGrind.state.elements.addProbName.value.trim();
    const url = window.SmartGrind.state.elements.addProbUrl.value.trim();
    let category = window.SmartGrind.state.elements.addProbCategory.value;
    if (!category) category = window.SmartGrind.state.elements.addProbCategoryNew.value.trim();

    let pattern = window.SmartGrind.state.elements.addProbPattern.value;
    if (!pattern || !window.SmartGrind.state.elements.addProbCategory.value) pattern = window.SmartGrind.state.elements.addProbPatternNew.value.trim();

    if (!name || !url || !category || !pattern) {
        window.SmartGrind.ui.showAlert("Please fill in Name, URL, Category and Pattern.");
        return;
    }

    const id = 'custom-' + Date.now();
    const newProb = {
        id, name, url,
        topic: category,
        pattern: pattern,
        status: 'unsolved',
        reviewInterval: 0,
        nextReviewDate: null,
        note: '',
        loading: false
    };

    // Update State
    window.SmartGrind.state.problems.set(id, newProb);

    // Update In-Memory Structure
    window.SmartGrind.api.mergeStructure(); // This handles inserting it into topicsData

    // Save to Firebase
    await window.SmartGrind.api.saveProblem(newProb);

    window.SmartGrind.state.elements.addProblemModal.classList.add('hidden');
    window.SmartGrind.renderers.renderSidebar();
    window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId); // Refresh view
    window.SmartGrind.utils.showToast("Problem added!");
};