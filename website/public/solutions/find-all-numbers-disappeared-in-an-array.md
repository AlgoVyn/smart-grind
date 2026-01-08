# Find All Numbers Disappeared In An Array

## Problem Description
[Link to problem](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/)

Given an array nums of n integers where nums[i] is in the range [1, n], return an array of all the integers in the range [1, n] that do not appear in nums.
 
Example 1:
Input: nums = [4,3,2,7,8,2,3,1]
Output: [5,6]
Example 2:
Input: nums = [1,1]
Output: [2]

 
Constraints:

n == nums.length
1 <= n <= 105
1 <= nums[i] <= n

 
Follow up: Could you do it without extra space and in O(n) runtime? You may assume the returned list does not count as extra space.


## Solution

```python
from typing import List

class Solution:
    def findDisappearedNumbers(self, nums: List[int]) -> List[int]:
        for num in nums:
            index = abs(num) - 1
            if nums[index] > 0:
                nums[index] = -nums[index]
        
        result = []
        for i in range(len(nums)):
            if nums[i] > 0:
                result.append(i + 1)
        
        return result
```

## Explanation
We use the array itself to mark the presence of numbers. Since numbers are in [1, n], we can use the indices to track which numbers have appeared by negating the values at the corresponding indices.

### Step-by-Step Explanation:
1. **Mark presence**: Iterate through the array. For each number num, compute index = abs(num) - 1, and negate nums[index] if it's positive.

2. **Collect missing numbers**: Iterate through the array again. For each index i, if nums[i] is positive, then i+1 is missing, add it to the result.

3. **Return the result**: The list of missing numbers.

### Time Complexity:
- O(n), as we traverse the array twice.

### Space Complexity:
- O(1) auxiliary space, excluding the output list.
