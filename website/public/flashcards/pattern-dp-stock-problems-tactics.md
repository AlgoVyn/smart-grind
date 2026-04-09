## DP Stock Problems: Tactics

What are specific techniques for solving stock problem variations?

<!-- front -->

---

### Tactic 1: Greedy for Unlimited Transactions

When transactions are unlimited, greedy works:

```python
def max_profit_unlimited_greedy(prices):
    """
    Sum all positive price differences.
    Equivalent to buying every upward trend.
    """
    profit = 0
    for i in range(1, len(prices)):
        if prices[i] > prices[i - 1]:
            profit += prices[i] - prices[i - 1]
    return profit

# Proof: Every increase can be captured
# Buy at local min, sell at local max
```

**Why it works:** No constraints means no trade-offs.

---

### Tactic 2: Cooldown State Management

Handle "one day cooldown after selling":

```python
def max_profit_cooldown(prices):
    """
    LeetCode 309: Cooldown after selling.
    Three states: hold, rest (can buy), cooldown (just sold).
    """
    if not prices:
        return 0
    
    hold = -prices[0]
    rest = 0
    cooldown = 0
    
    for price in prices[1:]:
        prev_hold = hold
        hold = max(hold, rest - price)      # Buy from rest only
        rest = max(rest, cooldown)           # Cooldown expires to rest
        cooldown = prev_hold + price         # Sell creates cooldown
    
    return max(rest, cooldown)
```

**Key:** Use previous `hold` value before it updates.

---

### Tactic 3: Transaction Fee Handling

Subtract fee when selling, not buying:

```python
def max_profit_with_fee(prices, fee):
    """
    LeetCode 714: Fee per transaction.
    Apply fee on sell to keep buy logic clean.
    """
    hold = -prices[0]
    not_hold = 0
    
    for price in prices[1:]:
        # Option 1: Keep previous hold or buy today
        hold = max(hold, not_hold - price)
        
        # Option 2: Keep previous not_hold or sell today (minus fee)
        not_hold = max(not_hold, hold + price - fee)
    
    return not_hold
```

**Pitfall:** Applying fee on buy complicates transitions.

---

### Tactic 4: Two Transaction Decomposition

For exactly 2 transactions, split the array:

```python
def max_profit_two_transactions(prices):
    """
    LeetCode 123: At most 2 transactions.
    Compute best left and right of each split point.
    """
    if not prices:
        return 0
    
    n = len(prices)
    
    # Left[i] = max profit in prices[0..i] with 1 transaction
    left = [0] * n
    min_price = prices[0]
    for i in range(1, n):
        min_price = min(min_price, prices[i])
        left[i] = max(left[i-1], prices[i] - min_price)
    
    # Right[i] = max profit in prices[i..n-1] with 1 transaction
    right = [0] * n
    max_price = prices[-1]
    for i in range(n-2, -1, -1):
        max_price = max(max_price, prices[i])
        right[i] = max(right[i+1], max_price - prices[i])
    
    # Combine: max of left[i] + right[i] over all i
    max_profit = 0
    for i in range(n):
        max_profit = max(max_profit, left[i] + right[i])
    
    return max_profit
```

---

### Tactic 5: K-Transaction Array Optimization

Use rolling arrays to reduce 2D DP to 1D:

```python
def max_profit_k_optimized(prices, k):
    """
    O(k) space instead of O(n × k).
    Key: process prices outer, transactions inner.
    """
    if not prices or k == 0:
        return 0
    
    n = len(prices)
    if k >= n // 2:  # Unlimited case
        return sum(max(0, prices[i] - prices[i-1]) for i in range(1, n))
    
    # buy[i] = min cost to complete i-th buy (negative profit)
    # sell[i] = max profit after i-th sell
    buy = [float('inf')] * (k + 1)
    sell = [0] * (k + 1)
    
    for price in prices:
        for i in range(1, k + 1):
            # Buy: minimize cost (or maximize negative profit)
            buy[i] = min(buy[i], price - sell[i-1])
            # Sell: maximize profit
            sell[i] = max(sell[i], price - buy[i])
    
    return sell[k]
```

**Note:** Some formulations use `buy[i] = -float('inf')` and max.

---

### Tactic 6: Reconstructing Buy/Sell Days

Track decisions to find actual transactions:

```python
def max_profit_with_days(prices):
    """
    Returns profit AND the buy/sell days.
    """
    n = len(prices)
    hold = [0] * n
    not_hold = [0] * n
    hold[0] = -prices[0]
    
    # Track choices
    hold_from = [0] * n  # 0 = hold prev, 1 = buy today
    not_hold_from = [0] * n  # 0 = not_hold prev, 1 = sell today
    
    for i in range(1, n):
        # hold transition
        if hold[i-1] > not_hold[i-1] - prices[i]:
            hold[i] = hold[i-1]
            hold_from[i] = 0
        else:
            hold[i] = not_hold[i-1] - prices[i]
            hold_from[i] = 1
        
        # not_hold transition
        if not_hold[i-1] > hold[i-1] + prices[i]:
            not_hold[i] = not_hold[i-1]
            not_hold_from[i] = 0
        else:
            not_hold[i] = hold[i-1] + prices[i]
            not_hold_from[i] = 1
    
    # Backtrack to find transactions
    transactions = []
    state = 'not_hold'
    i = n - 1
    
    while i >= 0:
        if state == 'not_hold':
            if not_hold_from[i] == 1:  # Sold today
                transactions.append(('sell', i))
                state = 'hold'
            i -= 1
        else:  # state == 'hold'
            if hold_from[i] == 1:  # Bought today
                transactions.append(('buy', i))
                state = 'not_hold'
            i -= 1
    
    return not_hold[n-1], transactions[::-1]
```

<!-- back -->
