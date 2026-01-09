# House Robber II

## Problem Description

You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses are arranged in a **circle**, meaning the first house is the neighbor of the last one.

Adjacent houses have a security system connected, and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array `nums` representing the amount of money in each house, return the maximum amount of money you can rob tonight without alerting the police.

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `nums = [2,3,2]` | `3` |

**Explanation:** You cannot rob house 1 (money = 2) and then rob house 3 (money = 2) because they are adjacent in the circular arrangement.

**Example 2:**

| Input | Output |
|-------|--------|
| `nums = [1,2,3,1]` | `4` |

**Explanation:** Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount = `1 + 3 = 4`.

**Example 3:**

| Input | Output |
|-------|--------|
| `nums = [1,2,3]` | `3` |

## Constraints

- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 1000`

## Solution

```python
from typing import List

class Solution:
    def rob(self, nums: List[int]) -> int:
        if not nums:
            return 0
        if len(nums) == 1:
            return nums[0]
        
        def rob_linear(nums):
            prev, curr = 0, 0
            for num in nums:
                prev, curr = curr, max(curr, prev + num)
            return curr
        
        return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))
```

## Explanation

This problem maximizes money robbed from a circular array without robbing adjacent houses.

### Key Insight

Since the houses are arranged in a circle, you **cannot rob both the first and last house** (they are adjacent). This means the problem reduces to two linear cases:

1. **Case 1:** Rob houses `0` to `n-2` (excluding the last house)
2. **Case 2:** Rob houses `1` to `n-1` (excluding the first house)

The answer is the maximum of these two cases.

### Algorithm

1. Handle edge cases: empty array or single house.
2. Use the linear House Robber solution on both ranges.
3. Return the maximum of the two results.

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) for two linear passes through the array |
| **Space** | O(1) constant space |
