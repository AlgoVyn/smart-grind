## Backtracking - Word Search Path Finding in Grid: Tactics

What are practical tactics for optimizing and solving Word Search variations?

<!-- front -->

---

### Tactic 1: Frequency-Based Start Selection

**Pattern:** Search from the rarer end of the word to reduce branching

```python
def exist_optimized(board, word):
    """
    Optimization: Start from the less frequent character end.
    Reduces the number of DFS starting points.
    """
    from collections import Counter
    
    # Count character frequencies in board
    flat_board = ''.join(''.join(row) for row in board)
    board_freq = Counter(flat_board)
    
    # Quick rejection: board lacks required characters
    word_freq = Counter(word)
    for char, count in word_freq.items():
        if board_freq[char] < count:
            return False
    
    # Optimization: search from rarer end
    # Fewer starting cells = less DFS work
    if board_freq[word[-1]] < board_freq[word[0]]:
        word = word[::-1]  # Reverse the word
    
    # Standard DFS from here...
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
                board[r][c] = temp  # Early restore not needed (returning)
                return True
        
        board[r][c] = temp
        return False
    
    for i in range(rows):
        for j in range(cols):
            if backtrack(i, j, 0):
                return True
    return False
```

**Benefit:** If 'X' appears 1 time and 'A' appears 20 times, starting from 'X' reduces DFS calls significantly.

---

### Tactic 2: Trie Pruning for Multiple Words (Word Search II)

**Pattern:** Build a Trie from all target words, then DFS with pruning

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None  # Store complete word at end node

def findWords(board, words):
    """
    Find multiple words in grid using Trie + DFS.
    LeetCode 212 - Word Search II
    """
    # Build Trie
    root = TrieNode()
    for word in words:
        node = root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.word = word  # Mark word completion
    
    rows, cols = len(board), len(board[0])
    result = []
    
    def dfs(r, c, node):
        char = board[r][c]
        if char == '#' or char not in node.children:
            return
        
        next_node = node.children[char]
        
        # Found a complete word
        if next_node.word:
            result.append(next_node.word)
            next_node.word = None  # Avoid duplicates
        
        # Pruning: remove leaf nodes
        if not next_node.children:
            node.children.pop(char)
            return
        
        board[r][c] = '#'  # Mark visited
        
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                dfs(nr, nc, next_node)
        
        board[r][c] = char  # Restore
    
    for i in range(rows):
        for j in range(cols):
            dfs(i, j, root)
    
    return result
```

**Benefit:** 
- Eliminates redundant DFS for shared prefixes
- Prunes dead branches early (no words with current prefix)
- Reduces time complexity significantly for multiple words

---

### Tactic 3: Bitmask for Small Grids (≤ 64 cells)

**Pattern:** Use bit manipulation for O(1) visited tracking

```python
def exist_bitmask(board, word):
    """
    Use when m*n <= 64 (fits in a 64-bit integer).
    O(1) visited state copy vs O(L) for set copy.
    """
    m, n = len(board), len(board[0])
    total_cells = m * n
    
    def get_id(r, c):
        return r * n + c
    
    def dfs(r, c, idx, visited_mask):
        if idx == len(word):
            return True
        if not (0 <= r < m and 0 <= c < n):
            return False
        
        cell_id = get_id(r, c)
        # Check if already visited using bit mask
        if visited_mask & (1 << cell_id):
            return False
        if board[r][c] != word[idx]:
            return False
        
        # Set bit for visited
        new_mask = visited_mask | (1 << cell_id)
        
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            if dfs(r + dr, c + dc, idx + 1, new_mask):
                return True
        return False
    
    for r in range(m):
        for c in range(n):
            if board[r][c] == word[0]:
                if dfs(r, c, 0, 0):  # Start with empty mask
                    return True
    return False
```

**Benefit:** O(1) copy of visited state (integer) vs O(L) for hash set operations.

---

### Tactic 4: Path with Maximum Gold (Collect Values)

**Pattern:** Track accumulated value and find maximum

```python
def getMaximumGold(grid):
    """
    Find path collecting maximum gold.
    LeetCode 1219 - Path with Maximum Gold
    """
    rows, cols = len(grid), len(grid[0])
    max_gold = 0
    
    def dfs(r, c, current_gold):
        nonlocal max_gold
        
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == 0:
            max_gold = max(max_gold, current_gold)
            return
        
        gold_here = grid[r][c]
        grid[r][c] = 0  # Mark as visited (0 = empty)
        
        # Explore all 4 directions
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            dfs(r + dr, c + dc, current_gold + gold_here)
        
        grid[r][c] = gold_here  # Restore
    
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] != 0:  # Start from non-empty cells
                dfs(i, j, 0)
    
    return max_gold
```

**Key differences from word search:**
- No target sequence to match
- Track accumulated value
- Update global maximum at each dead end
- Can start from any non-zero cell

---

### Tactic 5: Unique Paths III (Visit All Empty Cells)

**Pattern:** Count paths that visit every empty cell exactly once

```python
def uniquePathsIII(grid):
    """
    Count paths from start to end visiting all empty cells.
    LeetCode 980 - Unique Paths III
    """
    rows, cols = len(grid), len(grid[0])
    
    # Find start, end, and count empty cells
    start_r = start_c = end_r = end_c = 0
    empty_cells = 0
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:  # Start
                start_r, start_c = r, c
                empty_cells += 1
            elif grid[r][c] == 2:  # End
                end_r, end_c = r, c
            elif grid[r][c] == 0:  # Empty
                empty_cells += 1
    
    def dfs(r, c, visited_count):
        # Hit obstacle or boundary
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == -1:
            return 0
        
        # Reached end
        if r == end_r and c == end_c:
            # Valid only if all empty cells visited
            return 1 if visited_count == empty_cells else 0
        
        # Mark visited
        grid[r][c] = -1
        
        paths = 0
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            paths += dfs(r + dr, c + dc, visited_count + 1)
        
        # Restore
        grid[r][c] = 0
        return paths
    
    return dfs(start_r, start_c, 1)
```

**Key insight:** Track visited count and ensure all empty cells are covered before reaching the end.

---

### Tactic Comparison

| Tactic | Use Case | Key Benefit |
|--------|----------|-------------|
| **Frequency Start** | Single word search | Reduce DFS starting points |
| **Trie Pruning** | Multiple words | Eliminate redundant work |
| **Bitmask** | Small grids (≤64 cells) | O(1) visited state copy |
| **Max Gold** | Value collection | Track accumulated metrics |
| **Unique Paths** | Hamiltonian path | Count valid complete paths |

<!-- back -->
