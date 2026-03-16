## Coin Change 2 (Combination Sum)

**Question:** Count ways to make amount with unlimited coins?

<!-- front -->

---

## Answer: DP - Outer Loop on Coins

### Solution
```python
def change(amount, coins):
    dp = [0] * (amount + 1)
    dp[0] = 1  # One way to make amount 0
    
    # Outer loop on COINS (not amount)
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    
    return dp[amount]
```

### Visual: DP Table
```
Amount: 5, Coins: [1, 2, 5]

dp array (ways to make each amount):

Initial:  [1, 0, 0, 0, 0, 0]

coin=1:   [1, 1, 1, 1, 1, 1]
coin=2:   [1, 1, 2, 2, 3, 3]
coin=5:   [1, 1, 2, 2, 3, 4]

dp[5] = 4 ways:
[1,1,1,1,1], [1,1,1,2], [1,2,2], [5]
```

### ⚠️ Tricky Parts

#### 1. Why Coins Outer Loop?
```python
# COINS outer: [1,2] → {1,1,1}, {1,2}
#              [2,1] not counted separately
#              = COMBINATION (order doesn't matter)

# AMOUNT outer: Would count permutations
# {1,2} and {2,1} counted twice → WRONG
```

#### 2. DP Meaning
```python
# dp[i] = number of ways to make amount i
# Using coins seen so far (in outer loop)

# dp[i] += dp[i - coin]:
# All ways to make (i - coin) + this coin
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| DP | O(amount × coins) | O(amount) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Amount outer loop | Use coin outer loop |
| Not initializing dp[0] | dp[0] = 1 |
| Wrong dp state | dp[i] counts ways |

<!-- back -->
