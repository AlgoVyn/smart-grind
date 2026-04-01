## Coin Change: Core Concepts

What is the coin change problem and how does it exemplify unbounded knapsack DP?

<!-- front -->

---

### Problem Variants

| Variant | Question | Output |
|---------|----------|--------|
| **Minimum coins** | Fewest coins to make amount? | Number or -1 |
| **Number of ways** | How many ways to make amount? | Count |
| **Exact change** | Can we make exact amount? | Boolean |

**Example:** coins = [1, 2, 5], amount = 11
- Min coins: 3 (5+5+1)
- Ways: Multiple combinations
- Exact change: Yes

---

### Unbounded Knapsack Structure

Each coin can be used **unlimited times**:

```
For minimum coins:
dp[i] = minimum coins to make amount i

Recurrence:
dp[i] = min(dp[i - coin] + 1) for all coin ≤ i
        
For ways:
dp[i] = sum(dp[i - coin]) for all coin ≤ i
```

---

### Key DP Properties

| Property | Minimum Coins | Number of Ways |
|----------|---------------|----------------|
| **Initialization** | dp[0]=0, rest=∞ | dp[0]=1, rest=0 |
| **Transition** | min over coins | sum over coins |
| **Order matters?** | No (combinations) | Depends on variant |
| **Coin order** | Outer or inner | Outer=coins for combinations |

---

### Greedy vs DP

**Greedy fails for general coins:**
```
coins = [1, 3, 4], amount = 6
Greedy: 4 + 1 + 1 = 3 coins (not optimal)
Optimal: 3 + 3 = 2 coins
```

**When greedy works:** Canonical coin systems (US coins, etc.)
```
Property: coin[i] ≥ coin[i-1] × 2 roughly, or verified greedy-proof
```

---

### Complexity

| Approach | Time | Space |
|----------|------|-------|
| **DP (amount × coins)** | O(amount × n) | O(amount) |
| **BFS** | O(amount × n) | O(amount) |
| **Complete search** | Exponential | O(amount) stack |
| **Optimized DP** | O(amount × n) | Can optimize to O(min_coin) |

<!-- back -->
