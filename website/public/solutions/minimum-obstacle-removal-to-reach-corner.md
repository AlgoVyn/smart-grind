# Minimum Obstacle Removal To Reach Corner

## Problem Description

You are given a 0-indexed 2D integer array `grid` of size `m x n`. Each cell has one of two values:

- `0` represents an empty cell
- `1` represents an obstacle that may be removed

You can move up, down, left, or right from and to an empty cell. Return the minimum number of obstacles to remove so you can move from the upper left corner `(0, 0)` to the lower right corner `(m - 1, n - 1)`.

## Examples

### Example 1

**Input:**
```
grid = [[0, 1, 1], [1, 1, 0], [1, 1, 0]]
```

**Output:**
```
2
```

**Explanation:**
We can remove the obstacles at `(0, 1)` and `(0, 2)` to create a path from `(0, 0)` to `(2, 2)`. It can be shown that we need to remove at least 2 obstacles.

### Example 2

**Input:**
```
grid = [[0, 1, 0, 0, 0], [0, 1, 0, 1, 0], [0, 0, 0, 1, 0]]
```

**Output:**
```
0
```

**Explanation:**
We can move from `(0, 0)` to `(2, 4)` without removing any obstacles.

## Constraints

- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 10^5`
- `2 <= m * n <= 10^5`
- `grid[i][j]` is either `0` or `1`
- `grid[0][0] == grid[m - 1][n - 1] == 0`

## Solution

```python
from typing import List
from collections import deque

class Solution:
    def minimumObstacles(self, grid: List[List[int]]) -> int:
        """
        Find minimum obstacles to remove using 0-1 BFS.
        
        Moving to empty cell costs 0, moving to obstacle costs 1.
        """
        m, n = len(grid), len(grid[0])
        dist = [[float('inf')] * n for _ in range(m)]
        dist[0][0] = 0
        
        dq = deque([(0, 0)])
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        while dq:
            x, y = dq.popleft()
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if 0 <= nx < m and 0 <= ny < n:
                    cost = dist[x][y] + grid[nx][ny]
                    if cost < dist[nx][ny]:
                        dist[nx][ny] = cost
                        # 0-1 BFS: appendleft for cost 0, append for cost 1
                        if grid[nx][ny] == 0:
                            dq.appendleft((nx, ny))
                        else:
                            dq.append((nx, ny))
        
        return dist[m - 1][n - 1]
```

## Explanation

This problem involves finding the minimum number of obstacles to remove to create a path from top-left to bottom-right of a grid.

1. **Model as shortest path**: Moving to an empty cell costs 0, moving to an obstacle costs 1 (for removal).

2. **0-1 BFS**: Use a deque for efficient shortest path with 0/1 costs:
   - Append to front for cost 0 (empty cell)
   - Append to back for cost 1 (obstacle)

3. **Initialize**: Set distance to (0, 0) as 0.

4. **Process cells**: For each cell, explore neighbors and update distances if shorter path found.

5. **Return**: Distance to `(m-1, n-1)` is the minimum removals.

## Complexity Analysis

- **Time Complexity:** O(m × n), as each cell is visited at most once
- **Space Complexity:** O(m × n), for the distance matrix and deque
