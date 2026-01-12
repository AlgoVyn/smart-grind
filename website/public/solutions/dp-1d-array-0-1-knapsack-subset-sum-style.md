# DP - 1D Array (0/1 Knapsack Subset Sum Style)

## Overview

This pattern is used for 0/1 knapsack problems where each item can be used at most once, or subset sum problems. It's for decision-making with constraints. Benefits include efficient space usage with 1D array.

## Key Concepts

- dp[j]: Whether sum j is possible or max value for weight j.
- Iterate through items, and for each, update dp backwards to avoid reusing items.

## Template

```python
def subset_sum(nums, target):
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    return dp[target]
```

## Example Problems

1. Partition Equal Subset Sum: Determine if array can be partitioned into two subsets with equal sum.
2. 0/1 Knapsack: Maximize value with weight constraints, each item once.
3. Target Sum: Find number of ways to assign + or - to reach target sum.

## Time and Space Complexity

- Time: O(n * target)
- Space: O(target)

## Common Pitfalls

- Updating dp in wrong direction (forward would allow reuse).
- Not handling target=0.
- Forgetting to use boolean for feasibility.