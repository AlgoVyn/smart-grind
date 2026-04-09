## DP - 1D Array Fibonacci: Forms & Variations

What are the different forms and variations of Fibonacci-style DP problems?

<!-- front -->

---

### Form 1: Counting Ways (Fibonacci)

**Classic:** Number of ways to climb n stairs (1 or 2 steps).

```python
def counting_ways_fibonacci(n: int) -> int:
    """
    dp[i] = dp[i-1] + dp[i-2]
    """
    if n <= 2:
        return n
    
    prev2, prev1 = 1, 2
    for i in range(3, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    
    return prev1


# Variable step sizes:
def counting_ways_variable(n: int, steps: list) -> int:
    """
    Can take any step from the 'steps' set.
    dp[i] = sum(dp[i-step] for step in steps if i >= step)
    """
    dp = [0] * (n + 1)
    dp[0] = 1
    
    for i in range(1, n + 1):
        for step in steps:
            if i >= step:
                dp[i] += dp[i - step]
    
    return dp[n]

# Example: steps = [1, 3, 4], n = 5
# dp[5] = dp[4] + dp[2] + dp[1] = 4 + 2 + 1 = 7
```

---

### Form 2: Optimization with Adjacency Constraint (House Robber)

**Standard:** Max money without robbing adjacent houses.

```python
def house_robber_linear(nums: list) -> int:
    """
    dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    """
    if not nums:
        return 0
    
    prev2, prev1 = 0, nums[0]
    
    for i in range(1, len(nums)):
        prev2, prev1 = prev1, max(prev1, prev2 + nums[i])
    
    return prev1
```

**Circular arrangement:**
```python
def house_robber_circular(nums: list) -> int:
    """
    First and last houses are neighbors.
    Solution: max(rob[0..n-2], rob[1..n-1])
    """
    if len(nums) == 1:
        return nums[0]
    
    def rob_linear(arr):
        prev2, prev1 = 0, 0
        for num in arr:
            prev2, prev1 = prev1, max(prev1, prev2 + num)
        return prev1
    
    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))
```

---

### Form 3: Cost Minimization (Min Cost Climbing Stairs)

**Problem:** Min cost to reach top, pay cost to step on stair.

```python
def min_cost_climbing(cost: list) -> int:
    """
    dp[i] = min cost to REACH step i
    Can start at 0 or 1 with no cost.
    """
    n = len(cost)
    prev2 = prev1 = 0  # dp[0], dp[1]
    
    for i in range(2, n + 1):
        current = min(prev1 + cost[i-1], prev2 + cost[i-2])
        prev2, prev1 = prev1, current
    
    return prev1
```

**Key difference:** Pay cost of the step you CAME FROM, not the current step.

---

### Form 4: Extended Dependencies (Tribonacci+)

**Tribonacci:** Each term is sum of previous 3.

```python
def tribonacci(n: int) -> int:
    """
    F(n) = F(n-1) + F(n-2) + F(n-3)
    """
    if n == 0:
        return 0
    if n <= 2:
        return 1
    
    a, b, c = 0, 1, 1  # F(0), F(1), F(2)
    
    for i in range(3, n + 1):
        a, b, c = b, c, a + b + c
    
    return c
```

**General k-dependency:**
```python
def k_dependency_dp(n: int, k: int, bases: list) -> int:
    """
    General pattern for k dependencies.
    """
    if n < len(bases):
        return bases[n]
    
    # Sliding window of size k
    window = bases[-k:]
    
    for i in range(len(bases), n + 1):
        current = sum(window)
        window = window[1:] + [current]
    
    return window[-1]
```

---

### Form 5: Multi-State DP (Max Product Subarray)

**Problem:** Track both max and min (sign flip).

```python
def max_product_subarray(nums: list) -> int:
    """
    Need both max_ending_here and min_ending_here.
    Negative * negative = positive
    """
    max_prod = min_prod = result = nums[0]
    
    for num in nums[1:]:
        candidates = [num, num * max_prod, num * min_prod]
        max_prod = max(candidates)
        min_prod = min(candidates)
        result = max(result, max_prod)
    
    return result
```

---

### Form 6: Decode Ways (String Processing)

**Problem:** Count ways to decode digit string to letters.

```python
def num_decodings(s: str) -> int:
    """
    dp[i] = ways to decode s[0:i]
    Single digit: dp[i] += dp[i-1] if s[i-1] != '0'
    Two digits: dp[i] += dp[i-2] if 10 <= int(s[i-2:i]) <= 26
    """
    if not s or s[0] == '0':
        return 0
    
    n = len(s)
    # dp[i] = ways to decode first i characters
    prev2, prev1 = 1, 1  # dp[0], dp[1]
    
    for i in range(2, n + 1):
        current = 0
        
        # Single digit decode (if current not '0')
        if s[i-1] != '0':
            current += prev1
        
        # Two digit decode
        two_digit = int(s[i-2:i])
        if 10 <= two_digit <= 26:
            current += prev2
        
        prev2, prev1 = prev1, current
    
    return prev1
```

---

### Form 7: Paint House (Color Constraints)

**Problem:** Paint houses with no adjacent same color, minimize cost.

```python
def paint_house(costs: list) -> int:
    """
    costs[i][c] = cost to paint house i with color c
    Cannot paint adjacent houses same color.
    """
    if not costs:
        return 0
    
    n = len(costs)
    # Track min cost ending with each color
    prev = costs[0]  # [cost_red, cost_blue, cost_green]
    
    for i in range(1, n):
        curr = [0] * 3
        curr[0] = costs[i][0] + min(prev[1], prev[2])  # Red
        curr[1] = costs[i][1] + min(prev[0], prev[2])  # Blue
        curr[2] = costs[i][2] + min(prev[0], prev[1])  # Green
        prev = curr
    
    return min(prev)
```

---

### Form 8: Delete and Earn (Transformed House Robber)

**Problem:** Delete element to earn points, delete all occurrences.

```python
def delete_and_earn(nums: list) -> int:
    """
    Similar to House Robber after transformation.
    If you take value v, you can't take v-1 or v+1.
    """
    if not nums:
        return 0
    
    max_val = max(nums)
    points = [0] * (max_val + 1)
    
    # points[v] = total points if we take all v's
    for num in nums:
        points[num] += num
    
    # Now it's House Robber on points array!
    prev2, prev1 = 0, points[0]
    
    for i in range(1, len(points)):
        prev2, prev1 = prev1, max(prev1, prev2 + points[i])
    
    return prev1
```

**Key insight:** Transform to House Robber by grouping points.

<!-- back -->
