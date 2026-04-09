## Binary Search - On Sorted Array: Framework

What is the complete code template for binary search on sorted arrays?

<!-- front -->

---

### Framework 1: Classic Binary Search Template

```
┌─────────────────────────────────────────────────────┐
│  CLASSIC BINARY SEARCH TEMPLATE                      │
├─────────────────────────────────────────────────────┤
│  1. Initialize left = 0, right = n - 1              │
│  2. While left <= right:                            │
│     a. mid = left + (right - left) // 2             │
│     b. If arr[mid] == target: return mid            │
│     c. If arr[mid] < target: left = mid + 1         │
│        (search right half)                          │
│     d. Else: right = mid - 1                        │
│        (search left half)                           │
│  3. Return -1 (not found)                           │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def binary_search(arr, target):
    """Find index of target in sorted array, or -1 if not found."""
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

### Framework 2: Lower Bound (First >= Target)

```python
def lower_bound(arr, target):
    """Find first index where arr[index] >= target."""
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

### Framework 3: Upper Bound (First > Target)

```python
def upper_bound(arr, target):
    """Find first index where arr[index] > target."""
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

### Key Pattern Elements

| Element | Formula | Purpose |
|---------|---------|---------|
| mid | left + (right-left)//2 | Avoid overflow |
| left movement | mid + 1 | Exclude mid from search |
| right movement | mid or mid - 1 | Depending on variant |
| Loop end | left > right or left == right | Condition check |

<!-- back -->
