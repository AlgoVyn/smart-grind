# Spiral Matrix II

## Problem Description

Given a positive integer `n`, generate an `n x n` matrix filled with elements from 1 to `n²` in spiral order (clockwise, starting from top-left).

---

## Examples

**Example 1:**
```
Input: n = 3
Output: [[1,2,3],[8,9,4],[7,6,5]]
```

**Example 2:**
```
Input: n = 1
Output: [[1]]
```

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= n <= 20` | Matrix size |

---

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
        # Fill top row (left → right)
        for i in range(left, right + 1):
            matrix[top][i] = num
            num += 1
        top += 1
        
        # Fill right column (top → bottom)
        for i in range(top, bottom + 1):
            matrix[i][right] = num
            num += 1
        right -= 1
        
        # Fill bottom row (right → left)
        if top <= bottom:
            for i in range(right, left - 1, -1):
                matrix[bottom][i] = num
                num += 1
            bottom -= 1
        
        # Fill left column (bottom → top)
        if left <= right:
            for i in range(bottom, top - 1, -1):
                matrix[i][left] = num
                num += 1
            left += 1
    
    return matrix
```

---

## Explanation

### Approach: Layer-by-Layer

Use four boundaries to define the current layer:
- `top`, `bottom` — row boundaries
- `left`, `right` — column boundaries

### Time Complexity

- **O(n²)** — Visit each cell once

### Space Complexity

- **O(n²)** — Output matrix

---

## Related Problems

- [Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii/)
