## Title: Word Search Grid - Problem Forms

What are the standard problem forms for Word Search on grids?

<!-- front -->

---

### Form 1: Single Word Search

**Pattern:** Determine if one word exists in grid

```python
def exist(board: List[List[str]], word: str) -> bool:
    m, n = len(board), len(board[0])
    
    def dfs(r, c, idx):
        if idx == len(word):
            return True
        if not (0 <= r < m and 0 <= c < n):
            return False
        if board[r][c] != word[idx]:
            return False
        
        temp, board[r][c] = board[r][c], '#'
        found = any(dfs(r+dr, c+dc, idx+1) 
                   for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)])
        board[r][c] = temp
        return found
    
    return any(board[r][c] == word[0] and dfs(r, c, 0)
               for r in range(m) for c in range(n))
```

| Optimization | Impact |
|--------------|--------|
| Character count check | Early rejection |
| Reverse search | Start from rarer end |
| Prune on first find | Stop immediately |

---

### Form 2: Multiple Words (Dictionary)

**Pattern:** Find all words from dictionary in grid

```python
def findWords(board: List[List[str]], words: List[str]) -> List[str]:
    # Build Trie from all words
    root = TrieNode()
    for word in words:
        node = root
        for c in word:
            node = node.children.setdefault(c, TrieNode())
        node.word = word
    
    m, n = len(board), len(board[0])
    result = []
    
    def dfs(r, c, node):
        if not (0 <= r < m and 0 <= c < n):
            return
        char = board[r][c]
        if char == '#' or char not in node.children:
            return
        
        next_node = node.children[char]
        if next_node.word:
            result.append(next_node.word)
            next_node.word = None
        
        board[r][c] = '#'
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            dfs(r+dr, c+dc, next_node)
        board[r][c] = char
        
        # Prune: remove if no more words below
        if not next_node.children and not next_node.word:
            node.children.pop(char)
    
    for r in range(m):
        for c in range(n):
            dfs(r, c, root)
    
    return result
```

---

### Form 3: Shortest Word Path

**Pattern:** Find minimum path length to spell word

```python
def shortest_path(board: List[List[str]], word: str) -> int:
    from collections import deque
    
    m, n = len(board), len(board[0])
    min_len = float('inf')
    
    def bfs_from(start_r, start_c):
        # BFS for shortest path from specific start
        queue = deque([(start_r, start_c, 0, {(start_r, start_c)})])
        
        while queue:
            r, c, idx, visited = queue.popleft()
            
            if idx == len(word) - 1:
                return len(visited)
            
            for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
                nr, nc = r + dr, c + dc
                if (0 <= nr < m and 0 <= nc < n and 
                    (nr, nc) not in visited and 
                    board[nr][nc] == word[idx + 1]):
                    new_visited = visited | {(nr, nc)}
                    queue.append((nr, nc, idx + 1, new_visited))
        
        return float('inf')
    
    for r in range(m):
        for c in range(n):
            if board[r][c] == word[0]:
                min_len = min(min_len, bfs_from(r, c))
    
    return min_len if min_len != float('inf') else -1
```

---

### Form 4: Snake Pattern (No Immediate Backtrack)

**Pattern:** Can turn but cannot immediately reverse direction

```python
def snake_search(board: List[List[str]], word: str) -> bool:
    m, n = len(board), len(board[0])
    
    def dfs(r, c, idx, prev_dir):
        if idx == len(word):
            return True
        if not (0 <= r < m and 0 <= c < n):
            return False
        if board[r][c] != word[idx]:
            return False
        
        temp = board[r][c]
        board[r][c] = '#'
        
        for i, (dr, dc) in enumerate([(-1,0), (1,0), (0,-1), (0,1)]):
            # Skip immediate backtrack (opposite direction)
            if prev_dir is not None and i == (prev_dir ^ 1):
                continue
            if dfs(r+dr, c+dc, idx+1, i):
                board[r][c] = temp
                return True
        
        board[r][c] = temp
        return False
    
    return any(board[r][c] == word[0] and dfs(r, c, 0, None)
               for r in range(m) for c in range(n))
```

---

### Form 5: With Wildcards/Blanks

**Pattern:** Some cells are wildcards matching any character

```python
def exist_with_wildcard(board: List[List[str]], word: str) -> bool:
    m, n = len(board), len(board[0])
    WILDCARD = '*'
    
    def dfs(r, c, idx):
        if idx == len(word):
            return True
        if not (0 <= r < m and 0 <= c < n):
            return False
        if board[r][c] != WILDCARD and board[r][c] != word[idx]:
            return False
        
        temp = board[r][c]
        board[r][c] = '#'
        
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            if dfs(r+dr, c+dc, idx+1):
                board[r][c] = temp
                return True
        
        board[r][c] = temp
        return False
    
    # Try starting from word[0] or wildcards
    for r in range(m):
        for c in range(n):
            if board[r][c] in (word[0], WILDCARD):
                if dfs(r, c, 0):
                    return True
    return False
```

<!-- back -->
