## 0/1 Knapsack Problem

**Question:** How do you solve the 0/1 knapsack problem with dynamic programming?

<!-- front -->

---

## Answer: 2D DP Table

### Solution
```python
def knapsack(weights, values, capacity):
    n = len(weights)
    
    # dp[i][w] = max value with first i items and weight w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(
                    dp[i-1][w],                           # Don't take item
                    dp[i-1][w - weights[i-1]] + values[i-1]  # Take item
                )
            else:
                dp[i][w] = dp[i-1][w]
    
    return dp[n][capacity]
```

### Visual: DP Table
```
weights = [2, 3, 4, 5]
values  = [3, 4, 5, 6]
capacity = 5

        w=0  w=1  w=2  w=3  w=4  w=5
i=0     0    0    0    0    0    0
i=1     0    0    3    3    3    3
i=2     0    0    3    4    4    7
i=3     0    0    3    4    5    7
i=4     0    0    3    4    5    7

Answer: dp[4][5] = 7
```

### ⚠️ Tricky Parts

#### 1. Why 2D DP?
```python
# dp[i][w] depends on dp[i-1][w] (without current item)
# and dp[i-1][w-weight] + value (with current item)

# Each item can only be used once
# So we look at PREVIOUS row (i-1), not current row
```

#### 2. Space Optimization to 1D
```python
# Since dp[i][w] only depends on dp[i-1][...],
# we can iterate backwards to reuse single array

def knapsack1D(weights, values, capacity):
    n = len(weights)
    dp = [0] * (capacity + 1)
    
    for i in range(n):
        # Iterate backwards to avoid using updated values
        for w in range(capacity, weights[i]-1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]
```

#### 3. Reconstruct Solution
```python
def knapsackWithItems(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    # Fill table
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i-1][w], 
                              dp[i-1][w-weights[i-1]] + values[i-1])
            else:
                dp[i][w] = dp[i-1][w]
    
    # Backtrack to find items
    w = capacity
    items = []
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i-1][w]:
            items.append(i-1)
            w -= weights[i-1]
    
    return dp[n][capacity], items
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| 2D DP | O(n×W) | O(n×W) |
| 1D DP | O(n×W) | O(W) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Forward iteration in 1D | Iterate backwards |
| Using current row | Use previous row |
| Off-by-one | Check weight <= capacity |

<!-- back -->
