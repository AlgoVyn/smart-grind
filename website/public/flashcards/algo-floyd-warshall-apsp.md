## Floyd-Warshall Algorithm (All-Pairs Shortest Path)

**Question:** What are the key characteristics of the Floyd-Warshall algorithm for finding shortest paths between all pairs of vertices?

<!-- front -->

---

## Answer: Dynamic Programming Approach

### Algorithm Overview
Floyd-Warshall finds shortest paths between **all pairs** of vertices in O(V³) time.

### Key Concept
Uses dynamic programming to consider all possible intermediate vertices:

```python
for k in range(V):           # Consider each vertex as intermediate
    for i in range(V):       # Source
        for j in range(V):   # Destination
            dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
```

### Time & Space Complexity
- **Time:** O(V³)
- **Space:** O(V²)

### When to Use
- Dense graphs where we need all-pairs shortest paths
- Negative edge weights allowed (unlike Dijkstra)
- Detecting negative cycles: If `dist[i][i] < 0` after algorithm

### ⚠️ Limitation
Does NOT work with **negative cycles** reachable from source.

<!-- back -->
