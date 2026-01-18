# Array/Matrix - Set Matrix Zeroes (In-place Marking)

## Overview

The Array/Matrix - Set Matrix Zeroes pattern is used to set entire rows and columns to zero in a matrix if any element in that row or column is zero. This is done efficiently using in-place marking to avoid using extra space proportional to the matrix size.

## Key Concepts

- **In-place Marking**: Use the first row and first column to mark which rows and columns need to be zeroed.
- **Separate Markers**: Use a separate variable to track if the first row or column needs to be zeroed.
- **Two Pass Approach**: First pass to mark positions, second pass to set elements to zero.

## Template

```python
def setZeroes(matrix):
    m = len(matrix)
    n = len(matrix[0])
    first_row_zero = False
    first_col_zero = False
    
    # Check if first row has any zero
    for j in range(n):
        if matrix[0][j] == 0:
            first_row_zero = True
            break
    
    # Check if first column has any zero
    for i in range(m):
        if matrix[i][0] == 0:
            first_col_zero = True
            break
    
    # Mark zeros in first row and column
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0
                matrix[0][j] = 0
    
    # Set zeros based on marks
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    
    # Set first row to zero if needed
    if first_row_zero:
        for j in range(n):
            matrix[0][j] = 0
    
    # Set first column to zero if needed
    if first_col_zero:
        for i in range(m):
            matrix[i][0] = 0
    
    return matrix
```

## Example Problems

1. **Set Matrix Zeroes (LeetCode 73)**: Set rows and columns to zero in a matrix with 0 elements.
2. **Matrix Zeroes II**: Similar problem with additional constraints.

## Time and Space Complexity

- **Time Complexity**: O(m*n), where m is the number of rows and n is the number of columns.
- **Space Complexity**: O(1), as we use the matrix itself for marking.

## Common Pitfalls

- **Forgetting to mark the first row and column**: Leads to incorrect results.
- **Overwriting the first row/column marks early**: Can lose information about which cells need to be zeroed.
- **Not handling the first row and column separately**: Causes incorrect zeroing of the first row or column.
- **Incorrectly resetting first row/column**: Failing to set them to zero at the end if needed.
