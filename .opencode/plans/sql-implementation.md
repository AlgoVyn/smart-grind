# Implementation Plan: Add SQL Section to SmartGrind

## Overview
Add a comprehensive SQL section to SmartGrind with 14 categories, ~80-100 problems, flashcards, full feature parity with existing patterns, and complete test coverage.

## Requirements Confirmation
✅ SQL section positioned **below Patterns** in sidebar  
✅ **3-5 problems per pattern** (~80-100 total SQL problems)  
✅ **Include SQL flashcards** in implementation  
✅ **Omit difficulty labels** for SQL problems  
✅ **Unit and integration tests** included  

---

## Phase 1: Type Definitions

### File: `src/types.ts`

Add these interfaces after the existing Problem-related types:

```typescript
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

// Update FlashCard type to include 'sql'
export interface FlashCard {
    id: string;
    type: 'algorithm' | 'pattern' | 'sql';
    category: string;
    front: string;
    back: string;
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
}
```

---

## Phase 2: SQL Data Structure

### File: `src/data/sql-data.ts` (NEW FILE)

Create comprehensive SQL data with 14 categories covering all SQL concepts.

**Total: 14 categories, 26 topics, ~80 problems**

Key categories:
1. SQL Basics (SELECT fundamentals, LIMIT)
2. SQL Joins (INNER, OUTER, SELF, Multiple)
3. SQL Aggregation (GROUP BY, Aggregate functions, HAVING)
4. SQL Subqueries (Scalar, Correlated, IN/EXISTS)
5. SQL Window Functions (ROW_NUMBER, RANK, LEAD/LAG, Running totals)
6. SQL CTEs (Basic, Recursive)
7. SQL Set Operations (UNION, INTERSECT, EXCEPT)
8. SQL String Functions (Pattern matching, String manipulation)
9. SQL Date/Time (Date functions, Gaps and ranges)
10. SQL Conditional Logic (CASE, COALESCE)
11. SQL Data Modification (INSERT/UPDATE/DELETE)
12. SQL Advanced Patterns (Pivot, Gaps/Islands, Top N)
13. SQL Performance (Optimization)
14. SQL Database Design (Referential integrity)

Each pattern contains 3-5 LeetCode SQL problems with proper URLs.

Helper functions included:
- `getAllSQLProblems()` - Returns flattened array
- `getSQLCategoryById(id)` - Find category by ID
- `flattenSQLData()` - Get all problems with context
- `TOTAL_UNIQUE_SQL_PROBLEMS` - Total count constant

---

## Phase 3: Sidebar Integration

### File: `src/renderers/sidebar.ts`

Add SQL section below Patterns:

```typescript
function renderSQLSection(): string {
    const totalSQL = getAllSQLProblems().length;
    const solvedSQL = getSolvedSQLCount();
    
    return `
        <div class="sidebar-section">
            <button class="sidebar-section-header" data-section="sql">
                <span class="section-icon">${ICONS.database}</span>
                <span class="section-title">SQL</span>
                <span class="section-toggle">${ICONS.chevronDown}</span>
            </button>
            <div class="sidebar-section-content" id="sql-section">
                <button class="sidebar-btn sidebar-btn-all" data-sql="all">
                    <span class="btn-icon">${ICONS.grid}</span>
                    <span class="btn-text">All SQL Problems</span>
                    <span class="btn-progress">${solvedSQL}/${totalSQL}</span>
                </button>
                ${SQL_DATA.map(category => renderSQLCategoryButton(category)).join('')}
            </div>
        </div>
    `;
}
```

---

## Phase 4: State Management

### File: `src/state.ts`

Add SQL state:

```typescript
const sqlProblemsState = new Map<string, SQLProblem>();

export function getSQLProblems(): Map<string, SQLProblem> {
    return sqlProblemsState;
}

export function getSolvedSQLCount(): number {
    return Array.from(sqlProblemsState.values())
        .filter(p => p.status === 'solved').length;
}

export function getSolvedSQLCountByCategory(categoryId: string): number {
    return Array.from(sqlProblemsState.values())
        .filter(p => p.status === 'solved' && p.categoryId === categoryId)
        .length;
}

export function initializeSQLProblems(): void {
    // Initialize from stored data or defaults
}
```

---

## Phase 5: SQL View Renderer

### File: `src/renderers/sql-view.ts` (NEW)

Render SQL problems with:
- Category header with icon
- Topics as sections
- Patterns with descriptions
- Problem cards (reusing existing components)
- Progress tracking

---

## Phase 6: Navigation

### File: `src/ui/ui-navigation.ts`

Add functions:
- `navigateToSQLCategory(categoryId)`
- `navigateToAllSQL()`
- URL param handling: `?sql=category-id`

---

## Phase 7: SQL Flashcards

### File: `src/data/flashcards-data.ts`

Add 10-30 SQL flashcards covering:
- JOIN differences
- WHERE vs HAVING
- Window functions
- Subquery types
- CTE benefits
- Performance tips

Example:
```typescript
{
    id: 'sql-card-1',
    type: 'sql',
    category: 'sql-basics',
    front: 'What is the difference between INNER JOIN and LEFT JOIN?',
    back: 'INNER JOIN returns only matching rows. LEFT JOIN returns all left table rows plus matches (NULL for non-matches).',
    difficulty: 'easy',
    tags: ['joins', 'basics']
}
```

---

## Phase 8: Unit Tests

### File: `tests/sql-data.test.ts`

Test coverage:
- ✅ 14 categories exist
- ✅ All required fields present
- ✅ 3-5 problems per pattern
- ✅ Problem IDs start with 'sql-'
- ✅ Valid LeetCode URLs
- ✅ Unique IDs
- ✅ Helper functions work

### File: `tests/sql-state.test.ts`

Test coverage:
- ✅ State initialization
- ✅ Problem updates
- ✅ Solved count tracking
- ✅ Category-specific counts

---

## Phase 9: Integration Tests

### File: `e2e/sql-section.spec.ts`

Test coverage:
- ✅ SQL section visible in sidebar
- ✅ Positioned below Patterns
- ✅ Categories clickable
- ✅ Navigation works
- ✅ No difficulty labels
- ✅ Toggle functionality
- ✅ Flashcards accessible
- ✅ Search integration
- ✅ Progress tracking

---

## Files Summary

### New Files (5)
1. `src/data/sql-data.ts` (~500 lines)
2. `src/renderers/sql-view.ts` (~200 lines)
3. `tests/sql-data.test.ts` (~150 lines)
4. `tests/sql-state.test.ts` (~100 lines)
5. `e2e/sql-section.spec.ts` (~200 lines)

### Modified Files (8)
1. `src/types.ts` - Add SQL types
2. `src/data/data.ts` - Export SQL data
3. `src/renderers/sidebar.ts` - Add SQL section
4. `src/state.ts` - SQL state management
5. `src/ui/ui-navigation.ts` - SQL navigation
6. `src/renderers/main-view.ts` - SQL view routing
7. `src/data/flashcards-data.ts` - SQL flashcards
8. `src/renderers/problem-cards.ts` - SQL support

### Total
- **~1500 lines of new code**
- **14 SQL categories**
- **~80 SQL problems**
- **10+ SQL flashcards**
- **Complete test coverage**

---

## Implementation Timeline

- **Phase 1-2**: Types and Data (1 hour)
- **Phase 3-4**: Sidebar and State (1 hour)
- **Phase 5-6**: View and Navigation (1.5 hours)
- **Phase 7**: Flashcards (30 min)
- **Phase 8-9**: Tests (1.5 hours)
- **Testing & Debugging**: (1 hour)

**Total: ~6 hours**

---

## Ready to Implement

This plan is complete and ready for execution. All requirements are addressed:
- ✅ SQL section below Patterns
- ✅ 3-5 problems per pattern
- ✅ SQL flashcards included
- ✅ No difficulty labels
- ✅ Unit and integration tests

**Approve to begin implementation.**
