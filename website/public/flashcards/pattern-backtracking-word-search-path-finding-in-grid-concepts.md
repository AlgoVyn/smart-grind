## Backtracking - Word Search Path Finding in Grid: Core Concepts

What are the fundamental principles of DFS with backtracking for grid path finding?

<!-- front -->

---

### Core Concept

Use **depth-first search (DFS) with backtracking and visited marking** to explore paths in a 2D grid, systematically trying all possible routes while avoiding cycles through state restoration.

**Key insight**: Grid traversal is inherently recursive - from any cell you can move to adjacent cells, but you must mark visited positions to prevent infinite loops and restore state to enable exploring alternative paths.

---

### The Pattern

```
Finding "ABF" in this grid:

    0   1   2
0   A   B   C
1   D   E   F
2   G   H   I

Path exploration:

Start at (0,0) = 'A' → matches 'A' ✓
  Mark A as visited
  
  From A, try neighbors:
    Right to (0,1) = 'B' → matches 'B' ✓
      Mark B as visited
      
      From B, try neighbors:
        Left to A → visited (skip)
        Right to C → 'C' != 'F' (fail)
        Down to E → 'E' != 'F' (fail)
      
      Unmark B (backtrack)
    
    Down to D → 'D' != 'B' (fail)
  
  Unmark A (backtrack)

Try other starts...
Eventually: A→B→? doesn't reach F directly
Need: A→?→...→F
```

---

### The Three "Aha!" Moments

| Question | Answer |
|----------|--------|
| **Why mark visited cells?** | In a grid, you can return to previous cells through different paths. Marking prevents revisiting the same cell in the current path, avoiding cycles. |
| **Why restore the cell after exploring?** | Each path attempt must be independent. If path A→B→C fails, cell B should be available for path A→B→D. |
| **Why start from every cell?** | The target word/path can begin anywhere in the grid, not just at position (0,0). |

---

### Backtracking Template for Grids

| Step | Action | Code Pattern |
|------|--------|--------------|
| **Choose** | Mark cell as visited | `temp = board[r][c]; board[r][c] = '#'` |
| **Explore** | Recurse to 4 neighbors | `for dr, dc in directions: dfs(r+dr, c+dc)` |
| **Unchoose** | Restore cell state | `board[r][c] = temp` |

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Word Search** | Find word path in character grid | LeetCode 79 |
| **Path with Maximum Gold** | Collect maximum value path | LeetCode 1219 |
| **Unique Paths III** | Visit all empty cells exactly once | LeetCode 980 |
| **Robot Room Cleaner** | Clean all reachable cells | LeetCode 489 |
| **Maze Solving** | Find route through obstacles | Classic problem |
| **Word Search II** | Find multiple words using Trie | LeetCode 212 |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| **Time** | O(m × n × 4^L) | Grid cells × branching factor^depth |
| **Space** | O(L) | Recursion stack + visited tracking |
| **Worst Case** | Try all paths up to length L | Early termination helps |

Where:
- `m`, `n` = grid dimensions
- `L` = length of target word/path
- `4^L` = 4 directions at each step

---

### Base Cases in DFS

```
┌─────────────────────────────────────────────────────────┐
│  BASE CASE HIERARCHY                                     │
├─────────────────────────────────────────────────────────┤
│  1. SUCCESS: index == len(word)                          │
│     → Found complete word, return True                   │
│                                                          │
│  2. OUT OF BOUNDS: r < 0 or r >= rows or c < 0 or c >= cols│
│     → Invalid position, return False                     │
│                                                          │
│  3. ALREADY VISITED: board[r][c] == '#'                  │
│     → Cell used in current path, return False            │
│                                                          │
│  4. CHARACTER MISMATCH: board[r][c] != word[index]         │
│     → Wrong character, return False                      │
└─────────────────────────────────────────────────────────┘
```

<!-- back -->
