# Binary Search

## Problem Description

Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.
You must write an algorithm with O(log n) runtime complexity.

## Examples

**Example 1:**

**Input:**
```python
nums = [-1,0,3,5,9,12], target = 9
```

**Output:**
```python
4
```

**Explanation:** 9 exists in nums and its index is 4

**Example 2:**

**Input:**
```python
nums = [-1,0,3,5,9,12], target = 2
```

**Output:**
```python
-1
```

**Explanation:** 2 does not exist in nums so return -1

## Constraints

- `1 <= nums.length <= 104`
- `-104 < nums[i], target < 104`
- All the integers in `nums` are unique.
- `nums` is sorted in ascending order.

## Solution

```python
from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return -1
```

## Explanation

This is an iterative implementation of binary search. We maintain left and right pointers, and repeatedly check the middle element. If it matches the target, return the index. If the middle is less than target, search the right half; otherwise, search the left half.

## Time Complexity
**O(log n)**, where n is the length of the array.

## Space Complexity
**O(1)**, using constant extra space.
