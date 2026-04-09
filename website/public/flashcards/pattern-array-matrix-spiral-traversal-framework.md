## Array/Matrix - Spiral Traversal: Framework

What is the complete code template for spiral matrix traversal?

<!-- front -->

---

### Framework 1: Boundary Shrinkage Template

```
┌─────────────────────────────────────────────────────┐
│  SPIRAL TRAVERSAL - TEMPLATE                           │
├─────────────────────────────────────────────────────┤
│  1. Initialize four boundaries:                        │
│     top = 0, bottom = m - 1                           │
│     left = 0, right = n - 1                           │
│                                                        │
│  2. While top <= bottom AND left <= right:            │
│     a. Traverse right: top row, left to right         │
│        top++                                           │
│     b. Traverse down: right column, top to bottom       │
│        right--                                         │
│     c. If top <= bottom:                               │
│        Traverse left: bottom row, right to left       │
│        bottom--                                        │
│     d. If left <= right:                               │
│        Traverse up: left column, bottom to top         │
│        left++                                          │
│                                                        │
│  3. Return result list                                 │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Spiral Order

```python
def spiral_order(matrix):
    """
    Return elements of matrix in spiral order.
    LeetCode 54 - Spiral Matrix
    Time: O(m*n), Space: O(1) excluding output
    """
    if not matrix or not matrix[0]:
        return []
    
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        # Traverse right along top row
        for col in range(left, right + 1):
            result.append(matrix[top][col])
        top += 1
        
        # Traverse down along right column
        for row in range(top, bottom + 1):
            result.append(matrix[row][right])
        right -= 1
        
        # Traverse left along bottom row (if valid)
        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])
            bottom -= 1
        
        # Traverse up along left column (if valid)
        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])
            left += 1
    
    return result
```

---

### Implementation: Generate Spiral Matrix

```python
def generate_spiral(n):
    """Generate n x n matrix filled 1 to n² in spiral order."""
    matrix = [[0] * n for _ in range(n)]
    top, bottom = 0, n - 1
    left, right = 0, n - 1
    num = 1
    
    while top <= bottom and left <= right:
        # Right
        for col in range(left, right + 1):
            matrix[top][col] = num
            num += 1
        top += 1
        
        # Down
        for row in range(top, bottom + 1):
            matrix[row][right] = num
            num += 1
        right -= 1
        
        # Left
        if top <= bottom:
            for col in range(right, left - 1, -1):
                matrix[bottom][col] = num
                num += 1
            bottom -= 1
        
        # Up
        if left <= right:
            for row in range(bottom, top - 1, -1):
                matrix[row][left] = num
                num += 1
            left += 1
    
    return matrix
```

---

### Key Pattern Elements

| Element | Purpose | Update Rule |
|---------|---------|-------------|
| `top` | Upper boundary | ++ after right traverse |
| `bottom` | Lower boundary | -- after left traverse |
| `left` | Left boundary | ++ after up traverse |
| `right` | Right boundary | -- after down traverse |
| Boundary checks | Prevent duplicates | `if top <= bottom`, `if left <= right` |

<!-- back -->
