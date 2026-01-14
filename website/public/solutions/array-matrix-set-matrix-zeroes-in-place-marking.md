# Set Matrix Zeroes

## Problem Description

Given an `m x n` matrix, if an element is **0**, set its entire row and column to **0**. Do it **in-place**, meaning you should modify the original matrix directly without using extra space for another matrix.

---

## Examples

**Example 1:**

**Input:**
```python
matrix = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
]
```

**Output:**
```python
[
    [1, 0, 1],
    [0, 0, 0],
    [1, 0, 1]
]
```

**Explanation:** The element at position (1, 1) is 0, so we set the entire first row and first column to 0.

---

**Example 2:**

**Input:**
```python
matrix = [
    [0, 1, 2, 0],
    [3, 4, 5, 2],
    [1, 3, 1, 5]
]
```

**Output:**
```python
[
    [0, 0, 0, 0],
    [0, 4, 5, 0],
    [0, 3, 1, 0]
]
```

**Explanation:** The first row contains a 0 at column 0, and the last column contains zeros at rows 0 and 1. All these rows and columns are set to 0.

---

## Constraints

- `m == matrix.length`
- `n == matrix[0].length`
- `-2^31 <= matrix[i][j] <= 2^31 - 1`

---

## Intuition

The problem requires us to zero out entire rows and columns wherever a zero appears in the matrix. The challenge is doing this **in-place** without using extra space.

The key insight is that we need to **remember which rows and columns contain zeros**. If we could mark these rows and columns somehow, we could then iterate through the matrix and set elements to zero based on these marks.

The main challenge is that if we start modifying the matrix from the top-left corner, we might lose the information about which rows and columns need to be zeroed out. For example, if we set `matrix[0][0]` to zero, we lose the ability to know if the first row or first column originally had a zero.

---

## Approaches

### Approach 1: Brute Force (Naive)

**Idea:** For each cell that contains zero, mark its entire row and column to be zeroed. Then make a second pass to zero out all marked rows and columns.

**Problem with this approach:** If we set cells to zero immediately, we might process the same row/column multiple times unnecessarily. Also, if a zero is at `matrix[i][j]`, and we set `matrix[i][0]` to zero, then when we process `matrix[0][0]`, we might incorrectly think row 0 should be zeroed.

**Solution:** Instead of setting to zero immediately, we can mark the cells to be zeroed using a special marker (like setting to `None` or a very large/small number that won't appear in the matrix). Then in a second pass, we convert all marked cells to zero.

**Code:**
```python
def setZeroes_bruteforce(matrix):
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
    
    # Use None as a marker for cells to be zeroed
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == 0:
                # Mark all cells in the same row
                for k in range(n):
                    if matrix[i][k] != 0:
                        matrix[i][k] = None
                # Mark all cells in the same column
                for k in range(m):
                    if matrix[k][j] != 0:
                        matrix[k][j] = None
    
    # Convert all markers to zero
    for i in range(m):
        for j in range(n):
            if matrix[i][j] is None:
                matrix[i][j] = 0
```

**Time Complexity:** O(m * n * (m + n)) - For each zero, we traverse an entire row and column
**Space Complexity:** O(1) - In-place modification

---

### Approach 2: O(m + n) Extra Space

**Idea:** Use two arrays to track which rows and which columns contain zeros. First pass: identify rows and columns with zeros. Second pass: set cells to zero based on these markers.

**Code:**
```python
def setZeroes_extra_space(matrix):
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
    
    # Arrays to track rows and columns with zeros
    rows = [False] * m
    cols = [False] * n
    
    # First pass: mark rows and cols that contain zeros
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == 0:
                rows[i] = True
                cols[j] = True
    
    # Second pass: set cells to zero based on markers
    for i in range(m):
        for j in range(n):
            if rows[i] or cols[j]:
                matrix[i][j] = 0
```

**Time Complexity:** O(m * n)
**Space Complexity:** O(m + n) - Extra space for rows and cols arrays

---

### Approach 3: O(1) Space - In-Place Marking (Optimal)

**Idea:** Use the first row and first column of the matrix itself to mark which rows and columns need to be zeroed. This way, we don't need extra arrays. We just need to handle the first row and first column separately since we're using them as markers.

**Steps:**
1. Check if the first row and first column contain any zeros (store this info)
2. Use the first row and first column as markers for the rest of the matrix
3. For each cell (except first row and column), if it's zero, mark its row in the first column and its column in the first row
4. Use the markers to set cells to zero (excluding first row and column)
5. Handle the first row and first column based on the initial check

**Code:**
```python
def setZeroes_inplace(matrix):
    """
    Modifies the matrix in place to set entire rows and columns to zero
    where a zero is found. Uses O(1) extra space.
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
                matrix[i][0] = 0  # Mark row in first column
                matrix[0][j] = 0  # Mark column in first row
    
    # Set zeros based on markers (excluding first row and column)
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
```

**Time Complexity:** O(m * n)
**Space Complexity:** O(1) - Only using a few extra variables

---

### Approach 4: Modified In-Place with Single Variable

**Idea:** We can optimize Approach 3 by using a single variable to track whether the first row has zeros, instead of storing both `first_row_zero` and `first_col_zero` separately. However, this makes the code less readable and doesn't significantly improve performance.

**Code:**
```python
def setZeroes_optimized(matrix):
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
    
    # Track if first column should be zeroed
    first_col_zero = any(matrix[i][0] == 0 for i in range(m))
    
    # Use first row as marker for columns
    for i in range(1, m):
        for j in range(n):
            if matrix[i][j] == 0:
                matrix[0][j] = 0
    
    # Set cells to zero based on markers
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    
    # Handle first row
    if matrix[0][0] == 0:
        for j in range(n):
            matrix[0][j] = 0

    # Handle first column
    if first_col_zero:
        for i in range(m):
            matrix[i][0] = 0
```

**Time Complexity:** O(m * n)
**Space Complexity:** O(1)

---

## Time and Space Complexity

| Approach | Time Complexity | Space Complexity |
|----------|-----------------|------------------|
| Brute Force | O(m * n * (m + n)) | O(1) |
| O(m + n) Extra Space | O(m * n) | O(m + n) |
| O(1) In-Place (Optimal) | O(m * n) | O(1) |

**Best Approach:** The O(1) in-place marking approach is optimal as it achieves the best space complexity while maintaining the same time complexity as the O(m + n) approach.

---

## Related Problems

1. **[Game of Life (LeetCode 289)](https://leetcode.com/problems/game-of-life/)** - Similar in-place matrix modification problem
2. **[Spiral Matrix (LeetCode 54)](https://leetcode.com/problems/spiral-matrix/)** - Matrix traversal patterns
3. **[Rotate Image (LeetCode 48)](https://leetcode.com/problems/rotate-image/)** - In-place matrix rotation
4. **[Sparse Matrix Operations](https://en.wikipedia.org/wiki/Sparse_matrix)** - Efficient handling of zero values in matrices
5. **[Diagonal Traverse (LeetCode 498)](https://leetcode.com/problems/diagonal-traverse/)** - Matrix diagonal traversal
6. **[Set Matrix Zeroes - LeetCode Discuss](https://leetcode.com/problems/set-matrix-zeroes/)** - Official problem page with community solutions

---

## Video Tutorial Links

1. **[Set Matrix Zeroes - LeetCode 73 - Full Explanation](https://www.youtube.com/watch?v=Ti1u0j7C3y0)** - Comprehensive explanation with multiple approaches
2. **[In-Place Matrix Zero Setting](https://www.youtube.com/watch?v=0uqr0I1d6Y4)** - Visual explanation of the in-place approach
3. **[Coding Interview Question: Set Matrix Zeroes](https://www.youtube.com/watch?v=MAiQSS9wQDs)** - Step-by-step coding solution

---

## Common Pitfalls

- **Overwriting Markers:** Modifying the first row or column before marking can corrupt the indicators; always mark first.
- **First Row/Column Handling:** Forgetting to separately handle the first row and column can lead to incorrect results if they originally contained zeros.
- **Edge Cases:** Matrices with single rows or columns, or entirely zero matrices, require careful boundary checks.
- **Multiple Zeros:** Ensure that marking doesn't interfere with detecting other zeros in the same row/column.
- **In-Place Modification:** Remember that the problem requires in-place modification - don't create a new matrix.

---

## Summary

The Set Matrix Zeroes problem teaches us the importance of:
1. **Space optimization** - Using the input itself to store markers
2. **Two-pass algorithms** - Separating the detection and modification phases
3. **Boundary handling** - Special treatment for edge cases and first row/column
4. **In-place modification** - The challenge of preserving information while modifying the input

