# Max Area of Island

## Problem Description

You are given an `m x n` binary matrix `grid`. An **island** is a group of `1`'s (representing land) connected 4-directionally (horizontal or vertical). You may assume all four edges of the grid are surrounded by water.

The **area** of an island is the number of cells with value `1` in the island.

Return the maximum area of an island in `grid`. If there is no island, return `0`.

---

## Examples

### Example 1

**Input:**
```python
grid = [
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]
]
```

**Output:**
```python
6
```

**Explanation:** The answer is not 11 because the island must be connected 4-directionally. The maximum island area is 6.

### Example 2

**Input:**
```python
grid = [[0, 0, 0, 0, 0, 0, 0, 0]]
```

**Output:**
```python
0
```

**Explanation:** There are no islands in the grid.

---

## Constraints

- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 50`
- `grid[i][j]` is either `0` or `1`

---

## Solution

```python
from typing import List

class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        if not grid or not grid[0]:
            return 0
        m, n = len(grid), len(grid[0])
        max_area = 0
        
        def dfs(i: int, j: int) -> int:
            if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] == 0:
                return 0
            grid[i][j] = 0  # Mark as visited
            return 1 + dfs(i + 1, j) + dfs(i - 1, j) + dfs(i, j + 1) + dfs(i, j - 1)
        
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 1:
                    max_area = max(max_area, dfs(i, j))
        
        return max_area
```

---

## Explanation

We use **Depth-First Search (DFS)** to explore each island and calculate its area.

### Key Idea

For each unvisited land cell (`1`), start a DFS to:
1. Count all connected land cells in 4 directions
2. Mark visited cells by setting them to `0`
3. Update the maximum area found

### Algorithm

1. Iterate through each cell in the grid
2. If the cell contains `1`, start DFS to explore the entire island
3. DFS returns the count of cells in the island
4. Update `max_area` with the largest count found
5. Return `max_area`

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(m * n)` — Each cell is visited at most once |
| **Space** | `O(m * n)` — Worst-case recursion stack for a grid filled with 1's |
