# Maximum Good Subarray Sum

## Problem Description
You are given an array nums of length n and a positive integer k.
A subarray of nums is called good if the absolute difference between its first and last element is exactly k, in other words, the subarray nums[i..j] is good if |nums[i] - nums[j]| == k.
Return the maximum sum of a good subarray of nums. If there are no good subarrays, return 0.
 
Example 1:

Input: nums = [1,2,3,4,5,6], k = 1
Output: 11
Explanation: The absolute difference between the first and last element must be 1 for a good subarray. All the good subarrays are: [1,2], [2,3], [3,4], [4,5], and [5,6]. The maximum subarray sum is 11 for the subarray [5,6].

Example 2:

Input: nums = [-1,3,2,4,5], k = 3
Output: 11
Explanation: The absolute difference between the first and last element must be 3 for a good subarray. All the good subarrays are: [-1,3,2], and [2,4,5]. The maximum subarray sum is 11 for the subarray [2,4,5].

Example 3:

Input: nums = [-1,-2,-3,-4], k = 2
Output: -6
Explanation: The absolute difference between the first and last element must be 2 for a good subarray. All the good subarrays are: [-1,-2,-3], and [-2,-3,-4]. The maximum subarray sum is -6 for the subarray [-1,-2,-3].

 
Constraints:

2 <= nums.length <= 105
-109 <= nums[i] <= 109
1 <= k <= 109
## Solution

```python
from collections import defaultdict
from typing import List

class Solution:
    def maximumSubarraySum(self, nums: List[int], k: int) -> int:
        n = len(nums)
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] + nums[i]
        max_sum = float('-inf')
        val_to_min_prefix = defaultdict(lambda: float('inf'))
        for j in range(n):
            # Check for start with nums[j] - k
            if nums[j] - k in val_to_min_prefix and val_to_min_prefix[nums[j] - k] != float('inf'):
                current_sum = prefix[j + 1] - val_to_min_prefix[nums[j] - k]
                max_sum = max(max_sum, current_sum)
            # Check for start with nums[j] + k
            if nums[j] + k in val_to_min_prefix and val_to_min_prefix[nums[j] + k] != float('inf'):
                current_sum = prefix[j + 1] - val_to_min_prefix[nums[j] + k]
                max_sum = max(max_sum, current_sum)
            # Update for future
            val_to_min_prefix[nums[j]] = min(val_to_min_prefix[nums[j]], prefix[j + 1])
        return max_sum if max_sum != float('-inf') else 0
```

## Explanation

This problem requires finding the maximum sum of a subarray where the absolute difference between the first and last elements is exactly k.

### Approach

Use prefix sums to compute subarray sums quickly. Maintain a map from value to the minimum prefix sum seen so far for that value. For each end index j, check if there's a start value that differs by k, and compute the sum using the min prefix for that start value.

### Step-by-Step Explanation

1. **Prefix Sums**: Compute prefix sums for quick subarray sum calculation.

2. **Map Tracking**: Use a defaultdict to track the minimum prefix sum for each value encountered.

3. **Iteration**:
   - For each j, check if nums[j] - k or nums[j] + k has been seen, compute sum = prefix[j+1] - min_prefix[start_val].
   - Update max_sum.
   - Update the min_prefix for nums[j].

4. **Return**: max_sum or 0 if none.

### Time Complexity

- O(n), as each operation is O(1) amortized.

### Space Complexity

- O(n), for prefix and map.
