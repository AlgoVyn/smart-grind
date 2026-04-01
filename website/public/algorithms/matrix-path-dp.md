# Matrix Path Dynamic Programming

## Category
Dynamic Programming

## Description

Matrix Path DP is a classic dynamic programming technique used to solve problems involving **grid navigation** where you need to find optimal paths or count unique routes from one cell to another. The key insight is that at any cell, you can only reach it from a limited set of previous positions (typically from above or from the left), making it ideal for DP formulation.

This pattern is fundamental in competitive programming and technical interviews because it demonstrates how to convert a 2D grid problem into a systematic dynamic programming solution with clear state transitions. Problems range from simple path counting to complex obstacle navigation and minimum/maximum path sum calculations.

---

## Concepts

### 1. Grid State Representation

The DP state represents the answer for reaching a specific cell:

| State Type | Meaning | Example |
|------------|---------|---------|
| `dp[i][j]` | Number of ways to reach cell (i,j) | Path counting |
| `dp[i][j]` | Minimum sum to reach cell (i,j) | Min path sum |
| `dp[i][j]` | Maximum sum to reach cell (i,j) | Max path sum |

### 2. Direction Constraints

Different problems allow different movement directions:

| Direction Set | Problems | Recurrence |
|---------------|----------|------------|
| Right, Down | Standard grid | `dp[i][j] = f(dp[i-1][j], dp[i][j-1])` |
| All 4 directions | Advanced grids | Requires DFS + memoization |
| Diagonal included | Special cases | `dp[i][j] += dp[i-1][j-1]` |

### 3. Obstacle Handling

Strategies for dealing with blocked cells:

```
Standard approach:
if grid[i][j] == 1:  # Obstacle
    dp[i][j] = 0     # No paths through obstacle
else:
    dp[i][j] = dp[i-1][j] + dp[i][j-1]  # Normal calculation
```

### 4. Base Cases

Foundation of the DP solution:

| Case | Value | Reason |
|------|-------|--------|
| `dp[0][0]` | 1 (or grid[0][0]) | Starting position |
| First row | From left only | Can't come from above |
| First column | From above only | Can't come from left |

---

## Frameworks

### Framework 1: Path Counting with Obstacles

```
┌─────────────────────────────────────────────────────┐
│  MATRIX PATH COUNTING FRAMEWORK                     │
├─────────────────────────────────────────────────────┤
│  1. Check edge cases (start/end blocked)            │
│  2. Create DP table of size m×n                     │
│  3. Initialize:                                      │
│     - dp[0][0] = 1 (if not obstacle)                │
│     - First row: accumulate from left               │
│     - First column: accumulate from above             │
│  4. Fill remaining cells:                            │
│     - If obstacle: dp[i][j] = 0                     │
│     - Else: dp[i][j] = dp[i-1][j] + dp[i][j-1]      │
│  5. Return dp[m-1][n-1]                             │
└─────────────────────────────────────────────────────┘
```

**When to use**: Counting unique paths with obstacles

### Framework 2: Minimum/Maximum Path Sum

```
┌─────────────────────────────────────────────────────┐
│  MIN/MAX PATH SUM FRAMEWORK                         │
├─────────────────────────────────────────────────────┤
│  1. Create DP table of size m×n                     │
│  2. Initialize:                                      │
│     - dp[0][0] = grid[0][0]                         │
│     - First row: cumulative sum from left          │
│     - First column: cumulative sum from above       │
│  3. Fill remaining cells:                            │
│     - dp[i][j] = grid[i][j] + min/max(             │
│         dp[i-1][j], dp[i][j-1]                      │
│       )                                             │
│  4. Return dp[m-1][n-1]                             │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding optimal cost paths

### Framework 3: Space-Optimized Single Row

```
┌─────────────────────────────────────────────────────┐
│  SPACE-OPTIMIZED MATRIX DP FRAMEWORK                │
├─────────────────────────────────────────────────────┤
│  1. Use 1D array dp of size n (columns)             │
│  2. Initialize dp[0] = 1 (or grid[0][0])             │
│  3. For each row i:                                  │
│     a. For each column j:                           │
│        - If obstacle: dp[j] = 0                     │
│        - Else if j > 0: dp[j] += dp[j-1]            │
│  4. Return dp[n-1]                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Memory-constrained environments

---

## Forms

### Form 1: Unique Paths (No Obstacles)

Count paths in empty m×n grid moving only right or down.

| Grid Size | Paths | Formula |
|-----------|-------|---------|
| 3×7 | 28 | C(8, 2) = 28 |
| 3×3 | 6 | C(4, 2) = 6 |
| m×n | C(m+n-2, m-1) | Combinatorics |

### Form 2: Unique Paths II (With Obstacles)

Grid contains obstacles (1 = blocked, 0 = empty).

```
Example:
[0, 0, 0]
[0, 1, 0]  →  2 paths
[0, 0, 0]
```

### Form 3: Minimum Path Sum

Find path with minimum sum of cell values.

| Grid | Min Path | Sum |
|------|----------|-----|
| [[1,3,1],[1,5,1],[4,2,1]] | 1→3→1→1→1 | 7 |

### Form 4: Maximum Path Sum

Find path with maximum sum of cell values.

| Grid | Max Path | Sum |
|------|----------|-----|
| [[1,3,1],[1,5,1],[4,2,1]] | 1→1→4→2→1 | 9 |

### Form 5: Triangle Path

Path in triangular array, moving to adjacent numbers on row below.

```
    2
   3 4
  6 5 7
 4 1 8 3
```

---

## Tactics

### Tactic 1: Combinatorial Optimization

For empty grids, use direct formula instead of DP:

```python
from math import comb

def unique_paths_combinatorial(m: int, n: int) -> int:
    """O(min(m,n)) time using combinatorics."""
    return comb(m + n - 2, min(m - 1, n - 1))
```

### Tactic 2: In-Place DP (Modify Input)

Save space by modifying the input grid:

```python
def min_path_sum_inplace(grid):
    """Use grid itself as DP table."""
    m, n = len(grid), len(grid[0])
    
    # First row
    for j in range(1, n):
        grid[0][j] += grid[0][j-1]
    
    # First column
    for i in range(1, m):
        grid[i][0] += grid[i-1][0]
    
    # Rest
    for i in range(1, m):
        for j in range(1, n):
            grid[i][j] += min(grid[i-1][j], grid[i][j-1])
    
    return grid[m-1][n-1]
```

### Tactic 3: Path Reconstruction

Track the path, not just the cost:

```python
def min_path_sum_with_path(grid):
    """Return min sum and the actual path."""
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    parent = [[None] * n for _ in range(m)]
    
    dp[0][0] = grid[0][0]
    
    # Fill first row
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] + grid[0][j]
        parent[0][j] = (0, j-1)
    
    # Fill first column
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] + grid[i][0]
        parent[i][0] = (i-1, 0)
    
    # Fill rest
    for i in range(1, m):
        for j in range(1, n):
            if dp[i-1][j] < dp[i][j-1]:
                dp[i][j] = dp[i-1][j] + grid[i][j]
                parent[i][j] = (i-1, j)
            else:
                dp[i][j] = dp[i][j-1] + grid[i][j]
                parent[i][j] = (i, j-1)
    
    # Reconstruct path
    path = []
    i, j = m-1, n-1
    while i is not None:
        path.append((i, j))
        if parent[i][j] is None:
            break
        i, j = parent[i][j]
    
    return dp[m-1][n-1], path[::-1]
```

### Tactic 4: Handling Different Start/End Points

Generalized solution for arbitrary start and end:

```python
def count_paths_start_end(grid, start, end):
    """Count paths from start to end."""
    m, n = len(grid), len(grid[0])
    sr, sc = start
    er, ec = end
    
    # Shift coordinates
    dp = [[0] * (ec - sc + 1) for _ in range(er - sr + 1)]
    dp[0][0] = 1 if grid[sr][sc] == 0 else 0
    
    # Fill DP table with offset
    for i in range(er - sr + 1):
        for j in range(ec - sc + 1):
            if grid[sr + i][sc + j] == 1:
                dp[i][j] = 0
            else:
                if i > 0:
                    dp[i][j] += dp[i-1][j]
                if j > 0:
                    dp[i][j] += dp[i][j-1]
    
    return dp[er - sr][ec - sc]
```

### Tactic 5: Multi-Path Cherry Pickup

Advanced: two paths simultaneously:

```python
def cherry_pickup(grid):
    """Max cherries picking up with two simultaneous paths."""
    n = len(grid)
    # dp[t][r1][r2] = max cherries when both at step t
    # r1 + c1 = t, r2 + c2 = t, so c1 = t - r1, c2 = t - r2
    
    dp = [[[-1] * n for _ in range(n)] for _ in range(2*n-1)]
    dp[0][0][0] = grid[0][0]
    
    for t in range(1, 2*n-1):
        for r1 in range(max(0, t-(n-1)), min(n, t+1)):
            for r2 in range(max(0, t-(n-1)), min(n, t+1)):
                c1, c2 = t - r1, t - r2
                if c1 < 0 or c1 >= n or c2 < 0 or c2 >= n:
                    continue
                if grid[r1][c1] == -1 or grid[r2][c2] == -1:
                    continue
                
                cherries = grid[r1][c1]
                if r1 != r2:
                    cherries += grid[r2][c2]
                
                # Try all previous positions
                prev_positions = [
                    dp[t-1][r1][r2],
                    dp[t-1][r1-1][r2] if r1 > 0 else -1,
                    dp[t-1][r1][r2-1] if r2 > 0 else -1,
                    dp[t-1][r1-1][r2-1] if r1 > 0 and r2 > 0 else -1
                ]
                
                dp[t][r1][r2] = max(prev_positions) + cherries
    
    return max(0, dp[2*n-2][n-1][n-1])
```

---

## Python Templates

### Template 1: Unique Paths with Obstacles

```python
from typing import List

def unique_paths_with_obstacles(grid: List[List[int]]) -> int:
    """
    Count unique paths from top-left to bottom-right with obstacles.
    Time: O(m*n), Space: O(m*n)
    """
    if not grid or not grid[0]:
        return 0
    
    m, n = len(grid), len(grid[0])
    
    # Edge case: start or end is blocked
    if grid[0][0] == 1 or grid[m-1][n-1] == 1:
        return 0
    
    # Create DP table
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = 1
    
    # Fill first row
    for j in range(1, n):
        if grid[0][j] == 0:
            dp[0][j] = dp[0][j-1]
    
    # Fill first column
    for i in range(1, m):
        if grid[i][0] == 0:
            dp[i][0] = dp[i-1][0]
    
    # Fill rest of the table
    for i in range(1, m):
        for j in range(1, n):
            if grid[i][j] == 0:
                dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]
```

### Template 2: Space-Optimized Path Counting

```python
from typing import List

def unique_paths_optimized(grid: List[List[int]]) -> int:
    """
    Space-optimized unique paths using O(n) space.
    Time: O(m*n), Space: O(n)
    """
    if not grid or not grid[0]:
        return 0
    
    m, n = len(grid), len(grid[0])
    
    if grid[0][0] == 1 or grid[m-1][n-1] == 1:
        return 0
    
    # 1D DP array
    dp = [0] * n
    dp[0] = 1
    
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                dp[j] = 0
            elif j > 0:
                dp[j] += dp[j-1]
            # dp[j] already contains value from above
    
    return dp[n-1]
```

### Template 3: Minimum Path Sum

```python
from typing import List

def min_path_sum(grid: List[List[int]]) -> int:
    """
    Find minimum path sum from top-left to bottom-right.
    Time: O(m*n), Space: O(m*n)
    """
    if not grid or not grid[0]:
        return 0
    
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    
    # Base case
    dp[0][0] = grid[0][0]
    
    # Fill first row
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] + grid[0][j]
    
    # Fill first column
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] + grid[i][0]
    
    # Fill rest
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
    
    return dp[m-1][n-1]
```

### Template 4: Unique Paths (Combinatorial)

```python
from math import comb

def unique_paths_combinatorial(m: int, n: int) -> int:
    """
    Count unique paths in m x n grid WITHOUT obstacles.
    Uses combinatorics: C(m+n-2, m-1)
    Time: O(min(m, n)), Space: O(1)
    """
    return comb(m + n - 2, min(m - 1, n - 1))
```

### Template 5: Triangle Minimum Path Sum

```python
from typing import List

def minimum_total(triangle: List[List[int]]) -> int:
    """
    Minimum path sum in triangle from top to bottom.
    Time: O(n²), Space: O(n) where n is number of rows.
    """
    if not triangle:
        return 0
    
    n = len(triangle)
    # Bottom-up DP with single row
    dp = triangle[-1][:]  # Start with last row
    
    for i in range(n - 2, -1, -1):
        for j in range(i + 1):
            dp[j] = triangle[i][j] + min(dp[j], dp[j + 1])
    
    return dp[0]
```

### Template 6: In-Place Minimum Path Sum

```python
from typing import List

def min_path_sum_inplace(grid: List[List[int]]) -> int:
    """
    Minimum path sum modifying grid in-place.
    Time: O(m*n), Space: O(1) extra
    """
    if not grid or not grid[0]:
        return 0
    
    m, n = len(grid), len(grid[0])
    
    # First row
    for j in range(1, n):
        grid[0][j] += grid[0][j-1]
    
    # First column
    for i in range(1, m):
        grid[i][0] += grid[i-1][0]
    
    # Rest
    for i in range(1, m):
        for j in range(1, n):
            grid[i][j] += min(grid[i-1][j], grid[i][j-1])
    
    return grid[m-1][n-1]
```

---

## When to Use

Use the Matrix Path DP algorithm when you need to solve problems involving:

- **Grid Navigation**: Finding paths in a 2D matrix with or without obstacles
- **Path Counting**: Counting unique ways to reach from start to destination
- **Min/Max Path Sum**: Finding minimum or maximum cost path in a grid
- **Obstacle Handling**: Dealing with blocked cells that cannot be traversed
- **Direction Constraints**: When movement is restricted (e.g., only right/down)

### Comparison with Alternatives

| Approach | Use Case | Time | Space | Best For |
|----------|----------|------|-------|----------|
| **Matrix Path DP** | Grid problems with optimal substructure | O(m×n) | O(m×n) or O(n) | Most grid path problems |
| **Combinatorics** | Simple grid without obstacles | O(1) | O(1) | Counting paths in empty grids |
| **BFS/DFS** | Finding any path (not optimal) | O(m×n) | O(m×n) | Shortest path in unweighted grid |
| **Dijkstra** | Weighted grid paths | O(m×n log(m×n)) | O(m×n) | Weighted shortest path |

### When to Choose Matrix Path DP vs Other Approaches

- **Choose Matrix Path DP** when:
  - You need to count all possible paths or find optimal path
  - The problem has optimal substructure
  - You need to handle obstacles
  - You're minimizing or maximizing some value along the path

- **Choose Combinatorics** when:
  - Grid has no obstacles
  - You only need to count paths (not find minimum/maximum)
  - You can use the formula: C(m+n-2, m-1)

- **Choose BFS/DFS** when:
  - You need to find any valid path (not counting or optimizing)
  - The grid is unweighted and you need shortest path
  - Simple traversal is sufficient

---

## Algorithm Explanation

### Core Concept

The fundamental insight behind Matrix Path DP is that **any path to cell (i, j) can only come from two directions**: from above (i-1, j) or from the left (i, j-1). This creates a natural recurrence relation where the solution for each cell depends on previously computed solutions.

### How It Works

#### State Definition:
- `dp[i][j]` = optimal value (count/min sum/max sum) to reach cell (i, j) from the starting position

#### State Transition:
```
For path counting (without obstacles):
  dp[i][j] = dp[i-1][j] + dp[i][j-1]

For path counting (with obstacles):
  if grid[i][j] == 1 (obstacle):
    dp[i][j] = 0
  else:
    dp[i][j] = dp[i-1][j] + dp[i][j-1]

For minimum path sum:
  dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
```

#### Base Cases:
- `dp[0][0] = 1` (or grid[0][0] for min sum)
- First row: `dp[0][j] = dp[0][j-1]` (can only come from left)
- First column: `dp[i][0] = dp[i-1][0]` (can only come from above)

### Visual Representation

For a 3×3 grid with an obstacle at (1,1):

```
Grid:                     DP Table:
[0, 0, 0]                 [1, 1, 1]
[0, 1, 0]        →        [1, 0, 1]
[0, 0, 0]                 [1, 1, 2]

Legend: 0 = empty, 1 = obstacle
```

**Step-by-step filling:**
1. Start at (0,0): dp[0][0] = 1
2. Fill first row: dp[0][1] = 1, dp[0][2] = 1
3. Fill first column: dp[1][0] = 1, dp[2][0] = 1
4. At (1,1): obstacle, so dp[1][1] = 0
5. At (1,2): dp[1][2] = dp[0][2] + dp[1][1] = 1 + 0 = 1
6. At (2,1): dp[2][1] = dp[1][1] + dp[2][0] = 0 + 1 = 1
7. At (2,2): dp[2][2] = dp[1][2] + dp[2][1] = 1 + 1 = 2 ✓

### Why It Works

The algorithm works because of two key properties:

1. **Optimal Substructure**: The optimal path to any cell depends only on optimal paths to its predecessors
2. **Overlapping Subproblems**: The same subproblems (paths to intermediate cells) are reused multiple times

This transforms an exponential problem into a polynomial one by avoiding redundant computation through memoization.

### Limitations

- **Only works for restricted movements**: Typically only allows movement in 2 directions (right/down)
- **Requires grid structure**: Not applicable for arbitrary graphs
- **Space for 2D DP**: Standard approach uses O(m×n) space (can be optimized)
- **Static obstacles**: Standard version doesn't handle dynamic/moving obstacles

---

## Practice Problems

### Problem 1: Unique Paths

**Problem:** [LeetCode 62 - Unique Paths](https://leetcode.com/problems/unique-paths/)

**Description:** A robot is located at the top-left corner of a m×n grid. The robot can only move either down or right. How many possible unique paths are there to reach bottom-right?

**How to Apply Matrix Path DP:**
- Define `dp[i][j]` = number of unique paths to reach cell (i, j)
- Base case: `dp[0][j] = 1` (first row), `dp[i][0] = 1` (first column)
- Transition: `dp[i][j] = dp[i-1][j] + dp[i][j-1]`
- For empty grid: use combinatorial formula C(m+n-2, m-1)

---

### Problem 2: Unique Paths II

**Problem:** [LeetCode 63 - Unique Paths II](https://leetcode.com/problems/unique-paths-ii/)

**Description:** Same as Unique Paths, but with obstacles (1 = blocked, 0 = empty).

**How to Apply Matrix Path DP:**
- Add obstacle check: if grid[i][j] == 1, then dp[i][j] = 0
- Handle edge cases: if start or end has obstacle, return 0
- All other logic remains the same

---

### Problem 3: Minimum Path Sum

**Problem:** [LeetCode 64 - Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/)

**Description:** Given a grid filled with non-negative numbers, find a path from top-left to bottom-right that minimizes the sum of all numbers along the path.

**How to Apply Matrix Path DP:**
- Define `dp[i][j]` = minimum sum to reach cell (i, j)
- Transition: `dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`
- Handle first row/column separately

---

### Problem 4: Triangle Minimum Path Sum

**Problem:** [LeetCode 120 - Triangle](https://leetcode.com/problems/triangle/)

**Description:** Given a triangle array, find the minimum path sum from top to bottom. Each step you may move to adjacent numbers on the row below.

**How to Apply Matrix Path DP:**
- Work from bottom-up: `dp[i][j] = triangle[i][j] + min(dp[i+1][j], dp[i+1][j+1])`
- Space-optimized: use single row, update from right to left

---

### Problem 5: Cherry Pickup

**Problem:** [LeetCode 741 - Cherry Pickup](https://leetcode.com/problems/cherry-pickup/)

**Description:** Given a grid where each cell has cherries, find the maximum cherries you can collect starting from (0,0), ending at (n-1, n-1), then returning to (0,0) moving right/down on way there and up/left on way back.

**How to Apply Matrix Path DP:**
- Use two paths simultaneously: think of two people walking at same time
- State: dp[t][i1][i2] = max cherries when both have taken t steps
- Can be optimized to 2D by noting that j = t - i

---

## Video Tutorial Links

### Fundamentals

- [Matrix Path DP - Unique Paths (Take U Forward)](https://www.youtube.com/watch?v=IlEsdxu56RQ) - Comprehensive introduction
- [Minimum Path Sum (NeetCode)](https://www.youtube.com/watch?v=TwP-dnV3fGo) - Detailed explanation
- [Dynamic Programming on Grids (WilliamFiset)](https://www.youtube.com/watch?v=Af2D8mib5Vw) - Grid DP patterns

### Advanced Topics

- [Space Optimization Techniques](https://www.youtube.com/watch?v=8GRF1QbjKJU) - Reducing space complexity
- [Cherry Pickup Problem](https://www.youtube.com/watch?v=HSFPu69kRks) - Advanced two-path DP
- [Grid DP Variations](https://www.youtube.com/watch?v=o5CG4h3h6Xc) - Multiple problem types

### Problem-Specific

- [Triangle Problem](https://www.youtube.com/watch?v=Osi3P1i9G3M) - Bottom-up approach
- [Path Sum Problems](https://www.youtube.com/watch?v=ja2fB1_3N2I) - Min/max path variations

---

## Follow-up Questions

### Q1: How do you handle 4-directional movement in Matrix Path DP?

**Answer:** For 4-directional movement (up, down, left, right), the standard approach changes because you can reach a cell from multiple directions:

- Use the same DP table but iterate through all cells
- Transition: `dp[i][j] = grid[i][j] + max(dp[i-1][j], dp[i+1][j], dp[i][j-1], dp[i][j+1])`
- Need to handle visited cells to avoid infinite loops
- Usually solved with DFS + memoization or topological ordering

---

### Q2: Can Matrix Path DP be used for graphs with cycles?

**Answer:** Matrix Path DP is specifically designed for DAGs (Directed Acyclic Graphs). For graphs with cycles:
- Use Bellman-Ford for shortest paths with negative weights
- Use DFS + memoization for counting paths
- Use Floyd-Warshall for all-pairs shortest paths
- The grid structure with restricted movement naturally creates a DAG

---

### Q3: What's the maximum grid size this approach can handle?

**Answer:** With O(m×n) time:
- **Typical limits**: ~10⁴ cells (100×100) for O(m×n) space, ~10⁶ (1000×1000) for O(n) space
- **Memory**: ~100MB → ~10⁷ integers
- **Time**: At 10⁸ operations per second, 10⁶ cells takes ~0.01 seconds
- For larger grids, consider whether you need full DP or can use combinatorial formula

---

### Q4: How do you reconstruct the actual path, not just the count/sum?

**Answer:** To reconstruct the path:
1. Store the DP table as usual
2. Starting from the end, trace back:
   - Compare neighbors (dp[i-1][j] vs dp[i][j-1])
   - Choose the direction that contributed to current cell
   - Repeat until reaching start
3. Store parent pointers during DP computation for O(path_length) reconstruction

---

### Q5: When should you use combinatorics instead of DP?

**Answer:** Use combinatorics when:
- The grid has NO obstacles
- You only need to count paths (not find minimum/maximum)
- The movement is restricted to only right and down

Formula: For m×n grid, paths = C(m+n-2, m-1) = C(m+n-2, n-1)

This is O(min(m,n)) time and O(1) space vs O(m×n) for DP.

---

## Summary

Matrix Path DP is an essential technique for solving grid-based dynamic programming problems. Key takeaways:

- **Core Concept**: At any cell, you can only come from above or from the left, creating a natural recurrence
- **State Design**: Define dp[i][j] as the answer for reaching cell (i, j) from the start
- **Transition**: `dp[i][j] = grid[i][j] + f(dp[i-1][j], dp[i][j-1])` where f is min, max, or sum
- **Two Implementations**: Standard O(m×n) space and optimized O(n) space version
- **Combinatorial Shortcut**: For empty grids, use C(m+n-2, m-1) for O(1) solution

When to use:
- ✅ Grid navigation with obstacles
- ✅ Path counting with constraints
- ✅ Min/max path sum problems
- ✅ When optimal substructure exists
- ❌ When you need any path (not optimal) - use BFS instead
- ❌ When movement is not restricted to a grid

This pattern appears frequently in interviews and competitive programming, making it a fundamental skill for any programmer.

---

## Related Algorithms

- [House Robber](./house-robber.md) - 1D DP similar to grid DP
- [Knapsack 01](./knapsack-01.md) - 2D DP with similar space optimization
- [Longest Common Subsequence](./lcs.md) - 2D DP for string matching
- [Coin Change](./coin-change.md) - DP for optimization problems
