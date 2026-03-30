/**
 * Test Data Fixtures
 * 
 * Provides mock data for consistent testing across e2e tests.
 * All data follows the same structure as real API responses.
 */

import type { Problem, Flashcard } from '../../../src/types';

// Mock user data
export const mockUser = {
  userId: 'test-user-123',
  displayName: 'Test User',
  email: 'test@example.com',
  token: 'mock-jwt-token',
  csrfToken: 'mock-csrf-token',
};

// Mock problem data
export const mockProblems: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    url: 'https://leetcode.com/problems/two-sum',
    topic: 'Arrays',
    pattern: 'Two Pointers',
    difficulty: 'Easy',
    status: 'solved',
    lastReviewed: '2024-01-15',
    nextReviewDate: '2024-01-20',
    reviewCount: 3,
    confidence: 0.8,
  },
  {
    id: 'three-sum',
    title: '3Sum',
    url: 'https://leetcode.com/problems/3sum',
    topic: 'Arrays',
    pattern: 'Two Pointers',
    difficulty: 'Medium',
    status: 'unsolved',
    reviewCount: 0,
    confidence: 0,
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    url: 'https://leetcode.com/problems/binary-search',
    topic: 'Binary Search',
    pattern: 'Binary Search',
    difficulty: 'Easy',
    status: 'solved',
    lastReviewed: '2024-01-10',
    nextReviewDate: '2024-01-25',
    reviewCount: 5,
    confidence: 0.9,
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    url: 'https://leetcode.com/problems/merge-intervals',
    topic: 'Intervals',
    pattern: 'Merge Intervals',
    difficulty: 'Medium',
    status: 'due',
    lastReviewed: '2024-01-01',
    nextReviewDate: '2024-01-15',
    reviewCount: 2,
    confidence: 0.5,
  },
  {
    id: 'lru-cache',
    title: 'LRU Cache',
    url: 'https://leetcode.com/problems/lru-cache',
    topic: 'Design',
    pattern: 'Design',
    difficulty: 'Medium',
    status: 'unsolved',
    reviewCount: 0,
    confidence: 0,
  },
];

// Mock flashcard data
export const mockFlashcards: Flashcard[] = [
  {
    id: 'fc-1',
    type: 'algorithm',
    category: 'Arrays',
    title: 'Two Pointers Pattern',
    question: 'What is the Two Pointers pattern and when should you use it?',
    answer: 'Two Pointers is a pattern where two pointers iterate through a data structure in a coordinated manner. Use it for sorted arrays, finding pairs, or palindrome checking.',
    difficulty: 'Easy',
    nextReviewDate: new Date().toISOString().split('T')[0],
    reviewCount: 2,
  },
  {
    id: 'fc-2',
    type: 'pattern',
    category: 'Binary Search',
    title: 'Binary Search Template',
    question: 'What is the basic template for binary search?',
    answer: 'Initialize left=0, right=len-1. While left <= right: mid = left + (right-left)/2. Compare target with mid, adjust left/right accordingly.',
    difficulty: 'Medium',
    nextReviewDate: new Date().toISOString().split('T')[0],
    reviewCount: 3,
  },
  {
    id: 'fc-3',
    type: 'sql',
    category: 'SQL Basics',
    title: 'SQL SELECT Statement',
    question: 'Write a query to select all columns from a table named "users".',
    answer: 'SELECT * FROM users;',
    difficulty: 'Easy',
    nextReviewDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    reviewCount: 1,
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
    settings: { theme: 'light' },
  },
  
  // User with all problems solved
  completedUser: {
    userId: 'completed-user',
    displayName: 'Expert User',
    problems: Object.fromEntries(
      mockProblems.map(p => [p.id, { ...p, status: 'solved' as const, reviewCount: 5, confidence: 0.95 }])
    ),
    deletedIds: [],
    settings: { theme: 'dark' },
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
    settings: { theme: 'light' },
  },
  
  // User with offline changes pending
  offlineUser: {
    userId: 'offline-user',
    displayName: 'Offline User',
    problems: Object.fromEntries(mockProblems.map(p => [p.id, p])),
    deletedIds: [],
    settings: { theme: 'light' },
    pendingOperations: [
      { type: 'solve', problemId: 'two-sum', timestamp: Date.now() },
      { type: 'reset', problemId: 'three-sum', timestamp: Date.now() },
    ],
  },
};

// Stats calculations helper
export const calculateStats = (problems: Problem[]) => {
  const total = problems.length;
  const solved = problems.filter(p => p.status === 'solved').length;
  const due = problems.filter(p => p.status === 'due' || (p.status === 'solved' && p.nextReviewDate <= new Date().toISOString().split('T')[0])).length;
  return {
    total,
    solved,
    unsolved: total - solved,
    due,
    progress: total > 0 ? Math.round((solved / total) * 100) : 0,
  };
};
