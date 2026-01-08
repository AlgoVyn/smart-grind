# Container With Most Water

## Problem Description
[Link to problem](https://leetcode.com/problems/container-with-most-water/)

Given n non-negative integers a1, a2, ..., an, where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of the ith line are (i, ai) and (i, 0). Find two lines, which, together with the x-axis forms a container, such that the container contains the most water. Return the maximum amount of water a container can store. Notice that you may not slant the container.

**Example:**
```
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
```

**Constraints:**
- n == height.length
- 2 <= n <= 10^5
- 0 <= height[i] <= 10^4

## Solution
```python
from typing import List

class Solution:
    def maxArea(self, height: List[int]) -> int:
        left, right = 0, len(height) - 1
        max_area = 0
        while left < right:
            area = min(height[left], height[right]) * (right - left)
            max_area = max(max_area, area)
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        return max_area
```

## Explanation
This problem requires finding the maximum area of water that can be trapped between two vertical lines and the x-axis. The area is calculated as the minimum height of the two lines multiplied by the distance between them.

The optimal solution uses a two-pointer approach starting from both ends of the array. At each step, calculate the current area and update the maximum if necessary. Then, move the pointer with the smaller height inward, because increasing the area requires either increasing the minimum height or increasing the distance, but since we're moving pointers closer, we must increase the minimum height by moving the shorter line.

This approach is efficient with O(n) time complexity and O(1) space complexity, as it only requires a single pass through the array and constant extra space.
