# Greedy - Buy/Sell Stock

## Overview

The Greedy - Buy/Sell Stock pattern is used for problems involving stock trading where you can buy and sell stocks multiple times, but you cannot hold more than one stock at a time and cannot buy and sell on the same day. This pattern maximizes profit by taking advantage of every upward price movement, treating each profitable transaction independently.

When to use this pattern:
- When you can perform multiple buy-sell transactions
- For problems where you need to maximize profit without holding multiple positions
- In scenarios with daily stock prices and transaction constraints

Benefits:
- Provides a simple, efficient solution that captures all possible profits
- Avoids complex state tracking required in dynamic programming approaches
- Works optimally for the "unlimited transactions" constraint

## Key Concepts

- **Profit Calculation**: Add the difference between consecutive prices when the price increases
- **No Simultaneous Holdings**: You must sell before buying again
- **Greedy Choice**: Capture every profitable opportunity as it arises
- **Cumulative Profit**: Sum all positive price differences across the array

## Template

```python
def max_profit(prices):
    """
    Template for maximizing profit with multiple buy-sell transactions.
    
    Args:
    prices (List[int]): List of stock prices on consecutive days
    
    Returns:
    int: Maximum profit achievable
    """
    if not prices:
        return 0
    
    max_profit = 0
    
    # Iterate through prices, adding profit from every increase
    for i in range(1, len(prices)):
        if prices[i] > prices[i-1]:
            # Add the profit from this transaction
            max_profit += prices[i] - prices[i-1]
    
    return max_profit

def max_profit_with_fee(prices, fee):
    """
    Template for maximizing profit with transaction fee.
    
    Args:
    prices (List[int]): List of stock prices
    fee (int): Transaction fee for each buy-sell pair
    
    Returns:
    int: Maximum profit after fees
    """
    if not prices:
        return 0
    
    max_profit = 0
    min_price = prices[0]
    
    for i in range(1, len(prices)):
        if prices[i] < min_price:
            min_price = prices[i]
        elif prices[i] > min_price + fee:
            # Sell and reset min_price for next transaction
            max_profit += prices[i] - min_price - fee
            min_price = prices[i]  # Can't buy immediately after sell
    
    return max_profit
```

## Example Problems

1. **Best Time to Buy and Sell Stock II (LeetCode 122)**: Given an array of stock prices, find the maximum profit you can achieve with as many transactions as you want.

2. **Best Time to Buy and Sell Stock with Transaction Fee (LeetCode 714)**: Similar to above, but with a fee charged for each transaction.

3. **Best Time to Buy and Sell Stock (LeetCode 121)**: Find the maximum profit with only one transaction allowed.

## Time and Space Complexity

- **Time Complexity**: O(n) where n is the number of days/prices, as we perform a single pass through the array.
- **Space Complexity**: O(1), using only constant extra space for variables.

## Common Pitfalls

- **Multiple Holdings**: Remember you can't buy another stock while holding one; sell first.
- **Same Day Transactions**: You can't buy and sell on the same day.
- **Fee Handling**: In problems with fees, subtract the fee from each profitable transaction.
- **Edge Cases**: Handle empty arrays, single price, and decreasing price sequences.
- **Overcomplicating**: Don't use DP when greedy suffices; the simple difference accumulation works.