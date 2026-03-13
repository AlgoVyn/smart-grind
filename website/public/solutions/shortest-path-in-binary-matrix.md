# Shortest Path in Binary Matrix

## Problem Description

Given an `n x n` binary matrix `grid`, return the length of the shortest clear path in the matrix. If there is no clear path, return `-1`.

A clear path in a binary matrix is a path from the top-left cell `(0, 0)` to the bottom-right cell `(n-1, n-1)` such that:

1. All the visited cells of the path are `0`.
2. All the adjacent cells of the path are 8-directionally connected (they share an edge or a corner).

The length of a clear path is the number of visited cells.

**LeetCode Link:** [Shortest Path in Binary Matrix - LeetCode 1162](https://leetcode.com/problems/shortest-path-in-binary-matrix/)

---

## Examples

### Example 1

**Input:**
```python
grid = [[0,1],[1,0]]
```

**Output:**
```python
2
```

**Explanation:** Path from (0,0) to (1,1) is [0,0] → [1,1], length 2.

### Example 2

**Input:**
```python
grid = [[0,0,0],[1,1,0],[1,1,0]]
```

**Output:**
```python
4
```

**Explanation:** Path is [0,0] → [0,1] → [0,2] → [1,2] → [2,2], length 4.

### Example 3

**Input:**
```python
grid = [[1,0,0],[1,1,0],[1,1,0]]
```

**Output:**
```python
-1
```

**Explanation:** No path exists because start cell is blocked.

---

## Constraints

- `n == grid.length`
- `n == grid[i].length`
- `1 <= n <= 100`
- `grid[i][j]` is `0` or `1`

---

## Pattern: Breadth-First Search (BFS)

This problem uses **BFS** for shortest path in unweighted grid. Use 8 directions, track visited cells, return steps when reaching destination.

---

## Intuition

The key insight for this problem is using BFS to find the shortest path in an unweighted grid.

### Key Observations

1. **BFS for Shortest Path**: In an unweighted graph (or grid), BFS always finds the shortest path because it explores level by level.

2. **8-Directional Movement**: We can move in 8 directions including diagonals. This increases connectivity but also requires checking more neighbors.

3. **Level-by-Level Exploration**: By tracking the step count with each cell in the queue, we know when we've reached a new level.

4. **Early Termination**: As soon as we reach the destination, we can return - that's the shortest path.

### Why It Works

BFS works because:
- We explore all cells at distance d before exploring cells at distance d+1
- The first time we reach the destination, we've found the shortest path
- We mark cells as visited to avoid revisiting and infinite loops

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **BFS (Optimal)** - O(n²) time
2. **A* Search** - Alternative (for understanding)

---

## Approach 1: BFS (Optimal)

### Algorithm Steps

1. **Handle edge cases**: If grid is empty or start/end is blocked, return -1
2. **Initialize queue**: Start with (0, 0, 1) - row, col, steps
3. **Set up directions**: All 8 directions including diagonals
4. **Process BFS**:
   - Dequeue current cell
   - Check all 8 neighbors
   - If valid and not visited, add to queue with step+1
   - If destination reached, return steps + 1
5. **Return -1** if no path found

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def shortestPathBinaryMatrix(self, grid: List[List[int]]) -> int:
        """
        Find shortest path in binary matrix using BFS.
        
        Args:
            grid: n x n binary matrix (0 = clear, 1 = blocked)
            
        Returns:
            Length of shortest path, or -1 if not found
        """
        # Edge case: empty grid or blocked start
        if not grid or grid[0][0] == 1:
            return -1
        
        n = len(grid)
        
        # Edge case: single cell
        if n == 1:
            return 1
        
        # 8 directions: including diagonals
        directions = [
            (-1, -1), (-1, 0), (-1, 1),
            (0, -1),           (0, 1),
            (1, -1),  (1, 0),  (1, 1)
        ]
        
        # Initialize BFS
        queue = deque([(0, 0, 1)])  # (row, col, steps)
        grid[0][0] = 1  # Mark as visited
        
        while queue:
            row, col, steps = queue.popleft()
            
            # Check all 8 neighbors
            for dr, dc in directions:
                new_row, new_col = row + dr, col + dc
                
                # Check bounds and if cell is clear
                if (0 <= new_row < n and 
                    0 <= new_col < n and 
                    grid[new_row][new_col] == 0):
                    
                    # Check if reached destination
                    if new_row == n - 1 and new_col == n - 1:
                        return steps + 1
                    
                    # Mark as visited and add to queue
                    grid[new_row][new_col] = 1
                    queue.append((new_row, new_col, steps + 1))
        
        return -1
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        if (grid.empty() || grid[0][0] == 1) return -1;
        
        int n = grid.size();
        if (n == 1) return 1;
        
        // 8 directions
        vector<pair<int,int>> dirs = {
            {-1,-1}, {-1,0}, {-1,1},
            {0,-1},           {0,1},
            {1,-1},  {1,0},  {1,1}
        };
        
        queue<tuple<int,int,int>> q;
        q.emplace(0, 0, 1);
        grid[0][0] = 1;
        
        while (!q.empty()) {
            auto [r, c, steps] = q.front();
            q.pop();
            
            for (auto [dr, dc] : dirs) {
                int nr = r + dr, nc = c + dc;
                
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && 
                    grid[nr][nc] == 0) {
                    
                    if (nr == n-1 && nc == n-1) return steps + 1;
                    
                    grid[nr][nc] = 1;
                    q.emplace(nr, nc, steps + 1);
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
    public int shortestPathBinaryMatrix(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0][0] == 1) {
            return -1;
        }
        
        int n = grid.length;
        if (n == 1) return 1;
        
        // 8 directions
        int[][] dirs = {
            {-1,-1}, {-1,0}, {-1,1},
            {0,-1},           {0,1},
            {1,-1},  {1,0},  {1,1}
        };
        
        Queue<int[]> q = new LinkedList<>();
        q.add(new int[]{0, 0, 1});
        grid[0][0] = 1;
        
        while (!q.isEmpty()) {
            int[] curr = q.poll();
            int r = curr[0], c = curr[1], steps = curr[2];
            
            for (int[] dir : dirs) {
                int nr = r + dir[0], nc = c + dir[1];
                
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && 
                    grid[nr][nc] == 0) {
                    
                    if (nr == n-1 && nc == n-1) return steps + 1;
                    
                    grid[nr][nc] = 1;
                    q.add(new int[]{nr, nc, steps + 1});
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
 * @param {number[][]} grid
 * @return {number}
 */
var shortestPathBinaryMatrix = function(grid) {
    if (!grid || grid.length === 0 || grid[0][0] === 1) {
        return -1;
    }
    
    const n = grid.length;
    if (n === 1) return 1;
    
    // 8 directions
    const dirs = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],            [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];
    
    const queue = [[0, 0, 1]];
    grid[0][0] = 1;
    
    while (queue.length > 0) {
        const [r, c, steps] = queue.shift();
        
        for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && 
                grid[nr][nc] === 0) {
                
                if (nr === n - 1 && nc === n - 1) {
                    return steps + 1;
                }
                
                grid[nr][nc] = 1;
                queue.push([nr, nc, steps + 1]);
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
| **Time** | O(n²) - visit each cell at most once |
| **Space** | O(n²) - for queue in worst case |

---

## Approach 2: A* Search (Alternative)

### Algorithm Steps

1. Use priority queue with heuristic (Manhattan or Chebyshev distance)
2. Each state: (f_score, g_score, row, col)
3. f_score = g_score + heuristic (distance to target)
4. Process nodes with lowest f_score first

### Why It Works

A* can be faster in practice if a good heuristic is used. However, for this grid problem, BFS is simpler and equally efficient.

### Code Implementation

````carousel
```python
from typing import List
import heapq

class Solution:
    def shortestPathBinaryMatrix(self, grid: List[List[int]]) -> int:
        if not grid or grid[0][0] == 1:
            return -1
        
        n = len(grid)
        if n == 1:
            return 1
        
        # Heuristic: Chebyshev distance (max of |dx|, |dy|)
        def heuristic(r, c):
            return max(n - 1 - r, n - 1 - c)
        
        # Priority queue: (f_score, g_score, row, col)
        pq = [(heuristic(0, 0), 1, 0, 0)]
        grid[0][0] = 1
        
        dirs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
        
        while pq:
            f, g, r, c = heapq.heappop(pq)
            
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                
                if (0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0):
                    if nr == n - 1 and nc == n - 1:
                        return g + 1
                    
                    grid[nr][nc] = 1
                    h = heuristic(nr, nc)
                    heapq.heappush(pq, (g + 1 + h, g + 1, nr, nc))
        
        return -1
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        if (grid.empty() || grid[0][0] == 1) return -1;
        
        int n = grid.size();
        if (n == 1) return 1;
        
        using State = tuple<int,int,int,int>; // f, g, r, c
        priority_queue<State, vector<State>, greater<State>> pq;
        
        auto heuristic = [&](int r, int c) {
            return max(n-1-r, n-1-c);
        };
        
        pq.push({heuristic(0,0), 1, 0, 0});
        grid[0][0] = 1;
        
        vector<pair<int,int>> dirs = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
        
        while (!pq.empty()) {
            auto [f, g, r, c] = pq.top(); pq.pop();
            
            for (auto [dr, dc] : dirs) {
                int nr = r + dr, nc = c + dc;
                
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0) {
                    if (nr == n-1 && nc == n-1) return g + 1;
                    
                    grid[nr][nc] = 1;
                    pq.push({g + 1 + heuristic(nr, nc), g + 1, nr, nc});
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
    public int shortestPathBinaryMatrix(int[][] grid) {
        if (grid == null || grid[0][0] == 1) return -1;
        
        int n = grid.length;
        if (n == 1) return 1;
        
        PriorityQueue<int[]> pq = new PriorityQueue<>(
            (a, b) -> Integer.compare(a[0], b[0]));
        
        pq.add(new int[]{n - 1, 1, 0, 0}); // f, g, r, c
        grid[0][0] = 1;
        
        int[][] dirs = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
        
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int g = curr[1], r = curr[2], c = curr[3];
            
            for (int[] dir : dirs) {
                int nr = r + dir[0], nc = c + dir[1];
                
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0) {
                    if (nr == n-1 && nc == n-1) return g + 1;
                    
                    grid[nr][nc] = 1;
                    int f = g + 1 + Math.max(n-1-nr, n-1-nc);
                    pq.add(new int[]{f, g + 1, nr, nc});
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
 * @param {number[][]} grid
 * @return {number}
 */
var shortestPathBinaryMatrix = function(grid) {
    if (!grid || grid[0][0] === 1) return -1;
    
    const n = grid.length;
    if (n === 1) return 1;
    
    const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    
    // Priority queue simulation with array
    const pq = [[n - 1, 1, 0, 0]]; // f, g, r, c
    grid[0][0] = 1;
    
    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [f, g, r, c] = pq.shift();
        
        for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {
                if (nr === n - 1 && nc === n - 1) return g + 1;
                
                grid[nr][nc] = 1;
                const h = Math.max(n - 1 - nr, n - 1 - nc);
                pq.push([g + 1 + h, g + 1, nr, nc]);
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
| **Time** | O(n² log n) with heap operations |
| **Space** | O(n²) |

---

## Comparison of Approaches

| Aspect | BFS | A* Search |
|--------|-----|-----------|
| **Time Complexity** | O(n²) | O(n² log n) |
| **Space Complexity** | O(n²) | O(n²) |
| **Implementation** | Simple | More complex |
| **Recommended** | ✅ | For learning |

**Best Approach:** Use BFS for simplicity and optimal performance.

---

## Common Pitfalls

### 1. Start Cell Check
**Issue**: Not checking if start or end cell is blocked.

**Solution**: Return -1 if grid[0][0] != 0 or grid[n-1][n-1] != 0.

### 2. 8 Directions
**Issue**: Using only 4 directions instead of 8.

**Solution**: Include all 8 directions including diagonals.

### 3. Steps Count
**Issue**: Starting with 0 instead of 1.

**Solution**: First cell counts as step 1.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: BFS, shortest path, grid traversal

### Learning Outcomes

1. **BFS Mastery**: Practice BFS for shortest path
2. **Grid Traversal**: Handle 2D grid problems
3. **8-directional Movement**: Understand diagonal movement

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| 01 Matrix | [Link](https://leetcode.com/problems/01-matrix/) | BFS in grid |
| Rotting Oranges | [Link](https://leetcode.com/problems/rotting-oranges/) | BFS with multi-source |
| Walls and Gates | [Link](https://leetcode.com/problems/walls-and-gates/) | BFS from gates |

---

## Video Tutorial Links

1. **[NeetCode - Shortest Path in Binary Matrix](https://www.youtube.com/watch?v=y1cEK7M9l2A)** - Clear explanation
2. **[BFS Fundamentals](https://www.youtube.com/watch?v=oDqjApFe7Ek)** - BFS tutorial

---

## Follow-up Questions

### Q1: How would you modify to return the actual path?

**Answer**: Store parent pointers to reconstruct the path when destination is reached.

### Q2: What if movement was only 4-directional (no diagonals)?

**Answer**: Simply change directions array to only 4 directions.

### Q3: How would you handle very large grids efficiently?

**Answer**: BFS is already optimal for unweighted grids. For very large grids, consider bidirectional BFS.

---

## Summary

The **Shortest Path in Binary Matrix** problem demonstrates BFS for finding shortest path in an unweighted grid.

Key takeaways:
1. Use BFS for shortest path in unweighted graphs/grids
2. Include all 8 directions including diagonals
3. Mark cells as visited to avoid revisiting
4. Return steps when destination is reached
5. Time complexity is O(n²)

This problem is essential for understanding BFS applications in grid-based shortest path problems.
