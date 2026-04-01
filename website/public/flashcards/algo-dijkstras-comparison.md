## Dijkstra's Algorithm: Comparison Guide

How does Dijkstra's algorithm compare to other shortest path algorithms?

<!-- front -->

---

### Single-Source Shortest Path

| Algorithm | Negative Edges | Time | Space | Use Case |
|-----------|----------------|------|-------|----------|
| **BFS** | No (unweighted) | O(V+E) | O(V) | Unweighted graphs |
| **Dijkstra (heap)** | No | O((V+E) log V) | O(V) | General weighted |
| **Dijkstra (array)** | No | O(V²) | O(V) | Dense graphs |
| **Dial's** | No | O(V+E+C) | O(V+C) | Small integer weights |
| **Bellman-Ford** | Yes | O(VE) | O(V) | Negative edges |
| **SPFA** | Yes | O(VE) worst | O(V) | Often faster than B-F |
| **Topological** | Yes | O(V+E) | O(V) | DAG only |

**Decision:**
```
Unweighted? → BFS
Negative edges? → Bellman-Ford
DAG? → Topological sort
Otherwise → Dijkstra
```

---

### All-Pairs Shortest Path

| Algorithm | Negative Edges | Time | Space | Graph Type |
|-----------|----------------|------|-------|------------|
| **Johnson's** | Yes | O(VE + V² log V) | O(V²) | Sparse |
| **Floyd-Warshall** | Yes | O(V³) | O(V²) | Dense |
| **V × Dijkstra** | No | O(V(V+E) log V) | O(V²) | Sparse, positive |
| **V × Bellman-Ford** | Yes | O(V²E) | O(V²) | Never use |

**Rule:** Johnson's for sparse, Floyd-Warshall for dense.

---

### Dijkstra vs A*

| Aspect | Dijkstra | A* |
|--------|----------|-----|
| **Goal** | All nodes from source | Single target |
| **Heuristic** | None (h=0) | Required |
| **Nodes visited** | All reachable | Often fewer |
| **Optimality** | Always optimal | Optimal if heuristic admissible |
| **Speed** | O((V+E) log V) | Can be much faster with good h |

**When to use A*:** Single target, good heuristic available.

---

### 0-1 BFS vs Dijkstra

| Feature | 0-1 BFS | Dijkstra |
|---------|---------|----------|
| **Edge weights** | 0 or 1 only | Any non-negative |
| **Data structure** | Deque | Priority queue |
| **Time** | O(V + E) | O((V+E) log V) |
| **Implementation** | Simpler | Standard |

**Use 0-1 BFS when:** All weights are 0 or 1 (or small integers with Dial's).

---

### Common Pitfalls

| Pitfall | Issue | Solution |
|---------|-------|----------|
| **Negative edges** | Wrong answer | Use Bellman-Ford |
| **Integer overflow** | Large sums | Use larger type or check |
| **Unreachable nodes** | Infinity in result | Filter or handle explicitly |
| **Equal distances** | Tie-breaking | Any valid path is correct |
| **Multiple edges** | Picking wrong one | Use min weight edge |

<!-- back -->
