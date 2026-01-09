# Minimum Number Of Removals To Make Mountain Array

## Problem Description
You may recall that an array arr is a mountain array if and only if:

arr.length >= 3
There exists some index i (0-indexed) with 0 < i < arr.length - 1 such that:
	
arr[0] < arr[1] < ... < arr[i - 1] < arr[i]
arr[i] > arr[i + 1] > ... > arr[arr.length - 1]

Given an integer array nums​​​, return the minimum number of elements to remove to make nums​​​ a mountain array.
 
Example 1:

Input: nums = [1,3,1]
Output: 0
Explanation: The array itself is a mountain array so we do not need to remove any elements.

Example 2:

Input: nums = [2,1,1,5,6,2,3,1]
Output: 3
Explanation: One solution is to remove the elements at indices 0, 1, and 5, making the array nums = [1,5,6,3,1].

 
Constraints:

3 <= nums.length <= 1000
1 <= nums[i] <= 109
It is guaranteed that you can make a mountain array out of nums.
## Solution

```python
from typing import List

class Solution:
    def minimumMountainRemovals(self, nums: List[int]) -> int:
        n = len(nums)
        left = [1] * n
        for i in range(1, n):
            for j in range(i):
                if nums[j] < nums[i]:
                    left[i] = max(left[i], left[j] + 1)
        right = [1] * n
        for i in range(n - 2, -1, -1):
            for j in range(i + 1, n):
                if nums[j] < nums[i]:
                    right[i] = max(right[i], right[j] + 1)
        max_len = 0
        for i in range(1, n - 1):
            if left[i] > 1 and right[i] > 1:
                max_len = max(max_len, left[i] + right[i] - 1)
        return n - max_len
```

## Explanation
To solve this problem, we need to find the minimum number of elements to remove from the array to make it a mountain array. A mountain array has a peak element where the array strictly increases to the peak and then strictly decreases after it.

The approach uses dynamic programming to compute the longest possible mountain subsequence. We calculate two arrays:
- `left[i]`: the length of the longest increasing subsequence ending at index `i`.
- `right[i]`: the length of the longest decreasing subsequence starting at index `i`.

For each possible peak index `i` (where `0 < i < n-1`), the length of the mountain array with peak at `i` is `left[i] + right[i] - 1` (subtracting 1 because the peak is counted twice). We take the maximum of these lengths over all valid peaks.

The minimum removals is then `n - max_mountain_length`.

**Time Complexity:** O(n^2), where n is the length of the array, due to the nested loops for computing the DP arrays.
**Space Complexity:** O(n), for storing the `left` and `right` arrays.
