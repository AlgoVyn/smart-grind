## Number of Islands (DFS)

**Question:** Count islands in 2D grid using DFS?

<!-- front -->

---

## Answer: DFS Flood Fill

### Solution
```python
def numIslands(grid):
    if not grid:
        return 0
    
    count = 0
    rows, cols = len(grid), len(grid[0])
    
    def dfs(r, c):
        # Bounds check
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if grid[r][c] == '0':
            return
        
        # Mark as visited
        grid[r][c] = '0'
        
        # Visit all 4 directions
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

### Visual: Island Counting
```
Grid:
1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1

Island 1: (0,0), (0,1), (1,0), (1,1)
Island 2: (2,2)
Island 3: (3,3), (3,4)

Count = 3
```

### ⚠️ Tricky Parts

#### 1. Mark as Visited
```python
# Set grid[r][c] = '0' after visiting
# Prevents counting same island twice

# In-place modification saves space
```

#### 2. Four Directions
```python
# Up, Down, Left, Right
# Don't include diagonals

# All connected land cells are one island
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| DFS | O(m × n) | O(m × n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not marking visited | Set to '0' in dfs |
| Missing bounds check | Check before visiting |
| Counting wrong | Increment on first '1' only |

<!-- back -->
