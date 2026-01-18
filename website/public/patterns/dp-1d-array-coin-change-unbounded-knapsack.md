# DP - 1D Array (Coin Change / Unbounded Knapsack Style)

## Overview

The DP - 1D Array (Coin Change / Unbounded Knapsack Style) pattern is used to solve problems where you need to make changes with coins (unbounded knapsack) or select items with unlimited supply. This pattern handles problems requiring minimum coins, maximum value, or number of ways to make change.

## Key Concepts

- **Unbounded Selection**: Items/coins can be used any number of times.
- **State Transition**: Each state depends on previous states with possible reuse of items.
- **Bottom-up Approach**: Build solutions from smaller subproblems up to the target.
- **Initialization**: Handle base cases such as target = 0.

## Template

```python
def coin_change_min_coins(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1

def coin_change_number_of_ways(coins, amount):
    dp = [0] * (amount + 1)
    dp[0] = 1  # Base case: one way to make amount 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    
    return dp[amount]
```

## Example Problems

1. **Coin Change (LeetCode 322)**: Find minimum number of coins to make a given amount.
2. **Coin Change II (LeetCode 518)**: Find number of ways to make a given amount.
3. **Combination Sum IV (LeetCode 377)**: Number of combinations to make target sum.
4. **Unbounded Knapsack**: Max value with unbounded item selection.

## Time and Space Complexity

- **Time Complexity**: O(amount * number of coins), for each coin type and each possible amount.
- **Space Complexity**: O(amount), for storing the DP array.

## Common Pitfalls

- **Incorrect initialization**: Failing to set dp[0] correctly.
- **Order of loops**: For minimum coins, order doesn't matter; for number of ways, order of loops affects results.
- **Not handling coins larger than amount**: Failing to check if coin <= i before accessing dp[i - coin].
- **Overlooking floating point infinities**: Forgetting to check if dp[amount] is still infinity.
- **Confusing minimum coins with number of ways**: Different problems require different DP setups.
