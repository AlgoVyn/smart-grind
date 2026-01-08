# Jump Game

## Problem Description
[Link to problem](https://leetcode.com/problems/jump-game/)

You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.
Return true if you can reach the last index, or false otherwise.
 
Example 1:

Input: nums = [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.

Example 2:

Input: nums = [3,2,1,0,4]
Output: false
Explanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.

 
Constraints:

1 <= nums.length <= 104
0 <= nums[i] <= 105


## Solution

```python
from typing import List

class Solution:
    def canJump(self, nums: List[int]) -> bool:
        if not nums:
            return True
        farthest = 0
        current_end = 0
        for i in range(len(nums) - 1):
            farthest = max(farthest, i + nums[i])
            if i == current_end:
                current_end = farthest
                if current_end >= len(nums) - 1:
                    return True
        return current_end >= len(nums) - 1
```

## Explanation
This problem can be solved using a greedy approach. We maintain two variables: `farthest`, which tracks the farthest index we can reach, and `current_end`, which is the end of the current range we can reach.

We iterate through the array up to the second last element. At each index `i`, we update `farthest` to the maximum of its current value and `i + nums[i]`. If `i` equals `current_end`, we update `current_end` to `farthest`. If `current_end` reaches or exceeds the last index, we can return true early.

After the loop, we check if `current_end` is at least the last index.

Time complexity: O(n), where n is the length of nums, as we make a single pass through the array.
Space complexity: O(1), using only a constant amount of extra space.
