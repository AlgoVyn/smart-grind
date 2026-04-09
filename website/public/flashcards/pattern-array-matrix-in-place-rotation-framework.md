## Array/Matrix - In-place Rotation: Framework

What is the complete code template for rotating a matrix 90 degrees clockwise in-place?

<!-- front -->

---

### Framework 1: Rotate 90° Clockwise (Transpose + Reverse)

```
┌─────────────────────────────────────────────────────┐
│  MATRIX ROTATION 90° CLOCKWISE - TEMPLATE              │
├─────────────────────────────────────────────────────┤
│  1. Transpose the matrix                              │
│     For i from 0 to n-1:                              │
│       For j from i to n-1:                            │
│         swap(matrix[i][j], matrix[j][i])              │
│                                                        │
│  2. Reverse each row                                  │
│     For i from 0 to n-1:                              │
│       matrix[i].reverse()                              │
│                                                        │
│  Result: Matrix rotated 90° clockwise                  │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: 90° Clockwise

```python
def rotate(matrix):
    """
    Rotate matrix 90 degrees clockwise in-place.
    LeetCode 48 - Rotate Image
    Time: O(n^2), Space: O(1)
    """
    n = len(matrix)
    
    # Step 1: Transpose - swap across diagonal
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    # Step 2: Reverse each row
    for i in range(n):
        matrix[i].reverse()
    
    return matrix
```

---

### Framework 2: Other Rotations

| Rotation | Operations | Use Case |
|----------|------------|----------|
| 90° CW | Transpose → Reverse rows | Standard rotation |
| 90° CCW | Reverse rows → Transpose | Counter-clockwise |
| 180° | Reverse rows → Reverse cols | Half turn |
| 270° CW | 90° CCW (same as) | Three-quarter turn |

---

### Implementation: All Rotations

```python
def rotate_counter_clockwise(matrix):
    """Rotate 90 degrees counter-clockwise."""
    n = len(matrix)
    # Reverse rows first, then transpose
    for i in range(n):
        matrix[i].reverse()
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    return matrix

def rotate_180(matrix):
    """Rotate 180 degrees."""
    n = len(matrix)
    # Reverse each row
    for i in range(n):
        matrix[i].reverse()
    # Reverse column order (swap rows)
    for i in range(n // 2):
        matrix[i], matrix[n - 1 - i] = matrix[n - 1 - i], matrix[i]
    return matrix
```

---

### Key Pattern Elements

| Element | Purpose | Complexity |
|---------|---------|------------|
| Transpose | Convert rows to columns | O(n²) time, O(1) space |
| Reverse | Adjust orientation | O(n) time, O(1) space |
| In-place | No extra memory | Only swaps, no new arrays |

<!-- back -->
