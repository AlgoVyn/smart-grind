## Number of Islands

**Question:** How do you count the number of islands in a 2D grid?

<!-- front -->

---

## Answer: DFS or BFS

### Solution (DFS)
```python
def numIslands(grid):
    if not grid:
        return 0
    
    count = 0
    rows, cols = len(grid), len(grid[0])
    
    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols:
            return
        if grid[r][c] != '1':
            return
        
        grid[r][c] = '2'  # Mark visited
        
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    
    return count
```

### Visual
```
Grid:                 Islands:
1 1 0 0 0            1 1 . . .
1 1 0 0 0            1 1 . . .
0 0 1 0 0            . . 1 . .
0 0 0 1 1            . . . 1 1

Result: 3 islands
```

### Complexity
- **Time:** O(rows × cols)
- **Space:** O(rows × cols) for recursion stack

### Key Steps
1. Iterate through grid
2. When land ('1') found → increment count
3. DFS to mark entire island as visited ('2')

### Variations
- BFS: Use queue instead of recursion
- Union-Find: Connect all lands, count unique components

<!-- back -->
