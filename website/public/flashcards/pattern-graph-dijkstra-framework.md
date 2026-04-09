## Graph - Shortest Path Dijkstra: Framework

What is the complete code template for Dijkstra's algorithm?

<!-- front -->

---

### Framework 1: Dijkstra with Priority Queue

```
┌─────────────────────────────────────────────────────┐
│  DIJKSTRA'S ALGORITHM - TEMPLATE                     │
├─────────────────────────────────────────────────────┤
│  1. Initialize distances: dist[node] = ∞ for all     │
│     dist[start] = 0                                  │
│  2. Initialize priority queue: [(0, start)]         │
│  3. Initialize visited set (optional optimization)   │
│  4. While PQ not empty:                              │
│     a. (d, node) = heappop(PQ)                       │
│     b. If node visited: continue (skip outdated)    │
│     c. Mark node visited                             │
│     d. For each (neighbor, weight) of node:        │
│        - new_dist = d + weight                       │
│        - If new_dist < dist[neighbor]:             │
│           * dist[neighbor] = new_dist                │
│           * heappush(PQ, (new_dist, neighbor))     │
│  5. Return dist array                                 │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
import heapq

def dijkstra(graph, start):
    """
    graph: dict[node] = list of (neighbor, weight)
    Returns: dict of shortest distances from start
    """
    # Initialize distances
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    
    # Priority queue: (distance, node)
    pq = [(0, start)]
    visited = set()
    
    while pq:
        d, node = heapq.heappop(pq)
        
        # Skip if already processed
        if node in visited:
            continue
        visited.add(node)
        
        # Process neighbors
        for neighbor, weight in graph[node]:
            new_dist = d + weight
            
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))
    
    return dist
```

---

### Framework 2: Dijkstra with Path Reconstruction

```python
def dijkstra_with_path(graph, start, end):
    """Find shortest path and distance."""
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    parent = {start: None}
    
    pq = [(0, start)]
    visited = set()
    
    while pq:
        d, node = heapq.heappop(pq)
        
        if node in visited:
            continue
        visited.add(node)
        
        if node == end:
            break
        
        for neighbor, weight in graph[node]:
            new_dist = d + weight
            
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                parent[neighbor] = node
                heapq.heappush(pq, (new_dist, neighbor))
    
    # Reconstruct path
    if end not in parent:
        return None, float('inf')
    
    path = []
    current = end
    while current is not None:
        path.append(current)
        current = parent[current]
    
    return path[::-1], dist[end]
```

---

### Key Pattern Elements

| Element | Purpose | Optimization |
|---------|---------|--------------|
| Priority queue | Get minimum distance node | Heap for O(log V) |
| Distance array | Track best known distances | Hash map for sparse |
| Visited set | Avoid reprocessing | Skip outdated entries |
| Relaxation | Update when better path found | Key Dijkstra step |

<!-- back -->
