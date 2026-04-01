## Climbing Stairs: Problem Forms

What are the variations and extensions of the climbing stairs problem?

<!-- front -->

---

### Variable Step Sizes

**Problem:** Can take steps of size from set S = {1, 3, 4}

```python
def climb_stairs_variable(n: int, steps: list) -> int:
    """
    Generalized: can take any step from 'steps' set
    """
    if n < 0:
        return 0
    if n == 0:
        return 1
    
    dp = [0] * (n + 1)
    dp[0] = 1
    
    for i in range(1, n + 1):
        for step in steps:
            if i >= step:
                dp[i] += dp[i - step]
    
    return dp[n]

# Example: steps = [1, 3, 4]
# climb_stairs_variable(5, [1, 3, 4]) = 6
# Ways: 1+1+1+1+1, 1+1+3, 1+3+1, 3+1+1, 1+4, 4+1
```

---

### Minimum Steps to Reach Top

**Problem:** Each step has a cost. Minimize total cost.

```python
def min_cost_climbing(cost: list) -> int:
    """
    cost[i] = cost to step on stair i
    Can start at step 0 or 1
    """
    n = len(cost)
    
    # dp[i] = min cost to reach step i
    dp = [0] * (n + 1)
    dp[0], dp[1] = 0, 0  # Can start free at 0 or 1
    
    for i in range(2, n + 1):
        # Came from i-1 or i-2, pay cost of that step
        dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])
    
    return dp[n]  # Top is beyond last step
```

---

### Climbing with Obstacles

**Problem:** Some steps are broken (cannot step on them).

```python
def climb_stairs_obstacles(n: int, broken: set) -> int:
    """
    broken: set of step indices that cannot be used
    """
    if 0 in broken or 1 in broken and n > 0:
        return 0
    
    dp = [0] * (n + 1)
    dp[0] = 1 if 0 not in broken else 0
    if n >= 1:
        dp[1] = 1 if 1 not in broken else 0
    
    for i in range(2, n + 1):
        if i in broken:
            dp[i] = 0
        else:
            dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]
```

---

### K-Steps Maximum

**Problem:** Can take at most k steps at once, but want exactly n total.

```python
def climb_stairs_k_max(n: int, k: int) -> int:
    """
    Can take 1 to k steps at each move
    """
    dp = [0] * (n + 1)
    dp[0] = 1
    
    for i in range(1, n + 1):
        for step in range(1, min(k, i) + 1):
            dp[i] += dp[i - step]
    
    return dp[n]

# This is the "compositions of n with parts <= k" problem
```

---

### Count Ways with Even/Odd Constraints

```python
def climb_stairs_constraint(n: int) -> int:
    """
    Count ways with constraint on number of 2-steps
    Example: at most m double steps
    """
    # dp[i][j] = ways to reach step i using j double steps
    m = n // 2  # max possible double steps
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = 1
    
    for i in range(1, n + 1):
        for j in range(m + 1):
            # Came from i-1 with same j (single step)
            if i >= 1:
                dp[i][j] += dp[i-1][j]
            # Came from i-2 with j-1 (double step)
            if i >= 2 and j >= 1:
                dp[i][j] += dp[i-2][j-1]
    
    # Sum all ways with valid double step counts
    return sum(dp[n])
```

<!-- back -->
