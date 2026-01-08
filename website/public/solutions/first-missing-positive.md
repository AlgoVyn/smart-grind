# First Missing Positive

## Problem Description
[Link to problem](https://leetcode.com/problems/first-missing-positive/)

Given an unsorted integer array nums. Return the smallest positive integer that is not present in nums.
You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.
 
Example 1:

Input: nums = [1,2,0]
Output: 3
Explanation: The numbers in the range [1,2] are all in the array.

Example 2:

Input: nums = [3,4,-1,1]
Output: 2
Explanation: 1 is in the array but 2 is missing.

Example 3:

Input: nums = [7,8,9,11,12]
Output: 1
Explanation: The smallest positive integer 1 is missing.

 
Constraints:

1 <= nums.length <= 105
-231 <= nums[i] <= 231 - 1


## Solution

```python
from typing import List

class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        n = len(nums)
        # Replace non-positive and out-of-range numbers with n+1
        for i in range(n):
            if nums[i] <= 0 or nums[i] > n:
                nums[i] = n + 1
        
        # Mark presence by negating
        for i in range(n):
            if abs(nums[i]) <= n:
                idx = abs(nums[i]) - 1
                if nums[idx] > 0:
                    nums[idx] = -nums[idx]
        
        # Find the first positive index
        for i in range(n):
            if nums[i] > 0:
                return i + 1
        return n + 1
```

## Explanation

Use the array as a hash table to mark presence of numbers from 1 to n.

First, replace invalid numbers with n+1.

Then, for each valid number, mark its index by negating nums[abs(num)-1].

Finally, the first index with positive value is the missing number.

**Time Complexity:** O(n)

**Space Complexity:** O(1)
