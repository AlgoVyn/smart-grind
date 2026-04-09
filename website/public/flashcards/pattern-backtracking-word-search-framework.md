## Backtracking - Word Search: Framework

What is the complete code template for word search in a grid?

<!-- front -->

---

### Framework 1: DFS with Backtracking

```
┌─────────────────────────────────────────────────────┐
│  WORD SEARCH - TEMPLATE                                │
├─────────────────────────────────────────────────────┤
│  1. For each cell in grid:                            │
│     a. If cell matches word[0]:                      │
│        - Start DFS from this cell                     │
│                                                        │
│  2. Define dfs(row, col, index):                     │
│     a. If index == len(word): return True             │
│     b. If out of bounds or mismatch: return False     │
│     c. Mark cell as visited (temp modify)             │
│     d. For each direction (up, down, left, right):  │
│        - If dfs(new_row, new_col, index+1):          │
│          return True                                  │
│     e. Restore cell (backtrack)                       │
│     f. Return False                                   │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def exist(board, word):
    """
    Check if word exists in grid.
    LeetCode 79
    Time: O(m×n×4^L), Space: O(L)
    """
    if not board or not board[0]:
        return False
    
    m, n = len(board), len(board[0])
    
    def dfs(row, col, index):
        if index == len(word):
            return True
        
        if (row < 0 or row >= m or col < 0 or col >= n or
            board[row][col] != word[index]):
            return False
        
        # Mark as visited
        temp = board[row][col]
        board[row][col] = '#'  # or any sentinel
        
        # Explore all 4 directions
        found = (dfs(row+1, col, index+1) or
                 dfs(row-1, col, index+1) or
                 dfs(row, col+1, index+1) or
                 dfs(row, col-1, index+1))
        
        # Restore (backtrack)
        board[row][col] = temp
        return found
    
    for i in range(m):
        for j in range(n):
            if board[i][j] == word[0]:
                if dfs(i, j, 0):
                    return True
    
    return False
```

---

### Key Pattern Elements

| Element | Purpose | Implementation |
|---------|---------|----------------|
| Mark visited | Prevent cycles | Temporarily modify cell |
| Restore | Enable backtracking | Revert after exploration |
| Directions | Explore neighbors | Check all 4 directions |
| Early exit | Optimization | Return True on first find |

<!-- back -->
