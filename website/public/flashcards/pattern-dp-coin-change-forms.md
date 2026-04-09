## DP - Coin Change (Unbounded Knapsack): Forms

What are the different variations of coin change problems?

<!-- front -->

---

### Form 1: Minimum Coins

```python
def coin_change_min(coins, amount):
    """Minimum coins to make amount."""
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

---

### Form 2: Number of Ways (Combinations)

```python
def coin_change_combinations(coins, amount):
    """Ways to make amount (order doesn't matter)."""
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    
    return dp[amount]
```

---

### Form 3: Number of Ways (Permutations)

```python
def coin_change_permutations(coins, amount):
    """Ways to make amount (order matters)."""
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] += dp[i - coin]
    
    return dp[amount]
```

---

### Form 4: Rod Cutting (Maximum Value)

```python
def rod_cutting(prices, n):
    """Maximum value from cutting rod of length n."""
    dp = [0] * (n + 1)
    
    for length in range(1, n + 1):
        for cut in range(1, length + 1):
            dp[length] = max(dp[length], 
                           prices[cut - 1] + dp[length - cut])
    
    return dp[n]
```

---

### Form 5: Unbounded Knapsack (Max Value)

```python
def unbounded_knapsack(weights, values, capacity):
    """Max value with unlimited items."""
    dp = [0] * (capacity + 1)
    
    for w in range(1, capacity + 1):
        for i in range(len(weights)):
            if weights[i] <= w:
                dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]
```

---

### Form Comparison

| Form | Goal | Loop Order | Transition |
|------|------|------------|------------|
| Min coins | Minimize count | Any | `min(dp[i], dp[i-coin]+1)` |
| Combinations | Count ways | Coin outer | `dp[i] += dp[i-coin]` |
| Permutations | Count ways | Amount outer | `dp[i] += dp[i-coin]` |
| Rod cutting | Max value | Any | `max(dp[w], dp[w-cut]+price)` |
| Unbounded knapsack | Max value | Any | `max(dp[w], dp[w-weight]+value)` |

<!-- back -->
