# Jump Game II

## Problem Description

You are given a 0-indexed array of integers `nums` of length `n`. You are initially positioned at index `0`. Each element `nums[i]` represents the maximum length of a forward jump from index `i`. In other words, if you are at index `i`, you can jump to any index `i + j` where:

- `0 <= j <= nums[i]`
- `i + j < n`

Return the minimum number of jumps to reach index `n - 1`. The test cases are generated such that you can reach index `n - 1`.

### Example 1

**Input:** `nums = [2,3,1,1,4]`

**Output:** `2`

**Explanation:** The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index.

### Example 2

**Input:** `nums = [2,3,0,1,4]`

**Output:** `2`

---

## Constraints

- `1 <= nums.length <= 10^4`
- `0 <= nums[i] <= 1000`
- It's guaranteed that you can reach `nums[n - 1]`.

---

## Solution

```python
from typing import List

class Solution:
    def jump(self, nums: List[int]) -> int:
        n = len(nums)
        if n == 1:
            return 0
        
        jumps = 0
        current_end = 0
        farthest = 0
        
        for i in range(n - 1):
            farthest = max(farthest, i + nums[i])
            if i == current_end:
                jumps += 1
                current_end = farthest
                if current_end >= n - 1:
                    break
        
        return jumps
```

---

## Explanation

This problem finds the minimum jumps required to reach the end of the array using a greedy approach.

### Algorithm

1. Initialize `jumps = 0`, `current_end = 0`, and `farthest = 0`.
2. Iterate through the array up to the second-to-last index.
3. At each index `i`, update `farthest` to the maximum reachable position.
4. When `i` reaches `current_end`, increment `jumps` and update `current_end` to `farthest`.
5. If `current_end` reaches or exceeds the last index, break early.

### Key Insight

By tracking the farthest reachable position and making jumps only when necessary, we ensure the minimum number of jumps.

---

## Complexity Analysis

- **Time Complexity:** O(n) — single pass through the array.
- **Space Complexity:** O(1) — constant extra space.
