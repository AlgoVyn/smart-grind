# DP - 1D Array (0/1 Knapsack Subset Sum Style)

## Overview

The DP - 1D Array (0/1 Knapsack Subset Sum Style) pattern is used to solve problems where you select items without reuse (0/1 knapsack) or check if a subset of numbers sums to a target value. This pattern handles problems requiring maximum value, subset sum existence, or number of subsets.

## Key Concepts

- **0/1 Selection**: Items can be used at most once.
- **Backward Iteration**: Iterate from target down to item weight to prevent reuse.
- **State Transition**: Each state indicates if a sum is achievable with selected items.
- **Bottom-up Approach**: Build solutions from smaller subproblems.

## Template

```python
def subset_sum_exists(nums, target):
    dp = [False] * (target + 1)
    dp[0] = True  # Base case: sum 0 is achievable with empty subset
    
    for num in nums:
        for i in range(target, num - 1, -1):
            dp[i] = dp[i] or dp[i - num]
    
    return dp[target]

def knapsack_01(values, weights, capacity):
    dp = [0] * (capacity + 1)
    
    for i in range(len(values)):
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]
```

## Example Problems

1. **Subset Sum (LeetCode 416)**: Check if a subset sums to target.
2. **Partition Equal Subset Sum (LeetCode 416)**: Determine if array can be partitioned into two subsets with equal sum.
3. **0/1 Knapsack**: Max value with weight capacity.
4. **Count Number of Subsets with Given Sum**: Find number of subsets that sum to target.

## Time and Space Complexity

- **Time Complexity**: O(n * target), where n is number of items and target is the sum/capacity.
- **Space Complexity**: O(target), for the DP array.

## Common Pitfalls

- **Forward iteration**: Causes items to be reused multiple times.
- **Incorrect base case**: Failing to set dp[0] = True.
- **Not handling empty nums or target 0**: Trivial cases need special handling.
- **Forgetting to check num <= i before accessing dp[i - num]**: Can cause index errors.
- **Confusing subset sum with combination sum**: 0/1 vs unbounded selection.
