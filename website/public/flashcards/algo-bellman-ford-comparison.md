## Bellman-Ford: Comparison Guide

How does Bellman-Ford compare to other shortest path algorithms?

<!-- front -->

---

### Single-Source Shortest Path Comparison

| Algorithm | Negative Edges | Time | Space | Use Case |
|-----------|----------------|------|-------|----------|
| **BFS** | No (unweighted) | O(V+E) | O(V) | Unweighted graphs |
| **Dijkstra** | No | O((V+E) log V) | O(V) | Standard, positive weights |
| **Dial's (0..C)** | No | O(V + E + C) | O(V+C) | Small integer weights |
| **Bellman-Ford** | Yes | O(VE) | O(V) | Negative edges |
| **SPFA** | Yes | O(VE) worst | O(V) | Negative edges, often faster |
| **Topological** | Yes | O(V+E) | O(V) | DAG only |

**Recommendation flow:**
```
Is graph a DAG? → Use topological sort
Has negative edges? → Use Bellman-Ford/SPFA
All weights small integers? → Use Dial's
Otherwise → Use Dijkstra with binary heap
```

---

### All-Pairs Shortest Path

| Algorithm | Negative Edges | Time | Space | Graph Type |
|-----------|----------------|------|-------|------------|
| **Johnson's** | Yes | O(VE + V² log V) | O(V²) | Sparse |
| **Floyd-Warshall** | Yes | O(V³) | O(V²) | Dense |
| **V × Dijkstra** | No | O(V(V+E) log V) | O(V²) | Sparse, positive |
| **V × Bellman-Ford** | Yes | O(V²E) | O(V²) | Never use |

**Rule of thumb:** Johnson's for sparse (E << V²), Floyd-Warshall for dense.

---

### Negative Cycle Detection

| Method | Time | Detects | Use When |
|--------|------|---------|----------|
| **Bellman-Ford full** | O(VE) | Reachable from source | Need distances too |
| **Bellman-Ford quick** | O(VE) | Any in graph | Just detection |
| **Floyd-Warshall** | O(V³) | Any in graph | Need all-pairs anyway |
| **Karp's min mean cycle** | O(VE) | Minimum mean weight | Optimization |

---

### When Bellman-Ford is Essential

| Scenario | Why Bellman-Ford |
|----------|------------------|
| Currency arbitrage | Negative log cycles |
| Constraint satisfaction | Difference constraints |
| Residual networks | Max flow has negative edges |
| Johnson's reweighting | Compute potentials |
| Game theory | Shortest path with negative cycles = draws |

---

### Complexity Trade-offs

```
V=1000, E=5000 (sparse):
  Dijkstra:     ~50,000 operations
  Bellman-Ford: ~5,000,000 operations (100x slower)

V=100, E=5000 (dense):
  Dijkstra:     ~50,000 operations
  Bellman-Ford: ~500,000 operations (10x slower)
  Floyd-Warshall: ~1,000,000 operations

With negative edges: Only Bellman-Ford works correctly
```

<!-- back -->
