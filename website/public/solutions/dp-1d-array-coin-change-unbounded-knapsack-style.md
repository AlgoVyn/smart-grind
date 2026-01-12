# DP - 1D Array (Coin Change / Unbounded Knapsack Style)

## Overview

This pattern is used for problems involving combinations or permutations with unlimited use of items, like coin change or unbounded knapsack. It's suitable for optimization problems where choices can be repeated. Benefits include systematic exploration of all possibilities efficiently.

## Key Concepts

- dp[i]: Minimum ways or cost to achieve amount i.
- For each coin/item, update dp from left to right.
- Unbounded: Can use same item multiple times.

## Template

```python
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
```

## Example Problems

1. Coin Change: Find the minimum number of coins to make up an amount.
2. Combination Sum IV: Find the number of combinations that sum to target (order matters).
3. Unbounded Knapsack: Maximize value with unlimited items.

## Time and Space Complexity

- Time: O(amount * len(coins))
- Space: O(amount)

## Common Pitfalls

- Not initializing dp[0] to 0.
- Forgetting to check if amount is 0.
- Confusing bounded vs unbounded.