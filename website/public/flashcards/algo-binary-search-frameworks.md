## Binary Search: Algorithm Framework

What are the standard binary search patterns, and how do you handle different search variants?

<!-- front -->

---

### Classic Binary Search

```python
def binary_search(arr, target):
    """
    Returns: index of target, or -1 if not found
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2  # Avoid overflow
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
```

---

### Lower Bound (First ≥ target)

```python
def lower_bound(arr, target):
    """
    Returns: first index where arr[i] >= target
             (or len(arr) if all elements < target)
    """
    left, right = 0, len(arr)
    
    while left < right:
        mid = left + (right - left) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    
    return left
```

---

### Upper Bound (First > target)

```python
def upper_bound(arr, target):
    """
    Returns: first index where arr[i] > target
    """
    left, right = 0, len(arr)
    
    while left < right:
        mid = left + (right - left) // 2
        if arr[mid] <= target:
            left = mid + 1
        else:
            right = mid
    
    return left
```

---

### Find Range (First and Last occurrence)

```python
def find_range(arr, target):
    """
    Returns: (first_index, last_index) or (-1, -1)
    """
    first = lower_bound(arr, target)
    
    if first == len(arr) or arr[first] != target:
        return (-1, -1)
    
    last = upper_bound(arr, target) - 1
    return (first, last)
```

---

### Template Comparison

| Template | Invariant | Termination | Use For |
|----------|-----------|-------------|---------|
| `left <= right` | [left, right] valid | left > right | Finding exact element |
| `left < right` | answer in [left, right] | left == right | Finding boundary |
| `left + 1 < right` | answer between | left + 1 == right | Precise control |

**Key difference:** `right = len(arr)` vs `right = len(arr) - 1`

<!-- back -->
