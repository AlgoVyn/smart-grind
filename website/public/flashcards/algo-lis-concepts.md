## Title: LIS - Longest Increasing Subsequence

What is the LIS problem and how is it solved efficiently?

<!-- front -->

---

### Definition
Given a sequence, find the length of the longest subsequence where elements are strictly increasing. Elements need not be contiguous.

### Examples
```
[10, 9, 2, 5, 3, 7, 101, 18] → LIS = [2, 3, 7, 101] (length 4)
[0, 1, 0, 3, 2, 3] → LIS = [0, 1, 3] or [0, 1, 2, 3] (length 4)
[7, 7, 7, 7] → LIS = [7] (length 1, strictly increasing)
```

### DP Approach - O(n²)
```python
def lis_dp(nums):
    n = len(nums)
    dp = [1] * n  # dp[i] = LIS ending at i
    
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)
```

---

### Binary Search Approach - O(n log n)
```python
import bisect

def lis_binary_search(nums):
    """Patience sorting / tails array method"""
    tails = []  # tails[i] = smallest ending element of IS of length i+1
    
    for num in nums:
        idx = bisect.bisect_left(tails, num)
        if idx == len(tails):
            tails.append(num)
        else:
            tails[idx] = num
    
    return len(tails)

# With reconstruction (track predecessors)
def lis_with_reconstruction(nums):
    tails = []  # (tail_value, index_in_nums)
    parent = [-1] * len(nums)
    
    for i, num in enumerate(nums):
        idx = bisect.bisect_left([t[0] for t in tails], num)
        if idx > 0:
            parent[i] = tails[idx-1][1]
        if idx == len(tails):
            tails.append((num, i))
        else:
            tails[idx] = (num, i)
    
    # Reconstruct by backtracking from last element
    return len(tails)
```

---

### Complexity Comparison
| Approach | Time | Space | Reconstruct |
|----------|------|-------|-------------|
| DP | O(n²) | O(n) | Easy |
| Binary Search | O(n log n) | O(n) | Harder |
| Segment Tree | O(n log n) | O(n) | Moderate |

<!-- back -->
