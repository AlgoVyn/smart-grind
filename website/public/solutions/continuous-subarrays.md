# Continuous Subarrays

## Problem Description
You are given a 0-indexed integer array nums. A subarray of nums is called continuous if:

Let i, i + 1, ..., j be the indices in the subarray. Then, for each pair of indices i <= i1, i2 <= j, 0 <= |nums[i1] - nums[i2]| <= 2.

Return the total number of continuous subarrays.
A subarray is a contiguous non-empty sequence of elements within an array.
 
Example 1:

Input: nums = [5,4,2,4]
Output: 8
Explanation: 
Continuous subarray of size 1: [5], [4], [2], [4].
Continuous subarray of size 2: [5,4], [4,2], [2,4].
Continuous subarray of size 3: [4,2,4].
There are no subarrys of size 4.
Total continuous subarrays = 4 + 3 + 1 = 8.
It can be shown that there are no more continuous subarrays.

 
Example 2:

Input: nums = [1,2,3]
Output: 6
Explanation: 
Continuous subarray of size 1: [1], [2], [3].
Continuous subarray of size 2: [1,2], [2,3].
Continuous subarray of size 3: [1,2,3].
Total continuous subarrays = 3 + 2 + 1 = 6.

 
Constraints:

1 <= nums.length <= 105
1 <= nums[i] <= 109
## Solution

```python
from typing import List
from collections import deque

class Solution:
    def continuousSubarrays(self, nums: List[int]) -> int:
        n = len(nums)
        left = 0
        result = 0
        max_deque = deque()
        min_deque = deque()
        
        for right in range(n):
            # Maintain max_deque: decreasing order
            while max_deque and nums[max_deque[-1]] <= nums[right]:
                max_deque.pop()
            max_deque.append(right)
            
            # Maintain min_deque: increasing order
            while min_deque and nums[min_deque[-1]] >= nums[right]:
                min_deque.pop()
            min_deque.append(right)
            
            # Shrink window if max - min > 2
            while nums[max_deque[0]] - nums[min_deque[0]] > 2:
                left += 1
                # Remove elements out of window
                if max_deque[0] < left:
                    max_deque.popleft()
                if min_deque[0] < left:
                    min_deque.popleft()
            
            # All subarrays ending at right from left to right are valid
            result += right - left + 1
        
        return result
```

## Explanation
To count the number of continuous subarrays where the difference between the maximum and minimum elements is at most 2, we use a sliding window approach with two deques to maintain the maximum and minimum in the current window.

We initialize left = 0, and for each right from 0 to n-1:
- Add right to the max_deque (maintaining decreasing order by popping smaller elements).
- Add right to the min_deque (maintaining increasing order by popping larger elements).
- While the difference between the front of max_deque and min_deque > 2, move left right, and remove outdated indices from deques.
- Add the number of valid subarrays ending at right (right - left + 1) to the result.

This ensures each subarray is counted exactly once when it ends. Time complexity: O(n), as each element is added and removed from deques at most once. Space complexity: O(n) for the deques.
