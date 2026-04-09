## Binary Search - First Last Occurrence: Forms

What are the different variations of first/last occurrence search?

<!-- front -->

---

### Form 1: First Occurrence

```python
def find_first(arr, target):
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            result = mid
            right = mid - 1
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result
```

---

### Form 2: Last Occurrence

```python
def find_last(arr, target):
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            result = mid
            left = mid + 1
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result
```

---

### Form 3: Using bisect Module

```python
import bisect

def find_range_bisect(arr, target):
    """Pythonic way using bisect."""
    left = bisect.bisect_left(arr, target)
    right = bisect.bisect_right(arr, target) - 1
    
    if left <= right and arr[left] == target:
        return [left, right]
    return [-1, -1]
```

---

### Form 4: Count Occurrences

```python
def count_occurrences(arr, target):
    """Count total occurrences of target."""
    first = find_first(arr, target)
    
    if first == -1:
        return 0
    
    last = find_last(arr, target)
    return last - first + 1
```

---

### Form 5: Lower and Upper Bound

```python
def lower_bound(arr, target):
    """First index >= target."""
    left, right = 0, len(arr)
    
    while left < right:
        mid = (left + right) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    
    return left

def upper_bound(arr, target):
    """First index > target."""
    left, right = 0, len(arr)
    
    while left < right:
        mid = (left + right) // 2
        if arr[mid] <= target:
            left = mid + 1
        else:
            right = mid
    
    return left
```

---

### Form Comparison

| Form | Returns | Use Case |
|------|---------|----------|
| First | Leftmost index | Find start of range |
| Last | Rightmost index | Find end of range |
| Range | [first, last] | Complete range info |
| Count | Number | How many occurrences |
| Bounds | Insert positions | STL-style boundaries |

<!-- back -->
