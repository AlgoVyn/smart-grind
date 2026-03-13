# Max Area of Island

## Problem Description

You are given an `m x n` binary matrix `grid`. An **island** is a group of `1`'s (representing land) connected 4-directionally (horizontal or vertical). You may assume all four edges of the grid are surrounded by water.

The **area** of an island is the number of cells with value `1` in the island.

Return the maximum area of an island in `grid`. If there is no island, return `0`.

**Link to problem:** [Max Area of Island - LeetCode 695](https://leetcode.com/problems/max-area-of-island/)

---

## Examples

### Example 1

**Input:**
```python
grid = [
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]
]
```

**Output:**
```python
6
```

**Explanation:** The answer is not 11 because the island must be connected 4-directionally. The maximum island area is 6.

### Example 2

**Input:**
```python
grid = [[0, 0, 0, 0, 0, 0, 0, 0]]
```

**Output:**
```python
0
```

**Explanation:** There are no islands in the grid.

---

## Constraints

- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 50`
- `grid[i][j]` is either `0` or `1`

---

## Pattern: Graph Traversal - DFS/BFS

This problem demonstrates the **Graph Traversal** pattern (DFS/BFS) for finding connected components in a grid. The key is exploring all connected land cells.

---

## Intuition

The key insight for this problem is understanding how to find connected components in a grid:

> Treat the grid as a graph where each land cell (1) is a node. Connected cells (4-directional) form islands. We need to find the largest connected component.

### Key Observations

1. **Grid as Graph**: Each cell is a node, edges connect 4-directionally (up, down, left, right).

2. **Connected Components**: Each island is a connected component of land cells.

3. **DFS/BFS**: Use graph traversal to explore each island and count cells.

4. **Mark Visited**: Set visited cells to 0 to avoid reprocessing and double counting.

### Algorithm Overview

1. Iterate through each cell in the grid
2. If cell contains land (1) and unvisited, start DFS/BFS
3. Explore all connected land cells, count them
4. Update maximum area
5. Return maximum

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DFS (Recursive)** - Classic depth-first search
2. **BFS (Iterative)** - Breadth-first search using queue

---

## Approach 1: DFS (Recursive) ⭐

### Algorithm Steps

1. If grid is empty, return 0
2. Initialize max_area = 0
3. For each cell (i, j):
   - If grid[i][j] == 1, call dfs(i, j)
   - Update max_area with dfs return value
4. Return max_area

### Why It Works

DFS explores all connected land cells recursively, counting each cell exactly once.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        """
        Find maximum area of island using DFS.
        
        Args:
            grid: 2D binary grid
            
        Returns:
            Maximum area of any island
        """
        if not grid or not grid[0]:
            return 0
        m, n = len(grid), len(grid[0])
        max_area = 0
        
        def dfs(i: int, j: int) -> int:
            # Check bounds and if cell is land
            if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] == 0:
                return 0
            
            # Mark as visited
            grid[i][j] = 0
            
            # Explore all 4 directions and count
            return 1 + dfs(i + 1, j) + dfs(i - 1, j) + dfs(i, j + 1) + dfs(i, j - 1)
        
        # Try starting DFS from each land cell
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 1:
                    max_area = max(max_area, dfs(i, j))
        
        return max_area
```

<!-- slide -->
```cpp
class Solution {
public:
    int maxAreaOfIsland(vector<vector<int>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;
        
        int m = grid.size(), n = grid[0].size();
        int maxArea = 0;
        
        function<int(int, int)> dfs = [&](int i, int j) {
            if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] == 0)
                return 0;
            
            grid[i][j] = 0;  // Mark visited
            
            return 1 + dfs(i+1, j) + dfs(i-1, j) + dfs(i, j+1) + dfs(i, j-1);
        };
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    maxArea = max(maxArea, dfs(i, j));
                }
            }
        }
        
        return maxArea;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxAreaOfIsland(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }
        
        int m = grid.length, n = grid[0].length;
        int maxArea = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    maxArea = Math.max(maxArea, dfs(grid, i, j));
                }
            }
        }
        
        return maxArea;
    }
    
    private int dfs(int[][] grid, int i, int j) {
        int m = grid.length, n = grid[0].length;
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] == 0) {
            return 0;
        }
        
        grid[i][j] = 0;  // Mark visited
        
        return 1 + dfs(grid, i+1, j) + dfs(grid, i-1, j) + 
               dfs(grid, i, j+1) + dfs(grid, i, j-1);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxAreaOfIsland = function(grid) {
    if (!grid || !grid[0]) return 0;
    
    const m = grid.length, n = grid[0].length;
    let maxArea = 0;
    
    const dfs = (i, j) => {
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] === 0) {
            return 0;
        }
        
        grid[i][j] = 0;  // Mark visited
        
        return 1 + dfs(i + 1, j) + dfs(i - 1, j) + 
               dfs(i, j + 1) + dfs(i, j - 1);
    };
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 1) {
                maxArea = Math.max(maxArea, dfs(i, j));
            }
        }
    }
    
    return maxArea;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - each cell visited at most once |
| **Space** | O(m × n) - worst case recursion stack |

---

## Approach 2: BFS (Iterative) ⭐

### Algorithm Steps

1. If grid is empty, return 0
2. Initialize max_area = 0
3. For each cell (i, j):
   - If grid[i][j] == 1, start BFS
   - Use queue to explore island, count cells
   - Mark visited cells as 0
4. Return max_area

### Why It Works

BFS uses a queue to explore all connected land cells level by level, avoiding recursion depth issues.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        """
        Find maximum area of island using BFS.
        """
        if not grid or not grid[0]:
            return 0
        
        m, n = len(grid), len(grid[0])
        max_area = 0
        directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
        
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 1:
                    # BFS from this cell
                    queue = deque([(i, j)])
                    grid[i][j] = 0
                    area = 0
                    
                    while queue:
                        r, c = queue.popleft()
                        area += 1
                        
                        for dr, dc in directions:
                            nr, nc = r + dr, c + dc
                            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                                grid[nr][nc] = 0
                                queue.append((nr, nc))
                    
                    max_area = max(max_area, area)
        
        return max_area
```

<!-- slide -->
```cpp
class Solution {
public:
    int maxAreaOfIsland(vector<vector<int>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;
        
        int m = grid.size(), n = grid[0].size();
        int maxArea = 0;
        vector<pair<int,int>> dirs = {{0,1}, {0,-1}, {1,0}, {-1,0}};
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    queue<pair<int,int>> q;
                    q.push({i, j});
                    grid[i][j] = 0;
                    int area = 0;
                    
                    while (!q.empty()) {
                        auto [r, c] = q.front();
                        q.pop();
                        area++;
                        
                        for (auto [dr, dc] : dirs) {
                            int nr = r + dr, nc = c + dc;
                            if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == 1) {
                                grid[nr][nc] = 0;
                                q.push({nr, nc});
                            }
                        }
                    }
                    maxArea = max(maxArea, area);
                }
            }
        }
        
        return maxArea;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxAreaOfIsland(int[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        
        int m = grid.length, n = grid[0].length;
        int maxArea = 0;
        int[][] dirs = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    Queue<int[]> q = new LinkedList<>();
                    q.offer(new int[]{i, j});
                    grid[i][j] = 0;
                    int area = 0;
                    
                    while (!q.isEmpty()) {
                        int[] cell = q.poll();
                        area++;
                        
                        for (int[] dir : dirs) {
                            int nr = cell[0] + dir[0];
                            int nc = cell[1] + dir[1];
                            if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == 1) {
                                grid[nr][nc] = 0;
                                q.offer(new int[]{nr, nc});
                            }
                        }
                    }
                    maxArea = Math.max(maxArea, area);
                }
            }
        }
        
        return maxArea;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxAreaOfIsland = function(grid) {
    if (!grid || !grid[0]) return 0;
    
    const m = grid.length, n = grid[0].length;
    let maxArea = 0;
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 1) {
                const queue = [[i, j]];
                grid[i][j] = 0;
                let area = 0;
                
                while (queue.length) {
                    const [r, c] = queue.shift();
                    area++;
                    
                    for (const [dr, dc] of dirs) {
                        const nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {
                            grid[nr][nc] = 0;
                            queue.push([nr, nc]);
                        }
                    }
                }
                maxArea = Math.max(maxArea, area);
            }
        }
    }
    
    return maxArea;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - each cell visited at most once |
| **Space** | O(m × n) - worst case queue size |

---

## Comparison of Approaches

| Aspect | DFS (Recursive) | BFS (Iterative) |
|--------|-----------------|-----------------|
| **Time Complexity** | O(m × n) | O(m × n) |
| **Space Complexity** | O(m × n) | O(m × n) |
| **Implementation** | Simple | Moderate |
| **Stack Depth** | Can be deep | No recursion |

**Best Approach:** Either works well. Use DFS for simplicity, BFS to avoid recursion depth issues.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Microsoft, Apple
- **Difficulty**: Medium
- **Concepts Tested**: Graph traversal, DFS/BFS, connected components

### Learning Outcomes

1. **Graph Representation**: Convert grid to graph
2. **DFS/BFS**: Master both traversal techniques
3. **Marking Visited**: Avoid reprocessing cells

---

## Related Problems

Based on similar themes (graph traversal, connected components):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Islands | [Link](https://leetcode.com/problems/number-of-islands/) | Count islands |
| Island Perimeter | [Link](https://leetcode.com/problems/island-perimeter/) | Perimeter of island |
| Flood Fill | [Link](https://leetcode.com/problems/flood-fill/) | Similar DFS |
| Number of Closed Islands | [Link](https://leetcode.com/problems/number-of-closed-islands/) | Surrounded islands |

### Pattern Reference

For more detailed explanations of graph patterns, see:
- **[Graph BFS/DFS](/patterns/graph-bfs-connected-components-island-counting)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Max Area of Island](https://www.youtube.com/watch?v=iJ8nxQdBZ4w)** - Clear explanation
2. **[Max Area of Island - LeetCode 695](https://www.youtube.com/watch?v=NA2OsXoN6Xw)** - Detailed walkthrough
3. **[DFS vs BFS](https://www.youtube.com/watch?v=9XqS8rWc2jA)** - Understanding traversals

---

## Follow-up Questions

### Q1: How would you find the perimeter of the largest island?

**Answer:** For each land cell, count edges that touch water or boundary. Or use the formula: perimeter = 4 × land_cells - 2 × internal_edges.

---

### Q2: What if islands could be connected diagonally?

**Answer:** Change directions to include 8 directions instead of 4.

---

### Q3: How would you find all islands instead of just the largest?

**Answer:** Continue exploring after finding one island instead of just tracking maximum.

---

## Common Pitfalls

### 1. Not Checking Grid Bounds
**Issue:** Accessing cells outside grid boundaries.

**Solution:** Check bounds before recursive call.

### 2. Forgetting to Mark Visited
**Issue:** Not setting visited cells to 0, causing infinite loops or double counting.

**Solution:** Set grid[i][j] = 0 before making recursive calls.

### 3. Wrong Return Value
**Issue:** Not returning 0 for water cells.

**Solution:** Return 0 when hitting water or boundary.

### 4. Not Handling Empty Grid
**Issue:** Not checking for empty grid.

**Solution:** Check if not grid or not grid[0] at start.

### 5. Stack Overflow
**Issue:** Very large grids can cause recursion depth issues.

**Solution:** Use BFS instead of DFS for large grids.

---

## Summary

The **Max Area of Island** problem demonstrates the **Graph Traversal** pattern (DFS/BFS) for finding connected components in a grid. The key is exploring all connected land cells.

### Key Takeaways

1. **Grid as Graph**: Each cell is a node, 4-directional edges connect neighbors
2. **DFS/BFS Exploration**: Traverse all connected land cells
3. **Mark Visited**: Set visited cells to 0 to avoid reprocessing
4. **Track Maximum**: Keep track of the largest island area found

### Pattern Summary

This problem exemplifies the **Graph Traversal - DFS/BFS** pattern, characterized by:
- Converting grid/matrix to graph representation
- Using recursive or iterative traversal to explore connected components
- Marking visited nodes to avoid cycles and double counting

For more details on this pattern, see the **[Graph Traversal](/patterns/graph-bfs-connected-components-island-counting)**.

---

## Additional Resources

- [LeetCode Problem 695](https://leetcode.com/problems/max-area-of-island/) - Official problem page
- [Graph Traversal - GeeksforGeeks](https://www.geeksforgeeks.org/graph-traversals/) - Detailed explanation
- [DFS vs BFS](https://www.geeksforgeeks.org/difference-between-bfs-and-dfs/) - Comparison
- [Pattern: Graph BFS/DFS](/patterns/graph-bfs-connected-components-island-counting) - Comprehensive guide
