## Find Minimum in Rotated Sorted Array

**Question:** Find minimum in rotated sorted array (no duplicates)?

<!-- front -->

---

## Answer: Modified Binary Search

### Solution
```python
def findMin(nums):
    left = 0
    right = len(nums) - 1
    
    while left < right:
        mid = (left + right) // 2
        
        # Check if mid is in sorted portion
        if nums[mid] > nums[right]:
            # Minimum is in right half
            left = mid + 1
        else:
            # Minimum is in left half (including mid)
            right = mid
    
    return nums[left]
```

### Visual: Rotation Point
```
Original: [1, 2, 3, 4, 5]
Rotated:  [4, 5, 1, 2, 3]
              ↑
           minimum

Search: nums[mid] vs nums[right]
- nums[mid] > nums[right]: rotation on right
- nums[mid] <= nums[right]: rotation on left/included
```

### ⚠️ Tricky Parts

#### 1. Why Compare with nums[right]?
```python
# In rotated array:
# - Left portion is sorted (greater than all in right)
# - Right portion is sorted (contains minimum)

# nums[mid] > nums[right]:
# mid is in left sorted portion
# Minimum is to the right

# nums[mid] <= nums[right]:
# mid is in right sorted portion
# Minimum is at mid or to left
```

#### 2. Why left = mid + 1?
```python
# When nums[mid] > nums[right]:
# mid is definitely NOT minimum
# Can safely move left past mid

# When nums[mid] <= nums[right]:
# mid COULD be minimum
# Keep right = mid (not mid - 1)
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Binary Search | O(log n) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Comparing with nums[0] | Compare with nums[right] |
| Using mid - 1 when not sure | Only use mid + 1 when certain |
| Not handling n=1 | While loop handles it |

<!-- back -->
