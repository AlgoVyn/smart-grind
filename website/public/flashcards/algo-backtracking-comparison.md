## Backtracking: Comparison Guide

How does backtracking compare to other combinatorial search algorithms?

<!-- front -->

---

### Exhaustive Search Comparison

| Algorithm | Search Order | Memory | Pruning | Use Case |
|-----------|--------------|--------|---------|----------|
| **Backtracking** | DFS | O(d) | Constraint-based | CSP, permutations |
| **BFS** | Level-order | O(b^d) | None | Shortest path (unweighted) |
| **DFS (naive)** | Depth-first | O(d) | None | Reachability |
| **Branch & Bound** | Best-first | O(b^d) | Bound-based | Optimization |
| **Meet-in-Middle** | Split search | O(b^(d/2)) | Intersection | Subset problems |

**d = depth, b = branching factor**

---

### Backtracking vs Dynamic Programming

| Aspect | Backtracking | Dynamic Programming |
|--------|--------------|---------------------|
| **Overlapping subproblems** | Not exploited | Cached and reused |
| **State space** | Can be huge | Must be manageable |
| **Guarantee** | All solutions | Optimal value |
| **Implementation** | Recursive with undo | Table + recurrence |
| **When to prefer** | Few solutions, good pruning | Many overlapping states |

**Example - Subset Sum:**
```
Backtracking: O(2^n) - enumerate all subsets
DP: O(n × target) - when target is small
```

---

### Backtracking vs Greedy

| Aspect | Greedy | Backtracking |
|--------|--------|--------------|
| **Approach** | Local optimal | Systematic search |
| **Optimality** | Not guaranteed | Can find optimal |
| **Speed** | O(n) or O(n log n) | Exponential |
| **Use when** | Greedy choice property holds | Need exact solution |

**Example - N-Queens:** Greedy fails, backtracking works.

---

### Optimization Variants

| Variant | Extra Structure | Performance Gain |
|---------|-----------------|------------------|
| **Backtracking + FC** | Forward checking | Prunes early |
| **Backtracking + AC3** | Arc consistency | Stronger pruning |
| **Min-Conflicts** | Local search | For large CSPs |
| **DPLL** | Unit propagation | SAT solving |
| **CDCL** | Conflict clauses | Modern SAT solving |

---

### When to Use Each Approach

| Problem Characteristics | Algorithm |
|-------------------------|-----------|
| Find any solution, depth unknown | BFS |
| Find any solution, memory limited | IDDFS |
| Find optimal, has heuristic | A* |
| All solutions, constraints | Backtracking |
| Optimization, bound available | Branch & Bound |
| Large CSP, approximate OK | Local search |
| Boolean satisfiability | SAT solver (CDCL) |
| Small n (≤20), exhaustive | Backtracking with bitmask |

<!-- back -->
