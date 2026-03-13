# Number Of Islands II

## Problem Description

You are given an m x n binary matrix land and an integer number of positions. Initially, all cells are water (0). You need to add land (1) to the cells specified in positions one by one. After each addition, you need to return the number of islands in the grid.

An island is a group of connected lands (1s) connected horizontally or vertically.

---

## Examples

### Example

**Input:**
```python
m = 3, n = 3, positions = [[0,0],[0,1],[1,2],[2,1]]
```

**Output:**
```python
[1, 1, 2, 3]
```

**Explanation:**
- After adding land at [0,0]: 1 island
- After adding land at [0,1]: 1 island (connected to [0,0])
- After adding land at [1,2]: 2 islands (new island)
- After adding land at [2,1]: 3 islands (new island)

### Example 2

**Input:**
```python
m = 2, n = 2, positions = [[0,0],[0,1],[1,1]]
```

**Output:**
```python
[1, 2, 1]
```

**Explanation:**
- After adding land at [0,0]: 1 island
- After adding land at [0,1]: 2 islands (new island)
- After adding land at [1,1]: 1 island (merged with [0,1])

---

## Constraints

- `1 <= m, n <= 10^4`
- `1 <= positions.length <= 10^4`
- `positions[i]` is a valid position `[x, y]` where `0 <= x < m` and `0 <= y < n`

---

## Pattern: Union-Find (Disjoint Set Union)

This problem is a classic example of the **Union-Find (Disjoint Set Union)** pattern. The pattern involves maintaining a set of elements partitioned into disjoint sets and supporting union and find operations efficiently.

### Core Concept

The fundamental idea is:
- **Dynamic Addition**: We add land cells one by one
- **Component Tracking**: Use Union-Find to track which cells belong to the same island
- **Island Count**: Maintain a counter that increments when adding new land and decrements when merging islands

---

## Intuition

The key insight is that when we add a land cell:
1. It initially creates a new island (increment count)
2. If any neighbor is already land, we merge them (decrement count if merge happens)
3. Union-Find efficiently handles the merge operation with path compression and union by rank

This approach avoids expensive BFS/DFS for each addition.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Union-Find (Optimal)** - O(α(n)) per operation, nearly constant
2. **BFS/DFS with Rebuild** - O(m*n*k) time, not efficient for large inputs

---

## Approach 1: Union-Find (Optimal)

This is the most efficient approach using Disjoint Set Union (DSU) with path compression and union by rank.

### Algorithm Steps

1. Initialize parent and rank dictionaries for Union-Find
2. For each position in the list:
   - If already processed, append current count to result
   - Otherwise, add as new component, increment count
   - Check all four neighbors; if any exists in parent, union them
   - Decrement count if union actually merged two components
   - Append current count to result
3. Return result list

### Code Implementation

````carousel
```python
from typing import List

class UnionFind:
    """Union-Find data structure with path compression and union by rank."""
    
    def __init__(self):
        self.parent = {}
        self.rank = {}
    
    def find(self, x):
        """Find the root of x with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        """Union two elements with union by rank."""
        px, py = self.find(x), self.find(y)
        if px == py:
            return False  # Already in the same set
        
        if self.rank.get(px, 0) > self.rank.get(py, 0):
            self.parent[py] = px
        elif self.rank.get(px, 0) < self.rank.get(py, 0):
            self.parent[px] = py
        else:
            self.parent[py] = px
            self.rank[px] = self.rank.get(px, 0) + 1
        return True  # Successfully merged

class Solution:
    def numIslands2(self, m: int, n: int, positions: List[List[int]]) -> List[int]:
        """
        Find number of islands after each land addition.
        
        Args:
            m: Number of rows
            n: Number of columns
            positions: List of positions to add land
            
        Returns:
            List of island counts after each addition
        """
        uf = UnionFind()
        result = []
        count = 0
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        for x, y in positions:
            pos = (x, y)
            
            # Skip if already processed
            if pos in uf.parent:
                result.append(count)
                continue
            
            # Add new land cell
            uf.parent[pos] = pos
            uf.rank[pos] = 0
            count += 1  # New island created
            
            # Check all four neighbors
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                npos = (nx, ny)
                if 0 <= nx < m and 0 <= ny < n and npos in uf.parent:
                    if uf.union(pos, npos):
                        count -= 1  # Two islands merged
            
            result.append(count)
        
        return result
```

<!-- slide -->
```cpp
class UnionFind {
    unordered_map<int, int> parent;
    unordered_map<int, int> rank;
    
public:
    int find(int x) {
        if (parent.find(x) == parent.end() || parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    bool unionSets(int x, int y) {
        int px = find(x);
        int py = find(y);
        if (px == py) return false;
        
        if (rank[px] > rank[py]) {
            parent[py] = px;
        } else if (rank[px] < rank[py]) {
            parent[px] = py;
        } else {
            parent[py] = px;
            rank[px]++;
        }
        return true;
    }
    
    bool exists(int x) {
        return parent.find(x) != parent.end();
    }
    
    void add(int x) {
        if (parent.find(x) == parent.end()) {
            parent[x] = x;
            rank[x] = 0;
        }
    }
};

class Solution {
public:
    vector<int> numIslands2(int m, int n, vector<vector<int>>& positions) {
        UnionFind uf;
        vector<int> result;
        int count = 0;
        vector<pair<int, int>> directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        for (const auto& pos : positions) {
            int x = pos[0], y = pos[1];
            int idx = x * n + y;
            
            if (!uf.exists(idx)) {
                uf.add(idx);
                count++;
                
                for (const auto& dir : directions) {
                    int nx = x + dir.first;
                    int ny = y + dir.second;
                    if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
                        int nidx = nx * n + ny;
                        if (uf.exists(nidx) && uf.unionSets(idx, nidx)) {
                            count--;
                        }
                    }
                }
            }
            
            result.push_back(count);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class UnionFind {
    Map<Integer, Integer> parent = new HashMap<>();
    Map<Integer, Integer> rank = new HashMap<>();
    
    public int find(int x) {
        if (!parent.containsKey(x)) {
            parent.put(x, x);
            rank.put(x, 0);
        }
        if (parent.get(x) != x) {
            parent.put(x, find(parent.get(x)));
        }
        return parent.get(x);
    }
    
    public boolean union(int x, int y) {
        int px = find(x);
        int py = find(y);
        if (px == py) return false;
        
        int rx = rank.getOrDefault(px, 0);
        int ry = rank.getOrDefault(py, 0);
        
        if (rx > ry) {
            parent.put(py, px);
        } else if (rx < ry) {
            parent.put(px, py);
        } else {
            parent.put(py, px);
            rank.put(px, rx + 1);
        }
        return true;
    }
    
    public boolean exists(int x) {
        return parent.containsKey(x);
    }
    
    public void add(int x) {
        if (!parent.containsKey(x)) {
            parent.put(x, x);
            rank.put(x, 0);
        }
    }
}

class Solution {
    public List<Integer> numIslands2(int m, int n, int[][] positions) {
        UnionFind uf = new UnionFind();
        List<Integer> result = new ArrayList<>();
        int count = 0;
        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        for (int[] pos : positions) {
            int x = pos[0], y = pos[1];
            int idx = x * n + y;
            
            if (!uf.exists(idx)) {
                uf.add(idx);
                count++;
                
                for (int[] dir : directions) {
                    int nx = x + dir[0];
                    int ny = y + dir[1];
                    if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
                        int nidx = nx * n + ny;
                        if (uf.exists(nidx) && uf.union(idx, nidx)) {
                            count--;
                        }
                    }
                }
            }
            
            result.add(count);
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
class UnionFind {
    constructor() {
        this.parent = new Map();
        this.rank = new Map();
    }
    
    find(x) {
        if (!this.parent.has(x)) {
            this.parent.set(x, x);
            this.rank.set(x, 0);
        }
        if (this.parent.get(x) !== x) {
            this.parent.set(x, this.find(this.parent.get(x)));
        }
        return this.parent.get(x);
    }
    
    union(x, y) {
        const px = this.find(x);
        const py = this.find(y);
        if (px === py) return false;
        
        const rx = this.rank.get(px) || 0;
        const ry = this.rank.get(py) || 0;
        
        if (rx > ry) {
            this.parent.set(py, px);
        } else if (rx < ry) {
            this.parent.set(px, py);
        } else {
            this.parent.set(py, px);
            this.rank.set(px, rx + 1);
        }
        return true;
    }
    
    exists(x) {
        return this.parent.has(x);
    }
    
    add(x) {
        if (!this.parent.has(x)) {
            this.parent.set(x, x);
            this.rank.set(x, 0);
        }
    }
}

/**
 * @param {number} m
 * @param {number} n
 * @param {number[][]} positions
 * @return {number[]}
 */
var numIslands2 = function(m, n, positions) {
    const uf = new UnionFind();
    const result = [];
    let count = 0;
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    for (const pos of positions) {
        const x = pos[0], y = pos[1];
        const idx = x * n + y;
        
        if (!uf.exists(idx)) {
            uf.add(idx);
            count++;
            
            for (const dir of directions) {
                const nx = x + dir[0];
                const ny = y + dir[1];
                if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
                    const nidx = nx * n + ny;
                    if (uf.exists(nidx) && uf.union(idx, nidx)) {
                        count--;
                    }
                }
            }
        }
        
        result.push(count);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(α(m*n)) per operation - nearly constant with path compression |
| **Space** | O(m*n) - Parent and rank dictionaries for each cell |

---

## Approach 2: BFS/DFS with Rebuild (Not Optimal)

This approach rebuilds the grid and performs BFS/DFS after each addition. While conceptually simple, it's inefficient for large inputs.

### Algorithm Steps

1. Create an m x n grid initialized to 0
2. For each position:
   - Set grid[x][y] = 1
   - Perform BFS/DFS from this position to count connected land cells
   - Track visited to avoid counting the same island twice
   - Append island count to result

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def numIslands2_bfs(self, m: int, n: int, positions: List[List[int]]) -> List[int]:
        """
        BFS approach - not optimal for large inputs.
        """
        grid = [[0] * n for _ in range(m)]
        result = []
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        def bfs(start_x, start_y):
            queue = deque([(start_x, start_y)])
            grid[start_x][start_y] = 0  # Mark as visited
            count = 1
            
            while queue:
                x, y = queue.popleft()
                for dx, dy in directions:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < m and 0 <= ny < n and grid[nx][ny] == 1:
                        grid[nx][ny] = 0
                        queue.append((nx, ny))
                        count += 1
            return count
        
        islands = 0
        for x, y in positions:
            grid[x][y] = 1
            islands += 1
            
            # Check neighbors - if any is land, do BFS to find connected component
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if 0 <= nx < m and 0 <= ny < n and grid[nx][ny] == 1:
                    islands -= bfs(nx, ny)
            
            result.append(islands)
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> numIslands2(int m, int n, vector<vector<int>>& positions) {
        vector<vector<int>> grid(m, vector<int>(n, 0));
        vector<int> result;
        int islands = 0;
        vector<pair<int, int>> directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        function<int(int, int)> bfs = [&](int x, int y) {
            queue<pair<int, int>> q;
            q.push({x, y});
            grid[x][y] = 0;
            int count = 1;
            
            while (!q.empty()) {
                auto [cx, cy] = q.front();
                q.pop();
                for (auto [dx, dy] : directions) {
                    int nx = cx + dx, ny = cy + dy;
                    if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] == 1) {
                        grid[nx][ny] = 0;
                        q.push({nx, ny});
                        count++;
                    }
                }
            }
            return count;
        };
        
        for (const auto& pos : positions) {
            int x = pos[0], y = pos[1];
            grid[x][y] = 1;
            islands++;
            
            for (auto [dx, dy] : directions) {
                int nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] == 1) {
                    islands -= bfs(nx, ny);
                }
            }
            
            result.push_back(islands);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<Integer> numIslands2(int m, int n, int[][] positions) {
        int[][] grid = new int[m][n];
        List<Integer> result = new ArrayList<>();
        int islands = 0;
        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        for (int[] pos : positions) {
            int x = pos[0], y = pos[1];
            grid[x][y] = 1;
            islands++;
            
            for (int[] dir : directions) {
                int nx = x + dir[0], ny = y + dir[1];
                if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] == 1) {
                    islands -= bfs(grid, nx, ny);
                }
            }
            
            result.add(islands);
        }
        
        return result;
    }
    
    private int bfs(int[][] grid, int x, int y) {
        Queue<int[]> q = new LinkedList<>();
        q.offer(new int[]{x, y});
        grid[x][y] = 0;
        int count = 1;
        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int[] dir : directions) {
                int nx = cur[0] + dir[0], ny = cur[1] + dir[1];
                if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length && grid[nx][ny] == 1) {
                    grid[nx][ny] = 0;
                    q.offer(new int[]{nx, ny});
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
 * BFS approach - not optimal for large inputs.
 * 
 * @param {number} m
 * @param {number} n
 * @param {number[][]} positions
 * @return {number[]}
 */
var numIslands2 = function(m, n, positions) {
    const grid = Array.from({ length: m }, () => Array(n).fill(0));
    const result = [];
    let islands = 0;
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    const bfs = (x, y) => {
        const queue = [[x, y]];
        grid[x][y] = 0;
        let count = 1;
        
        while (queue.length > 0) {
            const [cx, cy] = queue.shift();
            for (const [dx, dy] of directions) {
                const nx = cx + dx, ny = cy + dy;
                if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] === 1) {
                    grid[nx][ny] = 0;
                    queue.push([nx, ny]);
                    count++;
                }
            }
        }
        return count;
    };
    
    for (const [x, y] of positions) {
        grid[x][y] = 1;
        islands++;
        
        for (const [dx, dy] of directions) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] === 1) {
                islands -= bfs(nx, ny);
            }
        }
        
        result.push(islands);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m*n*k) - Each BFS can visit entire grid |
| **Space** | O(m*n) - Grid storage |

---

## Comparison of Approaches

| Aspect | Union-Find | BFS/DFS Rebuild |
|--------|-----------|-----------------|
| **Time Complexity** | O(α(n)) | O(m*n*k) |
| **Space Complexity** | O(m*n) | O(m*n) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No |
| **Best For** | Large inputs | Small inputs |

**Best Approach:** The Union-Find approach (Approach 1) is optimal with nearly constant time per operation, making it the preferred solution.

---

## Why Union-Find is Optimal for This Problem

The Union-Find approach is optimal because:

1. **Efficient Merging**: Union-Find can determine if two cells are in the same island in nearly constant time
2. **Dynamic Updates**: Handles the dynamic nature of adding land cells one by one
3. **Path Compression**: Ensures each find operation is nearly O(1)
4. **No Redundant Work**: Avoids rescanning the entire grid after each addition
5. **Industry Standard**: Widely used for connectivity problems

The key insight is that we only need to check the four neighbors of each newly added cell, not the entire grid.

---

## Related Problems

Based on similar themes (Union-Find, connectivity, grid problems):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Islands | [Link](https://leetcode.com/problems/number-of-islands/) | Count islands in static grid |
| Number of Islands II | [Link](https://leetcode.com/problems/number-of-islands-ii/) | Dynamic island counting |
| Graph Valid Tree | [Link](https://leetcode.com/problems/graph-valid-tree/) | Check if graph is valid tree |
| Surrounded Regions | [Link](https://leetcode.com/problems/surrounded-regions/) | Flip surrounded regions |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Connected Components | [Link](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) | Count components |
| Redundant Connection II | [Link](https://leetcode.com/problems/redundant-connection-ii/) | Find cycle in tree |

### Pattern Reference

For more detailed explanations of the Union-Find pattern and its variations, see:
- **[Union-Find Pattern](/patterns/union-find)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Union-Find Approach

- [NeetCode - Number of Islands II](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Clear explanation
- [Union-Find Explained](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=8jP8CCrj8cI) - Official explanation

### Related Concepts

- [Disjoint Set Union - Theory](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Complete guide
- [Path Compression](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - Optimization technique

---

## Follow-up Questions

### Q1: How would you modify to handle diagonal connections?

**Answer:** Add diagonal directions `[(1,1), (1,-1), (-1,1), (-1,-1)]` to the directions array. This changes the connectivity from 4-directional to 8-directional.

---

### Q2: What if positions could include removals (turning land back to water)?

**Answer:** This becomes much more complex. You'd need a more sophisticated data structure to handle both additions and deletions efficiently. One approach is to use a dynamic connectivity data structure with rollback capabilities.

---

### Q3: How would you track the actual islands, not just the count?

**Answer:** Maintain a mapping from root to list of cells. When merging, combine the lists. This requires more memory but allows tracking island components.

---

### Q4: Can you solve it without Union-Find?

**Answer:** Yes, you can use BFS/DFS as shown in Approach 2, but it's much slower for large inputs. Union-Find provides nearly constant time per operation.

---

### Q5: What edge cases should be tested?

**Answer:**
- Adding to same position twice
- Adding positions that create isolated cells
- Adding positions that merge multiple islands
- Large grid with few positions
- Empty positions list

---

### Q6: How would you handle very large m and n (like 10^9)?

**Answer:** The grid would be too large to materialize. You would need a hash-based Union-Find that only stores positions that have been added, similar to the dictionary-based approach but with more efficient indexing.

---

## Common Pitfalls

### 1. Duplicate Positions
**Issue**: Adding to the same position twice.

**Solution**: Check if position already exists in parent before processing.

### 2. Index Mapping
**Issue**: Incorrectly mapping 2D coordinates to 1D indices.

**Solution**: Use formula `idx = x * n + y` consistently.

### 3. Neighbor Checking
**Issue**: Not checking all four directions properly.

**Solution**: Use a directions array and check boundary conditions.

### 4. Count Management
**Issue**: Incorrectly incrementing/decrementing island count.

**Solution**: Increment when adding new land, decrement only when union actually merges two different components.

---

## Summary

The **Number of Islands II** problem demonstrates the power of Union-Find for dynamic connectivity problems:

- **Union-Find approach**: Optimal with nearly O(1) time per operation
- **BFS/DFS approach**: Simple but inefficient for large inputs

The key insight is that we only need to check the four neighbors of each newly added cell. Union-Find efficiently tracks which cells belong to the same island.

This problem is an excellent demonstration of how data structure choice impacts performance.

### Pattern Summary

This problem exemplifies the **Union-Find (Disjoint Set Union)** pattern, which is characterized by:
- Dynamic set merging
- Nearly constant time operations with path compression
- Efficient connectivity queries
- Used in network connectivity, image processing, and clustering

For more details on this pattern and its variations, see the **[Union-Find Pattern](/patterns/union-find)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/number-of-islands-ii/discuss/) - Community solutions
- [Union-Find - GeeksforGeeks](https://www.geeksforgeeks.org/disjoint-set-data-structures/) - Detailed explanation
- [Disjoint Set Union - CP Algorithms](https://cp-algorithms.com/data_structures/disjoint_set_union.html) - Implementation details
- [Path Compression - Wikipedia](https://en.wikipedia.org/wiki/Disjoint-set_data_structure) - Theory
