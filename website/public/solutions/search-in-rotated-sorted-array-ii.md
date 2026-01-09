# Search In Rotated Sorted Array Ii

## Problem Description
There is an integer array nums sorted in non-decreasing order (not necessarily with distinct values).
Before being passed to your function, nums is rotated at an unknown pivot index k (0 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). For example, [0,1,2,4,4,4,5,6,6,7] might be rotated at pivot index 5 and become [4,5,6,6,7,0,1,2,4,4].
Given the array nums after the rotation and an integer target, return true if target is in nums, or false if it is not in nums.
You must decrease the overall operation steps as much as possible.
 
Example 1:
Input: nums = [2,5,6,0,0,1,2], target = 0
Output: true
Example 2:
Input: nums = [2,5,6,0,0,1,2], target = 3
Output: false

 
Constraints:

1 <= nums.length <= 5000
-104 <= nums[i] <= 104
nums is guaranteed to be rotated at some pivot.
-104 <= target <= 104

 
Follow up: This problem is similar to Search in Rotated Sorted Array, but nums may contain duplicates. Would this affect the runtime complexity? How and why?
## Solution

```python
from typing import List

def search(nums: List[int], target: int) -> bool:
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return True

        if nums[left] == nums[mid]:
            left += 1
            continue

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

    return False
```

## Explanation
To search in a rotated sorted array with duplicates, use modified binary search.

1. Standard binary search setup.
2. If nums[mid] == target, return True.
3. If nums[left] == nums[mid], can't determine sorted half, increment left to skip duplicate.
4. Else, check which half is sorted:
   - If left half sorted and target in [nums[left], nums[mid]), search left.
   - Else, search right.
   - If right half sorted and target in (nums[mid], nums[right]], search right.
   - Else, search left.

Duplicates may lead to O(n) worst case when many duplicates, but average O(log n).

**Time Complexity:** O(log n) average, O(n) worst case with duplicates.
**Space Complexity:** O(1).
