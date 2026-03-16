## Coin Change

**Question:** Minimum coins needed to make amount?

<!-- front -->

---

## Answer: Bottom-Up DP

### Solution
```python
def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

### Visual: DP Table
```
coins = [1, 2, 5], amount = 11

dp:  [0, inf, inf, inf, inf, inf, inf, inf, inf, inf, inf, inf]

coin=1:  [0,1,2,3,4,5,6,7,8,9,10,11]
coin=2:  [0,1,1,2,2,3,3,4,4,5,5,6]
coin=5:  [0,1,1,2,2,1,2,2,3,3,1,2]

Answer: dp[11] = 2 (5+5+1)
```

### ⚠️ Tricky Parts

#### 1. Why Forward Iteration?
```python
# For unbounded knapsack (unlimited coins)
# Can use same coin multiple times
# So iterate forward: dp[x] depends on dp[x-coin]

# For 0/1 knapsack:
# Iterate backward to avoid reusing item
```

#### 2. Infinity Initialization
```python
# Initialize with infinity to represent "impossible"
dp = [float('inf')] * (amount + 1)
dp[0] = 0  # Base case: 0 coins for amount 0

# At end, check if reachable
return dp[amount] if dp[amount] != float('inf') else -1
```

#### 3. Why This Works
```python
# dp[x] = min coins needed for amount x
# dp[x] = min(dp[x], dp[x-coin] + 1)
# Either don't use coin, or use coin and add 1

# By processing all coins, we find minimum
```

### Alternative: BFS (For Small Amounts)
```python
from collections import deque

def coinChangeBFS(coins, amount):
    if amount == 0:
        return 0
    
    visited = set()
    queue = deque([(0, 0)])  # (amount, count)
    
    while queue:
        curr, count = queue.popleft()
        
        for coin in coins:
            next_amount = curr + coin
            
            if next_amount == amount:
                return count + 1
            
            if next_amount < amount and next_amount not in visited:
                visited.add(next_amount)
                queue.append((next_amount, count + 1))
    
    return -1
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| DP | O(amount × coins) | O(amount) |
| BFS | O(amount × coins) | O(amount) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong iteration | Unbounded → forward |
| Forgetting infinity | Use inf for impossible |
| Wrong base case | dp[0] = 0 |

<!-- back -->
