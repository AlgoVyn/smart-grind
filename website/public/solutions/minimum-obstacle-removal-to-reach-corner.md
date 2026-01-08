# Minimum Obstacle Removal To Reach Corner

## Problem Description
[Link to problem](https://leetcode.com/problems/minimum-obstacle-removal-to-reach-corner/)

You are given a 0-indexed 2D integer array grid of size m x n. Each cell has one of two values:

0 represents an empty cell,
1 represents an obstacle that may be removed.

You can move up, down, left, or right from and to an empty cell.
Return the minimum number of obstacles to remove so you can move from the upper left corner (0, 0) to the lower right corner (m - 1, n - 1).
 
Example 1:


Input: grid = [[0,1,1],[1,1,0],[1,1,0]]
Output: 2
Explanation: We can remove the obstacles at (0, 1) and (0, 2) to create a path from (0, 0) to (2, 2).
It can be shown that we need to remove at least 2 obstacles, so we return 2.
Note that there may be other ways to remove 2 obstacles to create a path.

Example 2:


Input: grid = [[0,1,0,0,0],[0,1,0,1,0],[0,0,0,1,0]]
Output: 0
Explanation: We can move from (0, 0) to (2, 4) without removing any obstacles, so we return 0.

 
Constraints:

m == grid.length
n == grid[i].length
1 <= m, n <= 105
2 <= m * n <= 105
grid[i][j] is either 0 or 1.
grid[0][0] == grid[m - 1][n - 1] == 0


## Solution

```python
from typing import List
from collections import deque

class Solution:
    def minimumObstacles(self, grid: List[List[int]]) -> int:
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
                        if grid[nx][ny] == 0:
                            dq.appendleft((nx, ny))
                        else:
                            dq.append((nx, ny))
        return dist[m-1][n-1]
```

## Explanation
This problem involves finding the minimum number of obstacles to remove to create a path from the top-left to the bottom-right of a grid. Each cell is either empty (0) or an obstacle (1), and we can move to adjacent cells (up, down, left, right).

We model this as a shortest path problem where moving to an empty cell costs 0, and moving to an obstacle cell costs 1 (representing removal). Since costs are only 0 or 1, we use 0-1 BFS with a deque: append to the front for cost 0, to the back for cost 1.

Initialize a distance matrix with infinity, set dist[0][0] = 0. Use a deque starting with (0,0). For each cell, explore neighbors, update distance if a shorter path is found.

The minimum removals is the distance to (m-1, n-1).

**Time Complexity:** O(m * n), as each cell is visited at most once.
**Space Complexity:** O(m * n), for the distance matrix and deque.
