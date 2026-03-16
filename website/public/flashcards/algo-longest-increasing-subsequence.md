## Longest Increasing Subsequence

**Question:** Find length of LIS in array?

<!-- front -->

---

## Answer: Binary Search + Patience Sorting

### Solution
```python
import bisect

def lengthOfLIS(nums):
    # tails[i] = smallest tail for LIS of length i+1
    tails = []
    
    for num in nums:
        pos = bisect.bisect_left(tails, num)
        
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    
    return len(tails)
```

### Visual: Patience Sorting
```
nums = [10, 9, 2, 5, 3, 7, 101, 18]

num=10: tails=[10]
num=9:  9<10, replace → tails=[9]
num=2:  2<9, replace → tails=[2]
num=5:  2<5<9, replace index 1 → tails=[2,5]
num=3:  2<3<5, replace index 1 → tails=[2,3]
num=7:  3<7, append → tails=[2,3,7]
num=101:7<101, append → tails=[2,3,7,101]
num=18: 7<18<101, replace → tails=[2,3,7,18]

Answer: len(tails) = 4
```

### ⚠️ Tricky Parts

#### 1. Why bisect_left?
```python
# For strictly increasing subsequence
# Use bisect_left to find first >= num
# This maintains increasing (not non-decreasing)

# For non-decreasing, use bisect_right
```

#### 2. What tails Represents
```python
# tails[i] = minimum possible tail value
# for an increasing subsequence of length i+1

# Not the actual subsequence!
# Just helps find length
```

#### 3. Reconstruct LIS
```python
def lengthOfLISWithPath(nums):
    if not nums:
        return 0
    
    # dp[i] = length of LIS ending at i
    dp = [1] * len(nums)
    parent = [-1] * len(nums)
    
    for i in range(len(nums)):
        for j in range(i):
            if nums[j] < nums[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                parent[i] = j
    
    # Find max
    max_len, max_idx = 0, 0
    for i, length in enumerate(dp):
        if length > max_len:
            max_len = length
            max_idx = i
    
    # Reconstruct
    lis = []
    while max_idx != -1:
        lis.append(nums[max_idx])
        max_idx = parent[max_idx]
    
    return max_len, lis[::-1]
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Binary Search | O(n log n) | O(n) |
| DP (O(n²)) | O(n²) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong bisect | Use bisect_left for increasing |
| Not appending | Append when pos == len(tails) |
| Forgetting return | Return len(tails), not tails |

<!-- back -->
