# Number Of Closed Islands

## Problem Description
[Link to problem](https://leetcode.com/problems/number-of-closed-islands/)

Given a 2D grid consists of 0s (land) and 1s (water).  An island is a maximal 4-directionally connected group of 0s and a closed island is an island totally (all left, top, right, bottom) surrounded by 1s.
Return the number of closed islands.
 
Example 1:


Input: grid = [[1,1,1,1,1,1,1,0],[1,0,0,0,0,1,1,0],[1,0,1,0,1,1,1,0],[1,0,0,0,0,1,0,1],[1,1,1,1,1,1,1,0]]
Output: 2
Explanation: 
Islands in gray are closed because they are completely surrounded by water (group of 1s).
Example 2:


Input: grid = [[0,0,1,0,0],[0,1,0,1,0],[0,1,1,1,0]]
Output: 1

Example 3:

Input: grid = [[1,1,1,1,1,1,1],
               [1,0,0,0,0,0,1],
               [1,0,1,1,1,0,1],
               [1,0,1,0,1,0,1],
               [1,0,1,1,1,0,1],
               [1,0,0,0,0,0,1],
               [1,1,1,1,1,1,1]]
Output: 2

 
Constraints:

1 <= grid.length, grid[0].length <= 100
0 <= grid[i][j] <=1


## Solution

```python
class Solution:
    def closedIsland(self, grid: List[List[int]]) -> int:
        if not grid or not grid[0]:
            return 0
        m, n = len(grid), len(grid[0])
        
        def dfs(i, j):
            if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] == 1:
                return
            grid[i][j] = 1
            dfs(i + 1, j)
            dfs(i - 1, j)
            dfs(i, j + 1)
            dfs(i, j - 1)
        
        # Mark all boundary-connected islands
        for i in range(m):
            dfs(i, 0)
            dfs(i, n - 1)
        for j in range(n):
            dfs(0, j)
            dfs(m - 1, j)
        
        # Count closed islands
        count = 0
        for i in range(1, m - 1):
            for j in range(1, n - 1):
                if grid[i][j] == 0:
                    dfs(i, j)
                    count += 1
        return count
```

## Explanation
A closed island is an island (group of 0s) that is not connected to the boundary of the grid. To count them, we first mark all islands connected to the boundary by performing DFS from the boundary cells and setting them to 1. Then, we iterate through the interior cells and count the remaining islands (groups of 0s) using DFS.

Step-by-step approach:
1. If the grid is empty, return 0.
2. Define a DFS function to mark visited cells (set to 1) and explore adjacent cells (up, down, left, right).
3. Perform DFS on all boundary cells (first and last row, first and last column) to mark boundary-connected islands.
4. Iterate through all interior cells (excluding boundaries).
5. For each unvisited 0, perform DFS to mark the entire island and increment the count.

Time Complexity: O(m * n), where m and n are the grid dimensions, as each cell is visited at most once.
Space Complexity: O(m * n) in the worst case for the recursion stack if the grid is filled with 0s.
