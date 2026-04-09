## DP - Kadane's Algorithm: Framework

What is the complete code template for finding maximum subarray sum using Kadane's algorithm?

<!-- front -->

---

### Framework 1: Classic Kadane's Algorithm

```
┌─────────────────────────────────────────────────────┐
│  KADANE'S ALGORITHM - TEMPLATE                         │
├─────────────────────────────────────────────────────┤
│  Key Decision: Extend previous or start fresh?        │
│                                                        │
│  1. Initialize:                                        │
│     - current_max = nums[0]                            │
│     - global_max = nums[0]                             │
│                                                        │
│  2. For each num in nums[1:]:                          │
│     a. current_max = max(num, current_max + num)       │
│        - Either start new subarray at num              │
│        - Or extend previous subarray                   │
│                                                        │
│     b. global_max = max(global_max, current_max)       │
│        - Track best result seen so far                 │
│                                                        │
│  3. Return global_max                                  │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Maximum Subarray

```python
def max_subarray_kadane(nums):
    """
    Classic Kadane's Algorithm.
    LeetCode 53 - Maximum Subarray
    Time: O(n), Space: O(1)
    """
    if not nums:
        return 0
    
    current_max = global_max = nums[0]
    
    for num in nums[1:]:
        # Decision: start new or extend?
        current_max = max(num, current_max + num)
        
        # Update global best
        global_max = max(global_max, current_max)
    
    return global_max
```

---

### Framework 2: With Indices Tracking

```python
def max_subarray_with_indices(nums):
    """
    Kadane's with start/end indices of max subarray.
    """
    if not nums:
        return 0, -1, -1
    
    current_max = global_max = nums[0]
    current_start = 0
    best_start = best_end = 0
    
    for i, num in enumerate(nums[1:], start=1):
        # If starting fresh is better
        if num > current_max + num:
            current_max = num
            current_start = i
        else:
            # Extend existing subarray
            current_max += num
        
        # Update global best
        if current_max > global_max:
            global_max = current_max
            best_start = current_start
            best_end = i
    
    return global_max, best_start, best_end
```

---

### Framework 3: Minimum Subarray (Reverse Logic)

```python
def min_subarray_kadane(nums):
    """
    Find minimum sum subarray using Kadane's.
    """
    current_min = global_min = nums[0]
    
    for num in nums[1:]:
        current_min = min(num, current_min + num)
        global_min = min(global_min, current_min)
    
    return global_min
```

---

### Key Insight

```
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
        ↓  ↓   ↓  ↓   ↓  ↓ ↓   ↓  ↓
       -2  1  -2  4   3  5 6   1  5  ← current_max
       -2  1   1  4   4  5 6   6  6  ← global_max

At each step:
- current_max: Best sum ending HERE
- global_max: Best sum seen ANYWHERE

Key formula: current_max = max(num, current_max + num)
```

---

### Key Pattern Elements

| Element | Purpose | Update Rule |
|---------|---------|-------------|
| `current_max` | Best sum ending at i | `max(num, current_max + num)` |
| `global_max` | Best sum overall | `max(global_max, current_max)` |
| Decision | Start new or extend | Compare num vs current_max + num |
| Reset | When current_max < 0 | Starting fresh becomes better |

<!-- back -->
