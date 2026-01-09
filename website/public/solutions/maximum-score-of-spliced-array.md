# Maximum Score Of Spliced Array

## Problem Description
You are given two 0-indexed integer arrays nums1 and nums2, both of length n.
You can choose two integers left and right where 0 <= left <= right < n and swap the subarray nums1[left...right] with the subarray nums2[left...right].

For example, if nums1 = [1,2,3,4,5] and nums2 = [11,12,13,14,15] and you choose left = 1 and right = 2, nums1 becomes [1,12,13,4,5] and nums2 becomes [11,2,3,14,15].

You may choose to apply the mentioned operation once or not do anything.
The score of the arrays is the maximum of sum(nums1) and sum(nums2), where sum(arr) is the sum of all the elements in the array arr.
Return the maximum possible score.
A subarray is a contiguous sequence of elements within an array. arr[left...right] denotes the subarray that contains the elements of nums between indices left and right (inclusive).
 
Example 1:

Input: nums1 = [60,60,60], nums2 = [10,90,10]
Output: 210
Explanation: Choosing left = 1 and right = 1, we have nums1 = [60,90,60] and nums2 = [10,60,10].
The score is max(sum(nums1), sum(nums2)) = max(210, 80) = 210.
Example 2:

Input: nums1 = [20,40,20,70,30], nums2 = [50,20,50,40,20]
Output: 220
Explanation: Choosing left = 3, right = 4, we have nums1 = [20,40,20,40,20] and nums2 = [50,20,50,70,30].
The score is max(sum(nums1), sum(nums2)) = max(140, 220) = 220.

Example 3:

Input: nums1 = [7,11,13], nums2 = [1,1,1]
Output: 31
Explanation: We choose not to swap any subarray.
The score is max(sum(nums1), sum(nums2)) = max(31, 3) = 31.

 
Constraints:

n == nums1.length == nums2.length
1 <= n <= 105
1 <= nums1[i], nums2[i] <= 104
## Solution

```python
from typing import List

class Solution:
    def maximumsSplicedArray(self, nums1: List[int], nums2: List[int]) -> int:
        def kadane(arr):
            max_sum = float('-inf')
            current = 0
            for num in arr:
                current = max(num, current + num)
                max_sum = max(max_sum, current)
            return max_sum

        def min_kadane(arr):
            min_sum = float('inf')
            current = 0
            for num in arr:
                current = min(num, current + num)
                min_sum = min(min_sum, current)
            return min_sum

        sum1 = sum(nums1)
        sum2 = sum(nums2)
        diff = [b - a for a, b in zip(nums1, nums2)]
        max_sub = kadane(diff)
        min_sub = min_kadane(diff)
        ans = max(sum1, sum2)
        if max_sub > 0:
            ans = max(ans, sum1 + max_sub)
        if min_sub < 0:
            ans = max(ans, sum2 - min_sub)
        return ans
```

## Explanation
The problem allows swapping one subarray between nums1 and nums2 to maximize the maximum sum of the two arrays.

First, compute the sums of nums1 and nums2. The difference array diff[i] = nums2[i] - nums1[i] represents the gain when swapping element i.

Swapping a subarray [left, right] in nums1 increases sum1 by sum(diff[left..right]) and decreases sum2 by the same amount.

To maximize the score, consider:
- Not swapping: max(sum1, sum2)
- Swapping to increase sum1: sum1 + max(0, maximum subarray sum of diff)
- Swapping to increase sum2: sum2 + max(0, -minimum subarray sum of diff)

Use Kadane's algorithm to find the maximum and minimum subarray sums of diff.

Time Complexity: O(n), where n is the length of the arrays, due to Kadane's algorithm.

Space Complexity: O(n) for the diff array.
