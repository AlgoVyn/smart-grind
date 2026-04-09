## DP - Coin Change (Unbounded Knapsack): Core Concepts

What are the fundamental principles of coin change / unbounded knapsack?

<!-- front -->

---

### Core Concept

**In unbounded knapsack, each item can be used unlimited times. Iterate forward through amounts to allow reuse of the same coin.**

The key difference from 0/1 knapsack:
- 0/1 Knapsack: Iterate backwards to prevent reuse
- Unbounded: Iterate forwards to allow reuse

**Why forward iteration allows reuse:**
```
For coin = 2:
i=2: dp[2] uses dp[0] (which doesn't use coin 2)
i=4: dp[4] uses dp[2] (which already used coin 2!)
     So dp[4] can use coin 2 twice
```

---

### The Pattern

```
Problem Types:
1. MINIMUM COINS: dp[i] = min coins for amount i
2. NUMBER OF WAYS: dp[i] = ways to make amount i

Key decisions:
- Loop order matters for ways!
  * Coin outer → combinations (order doesn't matter)
  * Amount outer → permutations (order matters)

Example: coins=[1,2], amount=3
Combinations: {1,1,1}, {1,2} → 2 ways
Permutations: (1,1,1), (1,2), (2,1) → 3 ways
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Minimum coins | Make change efficiently | LeetCode 322 |
| Number of ways | Count combinations | LeetCode 518 |
| Rod cutting | Maximize value | Classic DP |
| Integer partition | Ways to partition | Number theory |
| Unbounded knapsack | Maximize value | Extended knapsack |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(amount × n) | n = number of coins |
| Space | O(amount) | 1D DP array |
| With optimization | Same | No asymptotic improvement |

---

### Combinations vs Permutations

```python
# COMBINATIONS (order doesn't matter)
# Ways to make 3 with [1,2]: {1,1,1}, {1,2}
for coin in coins:           # ← Coin outer
    for i in range(coin, amount+1):
        dp[i] += dp[i-coin]

# PERMUTATIONS (order matters)  
# Ways to make 3: (1,1,1), (1,2), (2,1)
for i in range(amount+1):    # ← Amount outer
    for coin in coins:
        if coin <= i:
            dp[i] += dp[i-coin]
```

<!-- back -->
