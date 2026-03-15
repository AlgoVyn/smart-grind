## Word Search - DFS + Backtracking

**Question:** Why do you need to mark visited cells during DFS?

<!-- front -->

---

## Word Search: DFS with Backtracking

### Problem
Find if word exists in grid by connecting adjacent letters.

### Algorithm
```python
def exist(board, word):
    rows, cols = len(board), len(board[0])
    
    def dfs(r, c, index):
        # Base case: found all letters
        if index == len(word):
            return True
        
        # Bounds check
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            board[r][c] != word[index]):
            return False
        
        # Mark as visited (temporarily)
        temp = board[r][c]
        board[r][c] = "#"  # Special character
        
        # Explore all 4 directions
        found = (dfs(r+1, c, index+1) or
                 dfs(r-1, c, index+1) or
                 dfs(r, c+1, index+1) or
                 dfs(r, c-1, index+1))
        
        # Backtrack: restore original value
        board[r][c] = temp
        
        return found
    
    # Try starting from each cell
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    
    return False
```

### Why Mark Visited?
- **Prevents cycles:** Can not reuse same cell in one path
- **Without marking:** Would revisit same cell infinitely
- **Backtracking restores:** Allows other paths to use the cell

### Complexity
- **Time:** O(M × N × 4^L) where L = word length
- **Space:** O(L) for recursion stack

### 💡 Optimization
Use a separate `visited` set for cleaner code (slightly slower)

<!-- back -->
