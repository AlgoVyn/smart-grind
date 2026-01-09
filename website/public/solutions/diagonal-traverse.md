# Diagonal Traverse

## Problem Description
Given an m x n matrix mat, return an array of all the elements of the array in a diagonal order.

## Examples

**Example 1:**

**Input:**
```
mat = [[1,2,3],[4,5,6],[7,8,9]]
```

**Output:**
```
[1,2,4,7,5,3,6,8,9]
```

**Example 2:**

**Input:**
```
mat = [[1,2],[3,4]]
```

**Output:**
```
[1,2,3,4]
```

## Constraints

- `m == mat.length`
- `n == mat[i].length`
- `1 <= m, n <= 104`
- `1 <= m * n <= 104`
- `-105 <= mat[i][j] <= 105`

## Solution

```python
from typing import List

class Solution:
    def findDiagonalOrder(self, mat: List[List[int]]) -> List[int]:
        if not mat or not mat[0]:
            return []
        m, n = len(mat), len(mat[0])
        diagonals = [[] for _ in range(m + n - 1)]
        for i in range(m):
            for j in range(n):
                diagonals[i + j].append(mat[i][j])
        result = []
        for k in range(len(diagonals)):
            if k % 2 == 0:
                result.extend(diagonals[k])
            else:
                result.extend(diagonals[k][::-1])
        return result
```

## Explanation
The solution groups elements by their diagonal sum i+j. For each diagonal, if the sum is even, append the elements in order; if odd, append in reverse order.

This simulates the diagonal traversal starting from top-left, going down-right.

**Time Complexity:** O(m*n)

**Space Complexity:** O(m*n)
