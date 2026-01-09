# Maximum Sum Circular Subarray

## Problem Description
Given a circular integer array nums of length n, return the maximum possible sum of a non-empty subarray of nums.
A circular array means the end of the array connects to the beginning of the array. Formally, the next element of nums[i] is nums[(i + 1) % n] and the previous element of nums[i] is nums[(i - 1 + n) % n].
A subarray may only include each element of the fixed buffer nums at most once. Formally, for a subarray nums[i], nums[i + 1], ..., nums[j], there does not exist i <= k1, k2 <= j with k1 % n == k2 % n.
 
Example 1:

Input: nums = [1,-2,3,-2]
Output: 3
Explanation: Subarray [3] has maximum sum 3.

Example 2:

Input: nums = [5,-3,5]
Output: 10
Explanation: Subarray [5,5] has maximum sum 5 + 5 = 10.

Example 3:

Input: nums = [-3,-2,-3]
Output: -2
Explanation: Subarray [-2] has maximum sum -2.

 
Constraints:

n == nums.length
1 <= n <= 3 * 104
-3 * 104 <= nums[i] <= 3 * 104
## Solution

```python
from typing import List

class Solution:
    def maxSubarraySumCircular(self, nums: List[int]) -> int:
        def kadane(arr):
            max_sum = float('-inf')
            current = 0
            for num in arr:
                current = max(num, current + num)
                max_sum = max(max_sum, current)
            return max_sum
        
        total = sum(nums)
        max_kadane = kadane(nums)
        min_kadane = kadane([-x for x in nums])
        max_wrap = total + min_kadane
        
        if max_wrap == 0:  # all elements are negative
            return max_kadane
        return max(max_kadane, max_wrap)
```

## Explanation

This problem finds the maximum subarray sum in a circular array, where the subarray can wrap around.

### Step-by-Step Approach:

1. **Kadane Function**: Helper to compute max subarray sum for linear array.

2. **Compute Linear Max**: max_kadane = kadane(nums)

3. **Compute Min Sum**: min_kadane = kadane of negated nums (equivalent to min subarray sum)

4. **Circular Max**: max_wrap = total_sum + min_kadane (sum excluding the min subarray)

5. **Handle All Negative**: If max_wrap == 0 (all negative), return max_kadane (the largest negative number)

6. **Return Max**: max(max_kadane, max_wrap)

### Time Complexity:
- O(n), single pass for Kadane and sum.

### Space Complexity:
- O(1), no extra space besides variables.
