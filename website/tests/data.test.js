import '../public/modules/data.js';

describe('SmartGrind Data Module', () => {
  beforeEach(() => {
    // Reset the data module state
    window.SmartGrind.data.resetTopicsData();
  });

  test('should initialize ORIGINAL_TOPICS_DATA on first init call', () => {
    // Reset for clean state
    window.SmartGrind.data.ORIGINAL_TOPICS_DATA = null;

    window.SmartGrind.data.init();

    expect(window.SmartGrind.data.ORIGINAL_TOPICS_DATA).not.toBeNull();
    expect(Array.isArray(window.SmartGrind.data.ORIGINAL_TOPICS_DATA)).toBe(true);
    expect(window.SmartGrind.data.ORIGINAL_TOPICS_DATA.length).toBeGreaterThan(0);
  });

  test('should not overwrite ORIGINAL_TOPICS_DATA on subsequent init calls', () => {
    const originalData = window.SmartGrind.data.ORIGINAL_TOPICS_DATA;

    window.SmartGrind.data.init();

    expect(window.SmartGrind.data.ORIGINAL_TOPICS_DATA).toBe(originalData);
  });

  test('should reset topicsData to original state', () => {
    const originalTopicsData = JSON.parse(JSON.stringify(window.SmartGrind.data.topicsData));

    // Modify topicsData
    window.SmartGrind.data.topicsData[0].title = 'Modified Title';

    window.SmartGrind.data.resetTopicsData();

    expect(window.SmartGrind.data.topicsData).toEqual(originalTopicsData);
  });

  test('should have correct SPACED_REPETITION_INTERVALS', () => {
    expect(window.SmartGrind.data.SPACED_REPETITION_INTERVALS).toEqual([1, 3, 7, 14, 30, 60]);
  });

  test('should have correct TOTAL_UNIQUE_PROBLEMS count', () => {
    expect(window.SmartGrind.data.TOTAL_UNIQUE_PROBLEMS).toBe(438);
  });

  test('should have correct LOCAL_STORAGE_KEYS', () => {
    const expectedKeys = {
      USER_TYPE: 'smartgrind-user-type',
      PROBLEMS: 'smartgrind-local-problems',
      DELETED_IDS: 'smartgrind-local-deleted-ids',
      DISPLAY_NAME: 'smartgrind-local-display-name'
    };

    expect(window.SmartGrind.data.LOCAL_STORAGE_KEYS).toEqual(expectedKeys);
  });

  test('should have API_BASE defined', () => {
    expect(window.SmartGrind.data.API_BASE).toBe('/smartgrind/api');
  });

  test('should have topicsData as an array with expected structure', () => {
    expect(Array.isArray(window.SmartGrind.data.topicsData)).toBe(true);
    expect(window.SmartGrind.data.topicsData.length).toBeGreaterThan(0);

    const firstTopic = window.SmartGrind.data.topicsData[0];
    expect(firstTopic).toHaveProperty('id');
    expect(firstTopic).toHaveProperty('title');
    expect(firstTopic).toHaveProperty('patterns');
    expect(Array.isArray(firstTopic.patterns)).toBe(true);

    if (firstTopic.patterns.length > 0) {
      const firstPattern = firstTopic.patterns[0];
      expect(firstPattern).toHaveProperty('name');
      expect(firstPattern).toHaveProperty('problems');
      expect(Array.isArray(firstPattern.problems)).toBe(true);

      if (firstPattern.problems.length > 0) {
        const firstProblem = firstPattern.problems[0];
        expect(firstProblem).toHaveProperty('id');
        expect(firstProblem).toHaveProperty('name');
        expect(firstProblem).toHaveProperty('url');
      }
    }
  });

  test('should have all expected topic IDs', () => {
    const expectedTopicIds = [
      'two-pointers',
      'sliding-window',
      'arrays-hashing',
      'linked-lists',
      'stacks',
      'heaps',
      'trees',
      'graphs',
      'binary-search',
      'backtracking',
      'dp',
      'greedy',
      'bit-manipulation',
      'string-manipulation',
      'design'
    ];

    const actualTopicIds = window.SmartGrind.data.topicsData.map(topic => topic.id);
    expect(actualTopicIds).toEqual(expectedTopicIds);
  });
});