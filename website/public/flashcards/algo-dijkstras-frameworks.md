## Dijkstra's Algorithm: Algorithm Framework

What are the complete implementations for Dijkstra's algorithm?

<!-- front -->

---

### Standard Implementation (Binary Heap)

```python
import heapq

def dijkstra(graph, source):
    """
    graph: dict[node] = list of (neighbor, weight)
    Returns: dict of shortest distances from source
    """
    dist = {node: float('inf') for node in graph}
    dist[source] = 0
    
    # Priority queue: (distance, node)
    pq = [(0, source)]
    
    while pq:
        d, u = heapq.heappop(pq)
        
        # Skip if we've found better path already
        if d > dist[u]:
            continue
        
        # Relax edges
        for v, weight in graph[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                heapq.heappush(pq, (dist[v], v))
    
    return dist
```

---

### With Path Reconstruction

```python
def dijkstra_with_path(graph, source, target):
    """
    Returns (distance, path) or (inf, []) if unreachable
    """
    dist = {node: float('inf') for node in graph}
    parent = {node: None for node in graph}
    dist[source] = 0
    
    pq = [(0, source)]
    
    while pq:
        d, u = heapq.heappop(pq)
        
        if d > dist[u]:
            continue
        
        if u == target:
            break  # Can early exit
        
        for v, weight in graph[u]:
            new_dist = dist[u] + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                parent[v] = u
                heapq.heappush(pq, (new_dist, v))
    
    # Reconstruct path
    if dist[target] == float('inf'):
        return float('inf'), []
    
    path = []
    cur = target
    while cur is not None:
        path.append(cur)
        cur = parent[cur]
    
    return dist[target], path[::-1]
```

---

### Array Implementation (Dense Graphs)

```python
def dijkstra_array(adj_matrix, source):
    """
    For dense graphs: O(V²) may beat O((V+E) log V)
    """
    n = len(adj_matrix)
    dist = [float('inf')] * n
    visited = [False] * n
    dist[source] = 0
    
    for _ in range(n):
        # Find minimum unvisited node
        u = -1
        for i in range(n):
            if not visited[i] and (u == -1 or dist[i] < dist[u]):
                u = i
        
        if dist[u] == float('inf'):
            break
        
        visited[u] = True
        
        # Update neighbors
        for v in range(n):
            if adj_matrix[u][v] > 0 and not visited[v]:
                new_dist = dist[u] + adj_matrix[u][v]
                if new_dist < dist[v]:
                    dist[v] = new_dist
    
    return dist
```

---

### Multi-Source Dijkstra

```python
def multi_source_dijkstra(graph, sources):
    """
    Find nearest source for each node
    """
    dist = {node: float('inf') for node in graph}
    nearest_source = {node: None for node in graph}
    
    pq = []
    for s in sources:
        dist[s] = 0
        nearest_source[s] = s
        heapq.heappush(pq, (0, s))
    
    while pq:
        d, u = heapq.heappop(pq)
        
        if d > dist[u]:
            continue
        
        for v, weight in graph[u]:
            new_dist = dist[u] + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                nearest_source[v] = nearest_source[u]
                heapq.heappush(pq, (new_dist, v))
    
    return dist, nearest_source
```

---

### 0-1 BFS (Edge weights 0 or 1)

```python
from collections import deque

def bfs_01(graph, source):
    """
    O(V + E) for graphs with 0/1 weights
    Use deque: appendleft for 0-weight, append for 1-weight
    """
    dist = {node: float('inf') for node in graph}
    dist[source] = 0
    
    dq = deque([source])
    
    while dq:
        u = dq.popleft()
        
        for v, weight in graph[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                if weight == 0:
                    dq.appendleft(v)
                else:
                    dq.append(v)
    
    return dist
```

<!-- back -->
