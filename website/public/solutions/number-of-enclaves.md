# Number of Enclaves

## Problem Description

You are given an m x n binary matrix grid, where 0 represents a sea cell and 1 represents a land cell.

A move consists of walking from one land cell to another adjacent (4-directionally) land cell or walking off the boundary of the grid.

Return the number of land cells in grid for which we cannot walk off the boundary of the grid in any number of moves.

**Link to problem:** [Number of Enclaves - LeetCode 1020](https://leetcode.com/problems/number-of-enclaves/)

## Constraints
- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 500`
- `grid[i][j]` is either 0 or 1

---

## Pattern: DFS/BFS - Flood Fill Boundary

This problem is a classic example of the **DFS/BFS - Flood Fill Boundary** pattern.

### Core Concept

- **Boundary Flood Fill**: Start DFS/BFS from boundary land cells
- **Mark Visited**: Set visited land cells to 0
- **Count Remaining**: Count remaining 1s as enclaves

---

## Examples

### Example

**Input:** grid = [[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]

**Output:** 3

**Explanation:** Three 1s in the center are enclosed by 0s.

### Example 2

**Input:** grid = [[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0]]

**Output:** 0

---

## Intuition

The key insight is to:

1. Start from all boundary land cells
2. Mark all reachable land cells as visited
3. Count the remaining land cells that cannot reach boundary

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DFS (Optimal)** - O(m × n) time
2. **BFS** - O(m × n) time

---

## Approach 1: DFS

This is the most common approach.

### Algorithm Steps

1. For each boundary cell:
   - If it's land, run DFS to mark all connected land
2. Count remaining land cells

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def numEnclaves(self, grid: List[List[int]]) -> int:
        """
        Count enclaves using DFS.
        
        Args:
            grid: Binary matrix
            
        Returns:
            Number of enclaves
        """
        m, n = len(grid), len(grid[0])
        
        def dfs(i, j):
            if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] == 0:
                return
            grid[i][j] = 0  # Mark as visited
            dfs(i + 1, j)
            dfs(i - 1, j)
            dfs(i, j + 1)
            dfs(i, j - 1)
        
        # Remove all lands connected to boundary
        for i in range(m):
            if grid[i][0] == 1:
                dfs(i, 0)
            if grid[i][n - 1] == 1:
                dfs(i, n - 1)
        
        for j in range(n):
            if grid[0][j] == 1:
                dfs(0, j)
            if grid[m - 1][j] == 1:
                dfs(m - 1, j)
        
        # Count remaining lands (enclaves)
        count = sum(grid[i][j] for i in range(m) for j in range(n))
        return count
```

<!-- slide -->
```cpp
class Solution {
public:
    int numEnclaves(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        
        function<void(int,int)> dfs = [&](int i, int j) {
            if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] == 0) return;
            grid[i][j] = 0;
            dfs(i+1, j); dfs(i-1, j);
            dfs(i, j+1); dfs(i, j-1);
        };
        
        for (int i = 0; i < m; i++) {
            if (grid[i][0]) dfs(i, 0);
            if (grid[i][n-1]) dfs(i, n-1);
        }
        for (int j = 0; j < n; j++) {
            if (grid[0][j]) dfs(0, j);
            if (grid[m-1][j]) dfs(m-1, j);
        }
        
        int count = 0;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (grid[i][j]) count++;
        
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int numEnclaves(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        
        for (int i = 0; i < m; i++) {
            if (grid[i][0] == 1) dfs(i, 0, grid, dirs);
            if (grid[i][n-1] == 1) dfs(i, n-1, grid, dirs);
        }
        for (int j = 0; j < n; j++) {
            if (grid[0][j] == 1) dfs(0, j, grid, dirs);
            if (grid[m-1][j] == 1) dfs(m-1, j, grid, dirs);
        }
        
        int count = 0;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (grid[i][j] == 1) count++;
        
        return count;
    }
    
    private void dfs(int i, int j, int[][] grid, int[][] dirs) {
        if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] == 0)
            return;
        grid[i][j] = 0;
        for (int[] d : dirs) dfs(i + d[0], j + d[1], grid, dirs);
    }
}
```

<!-- slide -->
```javascript
var numEnclaves = function(grid) {
    const m = grid.length, n = grid[0].length;
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    
    const dfs = (i, j) => {
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] === 0) return;
        grid[i][j] = 0;
        for (const [dx, dy] of dirs) dfs(i + dx, j + dy);
    };
    
    for (let i = 0; i < m; i++) {
        if (grid[i][0] === 1) dfs(i, 0);
        if (grid[i][n-1] === 1) dfs(i, n-1);
    }
    for (let j = 0; j < n; j++) {
        if (grid[0][j] === 1) dfs(0, j);
        if (grid[m-1][j] === 1) dfs(m-1, j);
    }
    
    let count = 0;
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
            if (grid[i][j] === 1) count++;
    
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) |
| **Space** | O(m × n) worst case |

---

## Approach 2: BFS

Using queue-based approach.

### Code Implementation

````carousel
```python
from collections import deque

class Solution:
    def numEnclaves_bfs(self, grid: List[List[int]]) -> int:
        """
        Count enclaves using BFS.
        """
        m, n = len(grid), len(grid[0])
        q = deque()
        
        # Add boundary land cells to queue
        for i in range(m):
            if grid[i][0] == 1:
                q.append((i, 0))
            if grid[i][n-1] == 1:
                q.append((i, n-1))
        
        for j in range(n):
            if grid[0][j] == 1:
                q.append((0, j))
            if grid[m-1][j] == 1:
                q.append((m-1, j))
        
        dirs = [(1,0),(-1,0),(0,1),(0,-1)]
        
        while q:
            i, j = q.popleft()
            if grid[i][j] == 0:
                continue
            grid[i][j] = 0
            
            for di, dj in dirs:
                ni, nj = i + di, j + dj
                if 0 <= ni < m and 0 <= nj < n and grid[ni][nj] == 1:
                    q.append((ni, nj))
        
        return sum(grid[i][j] for i in range(m) for j in range(n))
```

<!-- slide -->
```cpp
class Solution {
public:
    int numEnclavesBFS(vector<vector<int>>& grid) {
        // Similar to DFS but using queue
    }
};
```

<!-- slide -->
```java
class Solution {
    public int numEnclavesBFS(int[][] grid) {
        // Similar to DFS but using queue
    }
}
```

<!-- slide -->
```javascript
var numEnclaves = function(grid) {
    // Similar to DFS but using queue
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) |
| **Space** | O(m × n) |

---

## Comparison of Approaches

| Aspect | DFS | BFS |
|--------|-----|-----|
| **Time** | O(m × n) | O(m × n) |
| **Space** | O(m × n) | O(m × n) |

Both are equivalent in complexity.

---

## Related Problems

### Similar Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Closed Islands | [Link](https://leetcode.com/problems/number-of-closed-islands/) | Similar enclave problem |
| Flood Fill | [Link](https://leetcode.com/problems/flood-fill/) | Basic flood fill |

---

## Video Tutorial Links

- [NeetCode - Number of Enclaves](https://www.youtube.com/watch?v=7C_f7fD2p14) - Clear explanation

---

## Follow-up Questions

### Q1: Can BFS be used instead of DFS?

**Answer:** Yes, BFS works equally well with a queue instead of recursion stack.

### Q2: How to handle very large grids?

**Answer:** Use iterative BFS to avoid stack overflow, or increase recursion limit.

---

## Common Pitfalls

### 1. Grid Modification
**Issue**: Modifying the original grid during DFS.

**Solution**: Mark visited cells as 0 (or any non-1 value) to avoid reprocessing.

### 2. Stack Overflow
**Issue**: Recursive DFS can cause stack overflow for large grids.

**Solution**: Use iterative BFS instead of recursive DFS for large grids.

### 3. Boundary Conditions
**Issue**: Not checking all boundary cells.

**Solution**: Iterate through all four edges of the grid to start flood fill from boundary land cells.

### 4. Direction Vectors
**Issue**: Missing or incorrect direction vectors.

**Solution**: Use all four directions: [(1,0), (-1,0), (0,1), (0,-1)].

---

## Summary

The **Number of Enclaves** problem demonstrates **Boundary Flood Fill**:
- Remove all land reachable from boundary
- Count remaining unreachable land
- O(m×n) time and space

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/number-of-enclaves/discuss/)
