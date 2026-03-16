## Matrix Path DP: Unique Paths & Obstacles

**Question:** How do you solve grid path problems with dynamic programming?

<!-- front -->

---

## Answer: Build DP from Top-Left

### Basic Unique Paths
```python
def uniquePaths(m, n):
    dp = [[1] * n for _ in range(m)]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]

# Space optimized
def uniquePaths(m, n):
    dp = [1] * n
    
    for i in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j-1]
    
    return dp[n-1]
```

### With Obstacles
```python
def uniquePathsWithObstacles(grid):
    m, n = len(grid), len(grid[0])
    
    if grid[0][0] == 1:
        return 0
    
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = 1
    
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                dp[i][j] = 0
                continue
            
            if i > 0:
                dp[i][j] += dp[i-1][j]
            if j > 0:
                dp[i][j] += dp[i][j-1]
    
    return dp[m-1][n-1]
```

### Visual: DP Table
```
Grid: m=3, n=3 (no obstacles)

dp = [[1, 1, 1],
      [1, 2, 3],
      [1, 3, 6]]

Path to (2,2) = 6 ways:
1. R,R,D,D  2. R,D,R,D  3. R,D,D,R
4. D,R,R,D  5. D,R,D,R  6. D,D,R,R

With obstacle at (1,1):
dp = [[1, 1, 1],
      [1, 0, 1],
      [1, 1, 2]]

Answer: 2
```

### ⚠️ Tricky Parts

#### 1. Initialization
```python
# For basic: first row and column = 1
dp[0][j] = 1
dp[i][0] = 1

# For with obstacles: need to check first cell
if grid[0][0] == 1:
    return 0
dp[0][0] = 1

# Once obstacle hit, rest of row/col = 0
for j in range(n):
    if grid[0][j] == 1:
        while j < n:
            dp[0][j] = 0
            j += 1
```

#### 2. Direction of DP
```python
# Always build from top-left
# Each cell depends on left (j-1) and top (i-1)

for i in range(m):
    for j in range(n):
        # Order doesn't matter within cell
        dp[i][j] = dp[i-1][j] + dp[i][j-1]
```

#### 3. Space Optimization
```python
# 2D to 1D
# dp[j] = dp[j] + dp[j-1]
# dp[j] = current row value
# dp[j-1] = left cell (already updated in this row)

# IMPORTANT: iterate left to right!
for j in range(1, n):
    dp[j] += dp[j-1]  # WRONG direction would use updated dp[j]!
```

### Variations

| Problem | Key Change |
|---------|-----------|
| Minimum path sum | Use min instead of sum |
| With obstacles | Check grid[i][j] == 1 |
| Allow diagonals | Add dp[i-1][j-1] |
| Max value path | Use max, multiply values |

### Minimum Path Sum Example
```python
def minPathSum(grid):
    m, n = len(grid), len(grid[0])
    
    # Initialize first row
    for j in range(1, n):
        grid[0][j] += grid[0][j-1]
    
    # Initialize first column
    for i in range(1, m):
        grid[i][0] += grid[i-1][0]
    
    # Fill rest
    for i in range(1, m):
        for j in range(1, n):
            grid[i][j] += min(grid[i-1][j], grid[i][j-1])
    
    return grid[m-1][n-1]
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| 2D DP | O(m × n) | O(m × n) |
| 1D DP | O(m × n) | O(n) |

<!-- back -->
