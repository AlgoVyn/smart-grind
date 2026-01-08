# Delete And Earn

## Problem Description
[Link to problem](https://leetcode.com/problems/delete-and-earn/)

You are given an integer array nums. You want to maximize the number of points you get by performing the following operation any number of times:

Pick any nums[i] and delete it to earn nums[i] points. Afterwards, you must delete every element equal to nums[i] - 1 and every element equal to nums[i] + 1.

Return the maximum number of points you can earn by applying the above operation some number of times.
 
Example 1:

Input: nums = [3,4,2]
Output: 6
Explanation: You can perform the following operations:
- Delete 4 to earn 4 points. Consequently, 3 is also deleted. nums = [2].
- Delete 2 to earn 2 points. nums = [].
You earn a total of 6 points.

Example 2:

Input: nums = [2,2,3,3,3,4]
Output: 9
Explanation: You can perform the following operations:
- Delete a 3 to earn 3 points. All 2's and 4's are also deleted. nums = [3,3].
- Delete a 3 again to earn 3 points. nums = [3].
- Delete a 3 once more to earn 3 points. nums = [].
You earn a total of 9 points.
 
Constraints:

1 <= nums.length <= 2 * 104
1 <= nums[i] <= 104


## Solution

```python
# Python solution
from typing import List

class Solution:
    def deleteAndEarn(self, nums: List[int]) -> int:
        if not nums:
            return 0
        freq = {}
        for num in nums:
            freq[num] = freq.get(num, 0) + 1
        unique = sorted(freq.keys())
        n = len(unique)
        if n == 1:
            return unique[0] * freq[unique[0]]
        dp = [0] * n
        dp[0] = unique[0] * freq[unique[0]]
        dp[1] = max(dp[0], unique[1] * freq[unique[1]])
        for i in range(2, n):
            if unique[i] == unique[i-1] + 1:
                dp[i] = max(dp[i-1], dp[i-2] + unique[i] * freq[unique[i]])
            else:
                dp[i] = dp[i-1] + unique[i] * freq[unique[i]]
        return dp[-1]
```

## Explanation
This problem can be solved by grouping the numbers by their values and then using dynamic programming to decide whether to include each group or not, considering the constraint that adjacent numbers cannot be included.

First, count the frequency of each number using a dictionary.

Then, sort the unique numbers.

Use DP where `dp[i]` represents the maximum points we can earn considering the first `i` unique numbers.

- For `dp[0]`: points from the first number.
- For `dp[1]`: max of `dp[0]` or points from the second number.
- For each subsequent `i`, if the current number is exactly one more than the previous, we cannot take both, so `dp[i] = max(dp[i-1], dp[i-2] + points from current)`.
- If not adjacent, we can take it, so `dp[i] = dp[i-1] + points from current`.

Time complexity: O(n log n) due to sorting, where n is the number of unique elements.
Space complexity: O(n) for the frequency map and dp array.
