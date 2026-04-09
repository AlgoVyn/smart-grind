## Graph - Bidirectional BFS: Comparison

When should you use bidirectional BFS versus other approaches?

<!-- front -->

---

### Bidirectional BFS vs Standard BFS

| Aspect | Bidirectional | Standard BFS |
|--------|---------------|--------------|
| **Time** | O(b^(d/2)) | O(b^d) |
| **Space** | O(b^(d/2)) | O(b^d) |
| **Code complexity** | Higher | Lower |
| **Implementation** | Two frontiers | One queue |
| **Best for** | Known source+target | Single source, multiple targets |

**Winner**: Bidirectional when both endpoints known (2x-1000x faster in practice)

---

### When to Use Each Approach

**Bidirectional BFS**:
- Both source and target known
- Finding shortest path between two nodes
- Word ladder / transformation problems
- Game state solving (chess, puzzles)
- Lock puzzles with target combination

**Standard BFS**:
- Single source, multiple destinations
- Level order traversal
- Connected components
- Shortest path from one to many
- Target unknown or multiple targets

**DFS**:
- Path existence (not shortest)
- Topological sort
- Cycle detection
- Exhaustive search / backtracking

---

### Comparison with Other Pathfinding

| Algorithm | Time | Space | Best For |
|-----------|------|-------|----------|
| **Bidirectional BFS** | O(b^(d/2)) | O(b^(d/2)) | Shortest path, known endpoints |
| **Standard BFS** | O(V + E) | O(V) | Unweighted, single source |
| **Dijkstra** | O(E log V) | O(V) | Weighted shortest path |
| **A*** | O(E) | O(V) | Weighted with heuristic |
| **DFS** | O(V + E) | O(h) | Path existence, backtracking |
| **Bellman-Ford** | O(V * E) | O(V) | Negative weights |

---

### Decision Tree

```
Finding shortest path?
├── Graph unweighted?
│   ├── Yes → Both endpoints known?
│   │   ├── Yes → BIDIRECTIONAL BFS
│   │   └── No → Standard BFS
│   └── No → Weights non-negative?
│       ├── Yes → Dijkstra (or A* with heuristic)
│       └── No → Bellman-Ford
└── Just need any path?
    └── Use DFS
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Word ladder (hit → cog) | Bidirectional BFS | Known start/end, huge savings |
| Social network degrees | Standard BFS | Multiple targets possible |
| Maze with obstacles | A* with heuristic | Faster with good heuristic |
| Unweighted grid path | Bidirectional BFS | Meeting in middle helps |
| Path existence only | DFS | Simpler, less memory |
| All pairs shortest path | Floyd-Warshall | Precompute all paths |

<!-- back -->
