# DP - Interval DP

## Overview

This pattern is used for problems involving intervals or ranges, like matrix chain multiplication or palindrome partitioning. It's for optimizing operations on contiguous segments. Benefits include breaking down problems into smaller intervals.

## Key Concepts

- dp[i][j]: Optimal value for subproblem from i to j.
- Iterate over length, then start index.
- Recurrence: Combine results from smaller intervals.

## Template

```python
def interval_dp(arr):
    n = len(arr)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            # Compute dp[i][j] based on subproblems
            # Example: for min cost, dp[i][j] = min over k of dp[i][k] + dp[k+1][j] + cost
    return dp[0][n-1]
```

## Example Problems

1. Matrix Chain Multiplication: Minimum cost to multiply matrices.
2. Palindrome Partitioning II: Minimum cuts to make palindromes.
3. Burst Balloons: Maximum coins from bursting balloons.

## Time and Space Complexity

- Time: O(n^3) typically
- Space: O(n^2)

## Common Pitfalls

- Wrong order of loops (length first).
- Off-by-one in interval bounds.
- Forgetting base cases for length 1.