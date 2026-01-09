# Maximal Rectangle

## Problem Description

Given an `rows x cols` binary matrix filled with `0`'s and `1`'s, find the largest rectangle containing only `1`'s and return its area.

---

## Examples

### Example 1

**Input:**
```python
matrix = [
    ["1", "0", "1", "0", "0"],
    ["1", "0", "1", "1", "1"],
    ["1", "1", "1", "1", "1"],
    ["1", "0", "0", "1", "0"]
]
```

**Output:**
```python
6
```

**Explanation:** The maximal rectangle contains 6 cells of `1`'s.

### Example 2

**Input:**
```python
matrix = [["0"]]
```

**Output:**
```python
0
```

### Example 3

**Input:**
```python
matrix = [["1"]]
```

**Output:**
```python
1
```

---

## Constraints

- `rows == matrix.length`
- `cols == matrix[i].length`
- `1 <= rows, cols <= 200`
- `matrix[i][j]` is `'0'` or `'1'`

---

## Solution

```python
from typing import List

class Solution:
    def maximalRectangle(self, matrix: List[List[str]]) -> int:
        if not matrix or not matrix[0]:
            return 0
        rows, cols = len(matrix), len(matrix[0])
        heights = [0] * cols
        max_area = 0
        
        def largestRectangleArea(heights: List[int]) -> int:
            stack = [-1]
            max_a = 0
            for i in range(len(heights)):
                while stack[-1] != -1 and heights[stack[-1]] >= heights[i]:
                    h = heights[stack.pop()]
                    w = i - stack[-1] - 1
                    max_a = max(max_a, h * w)
                stack.append(i)
            while stack[-1] != -1:
                h = heights[stack.pop()]
                w = len(heights) - stack[-1] - 1
                max_a = max(max_a, h * w)
            return max_a
        
        for i in range(rows):
            for j in range(cols):
                if matrix[i][j] == '1':
                    heights[j] += 1
                else:
                    heights[j] = 0
            max_area = max(max_area, largestRectangleArea(heights))
        
        return max_area
```

---

## Explanation

We use a **histogram-based** approach combined with the **largest rectangle in histogram** algorithm.

### Key Idea

Treat each row as the base of a histogram:
- `heights[j]` = number of consecutive `1`'s above (and including) the current row in column `j`

For each row, we compute the largest rectangle in its histogram using a **monotonic stack**.

### Largest Rectangle in Histogram

The algorithm uses a monotonic increasing stack to find the largest rectangle:
1. Push indices onto the stack
2. When a smaller height is found, pop and calculate rectangle area
3. At the end, pop remaining indices to calculate areas

### Algorithm

1. Initialize `heights` array with zeros
2. For each row:
   - Update `heights` based on current row values
   - Compute largest rectangle in histogram
   - Update `max_area`
3. Return `max_area`

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(rows * cols)` — Each cell is processed a constant number of times |
| **Space** | `O(cols)` — For `heights` array and stack |
