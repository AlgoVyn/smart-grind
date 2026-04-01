## Coin Change: Problem Forms

What are the variations and extensions of the coin change problem?

<!-- front -->

---

### Finite Supply (0/1 Knapsack Variant)

```python
def coin_change_limited(coins: list, amount: int, limits: list) -> int:
    """
    Each coin[i] can be used at most limits[i] times
    """
    n = len(coins)
    # dp[i] = min coins using first i coin types
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(n):
        coin = coins[i]
        limit = limits[i]
        # Update from high to low (0/1 knapsack style)
        for a in range(amount, -1, -1):
            if dp[a] != float('inf'):
                for k in range(1, limit + 1):
                    if a + k * coin <= amount:
                        dp[a + k * coin] = min(
                            dp[a + k * coin],
                            dp[a] + k
                        )
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

---

### Exact Coin Count Constraint

**Problem:** Must use exactly k coins to make amount.

```python
def coin_change_exact_k(coins: list, amount: int, k: int) -> int:
    """
    Number of ways using exactly k coins
    """
    # dp[a][c] = ways to make amount 'a' with 'c' coins
    dp = [[0] * (k + 1) for _ in range(amount + 1)]
    dp[0][0] = 1
    
    for coin in coins:
        for a in range(coin, amount + 1):
            for c in range(1, k + 1):
                dp[a][c] += dp[a - coin][c - 1]
    
    return dp[amount][k]
```

---

### Maximum Amount with N Coins

**Problem:** What's the largest amount you cannot make with any number of coins?

```python
def max_unmakeable(coins: list) -> int:
    """
    Frobenius coin problem for 2 coins: ab - a - b
    For general: use DP to find largest unreachable
    """
    coins.sort()
    max_check = coins[-1] * coins[-2]  # Upper bound for 2 coins
    
    reachable = [False] * (max_check + 2)
    reachable[0] = True
    
    for i in range(1, max_check + 2):
        for coin in coins:
            if coin <= i and reachable[i - coin]:
                reachable[i] = True
                break
    
    # Find largest unreachable
    for i in range(max_check, -1, -1):
        if not reachable[i]:
            return i
    
    return -1  # All amounts reachable (e.g., have 1-cent coin)
```

---

### Minimum Coin Types

**Problem:** Minimize distinct coin types used, not total coins.

```python
def coin_change_min_types(coins: list, amount: int) -> int:
    """
    Use minimum number of different coin denominations
    """
    INF = float('inf')
    # dp[i] = min distinct types to make amount i
    dp = [INF] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            if dp[i - coin] != INF:
                # Using this coin adds 1 to type count (if first time)
                # Track separately: new dp = min coin types
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != INF else -1
```

---

### Change Making with Fee

**Problem:** Each coin has a "transaction cost" or weight.

```python
def coin_change_with_weight(coins: list, amount: int, weights: list) -> int:
    """
    Minimize total weight, not count
    """
    # dp[i] = min weight to make amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i, coin in enumerate(coins):
        weight = weights[i]
        for a in range(coin, amount + 1):
            dp[a] = min(dp[a], dp[a - coin] + weight)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

<!-- back -->
