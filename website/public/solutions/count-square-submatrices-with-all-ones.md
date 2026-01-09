# Count Square Submatrices With All Ones

## Problem Description
Given a m * n matrix of ones and zeros, return how many square submatrices have all ones.

## Examples

**Example 1:**

**Input:**
```python
matrix =
[
  [0,1,1,1],
  [1,1,1,1],
  [0,1,1,1]
]
```

**Output:**
```python
15
```

**Explanation:**
There are 10 squares of side 1.
There are 4 squares of side 2.
There is  1 square of side 3.
Total number of squares = 10 + 4 + 1 = 15.

**Example 2:**

**Input:**
```python
matrix =
[
  [1,0,1],
  [1,1,0],
  [1,1,0]
]
```

**Output:**
```python
7
```

**Explanation:**
There are 6 squares of side 1.
There is 1 square of side 2.
Total number of squares = 6 + 1 = 7.

## Constraints

- `1 <= arr.length <= 300`
- `1 <= arr[0].length <= 300`
- `0 <= arr[i][j] <= 1`

## Solution

```python
from typing import List

class Solution:
    def countSquares(self, matrix: List[List[int]]) -> int:
        if not matrix or not matrix[0]:
            return 0
        
        m, n = len(matrix), len(matrix[0])
        dp = [[0] * n for _ in range(m)]
        count = 0
        
        for i in range(m):
            for j in range(n):
                if matrix[i][j] == 1:
                    if i == 0 or j == 0:
                        dp[i][j] = 1
                    else:
                        dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
                    count += dp[i][j]
        
        return count
```

## Explanation
To count the number of square submatrices with all ones, we use dynamic programming. We define `dp[i][j]` as the size of the largest square submatrix with all ones that has its bottom-right corner at position (i, j).

1. Initialize a 2D DP table with the same dimensions as the matrix, filled with zeros.
2. Iterate through each cell in the matrix. If the cell is 1:
   - If it's in the first row or first column, `dp[i][j] = 1` (since it can only form a 1x1 square).
   - Otherwise, `dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1`. This ensures the square is limited by the smallest adjacent squares.
3. Add `dp[i][j]` to the total count for each cell that is 1, as it represents the number of squares ending at that cell.
4. Return the total count.

## Time Complexity
**O(m * n)**, where m and n are the dimensions of the matrix, as we visit each cell once.

## Space Complexity
**O(m * n)**, for the DP table.
