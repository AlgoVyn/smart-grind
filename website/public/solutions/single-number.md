# Single Number

## Problem Description
[Link to problem](https://leetcode.com/problems/single-number/)

Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.
You must implement a solution with a linear runtime complexity and use only constant extra space.
 
Example 1:

Input: nums = [2,2,1]
Output: 1

Example 2:

Input: nums = [4,1,2,1,2]
Output: 4

Example 3:

Input: nums = [1]
Output: 1

 
Constraints:

1 <= nums.length <= 3 * 104
-3 * 104 <= nums[i] <= 3 * 104
Each element in the array appears twice except for one element which appears only once.


## Solution

```python
from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        result = 0
        for num in nums:
            result ^= num
        return result
```

## Explanation

This problem finds the single number that appears once while others appear twice, using bitwise XOR.

### Step-by-Step Approach:

1. **XOR Property**: XOR of two same numbers is 0, XOR with 0 is the number itself.

2. **Iterate and XOR**: Start with result = 0, XOR each number in the array.

3. **Result**: The final result is the single number.

### Time Complexity:
- O(n), linear pass through the array.

### Space Complexity:
- O(1), constant extra space.
