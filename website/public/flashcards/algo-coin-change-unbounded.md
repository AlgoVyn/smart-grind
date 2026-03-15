## Coin Change - Unbounded Knapsack

**Question:** Why is this unbounded (not 0/1) knapsack?

<!-- front -->

---

## Coin Change: Unbounded vs 0/1

### Why Unbounded?
Each coin can be used **unlimited times**.
- `dp[i]` = minimum coins to make amount `i`
- When processing coin `c`, we use updated `dp[i-c]` (same iteration)

### Algorithm
```python
def coin_change(coins, amount):
    dp = [float("inf")] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    
    return dp[amount] if dp[amount] != float("inf") else -1
```

### Iteration Order: Forward!
```python
for coin in coins:
    for x in range(coin, amount + 1):  # FORWARD
        dp[x] = min(dp[x], dp[x - coin] + 1)
```

### Comparison
| Type | Iteration | Can Reuse Item? |
|------|-----------|-----------------|
| 0/1 Knapsack | Backward | No |
| Unbounded | Forward | Yes |

### Visual
```
For coin=2, amount=5:
dp[3] = min(dp[3], dp[1]+1)  # uses 2
dp[5] = min(dp[5], dp[3]+1)  # uses 2 again!
```

### Time: O(n × amount), Space: O(amount)

<!-- back -->
