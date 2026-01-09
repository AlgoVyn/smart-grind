# Min Cost Climbing Stairs

## Problem Description
You are given an integer array cost where cost[i] is the cost of ith step on a staircase. Once you pay the cost, you can either climb one or two steps.
You can either start from the step with index 0, or the step with index 1.
Return the minimum cost to reach the top of the floor.
 
Example 1:

Input: cost = [10,15,20]
Output: 15
Explanation: You will start at index 1.
- Pay 15 and climb two steps to reach the top.
The total cost is 15.

Example 2:

Input: cost = [1,100,1,1,1,100,1,1,100,1]
Output: 6
Explanation: You will start at index 0.
- Pay 1 and climb two steps to reach index 2.
- Pay 1 and climb two steps to reach index 4.
- Pay 1 and climb two steps to reach index 6.
- Pay 1 and climb one step to reach index 7.
- Pay 1 and climb two steps to reach index 9.
- Pay 1 and climb one step to reach the top.
The total cost is 6.

 
Constraints:

2 <= cost.length <= 1000
0 <= cost[i] <= 999
## Solution

```python
from typing import List

class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        if len(cost) == 2:
            return min(cost[0], cost[1])
        prev2 = cost[0]
        prev1 = cost[1]
        for i in range(2, len(cost)):
            curr = cost[i] + min(prev1, prev2)
            prev2 = prev1
            prev1 = curr
        return min(prev1, prev2)
```

## Explanation
This problem is solved using dynamic programming to find the minimum cost to reach the top of the stairs.

1. Define dp[i] as the minimum cost to reach step i.
2. Initialize dp[0] = cost[0], dp[1] = cost[1].
3. For i from 2 to n-1, dp[i] = cost[i] + min(dp[i-1], dp[i-2]).
4. The minimum cost to reach the top is min(dp[n-1], dp[n-2]), as you can jump from the last or second last step to the top without additional cost.
5. To optimize space, maintain only the last two dp values instead of an array.

Time complexity: O(n), where n is the length of cost, as we iterate through the array once.
Space complexity: O(1), using only a constant amount of extra space.
