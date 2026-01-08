# Single Number Ii

## Problem Description
[Link to problem](https://leetcode.com/problems/single-number-ii/)

Given an integer array nums where every element appears three times except for one, which appears exactly once. Find the single element and return it.
You must implement a solution with a linear runtime complexity and use only constant extra space.
 
Example 1:
Input: nums = [2,2,3,2]
Output: 3
Example 2:
Input: nums = [0,1,0,1,0,1,99]
Output: 99

 
Constraints:

1 <= nums.length <= 3 * 104
-231 <= nums[i] <= 231 - 1
Each element in nums appears exactly three times except for one element which appears once.


## Solution

```python
from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        result = 0
        for i in range(32):
            count = 0
            for num in nums:
                if num & (1 << i):
                    count += 1
            if count % 3 == 1:
                result |= (1 << i)
        # Handle negative numbers
        if result >= 2**31:
            result -= 2**32
        return result
```

## Explanation
Since every number appears three times except one, use bit manipulation. For each of the 32 bits, count how many numbers have that bit set. If the count modulo 3 is 1, the single number has that bit set. Construct the result by setting those bits. Adjust for two's complement negative numbers.

**Time Complexity:** O(32 * n), effectively O(n).

**Space Complexity:** O(1).
