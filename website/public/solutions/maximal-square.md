# Maximal Square

## Problem Description
Given an m x n binary matrix filled with 0's and 1's, find the largest square containing only 1's and return its area.
 
Example 1:
Input: matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
Output: 4

Example 2:
Input: matrix = [["0","1"],["1","0"]]
Output: 1

Example 3:

Input: matrix = [["0"]]
Output: 0

 
Constraints:

m == matrix.length
n == matrix[i].length
1 <= m, n <= 300
matrix[i][j] is '0' or '1'.
## Solution

```python
from typing import List

class Solution:
    def maximalSquare(self, matrix: List[List[str]]) -> int:
        if not matrix or not matrix[0]:
            return 0
        m, n = len(matrix), len(matrix[0])
        dp = [[0] * n for _ in range(m)]
        max_side = 0
        for i in range(m):
            for j in range(n):
                if matrix[i][j] == '1':
                    if i == 0 or j == 0:
                        dp[i][j] = 1
                    else:
                        dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
                    max_side = max(max_side, dp[i][j])
        return max_side ** 2
```

## Explanation
We use dynamic programming where dp[i][j] represents the side length of the largest square ending at position (i, j). If matrix[i][j] is '1', dp[i][j] is 1 plus the minimum of the three adjacent dp values (up, left, diagonal), else 0.

We track the maximum side length and return its square as the area.

Time complexity: O(m * n), where m and n are the dimensions of the matrix.

Space complexity: O(m * n), for the dp table.
