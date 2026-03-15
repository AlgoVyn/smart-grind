## Edit Distance (Levenshtein Distance)

**Question:** What are the three operations and their costs?

<!-- front -->

---

## Edit Distance

### Three Operations
| Operation | Cost | Description |
|-----------|------|-------------|
| Insert | 1 | Add a character |
| Delete | 1 | Remove a character |
| Replace | 1 | Change a character |

### DP Recurrence
```
If s1[i-1] == s2[j-1]:
    dp[i][j] = dp[i-1][j-1]  # No cost
Else:
    dp[i][j] = 1 + min(
        dp[i-1][j],     # Delete from s1
        dp[i][j-1],     # Insert into s1
        dp[i-1][j-1]    # Replace
    )
```

### Implementation
```python
def edit_distance(s1, s2):
    m, n = len(s1), len(s2)
    
    # Create DP table
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    for i in range(m + 1):
        dp[i][0] = i  # Delete all
    for j in range(n + 1):
        dp[0][j] = j  # Insert all
    
    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],      # Delete
                    dp[i][j-1],      # Insert
                    dp[i-1][j-1]     # Replace
                )
    
    return dp[m][n]
```

### Complexity: O(m × n)

<!-- back -->
