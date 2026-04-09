## Sliding Window - Monotonic Queue for Max/Min: Forms

What are the different forms and variations of monotonic queue problems?

<!-- front -->

---

### Problem Variations

| Variation | Problem Type | Key Change | Complexity |
|-----------|--------------|------------|------------|
| **Form 1** | Window Maximum | Decreasing deque | O(n) time, O(k) space |
| **Form 2** | Window Minimum | Increasing deque | O(n) time, O(k) space |
| **Form 3** | Both Max and Min | Two deques | O(n) time, O(k) space |
| **Form 4** | Constrained Subsequence | DP + deque | O(n) time, O(k) space |
| **Form 5** | Shortest Subarray Sum | Prefix sum + deque | O(n) time, O(n) space |

---

### Form 1: Sliding Window Maximum (LC 239)

```python
def max_sliding_window(nums, k):
    """
    LeetCode 239: Sliding Window Maximum
    Return max in each window of size k.
    """
    from collections import deque
    
    if not nums or k == 0:
        return []
    
    result = []
    dq = deque()  # Decreasing deque (stores indices)
    
    for i in range(len(nums)):
        # Remove out of window
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Remove smaller elements
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        
        dq.append(i)
        
        # Start adding results after first k-1 elements
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result

# Example: nums = [1,3,-1,-3,5,3,6,7], k = 3
# Output: [3, 3, 5, 5, 6, 7]
```

---

### Form 2: Sliding Window Minimum

```python
def min_sliding_window(nums, k):
    """
    Same pattern but for minimum.
    """
    from collections import deque
    
    result = []
    dq = deque()  # Increasing deque
    
    for i in range(len(nums)):
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Note: > for minimum (increasing order)
        while dq and nums[dq[-1]] > nums[i]:
            dq.pop()
        
        dq.append(i)
        
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result

# Example: nums = [1,3,-1,-3,5,3,6,7], k = 3
# Output: [-1, -3, -3, -3, 3, 3]
```

---

### Form 3: Both Max and Min (Range Query)

```python
def max_min_sliding_window(nums, k):
    """
    Get both max and min in each window.
    Useful for problems asking for range (max - min).
    """
    from collections import deque
    
    max_dq, min_dq = deque(), deque()
    max_result, min_result = [], []
    
    for i in range(len(nums)):
        # Update max deque
        while max_dq and max_dq[0] <= i - k:
            max_dq.popleft()
        while max_dq and nums[max_dq[-1]] < nums[i]:
            max_dq.pop()
        max_dq.append(i)
        
        # Update min deque
        while min_dq and min_dq[0] <= i - k:
            min_dq.popleft()
        while min_dq and nums[min_dq[-1]] > nums[i]:
            min_dq.pop()
        min_dq.append(i)
        
        if i >= k - 1:
            max_result.append(nums[max_dq[0]])
            min_result.append(nums[min_dq[0]])
    
    return max_result, min_result

# Can compute max - min for each window
# Useful for: "Longest Continuous Subarray With Absolute Diff <= Limit"
```

---

### Form 4: Constrained Subsequence Sum (LC 1425)

```python
def constrained_subset_sum(nums, k):
    """
    LeetCode 1425: Constrained Subsequence Sum
    Max sum of subsequence where consecutive elements distance <= k.
    """
    from collections import deque
    
    n = len(nums)
    dp = [0] * n
    dq = deque()
    
    for i in range(n):
        # Remove out of range
        while dq and dq[0] < i - k:
            dq.popleft()
        
        # dp[i] = nums[i] + max(0, best in window)
        prev_max = dp[dq[0]] if dq else 0
        dp[i] = nums[i] + max(0, prev_max)
        
        # Maintain decreasing deque
        while dq and dp[dq[-1]] <= dp[i]:
            dq.pop()
        dq.append(i)
    
    return max(dp)

# Key: Use dp values in deque instead of raw nums
# Time: O(n), Space: O(k)
```

---

### Form 5: Shortest Subarray with Sum at Least K (LC 862)

```python
def shortest_subarray(nums, k):
    """
    LeetCode 862: Shortest Subarray with Sum at Least K
    Use prefix sums with monotonic deque.
    """
    from collections import deque
    
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    
    result = float('inf')
    dq = deque()  # Stores indices of increasing prefix sums
    
    for i in range(n + 1):
        # Check if we can form valid subarray
        while dq and prefix[i] - prefix[dq[0]] >= k:
            result = min(result, i - dq.popleft())
        
        # Maintain increasing deque
        while dq and prefix[i] <= prefix[dq[-1]]:
            dq.pop()
        
        dq.append(i)
    
    return result if result != float('inf') else -1

# Key: Monotonic increasing deque of prefix sums
# Time: O(n), Space: O(n)
```

---

### Form 6: Jump Game VI (LC 1696)

```python
def max_result(nums, k):
    """
    LeetCode 1696: Jump Game VI
    Max score jumping at most k steps.
    """
    from collections import deque
    
    n = len(nums)
    dp = [0] * n
    dp[0] = nums[0]
    dq = deque([0])  # Stores indices, decreasing by dp value
    
    for i in range(1, n):
        # Remove out of jump range
        while dq and dq[0] < i - k:
            dq.popleft()
        
        # Best score to reach i
        dp[i] = nums[i] + dp[dq[0]]
        
        # Maintain decreasing deque
        while dq and dp[dq[-1]] <= dp[i]:
            dq.pop()
        dq.append(i)
    
    return dp[-1]

# Similar to constrained subsequence sum
# Time: O(n), Space: O(k)
```

---

### Decision Flowchart

```
Read problem statement
│
├─ "maximum in each window" or "sliding window maximum"
│   └─→ Use: Decreasing monotonic deque (Form 1)
│
├─ "minimum in each window"
│   └─→ Use: Increasing monotonic deque (Form 2)
│
├─ "both max and min" or "absolute difference"
│   └─→ Use: Two deques simultaneously (Form 3)
│
├─ "subsequence" + "at most k apart" or "constrained"
│   └─→ Use: DP + monotonic deque (Form 4)
│
├─ "shortest subarray" + "sum at least K"
│   └─→ Use: Prefix sum + monotonic deque (Form 5)
│
└─ "jump" + "at most k steps" + "max score"
    └─→ Use: DP + monotonic deque (Form 6)
```

---

### Quick Reference Table

| LeetCode | Problem | Key Pattern | Form |
|----------|---------|-------------|------|
| 239 | Sliding Window Maximum | Decreasing deque | 1 |
| 1425 | Constrained Subsequence Sum | DP + deque | 4 |
| 862 | Shortest Subarray with Sum at Least K | Prefix sum + deque | 5 |
| 1696 | Jump Game VI | DP + deque | 6 |
| 1438 | Longest Subarray with Absolute Diff <= Limit | Two deques | 3 |
| 480 | Sliding Window Median | Two heaps (not monotonic) | - |

<!-- back -->
