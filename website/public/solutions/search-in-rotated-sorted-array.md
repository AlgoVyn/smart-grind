# Search in Rotated Sorted Array

## Problem Description

There is an integer array `nums` sorted in ascending order (with distinct values). Prior to being passed to your function, `nums` is possibly left rotated at an unknown index `k` (`1 <= k < nums.length`) such that the resulting array is `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]` (0-indexed).

For example, `[0,1,2,4,5,6,7]` might be left rotated by 3 indices and become `[4,5,6,7,0,1,2]`.

Given the array `nums` after the possible rotation and an integer `target`, return the index of target if it is in `nums`, or `-1` if it is not in `nums`. You must write an algorithm with O(log n) runtime complexity.

### Examples

**Example 1:**
- Input: `nums = [4,5,6,7,0,1,2], target = 0`
- Output: `4`

**Example 2:**
- Input: `nums = [4,5,6,7,0,1,2], target = 3`
- Output: `-1`

**Example 3:**
- Input: `nums = [1], target = 0`
- Output: `-1`

### Constraints

- `1 <= nums.length <= 5000`
- `-10^4 <= nums[i] <= 10^4`
- All values of `nums` are unique
- `nums` is an ascending array that is possibly rotated
- `-10^4 <= target <= 10^4`

---

## Solution

```python
from typing import List

def search(nums: List[int], target: int) -> int:
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid

        # Check if left half is sorted
        if nums[left] <= nums[mid]:
            # Target in left sorted half
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1
```

---

## Explanation

To search for a target in a rotated sorted array with O(log n) time, we use a modified binary search.

### Approach

1. Initialize `left = 0`, `right = len(nums) - 1`.
2. While `left <= right`:
   - Calculate `mid`.
   - If `nums[mid] == target`, return `mid`.
   - Determine if the left half (`left` to `mid`) is sorted by checking `nums[left] <= nums[mid]`.
   - If left half is sorted and target is in `[nums[left], nums[mid])`, search left half.
   - If right half is sorted and target is in `(nums[mid], nums[right]]`, search right half.

This algorithm leverages the fact that at least one half of the array is always sorted.

### Time Complexity

- **O(log n)**, due to binary search.

### Space Complexity

- **O(1)**, using constant extra space.
