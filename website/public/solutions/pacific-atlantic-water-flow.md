# Pacific Atlantic Water Flow

## Problem Description

There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.

The island is partitioned into a grid of square cells. You are given an m x n integer matrix heights where `heights[r][c]` represents the height above sea level of the cell at coordinate `(r, c)`.

The island receives a lot of rain, and the rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is less than or equal to the current cell's height. Water can flow from any cell adjacent to an ocean into the ocean.

Return a 2D list of grid coordinates `result` where `result[i] = [ri, ci]` denotes that rain water can flow from cell `(ri, ci)` to both the Pacific and Atlantic oceans.

**Link to problem:** [Pacific Atlantic Water Flow - LeetCode 417](https://leetcode.com/problems/pacific-atlantic-water-flow/)

## Constraints
- `m == heights.length`
- `n == heights[r].length`
- `1 <= m, n <= 200`
- `0 <= heights[r][c] <= 10^5`

---

## Pattern: Reverse BFS/DFS from Boundaries

This problem is a classic example of the **Reverse Graph Traversal** pattern. Instead of checking if each cell can reach both oceans (which would be O(mn) for each cell), we reverse the problem by finding which cells can reach each ocean.

### Core Concept

The fundamental idea is **working backwards**:
- **Forward approach**: For each cell, try to reach both oceans - O((mn)²)
- **Reverse approach**: From ocean boundaries, find all cells that can reach each ocean - O(mn)

A cell can flow to an ocean if there's a path of non-increasing heights from the cell to that ocean.

---

## Examples

### Example

**Input:**
```
heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
```

**Output:**
```
[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
```

**Explanation:**
The following cells can flow to both the Pacific and Atlantic oceans:
- `[0,4]`: Can reach Pacific via [0,4]→[0,3]→[0,2]→[0,1]→[0,0] or Atlantic directly
- `[1,3]`: Can reach Pacific via [1,3]→[0,3] or Atlantic via [1,3]→[1,4]
- `[2,2]`: Can reach both oceans through various paths
- And so on...

### Example 2

**Input:**
```
heights = [[1]]
```

**Output:**
```
[[0,0]]
```

**Explanation:** The single cell can flow to both oceans.

---

## Intuition

The key insight is understanding water flow direction:

1. **Water flows downhill**: From higher to lower or equal elevation
2. **Reverse thinking**: Instead of "where can water from this cell go?" ask "which cells can reach the ocean?"
3. **Boundary cells**: All cells on Pacific boundary (top row, left column) can reach Pacific; all on Atlantic boundary can reach Atlantic
4. **Union**: Cells that can reach both are our answer

### Why This Works

- If a cell can reach the Pacific, there's a path of non-increasing heights from that cell to a Pacific boundary
- Same for Atlantic
- By starting BFS/DFS from boundaries and moving in reverse (from low to high), we find all cells that can reach each ocean
- Cells in the intersection flow to both oceans

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DFS from Boundaries** - Optimal O(mn) time, O(mn) space
2. **BFS from Boundaries** - Similar complexity, iterative

---

## Approach 1: DFS from Boundaries (Optimal)

This is the most efficient approach. We perform DFS from both ocean boundaries.

### Algorithm Steps

1. **Create visited matrices**:
   - `pacific[i][j]`: Can cell (i,j) reach Pacific?
   - `atlantic[i][j]`: Can cell (i,j) reach Atlantic?

2. **DFS from Pacific boundary**:
   - Start from all cells in top row and left column
   - Move to neighbors with height >= current cell (reverse flow)
   - Mark reachable cells

3. **DFS from Atlantic boundary**:
   - Start from all cells in bottom row and right column
   - Same reverse flow logic

4. **Find intersection**:
   - All cells marked in both matrices are in result

### Why It Works

The DFS from boundaries correctly identifies all cells that can reach each ocean because:
- Water flows from high to low
- Reverse DFS (low to high) captures all paths
- A cell is reachable if there's a path to boundary through non-decreasing heights

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        """
        Find all cells that can flow to both Pacific and Atlantic oceans.
        
        Args:
            heights: 2D grid of cell heights
            
        Returns:
            List of coordinates that can flow to both oceans
        """
        if not heights or not heights[0]:
            return []
        
        m, n = len(heights), len(heights[0])
        
        # Visited matrices for each ocean
        pacific = [[False] * n for _ in range(m)]
        atlantic = [[False] * n for _ in range(m)]
        
        def dfs(row: int, col: int, visited: List[List[bool]], prev_height: int) -> None:
            """DFS to find all cells that can reach the ocean."""
            # Check bounds and if already visited
            if row < 0 or row >= m or col < 0 or col >= n:
                return
            if visited[row][col]:
                return
            if heights[row][col] < prev_height:
                return
            
            # Mark as reachable
            visited[row][col] = True
            
            # Explore neighbors (in reverse flow direction)
            dfs(row + 1, col, visited, heights[row][col])
            dfs(row - 1, col, visited, heights[row][col])
            dfs(row, col + 1, visited, heights[row][col])
            dfs(row, col - 1, visited, heights[row][col])
        
        # DFS from Pacific boundary (top row and left column)
        for j in range(n):
            dfs(0, j, pacific, heights[0][j])
        for i in range(m):
            dfs(i, 0, pacific, heights[i][0])
        
        # DFS from Atlantic boundary (bottom row and right column)
        for j in range(n):
            dfs(m - 1, j, atlantic, heights[m - 1][j])
        for i in range(m):
            dfs(i, n - 1, atlantic, heights[i][n - 1])
        
        # Find cells that can reach both oceans
        result = []
        for i in range(m):
            for j in range(n):
                if pacific[i][j] and atlantic[i][j]:
                    result.append([i, j])
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
        if (heights.empty() || heights[0].empty()) return {};
        
        int m = heights.size(), n = heights[0].size();
        
        vector<vector<bool>> pacific(m, vector<bool>(n, false));
        vector<vector<bool>> atlantic(m, vector<bool>(n, false));
        
        function<void(int, int, vector<vector<bool>>&, int)> dfs = 
            [&](int row, int col, vector<vector<bool>>& visited, int prevHeight) {
                if (row < 0 || row >= m || col < 0 || col >= n) return;
                if (visited[row][col]) return;
                if (heights[row][col] < prevHeight) return;
                
                visited[row][col] = true;
                
                dfs(row + 1, col, visited, heights[row][col]);
                dfs(row - 1, col, visited, heights[row][col]);
                dfs(row, col + 1, visited, heights[row][col]);
                dfs(row, col - 1, visited, heights[row][col]);
            };
        
        // Pacific boundary
        for (int j = 0; j < n; j++) dfs(0, j, pacific, heights[0][j]);
        for (int i = 0; i < m; i++) dfs(i, 0, pacific, heights[i][0]);
        
        // Atlantic boundary
        for (int j = 0; j < n; j++) dfs(m - 1, j, atlantic, heights[m - 1][j]);
        for (int i = 0; i < m; i++) dfs(i, n - 1, atlantic, heights[i][n - 1]);
        
        // Intersection
        vector<vector<int>> result;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (pacific[i][j] && atlantic[i][j]) {
                    result.push_back({i, j});
                }
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        if (heights == null || heights.length == 0 || heights[0].length == 0) {
            return new ArrayList<>();
        }
        
        int m = heights.length, n = heights[0].length;
        boolean[][] pacific = new boolean[m][n];
        boolean[][] atlantic = new boolean[m][n];
        
        dfs(0, 0, pacific, heights, Integer.MIN_VALUE);
        dfs(m - 1, n - 1, atlantic, heights, Integer.MIN_VALUE);
        
        // Simplified: iterate all boundaries
        for (int j = 0; j < n; j++) {
            dfs(0, j, pacific, heights, Integer.MIN_VALUE);
            dfs(m - 1, j, atlantic, heights, Integer.MIN_VALUE);
        }
        for (int i = 0; i < m; i++) {
            dfs(i, 0, pacific, heights, Integer.MIN_VALUE);
            dfs(i, n - 1, atlantic, heights, Integer.MIN_VALUE);
        }
        
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (pacific[i][j] && atlantic[i][j]) {
                    result.add(Arrays.asList(i, j));
                }
            }
        }
        
        return result;
    }
    
    private void dfs(int row, int col, boolean[][] visited, int[][] heights, int prevHeight) {
        if (row < 0 || row >= heights.length || col < 0 || col >= heights[0].length) return;
        if (visited[row][col] || heights[row][col] < prevHeight) return;
        
        visited[row][col] = true;
        
        dfs(row + 1, col, visited, heights, heights[row][col]);
        dfs(row - 1, col, visited, heights, heights[row][col]);
        dfs(row, col + 1, visited, heights, heights[row][col]);
        dfs(row, col - 1, visited, heights, heights[row][col]);
    }
}
```

<!-- slide -->
```javascript
/**
 * Find all cells that can flow to both oceans.
 * 
 * @param {number[][]} heights - 2D grid of cell heights
 * @return {number[][]} - List of coordinates
 */
var pacificAtlantic = function(heights) {
    if (!heights || heights.length === 0 || heights[0].length === 0) {
        return [];
    }
    
    const m = heights.length, n = heights[0].length;
    const pacific = Array.from({length: m}, () => Array(n).fill(false));
    const atlantic = Array.from({length: m}, () => Array(n).fill(false));
    
    const dfs = (row, col, visited, prevHeight) => {
        if (row < 0 || row >= m || col < 0 || col >= n) return;
        if (visited[row][col] || heights[row][col] < prevHeight) return;
        
        visited[row][col] = true;
        
        dfs(row + 1, col, visited, heights[row][col]);
        dfs(row - 1, col, visited, heights[row][col]);
        dfs(row, col + 1, visited, heights[row][col]);
        dfs(row, col - 1, visited, heights[row][col]);
    };
    
    // Pacific boundary
    for (let j = 0; j < n; j++) dfs(0, j, pacific, heights[0][j]);
    for (let i = 0; i < m; i++) dfs(i, 0, pacific, heights[i][0]);
    
    // Atlantic boundary
    for (let j = 0; j < n; j++) dfs(m - 1, j, atlantic, heights[m - 1][j]);
    for (let i = 0; i < m; i++) dfs(i, n - 1, atlantic, heights[i][n - 1]);
    
    // Find intersection
    const result = [];
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (pacific[i][j] && atlantic[i][j]) {
                result.push([i, j]);
            }
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(mn) - Each cell visited at most once per DFS |
| **Space** | O(mn) - Two visited matrices + recursion stack |

---

## Approach 2: BFS from Boundaries

Similar to DFS but using a queue for iteration.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def pacificAtlantic_bfs(self, heights: List[List[int]]) -> List[List[int]]:
        """
        Using BFS instead of DFS.
        """
        if not heights or not heights[0]:
            return []
        
        m, n = len(heights), len(heights[0])
        
        def bfs(starts: List[tuple], visited: List[List[bool]]) -> None:
            queue = deque(starts)
            for r, c in starts:
                visited[r][c] = True
            
            directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
            
            while queue:
                r, c = queue.popleft()
                
                for dr, dc in directions:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < m and 0 <= nc < n and not visited[nr][nc]:
                        if heights[nr][nc] >= heights[r][c]:
                            visited[nr][nc] = True
                            queue.append((nr, nc))
        
        pacific_starts = [(0, j) for j in range(n)] + [(i, 0) for i in range(1, m)]
        atlantic_starts = [(m-1, j) for j in range(n)] + [(i, n-1) for i in range(m-1)]
        
        pacific = [[False] * n for _ in range(m)]
        atlantic = [[False] * n for _ in range(m)]
        
        bfs(pacific_starts, pacific)
        bfs(atlantic_starts, atlantic)
        
        result = []
        for i in range(m):
            for j in range(n):
                if pacific[i][j] and atlantic[i][j]:
                    result.append([i, j])
        
        return result
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(mn) - Each cell visited at most once |
| **Space** | O(mn) - Visited matrices + queue |

---

## Comparison of Approaches

| Aspect | DFS | BFS |
|--------|-----|-----|
| **Time Complexity** | O(mn) | O(mn) |
| **Space Complexity** | O(mn) | O(mn) |
| **Implementation** | Recursive | Iterative |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes |

**Best Approach:** Both DFS and BFS are optimal. DFS is typically more concise for this problem.

---

## Why Reverse BFS/DFS is Optimal

The reverse approach is optimal because:

1. **Avoids O((mn)²)**: Forward approach would check each cell's path to both oceans
2. **Each cell visited once**: By starting from boundaries, we reach each cell exactly once per ocean
3. **Reverse flow works**: When we move from low to high (reverse of water flow), we capture all possible paths
4. **Two traversals**: One for Pacific, one for Atlantic, then intersection

The key insight is transforming the problem from "where can water go?" to "where can water come from?"

---

## Related Problems

Based on similar themes (graph traversal, matrix problems):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Flood Fill | [Link](https://leetcode.com/problems/flood-fill/) | Similar DFS on grid |
| Number of Islands | [Link](https://leetcode.com/problems/number-of-islands/) | Connected components |
| Surrounded Regions | [Link](https://leetcode.com/problems/surrounded-regions/) | Reverse BFS pattern |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Enclaves | [Link](https://leetcode.com/problems/number-of-enclaves/) | Similar boundary traversal |
| Shortest Path in Binary Matrix | [Link](https://leetcode.com/problems/shortest-path-in-binary-matrix/) | BFS on grid |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### DFS/BFS Approaches

- [NeetCode - Pacific Atlantic Water Flow](https://www.youtube.com/watch?v=SuJyGk1kG5E) - Clear explanation
- [DFS Solution](https://www.youtube.com/watch?v=qH0bgiMuj9U) - Detailed walkthrough
- [LeetCode Official](https://www.youtube.com/watch?v=3Q_o3J3qGiY) - Official solution

### Related Concepts

- [Graph Traversal Techniques](https://www.youtube.com/watch?v=9D3bJtz9jXw) - BFS vs DFS
- [Matrix Problems](https://www.youtube.com/watch?v=9D3bJtz9jXw) - Common patterns

---

## Follow-up Questions

### Q1: What if water can flow diagonally?

**Answer:** Add diagonal directions to the traversal: (1,1), (1,-1), (-1,1), (-1,-1). Complexity remains O(mn).

---

### Q2: How would you find the path from cell to each ocean?

**Answer:** Store parent pointers during DFS to reconstruct paths. Each cell would track its predecessor.

---

### Q3: What if we need minimum height paths?

**Answer:** Use Dijkstra's algorithm with height difference as weight. Find paths that minimize the maximum height along the path.

---

### Q4: How would you handle a 3D terrain (multiple layers)?

**Answer:** Extend to 3D coordinates, add vertical direction to neighbors. Still O(mn) with appropriate data structures.

---

### Q5: What if cells have different water absorption rates?

**Answer:** This becomes a flow network problem, requiring more complex algorithms like max-flow.

---

### Q6: What edge cases should be tested?

**Answer:**
- Single cell (1x1)
- Single row or column
- All same heights
- All increasing heights
- All decreasing heights
- Mountain/island shapes

---

## Common Pitfalls

### 1. Height Comparison Direction
**Issue**: Comparing heights in wrong direction.

**Solution**: Remember we're doing reverse DFS - we can go to neighbor if neighbor's height >= current (water can flow from neighbor to current).

### 2. Boundary Overlap
**Issue**: Counting boundary cells twice.

**Solution**: It's fine - they'll be marked reachable in both DFS passes.

### 3. Initial Height Value
**Issue**: Starting DFS with wrong initial height.

**Solution**: Use -1 or 0 depending on constraints. Since heights >= 0, using 0 or heights[boundary] works.

### 4. Stack Overflow
**Issue**: Recursion depth too large for big grids.

**Solution**: Use BFS (queue-based) instead of DFS for large inputs, or increase recursion limit.

### 5. Matrix Indexing
**Issue**: Confusing row/column order.

**Solution**: Be consistent: heights[row][col], visited[row][col].

---

## Summary

The **Pacific Atlantic Water Flow** problem demonstrates the power of reverse graph traversal:

- **DFS/BFS from boundaries**: Optimal O(mn) solution
- **Reverse thinking**: Instead of "where can water go?" ask "where can water come from?"
- **Intersection**: Cells reachable from both oceans flow to both

The key insight is recognizing that the reverse approach transforms an O((mn)²) problem into O(mn).

### Pattern Summary

This problem exemplifies the **Reverse Graph Traversal** pattern, which is characterized by:
- Starting from boundaries/goal states
- Working backwards
- Using BFS or DFS
- Finding intersection of reachable sets

For more details on graph traversal patterns, see **[DFS](/algorithms/dfs-preorder)** and **[BFS](/algorithms/bfs)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/pacific-atlantic-water-flow/discuss/) - Community solutions
- [Flood Fill - GeeksforGeeks](https://www.geeksforgeeks.org/flood-fill-algorithm/) - Related algorithm
- [DFS & BFS - GeeksforGeeks](https://www.geeksforgeeks.org/bfs-vs-dfs-binary-tree/) - Traversal comparisons
