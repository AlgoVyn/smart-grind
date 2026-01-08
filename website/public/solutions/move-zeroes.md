# Move Zeroes

## Problem Statement

Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.

Note that you must do this in-place without making a copy of the array.

 
Example 1:
Input: nums = [0,1,0,3,12]
Output: [1,3,12,0,0]
Example 2:
Input: nums = [0]
Output: [0]

 
Constraints:

	1 <= nums.length <= 104
	-231 <= nums[i] <= 231 - 1

 
Follow up: Could you minimize the total number of operations done?

[Link to problem](https://leetcode.com/problems/move-zeroes/)

Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.
Note that you must do this in-place without making a copy of the array.
 
Example 1:
Input: nums = [0,1,0,3,12]
Output: [1,3,12,0,0]
Example 2:
Input: nums = [0]
Output: [0]

 
Constraints:

1 <= nums.length <= 104
-231 <= nums[i] <= 231 - 1

 
Follow up: Could you minimize the total number of operations done?

## Solution

```python
class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        last_non_zero = 0
        for i in range(len(nums)):
            if nums[i] != 0:
                nums[last_non_zero], nums[i] = nums[i], nums[last_non_zero]
                last_non_zero += 1
```

## Explanation
We use a pointer to track the position for the next non-zero element. As we iterate, we swap non-zero elements to the front. This moves all zeros to the end in O(n) time and O(1) space.
