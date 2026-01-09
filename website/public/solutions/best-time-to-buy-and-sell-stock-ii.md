# Best Time To Buy And Sell Stock Ii

## Problem Description

You are given an integer array `prices` where `prices[i]` is the price of a given stock on the ith day.
On each day, you may decide to buy and/or sell the stock. You can only hold at most one share of the stock at any time. However, you can sell and buy the stock multiple times on the same day, ensuring you never hold more than one share of the stock.
Find and return the maximum profit you can achieve.

---

## Examples

**Example 1:**

**Input:**
```python
prices = [7,1,5,3,6,4]
```

**Output:**
```python
7
```

**Explanation:** Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit = 5-1 = 4.
Then buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 6-3 = 3.
Total profit is 4 + 3 = 7.

**Example 2:**

**Input:**
```python
prices = [1,2,3,4,5]
```

**Output:**
```python
4
```

**Explanation:** Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.
Total profit is 4.

**Example 3:**

**Input:**
```python
prices = [7,6,4,3,1]
```

**Output:**
```python
0
```

**Explanation:** There is no way to make a positive profit, so we never buy the stock to achieve the maximum profit of 0.

---

## Constraints

- `1 <= prices.length <= 3 * 104`
- `0 <= prices[i] <= 104`

---

## Solution

```python
from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        profit = 0
        for i in range(1, len(prices)):
            if prices[i] > prices[i - 1]:
                profit += prices[i] - prices[i - 1]
        return profit
```

---

## Explanation

This solution iterates through the prices and adds the difference whenever the price increases from the previous day. Since we can perform multiple transactions, this captures all possible profits without needing to track individual buys and sells.

---

## Time Complexity
**O(n)**, where n is the number of days, as we make a single pass through the array.

---

## Space Complexity
**O(1)**, using only constant extra space.
