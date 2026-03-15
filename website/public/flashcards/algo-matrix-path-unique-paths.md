## Unique Paths - DP vs Combinatorics

**Question:** How can you solve this using combinatorics instead of DP?

<!-- front -->

---

## Unique Paths: Two Approaches

### DP Approach
```python
def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]
```

### Space-Optimized DP
```python
def unique_paths_opt(m, n):
    dp = [1] * n
    
    for i in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j-1]
    
    return dp[n-1]
```

### Combinatorics Approach
```
To reach (m-1, n-1), need:
- (m-1) moves down
- (n-1) moves right

Total moves = (m-1) + (n-1)

Choose positions for (m-1) downs:
C(total, down) = C(m+n-2, m-1)
```

### Math Implementation
```python
import math

def unique_paths_math(m, n):
    return math.comb(m + n - 2, m - 1)
```

### Comparison
| Approach | Time | Space |
|----------|------|-------|
| 2D DP | O(m×n) | O(m×n) |
| 1D DP | O(m×n) | O(n) |
| Math | O(min(m,n)) | O(1) |

### ⚠️ Watch Out
Math.comb available in Python 3.8+

<!-- back -->
