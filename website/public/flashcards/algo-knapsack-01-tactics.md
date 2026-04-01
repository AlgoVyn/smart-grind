## Title: 0/1 Knapsack Tactics

What are the key implementation tactics for 0/1 Knapsack?

<!-- front -->

---

### Optimization Tactics

| Tactic | When | Savings |
|--------|------|---------|
| Space optimization | Always | O(nW) → O(W) |
| Early termination | Items sorted by weight | Skip impossible |
| Pruning | Branch and bound | For exact solutions |
| Meet-in-middle | n ≤ 40 | O(2^(n/2)) |
| Bitset | Small W, counting | Faster with bit ops |

---

### Common Patterns

**Count Ways Version:**
```python
dp = [0] * (W + 1)
dp[0] = 1
for w in weights:
    for j in range(W, w - 1, -1):
        dp[j] += dp[j - w]  # add ways
```

**Minimize Weight for Value:**
```python
INF = float('inf')
dp = [INF] * (max_value + 1)
dp[0] = 0
for i in range(n):
    for v in range(maxV, -1, -1):
        if dp[v] != INF:
            new_v = v + values[i]
            new_w = dp[v] + weights[i]
            dp[new_v] = min(dp[new_v], new_w)
```

---

### Pitfalls
| Mistake | Issue | Fix |
|---------|-------|-----|
| Forward loop in 0/1 | Items reused | Loop backwards |
| Backward in unbounded | Wrong answer | Loop forwards |
| Integer overflow | Large values | Use larger type |
| Forgot base case | Wrong results | dp[0] = 0 |

<!-- back -->
