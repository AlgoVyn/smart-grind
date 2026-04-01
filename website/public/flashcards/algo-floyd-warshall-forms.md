## Floyd-Warshall: Forms & Variations

What are the different forms and specialized Floyd-Warshall implementations?

<!-- front -->

---

### Standard Weighted Form

```python
def floyd_warshall_standard(n, edges):
    """
    Standard all-pairs shortest path
    Weights can be negative
    """
    dist = [[float('inf')] * n for _ in range(n)]
    
    for i in range(n):
        dist[i][i] = 0
    
    for u, v, w in edges:
        dist[u][v] = min(dist[u][v], w)
    
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    
    return dist
```

**Returns:** Minimum distance between all pairs.

---

### Minimax Path Form (Widest Path)

```python
def floyd_warshall_widest(n, edges):
    """
    Find path with maximum minimum edge weight
    (bottleneck / widest path)
    """
    # Initialize with edge weights (0 if no edge)
    width = [[0] * n for _ in range(n)]
    
    for i in range(n):
        width[i][i] = float('inf')
    
    for u, v, w in edges:
        width[u][v] = max(width[u][v], w)
    
    for k in range(n):
        for i in range(n):
            for j in range(n):
                # New bottleneck = min of path to k and k to j
                bottleneck = min(width[i][k], width[k][j])
                if bottleneck > width[i][j]:
                    width[i][j] = bottleneck
    
    return width

# Application: Network reliability
# width[i][j] = maximum capacity path from i to j
```

---

### Shortest Path Count Form

```python
def floyd_warshall_count_paths(n, edges):
    """
    Count number of shortest paths between each pair
    """
    INF = float('inf')
    dist = [[INF] * n for _ in range(n)]
    count = [[0] * n for _ in range(n)]
    
    for i in range(n):
        dist[i][i] = 0
        count[i][i] = 1
    
    for u, v, w in edges:
        dist[u][v] = w
        count[u][v] = 1
    
    for k in range(n):
        for i in range(n):
            for j in range(n):
                new_dist = dist[i][k] + dist[k][j]
                if new_dist < dist[i][j]:
                    dist[i][j] = new_dist
                    count[i][j] = count[i][k] * count[k][j]
                elif new_dist == dist[i][j]:
                    count[i][j] += count[i][k] * count[k][j]
    
    return dist, count
```

---

### Successor Matrix for Longest Path in DAG

```python
def dag_longest_path_floyd(n, dag_edges):
    """
    For DAG only: find longest paths
    Topological sort + DP is better, but Floyd works for small n
    """
    dist = [[float('-inf')] * n for _ in range(n)]
    
    for i in range(n):
        dist[i][i] = 0
    
    for u, v, w in dag_edges:
        dist[u][v] = max(dist[u][v], w)
    
    # Note: Only works for DAG, otherwise infinite loops
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] > dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    
    return dist
```

**Warning:** For graphs with cycles, this finds longest simple path (NP-hard), not what we want.

---

### Bitset Optimization for Reachability

```python
def floyd_warshall_bitset(n, edges):
    """
    Optimized transitive closure using bitsets
    Much faster in practice for reachability
    """
    reach = [0] * n  # Each is a bitset
    
    for i in range(n):
        reach[i] = 1 << i  # Can reach self
    
    for u, v in edges:
        reach[u] |= 1 << v
    
    for k in range(n):
        for i in range(n):
            if reach[i] & (1 << k):  # If i can reach k
                reach[i] |= reach[k]  # Then i can reach everything k can
    
    # reach[i] is bitset of nodes reachable from i
    return reach
```

<!-- back -->
