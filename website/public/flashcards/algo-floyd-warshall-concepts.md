## Floyd-Warshall: Core Concepts

What is the Floyd-Warshall algorithm and when should it be used?

<!-- front -->

---

### Fundamental Definition

Floyd-Warshall finds **all-pairs shortest paths** in a weighted graph with any edge weights (including negative, but no negative cycles).

| Aspect | Value |
|--------|-------|
| **Time** | O(V³) |
| **Space** | O(V²) |
| **Handles negative edges** | ✓ Yes |
| **Handles negative cycles** | Detects but paths undefined |

**Key insight:** Dynamic programming - progressively improve paths by allowing intermediate nodes.

---

### DP State Definition

```
dist[k][i][j] = shortest path from i to j using only 
                intermediate nodes {1, 2, ..., k}

Recurrence:
dist[k][i][j] = min(dist[k-1][i][j], 
                    dist[k-1][i][k] + dist[k-1][k][j])

Space optimization: dist[i][j] updated in-place
```

**Interpretation:** At step k, we consider whether going through node k helps.

---

### When to Use Floyd-Warshall

| Scenario | Use Floyd-Warshall | Use Dijkstra | Use Bellman-Ford |
|----------|-------------------|--------------|------------------|
| **All pairs needed** | ✓ O(V³) | V × O((V+E)log V) | V × O(VE) |
| **Single source** | ✗ Overkill | ✓ Best | Negative edges |
| **Negative edges** | ✓ | ✗ | ✓ |
| **Negative cycles** | ✓ Detect | ✗ | ✓ Detect |
| **Dense graph** | ✓ | Works | Works |
| **Sparse graph (V ≈ E)** | ✗ O(V³) wasteful | ✓ | ✓ |

---

### Algorithm Invariants

After iteration k:
- `dist[i][j]` contains shortest path using only nodes {1..k} as intermediates
- This includes paths with 0, 1, or multiple intermediate nodes

**Critical:** Outer loop MUST be over k (intermediate nodes).

<!-- back -->
