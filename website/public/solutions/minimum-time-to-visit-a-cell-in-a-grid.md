# Minimum Time To Visit A Cell In A Grid

## Problem Description
[Link to problem](https://leetcode.com/problems/minimum-time-to-visit-a-cell-in-a-grid/)

You are given a m x n matrix grid consisting of non-negative integers where grid[row][col] represents the minimum time required to be able to visit the cell (row, col), which means you can visit the cell (row, col) only when the time you visit it is greater than or equal to grid[row][col].
You are standing in the top-left cell of the matrix in the 0th second, and you must move to any adjacent cell in the four directions: up, down, left, and right. Each move you make takes 1 second.
Return the minimum time required in which you can visit the bottom-right cell of the matrix. If you cannot visit the bottom-right cell, then return -1.
 
Example 1:


Input: grid = [[0,1,3,2],[5,1,2,5],[4,3,8,6]]
Output: 7
Explanation: One of the paths that we can take is the following:
- at t = 0, we are on the cell (0,0).
- at t = 1, we move to the cell (0,1). It is possible because grid[0][1] <= 1.
- at t = 2, we move to the cell (1,1). It is possible because grid[1][1] <= 2.
- at t = 3, we move to the cell (1,2). It is possible because grid[1][2] <= 3.
- at t = 4, we move to the cell (1,1). It is possible because grid[1][1] <= 4.
- at t = 5, we move to the cell (1,2). It is possible because grid[1][2] <= 5.
- at t = 6, we move to the cell (1,3). It is possible because grid[1][3] <= 6.
- at t = 7, we move to the cell (2,3). It is possible because grid[2][3] <= 7.
The final time is 7. It can be shown that it is the minimum time possible.

Example 2:


Input: grid = [[0,2,4],[3,2,1],[1,0,4]]
Output: -1
Explanation: There is no path from the top left to the bottom-right cell.

 
Constraints:

m == grid.length
n == grid[i].length
2 <= m, n <= 1000
4 <= m * n <= 105
0 <= grid[i][j] <= 105
grid[0][0] == 0


## Solution

```python
import heapq
from typing import List

class Solution:
    def minimumTime(self, grid: List[List[int]]) -> int:
        if not grid or not grid[0]:
            return -1
        m, n = len(grid), len(grid[0])
        if m == 1 and n == 1:
            return 0
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        dist = [[float('inf')] * n for _ in range(m)]
        dist[0][0] = 0
        pq = [(0, 0, 0)]  # time, i, j
        while pq:
            time, i, j = heapq.heappop(pq)
            if time > dist[i][j]:
                continue
            if i == m - 1 and j == n - 1:
                return time
            for di, dj in directions:
                ni, nj = i + di, j + dj
                if 0 <= ni < m and 0 <= nj < n:
                    new_time = max(time + 1, grid[ni][nj])
                    if new_time < dist[ni][nj]:
                        dist[ni][nj] = new_time
                        heapq.heappush(pq, (new_time, ni, nj))
        return -1
```

## Explanation
This problem requires finding the minimum time to reach the bottom-right cell, where each cell has a minimum visit time, and moves take 1 second.

Use Dijkstra's algorithm with a priority queue to find the shortest time path.

Initialize a distance matrix with infinity, set dist[0][0] = 0.

Use a priority queue with (time, i, j), starting with (0, 0, 0).

While the queue is not empty:
- Pop the cell with smallest time.
- If it's the target, return the time.
- For each neighbor, calculate the time to reach it: max(current_time + 1, grid[ni][nj])
- If this time is less than dist[ni][nj], update and push to queue.

If cannot reach, return -1.

**Time Complexity:** O((m * n) log(m * n)), due to priority queue operations.
**Space Complexity:** O(m * n), for the distance matrix and queue.
