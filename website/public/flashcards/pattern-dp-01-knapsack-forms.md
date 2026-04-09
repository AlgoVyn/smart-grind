## DP - 0/1 Knapsack: Forms

What are the different variations of 0/1 knapsack?

<!-- front -->

---

### Form 1: Maximize Value

```python
def knapsack_max_value(weights, values, capacity):
    """Maximize value within capacity."""
    dp = [0] * (capacity + 1)
    
    for w, v in zip(weights, values):
        for cap in range(capacity, w - 1, -1):
            dp[cap] = max(dp[cap], dp[cap - w] + v)
    
    return dp[capacity]
```

---

### Form 2: Subset Sum (Boolean)

```python
def subset_sum(nums, target):
    """Check if subset sums to target."""
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        for i in range(target, num - 1, -1):
            dp[i] = dp[i] or dp[i - num]
    
    return dp[target]
```

---

### Form 3: Count Ways

```python
def count_ways(nums, target):
    """Count subsets that sum to target."""
    dp = [0] * (target + 1)
    dp[0] = 1
    
    for num in nums:
        for i in range(target, num - 1, -1):
            dp[i] += dp[i - num]
    
    return dp[target]
```

---

### Form Comparison

| Form | Goal | Transition |
|------|------|------------|
| Max value | Maximize | `max(dp[w], dp[w-weight]+value)` |
| Subset sum | Existence | `dp[i] or dp[i-num]` |
| Count ways | Count | `dp[i] += dp[i-num]` |

<!-- back -->
