# Minimum Falling Path Sum

## Problem Description

Given an `n x n` array of integers `matrix`, return the minimum sum of any falling path through matrix.

A falling path starts at any element in the first row and chooses the element in the next row that is either directly below or diagonally left/right. Specifically, the next element from position `(row, col)` will be `(row + 1, col - 1)`, `(row + 1, col)`, or `(row + 1, col + 1)`.

---

## Examples

### Example 1

**Input:**
```python
matrix = [[2, 1, 3], [6, 5, 4], [7, 8, 9]]
```

**Output:**
```python
13
```

**Explanation:**
There are two falling paths with a minimum sum as shown.

### Example 2

**Input:**
```python
matrix = [[-19, 57], [-40, -5]]
```

**Output:**
```python
-59
```

**Explanation:**
The falling path with a minimum sum is shown.

---

## Constraints

- `n == matrix.length == matrix[i].length`
- `1 <= n <= 100`
- `-100 <= matrix[i][j] <= 100`

---

## Solution

```python
from typing import List

class Solution:
    def minFallingPathSum(self, matrix: List[List[int]]) -> int:
        """
        Find the minimum falling path sum using dynamic programming.
        
        dp[j] represents the minimum sum to reach column j in the current row.
        """
        n = len(matrix)
        dp = matrix[0][:]  # Initialize with first row
        
        for i in range(1, n):
            new_dp = [0] * n
            for j in range(n):
                # Get minimum from adjacent cells in previous row
                min_prev = min(dp[max(0, j-1):min(n, j+2)])
                new_dp[j] = matrix[i][j] + min_prev
            dp = new_dp
        
        return min(dp)
```

---

## Explanation

This problem uses dynamic programming to compute the minimum falling path sum.

1. **Initialize DP**: Start with the first row of the matrix as the initial DP values.

2. **Iterate through rows**: For each subsequent row:
   - Create a new DP array
   - For each column, calculate the minimum from the three possible previous positions
   - Add the current cell value to get the new DP value

3. **Return minimum**: After processing all rows, return the minimum value in the DP array.

---

## Complexity Analysis

- **Time Complexity:** O(n²), where n is the matrix size
- **Space Complexity:** O(n), using two arrays of size n
