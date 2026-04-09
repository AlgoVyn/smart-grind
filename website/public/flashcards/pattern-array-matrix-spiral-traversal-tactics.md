## Array/Matrix - Spiral Traversal: Tactics

What are the advanced techniques for spiral matrix traversal?

<!-- front -->

---

### Tactic 1: Direction Array Pattern

Use direction vectors for cleaner code:

```python
def spiral_direction_vectors(matrix):
    """Spiral using direction vectors."""
    if not matrix or not matrix[0]:
        return []
    
    m, n = len(matrix), len(matrix[0])
    result = []
    
    # Directions: right, down, left, up
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    dir_idx = 0
    
    row, col = 0, 0
    visited = [[False] * n for _ in range(m)]
    
    for _ in range(m * n):
        result.append(matrix[row][col])
        visited[row][col] = True
        
        # Calculate next position
        next_row = row + directions[dir_idx][0]
        next_col = col + directions[dir_idx][1]
        
        # Change direction if needed
        if (next_row < 0 or next_row >= m or 
            next_col < 0 or next_col >= n or 
            visited[next_row][next_col]):
            dir_idx = (dir_idx + 1) % 4
            next_row = row + directions[dir_idx][0]
            next_col = col + directions[dir_idx][1]
        
        row, col = next_row, next_col
    
    return result
```

---

### Tactic 2: Layer-by-Layer Recursive

```python
def spiral_recursive(matrix):
    """Recursive layer approach."""
    if not matrix or not matrix[0]:
        return []
    
    result = []
    
    def process_layer(top, left, bottom, right):
        if top > bottom or left > right:
            return
        
        # Top row
        for col in range(left, right + 1):
            result.append(matrix[top][col])
        
        # Right column (excluding top)
        for row in range(top + 1, bottom + 1):
            result.append(matrix[row][right])
        
        # Bottom row (if different from top)
        if top < bottom:
            for col in range(right - 1, left - 1, -1):
                result.append(matrix[bottom][col])
        
        # Left column (if different from right)
        if left < right:
            for row in range(bottom - 1, top, -1):
                result.append(matrix[row][left])
        
        # Process inner layer
        process_layer(top + 1, left + 1, bottom - 1, right - 1)
    
    process_layer(0, 0, len(matrix) - 1, len(matrix[0]) - 1)
    return result
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Missing boundary checks | Duplicate elements | Check `top <= bottom` before left/up |
| Wrong loop ranges | Off-by-one | Use `range(left, right + 1)` |
| Not updating boundaries | Infinite loop | Update top/bottom/left/right after each |
| Reverse order wrong | Wrong spiral direction | `range(right, left - 1, -1)` |
| Single row/column | Extra elements | Boundary checks handle edge cases |

---

### Tactic 4: Counter-Clockwise Spiral

```python
def spiral_counter_clockwise(matrix):
    """Counter-clockwise spiral: down → right → up → left."""
    if not matrix or not matrix[0]:
        return []
    
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        # Down along left column
        for row in range(top, bottom + 1):
            result.append(matrix[row][left])
        left += 1
        
        # Right along bottom row
        if top <= bottom:
            for col in range(left, right + 1):
                result.append(matrix[bottom][col])
            bottom -= 1
        
        # Up along right column
        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][right])
            right -= 1
        
        # Left along top row
        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[top][col])
            top += 1
    
    return result
```

---

### Tactic 5: Spiral Diagonal Sum

```python
def spiral_diagonal_sum(matrix):
    """Sum elements on diagonals in spiral layers."""
    if not matrix:
        return 0
    
    n = len(matrix)
    total = 0
    
    # For each layer, sum corners
    for layer in range((n + 1) // 2):
        # Four corners of current layer
        top_left = matrix[layer][layer]
        top_right = matrix[layer][n - 1 - layer]
        bottom_left = matrix[n - 1 - layer][layer]
        bottom_right = matrix[n - 1 - layer][n - 1 - layer]
        
        # Add unique corners
        corners = {top_left, top_right, bottom_left, bottom_right}
        total += sum(corners)
    
    return total
```

<!-- back -->
