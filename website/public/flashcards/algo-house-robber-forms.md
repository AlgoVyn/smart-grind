## House Robber: Forms & Variations

What are the different forms of the House Robber problem?

<!-- front -->

---

### Standard Linear Form

```python
def rob_standard(nums):
    """
    Houses in a row, cannot rob adjacent
    """
    if not nums:
        return 0
    
    prev2, prev1 = 0, 0
    for num in nums:
        prev2, prev1 = prev1, max(prev1, num + prev2)
    
    return prev1

# Trace: [2, 7, 9, 3, 1]
# i=0: prev2=0, prev1=max(0, 2+0)=2
# i=1: prev2=2, prev1=max(2, 7+0)=7
# i=2: prev2=7, prev1=max(7, 9+2)=11
# i=3: prev2=11, prev1=max(11, 3+7)=11
# i=4: prev2=11, prev1=max(11, 1+11)=12
# Result: 12
```

---

### Maximum Sum Non-Adjacent Form

```python
def max_sum_non_adjacent(arr):
    """
    Same as house robber, general array
    Classic DP problem
    """
    incl = 0  # Max sum including previous
    excl = 0  # Max sum excluding previous
    
    for num in arr:
        new_excl = max(incl, excl)  # Exclude current
        incl = excl + num            # Include current
        excl = new_excl
    
    return max(incl, excl)

# Same as:
def max_sum_non_adjacent_v2(arr):
    if not arr:
        return 0
    if len(arr) <= 2:
        return max(0, max(arr))
    
    dp = [0] * len(arr)
    dp[0] = max(0, arr[0])
    dp[1] = max(dp[0], arr[1])
    
    for i in range(2, len(arr)):
        dp[i] = max(dp[i-1], arr[i] + dp[i-2])
    
    return dp[-1]
```

---

### House Robber with Skip Distance k

```python
def rob_with_distance(nums, k):
    """
    Must skip at least k houses between robbed houses
    """
    if not nums:
        return 0
    
    n = len(nums)
    # dp[i] = max money ending at house i
    dp = [0] * n
    
    for i in range(n):
        # Take current + best from i-k-1 or earlier
        prev = dp[i - k - 1] if i >= k + 1 else 0
        take = nums[i] + prev
        
        # Or don't take current
        skip = dp[i - 1] if i >= 1 else 0
        
        dp[i] = max(take, skip)
    
    return max(dp)
```

---

### House Robber with Penalty

```python
def rob_with_penalty(nums, penalty):
    """
    Robbing adjacent houses is possible but incurs penalty
    """
    n = len(nums)
    
    # dp[i][0] = max money at i, didn't rob i
    # dp[i][1] = max money at i, robbed i
    dp = [[0, 0] for _ in range(n)]
    
    dp[0][1] = nums[0]
    
    for i in range(1, n):
        dp[i][0] = max(dp[i-1][0], dp[i-1][1])
        
        # Rob i: can come from not robbing i-1 (no penalty)
        # or robbing i-1 with penalty
        no_penalty = dp[i-1][0] + nums[i]
        with_penalty = dp[i-1][1] + nums[i] - penalty
        dp[i][1] = max(no_penalty, with_penalty)
    
    return max(dp[-1])
```

---

### House Robber with House Selection Limit

```python
def rob_with_limit(nums, k):
    """
    Can rob at most k houses
    """
    n = len(nums)
    
    # dp[i][j] = max money from first i houses, robbing j houses
    dp = [[0] * (k + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for j in range(1, k + 1):
            # Don't rob house i-1
            dp[i][j] = dp[i-1][j]
            
            # Rob house i-1 (must ensure not adjacent)
            # Actually this is complex, need more state
            pass
    
    # Alternative: use state (position, last_robbed, count)
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def solve(pos, last_robbed, count):
        if pos == n:
            return 0 if count <= k else float('-inf')
        if count > k:
            return float('-inf')
        
        # Don't rob
        best = solve(pos + 1, last_robbed, count)
        
        # Rob (if not adjacent)
        if pos - last_robbed > 1:
            best = max(best, nums[pos] + solve(pos + 1, pos, count + 1))
        
        return best
    
    return solve(0, -2, 0)
```

<!-- back -->
