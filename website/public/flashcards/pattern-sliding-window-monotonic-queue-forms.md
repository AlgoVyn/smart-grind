## Sliding Window - Monotonic Queue: Forms

What are the different variations of monotonic queue sliding window?

<!-- front -->

---

### Form 1: Sliding Window Maximum

```python
def max_sliding_window(nums, k):
    from collections import deque
    
    dq = deque()
    result = []
    
    for i, num in enumerate(nums):
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        while dq and nums[dq[-1]] <= num:
            dq.pop()
        
        dq.append(i)
        
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

---

### Form 2: Sliding Window Minimum

```python
def min_sliding_window(nums, k):
    from collections import deque
    
    dq = deque()
    result = []
    
    for i, num in enumerate(nums):
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        while dq and nums[dq[-1]] >= num:
            dq.pop()
        
        dq.append(i)
        
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

---

### Form 3: Jump Game with Monotonic Queue

```python
def jump(nums):
    """Find minimum jumps to reach end using monotonic queue."""
    from collections import deque
    
    n = len(nums)
    dq = deque([(0, 0)])  # (index, jumps)
    visited = 0
    
    while dq:
        idx, jumps = dq.popleft()
        
        if idx >= n - 1:
            return jumps
        
        # Add all reachable positions
        for next_idx in range(idx + 1, min(idx + nums[idx] + 1, n)):
            if next_idx > visited:
                # Maintain monotonicity on jumps
                while dq and dq[-1][1] > jumps + 1:
                    dq.pop()
                dq.append((next_idx, jumps + 1))
                visited = next_idx
    
    return -1
```

---

### Form 4: Constrained Subsequence Sum

```python
def constrained_subset_sum(nums, k):
    """Max sum of non-empty subsequence with constrained jumps."""
    from collections import deque
    
    n = len(nums)
    dp = [0] * n  # dp[i] = max sum ending at i
    dq = deque()  # Store indices with decreasing dp values
    
    for i in range(n):
        # Remove out of range
        while dq and dq[0] < i - k:
            dq.popleft()
        
        # dp[i] = nums[i] + max(0, max(dp[i-k..i-1]))
        dp[i] = nums[i] + (dp[dq[0]] if dq else 0)
        
        # Maintain monotonicity
        while dq and dp[i] >= dp[dq[-1]]:
            dq.pop()
        
        if dp[i] > 0:
            dq.append(i)
    
    return max(dp)
```

---

### Form Comparison

| Form | Monotonic | Operation | Use Case |
|------|-----------|-----------|----------|
| Max Window | Decreasing | pop while smaller | Window maximum |
| Min Window | Increasing | pop while larger | Window minimum |
| Jump Game | By jumps | BFS with pruning | Shortest path |
| Constrained DP | By dp value | DP optimization | DP with window |

<!-- back -->
