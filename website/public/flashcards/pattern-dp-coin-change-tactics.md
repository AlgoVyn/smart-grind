## DP - Coin Change (Unbounded Knapsack): Tactics

What are the advanced techniques for coin change problems?

<!-- front -->

---

### Tactic 1: Space Optimization (Not Possible)

Unlike 0/1 knapsack, unbounded knapsack **cannot** use O(1) space:

```python
# This DOESN'T work for coin change
# because we need to access dp[i-coin] which might
# have been updated in the same iteration
# (and that's exactly what we want for unbounded!)

def coin_change_space_fail(coins, amount):
    """This gives wrong answer - DON'T USE."""
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            # This only allows each coin once (0/1 style)
            # NOT unlimited use!
            dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount]
```

**Key insight**: Coin outer loop gives combinations, not minimum coins correctly!

---

### Tactic 2: Reconstruct Solution

```python
def coin_change_with_solution(coins, amount):
    """Return coins used to make amount."""
    dp = [float('inf')] * (amount + 1)
    parent = [-1] * (amount + 1)  # Track which coin used
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] + 1 < dp[i]:
                dp[i] = dp[i - coin] + 1
                parent[i] = coin
    
    if dp[amount] == float('inf'):
        return []
    
    # Reconstruct
    solution = []
    cur = amount
    while cur > 0:
        solution.append(parent[cur])
        cur -= parent[cur]
    
    return solution
```

---

### Tactic 3: Greedy vs DP

```python
def coin_change_greedy(coins, amount):
    """
    Greedy works for canonical coin systems (US coins).
    DOESN'T work for arbitrary coins!
    """
    coins.sort(reverse=True)
    count = 0
    remaining = amount
    
    for coin in coins:
        count += remaining // coin
        remaining %= coin
    
    return count if remaining == 0 else -1

# Example where greedy fails:
# coins = [1, 3, 4], amount = 6
# Greedy: 4 + 1 + 1 = 3 coins
# Optimal: 3 + 3 = 2 coins
```

**Always use DP for arbitrary coin systems!**

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Wrong initialization | Wrong answer | `inf` for min, `0` for ways, `dp[0]=1` or `0` |
| Backward iteration | 0/1 style | Forward for unbounded |
| Integer overflow | Large numbers | Use modulo if needed |
| Not checking infinity | Return inf | Check and return -1 or appropriate value |
| Greedy approach | Wrong answer | Use DP unless canonical system |

---

### Tactic 5: Rod Cutting (Max Value)

```python
def rod_cutting(prices, n):
    """
    Max value obtainable by cutting rod of length n.
    prices[i] = price of rod length i+1
    """
    dp = [0] * (n + 1)
    
    for length in range(1, n + 1):
        for cut_len in range(1, length + 1):
            dp[length] = max(dp[length], 
                           prices[cut_len - 1] + dp[length - cut_len])
    
    return dp[n]
```

---

### Tactic 6: BFS for Minimum Coins

```python
from collections import deque

def coin_change_bfs(coins, amount):
    """BFS finds shortest path (minimum coins)."""
    if amount == 0:
        return 0
    
    queue = deque([(0, 0)])  # (current_amount, num_coins)
    visited = {0}
    
    while queue:
        cur, coins_used = queue.popleft()
        
        for coin in coins:
            next_amount = cur + coin
            
            if next_amount == amount:
                return coins_used + 1
            
            if next_amount < amount and next_amount not in visited:
                visited.add(next_amount)
                queue.append((next_amount, coins_used + 1))
    
    return -1
```

<!-- back -->
