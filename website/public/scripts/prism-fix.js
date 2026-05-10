// SECURITY FIX: PrismJS has a worker feature that listens to all messages and tries to JSON.parse them.
// When other code posts objects (not strings) to workers, this causes "[object Object] is not valid JSON" errors.
// This must be set BEFORE any PrismJS code loads.
if (typeof window !== 'undefined') {
    window.Prism = window.Prism || {};
    window.Prism.disableWorkerMessageHandler = true;
}
if (typeof self !== 'undefined') {
    self.Prism = self.Prism || {};
    self.Prism.disableWorkerMessageHandler = true;
}
