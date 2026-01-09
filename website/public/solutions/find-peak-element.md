# Find Peak Element

## Problem Description

A **peak element** is an element that is strictly greater than its neighbors. Given a 0-indexed integer array `nums`, find a peak element and return its index. If the array contains multiple peaks, return the index of any peak.

You may imagine that `nums[-1] = nums[n] = -∞`. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array.

> **Requirement:** You must write an algorithm that runs in `O(log n)` time.

### Examples

**Example 1:**

| Input | Output | Explanation |
|-------|--------|-------------|
| `nums = [1,2,3,1]` | `2` | `3` is a peak element at index 2 |

**Example 2:**

| Input | Output | Explanation |
|-------|--------|-------------|
| `nums = [1,2,1,3,5,6,4]` | `5` | Valid answers: index 1 (value 2) or index 5 (value 6) |

### Constraints

| Constraint | Description |
|------------|-------------|
| Array length | `1 <= nums.length <= 1000` |
| Value range | `-2^31 <= nums[i] <= 2^31 - 1` |
| Adjacent elements | `nums[i] != nums[i + 1]` for all valid `i` |

---

## Solution

```python
from typing import List

class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        left, right = 0, len(nums) - 1
        
        while left < right:
            mid = (left + right) // 2
            
            # Compare mid with its right neighbor
            if nums[mid] < nums[mid + 1]:
                # Peak is in the right half
                left = mid + 1
            else:
                # Peak is in the left half (including mid)
                right = mid
        
        return left
```

### Approach

We use **binary search** to find a peak in `O(log n)` time.

1. **Initialize** `left = 0`, `right = n - 1`
2. **While** `left < right`:
   - Compute `mid = (left + right) // 2`
   - If `nums[mid] < nums[mid + 1]`: The right side is increasing, so a peak exists on the right. Set `left = mid + 1`
   - Otherwise: The left side (including `mid`) must contain a peak. Set `right = mid`
3. **Return** `left` (or `right`) — Both converge to a peak index

**Why it works:** The condition `nums[i] != nums[i+1]` ensures the array is strictly monotonic between any two points. This guarantees a peak exists in the direction we choose.

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(log n)` — Binary search on the array |
| **Space** | `O(1)` — Constant extra space |

---
