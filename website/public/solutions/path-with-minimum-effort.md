# Path With Minimum Effort

## Problem Description

You are a hiker preparing for an upcoming hike. You are given `heights`, a 2D array of size `rows x columns`, where `heights[row][col]` represents the height of cell `(row, col)`. You are situated in the top-left cell, `(0, 0)`, and you hope to travel to the bottom-right cell, `(rows-1, columns-1)` (i.e., 0-indexed).

You can move up, down, left, or right, and you wish to find a route that requires the minimum effort. A route's effort is the maximum absolute difference in heights between two consecutive cells of the route.

Return the minimum effort required to travel from the top-left cell to the bottom-right cell.

### Example 1

**Input:** `heights = [[1,2,2],[3,8,2],[5,3,5]]`  
**Output:** `2`

**Explanation:** The route of `[1,3,5,3,5]` has a maximum absolute difference of 2 in consecutive cells. This is better than the route of `[1,2,2,2,5]`, where the maximum absolute difference is 3.

### Example 2

**Input:** `heights = [[1,2,3],[3,8,4],[5,3,5]]`  
**Output:** `1`

**Explanation:** The route of `[1,2,3,4,5]` has a maximum absolute difference of 1 in consecutive cells, which is better than route `[1,3,5,3,5]`.

### Example 3

**Input:** `heights = [[1,2,1,1,1],[1,2,1,2,1],[1,2,1,2,1],[1,2,1,2,1],[1,1,1,2,1]]`  
**Output:** `0`

**Explanation:** This route does not require any effort.

### Constraints

- `rows == heights.length`
- `columns == heights[i].length`
- `1 <= rows, columns <= 100`
- `1 <= heights[i][j] <= 10^6`

---

## Solution

```python
from collections import deque

class Solution:
    def minimumEffortPath(self, heights: List[List[int]]) -> int:
        m, n = len(heights), len(heights[0])
        
        def can_reach(effort):
            visited = [[False] * n for _ in range(m)]
            q = deque([(0, 0)])
            visited[0][0] = True
            while q:
                x, y = q.popleft()
                if x == m-1 and y == n-1:
                    return True
                for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < m and 0 <= ny < n and not visited[nx][ny] and abs(heights[x][y] - heights[nx][ny]) <= effort:
                        visited[nx][ny] = True
                        q.append((nx, ny))
            return False
        
        left, right = 0, 10**6
        while left < right:
            mid = (left + right) // 2
            if can_reach(mid):
                right = mid
            else:
                left = mid + 1
        return left
```

---

## Explanation

Use binary search on the possible effort values (0 to 10^6). For each mid effort, check if there's a path from (0,0) to (m-1,n-1) where all consecutive height differences <= mid, using BFS for connectivity.

### Step-by-step Approach

1. Set search range for effort from 0 to 10^6.
2. Use binary search to find the minimum effort.
3. For each mid value, use BFS to check if a path exists where all height differences <= mid.
4. Return the minimum effort that allows a valid path.

### Complexity Analysis

- **Time Complexity:** O(log(10^6) * m * n)
- **Space Complexity:** O(m * n)
