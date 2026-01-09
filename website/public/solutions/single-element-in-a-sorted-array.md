# Single Element In A Sorted Array

## Problem Description

You are given a sorted array where every element appears exactly twice, except for one element that appears exactly once.

Find and return the single element.

### Requirements

- **Time Complexity:** O(log n)
- **Space Complexity:** O(1)

---

## Examples

**Example 1:**
```python
Input: nums = [1,1,2,3,3,4,4,8,8]
Output: 2
```

**Example 2:**
```python
Input: nums = [3,3,7,7,10,11,11]
Output: 10
```

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= nums.length <= 10^5` | Array length |
| `0 <= nums[i] <= 10^5` | Element value |

---

## Solution

```python
from typing import List

class Solution:
    def singleNonDuplicate(self, nums: List[int]) -> int:
        left, right = 0, len(nums) - 1
        while left < right:
            mid = (left + right) // 2
            # Ensure mid is even
            if mid % 2 == 1:
                mid -= 1
            # Check if pair is intact
            if nums[mid] == nums[mid + 1]:
                left = mid + 2
            else:
                right = mid
        return nums[left]
```

---

## Explanation

### Approach: Binary Search

The key insight is that in a sorted array with pairs, the single element breaks the pattern:

- **Before the single element:** The first occurrence of each pair is at an even index
- **After the single element:** The first occurrence of each pair is at an odd index

### Algorithm Steps

1. **Initialize pointers** at start and end of array
2. **Find midpoint** (adjusted to be even)
3. **Check pair integrity:**
   - If `nums[mid] == nums[mid + 1]`, single element is in the right half
   - Otherwise, single element is in the left half
4. **Narrow search** until left == right

### Time Complexity

- **O(log n)** — Binary search halves the search space each iteration

### Space Complexity

- **O(1)** — Constant extra space used

---


## Related Problems

- [Single Element in a Sorted Array](https://leetcode.com/problems/single-element-in-a-sorted-array/)
