# Find Peak Element

## Problem Description
A peak element is an element that is strictly greater than its neighbors.
Given a 0-indexed integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.
You may imagine that nums[-1] = nums[n] = -∞. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array.
You must write an algorithm that runs in O(log n) time.
 
Example 1:

Input: nums = [1,2,3,1]
Output: 2
Explanation: 3 is a peak element and your function should return the index number 2.
Example 2:

Input: nums = [1,2,1,3,5,6,4]
Output: 5
Explanation: Your function can return either index number 1 where the peak element is 2, or index number 5 where the peak element is 6.
 
Constraints:

1 <= nums.length <= 1000
-231 <= nums[i] <= 231 - 1
nums[i] != nums[i + 1] for all valid i.
## Solution

```python
from typing import List

class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        left, right = 0, len(nums) - 1
        while left < right:
            mid = (left + right) // 2
            if nums[mid] < nums[mid + 1]:
                left = mid + 1
            else:
                right = mid
        return left
```

## Explanation

Since nums[i] != nums[i+1] and nums[-1] = nums[n] = -∞, there is always a peak. We use binary search to find it.

1. Initialize left = 0, right = len(nums) - 1.

2. While left < right:
   - mid = (left + right) // 2
   - If nums[mid] < nums[mid + 1], the peak is in the right half, set left = mid + 1
   - Else, the peak is in the left half including mid, set right = mid

3. Return left, which is the peak index.

This works because the array is strictly increasing or decreasing in segments, and binary search converges to a peak.

**Time Complexity:** O(log n)

**Space Complexity:** O(1)
