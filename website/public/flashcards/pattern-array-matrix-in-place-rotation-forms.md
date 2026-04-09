## Array/Matrix - In-place Rotation: Forms

What are the different variations of matrix rotation?

<!-- front -->

---

### Form 1: 90° Clockwise (Standard)

```python
def rotate_90_clockwise(matrix):
    """Rotate 90 degrees clockwise."""
    n = len(matrix)
    
    # Transpose
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    # Reverse each row
    for i in range(n):
        matrix[i].reverse()
    
    return matrix
```

**Use case**: Standard image rotation

---

### Form 2: 90° Counter-Clockwise

```python
def rotate_90_counter_clockwise(matrix):
    """Rotate 90 degrees counter-clockwise."""
    n = len(matrix)
    
    # Reverse each row first
    for i in range(n):
        matrix[i].reverse()
    
    # Then transpose
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    return matrix
```

**Use case**: Undo clockwise rotation, mathematical ops

---

### Form 3: 180° Rotation

```python
def rotate_180(matrix):
    """Rotate 180 degrees."""
    n = len(matrix)
    
    # Method 1: Reverse rows then reverse row order
    for row in matrix:
        row.reverse()
    
    for i in range(n // 2):
        matrix[i], matrix[n - 1 - i] = matrix[n - 1 - i], matrix[i]
    
    return matrix
```

**Use case**: Half-turn, double rotation

---

### Form 4: 270° Clockwise (or 90° CCW)

```python
def rotate_270_clockwise(matrix):
    """Rotate 270 degrees clockwise = 90 CCW."""
    # Just call 90 CCW
    return rotate_90_counter_clockwise(matrix)
```

**Use case**: Three-quarter turn

---

### Form 5: Rectangular Matrix (Non-Square)

```python
def rotate_rectangular(matrix):
    """Rotate rectangular matrix - returns new matrix."""
    m, n = len(matrix), len(matrix[0])
    result = [[0] * m for _ in range(n)]
    
    for i in range(m):
        for j in range(n):
            result[j][m - 1 - i] = matrix[i][j]
    
    return result
```

**Note**: Cannot be done in-place, returns new n×m matrix

---

### Form Comparison

| Form | Operations | Result | In-Place |
|------|------------|--------|----------|
| 90° CW | Transpose + Reverse rows | Rotated | Yes (square) |
| 90° CCW | Reverse rows + Transpose | Rotated | Yes (square) |
| 180° | Reverse rows + Reverse order | Rotated | Yes (square) |
| 270° CW | Same as 90° CCW | Rotated | Yes (square) |
| Rectangular | New matrix | n×m from m×n | No |

<!-- back -->
