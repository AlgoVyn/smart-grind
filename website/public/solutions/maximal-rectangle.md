# Maximal Rectangle

## Problem Description
[Link to problem](https://leetcode.com/problems/maximal-rectangle/)

Given a rows x cols binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.
 
Example 1:


Input: matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
Output: 6
Explanation: The maximal rectangle is shown in the above picture.

Example 2:

Input: matrix = [["0"]]
Output: 0

Example 3:

Input: matrix = [["1"]]
Output: 1

 
Constraints:

rows == matrix.length
cols == matrix[i].length
1 <= rows, cols <= 200
matrix[i][j] is '0' or '1'.


## Solution

```python
from typing import List

class Solution:
    def maximalRectangle(self, matrix: List[List[str]]) -> int:
        if not matrix or not matrix[0]:
            return 0
        rows, cols = len(matrix), len(matrix[0])
        heights = [0] * cols
        max_area = 0
        def largestRectangleArea(heights):
            stack = [-1]
            max_a = 0
            for i in range(len(heights)):
                while stack[-1] != -1 and heights[stack[-1]] >= heights[i]:
                    h = heights[stack.pop()]
                    w = i - stack[-1] - 1
                    max_a = max(max_a, h * w)
                stack.append(i)
            while stack[-1] != -1:
                h = heights[stack.pop()]
                w = len(heights) - stack[-1] - 1
                max_a = max(max_a, h * w)
            return max_a
        for i in range(rows):
            for j in range(cols):
                if matrix[i][j] == '1':
                    heights[j] += 1
                else:
                    heights[j] = 0
            max_area = max(max_area, largestRectangleArea(heights))
        return max_area
```

## Explanation
We treat each row as the base of a histogram where the height is the number of consecutive 1's above it. For each row, we update the heights array and compute the largest rectangle in that histogram using a stack-based approach.

The largestRectangleArea function uses a monotonic stack to find the largest rectangle for a given heights array.

Time complexity: O(rows * cols), as each cell is processed a constant number of times.

Space complexity: O(cols), for the heights and stack.
