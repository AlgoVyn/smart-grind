## Binary Search - Find Min/Max in Rotated Sorted Array: Framework

What is the complete code template for finding the minimum or maximum element in a rotated sorted array?

<!-- front -->

---

### Framework: Find Minimum (Compare with Right)

```
┌─────────────────────────────────────────────────────────────┐
│  FIND MIN IN ROTATED SORTED ARRAY - TEMPLATE                │
├─────────────────────────────────────────────────────────────┤
│  Key: Compare nums[mid] with nums[right] to determine       │
│  which half contains the minimum (pivot point)              │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ left, right = 0, len(nums) - 1                          │  │
│  │ while left < right:                                     │  │
│  │   mid = left + (right - left) // 2                      │  │
│  │                                                         │  │
│  │   if nums[mid] > nums[right]:    # Min in right half    │  │
│  │     left = mid + 1                                      │  │
│  │   else:                        # Min at mid or left     │  │
│  │     right = mid                                         │  │
│  │                                                         │  │
│  │ return nums[left]  # left == right                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### Framework: Find Maximum

```
┌─────────────────────────────────────────────────────────────┐
│  FIND MAX IN ROTATED SORTED ARRAY - TEMPLATE                │
├─────────────────────────────────────────────────────────────┤
│  Key: Find minimum first, then max is at (min_idx - 1) % n   │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ # Step 1: Find minimum index using above algorithm    │  │
│  │ min_idx = find_min_index(nums)                        │  │
│  │                                                       │  │
│  │ # Step 2: Calculate max index (wrap around)           │  │
│  │ max_idx = (min_idx - 1 + len(nums)) % len(nums)       │  │
│  │                                                       │  │
│  │ return nums[max_idx]                                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def findMin(nums):
    """
    Find minimum in rotated sorted array.
    LeetCode 153
    Time: O(log n), Space: O(1)
    """
    if not nums:
        raise ValueError("Array cannot be empty")
    
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        # Compare mid with right to find pivot
        if nums[mid] > nums[right]:
            left = mid + 1      # Min is in right half
        else:
            right = mid         # Min at mid or in left half
    
    return nums[left]


def findMax(nums):
    """Find maximum in rotated sorted array."""
    if not nums:
        raise ValueError("Array cannot be empty")
    
    # Find minimum index
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    
    # Maximum is right before minimum
    max_idx = (left - 1) % len(nums)
    return nums[max_idx]


def findMinMax(nums):
    """Find both min and max in one pass."""
    if not nums:
        raise ValueError("Array cannot be empty")
    
    if len(nums) == 1:
        return nums[0], nums[0]
    
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    
    min_val = nums[left]
    max_val = nums[(left - 1) % len(nums)]
    return min_val, max_val
```

---

### Key Framework Elements

| Element | Purpose | Condition |
|---------|---------|-----------|
| `nums[mid] > nums[right]` | Detect pivot side | Min is in right half |
| `left = mid + 1` | Search right half | When mid > right |
| `right = mid` | Search left half (include mid) | When mid <= right |
| `left < right` | Loop condition | Converges to single element |
| `% len(nums)` | Handle wraparound | For max index calculation |

<!-- back -->
