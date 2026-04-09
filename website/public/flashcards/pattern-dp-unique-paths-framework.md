## DP - Unique Paths: Framework

What is the complete code template for unique paths on grid?

<!-- front -->

---

### Framework 1: Unique Paths DP

```
┌─────────────────────────────────────────────────────┐
│  UNIQUE PATHS - TEMPLATE                             │
├─────────────────────────────────────────────────────┤
│  dp[i][j] = number of ways to reach cell (i,j)       │
│  from top-left, moving only right or down             │
│                                                        │
│  1. Initialize dp[m][n] with 1s                        │
│     (first row and column all 1s - only one way)    │
│                                                        │
│  2. For i from 1 to m-1:                              │
│     For j from 1 to n-1:                              │
│        dp[i][j] = dp[i-1][j] + dp[i][j-1]            │
│                                                        │
│  3. Return dp[m-1][n-1]                                │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: 2D DP

```python
def unique_paths(m, n):
    """
    Count unique paths in m x n grid.
    LeetCode 62
    Time: O(m×n), Space: O(m×n)
    """
    dp = [[1] * n for _ in range(m)]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]
```

---

### Implementation: Space Optimized

```python
def unique_paths_optimized(m, n):
    """O(n) space."""
    dp = [1] * n
    
    for i in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j-1]
    
    return dp[n-1]
```

---

### Implementation: Combinatorics

```python
from math import comb

def unique_paths_math(m, n):
    """
    C(m+n-2, m-1) = C(m+n-2, n-1)
    Total moves = (m-1) down + (n-1) right = m+n-2
    Choose which are down (or right)
    """
    return comb(m + n - 2, min(m - 1, n - 1))
```

---

### Key Pattern Elements

| Approach | Space | Time | Notes |
|----------|-------|------|-------|
| 2D DP | O(m×n) | O(m×n) | Standard |
| 1D DP | O(n) | O(m×n) | Space optimized |
| Math | O(1) | O(1) | C(m+n-2, m-1) |

<!-- back -->
