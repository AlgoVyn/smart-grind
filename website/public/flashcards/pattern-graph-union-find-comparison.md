## Graph - Union Find (DSU): Comparison

When should you use Union-Find versus other graph algorithms?

<!-- front -->

---

### Union-Find vs BFS/DFS for Connectivity

| Aspect | Union-Find | BFS/DFS |
|--------|-----------|---------|
| **Connectivity check** | O(α(n)) | O(V + E) |
| **Build time** | O(n) | - |
| **Incremental** | Perfect for dynamic | Need to recompute |
| **Space** | O(n) | O(V + E) |
| **Static graph** | Good | Good |
| **Dynamic graph** | Excellent | Poor |

**Winner**: Union-Find for dynamic connectivity, BFS/DFS for one-time analysis

---

### When to Use Union-Find

**Use when:**
- Dynamic connectivity (adding edges over time)
- Cycle detection in undirected graphs
- Kruskal's MST algorithm
- Connected components in evolving graph
- Offline query processing
- Percolation problems

**Don't use when:**
- Directed graphs (SCC needs different approach)
- Shortest path needed
- Graph structure traversal needed
- Weight constraints specific to edges

---

### Comparison with Other Graph Algorithms

| Algorithm | Time | Space | Best For |
|-----------|------|-------|----------|
| **Union-Find** | O(α(n)) per op | O(n) | Dynamic connectivity |
| **BFS/DFS** | O(V + E) | O(V) | One-time traversal |
| **Dijkstra** | O((V + E) log V) | O(V) | Shortest path |
| **Kruskal + UF** | O(E log E) | O(V) | MST |
| **Tarjan SCC** | O(V + E) | O(V) | Strong components |

---

### Decision Tree

```
Graph connectivity problem?
├── Yes → Dynamic (edges added over time)?
│   ├── Yes → UNDIRECTED?
│   │   ├── Yes → UNION-FIND
│   │   └── No → Use other algorithms
│   └── No → One-time analysis?
│       ├── Yes → BFS/DFS works too
│       └── No → UNION-FIND (for future queries)
└── No → Different problem
```

---

### Key Trade-offs

| Consideration | Union-Find Wins | BFS/DFS Wins |
|-------------|-----------------|--------------|
| Repeated connectivity queries | ✓ | - |
| Dynamic edge addition | ✓ | - |
| One-time full traversal | - | ✓ |
| Path reconstruction | - | ✓ |
| Memory for sparse graphs | - | ✓ |
| Implementation simplicity | ✓ | ✓ |

<!-- back -->
