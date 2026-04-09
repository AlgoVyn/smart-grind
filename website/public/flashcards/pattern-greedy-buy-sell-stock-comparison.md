## Greedy Buy Sell Stock: Comparison

How do different approaches compare for stock trading problems?

<!-- front -->

---

### Greedy vs DP vs Brute Force

| Approach | Time | Space | Use Case | Correctness |
|----------|------|-------|----------|-------------|
| **Greedy (sum diffs)** | O(n) | O(1) | Unlimited transactions | ✓ Optimal |
| **Peak-valley** | O(n) | O(1) | Same as greedy | ✓ Equivalent |
| **Brute force** | O(n²) or O(2ⁿ) | O(n) | Verification only | ✓ Correct |
| **DP with fee** | O(n) | O(1) | Transaction fee | ✓ Optimal |
| **DP with cooldown** | O(n) | O(1) | Cooldown required | ✓ Optimal |
| **DP k transactions** | O(n×k) | O(k) | Limited transactions | ✓ Optimal |

---

### When Greedy Works vs When DP is Required

```
Transaction Constraints:
│
├── Unlimited transactions
│   └── GREEDY: Sum all positive differences
│   └── Why? No opportunity cost, take every profit
│   └── Time: O(n), Space: O(1)
│
├── With transaction fee
│   └── DP with two states: cash vs hold
│   └── Why? Fee makes "always trade" suboptimal
│   └── Time: O(n), Space: O(1)
│
├── With cooldown (1-day wait)
│   └── DP with three states: hold, sold, rest
│   └── Why? Can't trade immediately after selling
│   └── Time: O(n), Space: O(1) optimized
│
└── At most k transactions
    └── If k >= n/2: GREEDY (treat as unlimited)
    └── Else: DP with buy/sell arrays
    └── Time: O(n×k), Space: O(k)
```

---

### Code Comparison: Unlimited Transactions

```python
# GREEDY: Optimal for unlimited transactions
# Time: O(n), Space: O(1)
def max_profit_greedy(prices):
    profit = 0
    for i in range(1, len(prices)):
        profit += max(0, prices[i] - prices[i-1])
    return profit

# DP APPROACH: Also works but overkill
# Time: O(n), Space: O(1) - but more complex
def max_profit_dp_states(prices):
    if not prices:
        return 0
    cash, hold = 0, -prices[0]
    for price in prices[1:]:
        cash = max(cash, hold + price)  # sell
        hold = max(hold, cash - price)  # buy
    return cash

# Both return same result for unlimited transactions
# Greedy is simpler and more intuitive
```

---

### Code Comparison: With Transaction Fee

```python
# WITH FEE: DP required, greedy fails
# Time: O(n), Space: O(1)
def max_profit_with_fee(prices, fee):
    if not prices:
        return 0
    
    cash, hold = 0, -prices[0]
    
    for price in prices[1:]:
        # Must account for fee when selling
        cash = max(cash, hold + price - fee)
        hold = max(hold, cash - price)
    
    return cash

# Why greedy fails:
# If fee = 2, prices = [1, 3, 2, 8]
# Greedy would trade: (1→3) + (2→8) = 2 + 6 = 8, minus 2 fees = 4
# But optimal: (1→8) = 7, minus 1 fee = 5
# Greedy over-trades when fees exist!
```

---

### Correctness Proof: Why Greedy is Optimal for Unlimited

```
Theorem: For unlimited transactions, greedy (sum all positive 
differences) yields maximum profit.

Proof by contradiction:
1. Assume there exists an optimal strategy S that doesn't take 
   all positive differences.

2. Then there's at least one day i where prices[i] > prices[i-1]
   but S doesn't trade (buy at i-1, sell at i).

3. Let profit from i-1 to i be p = prices[i] - prices[i-1] > 0.

4. Since transactions are unlimited and non-overlapping, adding
   this trade doesn't prevent any other trade.

5. Strategy S' = S + this trade has profit = profit(S) + p > profit(S).

6. This contradicts S being optimal.

7. Therefore, any optimal strategy must take all positive differences.
```

---

### Comparison: Single vs Unlimited Transactions

| Aspect | Single Transaction | Unlimited Transactions |
|--------|-------------------|------------------------|
| **Goal** | Find best (buy, sell) pair | Sum all profitable trades |
| **Approach** | Track min price, max profit | Sum positive diffs |
| **Code** | `min_price = min(min_price, price)` | `profit += max(0, diff)` |
| **Example** | `[7,1,5,3,6,4]` → buy 1, sell 6 = 5 | Same → 4+3 = 7 |
| **Time** | O(n) | O(n) |
| **Space** | O(1) | O(1) |

```python
# SINGLE TRANSACTION
def max_profit_single(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    return max_profit

# UNLIMITED TRANSACTIONS
def max_profit_unlimited(prices):
    profit = 0
    for i in range(1, len(prices)):
        profit += max(0, prices[i] - prices[i-1])
    return profit
```

<!-- back -->
