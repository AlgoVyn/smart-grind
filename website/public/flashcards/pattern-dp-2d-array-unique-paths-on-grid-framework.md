## DP - 2D Array (Unique Paths on Grid): Framework

What is the complete code template for unique paths on grid?

<!-- front -->

---

### Framework 1: Basic Unique Paths

```
┌─────────────────────────────────────────────────────┐
│  UNIQUE PATHS ON GRID - BASIC TEMPLATE                │
├─────────────────────────────────────────────────────┤
│  Key Insight: Ways to reach (i,j) = ways from top   │
│  + ways from left. Movement: only right and down.   │
│                                                        │
│  1. Initialize dp[m][n] with 1s (first row/col = 1) │
│                                                        │
│  2. For i from 1 to m-1:                              │
│     For j from 1 to n-1:                             │
│        dp[i][j] = dp[i-1][j] + dp[i][j-1]            │
│                                                        │
│  3. Return dp[m-1][n-1]                              │
│                                                        │
│  Space-optimized: Use 1D array, update left to right │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Basic Unique Paths

```python
def unique_paths(m, n):
    """
    Count unique paths in m x n grid.
    LeetCode 62 - Unique Paths
    Time: O(m × n), Space: O(m × n)
    """
    dp = [[1] * n for _ in range(m)]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    
    return dp[m - 1][n - 1]

# Space-optimized: O(n) space
def unique_paths_optimized(m, n):
    dp = [1] * n
    
    for i in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j - 1]
    
    return dp[n - 1]

# Combinatorics: O(min(m,n)) time, O(1) space
def unique_paths_combinatorics(m, n):
    from math import comb
    return comb(m + n - 2, min(m - 1, n - 1))
```

---

### Framework 2: With Obstacles

```
┌─────────────────────────────────────────────────────┐
│  UNIQUE PATHS WITH OBSTACLES                          │
├─────────────────────────────────────────────────────┤
│  1. If start or end is obstacle: return 0            │
│                                                        │
│  2. Initialize dp[0][0] = 1                          │
│                                                        │
│  3. First column: dp[i][0] = dp[i-1][0] if no obs    │
│     First row: dp[0][j] = dp[0][j-1] if no obs       │
│                                                        │
│  4. For each cell: if not obstacle:                  │
│        dp[i][j] = dp[i-1][j] + dp[i][j-1]            │
│     else: dp[i][j] = 0                               │
│                                                        │
│  5. Return dp[m-1][n-1]                              │
└─────────────────────────────────────────────────────┘
```

---

### Framework 3: Minimum Path Sum

```
┌─────────────────────────────────────────────────────┐
│  MINIMUM PATH SUM                                     │
├─────────────────────────────────────────────────────┤
│  Key: Use min() instead of sum, add current weight   │
│                                                        │
│  1. dp[0][0] = grid[0][0]                            │
│                                                        │
│  2. First column: cumulative sum from top             │
│     First row: cumulative sum from left               │
│                                                        │
│  3. For i from 1 to m-1:                              │
│     For j from 1 to n-1:                             │
│        dp[i][j] = min(dp[i-1][j], dp[i][j-1])        │
│                     + grid[i][j]                     │
│                                                        │
│  4. Return dp[m-1][n-1]                              │
└─────────────────────────────────────────────────────┘
```

---

### Key Pattern Elements

| Element | Purpose | Value for Obstacles | Value for Min Sum |
|---------|---------|---------------------|-------------------|
| `dp[i][j]` | Cell state | Path count | Min sum to reach |
| Base case | Starting point | Check if blocked | `grid[0][0]` |
| First row/col | Boundary | Propagate if clear | Cumulative sum |
| Recurrence | State transition | `top + left` or `0` | `min(top,left) + weight` |

<!-- back -->
