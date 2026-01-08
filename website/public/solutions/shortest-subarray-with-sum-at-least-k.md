# Shortest Subarray With Sum At Least K

## Problem Description
[Link to problem](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/)

Given an integer array nums and an integer k, return the length of the shortest non-empty subarray of nums with a sum of at least k. If there is no such subarray, return -1.
A subarray is a contiguous part of an array.
 
Example 1:
Input: nums = [1], k = 1
Output: 1
Example 2:
Input: nums = [1,2], k = 4
Output: -1
Example 3:
Input: nums = [2,-1,2], k = 3
Output: 3

 
Constraints:

1 <= nums.length <= 105
-105 <= nums[i] <= 105
1 <= k <= 109


## Solution

```python
from typing import List
from collections import deque

class Solution:
    def shortestSubarray(self, nums: List[int], k: int) -> int:
        n = len(nums)
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] + nums[i]
        
        dq = deque()
        min_len = float('inf')
        for j in range(n + 1):
            while dq and prefix[dq[-1]] >= prefix[j]:
                dq.pop()
            while dq and prefix[j] - prefix[dq[0]] >= k:
                min_len = min(min_len, j - dq[0])
                dq.popleft()
            dq.append(j)
        
        return min_len if min_len != float('inf') else -1
```

## Explanation
This problem requires finding the shortest subarray with sum at least k, handling negative numbers. Use prefix sums to compute cumulative sums. Maintain a deque of indices with strictly increasing prefix sums. For each position j, remove indices from the back where prefix is not increasing. Then, check the front of the deque for subarrays ending at j with sum >= k, updating the minimum length. Finally, add j to the deque.

**Time Complexity:** O(n), as each index is added and removed from the deque at most once.

**Space Complexity:** O(n), for the prefix array and deque.
