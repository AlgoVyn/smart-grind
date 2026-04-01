## Bellman-Ford: Core Concepts

What is the Bellman-Ford algorithm, how does it handle negative edges, and when is it preferred over Dijkstra?

<!-- front -->

---

### Fundamental Definition

Bellman-Ford computes **single-source shortest paths** in a weighted directed graph, even with **negative edge weights**.

**Key properties:**
- Handles negative edges (Dijkstra cannot)
- Detects negative cycles reachable from source
- Time: O(VE) - slower than Dijkstra's O((V+E) log V)

---

### Algorithm Intuition

After `k` iterations, the algorithm has found shortest paths using **at most k edges**:

```
Iteration 1: All paths with 0-1 edges
Iteration 2: All paths with 0-2 edges
...
Iteration V-1: All paths with 0-(V-1) edges (complete)
Iteration V: Detect negative cycles
```

**Why V-1 iterations?** Longest simple path has at most V-1 edges.

---

### Relaxation Operation

Core of shortest path algorithms:

```python
def relax(u, v, weight, dist):
    """
    If path through u is shorter, update distance to v
    """
    if dist[u] + weight < dist[v]:
        dist[v] = dist[u] + weight
        return True  # Distance changed
    return False
```

**Key insight:** If distance changes in V-th iteration, a negative cycle exists.

---

### Negative Cycles

| Scenario | Result |
|----------|--------|
| No negative cycle reachable | Correct shortest paths |
| Negative cycle reachable | No solution (path undefined) |
| Negative cycle not reachable | Correct paths to reachable nodes |

**Detection:** If any edge can be relaxed after V-1 iterations, negative cycle exists.

---

### When to Use

| ✅ Use Bellman-Ford | ❌ Don't Use |
|---------------------|--------------|
| Negative edge weights | All positive weights (use Dijkstra) |
| Need negative cycle detection | Speed critical |
| Distributed implementation | Graph is huge and sparse |
| Small graphs | Better alternatives exist |

**SPFA (Shortest Path Faster Algorithm)** can be faster in practice but same worst case.

<!-- back -->
