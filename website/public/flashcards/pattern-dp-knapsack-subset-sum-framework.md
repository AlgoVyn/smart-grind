## DP - 0-1 Knapsack / Subset Sum: Framework

What is the complete code template for 0-1 Knapsack dynamic programming?

<!-- front -->

---

### Framework 1: 0-1 Knapsack (2D)

```
┌─────────────────────────────────────────────────────┐
│  0-1 KNAPSACK - 2D DP TEMPLATE                       │
├─────────────────────────────────────────────────────┤
│  Input: weights[], values[], capacity W             │
│  n = number of items                                │
│                                                      │
│  1. Initialize dp[n+1][W+1] = 0                      │
│                                                      │
│  2. For i from 1 to n:                              │
│     For w from 0 to W:                              │
│        dp[i][w] = dp[i-1][w]  // Skip item i        │
│        If w >= weights[i-1]:                        │
│           dp[i][w] = max(dp[i][w],                 │
│                          dp[i-1][w-weights[i-1]] + values[i-1])
│                                                      │
│  3. Return dp[n][W]                                   │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: 0-1 Knapsack

```python
def knapsack_2d(weights, values, capacity):
    """
    Classic 0-1 Knapsack with 2D DP.
    Returns maximum value achievable.
    """
    n = len(weights)
    # dp[i][w] = max value using first i items with capacity w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            # Skip item i-1
            dp[i][w] = dp[i-1][w]
            
            # Take item i-1 if it fits
            if w >= weights[i-1]:
                dp[i][w] = max(
                    dp[i][w],
                    dp[i-1][w - weights[i-1]] + values[i-1]
                )
    
    return dp[n][capacity]
```

---

### Implementation: Space Optimized (1D)

```python
def knapsack_1d(weights, values, capacity):
    """
    0-1 Knapsack with O(W) space.
    """
    dp = [0] * (capacity + 1)
    
    for i in range(len(weights)):
        # Traverse backwards to prevent reuse
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]
```

---

### Implementation: Subset Sum

```python
def subset_sum(nums, target):
    """
    Return True if any subset sums to target.
    """
    dp = [False] * (target + 1)
    dp[0] = True  # Empty subset sums to 0
    
    for num in nums:
        # Go backwards to avoid reuse
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
    
    return dp[target]
```

---

### Key Pattern Elements

| Element | Description | Why It Matters |
|---------|-------------|----------------|
| State | dp[i][w] or dp[w] | What we can achieve |
| Choice | Take or skip | Core 0-1 decision |
| Backward iteration | Prevents reuse | Critical for 0-1 vs unbounded |
| Base case | dp[0] = 0 or True | Starting point |

<!-- back -->
