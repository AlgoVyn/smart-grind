## Search in Rotated Sorted Array

**Question:** How do you decide which half is sorted?

<!-- front -->

---

## Rotated Sorted Array Search

### Key Insight
One half is always sorted! Check: `nums[left] <= nums[mid]`

### Algorithm
```python
def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return mid
        
        # Left half sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1  # Target in left half
            else:
                left = mid + 1   # Target in right half
        
        # Right half sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1   # Target in right half
            else:
                right = mid - 1  # Target in left half
    
    return -1
```

### Decision Tree
```
Is left half sorted?
  ├─ Yes → Is target in [left, mid)?
  │        ├─ Yes → Search left
  │        └─ No  → Search right
  └─ No  → Right half is sorted
           Is target in (mid, right]?
           ├─ Yes → Search right
           └─ No  → Search left
```

### ⚠️ Edge Case
Duplicates can break this logic. Worst case becomes **O(n)**.

<!-- back -->
