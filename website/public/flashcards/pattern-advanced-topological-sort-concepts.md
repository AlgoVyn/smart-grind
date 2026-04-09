## Advanced - Topological Sort (Kahn's): Core Concepts

What are the fundamental principles of Kahn's algorithm for topological sorting?

<!-- front -->

---

### Core Concept

Use **BFS starting from nodes with zero in-degree**, repeatedly removing nodes and decrementing neighbors' in-degrees to produce a valid ordering.

**Key insight**: Nodes with no prerequisites (zero in-degree) can be processed first, and removing them may create new zero in-degree nodes.

---

### The Pattern

```
Graph: 1 → 2 → 4
       ↓   ↓
       3 → 5

In-degrees: 1:0, 2:1, 3:1, 4:2, 5:2

Queue: [1] (nodes with in-degree 0)

Step 1: Process 1
  - Neighbors: 2, 3
  - Decrement in-degrees: 2:0, 3:0
  - Add to queue: [2, 3]
  - Result: [1]

Step 2: Process 2
  - Neighbors: 4, 5
  - Decrement: 4:1, 5:1
  - No new zeros
  - Result: [1, 2]

Step 3: Process 3
  - Neighbor: 5
  - Decrement: 5:0
  - Add to queue: [5]
  - Result: [1, 2, 3]

Step 4: Process 5
  - No neighbors
  - Result: [1, 2, 3, 5]

Step 5: Process 4
  - Result: [1, 2, 3, 5, 4]

Valid topological order: [1, 2, 3, 5, 4] ✓
```

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Course Schedule** | Can all courses be completed? | Course Schedule |
| **Task Ordering** | Order with dependencies | Alien Dictionary |
| **Build Order** | Compilation order | Build System |
| **Detect Cycle** | Is DAG? | Course Schedule II |

---

### Cycle Detection

| Condition | Meaning |
|-----------|---------|
| All nodes processed | Valid DAG, topological sort exists |
| Some nodes unprocessed | Cycle exists, no valid ordering |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| **Time** | O(V + E) | Process all nodes and edges |
| **Space** | O(V) | Queue and in-degree array |
| **Build in-degree** | O(V + E) | One-time preprocessing |

<!-- back -->
