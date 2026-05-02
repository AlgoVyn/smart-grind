# Component Coloring

## Category
Graphs

## Description

Component Coloring assigns different colors/IDs to connected components in a graph. This is useful for identifying disconnected subgraphs, analyzing graph structure, and solving problems like counting islands in a grid.

---

## Concepts

### 1. Connected Components

A connected component is a subgraph where any two vertices are connected by paths.

### 2. Coloring Process

- Start from unvisited node
- BFS/DFS to mark all reachable nodes with same color
- Increment color for next component

### 3. Grid Connectivity

| Type | Directions |
|------|------------|
| 4-directional | Up, Down, Left, Right |
| 8-directional | All 8 neighbors |

---

## Frameworks

### Framework 1: Component Counting

```
┌─────────────────────────────────────────────────────────────┐
│  COMPONENT COUNTING                                          │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize visited array                                 │
│  2. count = 0                                                │
│  3. For each unvisited node:                                 │
│     a) count += 1                                            │
│     b) BFS/DFS to mark all reachable nodes                  │
│  4. Return count                                             │
└─────────────────────────────────────────────────────────────┘
```

### Framework 2: Component Coloring

```
┌─────────────────────────────────────────────────────────────┐
│  COMPONENT COLORING                                          │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize color array with -1                          │
│  2. current_color = 0                                        │
│  3. For each uncolored node:                                 │
│     a) BFS/DFS with current_color                            │
│     b) current_color += 1                                    │
│  4. Return color array and total components                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Component Count

Count number of connected components.

| Aspect | Details |
|--------|---------|
| **Output** | Integer count |
| **Time** | O(V + E) |
| **Space** | O(V) |

### Form 2: Component Coloring

Assign unique ID to each component.

| Aspect | Details |
|--------|---------|
| **Output** | Color array |
| **Use** | Component identification |

### Form 3: Island Counting

Grid-based component counting.

| Aspect | Details |
|--------|---------|
| **Input** | 2D grid |
| **Connectivity** | 4 or 8 directional |
| **Time** | O(rows × cols) |

---

## Tactics

### Tactic 1: Component Counting

```python
from collections import deque

def count_components(graph, n):
    visited = [False] * n
    count = 0
    
    for i in range(n):
        if not visited[i]:
            count += 1
            queue = deque([i])
            visited[i] = True
            
            while queue:
                node = queue.popleft()
                for neighbor in graph[node]:
                    if not visited[neighbor]:
                        visited[neighbor] = True
                        queue.append(neighbor)
    
    return count
```

### Tactic 2: Number of Islands

```python
def num_islands(grid):
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    visited = [[False] * cols for _ in range(rows)]
    count = 0
    
    def bfs(r, c):
        queue = deque([(r, c)])
        visited[r][c] = True
        directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
        
        while queue:
            cr, cc = queue.popleft()
            for dr, dc in directions:
                nr, nc = cr + dr, cc + dc
                if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc] and grid[nr][nc] == '1':
                    visited[nr][nc] = True
                    queue.append((nr, nc))
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1' and not visited[r][c]:
                count += 1
                bfs(r, c)
    
    return count
```

---

## Python Templates

### Template 1: Component Count

```python
from collections import deque

def count_components(graph, n):
    """Count connected components in graph."""
    visited = [False] * n
    count = 0
    
    for i in range(n):
        if not visited[i]:
            count += 1
            queue = deque([i])
            visited[i] = True
            
            while queue:
                node = queue.popleft()
                for neighbor in graph[node]:
                    if not visited[neighbor]:
                        visited[neighbor] = True
                        queue.append(neighbor)
    
    return count
```

### Template 2: Component Coloring

```python
def color_components(graph, n):
    """Assign colors to each component."""
    color = [-1] * n
    current = 0
    
    for i in range(n):
        if color[i] == -1:
            queue = deque([i])
            color[i] = current
            
            while queue:
                node = queue.popleft()
                for neighbor in graph[node]:
                    if color[neighbor] == -1:
                        color[neighbor] = current
                        queue.append(neighbor)
            
            current += 1
    
    return color, current
```

### Template 3: Number of Islands

```python
def num_islands(grid):
    """Count islands in 2D grid."""
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    visited = [[False] * cols for _ in range(rows)]
    count = 0
    
    def bfs(r, c):
        queue = deque([(r, c)])
        visited[r][c] = True
        directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
        
        while queue:
            cr, cc = queue.popleft()
            for dr, dc in directions:
                nr, nc = cr + dr, cc + dc
                if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc] and grid[nr][nc] == '1':
                    visited[nr][nc] = True
                    queue.append((nr, nc))
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1' and not visited[r][c]:
                count += 1
                bfs(r, c)
    
    return count
```

---

## Practice Problems

### Problem 1: Number of Islands
**Problem:** [LeetCode 200](https://leetcode.com/problems/number-of-islands/)

### Problem 2: Number of Provinces
**Problem:** [LeetCode 547](https://leetcode.com/problems/number-of-provinces/)

### Problem 3: Max Area of Island
**Problem:** [LeetCode 695](https://leetcode.com/problems/max-area-of-island/)

---

## Summary

Component coloring:
- BFS/DFS to label connected components
- O(V + E) time complexity
- Applications in image processing and network analysis
- Grid problems use 4 or 8-directional connectivity
