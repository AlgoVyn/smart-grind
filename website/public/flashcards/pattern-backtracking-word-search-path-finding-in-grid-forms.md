## Backtracking - Word Search Path Finding in Grid: Forms

What are the different variations of word search and grid path finding?

<!-- front -->

---

### Form 1: Standard Word Search (Boolean)

**Problem:** Return True if word exists in grid

```python
def exist(board, word):
    """
    LeetCode 79 - Word Search
    Return True if word exists, False otherwise.
    """
    rows, cols = len(board), len(board[0])
    
    def backtrack(r, c, index):
        if index == len(word):
            return True
        if (r < 0 or r >= rows or c < 0 or c >= cols or 
            board[r][c] != word[index]):
            return False
        
        temp = board[r][c]
        board[r][c] = '#'
        
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            if backtrack(r + dr, c + dc, index + 1):
                board[r][c] = temp
                return True
        
        board[r][c] = temp
        return False
    
    for i in range(rows):
        for j in range(cols):
            if backtrack(i, j, 0):
                return True
    return False
```

**Returns:** `bool` - existence of word

---

### Form 2: Word Search II (Multiple Words with Trie)

**Problem:** Find all words from a list that exist in grid

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None

def findWords(board, words):
    """
    LeetCode 212 - Word Search II
    Return list of all found words.
    """
    # Build Trie
    root = TrieNode()
    for word in words:
        node = root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.word = word
    
    rows, cols = len(board), len(board[0])
    result = []
    
    def dfs(r, c, node):
        char = board[r][c]
        if char == '#' or char not in node.children:
            return
        
        next_node = node.children[char]
        if next_node.word:
            result.append(next_node.word)
            next_node.word = None
        
        board[r][c] = '#'
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                dfs(nr, nc, next_node)
        board[r][c] = char
    
    for i in range(rows):
        for j in range(cols):
            dfs(i, j, root)
    
    return result
```

**Returns:** `List[str]` - all found words

---

### Form 3: Path with Maximum Gold (Value Collection)

**Problem:** Find path collecting maximum gold (cells have values)

```python
def getMaximumGold(grid):
    """
    LeetCode 1219 - Path with Maximum Gold
    Return maximum gold collectible.
    """
    rows, cols = len(grid), len(grid[0])
    max_gold = 0
    
    def dfs(r, c, current_gold):
        nonlocal max_gold
        
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == 0:
            max_gold = max(max_gold, current_gold)
            return
        
        gold_here = grid[r][c]
        grid[r][c] = 0  # Mark visited
        
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            dfs(r + dr, c + dc, current_gold + gold_here)
        
        grid[r][c] = gold_here  # Restore
    
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] != 0:
                dfs(i, j, 0)
    
    return max_gold
```

**Returns:** `int` - maximum gold value

---

### Form 4: Unique Paths III (Hamiltonian Path)

**Problem:** Count paths visiting all empty cells exactly once

```python
def uniquePathsIII(grid):
    """
    LeetCode 980 - Unique Paths III
    Return count of valid paths.
    """
    rows, cols = len(grid), len(grid[0])
    
    # Find start, end, count empty cells
    start_r = start_c = 0
    empty_cells = 0
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:  # Start
                start_r, start_c = r, c
                empty_cells += 1
            elif grid[r][c] == 2:  # End
                pass  # Just need position
            elif grid[r][c] == 0:  # Empty
                empty_cells += 1
    
    def dfs(r, c, visited_count):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == -1:
            return 0
        
        if grid[r][c] == 2:
            return 1 if visited_count == empty_cells else 0
        
        grid[r][c] = -1  # Mark visited
        paths = 0
        
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            paths += dfs(r + dr, c + dc, visited_count + 1)
        
        grid[r][c] = 0  # Restore
        return paths
    
    return dfs(start_r, start_c, 1)
```

**Returns:** `int` - count of valid complete paths

---

### Form 5: Flood Fill (Simple DFS without Backtracking)

**Problem:** Fill connected region with new color

```python
def floodFill(image, sr, sc, color):
    """
    LeetCode 733 - Flood Fill
    Return modified image with filled region.
    """
    rows, cols = len(image), len(image[0])
    original_color = image[sr][sc]
    
    if original_color == color:
        return image
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if image[r][c] != original_color:
            return
        
        image[r][c] = color  # Fill
        
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            dfs(r + dr, c + dc)
    
    dfs(sr, sc)
    return image
```

**Key difference:** No backtracking needed - we're filling, not searching

**Returns:** `List[List[int]]` - modified image

---

### Form Comparison

| Form | Input | Output | Backtracking | Key Feature |
|------|-------|--------|--------------|-------------|
| **Standard** | board, word | bool | Yes | Existence check |
| **Word Search II** | board, words[] | List[str] | Yes | Trie optimization |
| **Max Gold** | value grid | int | Yes | Accumulate values |
| **Unique Paths III** | grid with start/end | int | Yes | Hamiltonian path count |
| **Flood Fill** | image, start, color | image | No | Simple fill |

---

### Return Type Decision Guide

```
                    What is the question asking?
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    Existence?        Multiple results?    Optimization?
        │                  │                  │
    Return BOOL      Return LIST          Return MAX/MIN
    (Word Search)    (Word Search II)     (Max Gold)
        │                  │                  │
                           │
                    Count valid paths?
                           │
                      Return INT
                    (Unique Paths III)
```

<!-- back -->
