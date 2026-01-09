# Maximum Subarray

## Problem Description

Given an integer array `nums`, find the subarray with the largest sum, and return its sum.

### Example 1

**Input:** `nums = [-2,1,-3,4,-1,2,1,-5,4]`

**Output:** `6`

**Explanation:** The subarray `[4,-1,2,1]` has the largest sum `6`.

### Example 2

**Input:** `nums = [1]`

**Output:** `1`

**Explanation:** The subarray `[1]` has the largest sum `1`.

### Example 3

**Input:** `nums = [5,4,-1,7,8]`

**Output:** `23`

**Explanation:** The subarray `[5,4,-1,7,8]` has the largest sum `23`.

### Constraints

- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

### Follow Up

If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach, which is more subtle.

---

## Solution

```python
from typing import List

class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        max_current = max_global = nums[0]
        for num in nums[1:]:
            max_current = max(num, max_current + num)
            if max_current > max_global:
                max_global = max_current
        return max_global
```

---

## Explanation

This problem requires finding the contiguous subarray with the largest sum.

### Approach

Use Kadane's algorithm to track the maximum sum ending at each position and update the global maximum.

### Step-by-Step Explanation

1. **Initialization:** Set `max_current` and `max_global` to the first element.

2. **Iteration:** For each subsequent element, update `max_current` as max of current element or current + element.

3. **Update Global:** If `max_current > max_global`, update `max_global`.

4. **Return:** `max_global`

### Time Complexity

- **O(n)**, where `n` is the length of `nums`

### Space Complexity

- **O(1)**, constant space
