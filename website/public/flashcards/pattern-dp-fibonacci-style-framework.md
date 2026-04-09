## DP - Fibonacci Style (1D Array): Framework

What is the complete code template for 1D Fibonacci-style dynamic programming?

<!-- front -->

---

### Framework 1: Standard DP Template

```
┌─────────────────────────────────────────────────────┐
│  1D DP (FIBONACCI STYLE) - TEMPLATE                  │
├─────────────────────────────────────────────────────┤
│  1. Define state: dp[i] = answer for subproblem i   │
│                                                      │
│  2. Base cases:                                     │
│     - dp[0] = initial_value_0                       │
│     - dp[1] = initial_value_1                       │
│                                                      │
│  3. Recurrence relation:                            │
│     dp[i] = f(dp[i-1], dp[i-2], ..., input[i])      │
│                                                      │
│  4. Iterative computation:                          │
│     For i from 2 to n:                              │
│        dp[i] = apply_recurrence(i)                  │
│                                                      │
│  5. Return dp[n]                                     │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Climbing Stairs

```python
def climb_stairs(n):
    """
    Count ways to climb n stairs (1 or 2 steps at a time).
    dp[i] = number of ways to reach step i
    """
    if n <= 2:
        return n
    
    # Space-optimized: only need last two values
    prev2, prev1 = 1, 2  # dp[i-2], dp[i-1]
    
    for i in range(3, n + 1):
        curr = prev1 + prev2  # dp[i] = dp[i-1] + dp[i-2]
        prev2 = prev1
        prev1 = curr
    
    return prev1
```

---

### Implementation: House Robber

```python
def house_robber(nums):
    """
    Max money without robbing adjacent houses.
    dp[i] = max money from houses 0 to i
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    prev2 = nums[0]  # dp[i-2]
    prev1 = max(nums[0], nums[1])  # dp[i-1]
    
    for i in range(2, len(nums)):
        # dp[i] = max(dp[i-1], dp[i-2] + nums[i])
        curr = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = curr
    
    return prev1
```

---

### Implementation: Maximum Subarray (Kadane)

```python
def max_subarray(nums):
    """
    Find contiguous subarray with maximum sum.
    dp[i] = max sum ending at index i
    """
    max_sum = nums[0]
    curr_sum = nums[0]  # dp[i]
    
    for i in range(1, len(nums)):
        # dp[i] = max(nums[i], dp[i-1] + nums[i])
        curr_sum = max(nums[i], curr_sum + nums[i])
        max_sum = max(max_sum, curr_sum)
    
    return max_sum
```

---

### Key Pattern Elements

| Element | Description | Example |
|---------|-------------|---------|
| State definition | What dp[i] represents | Ways to reach step i |
| Base cases | Starting values | dp[0] = 1, dp[1] = 1 |
| Recurrence | How to compute dp[i] | dp[i] = dp[i-1] + dp[i-2] |
| Space optimization | Keep only needed values | O(1) rolling variables |

<!-- back -->
