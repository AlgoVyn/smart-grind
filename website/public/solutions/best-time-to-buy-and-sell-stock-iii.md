# Best Time To Buy And Sell Stock Iii

## Problem Description

You are given an array `prices` where `prices[i]` is the price of a given stock on the ith day.
Find the maximum profit you can achieve. You may complete at most two transactions.
**Note:** You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).

## Examples

**Example 1:**

**Input:**
```python
prices = [3,3,5,0,0,3,1,4]
```

**Output:**
```
6
```

**Explanation:** Buy on day 4 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.
Then buy on day 7 (price = 1) and sell on day 8 (price = 4), profit = 4-1 = 3.

**Example 2:**

**Input:**
```python
prices = [1,2,3,4,5]
```

**Output:**
```
4
```

**Explanation:** Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.
Note that you cannot buy on day 1, buy on day 2 and sell them later, as you are engaging multiple transactions at the same time. You must sell before buying again.

**Example 3:**

**Input:**
```python
prices = [7,6,4,3,1]
```

**Output:**
```
0
```

**Explanation:** In this case, no transaction is done, i.e. max profit = 0.

## Constraints

- `1 <= prices.length <= 105`
- `0 <= prices[i] <= 105`

## Solution

```python
from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        if not prices:
            return 0
        buy1 = buy2 = float('-inf')
        sell1 = sell2 = 0
        for price in prices:
            buy1 = max(buy1, -price)
            sell1 = max(sell1, buy1 + price)
            buy2 = max(buy2, sell1 - price)
            sell2 = max(sell2, buy2 + price)
        return sell2
```

## Explanation

This solution uses dynamic programming to track the maximum profit for up to two transactions. We maintain four variables: `buy1` and `buy2` for the maximum profit after buying the first and second stock (negative because we're spending), and `sell1` and `sell2` for the maximum profit after selling the first and second stock.

For each price, we update these variables in order: first `buy1`, then `sell1`, then `buy2`, then `sell2`. This ensures we don't use future information.

## Time Complexity
**O(n)**, where n is the number of days, as we iterate through the prices once.

## Space Complexity
**O(1)**, using only constant extra space.
