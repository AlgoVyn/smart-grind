## Title: 0/1 Knapsack

What is the 0/1 Knapsack problem and how is it solved?

<!-- front -->

---

### Definition
Given n items with weights w[i] and values v[i], select items to maximize total value without exceeding capacity W. Each item can be taken at most once (0 or 1).

### DP State
```
dp[i][j] = max value using items 0..i-1 with capacity j

Recurrence:
dp[i][j] = max(dp[i-1][j],                    // skip item i-1
               dp[i-1][j-w[i-1]] + v[i-1])    // take item i-1 (if j >= w[i-1])
```

### Base Cases
```
dp[0][j] = 0 for all j  (no items = no value)
dp[i][0] = 0 for all i  (no capacity = no value)
```

---

### Space-Optimized DP
```python
def knapsack_01(weights, values, W):
    n = len(weights)
    dp = [0] * (W + 1)
    
    for i in range(n):
        # Traverse backwards to avoid using updated values
        for j in range(W, weights[i] - 1, -1):
            dp[j] = max(dp[j], dp[j - weights[i]] + values[i])
    
    return dp[W]
```

### Complexity
| Aspect | Value |
|--------|-------|
| Time | O(n × W) |
| Space | O(W) optimized |
| Type | Pseudo-polynomial |

---

### Reconstruction (Track Items)
```python
# Use 2D dp or separate choice array
taken = [[False] * (W+1) for _ in range(n+1)]

# Backtrack
j = W
for i in range(n, 0, -1):
    if taken[i][j]:
        print(f"Take item {i-1}")
        j -= weights[i-1]
```

<!-- back -->
