# Number Of Islands Ii

## Problem Description
## Solution

```python
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

Step-by-step approach:
1. Initialize parent and rank dictionaries for Union-Find, and a count of islands.
2. For each position in the list:
   - If the position is already land, append current count to result.
   - Otherwise, add it as a new component, increment count.
   - Check all four directions for existing neighbors; if found, union with them, decrementing count if merged.
   - Append the current count to result.

Time Complexity: O(len(positions) * α(m*n)), where α is nearly constant, as each union operation is efficient.
Space Complexity: O(m * n) for the parent and rank structures.
