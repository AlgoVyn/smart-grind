# Find All Duplicates In An Array

## Problem Description
[Link to problem](https://leetcode.com/problems/find-all-duplicates-in-an-array/)

Given an integer array nums of length n where all the integers of nums are in the range [1, n] and each integer appears at most twice, return an array of all the integers that appears twice.
You must write an algorithm that runs in O(n) time and uses only constant auxiliary space, excluding the space needed to store the output
 
Example 1:
Input: nums = [4,3,2,7,8,2,3,1]
Output: [2,3]
Example 2:
Input: nums = [1,1,2]
Output: [1]
Example 3:
Input: nums = [1]
Output: []

 
Constraints:

n == nums.length
1 <= n <= 105
1 <= nums[i] <= n
Each element in nums appears once or twice.


## Solution

```python
from typing import List

class Solution:
    def findDuplicates(self, nums: List[int]) -> List[int]:
        result = []
        for num in nums:
            index = abs(num) - 1
            if nums[index] < 0:
                result.append(abs(num))
            else:
                nums[index] = -nums[index]
        return result
```

## Explanation
Since the array contains numbers from 1 to n, we can use the array indices to mark visited elements. We iterate through the array, using the absolute value of each number as an index to mark it as visited by negating the value at that index. If we encounter a number whose corresponding index is already negative, it's a duplicate.

### Step-by-Step Explanation:
1. **Initialize result list**: Create an empty list to store duplicates.

2. **Iterate through the array**: For each number in nums:
   - Take the absolute value to get the index (since numbers are 1-based, index = abs(num) - 1).
   - If nums[index] is negative, it means we've seen this number before, so add abs(num) to the result.
   - Otherwise, negate nums[index] to mark it as visited.

3. **Return the result**: The list contains all numbers that appear twice.

### Time Complexity:
- O(n), as we traverse the array once.

### Space Complexity:
- O(1) auxiliary space, excluding the output list.
