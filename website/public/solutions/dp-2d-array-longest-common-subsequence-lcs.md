# DP - 2D Array (Longest Common Subsequence - LCS)

## Overview

This pattern is used for finding the longest common subsequence between two strings. It's for sequence comparison problems. Benefits include handling deletions and insertions implicitly.

## Key Concepts

- dp[i][j]: LCS length for first i chars of s1 and first j of s2.
- If s1[i-1] == s2[j-1], dp[i][j] = dp[i-1][j-1] + 1
- Else, max(dp[i-1][j], dp[i][j-1])

## Template

```python
def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]
```

## Example Problems

1. Longest Common Subsequence: Find LCS length.
2. Shortest Common Supersequence: Find shortest string containing both.
3. Delete Operation for Two Strings: Minimum deletions to make strings equal.

## Time and Space Complexity

- Time: O(m * n)
- Space: O(m * n), optimizable to O(min(m,n))

## Common Pitfalls

- Off-by-one in indexing.
- Forgetting to initialize dp[0][j] and dp[i][0] to 0.
- Confusing subsequence vs substring.