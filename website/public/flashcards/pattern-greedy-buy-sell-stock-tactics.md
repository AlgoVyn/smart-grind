## Greedy Buy Sell Stock: Tactics

What are practical tactics for solving stock trading problems?

<!-- front -->

---

### Tactic 1: Identify Problem Variant

**Quick classification to choose the right approach:**

```python
def classify_stock_problem(description):
    """
    Determine which stock pattern to use.
    """
    keywords = {
        'unlimited': 'sum_positive_diffs',
        'as many transactions': 'sum_positive_diffs',
        'multiple times': 'sum_positive_diffs',
        'at most one': 'single_transaction',
        'only one': 'single_transaction',
        'transaction fee': 'with_fee',
        'cooldown': 'with_cooldown',
        'at most k': 'k_transactions',
        'at most 2': 'two_transactions',
    }
    
    for keyword, pattern in keywords.items():
        if keyword in description.lower():
            return pattern
    
    return 'unknown'
```

| Keyword | Approach | Time | Space |
|---------|----------|------|-------|
| "unlimited" / "multiple" | Sum positive diffs | O(n) | O(1) |
| "at most one" / "only one" | Track min/max | O(n) | O(1) |
| "transaction fee" | Two-state DP | O(n) | O(1) |
| "cooldown" | Three-state DP | O(n) | O(1) |
| "at most k" | DP arrays | O(n×k) | O(k) |

---

### Tactic 2: Visual Debugging with Price Charts

**Draw the price chart to visualize profitable segments:**

```
Prices: [3, 2, 6, 5, 0, 3]

Day:    0  1  2  3  4  5
Price:  3  2  6  5  0  3
        │  │  │  │  │  │
        │  ↓  ↑  ↓  ↓  ↑
        │  -1 +4 -1 -5 +3
        │
        └─── Valley at day 1, peak at day 2: profit +4
                  Valley at day 4, peak at day 5: profit +3

Total: 4 + 3 = 7
```

**Code trace:**
```python
def visualize_trades(prices):
    """Print each decision step."""
    profit = 0
    transactions = []
    
    for i in range(1, len(prices)):
        diff = prices[i] - prices[i-1]
        if diff > 0:
            profit += diff
            transactions.append(f"Day {i-1}→{i}: +{diff}")
            print(f"Trade: Buy at {prices[i-1]}, sell at {prices[i]}, profit +{diff}")
        else:
            print(f"Skip: Price drops from {prices[i-1]} to {prices[i]} (diff {diff})")
    
    print(f"\nTotal profit: {profit}")
    return profit, transactions
```

---

### Tactic 3: State Machine for Constraints

**When fees or cooldowns apply, use explicit states:**

```python
def solve_with_states(prices, has_fee=False, fee=0, has_cooldown=False):
    """
    Generic state machine template.
    """
    if not prices:
        return 0
    
    # State: max profit in each condition
    cash = 0              # Not holding stock
    hold = -prices[0]     # Holding stock
    
    if has_cooldown:
        sold = 0          # Just sold (in cooldown)
        rest = 0          # Can buy
        
        for price in prices[1:]:
            prev_hold = hold
            hold = max(hold, rest - price)
            sold = prev_hold + price
            rest = max(rest, sold)
        
        return max(sold, rest)
    
    elif has_fee:
        for price in prices[1:]:
            # Must subtract fee when selling
            cash = max(cash, hold + price - fee)
            hold = max(hold, cash - price)
        
        return cash
    
    else:
        # Unlimited: greedy sum of positive diffs
        profit = 0
        for i in range(1, len(prices)):
            profit += max(0, prices[i] - prices[i-1])
        return profit
```

---

### Tactic 4: Optimization Check for k Transactions

**When k is large, switch to greedy:**

```python
def max_profit_k_transactions(prices, k):
    """
    Optimization: if k >= n/2, treat as unlimited.
    """
    if not prices or k == 0:
        return 0
    
    n = len(prices)
    
    # KEY OPTIMIZATION: Unlimited transactions case
    if k >= n // 2:
        profit = 0
        for i in range(1, n):
            profit += max(0, prices[i] - prices[i-1])
        return profit
    
    # Otherwise: use DP for k transactions
    buy = [-float('inf')] * (k + 1)
    sell = [0] * (k + 1)
    
    for price in prices:
        for i in range(1, k + 1):
            buy[i] = max(buy[i], sell[i-1] - price)
            sell[i] = max(sell[i], buy[i] + price)
    
    return sell[k]
```

---

### Tactic 5: Track Actual Transactions

**When problem requires listing buy-sell pairs:**

```python
def get_transactions(prices):
    """
    Returns list of (buy_day, sell_day, profit) tuples.
    """
    if not prices:
        return 0, []
    
    profit = 0
    transactions = []
    buy_day = None
    
    for i in range(len(prices) - 1):
        # Start of upward trend
        if buy_day is None and prices[i + 1] > prices[i]:
            buy_day = i
        # End of upward trend
        elif buy_day is not None and prices[i + 1] < prices[i]:
            sell_profit = prices[i] - prices[buy_day]
            transactions.append((buy_day, i, sell_profit))
            profit += sell_profit
            buy_day = None
    
    # Handle last day
    if buy_day is not None:
        sell_profit = prices[-1] - prices[buy_day]
        transactions.append((buy_day, len(prices) - 1, sell_profit))
        profit += sell_profit
    
    return profit, transactions

# Example:
# prices = [7, 1, 5, 3, 6, 4]
# Returns: (7, [(1, 2, 4), (3, 4, 3)])
```

---

### Tactic 6: Two-Pointer for Single Transaction

**When only one transaction is allowed:**

```python
def max_profit_one_transaction(prices):
    """
    Track minimum price and maximum profit simultaneously.
    """
    if not prices:
        return 0
    
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        # Update minimum price seen so far
        min_price = min(min_price, price)
        # Calculate profit if selling today
        max_profit = max(max_profit, price - min_price)
    
    return max_profit

# Key insight: Don't look for both min and max in one pass separately.
# Instead: at each price, the best buy was the min before it.
```

<!-- back -->
