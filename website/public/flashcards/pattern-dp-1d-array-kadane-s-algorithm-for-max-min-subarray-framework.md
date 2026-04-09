## DP - 1D Array (Kadane's Algorithm): Framework

What is the complete code template for Kadane's maximum subarray algorithm?

<!-- front -->

---

### Framework 1: Classic Kadane's Algorithm

```
┌──────────────────────────────────────────────────────────┐
│  CLASSIC KADANE'S ALGORITHM - TEMPLATE                     │
├──────────────────────────────────────────────────────────┤
│  Purpose: Find maximum sum of any contiguous subarray     │
│                                                            │
│  Key Insight: At each position, decide to extend          │
│  previous subarray OR start fresh from current element     │
│                                                            │
│  Variables:                                                │
│    - max_current: max sum ending at current position       │
│    - max_global: best sum seen so far across all          │
│                                                            │
│  Algorithm:                                                │
│  1. Initialize both with first element                    │
│  2. For each subsequent element:                          │
│     a. max_current = max(num, max_current + num)          │
│        → Either start new or extend                        │
│     b. max_global = max(max_global, max_current)          │
│        → Update best overall                              │
│  3. Return max_global                                     │
└──────────────────────────────────────────────────────────┘
```

---

### Implementation: Classic Kadane's

```python
def max_subarray_kadane(nums):
    """
    Classic Kadane's Algorithm - Maximum Subarray
    LeetCode 53
    Time: O(n), Space: O(1)
    """
    if not nums:
        return 0
    
    max_current = max_global = nums[0]
    
    for num in nums[1:]:
        # Extend previous or start fresh
        max_current = max(num, max_current + num)
        # Update global maximum
        max_global = max(max_global, max_current)
    
    return max_global
```

---

### Framework 2: Kadane's with Index Tracking

```python
def kadane_with_indices(nums):
    """
    Track start/end indices of max subarray
    """
    if not nums:
        return 0, -1, -1
    
    max_current = max_global = nums[0]
    start = end = temp_start = 0
    
    for i in range(1, len(nums)):
        # Decide: extend or restart?
        if max_current + nums[i] < nums[i]:
            max_current = nums[i]
            temp_start = i  # New start position
        else:
            max_current += nums[i]
        
        # Update global and indices
        if max_current > max_global:
            max_global = max_current
            start = temp_start
            end = i
    
    return max_global, start, end
```

---

### Framework 3: Circular Array Kadane's

```python
def kadane_circular(nums):
    """
    Maximum sum in circular array (wrap-around allowed)
    LeetCode 918
    """
    if not nums:
        return 0
    
    # Standard Kadane for max subarray
    def kadane_max(arr):
        max_cur = max_glob = arr[0]
        for num in arr[1:]:
            max_cur = max(num, max_cur + num)
            max_glob = max(max_glob, max_cur)
        return max_glob
    
    # Modified Kadane for min subarray
    def kadane_min(arr):
        min_cur = min_glob = arr[0]
        for num in arr[1:]:
            min_cur = min(num, min_cur + num)
            min_glob = min(min_glob, min_cur)
        return min_glob
    
    max_kadane = kadane_max(nums)
    min_kadane = kadane_min(nums)
    total = sum(nums)
    
    # All negative case: max_kadane is the answer
    if max_kadane < 0:
        return max_kadane
    
    # Max of: non-circular OR circular (total - min_subarray)
    return max(max_kadane, total - min_kadane)
```

---

### Key Pattern Elements

| Element | Purpose | Update Rule |
|---------|---------|-------------|
| `max_current` | Local max ending at i | `max(num, max_current + num)` |
| `max_global` | Global best so far | `max(max_global, max_current)` |
| `min_current` | For circular variant | `min(num, min_current + num)` |
| `total - min_kadane` | Circular max | Excludes middle, includes edges |

---

### Common Initialization Mistakes

| Mistake | Why Wrong | Correct |
|---------|-----------|---------|
| `max_current = 0` | Fails on all-negative arrays | `max_current = nums[0]` |
| `max_global = 0` | Returns 0 for all-negative | `max_global = nums[0]` |
| Start loop from i=0 | Double counts first element | Start from i=1 |

<!-- back -->
