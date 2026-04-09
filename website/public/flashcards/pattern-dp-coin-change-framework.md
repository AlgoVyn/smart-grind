## DP - Coin Change (Unbounded Knapsack): Framework

What is the complete code template for coin change problems?

<!-- front -->

---

### Framework 1: Minimum Coins Template

```
┌─────────────────────────────────────────────────────┐
│  COIN CHANGE - MINIMUM COINS                           │
├─────────────────────────────────────────────────────┤
│  1. Initialize dp array:                               │
│     dp[i] = minimum coins to make amount i             │
│     dp = [infinity] * (amount + 1)                    │
│     dp[0] = 0  (base case)                            │
│                                                        │
│  2. For each i from 1 to amount:                      │
│     For each coin in coins:                           │
│        If coin <= i:                                  │
│           dp[i] = min(dp[i], dp[i - coin] + 1)        │
│                                                        │
│  3. Return dp[amount] if != infinity, else -1         │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Minimum Coins

```python
def coin_change(coins, amount):
    """
    Find minimum coins needed to make amount.
    LeetCode 322 - Coin Change
    Time: O(amount * n), Space: O(amount)
    """
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case
    
    # For each amount, try all coins
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

---

### Framework 2: Number of Ways (Combinations)

```python
def coin_change_ways(coins, amount):
    """
    Count number of ways to make amount.
    LeetCode 518 - Coin Change 2
    Order: coin outer loop for combinations
    """
    dp = [0] * (amount + 1)
    dp[0] = 1  # One way to make amount 0
    
    # Coin outer loop = combinations (order doesn't matter)
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    
    return dp[amount]
```

---

### Framework 3: Number of Ways (Permutations)

```python
def coin_change_permutations(coins, amount):
    """
    Count number of ways (order matters = permutations).
    """
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    # Amount outer loop = permutations (order matters)
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] += dp[i - coin]
    
    return dp[amount]
```

---

### Key Pattern Elements

| Problem | Initialization | Loop Order | Transition |
|---------|----------------|------------|------------|
| Min coins | `inf`, `dp[0]=0` | Any | `min(dp[i], dp[i-coin]+1)` |
| Ways (combinations) | `0`, `dp[0]=1` | Coin outer | `dp[i] += dp[i-coin]` |
| Ways (permutations) | `0`, `dp[0]=1` | Amount outer | `dp[i] += dp[i-coin]` |

<!-- back -->
