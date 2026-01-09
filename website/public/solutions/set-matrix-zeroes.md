# Set Matrix Zeroes

## Problem Description
Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's.
You must do it in place.
 
Example 1:
Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]
Output: [[1,0,1],[0,0,0],[1,0,1]]

Example 2:
Input: matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]

 
Constraints:

m == matrix.length
n == matrix[0].length
1 <= m, n <= 200
-231 <= matrix[i][j] <= 231 - 1

 
Follow up:

A straightforward solution using O(mn) space is probably a bad idea.
A simple improvement uses O(m + n) space, but still not the best solution.
Could you devise a constant space solution?
## Solution

```python
from typing import List

class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        m, n = len(matrix), len(matrix[0])
        first_row_zero = any(matrix[0][j] == 0 for j in range(n))
        first_col_zero = any(matrix[i][0] == 0 for i in range(m))
        
        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][j] == 0:
                    matrix[i][0] = 0
                    matrix[0][j] = 0
        
        for i in range(1, m):
            if matrix[i][0] == 0:
                for j in range(n):
                    matrix[i][j] = 0
        
        for j in range(1, n):
            if matrix[0][j] == 0:
                for i in range(m):
                    matrix[i][j] = 0
        
        if first_row_zero:
            for j in range(n):
                matrix[0][j] = 0
        
        if first_col_zero:
            for i in range(m):
                matrix[i][0] = 0
```

## Explanation

This problem sets entire rows and columns to zero if any element is zero, in place.

### Step-by-Step Approach:

1. **Check First Row/Col**: Record if first row or column has zero.

2. **Mark**: For i,j in 1..m-1,1..n-1, if matrix[i][j]==0, set matrix[i][0] and matrix[0][j] to 0.

3. **Set Rows**: For i in 1..m-1, if matrix[i][0]==0, set row to 0.

4. **Set Columns**: For j in 1..n-1, if matrix[0][j]==0, set column to 0.

5. **Handle First Row/Col**: If originally had zero, set them to 0.

### Time Complexity:
- O(m*n)

### Space Complexity:
- O(1)
