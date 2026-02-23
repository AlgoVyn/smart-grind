# Matrix Path DP

## Category
Dynamic Programming

## Description
Count unique paths or find minimum cost path in a matrix.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- dynamic programming related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Algorithm Explanation

The Matrix Path DP problem involves finding unique paths in a grid with or without obstacles. This is a classic 2D dynamic programming problem.

**Problem Variations:**
1. **Unique Paths**: Count ways to reach bottom-right from top-left
2. **Unique Paths with Obstacles**: Same, but some cells are blocked
3. **Minimum Path Sum**: Find minimum sum path

**Key Insight:**
- At each cell, you can only come from above or from the left
- This creates a recurrence: `dp[i][j] = dp[i-1][j] + dp[i][j-1]`
- For obstacles: if cell is blocked, `dp[i][j] = 0`

**Approaches:**
1. **Standard DP**: 2D array - O(m×n) space
2. **Space Optimized**: 1D array - O(n) space
3. **In-place**: Modify the grid if allowed

**State Transition:**
```
dp[i][j] = dp[i-1][j] + dp[i][j-1]  (for empty cells)
dp[i][j] = 0                        (for obstacles)
```

**Base Cases:**
- `dp[0][0] = 1` if no obstacle, else 0
- First row: `dp[0][j] = dp[0][j-1]` (can only come from left)
- First column: `dp[i][0] = dp[i-1][0]` (can only come from above)

---

## Implementation

```python
def unique_paths_with_obstacles(grid):
    """
    Count unique paths from top-left to bottom-right with obstacles.
    0 = empty, 1 = obstacle.
    
    Args:
        grid: 2D list of 0s and 1s (1 = obstacle)
        
    Returns:
        Number of unique paths
        
    Time: O(m * n)
    Space: O(m * n)
    """
    if not grid or not grid[0]:
        return 0
    
    m, n = len(grid), len(grid[0])
    
    # If start or end is blocked, no path exists
    if grid[0][0] == 1 or grid[m-1][n-1] == 1:
        return 0
    
    # DP table
    dp = [[0] * n for _ in range(m)]
    
    # Base case: start cell
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


# Space-optimized version
def unique_paths_with_obstacles_optimized(grid):
    """O(n) space using 1D array."""
    if not grid or not grid[0]:
        return 0
    
    m, n = len(grid), len(grid[0])
    
    if grid[0][0] == 1 or grid[m-1][n-1] == 1:
        return 0
    
    dp = [0] * n
    dp[0] = 1
    
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                dp[j] = 0  # Obstacle: no paths through here
            else:
                if j > 0:
                    dp[j] += dp[j-1]  # Add from left
    
    return dp[n-1]


# Without obstacles - simpler version
def unique_paths(m, n):
    """Count unique paths in m x n grid without obstacles."""
    # Uses combinatorics: C(m+n-2, m-1) or C(m+n-2, n-1)
    from math import comb
    return comb(m + n - 2, m - 1)
```

```javascript
function matrixPathDp() {
    // Matrix Path DP implementation
    // Time: O(m * n)
    // Space: O(m * n)
}
```

---

## Example

**Input:**
```
grid = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0]
]
```

**Output:**
```
2
```

**Explanation:**
- Grid: 0 = empty, 1 = obstacle
- Start: (0,0), End: (2,2)
- Obstacle at (1,1)

Two valid paths:
1. Right → Right → Down → Down
   (0,0) → (0,1) → (0,2) → (1,2) → (2,2)

2. Down → Down → Right → Right
   (0,0) → (1,0) → (2,0) → (2,1) → (2,2)

**DP Table:**
```
[1, 1, 1]
[1, 0, 1]
[1, 1, 2]
```
Answer at dp[2][2] = 2

**Additional Example:**
```
Input: grid = [[0, 1], [1, 0]]
Output: 0

Explanation: Both start and end are not blocked, but path is blocked by obstacles.

Input: grid = [[0]]
Output: 1

Explanation: Single cell, already at destination.

Input: grid = [[1]]
Output: 0

Explanation: Start is blocked.
```

---

## Time Complexity
**O(m * n)**

---

## Space Complexity
**O(m * n)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
