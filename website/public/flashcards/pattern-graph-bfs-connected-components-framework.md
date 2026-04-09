## Graph BFS - Connected Components: Framework

What is the complete code template for BFS connected components?

<!-- front -->

---

### Framework 1: BFS Island Counting

```
┌─────────────────────────────────────────────────────┐
│  BFS CONNECTED COMPONENTS - TEMPLATE                   │
├─────────────────────────────────────────────────────┤
│  1. Initialize visited set or modify grid in-place   │
│     count = 0                                          │
│                                                        │
│  2. For each cell in grid:                            │
│     If cell is land (1) and not visited:             │
│        count += 1                                      │
│        BFS from this cell to mark all connected       │
│                                                        │
│  3. BFS(cell):                                        │
│     Queue = [cell]                                     │
│     Mark cell as visited                             │
│     While queue:                                      │
│        curr = dequeue()                               │
│        For each neighbor (4 directions):            │
│           If neighbor is land and not visited:       │
│              Mark as visited                         │
│              Enqueue neighbor                        │
│                                                        │
│  4. Return count                                       │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Island Count

```python
def num_islands(grid):
    """
    Count islands in 2D grid.
    LeetCode 200
    Time: O(m×n), Space: O(min(m,n))
    """
    if not grid or not grid[0]:
        return 0
    
    m, n = len(grid), len(grid[0])
    count = 0
    
    def bfs(r, c):
        queue = deque([(r, c)])
        grid[r][c] = '0'  # Mark as visited
        
        while queue:
            row, col = queue.popleft()
            for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
                nr, nc = row + dr, col + dc
                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == '1':
                    grid[nr][nc] = '0'
                    queue.append((nr, nc))
    
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1':
                count += 1
                bfs(i, j)
    
    return count
```

---

### Implementation: Graph Connected Components

```python
def count_components(n, edges):
    """Count connected components in undirected graph."""
    from collections import defaultdict, deque
    
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    visited = set()
    count = 0
    
    def bfs(start):
        queue = deque([start])
        visited.add(start)
        
        while queue:
            node = queue.popleft()
            for neighbor in graph[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
    
    for i in range(n):
        if i not in visited:
            count += 1
            bfs(i)
    
    return count
```

---

### Key Pattern Elements

| Element | Grid | Graph |
|---------|------|-------|
| Visited | Modify grid | Set/array |
| Neighbors | 4 directions | Adjacency list |
| BFS/DFS | Both work | Both work |

<!-- back -->
