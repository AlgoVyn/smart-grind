## DP - 2D Array (Unique Paths on Grid): Problem Forms

What are the variations and applications of unique paths on grid?

<!-- front -->

---

### Form 1: Unique Paths II (With Obstacles)

Count paths when some cells are blocked.

```python
def unique_paths_with_obstacles(obstacle_grid):
    """
    LeetCode 63 - Unique Paths II
    """
    if not obstacle_grid or obstacle_grid[0][0] == 1:
        return 0
    
    m, n = len(obstacle_grid), len(obstacle_grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = 1
    
    # First column
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] if obstacle_grid[i][0] == 0 else 0
    
    # First row
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] if obstacle_grid[0][j] == 0 else 0
    
    # Fill rest
    for i in range(1, m):
        for j in range(1, n):
            if obstacle_grid[i][j] == 0:
                dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]
```

---

### Form 2: Minimum Path Sum

Find path with minimum total weight.

```python
def min_path_sum(grid):
    """
    LeetCode 64 - Minimum Path Sum
    """
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]
    
    # First column
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] + grid[i][0]
    
    # First row
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] + grid[0][j]
    
    # Fill with min
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
    
    return dp[m-1][n-1]
```

---

### Form 3: Dungeon Game (Minimum Initial Health)

Work backwards from destination to find minimum starting health.

```python
def calculate_minimum_hp(dungeon):
    """
    LeetCode 174 - Dungeon Game
    Work backwards from princess (bottom-right)
    """
    m, n = len(dungeon), len(dungeon[0])
    # dp[i][j] = minimum health needed to survive from (i,j) to end
    dp = [[float('inf')] * (n + 1) for _ in range(m + 1)]
    
    # Base: need 1 health at destination
    dp[m][n-1] = dp[m-1][n] = 1
    
    for i in range(m-1, -1, -1):
        for j in range(n-1, -1, -1):
            # Need enough health to survive current cell
            need = min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]
            dp[i][j] = max(1, need)  # At least 1 health
    
    return dp[0][0]
```

---

### Form 4: Out of Boundary Paths

Count paths that exit the grid within K moves.

```python
def find_paths_out_of_boundary(m, n, max_move, start_row, start_col):
    """
    LeetCode 576 - Out of Boundary Paths
    """
    MOD = 10**9 + 7
    # dp[k][i][j] = ways to be at (i,j) after k moves
    # Use 2D rolling array
    
    dp = [[0] * n for _ in range(m)]
    dp[start_row][start_col] = 1
    result = 0
    
    for _ in range(max_move):
        new_dp = [[0] * n for _ in range(m)]
        for i in range(m):
            for j in range(n):
                if dp[i][j] > 0:
                    # Try all 4 directions
                    for di, dj in [(-1,0), (1,0), (0,-1), (0,1)]:
                        ni, nj = i + di, j + dj
                        if 0 <= ni < m and 0 <= nj < n:
                            new_dp[ni][nj] = (new_dp[ni][nj] + dp[i][j]) % MOD
                        else:
                            # Out of boundary - count it
                            result = (result + dp[i][j]) % MOD
        dp = new_dp
    
    return result
```

---

### Form 5: Cherry Pickup (Two Paths Simultaneously)

Two people collect cherries walking from top-left to bottom-right simultaneously.

```python
def cherry_pickup(grid):
    """
    LeetCode 741 - Cherry Pickup
    Both walkers move together (same steps = same diagonal)
    """
    n = len(grid)
    # dp[k][i1][i2] = max cherries when:
    # walker 1 is at (i1, k-i1), walker 2 is at (i2, k-i2)
    # where k = total steps taken (i + j)
    
    dp = [[[-1] * n for _ in range(n)] for _ in range(2*n-1)]
    dp[0][0][0] = grid[0][0]
    
    for k in range(1, 2*n - 1):
        for i1 in range(max(0, k-n+1), min(n, k+1)):
            for i2 in range(max(0, k-n+1), min(n, k+1)):
                j1, j2 = k - i1, k - i2
                
                # Skip if either cell is blocked
                if grid[i1][j1] == -1 or grid[i2][j2] == -1:
                    continue
                
                # Max from previous positions
                prev_max = -1
                for di1 in [0, -1]:
                    for di2 in [0, -1]:
                        pi1, pi2 = i1 + di1, i2 + di2
                        if pi1 >= 0 and pi2 >= 0 and dp[k-1][pi1][pi2] >= 0:
                            prev_max = max(prev_max, dp[k-1][pi1][pi2])
                
                if prev_max < 0:
                    continue
                
                # Add cherries (avoid double-count if same cell)
                cherries = grid[i1][j1]
                if i1 != i2:
                    cherries += grid[i2][j2]
                
                dp[k][i1][i2] = prev_max + cherries
    
    return max(0, dp[2*n-2][n-1][n-1])
```

---

### Form 6: Knight Probability in Chessboard

Probability that knight remains on board after K moves.

```python
def knight_probability(n, k, row, col):
    """
    LeetCode 688 - Knight Probability in Chessboard
    """
    # dp[step][i][j] = probability of being at (i,j) after step moves
    dp = [[0] * n for _ in range(n)]
    dp[row][col] = 1.0
    
    moves = [(-2,-1), (-2,1), (-1,-2), (-1,2),
             (1,-2), (1,2), (2,-1), (2,1)]
    
    for _ in range(k):
        new_dp = [[0] * n for _ in range(n)]
        for i in range(n):
            for j in range(n):
                if dp[i][j] > 0:
                    for di, dj in moves:
                        ni, nj = i + di, j + dj
                        if 0 <= ni < n and 0 <= nj < n:
                            new_dp[ni][nj] += dp[i][j] / 8.0
        dp = new_dp
    
    # Sum all probabilities
    return sum(sum(row) for row in dp)
```

---

### Summary of Variations

| Problem | Key Twist | Approach |
|---------|-----------|----------|
| **Unique Paths II** | Obstacles | Set blocked cells to 0 |
| **Minimum Path Sum** | Weighted cells | Use `min()` + weight |
| **Dungeon Game** | Minimum to survive | Work backwards |
| **Out of Boundary** | Exit conditions | Count boundary exits |
| **Cherry Pickup** | Two simultaneous paths | 3D DP (step, pos1, pos2) |
| **Knight Probability** | Random walk | Probability DP |

<!-- back -->
