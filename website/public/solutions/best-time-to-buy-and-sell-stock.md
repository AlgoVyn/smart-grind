# Best Time To Buy And Sell Stock

## Problem Description

You are given an array `prices` where `prices[i]` is the price of a given stock on the ith day.
You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.
Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

---

## Examples

**Example 1:**

**Input:**
```python
prices = [7,1,5,3,6,4]
```

**Output:**
```python
5
```

**Explanation:** Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.

**Example 2:**

**Input:**
```python
prices = [7,6,4,3,1]
```

**Output:**
```python
0
```

**Explanation:** In this case, no transactions are done and the max profit = 0.

---

## Constraints

- `1 <= prices.length <= 105`
- `0 <= prices[i] <= 104`

---

## Solution

```python
from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        if not prices:
            return 0
        min_price = float('inf')
        max_profit = 0
        for price in prices:
            min_price = min(min_price, price)
            max_profit = max(max_profit, price - min_price)
        return max_profit
```

---

## Explanation

This solution iterates through the prices, keeping track of the minimum price encountered so far and the maximum profit that can be achieved by selling at the current price after buying at the minimum price.

---

## Time Complexity
**O(n)**, where n is the number of days, as we traverse the array once.

---

## Space Complexity
**O(1)**, using only constant extra space.
