# Maximum Beauty of an Array After Applying Operation

## Problem Description

You are given a 0-indexed array `nums` and a non-negative integer `k`.

In one operation, you can:
1. Choose an index `i` that hasn't been chosen before from `[0, nums.length - 1]`
2. Replace `nums[i]` with any integer from `[nums[i] - k, nums[i] + k]`

The **beauty** of the array is the length of the longest subsequence consisting of equal elements.

Return the maximum possible beauty of the array after applying the operation any number of times. Each index can be used in at most one operation.

A **subsequence** is an array generated from the original array by deleting some elements (possibly none) without changing the order of the remaining elements.

---

## Examples

### Example 1

**Input:**
```python
nums = [4, 6, 1, 2], k = 2
```

**Output:**
```python
3
```

**Explanation:**
- Replace `nums[1]` (6) with 4 → `[4, 4, 1, 2]`
- Replace `nums[3]` (2) with 4 → `[4, 4, 1, 4]`

The beauty is 3 (elements at indices 0, 1, and 3 are all 4).

### Example 2

**Input:**
```python
nums = [1, 1, 1, 1], k = 10
```

**Output:**
```python
4
```

**Explanation:** All elements are already equal, so no operations are needed.

---

## Constraints

- `1 <= nums.length <= 10^5`
- `0 <= nums[i], k <= 10^5`

---

## Solution

```python
from typing import List

class Solution:
    def maximumBeauty(self, nums: List[int], k: int) -> int:
        nums.sort()
        left = 0
        max_beauty = 0
        for right in range(len(nums)):
            while nums[right] - nums[left] > 2 * k:
                left += 1
            max_beauty = max(max_beauty, right - left + 1)
        return max_beauty
```

---

## Explanation

### Key Insight

For all elements in a valid subsequence to become equal to some target value `T`:
- Each element `x` must satisfy `T - k <= x <= T + k`
- This means `max - min <= 2 * k` after sorting

### Algorithm

1. **Sort the array**: This allows us to use a sliding window
2. **Sliding window**: Use two pointers `left` and `right`
   - Expand `right` to include more elements
   - Move `left` when `nums[right] - nums[left] > 2 * k`
   - The window `[left, right]` contains elements that can all be made equal
3. **Track maximum**: Update `max_beauty` with the current window size
4. Return `max_beauty`

### Why This Works

After sorting, elements that can be made equal form a contiguous subarray where the difference between the maximum and minimum is at most `2k`.

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n log n)` — Sorting dominates; sliding window is `O(n)` |
| **Space** | `O(1)` — In-place sorting |
