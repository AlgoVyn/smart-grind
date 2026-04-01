// PrismJS Configuration - Must be imported BEFORE prismjs to disable worker message handler
// This prevents "[object Object] is not valid JSON" errors when other code posts objects to workers

if (typeof window !== 'undefined') {
    window.Prism = window.Prism || {};
    window.Prism.disableWorkerMessageHandler = true;
}
if (typeof self !== 'undefined') {
    self.Prism = self.Prism || {};
    self.Prism.disableWorkerMessageHandler = true;
}

// Re-export for explicit side-effect import
export {};
