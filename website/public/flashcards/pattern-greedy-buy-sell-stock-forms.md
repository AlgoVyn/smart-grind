## Greedy Buy Sell Stock: Forms

What are the different forms and variations of stock trading problems?

<!-- front -->

---

### Problem Variations

| Variation | Constraint | Approach | Complexity |
|-----------|------------|----------|------------|
| **Stock I** | At most 1 transaction | Track min/max | O(n) time, O(1) space |
| **Stock II** | Unlimited transactions | Sum positive diffs | O(n) time, O(1) space |
| **Stock III** | At most 2 transactions | DP with 4 states | O(n) time, O(1) space |
| **Stock IV** | At most k transactions | DP arrays | O(n×k) time, O(k) space |
| **Stock with Fee** | Fee per transaction | Two-state DP | O(n) time, O(1) space |
| **Stock with Cooldown** | 1-day wait after sell | Three-state DP | O(n) time, O(1) space |

---

### Form 1: Single Transaction (Stock I)

```python
def max_profit_single(prices):
    """
    LeetCode 121: Best Time to Buy and Sell Stock
    Find max profit with at most one transaction.
    """
    if not prices:
        return 0
    
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    
    return max_profit

# Example: [7, 1, 5, 3, 6, 4]
# Buy at 1, sell at 6 → profit = 5
```

---

### Form 2: Unlimited Transactions (Stock II)

```python
def max_profit_unlimited(prices):
    """
    LeetCode 122: Best Time to Buy and Sell Stock II
    Sum all positive differences.
    """
    return sum(max(0, prices[i] - prices[i-1]) 
               for i in range(1, len(prices)))

# Example: [7, 1, 5, 3, 6, 4]
# Trades: 1→5 (+4), 3→6 (+3)
# Total: 7
```

---

### Form 3: With Transaction Fee

```python
def max_profit_with_fee(prices, fee):
    """
    LeetCode 714: Best Time to Buy and Sell Stock with Transaction Fee
    """
    if not prices:
        return 0
    
    cash, hold = 0, -prices[0]
    
    for price in prices[1:]:
        cash = max(cash, hold + price - fee)  # Sell with fee
        hold = max(hold, cash - price)        # Buy
    
    return cash

# Example: [1, 3, 2, 8, 4, 9], fee = 2
# Optimal: Buy 1, sell 8 (-fee), buy 4, sell 9 (-fee)
# Or: Buy 1, sell 9 (avoid extra fee)
```

---

### Form 4: With Cooldown

```python
def max_profit_cooldown(prices):
    """
    LeetCode 309: Best Time to Buy and Sell Stock with Cooldown
    1-day cooldown after selling.
    """
    if not prices:
        return 0
    
    n = len(prices)
    hold = [-prices[0]] + [0] * (n - 1)
    sold = [0] * n
    rest = [0] * n
    
    for i in range(1, n):
        hold[i] = max(hold[i-1], rest[i-1] - prices[i])
        sold[i] = hold[i-1] + prices[i]
        rest[i] = max(rest[i-1], sold[i-1])
    
    return max(sold[-1], rest[-1])

# Space optimized version:
def max_profit_cooldown_optimized(prices):
    if not prices:
        return 0
    
    hold, sold, rest = -prices[0], 0, 0
    
    for price in prices[1:]:
        prev_hold = hold
        hold = max(hold, rest - price)
        rest = max(rest, sold)
        sold = prev_hold + price
    
    return max(sold, rest)
```

---

### Form 5: At Most 2 Transactions (Stock III)

```python
def max_profit_two_transactions(prices):
    """
    LeetCode 123: Best Time to Buy and Sell Stock III
    """
    if not prices:
        return 0
    
    # Four states: first buy, first sell, second buy, second sell
    first_buy = second_buy = float('inf')
    first_sell = second_sell = 0
    
    for price in prices:
        # Update in order: buy -> sell -> buy -> sell
        first_buy = min(first_buy, price)
        first_sell = max(first_sell, price - first_buy)
        second_buy = min(second_buy, price - first_sell)  # Effective cost
        second_sell = max(second_sell, price - second_buy)
    
    return second_sell
```

---

### Form 6: At Most k Transactions (Stock IV)

```python
def max_profit_k_transactions(prices, k):
    """
    LeetCode 188: Best Time to Buy and Sell Stock IV
    """
    if not prices or k == 0:
        return 0
    
    n = len(prices)
    
    # Optimization: unlimited transactions
    if k >= n // 2:
        return sum(max(0, prices[i] - prices[i-1]) 
                   for i in range(1, n))
    
    # DP arrays for each transaction count
    buy = [-float('inf')] * (k + 1)
    sell = [0] * (k + 1)
    
    for price in prices:
        for i in range(1, k + 1):
            buy[i] = max(buy[i], sell[i-1] - price)
            sell[i] = max(sell[i], buy[i] + price)
    
    return sell[k]
```

---

### Decision Flowchart

```
Read problem statement
│
├─ "at most one transaction" or "one buy-sell"
│   └─→ Use: Track min price, max profit (Stock I)
│
├─ "unlimited" or "as many as you want"
│   ├─ "transaction fee" mentioned?
│   │   └─→ Use: Two-state DP with fee (Stock with Fee)
│   ├─ "cooldown" mentioned?
│   │   └─→ Use: Three-state DP (Stock with Cooldown)
│   └─ Otherwise
│       └─→ Use: Sum positive differences (Stock II)
│
├─ "at most 2 transactions"
│   └─→ Use: Four-state tracking (Stock III)
│
└─ "at most k transactions"
    ├─ k >= n/2?
    │   └─→ Use: Sum positive differences (treat as unlimited)
    └─ Otherwise
        └─→ Use: DP with buy/sell arrays (Stock IV)
```

---

### Quick Reference Table

| LeetCode | Problem | Key Constraint | Solution Pattern |
|----------|---------|----------------|------------------|
| 121 | Stock I | 1 transaction | Min/max tracking |
| 122 | Stock II | Unlimited | Sum positive diffs |
| 123 | Stock III | 2 transactions | 4-state DP |
| 188 | Stock IV | k transactions | DP with optimization |
| 309 | Cooldown | 1-day wait | 3-state DP |
| 714 | Fee | Per-trade fee | 2-state DP |

<!-- back -->
