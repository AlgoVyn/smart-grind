## Binary Search - First/Last Occurrence: Framework

What is the complete code template for finding first and last positions?

<!-- front -->

---

### Framework 1: Find First Occurrence

```
┌─────────────────────────────────────────────────────┐
│  FIRST OCCURRENCE - TEMPLATE                           │
├─────────────────────────────────────────────────────┤
│  1. left = 0, right = len(nums) - 1, result = -1      │
│  2. While left <= right:                              │
│     a. mid = left + (right - left) // 2             │
│     b. If nums[mid] == target:                        │
│        - result = mid (save result)                   │
│        - right = mid - 1 (continue left)              │
│     c. Elif nums[mid] < target:                       │
│        - left = mid + 1                               │
│     d. Else:                                          │
│        - right = mid - 1                              │
│  3. Return result                                     │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Search Range

```python
def search_range(nums, target):
    """
    Find first and last position of target.
    LeetCode 34
    Time: O(log n), Space: O(1)
    """
    def find_first():
        left, right = 0, len(nums) - 1
        first = -1
        
        while left <= right:
            mid = left + (right - left) // 2
            
            if nums[mid] >= target:
                if nums[mid] == target:
                    first = mid
                right = mid - 1
            else:
                left = mid + 1
        
        return first
    
    def find_last():
        left, right = 0, len(nums) - 1
        last = -1
        
        while left <= right:
            mid = left + (right - left) // 2
            
            if nums[mid] <= target:
                if nums[mid] == target:
                    last = mid
                left = mid + 1
            else:
                right = mid - 1
        
        return last
    
    first = find_first()
    if first == -1:
        return [-1, -1]
    
    return [first, find_last()]
```

---

### Key Pattern Elements

| Element | First Occurrence | Last Occurrence |
|---------|------------------|-----------------|
| Condition | `nums[mid] >= target` | `nums[mid] <= target` |
| When found | `right = mid - 1` | `left = mid + 1` |
| Save result | Update `first` | Update `last` |
| Return | `first` | `last` |

<!-- back -->
