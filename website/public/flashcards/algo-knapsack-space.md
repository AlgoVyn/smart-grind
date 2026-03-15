## 0/1 Knapsack Space Optimization

**Questions:**
1. How to reduce space from O(n×W) to O(W)?
2. What's the iteration order catch?

<!-- front -->

---

## Knapsack Space Optimization

### Space Reduction
Use **1D array** instead of 2D table.

### The Catch: Iteration Order

#### ❌ Wrong (Forward Iteration)
```python
for w in range(weight, W + 1):  # FORWARD
    dp[w] = max(dp[w], dp[w-weight] + value)
```
**Problem:** Uses updated `dp[w-weight]` from same iteration (0/1 becomes unbounded knapsack)

#### ✅ Correct (Backward Iteration)
```python
for w in range(W, weight - 1, -1):  # BACKWARD
    dp[w] = max(dp[w], dp[w-weight] + value)
```
**Why:** Ensures each item used at most once

### Complete Solution
```python
def knapsack_01(weights, values, W):
    n = len(weights)
    dp = [0] * (W + 1)
    
    for i in range(n):
        for w in range(W, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[W]
```

### 💡 Key Insight
Backward iteration preserves the "0/1" property by using values from the **previous item** (not current).

<!-- back -->
