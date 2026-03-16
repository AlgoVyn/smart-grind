## Dijkstra's Shortest Path

**Question:** Find shortest path from source to all vertices?

<!-- front -->

---

## Answer: Priority Queue

### Solution
```python
import heapq

def dijkstra(graph, start):
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    pq = [(0, start)]  # (distance, node)
    
    while pq:
        d, u = heapq.heappop(pq)
        
        # Skip if we've found better path
        if d > dist[u]:
            continue
        
        for v, weight in graph[u]:
            new_dist = dist[u] + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                heapq.heappush(pq, (new_dist, v))
    
    return dist
```

### Visual: Algorithm Steps
```
Graph:
  A---1---B
  |     /
  2    3
  |   /
  C--1--D

From A:
Step 1: dist = {A:0, B:∞, C:∞, D:∞}, pq=[(0,A)]
Step 2: Process A → B(1), C(2)
        dist = {A:0, B:1, C:2, D:∞}
        pq = [(1,B), (2,C)]
Step 3: Process B → D(1+3=4)
        dist = {A:0, B:1, C:2, D:4}
        pq = [(2,C), (4,D)]
Step 4: Process C (nothing)
Step 5: Process D (nothing)

Result: {A:0, B:1, C:2, D:4}
```

### ⚠️ Tricky Parts

#### 1. Why Priority Queue?
```python
# Always process node with smallest distance
# This is greedy - locally optimal = globally optimal
# (for non-negative weights)
```

#### 2. Why Check d > dist[u]?
```python
# Multiple entries for same node in pq
# Skip if we've already found shorter path
# This is why we store (dist, node), not just node
```

#### 3. Reconstruct Path
```python
def dijkstraWithPath(graph, start, end):
    dist = {node: float('inf') for node in graph}
    prev = {node: None for node in graph}
    dist[start] = 0
    pq = [(0, start)]
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        if u == end:
            break
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                prev[v] = u
                heapq.heappush(pq, (dist[v], v))
    
    # Reconstruct path
    path = []
    current = end
    while current:
        path.append(current)
        current = prev[current]
    return dist[end], path[::-1]
```

### Negative Weights?
```python
# Dijkstra FAILS with negative weights
# Use Bellman-Ford instead

# Example that breaks Dijkstra:
# A→B: 2, A→C: 2, B→C: -3
# Dijkstra: A→C = 2 (wrong!)
# Correct: A→B→C = -1
```

### Time & Space Complexity

| Implementation | Time | Space |
|----------------|------|-------|
| Binary Heap | O((V+E) log V) | O(V) |
| Fibonacci Heap | O(E + V log V) | O(V) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Negative edges | Use Bellman-Ford |
| Not checking distance | Skip if d > dist[u] |
| No pq check | Check empty pq |

<!-- back -->
