# Array/Matrix - Set Matrix Zeroes (In-place Marking)

## Overview

This pattern addresses the problem of setting entire rows and columns to zero when a zero is found in a matrix, all performed in place without additional space. It's crucial for memory-constrained environments where creating a copy of the matrix isn't feasible. The approach uses the matrix itself to mark which rows and columns need to be zeroed, leveraging the first row and first column as indicators. This ensures efficiency and avoids extra data structures.

## Key Concepts

The strategy involves two passes:
1. **Marking Phase**: Use the first row and first column to record which rows and columns contain zeros. Additionally, track if the first row or first column originally contained zeros.
2. **Setting Phase**: Iterate through the matrix (excluding the first row and column) and set elements to zero based on the markers. Finally, handle the first row and column if they were originally zero.
This in-place marking prevents overwriting critical information prematurely.

## Template

```python
def set_zeroes(matrix):
    """
    Modifies the matrix in place to set entire rows and columns to zero
    where a zero is found.
    """
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
    
    # Check if first row has zero
    first_row_zero = any(matrix[0][j] == 0 for j in range(n))
    
    # Check if first column has zero
    first_col_zero = any(matrix[i][0] == 0 for i in range(m))
    
    # Mark rows and columns using first row and column
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0  # Mark row
                matrix[0][j] = 0  # Mark column
    
    # Set zeros based on markers
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    
    # Handle first row
    if first_row_zero:
        for j in range(n):
            matrix[0][j] = 0
    
    # Handle first column
    if first_col_zero:
        for i in range(m):
            matrix[i][0] = 0

# Example usage:
# matrix = [[1,1,1],[1,0,1],[1,1,1]]
# set_zeroes(matrix)
# Result: [[1,0,1],[0,0,0],[1,0,1]]
```

## Example Problems

1. **Set Matrix Zeroes (LeetCode 73)**: Given an m x n matrix, if an element is 0, set its entire row and column to 0 in place.
2. **Zero Matrix**: A variant where you need to zero out rows and columns containing specific values, using similar in-place marking.
3. **Sparse Matrix Operations**: Applied in data processing for efficiently handling zero propagation in matrices.

## Time and Space Complexity

- **Time Complexity**: O(m * n), as the matrix is traversed a constant number of times.
- **Space Complexity**: O(1), utilizing only a few extra variables beyond the input matrix.

## Common Pitfalls

- **Overwriting Markers**: Modifying the first row or column before marking can corrupt the indicators; always mark first.
- **First Row/Column Handling**: Forgetting to separately handle the first row and column can lead to incorrect results if they originally contained zeros.
- **Edge Cases**: Matrices with single rows or columns, or entirely zero matrices, require careful boundary checks.
- **Multiple Zeros**: Ensure that marking doesn't interfere with detecting other zeros in the same row/column.