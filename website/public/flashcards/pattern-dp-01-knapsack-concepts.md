## DP - 0/1 Knapsack: Core Concepts

What are the fundamental principles of 0/1 knapsack?

<!-- front -->

---

### Core Concept

**For 0/1 knapsack, iterate backward through capacity to ensure each item is used at most once.**

**Forward vs Backward:**
```
Item: weight=2, value=3
Capacity: 5

Forward (WRONG for 0/1):
cap=2: dp[2] = max(dp[2], dp[0]+3) = 3
cap=3: dp[3] = max(dp[3], dp[1]+3) = 3
cap=4: dp[4] = max(dp[4], dp[2]+3) = 6 ← Used item twice!

Backward (CORRECT):
cap=5: dp[5] = max(dp[5], dp[3]+3) = 3
cap=4: dp[4] = max(dp[4], dp[2]+3) = 3
cap=3: dp[3] = max(dp[3], dp[1]+3) = 3
cap=2: dp[2] = max(dp[2], dp[0]+3) = 3
```

---

### The Pattern

```
Two variations:
1. Maximize value: dp[w] = max(dp[w], dp[w-weight] + value)
2. Subset sum: dp[i] = dp[i] or dp[i-num]

Key difference from unbounded:
- 0/1: backward iteration
- Unbounded: forward iteration
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Subset sum | Achievable sum | LeetCode 416 |
| Partition equal | Divide equally | LeetCode 416 |
| Target sum | Count ways | LeetCode 494 |
| 0/1 knapsack | Max value | Classic DP |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n × capacity) | n items |
| Space | O(capacity) | 1D array |
| Optimization | Space reduction | From 2D to 1D |

<!-- back -->
