## Greedy Buy Sell Stock: Framework

What is the complete code template for greedy stock trading solutions?

<!-- front -->

---

### Framework: Sum All Positive Differences

```
┌─────────────────────────────────────────────────────────────────┐
│  GREEDY STOCK TRADING - BASIC TEMPLATE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Core Idea: Capture every upward price movement                   │
│                                                                   │
│  1. Initialize max_profit = 0                                      │
│  2. For i from 1 to n-1:                                         │
│     a. If prices[i] > prices[i-1]:                               │
│        - max_profit += prices[i] - prices[i-1]                   │
│  3. Return max_profit                                            │
│                                                                   │
│  Key Insight: Every positive difference is a profitable trade    │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Basic Greedy

```python
def max_profit(prices):
    """
    Calculate max profit with unlimited transactions.
    Sum all positive price differences.
    """
    if not prices:
        return 0
    
    max_profit = 0
    
    for i in range(1, len(prices)):
        if prices[i] > prices[i - 1]:
            max_profit += prices[i] - prices[i - 1]
    
    return max_profit
```

---

### Implementation: Peak-Valley Approach

```python
def max_profit_peak_valley(prices):
    """
    Alternative: Buy at valleys, sell at peaks.
    Same result, more intuitive for some.
    """
    if not prices:
        return 0
    
    n = len(prices)
    profit = 0
    i = 0
    
    while i < n - 1:
        # Find valley (local minimum)
        while i < n - 1 and prices[i] >= prices[i + 1]:
            i += 1
        valley = prices[i]
        
        # Find peak (local maximum)
        while i < n - 1 and prices[i] <= prices[i + 1]:
            i += 1
        peak = prices[i]
        
        profit += peak - valley
    
    return profit
```

---

### Implementation: With Transaction Fee (DP States)

```python
def max_profit_with_fee(prices, fee):
    """
    Use state machine: cash (no stock) vs hold (have stock)
    """
    if not prices:
        return 0
    
    cash, hold = 0, -prices[0]
    
    for i in range(1, len(prices)):
        # Either keep cash or sell stock today
        cash = max(cash, hold + prices[i] - fee)
        # Either keep holding or buy stock today
        hold = max(hold, cash - prices[i])
    
    return cash
```

---

### Implementation: With Cooldown

```python
def max_profit_with_cooldown(prices):
    """
    Max profit with 1-day cooldown after selling.
    Three states: hold, sold, rest
    """
    if not prices:
        return 0
    
    hold = [-prices[0]]
    sold = [0]
    rest = [0]
    
    for i in range(1, len(prices)):
        hold.append(max(hold[-1], rest[-1] - prices[i]))
        sold.append(hold[-2] + prices[i])
        rest.append(max(rest[-1], sold[-2]))
    
    return max(sold[-1], rest[-1])
```

---

### Key Framework Elements

| Element | Purpose | Initial Value |
|---------|---------|---------------|
| `max_profit` | Accumulated total profit | `0` |
| `cash` | Max profit without stock | `0` |
| `hold` | Max profit holding stock | `-prices[0]` |
| `sold` | Max profit just sold | `0` |
| `rest` | Max profit in cooldown | `0` |

---

### Decision Tree: Which Approach?

```
Transaction constraints?
├── Unlimited transactions
│   └── Sum all positive diffs: O(n) time, O(1) space
│   └── Or: hold/cash state machine
│
├── With transaction fee
│   └── hold/cash with fee subtraction
│   └── O(n) time, O(1) space
│
├── With cooldown
│   └── hold/sold/rest three states
│   └── O(n) time, O(1) space optimized
│
└── At most k transactions
    └── If k >= n/2: treat as unlimited
    └── Else: DP with buy/sell arrays
    └── O(n × k) time, O(k) space
```

<!-- back -->
