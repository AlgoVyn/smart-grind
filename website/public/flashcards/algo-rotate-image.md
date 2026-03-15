## Rotate Image

**Question:** Rotate an n×n matrix 90 degrees clockwise in-place.

<!-- front -->

---

## Answer: Transpose + Reverse Rows

### Solution
```python
def rotate(matrix):
    n = len(matrix)
    
    # Transpose
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    # Reverse each row
    for i in range(n):
        matrix[i].reverse()
```

### Visual
```
Original:     Transpose:    Reverse:
1 2 3         1 4 7         7 4 1
4 5 6    →    2 5 8    →   8 5 2
7 8 9         3 6 9         9 6 3
```

### Alternative: Rotate 4 Cells at a Time
```python
def rotate_alt(matrix):
    n = len(matrix)
    for i in range(n // 2):
        for j in range(n - 1 - i * 2):
            temp = matrix[i][j]
            # Top-left → Top-right
            matrix[i][j] = matrix[n-1-j][i]
            # Top-right → Bottom-right
            matrix[n-1-j][i] = matrix[n-1-i][n-1-j]
            # Bottom-right → Bottom-left
            matrix[n-1-i][n-1-j] = matrix[j][n-1-i]
            # Bottom-left → Top-left
            matrix[j][n-1-i] = temp
```

### Complexity
- **Time:** O(n²)
- **Space:** O(1)

### Key Insight
90° clockwise = transpose + reverse rows

<!-- back -->
