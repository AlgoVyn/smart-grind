## DP - 0-1 Knapsack / Subset Sum: Core Concepts

What are the fundamental principles of 0-1 Knapsack and Subset Sum dynamic programming?

<!-- front -->

---

### Core Concept

Use **a 2D DP table (or optimized 1D array) where dp[i][w] represents the maximum value achievable using first i items with capacity w**.

**Key insight**: For each item, we have two choices: take it (if it fits) or skip it.

---

### The Pattern

```
Problem: Items with weight and value, find max value within capacity.

Items: [(weight=2, value=3), (weight=3, value=4), (weight=4, value=5)]
Capacity: 5

DP Table (items × capacity):
        0   1   2   3   4   5
    0 [0,  0,  0,  0,  0,  0]  (no items)
    1 [0,  0,  3,  3,  3,  3]  (item 1: w=2,v=3)
    2 [0,  0,  3,  4,  4,  7]  (item 2: w=3,v=4)
    3 [0,  0,  3,  4,  5,  7]  (item 3: w=4,v=5)

Recurrence:
  dp[i][w] = max(
    dp[i-1][w],                    // Skip item i
    dp[i-1][w-weight[i]] + value[i]  // Take item i (if w >= weight[i])
  )

Result: dp[3][5] = 7 (take items 1 and 2: 3+4=7) ✓
```

---

### Subset Sum Variation

| Problem | Modification |
|---------|--------------|
| **0-1 Knapsack** | Maximize value within capacity |
| **Subset Sum** | Can we achieve exactly sum S? (boolean DP) |
| **Partition Equal Subset** | Can we partition into two equal sum subsets? |
| **Coin Change (0-1)** | Min/max coins to make amount (each coin used once) |

---

### Space Optimization

| Version | Space | How |
|---------|-------|-----|
| 2D DP | O(n × W) | Full table for reconstruction |
| 1D DP | O(W) | Iterate capacity backwards |

```python
# O(W) space optimization
def knapsack_1d(weights, values, capacity):
    dp = [0] * (capacity + 1)
    
    for i in range(len(weights)):
        # Go backwards to avoid using same item twice
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]
```

---

### Complexity

| Aspect | Time | Space |
|--------|------|-------|
| Standard 2D | O(n × W) | O(n × W) |
| Optimized 1D | O(n × W) | O(W) |

<!-- back -->
