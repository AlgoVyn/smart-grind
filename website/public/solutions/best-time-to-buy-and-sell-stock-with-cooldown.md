# Best Time To Buy And Sell Stock With Cooldown

## Problem Description

You are given an array `prices` where `prices[i]` is the price of a given stock on the ith day.
Find the maximum profit you can achieve. You may complete as many transactions as you like (i.e., buy one and sell one share of the stock multiple times) with the following restrictions:

After you sell your stock, you cannot buy stock on the next day (i.e., cooldown one day).

**Note:** You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).

---

## Examples

**Example 1:**

**Input:**
```python
prices = [1,2,3,0,2]
```

**Output:**
```python
3
```

**Explanation:** transactions = [buy, sell, cooldown, buy, sell]

**Example 2:**

**Input:**
```python
prices = [1]
```

**Output:**
```python
0
```

---

## Constraints

- `1 <= prices.length <= 5000`
- `0 <= prices[i] <= 1000`

---

## Solution

```python
from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        if not prices:
            return 0
        hold = float('-inf')
        sold = 0
        cooldown = 0
        for price in prices:
            prev_sold = sold
            sold = hold + price
            hold = max(hold, cooldown - price)
            cooldown = max(cooldown, prev_sold)
        return max(sold, cooldown)
```

---

## Explanation

This solution uses dynamic programming with three states: `hold` (maximum profit when holding a stock), `sold` (maximum profit after selling on the current day), and `cooldown` (maximum profit after a cooldown day).

We update these states for each price, ensuring we account for the cooldown period after selling.

---

## Time Complexity
**O(n)**, where n is the number of days.

---

## Space Complexity
**O(1)**, using constant space.
