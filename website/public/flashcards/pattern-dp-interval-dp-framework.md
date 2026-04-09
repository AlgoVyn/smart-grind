## DP - Interval DP: Framework

What is the complete code template for solving Interval DP problems?

<!-- front -->

---

### Framework: Interval DP Template

```
┌─────────────────────────────────────────────────────────────┐
│  INTERVAL DP - TEMPLATE                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Key Insight: dp[i][j] = optimal value for interval [i, j]  │
│                                                             │
│  1. Define state:                                           │
│     - dp[i][j] = optimal value for interval [i, j]          │
│                                                             │
│  2. Base case:                                              │
│     - dp[i][i] = 0 (single element, no operation needed)    │
│                                                             │
│  3. Process by increasing length:                           │
│     - for length in range(2, n+1):                          │
│         for i in range(n - length + 1):                    │
│             j = i + length - 1                              │
│                                                             │
│  4. Try all partition points:                               │
│     - for k in range(i, j):                                │
│         left = dp[i][k]                                     │
│         right = dp[k+1][j]                                  │
│         cost = compute_cost(i, k, j)                      │
│         dp[i][j] = min/max(dp[i][j], left + right + cost)   │
│                                                             │
│  5. Return dp[0][n-1]                                       │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: Bottom-Up Interval DP

```python
def interval_dp_template(arr):
    """
    Bottom-Up Interval DP Template
    Time: O(n³), Space: O(n²)
    """
    n = len(arr)
    
    # dp[i][j] = optimal value for interval [i, j]
    dp = [[0] * n for _ in range(n)]
    
    # Base case: intervals of length 1
    for i in range(n):
        dp[i][i] = 0  # or base value
    
    # Process intervals of increasing length
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')  # or -inf for max
            
            # Try all partition points
            for k in range(i, j):
                left = dp[i][k]
                right = dp[k + 1][j]
                cost = compute_cost(i, k, j, arr)
                
                dp[i][j] = min(dp[i][j], left + right + cost)
    
    return dp[0][n - 1]


def compute_cost(i, k, j, arr):
    """Customize based on specific problem."""
    pass
```

---

### Implementation: Burst Balloons (Classic Example)

```python
def max_coins(nums):
    """
    Burst balloons to maximize coins.
    Time: O(n³), Space: O(n²)
    """
    n = len(nums)
    # Add virtual balloons with value 1 at boundaries
    balloons = [1] + nums + [1]
    
    # dp[i][j] = max coins from bursting all balloons in (i, j)
    dp = [[0] * (n + 2) for _ in range(n + 2)]
    
    # Process by interval length
    for length in range(1, n + 1):
        for left in range(1, n - length + 2):
            right = left + length - 1
            
            # Try bursting each balloon last in [left, right]
            for k in range(left, right + 1):
                coins = balloons[left - 1] * balloons[k] * balloons[right + 1]
                coins += dp[left][k - 1] + dp[k + 1][right]
                dp[left][right] = max(dp[left][right], coins)
    
    return dp[1][n]
```

---

### Key Framework Elements

| Element | Purpose | Example |
|---------|---------|---------|
| `dp[i][j]` | State definition | Max coins in interval [i,j] |
| `length` | Iteration order | Process small intervals first |
| `k` | Partition point | Split interval at position k |
| `compute_cost()` | Problem-specific | Cost of combining subproblems |
| Base case | Starting values | `dp[i][i] = 0` |

---

### Iteration Order Visualization

```
For n = 4:

Length 2: [0,1], [1,2], [2,3]
Length 3: [0,2], [1,3]
Length 4: [0,3]

Always process smaller intervals before larger ones!
```

<!-- back -->
