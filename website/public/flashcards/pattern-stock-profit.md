## Stock Problems: Unified Framework

**Question:** How do you solve all stock trading problems with one template?

<!-- front -->

---

## Answer: Track States Based on Transaction Limits

### General Framework
```python
def maxProfit(k, prices):
    if not prices or k == 0:
        return 0
    
    n = len(prices)
    
    # Unlimited transactions
    if k >= n:
        profit = 0
        for i in range(1, n):
            profit += max(0, prices[i] - prices[i-1])
        return profit
    
    # Limited transactions - use DP
    # hold[i][j] = max profit with at most j transactions, holding stock
    # cash[i][j] = max profit with at most j transactions, not holding
    
    cash = [0] * (k + 1)      # max profit when not holding
    hold = [-float('inf')] * (k + 1)  # max profit when holding
    
    for price in prices:
        for j in range(k, 0, -1):
            # Sell: cash[j] = max(cash[j], hold[j] + price)
            cash[j] = max(cash[j], hold[j] + price)
            # Buy: hold[j] = max(hold[j], cash[j-1] - price)
            hold[j] = max(hold[j], cash[j-1] - price)
    
    return cash[k]
```

### Visual: State Transitions
```
For each day, two states:
- HOLD: holding a stock
- CASH: not holding (sold)

Transition per day:
  HOLD ──────sell──────▶ CASH
    ▲                │
    │                ▼
    └───buy──────────┘

profit = max(previous_cash, previous_hold + price)
hold   = max(previous_hold, previous_cash - price)
```

### ⚠️ Tricky Parts

#### 1. Transaction Count Direction
```python
# WRONG - iterating forward messes up dependencies
for j in range(1, k+1):
    cash[j] = max(cash[j], hold[j] + price)  # Uses updated cash[j]!

# CORRECT - iterate backwards
for j in range(k, 0, -1):
    cash[j] = max(cash[j], hold[j] + price)
    hold[j] = max(hold[j], cash[j-1] - price)
```

#### 2. Hold Initialization
```python
# WRONG - starting with 0 allows buying on day 1
hold = [0] * (k + 1)  # Can buy with 0!

# CORRECT - must initialize to -infinity
hold = [-float('inf')] * (k + 1)
hold[1] = -prices[0]  # Can only buy on first day
```

#### 3. Unlimited vs Limited
```python
# If k >= n/2, can make unlimited transactions
# Greedy: add all positive differences

if k >= n // 2:
    profit = 0
    for i in range(1, n):
        profit += max(0, prices[i] - prices[i-1])
    return profit
```

### All Stock Problem Variations

| Problem | k | State Variables |
|---------|---|-----------------|
| Best Time I | ∞ | hold, cash |
| Best Time II | ∞ | same |
| Best Time III | 2 | hold1, cash1, hold2, cash2 |
| Best Time IV | k | arrays of size k |
| With Cooldown | ∞ | hold, cash, cooldown |
| With Fee | ∞ | hold, cash |

### Time & Space

| k Value | Time | Space |
|---------|------|-------|
| Unlimited | O(n) | O(1) |
| k < n/2 | O(nk) | O(k) |

### Quick Reference

| LeetCode # | Problem | Solution |
|------------|---------|----------|
| 121 | Best Time to Buy and Sell Stock | One transaction |
| 122 | Best Time II | Unlimited |
| 123 | Best Time III | 2 transactions |
| 188 | Best Time IV | k transactions |
| 309 | Best Time with Cooldown | Unlimited + cooldown |
| 714 | Best Time with Fee | Unlimited + fee |

<!-- back -->
