# Maximum Width Ramp

## Problem Description

A ramp in an integer array `nums` is a pair `(i, j)` for which `i < j` and `nums[i] <= nums[j]`. The width of such a ramp is `j - i`.

Given an integer array `nums`, return the maximum width of a ramp in `nums`. If there is no ramp in `nums`, return `0`.

### Example 1

**Input:** `nums = [6,0,8,2,1,5]`

**Output:** `4`

**Explanation:**

The maximum width ramp is achieved at `(i, j) = (1, 5)`: `nums[1] = 0` and `nums[5] = 5`.

### Example 2

**Input:** `nums = [9,8,1,0,1,9,4,0,4,1]`

**Output:** `7`

**Explanation:**

The maximum width ramp is achieved at `(i, j) = (2, 9)`: `nums[2] = 1` and `nums[9] = 1`.

### Constraints

- `2 <= nums.length <= 5 * 10^4`
- `0 <= nums[i] <= 5 * 10^4`

---

## Solution

```python
from typing import List

class Solution:
    def maxWidthRamp(self, nums: List[int]) -> int:
        n = len(nums)
        indices = sorted(range(n), key=lambda i: nums[i])
        min_index = n
        max_width = 0

        for i in indices:
            max_width = max(max_width, i - min_index)
            min_index = min(min_index, i)

        return max_width
```

---

## Explanation

This problem requires finding the maximum width ramp, where width is `j - i` for `i < j` and `nums[i] <= nums[j]`.

### Approach

1. **Sort Indices:** Sort indices by `nums` value ascending.

2. **Initialize:** `min_index` to `n`, `max_width` to `0`.

3. **Iterate:** For each index in sorted order, update `max_width` with `i - min_index`, then update `min_index` to `min(min_index, i)`.

4. **Return:** `max_width`

### Time Complexity

- **O(n log n)**, for sorting

### Space Complexity

- **O(n)**, for the indices list
