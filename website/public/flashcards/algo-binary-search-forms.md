## Binary Search: Problem Forms

What are the different problem forms and variations of binary search?

<!-- front -->

---

### Array Search Variants

| Variant | Description | Pattern |
|---------|-------------|---------|
| **Exact match** | Find target | `arr[mid] == target` |
| **First occurrence** | Leftmost target | Lower bound |
| **Last occurrence** | Rightmost target | Upper bound - 1 |
| **Insertion point** | Where to insert | Lower bound |
| **Predecessor** | Largest < target | Lower bound - 1 |
| **Successor** | Smallest > target | Upper bound |

---

### Search on Answer

**Pattern:** Answer has monotonic property - can verify if answer ≥ x

```python
def search_on_answer(min_val, max_val, is_valid):
    """
    Find minimum x such that is_valid(x) is True
    Assumes: is_valid is monotonic (False...False True...True)
    """
    left, right = min_val, max_val
    
    while left < right:
        mid = left + (right - left) // 2
        if is_valid(mid):
            right = mid  # Can try smaller
        else:
            left = mid + 1  # Need larger
    
    return left if is_valid(left) else -1

# Examples:
# - Minimum capacity to ship packages in D days
# - Minimum eating speed to finish bananas
# - Minimum maximum in split array
```

---

### 2D Binary Search

**Search in sorted matrix:**
```python
def search_matrix(matrix, target):
    """
    Matrix: each row sorted, each column sorted
    """
    rows, cols = len(matrix), len(matrix[0])
    row, col = 0, cols - 1  # Start top-right
    
    while row < rows and col >= 0:
        if matrix[row][col] == target:
            return (row, col)
        elif matrix[row][col] < target:
            row += 1  # Too small, go down
        else:
            col -= 1  # Too large, go left
    
    return None
```

---

### Binary Search on Functions

| Problem | Function | Search Space |
|---------|----------|--------------|
| **Square root** | f(x) = x² | [0, n] or [0, n] float |
| **Monotone function root** | f(x) = 0 | Domain of f |
| **Rate of convergence** | f(iterations) | Integer iterations |
| **Parametric search** | Decision problem | Parameter range |

```python
def sqrt_binary_search(n, precision=1e-9):
    """Floating point binary search"""
    left, right = 0, max(1, n)
    
    while right - left > precision:
        mid = (left + right) / 2
        if mid * mid < n:
            left = mid
        else:
            right = mid
    
    return (left + right) / 2
```

---

### Exponential Search

When target is near beginning:

```python
def exponential_search(arr, target):
    """O(log n) when target is at position i = O(log i)"""
    n = len(arr)
    
    # Find range by repeated doubling
    bound = 1
    while bound < n and arr[bound] < target:
        bound *= 2
    
    # Binary search in found range
    left, right = bound // 2, min(bound, n - 1)
    
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
```

<!-- back -->
