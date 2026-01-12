# DP - 1D Array (Kadane's Algorithm for Max/Min Subarray)

## Overview

This pattern is used to find the maximum or minimum sum subarray in an array, handling cases with negative numbers. It's efficient for problems requiring contiguous subarray sums. Benefits include linear time complexity and ability to handle large arrays.

## Key Concepts

- Local max: Keep track of the maximum sum ending at current position.
- Global max: Update the overall maximum as we go.
- Reset when sum becomes negative (for max subarray).

## Template

```python
def kadane_max_subarray(nums):
    if not nums:
        return 0
    max_current = max_global = nums[0]
    for num in nums[1:]:
        max_current = max(num, max_current + num)
        if max_current > max_global:
            max_global = max_current
    return max_global
```

## Example Problems

1. Maximum Subarray: Find the contiguous subarray with the largest sum.
2. Maximum Sum Circular Subarray: Find the maximum sum in a circular array.
3. Minimum Size Subarray Sum: Find the smallest subarray with sum at least k (sliding window variant).

## Time and Space Complexity

- Time: O(n)
- Space: O(1)

## Common Pitfalls

- Not handling empty arrays.
- Forgetting to initialize with first element.
- Confusing local and global max.