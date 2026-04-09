## Backtracking - Word Search: Tactics

What are the advanced techniques for word search?

<!-- front -->

---

### Tactic 1: Trie-based Multi-word Search

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None  # Store complete word

def find_words(board, words):
    """Find multiple words using Trie."""
    # Build Trie
    root = TrieNode()
    for word in words:
        node = root
        for c in word:
            node = node.children.setdefault(c, TrieNode())
        node.word = word
    
    result = []
    m, n = len(board), len(board[0])
    
    def dfs(row, col, node):
        char = board[row][col]
        if char not in node.children:
            return
        
        child = node.children[char]
        if child.word:
            result.append(child.word)
            child.word = None  # Avoid duplicates
        
        board[row][col] = '#'  # Mark visited
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            nr, nc = row + dr, col + dc
            if 0 <= nr < m and 0 <= nc < n:
                dfs(nr, nc, child)
        board[row][col] = char  # Restore
    
    for i in range(m):
        for j in range(n):
            dfs(i, j, root)
    
    return result
```

---

### Tactic 2: Pruning by Word Length

```python
def exist_with_pruning(board, word):
    """Early termination optimizations."""
    # Check if board has enough of each character
    from collections import Counter
    board_count = Counter(c for row in board for c in row)
    word_count = Counter(word)
    
    for c, count in word_count.items():
        if board_count[c] < count:
            return False
    
    # Rest of standard solution...
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Not marking visited | Infinite loop | Temporarily modify cell |
| Not restoring | Wrong paths | Always backtrack |
| Wrong bounds check | Index error | Check before access |
| Diagonal movement | Wrong problem | Usually 4 directions only |

---

### Tactic 4: 8-Direction Search

```python
def exist_8_directions(board, word):
    """Allow diagonal movement."""
    directions = [(-1,-1), (-1,0), (-1,1),
                  (0,-1),          (0,1),
                  (1,-1),  (1,0),  (1,1)]
    
    def dfs(row, col, index):
        if index == len(word):
            return True
        if not (0 <= row < m and 0 <= col < n):
            return False
        if board[row][col] != word[index]:
            return False
        
        temp = board[row][col]
        board[row][col] = '#'
        
        for dr, dc in directions:
            if dfs(row + dr, col + dc, index + 1):
                board[row][col] = temp
                return True
        
        board[row][col] = temp
        return False
    
    # ... rest of implementation
```

<!-- back -->
