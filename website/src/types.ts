// --- TYPES MODULE ---
// TypeScript interfaces and types for the application

export interface Problem {
    id: string;
    name: string;
    url: string;
    status: 'unsolved' | 'solved';
    topic: string;
    pattern: string;
    reviewInterval: number;
    nextReviewDate: string | null;
    note: string;
    loading?: boolean;
    noteVisible?: boolean;
}

export interface ProblemDef {
    id: string;
    name: string;
    url: string;
}

export interface Pattern {
    name: string;
    problems: (string | ProblemDef)[];
}

export interface Topic {
    id: string;
    title: string;
    patterns: Pattern[];
}

export interface UserData {
    problems: Record<string, Problem>;
    deletedIds: string[];
}

export interface User {
    type: 'local' | 'signed-in';
    id: string | null;
    displayName: string;
}

export interface UIState {
    activeTopicId: string;
    currentFilter: string;
    searchQuery: string;
    preferredAI: string | null;
    reviewDateFilter: string | null;
}

/** Sync status update - partial type for setSyncStatus */
export interface SyncStatusUpdate {
    pendingCount?: number;
    isSyncing?: boolean;
    lastSyncAt?: number | null;
    hasConflicts?: boolean;
    conflictMessage?: string | null;
}

// --- SQL TYPES ---

export interface SQLCategory {
    id: string;
    title: string;
    icon: string;
    topics: SQLTopic[];
}

export interface SQLTopic {
    id: string;
    name: string;
    patterns: SQLPattern[];
}

export interface SQLPattern {
    name: string;
    description?: string;
    problems: ProblemDef[];
}

export interface SQLProblem extends Problem {
    categoryId: string;
    topicId: string;
}

// --- FLASH CARD TYPES ---

export interface FlashCard {
    id: string;
    type: 'algorithm' | 'pattern' | 'sql';
    category: string; // Algorithm category or Pattern topic ID
    front: string;
    back: string;
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
}

export interface FlashCardProgress {
    cardId: string;
    reviewInterval: number; // Index into SPACED_REPETITION_INTERVALS
    nextReviewDate: string | null; // ISO date string
    timesReviewed: number;
    timesCorrect: number;
    lastReviewedAt: string | null;
}

export interface FlashCardSession {
    cardIds: string[];
    currentIndex: number;
    categoryFilter: string | null;
    typeFilter: 'all' | 'algorithm' | 'pattern' | 'sql';
    modeFilter: 'all' | 'due';
    startedAt: string;
}
