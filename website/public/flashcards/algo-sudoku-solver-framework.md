## Title: Sudoku Solver - Frameworks

What are the structured approaches for solving Sudoku?

<!-- front -->

---

### Framework 1: MRV Backtracking Template

```
┌─────────────────────────────────────────────────────┐
│  MRV BACKTRACKING FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Initialize constraint sets (rows, cols, boxes)│
│  2. Fill with given numbers                          │
│  3. Define backtrack():                              │
│     a. Find empty cell with minimum options (MRV)    │
│     b. If no empty cells: return True (solved)      │
│     c. For each valid number (1-9):                 │
│        - Place number, update sets                  │
│        - If backtrack(): return True                 │
│        - Remove number, restore sets (backtrack)    │
│     d. Return False (need to backtrack)             │
│  4. Call backtrack() and return result               │
└─────────────────────────────────────────────────────┘
```

**When to use:** Standard Sudoku solving, need efficiency.

---

### Framework 2: Simple Backtracking Template

```
┌─────────────────────────────────────────────────────┐
│  SIMPLE BACKTRACKING FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│  1. Define backtrack():                              │
│     a. Find first empty cell (row-major order)      │
│     b. If no empty cells: return True (solved)      │
│     c. For each number (1-9):                        │
│        - Check if valid (scan row/col/box)          │
│        - Place number                                │
│        - If backtrack(): return True                 │
│        - Remove number                              │
│     d. Return False                                  │
│  2. Call backtrack()                                 │
└─────────────────────────────────────────────────────┘
```

**When to use:** Learning backtracking, simpler code.

---

### Framework 3: Constraint Propagation Template

```
┌─────────────────────────────────────────────────────┐
│  CONSTRAINT PROPAGATION FRAMEWORK                    │
├─────────────────────────────────────────────────────┤
│  1. While making progress:                           │
│     a. Find cells with only one valid option        │
│     b. Fill those cells (naked singles)              │
│     c. Update constraints                            │
│  2. If stuck:                                        │
│     a. Use backtracking on remaining cells          │
│  3. Return solution                                  │
└─────────────────────────────────────────────────────┘
```

**When to use:** Human-like solving, reduces search space.

<!-- back -->
