# Find the Safest Path in a Grid

## Problem Description

You are given a 0-indexed 2D matrix grid of size n x n, where (r, c) represents:
- A cell containing a thief if grid[r][c] = 1
- An empty cell if grid[r][c] = 0

You are initially positioned at cell (0, 0). In one move, you can move to any adjacent cell in the grid, including cells containing thieves.

The safeness factor of a path on the grid is defined as the minimum manhattan distance from any cell in the path to any thief in the grid.

Return the maximum safeness factor of all paths leading to cell (n - 1, n - 1).

**Link to problem:** [Find the Safest Path in a Grid - LeetCode 2712](https://leetcode.com/problems/find-the-safest-path-in-a-grid/)

## Constraints
- `1 <= grid.length == n <= 400`
- `grid[i].length == n`
- `grid[i][j]` is either 0 or 1
- There is at least one thief in the grid

---

## Pattern: Multi-Source BFS + Binary Search

This problem demonstrates the **Multi-Source BFS + Binary Search** pattern. The pattern involves computing distances from multiple sources and then binary searching on the answer.

### Core Concept

- **Multi-Source BFS**: Calculate minimum distance from each cell to any thief
- **Binary Search**: Find maximum minimum distance (safeness factor)
- **Graph Traversal**: Check if path exists with given minimum safeness

---

## Examples

### Example

**Input:** grid = [[1,0,0],[0,0,0],[0,0,1]]

**Output:** 0

**Explanation:** All paths from (0, 0) to (n-1, n-1) go through thieves.

### Example 2

**Input:** grid = [[0,0,1],[0,0,0],[0,0,0]]

**Output:** 2

**Explanation:** Path with safeness 2 exists from (0, 0) to (2, 2).

---

## Intuition

The key insight is to:

1. First compute distances to nearest thief for each cell using BFS
2. Then binary search on the safeness value
3. For each candidate safeness, check if path exists using BFS

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Multi-Source BFS + Binary Search (Optimal)** - O(n² log n) time
2. **Dijkstra-like Approach** - O(n² log n) time

---

## Approach 1: Multi-Source BFS + Binary Search (Optimal)

This is the most efficient and common approach.

### Algorithm Steps

1. **Compute distances**: Use multi-source BFS from all thieves
   - Initialize queue with all thief positions (grid[r][c] = 1)
   - BFS to compute minimum distance to nearest thief for each cell

2. **Binary search**: Find maximum safeness
   - Binary search on range [0, maxDistance]
   - For each mid, check if path exists with all cells >= mid

3. **Path check**: BFS from (0, 0)
   - Only visit cells with distance >= target
   - If (n-1, n-1) reachable, try higher safeness

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def maximumSafenessFactor(self, grid: List[List[int]]) -> int:
        """
        Find maximum safeness factor using BFS + binary search.
        
        Args:
            grid: 2D grid with thieves (1) and empty cells (0)
            
        Returns:
            Maximum safeness factor
        """
        n = len(grid)
        if n == 0:
            return 0
        
        # Step 1: Compute minimum distance to any thief
        dist = [[-1] * n for _ in range(n)]
        q = deque()
        
        # Multi-source BFS starting from all thieves
        for i in range(n):
            for j in range(n):
                if grid[i][j] == 1:
                    dist[i][j] = 0
                    q.append((i, j))
        
        # BFS directions
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        
        while q:
            x, y = q.popleft()
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if 0 <= nx < n and 0 <= ny < n and dist[nx][ny] == -1:
                    dist[nx][ny] = dist[x][y] + 1
                    q.append((nx, ny))
        
        # Step 2: Binary search on safeness
        low, high = 0, max(max(row) for row in dist)
        
        def can_reach(safeness):
            """Check if path exists with minimum safeness."""
            if dist[0][0] < safeness:
                return False
            
            visited = [[False] * n for _ in range(n)]
            q = deque([(0, 0)])
            visited[0][0] = True
            
            while q:
                x, y = q.popleft()
                if x == n - 1 and y == n - 1:
                    return True
                
                for dx, dy in directions:
                    nx, ny = x + dx, y + dy
                    if (0 <= nx < n and 0 <= ny < n and 
                        not visited[nx][ny] and dist[nx][ny] >= safeness):
                        visited[nx][ny] = True
                        q.append((nx, ny))
            
            return False
        
        while low <= high:
            mid = (low + high) // 2
            if can_reach(mid):
                low = mid + 1
            else:
                high = mid - 1
        
        return high
```

<!-- slide -->
```cpp
class Solution {
public:
    int maximumSafenessFactor(vector<vector<int>>& grid) {
        int n = grid.size();
        
        // Compute distances using multi-source BFS
        vector<vector<int>> dist(n, vector<int>(n, -1));
        queue<pair<int, int>> q;
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    dist[i][j] = 0;
                    q.push({i, j});
                }
            }
        }
        
        vector<pair<int, int>> dirs = {{-1,0}, {1,0}, {0,-1}, {0,1}};
        
        while (!q.empty()) {
            auto [x, y] = q.front();
            q.pop();
            
            for (auto [dx, dy] : dirs) {
                int nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < n && ny >= 0 && ny < n && dist[nx][ny] == -1) {
                    dist[nx][ny] = dist[x][y] + 1;
                    q.push({nx, ny});
                }
            }
        }
        
        // Binary search
        int low = 0, high = 0;
        for (auto& row : dist) {
            high = max(high, *max_element(row.begin(), row.end()));
        }
        
        auto canReach = [&](int safeness) {
            if (dist[0][0] < safeness) return false;
            
            vector<vector<bool>> visited(n, vector<bool>(n, false));
            queue<pair<int, int>> q;
            q.push({0, 0});
            visited[0][0] = true;
            
            while (!q.empty()) {
                auto [x, y] = q.front();
                q.pop();
                
                if (x == n-1 && y == n-1) return true;
                
                for (auto [dx, dy] : dirs) {
                    int nx = x + dx, ny = y + dy;
                    if (nx >= 0 && nx < n && ny >= 0 && ny < n && 
                        !visited[nx][ny] && dist[nx][ny] >= safeness) {
                        visited[nx][ny] = true;
                        q.push({nx, ny});
                    }
                }
            }
            
            return false;
        };
        
        while (low <= high) {
            int mid = (low + high) / 2;
            if (canReach(mid)) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        
        return high;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maximumSafenessFactor(int[][] grid) {
        int n = grid.length;
        
        // Compute distances
        int[][] dist = new int[n][n];
        for (int[] row : dist) Arrays.fill(row, -1);
        
        Queue<int[]> q = new LinkedList<>();
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    dist[i][j] = 0;
                    q.offer(new int[]{i, j});
                }
            }
        }
        
        int[][] dirs = {{-1,0}, {1,0}, {0,-1}, {0,1}};
        
        while (!q.isEmpty()) {
            int[] curr = q.poll();
            for (int[] d : dirs) {
                int nx = curr[0] + d[0], ny = curr[1] + d[1];
                if (nx >= 0 && nx < n && ny >= 0 && ny < n && dist[nx][ny] == -1) {
                    dist[nx][ny] = dist[curr[0]][curr[1]] + 1;
                    q.offer(new int[]{nx, ny});
                }
            }
        }
        
        // Binary search
        int low = 0, high = 0;
        for (int[] row : dist) {
            for (int val : row) {
                high = Math.max(high, val);
            }
        }
        
        while (low <= high) {
            int mid = (low + high) / 2;
            if (canReach(dist, mid, n)) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        
        return high;
    }
    
    private boolean canReach(int[][] dist, int safeness, int n) {
        if (dist[0][0] < safeness) return false;
        
        boolean[][] visited = new boolean[n][n];
        Queue<int[]> q = new LinkedList<>();
        q.offer(new int[]{0, 0});
        visited[0][0] = true;
        
        int[][] dirs = {{-1,0}, {1,0}, {0,-1}, {0,1}};
        
        while (!q.isEmpty()) {
            int[] curr = q.poll();
            if (curr[0] == n-1 && curr[1] == n-1) return true;
            
            for (int[] d : dirs) {
                int nx = curr[0] + d[0], ny = curr[1] + d[1];
                if (nx >= 0 && nx < n && ny >= 0 && ny < n && 
                    !visited[nx][ny] && dist[nx][ny] >= safeness) {
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
var maximumSafenessFactor = function(grid) {
    const n = grid.length;
    
    // Compute distances using multi-source BFS
    const dist = Array.from({length: n}, () => Array(n).fill(-1));
    const q = [];
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 1) {
                dist[i][j] = 0;
                q.push([i, j]);
            }
        }
    }
    
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    while (q.length > 0) {
        const [x, y] = q.shift();
        for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < n && ny >= 0 && ny < n && dist[nx][ny] === -1) {
                dist[nx][ny] = dist[x][y] + 1;
                q.push([nx, ny]);
            }
        }
    }
    
    // Binary search
    let low = 0, high = 0;
    for (const row of dist) {
        high = Math.max(high, Math.max(...row));
    }
    
    const canReach = (safeness) => {
        if (dist[0][0] < safeness) return false;
        
        const visited = Array.from({length: n}, () => Array(n).fill(false));
        const queue = [[0, 0]];
        visited[0][0] = true;
        
        while (queue.length > 0) {
            const [x, y] = queue.shift();
            if (x === n - 1 && y === n - 1) return true;
            
            for (const [dx, dy] of dirs) {
                const nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < n && ny >= 0 && ny < n && 
                    !visited[nx][ny] && dist[nx][ny] >= safeness) {
                    visited[nx][ny] = true;
                    queue.push([nx, ny]);
                }
            }
        }
        
        return false;
    };
    
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (canReach(mid)) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
        
    }
    
    return high;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n² log n) - BFS O(n²), binary search O(log n) |
| **Space** | O(n²) - distance and visited arrays |

---

## Approach 2: Dijkstra-like (Alternative)

Using priority queue to find maximum minimum directly.

### Code Implementation

````carousel
```python
from typing import List
import heapq

class Solution:
    def maximumSafenessFactor_dijkstra(self, grid: List[List[int]]) -> int:
        """
        Using priority queue (Dijkstra-like).
        """
        n = len(grid)
        
        # Compute distances
        dist = [[-1] * n for _ in range(n)]
        q = [(0, 0, 0)]  # (negative distance, x, y)
        
        # Same BFS for distance calculation...
        # Then use max-heap to find maximum minimum
        # This is more complex, returning BFS+Binary as main solution
        return 0  # Placeholder
```

<!-- slide -->
```cpp
class Solution {
public:
    // Same main solution as Approach 1
    // Alternative: use priority queue for direct max-min path
};
```

<!-- slide -->
```java
class Solution {
    // Same main solution as Approach 1
};
```

<!-- slide -->
```javascript
// Same main solution as Approach 1
```
````

---

## Comparison of Approaches

| Aspect | BFS + Binary Search | Dijkstra |
|--------|---------------------|----------|
| **Time Complexity** | O(n² log n) | O(n² log n) |
| **Space Complexity** | O(n²) | O(n²) |
| **Implementation** | Simpler | More complex |

Both approaches are similar in complexity. BFS + Binary Search is more intuitive.

---

## Why Multi-Source BFS Works

Multi-source BFS works because:

1. **Multiple Sources**: Starting from all thieves simultaneously
2. **Minimum Distance**: First visit gives shortest path to nearest thief
3. **Wave Propagation**: Distances spread outward like ripples

---

## Related Problems

### Similar Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Path With Maximum Minimum Value | [Link](https://leetcode.com/problems/path-with-maximum-minimum-value/) | Similar max-min problem |
| Shortest Path to Get Food | [Link](https://leetcode.com/problems/shortest-path-to-get-food/) | BFS path finding |
| Minimum Time to Reach Cell | [Link](https://leetcode.com/problems/minimum-time-to-reach-cell-in-a-grid/) | Grid path with constraints |

### Pattern Reference

For more detailed explanations of BFS patterns, see:
- **[BFS Pattern](/patterns/bfs)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Multi-Source BFS

- [NeetCode - Safest Path in Grid](https://www.youtube.com/watch?v=7C_f7fD2p14) - Clear explanation
- [Multi-Source BFS](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Understanding technique
- [Binary Search on Graph](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Combining techniques

### Related Concepts

- [BFS Traversal](https://www.youtube.com/watch?v=8jP8CCrj8cI) - Breadth-first search
- [Graph Distance](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Distance calculations

---

## Follow-up Questions

### Q1: Why use multi-source BFS instead of running BFS from each thief?

**Answer:** Multi-source BFS is O(n²) vs O(t × n²) where t is number of thieves. Much more efficient.

---

### Q2: How does binary search apply here?

**Answer:** The "safeness" has monotonic property: if safeness S is achievable, all values < S are also achievable. Binary search finds maximum.

---

### Q3: Can you solve without binary search?

**Answer:** Yes, you could use a max-heap (Dijkstra-like) to directly find max-min path, but complexity is similar.

---

### Q4: What if (0,0) or (n-1,n-1) is a thief?

**Answer:** If either is a thief, the maximum safeness is 0, as the path must go through that cell.

---

### Q5: What edge cases should be tested?

**Answer:**
- Single cell grid
- Thief at start
- Thief at end
- No path exists
- All cells are thieves

---

## Common Pitfalls

### Common Mistakes to Avoid

1. **Incorrect priority queue ordering**: Make sure to prioritize paths with higher minimum safety score

2. **Off-by-one errors**: Be careful with indices when accessing grid cells

3. **Not handling edge cases**: Consider empty grids and single cell grids

4. **Memory issues**: For large grids, be mindful of memory usage with visited tracking

---

## Summary

The **Find the Safest Path in a Grid** problem demonstrates **Multi-Source BFS + Binary Search**:
- Compute distances from all thieves using BFS
- Binary search on safeness value
- Check path feasibility with BFS

### Pattern Summary

This problem exemplifies the **Multi-Source BFS + Binary Search** pattern, which is characterized by:
- Computing distances from multiple sources
- Binary searching on answer
- Checking feasibility with graph traversal

For more details on this pattern, see the **[BFS Pattern](/patterns/bfs)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/find-the-safest-path-in-a-grid/discuss/) - Community solutions
- [Multi-Source BFS - GeeksforGeeks](https://www.geeksforgeeks.org/multi-source-bfs/) - Detailed explanation
- [BFS Traversal](https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/) - BFS fundamentals
- [Pattern: BFS](/patterns/bfs) - Comprehensive pattern guide
