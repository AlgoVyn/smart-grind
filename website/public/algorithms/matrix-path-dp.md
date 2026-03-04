# Matrix Path Dynamic Programming

## Category
Dynamic Programming

## Description

Matrix Path DP is a classic dynamic programming technique used to solve problems involving **grid navigation** where you need to find optimal paths or count unique routes from one cell to another. The key insight is that at any cell, you can only reach it from a limited set of previous positions (typically from above or from the left), making it ideal for DP formulation.

This pattern is fundamental in competitive programming and technical interviews because it demonstrates how to convert a 2D grid problem into a systematic dynamic programming solution with clear state transitions.

---

## When to Use

Use the Matrix Path DP algorithm when you need to solve problems involving:

- **Grid Navigation**: Finding paths in a 2D matrix with or without obstacles
- **Path Counting**: Counting unique ways to reach from start to destination
- **Min/Max Path Sum**: Finding minimum or maximum cost path in a grid
- **Obstacle Handling**: Dealing with blocked cells that cannot be traversed
- **Direction Constraints**: When movement is restricted (e.g., only right/down)

### Comparison with Alternatives

| Approach | Use Case | Time Complexity | Space Complexity | Best For |
|----------|----------|-----------------|------------------|----------|
| **Matrix Path DP** | Grid problems with optimal substructure | O(m × n) | O(m × n) or O(n) | Most grid path problems |
| **Combinatorics** | Simple grid without obstacles | O(1) | O(1) | Counting paths in empty grids |
| **BFS/DFS** | Finding any path (not optimal) | O(m × n) | O(m × n) | Shortest path in unweighted grid |
| **Dijkstra** | Weighted grid paths | O(m × n log(m×n)) | O(m × n) | Weighted shortest path |

### When to Choose Matrix Path DP vs Other Approaches

- **Choose Matrix Path DP** when:
  - You need to count all possible paths or find optimal path
  - The problem has optimal substructure (optimal path to cell depends on optimal paths to previous cells)
  - You need to handle obstacles
  - You're minimizing or maximizing some value along the path

- **Choose Combinatorics** when:
  - Grid has no obstacles
  - You only need to count paths (not find minimum/maximum)
  - You can use the formula: C(m+n-2, m-1) or C(m+n-2, n-1)

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

### Why This Works

The algorithm works because of two key properties:

1. **Optimal Substructure**: The optimal path to any cell depends only on optimal paths to its predecessors
2. **Overlapping Subproblems**: The same subproblems (paths to intermediate cells) are reused multiple times

This transforms an exponential problem into a polynomial one by avoiding redundant computation through memoization.

### Limitations

- **Only works for restricted movements**: Typically only allows movement in 2 directions (right/down or all 4 directions)
- **Requires grid structure**: Not applicable for arbitrary graphs
- **Space for 2D DP**: Standard approach uses O(m×n) space (though can be optimized)

---

## Algorithm Steps

### Step-by-Step Approach

1. **Analyze the Problem**
   - Identify grid dimensions (m rows, n columns)
   - Determine movement directions allowed (right/down, or all 4 directions)
   - Check for obstacles and their representation
   - Clarify the objective: count paths, find min/max sum, or find path itself

2. **Define the DP State**
   - Create a 2D array `dp[m][n]` to store the answer for each cell
   - Determine what each cell represents: count, minimum sum, or maximum sum

3. **Initialize Base Cases**
   - Set `dp[0][0]`: 1 if no obstacle, 0 if obstacle
   - Fill first row: each cell can only be reached from the left
   - Fill first column: each cell can only be reached from above

4. **Fill the DP Table**
   - Iterate through rows and columns (skip base row and column)
   - For each cell:
     - If obstacle: dp[i][j] = 0
     - Otherwise: dp[i][j] = dp[i-1][j] + dp[i][j-1] (for counting)
     - Or: dp[i][j] = grid[i][j] + min/max(dp[i-1][j], dp[i][j-1]) (for sum)

5. **Return the Answer**
   - Return dp[m-1][n-1] (the value at bottom-right corner)

### Space Optimization (Optional)

If space is a concern, you can optimize from O(m×n) to O(n):
- Use a 1D array instead of 2D table
- For each row, update the array in place
- The current cell depends on: itself (from previous row) and left neighbor (from current row)

---

## Implementation

### Template Code (Path Counting with Obstacles)

````carousel
```python
from typing import List


class MatrixPathDP:
    """
    Matrix Path Dynamic Programming for path counting and min/max path sum.
    
    Time Complexities:
        - Standard DP: O(m * n)
        - Space Optimized: O(m * n) time, O(n) space
    
    Space Complexity: O(m * n) for standard, O(n) for optimized
    """
    
    @staticmethod
    def unique_paths_with_obstacles(grid: List[List[int]]) -> int:
        """
        Count unique paths from top-left to bottom-right with obstacles.
        
        Args:
            grid: 2D list where 0 = empty cell, 1 = obstacle
            
        Returns:
            Number of unique paths from (0,0) to (m-1, n-1)
            
        Time: O(m * n)
        Space: O(m * n)
        """
        if not grid or not grid[0]:
            return 0
        
        m, n = len(grid), len(grid[0])
        
        # Edge case: start or end is blocked
        if grid[0][0] == 1 or grid[m-1][n-1] == 1:
            return 0
        
        # Create DP table
        dp = [[0] * n for _ in range(m)]
        
        # Base case: starting cell
        dp[0][0] = 1
        
        # Fill first row (can only come from left)
        for j in range(1, n):
            if grid[0][j] == 0:
                dp[0][j] = dp[0][j-1]
        
        # Fill first column (can only come from above)
        for i in range(1, m):
            if grid[i][0] == 0:
                dp[i][0] = dp[i-1][0]
        
        # Fill rest of the table
        for i in range(1, m):
            for j in range(1, n):
                if grid[i][j] == 0:
                    dp[i][j] = dp[i-1][j] + dp[i][j-1]
        
        return dp[m-1][n-1]
    
    @staticmethod
    def unique_paths_with_obstacles_optimized(grid: List[List[int]]) -> int:
        """
        Space-optimized version using O(n) space.
        
        Uses a 1D array where dp[j] represents the number of paths to cell (i, j).
        
        Args:
            grid: 2D list where 0 = empty cell, 1 = obstacle
            
        Returns:
            Number of unique paths from (0,0) to (m-1, n-1)
            
        Time: O(m * n)
        Space: O(n)
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
                    # Obstacle: no paths through this cell
                    dp[j] = 0
                else:
                    if j > 0:
                        # Add paths from left cell
                        dp[j] += dp[j-1]
        
        return dp[n-1]
    
    @staticmethod
    def min_path_sum(grid: List[List[int]]) -> int:
        """
        Find minimum path sum from top-left to bottom-right.
        
        Args:
            grid: 2D list of non-negative integers representing costs
            
        Returns:
            Minimum sum path from (0,0) to (m-1, n-1)
            
        Time: O(m * n)
        Space: O(m * n)
        """
        if not grid or not grid[0]:
            return 0
        
        m, n = len(grid), len(grid[0])
        dp = [[0] * n for _ in range(m)]
        
        # Base case: starting cell
        dp[0][0] = grid[0][0]
        
        # Fill first row
        for j in range(1, n):
            dp[0][j] = dp[0][j-1] + grid[0][j]
        
        # Fill first column
        for i in range(1, m):
            dp[i][0] = dp[i-1][0] + grid[i][0]
        
        # Fill rest of the table
        for i in range(1, m):
            for j in range(1, n):
                dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
        
        return dp[m-1][n-1]
    
    @staticmethod
    def min_path_sum_optimized(grid: List[List[int]]) -> int:
        """
        Space-optimized minimum path sum using O(n) space.
        
        Args:
            grid: 2D list of non-negative integers
            
        Returns:
            Minimum sum path
            
        Time: O(m * n)
        Space: O(n)
        """
        if not grid or not grid[0]:
            return 0
        
        m, n = len(grid), len(grid[0])
        dp = [float('inf')] * n
        dp[0] = 0
        
        for i in range(m):
            for j in range(n):
                if grid[i][j] == 1:  # Obstacle
                    dp[j] = float('inf')
                else:
                    if j > 0:
                        dp[j] = min(dp[j], dp[j-1]) + grid[i][j]
                    else:
                        dp[j] = dp[j] + grid[i][j]
        
        return dp[n-1]
    
    @staticmethod
    def unique_paths(m: int, n: int) -> int:
        """
        Count unique paths in m x n grid WITHOUT obstacles.
        
        Uses combinatorics: C(m+n-2, m-1)
        
        Args:
            m: Number of rows
            n: Number of columns
            
        Returns:
            Number of unique paths
            
        Time: O(min(m, n))
        Space: O(1)
        """
        from math import comb
        return comb(m + n - 2, min(m - 1, n - 1))


# Example usage and demonstration
if __name__ == "__main__":
    # Example 1: Grid with obstacles
    grid1 = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
    ]
    print(f"Grid with obstacle: {MatrixPathDP.unique_paths_with_obstacles(grid1)}")
    # Output: 2
    
    # Example 2: Optimized version
    print(f"Optimized: {MatrixPathDP.unique_paths_with_obstacles_optimized(grid1)}")
    # Output: 2
    
    # Example 3: Minimum path sum
    grid2 = [
        [1, 3, 1],
        [1, 5, 1],
        [4, 2, 1]
    ]
    print(f"Min path sum: {MatrixPathDP.min_path_sum(grid2)}")
    # Output: 7 (path: 1→3→1→1→1)
    
    # Example 4: No obstacles
    print(f"Unique paths (3x7): {MatrixPathDP.unique_paths(3, 7)}")
    # Output: 28
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

/**
 * Matrix Path Dynamic Programming for path counting and min/max path sum.
 * 
 * Time Complexities:
 *     - Standard DP: O(m * n)
 *     - Space Optimized: O(m * n) time, O(n) space
 * 
 * Space Complexity: O(m * n) for standard, O(n) for optimized
 */
class MatrixPathDP {
public:
    /**
     * Count unique paths from top-left to bottom-right with obstacles.
     * 
     * Time: O(m * n)
     * Space: O(m * n)
     */
    static int uniquePathsWithObstacles(const vector<vector<int>>& grid) {
        if (grid.empty() || grid[0].empty()) {
            return 0;
        }
        
        int m = grid.size();
        int n = grid[0].size();
        
        // Edge case: start or end is blocked
        if (grid[0][0] == 1 || grid[m-1][n-1] == 1) {
            return 0;
        }
        
        // Create DP table
        vector<vector<int>> dp(m, vector<int>(n, 0));
        
        // Base case: starting cell
        dp[0][0] = 1;
        
        // Fill first row
        for (int j = 1; j < n; j++) {
            if (grid[0][j] == 0) {
                dp[0][j] = dp[0][j-1];
            }
        }
        
        // Fill first column
        for (int i = 1; i < m; i++) {
            if (grid[i][0] == 0) {
                dp[i][0] = dp[i-1][0];
            }
        }
        
        // Fill rest of the table
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (grid[i][j] == 0) {
                    dp[i][j] = dp[i-1][j] + dp[i][j-1];
                }
            }
        }
        
        return dp[m-1][n-1];
    }
    
    /**
     * Space-optimized version using O(n) space.
     * 
     * Time: O(m * n)
     * Space: O(n)
     */
    static int uniquePathsWithObstaclesOptimized(const vector<vector<int>>& grid) {
        if (grid.empty() || grid[0].empty()) {
            return 0;
        }
        
        int m = grid.size();
        int n = grid[0].size();
        
        if (grid[0][0] == 1 || grid[m-1][n-1] == 1) {
            return 0;
        }
        
        vector<int> dp(n, 0);
        dp[0] = 1;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    dp[j] = 0;  // Obstacle: no paths through here
                } else {
                    if (j > 0) {
                        dp[j] += dp[j-1];  // Add paths from left
                    }
                }
            }
        }
        
        return dp[n-1];
    }
    
    /**
     * Find minimum path sum from top-left to bottom-right.
     * 
     * Time: O(m * n)
     * Space: O(m * n)
     */
    static int minPathSum(const vector<vector<int>>& grid) {
        if (grid.empty() || grid[0].empty()) {
            return 0;
        }
        
        int m = grid.size();
        int n = grid[0].size();
        vector<vector<int>> dp(m, vector<int>(n, 0));
        
        // Base case
        dp[0][0] = grid[0][0];
        
        // Fill first row
        for (int j = 1; j < n; j++) {
            dp[0][j] = dp[0][j-1] + grid[0][j];
        }
        
        // Fill first column
        for (int i = 1; i < m; i++) {
            dp[i][0] = dp[i-1][0] + grid[i][0];
        }
        
        // Fill rest
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
            }
        }
        
        return dp[m-1][n-1];
    }
    
    /**
     * Space-optimized minimum path sum using O(n) space.
     * 
     * Time: O(m * n)
     * Space: O(n)
     */
    static int minPathSumOptimized(const vector<vector<int>>& grid) {
        if (grid.empty() || grid[0].empty()) {
            return 0;
        }
        
        int m = grid.size();
        int n = grid[0].size();
        vector<int> dp(n, INT_MAX);
        dp[0] = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (i == 0 && j == 0) {
                    dp[j] = grid[i][j];
                } else if (grid[i][j] == 1) {  // Obstacle
                    dp[j] = INT_MAX;
                } else {
                    int from_top = (i > 0) ? dp[j] : INT_MAX;
                    int from_left = (j > 0) ? dp[j-1] : INT_MAX;
                    dp[j] = min(from_top, from_left) + grid[i][j];
                }
            }
        }
        
        return dp[n-1];
    }
    
    /**
     * Count unique paths in m x n grid WITHOUT obstacles.
     * Uses combinatorics: C(m+n-2, m-1)
     * 
     * Time: O(min(m, n))
     * Space: O(1)
     */
    static long long uniquePaths(int m, int n) {
        // Calculate combination: C(m+n-2, m-1)
        long long result = 1;
        int k = min(m - 1, n - 1);
        
        for (int i = 0; i < k; i++) {
            result = result * (m + n - 2 - i) / (i + 1);
        }
        
        return result;
    }
};


int main() {
    // Example 1: Grid with obstacles
    vector<vector<int>> grid1 = {
        {0, 0, 0},
        {0, 1, 0},
        {0, 0, 0}
    };
    cout << "Grid with obstacle: " << MatrixPathDP::uniquePathsWithObstacles(grid1) << endl;
    // Output: 2
    
    // Example 2: Optimized version
    cout << "Optimized: " << MatrixPathDP::uniquePathsWithObstaclesOptimized(grid1) << endl;
    // Output: 2
    
    // Example 3: Minimum path sum
    vector<vector<int>> grid2 = {
        {1, 3, 1},
        {1, 5, 1},
        {4, 2, 1}
    };
    cout << "Min path sum: " << MatrixPathDP::minPathSum(grid2) << endl;
    // Output: 7
    
    // Example 4: No obstacles
    cout << "Unique paths (3x7): " << MatrixPathDP::uniquePaths(3, 7) << endl;
    // Output: 28
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.Arrays;

/**
 * Matrix Path Dynamic Programming for path counting and min/max path sum.
 * 
 * Time Complexities:
 *     - Standard DP: O(m * n)
 *     - Space Optimized: O(m * n) time, O(n) space
 * 
 * Space Complexity: O(m * n) for standard, O(n) for optimized
 */
public class MatrixPathDP {
    
    /**
     * Count unique paths from top-left to bottom-right with obstacles.
     * 
     * Time: O(m * n)
     * Space: O(m * n)
     */
    public static int uniquePathsWithObstacles(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }
        
        int m = grid.length;
        int n = grid[0].length;
        
        // Edge case: start or end is blocked
        if (grid[0][0] == 1 || grid[m-1][n-1] == 1) {
            return 0;
        }
        
        // Create DP table
        int[][] dp = new int[m][n];
        
        // Base case: starting cell
        dp[0][0] = 1;
        
        // Fill first row
        for (int j = 1; j < n; j++) {
            if (grid[0][j] == 0) {
                dp[0][j] = dp[0][j-1];
            }
        }
        
        // Fill first column
        for (int i = 1; i < m; i++) {
            if (grid[i][0] == 0) {
                dp[i][0] = dp[i-1][0];
            }
        }
        
        // Fill rest of the table
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (grid[i][j] == 0) {
                    dp[i][j] = dp[i-1][j] + dp[i][j-1];
                }
            }
        }
        
        return dp[m-1][n-1];
    }
    
    /**
     * Space-optimized version using O(n) space.
     * 
     * Time: O(m * n)
     * Space: O(n)
     */
    public static int uniquePathsWithObstaclesOptimized(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }
        
        int m = grid.length;
        int n = grid[0].length;
        
        if (grid[0][0] == 1 || grid[m-1][n-1] == 1) {
            return 0;
        }
        
        int[] dp = new int[n];
        dp[0] = 1;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    dp[j] = 0;  // Obstacle
                } else {
                    if (j > 0) {
                        dp[j] += dp[j-1];  // Add from left
                    }
                }
            }
        }
        
        return dp[n-1];
    }
    
    /**
     * Find minimum path sum from top-left to bottom-right.
     * 
     * Time: O(m * n)
     * Space: O(m * n)
     */
    public static int minPathSum(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }
        
        int m = grid.length;
        int n = grid[0].length;
        int[][] dp = new int[m][n];
        
        // Base case
        dp[0][0] = grid[0][0];
        
        // Fill first row
        for (int j = 1; j < n; j++) {
            dp[0][j] = dp[0][j-1] + grid[0][j];
        }
        
        // Fill first column
        for (int i = 1; i < m; i++) {
            dp[i][0] = dp[i-1][0] + grid[i][0];
        }
        
        // Fill rest
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
            }
        }
        
        return dp[m-1][n-1];
    }
    
    /**
     * Space-optimized minimum path sum using O(n) space.
     * 
     * Time: O(m * n)
     * Space: O(n)
     */
    public static int minPathSumOptimized(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }
        
        int m = grid.length;
        int n = grid[0].length;
        int[] dp = new int[n];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {  // Obstacle
                    dp[j] = Integer.MAX_VALUE;
                } else {
                    int fromTop = (i > 0) ? dp[j] : Integer.MAX_VALUE;
                    int fromLeft = (j > 0) ? dp[j-1] : Integer.MAX_VALUE;
                    if (i == 0 && j == 0) {
                        dp[j] = grid[i][j];
                    } else {
                        dp[j] = Math.min(fromTop, fromLeft) + grid[i][j];
                    }
                }
            }
        }
        
        return dp[n-1];
    }
    
    /**
     * Count unique paths in m x n grid WITHOUT obstacles.
     * Uses combinatorics: C(m+n-2, m-1)
     * 
     * Time: O(min(m, n))
     * Space: O(1)
     */
    public static long uniquePaths(int m, int n) {
        // Calculate combination: C(m+n-2, m-1)
        long result = 1;
        int k = Math.min(m - 1, n - 1);
        
        for (int i = 0; i < k; i++) {
            result = result * (m + n - 2 - i) / (i + 1);
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        // Example 1: Grid with obstacles
        int[][] grid1 = {
            {0, 0, 0},
            {0, 1, 0},
            {0, 0, 0}
        };
        System.out.println("Grid with obstacle: " + uniquePathsWithObstacles(grid1));
        // Output: 2
        
        // Example 2: Optimized version
        System.out.println("Optimized: " + uniquePathsWithObstaclesOptimized(grid1));
        // Output: 2
        
        // Example 3: Minimum path sum
        int[][] grid2 = {
            {1, 3, 1},
            {1, 5, 1},
            {4, 2, 1}
        };
        System.out.println("Min path sum: " + minPathSum(grid2));
        // Output: 7
        
        // Example 4: No obstacles
        System.out.println("Unique paths (3x7): " + uniquePaths(3, 7));
        // Output: 28
    }
}
```

<!-- slide -->
```javascript
/**
 * Matrix Path Dynamic Programming for path counting and min/max path sum.
 * 
 * Time Complexities:
 *     - Standard DP: O(m * n)
 *     - Space Optimized: O(m * n) time, O(n) space
 * 
 * Space Complexity: O(m * n) for standard, O(n) for optimized
 */
class MatrixPathDP {
    /**
     * Count unique paths from top-left to bottom-right with obstacles.
     * 
     * @param {number[][]} grid - 2D array where 0 = empty, 1 = obstacle
     * @returns {number} Number of unique paths
     * 
     * Time: O(m * n)
     * Space: O(m * n)
     */
    static uniquePathsWithObstacles(grid) {
        if (!grid || grid.length === 0 || grid[0].length === 0) {
            return 0;
        }
        
        const m = grid.length;
        const n = grid[0].length;
        
        // Edge case: start or end is blocked
        if (grid[0][0] === 1 || grid[m-1][n-1] === 1) {
            return 0;
        }
        
        // Create DP table
        const dp = Array.from({ length: m }, () => Array(n).fill(0));
        
        // Base case: starting cell
        dp[0][0] = 1;
        
        // Fill first row
        for (let j = 1; j < n; j++) {
            if (grid[0][j] === 0) {
                dp[0][j] = dp[0][j-1];
            }
        }
        
        // Fill first column
        for (let i = 1; i < m; i++) {
            if (grid[i][0] === 0) {
                dp[i][0] = dp[i-1][0];
            }
        }
        
        // Fill rest of the table
        for (let i = 1; i < m; i++) {
            for (let j = 1; j < n; j++) {
                if (grid[i][j] === 0) {
                    dp[i][j] = dp[i-1][j] + dp[i][j-1];
                }
            }
        }
        
        return dp[m-1][n-1];
    }
    
    /**
     * Space-optimized version using O(n) space.
     * 
     * @param {number[][]} grid - 2D array where 0 = empty, 1 = obstacle
     * @returns {number} Number of unique paths
     * 
     * Time: O(m * n)
     * Space: O(n)
     */
    static uniquePathsWithObstaclesOptimized(grid) {
        if (!grid || grid.length === 0 || grid[0].length === 0) {
            return 0;
        }
        
        const m = grid.length;
        const n = grid[0].length;
        
        if (grid[0][0] === 1 || grid[m-1][n-1] === 1) {
            return 0;
        }
        
        const dp = new Array(n).fill(0);
        dp[0] = 1;
        
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (grid[i][j] === 1) {
                    dp[j] = 0;  // Obstacle
                } else {
                    if (j > 0) {
                        dp[j] += dp[j-1];  // Add from left
                    }
                }
            }
        }
        
        return dp[n-1];
    }
    
    /**
     * Find minimum path sum from top-left to bottom-right.
     * 
     * @param {number[][]} grid - 2D array of costs
     * @returns {number} Minimum sum path
     * 
     * Time: O(m * n)
     * Space: O(m * n)
     */
    static minPathSum(grid) {
        if (!grid || grid.length === 0 || grid[0].length === 0) {
            return 0;
        }
        
        const m = grid.length;
        const n = grid[0].length;
        const dp = Array.from({ length: m }, () => Array(n).fill(0));
        
        // Base case
        dp[0][0] = grid[0][0];
        
        // Fill first row
        for (let j = 1; j < n; j++) {
            dp[0][j] = dp[0][j-1] + grid[0][j];
        }
        
        // Fill first column
        for (let i = 1; i < m; i++) {
            dp[i][0] = dp[i-1][0] + grid[i][0];
        }
        
        // Fill rest
        for (let i = 1; i < m; i++) {
            for (let j = 1; j < n; j++) {
                dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
            }
        }
        
        return dp[m-1][n-1];
    }
    
    /**
     * Space-optimized minimum path sum using O(n) space.
     * 
     * @param {number[][]} grid - 2D array of costs
     * @returns {number} Minimum sum path
     * 
     * Time: O(m * n)
     * Space: O(n)
     */
    static minPathSumOptimized(grid) {
        if (!grid || grid.length === 0 || grid[0].length === 0) {
            return 0;
        }
        
        const m = grid.length;
        const n = grid[0].length;
        const dp = new Array(n).fill(Infinity);
        dp[0] = 0;
        
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (grid[i][j] === 1) {  // Obstacle
                    dp[j] = Infinity;
                } else {
                    const fromTop = i > 0 ? dp[j] : Infinity;
                    const fromLeft = j > 0 ? dp[j-1] : Infinity;
                    if (i === 0 && j === 0) {
                        dp[j] = grid[i][j];
                    } else {
                        dp[j] = Math.min(fromTop, fromLeft) + grid[i][j];
                    }
                }
            }
        }
        
        return dp[n-1];
    }
    
    /**
     * Count unique paths in m x n grid WITHOUT obstacles.
     * Uses combinatorics: C(m+n-2, m-1)
     * 
     * @param {number} m - Number of rows
     * @param {number} n - Number of columns
     * @returns {number} Number of unique paths
     * 
     * Time: O(min(m, n))
     * Space: O(1)
     */
    static uniquePaths(m, n) {
        // Calculate combination: C(m+n-2, m-1)
        let result = 1;
        const k = Math.min(m - 1, n - 1);
        
        for (let i = 0; i < k; i++) {
            result = result * (m + n - 2 - i) / (i + 1);
        }
        
        return Math.floor(result);
    }
}


// Example usage and demonstration
// Example 1: Grid with obstacles
const grid1 = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
];
console.log(`Grid with obstacle: ${MatrixPathDP.uniquePathsWithObstacles(grid1)}`);
// Output: 2

// Example 2: Optimized version
console.log(`Optimized: ${MatrixPathDP.uniquePathsWithObstaclesOptimized(grid1)}`);
// Output: 2

// Example 3: Minimum path sum
const grid2 = [
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1]
];
console.log(`Min path sum: ${MatrixPathDP.minPathSum(grid2)}`);
// Output: 7

// Example 4: No obstacles
console.log(`Unique paths (3x7): ${MatrixPathDP.uniquePaths(3, 7)}`);
// Output: 28
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|------------|----------------|-------------|
| **Standard DP** | O(m × n) | Fill each cell once |
| **Space Optimized** | O(m × n) | Same iteration, but single row |
| **Combinatorial** | O(min(m, n)) | Computing binomial coefficient |
| **Building DP Table** | O(m × n) | Iterating through all cells |
| **Query Answer** | O(1) | Just return dp[m-1][n-1] |

### Detailed Breakdown

- **Building the DP table**: For each of the m×n cells, we perform O(1) work (addition and comparison)
  - Total: O(m × n)

- **Space optimization**: We use a single row but still iterate through all cells
  - Time: O(m × n), Space: O(n)

- **Combinatorial approach**: When there are no obstacles, we can compute directly using the formula C(m+n-2, m-1)
  - Time: O(min(m, n)) using the multiplicative formula

---

## Space Complexity Analysis

| Implementation | Space Complexity | Description |
|----------------|------------------|-------------|
| **2D DP Table** | O(m × n) | Full DP table |
| **1D Optimized** | O(n) | Single row |
| **In-place (if allowed)** | O(1) | Modify input grid |

### Space Optimization Techniques

1. **Row-by-row DP**: Use only one row array that gets updated as we iterate
2. **In-place modification**: If allowed to modify the input, use the grid itself as DP table
3. **Two-row technique**: Keep only two rows if you need to reference previous row values explicitly

---

## Common Variations

### 1. Maximum Path Sum

Find the maximum sum path from top-left to bottom-right (can move in all 4 directions):

````carousel
```python
def max_path_sum(grid):
    """Find maximum path sum in grid (4-directional movement)."""
    if not grid:
        return 0
    
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]
    
    # First row
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] + grid[0][j]
    
    # First column
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] + grid[i][0]
    
    # Rest
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = max(dp[i-1][j], dp[i][j-1]) + grid[i][j]
    
    return dp[m-1][n-1]
```
````

### 2. Diagonal Movement Allowed

When you can also move diagonally (right-down, down-right, or diagonal):

```python
def unique_paths_diagonal(m, n):
    """Count paths when diagonal movement is allowed."""
    # Each step can be: right, down, or diagonal
    # More complex recurrence needed to avoid double-counting
    pass
```

### 3. Multiple Start/End Points

Find paths between multiple source and destination cells:

```python
def min_path_sum_multi(grid, starts, ends):
    """Minimum path sum from any start to any end."""
    # Run DP from each start point, take minimum at any end
    pass
```

### 4. Path with Constraints

Maximum number of steps, or path must pass through certain cells:

```python
def paths_with_constraints(grid, max_steps):
    """Count paths with step limit."""
    # Add dimension for steps taken
    pass
```

### 5. Obstacles with Multiple States

Different obstacle types or moving obstacles:

```python
def dynamic_obstacle_paths(grid, time):
    """Paths when obstacles appear/disappear over time."""
    # Add time dimension to DP
    pass
```

---

## Practice Problems

### Problem 1: Unique Paths

**Problem:** [LeetCode 62 - Unique Paths](https://leetcode.com/problems/unique-paths/)

**Description:** A robot is located at the top-left corner of a m×n grid. The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid. How many possible unique paths are there?

**How to Apply Matrix Path DP:**
- Define `dp[i][j]` = number of unique paths to reach cell (i, j)
- Base case: `dp[0][j] = 1` (first row), `dp[i][0] = 1` (first column)
- Transition: `dp[i][j] = dp[i-1][j] + dp[i][j-1]`
- For empty grid: use combinatorial formula C(m+n-2, m-1)

---

### Problem 2: Unique Paths II

**Problem:** [LeetCode 63 - Unique Paths II](https://leetcode.com/problems/unique-paths-ii/)

**Description:** Same as Unique Paths, but now there are obstacles. The grid contains obstacles (1) and empty spaces (0). If there's an obstacle, you cannot pass through it.

**How to Apply Matrix Path DP:**
- Add obstacle check: if grid[i][j] == 1, then dp[i][j] = 0
- Handle edge cases: if start or end has obstacle, return 0
- All other logic remains the same as basic Unique Paths

---

### Problem 3: Minimum Path Sum

**Problem:** [LeetCode 64 - Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/)

**Description:** Given a grid filled with non-negative numbers, find a path from top-left to bottom-right that minimizes the sum of all numbers along the path. You can only move down or right.

**How to Apply Matrix Path DP:**
- Define `dp[i][j]` = minimum sum to reach cell (i, j)
- Transition: `dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`
- Handle first row/column separately (can only come from one direction)
- Answer is at dp[m-1][n-1]

---

### Problem 4: Triangle Minimum Path Sum

**Problem:** [LeetCode 120 - Triangle](https://leetcode.com/problems/triangle/)

**Description:** Given a triangle array, find the minimum path sum from top to bottom. Each step you may move to adjacent numbers on the row below.

**How to Apply Matrix Path DP:**
- Work from bottom-up: `dp[i][j] = triangle[i][j] + min(dp[i+1][j], dp[i+1][j+1])`
- Space-optimized: use single row, update from right to left
- Similar to minimum path sum but with triangular structure

---

### Problem 5: Cherry Pickup

**Problem:** [LeetCode 741 - Cherry Pickup](https://leetcode.com/problems/cherry-pickup/)

**Description: Given a grid where each cell has cherries, find the maximum cherries you can collect starting from (0,0) and ending at (n-1, n-1) moving right or down, then returning moving up or left.

**How to Apply Matrix Path DP:**
- Use two paths simultaneously: think of two people walking at the same time
- State: dp[t][i1][i2] = max cherries when both have taken t steps
- Can be optimized to 2D by noting that j = t - i
- Complex but demonstrates power of DP state design

---

## Video Tutorial Links

### Fundamentals

- [Matrix Path DP - Unique Paths (Take U Forward)](https://www.youtube.com/watch?v=IlEsdxu56RQ) - Comprehensive introduction to grid path problems
- [Minimum Path Sum (NeetCode)](https://www.youtube.com/watch?v=TwP-dnV3fGo) - Detailed explanation with visualizations
- [Dynamic Programming on Grids (WilliamFiset)](https://www.youtube.com/watch?v=Af2D8mib5Vw) - Grid DP patterns

### Advanced Topics

- [Space Optimization Techniques](https://www.youtube.com/watch?v=8GRF1QbjKJU) - Reducing space complexity
- [Cherry Pickup Problem](https://www.youtube.com/watch?v=HSFPu69kRks) - Advanced two-path DP
- [Grid DP Variations](https://www.youtube.com/watch?v=o5CG4h3h6Xc) - Multiple problem types

---

## Follow-up Questions

### Q1: How do you handle 4-directional movement in Matrix Path DP?

**Answer:** For 4-directional movement (up, down, left, right), the standard approach changes because you can reach a cell from multiple directions:

- Use the same DP table but iterate through all cells
- Transition: `dp[i][j] = grid[i][j] + max(dp[i-1][j], dp[i+1][j], dp[i][j-1], dp[i][j+1])`
- Need to handle visited cells to avoid infinite loops
- Usually solved with DFS + memoization or topological ordering

### Q2: Can Matrix Path DP be used for graphs with cycles?

**Answer:** Matrix Path DP is specifically designed for DAGs (Directed Acyclic Graphs). For graphs with cycles:
- Use Bellman-Ford for shortest paths with negative weights
- Use DFS + memoization for counting paths
- Use Floyd-Warshall for all-pairs shortest paths
- The grid structure with restricted movement naturally creates a DAG

### Q3: What's the maximum grid size this approach can handle?

**Answer:** With O(m × n) time:
- **Typical limits**: ~10^4 cells (100×100) for O(m×n) space, ~10^6 (1000×1000) for O(n) space
- **Memory**: ~100MB → ~10^7 integers
- **Time**: At 10^8 operations per second, 10^6 cells takes ~0.01 seconds
- For larger grids, consider whether you need full DP or can use combinatorial formula

### Q4: How do you reconstruct the actual path, not just the count/sum?

**Answer:** To reconstruct the path:
1. Store the DP table as usual
2. Starting from the end, trace back:
   - Compare neighbors (dp[i-1][j] vs dp[i][j-1])
   - Choose the direction that contributed to current cell
   - Repeat until reaching start
3. Store parent pointers during DP computation for O(path_length) reconstruction

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

- **Core Concept**: At any cell, you can only come from a limited set of directions (typically from above or from the left), creating a natural recurrence relation
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
