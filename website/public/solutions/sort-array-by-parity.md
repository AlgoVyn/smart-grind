# Sort Array By Parity

## Problem Statement

Given an integer array nums, move all the even integers at the beginning of the array followed by all the odd integers.

Return any array that satisfies this condition.

 
Example 1:

Input: nums = [3,1,2,4]
Output: [2,4,3,1]
Explanation: The outputs [4,2,3,1], [2,4,1,3], and [4,2,1,3] would also be accepted.

Example 2:

Input: nums = [0]
Output: [0]

 
Constraints:

	1 <= nums.length <= 5000
	0 <= nums[i] <= 5000

Given an integer array nums, move all the even integers at the beginning of the array followed by all the odd integers.
Return any array that satisfies this condition.
 
Example 1:

Input: nums = [3,1,2,4]
Output: [2,4,3,1]
Explanation: The outputs [4,2,3,1], [2,4,1,3], and [4,2,1,3] would also be accepted.

Example 2:

Input: nums = [0]
Output: [0]

 
Constraints:

1 <= nums.length <= 5000
0 <= nums[i] <= 5000

## Solution

```python
class Solution:
    def sortArrayByParity(self, nums: List[int]) -> List[int]:
        left, right = 0, len(nums) - 1
        while left < right:
            if nums[left] % 2 == 0:
                left += 1
            else:
                nums[left], nums[right] = nums[right], nums[left]
                right -= 1
        return nums
```

## Explanation
We use two pointers starting from the beginning and end of the array. We move the left pointer right if the element is even, and swap with the right pointer if odd, then move right left. This partitions the array into even and odd numbers in O(n) time and O(1) space.
