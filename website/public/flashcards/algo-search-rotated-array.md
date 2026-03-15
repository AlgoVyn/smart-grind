## Search in Rotated Sorted Array

**Question:** Search for target in rotated sorted array.

<!-- front -->

---

## Answer: Modified Binary Search

### Solution
```python
def search(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
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

### Visual
```
Rotated: [4,5,6,7,0,1,2]
         ↑         ↑
        min      max

Search 0:
mid=3 (7): not target, right half sorted
          0 < 7, 0 < 2? No, go left
mid=1 (5): not target, left half sorted  
          5 > 4, 0 < 5? Yes, go left
mid=0 (4): not target, left half sorted
          4 < 4? No, go right
mid=4 (0): found!
```

### Complexity
- **Time:** O(log n)
- **Space:** O(1)

### Key Insight
One half is always sorted - check which half and if target lies in it.

<!-- back -->
