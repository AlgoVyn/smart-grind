# 01 Matrix

## Problem Description

Given an `m x n` binary matrix `mat`, return the distance of the nearest 0 for each cell.

The distance between two cells sharing a common edge (up, down, left, right) is 1.

---

## Examples

**Example 1:**

**Input:**
```python
mat = [[0,0,0],[0,1,0],[0,0,0]]
```

**Output:**
```python
[[0,0,0],[0,1,0],[0,0,0]]
```

**Explanation:** All 1s have a 0 adjacent to them, so distance is 1. But wait, let me re-check... Actually in this case, the 1 at position (1,1) has 0s in all four directions, so the output should be [[0,0,0],[0,1,0],[0,0,0]] is correct.

**Example 2:**

**Input:**
```python
mat = [[0,0,0],[0,1,0],[1,1,1]]
```

**Output:**
```python
[[0,0,0],[0,1,0],[1,2,1]]
```

**Explanation:**
- Cell (0,0), (0,1), (0,2), (1,0), (1,2) are 0s with distance 0
- Cell (1,1) has distance 1 (adjacent to multiple 0s)
- Cell (2,0) has distance 1 (adjacent to 0 at (1,0))
- Cell (2,1) has distance 2 (nearest 0 is at (1,1) or (2,0))
- Cell (2,2) has distance 1 (adjacent to 0 at (1,2))

**Example 3:**

**Input:**
```python
mat = [[0,1,0,1],[1,1,1,1],[0,1,1,1],[1,1,1,0]]
```

**Output:**
```python
[[0,1,0,1],[1,2,1,2],[0,1,2,1],[1,2,1,0]]
```

---

## Constraints

- `m == mat.length`
- `n == mat[i].length`
- `1 <= m, n <= 10^4`
- `1 <= m * n <= 10^4`
- `mat[i][j]` is either 0 or 1.
- There is at least one 0 in `mat`.

**Note:** This question is the same as 1765: https://leetcode.com/problems/map-of-highest-peak/

---

## Intuition

The problem can be viewed as finding the shortest distance from each cell to the nearest "source" (cell containing 0). Since all edges have equal weight (1), this is a classic shortest path problem in an unweighted grid.

Key observations:
1. All 0s are sources with distance 0
2. We need to find the minimum distance to any source for each cell
3. The grid can be treated as an unweighted graph where each cell is a node and edges connect adjacent cells

---

## Approach 1: Multi-Source BFS (Recommended)

### Algorithm

1. Initialize a queue with all positions containing 0
2. Mark all non-zero cells as unvisited (use -1 or a large value)
3. Perform BFS starting from all 0s simultaneously:
   - Dequeue a cell
   - Explore all 4 neighbors
   - If a neighbor is unvisited, mark it with distance = current distance + 1 and enqueue it
4. Return the updated matrix

### Why BFS Works

BFS explores nodes in order of increasing distance from sources. Since we start from all 0s at distance 0, the first time we reach any cell, we've found the shortest path to the nearest 0.

### Solution Code

```python
from typing import List
from collections import deque

class Solution:
    def updateMatrix(self, mat: List[List[int]]) -> List[List[int]]:
        """
        Multi-Source BFS approach to find distance to nearest 0.
        
        Time: O(m * n) - Each cell visited at most once
        Space: O(m * n) - Queue stores cells in worst case
        """
        if not mat or not mat[0]:
            return mat
        
        m, n = len(mat), len(mat[0])
        q = deque()
        
        # Step 1: Initialize queue with all 0 positions and mark non-zeros
        for i in range(m):
            for j in range(n):
                if mat[i][j] == 0:
                    q.append((i, j))
                else:
                    mat[i][j] = -1  # Mark as unvisited
        
        # Step 2: BFS to calculate distances
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        while q:
            x, y = q.popleft()
            current_dist = mat[x][y]
            
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if 0 <= nx < m and 0 <= ny < n and mat[nx][ny] == -1:
                    mat[nx][ny] = current_dist + 1
                    q.append((nx, ny))
        
        return mat
```

### Dry Run Example

For matrix: `[[0,1,1],[1,1,1],[1,1,0]]`

```
Initial state:
[0, -1, -1]
[-1, -1, -1]
[-1, -1, 0]

Queue: [(0,0), (2,2)]

Step 1: Dequeue (0,0), dist=0
  - Check neighbors of (0,0): (0,1), (1,0)
  - Both are unvisited (-1), set to 1 and enqueue
  - Queue: [(2,2), (0,1), (1,0)]

Step 2: Dequeue (2,2), dist=0
  - Check neighbors: (2,1), (1,2)
  - Both unvisited, set to 1 and enqueue
  - Queue: [(0,1), (1,0), (2,1), (1,2)]

Step 3: Dequeue (0,1), dist=1
  - Check neighbors: (0,0) visited, (0,2), (1,1)
  - (0,2) and (1,1) unvisited, set to 2 and enqueue
  - Queue: [(1,0), (2,1), (1,2), (0,2), (1,1)]

...continues until all cells visited

Final result:
[[0, 1, 2],
 [1, 2, 1],
 [2, 1, 0]]
```

---

## Approach 2: Dynamic Programming (Two Pass)

### Algorithm

1. **First Pass (Top-Left to Bottom-Right):**
   - For each cell, check top and left neighbors
   - If cell is 0, distance = 0
   - Otherwise, distance = min(top, left) + 1 (if neighbors exist)

2. **Second Pass (Bottom-Right to Top-Left):**
   - For each cell, check bottom and right neighbors
   - Update distance = min(current, bottom + 1, right + 1)

### Why Two Passes?

A single pass isn't sufficient because the shortest path to a 0 might come from any direction. By doing two passes:
- First pass captures distances from top and left
- Second pass captures distances from bottom and right
- Combining both gives the true minimum distance

### Solution Code

```python
from typing import List

class Solution:
    def updateMatrix(self, mat: List[List[int]]) -> List[List[int]]:
        """
        Dynamic Programming approach with two passes.
        
        Time: O(m * n) - Two passes through the matrix
        Space: O(1) - In-place updates (if modifying input is allowed)
               O(m * n) - If creating new matrix
        """
        if not mat or not mat[0]:
            return mat
        
        m, n = len(mat), len(mat[0])
        INF = m + n  # Larger than any possible distance
        
        # First pass: top-left to bottom-right
        for i in range(m):
            for j in range(n):
                if mat[i][j] == 0:
                    continue
                
                top = mat[i-1][j] if i > 0 else INF
                left = mat[i][j-1] if j > 0 else INF
                mat[i][j] = min(top, left) + 1
        
        # Second pass: bottom-right to top-left
        for i in range(m-1, -1, -1):
            for j in range(n-1, -1, -1):
                if mat[i][j] == 0:
                    continue
                
                bottom = mat[i+1][j] if i < m-1 else INF
                right = mat[i][j+1] if j < n-1 else INF
                mat[i][j] = min(mat[i][j], bottom + 1, right + 1)
        
        return mat
```

### Dry Run Example

For matrix: `[[0,1,1],[1,1,1],[1,1,0]]`

**First Pass (TL to BR):**
```
Initial:     After Pass 1:
[0, 1, 1]   [0, 1, 2]
[1, 1, 1]   [1, 2, 2]
[1, 1, 0]   [2, 2, 0]
```

**Second Pass (BR to TL):**
```
After Pass 1:    After Pass 2:
[0, 1, 2]       [0, 1, 2]
[1, 2, 2]  --->  [1, 2, 1]
[2, 2, 0]       [2, 1, 0]
```

Final result: `[[0,1,2],[1,2,1],[2,1,0]]`

---

## Approach 3: DFS

### Algorithm

1. Initialize distances: 0s are 0, 1s are infinity.
2. Iterate through every cell.
3. If a cell has a known distance (initially just the 0s), launch a DFS to its neighbors.
4. The Critical Pruning Condition: Only recurse to a neighbor if current_cell_dist + 1 < neighbor_dist. This ensures you only process a cell if you found a shorter path than what it currently has.

### Solution Code

```python
import sys

# Increase recursion depth for deep DFS paths
sys.setrecursionlimit(10000)

class Solution:
    def updateMatrix(self, mat: List[List[int]]) -> List[List[int]]:
        rows, cols = len(mat), len(mat[0])
        
        # Initialize distances: 0 for 0s, Infinity for 1s
        dist = [[float('inf') if mat[r][c] != 0 else 0 for c in range(cols)] for r in range(rows)]
        
        def dfs(r, c):
            # Check all 4 neighbors
            for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                nr, nc = r + dr, c + dc
                
                # Check bounds
                if 0 <= nr < rows and 0 <= nc < cols:
                    # CRITICAL: Only recurse if we found a shorter path to the neighbor
                    if dist[nr][nc] > dist[r][c] + 1:
                        dist[nr][nc] = dist[r][c] + 1
                        dfs(nr, nc)

        # We must trigger DFS from every '0' cell
        # Note: In a worst-case scenario, we might visit cells multiple times
        for r in range(rows):
            for c in range(cols):
                if mat[r][c] == 0:
                    dfs(r, c)
                    
        return dist
```

### Comparison with Other Approaches

- **BFS:** Guaranteed shortest path, works well for large matrices
- **DP:** Simple, no recursion overhead, good for smaller matrices
- **DFS:** More intuitive but can hit recursion limits on large matrices

---

## Time Complexity Comparison

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|----------------|------------------|---------------|
| Multi-Source BFS | O(m * n) | O(m * n) | Large matrices, guaranteed optimal |
| DP (Two Pass) | O(m * n) | O(1)* | When input can be modified |
| DFS | O((m * n)^2) | O(m * n) | When recursion is preferred |

*Space is O(1) if modifying input, O(m * n) otherwise

---

## Space Complexity Analysis

### BFS Approach
- **Queue:** In worst case, queue can hold O(m * n) cells
- **Input matrix:** O(m * n)
- **Total:** O(m * n)

### DP Approach
- **Input matrix:** O(m * n)
- **No additional data structures** (in-place modification)
- **Total:** O(1) extra space (excluding input)

### DFS Approach
- **Recursion stack:** O(m * n) in worst case (depth-first)
- **Total:** O((m * n)^2)

---

## Related Problems

1. **[Shortest Path in Binary Matrix (LC 1091)](https://leetcode.com/problems/shortest-path-in-binary-matrix/)** - Find shortest path from (0,0) to (n-1, n-1) in binary matrix
2. **[Map of Highest Peak (LC 1765)](https://leetcode.com/problems/map-of-highest-peak/)** - Same problem with water and land reversed
3. **[As Far from Land as Possible (LC 1162)](https://leetcode.com/problems/as-far-from-land-as-possible/)** - Find maximum distance to land in a grid
4. **[01 Matrix with Distance Threshold](https://leetcode.com/problems/01-matrix/)** - Extended version with distance constraints

---

## Video Tutorials

1. **[NeetCode - 01 Matrix](https://www.youtube.com/watch?v=UcGtCPS1gqI)** - Clear explanation with BFS approach
2. **[Backspace BFS vs DP](https://www.youtube.com/watch?v=EdT26hhmWJU)** - Comparison of BFS and DP approaches
3. **[LeetCode Official Solution](https://www.youtube.com/watch?v=7Cuy9a7uP8I)** - Official solution walkthrough

---

## Summary

The "01 Matrix" problem is a classic shortest path problem in an unweighted graph. The multi-source BFS approach is generally preferred because:
- It naturally handles multiple sources (all 0s)
- It guarantees the shortest path
- It has good performance characteristics

The DP approach is also elegant and can be more space-efficient if in-place modification is allowed.

Choose the approach that best fits your specific constraints and coding style!

