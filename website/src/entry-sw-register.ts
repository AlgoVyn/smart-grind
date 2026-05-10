// Service Worker Registration entry point for offline support
import { registerServiceWorker } from './sw-register';

if ('serviceWorker' in navigator) {
    registerServiceWorker().then((success) => {
        if (success) {
            console.log('[App] Service Worker registered successfully');
        } else {
            console.log('[App] Service Worker registration failed or not supported');
        }
    });
}
