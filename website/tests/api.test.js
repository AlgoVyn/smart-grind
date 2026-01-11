import '../public/modules/api-save.js';
import '../public/modules/api-load.js';
import '../public/modules/api-sync.js';
import '../public/modules/api-reset.js';
import '../public/modules/api-delete.js';

describe('SmartGrind API Module', () => {
  let mockFetch;
  let mockShowAlert;
  let mockUpdateStats;
  let mockRenderSidebar;
  let mockRenderMainView;
  let mockUpdateFilterBtns;
  let mockSaveToStorage;

  beforeEach(() => {
    // Mock fetch
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Mock UI functions
    mockShowAlert = jest.fn();
    window.SmartGrind.ui = {
      showAlert: mockShowAlert,
      showConfirm: jest.fn().mockResolvedValue(true),
      initScrollButton: jest.fn(),
    };

    // Mock renderers
    mockUpdateStats = jest.fn();
    mockRenderSidebar = jest.fn();
    mockRenderMainView = jest.fn();
    mockUpdateFilterBtns = jest.fn();
    window.SmartGrind.renderers = {
      updateStats: mockUpdateStats,
      renderSidebar: mockRenderSidebar,
      renderMainView: mockRenderMainView,
      updateFilterBtns: mockUpdateFilterBtns,
    };

    // Mock state
    mockSaveToStorage = jest.fn();
    window.SmartGrind.state = {
      user: { type: 'local' },
      problems: new Map([
        ['1', { id: '1', name: 'Test Problem', status: 'unsolved' }]
      ]),
      deletedProblemIds: new Set(['2']),
      saveToStorage: mockSaveToStorage,
      elements: {
        loadingScreen: { classList: { remove: jest.fn(), add: jest.fn() } },
        setupModal: { classList: { remove: jest.fn(), add: jest.fn() } },
        signinModal: { classList: { remove: jest.fn(), add: jest.fn() } },
        appWrapper: { classList: { remove: jest.fn(), add: jest.fn() } },
      },
      ui: {
        activeTopicId: 'all',
      },
    };

    // Mock data
    window.SmartGrind.data = {
      API_BASE: '/smartgrind/api',
      resetTopicsData: jest.fn(),
      topicsData: [],
    };

    // Mock utils
    window.SmartGrind.utils = {
      updateUrlParameter: jest.fn(),
      showToast: jest.fn(),
    };

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('_saveLocally', () => {
    test('should call state.saveToStorage for local user', () => {
      window.SmartGrind.api._saveLocally();

      expect(mockSaveToStorage).toHaveBeenCalled();
    });
  });

  describe('mergeStructure', () => {
    test('should add custom problems to topicsData', () => {
      window.SmartGrind.data.topicsData = [];
      window.SmartGrind.state.problems.clear();
      window.SmartGrind.state.problems.set('custom-1', {
        id: 'custom-1',
        name: 'Custom Problem',
        url: 'https://example.com',
        topic: 'Custom Topic',
        pattern: 'Custom Pattern',
      });

      window.SmartGrind.api.mergeStructure();

      expect(window.SmartGrind.data.topicsData).toHaveLength(1);
      expect(window.SmartGrind.data.topicsData[0].title).toBe('Custom Topic');
      expect(window.SmartGrind.data.topicsData[0].patterns[0].problems).toHaveLength(1);
    });

    test('should not duplicate existing problems', () => {
      window.SmartGrind.data.topicsData = [
        {
          id: 'test-topic',
          title: 'Test Topic',
          patterns: [
            {
              name: 'Test Pattern',
              problems: [
                { id: 'existing-1', name: 'Existing Problem', url: 'https://example.com' }
              ]
            }
          ]
        }
      ];
      window.SmartGrind.state.problems.clear();
      window.SmartGrind.state.problems.set('existing-1', {
        id: 'existing-1',
        name: 'Existing Problem',
        url: 'https://example.com',
        topic: 'Test Topic',
        pattern: 'Test Pattern',
      });

      window.SmartGrind.api.mergeStructure();

      expect(window.SmartGrind.data.topicsData[0].patterns[0].problems).toHaveLength(1);
    });
  });

  describe('_saveRemotely', () => {
    test('should save data remotely for signed-in user', async () => {
      sessionStorage.setItem('token', 'test-token');
      window.SmartGrind.state.user.type = 'signed-in';
      mockFetch.mockResolvedValue({ ok: true });

      await window.SmartGrind.api._saveRemotely();

      expect(mockFetch).toHaveBeenCalledWith(`${window.SmartGrind.data.API_BASE}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer test-token`
        },
        body: JSON.stringify({ data: { problems: { '1': { id: '1', name: 'Test Problem', status: 'unsolved' } }, deletedIds: ['2'] } })
      });
    });

    test('should throw error on auth failure', async () => {
      sessionStorage.setItem('token', 'invalid-token');
      mockFetch.mockResolvedValue({ ok: false, status: 401 });

      await expect(window.SmartGrind.api._saveRemotely()).rejects.toThrow('Authentication failed. Please sign in again.');
    });

    test('should throw error on server error', async () => {
      sessionStorage.setItem('token', 'test-token');
      mockFetch.mockResolvedValue({ ok: false, status: 500 });

      await expect(window.SmartGrind.api._saveRemotely()).rejects.toThrow('Server error. Please try again later.');
    });
  });

  describe('_performSave', () => {
    test('should call _saveLocally for local user', async () => {
      window.SmartGrind.state.user.type = 'local';
      const saveLocallySpy = jest.spyOn(window.SmartGrind.api, '_saveLocally');

      await window.SmartGrind.api._performSave();

      expect(saveLocallySpy).toHaveBeenCalled();
      expect(mockUpdateStats).toHaveBeenCalled();
    });

    test('should call _saveRemotely for signed-in user', async () => {
      window.SmartGrind.state.user.type = 'signed-in';
      const saveRemotelySpy = jest.spyOn(window.SmartGrind.api, '_saveRemotely');
      saveRemotelySpy.mockResolvedValue();

      await window.SmartGrind.api._performSave();

      expect(saveRemotelySpy).toHaveBeenCalled();
      expect(mockUpdateStats).toHaveBeenCalled();
    });

    test('should show alert on save error', async () => {
      window.SmartGrind.state.user.type = 'signed-in';
      const saveRemotelySpy = jest.spyOn(window.SmartGrind.api, '_saveRemotely');
      saveRemotelySpy.mockRejectedValue(new Error('Network error'));

      await expect(window.SmartGrind.api._performSave()).rejects.toThrow('Network error');

      expect(mockShowAlert).toHaveBeenCalledWith('Failed to save data: Network error');
    });
  });

  describe('saveProblem', () => {
    test('should call _performSave', async () => {
      const performSaveSpy = jest.spyOn(window.SmartGrind.api, '_performSave');
      performSaveSpy.mockResolvedValue();

      await window.SmartGrind.api.saveProblem({ id: '1' });

      expect(performSaveSpy).toHaveBeenCalled();
    });
  });

  describe('saveDeletedId', () => {
    test('should delete problem and call _performSave', async () => {
      window.SmartGrind.state.problems.set('1', { id: '1' });
      const performSaveSpy = jest.spyOn(window.SmartGrind.api, '_performSave');
      performSaveSpy.mockResolvedValue();

      await window.SmartGrind.api.saveDeletedId('1');

      expect(window.SmartGrind.state.problems.has('1')).toBe(false);
      expect(window.SmartGrind.state.deletedProblemIds.has('1')).toBe(true);
      expect(performSaveSpy).toHaveBeenCalled();
    });

    test('should restore problem on save failure', async () => {
      window.SmartGrind.state.problems.set('1', { id: '1', name: 'Test' });
      const performSaveSpy = jest.spyOn(window.SmartGrind.api, '_performSave');
      performSaveSpy.mockRejectedValue(new Error('Save failed'));

      await expect(window.SmartGrind.api.saveDeletedId('1')).rejects.toThrow('Save failed');

      expect(window.SmartGrind.state.problems.has('1')).toBe(true);
      expect(mockShowAlert).toHaveBeenCalledWith('Failed to delete problem: Save failed');
    });
  });

  describe('saveData', () => {
    test('should call _performSave', async () => {
      const performSaveSpy = jest.spyOn(window.SmartGrind.api, '_performSave');
      performSaveSpy.mockResolvedValue();

      await window.SmartGrind.api.saveData();

      expect(performSaveSpy).toHaveBeenCalled();
    });
  });

  describe('loadData', () => {
    test('should load data successfully', async () => {
      sessionStorage.setItem('token', 'test-token');
      const userData = { problems: { '1': { id: '1' } }, deletedIds: ['2'] };
      mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(userData) });

      await window.SmartGrind.api.loadData();

      expect(window.SmartGrind.state.problems.get('1')).toEqual({ id: '1', loading: false });
      expect(window.SmartGrind.state.deletedProblemIds.has('2')).toBe(true);
      expect(mockRenderSidebar).toHaveBeenCalled();
      expect(mockRenderMainView).toHaveBeenCalledWith('all');
    });

    test('should handle auth error', async () => {
      sessionStorage.setItem('token', 'invalid-token');
      mockFetch.mockResolvedValue({ ok: false, status: 401 });

      await window.SmartGrind.api.loadData();

      expect(window.SmartGrind.state.elements.signinModal.classList.remove).toHaveBeenCalledWith('hidden');
      expect(mockShowAlert).toHaveBeenCalledWith('Failed to load data: Authentication failed. Please sign in again.');
    });

    test('should handle user not found', async () => {
      sessionStorage.setItem('token', 'test-token');
      mockFetch.mockResolvedValue({ ok: false, status: 404 });

      await window.SmartGrind.api.loadData();

      expect(mockShowAlert).toHaveBeenCalledWith('Failed to load data: User data not found. Starting with fresh data.');
    });
  });

  describe('syncPlan', () => {
    test('should add missing problems from topicsData', async () => {
      window.SmartGrind.data.topicsData = [
        {
          title: 'Test Topic',
          patterns: [
            {
              name: 'Test Pattern',
              problems: [{ id: 'new-1', name: 'New Problem', url: 'https://example.com' }]
            }
          ]
        }
      ];
      const performSaveSpy = jest.spyOn(window.SmartGrind.api, '_performSave');
      performSaveSpy.mockResolvedValue();

      await window.SmartGrind.api.syncPlan();

      expect(window.SmartGrind.state.problems.has('new-1')).toBe(true);
      expect(performSaveSpy).toHaveBeenCalled();
    });

    test('should update existing problem metadata', async () => {
      window.SmartGrind.data.topicsData = [
        {
          title: 'Updated Topic',
          patterns: [
            {
              name: 'Updated Pattern',
              problems: [{ id: 'existing-1', name: 'Updated Name', url: 'https://updated.com' }]
            }
          ]
        }
      ];
      window.SmartGrind.state.problems.set('existing-1', {
        id: 'existing-1',
        name: 'Old Name',
        url: 'https://old.com',
        topic: 'Old Topic',
        pattern: 'Old Pattern'
      });
      const performSaveSpy = jest.spyOn(window.SmartGrind.api, '_performSave');
      performSaveSpy.mockResolvedValue();

      await window.SmartGrind.api.syncPlan();

      const updated = window.SmartGrind.state.problems.get('existing-1');
      expect(updated.name).toBe('Updated Name');
      expect(updated.url).toBe('https://updated.com');
      expect(updated.topic).toBe('Updated Topic');
      expect(updated.pattern).toBe('Updated Pattern');
    });
  });

  describe('deleteCategory', () => {
    test('should delete category and associated problems', async () => {
      window.SmartGrind.data.topicsData = [
        { id: 'test-topic', title: 'Test Topic', patterns: [] }
      ];
      window.SmartGrind.state.problems.set('1', { id: '1', topic: 'Test Topic' });
      window.SmartGrind.state.ui.activeTopicId = 'test-topic';
      const confirmSpy = jest.spyOn(window.SmartGrind.ui, 'showConfirm');
      confirmSpy.mockResolvedValue(true);
      const performSaveSpy = jest.spyOn(window.SmartGrind.api, '_performSave');
      performSaveSpy.mockResolvedValue();

      await window.SmartGrind.api.deleteCategory('test-topic');

      expect(window.SmartGrind.data.topicsData).toHaveLength(0);
      expect(window.SmartGrind.state.problems.has('1')).toBe(false);
      expect(window.SmartGrind.state.deletedProblemIds.has('1')).toBe(true);
      expect(window.SmartGrind.state.ui.activeTopicId).toBe('all');
      expect(mockRenderSidebar).toHaveBeenCalled();
      expect(mockRenderMainView).toHaveBeenCalledWith('all');
    });

    test('should not delete if not confirmed', async () => {
      window.SmartGrind.data.topicsData = [
        { id: 'test-topic', title: 'Test Topic', patterns: [] }
      ];
      const confirmSpy = jest.spyOn(window.SmartGrind.ui, 'showConfirm');
      confirmSpy.mockResolvedValue(false);

      await window.SmartGrind.api.deleteCategory('test-topic');

      expect(window.SmartGrind.data.topicsData).toHaveLength(1);
    });

    test('should show alert if category not found', async () => {
      await window.SmartGrind.api.deleteCategory('nonexistent');

      expect(mockShowAlert).toHaveBeenCalledWith('Category not found.');
    });

    test('should restore state on save failure', async () => {
      window.SmartGrind.data.topicsData = [
        { id: 'test-topic', title: 'Test Topic', patterns: [] }
      ];
      window.SmartGrind.state.problems.set('1', { id: '1', topic: 'Test Topic' });
      window.SmartGrind.state.ui.activeTopicId = 'test-topic';
      const confirmSpy = jest.spyOn(window.SmartGrind.ui, 'showConfirm');
      confirmSpy.mockResolvedValue(true);
      const performSaveSpy = jest.spyOn(window.SmartGrind.api, '_performSave');
      performSaveSpy.mockRejectedValue(new Error('Save failed'));

      await expect(window.SmartGrind.api.deleteCategory('test-topic')).rejects.toThrow('Save failed');

      // State should be restored
      expect(window.SmartGrind.data.topicsData).toHaveLength(1);
      expect(window.SmartGrind.state.problems.has('1')).toBe(true);
      expect(window.SmartGrind.state.ui.activeTopicId).toBe('test-topic');
      expect(mockShowAlert).toHaveBeenCalledWith('Failed to delete category: Save failed');
    });
  });

  describe('resetAll', () => {
    beforeEach(() => {
      // Set up test data
      window.SmartGrind.data.topicsData = [
        {
          id: 'arrays',
          title: 'Arrays',
          patterns: [
            {
              name: 'Two Sum',
              problems: [
                { id: '1', name: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/' },
                { id: '2', name: 'Add Two Numbers', url: 'https://leetcode.com/problems/add-two-numbers/' }
              ]
            }
          ]
        },
        {
          id: 'strings',
          title: 'Strings',
          patterns: [
            {
              name: 'Palindrome',
              problems: [
                { id: '3', name: 'Valid Palindrome', url: 'https://leetcode.com/problems/valid-palindrome/' }
              ]
            }
          ]
        }
      ];

      // Set up existing problems
      window.SmartGrind.state.problems.clear();
      window.SmartGrind.state.problems.set('1', {
        id: '1',
        name: 'Two Sum',
        status: 'solved',
        reviewInterval: 3,
        nextReviewDate: '2024-01-01',
        topic: 'Arrays',
        pattern: 'Two Sum'
      });
      window.SmartGrind.state.problems.set('3', {
        id: '3',
        name: 'Valid Palindrome',
        status: 'solved',
        reviewInterval: 1,
        nextReviewDate: '2024-01-02',
        topic: 'Strings',
        pattern: 'Palindrome'
      });

      // Set up deleted problems
      window.SmartGrind.state.deletedProblemIds.clear();
      window.SmartGrind.state.deletedProblemIds.add('2'); // Add Two Numbers is deleted
    });

    test('should reset all problems to unsolved and restore deleted problems when confirmed', async () => {
      const confirmSpy = jest.spyOn(window.SmartGrind.ui, 'showConfirm');
      confirmSpy.mockResolvedValue(true);
      const performSaveSpy = jest.spyOn(window.SmartGrind.api, '_performSave');
      performSaveSpy.mockResolvedValue();

      await window.SmartGrind.api.resetAll();

      // Check confirmation was requested
      expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to reset <b>ALL Problems</b>? This will mark all problems as unsolved and restore any deleted problems across all categories.');

      // Check existing problems were reset
      const problem1 = window.SmartGrind.state.problems.get('1');
      expect(problem1.status).toBe('unsolved');
      expect(problem1.reviewInterval).toBe(0);
      expect(problem1.nextReviewDate).toBe(null);

      const problem3 = window.SmartGrind.state.problems.get('3');
      expect(problem3.status).toBe('unsolved');
      expect(problem3.reviewInterval).toBe(0);
      expect(problem3.nextReviewDate).toBe(null);

      // Check deleted problem was restored
      expect(window.SmartGrind.state.deletedProblemIds.has('2')).toBe(false);
      const problem2 = window.SmartGrind.state.problems.get('2');
      expect(problem2).toBeDefined();
      expect(problem2.id).toBe('2');
      expect(problem2.name).toBe('Add Two Numbers');
      expect(problem2.status).toBe('unsolved');
      expect(problem2.topic).toBe('Arrays');
      expect(problem2.pattern).toBe('Two Sum');

      // Check save and re-render were called
      expect(performSaveSpy).toHaveBeenCalled();
      expect(mockUpdateFilterBtns).toHaveBeenCalled();
      expect(mockRenderSidebar).toHaveBeenCalled();
      expect(mockRenderMainView).toHaveBeenCalledWith('all');
      expect(window.SmartGrind.utils.showToast).toHaveBeenCalledWith('All problems reset and restored');
    });

    test('should not reset if confirmation is cancelled', async () => {
      const confirmSpy = jest.spyOn(window.SmartGrind.ui, 'showConfirm');
      confirmSpy.mockResolvedValue(false);
      const performSaveSpy = jest.spyOn(window.SmartGrind.api, '_performSave');

      await window.SmartGrind.api.resetAll();

      // Check confirmation was requested
      expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to reset <b>ALL Problems</b>? This will mark all problems as unsolved and restore any deleted problems across all categories.');

      // Check no changes were made
      expect(window.SmartGrind.state.problems.get('1').status).toBe('solved');
      expect(window.SmartGrind.state.problems.get('3').status).toBe('solved');
      expect(window.SmartGrind.state.deletedProblemIds.has('2')).toBe(true);
      expect(window.SmartGrind.state.problems.has('2')).toBe(false);

      // Check save was not called
      expect(performSaveSpy).not.toHaveBeenCalled();
    });

    test('should handle save error gracefully', async () => {
      const confirmSpy = jest.spyOn(window.SmartGrind.ui, 'showConfirm');
      confirmSpy.mockResolvedValue(true);
      const performSaveSpy = jest.spyOn(window.SmartGrind.api, '_performSave');
      performSaveSpy.mockRejectedValue(new Error('Save failed'));

      await expect(window.SmartGrind.api.resetAll()).rejects.toThrow('Save failed');

      expect(mockShowAlert).toHaveBeenCalledWith('Failed to reset all problems: Save failed');
      // State should be restored
      expect(window.SmartGrind.state.problems.get('1').status).toBe('solved');
      expect(window.SmartGrind.state.problems.get('3').status).toBe('solved');
      expect(window.SmartGrind.state.deletedProblemIds.has('2')).toBe(true);
    });
  });

  describe('resetCategory', () => {
    beforeEach(() => {
      // Set up test data
      window.SmartGrind.data.topicsData = [
        {
          id: 'arrays',
          title: 'Arrays',
          patterns: [
            {
              name: 'Two Sum',
              problems: [
                { id: '1', name: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/' },
                { id: '2', name: 'Add Two Numbers', url: 'https://leetcode.com/problems/add-two-numbers/' }
              ]
            }
          ]
        }
      ];

      // Set up existing problems
      window.SmartGrind.state.problems.clear();
      window.SmartGrind.state.problems.set('1', {
        id: '1',
        name: 'Two Sum',
        status: 'solved',
        reviewInterval: 3,
        nextReviewDate: '2024-01-01',
        topic: 'Arrays',
        pattern: 'Two Sum'
      });

      // Set up deleted problems
      window.SmartGrind.state.deletedProblemIds.clear();
      window.SmartGrind.state.deletedProblemIds.add('2'); // Add Two Numbers is deleted
    });

    test('should reset category problems and restore deleted problems when confirmed', async () => {
      const confirmSpy = jest.spyOn(window.SmartGrind.ui, 'showConfirm');
      confirmSpy.mockResolvedValue(true);
      const performSaveSpy = jest.spyOn(window.SmartGrind.api, '_performSave');
      performSaveSpy.mockResolvedValue();

      await window.SmartGrind.api.resetCategory('arrays');

      // Check confirmation was requested
      expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to reset all problems in the category "<b>Arrays</b>"? This will mark all problems as unsolved and restore any deleted problems.');

      // Check existing problem was reset
      const problem1 = window.SmartGrind.state.problems.get('1');
      expect(problem1.status).toBe('unsolved');
      expect(problem1.reviewInterval).toBe(0);
      expect(problem1.nextReviewDate).toBe(null);

      // Check deleted problem was restored
      expect(window.SmartGrind.state.deletedProblemIds.has('2')).toBe(false);
      const problem2 = window.SmartGrind.state.problems.get('2');
      expect(problem2).toBeDefined();
      expect(problem2.id).toBe('2');
      expect(problem2.name).toBe('Add Two Numbers');
      expect(problem2.status).toBe('unsolved');
      expect(problem2.topic).toBe('Arrays');
      expect(problem2.pattern).toBe('Two Sum');

      // Check save and re-render were called
      expect(performSaveSpy).toHaveBeenCalled();
      expect(mockUpdateFilterBtns).toHaveBeenCalled();
      expect(mockRenderSidebar).toHaveBeenCalled();
      expect(mockRenderMainView).toHaveBeenCalledWith('all');
      expect(window.SmartGrind.utils.showToast).toHaveBeenCalledWith('Category problems reset and restored');
    });

    test('should not reset if confirmation is cancelled', async () => {
      const confirmSpy = jest.spyOn(window.SmartGrind.ui, 'showConfirm');
      confirmSpy.mockResolvedValue(false);
      const performSaveSpy = jest.spyOn(window.SmartGrind.api, '_performSave');

      await window.SmartGrind.api.resetCategory('arrays');

      // Check confirmation was requested
      expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to reset all problems in the category "<b>Arrays</b>"? This will mark all problems as unsolved and restore any deleted problems.');

      // Check no changes were made
      expect(window.SmartGrind.state.problems.get('1').status).toBe('solved');
      expect(window.SmartGrind.state.deletedProblemIds.has('2')).toBe(true);
      expect(window.SmartGrind.state.problems.has('2')).toBe(false);

      // Check save was not called
      expect(performSaveSpy).not.toHaveBeenCalled();
    });

    test('should handle save error gracefully', async () => {
      const confirmSpy = jest.spyOn(window.SmartGrind.ui, 'showConfirm');
      confirmSpy.mockResolvedValue(true);
      const performSaveSpy = jest.spyOn(window.SmartGrind.api, '_performSave');
      performSaveSpy.mockRejectedValue(new Error('Save failed'));

      await expect(window.SmartGrind.api.resetCategory('arrays')).rejects.toThrow('Save failed');

      expect(mockShowAlert).toHaveBeenCalledWith('Failed to reset category: Save failed');
      // State should be restored
      expect(window.SmartGrind.state.problems.get('1').status).toBe('solved');
      expect(window.SmartGrind.state.deletedProblemIds.has('2')).toBe(true);
    });

    test('should show alert if category not found', async () => {
      await window.SmartGrind.api.resetCategory('nonexistent');

      expect(mockShowAlert).toHaveBeenCalledWith('Category not found.');
    });

    test('should handle problems with string IDs in topicsData', async () => {
      // Modify topicsData to have string IDs instead of objects
      window.SmartGrind.data.topicsData[0].patterns[0].problems = ['1', '2'];

      const confirmSpy = jest.spyOn(window.SmartGrind.ui, 'showConfirm');
      confirmSpy.mockResolvedValue(true);
      const performSaveSpy = jest.spyOn(window.SmartGrind.api, '_performSave');
      performSaveSpy.mockResolvedValue();

      await window.SmartGrind.api.resetCategory('arrays');

      // Check deleted problem was restored with correct defaults
      const problem2 = window.SmartGrind.state.problems.get('2');
      expect(problem2).toBeDefined();
      expect(problem2.id).toBe('2');
      expect(problem2.name).toBe('2'); // Falls back to ID as name
      expect(problem2.url).toBe('https://leetcode.com/problems/2/'); // Generated URL
      expect(problem2.status).toBe('unsolved');
    });
  });
});
