## Coin Change: Algorithm Framework

What are the complete implementations for both coin change variants?

<!-- front -->

---

### Minimum Coins (Bottom-Up)

```python
def coin_change_min(coins: list, amount: int) -> int:
    """
    Return minimum coins to make amount, or -1 if impossible
    Time: O(amount × len(coins)), Space: O(amount)
    """
    # dp[i] = minimum coins to make amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Zero coins for amount 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

---

### Minimum Coins (Space-Optimized)

```python
def coin_change_min_optimized(coins: list, amount: int) -> int:
    """
    Same but with early termination check
    """
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    # Sort coins for potential pruning
    coins.sort()
    
    for coin in coins:  # Coin outer loop also works
        for i in range(coin, amount + 1):
            if dp[i - coin] != float('inf'):
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return -1 if dp[amount] == float('inf') else dp[amount]
```

---

### Number of Ways (Combinations - Coin Order Doesn't Matter)

```python
def coin_change_ways(coins: list, amount: int) -> int:
    """
    Number of combinations that make up amount
    Coins outer loop ensures combinations (not permutations)
    """
    dp = [0] * (amount + 1)
    dp[0] = 1  # One way to make amount 0 (use nothing)
    
    for coin in coins:  # For each coin type
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    
    return dp[amount]

# Example: coins=[1,2,5], amount=5
# Ways: [1,1,1,1,1], [1,1,1,2], [1,2,2], [5] = 4 ways
```

---

### Number of Ways (Permutations - Order Matters)

```python
def coin_change_ways_permutations(coins: list, amount: int) -> int:
    """
    Number of permutations (order matters)
    Amount outer loop generates permutations
    """
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for i in range(1, amount + 1):  # For each amount
        for coin in coins:  # Try each coin
            if coin <= i:
                dp[i] += dp[i - coin]
    
    return dp[amount]

# Example: coins=[1,2], amount=3
# Permutations: [1,1,1], [1,2], [2,1] = 3 (vs 2 combinations)
```

---

### Path Reconstruction (Which Coins Used)

```python
def coin_change_with_path(coins: list, amount: int):
    """
    Returns min coins and the actual coin combination
    """
    dp = [float('inf')] * (amount + 1)
    parent = [-1] * (amount + 1)  # Track which coin used
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] + 1 < dp[i]:
                dp[i] = dp[i - coin] + 1
                parent[i] = coin
    
    if dp[amount] == float('inf'):
        return -1, []
    
    # Reconstruct path
    path = []
    cur = amount
    while cur > 0:
        path.append(parent[cur])
        cur -= parent[cur]
    
    return dp[amount], path
```

<!-- back -->
