## Graph - Shortest Path Dijkstra: Framework

What is the complete code template for Dijkstra's algorithm?

<!-- front -->

---

### Framework 1: Standard Dijkstra with Priority Queue

```
┌─────────────────────────────────────────────────────────────┐
│  DIJKSTRA'S ALGORITHM - TEMPLATE                              │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize distances: dist[node] = ∞ for all nodes      │
│     dist[source] = 0                                          │
│  2. Build adjacency list from edges                           │
│  3. Initialize priority queue: [(0, source)]                 │
│  4. While PQ not empty:                                      │
│     a. (d, node) = heappop(PQ)                               │
│     b. If d > dist[node]: continue (skip outdated entry)    │
│     c. For each (neighbor, weight) of node:                │
│        - new_dist = d + weight                              │
│        - If new_dist < dist[neighbor]:                      │
│           * dist[neighbor] = new_dist                        │
│           * heappush(PQ, (new_dist, neighbor))             │
│  5. Return dist array (contains shortest distances)          │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation

```python
import heapq

def dijkstra(n, edges, source):
    """
    n: number of nodes
    edges: list of [u, v, w] for edge u→v with weight w
    Returns: list of shortest distances from source
    """
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
    
    # Initialize distances
    dist = [float('inf')] * n
    dist[source] = 0
    
    # Priority queue: (distance, node)
    pq = [(0, source)]
    
    while pq:
        d, node = heapq.heappop(pq)
        
        # Skip outdated entries
        if d > dist[node]:
            continue
        
        # Relaxation: update neighbors
        for neighbor, weight in graph[node]:
            new_dist = d + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappappush(pq, (new_dist, neighbor))
    
    return dist
```

---

### Framework 2: Dijkstra with Path Reconstruction

```python
def dijkstra_with_path(n, edges, source, target):
    """Returns (path, distance) from source to target."""
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
    
    dist = [float('inf')] * n
    parent = [-1] * n
    dist[source] = 0
    
    pq = [(0, source)]
    
    while pq:
        d, node = heapq.heappop(pq)
        
        if d > dist[node]:
            continue
        
        if node == target:  # Early exit
            break
        
        for neighbor, weight in graph[node]:
            new_dist = d + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                parent[neighbor] = node
                heapq.heappush(pq, (new_dist, neighbor))
    
    # Reconstruct path
    if dist[target] == float('inf'):
        return None, -1
    
    path = []
    curr = target
    while curr != -1:
        path.append(curr)
        curr = parent[curr]
    
    return path[::-1], dist[target]
```

---

### Key Pattern Elements

| Element | Purpose | Critical Detail |
|---------|---------|---------------|
| Priority queue | Get minimum distance node | Min-heap for O(log V) operations |
| Distance array | Track best known distances | Initialize to infinity |
| Relaxation | Update when better path found | Core Dijkstra operation |
| Skip outdated | Avoid processing stale entries | Check `d > dist[node]` |
| Non-negative weights | Required for correctness | Use Bellman-Ford for negative weights |

<!-- back -->
