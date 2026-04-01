## Title: Matrix Path DP Framework

What is the standard framework for 2D grid DP problems?

<!-- front -->

---

### Framework Structure
```
MATRIX_PATH_DP(grid):
  m = rows(grid), n = cols(grid)
  
  // 1. Initialize DP table
  dp = new int[m][n]
  dp[0][0] = base_case(grid[0][0])
  
  // 2. Initialize boundaries
  for i = 1 to m-1:
    dp[i][0] = combine(dp[i-1][0], grid[i][0])
  
  for j = 1 to n-1:
    dp[0][j] = combine(dp[0][j-1], grid[0][j])
  
  // 3. Fill DP table
  for i = 1 to m-1:
    for j = 1 to n-1:
      dp[i][j] = combine(grid[i][j], 
                         dp[i-1][j],   // from above
                         dp[i][j-1])   // from left
  
  // 4. Return result
  return dp[m-1][n-1]
```

---

### Direction Variations
| Problem | Directions | Traversal |
|---------|-----------|-----------|
| Standard | Right, Down | Top-left to bottom-right |
| Dungeon Game | Right, Down + health | Reverse (bottom-right to top-left) |
| Longest Increasing Path | 4 directions | Memoization DFS |
| Cherry Pickup | Down → Back up | Two simultaneous paths |

### Space Optimization
```python
def space_optimized_template(grid):
    n = len(grid[0])
    dp = [0] * n
    
    for row in grid:
        new_dp = [0] * n
        for j in range(n):
            if j == 0:
                new_dp[j] = row[j] + dp[j]  # from above only
            else:
                new_dp[j] = row[j] + min(dp[j], new_dp[j-1])
        dp = new_dp
    
    return dp[n-1]
```

---

### Reconstruction
```python
def reconstruct_path(grid, dp):
    """Backtrack to find the actual path"""
    m, n = len(grid), len(grid[0])
    path = [(m-1, n-1)]
    i, j = m-1, n-1
    
    while i > 0 or j > 0:
        if i == 0:
            j -= 1
        elif j == 0:
            i -= 1
        elif dp[i-1][j] < dp[i][j-1]:  # came from above
            i -= 1
        else:
            j -= 1
        path.append((i, j))
    
    return path[::-1]
```

<!-- back -->
