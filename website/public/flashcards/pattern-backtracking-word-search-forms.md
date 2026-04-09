## Backtracking - Word Search: Forms

What are the different variations of word search?

<!-- front -->

---

### Form 1: Standard 4-Direction

```python
def exist(board, word):
    """Standard 4-direction search."""
    m, n = len(board), len(board[0])
    
    def dfs(r, c, idx):
        if idx == len(word): return True
        if not (0 <= r < m and 0 <= c < n) or board[r][c] != word[idx]:
            return False
        
        temp, board[r][c] = board[r][c], '#'
        found = (dfs(r+1, c, idx+1) or dfs(r-1, c, idx+1) or
                 dfs(r, c+1, idx+1) or dfs(r, c-1, idx+1))
        board[r][c] = temp
        return found
    
    for i in range(m):
        for j in range(n):
            if dfs(i, j, 0): return True
    return False
```

---

### Form 2: With Visited Set

```python
def exist_set(board, word):
    """Using separate visited set."""
    m, n = len(board), len(board[0])
    visited = set()
    
    def dfs(r, c, idx):
        if idx == len(word): return True
        if not (0 <= r < m and 0 <= c < n): return False
        if (r,c) in visited or board[r][c] != word[idx]: return False
        
        visited.add((r,c))
        for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
            if dfs(r+dr, c+dc, idx+1):
                return True
        visited.remove((r,c))
        return False
    
    for i in range(m):
        for j in range(n):
            if dfs(i, j, 0): return True
    return False
```

---

### Form 3: 8-Direction

```python
def exist_8(board, word):
    """8-direction search (includes diagonals)."""
    directions = [(-1,-1), (-1,0), (-1,1),
                  (0,-1),         (0,1),
                  (1,-1),  (1,0),  (1,1)]
    # ... rest similar to standard
```

---

### Form Comparison

| Form | Directions | Use Case |
|------|------------|----------|
| Standard | 4 | Most problems |
| With set | 4 | Can't modify board |
| 8-direction | 8 | Special requirements |

<!-- back -->
