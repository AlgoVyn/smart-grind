# Shortest Path in Binary Matrix

## Problem Description

Given an `n x n` binary matrix `grid`, return the length of the shortest clear path in the matrix. If there is no clear path, return `-1`.

A clear path in a binary matrix is a path from the top-left cell `(0, 0)` to the bottom-right cell `(n-1, n-1)` such that:

1. All the visited cells of the path are `0`.
2. All the adjacent cells of the path are 8-directionally connected (they share an edge or a corner).

The length of a clear path is the number of visited cells.

### Examples

**Example 1:**
- Input: `grid = [[0,1],[1,0]]`
- Output: `2`

**Example 2:**
- Input: `grid = [[0,0,0],[1,1,0],[1,1,0]]`
- Output: `4`

**Example 3:**
- Input: `grid = [[1,0,0],[1,1,0],[1,1,0]]`
- Output: `-1`

### Constraints

- `n == grid.length`
- `n == grid[i].length`
- `1 <= n <= 100`
- `grid[i][j]` is `0` or `1`

---

## Solution

```python
from typing import List
from collections import deque

def shortestPathBinaryMatrix(grid: List[List[int]]) -> int:
    if not grid or grid[0][0] == 1:
        return -1

    n = len(grid)
    if n == 1:
        return 1

    directions = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
    queue = deque([(0, 0, 1)])  # (row, col, steps)
    visited = set([(0, 0)])

    while queue:
        r, c, steps = queue.popleft()
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0 and (nr, nc) not in visited:
                if nr == n - 1 and nc == n - 1:
                    return steps + 1
                visited.add((nr, nc))
                queue.append((nr, nc, steps + 1))

    return -1
```

---

## Explanation

To find the shortest path in a binary matrix from `(0,0)` to `(n-1,n-1)` through `0`s with 8-directional movement, use BFS.

### Approach

Breadth-First Search (BFS) ensures the shortest path in an unweighted grid.

### Algorithm Steps

1. **Edge Cases**: If grid is empty or start cell is `1`, return `-1`. If `n == 1`, return `1`.
2. **Initialize**: Set up directions array and queue with `(0, 0, 1)`.
3. **Track Visited**: Use a set to avoid revisiting cells.
4. **Process Queue**:
   - Dequeue current cell.
   - Explore all 8 directions.
   - If neighbor is valid (in bounds, `0`, not visited):
     - If it's the destination, return `steps + 1`.
     - Otherwise, mark as visited and enqueue with `steps + 1`.
5. **Return**: `-1` if queue empties without finding destination.

### Time Complexity

- **O(n²)**, visit each cell at most once.

### Space Complexity

- **O(n²)**, for queue and visited set.
