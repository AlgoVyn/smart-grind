# Maximum Frequency Of An Element After Performing Operations Ii

## Problem Description
You are given an integer array nums and two integers k and numOperations.
You must perform an operation numOperations times on nums, where in each operation you:

Select an index i that was not selected in any previous operations.
Add an integer in the range [-k, k] to nums[i].

Return the maximum possible frequency of any element in nums after performing the operations.
 
Example 1:

Input: nums = [1,4,5], k = 1, numOperations = 2
Output: 2
Explanation:
We can achieve a maximum frequency of two by:

Adding 0 to nums[1], after which nums becomes [1, 4, 5].
Adding -1 to nums[2], after which nums becomes [1, 4, 4].
Example 2:

Input: nums = [5,11,20,20], k = 5, numOperations = 1
Output: 2
Explanation:
We can achieve a maximum frequency of two by:

Adding 0 to nums[1].
 
Constraints:

1 <= nums.length <= 105
1 <= nums[i] <= 109
0 <= k <= 109
0 <= numOperations <= nums.length
## Solution

```python
from typing import List

class Solution:
    def maxFrequency(self, nums: List[int], k: int, numOperations: int) -> int:
        nums.sort()
        left = 0
        max_f = 0
        n = len(nums)
        for right in range(n):
            while nums[right] - nums[left] > 2 * k:
                left += 1
            f = right - left + 1
            max_f = max(max_f, f)
        return min(max_f, n - numOperations)
```

## Explanation
Sort the array. Use a sliding window to find the maximum number of elements that can be made equal (their range <= 2*k). The maximum frequency is the minimum of that and n - numOperations, since we need to perform operations on the remaining elements.

Time complexity: O(n log n) for sorting, O(n) for sliding window.

Space complexity: O(1) extra space.
