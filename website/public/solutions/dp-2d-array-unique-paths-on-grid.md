# DP - 2D Array (Unique Paths on Grid)

## Overview

This pattern is used to find the number of unique paths from top-left to bottom-right in a grid, possibly with obstacles. It's for grid-based path counting problems. Benefits include handling obstacles and large grids efficiently.

## Key Concepts

- dp[i][j]: Number of ways to reach cell (i,j).
- dp[i][j] = dp[i-1][j] + dp[i][j-1], if no obstacle.
- Initialize dp[0][0] = 1 if no obstacle.

## Template

```python
def unique_paths(grid):
    if not grid or not grid[0]:
        return 0
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = 1 if grid[0][0] == 0 else 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:  # obstacle
                dp[i][j] = 0
                continue
            if i > 0:
                dp[i][j] += dp[i-1][j]
            if j > 0:
                dp[i][j] += dp[i][j-1]
    return dp[m-1][n-1]
```

## Example Problems

1. Unique Paths: Number of ways in m x n grid.
2. Unique Paths II: With obstacles.
3. Minimum Path Sum: Minimum sum path.

## Time and Space Complexity

- Time: O(m * n)
- Space: O(m * n), optimizable to O(n)

## Common Pitfalls

- Not handling obstacles correctly.
- Forgetting to initialize dp[0][0].
- Off-by-one in grid dimensions.