## Title: 0/1 Knapsack Framework

What is the standard DP framework for 0/1 Knapsack?

<!-- front -->

---

### Framework Structure
```
INPUT: weights[], values[], capacity W
OUTPUT: maximum achievable value

1. INITIALIZE
   dp[j] = 0 for j = 0..W

2. PROCESS ITEMS
   for each item i = 0..n-1:
     # Option 1: Skip item → dp[j] unchanged
     # Option 2: Take item → update if beneficial
     for j = W down to w[i]:
       dp[j] = max(dp[j], dp[j - w[i]] + v[i])

3. RETURN
   answer = dp[W]
```

---

### Key Decisions
| Decision | Choice | Impact |
|----------|--------|--------|
| Loop direction | Backwards | Prevents reusing same item |
| State dimension | 1D vs 2D | Space trade-off |
| Capacity iterate | Down to w[i] | Skip impossible states |

### Variations
| Variant | Modification |
|---------|--------------|
| Min weight for value | Swap roles, minimize weight |
| Exact capacity | Check dp[W] valid |
| At most k items | Add dimension for count |
| Group knapsack | Pick one from each group |

---

### Pattern Recognition
```
Keywords: "choose at most one", "select items", 
          "maximum value", "weight limit"

→ Classic 0/1 Knapsack

Keywords: "infinite supply", "unlimited" 
→ Unbounded Knapsack (forward iteration)
```

<!-- back -->
