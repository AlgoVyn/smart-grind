# Spiral Matrix

## Problem Description

Given an `m x n` matrix, return all elements of the matrix in spiral order (clockwise, starting from top-left).

---

## Examples

**Example 1:**
```python
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,3,6,9,8,7,4,5]
```

**Example 2:**
```python
Input: matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
Output: [1,2,3,4,8,12,11,10,9,5,6,7]
```

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= m, n <= 10` | Matrix dimensions |

---

## Solution

```python
from typing import List

def spiralOrder(matrix: List[List[int]]) -> List[int]:
    if not matrix:
        return []
    
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        # Top row (left → right)
        for j in range(left, right + 1):
            result.append(matrix[top][j])
        top += 1
        
        # Right column (top → bottom)
        for i in range(top, bottom + 1):
            result.append(matrix[i][right])
        right -= 1
        
        # Bottom row (right → left)
        if top <= bottom:
            for j in range(right, left - 1, -1):
                result.append(matrix[bottom][j])
            bottom -= 1
        
        # Left column (bottom → top)
        if left <= right:
            for i in range(bottom, top - 1, -1):
                result.append(matrix[i][left])
            left += 1
    
    return result
```

---

## Explanation

### Approach: Four Boundaries

| Boundary | Purpose |
|----------|---------|
| `top`, `bottom` | Row boundaries |
| `left`, `right` | Column boundaries |

Traverse each edge, then shrink boundaries.

### Time Complexity

- **O(m * n)** — Each element visited once

### Space Complexity

- **O(1)** — Excluding output

---

## Related Problems

- [Spiral Matrix](https://leetcode.com/problems/spiral-matrix/)
