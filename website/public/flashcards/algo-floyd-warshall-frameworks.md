## Floyd-Warshall: Frameworks

What are the standard implementations for Floyd-Warshall?

<!-- front -->

---

### Basic Framework

```python
def floyd_warshall(n, edges):
    """
    n: number of vertices
    edges: list of (u, v, weight)
    Returns: distance matrix
    """
    # Initialize
    INF = float('inf')
    dist = [[INF] * n for _ in range(n)]
    
    # Distance to self is 0
    for i in range(n):
        dist[i][i] = 0
    
    # Direct edges
    for u, v, w in edges:
        dist[u][v] = min(dist[u][v], w)  # Handle multi-edges
    
    # Main algorithm
    for k in range(n):          # Intermediate node
        for i in range(n):      # Source
            for j in range(n):  # Destination
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    
    return dist
```

**Critical order:** k, i, j (k must be outer loop).

---

### Negative Cycle Detection

```python
def floyd_warshall_with_cycle_check(n, edges):
    """
    Returns (dist, has_negative_cycle)
    """
    INF = float('inf')
    dist = [[INF] * n for _ in range(n)]
    
    for i in range(n):
        dist[i][i] = 0
    
    for u, v, w in edges:
        dist[u][v] = w
    
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] < INF and dist[k][j] < INF:
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    
    # Check for negative cycles
    has_negative_cycle = False
    for i in range(n):
        if dist[i][i] < 0:
            has_negative_cycle = True
            break
    
    return dist, has_negative_cycle
```

**Key:** Negative cycle exists iff some `dist[i][i] < 0`.

---

### Path Reconstruction Framework

```python
def floyd_warshall_paths(n, edges):
    """
    Track actual paths, not just distances
    """
    INF = float('inf')
    dist = [[INF] * n for _ in range(n)]
    nxt = [[None] * n for _ in range(n)]  # Next node in path
    
    for i in range(n):
        dist[i][i] = 0
    
    for u, v, w in edges:
        dist[u][v] = w
        nxt[u][v] = v
    
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
                    nxt[i][j] = nxt[i][k]
    
    # Reconstruct path
    def get_path(u, v):
        if nxt[u][v] is None:
            return []
        path = [u]
        while u != v:
            u = nxt[u][v]
            path.append(u)
        return path
    
    return dist, get_path
```

---

### Transitive Closure (Reachability)

```python
def transitive_closure(n, edges):
    """
    Boolean matrix: can we reach j from i?
    """
    # Initialize
    reachable = [[False] * n for _ in range(n)]
    
    for i in range(n):
        reachable[i][i] = True
    
    for u, v in edges:
        reachable[u][v] = True
    
    # Floyd-Warshall style
    for k in range(n):
        for i in range(n):
            for j in range(n):
                reachable[i][j] = reachable[i][j] or (reachable[i][k] and reachable[k][j])
    
    return reachable
```

---

### Successor Graph (Functional Graph) Framework

```python
def successor_paths(n, succ):
    """
    succ[i] = next node from i (functional graph)
    Find k-step successors efficiently
    """
    # Binary lifting preprocessing
    LOG = 20
    up = [[0] * n for _ in range(LOG)]
    
    for i in range(n):
        up[0][i] = succ[i]
    
    for k in range(1, LOG):
        for i in range(n):
            up[k][i] = up[k-1][up[k-1][i]]
    
    def jump(node, steps):
        """Go forward 'steps' from node"""
        for k in range(LOG):
            if steps & (1 << k):
                node = up[k][node]
        return node
    
    return jump
```

<!-- back -->
