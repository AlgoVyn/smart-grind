## Backtracking - Permutations: Core Concepts

What are the fundamental principles of the backtracking pattern for generating permutations?

<!-- front -->

---

### Core Concept

Use **recursive exploration with state tracking to systematically generate all possible arrangements** of elements, backtracking when we reach a dead end.

**Key insight**: Build the solution incrementally, exploring all valid choices at each step and undoing (backtracking) when constraints are violated.

---

### The Pattern

```
Generate permutations of [1, 2, 3]:

Start: path = [], used = [F, F, F]

Level 0: Choose 1
  path = [1], used = [T, F, F]
  
  Level 1: Choose 2
    path = [1,2], used = [T,T,F]
    
    Level 2: Choose 3
      path = [1,2,3], used = [T,T,T]
      Complete! Add to results ✓
      Backtrack: path = [1,2], used = [T,T,F]
    
    Backtrack: path = [1], used = [T,F,F]
    
  Level 1: Choose 3
    path = [1,3], used = [T,F,T]
    
    Level 2: Choose 2
      path = [1,3,2], used = [T,T,T]
      Complete! Add to results ✓
    
  Backtrack: path = [], used = [F,F,F]

Level 0: Choose 2...
(and so on)

Result: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

---

### Backtracking Template

| Step | Action |
|------|--------|
| **Choose** | Select an element and add to current path |
| **Explore** | Recursively build upon current choice |
| **Unchoose** | Remove element and mark as unused |

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Permutations** | All arrangements of elements | Permutations I/II |
| **Combinations** | All subsets of size k | Combinations |
| **Subsets** | All possible subsets | Subsets |
| **N-Queens** | Place N queens safely | N-Queens |
| **Sudoku** | Fill grid with constraints | Sudoku Solver |
| **Word Search** | Find words in grid | Word Search |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| **Time** | O(n!) for permutations | Explore all possibilities |
| **Space** | O(n) | Recursion stack + path |
| **Solutions** | n! permutations | For n distinct elements |

<!-- back -->
