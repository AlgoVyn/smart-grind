# Sliding Window Maximum

## Problem Description
You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.
Return the max sliding window.
 
Example 1:

Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
Explanation: 
Window position                Max
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7

Example 2:

Input: nums = [1], k = 1
Output: [1]

 
Constraints:

1 <= nums.length <= 105
-104 <= nums[i] <= 104
1 <= k <= nums.length
## Solution

```python
from typing import List
from collections import deque

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        if not nums:
            return []
        dq = deque()
        result = []
        for i in range(len(nums)):
            # Remove elements out of window
            while dq and dq[0] < i - k + 1:
                dq.popleft()
            # Remove smaller elements
            while dq and nums[dq[-1]] < nums[i]:
                dq.pop()
            dq.append(i)
            # Add to result if window is full
            if i >= k - 1:
                result.append(nums[dq[0]])
        return result
```

## Explanation
Use a deque to maintain indices of elements in decreasing order. For each i, remove indices out of the current window, remove indices with smaller values than current, add current index. The front of deque is the max for the window when full.

**Time Complexity:** O(n), as each element is added and removed at most once.

**Space Complexity:** O(k), for the deque.
