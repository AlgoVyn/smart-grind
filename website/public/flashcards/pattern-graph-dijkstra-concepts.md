## Graph - Shortest Path Dijkstra: Core Concepts

What are the fundamental principles of Dijkstra's algorithm for shortest paths?

<!-- front -->

---

### Core Concept

Use **a priority queue to greedily expand the closest unvisited node**, guaranteeing shortest paths in graphs with non-negative weights.

**Key insight**: Once a node is extracted from the priority queue, its shortest distance is finalized.

---

### The Pattern

```
Graph with weighted edges:
    1 --(4)--> 2
    |         |
   (1)       (2)
    |         |
    v         v
    3 --(1)--> 4

Dijkstra from node 1:
  dist: {1: 0, 2: ∞, 3: ∞, 4: ∞}
  PQ: [(0, 1)]

  Pop (0, 1): Update neighbors
    2: dist = min(∞, 0+4) = 4, PQ: [(4, 2)]
    3: dist = min(∞, 0+1) = 1, PQ: [(1, 3), (4, 2)]
  
  Pop (1, 3): Update neighbors
    4: dist = min(∞, 1+1) = 2, PQ: [(2, 4), (4, 2)]
  
  Pop (2, 4): No unvisited neighbors
  
  Pop (4, 2): Check 4, but dist[4]=2 < 4+2=6, no update

Final distances: {1: 0, 2: 4, 3: 1, 4: 2}
Shortest path 1→4: 1→3→4 with cost 2 ✓
```

---

### Why It Works

| Property | Explanation |
|----------|-------------|
| **Greedy choice** | Always process closest unvisited node |
| **Non-negative weights** | Ensures no future path can be shorter |
| **Optimal substructure** | Shortest path contains shortest subpaths |
| **Relaxation** | Update distances when shorter path found |

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Shortest Path | Single source shortest path | Network routing |
| Minimum Cost | Cheapest route | Flight booking |
| Delay Propagation | Signal timing | Circuit design |
| Game Pathfinding | AI movement | Game development |

---

### Complexity

| Implementation | Time | Space |
|----------------|------|-------|
| Array (linear search) | O(V²) | O(V) |
| Binary Heap | O((V + E) log V) | O(V) |
| Fibonacci Heap | O(E + V log V) | O(V) |

<!-- back -->
