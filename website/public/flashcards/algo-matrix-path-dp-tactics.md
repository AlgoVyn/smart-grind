## Title: Matrix Path DP Tactics

What are the key implementation tactics for matrix path DP?

<!-- front -->

---

### Implementation Tactics

| Tactic | Benefit |
|--------|---------|
| In-place modification | O(1) extra space |
| Rolling array | O(n) space instead of O(mn) |
| Reverse traversal | Handle dependencies correctly |
| Pre-check bounds | Avoid index errors |
| Sentinel values | Simplify boundary conditions |

### In-Place DP
```python
def min_path_sum_inplace(grid):
    """Modify grid in place - O(1) space"""
    m, n = len(grid), len(grid[0])
    
    for j in range(1, n):
        grid[0][j] += grid[0][j-1]
    
    for i in range(1, m):
        grid[i][0] += grid[i-1][0]
        for j in range(1, n):
            grid[i][j] += min(grid[i-1][j], grid[i][j-1])
    
    return grid[m-1][n-1]
```

---

### Common Pitfalls
| Pitfall | Issue | Fix |
|---------|-------|-----|
| Uninitialized boundaries | Wrong answers | Fill first row/col explicitly |
| Integer overflow | Large sums | Use modulo if specified |
| Negative numbers | Min vs max confusion | Check problem statement |
| Off-by-one in bounds | Array error | Use < not <= |
| 0-index vs 1-index | Confusion | Be consistent |

### Modulo Arithmetic
```python
def unique_paths_mod(m, n, mod):
    """When answer can be huge"""
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = 1
    
    for i in range(m):
        for j in range(n):
            if i > 0:
                dp[i][j] = (dp[i][j] + dp[i-1][j]) % mod
            if j > 0:
                dp[i][j] = (dp[i][j] + dp[i][j-1]) % mod
    
    return dp[m-1][n-1]
```

---

### Mathematical Alternative
```python
# Unique paths = C(m+n-2, m-1) or C(m+n-2, n-1)
from math import comb
def unique_paths_math(m, n):
    return comb(m + n - 2, min(m-1, n-1))
```

<!-- back -->
