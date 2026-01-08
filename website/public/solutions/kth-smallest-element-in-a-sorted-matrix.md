# Kth Smallest Element In A Sorted Matrix

## Problem Description
[Link to problem](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)

Given an n x n matrix where each of the rows and columns is sorted in ascending order, return the kth smallest element in the matrix.
Note that it is the kth smallest element in the sorted order, not the kth distinct element.
You must find a solution with a memory complexity better than O(n2).
 
Example 1:

Input: matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8
Output: 13
Explanation: The elements in the matrix are [1,5,9,10,11,12,13,13,15], and the 8th smallest number is 13

Example 2:

Input: matrix = [[-5]], k = 1
Output: -5

 
Constraints:

n == matrix.length == matrix[i].length
1 <= n <= 300
-109 <= matrix[i][j] <= 109
All the rows and columns of matrix are guaranteed to be sorted in non-decreasing order.
1 <= k <= n2

 
Follow up:

Could you solve the problem with a constant memory (i.e., O(1) memory complexity)?
Could you solve the problem in O(n) time complexity? The solution may be too advanced for an interview but you may find reading this paper fun.


## Solution

```python
from typing import List

class Solution:
    def kthSmallest(self, matrix: List[List[int]], k: int) -> int:
        n = len(matrix)
        low, high = matrix[0][0], matrix[n-1][n-1]
        while low < high:
            mid = (low + high) // 2
            count = 0
            for row in matrix:
                # binary search to count elements <= mid in row
                left, right = 0, n
                while left < right:
                    m = (left + right) // 2
                    if row[m] <= mid:
                        left = m + 1
                    else:
                        right = m
                count += left
            if count < k:
                low = mid + 1
            else:
                high = mid
        return low
```

## Explanation
We use binary search on the possible values of the kth smallest element, from the smallest to the largest in the matrix.

For each mid value, we count how many elements in the matrix are less than or equal to mid. Since rows are sorted, we use binary search on each row to find the count efficiently.

If the count is less than k, we search in the higher half; otherwise, in the lower half.

The loop continues until low equals high, which is the kth smallest element.

Time complexity: O(n log (max - min) * log n), where max - min is up to 2*10^9, so log ~30, and binary search per row is log n.
Space complexity: O(1), excluding the input matrix.
