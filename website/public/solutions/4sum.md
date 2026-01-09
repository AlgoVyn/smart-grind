# 4Sum

## Problem Description

Given an array `nums` of `n` integers, return an array of all the unique quadruplets `[nums[a], nums[b], nums[c], nums[d]]` such that:

- `0 <= a, b, c, d < n`
- `a, b, c, and d are distinct.`
- `nums[a] + nums[b] + nums[c] + nums[d] == target`

You may return the answer in any order.

## Examples

**Example 1:**
```
Input: nums = [1,0,-1,0,-2,2], target = 0
Output: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
```

**Example 2:**
```
Input: nums = [2,2,2,2,2], target = 8
Output: [[2,2,2,2]]
```

## Constraints

- `1 <= nums.length <= 200`
- `-10^9 <= nums[i] <= 10^9`
- `-10^9 <= target <= 10^9`

## Solution

```python
from typing import List

class Solution:
    def fourSum(self, nums: List[int], target: int) -> List[List[int]]:
        nums.sort()
        result = []
        n = len(nums)
        for i in range(n - 3):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            for j in range(i + 1, n - 2):
                if j > i + 1 and nums[j] == nums[j - 1]:
                    continue
                left, right = j + 1, n - 1
                while left < right:
                    total = nums[i] + nums[j] + nums[left] + nums[right]
                    if total == target:
                        result.append([nums[i], nums[j], nums[left], nums[right]])
                        while left < right and nums[left] == nums[left + 1]:
                            left += 1
                        while left < right and nums[right] == nums[right - 1]:
                            right -= 1
                        left += 1
                        right -= 1
                    elif total < target:
                        left += 1
                    else:
                        right -= 1
        return result
```

## Explanation

To solve the 4Sum problem, we need to find all unique quadruplets that sum to the target. The optimal approach is to sort the array and use a combination of nested loops and two pointers.

After sorting, we fix the first element at index `i`, skipping duplicates. Then, for the second element at index `j` (starting from `i+1`), we also skip duplicates.

For each pair `(i, j)`, we use two pointers: `left` at `j+1` and `right` at the end. We calculate the sum of the four elements.

- If the sum equals the target, we add the quadruplet to the result and skip duplicates for `left` and `right` by moving them past equal elements.
- If the sum is less than the target, we increment `left`.
- If the sum is greater, we decrement `right`.

This ensures we find all unique quadruplets without duplicates.

## Time Complexity
**O(n^3)**, where n is the length of the array, due to the three nested loops (two for fixing elements, one for two pointers).

## Space Complexity
**O(1)** additional space, excluding the result list. Sorting is done in place.
