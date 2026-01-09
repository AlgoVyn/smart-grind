# Minimum Operations To Reduce X To Zero

## Problem Description
You are given an integer array nums and an integer x. In one operation, you can either remove the leftmost or the rightmost element from the array nums and subtract its value from x. Note that this modifies the array for future operations.
Return the minimum number of operations to reduce x to exactly 0 if it is possible, otherwise, return -1.
 
Example 1:

Input: nums = [1,1,4,2,3], x = 5
Output: 2
Explanation: The optimal solution is to remove the last two elements to reduce x to zero.

Example 2:

Input: nums = [5,6,7,8,9], x = 4
Output: -1

Example 3:

Input: nums = [3,2,20,1,1,3], x = 10
Output: 5
Explanation: The optimal solution is to remove the last three elements and the first two elements (5 operations in total) to reduce x to zero.

 
Constraints:

1 <= nums.length <= 105
1 <= nums[i] <= 104
1 <= x <= 109
## Solution

```python
from typing import List

class Solution:
    def minOperations(self, nums: List[int], x: int) -> int:
        total = sum(nums)
        if total < x:
            return -1
        target = total - x
        prefix = {0: -1}
        current = 0
        max_len = -1
        for i, num in enumerate(nums):
            current += num
            if current - target in prefix:
                max_len = max(max_len, i - prefix[current - target])
            if current not in prefix:
                prefix[current] = i
        if max_len == -1:
            return -1
        return len(nums) - max_len
```

## Explanation
This problem requires finding the minimum operations to reduce x to zero by removing elements from the ends of the array. Each removal subtracts the element's value from x.

The key insight is that the remaining elements form a contiguous subarray, and their sum must equal the total sum minus x. We need to maximize the length of this subarray to minimize removals.

Compute the total sum S of the array. The target sum for the subarray is S - x. If S < x, return -1.

Use a hashmap to store prefix sums and their indices. Iterate through the array, compute current prefix sum, and check if prefix - target exists in the map. If so, update the maximum length.

The minimum operations is n - max_length if max_length > 0, else -1.

**Time Complexity:** O(n), where n is the array length, due to a single pass with hashmap operations.
**Space Complexity:** O(n), for the hashmap storing prefix sums.
