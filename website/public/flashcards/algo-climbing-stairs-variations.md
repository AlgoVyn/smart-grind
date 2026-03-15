## Climbing Stairs - Variations

**Question:** How would you solve if you could take 1, 2, or 3 steps?

<!-- front -->

---

## Climbing Stairs Variations

### Variation 1: k Steps at a Time
```python
def climb_stairs_k(n, k):
    dp = [0] * (n + 1)
    dp[0] = 1
    
    for i in range(1, n + 1):
        for step in range(1, k + 1):
            if i >= step:
                dp[i] += dp[i - step]
    
    return dp[n]
```

### Variation 2: With Obstacles
```python
def climb_with_obstacles(n, blocked):
    dp = [0] * (n + 1)
    dp[0] = 1
    
    for i in range(1, n + 1):
        if i in blocked:
            dp[i] = 0
        else:
            dp[i] = dp[i-1] + (dp[i-2] if i >= 2 else 0)
    
    return dp[n]
```

### Variation 3: Min Cost Climbing
```python
def min_cost_climb(cost):
    n = len(cost)
    dp = [0] * (n + 1)
    
    for i in range(2, n + 1):
        dp[i] = min(
            dp[i-1] + cost[i-1],
            dp[i-2] + cost[i-2]
        )
    
    return dp[n]
```

### 💡 Key Pattern
All variations follow: `dp[i] = sum of valid dp[i-step]`

### Complexity
- Time: O(n × k)
- Space: O(n)

<!-- back -->
