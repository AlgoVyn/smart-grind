## Rotate Image

**Question:** Rotate matrix 90 degrees clockwise in-place?

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

### Alternative: Four-Way Swap
```python
def rotateFour(matrix):
    n = len(matrix)
    
    for i in range(n // 2 + n % 2):
        for j in range(n // 2):
            # Save top
            temp = matrix[i][j]
            
            # Left → Top
            matrix[i][j] = matrix[n - 1 - j][i]
            
            # Bottom → Left  
            matrix[n - 1 - j][i] = matrix[n - 1 - i][n - 1 - j]
            
            # Right → Bottom
            matrix[n - 1 - i][n - 1 - j] = matrix[j][n - 1 - i]
            
            # Top → Right
            matrix[j][n - 1 - i] = temp
```

### Visual: Transpose + Reverse
```
Original:      Transpose:    Reverse rows:
1 2 3         1 4 7         7 4 1
4 5 6    →    2 5 8    →    8 5 2
7 8 9         3 6 9         9 6 3
```

### ⚠️ Tricky Parts

#### 1. Why Transpose + Reverse Works?
```python
# Transpose: swap (i,j) with (j,i)
# Row i becomes column i

# Reverse each row: reverses each row
# After transpose, column i was row i
# Reversing makes column i appear in right order

# Result: 90° clockwise rotation
```

#### 2. In-Place Requirement
```python
# First approach: O(n²) time, O(1) space
# Only uses swaps

# Four-way swap: more complex but elegant
# Only uses one temp variable
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Transpose + Reverse | O(n²) | O(1) |
| Four-way swap | O(n²) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong transpose | Swap upper triangle only |
| Wrong reverse | Reverse each row |
| Using new matrix | Modify in-place |

<!-- back -->
