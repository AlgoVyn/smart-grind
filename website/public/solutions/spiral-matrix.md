# Spiral Matrix

## Problem Description
Given an m x n matrix, return all elements of the matrix in spiral order.
 
Example 1:
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,3,6,9,8,7,4,5]

Example 2:
Input: matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
Output: [1,2,3,4,8,12,11,10,9,5,6,7]

 
Constraints:

m == matrix.length
n == matrix[i].length
1 <= m, n <= 10
-100 <= matrix[i][j] <= 100
## Solution

```python
def spiralOrder(matrix):
    if not matrix:
        return []
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        # Traverse top row
        for j in range(left, right + 1):
            result.append(matrix[top][j])
        top += 1
        # Traverse right column
        for i in range(top, bottom + 1):
            result.append(matrix[i][right])
        right -= 1
        # Traverse bottom row if necessary
        if top <= bottom:
            for j in range(right, left - 1, -1):
                result.append(matrix[bottom][j])
            bottom -= 1
        # Traverse left column if necessary
        if left <= right:
            for i in range(bottom, top - 1, -1):
                result.append(matrix[i][left])
            left += 1
    return result
```

## Explanation
This problem traverses a matrix in spiral order by moving through layers, adjusting boundaries after each side.

### Step-by-Step Approach:
1. **Initialize Boundaries:**
   - top, bottom, left, right.

2. **Traverse Layers:**
   - While boundaries allow:
     - Traverse top row left to right, increment top.
     - Traverse right column top to bottom, decrement right.
     - If top <= bottom, traverse bottom row right to left, decrement bottom.
     - If left <= right, traverse left column bottom to top, increment left.

3. **Collect Elements:**
   - Append each element to result.

### Time Complexity:
- O(m * n), visits each element once.

### Space Complexity:
- O(1), excluding output.
