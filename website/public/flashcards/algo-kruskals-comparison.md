## Title: Kruskal's Comparison

How does Kruskal's compare to other MST algorithms?

<!-- front -->

---

### MST Algorithm Comparison
| Algorithm | Time | Space | Best For |
|-----------|------|-------|----------|
| Kruskal | O(E log E) | O(V + E) | Sparse graphs |
| Prim (binary heap) | O(E log V) | O(V) | Dense graphs |
| Prim (Fibonacci) | O(E + V log V) | O(V) | Very dense |
| Borůvka | O(E log V) | O(V) | Parallel/distributed |
| Reverse-Delete | O(E log V) | O(V + E) | Special cases |

### Trade-offs
| Factor | Kruskal | Prim |
|--------|---------|------|
| Data structure | DSU + edge list | Priority queue + adj list |
| Graph representation | Edge list natural | Adjacency list natural |
| Sparse E = O(V) | O(V log V) | O(V log V) |
| Dense E = O(V²) | O(V² log V) | O(V²) |
| Partial MST | Easy (stop early) | Harder |
| Directed MST | No | Chu-Liu/Edmonds |

---

### When to Choose
```
Given edge list?       → Kruskal
Given adj matrix?      → Prim
Sparse graph?          → Kruskal or Prim
Very dense?            → Prim with array
Parallel processing?   → Borůvka
Dynamic updates?     → Specialized
```

<!-- back -->
