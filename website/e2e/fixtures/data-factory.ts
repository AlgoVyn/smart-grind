/**
 * Comprehensive Test Data Factory
 * 
 * Provides factory functions, data generators, and utilities for creating
 * consistent, deterministic test data across all e2e tests.
 * 
 * Key features:
 * - Deterministic output for reproducible tests
 * - Type-safe factory functions with full TypeScript support
 * - Bulk generation capabilities
 * - Predefined user scenarios
 * - Storage serialization utilities
 * 
 * @module e2e/fixtures/data-factory
 */

import type {
  Problem,
  ProblemDef,
  FlashCard,
  FlashCardProgress,
  UserData,
  User,
  UIState,
  Topic,
  Pattern,
  SQLCategory,
  SQLTopic,
  SQLPattern,
  SQLProblem,
  SyncStatusUpdate,
} from '../../src/types';

import type {
  SyncStatus,
  SyncStats,
  APIOperation,
  APIOperationType,
  ConflictResolution,
  ServerConflict,
  ForceSyncResponse,
} from '../../src/types/sync';

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

/** Predefined list of topics for random selection */
export const TOPICS = [
  'Arrays',
  'Binary Search',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Intervals',
  'Math & Logic',
  'Backtracking',
  'Sorting',
  'Heap',
  'Design',
  'SQL Basics',
  'SQL Joins',
  'SQL Aggregation',
] as const;

/** Predefined list of patterns for random selection */
export const PATTERNS = [
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'BFS',
  'DFS',
  'Dynamic Programming',
  'Greedy',
  'Merge Intervals',
  'Topological Sort',
  'Union Find',
  'Design',
  'Backtracking',
  'Heap',
  'Trie',
  'Segment Tree',
] as const;

/** Predefined difficulty levels */
export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

/** Predefined problem statuses */
export const STATUSES = ['unsolved', 'solved'] as const;

/** Spaced repetition intervals in days */
export const SPACED_REPETITION_INTERVALS = [1, 3, 7, 14, 30, 60, 90] as const;

/** Flashcard types */
export const FLASHCARD_TYPES = ['algorithm', 'pattern', 'sql'] as const;

/** API operation types for sync */
export const API_OPERATION_TYPES: APIOperationType[] = [
  'MARK_SOLVED',
  'UPDATE_REVIEW_DATE',
  'UPDATE_DIFFICULTY',
  'ADD_NOTE',
  'ADD_CUSTOM_PROBLEM',
  'DELETE_PROBLEM',
  'UPDATE_SETTINGS',
];

/** Sample problem names for realistic test data */
export const SAMPLE_PROBLEM_NAMES = [
  'Two Sum',
  'Three Sum',
  'Binary Search',
  'Merge Intervals',
  'LRU Cache',
  'Valid Parentheses',
  'Longest Substring',
  'Trapping Rain Water',
  'Coin Change',
  'Maximum Subarray',
  'Climbing Stairs',
  'House Robber',
  'Course Schedule',
  'Number of Islands',
  'Word Search',
  'Median of Two Sorted Arrays',
  'Container With Most Water',
  'Rotate Image',
  'Spiral Matrix',
  'First Missing Positive',
] as const;

/** Sample flashcard front texts */
export const SAMPLE_FLASHCARD_FRONT = [
  'What is the time complexity of binary search?',
  'Explain the Two Pointers pattern',
  'What is a hash table and how does it work?',
  'Describe BFS vs DFS',
  'What is dynamic programming?',
  'Explain memoization vs tabulation',
  'What is a trie data structure?',
  'Describe the sliding window technique',
  'What is topological sorting?',
  'Explain union-find with path compression',
] as const;

/** Sample flashcard back texts */
export const SAMPLE_FLASHCARD_BACK = [
  'O(log n) - Binary search halves the search space each iteration',
  'Two pointers iterate through data from start/end or both moving forward. Use for sorted arrays, finding pairs.',
  'A hash table provides O(1) average case for insert, delete, and search using a hash function.',
  'BFS explores level by level using a queue. DFS explores as deep as possible using a stack/recursion.',
  'DP solves complex problems by breaking them into simpler subproblems and storing solutions to avoid recomputation.',
  'Memoization: top-down with recursion and caching. Tabulation: bottom-up filling a table iteratively.',
  'A tree-like structure for efficient string storage and retrieval. Each node represents a character.',
  'Maintain a window that satisfies conditions, expand/contract to find optimal solution.',
  'Linear ordering of vertices such that for every edge (u,v), u comes before v in the ordering.',
  'Union-Find tracks elements partitioned into disjoint sets with near-constant time union and find operations.',
] as const;

// =============================================================================
// SEQUENTIAL DATA GENERATION
// =============================================================================

let _idCounter = 0;
let _sequenceCounter = 0;

/**
 * Reset all counters. Call this at the start of each test for deterministic output.
 */
export function resetCounters(): void {
  _idCounter = 0;
  _sequenceCounter = 0;
}

/**
 * Generate a unique ID across test runs
 * Format: {prefix}-{timestamp}-{counter}
 * 
 * @param prefix - Optional prefix for the ID (default: 'id')
 * @returns A unique identifier string
 * 
 * @example
 * uniqueId() // 'id-1713096369000-0'
 * uniqueId('user') // 'user-1713096369000-1'
 */
export function uniqueId(prefix: string = 'id'): string {
  const timestamp = Date.now();
  const counter = _idCounter++;
  return `${prefix}-${timestamp}-${counter}`;
}

/**
 * Generate a simple sequential ID (faster, no timestamp)
 * Format: {prefix}-{counter}
 * 
 * @param prefix - Optional prefix for the ID (default: 'seq')
 * @returns A sequential identifier string
 * 
 * @example
 * sequence() // 'seq-0'
 * sequence('problem') // 'problem-1'
 */
export function sequence(prefix: string = 'seq'): string {
  return `${prefix}-${_sequenceCounter++}`;
}

/**
 * Generate a consistent timestamp
 * 
 * @param options - Configuration options
 * @param options.offsetDays - Days offset from base time (default: 0)
 * @param options.baseTime - Base timestamp (default: current time)
 * @returns ISO timestamp string
 * 
 * @example
 * timestamp() // '2024-04-14T10:00:00.000Z'
 * timestamp({ offsetDays: -5 }) // 5 days ago
 */
export function timestamp(options?: { offsetDays?: number; baseTime?: number | Date }): string {
  const base = options?.baseTime ? new Date(options.baseTime) : new Date();
  const offsetMs = (options?.offsetDays ?? 0) * 24 * 60 * 60 * 1000;
  const finalTime = new Date(base.getTime() + offsetMs);
  return finalTime.toISOString();
}

/**
 * Generate a date string (YYYY-MM-DD format)
 * 
 * @param options - Same as timestamp options
 * @returns Date string in YYYY-MM-DD format
 * 
 * @example
 * dateString() // '2024-04-14'
 * dateString({ offsetDays: 7 }) // '2024-04-21'
 */
export function dateString(options?: { offsetDays?: number; baseTime?: number | Date }): string {
  return timestamp(options).split('T')[0];
}

// =============================================================================
// RANDOMIZATION HELPERS (Deterministic)
// =============================================================================

// Simple seeded random generator for deterministic tests
let _randomSeed = 12345;

/**
 * Set the random seed for deterministic randomization
 * @param seed - The seed value
 */
export function setRandomSeed(seed: number): void {
  _randomSeed = seed;
}

/**
 * Get next pseudo-random number between 0 and 1 (deterministic)
 * @returns Random number between 0 and 1
 */
function nextRandom(): number {
  _randomSeed = (_randomSeed * 9301 + 49297) % 233280;
  return _randomSeed / 233280;
}

/**
 * Pick a random element from an array
 * @param array - Array to pick from
 * @returns Random element
 */
export function pickRandom<T>(array: readonly T[]): T {
  return array[Math.floor(nextRandom() * array.length)];
}

/**
 * Generate random problem status
 * @returns Random status from 'unsolved' | 'solved'
 */
export function randomStatus(): 'unsolved' | 'solved' {
  return pickRandom(STATUSES);
}

/**
 * Generate random difficulty level
 * @returns Random difficulty from 'easy' | 'medium' | 'hard'
 */
export function randomDifficulty(): 'easy' | 'medium' | 'hard' {
  return pickRandom(DIFFICULTIES);
}

/**
 * Generate random topic
 * @returns Random topic string
 */
export function randomTopic(): string {
  return pickRandom(TOPICS);
}

/**
 * Generate random pattern
 * @returns Random pattern string
 */
export function randomPattern(): string {
  return pickRandom(PATTERNS);
}

/**
 * Generate random flashcard type
 * @returns Random flashcard type
 */
export function randomFlashcardType(): 'algorithm' | 'pattern' | 'sql' {
  return pickRandom(FLASHCARD_TYPES);
}

/**
 * Generate random boolean with given probability
 * @param probability - Probability of true (0-1, default: 0.5)
 * @returns Random boolean
 */
export function randomBoolean(probability: number = 0.5): boolean {
  return nextRandom() < probability;
}

/**
 * Generate random integer in range
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns Random integer
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(nextRandom() * (max - min + 1)) + min;
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Configuration options for creating a user
 */
export interface CreateUserOptions {
  id?: string;
  type?: 'local' | 'signed-in';
  displayName?: string;
  email?: string;
  token?: string;
  csrfToken?: string;
  theme?: 'light' | 'dark';
  notifications?: boolean;
}

/**
 * Extended user with auth details (for test fixtures)
 */
export interface TestUser extends User {
  email?: string;
  token?: string;
  csrfToken?: string;
  theme?: 'light' | 'dark';
  notifications?: boolean;
}

/**
 * Create a test user with configurable properties
 * 
 * @param options - User configuration options
 * @returns Test user object
 * 
 * @example
 * createUser() // Basic user with defaults
 * createUser({ displayName: 'John', type: 'signed-in' }) // Custom user
 */
export function createUser(options: CreateUserOptions = {}): TestUser {
  const seq = _sequenceCounter++;
  return {
    id: options.id ?? uniqueId('user'),
    type: options.type ?? 'local',
    displayName: options.displayName ?? `Test User ${seq}`,
    email: options.email ?? `test${seq}@example.com`,
    token: options.token ?? `mock-token-${seq}-${Date.now()}`,
    csrfToken: options.csrfToken ?? `mock-csrf-${seq}-${Date.now()}`,
    theme: options.theme ?? 'light',
    notifications: options.notifications ?? true,
  };
}

/**
 * Configuration options for creating a problem
 */
export interface CreateProblemOptions {
  id?: string;
  name?: string;
  url?: string;
  status?: 'unsolved' | 'solved';
  topic?: string;
  pattern?: string;
  reviewInterval?: number;
  nextReviewDate?: string | null;
  note?: string;
  loading?: boolean;
  noteVisible?: boolean;
}

/**
 * Create a test problem with configurable properties
 * 
 * @param options - Problem configuration options
 * @returns Problem object
 * 
 * @example
 * createProblem() // Basic problem with defaults
 * createProblem({ status: 'solved', topic: 'Arrays' }) // Custom problem
 */
export function createProblem(options: CreateProblemOptions = {}): Problem {
  const seq = _sequenceCounter++;
  const id = options.id ?? `problem-${seq}`;
  const name = options.name ?? SAMPLE_PROBLEM_NAMES[seq % SAMPLE_PROBLEM_NAMES.length] ?? `Problem ${seq}`;
  const status = options.status ?? 'unsolved';
  
  // Calculate next review date based on status
  let nextReviewDate: string | null = options.nextReviewDate ?? null;
  if (status === 'solved' && !nextReviewDate) {
    const interval = options.reviewInterval ?? 1;
    nextReviewDate = dateString({ offsetDays: SPACED_REPETITION_INTERVALS[interval] ?? 1 });
  }
  
  return {
    id,
    name,
    url: options.url ?? `https://leetcode.com/problems/${id.replace(/\s+/g, '-').toLowerCase()}`,
    status,
    topic: options.topic ?? randomTopic(),
    pattern: options.pattern ?? randomPattern(),
    reviewInterval: options.reviewInterval ?? 0,
    nextReviewDate,
    note: options.note ?? '',
    loading: options.loading ?? false,
    noteVisible: options.noteVisible ?? false,
  };
}

/**
 * Configuration options for creating a flashcard
 */
export interface CreateFlashcardOptions {
  id?: string;
  type?: 'algorithm' | 'pattern' | 'sql';
  category?: string;
  front?: string;
  back?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

/**
 * Create a flashcard with configurable properties
 * 
 * @param options - Flashcard configuration options
 * @returns FlashCard object
 * 
 * @example
 * createFlashcard() // Basic flashcard
 * createFlashcard({ type: 'algorithm', difficulty: 'hard' }) // Custom flashcard
 */
export function createFlashcard(options: CreateFlashcardOptions = {}): FlashCard {
  const seq = _sequenceCounter++;
  const type = options.type ?? randomFlashcardType();
  
  return {
    id: options.id ?? uniqueId('fc'),
    type,
    category: options.category ?? randomTopic(),
    front: options.front ?? SAMPLE_FLASHCARD_FRONT[seq % SAMPLE_FLASHCARD_FRONT.length] ?? `Question ${seq}?`,
    back: options.back ?? SAMPLE_FLASHCARD_BACK[seq % SAMPLE_FLASHCARD_BACK.length] ?? `Answer ${seq}.`,
    difficulty: options.difficulty ?? randomDifficulty(),
    tags: options.tags ?? [type, randomTopic()].filter(Boolean),
  };
}

/**
 * Configuration options for creating flashcard progress
 */
export interface CreateFlashcardProgressOptions {
  cardId?: string;
  reviewInterval?: number;
  nextReviewDate?: string | null;
  timesReviewed?: number;
  timesCorrect?: number;
  lastReviewedAt?: string | null;
}

/**
 * Create flashcard progress data
 * 
 * @param options - Progress configuration options
 * @returns FlashCardProgress object
 */
export function createFlashcardProgress(
  options: CreateFlashcardProgressOptions = {}
): FlashCardProgress {
  const timesReviewed = options.timesReviewed ?? randomInt(0, 10);
  const timesCorrect = options.timesCorrect ?? Math.floor(timesReviewed * 0.7);
  const reviewInterval = options.reviewInterval ?? randomInt(0, SPACED_REPETITION_INTERVALS.length - 1);
  
  return {
    cardId: options.cardId ?? uniqueId('fc'),
    reviewInterval,
    nextReviewDate: options.nextReviewDate ?? dateString({ offsetDays: SPACED_REPETITION_INTERVALS[reviewInterval] }),
    timesReviewed,
    timesCorrect,
    lastReviewedAt: options.lastReviewedAt ?? timestamp({ offsetDays: -randomInt(1, 30) }),
  };
}

/**
 * Configuration options for creating a category/topic
 */
export interface CreateCategoryOptions {
  id?: string;
  title?: string;
  patterns?: Pattern[];
  count?: number;
}

/**
 * Create a category/topic with configurable properties
 * 
 * @param options - Category configuration options
 * @returns Topic object
 */
export function createCategory(options: CreateCategoryOptions = {}): Topic {
  const seq = _sequenceCounter++;
  const title = options.title ?? TOPICS[seq % TOPICS.length] ?? `Category ${seq}`;
  const id = options.id ?? title.toLowerCase().replace(/\s+/g, '-');
  
  return {
    id,
    title,
    patterns: options.patterns ?? [createPattern()],
  };
}

/**
 * Configuration options for creating a pattern
 */
export interface CreatePatternOptions {
  name?: string;
  problems?: (string | ProblemDef)[];
}

/**
 * Create a pattern with configurable properties
 * 
 * @param options - Pattern configuration options
 * @returns Pattern object
 */
export function createPattern(options: CreatePatternOptions = {}): Pattern {
  const seq = _sequenceCounter++;
  return {
    name: options.name ?? PATTERNS[seq % PATTERNS.length] ?? `Pattern ${seq}`,
    problems: options.problems ?? [
      { id: `prob-${seq}-1`, name: `Problem ${seq}A`, url: `https://leetcode.com/problems/prob-${seq}-1` },
      { id: `prob-${seq}-2`, name: `Problem ${seq}B`, url: `https://leetcode.com/problems/prob-${seq}-2` },
    ],
  };
}

/**
 * Configuration options for creating sync status
 */
export interface CreateSyncStatusOptions {
  pendingCount?: number;
  isSyncing?: boolean;
  lastSyncAt?: number | null;
  stats?: Partial<SyncStats>;
}

/**
 * Create a sync status object
 * 
 * @param options - Sync status configuration options
 * @returns SyncStatus object
 */
export function createSyncStatus(options: CreateSyncStatusOptions = {}): SyncStatus {
  const pendingCount = options.pendingCount ?? 0;
  const completed = options.stats?.completed ?? randomInt(0, 50);
  const failed = options.stats?.failed ?? 0;
  const manual = options.stats?.manual ?? 0;
  
  return {
    pendingCount,
    isSyncing: options.isSyncing ?? false,
    lastSyncAt: options.lastSyncAt ?? (completed > 0 ? Date.now() : null),
    stats: {
      pending: pendingCount,
      completed,
      failed,
      manual,
    },
  };
}

/**
 * Configuration options for creating an API operation
 */
export interface CreateAPIOperationOptions {
  type?: APIOperationType;
  data?: unknown;
  timestamp?: number;
}

/**
 * Create an API operation for sync queue
 * 
 * @param options - Operation configuration options
 * @returns APIOperation object
 */
export function createAPIOperation(options: CreateAPIOperationOptions = {}): APIOperation {
  const type = options.type ?? pickRandom(API_OPERATION_TYPES);
  
  // Generate appropriate data based on operation type
  let data: unknown = options.data;
  if (!data) {
    switch (type) {
      case 'MARK_SOLVED':
        data = { problemId: uniqueId('problem'), status: 'solved' };
        break;
      case 'UPDATE_REVIEW_DATE':
        data = { problemId: uniqueId('problem'), nextReviewDate: dateString() };
        break;
      case 'UPDATE_DIFFICULTY':
        data = { problemId: uniqueId('problem'), difficulty: randomDifficulty() };
        break;
      case 'ADD_NOTE':
        data = { problemId: uniqueId('problem'), note: 'Test note content' };
        break;
      case 'ADD_CUSTOM_PROBLEM':
        data = { problem: createProblem() };
        break;
      case 'DELETE_PROBLEM':
        data = { problemId: uniqueId('problem') };
        break;
      case 'UPDATE_SETTINGS':
        data = { theme: randomBoolean() ? 'light' : 'dark', notifications: randomBoolean(0.8) };
        break;
    }
  }
  
  return {
    type,
    data,
    timestamp: options.timestamp ?? Date.now(),
  };
}

/**
 * Configuration options for creating localStorage state
 */
export interface CreateLocalStorageStateOptions {
  user?: Partial<TestUser>;
  userType?: 'local' | 'signed-in';
  problems?: Record<string, Problem>;
  flashcardProgress?: Record<string, FlashCardProgress>;
  deletedIds?: string[];
  settings?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    preferredAI?: string | null;
  };
  pendingOperations?: APIOperation[];
  syncStatus?: SyncStatus;
  lastSyncAt?: number;
}

/**
 * Local storage state structure
 */
export interface LocalStorageState {
  userId: string;
  displayName: string;
  'smartgrind-user-type': 'local' | 'signed-in';
  token?: string;
  theme: 'light' | 'dark';
  problems: string; // JSON string
  flashcardProgress?: string; // JSON string
  deletedIds: string; // JSON string
  settings: string; // JSON string
  pendingOperations?: string; // JSON string
  syncStatus?: string; // JSON string
  lastSyncAt?: string;
}

/**
 * Create a complete localStorage state object
 * 
 * @param options - LocalStorage state configuration
 * @returns LocalStorageState object with JSON-serialized values
 */
export function createLocalStorageState(
  options: CreateLocalStorageStateOptions = {}
): LocalStorageState {
  const user = createUser(options.user);
  const userType = options.userType ?? user.type ?? 'local';
  
  const problems = options.problems ?? {};
  const deletedIds = options.deletedIds ?? [];
  const settings = {
    theme: options.settings?.theme ?? 'light',
    notifications: options.settings?.notifications ?? true,
    preferredAI: options.settings?.preferredAI ?? null,
  };
  
  const state: LocalStorageState = {
    userId: user.id ?? uniqueId('user'),
    displayName: user.displayName,
    'smartgrind-user-type': userType,
    theme: settings.theme,
    problems: JSON.stringify(problems),
    deletedIds: JSON.stringify(deletedIds),
    settings: JSON.stringify(settings),
  };
  
  if (user.token) {
    state.token = user.token;
  }
  
  if (options.flashcardProgress && Object.keys(options.flashcardProgress).length > 0) {
    state.flashcardProgress = JSON.stringify(options.flashcardProgress);
  }
  
  if (options.pendingOperations && options.pendingOperations.length > 0) {
    state.pendingOperations = JSON.stringify(options.pendingOperations);
  }
  
  if (options.syncStatus) {
    state.syncStatus = JSON.stringify(options.syncStatus);
  }
  
  if (options.lastSyncAt !== undefined) {
    state.lastSyncAt = String(options.lastSyncAt);
  }
  
  return state;
}

// =============================================================================
// BULK DATA GENERATION
// =============================================================================

/**
 * Generate multiple problems
 * 
 * @param count - Number of problems to generate
 * @param baseOptions - Base options applied to all problems
 * @param variationFn - Optional function to vary each problem
 * @returns Array of Problem objects
 * 
 * @example
 * generateProblems(5)
 * generateProblems(3, { status: 'solved' })
 * generateProblems(3, {}, (i) => ({ topic: i % 2 === 0 ? 'Arrays' : 'Trees' }))
 */
export function generateProblems(
  count: number,
  baseOptions: CreateProblemOptions = {},
  variationFn?: (index: number) => Partial<CreateProblemOptions>
): Problem[] {
  return Array.from({ length: count }, (_, i) => {
    const variations = variationFn?.(i) ?? {};
    return createProblem({ ...baseOptions, ...variations });
  });
}

/**
 * Generate multiple flashcards
 * 
 * @param count - Number of flashcards to generate
 * @param baseOptions - Base options applied to all flashcards
 * @param variationFn - Optional function to vary each flashcard
 * @returns Array of FlashCard objects
 */
export function generateFlashcards(
  count: number,
  baseOptions: CreateFlashcardOptions = {},
  variationFn?: (index: number) => Partial<CreateFlashcardOptions>
): FlashCard[] {
  return Array.from({ length: count }, (_, i) => {
    const variations = variationFn?.(i) ?? {};
    return createFlashcard({ ...baseOptions, ...variations });
  });
}

/**
 * Generate multiple categories with patterns
 * 
 * @param count - Number of categories to generate
 * @param problemsPerPattern - Number of problems per pattern
 * @returns Array of Topic objects
 */
export function generateCategories(
  count: number,
  problemsPerPattern: number = 3
): Topic[] {
  return Array.from({ length: count }, (_, i) => {
    const topicName = TOPICS[i % TOPICS.length] ?? `Category ${i}`;
    return {
      id: topicName.toLowerCase().replace(/\s+/g, '-'),
      title: topicName,
      patterns: [
        {
          name: PATTERNS[i % PATTERNS.length] ?? `Pattern ${i}`,
          problems: Array.from({ length: problemsPerPattern }, (_, j) => ({
            id: `prob-${i}-${j}`,
            name: `Problem ${i}-${j}`,
            url: `https://leetcode.com/problems/prob-${i}-${j}`,
          })),
        },
      ],
    };
  });
}

/**
 * Generate multiple API operations
 * 
 * @param count - Number of operations to generate
 * @returns Array of APIOperation objects
 */
export function generateAPIOperations(count: number): APIOperation[] {
  return Array.from({ length: count }, () => createAPIOperation());
}

// =============================================================================
// DATA SCENARIOS
// =============================================================================

/**
 * User scenario data structure
 */
export interface UserScenario {
  user: TestUser;
  userData: UserData;
  localStorageState: LocalStorageState;
  description: string;
}

/**
 * Create a fresh user with no progress
 * 
 * @returns UserScenario with empty data
 */
export function freshUser(): UserScenario {
  resetCounters();
  const user = createUser({ type: 'signed-in', displayName: 'Fresh User' });
  const userData: UserData = {
    problems: {},
    deletedIds: [],
  };
  
  return {
    user,
    userData,
    localStorageState: createLocalStorageState({
      user,
      problems: userData.problems,
      deletedIds: userData.deletedIds,
    }),
    description: 'Fresh user with no progress, problems, or settings changes',
  };
}

/**
 * Create an expert user with all problems solved
 * 
 * @param problemCount - Number of problems (default: 20)
 * @returns UserScenario with completed data
 */
export function expertUser(problemCount: number = 20): UserScenario {
  resetCounters();
  const user = createUser({ type: 'signed-in', displayName: 'Expert User' });
  
  const problems: Record<string, Problem> = {};
  generateProblems(problemCount, { status: 'solved' }).forEach(problem => {
    problems[problem.id] = {
      ...problem,
      reviewInterval: randomInt(3, 6), // High review intervals
      nextReviewDate: dateString({ offsetDays: randomInt(30, 90) }),
    };
  });
  
  const userData: UserData = {
    problems,
    deletedIds: [],
  };
  
  return {
    user,
    userData,
    localStorageState: createLocalStorageState({
      user,
      problems,
      deletedIds: [],
      settings: { theme: 'dark', notifications: true },
      lastSyncAt: Date.now(),
    }),
    description: `Expert user with ${problemCount} solved problems and high confidence`,
  };
}

/**
 * Create a user with many due problems for review
 * 
 * @param problemCount - Number of problems (default: 15)
 * @param dueRatio - Ratio of problems that are due (default: 0.6)
 * @returns UserScenario with review data
 */
export function reviewUser(problemCount: number = 15, dueRatio: number = 0.6): UserScenario {
  resetCounters();
  const user = createUser({ type: 'signed-in', displayName: 'Review User' });
  
  const problems: Record<string, Problem> = {};
  const solvedCount = Math.floor(problemCount * 0.7);
  
  generateProblems(problemCount, {}, (i) => ({
    status: i < solvedCount ? 'solved' : 'unsolved',
    nextReviewDate: i < solvedCount * dueRatio 
      ? dateString({ offsetDays: -randomInt(1, 30) }) // Due (past date)
      : dateString({ offsetDays: randomInt(1, 14) }), // Not due (future date)
  })).forEach(problem => {
    problems[problem.id] = problem;
  });
  
  const userData: UserData = {
    problems,
    deletedIds: [],
  };
  
  const dueProblems = Object.values(problems).filter(
    p => p.status === 'solved' && p.nextReviewDate && p.nextReviewDate < dateString()
  ).length;
  
  return {
    user,
    userData,
    localStorageState: createLocalStorageState({
      user,
      problems,
      deletedIds: [],
      settings: { theme: 'light', notifications: true },
    }),
    description: `User with ${problemCount} problems (${dueProblems} due for review)`,
  };
}

/**
 * Create a user with pending offline operations
 * 
 * @param pendingCount - Number of pending operations (default: 5)
 * @returns UserScenario with offline data
 */
export function offlineUser(pendingCount: number = 5): UserScenario {
  resetCounters();
  const user = createUser({ type: 'signed-in', displayName: 'Offline User' });
  
  const problems: Record<string, Problem> = {};
  generateProblems(10).forEach(problem => {
    problems[problem.id] = problem;
  });
  
  const pendingOperations = generateAPIOperations(pendingCount);
  const userData: UserData = {
    problems,
    deletedIds: [],
  };
  
  return {
    user,
    userData,
    localStorageState: createLocalStorageState({
      user,
      problems,
      deletedIds: [],
      pendingOperations,
      syncStatus: createSyncStatus({ pendingCount, isSyncing: false }),
    }),
    description: `User with ${pendingCount} pending offline operations`,
  };
}

/**
 * Create a user with corrupted/malformed data for error testing
 * 
 * @returns UserScenario with corrupted data
 */
export function errorUser(): UserScenario & { corruptedData: Record<string, unknown> } {
  resetCounters();
  const user = createUser({ type: 'signed-in', displayName: 'Error Test User' });
  
  // Create intentionally corrupted data
  const corruptedProblems: Record<string, unknown> = {
    'valid-problem': createProblem({ status: 'solved' }),
    'missing-status': {
      id: 'missing-status',
      name: 'Problem Without Status',
      // status is missing - should cause errors
    },
    'invalid-date': {
      id: 'invalid-date',
      name: 'Problem With Bad Date',
      status: 'solved',
      nextReviewDate: 'not-a-date',
    },
    'null-values': {
      id: 'null-values',
      name: null,
      status: null,
      topic: undefined,
    },
    'wrong-types': {
      id: 'wrong-types',
      name: 12345, // number instead of string
      status: true, // boolean instead of string
      reviewInterval: 'five', // string instead of number
    },
  };
  
  const corruptedData: Record<string, unknown> = {
    userId: user.id,
    displayName: user.displayName,
    'smartgrind-user-type': user.type,
    problems: JSON.stringify(corruptedProblems),
    deletedIds: 'not-an-array', // Invalid JSON structure
    settings: '{invalid json', // Malformed JSON
  };
  
  return {
    user,
    userData: {
      problems: corruptedProblems as Record<string, Problem>,
      deletedIds: [],
    },
    localStorageState: corruptedData as unknown as LocalStorageState,
    corruptedData,
    description: 'User with intentionally corrupted data for error handling tests',
  };
}

/**
 * Generate all user scenarios for comprehensive testing
 * 
 * @returns Object containing all user scenarios
 */
export function generateUserScenarios(): {
  fresh: UserScenario;
  expert: UserScenario;
  review: UserScenario;
  offline: UserScenario;
  error: UserScenario & { corruptedData: Record<string, unknown> };
} {
  return {
    fresh: freshUser(),
    expert: expertUser(),
    review: reviewUser(),
    offline: offlineUser(),
    error: errorUser(),
  };
}

// =============================================================================
// STORAGE SERIALIZATION
// =============================================================================

/**
 * Convert data to localStorage format (string values)
 * 
 * @param data - Object to serialize
 * @returns Object with JSON-stringified values
 */
export function toLocalStorageFormat(data: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      result[key] = 'null';
    } else if (typeof value === 'string') {
      result[key] = value;
    } else if (typeof value === 'boolean') {
      result[key] = value ? 'true' : 'false';
    } else if (typeof value === 'number') {
      result[key] = String(value);
    } else {
      result[key] = JSON.stringify(value);
    }
  }
  
  return result;
}

/**
 * Convert data from localStorage format back to typed objects
 * 
 * @param data - localStorage data object
 * @returns Parsed data with proper types
 */
export function fromLocalStorageFormat<T extends Record<string, unknown>>(
  data: Record<string, string>
): T {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value === 'null' || value === 'undefined') {
      result[key] = null;
    } else if (value === 'true') {
      result[key] = true;
    } else if (value === 'false') {
      result[key] = false;
    } else if (!isNaN(Number(value)) && !value.includes(' ')) {
      // Try to parse as number if it looks like one
      result[key] = Number(value);
    } else if (value.startsWith('{') || value.startsWith('[')) {
      // Try to parse as JSON
      try {
        result[key] = JSON.parse(value);
      } catch {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  }
  
  return result as T;
}

/**
 * API Response format interfaces
 */
export interface APIResponseFormat {
  success: boolean;
  data?: unknown;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

/**
 * Convert data to API response format
 * 
 * @param data - Response data payload
 * @param success - Whether the request was successful
 * @param error - Error details if unsuccessful
 * @returns APIResponseFormat object
 */
export function toAPIFormat<T>(
  data: T,
  success: boolean = true,
  error?: { code: string; message: string }
): APIResponseFormat & { data: T } {
  return {
    success,
    data,
    ...(error && { error }),
    meta: {
      timestamp: timestamp(),
      requestId: uniqueId('req'),
    },
  };
}

/**
 * Default values for data types
 */
export const DEFAULTS = {
  user: {
    type: 'local' as const,
    displayName: 'Default User',
    theme: 'light' as const,
    notifications: true,
  },
  problem: {
    status: 'unsolved' as const,
    topic: 'Arrays',
    pattern: 'Two Pointers',
    reviewInterval: 0,
    note: '',
    nextReviewDate: null,
  },
  flashcard: {
    type: 'algorithm' as const,
    difficulty: 'medium' as const,
    tags: [],
  },
  syncStatus: {
    pendingCount: 0,
    isSyncing: false,
    lastSyncAt: null,
    stats: {
      pending: 0,
      completed: 0,
      failed: 0,
      manual: 0,
    },
  },
} as const;

/**
 * Deep merge utility for partial data
 * 
 * @param partial - Partial data object
 * @param defaults - Default values
 * @returns Merged object with all defaults applied
 */
export function mergeWithDefaults<T extends Record<string, unknown>>(
  partial: Partial<T>,
  defaults: T
): T {
  const result: Record<string, unknown> = { ...defaults };
  
  for (const [key, value] of Object.entries(partial)) {
    if (value !== undefined) {
      const defaultValue = result[key];
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        typeof defaultValue === 'object' &&
        defaultValue !== null &&
        !Array.isArray(defaultValue)
      ) {
        // Deep merge for nested objects
        result[key] = mergeWithDefaults(
          value as Record<string, unknown>,
          defaultValue as Record<string, unknown>
        );
      } else {
        result[key] = value;
      }
    }
  }
  
  return result as T;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Calculate statistics for a set of problems
 * 
 * @param problems - Array or record of problems
 * @returns Statistics object
 */
export function calculateProblemStats(problems: Problem[] | Record<string, Problem>): {
  total: number;
  solved: number;
  unsolved: number;
  due: number;
  progress: number;
} {
  const problemArray = Array.isArray(problems) ? problems : Object.values(problems);
  const total = problemArray.length;
  const solved = problemArray.filter(p => p.status === 'solved').length;
  const today = dateString();
  const due = problemArray.filter(
    p => p.status === 'solved' && p.nextReviewDate && p.nextReviewDate <= today
  ).length;
  
  return {
    total,
    solved,
    unsolved: total - solved,
    due,
    progress: total > 0 ? Math.round((solved / total) * 100) : 0,
  };
}

/**
 * Create a force sync response
 * 
 * @param options - Response options
 * @returns ForceSyncResponse object
 */
export function createForceSyncResponse(
  options: { success?: boolean; synced?: number; failed?: number } = {}
): ForceSyncResponse {
  return {
    success: options.success ?? true,
    synced: options.synced ?? 0,
    failed: options.failed ?? 0,
  };
}

/**
 * Create a server conflict object
 * 
 * @param options - Conflict options
 * @returns ServerConflict object
 */
export function createServerConflict(
  options: {
    operationId?: string;
    problemId?: string;
    clientData?: unknown;
    serverData?: unknown;
  } = {}
): ServerConflict {
  const seq = _sequenceCounter++;
  return {
    operationId: options.operationId ?? uniqueId('op'),
    problemId: options.problemId ?? `problem-${seq}`,
    clientData: options.clientData ?? { status: 'solved', version: 1 },
    serverData: options.serverData ?? { status: 'unsolved', version: 2 },
  };
}

/**
 * Create a conflict resolution result
 * 
 * @param options - Resolution options
 * @returns ConflictResolution object
 */
export function createConflictResolution(
  options: {
    status?: 'resolved' | 'manual' | 'error';
    data?: unknown;
    message?: string;
  } = {}
): ConflictResolution {
  const statuses: ('resolved' | 'manual' | 'error')[] = ['resolved', 'manual', 'error'];
  const status = options.status ?? statuses[_sequenceCounter++ % 3];
  
  return {
    status,
    ...(options.data !== undefined && { data: options.data }),
    message:
      options.message ??
      (status === 'resolved'
        ? 'Conflict resolved automatically'
        : status === 'manual'
        ? 'Manual resolution required'
        : 'Error during conflict resolution'),
  };
}

/**
 * Create a sync status update (partial for UI updates)
 * 
 * @param options - Update options
 * @returns SyncStatusUpdate object
 */
export function createSyncStatusUpdate(
  options: {
    pendingCount?: number;
    isSyncing?: boolean;
    lastSyncAt?: number | null;
    hasConflicts?: boolean;
    conflictMessage?: string | null;
  } = {}
): SyncStatusUpdate {
  return {
    pendingCount: options.pendingCount,
    isSyncing: options.isSyncing,
    lastSyncAt: options.lastSyncAt,
    hasConflicts: options.hasConflicts,
    conflictMessage: options.conflictMessage,
  };
}

// =============================================================================
// SQL-SPECIFIC FACTORIES
// =============================================================================

/**
 * Configuration options for creating an SQL category
 */
export interface CreateSQLCategoryOptions {
  id?: string;
  title?: string;
  icon?: string;
  topics?: SQLTopic[];
}

/**
 * Create an SQL category
 * 
 * @param options - SQL category options
 * @returns SQLCategory object
 */
export function createSQLCategory(options: CreateSQLCategoryOptions = {}): SQLCategory {
  const seq = _sequenceCounter++;
  const title = options.title ?? `SQL Category ${seq}`;
  
  return {
    id: options.id ?? `sql-cat-${seq}`,
    title,
    icon: options.icon ?? 'database',
    topics: options.topics ?? [createSQLTopic()],
  };
}

/**
 * Configuration options for creating an SQL topic
 */
export interface CreateSQLTopicOptions {
  id?: string;
  name?: string;
  patterns?: SQLPattern[];
}

/**
 * Create an SQL topic
 * 
 * @param options - SQL topic options
 * @returns SQLTopic object
 */
export function createSQLTopic(options: CreateSQLTopicOptions = {}): SQLTopic {
  const seq = _sequenceCounter++;
  const names = ['SELECT Basics', 'JOIN Operations', 'Aggregation', 'Subqueries', 'Window Functions'];
  
  return {
    id: options.id ?? `sql-topic-${seq}`,
    name: options.name ?? names[seq % names.length] ?? `SQL Topic ${seq}`,
    patterns: options.patterns ?? [createSQLPattern()],
  };
}

/**
 * Configuration options for creating an SQL pattern
 */
export interface CreateSQLPatternOptions {
  name?: string;
  description?: string;
  problems?: ProblemDef[];
}

/**
 * Create an SQL pattern
 * 
 * @param options - SQL pattern options
 * @returns SQLPattern object
 */
export function createSQLPattern(options: CreateSQLPatternOptions = {}): SQLPattern {
  const seq = _sequenceCounter++;
  const names = ['Basic SELECT', 'INNER JOIN', 'GROUP BY', 'Nested Queries', 'Common Table Expressions'];
  
  return {
    name: options.name ?? names[seq % names.length] ?? `SQL Pattern ${seq}`,
    description: options.description ?? `Description for ${options.name ?? names[seq % names.length]}`,
    problems: options.problems ?? [
      { id: `sql-prob-${seq}-1`, name: `SQL Problem ${seq}A`, url: '#' },
      { id: `sql-prob-${seq}-2`, name: `SQL Problem ${seq}B`, url: '#' },
    ],
  };
}

/**
 * Configuration options for creating an SQL problem
 */
export interface CreateSQLProblemOptions extends CreateProblemOptions {
  categoryId?: string;
  topicId?: string;
}

/**
 * Create an SQL problem
 * 
 * @param options - SQL problem options
 * @returns SQLProblem object
 */
export function createSQLProblem(options: CreateSQLProblemOptions = {}): SQLProblem {
  const seq = _sequenceCounter++;
  const baseProblem = createProblem(options);
  
  return {
    ...baseProblem,
    categoryId: options.categoryId ?? `sql-cat-${seq}`,
    topicId: options.topicId ?? `sql-topic-${seq}`,
  };
}

// =============================================================================
// PLAYWRIGHT TEST FIXTURES
// =============================================================================

/**
 * Create a complete test environment setup
 * 
 * @param scenario - User scenario to use
 * @returns Environment setup object for Playwright
 */
export function createTestEnvironment(scenario: UserScenario): {
  storageState: Record<string, { value: string }>;
  user: TestUser;
  userData: UserData;
} {
  const storageState: Record<string, { value: string }> = {};
  
  for (const [key, value] of Object.entries(scenario.localStorageState)) {
    storageState[key] = { value: String(value) };
  }
  
  return {
    storageState,
    user: scenario.user,
    userData: scenario.userData,
  };
}

/**
 * Export commonly used test data combinations
 */
export const testData = {
  /** Default test user */
  user: () => createUser({ type: 'signed-in', displayName: 'Test User' }),
  
  /** Default test problem */
  problem: () => createProblem({ status: 'unsolved' }),
  
  /** Default solved test problem */
  solvedProblem: () => createProblem({ status: 'solved', reviewInterval: 2 }),
  
  /** Default test flashcard */
  flashcard: () => createFlashcard({ type: 'algorithm' }),
  
  /** Default test category */
  category: () => createCategory(),
  
  /** Default sync status */
  syncStatus: () => createSyncStatus(),
  
  /** Common problem topics */
  get topics() { return TOPICS; },
  
  /** Common problem patterns */
  get patterns() { return PATTERNS; },
  
  /** Difficulty levels */
  get difficulties() { return DIFFICULTIES; },
  
  /** Status values */
  get statuses() { return STATUSES; },
};
