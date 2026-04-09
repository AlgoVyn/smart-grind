## DP Stock Problems: Forms & Variations

What are the different forms of stock trading problems?

<!-- front -->

---

### Form 1: Single Transaction (Classic)

Find best day to buy and best day to sell (buy before sell).

```python
def max_profit_one_transaction(prices):
    """
    LeetCode 121: Buy once, sell once.
    """
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    
    return max_profit

# Example: [7,1,5,3,6,4]
# Buy at 1, sell at 6 → profit = 5
```

---

### Form 2: Unlimited Transactions (Peak-Valley)

Buy at every valley, sell at every peak.

```python
def max_profit_unlimited(prices):
    """
    LeetCode 122: As many transactions as needed.
    """
    # Greedy: sum all positive differences
    return sum(max(0, prices[i] - prices[i-1]) 
               for i in range(1, len(prices)))

# Alternative: State machine

def max_profit_unlimited_sm(prices):
    hold, not_hold = -prices[0], 0
    for p in prices[1:]:
        hold = max(hold, not_hold - p)
        not_hold = max(not_hold, hold + p)
    return not_hold

# Example: [7,1,5,3,6,4]
# 1→5 (+4), 3→6 (+3) = 7 total
```

---

### Form 3: With Cooldown Period

One day rest after selling before buying again.

```python
def max_profit_cooldown(prices):
    """
    LeetCode 309: 1 day cooldown after selling.
    States: hold, rest (can buy), cooldown (just sold)
    """
    if not prices:
        return 0
    
    hold, rest, cooldown = -prices[0], 0, 0
    
    for p in prices[1:]:
        prev_hold = hold
        hold = max(hold, rest - p)      # Buy from rest
        rest = max(rest, cooldown)     # Cooldown → rest
        cooldown = prev_hold + p         # Sell → cooldown
    
    return max(rest, cooldown)

# Example: [1,2,3,0,2]
# Buy 1→sell 2 (cooldown day 3), buy 0→sell 2 = 3
```

---

### Form 4: With Transaction Fee

Each sale incurs a fixed cost.

```python
def max_profit_with_fee(prices, fee):
    """
    LeetCode 714: Fee per transaction.
    """
    hold, not_hold = -prices[0], 0
    
    for p in prices[1:]:
        hold = max(hold, not_hold - p)
        not_hold = max(not_hold, hold + p - fee)
    
    return not_hold

# Example: [1,3,2,8,4,9], fee=2
# 1→8 (profit 7-2=5), 4→9 (profit 5-2=3) = 8 total
```

---

### Form 5: At Most K Transactions

Limit the total number of buy-sell pairs.

```python
def max_profit_k_transactions(prices, k):
    """
    LeetCode 188: Max k transactions.
    """
    if not prices or k == 0:
        return 0
    
    n = len(prices)
    if k >= n // 2:  # Unlimited case
        return sum(max(0, prices[i] - prices[i-1]) 
                   for i in range(1, n))
    
    # buy[i] = max profit with i-th buy in progress
    # sell[i] = max profit after i-th sell complete
    buy = [-float('inf')] * (k + 1)
    sell = [0] * (k + 1)
    
    for p in prices:
        for i in range(1, k + 1):
            buy[i] = max(buy[i], sell[i-1] - p)
            sell[i] = max(sell[i], buy[i] + p)
    
    return sell[k]

# Example: [3,2,6,5,0,3], k=2
# 2→6 (+4), 0→3 (+3) = 7 total
```

---

### Form 6: At Most 2 Transactions

Special case of k=2 with optimization opportunity.

```python
def max_profit_two_transactions(prices):
    """
    LeetCode 123: Split array, compute best left and right.
    """
    if not prices:
        return 0
    
    n = len(prices)
    
    # Forward: max profit up to day i
    left = [0] * n
    min_p = prices[0]
    for i in range(1, n):
        min_p = min(min_p, prices[i])
        left[i] = max(left[i-1], prices[i] - min_p)
    
    # Backward: max profit from day i to end
    right = [0] * n
    max_p = prices[-1]
    for i in range(n-2, -1, -1):
        max_p = max(max_p, prices[i])
        right[i] = max(right[i+1], max_p - prices[i])
    
    # Combine
    return max(left[i] + right[i] for i in range(n))
```

---

### Form 7: Multiple Stock Symbols (Advanced)

Choose from multiple stocks each day.

```python
def max_profit_multiple_stocks(stock_prices):
    """
    stock_prices[k][d] = price of stock k on day d
    Can hold at most one stock at a time.
    """
    k, n = len(stock_prices), len(stock_prices[0])
    
    hold = [-float('inf')] * k  # Max profit holding each stock
    not_hold = 0
    
    for d in range(n):
        # Can sell any held stock
        for i in range(k):
            not_hold = max(not_hold, hold[i] + stock_prices[i][d])
        
        # Can buy any stock
        for i in range(k):
            hold[i] = max(hold[i], not_hold - stock_prices[i][d])
    
    return not_hold
```

---

### Summary Table

| Form | LeetCode | Key Pattern | States | Complexity |
|------|----------|-------------|--------|------------|
| One transaction | 121 | Min tracking | 2 vars | O(n), O(1) |
| Unlimited | 122 | Greedy sum | 2 states | O(n), O(1) |
| With cooldown | 309 | 3-state SM | 3 states | O(n), O(1) |
| With fee | 714 | Fee on sell | 2 states | O(n), O(1) |
| At most 2 | 123 | Split array | 4 vars or 2 passes | O(n), O(n) |
| At most k | 188 | DP arrays | 2(k+1) | O(nk), O(k) |
| Multiple stocks | - | Extended states | 2k+1 | O(nk), O(k) |

<!-- back -->
