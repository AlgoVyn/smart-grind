## Binary Search - Rotated Array: Framework

What is the complete code template for binary search on rotated arrays?

<!-- front -->

---

### Framework 1: Search in Rotated Sorted Array

```
┌─────────────────────────────────────────────────────┐
│  BINARY SEARCH - ROTATED ARRAY TEMPLATE              │
├─────────────────────────────────────────────────────┤
│  1. Initialize left = 0, right = n - 1            │
│  2. While left <= right:                            │
│     a. mid = left + (right - left) // 2            │
│     b. If arr[mid] == target: return mid            │
│     c. Determine which half is sorted:              │
│        If arr[left] <= arr[mid]:                    │
│           - Left half is sorted                     │
│           - If target in [arr[left], arr[mid]]:    │
│              right = mid - 1                        │
│           - Else: left = mid + 1                    │
│        Else:                                        │
│           - Right half is sorted                    │
│           - If target in [arr[mid], arr[right]]:   │
│              left = mid + 1                         │
│           - Else: right = mid - 1                   │
│  3. Return -1 (not found)                           │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        
        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1
```

---

### Framework 2: Find Minimum Element

```python
def find_min(nums):
    """Find minimum element in rotated sorted array."""
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        # Compare with right to find minimum
        if nums[mid] > nums[right]:
            # Minimum is in right half
            left = mid + 1
        else:
            # nums[mid] <= nums[right], min is at mid or left
            right = mid
    
    return nums[left]
```

---

### Framework 3: Find Pivot (Rotation Index)

```python
def find_pivot(nums):
    """Find index where array was rotated (index of minimum)."""
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    
    return left
```

---

### Key Pattern Elements

| Check | Condition | Meaning |
|-------|-----------|---------|
| `nums[left] <= nums[mid]` | Left sorted | Target comparison range |
| `nums[mid] > nums[right]` | Pivot in right | Minimum is right of mid |
| `nums[mid] <= nums[right]` | Right sorted | Minimum at or left of mid |

<!-- back -->
