## Graph DFS - Connected Components / Island Counting: Tactics

What are the advanced techniques and variations for connected components/island counting?

<!-- front -->

---

### Tactic 1: In-Place Grid Modification (Space Optimization)

Instead of using a separate visited array, modify the grid directly to mark visited cells.

```python
def num_islands_inplace(grid):
    """O(1) extra space - modifies input grid."""
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    
    def dfs(r, c):
        if (r < 0 or r >= rows or c < 0 or c >= cols or 
            grid[r][c] != '1'):  # Already visited or water
            return
        
        grid[r][c] = '0'  # Sink the island
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    islands = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                islands += 1
    
    return islands
```

**Trade-off**: Saves O(m × n) space but modifies input. Clone grid if needed.

---

### Tactic 2: 8-Directional Connectivity (Diagonal Islands)

For problems where diagonal cells count as connected:

```python
def num_islands_8_directional(grid):
    """Count islands with diagonal connections."""
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    
    # 8 directions: horizontal, vertical, diagonal
    directions = [
        (-1, -1), (-1, 0), (-1, 1),
        ( 0, -1),          ( 0, 1),
        ( 1, -1), ( 1, 0), ( 1, 1)
    ]
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
            return
        grid[r][c] = '0'
        for dr, dc in directions:
            dfs(r + dr, c + dc)
    
    islands = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                islands += 1
    
    return islands
```

---

### Tactic 3: Surrounded Regions (Capture/Fill)

Flip surrounded regions by first marking border-connected regions:

```python
def solve(board):
    """
    Capture surrounded regions: flip 'O' to 'X'.
    Border-connected 'O's remain 'O'.
    """
    if not board or not board[0]:
        return
    
    m, n = len(board), len(board[0])
    
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or board[r][c] != 'O':
            return
        board[r][c] = 'T'  # Temporarily mark
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    # Mark border-connected regions
    for i in range(m):
        dfs(i, 0)
        dfs(i, n - 1)
    for j in range(n):
        dfs(0, j)
        dfs(m - 1, j)
    
    # Flip: O→X (surrounded), T→O (border-connected)
    for i in range(m):
        for j in range(n):
            if board[i][j] == 'O':
                board[i][j] = 'X'
            elif board[i][j] == 'T':
                board[i][j] = 'O'
```

---

### Tactic 4: Find Largest Island (Max Area)

Track area during DFS to find the largest component:

```python
def max_area_of_island(grid):
    """Find the maximum area of an island."""
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    max_area = 0
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
            return 0
        
        grid[r][c] = '0'  # Mark visited
        area = 1  # Current cell
        
        # Add areas from all 4 directions
        area += dfs(r + 1, c)
        area += dfs(r - 1, c)
        area += dfs(r, c + 1)
        area += dfs(r, c - 1)
        
        return area
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                max_area = max(max_area, dfs(r, c))
    
    return max_area
```

---

### Tactic 5: Common Pitfalls & Fixes

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Not marking visited** | Infinite recursion, TLE | Mark BEFORE recursing |
| **Forgetting disconnected nodes** | Miss components | Iterate through ALL nodes/cells |
| **Bounds checking order** | Index error | Check bounds BEFORE grid access |
| **Diagonal vs 4-directional** | Wrong island count | Read problem carefully |
| **Modifying input unexpectedly** | Side effects | Clone grid or use visited set |
| **Stack overflow** | Deep recursion on large grids | Use BFS or iterative DFS |

---

### Tactic 6: Iterative DFS (Stack-Based)

Avoid recursion limit for very large grids:

```python
def num_islands_iterative(grid):
    """Iterative DFS using explicit stack."""
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    islands = 0
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                stack = [(r, c)]
                grid[r][c] = '0'
                
                while stack:
                    cr, cc = stack.pop()
                    for nr, nc in [(cr+1,cc), (cr-1,cc), (cr,cc+1), (cr,cc-1)]:
                        if (0 <= nr < rows and 0 <= nc < cols and 
                            grid[nr][nc] == '1'):
                            grid[nr][nc] = '0'
                            stack.append((nr, nc))
    
    return islands
```

<!-- back -->
