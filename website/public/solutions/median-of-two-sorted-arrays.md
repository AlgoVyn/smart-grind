# Median Of Two Sorted Arrays

## Problem Description
[Link to problem](https://leetcode.com/problems/median-of-two-sorted-arrays/)

Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.
The overall run time complexity should be O(log (m+n)).
 
Example 1:

Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.

Example 2:

Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.

 
Constraints:

nums1.length == m
nums2.length == n
0 <= m <= 1000
0 <= n <= 1000
1 <= m + n <= 2000
-106 <= nums1[i], nums2[i] <= 106


## Solution

```python
from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        m, n = len(nums1), len(nums2)
        total = m + n
        half = (total + 1) // 2
        left, right = 0, m
        while left <= right:
            i = (left + right) // 2
            j = half - i
            nums1_left = nums1[i-1] if i > 0 else float('-inf')
            nums1_right = nums1[i] if i < m else float('inf')
            nums2_left = nums2[j-1] if j > 0 else float('-inf')
            nums2_right = nums2[j] if j < n else float('inf')
            if nums1_left <= nums2_right and nums2_left <= nums1_right:
                if total % 2 == 1:
                    return max(nums1_left, nums2_left)
                else:
                    return (max(nums1_left, nums2_left) + min(nums1_right, nums2_right)) / 2
            elif nums1_left > nums2_right:
                right = i - 1
            else:
                left = i + 1
        raise ValueError("Input arrays are not sorted")
```

## Explanation
To find the median of two sorted arrays in O(log(min(m,n))) time, use binary search to partition the smaller array.

Assume nums1 is the smaller array. Perform binary search on nums1 to find the correct partition i such that the left partition has (m+n+1)/2 elements.

For each mid i, calculate j = half - i. Check if nums1[i-1] <= nums2[j] and nums2[j-1] <= nums1[i].

If yes, the partition is correct. For odd total, median is max of left elements; for even, average of max left and min right.

If nums1[i-1] > nums2[j], search left; else, search right.

Time Complexity: O(log(min(m,n))), as binary search on the smaller array.

Space Complexity: O(1), using only a few variables.
