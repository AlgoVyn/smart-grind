# 01 Matrix

## Problem Description
[Link to problem](https://leetcode.com/problems/01-matrix/)

Given an m x n binary matrix mat, return the distance of the nearest 0 for each cell.
The distance between two cells sharing a common edge is 1.
 
Example 1:


Input: mat = [[0,0,0],[0,1,0],[0,0,0]]
Output: [[0,0,0],[0,1,0],[0,0,0]]

Example 2:


Input: mat = [[0,0,0],[0,1,0],[1,1,1]]
Output: [[0,0,0],[0,1,0],[1,2,1]]

 
Constraints:

m == mat.length
n == mat[i].length
1 <= m, n <= 104
1 <= m * n <= 104
mat[i][j] is either 0 or 1.
There is at least one 0 in mat.

 
Note: This question is the same as 1765: https://leetcode.com/problems/map-of-highest-peak/


## Solution

```python
from typing import List
from collections import deque

class Solution:
    def updateMatrix(self, mat: List[List[int]]) -> List[List[int]]:
        if not mat or not mat[0]:
            return mat
        m, n = len(mat), len(mat[0])
        q = deque()
        for i in range(m):
            for j in range(n):
                if mat[i][j] == 0:
                    q.append((i, j))
                else:
                    mat[i][j] = -1
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        while q:
            x, y = q.popleft()
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if 0 <= nx < m and 0 <= ny < n and mat[nx][ny] == -1:
                    mat[nx][ny] = mat[x][y] + 1
                    q.append((nx, ny))
        return mat
```

## Explanation
This problem can be solved using Breadth-First Search (BFS) starting from all cells containing 0 simultaneously. We initialize a queue with all positions of 0s and mark all non-zero cells as -1 to indicate they haven't been visited yet.

For each cell dequeued, we explore its four neighbors. If a neighbor is within bounds and still marked as -1, we update its distance to the current cell's distance plus one and enqueue it.

This approach ensures that the distance to the nearest 0 is calculated correctly, as BFS guarantees the shortest path in an unweighted graph.

Time Complexity: O(m * n), where m and n are the dimensions of the matrix, since each cell is visited at most once.

Space Complexity: O(m * n) in the worst case for the queue.
