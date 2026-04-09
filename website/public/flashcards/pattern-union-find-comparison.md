## Graph - Union-Find (DSU): Comparison

When should you use Union-Find versus other approaches?

<!-- front -->

---

### Union-Find vs DFS/BFS for Connectivity

| Aspect | Union-Find | DFS/BFS |
|--------|------------|---------|
| **Incremental edges** | O(α(n)) per add | Recompute O(V+E) |
| **Static graph** | O(E × α(V)) | O(V+E) once |
| **Query connectivity** | O(α(n)) | O(1) with precompute |
| **Space** | O(V) | O(V) |
| **Dynamic** | ✓ Excellent | ✗ Poor |

**Winner**: Union-Find for dynamic, DFS/BFS for static one-time

---

### When to Use Each Approach

**Union-Find**:
- Dynamic connectivity (edges added over time)
- Kruskal's MST algorithm
- Cycle detection in undirected graphs
- Equation satisfiability
- Online connectivity queries

**DFS/BFS**:
- Static graph analysis
- Path finding
- Topological sort
- Connected components (one-time)

**Adjacency Matrix/List**:
- Full graph representation needed
- Weighted edges
- Complex graph algorithms

---

### Union by Rank vs Union by Size

| Aspect | Union by Rank | Union by Size |
|--------|---------------|---------------|
| **Balance metric** | Tree height | Number of nodes |
| **Update on union** | May increment rank | Always add sizes |
| **Result** | Similar performance | Similar performance |
| **Preference** | Classic choice | More intuitive |

Both achieve O(α(n)) time complexity.

---

### Decision Tree

```
Graph connectivity problem?
├── Edges added dynamically over time?
│   ├── Yes → UNION-FIND
│   └── No → One-time analysis?
│       ├── Yes → DFS/BFS
│       └── No → Kruskal's MST?
│           └── Yes → UNION-FIND
├── Need MST?
│   ├── Dense graph → Prim's
│   └── Sparse graph → UNION-FIND (Kruskal's)
└── Cycle detection?
    ├── Undirected → UNION-FIND
    └── Directed → DFS with state tracking
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Dynamic connectivity | Union-Find | O(α(n)) per operation |
| Kruskal's MST | Union-Find | Natural fit |
| One-time components | DFS/BFS | Simpler, O(V+E) |
| Directed cycle detection | DFS | Union-Find doesn't work |
| Online queries | Union-Find | Fast connectivity checks |

<!-- back -->
