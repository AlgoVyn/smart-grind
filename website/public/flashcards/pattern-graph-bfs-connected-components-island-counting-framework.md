## Graph BFS - Connected Components / Island Counting: Framework

What is the complete code template for BFS connected components?

<!-- front -->

---

### Framework: BFS Connected Components

```
┌─────────────────────────────────────────────────────────────────────┐
│  BFS CONNECTED COMPONENTS - TEMPLATE                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Initialize:                                                       │
│     - visited = set() or boolean array                              │
│     - components = 0                                                │
│                                                                     │
│  2. Iterate all nodes:                                              │
│     - for each node in graph:                                       │
│       - if node not visited:                                        │
│         - components += 1                                             │
│         - bfs(node)  # explores entire component                   │
│                                                                     │
│  3. BFS function:                                                   │
│     - queue = deque([start])                                        │
│     - visited.add(start)                                             │
│     - while queue:                                                   │
│         node = queue.popleft()                                      │
│         for neighbor in graph[node]:                                │
│           if neighbor not visited:                                  │
│             visited.add(neighbor)                                   │
│             queue.append(neighbor)                                  │
│                                                                     │
│  4. Return component count                                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Graph Connected Components

```python
from collections import deque
from typing import Dict, List, Set

def count_connected_components(graph: Dict[int, List[int]]) -> int:
    """
    Count connected components in an undirected graph using BFS.
    Time: O(V + E), Space: O(V)
    """
    if not graph:
        return 0
    
    visited = set()
    components = 0
    
    def bfs(start: int):
        queue = deque([start])
        visited.add(start)
        
        while queue:
            node = queue.popleft()
            for neighbor in graph[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
    
    for node in graph:
        if node not in visited:
            components += 1
            bfs(node)
    
    return components


def find_components(graph: Dict[int, List[int]]) -> List[List[int]]:
    """Find all connected components as lists."""
    if not graph:
        return []
    
    visited = set()
    all_components = []
    
    def bfs(start: int) -> List[int]:
        component = []
        queue = deque([start])
        visited.add(start)
        
        while queue:
            node = queue.popleft()
            component.append(node)
            for neighbor in graph[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        
        return component
    
    for node in graph:
        if node not in visited:
            all_components.append(bfs(node))
    
    return all_components
```

---

### Implementation: Grid Island Counting

```python
from collections import deque
from typing import List

def num_islands(grid: List[List[str]]) -> int:
    """
    Count islands in 2D grid.
    '1' = land, '0' = water
    Time: O(rows × cols), Space: O(min(rows, cols))
    """
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    islands = 0
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    def bfs(r: int, c: int):
        queue = deque([(r, c)])
        grid[r][c] = '0'  # Mark visited in-place
        
        while queue:
            row, col = queue.popleft()
            
            for dr, dc in directions:
                nr, nc = row + dr, col + dc
                if (0 <= nr < rows and 0 <= nc < cols and 
                    grid[nr][nc] == '1'):
                    grid[nr][nc] = '0'  # Mark when enqueuing
                    queue.append((nr, nc))
    
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == '1':
                islands += 1
                bfs(i, j)
    
    return islands


def max_area_of_island(grid: List[List[int]]) -> int:
    """Find maximum area of an island."""
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    max_area = 0
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    def bfs(r: int, c: int) -> int:
        area = 0
        queue = deque([(r, c)])
        grid[r][c] = 0
        
        while queue:
            row, col = queue.popleft()
            area += 1
            
            for dr, dc in directions:
                nr, nc = row + dr, col + dc
                if (0 <= nr < rows and 0 <= nc < cols and 
                    grid[nr][nc] == 1):
                    grid[nr][nc] = 0
                    queue.append((nr, nc))
        
        return area
    
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == 1:
                max_area = max(max_area, bfs(i, j))
    
    return max_area
```

---

### Key Framework Elements

| Element | Purpose | Pattern |
|---------|---------|---------|
| `visited` set/array | Track explored nodes | Prevents reprocessing |
| Outer loop | Iterate all nodes | Handles disconnected graphs |
| `components` counter | Count BFS starts | Each start = new component |
| Queue | BFS traversal | Level-order exploration |
| Mark when enqueuing | Avoid duplicates | Critical for correctness |
| Grid directions | 4-directional movement | Up, down, left, right |

---

### Complexity Summary

| Approach | Time | Space |
|----------|------|-------|
| Graph BFS | O(V + E) | O(V) |
| Grid BFS | O(rows × cols) | O(min(rows, cols)) |

<!-- back -->
