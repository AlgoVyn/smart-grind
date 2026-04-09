## Binary Search - Find First/Last Occurrence: Framework

What is the complete code template for finding first and last occurrence using binary search?

<!-- front -->

---

### Framework 1: Two Binary Searches

```
┌─────────────────────────────────────────────────────┐
│  FIND FIRST/LAST OCCURRENCE - TEMPLATE                 │
├─────────────────────────────────────────────────────┤
│  Key: Two separate binary searches - one for first,    │
│  one for last. Continue searching after finding target.│
│                                                        │
│  FIND FIRST:                                           │
│  ┌─────────────────────────────────────────────────┐ │
│  │ while low <= high:                              │ │
│  │   mid = low + (high - low) // 2                 │ │
│  │   if arr[mid] >= target:  // Note: >=           │ │
│  │     if arr[mid] == target: first = mid  // Save  │ │
│  │     high = mid - 1        // Search left         │ │
│  │   else:                                         │ │
│  │     low = mid + 1                               │ │
│  └─────────────────────────────────────────────────┘ │
│                                                        │
│  FIND LAST:                                            │
│  ┌─────────────────────────────────────────────────┐ │
│  │ while low <= high:                              │ │
│  │   mid = low + (high - low) // 2                 │ │
│  │   if arr[mid] <= target:  // Note: <=           │ │
│  │     if arr[mid] == target: last = mid   // Save │ │
│  │     low = mid + 1         // Search right       │ │
│  │   else:                                         │ │
│  │     high = mid - 1                              │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def search_range(nums, target):
    """
    Find first and last position of target in sorted array.
    LeetCode 34
    Time: O(log n), Space: O(1)
    """
    def find_first():
        low, high = 0, len(nums) - 1
        first = -1
        while low <= high:
            mid = low + (high - low) // 2
            if nums[mid] >= target:
                if nums[mid] == target:
                    first = mid
                high = mid - 1
            else:
                low = mid + 1
        return first
    
    def find_last():
        low, high = 0, len(nums) - 1
        last = -1
        while low <= high:
            mid = low + (high - low) // 2
            if nums[mid] <= target:
                if nums[mid] == target:
                    last = mid
                low = mid + 1
            else:
                high = mid - 1
        return last
    
    if not nums:
        return [-1, -1]
    
    first = find_first()
    if first == -1:
        return [-1, -1]
    
    last = find_last()
    return [first, last]
```

---

### Key Pattern Elements

| Element | Purpose | Condition |
|---------|---------|-----------|
| `>= target` | First occurrence | Move left to find earlier match |
| `<= target` | Last occurrence | Move right to find later match |
| Save position | `first = mid` or `last = mid` | Record when `arr[mid] == target` |
| Early termination | Return `[-1,-1]` | If first not found, skip last search |
| Overflow prevention | `low + (high - low) // 2` | Avoid `(low + high) // 2` |

<!-- back -->
