## DP - 1D Array (Coin Change / Unbounded Knapsack): Framework

What is the complete code template for solving Coin Change and Unbounded Knapsack problems with a 1D DP array?

<!-- front -->

---

### Core Framework

```
┌─────────────────────────────────────────────────────────┐
│  UNBOUNDED KNAPSACK / COIN CHANGE - 1D DP FRAMEWORK      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. Initialize dp[0..target] appropriately:              │
│     • Min coins:  dp[0] = 0,  rest = ∞                   │
│     • Count ways: dp[0] = 1,  rest = 0                   │
│     • Max value:  dp[0] = 0,  rest = 0                   │
│                                                           │
│  2. For each amount from 1 to target:                    │
│       For each coin/item:                                │
│         If coin ≤ amount:                                │
│           dp[amount] = opt(dp[amount],                  │
│                            dp[amount - coin] + value)     │
│                                                           │
│  Key insight: Forward iteration allows unlimited reuse!  │
└─────────────────────────────────────────────────────────┘
```

---

### Implementation: Minimum Coins

```python
def coin_change_min(coins, amount):
    """Return minimum coins needed to make amount."""
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base: 0 coins for amount 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

---

### Implementation: Count Ways (Combinations)

```python
def coin_change_ways(coins, amount):
    """Count ways to make amount (order doesn't matter)."""
    dp = [0] * (amount + 1)
    dp[0] = 1  # Base: one way to make amount 0
    
    # Coin outer loop = combinations
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    
    return dp[amount]
```

---

### Implementation: Unbounded Knapsack (Max Value)

```python
def unbounded_knapsack(values, weights, capacity):
    """Maximize value with unlimited items."""
    dp = [0] * (capacity + 1)
    
    for w in range(1, capacity + 1):
        for i in range(len(values)):
            if weights[i] <= w:
                dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]
```

---

### Complexity Summary

| Problem Type | Time | Space | Loop Order |
|-------------|------|-------|------------|
| Minimum coins | O(amount × n) | O(amount) | Either |
| Count ways | O(amount × n) | O(amount) | Coin outer |
| Count permutations | O(amount × n) | O(amount) | Amount outer |
| Max value | O(capacity × n) | O(capacity) | Forward |

<!-- back -->
