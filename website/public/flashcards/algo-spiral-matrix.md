## Spiral Matrix

**Question:** Return matrix elements in spiral order.

<!-- front -->

---

## Answer: Direction Simulation

### Solution
```python
def spiralOrder(matrix):
    if not matrix:
        return []
    
    result = []
    rows, cols = len(matrix), len(matrix[0])
    visited = [[False] * cols for _ in range(rows)]
    
    # Directions: right, down, left, up
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    d = 0  # Start going right
    r, c = 0, 0
    
    for _ in range(rows * cols):
        result.append(matrix[r][c])
        visited[r][c] = True
        
        nr, nc = r + directions[d][0], c + directions[d][1]
        
        if (0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc]):
            r, c = nr, nc
        else:
            d = (d + 1) % 4  # Turn right
            r += directions[d][0]
            c += directions[d][1]
    
    return result
```

### Visual
```
1 2 3
4 5 6
7 8 9

Spiral: 1 → 2 → 3 → 6 → 9 → 8 → 7 → 4 → 5
```

### Alternative: Layer by Layer
```python
def spiral_layer(matrix):
    result = []
    while matrix:
        # Top row
        result.extend(matrix.pop(0))
        # Right column
        if matrix:
            for row in matrix:
                result.append(row.pop())
        # Bottom row (reverse)
        if matrix:
            result.extend(matrix.pop()[::-1])
        # Left column (reverse)
        if matrix:
            for row in matrix[::-1]:
                result.append(row.pop(0))
    return result
```

### Complexity
- **Time:** O(n × m)
- **Space:** O(1) or O(n × m) for visited

<!-- back -->
