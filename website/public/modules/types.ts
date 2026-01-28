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
}
