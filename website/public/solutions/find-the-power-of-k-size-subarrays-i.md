# Find The Power Of K Size Subarrays I

## Problem Description
[Link to problem](https://leetcode.com/problems/find-the-power-of-k-size-subarrays-i/)

You are given an array of integers nums of length n and a positive integer k.
The power of an array is defined as:

Its maximum element if all of its elements are consecutive and sorted in ascending order.
-1 otherwise.

You need to find the power of all subarrays of nums of size k.
Return an integer array results of size n - k + 1, where results[i] is the power of nums[i..(i + k - 1)].
 
Example 1:

Input: nums = [1,2,3,4,3,2,5], k = 3
Output: [3,4,-1,-1,-1]
Explanation:
There are 5 subarrays of nums of size 3:

[1, 2, 3] with the maximum element 3.
[2, 3, 4] with the maximum element 4.
[3, 4, 3] whose elements are not consecutive.
[4, 3, 2] whose elements are not sorted.
[3, 2, 5] whose elements are not consecutive.


Example 2:

Input: nums = [2,2,2,2,2], k = 4
Output: [-1,-1]

Example 3:

Input: nums = [3,2,3,2,3,2], k = 2
Output: [-1,3,-1,3,-1]

 
Constraints:

1 <= n == nums.length <= 500
1 <= nums[i] <= 105
1 <= k <= n


## Solution

```python
from typing import List

class Solution:
    def resultsArray(self, nums: List[int], k: int) -> List[int]:
        res = []
        for i in range(len(nums) - k + 1):
            sub = nums[i:i + k]
            if all(sub[j] + 1 == sub[j + 1] for j in range(k - 1)):
                res.append(max(sub))
            else:
                res.append(-1)
        return res
```

## Explanation

For each subarray of size k, check if it consists of consecutive ascending numbers (each element is one more than the previous).

If yes, append the maximum element; else, append -1.

**Time Complexity:** O(n * k), since for each of n-k+1 subarrays, check k-1 conditions.

**Space Complexity:** O(1) extra space besides output.
