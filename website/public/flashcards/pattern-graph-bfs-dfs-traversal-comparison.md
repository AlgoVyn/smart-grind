## Graph - BFS/DFS Traversal: Comparison

When should you use BFS versus DFS for graph traversal?

<!-- front -->

---

### BFS vs DFS for Graphs

| Aspect | BFS | DFS |
|--------|-----|-----|
| **Order** | Level by level (distance) | Depth first |
| **Shortest path (unweighted)** | Finds optimal | May find longer first |
| **Space** | O(w) - max width | O(h) - max depth |
| **Implementation** | Queue (iterative) | Stack or recursion |
| **Complete traversal** | Same O(V+E) | Same O(V+E) |
| **Cycle detection** | Yes | Yes |
| **Topological sort** | Kahn's algorithm | DFS-based |

---

### When to Use Each

**Use BFS when:**
- Finding shortest path in unweighted graph
- Finding neighbors level by level
- Clone/copy graph structure
- Web crawling (by depth)
- Social network (degrees of separation)

**Use DFS when:**
- Exploring all paths
- Detecting cycles in directed graphs
- Topological sorting
- Finding connected components
- Maze solving (find any path)
- Testing if path exists

---

### Comparison with Other Graph Algorithms

| Algorithm | Time | Space | Best For |
|-----------|------|-------|----------|
| **BFS** | O(V+E) | O(V) | Shortest path (unweighted) |
| **DFS** | O(V+E) | O(V) | Path finding, cycle detection |
| **Dijkstra** | O((V+E) log V) | O(V) | Shortest path (weighted) |
| **Union-Find** | O(α(V)) | O(V) | Dynamic connectivity |
| **Topological** | O(V+E) | O(V) | Ordering dependencies |

---

### Decision Tree

```
Graph traversal problem?
├── Yes → Need shortest path (unweighted)?
│   ├── Yes → BFS
│   └── No → Explore all possibilities?
│       ├── Yes → DFS (with backtracking)
│       └── No → Cycle detection/directed?
│           ├── Yes → DFS
│           └── No → Either works
└── No → Different pattern
```

---

### Key Trade-offs

| Consideration | BFS Wins | DFS Wins |
|-------------|----------|----------|
| Shortest path (unweighted) | ✓ | - |
| Space efficiency (deep graph) | - | ✓ |
| Space efficiency (wide graph) | ✓ | - |
| Implementation simplicity | Equal | Equal |
| Path reconstruction | ✓ | ✓ |
| Topological sort | - | ✓ (simpler) |

<!-- back -->
