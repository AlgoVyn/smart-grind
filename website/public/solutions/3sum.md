# 3Sum

## Problem Description

Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.

Notice that the solution set must not contain duplicate triplets.

---

## Examples

**Example 1:**
```python
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
```

**Example 2:**
```python
Input: nums = []
Output: []
```

**Example 3:**
```python
Input: nums = [0]
Output: []
```

---

## Constraints

- `0 <= nums.length <= 3000`
- `-10^5 <= nums[i] <= 10^5`

---

## Solution

```python
from typing import List

class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        result = []
        n = len(nums)
        for i in range(n - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            left, right = i + 1, n - 1
            while left < right:
                total = nums[i] + nums[left] + nums[right]
                if total < 0:
                    left += 1
                elif total > 0:
                    right -= 1
                else:
                    result.append([nums[i], nums[left], nums[right]])
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    left += 1
                    right -= 1
        return result
```

---

## Explanation

To solve the 3Sum problem, we need to find all unique triplets in the array that sum to zero. The optimal approach is to sort the array first, which allows us to use a two-pointer technique to efficiently find the triplets while avoiding duplicates.

After sorting, we iterate through each element at index `i`. To skip duplicates for the first element of the triplet, we check if `nums[i]` is the same as `nums[i-1]`.

For each `i`, we initialize two pointers: `left` at `i+1` and `right` at the end of the array. We calculate the sum of `nums[i]`, `nums[left]`, and `nums[right]`.

- If the sum is less than zero, we increment `left` to increase the sum.
- If the sum is greater than zero, we decrement `right` to decrease the sum.
- If the sum is zero, we add the triplet to the result. To skip duplicates for the second and third elements, we move `left` past any equal elements and `right` past any equal elements, then increment `left` and decrement `right`.

This ensures all triplets are unique and we don't miss any.

---

## Time Complexity
**O(n^2)**, where n is the length of the array, due to the sorting (O(n log n)) and the nested loops (O(n^2)).

---

## Space Complexity
**O(1)** additional space, excluding the space for the result list. The sorting is done in place.
