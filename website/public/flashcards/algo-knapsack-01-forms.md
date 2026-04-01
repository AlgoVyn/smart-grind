## Title: 0/1 Knapsack Forms

What are the different forms and variants of knapsack problems?

<!-- front -->

---

### Problem Variants

| Variant | Constraint | DP Direction |
|---------|------------|--------------|
| 0/1 Knapsack | Each item once | Backward j |
| Unbounded | Unlimited copies | Forward j |
| Bounded | At most k copies | Multiple passes or optimized |
| Group | One from each group | Nested loops |
| Multi-dimensional | Multiple constraints | Multi-dim dp |

### Unbounded Knapsack (Forward)
```python
def unbounded_knapsack(weights, values, W):
    dp = [0] * (W + 1)
    for i in range(n):
        for j in range(weights[i], W + 1):  # FORWARD!
            dp[j] = max(dp[j], dp[j - weights[i]] + values[i])
    return dp[W]
```

---

### Alternative DP: Value-Based
```python
# dp[v] = min weight to achieve value v
# Use when max value small, W large

def knapsack_by_value(weights, values, max_val):
    INF = float('inf')
    dp = [INF] * (max_val + 1)
    dp[0] = 0
    
    for i in range(n):
        for v in range(max_val, values[i] - 1, -1):
            dp[v] = min(dp[v], dp[v - values[i]] + weights[i])
    
    # Find max v where dp[v] <= W
    for v in range(max_val, -1, -1):
        if dp[v] <= W:
            return v
```

---

### Advanced Forms
| Form | Description |
|------|-------------|
| Fractional | Greedy by value/weight ratio |
| Subset sum | Special case: value = weight |
| Count ways | Ways to fill exactly W |
| K-partition | Divide into k equal sum sets |

<!-- back -->
