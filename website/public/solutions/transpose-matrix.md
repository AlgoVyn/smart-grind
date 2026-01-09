# Transpose Matrix

## Problem Description
Given a 2D integer array matrix, return the transpose of matrix.
The transpose of a matrix is the matrix flipped over its main diagonal, switching the matrix's row and column indices.

 
Example 1:

Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [[1,4,7],[2,5,8],[3,6,9]]

Example 2:

Input: matrix = [[1,2,3],[4,5,6]]
Output: [[1,4],[2,5],[3,6]]

 
Constraints:

m == matrix.length
n == matrix[i].length
1 <= m, n <= 1000
1 <= m * n <= 105
-109 <= matrix[i][j] <= 109
## Solution

```python
from typing import List

class Solution:
    def transpose(self, matrix: List[List[int]]) -> List[List[int]]:
        return list(map(list, zip(*matrix)))
```

## Explanation
To transpose a matrix, we swap its rows and columns. Using Python's zip function with the * operator unpacks the matrix rows, and zip pairs corresponding elements from each row, effectively transposing it. We convert the tuples back to lists.

**Time Complexity:** O(m * n), where m is the number of rows and n is the number of columns, as we process each element once.

**Space Complexity:** O(m * n), for storing the transposed matrix.
