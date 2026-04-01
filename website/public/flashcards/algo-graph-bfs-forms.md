## Graph BFS: Forms & Variations

What are the different forms and specialized BFS implementations?

<!-- front -->

---

### Standard Level-Order Form

```python
def bfs_level_order(graph, start):
    """
    Returns nodes grouped by level (distance from start)
    """
    visited = {start}
    queue = deque([start])
    levels = []
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node)
            
            for neighbor in graph[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        
        levels.append(current_level)
    
    return levels

# Result: [[start], [neighbors], [neighbors_of_neighbors], ...]
```

---

### Bidirectional BFS Form

```python
def bidirectional_bfs(graph, start, end):
    """
    BFS from both start and end simultaneously
    Much faster for large graphs when path exists
    """
    if start == end:
        return 0
    
    # Two frontiers
    visited_start = {start: 0}
    visited_end = {end: 0}
    queue_start = deque([start])
    queue_end = deque([end])
    
    while queue_start and queue_end:
        # Expand smaller frontier
        if len(queue_start) > len(queue_end):
            queue_start, queue_end = queue_end, queue_start
            visited_start, visited_end = visited_end, visited_start
        
        for _ in range(len(queue_start)):
            node = queue_start.popleft()
            dist = visited_start[node]
            
            for neighbor in graph[node]:
                if neighbor in visited_end:
                    # Found meeting point
                    return dist + 1 + visited_end[neighbor]
                
                if neighbor not in visited_start:
                    visited_start[neighbor] = dist + 1
                    queue_start.append(neighbor)
    
    return -1  # No path
```

---

### Weighted BFS (Dijkstra Light)

```python
import heapq

def weighted_bfs(graph, start):
    """
    For small integer weights, can use bucket BFS
    For general weights, use Dijkstra
    """
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    pq = [(0, start)]
    
    while pq:
        d, node = heapq.heappop(pq)
        
        if d > dist[node]:
            continue
        
        for neighbor, weight in graph[node]:
            new_dist = d + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))
    
    return dist
```

---

### BFS with State Space

```python
def bfs_with_state(initial_state):
    """
    BFS where state includes more than just position
    Example: position + keys collected + direction facing
    """
    from collections import deque
    
    visited = set([initial_state])
    queue = deque([(initial_state, 0)])
    
    while queue:
        state, steps = queue.popleft()
        
        if is_goal(state):
            return steps
        
        for next_state in get_transitions(state):
            if next_state not in visited:
                visited.add(next_state)
                queue.append((next_state, steps + 1))
    
    return -1
```

---

### Parallel BFS (Multiple Queries)

```python
def bfs_from_all_nodes(graph):
    """
    Precompute all-pairs shortest paths using BFS from each node
    For unweighted graphs only
    """
    n = len(graph)
    all_distances = []
    
    for start in range(n):
        dist = [-1] * n
        dist[start] = 0
        queue = deque([start])
        
        while queue:
            node = queue.popleft()
            
            for neighbor in graph[node]:
                if dist[neighbor] == -1:
                    dist[neighbor] = dist[node] + 1
                    queue.append(neighbor)
        
        all_distances.append(dist)
    
    return all_distances
```

<!-- back -->
