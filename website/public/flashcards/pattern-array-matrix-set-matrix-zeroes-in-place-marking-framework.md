## Array/Matrix - Set Matrix Zeroes: Framework

What is the complete code template for in-place matrix zero marking?

<!-- front -->

---

### Framework: In-Place Matrix Marking

```
┌────────────────────────────────────────────────────────────────────┐
│  SET MATRIX ZEROES - IN-PLACE MARKING TEMPLATE                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Core Insight: Use first row and column as marker storage            │
│  → Reduces space from O(m+n) to O(1)                                 │
│                                                                      │
│  1. Check first row/column for zeros                                 │
│     - first_row_zero = any(matrix[0][j] == 0 for j in range(n))     │
│     - first_col_zero = any(matrix[i][0] == 0 for i in range(m))     │
│                                                                      │
│  2. Use first row/column to mark zeros:                              │
│     - matrix[i][0] = 0  → row i should be zeroed                     │
│     - matrix[0][j] = 0  → column j should be zeroed                  │
│                                                                      │
│  3. Apply zeros (excluding first row/column):                        │
│     - if matrix[i][0] == 0 or matrix[0][j] == 0:                      │
│         matrix[i][j] = 0                                              │
│                                                                      │
│  4. Zero first row/column if flags were set                          │
│                                                                      │
│  Key: Mark FIRST, then Apply (two-pass approach)                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### Implementation: In-Place Marking (Optimal)

```python
def set_zeroes(matrix):
    """
    Set matrix zeroes using in-place marking.
    LeetCode 73 - Set Matrix Zeroes
    
    Time: O(m*n), Space: O(1)
    """
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
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
    
    # Use first row and column as markers
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0  # Mark row
                matrix[0][j] = 0  # Mark column
    
    # Zero cells based on markers (excluding first row/column)
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    
    # Zero first row if needed
    if first_row_zero:
        for j in range(n):
            matrix[0][j] = 0
    
    # Zero first column if needed
    if first_col_zero:
        for i in range(m):
            matrix[i][0] = 0
```

---

### Key Framework Elements

| Element | Purpose | When Set |
|---------|---------|----------|
| `matrix[i][0] = 0` | Mark row i for zeroing | When any cell in row i is 0 |
| `matrix[0][j] = 0` | Mark column j for zeroing | When any cell in column j is 0 |
| `first_row_zero` | Track if row 0 itself needs zeroing | When any cell in first row is 0 |
| `first_col_zero` | Track if column 0 itself needs zeroing | When any cell in first column is 0 |

---

### Decision Tree: Which Approach?

```
Space constraints?
├── O(1) space required (strict)
│   └── Use: In-place marking with first row/column
│   └── Time: O(m×n), Space: O(1)
│
├── O(m+n) space acceptable
│   └── Use: Separate row/col tracking arrays
│   └── Time: O(m×n), Space: O(m+n)
│   └── Simpler code, easier to understand
│
└── Cannot modify input at all
    └── Use: Create copy + O(m+n) tracking
    └── Time: O(m×n), Space: O(m×n)
```

<!-- back -->
