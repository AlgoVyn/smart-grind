# Number Of Islands

## Problem Description

[LeetCode Link](https://leetcode.com/problems/number-of-islands/)

Given an m x n 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

This is **LeetCode Problem #200** and is classified as a Medium difficulty problem. It's one of the most classic graph traversal problems.

---

## Examples

### Example 1

**Input:**
```python
grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
```

**Output:**
```python
1
```

**Explanation:** All '1's form one connected island.

### Example 2

**Input:**
```python
grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
```

**Output:**
```python
3
```

**Explanation:** There are three islands:
- Two '1's on the top-left
- One '1' in the middle
- Two '1's on the bottom-right

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `m == grid.length` | Number of rows |
| `n == grid[i].length` | Number of columns |
| `1 <= m, n <= 300` | Grid dimensions |
| `grid[i][j]` is '0' or '1' | Binary grid |

---

## Pattern: Graph/Grid DFS/BFS

This problem follows the **Graph/Grid DFS/BFS** pattern for flood fill.

### Core Concept

- **Flood Fill**: Mark visited cells to avoid counting same island twice
- **Four Directions**: Visit all connected land cells
- **Count Components**: Each DFS/BFS finds one island

### When to Use This Pattern

This pattern is applicable when:
1. Counting connected components in grid
2. Flood fill problems
3. Island counting problems

---

## Intuition

The key insight for this problem is understanding that an island is simply a **connected component** of land cells. We need to count how many such components exist in the grid.

### Key Observations

1. **Connected Definition**: Land cells are connected if they're adjacent horizontally or vertically (not diagonally).

2. **Flood Fill Strategy**: When we find an unvisited land cell, we should "flood fill" all connected land cells to mark them as visited.

3. **Why It Works**: Each time we start a new flood fill, we've found a new island. The total count equals the number of flood fills performed.

4. **In-Place Modification**: We can modify the grid in-place to mark visited cells (e.g., change '1' to '0').

### Algorithm Overview

1. Iterate through each cell in the grid
2. When a '1' is found (unvisited land):
   - Perform DFS/BFS to mark all connected land cells as visited
   - Increment island count
3. Return the total count

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **DFS (Depth-First Search)** - Recursive implementation
2. **BFS (Breadth-First Search)** - Iterative with queue
3. **Union-Find** - Disjoint Set Union approach

---

## Approach 1: Depth-First Search (DFS)

### Why It Works

DFS explores as far as possible along each branch before backtracking. When applied to grid traversal, it naturally visits all connected land cells from a starting position.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        """
        Count number of islands using DFS.
        
        Time Complexity: O(m * n)
        Space Complexity: O(m * n) for recursion stack
        """
        if not grid:
            return 0
        
        m, n = len(grid), len(grid[0])
        count = 0
        
        def dfs(i, j):
            """Flood fill using DFS - mark visited cells as '0'"""
            # Base case: out of bounds or water
            if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] == '0':
                return
            
            # Mark as visited
            grid[i][j] = '0'
            
            # Explore all 4 directions
            dfs(i + 1, j)  # Down
            dfs(i - 1, j)  # Up
            dfs(i, j + 1)  # Right
            dfs(i, j - 1)  # Left
        
        # Iterate through all cells
        for i in range(m):
            for j in range(n):
                if grid[i][j] == '1':
                    dfs(i, j)
                    count += 1
        
        return count
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;
        
        int m = grid.size(), n = grid[0].size();
        int count = 0;
        
        function<void(int, int)> dfs = [&](int i, int j) {
            // Base case: out of bounds or water
            if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] == '0')
                return;
            
            // Mark as visited
            grid[i][j] = '0';
            
            // Explore all 4 directions
            dfs(i + 1, j);
            dfs(i - 1, j);
            dfs(i, j + 1);
            dfs(i, j - 1);
        };
        
        // Iterate through all cells
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
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
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        
        int m = grid.length, n = grid[0].length;
        int count = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    dfs(grid, i, j, m, n);
                    count++;
                }
            }
        }
        
        return count;
    }
    
    private void dfs(char[][] grid, int i, int j, int m, int n) {
        // Base case: out of bounds or water
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] == '0')
            return;
        
        // Mark as visited
        grid[i][j] = '0';
        
        // Explore all 4 directions
        dfs(grid, i + 1, j, m, n);
        dfs(grid, i - 1, j, m, n);
        dfs(grid, i, j + 1, m, n);
        dfs(grid, i, j - 1, m, n);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const m = grid.length, n = grid[0].length;
    let count = 0;
    
    function dfs(i, j) {
        // Base case: out of bounds or water
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] === '0')
            return;
        
        // Mark as visited
        grid[i][j] = '0';
        
        // Explore all 4 directions
        dfs(i + 1, j);
        dfs(i - 1, j);
        dfs(i, j + 1);
        dfs(i, j - 1);
    }
    
    // Iterate through all cells
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === '1') {
                dfs(i, j);
                count++;
            }
        }
    }
    
    return count;
};
```
````

---

## Approach 2: Breadth-First Search (BFS)

### Why It Works

BFS uses a queue to explore cells level by level. It processes all cells at distance k before processing cells at distance k+1. This ensures we visit all connected land cells.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        """
        Count number of islands using BFS.
        
        Time Complexity: O(m * n)
        Space Complexity: O(min(m, n)) for queue
        """
        if not grid:
            return 0
        
        m, n = len(grid), len(grid[0])
        count = 0
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        
        for i in range(m):
            for j in range(n):
                if grid[i][j] == '1':
                    # BFS from this cell
                    queue = deque([(i, j)])
                    grid[i][j] = '0'  # Mark as visited
                    
                    while queue:
                        x, y = queue.popleft()
                        for dx, dy in directions:
                            nx, ny = x + dx, y + dy
                            if 0 <= nx < m and 0 <= ny < n and grid[nx][ny] == '1':
                                grid[nx][ny] = '0'
                                queue.append((nx, ny))
                    
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
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;
        
        int m = grid.size(), n = grid[0].size();
        int count = 0;
        vector<pair<int, int>> directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    // BFS from this cell
                    queue<pair<int, int>> q;
                    q.push({i, j});
                    grid[i][j] = '0';
                    
                    while (!q.empty()) {
                        auto [x, y] = q.front();
                        q.pop();
                        
                        for (auto [dx, dy] : directions) {
                            int nx = x + dx, ny = y + dy;
                            if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] == '1') {
                                grid[nx][ny] = '0';
                                q.push({nx, ny});
                            }
                        }
                    }
                    
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
import java.util.*;

class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        
        int m = grid.length, n = grid[0].length;
        int count = 0;
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    // BFS from this cell
                    Queue<int[]> q = new LinkedList<>();
                    q.add(new int[]{i, j});
                    grid[i][j] = '0';
                    
                    while (!q.isEmpty()) {
                        int[] curr = q.poll();
                        for (int[] d : directions) {
                            int nx = curr[0] + d[0];
                            int ny = curr[1] + d[1];
                            if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] == '1') {
                                grid[nx][ny] = '0';
                                q.add(new int[]{nx, ny});
                            }
                        }
                    }
                    
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
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const m = grid.length, n = grid[0].length;
    let count = 0;
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === '1') {
                // BFS from this cell
                const queue = [[i, j]];
                grid[i][j] = '0';
                
                while (queue.length > 0) {
                    const [x, y] = queue.shift();
                    
                    for (const [dx, dy] of directions) {
                        const nx = x + dx, ny = y + dy;
                        if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] === '1') {
                            grid[nx][ny] = '0';
                            queue.push([nx, ny]);
                        }
                    }
                }
                
                count++;
            }
        }
    }
    
    return count;
};
```
````

---

## Approach 3: Union-Find

### Why It Works

Union-Find maintains disjoint sets. We create a set for each land cell and union all adjacent land cells. The number of unique set roots equals the number of islands.

### Code Implementation

````carousel
```python
from typing import List

class UnionFind:
    def __init__(self, grid):
        self.m = len(grid)
        self.n = len(grid[0])
        self.parent = [-1] * (self.m * self.n)
        self.count = 0
        
        # Initialize: each '1' is its own parent
        for i in range(self.m):
            for j in range(self.n):
                if grid[i][j] == '1':
                    idx = i * self.n + j
                    self.parent[idx] = idx
                    self.count += 1
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        rootX, rootY = self.find(x), self.find(y)
        if rootX != rootY:
            self.parent[rootX] = rootY
            self.count -= 1

class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        """
        Count number of islands using Union-Find.
        
        Time Complexity: O(m * n * α(m*n)) ≈ O(m * n)
        Space Complexity: O(m * n)
        """
        if not grid:
            return 0
        
        m, n = len(grid), len(grid[0])
        uf = UnionFind(grid)
        
        for i in range(m):
            for j in range(n):
                if grid[i][j] == '1':
                    idx = i * n + j
                    # Union with right neighbor
                    if j + 1 < n and grid[i][j + 1] == '1':
                        uf.union(idx, i * n + (j + 1))
                    # Union with bottom neighbor
                    if i + 1 < m and grid[i + 1][j] == '1':
                        uf.union(idx, (i + 1) * n + j)
        
        return uf.count
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class UnionFind {
public:
    int m, n;
    vector<int> parent;
    int count;
    
    UnionFind(vector<vector<char>>& grid) {
        m = grid.size();
        n = grid[0].size();
        parent.resize(m * n, -1);
        count = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    int idx = i * n + j;
                    parent[idx] = idx;
                    count++;
                }
            }
        }
    }
    
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }
    
    void unite(int x, int y) {
        int rootX = find(x), rootY = find(y);
        if (rootX != rootY) {
            parent[rootX] = rootY;
            count--;
        }
    }
};

class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;
        
        int m = grid.size(), n = grid[0].size();
        UnionFind uf(grid);
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    int idx = i * n + j;
                    if (j + 1 < n && grid[i][j + 1] == '1')
                        uf.unite(idx, i * n + (j + 1));
                    if (i + 1 < m && grid[i + 1][j] == '1')
                        uf.unite(idx, (i + 1) * n + j);
                }
            }
        }
        
        return uf.count;
    }
};
```

<!-- slide -->
```java
class UnionFind {
    int m, n;
    int[] parent;
    int count;
    
    UnionFind(char[][] grid) {
        m = grid.length;
        n = grid[0].length;
        parent = new int[m * n];
        count = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    int idx = i * n + j;
                    parent[idx] = idx;
                    count++;
                }
            }
        }
    }
    
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }
    
    void union(int x, int y) {
        int rootX = find(x), rootY = find(y);
        if (rootX != rootY) {
            parent[rootX] = rootY;
            count--;
        }
    }
}

class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        
        int m = grid.length, n = grid[0].length;
        UnionFind uf = new UnionFind(grid);
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    int idx = i * n + j;
                    if (j + 1 < n && grid[i][j + 1] == '1')
                        uf.union(idx, i * n + (j + 1));
                    if (i + 1 < m && grid[i + 1][j] == '1')
                        uf.union(idx, (i + 1) * n + j);
                }
            }
        }
        
        return uf.count;
    }
}
```

<!-- slide -->
```javascript
class UnionFind {
    constructor(grid) {
        this.m = grid.length;
        this.n = grid[0].length;
        this.parent = new Array(this.m * this.n).fill(-1);
        this.count = 0;
        
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                if (grid[i][j] === '1') {
                    const idx = i * this.n + j;
                    this.parent[idx] = idx;
                    this.count++;
                }
            }
        }
    }
    
    find(x) {
        if (this.parent[x] !== x)
            this.parent[x] = this.find(this.parent[x]);
        return this.parent[x];
    }
    
    union(x, y) {
        const rootX = this.find(x), rootY = this.find(y);
        if (rootX !== rootY) {
            this.parent[rootX] = rootY;
            this.count--;
        }
    }
}

/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const m = grid.length, n = grid[0].length;
    const uf = new UnionFind(grid);
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === '1') {
                const idx = i * n + j;
                if (j + 1 < n && grid[i][j + 1] === '1')
                    uf.union(idx, i * n + (j + 1));
                if (i + 1 < m && grid[i + 1][j] === '1')
                    uf.union(idx, (i + 1) * n + j);
            }
        }
    }
    
    return uf.count;
};
```
````

### Complexity Analysis

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| DFS | O(m*n) | O(m*n) | Recursion stack |
| BFS | O(m*n) | O(min(m,n)) | Queue |
| Union-Find | O(m*n) | O(m*n) | Good for dynamic connectivity |

---

## Common Pitfalls

1. **Not Marking Visited**: Counting same cell multiple times. Solution: Mark visited cells (e.g., change '1' to '0').

2. **Out of Bounds**: Accessing invalid grid positions. Solution: Check bounds before accessing.

3. **Not Checking All Directions**: Missing connected cells. Solution: Check all four directions.

4. **Diagonal Connections**: Forgetting islands can only connect horizontally/vertically, not diagonally.

5. **Stack Overflow**: Large grids with deep recursion. Consider using BFS or iterative DFS.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very commonly asked in technical interviews
- **Companies**: Google, Amazon, Microsoft, Facebook, Apple
- **Difficulty**: Medium
- **Concepts Tested**: Graph traversal, DFS, BFS, flood fill

### Learning Outcomes

1. **Grid Traversal**: Master traversing 2D grids in 4 directions
2. **Flood Fill**: Understand the classic flood fill algorithm
3. **Multiple Approaches**: Learn different ways to solve the same problem
4. **Trade-offs**: Compare recursive vs iterative, DFS vs BFS

---

## Related Problems

### Same Pattern (Flood Fill)
| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Max Area of Island](/solutions/max-area-of-island.md) | 695 | Medium | Largest island area |
| [Flood Fill](/solutions/flood-fill.md) | 733 | Easy | Classic flood fill |
| [Surrounded Regions](/solutions/surrounded-regions.md) | 130 | Medium | Capture regions |

### Similar Concepts
| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Number of Closed Islands](/solutions/number-of-closed-islands.md) | 1254 | Medium | Surrounded by water |
| [Island Perimeter](/solutions/island-perimeter.md) | 463 | Easy | Calculate perimeter |

---

## Video Tutorial Links

1. **[Number of Islands - NeetCode](https://www.youtube.com/watch?v=pV2kpPDn2w4)** - Clear explanation
2. **[DFS vs BFS Explained](https://www.youtube.com/watch?v=)** - Understanding traversals
3. **[Flood Fill Algorithm](https://www.youtube.com/watch?v=)** - Visual guide

---

## Follow-up Questions

### Q1: How would you find the largest island area?

**Answer:** Use the same DFS/BFS approach but track the size of each component and return the maximum.

### Q2: How would you handle diagonal connections?

**Answer:** Add 4 more directions: (1,1), (1,-1), (-1,1), (-1,-1). This changes the problem significantly.

### Q3: How would you count islands without modifying the grid?

**Answer:** Use a separate visited set or boolean 2D array to track visited cells.

### Q4: What if the grid was extremely large (billions of cells)?

**Answer:** Would need external algorithms or distributed processing. Union-Find could work with disk-based storage.

---

## Summary

The **Number of Islands** problem is a classic application of graph traversal algorithms:

- **Flood Fill**: Mark all connected land when an island is found
- **DFS/BFS**: Two main approaches to explore the grid
- **In-Place Modification**: Change '1' to '0' to mark visited
- **Count Components**: Each complete flood fill = one island

Key takeaways:
1. Each unvisited '1' starts a new island
2. DFS/BFS both work - choose based on stack size needs
3. Mark visited to avoid counting same island twice
4. Check all 4 directions for connectivity

This problem is essential for understanding flood fill and connected component counting in grids.
