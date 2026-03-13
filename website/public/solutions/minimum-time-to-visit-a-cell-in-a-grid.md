# Minimum Time To Visit A Cell In A Grid

## Problem Description

You are given an `m x n` matrix `grid` consisting of non-negative integers where `grid[row][col]` represents the minimum time required to be able to visit the cell `(row, col)`, which means you can visit the cell `(row, col)` only when the time you visit it is greater than or equal to `grid[row][col]`.

You are standing in the top-left cell of the matrix in the 0th second, and you must move to any adjacent cell in the four directions: up, down, left, and right. Each move you make takes 1 second.

Return the minimum time required in which you can visit the bottom-right cell of the matrix. If you cannot visit the bottom-right cell, then return `-1`.

**Link to problem:** [Minimum Time to Visit a Cell in a Grid - LeetCode 2570](https://leetcode.com/problems/minimum-time-to-visit-a-cell-in-a-grid/)

## Examples

**Example 1:**

Input:
```python
grid = [[0, 1, 3, 2], [5, 1, 2, 5], [4, 3, 8, 6]]
```

Output:
```python
7
```

Explanation:
One of the paths that we can take is:
- At t = 0: cell (0, 0)
- At t = 1: move to cell (0, 1) - possible because grid[0][1] <= 1
- At t = 2: move to cell (1, 1) - possible because grid[1][1] <= 2
- At t = 3: move to cell (1, 2) - possible because grid[1][2] <= 3
- At t = 4: move to cell (1, 1) - possible because grid[1][1] <= 4
- At t = 5: move to cell (1, 2) - possible because grid[1][2] <= 5
- At t = 6: move to cell (1, 3) - possible because grid[1][3] <= 6
- At t = 7: move to cell (2, 3) - possible because grid[2][3] <= 7

**Example 2:**

Input:
```python
grid = [[0, 2, 4], [3, 2, 1], [1, 0, 4]]
```

Output:
```python
-1
```

Explanation:
There is no path from the top-left to the bottom-right cell because grid[1][1] = 2 but you cannot reach it at time 2 since you need to wait.

---

## Constraints

- `m == grid.length`
- `n == grid[i].length`
- `2 <= m, n <= 1000`
- `4 <= m * n <= 10^5`
- `0 <= grid[i][j] <= 10^5`
- `grid[0][0] == 0`

---

## Pattern: Dijkstra's Algorithm

This problem is a classic example of the **Dijkstra's Algorithm** pattern. The algorithm finds the shortest path in a weighted graph where edge weights represent time.

### Core Concept

The fundamental idea is treating each cell as a node and finding the minimum time to reach the destination:
- **Node**: Each cell (row, col)
- **Edge**: Movement to adjacent cells (cost = 1 second)
- **Constraint**: Can only visit cell at time >= grid[row][col]
- **Wait Time**: If current time < grid[next], need to wait

---

## Intuition

The key insight for this problem is understanding the time constraints:

1. **Cell Visit Time**: Each cell has a minimum time you must wait before visiting
2. **Waiting**: If you reach a cell before its minimum time, you must wait
3. **Path Cost**: Total time = movement time + waiting time
4. **Optimal Path**: Use Dijkstra's algorithm to find minimum total time

### Why Dijkstra's?

- **Weighted Graph**: Each move has a cost, but waiting adds additional cost
- **Non-negative Weights**: All costs are non-negative (waiting time ≥ 0)
- **Optimal Substructure**: Shortest path to destination = shortest path to neighbor + cost

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Dijkstra's Algorithm (Optimal)** - O((m×n) log(m×n))
2. **0-1 BFS** - O(m×n) (if waiting is 0 or 1)

---

## Approach 1: Dijkstra's Algorithm (Optimal)

This is the optimal approach using a priority queue.

### Algorithm Steps

1. **Initialize**: Set distance to (0, 0) as 0, all others as infinity
2. **Priority Queue**: Use min-heap with (time, row, col)
3. **Process Cells**: While queue not empty:
   - Pop cell with minimum time
   - If already visited with less time, skip
   - If at destination, return time
   - For each neighbor:
     - Calculate arrival time: max(current_time + 1, grid[neighbor])
     - If better than known distance, update and push
4. **Return**: -1 if destination unreachable

### Why It Works

Dijkstra's algorithm guarantees finding the shortest path because:
- We always process the cell with minimum known time
- Once processed, we have found the optimal time to reach that cell
- The waiting time ensures we respect cell constraints

### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def minimumTime(self, grid: List[List[int]]) -> int:
        """
        Find minimum time to reach bottom-right using Dijkstra's algorithm.
        
        Each cell has a minimum visit time; moves take 1 second.
        
        Args:
            grid: 2D grid with minimum visit times
            
        Returns:
            Minimum time to reach destination, or -1 if impossible
        """
        if not grid or not grid[0]:
            return -1
        
        m, n = len(grid), len(grid[0])
        
        # Early termination: if can't move from start
        if grid[0][1] > 1 and grid[1][0] > 1:
            return -1
        
        # Directions: up, down, left, right
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        # Distance matrix
        dist = [[float('inf')] * n for _ in range(m)]
        dist[0][0] = 0
        
        # Priority queue: (time, row, col)
        pq = [(0, 0, 0)]
        
        while pq:
            time, i, j = heapq.heappop(pq)
            
            # Skip if we've found a better path
            if time > dist[i][j]:
                continue
            
            # Reached destination
            if i == m - 1 and j == n - 1:
                return time
            
            # Explore neighbors
            for di, dj in directions:
                ni, nj = i + di, j + dj
                
                # Check bounds
                if 0 <= ni < m and 0 <= nj < n:
                    # Time to reach neighbor
                    # Need to wait if current time + 1 < grid[ni][nj]
                    arrival_time = max(time + 1, grid[ni][nj])
                    
                    # Update if better
                    if arrival_time < dist[ni][nj]:
                        dist[ni][nj] = arrival_time
                        heapq.heappush(pq, (arrival_time, ni, nj))
        
        return -1
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <limits>
using namespace std;

class Solution {
public:
    int minimumTime(vector<vector<int>>& grid) {
        /**
         * Find minimum time to reach bottom-right using Dijkstra's algorithm.
         * 
         * @param grid: 2D grid with minimum visit times
         * @return: Minimum time to reach destination, or -1
         */
        int m = grid.size();
        int n = grid[0].size();
        
        // Early termination
        if (grid[0][1] > 1 && grid[1][0] > 1) {
            return -1;
        }
        
        // Directions: right, down, left, up
        vector<pair<int, int>> dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        // Distance matrix
        vector<vector<int>> dist(m, vector<int>(n, INT_MAX));
        dist[0][0] = 0;
        
        // Priority queue: (time, row, col)
        priority_queue<tuple<int, int, int>, 
                       vector<tuple<int, int, int>>, 
                       greater<tuple<int, int, int>>> pq;
        pq.push({0, 0, 0});
        
        while (!pq.empty()) {
            auto [time, i, j] = pq.top();
            pq.pop();
            
            if (time > dist[i][j]) continue;
            
            if (i == m - 1 && j == n - 1) return time;
            
            for (auto [di, dj] : dirs) {
                int ni = i + di, nj = j + dj;
                if (ni >= 0 && ni < m && nj >= 0 && nj < n) {
                    int arrival_time = max(time + 1, grid[ni][nj]);
                    if (arrival_time < dist[ni][nj]) {
                        dist[ni][nj] = arrival_time;
                        pq.push({arrival_time, ni, nj});
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
import java.util.*;

class Solution {
    public int minimumTime(int[][] grid) {
        /**
         * Find minimum time to reach bottom-right using Dijkstra's algorithm.
         * 
         * @param grid: 2D grid with minimum visit times
         * @return: Minimum time to reach destination, or -1
         */
        int m = grid.length;
        int n = grid[0].length;
        
        // Early termination
        if (grid[0][1] > 1 && grid[1][0] > 1) {
            return -1;
        }
        
        // Directions
        int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        // Distance matrix
        int[][] dist = new int[m][n];
        for (int[] row : dist) {
            Arrays.fill(row, Integer.MAX_VALUE);
        }
        dist[0][0] = 0;
        
        // Priority queue
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.add(new int[]{0, 0, 0});
        
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int time = curr[0], i = curr[1], j = curr[2];
            
            if (time > dist[i][j]) continue;
            
            if (i == m - 1 && j == n - 1) return time;
            
            for (int[] dir : dirs) {
                int ni = i + dir[0], nj = j + dir[1];
                if (ni >= 0 && ni < m && nj >= 0 && nj < n) {
                    int arrivalTime = Math.max(time + 1, grid[ni][nj]);
                    if (arrivalTime < dist[ni][nj]) {
                        dist[ni][nj] = arrivalTime;
                        pq.add(new int[]{arrivalTime, ni, nj});
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
/**
 * Find minimum time to reach bottom-right using Dijkstra's algorithm.
 * 
 * @param {number[][]} grid - 2D grid with minimum visit times
 * @return {number} - Minimum time to reach destination, or -1
 */
var minimumTime = function(grid) {
    const m = grid.length;
    const n = grid[0].length;
    
    // Early termination
    if (grid[0][1] > 1 && grid[1][0] > 1) {
        return -1;
    }
    
    // Directions
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    // Distance matrix
    const dist = Array.from({ length: m }, () => Array(n).fill(Infinity));
    dist[0][0] = 0;
    
    // Priority queue
    const pq = [[0, 0, 0]];
    
    while (pq.length > 0) {
        // Sort to get minimum (would use heap in production)
        pq.sort((a, b) => a[0] - b[0]);
        const [time, i, j] = pq.shift();
        
        if (time > dist[i][j]) continue;
        
        if (i === m - 1 && j === n - 1) return time;
        
        for (const [di, dj] of dirs) {
            const ni = i + di;
            const nj = j + dj;
            
            if (ni >= 0 && ni < m && nj >= 0 && nj < n) {
                const arrivalTime = Math.max(time + 1, grid[ni][nj]);
                if (arrivalTime < dist[ni][nj]) {
                    dist[ni][nj] = arrivalTime;
                    pq.push([arrivalTime, ni, nj]);
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
| **Time** | O((m×n) log(m×n)) - priority queue operations |
| **Space** | O(m×n) - distance matrix and queue |

---

## Approach 2: BFS with Early Termination Optimization

This approach uses a standard BFS with early termination check.

### Algorithm Steps

1. **Early Check**: If both first moves are blocked (grid[0][1] > 1 and grid[1][0] > 1), return -1
2. **Queue**: Use regular queue with (time, row, col)
3. **Process**: Similar to Dijkstra but without priority queue
4. **Return**: Destination time or -1

### Why It Works

This works but is less efficient than Dijkstra because it doesn't prioritize cells with smaller times.

### Code Implementation

````carousel
```python
from collections import deque
from typing import List

class Solution:
    def minimumTime_bfs(self, grid: List[List[int]]) -> int:
        """BFS approach - less optimal than Dijkstra."""
        if not grid or not grid[0]:
            return -1
        
        m, n = len(grid), len(grid[0])
        
        # Early termination
        if grid[0][1] > 1 and grid[1][0] > 1:
            return -1
        
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        dist = [[float('inf')] * n for _ in range(m)]
        dist[0][0] = 0
        
        queue = deque([(0, 0, 0)])
        
        while queue:
            time, i, j = queue.popleft()
            
            if time > dist[i][j]:
                continue
            
            if i == m - 1 and j == n - 1:
                return time
            
            for di, dj in directions:
                ni, nj = i + di, j + dj
                
                if 0 <= ni < m and 0 <= nj < n:
                    arrival_time = max(time + 1, grid[ni][nj])
                    
                    if arrival_time < dist[ni][nj]:
                        dist[ni][nj] = arrival_time
                        queue.append((arrival_time, ni, nj))
        
        return -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int minimumTime(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        
        if (grid[0][1] > 1 && grid[1][0] > 1) return -1;
        
        vector<pair<int, int>> dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        vector<vector<int>> dist(m, vector<int>(n, INT_MAX));
        dist[0][0] = 0;
        
        queue<tuple<int, int, int>> q;
        q.push({0, 0, 0});
        
        while (!q.empty()) {
            auto [time, i, j] = q.front();
            q.pop();
            
            if (time > dist[i][j]) continue;
            if (i == m - 1 && j == n - 1) return time;
            
            for (auto [di, dj] : dirs) {
                int ni = i + di, nj = j + dj;
                if (ni >= 0 && ni < m && nj >= 0 && nj < n) {
                    int arrival = max(time + 1, grid[ni][nj]);
                    if (arrival < dist[ni][nj]) {
                        dist[ni][nj] = arrival;
                        q.push({arrival, ni, nj});
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
    public int minimumTime(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        
        if (grid[0][1] > 1 && grid[1][0] > 1) return -1;
        
        int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        int[][] dist = new int[m][n];
        for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE);
        dist[0][0] = 0;
        
        Queue<int[]> q = new LinkedList<>();
        q.add(new int[]{0, 0, 0});
        
        while (!q.isEmpty()) {
            int[] curr = q.poll();
            int time = curr[0], i = curr[1], j = curr[2];
            
            if (time > dist[i][j]) continue;
            if (i == m - 1 && j == n - 1) return time;
            
            for (int[] dir : dirs) {
                int ni = i + dir[0], nj = j + dir[1];
                if (ni >= 0 && ni < m && nj >= 0 && nj < n) {
                    int arrival = Math.max(time + 1, grid[ni][nj]);
                    if (arrival < dist[ni][nj]) {
                        dist[ni][nj] = arrival;
                        q.add(new int[]{arrival, ni, nj});
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
var minimumTime = function(grid) {
    const m = grid.length, n = grid[0].length;
    
    if (grid[0][1] > 1 && grid[1][0] > 1) return -1;
    
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    const dist = Array.from({ length: m }, () => Array(n).fill(Infinity));
    dist[0][0] = 0;
    
    const q = [[0, 0, 0]];
    
    while (q.length > 0) {
        const [time, i, j] = q.shift();
        
        if (time > dist[i][j]) continue;
        if (i === m - 1 && j === n - 1) return time;
        
        for (const [di, dj] of dirs) {
            const ni = i + di, nj = j + dj;
            if (ni >= 0 && ni < m && nj >= 0 && nj < n) {
                const arrival = Math.max(time + 1, grid[ni][nj]);
                if (arrival < dist[ni][nj]) {
                    dist[ni][nj] = arrival;
                    q.push([arrival, ni, nj]);
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
| **Time** | O(m×n) in worst case but can be slower than Dijkstra |
| **Space** | O(m×n) |

---

## Comparison of Approaches

| Aspect | Dijkstra | BFS |
|--------|----------|-----|
| **Time** | O((m×n) log(m×n)) | O(m×n) average |
| **Space** | O(m×n) | O(m×n) |
| **Guarantee** | Always optimal | May be slower |
| **Implementation** | Priority queue needed | Simpler |

**Best Approach:** Dijkstra's algorithm is preferred for guaranteed optimal performance.

---

## Why Dijkstra's Algorithm is Optimal for This Problem

Dijkstra's algorithm is optimal because:

1. **Non-negative Weights**: Waiting time is always non-negative
2. **Optimal Substructure**: Shortest path property holds
3. **Greedy Choice**: Always processing minimum time cell is correct
4. **Complete Search**: Explores all possible paths efficiently

---

## Related Problems

Based on similar themes (shortest path, grid traversal, Dijkstra):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Shortest Path in Binary Matrix | [Link](https://leetcode.com/problems/shortest-path-in-binary-matrix/) | Shortest path in grid |
| Minimum Path Sum | [Link](https://leetcode.com/problems/minimum-path-sum/) | Minimum sum path |
| Network Delay Time | [Link](https://leetcode.com/problems/network-delay-time/) | Network delay using Dijkstra |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Shortest Path in a Grid with Obstacles | [Link](https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/) | Path with obstacle removal |
| Minimum Cost to Reach Destination in Time | [Link](https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/) | Time-constrained shortest path |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Dijkstra's Algorithm

- [NeetCode - Minimum Time to Visit a Cell in a Grid](https://www.youtube.com/watch?v=qZ19postX1vQ) - Clear explanation
- [Dijkstra's Algorithm Explained](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Complete tutorial
- [Shortest Path Algorithms](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Various approaches

### Grid Traversal

- [BFS in Grid](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - Grid BFS patterns
- [2D Grid Problems](https://www.youtube.com/watch?v=qZ19postX1vQ) - Common patterns

---

## Follow-up Questions

### Q1: How would you modify to find the actual path, not just the time?

**Answer:** Track parent pointers when updating distances. When reaching the destination, backtrack through parents to reconstruct the path.

---

### Q2: What if you could stay in place (wait) at any cell?

**Answer:** The current solution already handles waiting - when arrival_time > current_time + 1, we wait. Staying in place is equivalent to moving to the same cell with extra wait time.

---

### Q3: How would you handle multiple destinations?

**Answer:** Run Dijkstra from the source and track distances to all destinations. The algorithm naturally handles this by continuing until all cells are processed.

---

### Q4: How would you optimize for very large grids (10^6 cells)?

**Answer:** Use a more memory-efficient representation (1D array instead of 2D), implement early termination when reaching destination, and consider using A* search if a heuristic is available.

---

### Q5: What if grid values could be negative?

**Answer:** Dijkstra doesn't work with negative weights. You'd need to use Bellman-Ford or SPFA, which are slower but handle negative weights.

---

### Q6: How would you track all optimal paths?

**Answer:** Maintain a list of parents for each cell instead of a single parent. When multiple paths have the same cost, add all to the parent list.

---

### Q7: What edge cases should be tested?

**Answer:**
- grid[0][0] = 0 (given)
- Single row or column
- All cells have same value
- Destination unreachable
- First move blocked (early termination)

---

## Common Pitfalls

### 1. Not Handling Early Termination
**Issue:** Not checking if initial moves are blocked.

**Solution:** Add early check: if grid[0][1] > 1 and grid[1][0] > 1, return -1.

### 2. Wrong Time Calculation
**Issue:** Not adding waiting time correctly.

**Solution:** Use arrival_time = max(time + 1, grid[ni][nj]).

### 3. Not Skipping Processed Cells
**Issue:** Processing same cell multiple times.

**Solution:** Check if current time > dist[i][j] and skip.

### 4. Using Wrong Data Types
**Issue:** Using int when Infinity needed.

**Solution:** Use large value (Infinity, INT_MAX) for unvisited cells.

---

## Summary

The **Minimum Time to Visit a Cell in a Grid** problem demonstrates Dijkstra's algorithm for grid-based pathfinding:

- **Dijkstra's Algorithm**: O((m×n) log(m×n)) - optimal
- **BFS**: O(m×n) average - simpler but less guaranteed optimal
- **Space**: O(m×n)

The key insight is treating waiting time as edge weight and using Dijkstra's algorithm to find the minimum total time. This problem is an excellent demonstration of applying shortest path algorithms to grid problems.

### Pattern Summary

This problem exemplifies the **Dijkstra's Algorithm** pattern, which is characterized by:
- Weighted graph with non-negative weights
- Priority queue for efficient minimum extraction
- Optimal substructure property
- Greedy choice correctness

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/minimum-time-to-visit-a-cell-in-a-grid/discuss/) - Community solutions
- [Dijkstra's Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/dijkstras-algorithm/) - Detailed explanation
- [Graph Shortest Path - Wikipedia](https://en.wikipedia.org/wiki/Shortest_path_problem) - Learn about shortest paths
- [Pattern: Dijkstra's Algorithm](https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm/) - Comprehensive guide
