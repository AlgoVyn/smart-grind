# Number Of Closed Islands

## Problem Description

Given a 2D grid consists of 0s (land) and 1s (water). An island is a maximal 4-directionally connected group of 0s and a closed island is an island totally (all left, top, right, bottom) surrounded by 1s.

Return the number of closed islands.

**LeetCode Link:** [Number of Closed Islands - LeetCode](https://leetcode.com/problems/number-of-closed-islands/)

---

## Examples

### Example 1

**Input:**
```python
grid = [[1,1,1,1,1,1,1,0],[1,0,0,0,0,1,1,0],[1,0,1,0,1,1,1,0],[1,0,0,0,0,1,0,1],[1,1,1,1,1,1,1,0]]
```

**Output:**
```python
2
```

**Explanation:**
Islands in gray are closed because they are completely surrounded by water (group of 1s).

### Example 2

**Input:**
```python
grid = [[0,0,1,0,0],[0,1,0,1,0],[0,1,1,1,0]]
```

**Output:**
```python
1
```

### Example 3

**Input:**
```python
grid = [[1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1],
        [1,0,1,0,1,0,1],
        [1,0,1,1,1,0,1],
        [1,0,0,0,0,0,1],
        [1,1,1,1,1,1,1]]
```

**Output:**
```python
2
```

---

## Constraints

- `1 <= grid.length, grid[0].length <= 100`
- `0 <= grid[i][j] <= 1`

---

## Pattern: Graph Traversal - DFS/BFS with Boundary Check

This problem demonstrates the **Graph Traversal** pattern with boundary checking. The key is identifying islands that are completely enclosed by water.

### Core Concept

- **Closed Island**: Island not connected to boundary
- **Two-Phase Approach**: First remove boundary islands, then count interior
- **DFS**: Explore connected land cells
- **Mark Visited**: Convert visited cells to water (1)

### When to Use This Pattern

This pattern is applicable when:
1. Finding enclosed regions in a grid
2. Counting connected components with boundary conditions
3. Problems involving "island" detection

---

## Intuition

The key insight for this problem is understanding what makes an island "closed": it's not connected to the boundary of the grid.

### Key Observations

1. **Boundary Connection = Not Closed**: Any island that touches the grid boundary is not a closed island (it can "escape" to the edge).

2. **Two-Phase Strategy**: 
   - First, mark all islands connected to boundary (they're not closed)
   - Then, count remaining islands (they must be closed)

3. **DFS/BFS for Traversal**: Use depth-first search or breadth-first search to explore connected land cells.

4. **In-Place Modification**: Mark visited cells as water (1) to avoid revisiting.

### Algorithm Overview

1. **Phase 1 - Remove Boundary Islands**:
   - Start DFS from all boundary cells that are land (0)
   - Mark all reachable land as water (1)
   
2. **Phase 2 - Count Closed Islands**:
   - Iterate through interior cells
   - For each unvisited land cell, start DFS and count as one island
   - Increment counter for each island found

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DFS (Recursive)** - Most common solution
2. **BFS (Iterative)** - Alternative using queue

---

## Approach 1: DFS (Recursive)

### Algorithm Steps

1. Handle edge case of empty grid
2. Define DFS function that marks visited cells
3. Run DFS from all boundary cells to mark non-closed islands
4. Iterate interior cells and count closed islands

### Why It Works

This approach works because:
- DFS explores all connected land cells
- Starting from boundaries marks all non-closed islands
- Remaining land after phase 1 must be closed islands

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def closedIsland(self, grid: List[List[int]]) -> int:
        """
        Count closed islands using DFS.
        
        Args:
            grid: 2D grid where 0 is land, 1 is water
            
        Returns:
            Number of closed islands
        """
        if not grid or not grid[0]:
            return 0
        
        m, n = len(grid), len(grid[0])
        
        def dfs(i: int, j: int) -> None:
            """DFS to mark visited land cells as water."""
            # Boundary check and water check
            if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] == 1:
                return
            
            # Mark as visited (water)
            grid[i][j] = 1
            
            # Explore 4 directions
            dfs(i + 1, j)  # down
            dfs(i - 1, j)  # up
            dfs(i, j + 1)  # right
            dfs(i, j - 1)  # left
        
        # Phase 1: Mark all boundary-connected islands
        for i in range(m):
            dfs(i, 0)        # left boundary
            dfs(i, n - 1)    # right boundary
        for j in range(n):
            dfs(0, j)        # top boundary
            dfs(m - 1, j)    # bottom boundary
        
        # Phase 2: Count closed islands in interior
        count = 0
        for i in range(1, m - 1):
            for j in range(1, n - 1):
                if grid[i][j] == 0:  # Found unvisited land
                    dfs(i, j)
                    count += 1
        
        return count
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
private:
    int m, n;
    vector<vector<int>>& grid;
    
    void dfs(int i, int j) {
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] == 1) {
            return;
        }
        
        grid[i][j] = 1;  // Mark as visited
        
        dfs(i + 1, j);
        dfs(i - 1, j);
        dfs(i, j + 1);
        dfs(i, j - 1);
    }
    
public:
    int closedIsland(vector<vector<int>>& grid) {
        if (grid.empty() || grid[0].empty()) {
            return 0;
        }
        
        m = grid.size();
        n = grid[0].size();
        this->grid = grid;
        
        // Phase 1: Mark boundary-connected islands
        for (int i = 0; i < m; i++) {
            dfs(i, 0);
            dfs(i, n - 1);
        }
        for (int j = 0; j < n; j++) {
            dfs(0, j);
            dfs(m - 1, j);
        }
        
        // Phase 2: Count closed islands
        int count = 0;
        for (int i = 1; i < m - 1; i++) {
            for (int j = 1; j < n - 1; j++) {
                if (grid[i][j] == 0) {
                    dfs(i, j);
                    count++;
                }
            }
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    private int m, n;
    
    private void dfs(int[][] grid, int i, int j) {
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] == 1) {
            return;
        }
        
        grid[i][j] = 1;  // Mark as visited
        
        dfs(grid, i + 1, j);
        dfs(grid, i - 1, j);
        dfs(grid, i, j + 1);
        dfs(grid, i, j - 1);
    }
    
    public int closedIsland(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }
        
        m = grid.length;
        n = grid[0].length;
        
        // Phase 1: Mark boundary-connected islands
        for (int i = 0; i < m; i++) {
            dfs(grid, i, 0);
            dfs(grid, i, n - 1);
        }
        for (int j = 0; j < n; j++) {
            dfs(grid, 0, j);
            dfs(grid, m - 1, j);
        }
        
        // Phase 2: Count closed islands
        int count = 0;
        for (int i = 1; i < m - 1; i++) {
            for (int j = 1; j < n - 1; j++) {
                if (grid[i][j] == 0) {
                    dfs(grid, i, j);
                    count++;
                }
            }
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
var closedIsland = function(grid) {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
        return 0;
    }
    
    const m = grid.length;
    const n = grid[0].length;
    
    function dfs(i, j) {
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] === 1) {
            return;
        }
        
        grid[i][j] = 1;  // Mark as visited
        
        dfs(i + 1, j);
        dfs(i - 1, j);
        dfs(i, j + 1);
        dfs(i, j - 1);
    }
    
    // Phase 1: Mark boundary-connected islands
    for (let i = 0; i < m; i++) {
        dfs(i, 0);
        dfs(i, n - 1);
    }
    for (let j = 0; j < n; j++) {
        dfs(0, j);
        dfs(m - 1, j);
    }
    
    // Phase 2: Count closed islands
    let count = 0;
    for (let i = 1; i < m - 1; i++) {
        for (let j = 1; j < n - 1; j++) {
            if (grid[i][j] === 0) {
                dfs(i, j);
                count++;
            }
        }
    }
    
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m * n) - each cell visited at most twice |
| **Space** | O(m * n) - worst case recursion stack |

---

## Approach 2: BFS (Iterative)

### Algorithm Steps

1. Same as DFS but use queue for traversal
2. Process cells level by level
3. Mark visited cells as water

### Why It Works

BFS explores the same cells as DFS but uses iterative approach, avoiding potential stack overflow.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def closedIsland(self, grid: List[List[int]]) -> int:
        """
        Count closed islands using BFS.
        """
        if not grid or not grid[0]:
            return 0
        
        m, n = len(grid), len(grid[0])
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        
        def bfs(start_i: int, start_j: int) -> None:
            """BFS to mark visited land cells as water."""
            queue = deque([(start_i, start_j)])
            grid[start_i][start_j] = 1
            
            while queue:
                i, j = queue.popleft()
                
                for di, dj in directions:
                    ni, nj = i + di, j + dj
                    if 0 <= ni < m and 0 <= nj < n and grid[ni][nj] == 0:
                        grid[ni][nj] = 1
                        queue.append((ni, nj))
        
        # Phase 1: Mark boundary-connected islands
        for i in range(m):
            bfs(i, 0)
            bfs(i, n - 1)
        for j in range(n):
            bfs(0, j)
            bfs(m - 1, j)
        
        # Phase 2: Count closed islands
        count = 0
        for i in range(1, m - 1):
            for j in range(1, n - 1):
                if grid[i][j] == 0:
                    bfs(i, j)
                    count += 1
        
        return count
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int closedIsland(vector<vector<int>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;
        
        int m = grid.size(), n = grid[0].size();
        vector<pair<int, int>> dirs = {{1,0}, {-1,0}, {0,1}, {0,-1}};
        
        auto bfs = [&](int si, int sj) {
            queue<pair<int, int>> q;
            q.emplace(si, sj);
            grid[si][sj] = 1;
            
            while (!q.empty()) {
                auto [i, j] = q.front();
                q.pop();
                
                for (auto [di, dj] : dirs) {
                    int ni = i + di, nj = j + dj;
                    if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] == 0) {
                        grid[ni][nj] = 1;
                        q.emplace(ni, nj);
                    }
                }
            }
        };
        
        // Phase 1
        for (int i = 0; i < m; i++) {
            bfs(i, 0);
            bfs(i, n - 1);
        }
        for (int j = 0; j < n; j++) {
            bfs(0, j);
            bfs(m - 1, j);
        }
        
        // Phase 2
        int count = 0;
        for (int i = 1; i < m - 1; i++) {
            for (int j = 1; j < n - 1; j++) {
                if (grid[i][j] == 0) {
                    bfs(i, j);
                    count++;
                }
            }
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int closedIsland(int[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        
        int m = grid.length, n = grid[0].length;
        int[][] dirs = {{1,0}, {-1,0}, {0,1}, {0,-1}};
        
        java.util.function.BiConsumer<Integer, Integer> bfs = (si, sj) -> {
            java.util.Queue<int[]> q = new java.util.LinkedList<>();
            q.offer(new int[]{si, sj});
            grid[si][sj] = 1;
            
            while (!q.isEmpty()) {
                int[] curr = q.poll();
                for (int[] d : dirs) {
                    int ni = curr[0] + d[0], nj = curr[1] + d[1];
                    if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] == 0) {
                        grid[ni][nj] = 1;
                        q.offer(new int[]{ni, nj});
                    }
                }
            }
        };
        
        // Phase 1
        for (int i = 0; i < m; i++) {
            bfs.accept(i, 0);
            bfs.accept(i, n - 1);
        }
        for (int j = 0; j < n; j++) {
            bfs.accept(0, j);
            bfs.accept(m - 1, j);
        }
        
        // Phase 2
        int count = 0;
        for (int i = 1; i < m - 1; i++) {
            for (int j = 1; j < n - 1; j++) {
                if (grid[i][j] == 0) {
                    bfs.accept(i, j);
                    count++;
                }
            }
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
var closedIsland = function(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const m = grid.length, n = grid[0].length;
    const dirs = [[1,0], [-1,0], [0,1], [0,-1]];
    
    const bfs = (si, sj) => {
        const q = [[si, sj]];
        grid[si][sj] = 1;
        
        while (q.length) {
            const [i, j] = q.shift();
            for (const [di, dj] of dirs) {
                const ni = i + di, nj = j + dj;
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] === 0) {
                    grid[ni][nj] = 1;
                    q.push([ni, nj]);
                }
            }
        }
    };
    
    // Phase 1
    for (let i = 0; i < m; i++) {
        bfs(i, 0);
        bfs(i, n - 1);
    }
    for (let j = 0; j < n; j++) {
        bfs(0, j);
        bfs(m - 1, j);
    }
    
    // Phase 2
    let count = 0;
    for (let i = 1; i < m - 1; i++) {
        for (let j = 1; j < n - 1; j++) {
            if (grid[i][j] === 0) {
                bfs(i, j);
                count++;
            }
        }
    }
    
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m * n) - each cell visited at most twice |
| **Space** | O(m * n) - worst case queue size |

---

## Comparison of Approaches

| Aspect | DFS | BFS |
|--------|-----|-----|
| **Time Complexity** | O(m * n) | O(m * n) |
| **Space Complexity** | O(m * n) | O(m * n) |
| **Implementation** | Recursive | Iterative |
| **Stack Overflow Risk** | Yes | No |

**Best Approach:** Use either - both are efficient. DFS is more concise, BFS avoids recursion limits.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Graph traversal, DFS/BFS, Island problems

### Learning Outcomes

1. **Two-Phase Approach**: Learn to handle boundary conditions
2. **Graph Traversal**: Master DFS/BFS on grids
3. **In-Place Modification**: Learn to modify grid during traversal

---

## Related Problems

Based on similar themes (island problems, grid traversal):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Islands | [Link](https://leetcode.com/problems/number-of-islands/) | Count all islands |
| Island Perimeter | [Link](https://leetcode.com/problems/island-perimeter/) | Calculate perimeter |
| Max Area of Island | [Link](https://leetcode.com/problems/max-area-of-island/) | Largest island area |

### Pattern Reference

For more detailed explanations, see:
- **[Graph Traversal Pattern](/patterns/graph)**
- **[DFS Pattern](/patterns/dfs)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Number of Closed Islands - NeetCode](https://www.youtube.com/watch?v=riXkWcNnawo)** - Clear explanation
2. **[LeetCode 1254 - Number of Closed Islands](https://www.youtube.com/watch?v=s15h2v0r8vU)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you modify the solution for 8-directional connectivity?

**Answer:** Add 4 more diagonal directions: (1,1), (1,-1), (-1,1), (-1,-1).

---

### Q2: What if the grid had multiple types of terrain (not just 0 and 1)?

**Answer:** The same approach applies - just treat the target terrain value as "land" and others as "water".

---

### Q3: How would you find the largest closed island instead of counting them?

**Answer:** Track the size during each DFS/BFS and maintain a maximum counter.

---

## Common Pitfalls

### 1. Not Checking Boundary Connections
**Issue**: Counting islands connected to boundary as closed.

**Solution**: Always remove boundary-connected islands first.

### 2. Forgetting to Mark Visited
**Issue**: Not marking cells as visited, causing infinite loops or double counting.

**Solution**: Set grid[i][j] = 1 after visiting.

### 3. Wrong Iteration Range
**Issue**: Not excluding boundary cells when counting.

**Solution**: Iterate from 1 to m-1 and 1 to n-1 for interior cells.

### 4. Stack Overflow
**Issue**: Deep recursion on large grids.

**Solution**: Use BFS or increase recursion limit.

---

## Summary

The **Number of Closed Islands** problem demonstrates the two-phase approach for handling boundary conditions:

Key takeaways:
1. Closed islands = islands not connected to boundary
2. Two-phase: first remove boundary islands, then count interior islands
3. Use DFS or BFS to explore connected land cells
4. Mark visited cells to avoid revisiting

This problem is essential for understanding island detection with boundary constraints.

### Pattern Summary

This problem exemplifies the **Graph Traversal with Boundary Check** pattern, characterized by:
- Two-phase approach (boundary removal + counting)
- In-place modification for marking visited
- DFS/BFS for connected component exploration
- Applications in grid-based island problems

For more details, see the **[Graph Traversal Pattern](/patterns/graph)**.

---

## Additional Resources

- [LeetCode Problem 1254](https://leetcode.com/problems/number-of-closed-islands/) - Official problem page
- [Island Problems - GeeksforGeeks](https://www.geeksforgeeks.org/find-the-number-of-islands/) - Related problems
- [Pattern: Graph Traversal](/patterns/graph) - Comprehensive pattern guide
