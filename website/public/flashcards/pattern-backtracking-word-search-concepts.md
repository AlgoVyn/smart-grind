## Backtracking - Word Search: Core Concepts

What are the fundamental principles of word search?

<!-- front -->

---

### Core Concept

**Use DFS to explore all possible paths from each cell, marking visited cells to prevent cycles, and backtracking when paths don't match the target word.**

**Key insight:** The word can start anywhere and move in 4 directions (up, down, left, right) with no revisiting.

**Example:**
```
Grid: A B C
      D E F
      G H I

Find "ABF":
- Start at A(0,0): match 'A'
- Move right to B(0,1): match 'B'
- From B, try neighbors:
  - A: visited
  - C: 'C' != 'F'
  - E: 'E' != 'F'
- No path from B to F
- Need different approach or word doesn't exist
```

---

### The Pattern

```
1. Try every cell as starting point
2. DFS from matching cells
3. At each step:
   - Check bounds and match
   - Mark visited
   - Recurse to 4 neighbors
   - Unmark (backtrack)
4. Return True if any path works
```

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(m×n×4^L) | L = word length |
| Space | O(L) | Recursion depth |
| Pruning | Early exit | On mismatch |

<!-- back -->
