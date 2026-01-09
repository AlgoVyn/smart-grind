# Spiral Matrix Iii

## Problem Description
You start at the cell (rStart, cStart) of an rows x cols grid facing east. The northwest corner is at the first row and column in the grid, and the southeast corner is at the last row and column.
You will walk in a clockwise spiral shape to visit every position in this grid. Whenever you move outside the grid's boundary, we continue our walk outside the grid (but may return to the grid boundary later.). Eventually, we reach all rows * cols spaces of the grid.
Return an array of coordinates representing the positions of the grid in the order you visited them.
 
Example 1:
Input: rows = 1, cols = 4, rStart = 0, cStart = 0
Output: [[0,0],[0,1],[0,2],[0,3]]

Example 2:
Input: rows = 5, cols = 6, rStart = 1, cStart = 4
Output: [[1,4],[1,5],[2,5],[2,4],[2,3],[1,3],[0,3],[0,4],[0,5],[3,5],[3,4],[3,3],[3,2],[2,2],[1,2],[0,2],[4,5],[4,4],[4,3],[4,2],[4,1],[3,1],[2,1],[1,1],[0,1],[4,0],[3,0],[2,0],[1,0],[0,0]]

 
Constraints:

1 <= rows, cols <= 100
0 <= rStart < rows
0 <= cStart < cols

---

## Solution

```python
from typing import List

class Solution:
    def spiralMatrixIII(self, rows: int, cols: int, rStart: int, cStart: int) -> List[List[int]]:
        result = [[rStart, cStart]]
        if rows * cols == 1:
            return result
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # east, south, west, north
        r, c = rStart, cStart
        step = 1
        dir_idx = 0
        while len(result) < rows * cols:
            for _ in range(2):  # two directions per step size
                for _ in range(step):
                    r += directions[dir_idx][0]
                    c += directions[dir_idx][1]
                    if 0 <= r < rows and 0 <= c < cols:
                        result.append([r, c])
                dir_idx = (dir_idx + 1) % 4
            step += 1
        return result
```

---

## Explanation

This problem traverses the grid in a spiral order starting from (rStart, cStart), allowing moves outside the grid, and collects all grid positions in the order visited.

### Step-by-Step Approach:

1. **Initialization**: Start at (rStart, cStart), add to result. Directions: east, south, west, north.

2. **Spiral Movement**: Use increasing step sizes (1,1,2,2,3,3,...). For each pair of directions, move step times in each direction.

3. **Collect Positions**: For each move, update position, if within bounds, add to result.

4. **Continue**: Until all positions are collected.

### Time Complexity:
- O(rows * cols), as we visit each cell once.

### Space Complexity:
- O(rows * cols) for the result list.
