# Minimum Limit Of Balls In A Bag

## Problem Description
[Link to problem](https://leetcode.com/problems/minimum-limit-of-balls-in-a-bag/)

You are given an integer array nums where the ith bag contains nums[i] balls. You are also given an integer maxOperations.
You can perform the following operation at most maxOperations times:

Take any bag of balls and divide it into two new bags with a positive number of balls.

	
For example, a bag of 5 balls can become two new bags of 1 and 4 balls, or two new bags of 2 and 3 balls.



Your penalty is the maximum number of balls in a bag. You want to minimize your penalty after the operations.
Return the minimum possible penalty after performing the operations.
 
Example 1:

Input: nums = [9], maxOperations = 2
Output: 3
Explanation: 
- Divide the bag with 9 balls into two bags of sizes 6 and 3. [9] -> [6,3].
- Divide the bag with 6 balls into two bags of sizes 3 and 3. [6,3] -> [3,3,3].
The bag with the most number of balls has 3 balls, so your penalty is 3 and you should return 3.

Example 2:

Input: nums = [2,4,8,2], maxOperations = 4
Output: 2
Explanation:
- Divide the bag with 8 balls into two bags of sizes 4 and 4. [2,4,8,2] -> [2,4,4,4,2].
- Divide the bag with 4 balls into two bags of sizes 2 and 2. [2,4,4,4,2] -> [2,2,2,4,4,2].
- Divide the bag with 4 balls into two bags of sizes 2 and 2. [2,2,2,4,4,2] -> [2,2,2,2,2,4,2].
- Divide the bag with 4 balls into two bags of sizes 2 and 2. [2,2,2,2,2,4,2] -> [2,2,2,2,2,2,2,2].
The bag with the most number of balls has 2 balls, so your penalty is 2, and you should return 2.

 
Constraints:

1 <= nums.length <= 105
1 <= maxOperations, nums[i] <= 109


## Solution

```python
from typing import List

class Solution:
    def minimumSize(self, nums: List[int], maxOperations: int) -> int:
        def can(mid: int) -> bool:
            ops = 0
            for num in nums:
                if num > mid:
                    ops += (num - 1) // mid
            return ops <= maxOperations
        
        left, right = 1, max(nums)
        while left < right:
            mid = (left + right) // 2
            if can(mid):
                right = mid
            else:
                left = mid + 1
        return left
```

## Explanation
This problem uses binary search to find the minimum possible maximum number of balls in any bag after operations.

1. Binary search on the maximum allowed balls per bag, from 1 to the maximum in nums.

2. For a mid value, check if we can reduce all bags to <= mid with <= maxOperations.

3. For each bag, the operations needed are ceil(num / mid) - 1 = (num - 1) // mid.

4. Sum the operations; if <= maxOperations, it's possible, so try smaller mid.

5. Otherwise, increase mid.

6. The smallest mid that works is the answer.

Time complexity: O(n log M), where n is the number of bags and M is the maximum number in nums.
Space complexity: O(1), using only constant extra space.
