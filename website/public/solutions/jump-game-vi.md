# Jump Game Vi

## Problem Description
[Link to problem](https://leetcode.com/problems/jump-game-vi/)

You are given a 0-indexed integer array nums and an integer k.
You are initially standing at index 0. In one move, you can jump at most k steps forward without going outside the boundaries of the array. That is, you can jump from index i to any index in the range [i + 1, min(n - 1, i + k)] inclusive.
You want to reach the last index of the array (index n - 1). Your score is the sum of all nums[j] for each index j you visited in the array.
Return the maximum score you can get.
 
Example 1:

Input: nums = [1,-1,-2,4,-7,3], k = 2
Output: 7
Explanation: You can choose your jumps forming the subsequence [1,-1,4,3] (underlined above). The sum is 7.

Example 2:

Input: nums = [10,-5,-2,4,0,3], k = 3
Output: 17
Explanation: You can choose your jumps forming the subsequence [10,4,3] (underlined above). The sum is 17.

Example 3:

Input: nums = [1,-5,-20,4,-1,3,-6,-3], k = 2
Output: 0

 
Constraints:

1 <= nums.length, k <= 105
-104 <= nums[i] <= 104


## Solution

```python
from typing import List
from collections import deque

class Solution:
    def maxResult(self, nums: List[int], k: int) -> int:
        n = len(nums)
        dp = [0] * n
        dp[0] = nums[0]
        dq = deque([0])
        for i in range(1, n):
            while dq and dq[0] < i - k:
                dq.popleft()
            dp[i] = nums[i] + dp[dq[0]]
            while dq and dp[dq[-1]] <= dp[i]:
                dq.pop()
            dq.append(i)
        return dp[-1]
```

## Explanation
This problem can be solved using dynamic programming with a sliding window maximum optimization.

We define dp[i] as the maximum score to reach index i. The score includes nums[i].

dp[0] = nums[0]

For each i from 1 to n-1, dp[i] = nums[i] + max(dp[j] for j in range(max(0, i - k), i))

To compute the maximum in the range [max(0, i - k), i - 1] efficiently, we use a deque to maintain indices in decreasing order of dp values.

We initialize a deque and add index 0.

For i from 1 to n-1:

- While deque is not empty and the front index < i - k, remove from front.

- While deque is not empty and dp[deque[-1]] <= dp[i-1], remove from back. Wait, actually, since we need max up to i-1, but wait.

Standard way: before computing dp[i], the deque should contain indices from i-k to i-1, with dp values decreasing.

So, first, remove from front if deque[0] < i - k.

Then, while deque and dp[deque[-1]] <= dp[i-1], pop back. Wait, no: since dp[i-1] is the previous, but actually, we add i-1 after computing dp[i-1]? Wait.

Let's clarify.

We process in order.

Start with deque = [0], dp[0] = nums[0]

For i=1 to n-1:

  # First, remove old: while deque and deque[0] < i - k: deque.popleft()

  # Now, the max is dp[deque[0]]

  dp[i] = nums[i] + (dp[deque[0]] if deque else -inf)

  # Now, add i to deque: while deque and dp[deque[-1]] <= dp[i]: deque.pop()

  deque.append(i)

For i=1, before computing dp[1], deque has [0], 0 >=1-k (k>=1), so max is dp[0], dp[1]=nums[1]+dp[0]

Then, while deque and dp[deque[-1]] <= dp[1], if dp[0] <= dp[1], pop 0, then append 1.

Yes.

This way, deque maintains indices with decreasing dp values.

Time complexity: O(n), as each index is added and removed at most once.

Space complexity: O(n) for dp array, O(k) for deque.
