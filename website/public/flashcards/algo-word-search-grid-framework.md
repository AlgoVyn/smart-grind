## Title: Word Search Grid - Framework

What is the standard DFS/Backtracking framework for Word Search?

<!-- front -->

---

### Basic DFS Framework

```python
def exist(board: List[List[str]], word: str) -> bool:
    if not board or not board[0]:
        return False
    
    m, n = len(board), len(board[0])
    
    # Pre-check: character frequency
    from collections import Counter
    board_count = Counter()
    for row in board:
        board_count.update(row)
    
    word_count = Counter(word)
    for char, count in word_count.items():
        if board_count[char] < count:
            return False
    
    # Optimization: search from less frequent end
    if board_count[word[-1]] < board_count[word[0]]:
        word = word[::-1]
    
    def dfs(r: int, c: int, idx: int) -> bool:
        # Base case: all characters matched
        if idx == len(word):
            return True
        
        # Check bounds and match
        if r < 0 or r >= m or c < 0 or c >= n:
            return False
        if board[r][c] != word[idx]:
            return False
        
        # Mark visited
        temp = board[r][c]
        board[r][c] = '#'  # Mark as visited
        
        # Explore all 4 directions
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            if dfs(r + dr, c + dc, idx + 1):
                board[r][c] = temp  # Restore before return
                return True
        
        # Backtrack
        board[r][c] = temp
        return False
    
    # Try starting from each cell matching first char
    for r in range(m):
        for c in range(n):
            if board[r][c] == word[0] and dfs(r, c, 0):
                return True
    
    return False
```

---

### Framework Components

| Component | Purpose |
|-----------|---------|
| **Pre-check** | Early rejection if chars insufficient |
| **Direction choice** | Try from less frequent end |
| **In-place marking** | O(1) space for visited |
| **Backtracking** | Unmark to allow other paths |
| **Early termination** | Return True immediately on success |

---

### Multiple Words Framework (Word Search II)

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None  # Store complete word at end

def findWords(board: List[List[str]], words: List[str]) -> List[str]:
    # Build Trie
    root = TrieNode()
    for word in words:
        node = root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.word = word
    
    m, n = len(board), len(board[0])
    result = []
    
    def dfs(r, c, node):
        char = board[r][c]
        if char not in node.children:
            return
        
        next_node = node.children[char]
        
        # Found a word
        if next_node.word:
            result.append(next_node.word)
            next_node.word = None  # Avoid duplicates
        
        # Mark visited
        board[r][c] = '#'
        
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and board[nr][nc] != '#':
                dfs(nr, nc, next_node)
        
        # Backtrack
        board[r][c] = char
        
        # Prune: remove leaf nodes
        if not next_node.children:
            node.children.pop(char)
    
    for r in range(m):
        for c in range(n):
            dfs(r, c, root)
    
    return result
```

---

### Space Optimization Patterns

| Method | Space | Trade-off |
|--------|-------|-----------|
| **In-place marking** | O(1) extra | Modifies board |
| **Separate visited set** | O(m×n) | Clean, thread-safe |
| **Bitmask (small grid)** | O(1) | Only for m×n ≤ 64 |

```python
# Separate visited for immutable board
def exist_with_visited(board, word):
    m, n = len(board), len(board[0])
    visited = [[False] * n for _ in range(m)]
    
    def dfs(r, c, idx):
        if idx == len(word):
            return True
        if not (0 <= r < m and 0 <= c < n):
            return False
        if visited[r][c] or board[r][c] != word[idx]:
            return False
        
        visited[r][c] = True
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            if dfs(r + dr, c + dc, idx + 1):
                visited[r][c] = False
                return True
        visited[r][c] = False
        return False
```

<!-- back -->
