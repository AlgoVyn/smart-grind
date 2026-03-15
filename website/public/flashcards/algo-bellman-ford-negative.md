## Bellman-Ford - Negative Cycle Detection

**Question:** How does Bellman-Ford detect negative cycles?

<!-- front -->

---

## Bellman-Ford Negative Cycle

### Algorithm
```python
def bellman_ford(n, edges, src):
    dist = [float("inf")] * n
    dist[src] = 0
    
    # Relax all edges V-1 times
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != float("inf") and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    
    # Check for negative cycles
    for u, v, w in edges:
        if dist[u] != float("inf") and dist[u] + w < dist[v]:
            # Negative cycle detected!
            return None  # Or implement negative cycle detection
    
    return dist
```

### Why V-1 Iterations?
- Longest path without cycle has at most V-1 edges
- After V-1 relaxations, all shortest paths are found
- Any further improvement indicates a **negative cycle**

### Visual
```
Iteration 1: Find paths with ≤1 edge
Iteration 2: Find paths with ≤2 edges
...
Iteration V-1: Find paths with ≤V-1 edges
```

### Time Complexity: O(V × E)

### 💡 Use Case
- Graphs with negative weights
- Detecting negative cycles
- Distance vector routing protocols

<!-- back -->
