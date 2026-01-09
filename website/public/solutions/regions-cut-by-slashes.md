# Regions Cut By Slashes

## Problem Description

An `n x n` grid is composed of `1 x 1` squares where each `1 x 1` square consists of a `'/'`, `'\'`, or blank space `' '`. These characters divide the square into contiguous regions.

Given the grid `grid` represented as a string array, return the number of regions.

Note that backslash characters are escaped, so a `'\'` is represented as `'\\'`.

### Example 1

**Input:**
```
grid = [" /","/ "]
```

**Output:**
```
2
```

### Example 2

**Input:**
```
grid = [" /","  "]
```

**Output:**
```
1
```

### Example 3

**Input:**
```
grid = ["/\\","\\/"]
```

**Output:**
```
5
```

**Explanation:** Recall that because `\` characters are escaped, `"\\/"` refers to `\/`, and `"/\\"` refers to `/\`.

### Constraints

- `n == grid.length == grid[i].length`
- `1 <= n <= 30`
- `grid[i][j]` is either `'/'`, `'\'`, or `' '`.

## Solution

```python
class Solution:
    def regionsBySlashes(self, grid: List[str]) -> int:
        n = len(grid)
        parent = list(range(n * n * 4))
        
        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        def union(x, y):
            px, py = find(x), find(y)
            if px != py:
                parent[px] = py
        
        for i in range(n):
            for j in range(n):
                idx = (i * n + j) * 4
                if grid[i][j] == '/':
                    union(idx, idx + 3)
                    union(idx + 1, idx + 2)
                elif grid[i][j] == '\\':
                    union(idx, idx + 1)
                    union(idx + 2, idx + 3)
                else:
                    union(idx, idx + 1)
                    union(idx + 1, idx + 2)
                    union(idx + 2, idx + 3)
                
                if j + 1 < n:
                    union(idx + 1, (i * n + j + 1) * 4 + 3)
                if i + 1 < n:
                    union(idx + 2, ((i + 1) * n + j) * 4)
        
        return sum(1 for i in range(len(parent)) if parent[i] == i)
```

## Explanation

Model each cell as 4 triangles (top, right, bottom, left). Use Union-Find to connect triangles based on slashes and adjacent cells. Count the number of connected components to get the number of regions.

**Time Complexity:** O(n²)

**Space Complexity:** O(n²)
