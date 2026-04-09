## DP - 0/1 Knapsack: Tactics

What are the advanced techniques for 0/1 knapsack?

<!-- front -->

---

### Tactic 1: Find Selected Items

```python
def knapsack_with_items(weights, values, capacity):
    """Return max value and selected items."""
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    # Fill DP table
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i-1][w], 
                              dp[i-1][w-weights[i-1]] + values[i-1])
            else:
                dp[i][w] = dp[i-1][w]
    
    # Backtrack to find items
    items = []
    w = capacity
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i-1][w]:
            items.append(i-1)
            w -= weights[i-1]
    
    return dp[n][capacity], items
```

---

### Tactic 2: Count Number of Ways

```python
def count_subset_sum(nums, target):
    """Count subsets that sum to target."""
    dp = [0] * (target + 1)
    dp[0] = 1
    
    for num in nums:
        for i in range(target, num - 1, -1):
            dp[i] += dp[i - num]
    
    return dp[target]
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Forward iteration | Item reuse | Iterate backward |
| Wrong initialization | Wrong result | dp[0] = True or 0 |
| Integer overflow | Large numbers | Use modulo if needed |
| Not checking bounds | Index error | Check weight <= capacity |

---

### Tactic 4: Space Optimized 2D to 1D

```python
def knapsack_optimized(weights, values, capacity):
    """Space optimized 1D version."""
    dp = [0] * (capacity + 1)
    
    for w, v in zip(weights, values):
        # Must go backward for 0/1
        for cap in range(capacity, w - 1, -1):
            dp[cap] = max(dp[cap], dp[cap - w] + v)
    
    return dp[capacity]
```

<!-- back -->
