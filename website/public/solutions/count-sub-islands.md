# Count Sub Islands

## LeetCode Link

[Count Sub Islands - LeetCode](https://leetcode.com/problems/count-sub-islands/)

---

## Problem Description

You are given two m x n binary matrices grid1 and grid2 containing only 0's (representing water) and 1's (representing land). An island is a group of 1's connected 4-directionally (horizontal or vertical). Any cells outside of the grid are considered water cells.
An island in grid2 is considered a sub-island if there is an island in grid1 that contains all the cells that make up this island in grid2.
Return the number of islands in grid2 that are considered sub-islands.

---

## Examples

**Example 1:**

**Input:**
```python
grid1 = [[1,1,1,0,0],[0,1,1,1,1],[0,0,0,0,0],[1,0,0,0,0],[1,1,0,1,1]], grid2 = [[1,1,1,0,0],[0,0,1,1,1],[0,1,0,0,0],[1,0,1,1,0],[0,1,0,1,0]]
```

**Output:**
```python
3
```

**Explanation:** In the picture above, the grid on the left is grid1 and the grid on the right is grid2.
The 1s colored red in grid2 are those considered to be part of a sub-island. There are three sub-islands.

**Example 2:**

**Input:**
```python
grid1 = [[1,0,1,0,1],[1,1,1,1,1],[0,0,0,0,0],[1,1,1,1,1],[1,0,1,0,1]], grid2 = [[0,0,0,0,0],[1,1,1,1,1],[0,1,0,1,0],[0,1,0,1,0],[1,0,0,0,1]]
```

**Output:**
```python
2
```

**Explanation:** In the picture above, the grid on the left is grid1 and the grid on the right is grid2.
The 1s colored red in grid2 are those considered to be part of a sub-island. There are two sub-islands.

---

## Constraints

- `m == grid1.length == grid2.length`
- `n == grid1[i].length == grid2[i].length`
- `1 <= m, n <= 500`
- `grid1[i][j]` and `grid2[i][j]` are either 0 or 1.

---

## Intuition

The key insight is that a sub-island in grid2 must be **completely contained** within an island in grid1. This means every cell that is land (1) in the island of grid2 must also be land (1) in grid1.

**Key observations:**
1. We only need to check islands in grid2, not grid1 directly
2. For each island in grid2, verify ALL its cells exist as land in grid1
3. Use DFS to traverse each island and AND-compare with grid1
4. If any cell in the grid2 island is water (0) in grid1, it's not a sub-island

**Why DFS works:** DFS naturally explores all connected cells in an island, allowing us to check each cell against grid1 simultaneously.

---

## Pattern:

This problem follows the **Graph/Grid DFS** pattern, specifically checking for sub-islands between two grids.

### Core Concept

- **Island containment**: A sub-island in grid2 must be completely inside an island in grid1
- **DFS traversal**: Visit all cells in an island to verify containment
- **AND logic**: All cells in the island must have corresponding 1s in grid1

### When to Use This Pattern

This pattern is applicable when:
1. Finding islands in one grid that are subsets of islands in another
2. Problems requiring verification across two grids
3. Grid containment problems with DFS/BFS

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Number of Islands | Count islands in a single grid |
| Island Perimeter | Calculate perimeter of islands |
| Max Area of Island | Find largest island area |

### Pattern Summary

This problem exemplifies **Two-Grid DFS Validation**, characterized by:
- DFS on grid2 while checking grid1 simultaneously
- Using AND logic to ensure all cells are contained
- Marking visited cells to avoid reprocessing

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DFS Approach** - Optimal recursive solution
2. **BFS Approach** - Iterative alternative

---

## Approach 1: DFS Approach (Optimal)

### Algorithm Steps

1. **Iterate through grid2**: Find all unvisited land cells (1s)
2. **Start DFS**: For each land cell, call DFS to explore the entire island
3. **Check containment**: For each cell in the island, verify it's also land in grid1
4. **Use AND logic**: Combine all checks - ALL cells must be valid
5. **Mark visited**: Set grid2 cells to 0 after processing
6. **Count valid islands**: Increment count when island is a sub-island

### Why It Works

DFS explores all connected cells in the island. By checking grid1[i][j] == 1 for each visited cell and combining with AND (&), we ensure that EVERY cell in the island has a corresponding land cell in grid1. If even one cell fails, the island is not a sub-island.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def countSubIslands(self, grid1: List[List[int]], grid2: List[List[int]]) -> int:
        """
        Count sub-islands using DFS.
        
        Args:
            grid1: First grid (reference grid)
            grid2: Second grid (to find sub-islands in)
            
        Returns:
            Number of sub-islands
        """
        if not grid1 or not grid2:
            return 0
            
        m, n = len(grid1), len(grid1[0])
        
        def dfs(i: int, j: int) -> bool:
            # Base case: out of bounds or water in grid2
            if i < 0 or i >= m or j < 0 or j >= n or grid2[i][j] == 0:
                return True  # Doesn't invalidate sub-island
            
            # Mark as visited
            grid2[i][j] = 0
            
            # Check if this cell is land in both grids
            is_sub = (grid1[i][j] == 1)
            
            # Explore all 4 directions and combine with AND
            is_sub &= dfs(i + 1, j)
            is_sub &= dfs(i - 1, j)
            is_sub &= dfs(i, j + 1)
            is_sub &= dfs(i, j - 1)
            
            return is_sub
        
        count = 0
        for i in range(m):
            for j in range(n):
                if grid2[i][j] == 1:  # Unvisited land in grid2
                    if dfs(i, j):
                        count += 1
        
        return count
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int countSubIslands(vector<vector<int>>& grid1, vector<vector<int>>& grid2) {
        if (grid1.empty() || grid2.empty()) return 0;
        
        int m = grid1.size();
        int n = grid1[0].size();
        
        function<bool(int, int)> dfs = [&](int i, int j) -> bool {
            if (i < 0 || i >= m || j < 0 || j >= n || grid2[i][j] == 0) {
                return true;
            }
            
            grid2[i][j] = 0;
            bool isSub = (grid1[i][j] == 1);
            
            isSub &= dfs(i + 1, j);
            isSub &= dfs(i - 1, j);
            isSub &= dfs(i, j + 1);
            isSub &= dfs(i, j - 1);
            
            return isSub;
        };
        
        int count = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid2[i][j] == 1) {
                    if (dfs(i, j)) {
                        count++;
                    }
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
    private int m;
    private int n;
    private int[][] grid1;
    private int[][] grid2;
    
    private boolean dfs(int i, int j) {
        if (i < 0 || i >= m || j < 0 || j >= n || grid2[i][j] == 0) {
            return true;
        }
        
        grid2[i][j] = 0;
        boolean isSub = (grid1[i][j] == 1);
        
        isSub &= dfs(i + 1, j);
        isSub &= dfs(i - 1, j);
        isSub &= dfs(i, j + 1);
        isSub &= dfs(i, j - 1);
        
        return isSub;
    }
    
    public int countSubIslands(int[][] grid1, int[][] grid2) {
        if (grid1 == null || grid2 == null || grid1.length == 0) {
            return 0;
        }
        
        this.m = grid1.length;
        this.n = grid1[0].length;
        this.grid1 = grid1;
        this.grid2 = grid2;
        
        int count = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid2[i][j] == 1) {
                    if (dfs(i, j)) {
                        count++;
                    }
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
 * @param {number[][]} grid1
 * @param {number[][]} grid2
 * @return {number}
 */
var countSubIslands = function(grid1, grid2) {
    if (!grid1 || !grid2 || grid1.length === 0) return 0;
    
    const m = grid1.length;
    const n = grid1[0].length;
    
    function dfs(i, j) {
        if (i < 0 || i >= m || j < 0 || j >= n || grid2[i][j] === 0) {
            return true;
        }
        
        grid2[i][j] = 0;
        let isSub = (grid1[i][j] === 1);
        
        isSub &= dfs(i + 1, j);
        isSub &= dfs(i - 1, j);
        isSub &= dfs(i, j + 1);
        isSub &= dfs(i, j - 1);
        
        return isSub;
    }
    
    let count = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid2[i][j] === 1) {
                if (dfs(i, j)) {
                    count++;
                }
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
| **Time** | O(m × n) - each cell visited at most once |
| **Space** | O(m × n) - worst case recursion depth for large island |

---

## Approach 2: BFS Approach

### Algorithm Steps

1. **Iterate through grid2**: Find all unvisited land cells
2. **Start BFS**: Use queue to explore entire island
3. **Check containment**: For each cell, verify grid1[i][j] == 1
4. **Mark visited**: Set grid2 cells to 0 after adding to queue
5. **Count valid islands**: If all cells valid, increment count

### Why It Works

BFS explores all connected cells level by level. Like DFS, it checks each cell against grid1 and ensures ALL cells are valid land cells.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def countSubIslands(self, grid1: List[List[int]], grid2: List[List[int]]) -> int:
        """
        Count sub-islands using BFS.
        """
        if not grid1 or not grid2:
            return 0
            
        m, n = len(grid1), len(grid1[0])
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        
        def bfs(start_i: int, start_j: int) -> bool:
            queue = deque([(start_i, start_j)])
            grid2[start_i][start_j] = 0
            is_sub = True
            
            while queue:
                i, j = queue.popleft()
                
                # Check if this cell is land in both grids
                if grid1[i][j] == 0:
                    is_sub = False
                
                # Explore neighbors
                for di, dj in directions:
                    ni, nj = i + di, j + dj
                    if 0 <= ni < m and 0 <= nj < n and grid2[ni][nj] == 1:
                        grid2[ni][nj] = 0
                        queue.append((ni, nj))
            
            return is_sub
        
        count = 0
        for i in range(m):
            for j in range(n):
                if grid2[i][j] == 1:
                    if bfs(i, j):
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
    int countSubIslands(vector<vector<int>>& grid1, vector<vector<int>>& grid2) {
        if (grid1.empty() || grid2.empty()) return 0;
        
        int m = grid1.size();
        int n = grid1[0].size();
        vector<pair<int, int>> dirs = {{1,0}, {-1,0}, {0,1}, {0,-1}};
        
        auto bfs = [&](int start_i, int start_j) -> bool {
            queue<pair<int, int>> q;
            q.push({start_i, start_j});
            grid2[start_i][start_j] = 0;
            bool isSub = true;
            
            while (!q.empty()) {
                auto [i, j] = q.front();
                q.pop();
                
                if (grid1[i][j] == 0) isSub = false;
                
                for (auto [di, dj] : dirs) {
                    int ni = i + di, nj = j + dj;
                    if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid2[ni][nj] == 1) {
                        grid2[ni][nj] = 0;
                        q.push({ni, nj});
                    }
                }
            }
            
            return isSub;
        };
        
        int count = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid2[i][j] == 1 && bfs(i, j)) {
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
    private int[][] grid1;
    private int[][] grid2;
    private int m, n;
    private int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    
    private boolean bfs(int si, int sj) {
        Queue<int[]> q = new LinkedList<>();
        q.add(new int[]{si, sj});
        grid2[si][sj] = 0;
        boolean isSub = true;
        
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            int i = cur[0], j = cur[1];
            
            if (grid1[i][j] == 0) isSub = false;
            
            for (int[] d : dirs) {
                int ni = i + d[0], nj = j + d[1];
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid2[ni][nj] == 1) {
                    grid2[ni][nj] = 0;
                    q.add(new int[]{ni, nj});
                }
            }
        }
        
        return isSub;
    }
    
    public int countSubIslands(int[][] grid1, int[][] grid2) {
        if (grid1 == null || grid2 == null || grid1.length == 0) return 0;
        
        this.grid1 = grid1;
        this.grid2 = grid2;
        this.m = grid1.length;
        this.n = grid1[0].length;
        
        int count = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid2[i][j] == 1 && bfs(i, j)) {
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
 * @param {number[][]} grid1
 * @param {number[][]} grid2
 * @return {number}
 */
var countSubIslands = function(grid1, grid2) {
    if (!grid1 || !grid2 || grid1.length === 0) return 0;
    
    const m = grid1.length;
    const n = grid1[0].length;
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    
    function bfs(si, sj) {
        const queue = [[si, sj]];
        grid2[si][sj] = 0;
        let isSub = true;
        
        while (queue.length > 0) {
            const [i, j] = queue.shift();
            
            if (grid1[i][j] === 0) isSub = false;
            
            for (const [di, dj] of dirs) {
                const ni = i + di, nj = j + dj;
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid2[ni][nj] === 1) {
                    grid2[ni][nj] = 0;
                    queue.push([ni, nj]);
                }
            }
        }
        
        return isSub;
    }
    
    let count = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid2[i][j] === 1 && bfs(i, j)) {
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
| **Time** | O(m × n) - each cell visited at most once |
| **Space** | O(m × n) - queue can hold at most entire island |

---

## Comparison of Approaches

| Aspect | DFS | BFS |
|--------|-----|-----|
| **Time Complexity** | O(m × n) | O(m × n) |
| **Space Complexity** | O(m × n) | O(m × n) |
| **Implementation** | Recursive, simpler | Iterative, explicit queue |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Use either DFS or BFS. DFS is more commonly used and concise.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: DFS/BFS, Grid Traversal, Two-Grid Comparison

### Learning Outcomes

1. **Multi-Grid Problems**: Learn to compare and validate across multiple grids
2. **DFS/BFS Mastery**: Understand how to traverse and mark visited cells
3. **Logical Thinking**: Use AND logic to ensure all conditions are met

---

## Related Problems

Based on similar themes (islands, grid traversal):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Islands | [Link](https://leetcode.com/problems/number-of-islands/) | Count islands in one grid |
| Max Area of Island | [Link](https://leetcode.com/problems/max-area-of-island/) | Find largest island |
| Island Perimeter | [Link](https://leetcode.com/problems/island-perimeter/) | Calculate perimeter |
| Number of Closed Islands | [Link](https://leetcode.com/problems/number-of-closed-islands/) | Count enclosed islands |
| Number of Enclaves | [Link](https://leetcode.com/problems/number-of-enclaves/) | Count boundary-connected land |

### Pattern Reference

For more detailed explanations of the Island problems pattern, see:
- **[Island Problems Pattern](/patterns/graph-dfs)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Count Sub Islands](https://www.youtube.com/watch?v=dWe6V0b03EE)** - Clear explanation with visual examples
2. **[Count Sub Islands - LeetCode 1905](https://www.youtube.com/watch?v=TnGbj2jS-yg)** - Detailed walkthrough
3. **[DFS on Grid](https://www.youtube.com/watch?v=TmHpR8BWr8w)** - Understanding grid DFS

### Related Concepts

- **[Graph DFS](https://www.youtube.com/watch?v=PyY9tRIy6Bk)** - DFS fundamentals
- **[BFS Fundamentals](https://www.youtube.com/watch?v=oDc9oBk9wHw)** - BFS pattern

---

## Follow-up Questions

### Q1: How would you modify to find the maximum sized sub-island?

**Answer:** Instead of just counting, track the size of each island. Modify DFS to return both validity AND size, or track size separately with a counter that increments when visiting new cells.

### Q2: What if we need to find islands in grid1 that contain islands in grid2?

**Answer:** This is exactly what we're doing! The problem is symmetric - we're finding which grid2 islands are contained in grid1 islands.

### Q3: How would you handle multiple layers of containment?

**Answer:** For multiple grids, extend the approach to check all grids simultaneously. Use AND logic across all grid references.

### Q4: Can you solve this without modifying grid2?

**Answer:** Yes, use a separate visited array or create a copy of grid2 to mark visited cells instead of modifying the original.

---

## Common Pitfalls

### 1. Returning wrong value for out-of-bounds
**Issue:** Returning False for out-of-bounds may incorrectly mark valid islands as non-sub-islands.

**Solution:** Return True for out-of-bounds/water cells - they don't invalidate the sub-island.

### 2. Using OR instead of AND
**Issue:** Using OR logic would return True if ANY cell has matching 1 in grid1.

**Solution:** Use AND (&=) to ensure ALL cells in the island have corresponding 1s.

### 3. Not marking visited cells
**Issue:** Without marking, DFS will reprocess cells leading to infinite loops or wrong counts.

**Solution:** Set grid2[i][j] = 0 after visiting each cell.

### 4. Checking grid1 after marking
**Issue:** Must check grid1[i][j] BEFORE marking grid2[i][j] as visited.

**Solution:** Check grid1 first, then mark grid2.

### 5. Not handling empty grids
**Issue:** Code may fail for grids with no land.

**Solution:** Handle edge cases: return 0 if either grid is empty.

---

## Summary

The **Count Sub Islands** problem demonstrates the **Two-Grid DFS Validation** pattern:

- **DFS exploration**: Visit all connected cells in an island
- **AND validation**: Ensure ALL cells exist in both grids
- **Mark visited**: Prevent reprocessing cells
- **Time complexity**: O(m × n) - optimal

Key insights:
1. For each island in grid2, verify it exists entirely in grid1
2. Return True for water/out-of-bounds (doesn't invalidate)
3. Use AND to combine all cell checks
4. Mark visited cells to avoid double counting

This problem is essential for understanding how to solve multi-grid validation problems and forms the foundation for more complex grid containment scenarios.
