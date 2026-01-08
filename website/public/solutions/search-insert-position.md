# Search Insert Position

## Problem Description
[Link to problem](https://leetcode.com/problems/search-insert-position/)

Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.
You must write an algorithm with O(log n) runtime complexity.
 
Example 1:

Input: nums = [1,3,5,6], target = 5
Output: 2

Example 2:

Input: nums = [1,3,5,6], target = 2
Output: 1

Example 3:

Input: nums = [1,3,5,6], target = 7
Output: 4

 
Constraints:

1 <= nums.length <= 104
-104 <= nums[i] <= 104
nums contains distinct values sorted in ascending order.
-104 <= target <= 104


## Solution

```python
from typing import List

class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return left
```

## Explanation

This problem requires finding the index to insert a target in a sorted array, or its position if present.

### Approach

Use binary search to find the target or the insertion point.

### Step-by-Step Explanation

1. **Binary Search**: Initialize left and right.

2. **Mid Check**: If equal, return mid; else adjust left or right.

3. **Return**: left when loop ends, which is the insert position.

### Time Complexity

- O(log n), where n is the length of nums.

### Space Complexity

- O(1), constant space.
