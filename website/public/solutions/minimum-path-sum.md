# Minimum Path Sum

## Problem Description

Given a `m x n` grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.

**Note:** You can only move either down or right at any point in time.

**Link to problem:** [Minimum Path Sum - LeetCode 64](https://leetcode.com/problems/minimum-path-sum/)

---

## Examples

### Example

**Input:**
```python
grid = [[1, 3, 1], [1, 5, 1], [4, 2, 1]]
```

**Output:**
```python
7
```

**Explanation:**
Because the path `1 → 3 → 1 → 1 → 1` minimizes the sum.

### Example 2

**Input:**
```python
grid = [[1, 2, 3], [4, 5, 6]]
```

**Output:**
```python
12
```

---

## Constraints

- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 200`
- `0 <= grid[i][j] <= 200`

---

## Pattern: Dynamic Programming - Grid Path

This problem is a classic example of the **Dynamic Programming on Grids** pattern. The pattern involves breaking down a grid problem into smaller subproblems by considering the optimal solution for each cell based on its neighbors.

### Core Concept

- **Optimal Substructure**: The minimum path sum to reach a cell depends only on the minimum path sums to reach its top or left neighbor
- **Overlapping Subproblems**: We compute the same subproblems multiple times without DP

---

## Intuition

The key insight for this problem is understanding that at each cell, we can only arrive from either above or from the left:

1. **From Above**: If we're at cell (i, j), we could have come from (i-1, j)
2. **From Left**: If we're at cell (i, j), we could have come from (i, j-1)

Therefore, the minimum sum to reach cell (i, j) is:
```
dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
```

This forms the foundation of our dynamic programming solution.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **2D DP Table** - Standard approach with O(mn) space
2. **1D DP Array** - Optimized to O(n) space
3. **In-Place Modification** - Modify the grid directly

---

## Approach 1: 2D DP Table (Standard)

### Algorithm Steps

1. Create a DP table of same dimensions as the grid
2. Initialize the starting cell (0, 0) with grid[0][0]
3. Fill the first row (can only come from left)
4. Fill the first column (can only come from above)
5. For each remaining cell, take the minimum of top and left neighbors plus current cell value
6. Return the bottom-right cell value

### Why It Works

The optimal path to any cell must come from either above or to the left. By taking the minimum of these two options and adding the current cell value, we build up the optimal solution for the entire grid.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        """
        Find minimum path sum using 2D dynamic programming.
        
        dp[i][j] = minimum sum to reach cell (i, j)
        
        Args:
            grid: 2D list of non-negative integers
            
        Returns:
            Minimum path sum from top-left to bottom-right
        """
        if not grid or not grid[0]:
            return 0
        
        m, n = len(grid), len(grid[0])
        
        # Create DP table
        dp = [[0] * n for _ in range(m)]
        
        # Initialize starting cell
        dp[0][0] = grid[0][0]
        
        # Initialize first row (can only come from left)
        for j in range(1, n):
            dp[0][j] = dp[0][j - 1] + grid[0][j]
        
        # Initialize first column (can only come from above)
        for i in range(1, m):
            dp[i][0] = dp[i - 1][0] + grid[i][0]
        
        # Fill rest of the DP table
        for i in range(1, m):
            for j in range(1, n):
                dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])
        
        return dp[m - 1][n - 1]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;
        
        int m = grid.size();
        int n = grid[0].size();
        
        // Create DP table
        vector<vector<int>> dp(m, vector<int>(n, 0));
        
        // Initialize starting cell
        dp[0][0] = grid[0][0];
        
        // Initialize first row
        for (int j = 1; j < n; j++) {
            dp[0][j] = dp[0][j - 1] + grid[0][j];
        }
        
        // Initialize first column
        for (int i = 1; i < m; i++) {
            dp[i][0] = dp[i - 1][0] + grid[i][0];
        }
        
        // Fill rest of the DP table
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1]);
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
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }
        
        int m = grid.length;
        int n = grid[0].length;
        
        // Create DP table
        int[][] dp = new int[m][n];
        
        // Initialize starting cell
        dp[0][0] = grid[0][0];
        
        // Initialize first row
        for (int j = 1; j < n; j++) {
            dp[0][j] = dp[0][j - 1] + grid[0][j];
        }
        
        // Initialize first column
        for (int i = 1; i < m; i++) {
            dp[i][0] = dp[i - 1][0] + grid[i][0];
        }
        
        // Fill rest of the DP table
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        
        return dp[m - 1][n - 1];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
var minPathSum = function(grid) {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
        return 0;
    }
    
    const m = grid.length;
    const n = grid[0].length;
    
    // Create DP table
    const dp = Array.from({ length: m }, () => new Array(n).fill(0));
    
    // Initialize starting cell
    dp[0][0] = grid[0][0];
    
    // Initialize first row
    for (let j = 1; j < n; j++) {
        dp[0][j] = dp[0][j - 1] + grid[0][j];
    }
    
    // Initialize first column
    for (let i = 1; i < m; i++) {
        dp[i][0] = dp[i - 1][0] + grid[i][0];
    }
    
    // Fill rest of the DP table
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    
    return dp[m - 1][n - 1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - Each cell is visited once |
| **Space** | O(m × n) - DP table stores all values |

---

## Approach 2: 1D DP Array (Space Optimized)

### Algorithm Steps

1. Use a 1D array of size n (number of columns)
2. Initialize the array with the first row values
3. For each row after the first:
   - Update the first element (can only come from above)
   - For each subsequent element, take min of current array value (from above) and previous array value (from left)
4. Return the last element

### Why It Works

Since each row only depends on the current row and the previous row, we can compress the 2D DP table into a 1D array. The key insight is that when we update the array in place, the previous values represent the row above, and the current values represent the row to the left.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        """Find minimum path sum using 1D DP (space optimized)."""
        if not grid or not grid[0]:
            return 0
        
        m, n = len(grid), len(grid[0])
        
        # Use 1D array
        dp = [float('inf')] * n
        dp[0] = 0
        
        for i in range(m):
            dp[0] += grid[i][0]
            for j in range(1, n):
                dp[j] = grid[i][j] + min(dp[j], dp[j - 1])
        
        return dp[n - 1]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;
        
        int m = grid.size();
        int n = grid[0].size();
        
        // Use 1D array
        vector<int> dp(n, INT_MAX);
        dp[0] = 0;
        
        for (int i = 0; i < m; i++) {
            dp[0] += grid[i][0];
            for (int j = 1; j < n; j++) {
                dp[j] = grid[i][j] + min(dp[j], dp[j - 1]);
            }
        }
        
        return dp[n - 1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minPathSum(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }
        
        int m = grid.length;
        int n = grid[0].length;
        
        // Use 1D array
        int[] dp = new int[n];
        dp[0] = 0;
        
        for (int i = 0; i < m; i++) {
            dp[0] += grid[i][0];
            for (int j = 1; j < n; j++) {
                dp[j] = grid[i][j] + Math.min(dp[j], dp[j - 1]);
            }
        }
        
        return dp[n - 1];
    }
}
```

<!-- slide -->
```javascript
var minPathSum = function(grid) {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
        return 0;
    }
    
    const m = grid.length;
    const n = grid[0].length;
    
    // Use 1D array
    const dp = new Array(n).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 0; i < m; i++) {
        dp[0] += grid[i][0];
        for (let j = 1; j < n; j++) {
            dp[j] = grid[i][j] + Math.min(dp[j], dp[j - 1]);
        }
    }
    
    return dp[n - 1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - Each cell is visited once |
| **Space** | O(n) - Only one row stored at a time |

---

## Approach 3: In-Place Modification

### Algorithm Steps

1. Modify the grid directly to store DP values
2. For the first row, accumulate values from left
3. For the first column, accumulate values from top
4. For remaining cells, take min of top and left neighbors, add current value
5. Return the bottom-right cell

### Why It Works

We can use the grid itself to store our DP values since we're only moving right and down. This eliminates the need for extra space entirely.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        """Find minimum path sum using in-place modification."""
        if not grid or not grid[0]:
            return 0
        
        m, n = len(grid), len(grid[0])
        
        # Modify first row
        for j in range(1, n):
            grid[0][j] += grid[0][j - 1]
        
        # Modify first column
        for i in range(1, m):
            grid[i][0] += grid[i - 1][0]
        
        # Fill rest of the grid
        for i in range(1, m):
            for j in range(1, n):
                grid[i][j] += min(grid[i - 1][j], grid[i][j - 1])
        
        return grid[m - 1][n - 1]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;
        
        int m = grid.size();
        int n = grid[0].size();
        
        // Modify first row
        for (int j = 1; j < n; j++) {
            grid[0][j] += grid[0][j - 1];
        }
        
        // Modify first column
        for (int i = 1; i < m; i++) {
            grid[i][0] += grid[i - 1][0];
        }
        
        // Fill rest of the grid
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                grid[i][j] += min(grid[i - 1][j], grid[i][j - 1]);
            }
        }
        
        return grid[m - 1][n - 1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minPathSum(int[][] grid) {
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return 0;
        }
        
        int m = grid.length;
        int n = grid[0].length;
        
        // Modify first row
        for (int j = 1; j < n; j++) {
            grid[0][j] += grid[0][j - 1];
        }
        
        // Modify first column
        for (int i = 1; i < m; i++) {
            grid[i][0] += grid[i - 1][0];
        }
        
        // Fill rest of the grid
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
            }
        }
        
        return grid[m - 1][n - 1];
    }
}
```

<!-- slide -->
```javascript
var minPathSum = function(grid) {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
        return 0;
    }
    
    const m = grid.length;
    const n = grid[0].length;
    
    // Modify first row
    for (let j = 1; j < n; j++) {
        grid[0][j] += grid[0][j - 1];
    }
    
    // Modify first column
    for (let i = 1; i < m; i++) {
        grid[i][0] += grid[i - 1][0];
    }
    
    // Fill rest of the grid
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
        }
    }
    
    return grid[m - 1][n - 1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - Each cell is visited once |
| **Space** | O(1) - No additional space used |

---

## Comparison of Approaches

| Aspect | 2D DP | 1D DP | In-Place |
|--------|-------|-------|----------|
| **Time Complexity** | O(mn) | O(mn) | O(mn) |
| **Space Complexity** | O(mn) | O(n) | O(1) |
| **Original Grid Preserved** | Yes | Yes | No |
| **Implementation** | Simple | Moderate | Simple |
| **LeetCode Optimal** | ✅ | ✅ | ✅ |

**Best Approach:** Use in-place modification (Approach 3) for minimum space, or 2D DP (Approach 1) if you need to preserve the original grid.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very frequently asked in technical interviews
- **Companies**: Google, Amazon, Meta, Apple, Microsoft, Bloomberg
- **Difficulty**: Medium (Easy variant exists)
- **Concepts Tested**: Dynamic Programming, Grid/Matrix problems, Space Optimization

### Learning Outcomes

1. **DP on Grids**: Learn to break down grid problems into subproblems
2. **Space Optimization**: Understand how to reduce space complexity
3. **State Transitions**: Master the min() decision at each step
4. **Path Finding**: Understand grid-based path problems

---

## Related Problems

Based on similar themes (grid DP, path finding, dynamic programming):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Unique Paths | [Link](https://leetcode.com/problems/unique-paths/) | Count number of paths |
| Unique Paths II | [Link](https://leetcode.com/problems/unique-paths-ii/) | Paths with obstacles |
| Minimum Path in Triangle | [Link](https://leetcode.com/problems/triangle/) | Triangle minimum path sum |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Dungeon Game | [Link](https://leetcode.com/problems/dungeon-game/) | Bottom-up DP for path |
| Cherry Pickup | [Link](https://leetcode.com/problems/cherry-pickup/) | Two paths in grid |
| Longest Increasing Path | [Link](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/) | DFS + DP |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Traffic Light Controlled Intersection | [Link](https://leetcode.com/problems/traffic-light-controlled-intersection/) | Complex grid path |
| Shortest Path in Grid with Obstacles | [Link](https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/) | BFS with modifications |

### Pattern Reference

For more detailed explanations of the Dynamic Programming on Grids pattern, see:
- **[Dynamic Programming - Grid Patterns](/patterns/grid-dp)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Minimum Path Sum](https://www.youtube.com/watch?v=oLTeTVrfe8Q)** - Clear explanation with visual examples
2. **[Minimum Path Sum - LeetCode 64](https://www.youtube.com/watch?v=aQ3fMEmYvj4)** - Detailed walkthrough
3. **[Back to Back SWE - Minimum Path Sum](https://www.youtube.com/watch?v=mpTClh5eE1s)** - Comprehensive solution
4. **[Dynamic Programming Explained](https://www.youtube.com/watch?v=73r3KXMx4Bc)** - DP fundamentals

### Related Concepts

- **[Grid DP Pattern](https://www.youtube.com/watch?v=NYe9D4c3pW0)** - Understanding grid DP
- **[Space Optimization Techniques](https://www.youtube.com/watch?v=6q3R0V6ZTzQ)** - Reducing space complexity

---

## Follow-up Questions

### Q1: How would you reconstruct the actual path taken?

**Answer:** Store the decision at each cell (whether we came from top or left) along with the DP value. Then backtrack from the bottom-right to reconstruct the path.

---

### Q2: What if you could move in four directions (up, down, left, right)?

**Answer:** This becomes a completely different problem - it would require Dijkstra's algorithm or BFS since there could be cycles and we need to find the shortest path in a weighted graph.

---

### Q3: How would you handle negative numbers in the grid?

**Answer:** The algorithm would still work with negative numbers since we're taking the minimum sum. However, you might need to handle edge cases differently if negative values are allowed.

---

### Q4: Can you solve this using recursion with memoization?

**Answer:** Yes, you can use recursion with memoization. Define dp(i, j) as the minimum sum from (i, j) to the bottom-right. The recurrence would be: dp(i, j) = grid[i][j] + min(dp(i+1, j), dp(i, j+1)).

---

### Q5: How would you modify the solution to handle obstacles?

**Answer:** This is exactly the Unique Paths II problem. When encountering an obstacle, set dp[i][j] = 0 (or Infinity for min path) to indicate that path cannot go through that cell.

---

### Q6: What is the maximum path sum value that can be handled?

**Answer:** With grid values up to 200 and max grid size 200×200, the maximum sum is 200 × 200 × 200 = 8,000,000, which fits in 32-bit integer.

---

### Q7: How would you parallelize this computation?

**Answer:** The dependencies between cells (can only come from top or left) make parallelization challenging. You could compute diagonal stripes in parallel, but the overhead likely isn't worth it for this problem size.

---

### Q8: What edge cases should be tested?

**Answer:**
- Single cell grid (1×1)
- Single row or single column
- Grid with all same values
- Grid with minimum values (all zeros)
- Grid with maximum values

---

## Common Pitfalls

### 1. Off-by-One Errors
**Issue**: Incorrect initialization of first row or column.

**Solution**: Be careful with loop boundaries. First row can only come from the left (index j-1), first column can only come from above (index i-1).

### 2. Not Handling Empty Grid
**Issue**: Forgetting to check for empty or null grid.

**Solution**: Always add boundary checks at the start of the function.

### 3. Integer Overflow
**Issue**: Not using appropriate data types for large sums.

**Answer**: In Python, integers are unbounded. In Java/C++, use long if needed, though 8 million fits in int.

### 4. Modifying Input When Not Allowed
**Issue**: Using in-place modification when the problem requires preserving input.

**Solution**: Use Approach 1 or 2 if the original grid must be preserved.

---

## Summary

The **Minimum Path Sum** problem is a classic dynamic programming problem that demonstrates:

- **Optimal Substructure**: The minimum path to any cell depends only on its top and left neighbors
- **Overlapping Subproblems**: We can build up solutions from smaller subproblems
- **Space-Time Tradeoff**: From O(mn) space to O(n) to O(1)

Key takeaways:
1. Use dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
2. Handle first row and column specially (only one direction possible)
3. Choose space complexity based on requirements
4. This pattern extends to many grid path problems

This problem is essential for understanding dynamic programming on grids and forms the foundation for more complex path-finding problems.

### Pattern Summary

This problem exemplifies the **Dynamic Programming on Grids** pattern, characterized by:
- Breaking down grid problems into cell-by-cell decisions
- Building solutions from top-left to bottom-right
- Taking minimum or maximum of neighboring states
- Space optimization from 2D to 1D to in-place

For more details on this pattern and its variations, see the **[Dynamic Programming - Grid Patterns](/patterns/grid-dp)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/minimum-path-sum/discuss/) - Community solutions
- [Dynamic Programming - GeeksforGeeks](https://www.geeksforgeeks.org/dynamic-programming/) - DP fundamentals
- [Grid Problems - LeetCode](https://leetcode.com/tag/grid/) - Related problems
- [Pattern: Dynamic Programming - Grid](/patterns/grid-dp) - Comprehensive pattern guide
