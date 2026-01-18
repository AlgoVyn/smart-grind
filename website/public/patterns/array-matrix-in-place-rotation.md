# Array/Matrix - In-place Rotation

## Overview

The Array/Matrix - In-place Rotation pattern is used to rotate a matrix (2D array) by 90 degrees clockwise or counterclockwise without using any additional space proportional to the matrix size. This technique is efficient for modifying matrices in place, reducing memory consumption.

## Key Concepts

- **Transpose then Reverse**: For 90-degree clockwise rotation, first transpose the matrix, then reverse each row.
- **Reverse then Transpose**: For 90-degree counterclockwise rotation, first reverse each row, then transpose.
- **Layer by Layer Rotation**: Rotate the matrix by moving elements layer by layer from outer to inner.
- **In-place Modification**: Avoid using extra space by swapping elements directly.

## Template

```python
def rotate(matrix):
    n = len(matrix)
    
    # Transpose the matrix
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    # Reverse each row
    for i in range(n):
        matrix[i].reverse()
    
    return matrix
```

## Example Problems

1. **Rotate Image (LeetCode 48)**: Rotate a given n x n 2D matrix by 90 degrees clockwise in-place.
2. **Rotate Matrix Counterclockwise**: Implement 90-degree counterclockwise rotation in-place.
3. **Rotate Matrix by 180 Degrees**: Combine two 90-degree rotations or reverse rows and columns.

## Time and Space Complexity

- **Time Complexity**: O(n²), where n is the size of the matrix (each element is accessed twice).
- **Space Complexity**: O(1) for in-place rotation (no extra space used except for temporary variables).

## Common Pitfalls

- **Forgetting to transpose before reversing**: Incorrect order of operations leads to wrong rotation.
- **Off-by-one errors**: When using layer-by-layer rotation, incorrect boundary conditions cause errors.
- **Not handling square matrices**: The template assumes n x n matrices; rectangular matrices require different approaches.
- **Modifying the matrix while reading**: Ensure elements are properly stored before being overwritten.
