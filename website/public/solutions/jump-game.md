# Jump Game

## Problem Description

You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.

### Example 1

**Input:** `nums = [2,3,1,1,4]`

**Output:** `true`

**Explanation:** Jump 1 step from index 0 to 1, then 3 steps to the last index.

### Example 2

**Input:** `nums = [3,2,1,0,4]`

**Output:** `false`

**Explanation:** You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.

## Constraints

- `1 <= nums.length <= 10^4`
- `0 <= nums[i] <= 10^5`

## Solution

```python
from typing import List

class Solution:
    def canJump(self, nums: List[int]) -> bool:
        if not nums:
            return True
        
        farthest = 0
        current_end = 0
        
        for i in range(len(nums) - 1):
            farthest = max(farthest, i + nums[i])
            if i == current_end:
                current_end = farthest
                if current_end >= len(nums) - 1:
                    return True
        
        return current_end >= len(nums) - 1
```

## Explanation

This problem uses a greedy approach to determine if the last index is reachable.

### Algorithm

1. Initialize `farthest = 0` (the farthest index we can reach) and `current_end = 0` (the end of the current jump range).
2. Iterate through the array up to the second-to-last element.
3. At each index `i`, update `farthest` to `max(farthest, i + nums[i])`.
4. If `i` reaches `current_end`, update `current_end` to `farthest`.
5. If `current_end` reaches or exceeds the last index, return `true` early.
6. After the loop, check if `current_end` is at least the last index.

### Key Insight

We don't need to track every possible path. We only need to know the farthest position reachable with the jumps taken so far. If at any point the current position equals the end of our reachable range and we can't extend it further, we know the end is unreachable.

## Complexity Analysis

- **Time Complexity:** O(n) — single pass through the array.
- **Space Complexity:** O(1) — constant extra space.
