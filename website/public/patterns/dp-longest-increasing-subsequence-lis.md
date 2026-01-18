# DP - Longest Increasing Subsequence (LIS)

## Overview

This pattern is used to find the length of the longest increasing subsequence in an array. It's for sequence problems requiring order preservation. Benefits include O(n log n) optimization possible.

## Key Concepts

- dp[i]: Length of LIS ending at i.
- dp[i] = 1 + max(dp[j] for j < i and nums[j] < nums[i])
- Or use patience sorting for O(n log n).

## Template

```python
def lis(nums):
    if not nums:
        return 0
    n = len(nums)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if nums[i] > nums[j]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)
```

## Example Problems

1. Longest Increasing Subsequence: Length of LIS.
2. Russian Doll Envelopes: LIS with 2D constraints.
3. Number of Longest Increasing Subsequence: Count LIS.

## Time and Space Complexity

- Time: O(n^2), optimizable to O(n log n)
- Space: O(n)

## Common Pitfalls

- Forgetting strict increasing vs non-decreasing.
- Not handling duplicates.
- Off-by-one in comparisons.