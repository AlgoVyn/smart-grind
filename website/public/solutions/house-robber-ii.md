# House Robber Ii

## Problem Description
You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and it will automatically contact the police if two adjacent houses were broken into on the same night.
Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.
 
Example 1:

Input: nums = [2,3,2]
Output: 3
Explanation: You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent houses.

Example 2:

Input: nums = [1,2,3,1]
Output: 4
Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
Total amount you can rob = 1 + 3 = 4.

Example 3:

Input: nums = [1,2,3]
Output: 3

 
Constraints:

1 <= nums.length <= 100
0 <= nums[i] <= 1000
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

Since circular, can't rob first and last.

Compute max for houses 0 to n-2 (excluding last), and 1 to n-1 (excluding first), take the maximum.

Use DP for linear robber.

**Time Complexity:** O(n), for two linear passes.

**Space Complexity:** O(1), constant space.
