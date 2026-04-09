## Graph - Shortest Path (Bellman-Ford / BFS with K stops): Tactics

What are the advanced techniques and variations for Bellman-Ford and K-constrained shortest paths?

<!-- front -->

---

### Tactic 1: Path Reconstruction with Parent Tracking

Track parent pointers during relaxation to reconstruct the actual shortest path.

```python
def bellman_ford_with_path(n, edges, source, target):
    """Returns shortest path and distance."""
    dist = [float('inf')] * n
    parent = [-1] * n
    dist[source] = 0
    
    # Relax V-1 times
    for _ in range(n - 1):
        for u, v, weight in edges:
            if dist[u] != float('inf') and dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                parent[v] = u  # Track path
    
    # Check for negative cycle
    for u, v, weight in edges:
        if dist[u] != float('inf') and dist[u] + weight < dist[v]:
            return None  # Negative cycle
    
    # Reconstruct path
    if dist[target] == float('inf'):
        return None
    
    path = []
    curr = target
    while curr != -1:
        path.append(curr)
        curr = parent[curr]
    return path[::-1], dist[target]
```

---

### Tactic 2: Finding All Nodes in Negative Cycles

Run an extra iteration to identify which nodes are affected by negative cycles.

```python
def find_negative_cycle_nodes(n, edges):
    """Returns set of nodes in or reachable from negative cycles."""
    dist = [0] * n  # Start with 0 for all to detect any cycle
    
    # Relax V-1 times
    for _ in range(n - 1):
        for u, v, weight in edges:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
    
    # One more iteration to find nodes that update
    negative_nodes = set()
    old_dist = dist[:]
    
    for u, v, weight in edges:
        if dist[u] + weight < dist[v]:
            dist[v] = dist[u] + weight
            negative_nodes.add(v)
    
    # Propagate: nodes reachable from negative cycles
    changed = True
    while changed:
        changed = False
        for u, v, weight in edges:
            if u in negative_nodes and v not in negative_nodes:
                negative_nodes.add(v)
                changed = True
    
    return negative_nodes
```

---

### Tactic 3: Optimized BFS with K Stops (Level-by-Level)

Process BFS level by level to naturally enforce the K constraint.

```python
def find_cheapest_price_level_bfs(n, flights, src, dst, k):
    """Optimized level-by-level BFS for K stops."""
    from collections import defaultdict, deque
    
    graph = defaultdict(list)
    for u, v, price in flights:
        graph[u].append((v, price))
    
    # dist[node] = minimum cost to reach node
    dist = [float('inf')] * n
    dist[src] = 0
    
    # BFS level by level (each level = one more stop)
    queue = deque([src])
    stops = 0
    
    while queue and stops <= k:
        level_size = len(queue)
        new_dist = dist[:]  # Copy for this level
        
        for _ in range(level_size):
            node = queue.popleft()
            
            for neighbor, price in graph[node]:
                new_cost = dist[node] + price
                if new_cost < new_dist[neighbor]:
                    new_dist[neighbor] = new_cost
                    queue.append(neighbor)
        
        dist = new_dist
        stops += 1
    
    return dist[dst] if dist[dst] != float('inf') else -1
```

---

### Tactic 4: Bellman-Ford with Multiple Queries (Floyd-Warshall Alternative)

For all-pairs shortest paths on small dense graphs, use Floyd-Warshall instead.

```python
def floyd_warshall(n, edges):
    """All-pairs shortest path: O(V³), good for small dense graphs."""
    # Initialize
    dist = [[float('inf')] * n for _ in range(n)]
    
    for i in range(n):
        dist[i][i] = 0
    
    for u, v, w in edges:
        dist[u][v] = min(dist[u][v], w)
    
    # Floyd-Warshall
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    
    return dist
```

---

### Tactic 5: Common Pitfalls & Fixes

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Not checking INF before relax** | Incorrect updates from unreachable nodes | Check `dist[u] != INF` first |
| **V-2 instead of V-1 iterations** | Shortest paths not found | Use exactly V-1 iterations |
| **Skipping negative cycle check** | Wrong results with negative cycles | Always run the V-th iteration check |
| **Confusing stops with edges** | Off-by-one in K constraint | Stops = edges - 1 |
| **Using Dijkstra with negatives** | Wrong shortest paths | Switch to Bellman-Ford |
| **Infinite loop in negative cycle** | Algorithm never terminates | Detect and return None/handle specially |

---

### Tactic 6: SPFA (Shortest Path Faster Algorithm) Optimization

Queue-based optimization of Bellman-Ford for average case O(E).

```python
from collections import deque

def spfa(n, edges, source):
    """
    SPFA: Optimized Bellman-Ford using queue.
    Average O(E), worst case O(V * E)
    """
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
    
    dist = [float('inf')] * n
    dist[source] = 0
    
    queue = deque([source])
    in_queue = [False] * n
    in_queue[source] = True
    count = [0] * n  # Track relaxation count for cycle detection
    
    while queue:
        u = queue.popleft()
        in_queue[u] = False
        
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                count[v] += 1
                
                # Negative cycle detection
                if count[v] >= n:
                    return None  # Negative cycle
                
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
    
    return dist
```

<!-- back -->