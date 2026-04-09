## Graph BFS - Connected Components / Island Counting: Tactics

What are the advanced techniques for BFS connected components?

<!-- front -->

---

### Tactic 1: Multi-Source BFS

Start BFS from multiple sources simultaneously for shortest distance to any source.

```python
from collections import deque

def multi_source_bfs(grid, sources):
    """
    BFS from multiple starting points.
    Useful for: rotting oranges, nearest gate, etc.
    """
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    visited = set()
    
    # Enqueue all sources at once
    for r, c in sources:
        queue.append((r, c, 0))  # (row, col, distance)
        visited.add((r, c))
    
    while queue:
        r, c, dist = queue.popleft()
        
        # Process cell (r, c) at distance dist
        
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols and 
                (nr, nc) not in visited and grid[nr][nc] != '#'):
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))
```

---

### Tactic 2: Surrounded Regions (Border-First BFS)

Capture regions surrounded by 'X' by marking border-connected 'O's first.

```python
def solve(board):
    """
    Capture surrounded regions - flip O to X.
    Strategy: Mark border-connected O's as safe first.
    """
    if not board:
        return
    m, n = len(board), len(board[0])
    
    def bfs(r, c):
        queue = deque([(r, c)])
        board[r][c] = 'T'  # Temporary mark
        
        while queue:
            row, col = queue.popleft()
            for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nr, nc = row + dr, col + dc
                if (0 <= nr < m and 0 <= nc < n and 
                    board[nr][nc] == 'O'):
                    board[nr][nc] = 'T'
                    queue.append((nr, nc))
    
    # Start from borders
    for i in range(m):
        if board[i][0] == 'O': bfs(i, 0)
        if board[i][n-1] == 'O': bfs(i, n-1)
    for j in range(n):
        if board[0][j] == 'O': bfs(0, j)
        if board[m-1][j] == 'O': bfs(m-1, j)
    
    # Flip: O→X (surrounded), T→O (safe)
    for i in range(m):
        for j in range(n):
            if board[i][j] == 'O':
                board[i][j] = 'X'
            elif board[i][j] == 'T':
                board[i][j] = 'O'
```

---

### Tactic 3: Island Perimeter

Count perimeter edges (water-adjacent or boundary edges).

```python
def island_perimeter(grid):
    """
    Count perimeter of island.
    Each land cell contributes 4, subtract 2 for each internal edge.
    """
    rows, cols = len(grid), len(grid[0])
    perimeter = 0
    
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == 1:
                perimeter += 4
                # Check right and down neighbors only (avoid double counting)
                if j + 1 < cols and grid[i][j + 1] == 1:
                    perimeter -= 2
                if i + 1 < rows and grid[i + 1][j] == 1:
                    perimeter -= 2
    
    return perimeter


def island_perimeter_bfs(grid):
    """Alternative BFS approach."""
    rows, cols = len(grid), len(grid[0])
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    # Find first land cell
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == 1:
                perimeter = 0
                queue = deque([(i, j)])
                grid[i][j] = -1  # Mark visited
                
                while queue:
                    r, c = queue.popleft()
                    
                    for dr, dc in directions:
                        nr, nc = r + dr, c + dc
                        # Water or out of bounds = perimeter edge
                        if nr < 0 or nr >= rows or nc < 0 or nc >= cols:
                            perimeter += 1
                        elif grid[nr][nc] == 0:
                            perimeter += 1
                        elif grid[nr][nc] == 1:
                            grid[nr][nc] = -1
                            queue.append((nr, nc))
                
                return perimeter
    
    return 0
```

---

### Tactic 4: Track Component Details

Track size, nodes, or other properties during BFS.

```python
def analyze_components(grid):
    """Return detailed info about each component."""
    rows, cols = len(grid), len(grid[0])
    components = []
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == 1:
                # BFS to explore this island
                size = 0
                cells = []
                queue = deque([(i, j)])
                grid[i][j] = 0
                
                while queue:
                    r, c = queue.popleft()
                    size += 1
                    cells.append((r, c))
                    
                    for dr, dc in directions:
                        nr, nc = r + dr, c + dc
                        if (0 <= nr < rows and 0 <= nc < cols and 
                            grid[nr][nc] == 1):
                            grid[nr][nc] = 0
                            queue.append((nr, nc))
                
                components.append({
                    'size': size,
                    'cells': cells,
                    'top_left': min(cells),
                    'bottom_right': max(cells)
                })
    
    return components
```

---

### Tactic 5: Common Pitfalls & Fixes

| Pitfall | Issue | Solution |
|---------|-------|----------|
| Mark visited on dequeue | Same node enqueued multiple times | Mark on enqueue |
| Missing disconnected nodes | Only process from node 0 | Loop through ALL nodes |
| Wrong grid bounds check | Index out of range | Check `0 <= nr < rows` |
| Using DFS on large grid | Stack overflow | Switch to BFS |
| Modifying grid incorrectly | Wrong island count | Mark when enqueuing, not after |
| 8-directional vs 4-directional | Wrong connectivity | Check problem statement |

---

### Tactic 6: Diagonal Connections

Handle 8-directional connectivity when specified.

```python
def num_islands_diagonal(grid):
    """Count islands with 8-directional connectivity."""
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    islands = 0
    
    # 8 directions: 4 cardinal + 4 diagonal
    directions = [
        (-1, 0), (1, 0), (0, -1), (0, 1),    # Cardinal
        (-1, -1), (-1, 1), (1, -1), (1, 1)   # Diagonal
    ]
    
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

<!-- back -->
