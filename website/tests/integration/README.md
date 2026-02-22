# Integration Tests

This directory contains integration tests that verify how multiple modules work together in the SmartGrind application.

## Test Files

### auth-flow.test.ts
Tests the complete authentication flow across:
- `init.ts` - Initialization and auth checking
- `state.ts` - User state management
- `api.ts` - API communication
- `app.ts` - Application logic

**Key Scenarios:**
- Local user initialization
- Signed-in user with server data
- PWA auth callback flow
- Auth state transitions
- Session expiration handling

### data-sync.test.ts
Tests data synchronization between modules:
- Local data persistence (localStorage)
- Server data synchronization
- Offline/online transitions
- Data merge and sync plan
- Sync status management

**Key Scenarios:**
- Save/load problem data across sessions
- Server data loading for signed-in users
- Offline data operations
- Sync conflict handling
- Pending operations queue

### problem-management.test.ts
Tests problem CRUD operations across:
- `app.ts` - Application logic
- `api.ts` - API operations
- `state.ts` - State management

**Key Scenarios:**
- Problem status updates
- Problem deletion and restoration
- Custom problem creation
- Problem filtering and search
- Bulk operations
- Problem statistics

### category-management.test.ts
Tests category operations with cascading effects:
- Category deletion with problem cleanup
- Category reset functionality
- Category statistics
- Category navigation
- Custom problems in categories

**Key Scenarios:**
- Delete category and associated problems
- Reset category problems to unsolved
- Calculate category-specific statistics
- Switch between categories
- Handle custom problems in categories

### offline-online.test.ts
Tests offline/online behavior:
- Online status detection
- Offline data operations
- Online sync behavior
- Sync status management
- Data persistence across transitions

**Key Scenarios:**
- Detect online/offline status
- Queue operations when offline
- Sync pending operations when online
- Handle multiple offline-online cycles
- Maintain data integrity during transitions

### import-export.test.ts
Tests data import and export functionality:
- Export progress data
- Import progress data
- Import/export roundtrip
- Data migration
- Large dataset handling

**Key Scenarios:**
- Export with correct structure
- Import with data merging
- Handle version migration
- Validate import data
- Large import handling

## Running Tests

```bash
# Run all integration tests
npm test -- tests/integration/

# Run specific test file
npm test -- tests/integration/auth-flow.test.ts

# Run with verbose output
npm test -- tests/integration/ --verbose

# Run with coverage
npm test -- tests/integration/ --coverage
```

## Test Structure

Each test file follows this pattern:
```typescript
describe('Integration: Feature Name', () => {
    beforeEach(() => {
        // Reset state and mocks
    });
    
    describe('Sub-feature', () => {
        test('should do something', () => {
            // Test implementation
        });
    });
});
```

## Notes

- Tests use minimal mocking to verify real module interactions
- DOM elements are mocked where necessary
- Service Worker APIs are mocked for offline/online tests
- localStorage is mocked for persistence tests
- Fetch is mocked for server communication tests
