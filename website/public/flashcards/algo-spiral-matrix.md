## Spiral Matrix

**Question:** Return matrix elements in spiral order?

<!-- front -->

---

## Answer: Layer-by-Layer Traversal

### Solution
```python
def spiralOrder(matrix):
    if not matrix:
        return []
    
    result = []
    rows = len(matrix)
    cols = len(matrix[0])
    
    top, bottom = 0, rows - 1
    left, right = 0, cols - 1
    
    while top <= bottom and left <= right:
        # Top row
        for col in range(left, right + 1):
            result.append(matrix[top][col])
        top += 1
        
        # Right column
        for row in range(top, bottom + 1):
            result.append(matrix[row][right])
        right -= 1
        
        # Bottom row
        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])
            bottom -= 1
        
        # Left column
        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])
            left += 1
    
    return result
```

### Visual: Spiral Traversal
```
1 → 2 → 3
        ↓
4 → 5   6
↑       ↓
7 ← 8 ← 9

Order: 1,2,3,6,9,8,7,4,5
```

### ⚠️ Tricky Parts

#### 1. Boundary Updates
```python
# After top row: top += 1
# After right col: right -= 1
# After bottom row: bottom -= 1
# After left col: left += 1
```

#### 2. When to Skip Rows/Cols
```python
# Check bottom row: if top <= bottom
# Check left col: if left <= right

# Prevents duplicate elements in single row/col cases
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Layer traversal | O(m × n) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not updating boundaries | Update each direction |
| Duplicate elements | Check bounds before bottom/left |
| Wrong loop direction | Use correct ranges |

<!-- back -->
