# Best Time To Buy And Sell Stock Iv

## Problem Description

You are given an integer array prices where prices[i] is the price of a given stock on the ith day, and an integer k.
Find the maximum profit you can achieve. You may complete at most k transactions: i.e. you may buy at most k times and sell at most k times.
Note: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).

## Examples

**Example 1:**

**Input:**

```

k = 2, prices = [2,4,1]

```

**Output:**

```

2

```

**Explanation:** Buy on day 1 (price = 2) and sell on day 2 (price = 4), profit = 4-2 = 2.

**Example 2:**

**Input:**

```

k = 2, prices = [3,2,6,5,0,3]

```

**Output:**

```

7

```

**Explanation:** Buy on day 2 (price = 2) and sell on day 3 (price = 6), profit = 6-2 = 4. Then buy on day 5 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.

## Constraints

- 1 <= k <= 100
- 1 <= prices.length <= 1000
- 0 <= prices[i] <= 1000

## Solution

```python
from typing import List

class Solution:
    def maxProfit(self, k: int, prices: List[int]) -> int:
        if not prices or k == 0:
            return 0
        n = len(prices)
        if k >= n // 2:
            # If k is large enough, it's like unlimited transactions
            profit = 0
            for i in range(1, n):
                profit += max(0, prices[i] - prices[i - 1])
            return profit
        # DP for at most k transactions
        buy = [float('-inf')] * (k + 1)
        sell = [0] * (k + 1)
        for price in prices:
            for i in range(1, k + 1):
                buy[i] = max(buy[i], sell[i - 1] - price)
                sell[i] = max(sell[i], buy[i] + price)
        return sell[k]
```

## Explanation

This solution uses dynamic programming to handle at most k transactions. We maintain two arrays: buy[i] for the maximum profit after i buys (negative), and sell[i] for the maximum profit after i sells.

If k is large (at least half the number of days), we optimize by treating it as unlimited transactions, summing all positive price differences.

Otherwise, for each price, we update the buy and sell states for each transaction count.

Time complexity: O(n*k) in the worst case, but O(n) when k is large.

Space complexity: O(k), using arrays of size k+1.
