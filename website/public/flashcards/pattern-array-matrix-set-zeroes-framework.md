## Array/Matrix - Set Matrix Zeroes: Framework

What is the complete code template for setting matrix zeroes in-place?

<!-- front -->

---

### Framework 1: In-Place Marking

```
┌─────────────────────────────────────────────────────┐
│  SET MATRIX ZEROES - IN-PLACE TEMPLATE                 │
├─────────────────────────────────────────────────────┤
│  1. Check if first row has zero → first_row_zero      │
│  2. Check if first col has zero → first_col_zero       │
│                                                        │
│  3. Use first row/col as markers:                      │
│     For i from 1 to m-1:                               │
│       For j from 1 to n-1:                             │
│         If matrix[i][j] == 0:                          │
│            matrix[i][0] = 0  (mark row)                 │
│            matrix[0][j] = 0  (mark col)                 │
│                                                        │
│  4. Apply zeroes based on markers:                     │
│     For i from 1 to m-1:                               │
│       For j from 1 to n-1:                             │
│         If matrix[i][0] == 0 or matrix[0][j] == 0:    │
│            matrix[i][j] = 0                               │
│                                                        │
│  5. Zero first row if first_row_zero                     │
│  6. Zero first col if first_col_zero                     │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def set_zeroes(matrix):
    """
    Set matrix zeroes in-place with O(1) space.
    LeetCode 73
    Time: O(m*n), Space: O(1)
    """
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][j] == 0 for j in range(n))
    first_col_zero = any(matrix[i][0] == 0 for i in range(m))
    
    # Use first row and column as markers
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0
                matrix[0][j] = 0
    
    # Apply zeroes based on markers
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    
    # Zero first row if needed
    if first_row_zero:
        for j in range(n):
            matrix[0][j] = 0
    
    # Zero first col if needed
    if first_col_zero:
        for i in range(m):
            matrix[i][0] = 0
```

---

### Key Pattern Elements

| Step | Purpose | Why Separate |
|------|---------|--------------|
| Check first row/col | Save state | Markers overwrite |
| Mark in first row/col | O(1) storage | Use matrix itself |
| Apply to inner cells | Main operation | After marking |
| Zero first row/col | Apply saved state | Last step |

<!-- back -->
