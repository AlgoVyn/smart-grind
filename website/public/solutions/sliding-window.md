# Sliding Window

## Problem Description
[Link to problem](https://leetcode.com/problems/sliding-window/)

## Solution

```python
from typing import List

# Example: Maximum sum subarray of size k
class Solution:
    def maxSumSubarray(self, nums: List[int], k: int) -> int:
        if not nums or k > len(nums):
            return 0
        current_sum = sum(nums[:k])
        max_sum = current_sum
        for i in range(k, len(nums)):
            current_sum += nums[i] - nums[i - k]
            max_sum = max(max_sum, current_sum)
        return max_sum
```

## Explanation
The sliding window technique maintains a window of fixed size k and slides it over the array. Compute initial sum of first k elements. Then, for each subsequent element, add the new element and subtract the element leaving the window. Track the maximum sum.

**Time Complexity:** O(n), as we traverse the array once.

**Space Complexity:** O(1), excluding input.
