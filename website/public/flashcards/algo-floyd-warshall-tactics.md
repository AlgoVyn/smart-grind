## Floyd-Warshall: Tactics & Applications

What tactical patterns leverage Floyd-Warshall for problem solving?

<!-- front -->

---

### Tactic 1: Finding Graph Center/Radius

```python
def graph_center_radius(n, edges):
    """
    Find center (min max distance) and radius
    """
    dist = floyd_warshall(n, edges)
    
    # Eccentricity of each node
    eccentricity = []
    for i in range(n):
        max_dist = max(dist[i][j] for j in range(n) if dist[i][j] < float('inf'))
        eccentricity.append(max_dist)
    
    # Radius = minimum eccentricity
    radius = min(eccentricity)
    
    # Center = nodes with eccentricity = radius
    center = [i for i in range(n) if eccentricity[i] == radius]
    
    # Diameter = maximum eccentricity
    diameter = max(eccentricity)
    
    return {
        'center': center,
        'radius': radius,
        'diameter': diameter
    }
```

---

### Tactic 2: Shortest Path with Node Rewards

```python
def shortest_path_with_rewards(n, edges, reward):
    """
    Find path from s to t maximizing: -distance + sum of rewards at visited nodes
    """
    # Transform: new_weight = old_weight - reward at destination
    new_edges = []
    for u, v, w in edges:
        new_edges.append((u, v, w - reward[v]))
    
    dist = floyd_warshall(n, new_edges)
    
    # Add reward for starting node
    best = {}
    for s in range(n):
        for t in range(n):
            total = -dist[s][t] + reward[s]
            best[(s, t)] = total
    
    return best
```

---

### Tactic 3: Minimum Cycle Detection

```python
def find_minimum_cycle(n, edges):
    """
    Find shortest cycle in graph (through any node)
    """
    INF = float('inf')
    dist = [[INF] * n for _ in range(n)]
    
    for i in range(n):
        dist[i][i] = 0
    
    # Keep copy of direct edges for cycle check
    direct = [[INF] * n for _ in range(n)]
    for u, v, w in edges:
        dist[u][v] = min(dist[u][v], w)
        direct[u][v] = min(direct[u][v], w)
    
    min_cycle = INF
    
    for k in range(n):
        # Check cycles going through k using paths < k
        for i in range(k):
            for j in range(i + 1, k):
                if direct[i][k] < INF and direct[k][j] < INF:
                    cycle = dist[i][j] + direct[j][k] + direct[k][i]
                    min_cycle = min(min_cycle, cycle)
        
        # Standard Floyd update
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    
    return min_cycle if min_cycle < INF else -1
```

---

### Tactic 4: All-Pairs with Exactly k Edges

```python
def floyd_warshall_k_edges(n, edges, k_max):
    """
    dist[e][i][j] = shortest path from i to j using exactly e edges
    """
    INF = float('inf')
    # dist[edges][from][to]
    dist = [[[INF] * n for _ in range(n)] for _ in range(k_max + 1)]
    
    for i in range(n):
        dist[0][i][i] = 0
    
    for u, v, w in edges:
        dist[1][u][v] = min(dist[1][u][v], w)
    
    for e in range(2, k_max + 1):
        for i in range(n):
            for j in range(n):
                for k in range(n):
                    if dist[e-1][i][k] + dist[1][k][j] < dist[e][i][j]:
                        dist[e][i][j] = dist[e-1][i][k] + dist[1][k][j]
    
    return dist
```

---

### Tactic 5: Dominant Vertices in Tournaments

```python
def tournament_kings(n, edges):
    """
    In tournament (complete directed graph), find "kings"
    King: can reach every other vertex in at most 2 steps
    """
    # Build adjacency
    dist = [[float('inf')] * n for _ in range(n)]
    
    for i in range(n):
        dist[i][i] = 0
    
    for u, v in edges:  # u beats v
        dist[u][v] = 1
        dist[v][u] = float('inf')  # No edge back
    
    # Run Floyd-Warshall but only need 2 steps
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    
    # Kings: all distances <= 2
    kings = [i for i in range(n) if all(dist[i][j] <= 2 for j in range(n))]
    
    return kings
```

<!-- back -->
