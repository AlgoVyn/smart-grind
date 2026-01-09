# Unique Paths

## Problem Description
There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time.
Given the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.
The test cases are generated so that the answer will be less than or equal to 2 * 109.
 
Example 1:
Input: m = 3, n = 7
Output: 28

Example 2:

Input: m = 3, n = 2
Output: 3
Explanation: From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
1. Right -> Down -> Down
2. Down -> Down -> Right
3. Down -> Right -> Down

 
Constraints:

1 <= m, n <= 100
## Solution

```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [[1] * n for _ in range(m)]
        for i in range(1, m):
            for j in range(1, n):
                dp[i][j] = dp[i-1][j] + dp[i][j-1]
        return dp[m-1][n-1]
```

## Explanation
Use dynamic programming. dp[i][j] represents the number of unique paths to reach cell (i,j). Initialize the first row and first column to 1, as there's only one way to reach them (all right or all down). For each other cell, the number of ways is the sum from the cell above and the cell to the left.

**Time Complexity:** O(m * n), for filling the DP table.

**Space Complexity:** O(m * n), for the DP table. Can be optimized to O(min(m,n)) by using two arrays.
