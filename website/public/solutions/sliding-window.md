# Sliding Window

## Problem Description

The sliding window technique maintains a contiguous subarray that "slides" through an array. It's useful for problems involving subarrays with specific properties (maximum sum, minimum length, etc.).

### Key Concept

Instead of recalculating results for each window from scratch, update the previous result by:
1. Subtracting the element leaving the window
2. Adding the new element entering the window

---

## Example Problem

**Maximum Sum Subarray of Size k:**

Given an array `nums` and integer `k`, find the maximum sum of any subarray of size `k`.

---

## Solution

```python
from typing import List

class Solution:
    def maxSumSubarray(self, nums: List[int], k: int) -> int:
        if not nums or k > len(nums):
            return 0
        
        # Calculate sum of first window
        current_sum = sum(nums[:k])
        max_sum = current_sum
        
        # Slide window: subtract left, add right
        for i in range(k, len(nums)):
            current_sum += nums[i] - nums[i - k]
            max_sum = max(max_sum, current_sum)
        
        return max_sum
```

---

## Explanation

### Algorithm Steps

1. **Initial window**: Calculate sum of first `k` elements
2. **Slide window**: For each subsequent position:
   - Subtract element at left edge
   - Add new element at right edge
3. **Track maximum** sum encountered

### Why Sliding Window Works

- Each element enters and leaves the window exactly once
- No need to recalculate sum from scratch

### Time Complexity

- **O(n)** — Single pass through array

### Space Complexity

- **O(1)** — Constant extra space

---

## Related Problems

- [Maximum Average Subarray](https://leetcode.com/problems/maximum-average-subarray/)
- [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)
- [Longest Substring with At Most K Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/)
