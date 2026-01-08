# Minimum Falling Path Sum

## Problem Description
[Link to problem](https://leetcode.com/problems/minimum-falling-path-sum/)

Given an n x n array of integers matrix, return the minimum sum of any falling path through matrix.
A falling path starts at any element in the first row and chooses the element in the next row that is either directly below or diagonally left/right. Specifically, the next element from position (row, col) will be (row + 1, col - 1), (row + 1, col), or (row + 1, col + 1).
 
Example 1:


Input: matrix = [[2,1,3],[6,5,4],[7,8,9]]
Output: 13
Explanation: There are two falling paths with a minimum sum as shown.

Example 2:


Input: matrix = [[-19,57],[-40,-5]]
Output: -59
Explanation: The falling path with a minimum sum is shown.

 
Constraints:

n == matrix.length == matrix[i].length
1 <= n <= 100
-100 <= matrix[i][j] <= 100


## Solution

```python
from typing import List

class Solution:
    def minFallingPathSum(self, matrix: List[List[int]]) -> int:
        n = len(matrix)
        dp = matrix[0][:]
        for i in range(1, n):
            new_dp = [0] * n
            for j in range(n):
                min_prev = min(dp[max(0, j-1):min(n, j+2)])
                new_dp[j] = matrix[i][j] + min_prev
            dp = new_dp
        return min(dp)
```

## Explanation
This problem uses dynamic programming to compute the minimum falling path sum.

1. Initialize dp with the first row of the matrix.

2. For each subsequent row i, create a new dp array where each new_dp[j] = matrix[i][j] + min of dp[j-1], dp[j], dp[j+1] (handling boundaries).

3. Update dp to new_dp.

4. After processing all rows, return the minimum value in dp.

Time complexity: O(n^2), where n is the matrix size.
Space complexity: O(n), using arrays of size n.
