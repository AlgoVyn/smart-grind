## Title: Topological Sort - Frameworks

What are the structured approaches for topological sorting?

<!-- front -->

---

### Framework 1: Kahn's Algorithm (BFS-based) Template

```
┌─────────────────────────────────────────────────────┐
│  KAHN'S ALGORITHM FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Build adjacency list from edges                 │
│  2. Calculate in-degree for each vertex             │
│  3. Initialize queue with all in-degree 0 vertices   │
│  4. While queue not empty:                          │
│     a. Dequeue vertex                               │
│     b. Add to result                                 │
│     c. For each neighbor:                            │
│        - Decrement in-degree                        │
│        - If in-degree becomes 0: enqueue            │
│  5. If result length < total vertices:               │
│     - Cycle detected!                                │
│  6. Return result                                   │
└─────────────────────────────────────────────────────┘
```

**When to use:** General topological sort, explicit cycle detection, easier to understand.

---

### Framework 2: DFS-based Template

```
┌─────────────────────────────────────────────────────┐
│  DFS-BASED TOPOLOGICAL SORT FRAMEWORK                │
├─────────────────────────────────────────────────────┤
│  1. Build adjacency list from edges                 │
│  2. Initialize visited state array (0/1/2)           │
│  3. For each unvisited vertex:                     │
│     a. Mark as visiting (state = 1)                  │
│     b. Recursively visit all neighbors              │
│     c. If neighbor is visiting: CYCLE!              │
│     d. Mark as done (state = 2)                     │
│     e. Add to result                                 │
│  4. Reverse result for correct order                │
│  5. Return result                                    │
└─────────────────────────────────────────────────────┘
```

**When to use:** When DFS is already being used, recursive preference.

---

### Framework 3: Lexicographical Order Template

```
┌─────────────────────────────────────────────────────┐
│  LEXICOGRAPHICAL TOPOLOGICAL SORT FRAMEWORK           │
├─────────────────────────────────────────────────────┤
│  1. Same as Kahn's but use min-heap/priority queue   │
│  2. Always pick smallest available vertex           │
│  3. This produces lexicographically smallest order │
│  4. Time: O((V+E) log V) due to heap operations    │
└─────────────────────────────────────────────────────┘
```

**When to use:** When a specific deterministic order is required.

<!-- back -->
