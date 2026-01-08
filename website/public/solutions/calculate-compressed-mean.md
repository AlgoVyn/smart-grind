# Calculate Compressed Mean

## Problem Description
[Link to problem](https://leetcode.com/problems/calculate-compressed-mean/)

## Solution
```python
from typing import List

class Solution:
    def calculateCompressedMean(self, nums: List[int]) -> float:
        if not nums:
            return 0.0
        return sum(nums) / len(nums)
```

## Explanation
This solution calculates the arithmetic mean of the given list of numbers by summing all elements and dividing by the count. If the list is empty, return 0.0.

Time Complexity: O(n), where n is the number of elements, due to summing the list.

Space Complexity: O(1), as no additional space is used beyond the input.
