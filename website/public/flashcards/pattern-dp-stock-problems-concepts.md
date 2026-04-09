## DP Stock Problems: Core Concepts

What are the fundamental concepts behind DP stock problems?

<!-- front -->

---

### State Machine Foundation

**Core Insight:** Model trading as states with transitions.

```
        ┌─────────────────────────────────────┐
        │         STATE DIAGRAM               │
        ├─────────────────────────────────────┤
        │                                     │
        │    ┌─────────┐     buy      ┌───────┐│
        │    │ REST    │ ───────────>│ HOLD  ││
        │    │(no stock)│            │(stock)││
        │    └────┬────┘             └───┬───┘│
        │         ^      sell            │    │
        │         └──────────────────────┘    │
        │                                     │
        │  REST = max(previous_rest, sold)   │
        │  HOLD = max(previous_hold, rest - price)│
        │  SOLD = previous_hold + price       │
        │                                     │
        └─────────────────────────────────────┘
```

---

### Key States Explained

| State | Meaning | Value Interpretation |
|-------|---------|---------------------|
| `hold` | Max profit while holding stock | Negative = invested, Positive = profit if sold now |
| `not_hold` | Max profit without stock | Pure cash profit available |
| `cooldown` | Day after selling | Cannot buy, only rest |
| `buy[k]` | After k-th purchase | Best price paid for k-th buy |
| `sell[k]` | After k-th sale | Best profit from k transactions |

---

### Why State Machine Works

**Optimal Substructure:**
- Today's best profit depends only on yesterday's best profits
- No need to track individual buy/sell days
- States capture all necessary history

**Transition Invariants:**
```
hold[i] = max(hold[i-1], not_hold[i-1] - price[i])
          ↑ keep holding   ↑ buy today

not_hold[i] = max(not_hold[i-1], hold[i-1] + price[i])
              ↑ do nothing   ↑ sell today
```

---

### Critical Initialization

**Common Pitfall:** Wrong initial values.

| Variable | Correct Init | Wrong Init | Effect of Wrong |
|----------|-------------|------------|----------------|
| `hold` | `-prices[0]` | `0` | Allows free stock |
| `not_hold` | `0` | `-inf` | Can't start trading |
| `buy[i]` | `-inf` | `0` | Assumes free buys |
| `sell[i]` | `0` | `-inf` | No profit baseline |

**Why `hold = -prices[0]`?**
- Buying on day 0 costs `prices[0]`
- Profit = `-prices[0]` (negative = investment)

---

### Space Optimization Insight

**Key Realization:** Only previous day matters.

```python
# Before: O(n) space
hold = [0] * n
not_hold = [0] * n
for i in range(1, n):
    hold[i] = max(hold[i-1], not_hold[i-1] - price[i])

# After: O(1) space
hold = -prices[0]
not_hold = 0
for price in prices[1:]:
    hold, not_hold = max(hold, not_hold - price), max(not_hold, hold + price)
```

---

### The K-Transaction Optimization

**Critical Insight:** If `k >= n/2`, treat as unlimited.

```
Reason: With n days, max transactions is n/2 (buy-sell pairs)
        If k allows more than possible, constraint doesn't bind

Example: n = 5 days, k = 10
         Max possible transactions: floor(5/2) = 2
         k = 10 > 2, so effectively unlimited
```

This reduces O(n × k) to O(n) for large k.

<!-- back -->
