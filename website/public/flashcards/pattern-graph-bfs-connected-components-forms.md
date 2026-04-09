## Graph BFS - Connected Components: Forms

What are the different variations of BFS connected components?

<!-- front -->

---

### Form 1: Island Count (4-direction)

```python
def num_islands(grid):
    """Standard 4-direction island count."""
    if not grid: return 0
    m, n = len(grid), len(grid[0])
    
    def bfs(r, c):
        queue = deque([(r, c)])
        grid[r][c] = '0'
        while queue:
            row, col = queue.popleft()
            for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
                nr, nc = row + dr, col + dc
                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == '1':
                    grid[nr][nc] = '0'
                    queue.append((nr, nc))
    
    count = 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1':
                count += 1
                bfs(i, j)
    return count
```

---

### Form 2: Graph Components

```python
def count_components(n, edges):
    """Count connected components in graph."""
    from collections import defaultdict, deque
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    visited = set()
    count = 0
    
    for i in range(n):
        if i not in visited:
            count += 1
            queue = deque([i])
            visited.add(i)
            while queue:
                node = queue.popleft()
                for neighbor in graph[node]:
                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)
    return count
```

---

### Form 3: 8-Direction Island

```python
def num_islands_8(grid):
    """8-connectivity island count."""
    directions = [(-1,-1), (-1,0), (-1,1),
                  (0,-1),          (0,1),
                  (1,-1),  (1,0),  (1,1)]
    # Rest same as 4-direction
```

---

### Form Comparison

| Form | Connectivity | Input Type | Use Case |
|------|--------------|------------|----------|
| 4-direction | Orthogonal | Grid | Standard |
| 8-direction | All directions | Grid | Diagonal allowed |
| Graph | Edges | Adjacency list | General graphs |

<!-- back -->
