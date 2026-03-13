# Unique Paths II

## Problem Description

You are given an `m x n` integer array `grid`. There is a robot initially located at the top-left corner (i.e., `grid[0][0]`). The robot tries to move to the bottom-right corner (i.e., `grid[m - 1][n - 1]`). The robot can only move either down or right at any point in time.

An obstacle and space are marked as `1` or `0` respectively in `grid`. A path that the robot takes cannot include any square that is an obstacle. Return the number of possible unique paths that the robot can take to reach the bottom-right corner.

The testcases are generated so that the answer will be less than or equal to `2 * 10^9`.

## Examples

**Example 1:**

**Input:**
```
obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]
```

**Output:**
```
2
```

**Explanation:** There is one obstacle in the middle of the 3x3 grid above. There are two ways to reach the bottom-right corner:
1. Right -> Right -> Down -> Down
2. Down -> Down -> Right -> Right

**Example 2:**

**Input:**
```
obstacleGrid = [[0,1],[0,0]]
```

**Output:**
```
1
```

## Constraints

- `m == obstacleGrid.length`
- `n == obstacleGrid[i].length`
- `1 <= m, n <= 100`
- `obstacleGrid[i][j]` is `0` or `1`.

---

## Pattern:

This problem follows the **Dynamic Programming on Grid** pattern, also known as **2D DP** or **Grid Path DP**. It's used for problems involving counting paths or finding optimal paths in a grid.

### Core Concept

- Each cell's value depends on **previous cells** (above and left for right/down movement)
- Build solution **incrementally** from smaller subproblems
- **Obstacles** block paths by setting contribution to 0
- Space can be optimized from 2D to 1D

### When to Use This Pattern

This pattern is applicable when:
1. Grid/matrix path counting problems
2. Problems with directional movement constraints
3. When solution builds from smaller subproblems
4. Any problem where current state depends on previous states

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Recursive with Memoization | Top-down approach |
| Combinatorics (nCr) | For grids without obstacles |
| BFS/DFS | For finding actual paths, not just count |

---

## Intuition

This problem is an extension of the basic "Unique Paths" problem where we now have obstacles that block certain paths.

### Key Insights

1. **Dynamic Programming Foundation**: The robot can only move right or down, so the number of ways to reach any cell depends only on cells above and to the left.

2. **Obstacle Handling**: When a cell has an obstacle (value 1), the number of ways to reach that cell is 0 - it simply cannot be part of any valid path.

3. **Cumulative Paths**: The number of unique paths to reach cell (i,j) = paths from above + paths from left, but only if (i,j) is not an obstacle.

4. **Boundary Conditions**: For the first row and first column, we can only come from one direction, so we need to handle them specially.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **2D DP Table** - Classic O(m×n) solution
2. **1D DP Optimization** - Space-optimized O(n) solution  
3. **In-place Modification** - Modify the grid directly

---

## Approach 1: 2D DP Table (Classic)

This is the standard dynamic programming approach using a 2D table.

### Algorithm Steps

1. Create a DP table with the same dimensions as the grid.
2. Handle edge cases: if start or end has an obstacle, return 0.
3. Initialize the starting cell to 1.
4. Fill the first row: if any cell has an obstacle, all cells after are 0.
5. Fill the first column similarly.
6. For all other cells:
   - If current cell has obstacle: dp[i][j] = 0
   - Otherwise: dp[i][j] = dp[i-1][j] + dp[i][j-1]
7. Return dp[m-1][n-1]

### Why It Works

Each cell's value represents the number of ways to reach it from the start. Since we can only come from above or from the left, we sum those two values. Obstacles block paths, making their contribution 0.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def uniquePathsWithObstacles(self, obstacleGrid: List[List[int]]) -> int:
        """
        Find number of unique paths with obstacles using 2D DP.
        
        Args:
            obstacleGrid: 2D grid where 1 = obstacle, 0 = free cell
            
        Returns:
            Number of unique paths from top-left to bottom-right
        """
        if not obstacleGrid or not obstacleGrid[0]:
            return 0
        
        m, n = len(obstacleGrid), len(obstacleGrid[0])
        
        # If start or end is blocked, no path exists
        if obstacleGrid[0][0] == 1 or obstacleGrid[m-1][n-1] == 1:
            return 0
        
        # Create DP table
        dp = [[0] * n for _ in range(m)]
        
        # Initialize starting cell
        dp[0][0] = 1
        
        # Fill first row
        for j in range(1, n):
            if obstacleGrid[0][j] == 1:
                dp[0][j] = 0  # Path blocked
            else:
                dp[0][j] = dp[0][j-1]  # Can only come from left
        
        # Fill first column
        for i in range(1, m):
            if obstacleGrid[i][0] == 1:
                dp[i][0] = 0  # Path blocked
            else:
                dp[i][0] = dp[i-1][0]  # Can only come from top
        
        # Fill rest of the DP table
        for i in range(1, m):
            for j in range(1, n):
                if obstacleGrid[i][j] == 1:
                    dp[i][j] = 0  # Obstacle - no paths through here
                else:
                    dp[i][j] = dp[i-1][j] + dp[i][j-1]
        
        return dp[m-1][n-1]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
        if (obstacleGrid.empty() || obstacleGrid[0].empty()) {
            return 0;
        }
        
        int m = obstacleGrid.size();
        int n = obstacleGrid[0].size();
        
        // If start or end is blocked
        if (obstacleGrid[0][0] == 1 || obstacleGrid[m-1][n-1] == 1) {
            return 0;
        }
        
        // Create DP table
        vector<vector<int>> dp(m, vector<int>(n, 0));
        dp[0][0] = 1;
        
        // Fill first row
        for (int j = 1; j < n; j++) {
            if (obstacleGrid[0][j] == 1) {
                dp[0][j] = 0;
            } else {
                dp[0][j] = dp[0][j-1];
            }
        }
        
        // Fill first column
        for (int i = 1; i < m; i++) {
            if (obstacleGrid[i][0] == 1) {
                dp[i][0] = 0;
            } else {
                dp[i][0] = dp[i-1][0];
            }
        }
        
        // Fill rest of the DP table
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (obstacleGrid[i][j] == 1) {
                    dp[i][j] = 0;
                } else {
                    dp[i][j] = dp[i-1][j] + dp[i][j-1];
                }
            }
        }
        
        return dp[m-1][n-1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        if (obstacleGrid == null || obstacleGrid.length == 0 || 
            obstacleGrid[0] == null || obstacleGrid[0].length == 0) {
            return 0;
        }
        
        int m = obstacleGrid.length;
        int n = obstacleGrid[0].length;
        
        // If start or end is blocked
        if (obstacleGrid[0][0] == 1 || obstacleGrid[m-1][n-1] == 1) {
            return 0;
        }
        
        // Create DP table
        int[][] dp = new int[m][n];
        dp[0][0] = 1;
        
        // Fill first row
        for (int j = 1; j < n; j++) {
            if (obstacleGrid[0][j] == 1) {
                dp[0][j] = 0;
            } else {
                dp[0][j] = dp[0][j-1];
            }
        }
        
        // Fill first column
        for (int i = 1; i < m; i++) {
            if (obstacleGrid[i][0] == 1) {
                dp[i][0] = 0;
            } else {
                dp[i][0] = dp[i-1][0];
            }
        }
        
        // Fill rest of the DP table
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (obstacleGrid[i][j] == 1) {
                    dp[i][j] = 0;
                } else {
                    dp[i][j] = dp[i-1][j] + dp[i][j-1];
                }
            }
        }
        
        return dp[m-1][n-1];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
var uniquePathsWithObstacles = function(obstacleGrid) {
    if (!obstacleGrid || obstacleGrid.length === 0 || 
        !obstacleGrid[0] || obstacleGrid[0].length === 0) {
        return 0;
    }
    
    const m = obstacleGrid.length;
    const n = obstacleGrid[0].length;
    
    // If start or end is blocked
    if (obstacleGrid[0][0] === 1 || obstacleGrid[m-1][n-1] === 1) {
        return 0;
    }
    
    // Create DP table
    const dp = Array.from({ length: m }, () => Array(n).fill(0));
    dp[0][0] = 1;
    
    // Fill first row
    for (let j = 1; j < n; j++) {
        if (obstacleGrid[0][j] === 1) {
            dp[0][j] = 0;
        } else {
            dp[0][j] = dp[0][j-1];
        }
    }
    
    // Fill first column
    for (let i = 1; i < m; i++) {
        if (obstacleGrid[i][0] === 1) {
            dp[i][0] = 0;
        } else {
            dp[i][0] = dp[i-1][0];
        }
    }
    
    // Fill rest of the DP table
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (obstacleGrid[i][j] === 1) {
                dp[i][j] = 0;
            } else {
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
            }
        }
    }
    
    return dp[m-1][n-1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - visit each cell once |
| **Space** | O(m × n) - for DP table |

---

## Approach 2: 1D DP Optimization (Space Optimized)

This approach uses only a 1D array to achieve O(n) space complexity.

### Algorithm Steps

1. Use a 1D array of size n.
2. Initialize dp[0] = 1 (or 0 if start is blocked).
3. Iterate through each row:
   - For each cell, if obstacle: dp[j] = 0
   - Otherwise: dp[j] = dp[j] + dp[j-1] (current cell = from above + from left)
4. Return dp[n-1]

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def uniquePathsWithObstacles(self, obstacleGrid: List[List[int]]) -> int:
        if not obstacleGrid or not obstacleGrid[0]:
            return 0
        
        m, n = len(obstacleGrid), len(obstacleGrid[0])
        
        # If start or end is blocked
        if obstacleGrid[0][0] == 1 or obstacleGrid[m-1][n-1] == 1:
            return 0
        
        # 1D DP array
        dp = [0] * n
        dp[0] = 1
        
        for i in range(m):
            for j in range(n):
                if obstacleGrid[i][j] == 1:
                    dp[j] = 0  # Obstacle - no paths
                elif j > 0:
                    dp[j] = dp[j] + dp[j-1]  # From left + from above (previous row)
                # If j == 0, dp[j] stays as is (from above only)
        
        return dp[n-1]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
        if (obstacleGrid.empty() || obstacleGrid[0].empty()) {
            return 0;
        }
        
        int m = obstacleGrid.size();
        int n = obstacleGrid[0].size();
        
        if (obstacleGrid[0][0] == 1 || obstacleGrid[m-1][n-1] == 1) {
            return 0;
        }
        
        // 1D DP array
        vector<int> dp(n, 0);
        dp[0] = 1;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (obstacleGrid[i][j] == 1) {
                    dp[j] = 0;
                } else if (j > 0) {
                    dp[j] = dp[j] + dp[j-1];
                }
            }
        }
        
        return dp[n-1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        if (obstacleGrid == null || obstacleGrid.length == 0 || 
            obstacleGrid[0] == null || obstacleGrid[0].length == 0) {
            return 0;
        }
        
        int m = obstacleGrid.length;
        int n = obstacleGrid[0].length;
        
        if (obstacleGrid[0][0] == 1 || obstacleGrid[m-1][n-1] == 1) {
            return 0;
        }
        
        // 1D DP array
        int[] dp = new int[n];
        dp[0] = 1;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (obstacleGrid[i][j] == 1) {
                    dp[j] = 0;
                } else if (j > 0) {
                    dp[j] = dp[j] + dp[j-1];
                }
            }
        }
        
        return dp[n-1];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
var uniquePathsWithObstacles = function(obstacleGrid) {
    if (!obstacleGrid || obstacleGrid.length === 0 || 
        !obstacleGrid[0] || obstacleGrid[0].length === 0) {
        return 0;
    }
    
    const m = obstacleGrid.length;
    const n = obstacleGrid[0].length;
    
    if (obstacleGrid[0][0] === 1 || obstacleGrid[m-1][n-1] === 1) {
        return 0;
    }
    
    // 1D DP array
    const dp = new Array(n).fill(0);
    dp[0] = 1;
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (obstacleGrid[i][j] === 1) {
                dp[j] = 0;
            } else if (j > 0) {
                dp[j] = dp[j] + dp[j-1];
            }
        }
    }
    
    return dp[n-1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - visit each cell once |
| **Space** | O(n) - only one row needed |

---

## Approach 3: In-Place Modification

This approach modifies the obstacle grid directly to save space.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def uniquePathsWithObstacles(self, obstacleGrid: List[List[int]]) -> int:
        if not obstacleGrid or not obstacleGrid[0]:
            return 0
        
        m, n = len(obstacleGrid), len(obstacleGrid[0])
        
        # If start or end is blocked
        if obstacleGrid[0][0] == 1 or obstacleGrid[m-1][n-1] == 1:
            return 0
        
        # Modify in place - treat obstacleGrid as DP table
        obstacleGrid[0][0] = 1  # 1 way to reach start
        
        # Initialize first row
        for j in range(1, n):
            obstacleGrid[0][j] = 0 if obstacleGrid[0][j] == 1 else obstacleGrid[0][j-1]
        
        # Initialize first column
        for i in range(1, m):
            obstacleGrid[i][0] = 0 if obstacleGrid[i][0] == 1 else obstacleGrid[i-1][0]
        
        # Fill rest of the grid
        for i in range(1, m):
            for j in range(1, n):
                if obstacleGrid[i][j] == 1:
                    obstacleGrid[i][j] = 0
                else:
                    obstacleGrid[i][j] = obstacleGrid[i-1][j] + obstacleGrid[i][j-1]
        
        return obstacleGrid[m-1][n-1]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
        if (obstacleGrid.empty() || obstacleGrid[0].empty()) {
            return 0;
        }
        
        int m = obstacleGrid.size();
        int n = obstacleGrid[0].size();
        
        if (obstacleGrid[0][0] == 1 || obstacleGrid[m-1][n-1] == 1) {
            return 0;
        }
        
        // Modify in place
        obstacleGrid[0][0] = 1;
        
        // Initialize first row
        for (int j = 1; j < n; j++) {
            obstacleGrid[0][j] = (obstacleGrid[0][j] == 1) ? 0 : obstacleGrid[0][j-1];
        }
        
        // Initialize first column
        for (int i = 1; i < m; i++) {
            obstacleGrid[i][0] = (obstacleGrid[i][0] == 1) ? 0 : obstacleGrid[i-1][0];
        }
        
        // Fill rest of the grid
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (obstacleGrid[i][j] == 1) {
                    obstacleGrid[i][j] = 0;
                } else {
                    obstacleGrid[i][j] = obstacleGrid[i-1][j] + obstacleGrid[i][j-1];
                }
            }
        }
        
        return obstacleGrid[m-1][n-1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        if (obstacleGrid == null || obstacleGrid.length == 0 || 
            obstacleGrid[0] == null || obstacleGrid[0].length == 0) {
            return 0;
        }
        
        int m = obstacleGrid.length;
        int n = obstacleGrid[0].length;
        
        if (obstacleGrid[0][0] == 1 || obstacleGrid[m-1][n-1] == 1) {
            return 0;
        }
        
        // Modify in place
        obstacleGrid[0][0] = 1;
        
        // Initialize first row
        for (int j = 1; j < n; j++) {
            obstacleGrid[0][j] = (obstacleGrid[0][j] == 1) ? 0 : obstacleGrid[0][j-1];
        }
        
        // Initialize first column
        for (int i = 1; i < m; i++) {
            obstacleGrid[i][0] = (obstacleGrid[i][0] == 1) ? 0 : obstacleGrid[i-1][0];
        }
        
        // Fill rest of the grid
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (obstacleGrid[i][j] == 1) {
                    obstacleGrid[i][j] = 0;
                } else {
                    obstacleGrid[i][j] = obstacleGrid[i-1][j] + obstacleGrid[i][j-1];
                }
            }
        }
        
        return obstacleGrid[m-1][n-1];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
var uniquePathsWithObstacles = function(obstacleGrid) {
    if (!obstacleGrid || obstacleGrid.length === 0 || 
        !obstacleGrid[0] || obstacleGrid[0].length === 0) {
        return 0;
    }
    
    const m = obstacleGrid.length;
    const n = obstacleGrid[0].length;
    
    if (obstacleGrid[0][0] === 1 || obstacleGrid[m-1][n-1] === 1) {
        return 0;
    }
    
    // Modify in place
    obstacleGrid[0][0] = 1;
    
    // Initialize first row
    for (let j = 1; j < n; j++) {
        obstacleGrid[0][j] = obstacleGrid[0][j] === 1 ? 0 : obstacleGrid[0][j-1];
    }
    
    // Initialize first column
    for (let i = 1; i < m; i++) {
        obstacleGrid[i][0] = obstacleGrid[i][0] === 1 ? 0 : obstacleGrid[i-1][0];
    }
    
    // Fill rest of the grid
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (obstacleGrid[i][j] === 1) {
                obstacleGrid[i][j] = 0;
            } else {
                obstacleGrid[i][j] = obstacleGrid[i-1][j] + obstacleGrid[i][j-1];
            }
        }
    }
    
    return obstacleGrid[m-1][n-1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - visit each cell once |
| **Space** | O(1) - modifies grid in place |

---

## Comparison of Approaches

| Aspect | 2D DP | 1D DP | In-Place |
|--------|-------|-------|----------|
| **Time Complexity** | O(m × n) | O(m × n) | O(m × n) |
| **Space Complexity** | O(m × n) | O(n) | O(1) |
| **Modifies Input** | No | No | Yes |
| **Readability** | Highest | High | Moderate |
| **Best For** | Understanding | Production | Memory critical |

---

## Why This Problem is Important

### Interview Relevance
- **Frequency**: Frequently asked in technical interviews
- **Companies**: Amazon, Microsoft, Apple, Goldman Sachs
- **Difficulty**: Medium
- **Concepts**: Dynamic programming, grid/path problems

### Key Learnings
1. **DP foundation**: Understanding how to build solutions incrementally
2. **Space optimization**: Reducing from 2D to 1D
3. **Boundary handling**: Special treatment for first row/column
4. **Obstacle handling**: Blocking paths with 0 values

---

## Related Problems

### Same Pattern (Grid DP)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Unique Paths II | [Link](https://leetcode.com/problems/unique-paths-ii/) | Medium | This problem |
| Unique Paths | [Link](https://leetcode.com/problems/unique-paths/) | Medium | Without obstacles |
| Minimum Path Sum | [Link](https://leetcode.com/problems/minimum-path-sum/) | Medium | With weights |
| Dungeon Game | [Link](https://leetcode.com/problems/dungeon-game/) | Hard | Reverse DP |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Climbing Stairs | [Link](https://leetcode.com/problems/climbing-stairs/) | Easy | 1D DP |
| Robot in Grid | [Link](https://www.interviewcake.com/question/python3/robot-in-grid) | Medium | Backtracking + DP |
| Path Sum | [Link](https://leetcode.com/problems/path-sum/) | Easy | Tree DFS |

---

## Video Tutorial Links

### Dynamic Programming on Grids

1. **[Unique Paths II - NeetCode](https://www.youtube.com/watch?v=4R3K1PgJ1FU)** - Clear explanation with visual examples
2. **[LeetCode 63 - Unique Paths II](https://www.youtube.com/watch?v=7B3uU2N3qKg)** - Detailed walkthrough
3. **[DP Pattern Explained](https://www.youtube.com/watch?v=OxG0W6J6K6w)** - DP fundamentals

### Related Concepts

- **[2D DP Introduction](https://www.youtube.com/watch?v=p0x5K4X6Pz4)** - Foundation
- **[Space Optimization](https://www.youtube.com/watch?v=6E1t4dGlz6s)** - Reducing dimensions

---

## Follow-up Questions

### Q1: How would you modify to find the actual paths, not just the count?

**Answer:** Store the path information during DP. You could maintain a "parent" pointer or store which direction (up or left) contributed to each cell. Then backtrack from the end to reconstruct the path.

---

### Q2: What if the robot can also move diagonally (down-right)?

**Answer:** Add diagonal as another option: `dp[i][j] = dp[i-1][j] + dp[i][j-1] + dp[i-1][j-1]`. Also need to update boundary conditions to handle the additional path.

---

### Q3: How would you handle very large grids efficiently?

**Answer:** Use the 1D DP approach which is O(n) space. For extremely large grids, consider using combinatorial formulas when there are no obstacles (use mathematical nCr approach).

---

### Q4: Can you solve this without DP using combinatorics?

**Answer:** For the case without obstacles, yes! The answer is C(m+n-2, m-1) - choose when to go down. With obstacles, DP is required because obstacles break the combinatorial structure.

---

### Q5: What if you need to output all valid paths?

**Answer:** Use backtracking to generate all paths. The DP can help prune - only explore from cells with dp value > 0. This would be exponential in worst case.

---

### Q6: How does this differ from Minimum Path Sum?

**Answer:** Minimum Path Sum assigns weights to each cell and finds the minimum sum path. Unique Paths II counts all possible paths without weights. The DP recurrence is similar but we sum instead of taking min.

---

### Q7: What edge cases should you test?

**Answer:**
- Start cell is obstacle → return 0
- End cell is obstacle → return 0
- Entire first row blocked → return 0
- No obstacles (original Unique Paths)
- Single cell with no obstacle → return 1
- Single cell with obstacle → return 0
- Grid with only 1 row or 1 column

---

### Q8: How would you verify correctness?

**Answer:**
- Test with known examples
- Test edge cases (obstacles at boundaries)
- Compare with brute force for small grids
- Verify that path counts match manual enumeration
- Check that answer fits in 32-bit integer (given constraint)

---

### Q9: Why does the 1D DP approach work?

**Answer:** When iterating row by row, dp[j] at the start of each iteration represents paths from above (previous row). After updating dp[j] += dp[j-1], it represents the sum of paths from above and from left. This elegantly captures both contributions.

---

### Q10: How would you adapt this for a 3D grid (moving in 3 dimensions)?

**Answer:** Extend the recurrence to include dp[i-1][j][k]. The formula becomes: `dp[i][j][k] = dp[i-1][j][k] + dp[i][j-1][k] + dp[i][j][k-1]`. Space can be reduced similarly using 2D or 1D arrays.

---

## Common Pitfalls

### 1. Not Checking Start/End Obstacles
**Issue**: Returning a value when no path exists.

**Solution**: Check if obstacleGrid[0][0] or obstacleGrid[m-1][n-1] is 1 first.

### 2. Wrong Boundary Initialization
**Issue**: Not handling first row/column correctly.

**Solution**: Initialize first row: if obstacle, all subsequent cells in that row are 0. Same for first column.

### 3. Integer Overflow
**Issue**: Path count exceeding 32-bit integer.

**Solution**: The problem guarantees answer ≤ 2×10⁹, which fits in 32-bit signed int.

### 4. Off-by-One in Loop Bounds
**Issue**: Incorrect indices when filling DP table.

**Solution**: Remember DP table is 0-indexed, but we start filling from row 1, column 1.

---

## Summary

The **Unique Paths II** problem demonstrates classic **dynamic programming** on grids:

- **2D DP**: Clear and straightforward, O(m×n) space
- **1D DP**: Space-optimized, O(n) space  
- **In-place**: Minimal memory, modifies input

Key insights:
1. Each cell = paths from above + paths from left
2. Obstacles block all paths through that cell
3. First row/column need special handling
4. Space can be reduced from O(m×n) to O(n)

This pattern extends to:
- Any grid path counting problems
- Matrix chain multiplication
- Edit distance problems
- And many more DP challenges
