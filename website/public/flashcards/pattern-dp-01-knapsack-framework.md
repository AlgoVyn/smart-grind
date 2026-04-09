## DP - 0/1 Knapsack: Framework

What is the complete code template for 0/1 knapsack problems?

<!-- front -->

---

### Framework 1: 0/1 Knapsack (Max Value)

```
┌─────────────────────────────────────────────────────┐
│  0/1 KNAPSACK - TEMPLATE                               │
├─────────────────────────────────────────────────────┤
│  Key: Iterate BACKWARD to prevent item reuse           │
│  (Each item can be used at most once)                  │
│                                                        │
│  1. dp = [0] * (capacity + 1)                          │
│                                                        │
│  2. For each item (weight, value):                    │
│     For w from capacity down to weight:               │
│        dp[w] = max(dp[w], dp[w - weight] + value)    │
│                                                        │
│  3. Return dp[capacity]                                │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Max Value

```python
def knapsack_01(weights, values, capacity):
    """
    0/1 Knapsack: Maximize value without exceeding capacity.
    Time: O(n × capacity), Space: O(capacity)
    """
    dp = [0] * (capacity + 1)
    
    for w, v in zip(weights, values):
        # Iterate backward to prevent reuse
        for cap in range(capacity, w - 1, -1):
            dp[cap] = max(dp[cap], dp[cap - w] + v)
    
    return dp[capacity]
```

---

### Implementation: Subset Sum

```python
def can_subset_sum(nums, target):
    """
    Check if any subset sums to target.
    LeetCode 416 (Partition Equal Subset Sum)
    """
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        for i in range(target, num - 1, -1):
            dp[i] = dp[i] or dp[i - num]
    
    return dp[target]
```

---

### Key Pattern Elements

| Aspect | Forward | Backward |
|--------|---------|----------|
| 0/1 Knapsack | ✗ (allows reuse) | ✓ (once only) |
| Unbounded | ✓ (allows reuse) | ✗ |

**Why backward?** Prevents using the same item multiple times.

<!-- back -->
