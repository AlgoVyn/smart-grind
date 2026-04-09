## DP - 1D Array (Coin Change / Unbounded Knapsack): Core Concepts

What are the fundamental concepts that distinguish Coin Change / Unbounded Knapsack DP from other DP patterns?

<!-- front -->

---

### The "Unbounded" Property

**Key characteristic:** Each coin/item can be used **unlimited times**.

```
0/1 Knapsack:      dp[i][w] uses dp[i-1][w] - each item once
Unbounded Knapsack: dp[w] uses dp[w-coin] - can reuse same coin
```

**Why forward iteration works:**
```
When processing amount i, dp[i - coin] has already been computed
AND may include the same coin we're currently considering.

Example: coin=3
  dp[6] = min(dp[6], dp[3] + 1)
  If dp[3] used a 3-coin, dp[6] can use another 3-coin
```

---

### Loop Order Matters

| Loop Order | Result | Use Case |
|------------|--------|----------|
| **Coin outer, amount inner** | Combinations | {1,2} = {2,1} |
| **Amount outer, coin inner** | Permutations | {1,2} ≠ {2,1} |

```python
# COMBINATIONS (Coin Change II - LeetCode 518)
for coin in coins:          # Outer: coins
    for i in range(coin, amount + 1):
        dp[i] += dp[i - coin]

# PERMUTATIONS (Combination Sum IV - LeetCode 377)
for i in range(1, amount + 1):  # Outer: amounts
    for coin in coins:
        if coin <= i:
            dp[i] += dp[i - coin]
```

---

### Initialization Patterns

| Problem | dp[0] | Rest of dp[] | Reason |
|---------|-------|--------------|--------|
| **Minimum coins** | 0 | ∞ | 0 coins for amount 0; infinity = unreachable |
| **Count ways** | 1 | 0 | One way to make 0 (use nothing); no ways yet |
| **Max value** | 0 | 0 | Base value; can always achieve 0 |
| **Exact change (bool)** | True | False | Can make 0; can't make others yet |

---

### State Transition Templates

```
MINIMUM:
  dp[i] = min(dp[i], dp[i - coin] + 1) for all coin ≤ i

COUNT WAYS:
  dp[i] += dp[i - coin] for all coin ≤ i

MAXIMIZE:
  dp[w] = max(dp[w], dp[w - weight] + value) for all items

BOOLEAN:
  dp[i] = dp[i] or dp[i - coin] for all coin ≤ i
```

---

### Common Pitfalls

| Pitfall | Wrong | Correct |
|---------|-------|---------|
| **Backward iteration** | dp[i] = min(dp[i], dp[i-coin]+1) with i descending | Forward iteration for unbounded |
| **Wrong init for min** | dp = [0] * (amount+1) | dp = [∞] * (amount+1), dp[0]=0 |
| **Wrong init for count** | dp = [1] * (amount+1) | dp = [0] * (amount+1), dp[0]=1 |
| **Not checking bounds** | dp[i-coin] without check | Always check coin ≤ i |
| **Ignoring unreachable** | return dp[amount] directly | Check if dp[amount] == ∞ |

<!-- back -->
