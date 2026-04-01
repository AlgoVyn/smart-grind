## Title: Matrix Path DP

What is Matrix Path DP and what problems does it solve?

<!-- front -->

---

### Definition
Dynamic programming on 2D grids where the answer at each cell depends on neighboring cells (typically up, left, or other directions). Common for path counting, min/max path sum, and reachability.

### Standard Problems
| Problem | Recurrence |
|-----------|------------|
| Unique Paths | dp[i][j] = dp[i-1][j] + dp[i][j-1] |
| Min Path Sum | dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]) |
| Max Path Sum | dp[i][j] = grid[i][j] + max(...) |
| Triangle | dp[i][j] += max(dp[i+1][j], dp[i+1][j+1]) |

### Unique Paths
```python
def unique_paths(m, n):
    """Robot from top-left to bottom-right, only down/right moves"""
    dp = [[1] * n for _ in range(m)]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]

# Space optimized
def unique_paths_optimized(m, n):
    dp = [1] * n
    for i in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j-1]
    return dp[n-1]
```

---

### Min Path Sum
```python
def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]
    
    # Initialize first row and column
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] + grid[0][j]
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] + grid[i][0]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
    
    return dp[m-1][n-1]
```

---

### Complexity
| Problem | Time | Space | Optimized Space |
|---------|------|-------|-----------------|
| Unique Paths | O(mn) | O(mn) | O(min(m,n)) |
| Min Path Sum | O(mn) | O(mn) | O(n) |
| Triangle | O(n²) | O(n²) | O(n) |

<!-- back -->
