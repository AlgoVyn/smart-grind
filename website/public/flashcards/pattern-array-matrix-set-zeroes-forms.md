## Array/Matrix - Set Matrix Zeroes: Forms

What are the different variations of setting matrix zeroes?

<!-- front -->

---

### Form 1: O(1) Space In-Place

```python
def set_zeroes_inplace(matrix):
    """O(1) space using first row/col as markers."""
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][j] == 0 for j in range(n))
    first_col_zero = any(matrix[i][0] == 0 for i in range(m))
    
    # Mark using first row/col
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = matrix[0][j] = 0
    
    # Apply to inner cells
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    
    # Handle first row/col
    if first_row_zero:
        for j in range(n):
            matrix[0][j] = 0
    if first_col_zero:
        for i in range(m):
            matrix[i][0] = 0
```

---

### Form 2: O(m+n) Space with Sets

```python
def set_zeroes_with_sets(matrix):
    """O(m+n) space - simpler to understand."""
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
    zero_rows, zero_cols = set(), set()
    
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == 0:
                zero_rows.add(i)
                zero_cols.add(j)
    
    for i in range(m):
        for j in range(n):
            if i in zero_rows or j in zero_cols:
                matrix[i][j] = 0
```

---

### Form 3: With Copy (Don't Modify Input)

```python
def set_zeroes_copy(matrix):
    """Return new matrix without modifying input."""
    if not matrix or not matrix[0]:
        return [[]]
    
    m, n = len(matrix), len(matrix[0])
    rows, cols = set(), set()
    
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == 0:
                rows.add(i)
                cols.add(j)
    
    result = [row[:] for row in matrix]  # Deep copy
    for i in range(m):
        for j in range(n):
            if i in rows or j in cols:
                result[i][j] = 0
    
    return result
```

---

### Form Comparison

| Form | Space | Modifies Input | Use Case |
|------|-------|----------------|----------|
| In-place | O(1) | Yes | Space constrained |
| Sets | O(m+n) | Yes | Clarity |
| Copy | O(m×n) | No | Preserve input |

<!-- back -->
