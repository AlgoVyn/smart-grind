## Backtracking: Core Concepts

What is backtracking, when is it applicable, and how does it differ from other exhaustive search methods?

<!-- front -->

---

### Fundamental Definition

Backtracking is a **systematic trial-and-error** algorithm that:
1. Builds candidates incrementally
2. Abandons partial candidates ("backtracks") when they cannot lead to a valid solution
3. Explores all possible configurations depth-first

**Key principle:** Prune the search tree early using constraints

```
Search Tree:
       ∅
     / | \
    a  b  c    ← Level 1: choose first element
   /|  |   \
  ab ac ...  ← Level 2: choose second element
  /
abc          ← Level 3: solution or dead end
```

---

### State Space Structure

| Component | Description |
|-----------|-------------|
| **State** | Partial solution (prefix of final answer) |
| **Decision** | Choice at each step (branching factor) |
| **Constraint** | Function to check if state is valid |
| **Goal test** | Function to check if state is complete solution |

---

### Backtracking vs Alternatives

| Method | Approach | Use When |
|--------|----------|----------|
| **Backtracking** | DFS with pruning | Solution is a sequence/vector |
| **Brute Force** | Try all possibilities | No constraints to prune |
| **DP** | Memoize subproblems | Overlapping subproblems |
| **Branch & Bound** | BFS/DFS with bounds | Optimization with pruning |
| **Meet-in-Middle** | Split and combine | Even split reduces exponent |

---

### When to Use Backtracking

| ✅ Use Backtracking | ❌ Don't Use |
|---------------------|--------------|
| Constraint satisfaction (CSP) | Polynomial-time solvable |
| Finding all solutions | Need guaranteed polynomial |
| Permutations/Combinations | Simple iteration suffices |
| Sudoku, N-Queens, Crosswords | Large inputs (use heuristics) |
| Subset sum with constraints | 2^n too large, no pruning |

---

### Complexity Characteristics

```
Worst case: O(b^d) where b = branching factor, d = depth
Best case: O(d) if first path is solution
With pruning: Often much better than naive exponential
```

**Key insight:** The power is in the pruning function - good constraints make backtracking tractable for surprisingly large problems.

<!-- back -->
