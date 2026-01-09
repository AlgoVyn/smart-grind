# 3sum Closest

## Problem Description

Given an integer array nums of length n and an integer target, find three integers at distinct indices in nums such that the sum is closest to target.

Return the sum of the three integers.

You may assume that each input would have exactly one solution.

---

## Examples

**Example 1:**
**Input:**
```python
nums = [-1,2,1,-4], target = 1
```python
**Output:**
```python
2
```python
**Explanation:** The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).

**Example 2:**
**Input:**
```python
nums = [0,0,0], target = 1
```python
**Output:**
```python
0
```python
**Explanation:** The sum that is closest to the target is 0. (0 + 0 + 0 = 0).

---

## Constraints
- 3 <= nums.length <= 500
- -1000 <= nums[i] <= 1000
- -104 <= target <= 104

---

## Solution

```python
from typing import List

class Solution:
    def threeSumClosest(self, nums: List[int], target: int) -> int:
        nums.sort()
        n = len(nums)
        closest = nums[0] + nums[1] + nums[2]
        for i in range(n - 2):
            left, right = i + 1, n - 1
            while left < right:
                current_sum = nums[i] + nums[left] + nums[right]
                if abs(current_sum - target) < abs(closest - target):
                    closest = current_sum
                if current_sum < target:
                    left += 1
                elif current_sum > target:
                    right -= 1
                else:
                    return current_sum  # exact match
        return closest
```

---

## Explanation
To solve the 3Sum Closest problem, we sort the input array first. This allows us to use a two-pointer technique efficiently.

We initialize the closest sum to the sum of the first three elements. Then, for each element at index i, we set two pointers: left at i+1 and right at the end of the array.

In the inner loop, we calculate the current sum of nums[i], nums[left], and nums[right]. If the absolute difference between this sum and the target is smaller than the current closest difference, we update closest to this sum.

If the current sum is less than the target, we move the left pointer to the right to increase the sum. If it's greater, we move the right pointer to the left to decrease the sum. If it's equal, we return it immediately as it's the closest possible.

This approach ensures we find the sum closest to the target.

---

## Time Complexity
**O(n^2)**, where n is the length of the array, due to the nested loops (one for i, one for the two pointers).

---

## Space Complexity
**O(1)** additional space, excluding the input array, since we sort in place.
