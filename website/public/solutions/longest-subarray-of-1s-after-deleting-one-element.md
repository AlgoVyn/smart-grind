# Longest Subarray Of 1s After Deleting One Element

## Problem Description
Given a binary array nums, you should delete one element from it.
Return the size of the longest non-empty subarray containing only 1's in the resulting array. Return 0 if there is no such subarray.
 
Example 1:

Input: nums = [1,1,0,1]
Output: 3
Explanation: After deleting the number in position 2, [1,1,1] contains 3 numbers with value of 1's.

Example 2:

Input: nums = [0,1,1,1,0,1,1,0,1]
Output: 5
Explanation: After deleting the number in position 4, [0,1,1,1,1,1,0,1] longest subarray with value of 1's is [1,1,1,1,1].

Example 3:

Input: nums = [1,1,1]
Output: 2
Explanation: You must delete one element.

 
Constraints:

1 <= nums.length <= 105
nums[i] is either 0 or 1.
## Solution

```python
from typing import List

class Solution:
    def longestSubarray(self, nums: List[int]) -> int:
        left = 0
        zero_count = 0
        max_result = 0
        for right in range(len(nums)):
            if nums[right] == 0:
                zero_count += 1
            while zero_count > 1:
                if nums[left] == 0:
                    zero_count -= 1
                left += 1
            current_len = right - left + 1
            if zero_count == 0:
                candidate = current_len - 1
            else:
                candidate = current_len if current_len > 1 else 0
            max_result = max(max_result, candidate)
        return max_result
```

## Explanation
We use a sliding window approach to find the maximum length of a subarray with at most one zero. For each possible window, we calculate the candidate length for the resulting array after deleting one element: if the window has no zeros, we must delete one 1, so the length is current_len - 1; if it has one zero, we can delete that zero, and if current_len > 1, the length is current_len, otherwise 0.

We maintain the maximum candidate length.

Time complexity: O(n), where n is the length of nums, as each element is visited at most twice.

Space complexity: O(1), using only a few variables.
