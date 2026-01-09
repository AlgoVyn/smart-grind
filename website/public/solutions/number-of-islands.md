# Number Of Islands

## Problem Description

Given an m x n 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

---

## Examples

### Example 1

**Input:**
```python
grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
```

**Output:**
```python
1
```

### Example 2

**Input:**
```python
grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
```

**Output:**
```python
3
```

---

## Constraints

- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 300`
- `grid[i][j]` is '0' or '1'.

---

## Solution

```python
from typing import List

class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        if not grid:
            return 0
        m, n = len(grid), len(grid[0])
        count = 0
        
        def dfs(i, j):
            if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] == '0':
                return
            grid[i][j] = '0'
            dfs(i + 1, j)
            dfs(i - 1, j)
            dfs(i, j + 1)
            dfs(i, j - 1)
        
        for i in range(m):
            for j in range(n):
                if grid[i][j] == '1':
                    dfs(i, j)
                    count += 1
        return count
```

---

## Explanation

An island is a group of connected '1's (lands) surrounded by '0's (water). We use DFS to traverse and mark visited lands.

### Algorithm Steps

1. If the grid is empty, return 0.

2. Define a DFS function to mark a land cell as visited ('0') and recursively visit adjacent lands (up, down, left, right).

3. Iterate through each cell in the grid.

4. When a '1' is found, perform DFS to mark the entire island and increment the island count.

---

## Complexity Analysis

- **Time Complexity:** O(m * n), as each cell is visited at most once.
- **Space Complexity:** O(m * n) for the recursion stack in the worst case (e.g., all cells are land).
