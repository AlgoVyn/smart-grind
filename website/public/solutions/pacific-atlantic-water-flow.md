# Pacific Atlantic Water Flow

## Problem Description

There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.

The island is partitioned into a grid of square cells. You are given an m x n integer matrix heights where `heights[r][c]` represents the height above sea level of the cell at coordinate `(r, c)`.

The island receives a lot of rain, and the rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is less than or equal to the current cell's height. Water can flow from any cell adjacent to an ocean into the ocean.

Return a 2D list of grid coordinates `result` where `result[i] = [ri, ci]` denotes that rain water can flow from cell `(ri, ci)` to both the Pacific and Atlantic oceans.

### Example 1

**Input:** `heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]`  
**Output:** `[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]`

**Explanation:** The following cells can flow to the Pacific and Atlantic oceans:

- `[0,4]`: `[0,4] -> Pacific Ocean` and `[0,4] -> Atlantic Ocean`
- `[1,3]`: `[1,3] -> [0,3] -> Pacific Ocean` and `[1,3] -> [1,4] -> Atlantic Ocean`
- `[1,4]`: `[1,4] -> [1,3] -> [0,3] -> Pacific Ocean` and `[1,4] -> Atlantic Ocean`
- `[2,2]`: `[2,2] -> [1,2] -> [0,2] -> Pacific Ocean` and `[2,2] -> [2,3] -> [2,4] -> Atlantic Ocean`
- `[3,0]`: `[3,0] -> Pacific Ocean` and `[3,0] -> [4,0] -> Atlantic Ocean`
- `[3,1]`: `[3,1] -> [3,0] -> Pacific Ocean` and `[3,1] -> [4,1] -> Atlantic Ocean`
- `[4,0]`: `[4,0] -> Pacific Ocean` and `[4,0] -> Atlantic Ocean`

Note that there are other possible paths for these cells to flow to the Pacific and Atlantic oceans.

### Example 2

**Input:** `heights = [[1]]`  
**Output:** `[[0,0]]`

**Explanation:** The water can flow from the only cell to the Pacific and Atlantic oceans.

### Constraints

- `m == heights.length`
- `n == heights[r].length`
- `1 <= m, n <= 200`
- `0 <= heights[r][c] <= 10^5`

## Solution

```python
class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        if not heights or not heights[0]:
            return []
        m, n = len(heights), len(heights[0])
        pac = [[False] * n for _ in range(m)]
        atl = [[False] * n for _ in range(m)]
        
        def dfs(i, j, visited, prev):
            if i < 0 or i >= m or j < 0 or j >= n or visited[i][j] or heights[i][j] < prev:
                return
            visited[i][j] = True
            dfs(i + 1, j, visited, heights[i][j])
            dfs(i - 1, j, visited, heights[i][j])
            dfs(i, j + 1, visited, heights[i][j])
            dfs(i, j - 1, visited, heights[i][j])
        
        # Pacific: top and left boundaries
        for i in range(m):
            dfs(i, 0, pac, heights[i][0])
        for j in range(n):
            dfs(0, j, pac, heights[0][j])
        
        # Atlantic: bottom and right boundaries
        for i in range(m):
            dfs(i, n - 1, atl, heights[i][n - 1])
        for j in range(n):
            dfs(m - 1, j, atl, heights[m - 1][j])
        
        result = []
        for i in range(m):
            for j in range(n):
                if pac[i][j] and atl[i][j]:
                    result.append([i, j])
        return result
```

## Explanation

Cells that can flow to both oceans are those reachable from both Pacific (top/left) and Atlantic (bottom/right) boundaries via decreasing or equal heights.

### Step-by-step Approach

1. Use two visited matrices for Pacific and Atlantic.
2. Perform DFS from Pacific boundaries (top row and left column), marking cells that can flow to Pacific.
3. Perform DFS from Atlantic boundaries (bottom row and right column), marking cells that can flow to Atlantic.
4. Collect cells marked in both.

### Complexity Analysis

- **Time Complexity:** O(m * n), as each cell is visited at most once per ocean.
- **Space Complexity:** O(m * n) for visited matrices and recursion stack.
