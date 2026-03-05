# DP - 2D Array (Unique Paths on Grid)

## Problem Description

The Unique Paths on Grid pattern solves path counting and optimization problems on 2D grids. This pattern is essential for robot navigation, maze solving, and grid-based dynamic programming problems with movement constraints.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(m × n) for most variations |
| Space Complexity | O(m × n), optimizable to O(min(m, n)) |
| Input | 2D grid with possible obstacles or weights |
| Output | Number of paths, minimum/maximum path sum, or path itself |
| Approach | Build solution from top-left to bottom-right |

### When to Use

- **Robot Navigation**: Count paths from start to end
- **Maze Problems**: Paths with or without obstacles
- **Path Sum Optimization**: Minimum/maximum sum path
- **Grid Traversal**: Problems with movement constraints (right/down)
- **2D Dynamic Programming**: Any grid-based optimization

## Intuition

The key insight is that the number of ways to reach any cell depends only on the cells from which we can directly arrive (typically top and left).

The "aha!" moments:

1. **Top-down dependency**: dp[i][j] depends only on dp[i-1][j] and dp[i][j-1]
2. **Base cases**: First row and column have only one way to reach (if no obstacles)
3. **Obstacle handling**: Mark obstacle cells as 0 (unreachable)
4. **Modular arithmetic**: Use mod for large path counts
5. **Space optimization**: Only need previous row, not entire grid

## Solution Approaches

### Approach 1: Unique Paths (Combinatorics/DP) ✅ Recommended

Count unique paths from top-left to bottom-right (moving only right or down).

#### Algorithm

1. Initialize dp grid of size m × n with 1s
2. First row and column remain 1 (only one way to reach)
3. For each cell (i, j):
   - dp[i][j] = dp[i-1][j] + dp[i][j-1]
4. Return dp[m-1][n-1]

#### Implementation

````carousel
```python
def unique_paths(m, n):
    """
    Count unique paths in m x n grid (right and down moves only).
    LeetCode 62 - Unique Paths
    
    Time: O(m * n), Space: O(m * n)
    """
    # dp[i][j] = number of ways to reach cell (i, j)
    dp = [[1] * n for _ in range(m)]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    
    return dp[m - 1][n - 1]

# Space-optimized version
def unique_paths_optimized(m, n):
    """O(n) space version."""
    # Use 1D array, only need previous row
    dp = [1] * n
    
    for i in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j - 1]
    
    return dp[n - 1]

# Combinatorics approach: C((m-1)+(n-1), m-1)
def unique_paths_combinatorics(m, n):
    """
    Math approach: (m+n-2) choose (m-1)
    Time: O(min(m, n)), Space: O(1)
    """
    from math import comb
    return comb(m + n - 2, min(m - 1, n - 1))
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<vector<int>> dp(m, vector<int>(n, 1));
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
        
        return dp[m - 1][n - 1];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int uniquePaths(int m, int n) {
        int[][] dp = new int[m][n];
        
        // Initialize first row and column
        for (int i = 0; i < m; i++) dp[i][0] = 1;
        for (int j = 0; j < n; j++) dp[0][j] = 1;
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
        
        return dp[m - 1][n - 1];
    }
}
```
<!-- slide -->
```javascript
function uniquePaths(m, n) {
    const dp = Array(m).fill(null).map(() => Array(n).fill(1));
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    
    return dp[m - 1][n - 1];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(m × n) or O(min(m, n)) for math approach |
| Space | O(m × n) or O(n) for optimized |

### Approach 2: Unique Paths with Obstacles

Handle grids with obstacles that cannot be traversed.

#### Implementation

````carousel
```python
def unique_paths_with_obstacles(obstacle_grid):
    """
    Count paths with obstacles.
    LeetCode 63 - Unique Paths II
    
    Time: O(m * n), Space: O(m * n)
    """
    if not obstacle_grid or not obstacle_grid[0]:
        return 0
    
    m, n = len(obstacle_grid), len(obstacle_grid[0])
    
    # If start or end is blocked
    if obstacle_grid[0][0] == 1 or obstacle_grid[m - 1][n - 1] == 1:
        return 0
    
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = 1
    
    # Initialize first column
    for i in range(1, m):
        dp[i][0] = dp[i - 1][0] if obstacle_grid[i][0] == 0 else 0
    
    # Initialize first row
    for j in range(1, n):
        dp[0][j] = dp[0][j - 1] if obstacle_grid[0][j] == 0 else 0
    
    # Fill rest
    for i in range(1, m):
        for j in range(1, n):
            if obstacle_grid[i][j] == 0:
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    
    return dp[m - 1][n - 1]

# In-place O(1) extra space
def unique_paths_obstacles_inplace(obstacle_grid):
    """Modify input grid to store DP values."""
    if not obstacle_grid or obstacle_grid[0][0] == 1:
        return 0
    
    m, n = len(obstacle_grid), len(obstacle_grid[0])
    obstacle_grid[0][0] = 1
    
    # First column
    for i in range(1, m):
        obstacle_grid[i][0] = int(obstacle_grid[i][0] == 0 and obstacle_grid[i - 1][0] == 1)
    
    # First row
    for j in range(1, n):
        obstacle_grid[0][j] = int(obstacle_grid[0][j] == 0 and obstacle_grid[0][j - 1] == 1)
    
    # Fill rest
    for i in range(1, m):
        for j in range(1, n):
            if obstacle_grid[i][j] == 0:
                obstacle_grid[i][j] = obstacle_grid[i - 1][j] + obstacle_grid[i][j - 1]
            else:
                obstacle_grid[i][j] = 0
    
    return obstacle_grid[m - 1][n - 1]
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
        int m = obstacleGrid.size();
        int n = obstacleGrid[0].size();
        
        if (obstacleGrid[0][0] == 1 || obstacleGrid[m - 1][n - 1] == 1)
            return 0;
        
        vector<vector<long>> dp(m, vector<long>(n, 0));
        dp[0][0] = 1;
        
        for (int i = 1; i < m; i++)
            dp[i][0] = (obstacleGrid[i][0] == 0) ? dp[i - 1][0] : 0;
        
        for (int j = 1; j < n; j++)
            dp[0][j] = (obstacleGrid[0][j] == 0) ? dp[0][j - 1] : 0;
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (obstacleGrid[i][j] == 0)
                    dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
        
        return dp[m - 1][n - 1];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        int m = obstacleGrid.length;
        int n = obstacleGrid[0].length;
        
        if (obstacleGrid[0][0] == 1 || obstacleGrid[m - 1][n - 1] == 1)
            return 0;
        
        int[][] dp = new int[m][n];
        dp[0][0] = 1;
        
        for (int i = 1; i < m; i++)
            dp[i][0] = (obstacleGrid[i][0] == 0) ? dp[i - 1][0] : 0;
        
        for (int j = 1; j < n; j++)
            dp[0][j] = (obstacleGrid[0][j] == 0) ? dp[0][j - 1] : 0;
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (obstacleGrid[i][j] == 0)
                    dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
        
        return dp[m - 1][n - 1];
    }
}
```
<!-- slide -->
```javascript
function uniquePathsWithObstacles(obstacleGrid) {
    const m = obstacleGrid.length;
    const n = obstacleGrid[0].length;
    
    if (obstacleGrid[0][0] === 1 || obstacleGrid[m - 1][n - 1] === 1)
        return 0;
    
    const dp = Array(m).fill(null).map(() => Array(n).fill(0));
    dp[0][0] = 1;
    
    for (let i = 1; i < m; i++)
        dp[i][0] = (obstacleGrid[i][0] === 0) ? dp[i - 1][0] : 0;
    
    for (let j = 1; j < n; j++)
        dp[0][j] = (obstacleGrid[0][j] === 0) ? dp[0][j - 1] : 0;
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (obstacleGrid[i][j] === 0)
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    
    return dp[m - 1][n - 1];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(m × n) |
| Space | O(m × n) or O(1) in-place |

### Approach 3: Minimum Path Sum

Find path with minimum sum (grid cells have weights).

#### Implementation

````carousel
```python
def min_path_sum(grid):
    """
    Find path with minimum sum from top-left to bottom-right.
    LeetCode 64 - Minimum Path Sum
    
    Time: O(m * n), Space: O(m * n)
    """
    if not grid or not grid[0]:
        return 0
    
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]
    
    # Initialize first column
    for i in range(1, m):
        dp[i][0] = dp[i - 1][0] + grid[i][0]
    
    # Initialize first row
    for j in range(1, n):
        dp[0][j] = dp[0][j - 1] + grid[0][j]
    
    # Fill rest
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j]
    
    return dp[m - 1][n - 1]

# Space-optimized
def min_path_sum_optimized(grid):
    """O(n) space version."""
    if not grid or not grid[0]:
        return 0
    
    m, n = len(grid), len(grid[0])
    dp = [0] * n
    dp[0] = grid[0][0]
    
    # Initialize first row
    for j in range(1, n):
        dp[j] = dp[j - 1] + grid[0][j]
    
    for i in range(1, m):
        dp[0] += grid[i][0]  # First column
        for j in range(1, n):
            dp[j] = min(dp[j], dp[j - 1]) + grid[i][j]
    
    return dp[n - 1]
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        vector<vector<int>> dp(m, vector<int>(n, 0));
        
        dp[0][0] = grid[0][0];
        
        for (int i = 1; i < m; i++)
            dp[i][0] = dp[i - 1][0] + grid[i][0];
        
        for (int j = 1; j < n; j++)
            dp[0][j] = dp[0][j - 1] + grid[0][j];
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
            }
        }
        
        return dp[m - 1][n - 1];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int minPathSum(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[][] dp = new int[m][n];
        
        dp[0][0] = grid[0][0];
        
        for (int i = 1; i < m; i++)
            dp[i][0] = dp[i - 1][0] + grid[i][0];
        
        for (int j = 1; j < n; j++)
            dp[0][j] = dp[0][j - 1] + grid[0][j];
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
            }
        }
        
        return dp[m - 1][n - 1];
    }
}
```
<!-- slide -->
```javascript
function minPathSum(grid) {
    const m = grid.length, n = grid[0].length;
    const dp = Array(m).fill(null).map(() => Array(n).fill(0));
    
    dp[0][0] = grid[0][0];
    
    for (let i = 1; i < m; i++)
        dp[i][0] = dp[i - 1][0] + grid[i][0];
    
    for (let j = 1; j < n; j++)
        dp[0][j] = dp[0][j - 1] + grid[0][j];
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
        }
    }
    
    return dp[m - 1][n - 1];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(m × n) |
| Space | O(m × n) or O(n) optimized |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Basic DP | O(m × n) | O(m × n) | Simple path counting |
| Space Optimized | O(m × n) | O(n) | Memory-constrained |
| Combinatorics | O(min(m, n)) | O(1) | Large grids, no obstacles |
| With Obstacles | O(m × n) | O(m × n) | Grid has blocked cells |
| Minimum Path Sum | O(m × n) | O(n) | Weighted cells |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Unique Paths](https://leetcode.com/problems/unique-paths/) | 62 | Medium | Basic path counting |
| [Unique Paths II](https://leetcode.com/problems/unique-paths-ii/) | 63 | Medium | Paths with obstacles |
| [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/) | 64 | Medium | Minimum sum path |
| [Dungeon Game](https://leetcode.com/problems/dungeon-game/) | 174 | Hard | Minimum initial health |
| [Cherry Pickup](https://leetcode.com/problems/cherry-pickup/) | 741 | Hard | Collect maximum cherries |
| [Out of Boundary Paths](https://leetcode.com/problems/out-of-boundary-paths/) | 576 | Medium | Paths going out of bounds |
| [Knight Probability in Chessboard](https://leetcode.com/problems/knight-probability-in-chessboard/) | 688 | Medium | Random walk probability |

## Video Tutorial Links

1. **[NeetCode - Unique Paths](https://www.youtube.com/watch?v=IlEsdxuD4lY)** - Grid DP explanation
2. **[Back To Back SWE - Grid Paths](https://www.youtube.com/watch?v=obBUxQhbxRs)** - Visual walkthrough
3. **[Kevin Naughton Jr. - Unique Paths](https://www.youtube.com/watch?v=6qMF4o5W3IQ)** - Step-by-step solution
4. **[Abdul Bari - Matrix Chain Multiplication](https://www.youtube.com/watch?v=vgLJZMUfnsU)** - Related DP concepts
5. **[Techdose - Grid DP Patterns](https://www.youtube.com/watch?v=6TKyJKS7ttE)** - All grid patterns

## Summary

### Key Takeaways

- **Top-left dependency**: dp[i][j] depends only on dp[i-1][j] and dp[i][j-1]
- **Initialize boundaries**: First row and column need special handling
- **Obstacles as zeros**: Mark unreachable cells with 0
- **Combinatorics shortcut**: C(m+n-2, m-1) for simple unique paths
- **Space optimization**: Only need previous row for most problems
- **Modular arithmetic**: Use mod when counts get large

### Common Pitfalls

- **Forgetting base cases**: Not initializing first row/column
- **Wrong initialization order**: Process row before column or vice versa
- **Off-by-one errors**: Confusing 0-indexed vs 1-indexed DP
- **Integer overflow**: Path counts grow exponentially; use long or mod
- **Not handling obstacles**: Continue adding from blocked cells
- **Confusing min/max**: Wrong optimization direction

### Follow-up Questions

1. **How would you return the actual path?**
   - Backtrack from destination, choosing the direction that led to optimal value

2. **What if you can also move diagonally?**
   - Add dp[i-1][j-1] to the recurrence

3. **Can you solve this with BFS/DFS?**
   - Yes, but DP is more efficient for counting; BFS/DFS for path reconstruction

4. **What if movement costs vary by direction?**
   - Include direction-specific costs in the min/max calculation

## Pattern Source

[Unique Paths on Grid Pattern](patterns/dp-2d-array-unique-paths-on-grid.md)
