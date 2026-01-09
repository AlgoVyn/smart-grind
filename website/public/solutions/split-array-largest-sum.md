# Split Array Largest Sum

## Problem Description
Given an integer array nums and an integer k, split nums into k non-empty subarrays such that the largest sum of any subarray is minimized.
Return the minimized largest sum of the split.
A subarray is a contiguous part of the array.
 
Example 1:

Input: nums = [7,2,5,10,8], k = 2
Output: 18
Explanation: There are four ways to split nums into two subarrays.
The best way is to split it into [7,2,5] and [10,8], where the largest sum among the two subarrays is only 18.

Example 2:

Input: nums = [1,2,3,4,5], k = 2
Output: 9
Explanation: There are four ways to split nums into two subarrays.
The best way is to split it into [1,2,3] and [4,5], where the largest sum among the two subarrays is only 9.

 
Constraints:

1 <= nums.length <= 1000
0 <= nums[i] <= 106
1 <= k <= min(50, nums.length)
## Solution

```python
from typing import List

class Solution:
    def splitArray(self, nums: List[int], k: int) -> int:
        def can_split(mid: int) -> bool:
            count = 1
            current_sum = 0
            for num in nums:
                current_sum += num
                if current_sum > mid:
                    count += 1
                    current_sum = num
                    if count > k:
                        return False
            return True
        
        left = max(nums)
        right = sum(nums)
        while left < right:
            mid = (left + right) // 2
            if can_split(mid):
                right = mid
            else:
                left = mid + 1
        return left
```

## Explanation
Use binary search on the possible maximum subarray sum, from max(nums) to sum(nums). For each mid, check if we can split the array into at most k subarrays where each subarray sum <= mid, by greedily accumulating sums and starting new subarrays when exceeding mid.

**Time Complexity:** O(n log(sum(nums))), due to binary search and linear scan per check.

**Space Complexity:** O(1), excluding input.
