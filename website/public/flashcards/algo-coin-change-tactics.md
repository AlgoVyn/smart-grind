## Coin Change: Tactics & Tricks

What are the essential tactics for optimizing coin change solutions?

<!-- front -->

---

### Tactic 1: Loop Order Matters

```python
# COMBINATIONS (order doesn't matter) - coins outer
def ways_combinations(coins, amount):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:        # Outer: coin type
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    return dp[amount]

# PERMUTATIONS (order matters) - amount outer
def ways_permutations(coins, amount):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for i in range(1, amount + 1):  # Outer: amount
        for coin in coins:
            if coin <= i:
                dp[i] += dp[i - coin]
    return dp[amount]
```

**Memory:** Coin outer = combinations, Amount outer = permutations.

---

### Tactic 2: BFS for Minimum Coins

When you need shortest path (minimum coins), BFS works:

```python
from collections import deque

def coin_change_bfs(coins, amount):
    """BFS: each edge = using one coin"""
    if amount == 0:
        return 0
    
    queue = deque([(0, 0)])  # (current_amount, num_coins)
    visited = {0}
    
    while queue:
        cur, steps = queue.popleft()
        
        for coin in coins:
            next_amount = cur + coin
            if next_amount == amount:
                return steps + 1
            if next_amount < amount and next_amount not in visited:
                visited.add(next_amount)
                queue.append((next_amount, steps + 1))
    
    return -1
```

**When to use:** Coins are small, amount is moderate. BFS can be faster in practice.

---

### Tactic 3: Pruning with Sorting

```python
def coin_change_pruned(coins, amount):
    coins.sort(reverse=True)  # Largest first for early termination
    
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            if dp[i - coin] + 1 < dp[i]:
                dp[i] = dp[i - coin] + 1
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

---

### Tactic 4: Early Exit for Greedy-Check

```python
def is_greedy_valid(coins):
    """
    Check if greedy works (canonical coin system)
    For 2 coins: always works
    For 3+ coins: check all amounts up to coins[-2] + coins[-1]
    """
    if len(coins) <= 2:
        return True
    
    limit = coins[-1] + coins[-2]
    
    for amount in range(1, limit):
        # Greedy solution
        greedy = 0
        remaining = amount
        for c in reversed(coins):
            greedy += remaining // c
            remaining %= c
        
        # DP solution
        dp = coin_change_min(coins, amount)
        
        if greedy != dp:
            return False
    
    return True
```

---

### Tactic 5: Space Optimization for Small Coins

```python
def coin_change_rolling(coins, amount):
    """
    Only keep dp for last max(coins) elements
    """
    if not coins:
        return -1 if amount > 0 else 0
    
    max_coin = max(coins)
    dp = [float('inf')] * max_coin
    dp[0] = 0
    
    for i in range(1, amount + 1):
        min_val = float('inf')
        for coin in coins:
            if coin <= i:
                idx = (i - coin) % max_coin
                min_val = min(min_val, dp[idx] + 1)
        
        dp[i % max_coin] = min_val
    
    result = dp[amount % max_coin]
    return -1 if result == float('inf') else result
```

<!-- back -->
