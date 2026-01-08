# Spiral Matrix Ii

## Problem Description
[Link to problem](https://leetcode.com/problems/spiral-matrix-ii/)

Given a positive integer n, generate an n x n matrix filled with elements from 1 to n2 in spiral order.
 
Example 1:


Input: n = 3
Output: [[1,2,3],[8,9,4],[7,6,5]]

Example 2:

Input: n = 1
Output: [[1]]

 
Constraints:

1 <= n <= 20


## Solution

```python
from typing import List

def generateMatrix(n: int) -> List[List[int]]:
    if n == 0:
        return []

    matrix = [[0] * n for _ in range(n)]
    num = 1
    top, bottom = 0, n - 1
    left, right = 0, n - 1

    while num <= n * n:
        # Fill top row from left to right
        for i in range(left, right + 1):
            matrix[top][i] = num
            num += 1
        top += 1

        # Fill right column from top to bottom
        for i in range(top, bottom + 1):
            matrix[i][right] = num
            num += 1
        right -= 1

        # Fill bottom row from right to left, if necessary
        if top <= bottom:
            for i in range(right, left - 1, -1):
                matrix[bottom][i] = num
                num += 1
            bottom -= 1

        # Fill left column from bottom to top, if necessary
        if left <= right:
            for i in range(bottom, top - 1, -1):
                matrix[i][left] = num
                num += 1
            left += 1

    return matrix
```

## Explanation
To generate an n x n matrix filled in spiral order from 1 to n², we use a layer-by-layer approach with four boundaries: top, bottom, left, and right.

1. Initialize a matrix of size n x n filled with zeros, and set num to 1.
2. Set boundaries: top = 0, bottom = n-1, left = 0, right = n-1.
3. While num <= n*n:
   - Fill the top row from left to right, increment top.
   - Fill the right column from top to bottom, decrement right.
   - If top <= bottom, fill the bottom row from right to left, decrement bottom.
   - If left <= right, fill the left column from bottom to top, increment left.
4. Each step increments num after assigning it to the matrix position.

This ensures all cells are filled in spiral order.

**Time Complexity:** O(n²), as we visit each cell once.
**Space Complexity:** O(n²), for the matrix.
