## Binary Search - On Sorted Array/List: Framework

What is the complete code template for standard binary search on a sorted array?

<!-- front -->

---

### Framework: Standard Binary Search Template

```
┌─────────────────────────────────────────────────────────┐
│  STANDARD BINARY SEARCH - TEMPLATE                       │
├─────────────────────────────────────────────────────────┤
│  Initialize: low = 0, high = len(nums) - 1               │
│                                                          │
│  while low <= high:                                      │
│    mid = low + (high - low) // 2  # Prevent overflow     │
│                                                          │
│    if nums[mid] == target:                               │
│       return mid                    # Found!           │
│    elif nums[mid] < target:                              │
│       low = mid + 1                 # Search right     │
│    else:                                                 │
│       high = mid - 1                  # Search left      │
│                                                          │
│  return -1                          # Not found          │
└─────────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def binary_search(nums: List[int], target: int) -> int:
    """
    Standard binary search for finding an element in a sorted array.
    Time: O(log n), Space: O(1)
    """
    low, high = 0, len(nums) - 1
    
    while low <= high:
        mid = low + (high - low) // 2  # Prevent integer overflow
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    
    return -1
```

---

### Key Framework Elements

| Element | Value | Purpose |
|---------|-------|---------|
| `low` | `0` | Start of search range |
| `high` | `len(nums) - 1` | End of search range |
| `mid` | `low + (high - low) // 2` | Avoid overflow |
| Loop condition | `low <= high` | Ensure range is valid |
| Move right | `low = mid + 1` | Target is in right half |
| Move left | `high = mid - 1` | Target is in left half |
| Not found | Return `-1` | Target doesn't exist |

---

### Lower Bound Template (First >= Target)

```python
def lower_bound(nums, target):
    """Find first index where nums[i] >= target."""
    low, high = 0, len(nums) - 1
    answer = len(nums)  # Default: insertion at end
    
    while low <= high:
        mid = low + (high - low) // 2
        
        if nums[mid] >= target:
            answer = mid   # Possible answer, go left
            high = mid - 1
        else:
            low = mid + 1
    
    return answer
```

---

### Upper Bound Template (First > Target)

```python
def upper_bound(nums, target):
    """Find first index where nums[i] > target."""
    low, high = 0, len(nums) - 1
    answer = len(nums)  # Default: insertion at end
    
    while low <= high:
        mid = low + (high - low) // 2
        
        if nums[mid] > target:
            answer = mid   # Possible answer, go left
            high = mid - 1
        else:
            low = mid + 1
    
    return answer
```

<!-- back -->
