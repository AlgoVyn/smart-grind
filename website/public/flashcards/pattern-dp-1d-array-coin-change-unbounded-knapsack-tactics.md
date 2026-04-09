## DP - 1D Array (Coin Change / Unbounded Knapsack): Tactics

What are specific techniques and optimizations for Coin Change and Unbounded Knapsack problems?

<!-- front -->

---

### Tactic 1: Space Optimization Confirmation

**1D is optimal** - cannot reduce further for pure amount-based problems.

```python
# Standard O(amount) space
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

**When to use 2D:**
- Need to reconstruct which coins were used
- Need to track multiple constraints (amount + count limit)

---

### Tactic 2: Coin Outer vs Amount Outer Optimization

**For counting minimum coins:** Either order works.

```python
# Both are correct for minimum coins
# Version A: Amount outer
for i in range(1, amount + 1):
    for coin in coins:
        if coin <= i:
            dp[i] = min(dp[i], dp[i - coin] + 1)

# Version B: Coin outer
for coin in coins:
    for i in range(coin, amount + 1):
        dp[i] = min(dp[i], dp[i - coin] + 1)
```

**For counting ways:** Order determines combinations vs permutations.

| Variant | Loop Order | Result |
|---------|------------|--------|
| Coin Change II | Coin outer | Combinations (order irrelevant) |
| Combination Sum IV | Amount outer | Permutations (order matters) |

---

### Tactic 3: Handling Large Amounts / Overflow

**Integer overflow protection:**
```python
def coin_change_ways_safe(coins, amount, MOD=10**9 + 7):
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = (dp[i] + dp[i - coin]) % MOD
    
    return dp[amount]
```

**Early termination for impossible amounts:**
```python
def coin_change_early_exit(coins, amount):
    min_coin = min(coins)
    if amount < min_coin and amount != 0:
        return -1  # Impossible immediately
    
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] != float('inf'):
                dp[i] = min(dp[i], dp[i - coin] + 1)
        # Early exit: if dp[i] still inf, no need to continue?
        # Only if we know subsequent amounts also impossible
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

---

### Tactic 4: Greedy Check for Canonical Systems

**When to try greedy first:**
```python
def is_canonical(coins):
    """Check if greedy works for all amounts up to reasonable limit."""
    # Canonical systems: US coins, some others
    max_check = coins[-1] + coins[-2] if len(coins) >= 2 else coins[0] * 2
    
    for amount in range(1, max_check + 1):
        # Greedy solution
        greedy = 0
        remaining = amount
        for coin in reversed(coins):
            if coin <= remaining:
                greedy += remaining // coin
                remaining %= coin
        
        # DP solution
        dp = coin_change_min(coins, amount)
        
        if greedy != dp:
            return False  # Not canonical
    
    return True

# US coins: [1, 5, 10, 25] - canonical, greedy works
# Non-canonical: [1, 3, 4] - greedy fails for amount=6
```

---

### Tactic 5: Reconstruction - Finding Actual Coins Used

**Track parent pointers:**
```python
def coin_change_with_reconstruction(coins, amount):
    dp = [float('inf')] * (amount + 1)
    parent = [-1] * (amount + 1)  # Track which coin was used
    dp[0] = 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            if dp[i - coin] + 1 < dp[i]:
                dp[i] = dp[i - coin] + 1
                parent[i] = coin  # i was achieved using 'coin'
    
    if dp[amount] == float('inf'):
        return -1, []
    
    # Reconstruct the coins used
    result = []
    cur = amount
    while cur > 0:
        result.append(parent[cur])
        cur -= parent[cur]
    
    return dp[amount], result

# Example: coins=[1,2,5], amount=11
# Returns: (3, [5, 5, 1]) or similar
```

---

### Tactic 6: BFS Alternative for Minimum Coins

**When amount is large but coins are small:**
```python
from collections import deque

def coin_change_bfs(coins, amount):
    """BFS finds shortest path (minimum coins)."""
    if amount == 0:
        return 0
    
    visited = set()
    queue = deque([(0, 0)])  # (current_amount, num_coins)
    
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

**Trade-offs:**
| Method | Best When | Time |
|--------|-----------|------|
| DP | Most cases | O(amount × n) |
| BFS | Large amount, small coins, sparse solutions | O(min_coins × branching) |

<!-- back -->
