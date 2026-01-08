# Combination Sum Iv

## Problem Description
[Link to problem](https://leetcode.com/problems/combination-sum-iv/)

Given an array of distinct integers nums and a target integer target, return the number of possible combinations that add up to target.
The test cases are generated so that the answer can fit in a 32-bit integer.
 
Example 1:

Input: nums = [1,2,3], target = 4
Output: 7
Explanation:
The possible combination ways are:
(1, 1, 1, 1)
(1, 1, 2)
(1, 2, 1)
(1, 3)
(2, 1, 1)
(2, 2)
(3, 1)
Note that different sequences are counted as different combinations.

Example 2:

Input: nums = [9], target = 3
Output: 0

 
Constraints:

1 <= nums.length <= 200
1 <= nums[i] <= 1000
All the elements of nums are unique.
1 <= target <= 1000

 
Follow up: What if negative numbers are allowed in the given array? How does it change the problem? What limitation we need to add to the question to allow negative numbers?


## Solution

```python
from typing import List

class Solution:
    def combinationSum4(self, nums: List[int], target: int) -> int:
        dp = [0] * (target + 1)
        dp[0] = 1
        for i in range(1, target + 1):
            for num in nums:
                if i >= num:
                    dp[i] += dp[i - num]
        return dp[target]
```

## Explanation
To count the number of combinations that sum to target, where order matters and numbers can be used unlimited times, we use dynamic programming.

We initialize a dp array where dp[i] represents the number of ways to sum to i. dp[0] = 1, as there's one way to sum to 0 (empty combination).

For each i from 1 to target, for each number in nums, if i >= num, we add dp[i - num] to dp[i], because we can append num to any combination that sums to i - num.

This accounts for order since we're building sequentially.

Time complexity: O(target * len(nums)), as we iterate through each target value and each number. Space complexity: O(target) for the dp array.
