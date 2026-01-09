# Minimum Path Sum

## Problem Description

Given a `m x n` grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.

**Note:** You can only move either down or right at any point in time.

## Examples

### Example 1

**Input:**
```
grid = [[1, 3, 1], [1, 5, 1], [4, 2, 1]]
```

**Output:**
```
7
```

**Explanation:**
Because the path `1 → 3 → 1 → 1 → 1` minimizes the sum.

### Example 2

**Input:**
```
grid = [[1, 2, 3], [4, 5, 6]]
```

**Output:**
```
12
```

## Constraints

- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 200`
- `0 <= grid[i][j] <= 200`

## Solution

```python
from typing import List

class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        """
        Find minimum path sum using dynamic programming.
        
        dp[i][j] = minimum sum to reach cell (i, j)
        """
        if not grid or not grid[0]:
            return 0
        
        m, n = len(grid), len(grid[0])
        dp = [[0] * n for _ in range(m)]
        dp[0][0] = grid[0][0]
        
        # Initialize first row
        for j in range(1, n):
            dp[0][j] = dp[0][j - 1] + grid[0][j]
        
        # Initialize first column
        for i in range(1, m):
            dp[i][0] = dp[i - 1][0] + grid[i][0]
        
        # Fill the rest of the DP table
        for i in range(1, m):
            for j in range(1, n):
                dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])
        
        return dp[m - 1][n - 1]
```

## Explanation

This problem requires finding the minimum path sum from the top-left to the bottom-right of a grid, moving only right or down.

1. **DP state**: `dp[i][j]` represents the minimum sum to reach cell `(i, j)`.

2. **Initialize**:
   - `dp[0][0] = grid[0][0]`
   - First row: can only come from left
   - First column: can only come from above

3. **Fill DP table**: For other cells:
   - `dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`

4. **Return result**: `dp[m-1][n-1]`

## Complexity Analysis

- **Time Complexity:** O(m × n), where m and n are the grid dimensions
- **Space Complexity:** O(m × n), for the DP table (can be optimized to O(n))
