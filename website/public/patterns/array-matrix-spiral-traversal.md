# Array/Matrix - Spiral Traversal

## Overview

The Array/Matrix - Spiral Traversal pattern is used to traverse a matrix in a clockwise spiral order, starting from the top-left corner and moving outward layer by layer. This technique is useful for problems requiring matrix traversal in a specific order, such as printing matrix elements or processing layers.

## Key Concepts

- **Layer by Layer Traversal**: Traverse the matrix in layers, from outer to inner.
- **Four Directions**: Right, down, left, up to complete each layer.
- **Boundary Tracking**: Keep track of top, bottom, left, and right boundaries to define layers.
- **Termination Condition**: Stop when all layers are traversed.

## Template

```python
def spiralOrder(matrix):
    if not matrix:
        return []
    
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    result = []
    
    while top <= bottom and left <= right:
        # Traverse right
        for i in range(left, right + 1):
            result.append(matrix[top][i])
        top += 1
        
        # Traverse down
        for i in range(top, bottom + 1):
            result.append(matrix[i][right])
        right -= 1
        
        # Traverse left (if still valid)
        if top <= bottom:
            for i in range(right, left - 1, -1):
                result.append(matrix[bottom][i])
            bottom -= 1
        
        # Traverse up (if still valid)
        if left <= right:
            for i in range(bottom, top - 1, -1):
                result.append(matrix[i][left])
            left += 1
    
    return result
```

## Example Problems

1. **Spiral Matrix (LeetCode 54)**: Return all elements of the matrix in spiral order.
2. **Spiral Matrix II (LeetCode 59)**: Generate a square matrix filled with elements from 1 to n² in spiral order.
3. **Spiral Matrix III (LeetCode 885)**: Generate coordinates in spiral order starting from a point.

## Time and Space Complexity

- **Time Complexity**: O(m*n), where m is the number of rows and n is the number of columns (each element is visited once).
- **Space Complexity**: O(1) if we don't count the output list, O(m*n) otherwise.

## Common Pitfalls

- **Forgetting to check validity for left and up traversals**: Can cause duplicate elements or errors in non-square matrices.
- **Incorrect boundary updates**: Failing to update boundaries after each direction traversal leads to infinite loops or missing elements.
- **Handling empty matrices**: Always check if the matrix is empty before processing.
- **Off-by-one errors**: Incorrect range limits in loops cause missing or extra elements.
