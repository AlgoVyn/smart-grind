# Swim in Rising Water

## Problem Description

You are given an n x n integer matrix `grid` where each value `grid[i][j]` represents the elevation at that point `(i, j)`.

It starts raining, and water gradually rises over time. At time `t`, the water level is `t`, meaning any cell with elevation less than equal to `t` is submerged or reachable.

You can swim from a square to another 4-directionally adjacent square if and only if the elevation of both squares individually are at most `t`. You can swim infinite distances in zero time. Of course, you must stay within the boundaries of the grid during your swim.

Return the minimum time until you can reach the bottom right square `(n - 1, n - 1)` if you start at the top left square `(0, 0)`.

**Link to problem:** [Swim in Rising Water - LeetCode 778](https://leetcode.com/problems/swim-in-rising-water/)

---

## Pattern: Binary Search + DFS / Dijkstra

This problem demonstrates the **Binary Search on Answer** pattern combined with **Graph Traversal**.

### Core Concept

The fundamental idea is:
- Binary search on the answer (time t)
- For each t, check if path exists using DFS/BFS
- Find minimum t where path is possible

---

## Examples

### Example

**Input:** grid = [[0,2],[1,3]]

**Output:** 3

**Explanation:**
At time 0, you are in grid location (0, 0).
You cannot go anywhere else because 4-directionally adjacent neighbors have a higher elevation than t = 0.
You cannot reach point (1, 1) until time 3.
When the depth of water is 3, we can swim anywhere inside the grid.

### Example 2

**Input:** grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]

**Output:** 16

**Explanation:** The final route is shown.
We need to wait until time 16 so that (0, 0) and (4, 4) are connected.

---

## Constraints

- `n == grid.length`
- `n == grid[i].length`
- `1 <= n <= 50`
- `0 <= grid[i][j] < n^2`
- Each value `grid[i][j]` is unique.

---

## Intuition

The problem finds the minimum time to swim from (0,0) to (n-1,n-1) in a grid where water rises over time. We can use binary search on time combined with BFS to check reachability.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Binary Search + DFS/BFS (Optimal)** - O(n² log(n²))
2. **Dijkstra's Algorithm** - O(n² log n)

---

## Approach 1: Binary Search + DFS/BFS

### Algorithm Steps

1. Set left = 0, right = n*n - 1 (max possible elevation)
2. While left < right:
   - Compute mid = (left + right) // 2
   - Use BFS to check if we can reach (n-1,n-1) at time mid
   - If reachable: right = mid
   - Else: left = mid + 1
3. Return left

### Code Implementation

````carousel
```python
from collections import deque
from typing import List

class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        """
        Find minimum time to swim from top-left to bottom-right.
        
        Args:
            grid: 2D elevation grid
            
        Returns:
            Minimum time required
        """
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

<!-- slide -->
```cpp
class Solution {
public:
    int swimInWater(vector<vector<int>>& grid) {
        int n = grid.size();
        
        auto canReach = [&](int t) {
            if (grid[0][0] > t) return false;
            vector<vector<bool>> visited(n, vector<bool>(n, false));
            queue<pair<int,int>> q;
            q.push({0, 0});
            visited[0][0] = true;
            
            int dirs[] = {0, 1, 0, -1, 0};
            while (!q.empty()) {
                auto [x, y] = q.front(); q.pop();
                if (x == n-1 && y == n-1) return true;
                for (int i = 0; i < 4; i++) {
                    int nx = x + dirs[i], ny = y + dirs[i+1];
                    if (nx >= 0 && nx < n && ny >= 0 && ny < n && 
                        !visited[nx][ny] && grid[nx][ny] <= t) {
                        visited[nx][ny] = true;
                        q.push({nx, ny});
                    }
                }
            }
            return false;
        };
        
        int left = 0, right = n * n - 1;
        while (left < right) {
            int mid = (left + right) / 2;
            if (canReach(mid)) right = mid;
            else left = mid + 1;
        }
        return left;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int swimInWater(int[][] grid) {
        int n = grid.length;
        
        int left = 0, right = n * n - 1;
        while (left < right) {
            int mid = (left + right) / 2;
            if (canReach(grid, mid)) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }
    
    private boolean canReach(int[][] grid, int t) {
        if (grid[0][0] > t) return false;
        int n = grid.length;
        boolean[][] visited = new boolean[n][n];
        Queue<int[]> q = new LinkedList<>();
        q.offer(new int[]{0, 0});
        visited[0][0] = true;
        
        int[][] dirs = {{0,1}, {1,0}, {0,-1}, {-1,0}};
        while (!q.isEmpty()) {
            int[] curr = q.poll();
            int x = curr[0], y = curr[1];
            if (x == n-1 && y == n-1) return true;
            for (int[] d : dirs) {
                int nx = x + d[0], ny = y + d[1];
                if (nx >= 0 && nx < n && ny >= 0 && ny < n && 
                    !visited[nx][ny] && grid[nx][ny] <= t) {
                    visited[nx][ny] = true;
                    q.offer(new int[]{nx, ny});
                }
            }
        }
        return false;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
var swimInWater = function(grid) {
    const n = grid.length;
    
    const canReach = (t) => {
        if (grid[0][0] > t) return false;
        const visited = Array.from({ length: n }, () => Array(n).fill(false));
        const queue = [[0, 0]];
        visited[0][0] = true;
        
        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        while (queue.length) {
            const [x, y] = queue.shift();
            if (x === n - 1 && y === n - 1) return true;
            for (const [dx, dy] of dirs) {
                const nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < n && ny >= 0 && ny < n && 
                    !visited[nx][ny] && grid[nx][ny] <= t) {
                    visited[nx][ny] = true;
                    queue.push([nx, ny]);
                }
            }
        }
        return false;
    };
    
    let left = 0, right = n * n - 1;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (canReach(mid)) right = mid;
        else left = mid + 1;
    }
    return left;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n² log(n²)) |
| **Space** | O(n²) |

---

## Approach 2: Dijkstra's Algorithm

### Code Implementation

````carousel
```python
import heapq

class Solution:
    def swimInWater_dijkstra(self, grid):
        n = len(grid)
        pq = [(grid[0][0], 0, 0)]
        visited = set()
        dirs = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        while pq:
            time, x, y = heapq.heappop(pq)
            if (x, y) in visited:
                continue
            visited.add((x, y))
            if x == n - 1 and y == n - 1:
                return time
            for dx, dy in dirs:
                nx, ny = x + dx, y + dy
                if 0 <= nx < n and 0 <= ny < n and (nx, ny) not in visited:
                    heapq.heappush(pq, (max(time, grid[nx][ny]), nx, ny))
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n² log n) |
| **Space** | O(n²) |

---

## Comparison of Approaches

| Aspect | Binary Search + BFS | Dijkstra |
|--------|---------------------|----------|
| **Time** | O(n² log n) | O(n² log n) |
| **Space** | O(n²) | O(n²) |
| **Implementation** | More intuitive | More direct |

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Path With Minimum Effort | [Link](https://leetcode.com/problems/path-with-minimum-effort/) | Similar binary search |
| Minimum Cost to Reach Destination | [Link](https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/) | Time-constrained path |
| Cheapest Flights Within K Stops | [Link](https://leetcode.com/problems/cheapest-flights-within-k-stops/) | Graph with constraints |

---

## Video Tutorial Links

- [NeetCode - Swim in Rising Water](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation
- [Binary Search on Answer](https://www.youtube.com/watch?v=5xM48W6yG-sE) - Understanding the pattern

---

## Follow-up Questions

### Q1: Why is binary search applicable here?

**Answer:** The answer is monotonic - if you can reach at time t, you can also reach at any time > t.

### Q2: How would you modify for 3D grid?

**Answer:** Same approach, just add another dimension to BFS/Dijkstra.

### Q3: Can you solve without binary search?

**Answer:** Yes, using Dijkstra's algorithm directly finds the minimum maximum elevation path.

---

## Common Pitfalls

### 1. Initial Check
**Issue**: Not checking if start elevation > t.
**Solution**: Return False early if grid[0][0] > t.

### 2. Boundary Conditions
**Issue**: Not checking all four directions correctly.
**Solution**: Use proper bounds checking for each neighbor.

### 3. Grid Values
**Issue**: Using wrong range for binary search.
**Solution**: Use 0 to n*n-1 as the range of possible times.

### 4. Queue Empty
**Issue**: Not handling when path is not possible at current time.
**Solution**: BFS returns False when queue is empty.

---

## Summary

The **Swim in Rising Water** problem demonstrates **Binary Search + Graph Traversal**:
- Binary search on answer (time t)
- BFS/DFS to check reachability at each time
- Find minimum t where path exists
- O(n² log n) time complexity

This problem teaches the important pattern of binary search on monotonic answers combined with graph algorithms.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/swim-in-rising-water/discuss/)
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/)
