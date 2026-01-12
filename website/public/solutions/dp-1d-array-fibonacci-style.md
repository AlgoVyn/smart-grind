# DP - 1D Array (Fibonacci Style)

## Overview

This pattern is used for problems where the solution depends on the solutions of smaller subproblems, typically involving sequences or recursive relationships similar to the Fibonacci sequence. It's ideal for problems that can be broken down into overlapping subproblems with optimal substructure. Benefits include avoiding redundant calculations through memoization or tabulation, leading to efficient solutions.

## Key Concepts

- Bottom-up tabulation: Build solutions from base cases up to the target.
- State: Usually dp[i] represents the solution for the first i elements or up to index i.
- Recurrence: dp[i] = some function of dp[i-1], dp[i-2], etc.

## Template

```python
def fibonacci_style_dp(n):
    if n <= 1:
        return n
    # Initialize dp array
    dp = [0] * (n + 1)
    dp[1] = 1  # Base case
    
    # Fill dp array
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]  # Recurrence relation
    
    return dp[n]
```

## Example Problems

1. Climbing Stairs: Find the number of ways to climb n stairs, where each step is 1 or 2 stairs.
2. House Robber: Maximize the amount of money robbed from houses in a line without robbing adjacent houses.
3. Min Cost Climbing Stairs: Find the minimum cost to reach the top of the stairs, where each step has a cost.

## Time and Space Complexity

- Time: O(n), as we iterate through the array once.
- Space: O(n) for the dp array, but can be optimized to O(1) by keeping only the last few values.

## Common Pitfalls

- Forgetting base cases.
- Off-by-one errors in indexing.
- Not recognizing when to use memoization vs tabulation.