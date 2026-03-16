## Climbing Stairs

**Question:** Ways to climb n stairs taking 1 or 2 steps?

<!-- front -->

---

## Answer: Dynamic Programming

### Solution
```python
def climbStairs(n):
    if n <= 2:
        return n
    
    # dp[i] = ways to reach step i
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]
```

### Visual: Recurrence
```
n=5

Step 1: 1 way
Step 2: 2 ways (1+1, 2)
Step 3: dp[2]+dp[1] = 2+1 = 3 (1+1+1, 1+2, 2+1)
Step 4: dp[3]+dp[2] = 3+2 = 5
Step 5: dp[4]+dp[3] = 5+3 = 8

Fibonacci sequence!
```

### ⚠️ Tricky Parts

#### 1. Space Optimization
```python
# Only need previous two values
def climbStairsOptimized(n):
    if n <= 2:
        return n
    
    prev2, prev1 = 1, 2
    
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1
```

#### 2. Variations
```python
# Can take 1, 2, or 3 steps
def climbStairs3(n):
    if n == 1: return 1
    if n == 2: return 2
    if n == 3: return 4
    
    dp = [0] * (n + 1)
    dp[1], dp[2], dp[3] = 1, 2, 4
    
    for i in range(4, n + 1):
        dp[i] = dp[i-1] + dp[i-2] + dp[i-3]
    
    return dp[n]

# With costs (minimum energy)
def minCostClimbing(cost):
    n = len(cost)
    dp = [0] * (n + 1)
    
    for i in range(2, n + 1):
        dp[i] = min(dp[i-1] + cost[i-1], 
                   dp[i-2] + cost[i-2] if i > 2 else cost[i-2])
    
    return dp[n]
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| DP Array | O(n) | O(n) |
| Optimized | O(n) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong base cases | dp[1]=1, dp[2]=2 |
| Off-by-one | Loop from 3 to n |

<!-- back -->
