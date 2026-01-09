# Jump Game VI

## Problem Description

You are given a 0-indexed integer array `nums` and an integer `k`. You are initially standing at index `0`. In one move, you can jump at most `k` steps forward without going outside the boundaries of the array. That is, you can jump from index `i` to any index in the range `[i + 1, min(n - 1, i + k)]` inclusive.

You want to reach the last index of the array (index `n - 1`). Your score is the sum of all `nums[j]` for each index `j` you visited in the array. Return the maximum score you can get.

### Example 1

**Input:** `nums = [1,-1,-2,4,-7,3], k = 2`

**Output:** `7`

**Explanation:** You can choose your jumps forming the subsequence `[1,-1,4,3]`. The sum is `7`.

### Example 2

**Input:** `nums = [10,-5,-2,4,0,3], k = 3`

**Output:** `17`

**Explanation:** You can choose your jumps forming the subsequence `[10,4,3]`. The sum is `17`.

### Example 3

**Input:** `nums = [1,-5,-20,4,-1,3,-6,-3], k = 2`

**Output:** `0`

## Constraints

- `1 <= nums.length, k <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

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
            # Remove indices that are out of the sliding window
            while dq and dq[0] < i - k:
                dq.popleft()
            
            # Current maximum score to reach index i
            dp[i] = nums[i] + dp[dq[0]]
            
            # Maintain decreasing order of dp values in the deque
            while dq and dp[dq[-1]] <= dp[i]:
                dq.pop()
            
            dq.append(i)
        
        return dp[-1]
```

## Explanation

This problem is solved using dynamic programming with a sliding window maximum optimization using a deque.

### Dynamic Programming Formulation

- `dp[i]` represents the maximum score to reach index `i`.
- `dp[0] = nums[0]`
- `dp[i] = nums[i] + max(dp[j] for j in range(max(0, i - k), i))`

### Deque Optimization

Instead of computing the maximum in the range `[i-k, i-1]` for each `i` (which would be O(k) per step), we use a deque to maintain indices in decreasing order of `dp` values:

1. **Remove outdated indices:** While the front index is less than `i - k`, remove it from the front.
2. **Get maximum:** The front of the deque always has the maximum `dp` value in the current window.
3. **Maintain order:** While the back of the deque has a `dp` value less than or equal to the current `dp[i]`, remove it. Then add the current index.

This ensures each index is added and removed at most once, giving O(n) total time.

## Complexity Analysis

- **Time Complexity:** O(n) — each index is processed once.
- **Space Complexity:** O(n) for the `dp` array, O(k) for the deque.
