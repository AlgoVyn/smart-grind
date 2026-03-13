# Path With Minimum Effort

## LeetCode Link

[LeetCode 1631 - Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/)

---

## Problem Description

You are a hiker preparing for an upcoming hike. You are given `heights`, a 2D array of size `rows x columns`, where `heights[row][col]` represents the height of cell `(row, col)`. You are situated in the top-left cell, `(0, 0)`, and you hope to travel to the bottom-right cell, `(rows-1, columns-1)` (i.e., 0-indexed).

You can move up, down, left, or right, and you wish to find a route that requires the minimum effort. A route's effort is the maximum absolute difference in heights between two consecutive cells of the route.

Return the minimum effort required to travel from the top-left cell to the bottom-right cell.

---

## Examples

### Example 1

**Input:**
```
heights = [[1,2,2],[3,8,2],[5,3,5]]
```

**Output:**
```
2
```

**Explanation:**
- The route `[1,3,5,3,5]` has a maximum absolute difference of 2 in consecutive cells
- Route `[1,2,2,2,5]` has a maximum absolute difference of 3
- Therefore, the minimum effort is 2

### Example 2

**Input:**
```
heights = [[1,2,3],[3,8,4],[5,3,5]]
```

**Output:**
```
1
```

**Explanation:**
- The route `[1,2,3,4,5]` has a maximum absolute difference of 1
- Route `[1,3,5,3,5]` has higher differences
- Therefore, the minimum effort is 1

### Example 3

**Input:**
```
heights = [[1,2,1,1,1],[1,2,1,2,1],[1,2,1,2,1],[1,2,1,2,1],[1,1,1,2,1]]
```

**Output:**
```
0
```

**Explanation:**
- This route does not require any effort (all adjacent cells have same height)
- Return 0

---

## Constraints

- `rows == heights.length`
- `columns == heights[i].length`
- `1 <= rows, columns <= 100`
- `1 <= heights[i][j] <= 10^6`

---

## Pattern: Binary Search + BFS/DFS

This problem uses **Binary Search** on the answer combined with **BFS** for path verification. Binary search finds minimum effort, BFS validates paths.

---

## Intuition

The key insight for this problem is understanding the relationship between the maximum height difference along a path and the feasibility of finding such a path:

### Key Observations

1. **Monotonicity**: If you can reach the destination with maximum effort E, you can also reach it with any effort > E. This property makes binary search applicable.

2. **Effort Definition**: The effort of a path is the maximum height difference between any two consecutive cells. This is a "bottleneck" value - we want to minimize this maximum.

3. **Binary Search on Answer**: We binary search on the effort value. For each candidate effort, we check if a valid path exists using BFS/DFS.

4. **BFS Validation**: For a given effort threshold, we can traverse the grid and only move to adjacent cells if their height difference is within the threshold.

### Algorithm Overview

1. **Binary Search**: Search for minimum effort in range [0, max_height_diff]
2. **Feasibility Check**: For each candidate effort, use BFS to check if a path exists where all height differences <= effort
3. **Update Bounds**: If path exists, try lower effort; otherwise, try higher effort
4. **Return Result**: When binary search completes, return the minimum feasible effort

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Binary Search + BFS** - Classic approach (most common)
2. **Dijkstra's Algorithm** - Optimized single-source shortest path
3. **Union-Find** - Graph connectivity approach

---

## Approach 1: Binary Search + BFS (Optimal)

### Algorithm Steps

1. Define search bounds: left = 0, right = max height difference
2. While left < right:
   - Calculate mid = (left + right) / 2
   - Use BFS to check if path exists with effort <= mid
   - If path exists, right = mid (try smaller)
   - Otherwise, left = mid + 1 (need larger)
3. Return left

### Why It Works

The monotonicity property ensures binary search works: if a path exists with effort E, it also exists for any effort > E. BFS efficiently validates path existence within the threshold.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def minimumEffortPath(self, heights: List[List[int]]) -> int:
        m, n = len(heights), len(heights[0])
        
        def can_reach(effort: int) -> bool:
            """Check if we can reach destination with given max effort."""
            visited = [[False] * n for _ in range(m)]
            q = deque([(0, 0)])
            visited[0][0] = True
            
            while q:
                x, y = q.popleft()
                if x == m - 1 and y == n - 1:
                    return True
                
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    nx, ny = x + dx, y + dy
                    if (0 <= nx < m and 0 <= ny < n and 
                        not visited[nx][ny] and 
                        abs(heights[x][y] - heights[nx][ny]) <= effort):
                        visited[nx][ny] = True
                        q.append((nx, ny))
            return False
        
        # Binary search on effort value
        left, right = 0, 10**6
        while left < right:
            mid = (left + right) // 2
            if can_reach(mid):
                right = mid
            else:
                left = mid + 1
        return left
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <cmath>
using namespace std;

class Solution {
public:
    int minimumEffortPath(vector<vector<int>>& heights) {
        int m = heights.size();
        int n = heights[0].size();
        
        auto canReach = [&](int effort) -> bool {
            vector<vector<bool>> visited(m, vector<bool>(n, false));
            queue<pair<int, int>> q;
            q.push({0, 0});
            visited[0][0] = true;
            
            int dirs[4][2] = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
            
            while (!q.empty()) {
                auto [x, y] = q.front();
                q.pop();
                
                if (x == m - 1 && y == n - 1) return true;
                
                for (auto& dir : dirs) {
                    int nx = x + dir[0];
                    int ny = y + dir[1];
                    
                    if (nx >= 0 && nx < m && ny >= 0 && ny < n && 
                        !visited[nx][ny] && 
                        abs(heights[x][y] - heights[nx][ny]) <= effort) {
                        visited[nx][ny] = true;
                        q.push({nx, ny});
                    }
                }
            }
            return false;
        };
        
        int left = 0, right = 1000000;
        while (left < right) {
            int mid = (left + right) / 2;
            if (canReach(mid)) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int minimumEffortPath(int[][] heights) {
        int m = heights.length;
        int n = heights[0].length;
        
        return binarySearch(heights, m, n);
    }
    
    private int binarySearch(int[][] heights, int m, int n) {
        int left = 0, right = 1000000;
        
        while (left < right) {
            int mid = (left + right) / 2;
            if (canReach(heights, m, n, mid)) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }
    
    private boolean canReach(int[][] heights, int m, int n, int effort) {
        boolean[][] visited = new boolean[m][n];
        Queue<int[]> q = new LinkedList<>();
        q.offer(new int[]{0, 0});
        visited[0][0] = true;
        
        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        
        while (!q.isEmpty()) {
            int[] curr = q.poll();
            int x = curr[0], y = curr[1];
            
            if (x == m - 1 && y == n - 1) return true;
            
            for (int[] dir : dirs) {
                int nx = x + dir[0];
                int ny = y + dir[1];
                
                if (nx >= 0 && nx < m && ny >= 0 && ny < n && 
                    !visited[nx][ny] && 
                    Math.abs(heights[x][y] - heights[nx][ny]) <= effort) {
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
 * @param {number[][]} heights
 * @return {number}
 */
var minimumEffortPath = function(heights) {
    const m = heights.length;
    const n = heights[0].length;
    
    const canReach = (effort) => {
        const visited = Array(m).fill(null).map(() => Array(n).fill(false));
        const queue = [[0, 0]];
        visited[0][0] = true;
        
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        while (queue.length > 0) {
            const [x, y] = queue.shift();
            
            if (x === m - 1 && y === n - 1) return true;
            
            for (const [dx, dy] of dirs) {
                const nx = x + dx;
                const ny = y + dy;
                
                if (nx >= 0 && nx < m && ny >= 0 && ny < n && 
                    !visited[nx][ny] && 
                    Math.abs(heights[x][y] - heights[nx][ny]) <= effort) {
                    visited[nx][ny] = true;
                    queue.push([nx, ny]);
                }
            }
        }
        return false;
    };
    
    let left = 0, right = 1000000;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (canReach(mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log(10^6) × m × n) — binary search iterations × BFS |
| **Space** | O(m × n) — visited array |

---

## Approach 2: Dijkstra's Algorithm

### Algorithm Steps

1. Use a priority queue with (effort, row, col)
2. Start from (0,0) with effort 0
3. For each cell, calculate effort as max(current_effort, |current_height - neighbor_height|)
4. Use Dijkstra's algorithm to find minimum maximum effort to reach destination

### Why It Works

Dijkstra's algorithm finds the shortest path in a weighted graph. Here, the "distance" is the maximum edge weight along the path, which is exactly what we need.

### Code Implementation

````carousel
```python
from typing import List
import heapq

class Solution:
    def minimumEffortPath(self, heights: List[List[int]]) -> int:
        m, n = len(heights), len(heights[0])
        # (effort, row, col)
        heap = [(0, 0, 0)]
        visited = set()
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        
        while heap:
            effort, x, y = heapq.heappop(heap)
            
            if (x, y) in visited:
                continue
            visited.add((x, y))
            
            if x == m - 1 and y == n - 1:
                return effort
            
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if 0 <= nx < m and 0 <= ny < n and (nx, ny) not in visited:
                    new_effort = max(effort, abs(heights[x][y] - heights[nx][ny]))
                    heapq.heappush(heap, (new_effort, nx, ny))
        
        return 0
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <cmath>
using namespace std;

class Solution {
public:
    int minimumEffortPath(vector<vector<int>>& heights) {
        int m = heights.size();
        int n = heights[0].size();
        
        // (effort, row, col)
        using T = tuple<int, int, int>;
        priority_queue<T, vector<T>, greater<T>> pq;
        pq.emplace(0, 0, 0);
        
        vector<vector<int>> dist(m, vector<int>(n, INT_MAX));
        dist[0][0] = 0;
        
        int dirs[4][2] = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        
        while (!pq.empty()) {
            auto [effort, x, y] = pq.top();
            pq.pop();
            
            if (effort > dist[x][y]) continue;
            if (x == m - 1 && y == n - 1) return effort;
            
            for (auto& dir : dirs) {
                int nx = x + dir[0];
                int ny = y + dir[1];
                
                if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
                    int newEffort = max(effort, abs(heights[x][y] - heights[nx][ny]));
                    if (newEffort < dist[nx][ny]) {
                        dist[nx][ny] = newEffort;
                        pq.emplace(newEffort, nx, ny);
                    }
                }
            }
        }
        
        return 0;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int minimumEffortPath(int[][] heights) {
        int m = heights.length;
        int n = heights[0].length;
        
        // (effort, row, col)
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        pq.offer(new int[]{0, 0, 0});
        
        int[][] dist = new int[m][n];
        for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE);
        dist[0][0] = 0;
        
        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int effort = curr[0], x = curr[1], y = curr[2];
            
            if (effort > dist[x][y]) continue;
            if (x == m - 1 && y == n - 1) return effort;
            
            for (int[] dir : dirs) {
                int nx = x + dir[0];
                int ny = y + dir[1];
                
                if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
                    int newEffort = Math.max(effort, Math.abs(heights[x][y] - heights[nx][ny]));
                    if (newEffort < dist[nx][ny]) {
                        dist[nx][ny] = newEffort;
                        pq.offer(new int[]{newEffort, nx, ny});
                    }
                }
            }
        }
        
        return 0;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} heights
 * @return {number}
 */
var minimumEffortPath = function(heights) {
    const m = heights.length;
    const n = heights[0].length;
    
    // (effort, row, col)
    const pq = [[0, 0, 0]];
    const dist = Array(m).fill(null).map(() => Array(n).fill(Infinity));
    dist[0][0] = 0;
    
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [effort, x, y] = pq.shift();
        
        if (effort > dist[x][y]) continue;
        if (x === m - 1 && y === n - 1) return effort;
        
        for (const [dx, dy] of dirs) {
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
                const newEffort = Math.max(effort, Math.abs(heights[x][y] - heights[nx][ny]));
                if (newEffort < dist[nx][ny]) {
                    dist[nx][ny] = newEffort;
                    pq.push([newEffort, nx, ny]);
                }
            }
        }
    }
    
    return 0;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n × log(m × n)) — priority queue operations |
| **Space** | O(m × n) — distance array and priority queue |

---

## Approach 3: Union-Find

### Algorithm Steps

1. Create edges between all adjacent cells with their height differences as weights
2. Sort edges by weight (height difference)
3. Use Union-Find to progressively connect cells
4. Stop when start and end cells are connected
5. Return the weight of the edge that connected them

### Why It Works

By processing edges from smallest to largest weight, the moment start and end become connected, the current edge weight is the minimum effort needed.

### Code Implementation

````carousel
```python
from typing import List

class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True

class Solution:
    def minimumEffortPath(self, heights: List[List[int]]) -> int:
        m, n = len(heights), len(heights[0])
        
        # Create edges between all adjacent cells
        edges = []
        for r in range(m):
            for c in range(n):
                if r + 1 < m:
                    diff = abs(heights[r][c] - heights[r+1][c])
                    edges.append((diff, r * n + c, (r+1) * n + c))
                if c + 1 < n:
                    diff = abs(heights[r][c] - heights[r][c+1])
                    edges.append((diff, r * n + c, r * n + c + 1))
        
        # Sort edges by weight
        edges.sort(key=lambda x: x[0])
        
        # Union-Find
        uf = UnionFind(m * n)
        
        for diff, a, b in edges:
            uf.union(a, b)
            if uf.find(0) == uf.find(m * n - 1):
                return diff
        
        return 0
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class UnionFind {
public:
    vector<int> parent, rank;
    
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        if (rank[px] < rank[py]) swap(px, py);
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        return true;
    }
};

class Solution {
public:
    int minimumEffortPath(vector<vector<int>>& heights) {
        int m = heights.size();
        int n = heights[0].size();
        
        vector<tuple<int, int, int>> edges;
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (r + 1 < m) {
                    int diff = abs(heights[r][c] - heights[r+1][c]);
                    edges.emplace_back(diff, r * n + c, (r+1) * n + c);
                }
                if (c + 1 < n) {
                    int diff = abs(heights[r][c] - heights[r][c+1]);
                    edges.emplace_back(diff, r * n + c, r * n + c + 1);
                }
            }
        }
        
        sort(edges.begin(), edges.end());
        
        UnionFind uf(m * n);
        for (auto& [diff, a, b] : edges) {
            uf.unite(a, b);
            if (uf.find(0) == uf.find(m * n - 1)) return diff;
        }
        
        return 0;
    }
};
```

<!-- slide -->
```java
class Solution {
    class UnionFind {
        int[] parent;
        int[] rank;
        
        UnionFind(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i++) parent[i] = i;
        }
        
        int find(int x) {
            if (parent[x] != x) parent[x] = find(parent[x]);
            return parent[x];
        }
        
        boolean unite(int x, int y) {
            int px = find(x), py = find(y);
            if (px == py) return false;
            if (rank[px] < rank[py]) {
                int temp = px;
                px = py;
                py = temp;
            }
            parent[py] = px;
            if (rank[px] == rank[py]) rank[px]++;
            return true;
        }
    }
    
    public int minimumEffortPath(int[][] heights) {
        int m = heights.length;
        int n = heights[0].length;
        
        int[][] edges = new int[m * n * 2][3];
        int idx = 0;
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (r + 1 < m) {
                    int diff = Math.abs(heights[r][c] - heights[r+1][c]);
                    edges[idx++] = new int[]{diff, r * n + c, (r+1) * n + c};
                }
                if (c + 1 < n) {
                    int diff = Math.abs(heights[r][c] - heights[r][c+1]);
                    edges[idx++] = new int[]{diff, r * n + c, r * n + c + 1};
                }
            }
        }
        
        java.util.Arrays.sort(edges, (a, b) -> Integer.compare(a[0], b[0]));
        
        UnionFind uf = new UnionFind(m * n);
        for (int i = 0; i < idx; i++) {
            uf.unite(edges[i][1], edges[i][2]);
            if (uf.find(0) == uf.find(m * n - 1)) return edges[i][0];
        }
        
        return 0;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} heights
 * @return {number}
 */
var minimumEffortPath = function(heights) {
    const m = heights.length;
    const n = heights[0].length;
    
    class UnionFind {
        constructor(n) {
            this.parent = Array.from({ length: n }, (_, i) => i);
            this.rank = new Array(n).fill(0);
        }
        
        find(x) {
            if (this.parent[x] !== x) {
                this.parent[x] = this.find(this.parent[x]);
            }
            return this.parent[x];
        }
        
        unite(x, y) {
            const px = this.find(x);
            const py = this.find(y);
            if (px === py) return false;
            if (this.rank[px] < this.rank[py]) {
                this.parent[px] = py;
            } else if (this.rank[px] > this.rank[py]) {
                this.parent[py] = px;
            } else {
                this.parent[py] = px;
                this.rank[px]++;
            }
            return true;
        }
    }
    
    const edges = [];
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            if (r + 1 < m) {
                const diff = Math.abs(heights[r][c] - heights[r+1][c]);
                edges.push([diff, r * n + c, (r+1) * n + c]);
            }
            if (c + 1 < n) {
                const diff = Math.abs(heights[r][c] - heights[r][c+1]);
                edges.push([diff, r * n + c, r * n + c + 1]);
            }
        }
    }
    
    edges.sort((a, b) => a[0] - b[0]);
    
    const uf = new UnionFind(m * n);
    for (const [diff, a, b] of edges) {
        uf.unite(a, b);
        if (uf.find(0) === uf.find(m * n - 1)) return diff;
    }
    
    return 0;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(E log E) where E is number of edges (≈ 2 × m × n) |
| **Space** | O(m × n) — Union-Find structure |

---

## Comparison of Approaches

| Aspect | Binary Search + BFS | Dijkstra | Union-Find |
|--------|---------------------|----------|------------|
| **Time Complexity** | O(log(M) × m × n) | O(mn log(mn)) | O(E log E) |
| **Space Complexity** | O(m × n) | O(m × n) | O(m × n) |
| **Implementation** | Simple | Moderate | Moderate |
| **LeetCode Optimal** | ✅ | ✅ | ✅ |

**Best Approach:** Use Binary Search + BFS for intuitive solution, or Dijkstra for more direct approach.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Google, Facebook
- **Difficulty**: Medium
- **Concepts Tested**: Binary Search, BFS/DFS, Graph algorithms, Dijkstra's algorithm

### Learning Outcomes

1. **Binary Search on Answer**: Learn to apply binary search on monotonic predicates
2. **Graph Traversal**: Master BFS/DFS for path finding
3. **Dijkstra's Algorithm**: Understand modified shortest path algorithms

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Path With Maximum Probability | [Link](https://leetcode.com/problems/path-with-maximum-probability/) | Modified Dijkstra |
| Cheapest Flights Within K Stops | [Link](https://leetcode.com/problems/cheapest-flights-within-k-stops/) | Modified Dijkstra |
| Swim in Rising Water | [Link](https://leetcode.com/problems/swim-in-rising-water/) | Similar grid problem |

### Pattern Reference

For more detailed explanations, see:
- **[Binary Search Pattern](/patterns/binary-search-on-sorted-array-list)**
- **[Graph BFS](/patterns/graph-bfs-connected-components-island-counting)**

---

## Video Tutorial Links

1. **[NeetCode - Path With Minimum Effort](https://www.youtube.com/watch?v=0R把D6Z7M1k)** - Clear explanation
2. **[Dijkstra's Algorithm](https://www.youtube.com/watch?v=pVfj6mxhdQw)** - Algorithm tutorial
3. **[Binary Search on Answer](https://www.youtube.com/watch?v=GU7DpgHINWQ)** - Technique explanation

---

## Follow-up Questions

### Q1: How would you modify the solution to return the actual path?

**Answer:** Instead of just tracking the minimum effort, maintain a parent array or path reconstruction structure. For Binary Search approach, store the path when the minimum effort is found. For Dijkstra, track parent pointers.

---

### Q2: What if you could move diagonally as well?

**Answer:** Add diagonal directions to the BFS/Dijkstra: `(-1,-1), (-1,1), (1,-1), (1,1)`. The rest of the algorithm remains the same.

---

### Q3: How would you handle multiple hikers starting from different positions?

**Answer:** This becomes a multi-source problem. Initialize the BFS/Dijkstra with all starting positions in the queue with effort 0, and find minimum effort to reach any destination.

---

### Q4: Can you solve this with A* Search?

**Answer:** Yes, you can use A* search with a heuristic like Manhattan distance. The heuristic would be `|target_row - current_row| + |target_col - current_col|`. However, A* is optimal only when the heuristic is admissible.

---

## Common Pitfalls

### 1. Binary Search Bounds
**Issue**: Using incorrect search range.

**Solution**: Search from 0 to max height difference (10^6 as per constraints).

### 2. BFS Condition
**Issue**: Incorrect condition for traversing edges.

**Solution**: Only traverse if `abs(heights[x][y] - heights[nx][ny]) <= effort`.

### 3. Complete Path Check
**Issue**: Not verifying destination is reached.

**Solution**: Must reach bottom-right cell (m-1, n-1), not just any cell.

### 4. Using Float for Effort
**Issue**: All heights are integers, effort should be integer.

**Solution**: Use integer arithmetic throughout.

---

## Summary

The **Path With Minimum Effort** problem demonstrates several important algorithmic techniques:

- **Binary Search on Answer**: Leverages monotonicity to find minimum feasible value
- **BFS/DFS Path Finding**: Validates connectivity within threshold
- **Dijkstra's Algorithm**: Modified for minimax path problem
- **Union-Find**: Alternative graph connectivity approach

Key takeaways:
1. The effort of a path is the maximum height difference along it
2. Binary search + BFS provides an intuitive O(log M × mn) solution
3. Dijkstra with modified relaxation finds the answer directly
4. Union-Find processes edges from smallest to largest

This problem is excellent for learning how to combine multiple algorithmic paradigms.

### Pattern Summary

This problem exemplifies the **Binary Search + Graph Traversal** pattern, characterized by:
- Binary search on answer with monotonic predicate
- Graph traversal for feasibility checking
- Multiple solution approaches
- Modified shortest path algorithms

For more details, see **[Binary Search Pattern](/patterns/binary-search-on-sorted-array-list)**.

---

## Additional Resources

- [LeetCode 1631 - Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/) - Official problem page
- [Dijkstra's Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/dijkstras-algorithm/) - Algorithm explanation
- [Union-Find - GeeksforGeeks](https://www.geeksforgeeks.org/union-find/) - Data structure guide
