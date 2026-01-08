# Single Element In A Sorted Array

## Problem Description
[Link to problem](https://leetcode.com/problems/single-element-in-a-sorted-array/)

You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once.
Return the single element that appears only once.
Your solution must run in O(log n) time and O(1) space.
 
Example 1:
Input: nums = [1,1,2,3,3,4,4,8,8]
Output: 2
Example 2:
Input: nums = [3,3,7,7,10,11,11]
Output: 10

 
Constraints:

1 <= nums.length <= 105
0 <= nums[i] <= 105


## Solution

```python
from typing import List

class Solution:
    def singleNonDuplicate(self, nums: List[int]) -> int:
        left, right = 0, len(nums) - 1
        while left < right:
            mid = (left + right) // 2
            if mid % 2 == 1:
                mid -= 1
            if nums[mid] == nums[mid + 1]:
                left = mid + 2
            else:
                right = mid
        return nums[left]
```

## Explanation

This problem requires finding the single element in a sorted array where all others appear twice.

### Approach

Use binary search to find the position where the pair pattern breaks.

### Step-by-Step Explanation

1. **Binary Search**: Set left and right.

2. **Adjust Mid**: Make mid even.

3. **Check Pair**: If nums[mid] == nums[mid+1], single is in right half, else left.

4. **Return**: nums[left] when left == right.

### Time Complexity

- O(log n), where n is the length of nums.

### Space Complexity

- O(1), constant space.
