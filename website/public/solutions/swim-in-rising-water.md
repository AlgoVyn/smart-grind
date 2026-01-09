# Swim in Rising Water

## Problem Description

You are given an n x n integer matrix `grid` where each value `grid[i][j]` represents the elevation at that point `(i, j)`.

It starts raining, and water gradually rises over time. At time `t`, the water level is `t`, meaning any cell with elevation less than equal to `t` is submerged or reachable.

You can swim from a square to another 4-directionally adjacent square if and only if the elevation of both squares individually are at most `t`. You can swim infinite distances in zero time. Of course, you must stay within the boundaries of the grid during your swim.

Return the minimum time until you can reach the bottom right square `(n - 1, n - 1)` if you start at the top left square `(0, 0)`.

**Example 1:**

Input: `grid = [[0,2],[1,3]]`
Output: `3`

Explanation:
At time 0, you are in grid location (0, 0).
You cannot go anywhere else because 4-directionally adjacent neighbors have a higher elevation than t = 0.
You cannot reach point (1, 1) until time 3.
When the depth of water is 3, we can swim anywhere inside the grid.

**Example 2:**

Input: `grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]`
Output: `16`

Explanation: The final route is shown.
We need to wait until time 16 so that (0, 0) and (4, 4) are connected.

## Constraints

- `n == grid.length`
- `n == grid[i].length`
- `1 <= n <= 50`
- `0 <= grid[i][j] < n^2`
- Each value `grid[i][j]` is unique.

## Solution

```python
from collections import deque

def swimInWater(grid):
    n = len(grid)

    def can_reach(t):
        if grid[0][0] > t:
            return False
        visited = [[False] * n for _ in range(n)]
        queue = deque([(0, 0)])
        visited[0][0] = True
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        while queue:
            x, y = queue.popleft()
            if x == n - 1 and y == n - 1:
                return True
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if 0 <= nx < n and 0 <= ny < n and not visited[nx][ny] and grid[nx][ny] <= t:
                    visited[nx][ny] = True
                    queue.append((nx, ny))
        return False

    left, right = 0, n * n - 1
    while left < right:
        mid = (left + right) // 2
        if can_reach(mid):
            right = mid
        else:
            left = mid + 1
    return left
```

## Explanation

This problem finds the minimum time `t` to swim from `(0,0)` to `(n-1,n-1)` in a grid where water rises over time. It uses binary search on the time `t` combined with BFS to check reachability.

### Step-by-Step Approach:

1. **Binary Search on Time:**
   - Set `left = 0`, `right = n*n - 1` (max possible elevation).
   - While `left < right`, compute `mid = (left + right) // 2`.
   - Use a helper function to check if we can reach `(n-1,n-1)` at time `mid`.

2. **Reachability Check (BFS):**
   - If `grid[0][0] > t`, return `False`.
   - Initialize visited matrix and queue with `(0,0)`.
   - While queue is not empty:
     - Dequeue current position.
     - If it's `(n-1,n-1)`, return `True`.
     - For each adjacent cell, if within bounds, not visited, and `grid[nx][ny] <= t`, mark visited and enqueue.
   - If queue empties without reaching end, return `False`.

3. **Adjust Binary Search:**
   - If `can_reach(mid)` is `True`, set `right = mid` (try smaller `t`).
   - Else, set `left = mid + 1`.

4. **Return Result:**
   - When `left == right`, return `left` as the minimum `t`.

### Time Complexity:

- O(n^2 log(n^2)), due to binary search (log(n^2)) and BFS (O(n^2)) per check.

### Space Complexity:

- O(n^2), for the visited matrix and queue.
