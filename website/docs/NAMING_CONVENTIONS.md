# File Naming Conventions

This document describes the naming conventions used in the SmartGrind codebase.

## General Rules

1. **Use kebab-case** for all filenames (e.g., `my-file.ts`, not `myFile.ts` or `my_file.ts`)
2. **Use descriptive names** that clearly indicate the file's purpose
3. **Group related files** in appropriately named directories

## Directory-Specific Conventions

### `/src/ui/` - UI Components
All UI component files should use the `ui-` prefix followed by a descriptive name:
- ✅ `ui-auth.ts` - Authentication UI handlers
- ✅ `ui-modals.ts` - Modal dialog handlers
- ✅ `ui-pattern-solutions.ts` - Pattern solutions UI (renamed from `pattern-solutions.ts`)
- ✅ `ui.ts` - Barrel file that re-exports all UI modules

Exceptions: The barrel file `ui.ts` does not need a prefix.

### `/src/renderers/` - View Renderers
Renderer files use descriptive names without a prefix:
- ✅ `main-view.ts` - Main problem list view renderer
- ✅ `sidebar.ts` - Sidebar navigation renderer
- ✅ `problem-cards.ts` - Individual problem card renderer
- ✅ `combined-view.ts` - Combined dashboard view
- ✅ `renderers.ts` - Barrel file

### `/src/sw/` - Service Worker
Service Worker files use descriptive names. Some use `sw-` prefix for clarity:
- ✅ `service-worker.ts` - Main service worker entry point
- ✅ `sw-messaging.ts` - Service worker messaging utilities
- ✅ `sw-cache-handlers.ts` - Cache handling utilities
- ✅ `background-sync.ts` - Background sync functionality
- ✅ `auth-manager.ts` - Authentication management in SW context

### `/src/api/` - API Functions
API modules are organized by operation:
- ✅ `api-load.ts` - Data loading functions
- ✅ `api-save.ts` - Data saving functions
- ✅ `api-sync.ts` - Sync functionality
- ✅ `api-delete.ts` - Deletion operations
- ✅ `api-reset.ts` - Reset operations
- ✅ `api.ts` - Main API barrel and orchestration

### `/src/utils/` - Utilities
Utility files use descriptive names describing their function:
- ✅ `indexeddb-helper.ts` - IndexedDB utilities
- ✅ `fetch-with-timeout.ts` - Fetch wrapper with timeout
- ✅ `error-tracker.ts` - Error tracking utilities
- ✅ `csrf.ts` - CSRF token management
- ✅ `virtual-scroll.ts` - Virtual scrolling implementation

### `/src/config/` - Configuration
Configuration files use clear, descriptive names:
- ✅ `limits.ts` - System limits and thresholds
- ✅ `sync-config.ts` - Sync configuration
- ✅ `idb-config.ts` - IndexedDB configuration
- ✅ `prism-config.ts` - Prism.js configuration

### `/tests/` - Test Files
Test files follow the naming pattern `{source-file}.test.ts`:
- ✅ `api.test.ts` - Tests for `api.ts`
- ✅ `state.test.ts` - Tests for `state.ts`
- ✅ `utils.test.ts` - Tests for `utils.ts`
- ✅ `xss-penetration.test.ts` - Security penetration tests

## Migration Notes

### Completed Renames
- `src/ui/pattern-solutions.ts` → `src/ui/ui-pattern-solutions.ts` (2026-04-19)

### Future Considerations
When creating new files, please follow these conventions. When refactoring existing code, consider aligning file names with these conventions if it improves clarity.
