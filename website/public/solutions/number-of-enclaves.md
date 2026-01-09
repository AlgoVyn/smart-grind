# Number Of Enclaves

## Problem Description

You are given an m x n binary matrix grid, where 0 represents a sea cell and 1 represents a land cell.

A move consists of walking from one land cell to another adjacent (4-directionally) land cell or walking off the boundary of the grid.

Return the number of land cells in grid for which we cannot walk off the boundary of the grid in any number of moves.

---

## Examples

### Example 1

**Input:**
```python
grid = [[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]
```

**Output:**
```python
3
```

**Explanation:**
There are three 1s that are enclosed by 0s, and one 1 that is not enclosed because it's on the boundary.

### Example 2

**Input:**
```python
grid = [[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0]]
```

**Output:**
```python
0
```

**Explanation:**
All 1s are either on the boundary or can reach the boundary.

---

## Constraints

- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 500`
- `grid[i][j]` is either 0 or 1.

---

## Solution

```python
from typing import List

class Solution:
    def numEnclaves(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        
        def dfs(i, j):
            if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] == 0:
                return
            grid[i][j] = 0
            dfs(i + 1, j)
            dfs(i - 1, j)
            dfs(i, j + 1)
            dfs(i, j - 1)
        
        # Remove lands connected to boundary
        for i in range(m):
            if grid[i][0] == 1:
                dfs(i, 0)
            if grid[i][n - 1] == 1:
                dfs(i, n - 1)
        for j in range(n):
            if grid[0][j] == 1:
                dfs(0, j)
            if grid[m - 1][j] == 1:
                dfs(m - 1, j)
        
        # Count remaining lands
        count = 0
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 1:
                    count += 1
        return count
```

---

## Explanation

Enclaves are land cells (1s) that are not connected to the boundary. To count them, we first remove all lands connected to the boundary by performing DFS from boundary cells and marking them as visited (set to 0). Then, count the remaining 1s in the grid.

### Algorithm Steps

1. Define a DFS function to mark visited land cells and explore adjacent lands.

2. Perform DFS on all boundary cells (first/last row and column) to mark boundary-connected lands.

3. Iterate through all cells in the grid and count the remaining 1s, which are the enclaves.

---

## Complexity Analysis

- **Time Complexity:** O(m * n), as each cell is visited at most once.
- **Space Complexity:** O(m * n) for the recursion stack in the worst case.
