## DP - Edit Distance: Framework

What is the complete code template for edit distance?

<!-- front -->

---

### Framework 1: Edit Distance DP

```
┌─────────────────────────────────────────────────────┐
│  EDIT DISTANCE - TEMPLATE                              │
├─────────────────────────────────────────────────────┤
│  dp[i][j] = min operations to convert s1[0:i] to     │
│             s2[0:j]                                    │
│                                                        │
│  1. Initialize dp table: (m+1) x (n+1)                 │
│     dp[i][0] = i  # delete all from s1               │
│     dp[0][j] = j  # insert all from s2               │
│                                                        │
│  2. For i from 1 to m:                                 │
│     For j from 1 to n:                                 │
│        If s1[i-1] == s2[j-1]:                        │
│           dp[i][j] = dp[i-1][j-1]  # no operation    │
│        Else:                                          │
│           dp[i][j] = 1 + min(                          │
│              dp[i-1][j],    # delete                  │
│              dp[i][j-1],    # insert                  │
│              dp[i-1][j-1]   # replace                 │
│           )                                           │
│                                                        │
│  3. Return dp[m][n]                                    │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def min_distance(s1, s2):
    """
    Minimum edit distance between two strings.
    LeetCode 72
    Time: O(m×n), Space: O(m×n)
    """
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # Delete
                    dp[i][j-1],    # Insert
                    dp[i-1][j-1]   # Replace
                )
    
    return dp[m][n]
```

---

### Key Pattern Elements

| Operation | Cost | When |
|-----------|------|------|
| Match | 0 | Characters equal |
| Delete | 1 + dp[i-1][j] | Remove from s1 |
| Insert | 1 + dp[i][j-1] | Add from s2 |
| Replace | 1 + dp[i-1][j-1] | Change character |

<!-- back -->
