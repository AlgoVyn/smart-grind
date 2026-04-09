## DP - 1D Array (Coin Change / Unbounded Knapsack): Comparison Guide

How does Coin Change / Unbounded Knapsack compare to other DP patterns and algorithms?

<!-- front -->

---

### Unbounded vs 0/1 Knapsack

| Aspect | 0/1 Knapsack | Unbounded Knapsack |
|--------|-------------|-------------------|
| **Item usage** | Each item at most once | Unlimited uses |
| **Iteration** | Backward (i from W down to w) | Forward (i from w to W) |
| **State** | Often 2D (items × weight) | Usually 1D (weight) |
| **Goal** | Max value | Min coins / Max value / Count ways |
| **Classic problem** | Standard knapsack | Coin change, rod cutting |

```python
# 0/1 Knapsack - backward iteration
for i in range(n):
    for w in range(W, weights[i] - 1, -1):  # BACKWARD!
        dp[w] = max(dp[w], dp[w - weights[i]] + values[i])

# Unbounded Knapsack - forward iteration
for w in range(1, W + 1):
    for i in range(n):
        if weights[i] <= w:
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])  # FORWARD!
```

---

### Bounded Knapsack Variations

| Variant | Constraint | Approach |
|---------|-----------|----------|
| **0/1 Knapsack** | Each item once | Backward iteration |
| **Unbounded Knapsack** | Unlimited items | Forward iteration |
| **Bounded Knapsack** | Item i at most k[i] times | Binary splitting or monotonic queue |
| **Complete Knapsack** | Another name for unbounded | Forward iteration |

**Bounded to 0/1 transformation:**
```python
# Convert bounded to 0/1 by binary splitting
# Item with limit 13 → items of count: 1, 2, 4, 6 (powers of 2)
# Then solve as 0/1 knapsack
```

---

### Greedy vs DP Decision Tree

```
Coin Change Problem
│
├─ Can use DP? ──► YES ──► O(amount × n), always correct
│
└─ Can use Greedy? ──► Check if canonical
    │
    ├─ YES (e.g., US coins [1,5,10,25])
    │   └─ O(n log n) sort + O(n) greedy
    │
    └─ NO (e.g., [1,3,4])
        └─ Must use DP, greedy fails

Example: coins=[1,3,4], amount=6
  Greedy: 4+1+1 = 3 coins (not optimal)
  Optimal: 3+3 = 2 coins
```

| Algorithm | Time | Space | When Valid |
|-----------|------|-------|------------|
| **DP** | O(amount × n) | O(amount) | Always correct |
| **Greedy** | O(n log n) | O(1) | Canonical systems only |
| **BFS** | O(amount × n) | O(amount) | When finding path |
| **DFS + Memo** | O(amount × n) | O(amount) | Same complexity |

---

### Related DP Patterns

| Problem | Relation to Coin Change |
|---------|------------------------|
| **Climbing Stairs** | Simplified: ways to reach n using steps 1, 2 |
| **Word Break** | String version: segment using dictionary words |
| **Perfect Squares** | Coin change with coins = {1, 4, 9, 16, ...} |
| **Combination Sum** | Find all valid combinations, not just count |
| **Target Sum (+/-)** | Signed variant: assign + or - to each number |
| **Integer Break** | Max product by breaking integer (max not min) |
| **Rod Cutting** | Exact analog: maximize value of rod pieces |

---

### 1D vs 2D DP for Coin Change

| Approach | Space | Use When |
|----------|-------|----------|
| **1D array** | O(amount) | Just need final answer |
| **2D array** | O(n × amount) | Need to reconstruct solution |
| **2D with count limit** | O(n × amount × k) | Limited coin supply |

**2D reconstruction template:**
```python
def coin_change_2d(coins, amount):
    n = len(coins)
    dp = [[float('inf')] * (amount + 1) for _ in range(n + 1)]
    dp[0][0] = 0
    
    for i in range(1, n + 1):
        coin = coins[i - 1]
        for j in range(amount + 1):
            # Don't use coin i
            dp[i][j] = dp[i - 1][j]
            # Use coin i (can reuse in unbounded)
            if j >= coin and dp[i][j - coin] != float('inf'):
                dp[i][j] = min(dp[i][j], dp[i][j - coin] + 1)
    
    return dp[n][amount]
```

<!-- back -->
