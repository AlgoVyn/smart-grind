## Cyclic Sort - Finding Missing Number

**Question:** How does cyclic sort find the missing number in O(n) time and O(1) space?

<!-- front -->

---

## Cyclic Sort: Missing Number

### Problem
Given array `nums` containing n distinct numbers from `[0, n]`, find the missing number.

### Key Insight
Place each number at its **correct index** (value `i` goes to index `i`).

### Algorithm
```python
def missing_number(nums):
    n = len(nums)
    
    # Cyclic sort: place each num at correct index
    i = 0
    while i < n:
        correct = nums[i]
        if nums[i] < n and nums[i] != nums[correct]:
            # Swap to correct position
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1
    
    # Find missing: index where value != index
    for i in range(n):
        if nums[i] != i:
            return i
    
    return n
```

### Why It Works
- If all numbers present: `[0,1,2,3]` → indices match values
- Missing `k`: at index `k`, value ≠ `k`

### ⚠️ Important Condition
`nums[i] < n` - prevents out of bounds when array contains n (which is the missing number case)

<!-- back -->
