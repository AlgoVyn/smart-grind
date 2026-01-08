# Rotate Array

## Problem Description
[Link to problem](https://leetcode.com/problems/rotate-array/)

Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.
 
Example 1:

Input: nums = [1,2,3,4,5,6,7], k = 3
Output: [5,6,7,1,2,3,4]
Explanation:
rotate 1 steps to the right: [7,1,2,3,4,5,6]
rotate 2 steps to the right: [6,7,1,2,3,4,5]
rotate 3 steps to the right: [5,6,7,1,2,3,4]

Example 2:

Input: nums = [-1,-100,3,99], k = 2
Output: [3,99,-1,-100]
Explanation: 
rotate 1 steps to the right: [99,-1,-100,3]
rotate 2 steps to the right: [3,99,-1,-100]

 
Constraints:

1 <= nums.length <= 105
-231 <= nums[i] <= 231 - 1
0 <= k <= 105

 
Follow up:

Try to come up with as many solutions as you can. There are at least three different ways to solve this problem.
Could you do it in-place with O(1) extra space?


## Solution

```python
from typing import List

class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        n = len(nums)
        k %= n
        self.reverse(nums, 0, n-1)
        self.reverse(nums, 0, k-1)
        self.reverse(nums, k, n-1)
    
    def reverse(self, nums, start, end):
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
```

## Explanation

This problem requires rotating an array to the right by k steps in-place.

### Approach

Reverse the entire array, then reverse the first k elements, then the rest.

### Step-by-Step Explanation

1. **Modulo**: k %= n to handle large k.

2. **Reverse All**: Reverse 0 to n-1.

3. **Reverse First K**: Reverse 0 to k-1.

4. **Reverse Rest**: Reverse k to n-1.

### Time Complexity

- O(n), for reversals.

### Space Complexity

- O(1), in-place.
