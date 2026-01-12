# Array/Matrix - Spiral Traversal

## Overview

Spiral traversal is a method to iterate through a 2D matrix in a spiral order, starting from the top-left corner, moving right along the top row, down the right column, left along the bottom row, up the left column, and then spiraling inward. This pattern is essential for problems that require accessing matrix elements in a layered, boundary-first manner, such as generating spiral sequences or performing boundary operations. It ensures all elements are visited exactly once without recursion, making it efficient for large matrices.

## Key Concepts

The core principle involves maintaining four boundary pointers: top, bottom, left, and right. In each iteration:
- Traverse from left to right along the top row.
- Traverse from top to bottom along the right column.
- Traverse from right to left along the bottom row (if boundaries allow).
- Traverse from bottom to top along the left column (if boundaries allow).
After each full cycle, shrink the boundaries inward by incrementing top, decrementing bottom, incrementing left, and decrementing right. This continues until all elements are traversed.

## Template

```python
def spiral_order(matrix):
    """
    Returns a list of elements in spiral order from the given m x n matrix.
    """
    if not matrix or not matrix[0]:
        return []
    
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        # Traverse right along the top row
        for j in range(left, right + 1):
            result.append(matrix[top][j])
        top += 1
        
        # Traverse down along the right column
        for i in range(top, bottom + 1):
            result.append(matrix[i][right])
        right -= 1
        
        # Traverse left along the bottom row, if necessary
        if top <= bottom:
            for j in range(right, left - 1, -1):
                result.append(matrix[bottom][j])
            bottom -= 1
        
        # Traverse up along the left column, if necessary
        if left <= right:
            for i in range(bottom, top - 1, -1):
                result.append(matrix[i][left])
            left += 1
    
    return result

# Example usage:
# matrix = [[1,2,3],[4,5,6],[7,8,9]]
# print(spiral_order(matrix))  # Output: [1,2,3,6,9,8,7,4,5]
```

## Example Problems

1. **Spiral Matrix (LeetCode 54)**: Given an m x n matrix, return all elements in spiral order.
2. **Spiral Matrix II (LeetCode 59)**: Given a positive integer n, generate an n x n matrix filled with elements from 1 to n² in spiral order.
3. **Matrix Boundary Traversal**: Print or collect elements along the boundary of a matrix in spiral fashion, useful in image processing or grid-based games.

## Time and Space Complexity

- **Time Complexity**: O(m * n), where m and n are the dimensions of the matrix, as each element is visited exactly once.
- **Space Complexity**: O(1) auxiliary space (excluding the output list), since only a constant number of variables are used.

## Common Pitfalls

- **Boundary Checks**: Always check if top <= bottom and left <= right before starting a traversal direction to avoid index errors.
- **Single Row/Column Handling**: For matrices with only one row or column, ensure the traversal doesn't attempt invalid directions.
- **Pointer Updates**: Incorrectly updating pointers (e.g., forgetting to increment/decrement) can lead to infinite loops or missed elements.
- **Empty Matrix**: Handle cases where the matrix is empty or has zero rows/columns by returning an empty list early.