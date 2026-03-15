## Find Peak Element

**Question:** Find a peak element (greater than neighbors) in O(log n).

<!-- front -->

---

## Answer: Binary Search

### Solution
```python
def findPeakElement(nums):
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = (left + right) // 2
        
        if nums[mid] < nums[mid + 1]:
            # Peak must be on right side
            left = mid + 1
        else:
            # Peak is at mid or on left side
            right = mid
    
    return left
```

### Visual
```
nums = [1,2,3,1]

1 → 2 → 3 → 1
         ↑
        peak

mid=1: nums[1]=2 < nums[2]=3 → go right
mid=2: nums[2]=3 > nums[3]=1 → go left
mid=2 == left == right → return 2
```

### Complexity
- **Time:** O(log n)
- **Space:** O(1)

### Key Points
- Any local maximum works
- Compare with right neighbor only
- If going right: peak must be greater than current

### Edge Cases
- Single element: return 0
- Decreasing from start: return 0
- Increasing to end: return n-1

<!-- back -->
