# Array/Matrix - In-place Rotation

## Overview

In-place rotation is a technique used to rotate a 2D matrix (grid) by 90 degrees clockwise or counterclockwise without using additional space beyond a few variables. This pattern is particularly useful in problems where memory constraints are tight or when modifying the original matrix is required. The rotation is achieved through a combination of matrix transposition and row/column reversals, making it efficient and elegant. Benefits include O(1) extra space complexity and direct modification of the input, which is ideal for scenarios like image processing or game board manipulations where preserving the original structure is not necessary.

## Key Concepts

The core idea revolves around two main operations:
1. **Transposition**: Swapping elements across the main diagonal to convert rows into columns.
2. **Reversal**: Reversing the order of elements in each row or column to achieve the desired rotation direction.
For clockwise rotation: Transpose the matrix, then reverse each row.
For counterclockwise rotation: Reverse each row first, then transpose.
This approach leverages the symmetry of the matrix and avoids creating a new matrix.

## Template

```python
def rotate_clockwise(matrix):
    """
    Rotates the given n x n matrix 90 degrees clockwise in place.
    """
    n = len(matrix)
    if n == 0:
        return
    
    # Step 1: Transpose the matrix
    # Swap matrix[i][j] with matrix[j][i] for i < j
    for i in range(n):
        for j in range(i + 1, n):  # Start from i+1 to avoid double swap
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    # Step 2: Reverse each row
    for row in matrix:
        row.reverse()

# Example usage:
# matrix = [[1,2,3],[4,5,6],[7,8,9]]
# rotate_clockwise(matrix)
# Result: [[7,4,1],[8,5,2],[9,6,3]]
```

## Example Problems

1. **Rotate Image (LeetCode 48)**: Given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise) in place.
2. **Rotate Matrix**: A common interview problem where you need to rotate a matrix by 90 degrees counterclockwise using similar transposition and reversal techniques.
3. **Image Rotation in Graphics**: Applied in computer graphics for transforming pixel arrays without additional memory allocation.

## Time and Space Complexity

- **Time Complexity**: O(n²), where n is the size of the matrix, as we perform operations proportional to the number of elements.
- **Space Complexity**: O(1), since the rotation is done in place without using extra space for another matrix.

## Common Pitfalls

- **Incorrect Transposition Bounds**: Ensure the inner loop starts from i+1 to avoid swapping elements twice and corrupting the matrix.
- **Handling Non-Square Matrices**: This pattern assumes a square matrix; for rectangular matrices, additional logic may be needed.
- **Direction Confusion**: Mixing up clockwise vs. counterclockwise rotation steps can lead to unexpected results; always verify the order of operations.
- **Edge Cases**: Matrices of size 0 or 1 should be handled gracefully to avoid index errors.