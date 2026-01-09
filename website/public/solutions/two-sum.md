# Two Sum

## Problem Description

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.

**Example 1:**

Input: `nums = [2,7,11,15]`, `target = 9`
Output: `[0,1]`

Explanation: Because `nums[0] + nums[1] == 9`, we return `[0, 1]`.

**Example 2:**

Input: `nums = [3,2,4]`, `target = 6`
Output: `[1,2]`

**Example 3:**

Input: `nums = [3,3]`, `target = 6`
Output: `[0,1]`

---

## Constraints

- `2 <= nums.length <= 10^4`
- `-10^9 <= nums[i] <= 10^9`
- `-10^9 <= target <= 10^9`
- Only one valid answer exists.

**Follow-up:** Can you come up with an algorithm that is less than O(n²) time complexity?

---

## Solution

```python
from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []
```

---

## Explanation

Use a hashmap to store numbers and their indices as we iterate. For each number, compute the complement (`target - num`). If complement is in the map, return the indices. Otherwise, add the current number and index to the map. This ensures O(1) lookups and O(n) time overall.

**Time Complexity:** O(n), as we traverse the array once.

**Space Complexity:** O(n), for the hashmap in the worst case.
