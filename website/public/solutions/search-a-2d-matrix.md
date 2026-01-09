# Search A 2d Matrix

## Problem Description
You are given an m x n integer matrix matrix with the following two properties:

Each row is sorted in non-decreasing order.
The first integer of each row is greater than the last integer of the previous row.

Given an integer target, return true if target is in matrix or false otherwise.
You must write a solution in O(log(m * n)) time complexity.
 
Example 1:
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
Output: true

Example 2:
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
Output: false

 
Constraints:

m == matrix.length
n == matrix[i].length
1 <= m, n <= 100
-104 <= matrix[i][j], target <= 104
## Solution

```python
from typing import List

class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        if not matrix or not matrix[0]:
            return False
        m, n = len(matrix), len(matrix[0])
        left, right = 0, m * n - 1
        while left <= right:
            mid = (left + right) // 2
            row = mid // n
            col = mid % n
            if matrix[row][col] == target:
                return True
            elif matrix[row][col] < target:
                left = mid + 1
            else:
                right = mid - 1
        return False
```

## Explanation

This problem requires searching for a target in a 2D matrix that is sorted row-wise and column-wise, with O(log(m*n)) time.

### Approach

Treat the 2D matrix as a 1D sorted array and perform binary search.

### Step-by-Step Explanation

1. **Edge Cases**: Check if matrix is empty.

2. **Dimensions**: Get m and n.

3. **Binary Search**: Set left to 0, right to m*n-1.

4. **Mid Calculation**: Compute row = mid // n, col = mid % n.

5. **Comparison**: If equal, return true; else adjust left or right.

6. **Return**: False if not found.

### Time Complexity

- O(log(m * n)), as binary search on m*n elements.

### Space Complexity

- O(1), no extra space used.
