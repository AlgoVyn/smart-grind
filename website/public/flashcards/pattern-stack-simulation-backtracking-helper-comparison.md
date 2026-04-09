## Stack - Simulation / Backtracking Helper: Comparison

When should you use iterative stack vs recursive vs other approaches for tree/graph traversal?

<!-- front -->

---

### Iterative Stack vs Recursive vs Morris vs BFS

| Aspect | Recursive DFS | Iterative Stack | Morris (O(1) space) | BFS (Queue) |
|--------|-------------|-----------------|---------------------|-------------|
| **Code complexity** | Simplest | Moderate | Complex | Moderate |
| **Space** | O(h) call stack | O(h) heap stack | O(1) | O(w) |
| **Stack overflow** | Yes (risk) | No (heap) | No | No |
| **Tree modification** | No | No | Yes (temporary) | No |
| **Pause/Resume** | No | Yes | No | Yes |
| **In-order ease** | Simple | Moderate | Complex | N/A |
| **Post-order ease** | Simple | Complex | Complex | N/A |

**Winner:**
- Recursive for interviews (quick, clean)
- Iterative for production (no overflow risk)
- Morris for extreme memory constraints
- BFS for level-order or shortest path

---

### When to Use Each Approach

**Recursive DFS - Use when:**
- Code clarity matters most
- Tree depth is bounded (< 1000 typical)
- Quick interview solution
- Problem naturally recursive (tree definitions)

**Iterative Stack - Use when:**
- Deep trees or unknown depth
- Production code safety required
- Explicit state control needed
- Need to pause/resume traversal
- Recursion limit concerns

**Morris Traversal - Use when:**
- Extreme memory constraints
- Cannot allocate O(h) space
- Modifying tree temporarily is acceptable
- Processing very large trees

**BFS (Queue) - Use when:**
- Level-order traversal needed
- Shortest path in unweighted tree
- Want to process by distance from root

---

### Traversal Comparison by Type

| Traversal | Recursive | Iterative (Stack) | Notes |
|-----------|-----------|-------------------|-------|
| **Pre-order** | Easy | Easy | Push right, then left |
| **In-order** | Easy | Moderate | Use while loop for left |
| **Post-order** | Easy | Complex | Two stacks or visited flag |
| **Level-order** | Possible | Use queue | BFS is natural fit |

**Key insight:** Pre-order is easiest for iterative. In-order needs pattern. Post-order needs extra work.

---

### Space Complexity by Tree Shape

**Skewed tree (chain, h = n):**
| Approach | Space | Risk |
|----------|-------|------|
| Recursive | O(n) | Stack overflow likely |
| Iterative | O(n) | Heap handles better |
| Morris | O(1) | No risk |

**Balanced tree (h = log n):**
| Approach | Space | Notes |
|----------|-------|-------|
| Recursive | O(log n) | Safe for most cases |
| Iterative | O(log n) | Safe |
| Morris | O(1) | Overkill unless memory critical |

**Star tree (root + n-1 leaves):**
| Approach | Space | Notes |
|----------|-------|-------|
| Recursive | O(1) | No deep recursion |
| Iterative | O(n) | Stack holds all leaves |
| Morris | O(1) | Good fit |

---

### Key Trade-offs by Situation

| Situation | Best Choice | Why |
|-----------|-------------|-----|
| Interview coding | Recursive DFS | Fastest to write, most readable |
| Interview follow-up | Iterative | Shows depth, handles edge cases |
| Production code | Iterative | No stack overflow risk |
| Very deep tree (>10^5) | Morris or Iterative | Avoid recursion limit |
| Memory extremely limited | Morris | O(1) space guaranteed |
| Need to stop/resume | Iterative | Explicit control |
| Path reconstruction | Iterative with state | Store path in stack element |

---

### Backtracking: Stack vs Recursion

| Aspect | Recursive Backtrack | Iterative Stack |
|--------|-------------------|-----------------|
| **State management** | Automatic (call frame) | Manual (packed into element) |
| **Pruning** | Easy (return early) | Easy (don't push invalid) |
| **Path tracking** | Parameter passing | Include in stack tuple |
| **Global state** | Often needed | Can be avoided |
| **Readability** | Cleaner | More verbose |

**Example comparison for path sum:**

```python
# Recursive
return hasPathSum(left, target - val) or hasPathSum(right, target - val)

# Iterative
stack.append((left, current_sum + left.val))
stack.append((right, current_sum + right.val))
```

<!-- back -->
