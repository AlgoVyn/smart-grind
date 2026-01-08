# Minimum Size Subarray Sum

## Problem Description
[Link to problem](https://leetcode.com/problems/minimum-size-subarray-sum/)

Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target. If there is no such subarray, return 0 instead.
 
Example 1:

Input: target = 7, nums = [2,3,1,2,4,3]
Output: 2
Explanation: The subarray [4,3] has the minimal length under the problem constraint.

Example 2:

Input: target = 4, nums = [1,4,4]
Output: 1

Example 3:

Input: target = 11, nums = [1,1,1,1,1,1,1,1]
Output: 0

 
Constraints:

1 <= target <= 109
1 <= nums.length <= 105
1 <= nums[i] <= 104

 
Follow up: If you have figured out the O(n) solution, try coding another solution of which the time complexity is O(n log(n)).


## Solution

```python
from typing import List

class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        n = len(nums)
        min_length = float('inf')
        current_sum = 0
        left = 0
        
        for right in range(n):
            current_sum += nums[right]
            while current_sum >= target and left <= right:
                min_length = min(min_length, right - left + 1)
                current_sum -= nums[left]
                left += 1
        
        return min_length if min_length != float('inf') else 0
```

## Explanation
This problem requires finding the minimal length of a contiguous subarray with sum at least target.

### Step-by-Step Approach:
1. **Sliding Window**: Use two pointers, left and right, to maintain a window.

2. **Expand Right**: Add nums[right] to current_sum.

3. **Contract Left**: While current_sum >= target, update min_length, and move left to shrink the window.

4. **Return**: The minimum length found, or 0 if none.

### Time Complexity:
- O(n), where n is the array length, as each element is added and removed at most once.

### Space Complexity:
- O(1), using only a few variables.
