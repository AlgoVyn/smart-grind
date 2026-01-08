# Rotting Oranges

## Problem Description
[Link to problem](https://leetcode.com/problems/rotting-oranges/)

You are given an m x n grid where each cell can have one of three values:

0 representing an empty cell,
1 representing a fresh orange, or
2 representing a rotten orange.

Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.
Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.
 
Example 1:


Input: grid = [[2,1,1],[1,1,0],[0,1,1]]
Output: 4

Example 2:

Input: grid = [[2,1,1],[0,1,1],[1,0,1]]
Output: -1
Explanation: The orange in the bottom left corner (row 2, column 0) is never rotten, because rotting only happens 4-directionally.

Example 3:

Input: grid = [[0,2]]
Output: 0
Explanation: Since there are already no fresh oranges at minute 0, the answer is just 0.

 
Constraints:

m == grid.length
n == grid[i].length
1 <= m, n <= 10
grid[i][j] is 0, 1, or 2.


## Solution

```python
from typing import List
from collections import deque

class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        queue = deque()
        fresh = 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 2:
                    queue.append((i, j))
                elif grid[i][j] == 1:
                    fresh += 1
        if fresh == 0:
            return 0
        minutes = 0
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        while queue:
            size = len(queue)
            for _ in range(size):
                i, j = queue.popleft()
                for di, dj in directions:
                    ni, nj = i + di, j + dj
                    if 0 <= ni < m and 0 <= nj < n and grid[ni][nj] == 1:
                        grid[ni][nj] = 2
                        fresh -= 1
                        queue.append((ni, nj))
            if queue:
                minutes += 1
        return minutes if fresh == 0 else -1
```

## Explanation

This problem simulates the rotting of oranges using BFS, where rotten oranges infect adjacent fresh ones each minute.

### Step-by-Step Approach:

1. **Initialization**: Use a queue for BFS, starting with all rotten oranges (2). Count fresh oranges (1).

2. **Edge Case**: If no fresh oranges, return 0.

3. **BFS Simulation**:
   - While queue is not empty:
     - Process all oranges at current level (minute).
     - For each rotten orange, check 4 directions for fresh oranges.
     - If fresh, make it rotten, decrement fresh count, add to queue.
   - Increment minutes after each level.

4. **Result**: If fresh count is 0, return minutes; else -1.

### Time Complexity:
- O(m * n), as each cell is visited at most once.

### Space Complexity:
- O(m * n) for the queue in worst case.
