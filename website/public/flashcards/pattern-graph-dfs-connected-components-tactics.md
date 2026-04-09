## Graph DFS - Connected Components: Tactics

What are the advanced techniques for DFS connected components?

<!-- front -->

---

### Tactic 1: Surrounded Regions

```python
def solve(board):
    """Capture surrounded regions (flip O to X)."""
    if not board: return
    m, n = len(board), len(board[0])
    
    # Mark border-connected O's
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or board[r][c] != 'O':
            return
        board[r][c] = 'T'  # Temporary mark
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)
    
    # Start from border
    for i in range(m):
        dfs(i, 0)
        dfs(i, n-1)
    for j in range(n):
        dfs(0, j)
        dfs(m-1, j)
    
    # Flip: O→X (surrounded), T→O (border-connected)
    for i in range(m):
        for j in range(n):
            if board[i][j] == 'O':
                board[i][j] = 'X'
            elif board[i][j] == 'T':
                board[i][j] = 'O'
```

---

### Tactic 2: Flood Fill

```python
def flood_fill(image, sr, sc, new_color):
    """Replace connected region with new color."""
    old_color = image[sr][sc]
    if old_color == new_color:
        return image
    
    def dfs(r, c):
        if r < 0 or r >= len(image) or c < 0 or c >= len(image[0]):
            return
        if image[r][c] != old_color:
            return
        image[r][c] = new_color
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)
    
    dfs(sr, sc)
    return image
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Stack overflow | Deep recursion | Use BFS for deep |
| Not checking bounds | Crash | Always validate |
| Infinite recursion | No return | Check visited first |
| Modifying while iterating | Errors | Mark before recurse |

<!-- back -->
