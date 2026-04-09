## Graph BFS - Connected Components / Island Counting: Forms

What are the different variations of BFS connected components?

<!-- front -->

---

### Form 1: Basic Island Counting

Count distinct islands in binary grid.

```python
from collections import deque

def num_islands(grid):
    """Standard island counting - '1'=land, '0'=water."""
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    islands = 0
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    def bfs(r, c):
        queue = deque([(r, c)])
        grid[r][c] = '0'
        
        while queue:
            row, col = queue.popleft()
            for dr, dc in directions:
                nr, nc = row + dr, col + dc
                if (0 <= nr < rows and 0 <= nc < cols and 
                    grid[nr][nc] == '1'):
                    grid[nr][nc] = '0'
                    queue.append((nr, nc))
    
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == '1':
                islands += 1
                bfs(i, j)
    
    return islands
```

---

### Form 2: Max Area of Island

Find the largest island by cell count.

```python
def max_area_of_island(grid):
    """Find maximum area (cell count) of any island."""
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    max_area = 0
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    def bfs(r, c):
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

### Form 3: Flood Fill

Replace all connected cells of one color with another.

```python
def flood_fill(image, sr, sc, new_color):
    """Replace all connected pixels of old_color with new_color."""
    rows, cols = len(image), len(image[0])
    old_color = image[sr][sc]
    
    if old_color == new_color:
        return image
    
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    queue = deque([(sr, sc)])
    image[sr][sc] = new_color
    
    while queue:
        r, c = queue.popleft()
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols and 
                image[nr][nc] == old_color):
                image[nr][nc] = new_color
                queue.append((nr, nc))
    
    return image
```

---

### Form 4: Graph Connected Components

Count components in an undirected graph.

```python
def count_components(n, edges):
    """
    Count connected components in graph with n nodes.
    """
    from collections import deque
    
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    visited = [False] * n
    components = 0
    
    def bfs(start):
        queue = deque([start])
        visited[start] = True
        
        while queue:
            node = queue.popleft()
            for neighbor in graph[node]:
                if not visited[neighbor]:
                    visited[neighbor] = True
                    queue.append(neighbor)
    
    for i in range(n):
        if not visited[i]:
            components += 1
            bfs(i)
    
    return components
```

---

### Form 5: Multi-Source BFS (Rotting Oranges)

BFS from multiple sources simultaneously.

```python
def oranges_rotting(grid):
    """
    Find minimum time for all oranges to rot.
    Fresh = 1, Rotten = 2, Empty = 0
    """
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0
    
    # Initialize: enqueue all rotten oranges
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == 2:
                queue.append((i, j, 0))  # (row, col, time)
            elif grid[i][j] == 1:
                fresh += 1
    
    minutes = 0
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while queue:
        r, c, time = queue.popleft()
        minutes = max(minutes, time)
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols and 
                grid[nr][nc] == 1):
                grid[nr][nc] = 2  # Rot the fresh orange
                fresh -= 1
                queue.append((nr, nc, time + 1))
    
    return minutes if fresh == 0 else -1
```

---

### Form 6: Surrounded Regions

Identify and flip regions not connected to border.

```python
def solve_surrounded_regions(board):
    """
    Flip all 'O' not connected to border to 'X'.
    Strategy: Mark border-connected 'O's as safe, flip rest.
    """
    if not board or not board[0]:
        return
    
    rows, cols = len(board), len(board[0])
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    def bfs(r, c):
        queue = deque([(r, c)])
        board[r][c] = 'T'  # Temporary safe marker
        
        while queue:
            row, col = queue.popleft()
            for dr, dc in directions:
                nr, nc = row + dr, col + dc
                if (0 <= nr < rows and 0 <= nc < cols and 
                    board[nr][nc] == 'O'):
                    board[nr][nc] = 'T'
                    queue.append((nr, nc))
    
    # Mark border-connected regions
    for i in range(rows):
        if board[i][0] == 'O': bfs(i, 0)
        if board[i][cols-1] == 'O': bfs(i, cols-1)
    for j in range(cols):
        if board[0][j] == 'O': bfs(0, j)
        if board[rows-1][j] == 'O': bfs(rows-1, j)
    
    # Flip: O→X (surrounded), T→O (safe)
    for i in range(rows):
        for j in range(cols):
            if board[i][j] == 'O':
                board[i][j] = 'X'
            elif board[i][j] == 'T':
                board[i][j] = 'O'
```

---

### Form Comparison

| Form | Input | Output | Key Pattern |
|------|-------|--------|-------------|
| Island count | Binary grid | Integer count | Basic BFS |
| Max area | Binary grid | Max size | Track area during BFS |
| Flood fill | Grid + start + color | Modified grid | Color replacement |
| Graph components | Nodes + edges | Component count | Adjacency list |
| Rotting oranges | Multi-value grid | Min time | Multi-source BFS |
| Surrounded regions | Grid with X/O | Modified grid | Border-first BFS |

---

### Form 7: Island Perimeter

Count edges of island adjacent to water or boundary.

```python
def island_perimeter(grid):
    """Calculate perimeter of island in grid."""
    rows, cols = len(grid), len(grid[0])
    perimeter = 0
    
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == 1:
                perimeter += 4
                # Subtract shared edges (check right and down only)
                if j + 1 < cols and grid[i][j + 1] == 1:
                    perimeter -= 2
                if i + 1 < rows and grid[i + 1][j] == 1:
                    perimeter -= 2
    
    return perimeter
```

<!-- back -->
