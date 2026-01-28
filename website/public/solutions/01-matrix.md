# 01 Matrix

## Problem Description

Given an m x n binary matrix `mat`, return the distance of the nearest `0` for each cell.

The distance between two adjacent cells (horizontally or vertically) is `1`.

### Key Insight

This is a classic multi-source BFS problem. Instead of starting BFS from each cell individually (which would be inefficient), we start from all `0` cells simultaneously. This way, each cell gets its distance from the nearest `0` in the first BFS wave that reaches it.

---

## Examples

### Example 1

**Input:**
```
mat = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
]
```

**Output:**
```
[
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
]
```

**Explanation:**
- All `0` cells have distance 0 to themselves.
- The `1` at position (1, 1) has distance 1 to any of the four adjacent `0`s.

### Example 2

**Input:**
```
mat = [
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1]
]
```

**Output:**
```
[
    [0, 0, 0],
    [0, 1, 0],
    [1, 2, 1]
]
```

**Explanation:**
- The `1` at (1, 1) has distance 1 to the `0` above it.
- The `1`s in the third row have distances 1, 2, and 1 respectively from the nearest `0`.

### Example 3

**Input:**
```
mat = [
    [1, 0, 1],
    [1, 1, 1],
    [1, 1, 1]
]
```

**Output:**
```
[
    [1, 0, 1],
    [2, 1, 2],
    [3, 2, 3]
]
```

**Explanation:**
- The `0` at (0, 1) has distance 0.
- Distances increase as we move away from the nearest `0`.

---

## Constraints

- `m == mat.length`
- `n == mat[i].length`
- `1 <= m, n <= 10^4`
- `1 <= m * n <= 10^4`
- `mat[i][j]` is either `0` or `1`

---

## Intuition

The problem can be solved using Breadth-First Search (BFS) with multiple sources:

1. **Multi-Source BFS**: Start BFS from all cells containing `0` simultaneously. This is more efficient than running BFS from each `1` cell individually.

2. **Distance Propagation**: As BFS expands from `0` cells layer by layer, each layer represents distance `+1`. The first time we reach a `1` cell, we've found its nearest `0`.

3. **Visited Tracking**: Keep track of visited cells to avoid processing the same cell multiple times.

Alternative approaches include:
- **Dynamic Programming**: Two-pass DP (top-left to bottom-right, then bottom-right to top-left)
- **DFS with Memoization**: Store distances after computing them once

---

## Approach 1: Multi-Source BFS

### Algorithm

1. **Initialize Queue**: Add all cells containing `0` to the queue with distance `0`.
2. **Initialize Result Matrix**: Create a result matrix with `-1` (unvisited) for all cells.
3. **BFS Traversal**: While queue is not empty:
   - Pop a cell `(i, j)` from the queue
   - For each of its 4 neighbors:
     - If neighbor is within bounds and not visited:
       - Set its distance to `dist[i][j] + 1`
       - Mark it as visited
       - Add it to the queue
4. **Return Result**: The result matrix now contains distances from nearest `0`.

### Code

````carousel
```python
from collections import deque
from typing import List

class Solution:
    def updateMatrix(self, mat: List[List[int]]) -> List[List[int]]:
        if not mat or not mat[0]:
            return mat
        
        m, n = len(mat), len(mat[0])
        dist = [[-1] * n for _ in range(m)]
        queue = deque()
        
        # Add all zeros to the queue with distance 0
        for i in range(m):
            for j in range(n):
                if mat[i][j] == 0:
                    dist[i][j] = 0
                    queue.append((i, j))
        
        # Directions: up, down, left, right
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        
        # Multi-source BFS
        while queue:
            i, j = queue.popleft()
            for di, dj in directions:
                ni, nj = i + di, j + dj
                if 0 <= ni < m and 0 <= nj < n and dist[ni][nj] == -1:
                    dist[ni][nj] = dist[i][j] + 1
                    queue.append((ni, nj))
        
        return dist
```
<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    vector<vector<int>> updateMatrix(vector<vector<int>>& mat) {
        if (mat.empty() || mat[0].empty()) return mat;
        
        int m = mat.size(), n = mat[0].size();
        vector<vector<int>> dist(m, vector<int>(n, -1));
        queue<pair<int, int>> q;
        
        // Add all zeros to the queue with distance 0
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (mat[i][j] == 0) {
                    dist[i][j] = 0;
                    q.push({i, j});
                }
            }
        }
        
        // Directions: up, down, left, right
        vector<int> dirs = {1, 0, -1, 0, 1};
        
        // Multi-source BFS
        while (!q.empty()) {
            auto [i, j] = q.front();
            q.pop();
            
            for (int d = 0; d < 4; d++) {
                int ni = i + dirs[d], nj = j + dirs[d + 1];
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && dist[ni][nj] == -1) {
                    dist[ni][nj] = dist[i][j] + 1;
                    q.push({ni, nj});
                }
            }
        }
        
        return dist;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[][] updateMatrix(int[][] mat) {
        if (mat == null || mat.length == 0 || mat[0].length == 0) return mat;
        
        int m = mat.length, n = mat[0].length;
        int[][] dist = new int[m][n];
        for (int[] row : dist) Arrays.fill(row, -1);
        Queue<int[]> q = new LinkedList<>();
        
        // Add all zeros to the queue with distance 0
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (mat[i][j] == 0) {
                    dist[i][j] = 0;
                    q.offer(new int[]{i, j});
                }
            }
        }
        
        // Directions: up, down, left, right
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        
        // Multi-source BFS
        while (!q.isEmpty()) {
            int[] cell = q.poll();
            int i = cell[0], j = cell[1];
            
            for (int[] dir : dirs) {
                int ni = i + dir[0], nj = j + dir[1];
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && dist[ni][nj] == -1) {
                    dist[ni][nj] = dist[i][j] + 1;
                    q.offer(new int[]{ni, nj});
                }
            }
        }
        
        return dist;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[][]} mat
 * @return {number[][]}
 */
var updateMatrix = function(mat) {
    if (!mat || !mat.length || !mat[0].length) return mat;
    
    const m = mat.length, n = mat[0].length;
    const dist = Array.from({ length: m }, () => new Array(n).fill(-1));
    const q = [];
    let front = 0;
    
    // Add all zeros to the queue with distance 0
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (mat[i][j] === 0) {
                dist[i][j] = 0;
                q.push([i, j]);
            }
        }
    }
    
    // Directions: up, down, left, right
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    
    // Multi-source BFS
    while (front < q.length) {
        const [i, j] = q[front++];
        
        for (const [di, dj] of dirs) {
            const ni = i + di, nj = j + dj;
            if (ni >= 0 && ni < m && nj >= 0 && nj < n && dist[ni][nj] === -1) {
                dist[ni][nj] = dist[i][j] + 1;
                q.push([ni, nj]);
            }
        }
    }
    
    return dist;
};
```
````

---

## Approach 2: Two-Pass Dynamic Programming

### Algorithm

1. **First Pass (Top-Left to Bottom-Right)**:
   - For each cell, check top and left neighbors
   - If a neighbor is reachable (not `-1`), update current cell's distance
   - Use `min(neighbor_distance + 1, current_distance)`

2. **Second Pass (Bottom-Right to Top-Left)**:
   - For each cell, check bottom and right neighbors
   - Update distance if a shorter path is found through these neighbors

3. **Return Result**: The result matrix contains the shortest distances.

### Code

````carousel
```python
from typing import List

class Solution:
    def updateMatrix(self, mat: List[List[int]]) -> List[List[int]]:
        if not mat or not mat[0]:
            return mat
        
        m, n = len(mat), len(mat[0])
        dist = [[float('inf')] * n for _ in range(m)]
        
        # First pass: top-left to bottom-right
        for i in range(m):
            for j in range(n):
                if mat[i][j] == 0:
                    dist[i][j] = 0
                else:
                    if i > 0:
                        dist[i][j] = min(dist[i][j], dist[i - 1][j] + 1)
                    if j > 0:
                        dist[i][j] = min(dist[i][j], dist[i][j - 1] + 1)
        
        # Second pass: bottom-right to top-left
        for i in range(m - 1, -1, -1):
            for j in range(n - 1, -1, -1):
                if i < m - 1:
                    dist[i][j] = min(dist[i][j], dist[i + 1][j] + 1)
                if j < n - 1:
                    dist[i][j] = min(dist[i][j], dist[i][j + 1] + 1)
        
        return dist
```
<!-- slide -->
```cpp
#include <vector>
#include <climits>
using namespace std;

class Solution {
public:
    vector<vector<int>> updateMatrix(vector<vector<int>>& mat) {
        if (mat.empty() || mat[0].empty()) return mat;
        
        int m = mat.size(), n = mat[0].size();
        vector<vector<int>> dist(m, vector<int>(n, INT_MAX));
        
        // First pass: top-left to bottom-right
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (mat[i][j] == 0) {
                    dist[i][j] = 0;
                } else {
                    if (i > 0) dist[i][j] = min(dist[i][j], dist[i - 1][j] + 1);
                    if (j > 0) dist[i][j] = min(dist[i][j], dist[i][j - 1] + 1);
                }
            }
        }
        
        // Second pass: bottom-right to top-left
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                if (i < m - 1) dist[i][j] = min(dist[i][j], dist[i + 1][j] + 1);
                if (j < n - 1) dist[i][j] = min(dist[i][j], dist[i][j + 1] + 1);
            }
        }
        
        return dist;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[][] updateMatrix(int[][] mat) {
        if (mat == null || mat.length == 0 || mat[0].length == 0) return mat;
        
        int m = mat.length, n = mat[0].length;
        int[][] dist = new int[m][n];
        for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE);
        
        // First pass: top-left to bottom-right
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (mat[i][j] == 0) {
                    dist[i][j] = 0;
                } else {
                    if (i > 0) dist[i][j] = Math.min(dist[i][j], dist[i - 1][j] + 1);
                    if (j > 0) dist[i][j] = Math.min(dist[i][j], dist[i][j - 1] + 1);
                }
            }
        }
        
        // Second pass: bottom-right to top-left
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                if (i < m - 1) dist[i][j] = Math.min(dist[i][j], dist[i + 1][j] + 1);
                if (j < n - 1) dist[i][j] = Math.min(dist[i][j], dist[i][j + 1] + 1);
            }
        }
        
        return dist;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[][]} mat
 * @return {number[][]}
 */
var updateMatrix = function(mat) {
    if (!mat || !mat.length || !mat[0].length) return mat;
    
    const m = mat.length, n = mat[0].length;
    const dist = Array.from({ length: m }, () => new Array(n).fill(Infinity));
    
    // First pass: top-left to bottom-right
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (mat[i][j] === 0) {
                dist[i][j] = 0;
            } else {
                if (i > 0) dist[i][j] = Math.min(dist[i][j], dist[i - 1][j] + 1);
                if (j > 0) dist[i][j] = Math.min(dist[i][j], dist[i][j - 1] + 1);
            }
        }
    }
    
    // Second pass: bottom-right to top-left
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            if (i < m - 1) dist[i][j] = Math.min(dist[i][j], dist[i + 1][j] + 1);
            if (j < n - 1) dist[i][j] = Math.min(dist[i][j], dist[i][j + 1] + 1);
        }
    }
    
    return dist;
};
```
````

---

## Approach 3: DFS with Memoization

### Algorithm

1. **Create DP/Memo Table**: Initialize a table to store computed distances.
2. **DFS Function**: For each cell:
   - If cell is `0`, return `0`
   - If cell is `1` and not computed, compute:
     - Check all 4 neighbors recursively
     - Return `1 + min(neighbor_distances)`
   - Store the result in the memo table
3. **Return Result**: For each cell, call DFS and return the computed distances.

### Code

````carousel
```python
from typing import List

class Solution:
    def updateMatrix(self, mat: List[List[int]]) -> List[List[int]]:
        if not mat or not mat[0]:
            return mat
        
        m, n = len(mat), len(mat[0])
        memo = [[None] * n for _ in range(m)]
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        
        def dfs(i, j):
            if i < 0 or i >= m or j < 0 or j >= n:
                return float('inf')
            
            if mat[i][j] == 0:
                return 0
            
            if memo[i][j] is not None:
                return memo[i][j]
            
            min_dist = float('inf')
            for di, dj in directions:
                min_dist = min(min_dist, 1 + dfs(i + di, j + dj))
            
            memo[i][j] = min_dist
            return min_dist
        
        result = [[0] * n for _ in range(m)]
        for i in range(m):
            for j in range(n):
                result[i][j] = dfs(i, j)
        
        return result
```
<!-- slide -->
```cpp
#include <vector>
#include <climits>
using namespace std;

class Solution {
private:
    int m, n;
    vector<vector<int>> memo;
    vector<int> dirs = {1, 0, -1, 0, 1};
    
    int dfs(vector<vector<int>>& mat, int i, int j) {
        if (i < 0 || i >= m || j < 0 || j >= n) return INT_MAX;
        if (mat[i][j] == 0) return 0;
        if (memo[i][j] != -1) return memo[i][j];
        
        int minDist = INT_MAX;
        for (int d = 0; d < 4; d++) {
            minDist = min(minDist, 1 + dfs(mat, i + dirs[d], j + dirs[d + 1]));
        }
        
        return memo[i][j] = minDist;
    }
    
public:
    vector<vector<int>> updateMatrix(vector<vector<int>>& mat) {
        if (mat.empty() || mat[0].empty()) return mat;
        
        m = mat.size(), n = mat[0].size();
        memo = vector<vector<int>>(m, vector<int>(n, -1));
        vector<vector<int>> result(m, vector<int>(n, 0));
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                result[i][j] = dfs(mat, i, j);
            }
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    private int m, n;
    private int[][] memo;
    private int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    
    private int dfs(int[][] mat, int i, int j) {
        if (i < 0 || i >= m || j < 0 || j >= n) return Integer.MAX_VALUE;
        if (mat[i][j] == 0) return 0;
        if (memo[i][j] != -1) return memo[i][j];
        
        int minDist = Integer.MAX_VALUE;
        for (int[] dir : dirs) {
            minDist = Math.min(minDist, 1 + dfs(mat, i + dir[0], j + dir[1]));
        }
        
        return memo[i][j] = minDist;
    }
    
    public int[][] updateMatrix(int[][] mat) {
        if (mat == null || mat.length == 0 || mat[0].length == 0) return mat;
        
        m = mat.length;
        n = mat[0].length;
        memo = new int[m][n];
        for (int[] row : memo) Arrays.fill(row, -1);
        int[][] result = new int[m][n];
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                result[i][j] = dfs(mat, i, j);
            }
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[][]} mat
 * @return {number[][]}
 */
var updateMatrix = function(mat) {
    if (!mat || !mat.length || !mat[0].length) return mat;
    
    const m = mat.length, n = mat[0].length;
    const memo = Array.from({ length: m }, () => new Array(n).fill(-1));
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    
    const dfs = (i, j) => {
        if (i < 0 || i >= m || j < 0 || j >= n) return Infinity;
        if (mat[i][j] === 0) return 0;
        if (memo[i][j] !== -1) return memo[i][j];
        
        let minDist = Infinity;
        for (const [di, dj] of dirs) {
            minDist = Math.min(minDist, 1 + dfs(i + di, j + dj));
        }
        
        return memo[i][j] = minDist;
    };
    
    const result = Array.from({ length: m }, () => new Array(n).fill(0));
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            result[i][j] = dfs(i, j);
        }
    }
    
    return result;
};
```
````

---

## Complexity Analysis

### Approach 1: Multi-Source BFS

| Complexity | Analysis |
|------------|----------|
| **Time** | O(m × n) - Each cell is visited exactly once |
| **Space** | O(m × n) - Queue can contain up to all cells in worst case |

### Approach 2: Two-Pass Dynamic Programming

| Complexity | Analysis |
|------------|----------|
| **Time** | O(m × n) - Two passes over the matrix |
| **Space** | O(m × n) - Output matrix (in-place modification possible) |

### Approach 3: DFS with Memoization

| Complexity | Analysis |
|------------|----------|
| **Time** | O(m × n) - Each cell computed once, each edge traversed once |
| **Space** | O(m × n) - Memo table and recursion stack |

### Comparison

| Approach | Pros | Cons |
|----------|------|------|
| **BFS** | Guarantees shortest path, no recursion depth issues | Uses queue with O(m × n) space |
| **DP** | Simple, iterative, no recursion overhead | Two passes needed, may need more iterations for complex cases |
| **DFS + Memo** | Elegant, handles complex neighbor relationships | Recursion stack may overflow for large grids |

---

## Related Problems

| Problem | Difficulty | Similarity |
|---------|------------|------------|
| [Rotting Oranges](/solutions/rotting-oranges.md) | Medium | BFS on grid, multi-source |
| [Shortest Distance from All Buildings](https://leetcode.com/problems/shortest-distance-from-all-buildings/) | Hard | BFS with distance accumulation |
| [As Far from Land as Possible](https://leetcode.com/problems/as-far-from-land-as-possible/) | Medium | Similar BFS approach, finding maximum distance |
| [Nearest Exit from Entrance in Maze](https://leetcode.com/problems/nearest-exit-from-entrance-in-maze/) | Medium | BFS for shortest path in grid |
| [01 Matrix](/solutions/01-matrix.md) | Medium | Same problem (this page) |

---

## Video Tutorials

1. **[NeetCode - 01 Matrix](https://www.youtube.com/watch?v=UcQ6mbdLCjU)** - Clear explanation of multi-source BFS approach
2. **[Back to Back SWE - 01 Matrix](https://www.youtube.com/watch?v=36GT2Ngg-SE)** - Detailed BFS and DP solutions
3. **[Fraz - LeetCode 542](https://www.youtube.com/watch?v=7C2F8Z7eP88)** - Comprehensive explanation of multiple approaches

---

## Follow-up Questions

### Q1: How would you modify the solution to use 8-directional movement (including diagonals)?

**Answer:** Change the directions array to include 8 directions instead of 4: `[(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)]`. This would calculate the distance using Chebyshev distance (max of absolute differences) instead of Manhattan distance.

### Q2: How would you find the cell(s) farthest from any zero?

**Answer:** After computing all distances, iterate through the result matrix and track the maximum distance and its position(s). The BFS approach naturally processes cells in increasing distance order, so the last processed `1` cell would be one of the farthest.

### Q3: What if you need to return the coordinates of the nearest zero for each cell instead of just the distance?

**Answer:** Store the coordinates of the source `0` along with the distance in the queue. When processing each cell, propagate the source coordinates. This way, each cell knows not just the distance but also which `0` cell is closest.

### Q4: How would you handle this problem if the matrix is extremely large (billions of cells) and cannot fit in memory?

**Answer:** You would need a different approach:
- Process the matrix in blocks/chunks
- Use external memory algorithms
- For very sparse matrices, consider using a priority queue with coordinates of `0` cells
- You might need to approximate or use sampling for extremely large datasets

### Q5: How would you modify the BFS solution to work with weighted edges (different costs for different directions)?

**Answer:** Replace the BFS queue with a priority queue (Dijkstra's algorithm). Each cell would store its minimum cost, and you'd always expand the cell with the lowest current cost. The priority queue ensures cells are processed in order of their minimum distance from any zero.

### Q6: Can this problem be solved in O(1) additional space (excluding the output)?

**Answer:** Yes, using the two-pass DP approach. You can modify the input matrix in-place to store the distances. Initialize with large values, then perform the two passes updating distances based on neighbors. This achieves O(1) extra space (excluding input/output).
