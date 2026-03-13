# Minimum Obstacle Removal to Reach Corner

## Problem Description

You are given a 0-indexed 2D integer array `grid` of size `m x n`. Each cell has one of two values:
- `0` represents an empty cell
- `1` represents an obstacle that may be removed

You can move up, down, left, or right from and to an empty cell. Return the minimum number of obstacles to remove so you can move from the upper left corner `(0, 0)` to the lower right corner `(m - 1, n - 1)`.

**Link to problem:** [Minimum Obstacle Removal to Reach Corner - LeetCode 2290](https://leetcode.com/problems/minimum-obstacle-removal-to-reach-corner/)

---

## Pattern: 0-1 BFS

This problem demonstrates the **0-1 BFS** pattern, which is a variant of BFS optimized for graphs where edge weights are either 0 or 1.

### Core Concept

The fundamental idea is:
- Use a deque (double-ended queue) for 0-1 BFS
- Moving to an empty cell (0) has cost 0
- Moving to an obstacle (1) has cost 1
- Always process 0-cost edges first by appending to front of deque

---

## Examples

### Example

**Input:**
```
grid = [[0, 1, 1], [1, 1, 0], [1, 1, 0]]
```

**Output:**
```
2
```

**Explanation:**
We can remove the obstacles at (0, 1) and (0, 2) to create a path from (0, 0) to (2, 2). It can be shown that we need to remove at least 2 obstacles.

### Example 2

**Input:**
```
grid = [[0, 1, 0, 0, 0], [0, 1, 0, 1, 0], [0, 0, 0, 1, 0]]
```

**Output:**
```
0
```

**Explanation:**
We can move from (0, 0) to (2, 4) without removing any obstacles.

### Example 3

**Input:**
```
grid = [[0, 1, 0, 1, 1], [0, 0, 0, 1, 1], [1, 1, 1, 1, 1], [0, 0, 0, 0, 0]]
```

**Output:**
```
2
```

**Explanation:**
Remove obstacles at (0, 1) and (3, 4) to reach the destination.

---

## Constraints

- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 10^5`
- `2 <= m * n <= 10^5`
- `grid[i][j]` is either `0` or `1`
- `grid[0][0] == grid[m - 1][n - 1] == 0`

---

## Intuition

The key insight is that moving to an empty cell costs 0 while moving to an obstacle costs 1. This is a perfect use case for 0-1 BFS, which can find the shortest path in O(V + E) time for graphs with 0/1 edge weights.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **0-1 BFS** - O(m × n) time (Optimal)
2. **Dijkstra's Algorithm** - Alternative approach using priority queue

---

## Approach 1: 0-1 BFS (Optimal)

### Algorithm Steps

1. Initialize distance matrix with infinity
2. Set distance at (0, 0) to 0
3. Use a deque, starting with (0, 0)
4. While deque is not empty:
   - Pop from front
   - For each neighbor:
     - Calculate new cost = current cost + grid value
     - If new cost is less than existing distance, update and add to deque:
       - Append to front if grid value is 0
       - Append to back if grid value is 1
5. Return distance at (m-1, n-1)

### Why It Works

0-1 BFS works because we always process nodes with lower costs first. When we encounter a 0-cost move, we add it to the front to process next; for 1-cost moves, we add to the back. This ensures we explore in order of increasing cost.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def minimumObstacles(self, grid: List[List[int]]) -> int:
        """
        Find minimum obstacles to remove using 0-1 BFS.
        
        Args:
            grid: 2D grid with 0 (empty) and 1 (obstacle)
            
        Returns:
            Minimum obstacles to remove
        """
        m, n = len(grid), len(grid[0])
        
        # Distance matrix
        dist = [[float('inf')] * n for _ in range(m)]
        dist[0][0] = 0
        
        # 0-1 BFS with deque
        dq = deque([(0, 0)])
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        while dq:
            x, y = dq.popleft()
            
            # Early exit if we reached destination
            if x == m - 1 and y == n - 1:
                return dist[x][y]
            
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                
                # Check bounds
                if 0 <= nx < m and 0 <= ny < n:
                    new_cost = dist[x][y] + grid[nx][ny]
                    
                    if new_cost < dist[nx][ny]:
                        dist[nx][ny] = new_cost
                        if grid[nx][ny] == 0:
                            dq.appendleft((nx, ny))  # 0-cost move
                        else:
                            dq.append((nx, ny))  # 1-cost move
        
        return dist[m - 1][n - 1]
```

<!-- slide -->
```cpp
class Solution {
public:
    int minimumObstacles(vector<vector<int>>& grid) {
        /**
         * Find minimum obstacles to remove using 0-1 BFS.
         * 
         * Args:
         *     grid: 2D grid with 0 (empty) and 1 (obstacle)
         * 
         * Returns:
         *     Minimum obstacles to remove
         */
        int m = grid.size(), n = grid[0].size();
        vector<vector<int>> dist(m, vector<int>(n, INT_MAX));
        dist[0][0] = 0;
        
        deque<pair<int, int>> dq;
        dq.push_back({0, 0});
        
        vector<pair<int, int>> dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        while (!dq.empty()) {
            auto [x, y] = dq.front();
            dq.pop_front();
            
            if (x == m - 1 && y == n - 1) {
                return dist[x][y];
            }
            
            for (auto [dx, dy] : dirs) {
                int nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
                    int new_cost = dist[x][y] + grid[nx][ny];
                    if (new_cost < dist[nx][ny]) {
                        dist[nx][ny] = new_cost;
                        if (grid[nx][ny] == 0) {
                            dq.push_front({nx, ny});
                        } else {
                            dq.push_back({nx, ny});
                        }
                    }
                }
            }
        }
        
        return dist[m - 1][n - 1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minimumObstacles(int[][] grid) {
        /**
         * Find minimum obstacles to remove using 0-1 BFS.
         * 
         * Args:
         *     grid: 2D grid with 0 (empty) and 1 (obstacle)
         * 
         * Returns:
         *     Minimum obstacles to remove
         */
        int m = grid.length, n = grid[0].length;
        int[][] dist = new int[m][n];
        for (int[] row : dist) {
            Arrays.fill(row, Integer.MAX_VALUE);
        }
        dist[0][0] = 0;
        
        Deque<int[]> dq = new ArrayDeque<>();
        dq.addLast(new int[]{0, 0});
        
        int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        while (!dq.isEmpty()) {
            int[] cur = dq.pollFirst();
            int x = cur[0], y = cur[1];
            
            if (x == m - 1 && y == n - 1) {
                return dist[x][y];
            }
            
            for (int[] dir : dirs) {
                int nx = x + dir[0], ny = y + dir[1];
                if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
                    int newCost = dist[x][y] + grid[nx][ny];
                    if (newCost < dist[nx][ny]) {
                        dist[nx][ny] = newCost;
                        if (grid[nx][ny] == 0) {
                            dq.addFirst(new int[]{nx, ny});
                        } else {
                            dq.addLast(new int[]{nx, ny});
                        }
                    }
                }
            }
        }
        
        return dist[m - 1][n - 1];
    }
}
```

<!-- slide -->
```javascript
/**
 * Find minimum obstacles to remove using 0-1 BFS.
 * 
 * @param {number[][]} grid - 2D grid with 0 (empty) and 1 (obstacle)
 * @return {number} - Minimum obstacles to remove
 */
var minimumObstacles = function(grid) {
    const m = grid.length, n = grid[0].length;
    const dist = Array.from({length: m}, () => Array(n).fill(Infinity));
    dist[0][0] = 0;
    
    const dq = [[0, 0]];
    let front = 0;
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    while (front < dq.length) {
        const [x, y] = dq[front++];
        
        if (x === m - 1 && y === n - 1) {
            return dist[x][y];
        }
        
        for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
                const newCost = dist[x][y] + grid[nx][ny];
                if (newCost < dist[nx][ny]) {
                    dist[nx][ny] = newCost;
                    if (grid[nx][ny] === 0) {
                        dq.splice(front, 0, [nx, ny]);
                    } else {
                        dq.push([nx, ny]);
                    }
                }
            }
        }
    }
    
    return dist[m - 1][n - 1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - Each cell visited at most once |
| **Space** | O(m × n) - Distance matrix and deque |

---

## Approach 2: Dijkstra's Algorithm (Alternative)

### Algorithm Steps

1. Use a priority queue ordered by minimum cost
2. Each cell has cost = 0 for empty, 1 for obstacle
3. Standard Dijkstra: pop min cost cell, relax neighbors
4. Continue until reaching bottom-right corner

### Why It Works

Dijkstra's algorithm finds the shortest path in a weighted graph. Here, traversing an obstacle has weight 1, and empty cell has weight 0.

### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def minimumObstacles(self, grid: List[List[int]]) -> int:
        """
        Find minimum obstacles to remove using Dijkstra.
        
        Args:
            grid: 2D array where 0 = empty, 1 = obstacle
            
        Returns:
            Minimum obstacles to remove
        """
        m, n = len(grid), len(grid[0])
        
        # Distance matrix
        dist = [[float('inf')] * n for _ in range(m)]
        dist[0][0] = 0
        
        # Priority queue: (cost, row, col)
        pq = [(0, 0, 0)]
        
        # Directions: up, down, left, right
        dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        
        while pq:
            cost, r, c = heapq.heappop(pq)
            
            # Skip if we've found better path
            if cost > dist[r][c]:
                continue
            
            # Reached destination
            if r == m - 1 and c == n - 1:
                return cost
            
            # Explore neighbors
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n:
                    new_cost = cost + grid[nr][nc]
                    if new_cost < dist[nr][nc]:
                        dist[nr][nc] = new_cost
                        heapq.heappush(pq, (new_cost, nr, nc))
        
        return -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int minimumObstacles(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        
        // Distance matrix
        vector<vector<int>> dist(m, vector<int>(n, INT_MAX));
        dist[0][0] = 0;
        
        // Priority queue: (cost, row, col)
        using tuple3 = tuple<int, int, int>;
        priority_queue<tuple3, vector<tuple3>, greater<tuple3>> pq;
        pq.emplace(0, 0, 0);
        
        // Directions
        vector<pair<int, int>> dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        
        while (!pq.empty()) {
            auto [cost, r, c] = pq.top();
            pq.pop();
            
            if (cost > dist[r][c]) continue;
            
            if (r == m - 1 && c == n - 1) return cost;
            
            for (auto [dr, dc] : dirs) {
                int nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                    int newCost = cost + grid[nr][nc];
                    if (newCost < dist[nr][nc]) {
                        dist[nr][nc] = newCost;
                        pq.emplace(newCost, nr, nc);
                    }
                }
            }
        }
        
        return -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minimumObstacles(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        
        // Distance matrix
        int[][] dist = new int[m][n];
        for (int[] row : dist) {
            Arrays.fill(row, Integer.MAX_VALUE);
        }
        dist[0][0] = 0;
        
        // Priority queue
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.add(new int[]{0, 0, 0});
        
        // Directions
        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int cost = curr[0], r = curr[1], c = curr[2];
            
            if (cost > dist[r][c]) continue;
            
            if (r == m - 1 && c == n - 1) return cost;
            
            for (int[] d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                    int newCost = cost + grid[nr][nc];
                    if (newCost < dist[nr][nc]) {
                        dist[nr][nc] = newCost;
                        pq.add(new int[]{newCost, nr, nc});
                    }
                }
            }
        }
        
        return -1;
    }
}
```

<!-- slide -->
```javascript
var minimumObstacles = function(grid) {
    const m = grid.length, n = grid[0].length;
    
    // Distance matrix
    const dist = Array.from({length: m}, () => Array(n).fill(Infinity));
    dist[0][0] = 0;
    
    // Priority queue
    const pq = [[0, 0, 0]];
    
    // Directions
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [cost, r, c] = pq.shift();
        
        if (cost > dist[r][c]) continue;
        
        if (r === m - 1 && c === n - 1) return cost;
        
        for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                const newCost = cost + grid[nr][nc];
                if (newCost < dist[nr][nc]) {
                    dist[nr][nc] = newCost;
                    pq.push([newCost, nr, nc]);
                }
            }
        }
    }
    
    return -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n × log(m × n)) - Priority queue operations |
| **Space** | O(m × n) - Distance matrix |

---

## Comparison of Approaches

| Aspect | 0-1 BFS | Dijkstra's |
|--------|----------|------------|
| **Time** | O(m × n) | O(m × n × log(m × n)) |
| **Space** | O(m × n) | O(m × n) |
| **Implementation** | Deque | Priority queue |
| **Best for** | 0-1 weights | General weights |

---

## Related Problems

Based on similar themes (0-1 BFS, shortest path):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Shortest Path in Binary Matrix | [Link](https://leetcode.com/problems/shortest-path-in-binary-matrix/) | BFS shortest path |
| Minimum Cost to Reach Destination | [Link](https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/) | 0-1 BFS |
| Path With Minimum Effort | [Link](https://leetcode.com/problems/path-with-minimum-effort/) | Similar grid path |
| Cheapest Flight Within K Stops | [Link](https://leetcode.com/problems/cheapest-flight-within-k-stops/) | Weighted BFS |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### 0-1 BFS

- [NeetCode - Minimum Obstacle Removal](https://www.youtube.com/watch?v=R_MLCuG2Sts) - Clear explanation
- [0-1 BFS Pattern](https://www.youtube.com/watch?v=3CY7B8ISFu8) - Understanding 0-1 BFS
- [Deque for BFS](https://www.youtube.com/watch?v=3CY7B8ISFu8) - Using deque efficiently

---

## Follow-up Questions

### Q1: Why use 0-1 BFS instead of Dijkstra's algorithm?

**Answer:** Both work, but 0-1 BFS is more efficient for this specific case. Dijkstra's would use a priority queue with O(log V) per operation, while 0-1 BFS uses a deque with O(1) operations.

---

### Q2: How does 0-1 BFS differ from regular BFS?

**Answer:** In regular BFS, all edges have equal cost. In 0-1 BFS, edges have costs 0 or 1. We use a deque: 0-cost edges go to front, 1-cost edges go to back, ensuring we process nodes in order of increasing cost.

---

### Q3: Can we use BFS with a binary search on answer?

**Answer:** Yes, we could binary search on the maximum obstacles allowed and check if a path exists using regular BFS. That would be O(log(max) × m × n).

---

### Q4: What if we could also remove obstacles in the middle of the path?

**Answer:** That's exactly what this problem models. Moving to an obstacle cell represents removing it (cost 1), while moving to an empty cell has cost 0.

---

### Q5: Why is appending to front/back equivalent to Dijkstra?

**Answer:** By appending 0-cost moves to front, we process them before any 1-cost moves, effectively maintaining a priority order based on distance from source.

---

### Q6: What edge cases should be tested?

**Answer:**
- No obstacles (answer = 0)
- All obstacles blocking path
- Single row/column
- Start equals end

---

## Common Pitfalls

### 1. Not Using Proper Deque Operations
**Issue:** Using regular queue instead of deque.

**Solution:** Use deque and appendleft for 0-cost, append for 1-cost.

### 2. Wrong Cost Addition
**Issue:** Adding cost incorrectly.

**Solution:** Cost is grid[nx][ny] (0 or 1), added to current distance.

### 3. Not Checking Early Exit
**Issue:** Processing entire grid when we could exit early.

**Solution:** Return when reaching destination.

---

## Summary

The **Minimum Obstacle Removal to Reach Corner** problem demonstrates:

- **0-1 BFS**: Optimized for 0/1 edge weights
- **Deque Usage**: Front for 0-cost, back for 1-cost
- **Grid Traversal**: Shortest path in grid
- **Time Complexity**: O(m × n)
- **Space Complexity**: O(m × n)

This problem is an excellent example of when 0-1 BFS is more efficient than Dijkstra's algorithm.

For more details on this pattern, see the **[0-1 BFS](/algorithms/graph/0-1-bfs)**.
