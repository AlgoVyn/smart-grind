# Rotting Oranges

## Problem Description

You are given an m x n grid where each cell can have one of three values:

- `0` representing an empty cell,
- `1` representing a fresh orange, or
- `2` representing a rotten orange.

Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.

Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.

**Link to problem:** [Rotting Oranges - LeetCode 994](https://leetcode.com/problems/rotting-oranges/)

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `grid = [[2,1,1],[1,1,0],[0,1,1]]` | `4` |

**Example 2:**

| Input | Output |
|-------|--------|
| `grid = [[2,1,1],[0,1,1],[1,0,1]]` | `-1` |

**Explanation:** The orange in the bottom left corner (row 2, column 0) is never rotten, because rotting only happens 4-directionally.

**Example 3:**

| Input | Output |
|-------|--------|
| `grid = [[0,2]]` | `0` |

**Explanation:** Since there are already no fresh oranges at minute 0, the answer is just 0.

## Constraints

- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 10`
- `grid[i][j]` is 0, 1, or 2.

---

## Pattern: Breadth-First Search (BFS) - Grid Traversal

This problem is a classic example of the **BFS - Grid Traversal** pattern. The problem simulates a spread phenomenon (like disease transmission, fire spread, or contamination) where elements "infect" their neighbors in discrete time steps.

### Core Concept

The fundamental idea is to use **Breadth-First Search (BFS)** to simulate the spread of rot:
- **Multi-source BFS**: Start with all initially rotten oranges as sources
- **Level-by-level processing**: Each level of BFS represents one minute
- **Propagation**: Fresh oranges become rotten when adjacent to any rotten orange

---

## Examples

### Example

**Input:**
```
grid = [[2,1,1],[1,1,0],[0,1,1]]
```

**Output:**
```
4
```

**Explanation:**
- Minute 0: Start with rotten oranges at (0,0)
- Minute 1: Oranges at (0,1) and (1,0) become rotten
- Minute 2: Oranges at (1,1) and (2,1) become rotten
- Minute 3: Orange at (2,1) is already rotten, no new rotten oranges
- Minute 4: All fresh oranges are now rotten
- Answer: 4 minutes

### Example 2

**Input:**
```
grid = [[2,1,1],[0,1,1],[1,0,1]]
```

**Output:**
```
-1
```

**Explanation:** The orange in the bottom left corner (row 2, column 0) is never rotten because there is no path through adjacent fresh oranges to reach it.

---

## Intuition

The key insight is that rotting spreads like a wavefront from initially rotten oranges. BFS naturally models this wavefront propagation:

1. **Start with all rotten oranges**: These are our initial sources for the BFS
2. **Process level by level**: Each complete iteration of the queue represents one minute
3. **Track time**: The number of BFS levels processed equals the minutes elapsed
4. **Check completion**: If any fresh oranges remain after BFS, return -1

### Why BFS?

- BFS explores all nodes at distance k before exploring nodes at distance k+1
- This naturally models time progression where all oranges at "distance" k from initial rotten oranges rot at minute k
- Unlike DFS, BFS guarantees the shortest path (minimum minutes) in an unweighted graph

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **BFS with Queue (Optimal)** - O(m*n) time, O(m*n) space
2. **DFS with Recursion** - O(m*n) time, O(m*n) space
3. **In-Place Modification with Directions Array** - O(m*n) time, O(1) space (conceptually)

---

## Approach 1: BFS with Queue (Optimal)

This is the most efficient and intuitive approach. We use a queue to process all rotten oranges and spread the rot to adjacent fresh oranges.

### Algorithm Steps

1. Initialize a queue with all initially rotten orange positions
2. Count the number of fresh oranges
3. If no fresh oranges, return 0
4. While the queue is not empty:
   - Process all oranges in the current level (current minute)
   - For each rotten orange, check 4 adjacent cells
   - If a fresh orange is found, make it rotten and add to queue
   - Decrement fresh count
5. After processing each level, increment minutes
6. Return minutes if fresh count is 0, else return -1

### Why It Works

BFS naturally models the spread of rot because:
- All oranges that become rotten at minute k are exactly distance k from the initial rotten oranges
- By processing level by level, we ensure each orange becomes rotten at the earliest possible minute
- The algorithm finds the minimum time for all oranges to become rotten

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        """
        Find the minimum number of minutes for all oranges to rot using BFS.
        
        Args:
            grid: m x n grid where 0=empty, 1=fresh, 2=rotten
            
        Returns:
            Minimum minutes to rot all oranges, or -1 if impossible
        """
        if not grid or not grid[0]:
            return 0
            
        m, n = len(grid), len(grid[0])
        queue = deque()
        fresh = 0
        
        # Initialize queue with all rotten oranges and count fresh oranges
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 2:
                    queue.append((i, j))
                elif grid[i][j] == 1:
                    fresh += 1
        
        # If no fresh oranges, return 0
        if fresh == 0:
            return 0
            
        minutes = 0
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        while queue:
            size = len(queue)
            # Process all oranges that rotted at the current minute
            for _ in range(size):
                i, j = queue.popleft()
                
                # Check all 4 adjacent cells
                for di, dj in directions:
                    ni, nj = i + di, j + dj
                    
                    # If adjacent cell has a fresh orange, make it rotten
                    if 0 <= ni < m and 0 <= nj < n and grid[ni][nj] == 1:
                        grid[ni][nj] = 2  # Mark as rotten
                        fresh -= 1
                        queue.append((ni, nj))
            
            # If there are more oranges to process, increment minute
            if queue:
                minutes += 1
        
        return minutes if fresh == 0 else -1
```

<!-- slide -->
```cpp
class Solution {
public:
    /**
     * Find the minimum number of minutes for all oranges to rot using BFS.
     *
     * @param grid: m x n grid where 0=empty, 1=fresh, 2=rotten
     * @return: Minimum minutes to rot all oranges, or -1 if impossible
     */
    int orangesRotting(vector<vector<int>>& grid) {
        if (grid.empty() || grid[0].empty()) {
            return 0;
        }
        
        int m = grid.size();
        int n = grid[0].size();
        queue<pair<int, int>> q;
        int fresh = 0;
        
        // Initialize queue with all rotten oranges and count fresh oranges
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) {
                    q.emplace(i, j);
                } else if (grid[i][j] == 1) {
                    fresh++;
                }
            }
        }
        
        // If no fresh oranges, return 0
        if (fresh == 0) {
            return 0;
        }
        
        int minutes = 0;
        vector<pair<int, int>> directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        while (!q.empty()) {
            int size = q.size();
            
            // Process all oranges that rotted at the current minute
            for (int k = 0; k < size; k++) {
                auto [i, j] = q.front();
                q.pop();
                
                // Check all 4 adjacent cells
                for (auto [di, dj] : directions) {
                    int ni = i + di;
                    int nj = j + dj;
                    
                    // If adjacent cell has a fresh orange, make it rotten
                    if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] == 1) {
                        grid[ni][nj] = 2;
                        fresh--;
                        q.emplace(ni, nj);
                    }
                }
            }
            
            // If there are more oranges to process, increment minute
            if (!q.empty()) {
                minutes++;
            }
        }
        
        return fresh == 0 ? minutes : -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    /**
     * Find the minimum number of minutes for all oranges to rot using BFS.
     *
     * @param grid: m x n grid where 0=empty, 1=fresh, 2=rotten
     * @return: Minimum minutes to rot all oranges, or -1 if impossible
     */
    public int orangesRotting(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }
        
        int m = grid.length;
        int n = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int fresh = 0;
        
        // Initialize queue with all rotten oranges and count fresh oranges
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) {
                    queue.offer(new int[]{i, j});
                } else if (grid[i][j] == 1) {
                    fresh++;
                }
            }
        }
        
        // If no fresh oranges, return 0
        if (fresh == 0) {
            return 0;
        }
        
        int minutes = 0;
        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        while (!queue.isEmpty()) {
            int size = queue.size();
            
            // Process all oranges that rotted at the current minute
            for (int k = 0; k < size; k++) {
                int[] pos = queue.poll();
                int i = pos[0];
                int j = pos[1];
                
                // Check all 4 adjacent cells
                for (int[] dir : directions) {
                    int ni = i + dir[0];
                    int nj = j + dir[1];
                    
                    // If adjacent cell has a fresh orange, make it rotten
                    if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] == 1) {
                        grid[ni][nj] = 2;
                        fresh--;
                        queue.offer(new int[]{ni, nj});
                    }
                }
            }
            
            // If there are more oranges to process, increment minute
            if (!queue.isEmpty()) {
                minutes++;
            }
        }
        
        return fresh == 0 ? minutes : -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the minimum number of minutes for all oranges to rot using BFS.
 * 
 * @param {number[][]} grid - m x n grid where 0=empty, 1=fresh, 2=rotten
 * @return {number} - Minimum minutes to rot all oranges, or -1 if impossible
 */
var orangesRotting = function(grid) {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
        return 0;
    }
    
    const m = grid.length;
    const n = grid[0].length;
    const queue = [];
    let fresh = 0;
    
    // Initialize queue with all rotten oranges and count fresh oranges
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 2) {
                queue.push([i, j]);
            } else if (grid[i][j] === 1) {
                fresh++;
            }
        }
    }
    
    // If no fresh oranges, return 0
    if (fresh === 0) {
        return 0;
    }
    
    let minutes = 0;
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    while (queue.length > 0) {
        const size = queue.length;
        
        // Process all oranges that rotted at the current minute
        for (let k = 0; k < size; k++) {
            const [i, j] = queue.shift();
            
            // Check all 4 adjacent cells
            for (const [di, dj] of directions) {
                const ni = i + di;
                const nj = j + dj;
                
                // If adjacent cell has a fresh orange, make it rotten
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] === 1) {
                    grid[ni][nj] = 2;
                    fresh--;
                    queue.push([ni, nj]);
                }
            }
        }
        
        // If there are more oranges to process, increment minute
        if (queue.length > 0) {
            minutes++;
        }
    }
    
    return fresh === 0 ? minutes : -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m * n) - Each cell is visited at most once |
| **Space** | O(m * n) - Queue can contain at most all cells in worst case |

---

## Approach 2: DFS with Recursion

This approach uses depth-first search to spread the rot. While less intuitive for this problem, it demonstrates alternative traversal strategies.

### Algorithm Steps

1. Find all initially rotten oranges and mark them as visited
2. For each rotten orange, recursively infect all adjacent fresh oranges
3. Track the time each orange becomes rotten
4. Return the maximum time across all oranges

### Why It Works

DFS can also model the spread of rot by recursively exploring all paths from initially rotten oranges to fresh oranges. However, it doesn't naturally handle the "time" aspect as cleanly as BFS.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        """
        Find minimum minutes using DFS approach.
        """
        if not grid or not grid[0]:
            return 0
            
        m, n = len(grid), len(grid[0])
        self.max_time = 0
        self.directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        def dfs(i, j, time):
            for di, dj in self.directions:
                ni, nj = i + di, j + dj
                if 0 <= ni < m and 0 <= nj < n:
                    if grid[ni][nj] == 1:
                        grid[ni][nj] = 2  # Make it rotten
                        self.max_time = max(self.max_time, time + 1)
                        dfs(ni, nj, time + 1)
        
        # Start DFS from all initially rotten oranges
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 2:
                    dfs(i, j, 0)
        
        # Check if any fresh oranges remain
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 1:
                    return -1
                    
        return self.max_time
```

<!-- slide -->
```cpp
class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        if (grid.empty() || grid[0].empty()) {
            return 0;
        }
        
        m = grid.size();
        n = grid[0].size();
        max_time = 0;
        directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        // Start DFS from all initially rotten oranges
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) {
                    dfs(i, j, 0, grid);
                }
            }
        }
        
        // Check if any fresh oranges remain
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    return -1;
                }
            }
        }
        
        return max_time;
    }
    
private:
    int m, n, max_time;
    vector<pair<int, int>> directions;
    
    void dfs(int i, int j, int time, vector<vector<int>>& grid) {
        for (auto [di, dj] : directions) {
            int ni = i + di;
            int nj = j + dj;
            
            if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] == 1) {
                grid[ni][nj] = 2;
                max_time = max(max_time, time + 1);
                dfs(ni, nj, time + 1, grid);
            }
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    private int m, n, maxTime;
    private int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
    
    public int orangesRotting(int[][] grid) {
        if (grid == null || grid.length == 0) {
            return 0;
        }
        
        m = grid.length;
        n = grid[0].length;
        maxTime = 0;
        
        // Start DFS from all initially rotten oranges
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) {
                    dfs(i, j, 0, grid);
                }
            }
        }
        
        // Check if any fresh oranges remain
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    return -1;
                }
            }
        }
        
        return maxTime;
    }
    
    private void dfs(int i, int j, int time, int[][] grid) {
        for (int[] dir : directions) {
            int ni = i + dir[0];
            int nj = j + dir[1];
            
            if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] == 1) {
                grid[ni][nj] = 2;
                maxTime = Math.max(maxTime, time + 1);
                dfs(ni, nj, time + 1, grid);
            }
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Find minimum minutes using DFS approach.
 * @param {number[][]} grid
 * @return {number}
 */
var orangesRotting = function(grid) {
    if (!grid || grid.length === 0) {
        return 0;
    }
    
    const m = grid.length;
    const n = grid[0].length;
    let maxTime = 0;
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    function dfs(i, j, time) {
        for (const [di, dj] of directions) {
            const ni = i + di;
            const nj = j + dj;
            
            if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] === 1) {
                grid[ni][nj] = 2;
                maxTime = Math.max(maxTime, time + 1);
                dfs(ni, nj, time + 1);
            }
        }
    }
    
    // Start DFS from all initially rotten oranges
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 2) {
                dfs(i, j, 0);
            }
        }
    }
    
    // Check if any fresh oranges remain
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 1) {
                return -1;
            }
        }
    }
    
    return maxTime;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m * n) - Each cell visited at most once |
| **Space** | O(m * n) - Recursion stack can go as deep as m*n |

---

## Approach 3: BFS with Time Tracking in Cell

This approach stores the time directly in the grid cell, avoiding the need for a separate level-by-level counter.

### Algorithm Steps

1. Initialize queue with rotten oranges, storing (row, col, time=0)
2. While queue is not empty:
   - Pop an orange, if it's fresh, make it rotten with the stored time
   - Add its neighbors to the queue with time+1
3. Track maximum time as we process
4. Return max time or -1 if any fresh oranges remain

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        """
        BFS with time stored in queue elements.
        """
        if not grid or not grid[0]:
            return 0
            
        m, n = len(grid), len(grid[0])
        queue = deque()
        fresh = 0
        
        # Initialize with (row, col, time)
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 2:
                    queue.append((i, j, 0))
                elif grid[i][j] == 1:
                    fresh += 1
        
        if fresh == 0:
            return 0
            
        max_time = 0
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        while queue:
            i, j, time = queue.popleft()
            max_time = max(max_time, time)
            
            for di, dj in directions:
                ni, nj = i + di, j + dj
                if 0 <= ni < m and 0 <= nj < n and grid[ni][nj] == 1:
                    grid[ni][nj] = 2
                    fresh -= 1
                    queue.append((ni, nj, time + 1))
        
        return max_time if fresh == 0 else -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        if (grid.empty() || grid[0].empty()) {
            return 0;
        }
        
        int m = grid.size();
        int n = grid[0].size();
        queue<tuple<int, int, int>> q;
        int fresh = 0;
        
        // Initialize with (row, col, time)
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) {
                    q.emplace(i, j, 0);
                } else if (grid[i][j] == 1) {
                    fresh++;
                }
            }
        }
        
        if (fresh == 0) return 0;
        
        int maxTime = 0;
        vector<pair<int, int>> directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        while (!q.empty()) {
            auto [i, j, time] = q.front();
            q.pop();
            maxTime = max(maxTime, time);
            
            for (auto [di, dj] : directions) {
                int ni = i + di;
                int nj = j + dj;
                
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] == 1) {
                    grid[ni][nj] = 2;
                    fresh--;
                    q.emplace(ni, nj, time + 1);
                }
            }
        }
        
        return fresh == 0 ? maxTime : -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int orangesRotting(int[][] grid) {
        if (grid == null || grid.length == 0) {
            return 0;
        }
        
        int m = grid.length;
        int n = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int fresh = 0;
        
        // Initialize with (row, col, time)
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) {
                    queue.offer(new int[]{i, j, 0});
                } else if (grid[i][j] == 1) {
                    fresh++;
                }
            }
        }
        
        if (fresh == 0) return 0;
        
        int maxTime = 0;
        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int i = curr[0], j = curr[1], time = curr[2];
            maxTime = Math.max(maxTime, time);
            
            for (int[] dir : directions) {
                int ni = i + dir[0];
                int nj = j + dir[1];
                
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] == 1) {
                    grid[ni][nj] = 2;
                    fresh--;
                    queue.offer(new int[]{ni, nj, time + 1});
                }
            }
        }
        
        return fresh == 0 ? maxTime : -1;
    }
}
```

<!-- slide -->
```javascript
var orangesRotting = function(grid) {
    if (!grid || grid.length === 0) {
        return 0;
    }
    
    const m = grid.length;
    const n = grid[0].length;
    const queue = [];
    let fresh = 0;
    
    // Initialize with (row, col, time)
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 2) {
                queue.push([i, j, 0]);
            } else if (grid[i][j] === 1) {
                fresh++;
            }
        }
    }
    
    if (fresh === 0) return 0;
    
    let maxTime = 0;
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    while (queue.length > 0) {
        const [i, j, time] = queue.shift();
        maxTime = Math.max(maxTime, time);
        
        for (const [di, dj] of directions) {
            const ni = i + di;
            const nj = j + dj;
            
            if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] === 1) {
                grid[ni][nj] = 2;
                fresh--;
                queue.push([ni, nj, time + 1]);
            }
        }
    }
    
    return fresh === 0 ? maxTime : -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m * n) - Each cell visited at most once |
| **Space** | O(m * n) - Queue can contain at most all cells |

---

## Comparison of Approaches

| Aspect | BFS (Level) | DFS | BFS (Time in Queue) |
|--------|-------------|-----|---------------------|
| **Time Complexity** | O(m*n) | O(m*n) | O(m*n) |
| **Space Complexity** | O(m*n) | O(m*n) | O(m*n) |
| **Implementation** | Simple | Moderate | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ✅ Yes |
| **Natural for Problem** | ✅ Very | ⚠️ Less | ✅ Very |

**Best Approach:** BFS with level tracking (Approach 1) is the most intuitive and optimal solution.

---

## Why BFS is Optimal for This Problem

The BFS approach with level tracking is optimal because:

1. **Natural Time Modeling**: Each BFS level naturally represents one minute
2. **Shortest Path**: BFS finds the minimum distance in an unweighted graph
3. **No Redundant Work**: Each cell is visited exactly once
4. **Early Termination**: Can stop if all oranges become rotten
5. **Clear Edge Cases**: Handles empty grids, no fresh oranges, and impossible cases

The key insight is that rotting spreads like a wavefront, and BFS is specifically designed to model wavefront propagation in graphs.

---

## Related Problems

Based on similar themes (BFS, grid traversal, spread phenomena):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Flood Fill | [Link](https://leetcode.com/problems/flood-fill/) | Similar BFS/DFS on grid |
| Number of Islands | [Link](https://leetcode.com/problems/number-of-islands/) | Grid traversal with BFS/DFS |
| Max Area of Island | [Link](https://leetcode.com/problems/max-area-of-island/) | Find largest connected component |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Pacific Atlantic Water Flow | [Link](https://leetcode.com/problems/pacific-atlantic-water-flow/) | Multi-source BFS on grid |
| Walls and Gates | [Link](https://leetcode.com/problems/walls-and-gates/) | BFS from multiple sources |
| Robot Collisions | [Link](https://leetcode.com/problems/robot-collisions/) | BFS with state tracking |

### Pattern Reference

For more detailed explanations of the BFS pattern and its variations, see:
- **[BFS - Grid Traversal Pattern](/patterns/bfs-grid-traversal)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### BFS Technique

- [NeetCode - Rotting Oranges](https://www.youtube.com/watch?v=yua1GvN8KcI) - Clear explanation with visual examples
- [Back to Back SWE - Rotting Oranges](https://www.youtube.com/watch?v=Z2pilaf1ZCs) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=pUAPcV2k5x0) - Official problem solution
- [Coding with Reasoning](https://www.youtube.com/watch?v=yua1GvN8KcI) - Step-by-step explanation

### Related Concepts

- [BFS vs DFS](https://www.youtube.com/watch?v=0uKtS8rB6pQ) - When to use BFS vs DFS
- [Graph Traversal Complete Guide](https://www.youtube.com/watch?v=pcKY4hjMgrk) - Understanding graph traversals

---

## Follow-up Questions

### Q1: Can you solve it in O(m*n) time and O(1) extra space (not counting the input grid)?

**Answer:** The standard BFS solution uses O(m*n) space for the queue. To achieve O(1) extra space, you could use in-place modification by treating the grid itself as the queue (storing coordinates in the grid cells temporarily), but this is more complex and less readable. The current solution's O(m*n) space is considered optimal for this problem.

---

### Q2: How would you handle diagonals being allowed to spread rot?

**Answer:** Simply add the four diagonal directions to the directions array: `[(-1,-1), (-1,1), (1,-1), (1,1)]`. This would change the problem from "4-directional" to "8-directional" spread. The BFS logic remains exactly the same.

---

### Q3: What if each orange takes different time to rot (not uniform)?

**Answer:** You would need to modify the BFS to use a priority queue (Dijkstra's algorithm) instead of a regular queue. Each orange would have its own "rot time," and you'd always process the one with the smallest time next. This changes the complexity from O(m*n) to O(m*n log(m*n)).

---

### Q4: How would you modify the solution to track which oranges rot at which minute?

**Answer:** Instead of just incrementing a minute counter after processing each level, store the time with each position in the queue. When you process a fresh orange, record its rot time. This gives you a complete timeline of which orange rots when.

---

### Q5: What edge cases should be tested?

**Answer:**
- Empty grid or single cell grid
- No rotten oranges initially
- No fresh oranges initially
- All oranges already rotten
- Disconnected components of fresh oranges
- Single row or single column grids
- Grid with only empty cells (0s)

---

### Q6: How would you determine if it's impossible to rot all oranges?

**Answer:** After BFS completes, count the remaining fresh oranges (value 1). If any remain, return -1. This is already implemented in the solution by tracking the `fresh` counter throughout BFS.

---

### Q7: What if we wanted to minimize the number of rotten oranges to start with to rot all oranges?

**Answer:** This becomes a different problem - finding the minimum set of starting positions. It's similar to the "minimum number of operations to infect all nodes" problem and would require computing connected components and selecting representative nodes from each.

---

### Q8: How would you visualize the rotting process?

**Answer:** You could maintain a 2D array of "time to rot" initialized to -1. Start with all initially rotten oranges at time 0. During BFS, when you infect a fresh orange at position (ni, nj) from position (i, j), set time[ni][nj] = time[i][j] + 1. This gives you a complete time map of the rotting process.

---

## Common Pitfalls

### 1. Not Handling Empty Grid
**Issue**: Forgetting to check if grid is empty or has no cells.

**Solution**: Add early return checks at the beginning of the function.

### 2. Incorrect Level Tracking
**Issue**: Incrementing minutes for every queue pop instead of every level.

**Solution**: Track the size of the queue before processing each level and only increment minutes after processing the entire level.

### 3. Forgetting to Check Fresh Count
**Issue**: Not tracking whether all fresh oranges were rotted.

**Solution**: Maintain a fresh counter and check if it reaches 0 after BFS completes.

### 4. Modifying Grid During Iteration
**Issue**: Forgetting to mark fresh oranges as rotten when spreading.

**Solution**: Always mark grid[ni][nj] = 2 when a fresh orange becomes rotten.

### 5. Direction Array Order
**Issue**: The order of directions doesn't matter for correctness but affects which neighbors are processed first.

**Solution**: Use consistent ordering: right, down, left, up (clockwise).

---

## Summary

The **Rotting Oranges** problem demonstrates the power of BFS for modeling spread phenomena:

- **BFS approach**: Optimal with O(m*n) time and O(m*n) space
- **Multi-source BFS**: Start with all initially rotten oranges as sources
- **Level-by-level processing**: Each level represents one minute
- **Complete coverage**: Check if all fresh oranges become rotten

The key insight is that rotting spreads like a wavefront from initially rotten oranges. BFS naturally models this wavefront propagation, making it the ideal algorithm for this problem.

This problem is an excellent demonstration of how BFS can be used to solve spread/contamination problems in grids.

### Pattern Summary

This problem exemplifies the **BFS - Grid Traversal** pattern, which is characterized by:
- Using a queue for level-by-level exploration
- Processing all neighbors of current node
- Tracking visited cells to avoid reprocessing
- Finding minimum steps in unweighted graphs

For more details on this pattern and its variations, see the **[BFS - Grid Traversal Pattern](/patterns/bfs-grid-traversal)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/rotting-oranges/discuss/) - Community solutions and explanations
- [BFS Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/) - Detailed BFS explanation
- [Graph Traversal - Wikipedia](https://en.wikipedia.org/wiki/Graph_traversal) - Learn about graph traversals
- [Pattern: BFS - Grid Traversal](/patterns/bfs-grid-traversal) - Comprehensive pattern guide
