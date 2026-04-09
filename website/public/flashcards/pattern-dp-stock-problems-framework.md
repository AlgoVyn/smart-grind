## DP Stock Problems: Framework

What is the complete code template for solving DP stock problems?

<!-- front -->

---

### Framework: Stock Problems State Machine

```
┌─────────────────────────────────────────────────────────────────┐
│  STOCK PROBLEMS - STATE MACHINE TEMPLATE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Core States:                                                      │
│  ┌──────────┐      buy      ┌──────────┐                         │
│  │  NOT_HOLD │ ────────────> │   HOLD   │                         │
│  │  (cash)   │              │ (stock)  │                         │
│  └─────┬─────┘              └────┬─────┘                         │
│        ^      sell               │                              │
│        └─────────────────────────┘                              │
│                                                                   │
│  1. Base case initialization:                                      │
│     - hold = -prices[0]    (buy on day 0)                         │
│     - not_hold = 0         (do nothing)                           │
│                                                                   │
│  2. Daily transitions:                                             │
│     - hold = max(hold, not_hold - price)   // buy or keep         │
│     - not_hold = max(not_hold, hold + price) // sell or keep     │
│                                                                   │
│  3. Extended states (as needed):                                  │
│     - cooldown: one day after selling                            │
│     - buy[i]: max profit with i-th buy pending                   │
│     - sell[i]: max profit after i-th sell                        │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Basic State Machine (One Transaction)

```python
def max_profit_one_transaction(prices):
    """
    LeetCode 121: Single transaction allowed.
    Simplified: track min price and max profit.
    """
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

### Implementation: Full State Machine (Multiple States)

```python
def stock_state_machine(prices, has_cooldown=False, has_fee=0):
    """
    General template for stock problems.
    Extend with additional states as needed.
    """
    if not prices:
        return 0
    
    # Initialize states
    hold = -prices[0]      # Holding stock
    not_hold = 0           # Not holding, can buy
    cooldown = 0           # In cooldown (if applicable)
    
    for price in prices[1:]:
        if has_cooldown:
            prev_hold = hold
            hold = max(hold, not_hold - price)
            not_hold = max(not_hold, cooldown)
            cooldown = prev_hold + price
        else:
            # Standard two-state with optional fee
            hold = max(hold, not_hold - price)
            not_hold = max(not_hold, hold + price - has_fee)
    
    return not_hold if not has_cooldown else max(not_hold, cooldown)


def stock_k_transactions(prices, k):
    """
    Template for k transactions limit.
    LeetCode 188.
    """
    if not prices or k == 0:
        return 0
    
    n = len(prices)
    
    # Optimization: unlimited transactions case
    if k >= n // 2:
        profit = 0
        for i in range(1, n):
            profit += max(0, prices[i] - prices[i - 1])
        return profit
    
    # DP arrays for each transaction count
    buy = [-float('inf')] * (k + 1)
    sell = [0] * (k + 1)
    
    for price in prices:
        for i in range(1, k + 1):
            # Update in order: buy[i] uses sell[i-1] from this day
            buy[i] = max(buy[i], sell[i - 1] - price)
            sell[i] = max(sell[i], buy[i] + price)
    
    return sell[k]
```

---

### Key Framework Elements

| Element | Purpose | Initial Value |
|---------|---------|---------------|
| `hold` | Max profit holding stock | `-prices[0]` |
| `not_hold` | Max profit not holding | `0` |
| `cooldown` | Max profit in cooldown | `0` |
| `buy[i]` | Max profit after i-th buy | `-inf` |
| `sell[i]` | Max profit after i-th sell | `0` |

---

### Decision Tree: Which Pattern?

```
Constraints?
├── One transaction only
│   └── Track min_price, max_profit
│   └── O(n) time, O(1) space
│
├── Unlimited transactions
│   └── Sum all positive differences
│   └── Or: hold/not_hold state machine
│   └── O(n) time, O(1) space
│
├── With cooldown
│   └── Add cooldown state
│   └── hold → not_hold → cooldown → not_hold
│   └── O(n) time, O(1) space
│
├── With transaction fee
│   └── Subtract fee when selling
│   └── not_hold = max(not_hold, hold + price - fee)
│   └── O(n) time, O(1) space
│
└── At most k transactions
    └── If k >= n/2: treat as unlimited
    └── Else: buy/sell arrays of size k+1
    └── O(n × k) time, O(k) space
```

<!-- back -->
