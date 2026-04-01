## Graph BFS: Frameworks

What are the standard BFS implementations and patterns?

<!-- front -->

---

### Standard BFS Framework

```python
from collections import deque

def bfs(graph, start):
    """
    Standard BFS traversal
    graph: adjacency list (dict or list)
    """
    visited = set([start])
    queue = deque([start])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result
```

---

### Shortest Path BFS Framework

```python
def bfs_shortest_path(graph, start, end):
    """
    Find shortest path length and the path itself
    """
    if start == end:
        return 0, [start]
    
    visited = {start}
    queue = deque([(start, [start])])
    
    while queue:
        node, path = queue.popleft()
        
        for neighbor in graph[node]:
            if neighbor == end:
                return len(path), path + [neighbor]
            
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    
    return -1, []  # No path
```

---

### Multi-Source BFS Framework

```python
def multi_source_bfs(graph, sources):
    """
    BFS from multiple starting points simultaneously
    Useful for: nearest distance queries, 0-1 BFS base
    """
    visited = set(sources)
    queue = deque()
    distance = {}
    
    for s in sources:
        queue.append((s, 0))
        distance[s] = 0
    
    while queue:
        node, dist = queue.popleft()
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                distance[neighbor] = dist + 1
                queue.append((neighbor, dist + 1))
    
    return distance
```

---

### 0-1 BFS (Weighted 0/1 Edges)

```python
from collections import deque

def bfs_01(graph, start):
    """
    BFS for graphs with edge weights 0 or 1
    Uses deque, push to front for weight 0, back for weight 1
    """
    n = len(graph)
    dist = [float('inf')] * n
    dist[start] = 0
    dq = deque([start])
    
    while dq:
        node = dq.popleft()
        
        for neighbor, weight in graph[node]:  # weight is 0 or 1
            new_dist = dist[node] + weight
            
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                
                if weight == 0:
                    dq.appendleft(neighbor)  # Priority
                else:
                    dq.append(neighbor)
    
    return dist
```

---

### BFS for Grid/2D

```python
def bfs_grid(grid, start_row, start_col):
    """
    BFS on 2D grid
    """
    rows, cols = len(grid), len(grid[0])
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    
    visited = [[False] * cols for _ in range(rows)]
    queue = deque([(start_row, start_col, 0)])  # row, col, distance
    visited[start_row][start_col] = True
    
    while queue:
        r, c, dist = queue.popleft()
        
        # Process cell (r, c)
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            
            if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc]:
                if grid[nr][nc] != '#':  # Not blocked
                    visited[nr][nc] = True
                    queue.append((nr, nc, dist + 1))
    
    return visited
```

<!-- back -->
