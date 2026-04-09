## Backtracking - Word Search Path Finding in Grid: Framework

What is the complete code template for word search path finding in a grid using DFS with backtracking?

<!-- front -->

---

### Framework 1: Standard DFS with In-place Grid Marking

```
┌─────────────────────────────────────────────────────────────────┐
│  WORD SEARCH / PATH FINDING IN GRID - TEMPLATE                       │
├─────────────────────────────────────────────────────────────────┤
│  Key Insight: DFS with backtracking + visited marking to prevent   │
│  cycles. Restore state after exploration.                          │
│                                                                     │
│  1. Iterate through each cell as potential starting point:         │
│     for i in range(rows):                                          │
│       for j in range(cols):                                        │
│         if backtrack(i, j, 0): return True                          │
│                                                                     │
│  2. Define backtrack(r, c, index):                                 │
│     a. Base case success:                                          │
│        if index == len(word): return True                           │
│                                                                     │
│     b. Base case failure (bounds or mismatch):                     │
│        if out_of_bounds or board[r][c] != word[index]:            │
│           return False                                             │
│                                                                     │
│     c. Mark visited:                                               │
│        temp = board[r][c]                                          │
│        board[r][c] = '#'  (sentinel value)                         │
│                                                                     │
│     d. Explore all 4 directions:                                   │
│        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:               │
│           if backtrack(r+dr, c+dc, index+1):                       │
│              return True                                           │
│                                                                     │
│     e. Backtrack - restore cell:                                   │
│        board[r][c] = temp                                          │
│        return False                                                │
│                                                                     │
│  3. Return False if no start cell works                           │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Standard Word Search

```python
def exist(board, word):
    """
    Check if word exists in the grid using DFS with backtracking.
    LeetCode 79 - Word Search
    Time: O(m × n × 4^L), Space: O(L) recursion
    """
    if not board or not board[0]:
        return False
    
    rows, cols = len(board), len(board[0])
    
    def backtrack(r, c, index):
        # Base case: found the entire word
        if index == len(word):
            return True
        
        # Check bounds and character match
        if (r < 0 or r >= rows or c < 0 or c >= cols or 
            board[r][c] != word[index]):
            return False
        
        # Mark as visited (in-place modification)
        temp = board[r][c]
        board[r][c] = '#'  # Use sentinel value
        
        # Explore all 4 directions
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        for dr, dc in directions:
            if backtrack(r + dr, c + dc, index + 1):
                return True
        
        # Backtrack: restore the cell
        board[r][c] = temp
        return False
    
    # Try starting from each cell
    for i in range(rows):
        for j in range(cols):
            if backtrack(i, j, 0):
                return True
    
    return False
```

---

### Framework 2: DFS with Separate Visited Set

```python
def exist_with_visited(board, word):
    """
    Check if word exists using a separate visited set.
    Use when board cannot be modified.
    Time: O(m × n × 4^L), Space: O(L) for recursion + O(L) for visited
    """
    if not board or not board[0]:
        return False
    
    rows, cols = len(board), len(board[0])
    
    def backtrack(r, c, index, visited):
        if index == len(word):
            return True
        
        if (r < 0 or r >= rows or c < 0 or c >= cols or 
            (r, c) in visited or board[r][c] != word[index]):
            return False
        
        visited.add((r, c))
        
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        for dr, dc in directions:
            if backtrack(r + dr, c + dc, index + 1, visited):
                return True
        
        visited.remove((r, c))  # Backtrack
        return False
    
    for i in range(rows):
        for j in range(cols):
            if backtrack(i, j, 0, set()):
                return True
    
    return False
```

---

### Key Pattern Elements

| Element | Purpose | Complexity |
|---------|---------|------------|
| `index` | Position in word being matched | Tracks progress |
| `temp = board[r][c]` | Save original value | O(1) per cell |
| `board[r][c] = '#'` | Mark visited in-place | Prevents cycles |
| `board[r][c] = temp` | Restore after exploration | Enables backtracking |
| 4 directions | Up, Down, Left, Right | Standard grid movement |
| Double loop start | Try every cell as start | O(m × n) attempts |

---

### Complexity Analysis

| Complexity | Value | Explanation |
|------------|-------|-------------|
| **Time** | O(m × n × 4^L) | Try each cell × 4 directions^L steps |
| **Space** | O(L) | Recursion stack depth equals word length |

Where:
- `m`, `n` = grid dimensions (rows × cols)
- `L` = length of word being searched
- `4^L` = exploring 4 directions at each of L steps

<!-- back -->
