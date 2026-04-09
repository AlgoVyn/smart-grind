## Binary Search - Rotated Array: Framework

What is the complete code template for finding minimum in a rotated sorted array?

<!-- front -->

---

### Framework 1: Find Minimum in Rotated Array

```
┌─────────────────────────────────────────────────────┐
│  ROTATED ARRAY MINIMUM - TEMPLATE                      │
├─────────────────────────────────────────────────────┤
│  Key Insight: One half is always sorted!               │
│                                                        │
│  1. Initialize left = 0, right = n - 1                │
│                                                        │
│  2. While left < right:                                │
│     a. mid = left + (right - left) // 2               │
│                                                        │
│     b. If nums[mid] > nums[right]:                     │
│        - Minimum must be in RIGHT half                │
│        - left = mid + 1                                │
│                                                        │
│     c. Else: (nums[mid] < nums[right])                │
│        - Minimum is at mid or in LEFT half              │
│        - right = mid                                   │
│                                                        │
│  3. Return nums[left] (or nums[right])                │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Find Minimum

```python
def find_min_rotated(nums):
    """
    Find minimum in rotated sorted array.
    LeetCode 153 - Find Minimum in Rotated Sorted Array
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        # Compare mid with right to determine half
        if nums[mid] > nums[right]:
            # Minimum is in right half (after mid)
            left = mid + 1
        else:
            # nums[mid] < nums[right]
            # Minimum is at mid or in left half
            # Note: can't be mid+1 to right (they're >= nums[mid])
            right = mid
    
    return nums[left]
```

---

### Framework 2: Find Maximum (Reverse Logic)

```python
def find_max_rotated(nums):
    """
    Find maximum in rotated sorted array.
    Maximum is right before the minimum.
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            # Maximum could be mid, search left side too
            left = mid + 1
        else:
            # nums[mid] <= nums[right]
            # Maximum is in left half
            right = mid
    
    # Maximum is at left - 1 (or last element if no rotation)
    return nums[left - 1] if left > 0 else nums[-1]
```

---

### Decision Tree

```
Array: [4, 5, 6, 7, 0, 1, 2]
              mid
               ↓
Is nums[mid] > nums[right]?
    7 > 2? YES → min is RIGHT of mid
    
    New range: [0, 1, 2]
               mid
                ↓
    Is 1 > 2? NO → min is at mid or LEFT
    
    New range: [0, 1]
              mid
               ↓
    Is 0 > 1? NO → min at mid or left
    
    left == right → Found! nums[left] = 0
```

---

### Key Pattern Elements

| Element | Purpose | Comparison |
|---------|---------|------------|
| `nums[mid] > nums[right]` | Right half has minimum | Use `>` not `>=` |
| `left = mid + 1` | Search right half | Skip mid, it's larger |
| `right = mid` | Search left half | Include mid, could be min |
| `left < right` | Loop condition | Don't use `<=` |

<!-- back -->
