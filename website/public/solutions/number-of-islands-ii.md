# Number Of Islands Ii

## Problem Description

You are given an m x n binary matrix land and an integer number of positions. Initially, all cells are water (0). You need to add land (1) to the cells specified in positions one by one. After each addition, you need to return the number of islands in the grid.

An island is a group of connected lands (1s) connected horizontally or vertically.

## Examples

### Example 1

**Input:**
```python
m = 3, n = 3, positions = [[0,0],[0,1],[1,2],[2,1]]
```

**Output:**
```python
[1, 1, 2, 3]
```

**Explanation:**
- After adding land at [0,0]: 1 island
- After adding land at [0,1]: 1 island (connected to [0,0])
- After adding land at [1,2]: 2 islands (new island)
- After adding land at [2,1]: 3 islands (new island)

### Example 2

**Input:**
```python
m = 2, n = 2, positions = [[0,0],[0,1],[1,1]]
```

**Output:**
```python
[1, 2, 1]
```

**Explanation:**
- After adding land at [0,0]: 1 island
- After adding land at [0,1]: 2 islands (new island)
- After adding land at [1,1]: 1 island (merged with [0,1])

## Constraints

- `1 <= m, n <= 10^4`
- `1 <= positions.length <= 10^4`
- `positions[i]` is a valid position `[x, y]` where `0 <= x < m` and `0 <= y < n`

## Solution

```python
from typing import List

class Solution:
    def numIslands2(self, m: int, n: int, positions: List[List[int]]) -> List[int]:
        parent = {}
        rank = {}
        count = 0
        result = []
        
        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        def union(x, y):
            px, py = find(x), find(y)
            if px != py:
                if rank.get(px, 0) > rank.get(py, 0):
                    parent[py] = px
                elif rank.get(px, 0) < rank.get(py, 0):
                    parent[px] = py
                else:
                    parent[py] = px
                    rank[px] = rank.get(px, 0) + 1
                nonlocal count
                count -= 1
        
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        for x, y in positions:
            pos = (x, y)
            if pos in parent:
                result.append(count)
                continue
            parent[pos] = pos
            rank[pos] = 0
            count += 1
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                npos = (nx, ny)
                if 0 <= nx < m and 0 <= ny < n and npos in parent:
                    union(pos, npos)
            result.append(count)
        return result
```

## Explanation

This problem involves dynamically adding lands to a grid and tracking the number of islands after each addition. We use Union-Find to manage components.

### Algorithm Steps

1. Initialize parent and rank dictionaries for Union-Find, and a count of islands.

2. For each position in the list:
   - If the position is already land, append current count to result.
   - Otherwise, add it as a new component, increment count.
   - Check all four directions for existing neighbors; if found, union with them, decrementing count if merged.
   - Append the current count to result.

## Complexity Analysis

- **Time Complexity:** O(len(positions) * α(m*n)), where α is nearly constant, as each union operation is efficient.
- **Space Complexity:** O(m * n) for the parent and rank structures.
