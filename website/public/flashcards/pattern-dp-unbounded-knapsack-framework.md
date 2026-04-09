## DP - Unbounded Knapsack / Coin Change: Framework

What is the complete code template for unbounded knapsack and coin change problems?

<!-- front -->

---

### Framework 1: Unbounded Knapsack Template

```
┌─────────────────────────────────────────────────────┐
│  UNBOUNDED KNAPSACK / COIN CHANGE - TEMPLATE         │
├─────────────────────────────────────────────────────┤
│  1. Initialize dp[0..W] = 0 or ∞                   │
│     - For max: dp[0] = 0, rest = 0                 │
│     - For min: dp[0] = 0, rest = ∞                 │
│                                                      │
│  2. For each item/coin:                            │
│     For w from item_weight to W: (FORWARD!)          │
│        dp[w] = opt(dp[w], dp[w - weight] + value)    │
│                                                      │
│  3. Return dp[W]                                      │
│                                                      │
│  Key: Forward iteration allows reuse!               │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Coin Change (Min Coins)

```python
def coin_change(coins, amount):
    """Return minimum coins to make amount."""
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for w in range(coin, amount + 1):
            dp[w] = min(dp[w], dp[w - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

---

### Implementation: Coin Change II (Count Ways)

```python
def coin_change_ways(coins, amount):
    """Count number of ways to make amount."""
    dp = [0] * (amount + 1)
    dp[0] = 1  # One way to make 0
    
    for coin in coins:
        for w in range(coin, amount + 1):
            dp[w] += dp[w - coin]
    
    return dp[amount]
```

---

### Implementation: Rod Cutting (Max Value)

```python
def rod_cutting(prices, n):
    """Max value from cutting rod of length n."""
    dp = [0] * (n + 1)
    
    for length in range(1, n + 1):
        for cut in range(1, length + 1):
            dp[length] = max(dp[length], prices[cut] + dp[length - cut])
    
    return dp[n]
```

---

### Key Pattern Elements

| Element | 0-1 Knapsack | Unbounded Knapsack |
|---------|-------------|-------------------|
| Loop direction | Backwards | Forwards |
| Reuse | No | Yes |
| Base case | dp[0] = 0 | dp[0] = 0 |
| Fill value | -∞ or 0 | 0 or ∞ |

<!-- back -->
