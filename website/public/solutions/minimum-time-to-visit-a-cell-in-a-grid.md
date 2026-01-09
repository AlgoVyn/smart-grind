# Minimum Time To Visit A Cell In A Grid

## Problem Description

You are given an `m x n` matrix `grid` consisting of non-negative integers where `grid[row][col]` represents the minimum time required to be able to visit the cell `(row, col)`, which means you can visit the cell `(row, col)` only when the time you visit it is greater than or equal to `grid[row][col]`.

You are standing in the top-left cell of the matrix in the 0th second, and you must move to any adjacent cell in the four directions: up, down, left, and right. Each move you make takes 1 second.

Return the minimum time required in which you can visit the bottom-right cell of the matrix. If you cannot visit the bottom-right cell, then return `-1`.

---

## Examples

### Example 1

**Input:**
```python
grid = [[0, 1, 3, 2], [5, 1, 2, 5], [4, 3, 8, 6]]
```

**Output:**
```python
7
```

**Explanation:**
One of the paths that we can take is:
- At t = 0: cell (0, 0)
- At t = 1: move to cell (0, 1) - possible because grid[0][1] <= 1
- At t = 2: move to cell (1, 1) - possible because grid[1][1] <= 2
- At t = 3: move to cell (1, 2) - possible because grid[1][2] <= 3
- At t = 4: move to cell (1, 1) - possible because grid[1][1] <= 4
- At t = 5: move to cell (1, 2) - possible because grid[1][2] <= 5
- At t = 6: move to cell (1, 3) - possible because grid[1][3] <= 6
- At t = 7: move to cell (2, 3) - possible because grid[2][3] <= 7

### Example 2

**Input:**
```python
grid = [[0, 2, 4], [3, 2, 1], [1, 0, 4]]
```

**Output:**
```python
-1
```

**Explanation:**
There is no path from the top left to the bottom-right cell.

---

## Constraints

- `m == grid.length`
- `n == grid[i].length`
- `2 <= m, n <= 1000`
- `4 <= m * n <= 10^5`
- `0 <= grid[i][j] <= 10^5`
- `grid[0][0] == 0`

---

## Solution

```python
import heapq
from typing import List

class Solution:
    def minimumTime(self, grid: List[List[int]]) -> int:
        """
        Find minimum time to reach bottom-right using Dijkstra's algorithm.
        
        Each cell has a minimum visit time; moves take 1 second.
        """
        if not grid or not grid[0]:
            return -1
        
        m, n = len(grid), len(grid[0])
        if m == 1 and n == 1:
            return 0
        
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        dist = [[float('inf')] * n for _ in range(m)]
        dist[0][0] = 0
        
        # Priority queue: (time, row, col)
        pq = [(0, 0, 0)]
        
        while pq:
            time, i, j = heapq.heappop(pq)
            if time > dist[i][j]:
                continue
            if i == m - 1 and j == n - 1:
                return time
            
            for di, dj in directions:
                ni, nj = i + di, j + dj
                if 0 <= ni < m and 0 <= nj < n:
                    # Time to reach neighbor = max(current_time + 1, grid[ni][nj])
                    new_time = max(time + 1, grid[ni][nj])
                    if new_time < dist[ni][nj]:
                        dist[ni][nj] = new_time
                        heapq.heappush(pq, (new_time, ni, nj))
        
        return -1
```

---

## Explanation

This problem requires finding the minimum time to reach the bottom-right cell, where each cell has a minimum visit time, and moves take 1 second.

1. **Dijkstra's algorithm**: Use a priority queue to find the shortest time path.

2. **Initialize**: Set distance to (0, 0) as 0.

3. **Process cells**: For each cell popped from the queue:
   - If it's the target, return the time
   - For each neighbor, calculate time to reach it: `max(current_time + 1, grid[ni][nj])`
   - If this time is less than the current distance, update and push to queue

4. **Return**: Time to reach target, or -1 if unreachable.

---

## Complexity Analysis

- **Time Complexity:** O((m × n) log(m × n)), due to priority queue operations
- **Space Complexity:** O(m × n), for the distance matrix and queue
