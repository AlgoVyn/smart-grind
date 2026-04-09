## Graph BFS - Connected Components: Tactics

What are the advanced techniques for BFS connected components?

<!-- front -->

---

### Tactic 1: 8-Direction Island Count

```python
def num_islands_8(grid):
    """Count islands with 8-connectivity."""
    if not grid: return 0
    m, n = len(grid), len(grid[0])
    
    directions = [(-1,-1), (-1,0), (-1,1),
                  (0,-1),          (0,1),
                  (1,-1),  (1,0),  (1,1)]
    
    def bfs(r, c):
        queue = deque([(r, c)])
        grid[r][c] = '0'
        while queue:
            row, col = queue.popleft()
            for dr, dc in directions:
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

### Tactic 2: Largest Island

```python
def max_area_of_island(grid):
    """Find largest island by area."""
    m, n = len(grid), len(grid[0])
    max_area = 0
    
    def bfs(r, c):
        area = 0
        queue = deque([(r, c)])
        grid[r][c] = 0
        
        while queue:
            row, col = queue.popleft()
            area += 1
            for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
                nr, nc = row + dr, col + dc
                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                    grid[nr][nc] = 0
                    queue.append((nr, nc))
        return area
    
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                max_area = max(max_area, bfs(i, j))
    return max_area
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Not marking visited | Infinite loop | Mark when enqueue |
| Wrong bounds | Index error | Check 0 <= nr < m |
| Diagonal confusion | Wrong connectivity | Clarify 4 vs 8 |
| Not handling all starts | Miss islands | Iterate all cells |

<!-- back -->
