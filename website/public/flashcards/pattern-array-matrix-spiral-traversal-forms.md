## Array/Matrix - Spiral Traversal: Forms

What are the different variations of spiral traversal?

<!-- front -->

---

### Form 1: Clockwise Spiral (Standard)

```python
def spiral_clockwise(matrix):
    """Standard clockwise spiral: right → down → left → up."""
    if not matrix or not matrix[0]:
        return []
    
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        # Right
        for c in range(left, right + 1):
            result.append(matrix[top][c])
        top += 1
        
        # Down
        for r in range(top, bottom + 1):
            result.append(matrix[r][right])
        right -= 1
        
        # Left
        if top <= bottom:
            for c in range(right, left - 1, -1):
                result.append(matrix[bottom][c])
            bottom -= 1
        
        # Up
        if left <= right:
            for r in range(bottom, top - 1, -1):
                result.append(matrix[r][left])
            left += 1
    
    return result
```

---

### Form 2: Generate Spiral Matrix

```python
def generate_spiral(n):
    """Generate n×n matrix with 1 to n² in spiral order."""
    matrix = [[0] * n for _ in range(n)]
    top, bottom = 0, n - 1
    left, right = 0, n - 1
    num = 1
    
    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            matrix[top][c] = num
            num += 1
        top += 1
        
        for r in range(top, bottom + 1):
            matrix[r][right] = num
            num += 1
        right -= 1
        
        if top <= bottom:
            for c in range(right, left - 1, -1):
                matrix[bottom][c] = num
                num += 1
            bottom -= 1
        
        if left <= right:
            for r in range(bottom, top - 1, -1):
                matrix[r][left] = num
                num += 1
            left += 1
    
    return matrix
```

---

### Form 3: Counter-Clockwise Spiral

```python
def spiral_counter_clockwise(matrix):
    """Counter-clockwise: down → right → up → left."""
    if not matrix or not matrix[0]:
        return []
    
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        # Down first
        for r in range(top, bottom + 1):
            result.append(matrix[r][left])
        left += 1
        
        if top <= bottom:
            for c in range(left, right + 1):
                result.append(matrix[bottom][c])
            bottom -= 1
        
        if left <= right:
            for r in range(bottom, top - 1, -1):
                result.append(matrix[r][right])
            right -= 1
        
        if top <= bottom:
            for c in range(right, left - 1, -1):
                result.append(matrix[top][c])
            top += 1
    
    return result
```

---

### Form 4: Layer Sum (Diagonals)

```python
def spiral_layer_sum(matrix):
    """Sum elements layer by layer."""
    if not matrix:
        return 0
    
    n = len(matrix)
    total = 0
    
    for layer in range((n + 1) // 2):
        # Sum all elements in current layer
        top, bottom = layer, n - 1 - layer
        left, right = layer, n - 1 - layer
        
        if top == bottom:  # Single element
            total += matrix[top][left]
        elif left == right:  # Single column
            total += sum(matrix[r][left] for r in range(top, bottom + 1))
        else:
            # Top + Bottom + Left + Right (corners counted once)
            layer_sum = (sum(matrix[top][left:right+1]) +           # Top
                        sum(matrix[bottom][left:right+1]) +         # Bottom
                        sum(matrix[r][left] for r in range(top+1, bottom)) +   # Left
                        sum(matrix[r][right] for r in range(top+1, bottom)))   # Right
            total += layer_sum
    
    return total
```

---

### Form Comparison

| Form | Direction | Output | Use Case |
|------|-----------|--------|----------|
| Clockwise | R → D → L → U | List | Standard traversal |
| Generate | R → D → L → U | Matrix | Create spiral pattern |
| CCW | D → R → U → L | List | Alternative direction |
| Layer Sum | By layer | Integer | Aggregate calculations |

<!-- back -->
