/**
 * Test Data Fixtures
 * 
 * Provides mock data for consistent testing across e2e tests.
 * All data follows the same structure as real API responses.
 */

// Mock user data
export const mockUser = {
  userId: 'test-user-123',
  displayName: 'Test User',
  email: 'test@example.com',
  token: 'mock-jwt-token',
  csrfToken: 'mock-csrf-token',
};

// Mock problem data - aligned with src/types.ts Problem interface
export const mockProblems = [
  {
    id: 'two-sum',
    name: 'Two Sum',
    url: 'https://leetcode.com/problems/two-sum',
    topic: 'Arrays',
    pattern: 'Two Pointers',
    status: 'solved' as const,
    reviewInterval: 3,
    nextReviewDate: '2024-01-20',
    note: '',
  },
  {
    id: 'three-sum',
    name: '3Sum',
    url: 'https://leetcode.com/problems/3sum',
    topic: 'Arrays',
    pattern: 'Two Pointers',
    status: 'unsolved' as const,
    reviewInterval: 0,
    nextReviewDate: null,
    note: '',
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    url: 'https://leetcode.com/problems/binary-search',
    topic: 'Binary Search',
    pattern: 'Binary Search',
    status: 'solved' as const,
    reviewInterval: 5,
    nextReviewDate: '2024-01-25',
    note: '',
  },
  {
    id: 'merge-intervals',
    name: 'Merge Intervals',
    url: 'https://leetcode.com/problems/merge-intervals',
    topic: 'Intervals',
    pattern: 'Merge Intervals',
    status: 'solved' as const,
    reviewInterval: 2,
    nextReviewDate: '2024-01-15',
    note: '',
  },
  {
    id: 'lru-cache',
    name: 'LRU Cache',
    url: 'https://leetcode.com/problems/lru-cache',
    topic: 'Design',
    pattern: 'Design',
    status: 'unsolved' as const,
    reviewInterval: 0,
    nextReviewDate: null,
    note: '',
  },
];

// Mock flashcard data - aligned with src/types.ts FlashCard interface
export const mockFlashcards = [
  {
    id: 'fc-1',
    type: 'algorithm' as const,
    category: 'Arrays',
    front: 'Two Pointers Pattern: What is the Two Pointers pattern and when should you use it?',
    back: 'Two Pointers is a pattern where two pointers iterate through a data structure in a coordinated manner. Use it for sorted arrays, finding pairs, or palindrome checking.',
    difficulty: 'easy' as const,
    tags: ['arrays', 'two-pointers', 'pattern'],
  },
  {
    id: 'fc-2',
    type: 'pattern' as const,
    category: 'Binary Search',
    front: 'Binary Search Template: What is the basic template for binary search?',
    back: 'Initialize left=0, right=len-1. While left <= right: mid = left + (right-left)/2. Compare target with mid, adjust left/right accordingly.',
    difficulty: 'medium' as const,
    tags: ['binary-search', 'template', 'algorithm'],
  },
  {
    id: 'fc-3',
    type: 'sql' as const,
    category: 'SQL Basics',
    front: 'SQL SELECT Statement: Write a query to select all columns from a table named "users".',
    back: 'SELECT * FROM users;',
    difficulty: 'easy' as const,
    tags: ['sql', 'select', 'basics'],
  },
];

// Mock categories/topics
export const mockCategories = [
  { id: 'arrays', title: 'Arrays', count: 15 },
  { id: 'binary-search', title: 'Binary Search', count: 8 },
  { id: 'trees', title: 'Trees', count: 12 },
  { id: 'graphs', title: 'Graphs', count: 10 },
  { id: 'dp', title: 'Dynamic Programming', count: 20 },
  { id: 'intervals', title: 'Intervals', count: 6 },
  { id: 'design', title: 'Design', count: 5 },
];

// Mock SQL categories
export const mockSQLCategories = [
  { id: 'sql-basics', title: 'SQL Basics', count: 10 },
  { id: 'sql-joins', title: 'SQL Joins', count: 8 },
  { id: 'sql-aggregation', title: 'SQL Aggregation', count: 6 },
  { id: 'sql-subqueries', title: 'SQL Subqueries', count: 5 },
];

// Mock API responses
export const mockAPIResponses = {
  auth: {
    token: {
      token: mockUser.token,
      userId: mockUser.userId,
      displayName: mockUser.displayName,
    },
  },
  user: {
    problems: Object.fromEntries(mockProblems.map(p => [p.id, p])),
    deletedIds: [],
    settings: {
      theme: 'light',
      notifications: true,
    },
    displayName: mockUser.displayName,
  },
  csrf: {
    csrfToken: mockUser.csrfToken,
  },
  topics: mockCategories,
  save: {
    success: true,
    timestamp: new Date().toISOString(),
  },
  sync: {
    success: true,
    conflicts: [],
    serverProblems: Object.fromEntries(mockProblems.map(p => [p.id, p])),
  },
};

// Local storage mock data
export const mockLocalStorage = {
  'userId': mockUser.userId,
  'displayName': mockUser.displayName,
  'smartgrind-user-type': 'signed-in',
  'token': mockUser.token,
  'theme': 'light',
  'smartgrind-local-display-name': mockUser.displayName,
};

// Test scenarios data
export const testScenarios = {
  // Fresh user with no progress
  freshUser: {
    userId: 'fresh-user',
    displayName: 'New User',
    problems: {},
    deletedIds: [],
    settings: { theme: 'light', notifications: true },
  },
  
  // User with all problems solved
  completedUser: {
    userId: 'completed-user',
    displayName: 'Expert User',
    problems: Object.fromEntries(
      mockProblems.map(p => [p.id, { ...p, status: 'solved' as const, reviewInterval: 5 }])
    ),
    deletedIds: [],
    settings: { theme: 'dark', notifications: true },
  },
  
  // User with many due problems
  dueProblemsUser: {
    userId: 'due-user',
    displayName: 'Review User',
    problems: Object.fromEntries(
      mockProblems.map((p, i) => [
        p.id, 
        { 
          ...p, 
          status: i % 2 === 0 ? 'solved' : 'unsolved',
          nextReviewDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
        }
      ])
    ),
    deletedIds: [],
    settings: { theme: 'light', notifications: true },
  },
  
  // User with offline changes pending
  offlineUser: {
    userId: 'offline-user',
    displayName: 'Offline User',
    problems: Object.fromEntries(mockProblems.map(p => [p.id, p])),
    deletedIds: [],
    settings: { theme: 'light', notifications: true },
    pendingOperations: [
      { type: 'solve', problemId: 'two-sum', timestamp: Date.now() },
      { type: 'reset', problemId: 'three-sum', timestamp: Date.now() },
    ],
  },
};

// Stats calculations helper
export const calculateStats = (problems: typeof mockProblems) => {
  const total = problems.length;
  const solved = problems.filter(p => p.status === 'solved').length;
  const due = problems.filter(p => p.status === 'solved' && p.nextReviewDate && p.nextReviewDate <= new Date().toISOString().split('T')[0]).length;
  return {
    total,
    solved,
    unsolved: total - solved,
    due,
    progress: total > 0 ? Math.round((solved / total) * 100) : 0,
  };
};
