---
type: flashcard
pattern: dp-1d-array-0-1-knapsack-subset-sum
category: comparison
tags: [dp, knapsack, 0-1-knapsack, unbounded-knapsack, comparison]
---

<!-- front -->
0/1 Knapsack vs Unbounded Knapsack: What's the difference in implementation?

<!-- back -->
**The Only Difference: Iteration Direction**

| Aspect | 0/1 Knapsack | Unbounded Knapsack |
|--------|--------------|-------------------|
| **Iteration** | Backward: `target → num` | Forward: `num → target` |
| **Item Usage** | Each item at most once | Each item unlimited times |
| **Space** | O(target) | O(target) |
| **Time** | O(n × target) | O(n × target) |

**0/1 Knapsack (Backward)**
```python
for num in nums:
    for i in range(target, num - 1, -1):  # ← backward
        dp[i] = dp[i] or dp[i - num]
```

**Unbounded Knapsack (Forward)**
```python
for num in nums:
    for i in range(num, target + 1):      # ← forward
        dp[i] = dp[i] or dp[i - num]
```

**Why backward works for 0/1:**
- When processing `dp[i]`, `dp[i - num]` still contains values from BEFORE processing current item
- Forward would see already-updated values, allowing reuse

**Approach Comparison:**
| Approach | Use When |
|----------|----------|
| Boolean DP | Check if achievable |
| Maximization | Max value within constraint |
| Count DP | Number of ways |
| 2D DP | Need to reconstruct solution |
