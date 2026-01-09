# Shortest Subarray with Sum at Least K

## Problem Description

Given an integer array `nums` and an integer `k`, return the length of the shortest non-empty subarray of `nums` with a sum of at least `k`. If there is no such subarray, return `-1`.

A subarray is a contiguous part of an array.

### Examples

**Example 1:**
- Input: `nums = [1], k = 1`
- Output: `1`

**Example 2:**
- Input: `nums = [1,2], k = 4`
- Output: `-1`

**Example 3:**
- Input: `nums = [2,-1,2], k = 3`
- Output: `3`

### Constraints

- `1 <= nums.length <= 10^5`
- `-10^5 <= nums[i] <= 10^5`
- `1 <= k <= 10^9`

---

## Solution

```python
from typing import List
from collections import deque

class Solution:
    def shortestSubarray(self, nums: List[int], k: int) -> int:
        n = len(nums)
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] + nums[i]
        
        dq = deque()
        min_len = float('inf')
        for j in range(n + 1):
            # Remove indices from back that have larger prefix sums
            while dq and prefix[dq[-1]] >= prefix[j]:
                dq.pop()
            # Check if we found a valid subarray
            while dq and prefix[j] - prefix[dq[0]] >= k:
                min_len = min(min_len, j - dq[0])
                dq.popleft()
            dq.append(j)
        
        return min_len if min_len != float('inf') else -1
```

---

## Explanation

This problem requires finding the shortest subarray with sum at least `k`, handling negative numbers. Use prefix sums and a monotonic deque.

### Approach

1. Compute prefix sums for all positions.
2. Maintain a deque of indices with strictly increasing prefix sums.
3. For each position `j`:
   - Remove indices from the back where prefix sum is not increasing.
   - Check the front of the deque for valid subarrays ending at `j`.
   - Add `j` to the deque.

### Algorithm Steps

1. **Compute Prefix**: Build prefix sum array where `prefix[i]` is sum of first `i` elements.
2. **Initialize**: Empty deque, `min_len = inf`.
3. **Iterate**: For each position `j` from `0` to `n`:
   - While deque not empty and `prefix[deque[-1]] >= prefix[j]`, pop from back.
   - While deque not empty and `prefix[j] - prefix[deque[0]] >= k`, update `min_len` and pop from front.
   - Append `j` to deque.
4. **Return**: `min_len` if found, else `-1`.

### Time Complexity

- **O(n)**, as each index is added and removed from the deque at most once.

### Space Complexity

- **O(n)**, for the prefix array and deque.
