## DP - 2D Array (Unique Paths on Grid): Tactics

What are specific techniques for unique paths grid problems?

<!-- front -->

---

### Tactic 1: Handling Obstacles in First Row/Column

First row and column need special handling with obstacles - they create "walls" of zeros.

```python
def unique_paths_with_obstacles(obstacle_grid):
    m, n = len(obstacle_grid), len(obstacle_grid[0])
    dp = [[0] * n for _ in range(m)]
    
    # First column: stop at first obstacle
    for i in range(m):
        if obstacle_grid[i][0] == 1:
            break  # All cells below are 0
        dp[i][0] = 1
    
    # First row: stop at first obstacle  
    for j in range(n):
        if obstacle_grid[0][j] == 1:
            break  # All cells after are 0
        dp[0][j] = 1
    
    # Fill rest normally
    for i in range(1, m):
        for j in range(1, n):
            if obstacle_grid[i][j] == 0:
                dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]
```

---

### Tactic 2: In-Place O(1) Extra Space

Reuse the input grid to store DP values (modifying input).

```python
def unique_paths_inplace(obstacle_grid):
    if obstacle_grid[0][0] == 1:
        return 0
    
    m, n = len(obstacle_grid), len(obstacle_grid[0])
    obstacle_grid[0][0] = 1  # Start is reachable
    
    # First column
    for i in range(1, m):
        obstacle_grid[i][0] = int(
            obstacle_grid[i][0] == 0 and obstacle_grid[i-1][0] == 1
        )
    
    # First row
    for j in range(1, n):
        obstacle_grid[0][j] = int(
            obstacle_grid[0][j] == 0 and obstacle_grid[0][j-1] == 1
        )
    
    # Fill rest
    for i in range(1, m):
        for j in range(1, n):
            if obstacle_grid[i][j] == 0:
                obstacle_grid[i][j] = obstacle_grid[i-1][j] + obstacle_grid[i][j-1]
            else:
                obstacle_grid[i][j] = 0  # Blocked
    
    return obstacle_grid[m-1][n-1]
```

---

### Tactic 3: Space-Optimized Single Row

For problems without obstacles, use a 1D rolling array.

```python
def min_path_sum_optimized(grid):
    m, n = len(grid), len(grid[0])
    dp = [0] * n
    dp[0] = grid[0][0]
    
    # Initialize first row
    for j in range(1, n):
        dp[j] = dp[j-1] + grid[0][j]
    
    # Process each row
    for i in range(1, m):
        dp[0] += grid[i][0]  # First column accumulates
        for j in range(1, n):
            dp[j] = min(dp[j], dp[j-1]) + grid[i][j]
            # dp[j] (from top) vs dp[j-1] (from left)
    
    return dp[n-1]
```

---

### Tactic 4: Modular Arithmetic for Large Counts

Path counts grow exponentially - use modulo to prevent overflow.

```python
MOD = 10**9 + 7

def unique_paths_with_mod(m, n):
    dp = [[1] * n for _ in range(m)]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = (dp[i-1][j] + dp[i][j-1]) % MOD
    
    return dp[m-1][n-1]

# Note: Combinatorics approach needs modular inverse for mod
# Use Fermat's little theorem: a^(-1) ≡ a^(p-2) (mod p)
```

---

### Tactic 5: Backtracking to Reconstruct Path

Store choices to reconstruct the actual path, not just the count.

```python
def find_path_with_backtrack(grid):
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    choice = [[None] * n for _ in range(m)]  # 'D' or 'R'
    
    dp[0][0] = grid[0][0]
    
    # Initialize
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] + grid[i][0]
        choice[i][0] = 'D'
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] + grid[0][j]
        choice[0][j] = 'R'
    
    # Fill with choices
    for i in range(1, m):
        for j in range(1, n):
            if dp[i-1][j] < dp[i][j-1]:  # From top is better
                dp[i][j] = dp[i-1][j] + grid[i][j]
                choice[i][j] = 'D'
            else:  # From left is better
                dp[i][j] = dp[i][j-1] + grid[i][j]
                choice[i][j] = 'R'
    
    # Backtrack to get path
    path = []
    i, j = m-1, n-1
    while i > 0 or j > 0:
        path.append(choice[i][j])
        if choice[i][j] == 'D':
            i -= 1
        else:
            j -= 1
    
    return path[::-1]  # Reverse to get start→end
```

---

### Tactic 6: Diagonal Movement Extension

If diagonal movement is allowed, add the diagonal dependency.

```python
# Allowing diagonal (down-right) movement
def unique_paths_with_diagonal(m, n):
    dp = [[1] * n for _ in range(m)]
    
    for i in range(1, m):
        for j in range(1, n):
            # From top + from left + from diagonal
            dp[i][j] = dp[i-1][j] + dp[i][j-1] + dp[i-1][j-1]
    
    return dp[m-1][n-1]
```

---

### Quick Reference

| Situation | Tactic |
|-----------|--------|
| Obstacles in first row/col | Break at first obstacle |
| Memory constrained | In-place or 1D array |
| Large grid, no obstacles | Combinatorics |
| Need actual path | Store direction choices |
| Overflow risk | Use modulo |
| Diagonal allowed | Add diagonal term |

<!-- back -->
