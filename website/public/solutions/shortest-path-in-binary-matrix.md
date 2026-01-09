# Shortest Path In Binary Matrix

## Problem Description
Given an n x n binary matrix grid, return the length of the shortest clear path in the matrix. If there is no clear path, return -1.
A clear path in a binary matrix is a path from the top-left cell (i.e., (0, 0)) to the bottom-right cell (i.e., (n - 1, n - 1)) such that:

All the visited cells of the path are 0.
All the adjacent cells of the path are 8-directionally connected (i.e., they are different and they share an edge or a corner).

The length of a clear path is the number of visited cells of this path.
 
Example 1:
Input: grid = [[0,1],[1,0]]
Output: 2

Example 2:
Input: grid = [[0,0,0],[1,1,0],[1,1,0]]
Output: 4

Example 3:

Input: grid = [[1,0,0],[1,1,0],[1,1,0]]
Output: -1

 
Constraints:

n == grid.length
n == grid[i].length
1 <= n <= 100
grid[i][j] is 0 or 1
## Solution

```python
from typing import List
from collections import deque

def shortestPathBinaryMatrix(grid: List[List[int]]) -> int:
    if not grid or grid[0][0] == 1:
        return -1

    n = len(grid)
    if n == 1:
        return 1

    directions = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
    queue = deque([(0, 0, 1)])  # (row, col, steps)
    visited = set([(0, 0)])

    while queue:
        r, c, steps = queue.popleft()
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0 and (nr, nc) not in visited:
                if nr == n - 1 and nc == n - 1:
                    return steps + 1
                visited.add((nr, nc))
                queue.append((nr, nc, steps + 1))

    return -1
```

## Explanation
To find the shortest path in a binary matrix from (0,0) to (n-1,n-1) through 0s with 8-directional movement, use BFS.

1. If grid is empty or start is 1, return -1. If n=1, return 1.
2. Use a queue for BFS: store (row, col, steps).
3. Use a visited set to avoid revisiting cells.
4. For each cell, explore 8 directions.
5. If neighbor is valid (in bounds, 0, not visited), enqueue with steps+1.
6. If reach (n-1,n-1), return steps+1.
7. If queue empties without finding, return -1.

BFS ensures shortest path in unweighted grid.

**Time Complexity:** O(n²), visit each cell at most once.
**Space Complexity:** O(n²), for queue and visited set.
