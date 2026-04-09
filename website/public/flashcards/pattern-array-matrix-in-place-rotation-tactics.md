## Array/Matrix - In-place Rotation: Tactics

What are the advanced techniques for matrix rotation?

<!-- front -->

---

### Tactic 1: Layer-by-Layer Rotation (Alternative)

When you can't use transpose + reverse, rotate by layers:

```python
def rotate_layer_by_layer(matrix):
    """Rotate by processing concentric layers."""
    n = len(matrix)
    
    for layer in range(n // 2):
        first, last = layer, n - 1 - layer
        
        for i in range(first, last):
            offset = i - first
            
            # Save top
            top = matrix[first][i]
            
            # Left -> Top
            matrix[first][i] = matrix[last - offset][first]
            
            # Bottom -> Left
            matrix[last - offset][first] = matrix[last][last - offset]
            
            # Right -> Bottom
            matrix[last][last - offset] = matrix[i][last]
            
            # Top -> Right
            matrix[i][last] = top
    
    return matrix
```

**Use when**: Need to understand rotation mechanics deeply

---

### Tactic 2: Multiple Rotations Efficiently

```python
def rotate_by_k(matrix, k):
    """Rotate k times efficiently (k mod 4)."""
    k = k % 4  # 4 rotations = original
    
    for _ in range(k):
        # Transpose
        n = len(matrix)
        for i in range(n):
            for j in range(i, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        # Reverse rows
        for i in range(n):
            matrix[i].reverse()
    
    return matrix
```

**Optimization**: k = 2 is same as 180° (reverse rows then reverse columns)

---

### Tactic 3: Rectangular Matrix Rotation

For non-square matrices (m × n), transpose then reverse each row:

```python
def rotate_rectangular(matrix):
    """Rotate rectangular matrix - requires new matrix."""
    m, n = len(matrix), len(matrix[0])
    # Result is n × m
    result = [[0] * m for _ in range(n)]
    
    for i in range(m):
        for j in range(n):
            result[j][m - 1 - i] = matrix[i][j]
    
    return result
```

**Note**: Rectangular can't be done in-place, needs new matrix

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Wrong transpose range | Swapping twice | `j in range(i, n)` not `range(n)` |
| Forgetting to reverse | Only transposed | Add reverse step |
| Wrong reverse direction | CCW instead of CW | Reverse rows for CW, cols for CCW |
| Assuming rectangular works | Non-square fails | Use new matrix for rectangular |

---

### Tactic 5: 180° Rotation Shortcut

```python
def rotate_180_optimized(matrix):
    """180° = reverse all rows, then reverse row order."""
    n = len(matrix)
    
    # Reverse each row
    for row in matrix:
        row.reverse()
    
    # Reverse row order (swap i with n-1-i)
    for i in range(n // 2):
        matrix[i], matrix[n - 1 - i] = matrix[n - 1 - i], matrix[i]
    
    return matrix
```

---

### Tactic 6: In-Place Transpose Index Calculation

```python
def transpose_inplace(matrix):
    """Understand the index swap pattern."""
    n = len(matrix)
    
    for i in range(n):
        for j in range(i + 1, n):  # Start from i+1 to avoid double swap
            # (i,j) and (j,i) are symmetric across diagonal
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    return matrix
```

**Key**: Only process above diagonal to avoid swapping back!

<!-- back -->
