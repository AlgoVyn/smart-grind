import { data } from '../src/data';

describe('SmartGrind Data Module', () => {
    beforeEach(() => {
        // Reset the data module state
        data.init();
    });

    test('should initialize original topics data on first init call', () => {
        // Reset for clean state
        // @ts-expect-error - Testing internal state
        data.ORIGINAL_TOPICS_DATA = null;

        data.init();

        expect(data.getOriginalTopicsData()).not.toBeNull();
        expect(Array.isArray(data.getOriginalTopicsData())).toBe(true);
        expect(data.getOriginalTopicsData()?.length).toBeGreaterThan(0);
    });

    test('should not overwrite original topics data on subsequent init calls', () => {
        const originalData = data.getOriginalTopicsData();

        data.init();

        expect(data.getOriginalTopicsData()).toBe(originalData);
    });

    test('should reset topicsData to original state', () => {
        const originalTopicsData = JSON.parse(JSON.stringify(data.topicsData));

        // Modify topicsData
        data.topicsData[0].title = 'Modified Title';

        data.resetTopicsData();

        expect(data.topicsData).toEqual(originalTopicsData);
    });

    test('should have correct SPACED_REPETITION_INTERVALS', () => {
        expect(data.SPACED_REPETITION_INTERVALS).toEqual([1, 3, 7, 14, 30, 60]);
    });

    test('should have correct TOTAL_UNIQUE_PROBLEMS count', () => {
        // This is the actual unique count - some problems appear in multiple patterns
        expect(data.TOTAL_UNIQUE_PROBLEMS).toBe(413);
    });

    test('should have correct LOCAL_STORAGE_KEYS', () => {
        const expectedKeys = {
            USER_TYPE: 'smartgrind-user-type',
            PROBLEMS: 'smartgrind-problems',
            DELETED_IDS: 'smartgrind-deleted-ids',
            DISPLAY_NAME: 'smartgrind-display-name',
            SIGNED_IN_PROBLEMS: 'SIGNED_IN_smartgrind-problems',
            SIGNED_IN_DELETED_IDS: 'SIGNED_IN_smartgrind-deleted-ids',
            SIGNED_IN_DISPLAY_NAME: 'SIGNED_IN_smartgrind-display-name',
        };

        expect(data.LOCAL_STORAGE_KEYS).toEqual(expectedKeys);
    });

    test('should have API_BASE defined', () => {
        expect(data.API_BASE).toBe('/smartgrind/api');
    });

    test('should have topicsData as an array with expected structure', () => {
        expect(Array.isArray(data.topicsData)).toBe(true);
        expect(data.topicsData.length).toBeGreaterThan(0);

        const firstTopic = data.topicsData[0];
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
            'design',
        ];

        const actualTopicIds = data.topicsData.map((topic) => topic.id);
        expect(actualTopicIds).toEqual(expectedTopicIds);
    });
});
