## Backtracking - N-Queens: Core Concepts

What are the fundamental principles of the N-Queens constraint satisfaction pattern?

<!-- front -->

---

### Core Concept

**N-Queens is a classic Constraint Satisfaction Problem (CSP) solved with backtracking**

The key insight: Place queens one by one, checking constraints at each step, and backtrack when a placement leads to a dead end.

**Three constraints to satisfy:**
1. No two queens in same **row**
2. No two queens in same **column**
3. No two queens on same **diagonal**

---

### The Pattern

```
Strategy: Place one queen per row (or column)

Row 0: Try each column, check if safe
  ├─ Column 0: Safe? → Place, recurse to row 1
  │   └─ Row 1: Try each column...
  │       ├─ Safe? → Place, recurse
  │       └─ Not safe → Skip (pruning)
  └─ Column 1: Safe? → Place, recurse to row 1

Backtrack when stuck: Remove queen, try next position
```

---

### Diagonal Encoding (The "Aha!" Moment)

```
Instead of checking diagonals element by element,
use mathematical properties:

Anti-diagonal \\ : row - col is constant
  \\  \\  \\  
   0  1  2  3    row-col values
  -1  0  1  2
  -2 -1  0  1
  -3 -2 -1  0

Main-diagonal / : row + col is constant
   0  1  2  3    row+col values
   1  2  3  4
   2  3  4  5
   3  4  5  6
```

---

### Common Applications

| Problem Type | Constraints | Example |
|--------------|-------------|---------|
| N-Queens | Row, col, diagonal | Classic CSP |
| Sudoku | Row, col, box | Grid puzzles |
| Crossword | Word fitting | Letter constraints |
| Maze solving | Path validity | Wall constraints |
| Graph coloring | Adjacent colors | Color constraints |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n!) | Worst case without pruning |
| With pruning | Much better | Early termination |
| Space | O(n) | Recursion + constraint sets |

---

### Backtracking Template

```
def backtrack(state):
    if is_valid_solution(state):
        add_to_results(state)
        return
    
    for choice in get_choices(state):
        if is_valid(choice, state):
            make_choice(choice, state)
            backtrack(state)
            undo_choice(choice, state)  # Key!
```

<!-- back -->
