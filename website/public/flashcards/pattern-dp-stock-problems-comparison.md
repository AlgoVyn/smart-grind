## DP Stock Problems: Comparison

How do different stock problem approaches compare?

<!-- front -->

---

### Stock Problem Variations Matrix

| Problem | Constraint | States | Time | Space |
|---------|------------|--------|------|-------|
| **One Transaction** | Buy once, sell once | 2 (min_price, max_profit) | O(n) | O(1) |
| **Unlimited** | No limits | 2 (hold, not_hold) | O(n) | O(1) |
| **With Cooldown** | 1 day after sell | 3 (hold, rest, cooldown) | O(n) | O(1) |
| **With Fee** | Cost per trade | 2 (hold, not_hold) | O(n) | O(1) |
| **At Most 2** | Max 2 transactions | 4 (buy1, sell1, buy2, sell2) or split | O(n) | O(n) or O(1) |
| **At Most K** | Max k transactions | 2(k+1) arrays | O(n×k) | O(k) |

---

### State Machine vs Greedy

| Aspect | State Machine (DP) | Greedy |
|--------|-------------------|--------|
| **When to use** | Any constraint | Unlimited only |
| **Correctness** | Always optimal | Only for unlimited |
| **One transaction** | ✓ Works | ✗ Fails |
| **With cooldown** | ✓ Works | ✗ Fails |
| **K transactions** | ✓ Works | ✗ Fails |
| **Code complexity** | More states | Simple sum |
| **Intuition** | Clear transitions | Just add positives |

**Verdict:** Learn state machine (general), use greedy shortcut only for unlimited.

---

### Space: O(n) Array vs O(1) Variables

| Aspect | O(n) Full Array | O(1) Variables |
|--------|-----------------|----------------|
| **Space** | O(n) | O(1) |
| **Time** | O(n) | O(n) |
| **Debuggability** | ✓ See all states | ✗ Harder to trace |
| **Path reconstruction** | ✓ Can backtrack | ✗ Need extra tracking |
| **Multiple test cases** | Reuse array | Recompute |
| **Interview preference** | Learning | Production |

**Rule:** Start with O(1), expand to O(n) only if needed.

---

### K-Transactions: 2D DP vs Rolling Arrays

| Approach | Time | Space | Implementation |
|----------|------|-------|---------------|
| **2D DP** `dp[k][n]` | O(n×k) | O(n×k) | `dp[t][d] = max(dp[t][d-1], price[d] + max_diff)` |
| **Rolling 1D** | O(n×k) | O(k) | `buy[i], sell[i]` arrays |
| **Optimized** | O(n) when k≥n/2 | O(1) | Greedy sum |

**Recommendation:** Use rolling 1D for clarity and space efficiency.

---

### LeetCode Problems Comparison

| Problem | # | Difficulty | Key Challenge | Pattern |
|---------|---|------------|---------------|---------|
| Stock I | 121 | Easy | Track min price | Single pass |
| Stock II | 122 | Medium | All positives | Greedy or SM |
| Stock III | 123 | Hard | Split optimally | Left + Right |
| Stock IV | 188 | Hard | k transactions | DP arrays |
| With Cooldown | 309 | Medium | 3-state SM | State machine |
| With Fee | 714 | Medium | Fee subtraction | Modify transition |

---

### Decision Flowchart

```
Problem statement
        │
        ├── "At most one transaction"
        │   └── Track min_price, max_profit
        │   └── O(n) time, O(1) space
        │
        ├── "As many as you like"
        │   ├── Quick: Sum all positives (greedy)
        │   └── General: hold/not_hold state machine
        │   └── O(n) time, O(1) space
        │
        ├── "Cooldown after selling"
        │   └── Add cooldown state
        │   └── 3-state: hold, rest, cooldown
        │   └── O(n) time, O(1) space
        │
        ├── "Transaction fee"
        │   └── Subtract fee on sell
        │   └── 2-state with modified transition
        │   └── O(n) time, O(1) space
        │
        └── "At most k transactions"
            ├── Is k >= n/2?
            │   └── Yes: Use unlimited (greedy)
            │   └── No: DP with buy/sell arrays
            └── O(n×k) time, O(k) space
```

---

### Common Pitfalls Comparison

| Pitfall | One Trans | Unlimited | Cooldown | K-Trans |
|---------|-----------|-----------|----------|---------|
| Wrong init | min_price=0 | hold=0 | cooldown=inf | buy=0 |
| State order | N/A | N/A | Use prev_hold | Sequential update |
| Miss optimization | N/A | N/A | N/A | Forget k>=n/2 |
| Overflow | Large prices | Large sum | Large sum | Many transactions |
| Empty array | Return 0 | Return 0 | Return 0 | Return 0 |

<!-- back -->
