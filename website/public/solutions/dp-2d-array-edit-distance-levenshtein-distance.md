# DP - 2D Array (Edit Distance / Levenshtein Distance)

## Overview

This pattern is used to compute the minimum number of operations to transform one string into another. It's for string transformation problems. Benefits include handling insert, delete, replace operations.

## Key Concepts

- dp[i][j]: Min operations for first i chars of s1 to first j of s2.
- If s1[i-1] == s2[j-1], dp[i][j] = dp[i-1][j-1]
- Else, 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])

## Template

```python
def edit_distance(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]
```

## Example Problems

1. Edit Distance: Minimum operations to convert one string to another.
2. One Edit Distance: Check if strings are one edit away.
3. Minimum ASCII Delete Sum: Minimum cost to make strings equal.

## Time and Space Complexity

- Time: O(m * n)
- Space: O(m * n), optimizable to O(min(m,n))

## Common Pitfalls

- Forgetting to initialize first row and column.
- Off-by-one in comparisons.
- Not handling empty strings.