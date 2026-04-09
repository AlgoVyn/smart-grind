## DP - Longest Increasing Subsequence (LIS): Framework

What is the complete code template for LIS problems?

<!-- front -->

---

### Framework: LIS Template

```
┌─────────────────────────────────────────────────────────┐
│  LONGEST INCREASING SUBSEQUENCE - TEMPLATE               │
├─────────────────────────────────────────────────────────┤
│  APPROACH 1: DP O(n²)                                    │
│  ─────────────────────────────────                      │
│  1. Initialize dp[0..n-1] = 1                          │
│     (each element is LIS of length 1)                  │
│                                                          │
│  2. For i from 1 to n-1:                               │
│       For j from 0 to i-1:                             │
│         If nums[j] < nums[i]:                          │
│           dp[i] = max(dp[i], dp[j] + 1)                │
│                                                          │
│  3. Return max(dp)                                      │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  APPROACH 2: Patience Sorting O(n log n)               │
│  ───────────────────────────────────────                │
│  1. Initialize tails = []                               │
│                                                          │
│  2. For each num in nums:                              │
│       idx = lower_bound(tails, num)                    │
│       If idx == len(tails):                            │
│         tails.append(num)    # extend                   │
│       Else:                                             │
│         tails[idx] = num     # replace                  │
│                                                          │
│  3. Return len(tails)                                   │
│                                                          │
│  Key: tails[i] = smallest tail of all IS of length i+1  │
└─────────────────────────────────────────────────────────┘
```

---

### Implementation: DP Approach (O(n²))

```python
def length_of_lis(nums):
    """
    Time: O(n²), Space: O(n)
    dp[i] = length of LIS ending at index i
    """
    if not nums:
        return 0
    
    n = len(nums)
    dp = [1] * n
    
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)
```

---

### Implementation: Binary Search Approach (O(n log n))

```python
import bisect

def length_of_lis_fast(nums):
    """
    Time: O(n log n), Space: O(n)
    Using patience sorting with binary search
    """
    if not nums:
        return 0
    
    tails = []
    
    for num in nums:
        idx = bisect.bisect_left(tails, num)
        
        if idx == len(tails):
            tails.append(num)
        else:
            tails[idx] = num
    
    return len(tails)
```

---

### Implementation: With Reconstruction

```python
def lis_with_path(nums):
    """Returns LIS length and the actual subsequence."""
    if not nums:
        return 0, []
    
    n = len(nums)
    dp = [1] * n
    parent = [-1] * n
    
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                parent[i] = j
    
    # Find end of LIS
    max_len = max(dp)
    max_idx = dp.index(max_len)
    
    # Reconstruct
    lis = []
    idx = max_idx
    while idx != -1:
        lis.append(nums[idx])
        idx = parent[idx]
    
    return max_len, lis[::-1]
```

<!-- back -->
