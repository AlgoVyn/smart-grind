# Triangle

## Problem Description

Given a triangle array, return the minimum path sum from top to bottom.

For each step, you may move to an adjacent number of the row below. More formally, if you are on index `i` on the current row, you may move to either index `i` or index `i + 1` on the next row.

**Example 1:**

Input: `triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]`
Output: `11`

Explanation: The triangle looks like:
```
   2
  3 4
 6 5 7
4 1 8 3
```python
The minimum path sum from top to bottom is `2 + 3 + 5 + 1 = 11` (underlined above).

**Example 2:**

Input: `triangle = [[-10]]`
Output: `-10`

## Constraints

- `1 <= triangle.length <= 200`
- `triangle[0].length == 1`
- `triangle[i].length == triangle[i - 1].length + 1`
- `-10^4 <= triangle[i][j] <= 10^4`

**Follow up:** Could you do this using only O(n) extra space, where n is the total number of rows in the triangle?

## Solution

```python
from typing import List

class Solution:
    def minimumTotal(self, triangle: List[List[int]]) -> int:
        if not triangle:
            return 0

        for i in range(len(triangle) - 2, -1, -1):
            for j in range(len(triangle[i])):
                triangle[i][j] += min(triangle[i+1][j], triangle[i+1][j+1])

        return triangle[0][0]
```

## Explanation

This problem finds the minimum path sum from top to bottom in a triangle, moving to adjacent numbers below.

### Step-by-Step Approach:

1. **Bottom-Up DP**: Start from the second last row, update each cell with the min of the two below plus itself.

2. **Iterate Up**: For `i` from `len-2` to `0`, for each `j` in row `i`, add `min(triangle[i+1][j], triangle[i+1][j+1])`.

3. **Return Top**: `triangle[0][0]` has the min sum.

### Time Complexity:

- O(n^2), where n is rows.

### Space Complexity:

- O(1), modifying in place.
