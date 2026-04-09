## Binary Search - On Sorted Array: Tactics

What are the advanced techniques for binary search?

<!-- front -->

---

### Tactic 1: Avoiding Integer Overflow

**Problem**: `left + right` can overflow in some languages

**Solution**: Use `left + (right - left) // 2`

```python
# Safe
mid = left + (right - left) // 2

# Alternative (bit shift)
mid = (left + right) >> 1

# Python-specific (no overflow issue with arbitrary precision)
mid = (left + right) // 2  # OK in Python
```

---

### Tactic 2: Inclusive vs Exclusive Bounds

| Variant | Initial Right | Loop Condition | Mid Assignment |
|---------|-------------|----------------|----------------|
| **Inclusive** | len - 1 | left <= right | left=mid+1, right=mid-1 |
| **Exclusive** | len | left < right | left=mid+1, right=mid |

**Exclusive variant (lower bound)**:
```python
def lower_bound_exclusive(arr, target):
    left, right = 0, len(arr)
    
    while left < right:
        mid = left + (right - left) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid  # Keep mid as candidate
    
    return left
```

---

### Tactic 3: Finding Closest Element

```python
def find_closest(arr, target):
    """Find index of element closest to target."""
    if target <= arr[0]:
        return 0
    if target >= arr[-1]:
        return len(arr) - 1
    
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    # left > right, check which is closer
    if abs(arr[left] - target) < abs(arr[right] - target):
        return left
    return right
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Infinite loop** | left = mid when mid = left | Use left = mid + 1 or proper condition |
| **Off-by-one** | Wrong boundary | Test with small arrays |
| **Overflow** | left + right overflow | Use left + (right-left)//2 |
| **Not found handling** | Wrong return value | Define behavior explicitly |
| **Empty array** | Index error | Check len(arr) > 0 |

---

### Tactic 5: Binary Search on Matrix

```python
def search_matrix(matrix, target):
    """Search in sorted 2D matrix."""
    if not matrix or not matrix[0]:
        return False
    
    rows, cols = len(matrix), len(matrix[0])
    left, right = 0, rows * cols - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        row, col = mid // cols, mid % cols
        
        if matrix[row][col] == target:
            return True
        elif matrix[row][col] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return False
```

---

### Tactic 6: Lower Bound Applications

| Problem | Use |
|---------|-----|
| Count occurrences | upper_bound - lower_bound |
| First >= x | lower_bound(x) |
| Last <= x | upper_bound(x) - 1 |
| Ceiling | lower_bound(x) |
| Floor | upper_bound(x) - 1 |

<!-- back -->
