# DP - Stock problems

## Overview

This pattern is used for stock trading problems with buy/sell constraints. It's for maximizing profit with transaction limits. Benefits include handling multiple states (buy, sell, cooldown).

## Key Concepts

- States: hold, not hold, cooldown.
- dp[i][k][0/1]: Max profit after i days, k transactions, 0=not hold, 1=hold.
- Transitions: buy, sell, rest.

## Template

```python
def max_profit(prices):
    if not prices:
        return 0
    n = len(prices)
    # For unlimited transactions, but with cooldown
    dp = [[0] * 2 for _ in range(n)]
    dp[0][0] = 0  # not hold
    dp[0][1] = -prices[0]  # hold
    for i in range(1, n):
        dp[i][0] = max(dp[i-1][0], dp[i-1][1] + prices[i])
        dp[i][1] = max(dp[i-1][1], dp[i-1][0] - prices[i])  # with cooldown, adjust
    return dp[n-1][0]
```

## Example Problems

1. Best Time to Buy and Sell Stock: One transaction.
2. Best Time to Buy and Sell Stock II: Unlimited transactions.
3. Best Time to Buy and Sell Stock with Cooldown: With cooldown.

## Time and Space Complexity

- Time: O(n)
- Space: O(n), optimizable to O(1)

## Common Pitfalls

- Forgetting cooldown or transaction limits.
- Wrong state transitions.
- Not handling edge cases like no prices.