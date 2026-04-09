## DP - Unbounded Knapsack / Coin Change: Core Concepts

What are the fundamental principles of unbounded knapsack and coin change dynamic programming?

<!-- front -->

---

### Core Concept

Use **1D DP where each item can be used unlimited times**, iterating forward through capacities to allow reuse.

**Key insight**: Unlike 0-1 knapsack (iterate backwards), unbounded allows reuse by iterating forwards.

---

### The Pattern

```
Coin Change: coins = [1, 2, 5], amount = 11

Find minimum coins to make amount.

dp[i] = minimum coins to make amount i

dp[0] = 0 (base case)

For each coin:
  For amount from coin to target:
    dp[amount] = min(dp[amount], dp[amount - coin] + 1)

Processing coin=1:
  dp[1] = min(∞, dp[0]+1) = 1
  dp[2] = min(∞, dp[1]+1) = 2
  dp[3] = 3, ..., dp[11] = 11

Processing coin=2:
  dp[2] = min(2, dp[0]+1) = 1
  dp[3] = min(3, dp[1]+1) = 2
  dp[4] = min(4, dp[2]+1) = 2
  ...

Processing coin=5:
  dp[5] = min(5, dp[0]+1) = 1
  dp[6] = min(6, dp[1]+1) = 2
  dp[10] = 2, dp[11] = 3 (5+5+1)

Result: dp[11] = 3 ✓ (5+5+1 or 5+2+2+2)
```

---

### 0-1 vs Unbounded Comparison

| Aspect | 0-1 Knapsack | Unbounded Knapsack |
|--------|-------------|-------------------|
| **Iteration** | Backwards | Forwards |
| **Reuse** | No | Yes |
| **Space** | O(W) | O(W) |
| **Problem** | Max value, once | Min/max coins, unlimited |

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Coin Change** | Min coins for amount | Coin Change |
| **Coin Change II** | Count ways to make amount | Coin Change 2 |
| **Perfect Squares** | Min squares sum to n | Perfect Squares |
| **Combination Sum IV** | Number of combinations | Combination Sum |
| **Rod Cutting** | Max value cutting rod | Rod Cutting |
| **Integer Break** | Max product | Integer Break |

---

### Complexity

| Aspect | Time | Space |
|--------|------|-------|
| **Standard** | O(n × amount) | O(amount) |
| **Optimized** | O(n × amount) | O(amount) |

<!-- back -->
