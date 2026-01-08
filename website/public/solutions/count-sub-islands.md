# Count Sub Islands

## Problem Description
[Link to problem](https://leetcode.com/problems/count-sub-islands/)

You are given two m x n binary matrices grid1 and grid2 containing only 0's (representing water) and 1's (representing land). An island is a group of 1's connected 4-directionally (horizontal or vertical). Any cells outside of the grid are considered water cells.
An island in grid2 is considered a sub-island if there is an island in grid1 that contains all the cells that make up this island in grid2.
Return the number of islands in grid2 that are considered sub-islands.
 
Example 1:


Input: grid1 = [[1,1,1,0,0],[0,1,1,1,1],[0,0,0,0,0],[1,0,0,0,0],[1,1,0,1,1]], grid2 = [[1,1,1,0,0],[0,0,1,1,1],[0,1,0,0,0],[1,0,1,1,0],[0,1,0,1,0]]
Output: 3
Explanation: In the picture above, the grid on the left is grid1 and the grid on the right is grid2.
The 1s colored red in grid2 are those considered to be part of a sub-island. There are three sub-islands.

Example 2:


Input: grid1 = [[1,0,1,0,1],[1,1,1,1,1],[0,0,0,0,0],[1,1,1,1,1],[1,0,1,0,1]], grid2 = [[0,0,0,0,0],[1,1,1,1,1],[0,1,0,1,0],[0,1,0,1,0],[1,0,0,0,1]]
Output: 2 
Explanation: In the picture above, the grid on the left is grid1 and the grid on the right is grid2.
The 1s colored red in grid2 are those considered to be part of a sub-island. There are two sub-islands.

 
Constraints:

m == grid1.length == grid2.length
n == grid1[i].length == grid2[i].length
1 <= m, n <= 500
grid1[i][j] and grid2[i][j] are either 0 or 1.


## Solution

```python
from typing import List

class Solution:
    def countSubIslands(self, grid1: List[List[int]], grid2: List[List[int]]) -> int:
        m, n = len(grid1), len(grid1[0])
        
        def dfs(i, j):
            if i < 0 or i >= m or j < 0 or j >= n or grid2[i][j] == 0:
                return True
            grid2[i][j] = 0  # mark as visited
            is_sub = (grid1[i][j] == 1)
            is_sub &= dfs(i + 1, j)
            is_sub &= dfs(i - 1, j)
            is_sub &= dfs(i, j + 1)
            is_sub &= dfs(i, j - 1)
            return is_sub
        
        count = 0
        for i in range(m):
            for j in range(n):
                if grid2[i][j] == 1:
                    if dfs(i, j):
                        count += 1
        return count
```

## Explanation
A sub-island in grid2 is an island that is completely contained within an island in grid1. To count such sub-islands, we perform DFS on each island in grid2 and check if every cell in that island has a corresponding 1 in grid1.

1. Define a DFS function that takes a cell (i, j) and returns whether the entire connected component (island) is a sub-island.
2. In DFS:
   - If out of bounds or water (0), return True (doesn't affect sub-island status).
   - Mark the cell as visited by setting grid2[i][j] = 0.
   - Check if grid1[i][j] is 1; this must be true for the island to be a sub-island.
   - Recursively check all four directions and combine the results with AND.
3. Iterate through all cells in grid2. For each unvisited land cell (1), start DFS and if it returns True, increment the count.
4. Return the count of sub-islands.

**Time Complexity**: O(m * n), as each cell is visited at most once.
**Space Complexity**: O(m * n), due to the recursion stack in the worst case (e.g., a large island).
