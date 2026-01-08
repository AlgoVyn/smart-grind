# Largest Rectangle In Histogram

## Problem Description
[Link to problem](https://leetcode.com/problems/largest-rectangle-in-histogram/)

Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.
 
Example 1:


Input: heights = [2,1,5,6,2,3]
Output: 10
Explanation: The above is a histogram where width of each bar is 1.
The largest rectangle is shown in the red area, which has an area = 10 units.

Example 2:


Input: heights = [2,4]
Output: 4

 
Constraints:

1 <= heights.length <= 105
0 <= heights[i] <= 104


## Solution

```python
from typing import List

class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        stack = []
        max_area = 0
        for i in range(len(heights) + 1):
            while stack and (i == len(heights) or heights[stack[-1]] >= heights[i]):
                h = heights[stack.pop()]
                w = i - (stack[-1] if stack else -1) - 1
                max_area = max(max_area, h * w)
            if i < len(heights):
                stack.append(i)
        return max_area
```

## Explanation
We use a stack to keep indices of bars in increasing order of heights.

For each bar i, while the stack has bars taller or equal to heights[i], pop them and calculate the area with that bar as the smallest: height * width, where width is from the previous smaller bar to i.

After processing all, the maximum area is the answer.

Time complexity: O(n), each bar is pushed and popped once.
Space complexity: O(n), for the stack.
