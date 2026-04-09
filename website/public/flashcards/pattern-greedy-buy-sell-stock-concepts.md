## Greedy Buy Sell Stock: Core Concepts

What are the fundamental concepts and insights behind greedy stock trading?

<!-- front -->

---

### Fundamental Definition

**Problem:** Given an array where `prices[i]` is the stock price on day `i`, find the maximum profit with unlimited buy-sell transactions (cannot hold multiple stocks simultaneously).

| Variant | Constraint | Solution |
|---------|------------|----------|
| **Unlimited transactions** | Buy and sell any number of times | O(n) greedy |
| **With transaction fee** | Fee deducted per sell | O(n) two-state DP |
| **With cooldown** | 1-day wait after selling | O(n) three-state DP |
| **At most k transactions** | Limited number of trades | O(n×k) DP |

---

### Key Insight: Every Uphill is Profit

```
Prices: [7, 1, 5, 3, 6, 4]
         ↓  ↑  ↓  ↑  ↓
        -6  +4 -2 +3 -2

Profitable transactions:
- Buy at 1, sell at 5: profit = 4
- Buy at 3, sell at 6: profit = 3

Total: 4 + 3 = 7 ✓

Equivalently: Sum of all positive differences
             = 4 + 3 = 7 ✓
```

**Critical observation:** Sum of all positive consecutive differences equals the sum of all (peak - valley) pairs.

---

### The "Aha!" Moments

1. **Why sum all positive differences?**
   - Think of price chart as mountain range
   - Every uphill segment contributes to profit
   - Instead of one big trade, capture every climb

2. **Why is greedy optimal here?**
   - Taking every profit opportunity is safe
   - No opportunity cost with unlimited transactions
   - Future higher price doesn't invalidate current profit

3. **Alternative view:**
   - Buy at local minima, sell at next local maxima
   - Sum of all (max - min) pairs = sum of all positive diffs

---

### Greedy Optimality Proof

```
Theorem: Sum of all positive differences yields maximum profit.

Proof:
1. Let prices = [p0, p1, p2, ..., pn-1]

2. Any valid trading strategy consists of buy-sell pairs:
   (buy at b1, sell at s1), (buy at b2, sell at s2), ...
   where b1 < s1 < b2 < s2 < ... (no overlap)

3. Profit = Σ(sell_price - buy_price) for each pair
         = Σ(all upward segments between buy and sell)

4. Since we can have unlimited transactions, there's no
   advantage to skipping a positive difference.

5. Therefore: max_profit = Σ(max(0, prices[i] - prices[i-1]))
```

---

### Complexity Analysis

| Approach | Time | Space | Proof |
|----------|------|-------|-------|
| **Sum positive diffs** | O(n) | O(1) | Greedy optimal |
| **Peak-valley** | O(n) | O(1) | Equivalent to above |
| **With fee (DP)** | O(n) | O(1) | State machine |
| **With cooldown** | O(n) | O(n) or O(1) | Three states |
| **k transactions** | O(n×k) | O(k) | DP required |

---

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Using `>=` instead of `>` | Use strict `>` for positive diff |
| Forgetting empty array check | Always handle `not prices` |
| Confusing with single transaction | Stock I uses min/max tracking |
| Wrong state transitions | Carefully track cash vs hold |
| Using DP when greedy suffices | Check if unlimited transactions |

<!-- back -->
