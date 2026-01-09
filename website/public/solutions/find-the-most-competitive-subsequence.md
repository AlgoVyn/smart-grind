# Find The Most Competitive Subsequence

## Problem Description

Given an integer array nums and a positive integer k, return the most competitive subsequence of nums of size k.
An array's subsequence is a resulting sequence obtained by erasing some (possibly zero) elements from the array.
We define that a subsequence a is more competitive than a subsequence b (of the same length) if in the first position where a and b differ, subsequence a has a number less than the corresponding number in b. For example, [1,3,4] is more competitive than [1,3,5] because the first position they differ is at the final number, and 4 is less than 5.

### Examples

**Example 1:**

**Input:** nums = [3,5,2,6], k = 2

**Output:** [2,6]

**Explanation:** Among the set of every possible subsequence: {[3,5], [3,2], [3,6], [5,2], [5,6], [2,6]}, [2,6] is the most competitive.

**Example 2:**

**Input:** nums = [2,4,3,3,5,4,9,6], k = 4

**Output:** [2,3,3,4]

### Constraints

- 1 <= nums.length <= 10^5
- 0 <= nums[i] <= 10^9
- 1 <= k <= nums.length

## Solution

```python
from typing import List

class Solution:
    def mostCompetitive(self, nums: List[int], k: int) -> List[int]:
        stack = []
        for i, num in enumerate(nums):
            while stack and stack[-1] > num and len(stack) - 1 + len(nums) - i >= k:
                stack.pop()
            if len(stack) < k:
                stack.append(num)
        return stack
```

### Approach

Use a monotonic stack to build the smallest possible subsequence of length k.

For each number, while the stack is not empty, the top is larger than current, and removing it still allows us to reach k elements with remaining numbers, pop it.

Then, if stack size < k, append current.

This ensures the subsequence is as small as possible lexicographically.

### Complexity

**Time Complexity:** O(n), since each element is pushed and popped at most once.

**Space Complexity:** O(k) for the stack.
