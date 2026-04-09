## Binary Search - First Last Occurrence: Tactics

What are the advanced techniques for first/last occurrence search?

<!-- front -->

---

### Tactic 1: Unified Bound Function

```python
def bound(arr, target, find_first):
    """Unified function for both bounds."""
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            result = mid
            if find_first:
                right = mid - 1
            else:
                left = mid + 1
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result

# Usage
first = bound(arr, target, True)
last = bound(arr, target, False)
```

---

### Tactic 2: Finding Insertion Points

| Function | STL Equivalent | Returns |
|----------|---------------|---------|
| `bisect_left` | `lower_bound` | First >= target |
| `bisect_right` | `upper_bound` | First > target |

```python
import bisect

# Insert maintaining sorted order
arr = [1, 2, 4, 5]
pos = bisect.bisect_left(arr, 3)  # pos = 2
arr.insert(pos, 3)  # [1, 2, 3, 4, 5]

# Find position of existing element
pos = bisect.bisect_left(arr, 4)  # pos = 3
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Returning mid directly** | Not finding boundary | Save result, continue searching |
| **Wrong direction after find** | First goes right or last goes left | First: go left, Last: go right |
| **Not initializing result** | Returns wrong value | Initialize to -1 |
| **Off-by-one loop** | Missing elements | Use `left <= right` |

---

### Tactic 4: Finding Floor and Ceiling

```python
def floor(arr, target):
    """Largest element <= target."""
    idx = bisect.bisect_right(arr, target) - 1
    return arr[idx] if idx >= 0 else None

def ceiling(arr, target):
    """Smallest element >= target."""
    idx = bisect.bisect_left(arr, target)
    return arr[idx] if idx < len(arr) else None
```

---

### Tactic 5: Search in Nearly Sorted Array

```python
def search_nearly_sorted(arr, target):
    """Array where element i might be at i, i-1, or i+1."""
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        if mid > left and arr[mid - 1] == target:
            return mid - 1
        if mid < right and arr[mid + 1] == target:
            return mid + 1
        
        if arr[mid] < target:
            left = mid + 2
        else:
            right = mid - 2
    
    return -1
```

<!-- back -->
