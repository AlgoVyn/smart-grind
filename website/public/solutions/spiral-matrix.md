# Spiral Matrix

## Problem Description

Given an `m x n` matrix, return all elements of the matrix in **spiral order** (clockwise, starting from top-left corner).

Spiral order means we start at the top-left corner of the matrix and move:
1. Right across the top row
2. Down the rightmost column
3. Left across the bottom row
4. Up the leftmost column
5. Repeat the process spiraling inward until all elements are visited

---

## Examples

### Example 1:
```
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,3,6,9,8,7,4,5]

Visualization:
[1, 2, 3]
[4, 5, 6]  →  1→2→3→6→9→8→7→4→5
[7, 8, 9]
```

### Example 2:
```
Input: matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
Output: [1,2,3,4,8,12,11,10,9,5,6,7]

Visualization:
[ 1,  2,  3,  4]
[ 5,  6,  7,  8]  →  1→2→3→4→8→12→11→10→9→5→6→7
[ 9, 10, 11, 12]
```

### Example 3 (Single Row):
```
Input: matrix = [[1,2,3,4,5,6,7]]
Output: [1,2,3,4,5,6,7]
```

### Example 4 (Single Column):
```
Input: matrix = [[1],[2],[3],[4]]
Output: [1,2,3,4]
```

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= m, n <= 20` | Matrix dimensions (from LeetCode) |
| `-100 <= matrix[i][j] <= 100` | Element values |

---

## Intuition

The key insight is to use **four boundaries** that shrink as we traverse each "layer" of the spiral:

1. **Top boundary**: Current top row to traverse
2. **Bottom boundary**: Current bottom row to traverse
3. **Left boundary**: Current left column to traverse
4. **Right boundary**: Current right column to traverse

We traverse in four directions in order:
- **Left → Right** along the top row
- **Top → Bottom** along the right column
- **Right → Left** along the bottom row
- **Bottom → Top** along the left column

After completing each direction, we shrink the corresponding boundary inward.

---

## Approach 1: Boundary Method (Recommended)

### Algorithm
1. Initialize four boundaries: `top=0`, `bottom=m-1`, `left=0`, `right=n-1`
2. Initialize an empty result list
3. While `top <= bottom` and `left <= right`:
   - Traverse from `left` to `right` along the `top` row, append elements to result
   - Increment `top` (move top boundary down)
   - Traverse from `top` to `bottom` along the `right` column, append elements
   - Decrement `right` (move right boundary left)
   - If `top <= bottom`, traverse from `right` to `left` along the `bottom` row
   - Decrement `bottom` (move bottom boundary up)
   - If `left <= right`, traverse from `bottom` to `top` along the `left` column
   - Increment `left` (move left boundary right)
4. Return the result list

### Why This Works
Each iteration of the while loop processes one complete "layer" of the spiral. The boundaries ensure we never visit the same element twice and stop when all elements have been visited.

### Key Points
- The condition checks `top <= bottom` and `left <= right` are crucial for handling matrices with odd dimensions (center element) and edge cases (single row/column)
- The order of traversal is fixed: right → down → left → up

### Python Implementation (Boundary Method)
```python
from typing import List

def spiralOrder(matrix: List[List[int]]) -> List[int]:
    """
    Returns all elements of the matrix in spiral order.
    
    Args:
        matrix: 2D list of integers
        
    Returns:
        List of integers in spiral order
    """
    if not matrix or not matrix[0]:
        return []
    
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        # Traverse top row (left → right)
        for j in range(left, right + 1):
            result.append(matrix[top][j])
        top += 1
        
        # Traverse right column (top → bottom)
        for i in range(top, bottom + 1):
            result.append(matrix[i][right])
        right -= 1
        
        # Traverse bottom row (right → left), if valid
        if top <= bottom:
            for j in range(right, left - 1, -1):
                result.append(matrix[bottom][j])
            bottom -= 1
        
        # Traverse left column (bottom → top), if valid
        if left <= right:
            for i in range(bottom, top - 1, -1):
                result.append(matrix[i][left])
            left += 1
    
    return result
```

---

## Approach 2: Direction Vector Method

### Algorithm
1. Define four direction vectors: `right=(0,1)`, `down=(1,0)`, `left=(0,-1)`, `up=(-1,0)`
2. Initialize current position at `(0,0)` and direction index to 0
3. For each element from 0 to `m*n - 1`:
   - Add current element to result
   - Mark current position as visited
   - Calculate next position based on current direction
   - If next position is out of bounds or already visited, change direction
4. Return result

### Why This Works
This approach simulates walking on the matrix following the spiral path. When we hit a boundary or visited cell, we turn right (clockwise).

### Python Implementation (Direction Vector)
```python
from typing import List

def spiralOrder_direction(matrix: List[List[int]]) -> List[int]:
    """
    Spiral matrix traversal using direction vectors.
    """
    if not matrix or not matrix[0]:
        return []
    
    m, n = len(matrix), len(matrix[0])
    visited = [[False] * n for _ in range(m)]
    result = []
    
    # Direction vectors: right, down, left, up
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    direction_idx = 0
    
    row, col = 0, 0
    
    for _ in range(m * n):
        result.append(matrix[row][col])
        visited[row][col] = True
        
        # Calculate next position
        next_row = row + directions[direction_idx][0]
        next_col = col + directions[direction_idx][1]
        
        # Check if next position is valid
        if (next_row < 0 or next_row >= m or 
            next_col < 0 or next_col >= n or 
            visited[next_row][next_col]):
            direction_idx = (direction_idx + 1) % 4  # Turn right
            next_row = row + directions[direction_idx][0]
            next_col = col + directions[direction_idx][1]
        
        row, col = next_row, next_col
    
    return result
```

---

## Approach 3: Layer-by-Layer (Recursive)

### Algorithm
1. Define a recursive function that processes one layer
2. Base case: if matrix is empty, return
3. Process the outer layer (top row, right column, bottom row, left column)
4. Recursively call on the inner submatrix

### Python Implementation (Recursive)
```python
from typing import List

def spiralOrder_recursive(matrix: List[List[int]]) -> List[int]:
    """
    Spiral matrix traversal using recursion.
    """
    result = []
    
    def helper(top: int, bottom: int, left: int, right: int):
        if top > bottom or left > right:
            return
        
        # Top row
        for j in range(left, right + 1):
            result.append(matrix[top][j])
        top += 1
        
        # Right column
        for i in range(top, bottom + 1):
            result.append(matrix[i][right])
        right -= 1
        
        # Bottom row (if still valid)
        if top <= bottom:
            for j in range(right, left - 1, -1):
                result.append(matrix[bottom][j])
            bottom -= 1
        
        # Left column (if still valid)
        if left <= right:
            for i in range(bottom, top - 1, -1):
                result.append(matrix[i][left])
            left += 1
        
        # Recurse on inner layer
        helper(top, bottom, left, right)
    
    if not matrix or not matrix[0]:
        return result
    
    helper(0, len(matrix) - 1, 0, len(matrix[0]) - 1)
    return result
```

---

## Complexity Analysis

### Time Complexity
- **O(m × n)** where m is rows and n is columns
- Each element is visited exactly once

### Space Complexity
- **O(1)** auxiliary space for boundary method (excluding output)
- **O(m × n)** for direction vector method (visited matrix)
- **O(m × n)** recursion depth for recursive approach (call stack)

### Comparison of Approaches

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Boundary | O(mn) | O(1) | Simple, efficient | None |
| Direction Vector | O(mn) | O(mn) | Clear simulation | Extra space for visited |
| Recursive | O(mn) | O(min(m,n)) | Elegant | Stack overflow risk |

---

## Edge Cases

1. **Empty Matrix**: Return empty list
2. **Single Row**: Traverse left to right only
3. **Single Column**: Traverse top to bottom only
4. **1x1 Matrix**: Return the single element
5. **Odd Dimensions**: Center element handled automatically
6. **Even Dimensions**: All elements visited

---

## Related Problems

1. **[Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii/)** - Generate a matrix in spiral order (reverse problem)
2. **[Spiral Matrix III](https://leetcode.com/problems/spiral-matrix-iii/)** - Find all cells in spiral order starting from a given cell
3. **[Spiral Matrix IV](https://leetcode.com/problems/spiral-matrix-iv/)** - Generate matrix from linked list in spiral order
4. **[Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse/)** - Similar matrix traversal pattern
5. **[Rotate Image](https://leetcode.com/problems/rotate-image/)** - Matrix transformation problem

---

## Video Tutorials

1. **[NeetCode - Spiral Matrix](https://www.youtube.com/watch?v=BJnMZNwUkdM)** - Clear explanation with visualizations
2. **[BacktoBack SWE - Spiral Matrix](https://www.youtube.com/watch?v=ZGll0tF5pzQ)** - In-depth algorithmic explanation
3. **[Take U Forward - Spiral Matrix](https://www.youtube.com/watch?v=1ZGJ97g2upI)** - Multiple approaches explained
4. **[Abdul Bari - Spiral Matrix](https://www.youtube.com/watch?v=V玩了nLp8XkU)** - Classic tutorial

---

## Test Cases

```python
def test_spiralOrder():
    # Test case 1: 3x3 matrix
    matrix1 = [[1,2,3],[4,5,6],[7,8,9]]
    assert spiralOrder(matrix1) == [1,2,3,6,9,8,7,4,5]
    
    # Test case 2: 3x4 matrix
    matrix2 = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
    assert spiralOrder(matrix2) == [1,2,3,4,8,12,11,10,9,5,6,7]
    
    # Test case 3: Single row
    matrix3 = [[1,2,3,4,5]]
    assert spiralOrder(matrix3) == [1,2,3,4,5]
    
    # Test case 4: Single column
    matrix4 = [[1],[2],[3],[4]]
    assert spiralOrder(matrix4) == [1,2,3,4]
    
    # Test case 5: 1x1 matrix
    matrix5 = [[42]]
    assert spiralOrder(matrix5) == [42]
    
    # Test case 6: Empty matrix
    matrix6 = []
    assert spiralOrder(matrix6) == []
    
    print("All test cases passed!")
```

---

## Summary

The **Boundary Method** is the most efficient and recommended approach:
- **Simple**: Easy to understand and implement
- **Efficient**: O(1) auxiliary space, O(mn) time
- **Robust**: Handles all edge cases correctly

Key takeaways:
- Use four boundaries (top, bottom, left, right) to track the current layer
- Always check boundary conditions before traversing
- Shrink boundaries after each complete layer
- The spiral pattern emerges naturally from the four-direction traversal

