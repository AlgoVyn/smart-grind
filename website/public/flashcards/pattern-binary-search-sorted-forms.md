## Binary Search - On Sorted Array: Forms

What are the different variations of binary search on sorted arrays?

<!-- front -->

---

### Form 1: Classic Search

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
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

---

### Form 2: Find First Occurrence

```python
def find_first(arr, target):
    """Find first index of target (leftmost)."""
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            result = mid
            right = mid - 1  # Continue searching left
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result
```

---

### Form 3: Find Last Occurrence

```python
def find_last(arr, target):
    """Find last index of target (rightmost)."""
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            result = mid
            left = mid + 1  # Continue searching right
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result
```

---

### Form 4: Search Insert Position

```python
def search_insert(arr, target):
    """Find index to insert target to maintain sorted order."""
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

### Form 5: Find Peak Element

```python
def find_peak_element(arr):
    """Find index of any peak element."""
    left, right = 0, len(arr) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        if arr[mid] > arr[mid + 1]:
            right = mid
        else:
            left = mid + 1
    
    return left
```

---

### Form Comparison

| Form | Condition | Movement | Returns |
|------|-----------|----------|---------|
| Classic | == target | Either | Index or -1 |
| First | == target | Left first | Leftmost index |
| Last | == target | Right first | Rightmost index |
| Insert | < target | Left | Insert position |
| Peak | > neighbor | Toward peak | Peak index |

<!-- back -->
