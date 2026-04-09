## Array/Matrix - Set Matrix Zeroes: Tactics

What are the advanced techniques for setting matrix zeroes?

<!-- front -->

---

### Tactic 1: O(m+n) Space Solution

```python
def set_zeroes_simple(matrix):
    """Simpler O(m+n) space solution for understanding."""
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
    rows = set()
    cols = set()
    
    # Mark rows and columns
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == 0:
                rows.add(i)
                cols.add(j)
    
    # Apply zeroes
    for i in range(m):
        for j in range(n):
            if i in rows or j in cols:
                matrix[i][j] = 0
```

---

### Tactic 2: Single Boolean Variable Optimization

```python
def set_zeroes_optimized(matrix):
    """Use only one extra variable for first column."""
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
    first_col_zero = False
    
    # Check first column
    for i in range(m):
        if matrix[i][0] == 0:
            first_col_zero = True
            break
    
    # Use first row and column as markers
    for i in range(m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0
                matrix[0][j] = 0
    
    # Apply from bottom-right to avoid overwriting markers
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, 0, -1):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    
    # Handle first column
    if first_col_zero:
        for i in range(m):
            matrix[i][0] = 0
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Zeroing first row/col early | Lose markers | Save flags first |
| Not checking first row/col initially | Missing zeroes | Check before using as markers |
| Wrong order of operations | Overwrite | Mark → Apply → Handle first row/col |
| Using extra space | Violates constraint | Use matrix itself |

<!-- back -->
