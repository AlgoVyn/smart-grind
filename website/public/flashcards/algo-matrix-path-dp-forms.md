## Title: Matrix Path DP Forms

What are the different forms and variations of matrix path DP?

<!-- front -->

---

### Path Variations
| Variation | Constraints | Approach |
|-----------|-------------|----------|
| With obstacles | Some cells blocked | dp[i][j] = 0 if blocked |
| Wrap around | Toroidal grid | Modulo indexing |
| 4-directional | Up, down, left, right | BFS or DFS with memo |
| Diagonal moves | 8 directions | Include diagonal in recurrence |
| Exactly k steps | Path length constraint | 3D DP or matrix expo |

### Longest Increasing Path
```python
def longest_increasing_path(matrix):
    """4-directional moves, strictly increasing"""
    if not matrix:
        return 0
    
    m, n = len(matrix), len(matrix[0])
    memo = [[0] * n for _ in range(m)]
    
    def dfs(i, j):
        if memo[i][j]:
            return memo[i][j]
        
        max_len = 1
        for di, dj in [(-1,0), (1,0), (0,-1), (0,1)]:
            ni, nj = i + di, j + dj
            if 0 <= ni < m and 0 <= nj < n and matrix[ni][nj] > matrix[i][j]:
                max_len = max(max_len, 1 + dfs(ni, nj))
        
        memo[i][j] = max_len
        return max_len
    
    return max(dfs(i, j) for i in range(m) for j in range(n))
```

---

### Dungeon Game
```python
def calculate_minimum_hp(dungeon):
    """Minimum health to reach princess (bottom-right)"""
    m, n = len(dungeon), len(dungeon[0])
    dp = [[float('inf')] * (n+1) for _ in range(m+1)]
    dp[m][n-1] = dp[m-1][n] = 1  # boundary
    
    for i in range(m-1, -1, -1):
        for j in range(n-1, -1, -1):
            need = min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]
            dp[i][j] = max(1, need)
    
    return dp[0][0]
```

---

### Cherry Pickup (Two Paths)
```python
def cherry_pickup(grid):
    """Two people go down, collect max cherries"""
    n = len(grid)
    # dp[r1][c1][c2] but use r1+c1 = r2+c2 = step
    dp = [[-float('inf')] * n for _ in range(n)]
    dp[0][0] = grid[0][0]
    
    for step in range(1, 2*n-1):
        new_dp = [[-float('inf')] * n for _ in range(n)]
        for r1 in range(max(0, step-n+1), min(n, step+1)):
            c1 = step - r1
            for r2 in range(r1, min(n, step+1)):
                c2 = step - r2
                if grid[r1][c1] == -1 or grid[r2][c2] == -1:
                    continue
                cherries = grid[r1][c1]
                if r1 != r2:
                    cherries += grid[r2][c2]
                for dr1 in [0, -1]:
                    for dr2 in [0, -1]:
                        if r1+dr1 >= 0 and r2+dr2 >= 0:
                            new_dp[r1][r2] = max(new_dp[r1][r2],
                                dp[r1+dr1][r2+dr2] + cherries)
        dp = new_dp
    
    return max(0, dp[n-1][n-1])
```

<!-- back -->
