## DP - 1D Array (Fibonacci Style): Problem Forms

What are the variations and extensions of Fibonacci-style DP problems?

<!-- front -->

---

### Form 1: Classic Fibonacci

```python
def fibonacci(n):
    """
    Pure recurrence: F(n) = F(n-1) + F(n-2)
    Base: F(0) = 0, F(1) = 1
    """
    if n <= 0: return 0
    if n == 1: return 1
    
    prev2, prev1 = 0, 1
    for i in range(2, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current
    
    return prev1
```

**Applications:**
- Rabbit population growth
- Spiral phyllotaxis in nature
- Analysis of recursive algorithms

---

### Form 2: Tribonacci & k-State Dependencies

```python
def tribonacci(n):
    """
    T(n) = T(n-1) + T(n-2) + T(n-3)
    Base: T(0)=0, T(1)=1, T(2)=1
    """
    if n == 0: return 0
    if n <= 2: return 1
    
    prev3, prev2, prev1 = 0, 1, 1
    for i in range(3, n + 1):
        current = prev1 + prev2 + prev3
        prev3, prev2, prev1 = prev2, prev1, current
    
    return prev1

# General k-state with circular buffer
from collections import deque

def k_bonacci(n, k):
    """Sum of previous k terms"""
    if n < k:
        return 1 if n > 0 else 0
    
    dq = deque([0] + [1] * (k - 1))
    for i in range(k, n + 1):
        current = sum(dq)
        dq.append(current)
        dq.popleft()
    
    return dq[-1]
```

---

### Form 3: Climbing Stairs Variants

**Variable step sizes:**
```python
def climb_stairs_variable(n, steps):
    """
    Can take any step from 'steps' set
    """
    dp = [0] * (n + 1)
    dp[0] = 1
    
    for i in range(1, n + 1):
        for step in steps:
            if i >= step:
                dp[i] += dp[i - step]
    
    return dp[n]

# Example: steps = [1, 3, 4]
# climb_stairs_variable(5, [1, 3, 4]) = 6 ways
```

**With obstacles:**
```python
def climb_stairs_obstacles(n, broken):
    """broken = set of unreachable steps"""
    dp = [0] * (n + 1)
    dp[0] = 1 if 0 not in broken else 0
    
    for i in range(1, n + 1):
        if i in broken:
            dp[i] = 0
        else:
            dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]
```

---

### Form 4: House Robber Variants

**Standard linear:**
```python
def house_robber(nums):
    """Cannot rob adjacent houses"""
    prev2, prev1 = 0, 0
    for num in nums:
        prev2, prev1 = prev1, max(prev1, num + prev2)
    return prev1
```

**Circular arrangement (House Robber II):**
```python
def house_robber_circular(nums):
    """First and last houses are adjacent"""
    if len(nums) == 1:
        return nums[0]
    
    # Case 1: Exclude first house
    case1 = house_robber_linear(nums[1:])
    
    # Case 2: Exclude last house  
    case2 = house_robber_linear(nums[:-1])
    
    return max(case1, case2)
```

**With skip distance k:**
```python
def house_robber_k_distance(nums, k):
    """Must skip at least k houses between robbed"""
    n = len(nums)
    dp = [0] * n
    
    for i in range(n):
        take = nums[i] + (dp[i - k - 1] if i >= k + 1 else 0)
        skip = dp[i - 1] if i >= 1 else 0
        dp[i] = max(take, skip)
    
    return max(dp) if dp else 0
```

---

### Form 5: Decode Ways

```python
def num_decodings(s):
    """
    Count ways to decode digit string to letters (A=1, B=2...)
    """
    if not s or s[0] == '0':
        return 0
    
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1  # Empty string
    dp[1] = 1  # Single non-zero digit
    
    for i in range(2, n + 1):
        # Single digit decode (if s[i-1] != '0')
        if s[i-1] != '0':
            dp[i] += dp[i-1]
        
        # Two digit decode (if 10-26)
        two_digit = int(s[i-2:i])
        if 10 <= two_digit <= 26:
            dp[i] += dp[i-2]
    
    return dp[n]
```

---

### Form 6: Maximum Subarray (Kadane's Variant)

```python
def max_subarray_sum(nums):
    """
    Find maximum sum of contiguous subarray
    """
    max_ending_here = nums[0]
    max_so_far = nums[0]
    
    for i in range(1, len(nums)):
        # Either start new subarray at current element
        # or extend existing subarray
        max_ending_here = max(nums[i], max_ending_here + nums[i])
        max_so_far = max(max_so_far, max_ending_here)
    
    return max_so_far
```

---

### Form 7: Min Cost Climbing Stairs

```python
def min_cost_climbing(cost):
    """
    Min cost to reach top, can start at step 0 or 1
    cost[i] = cost to step ON stair i
    """
    n = len(cost)
    dp = [0] * (n + 1)
    
    # Can start at 0 or 1 for free
    dp[0], dp[1] = 0, 0
    
    for i in range(2, n + 1):
        # Pay cost of the step we came from
        dp[i] = min(dp[i-1] + cost[i-1], 
                    dp[i-2] + cost[i-2])
    
    return dp[n]

# Space optimized
def min_cost_climbing_opt(cost):
    prev2, prev1 = 0, 0
    for i in range(2, len(cost) + 1):
        current = min(prev1 + cost[i-1], prev2 + cost[i-2])
        prev2, prev1 = prev1, current
    return prev1
```

---

### Summary Table

| Form | Recurrence Pattern | Key Variation |
|------|-------------------|---------------|
| Fibonacci | `dp[i] = dp[i-1] + dp[i-2]` | Classic counting |
| Tribonacci | `dp[i] = dp[i-1] + dp[i-2] + dp[i-3]` | k dependencies |
| Climbing Stairs | `dp[i] = sum(dp[i-k])` | Variable steps |
| House Robber | `dp[i] = max(dp[i-1], dp[i-2]+val)` | Max with constraint |
| Decode Ways | Conditional sum | String constraints |
| Max Subarray | `dp[i] = max(arr[i], dp[i-1]+arr[i])` | Running max |
| Min Cost | `dp[i] = min(dp[i-1]+cost, dp[i-2]+cost)` | Optimization |

<!-- back -->
