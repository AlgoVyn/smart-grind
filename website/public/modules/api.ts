// --- API MODULE ---
// API functions for data management

import './api/api-save.js';
import './api/api-load.js';
import './api/api-sync.js';
import './api/api-reset.js';
import './api/api-delete.js';

window.SmartGrind = window.SmartGrind || {};

// The API functions will be attached to window.SmartGrind.api by the individual files
// This provides a single entry point for all API functionality