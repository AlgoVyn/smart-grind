## DP - Coin Change (Unbounded Knapsack): Comparison

When should you use different approaches for coin change?

<!-- front -->

---

### DP vs Greedy

| Aspect | DP | Greedy |
|--------|-----|--------|
| **Correctness** | Always correct | Only for canonical systems |
| **Time** | O(amount × n) | O(n log n) to sort |
| **Space** | O(amount) | O(1) |
| **Use case** | Arbitrary coins | Standard coin systems |

**Winner**: DP unless you know the coin system is canonical (e.g., US coins)

---

### Forward vs Backward Iteration

| Aspect | Forward (Unbounded) | Backward (0/1) |
|--------|---------------------|----------------|
| **Reuse allowed** | Yes | No |
| **Use for** | Coin change, unbounded | 0/1 knapsack |
| **Transition** | `dp[i] = min(dp[i], dp[i-coin]+1)` | Same |
| **Result** | Unlimited coins per type | One coin per type |

---

### Combinations vs Permutations

| Aspect | Combinations | Permutations |
|--------|--------------|--------------|
| **Loop order** | Coin outer | Amount outer |
| **Order matters** | No | Yes |
| **Example [1,2]→3** | {1,1,1}, {1,2} | (1,1,1), (1,2), (2,1) |
| **Count for 3** | 2 | 3 |
| **Use when** | Counting ways | Sequences matter |

---

### Decision Tree

```
Coin change problem?
├── Goal?
│   ├── Minimum coins → DP with min
│   ├── Number of ways → DP with sum
│   │   ├── Order matters? → Permutations (amount outer)
│   │   └── Order irrelevant? → Combinations (coin outer)
│   └── Feasibility → DP boolean
├── Coin system known?
│   ├── Yes and canonical → Greedy works
│   └── No or unknown → Must use DP
└── Unlimited coins?
    ├── Yes → Forward iteration
    └── No → Backward iteration (0/1)
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Interview/general | DP | Always correct |
| Standard US coins | Greedy | Faster, provably optimal |
| Count ways | DP + correct loop order | Depends on definition |
| Space constrained | DP still | Can't reduce below O(amount) |
| Reconstruct solution | DP + parent array | Track choices |

<!-- back -->
