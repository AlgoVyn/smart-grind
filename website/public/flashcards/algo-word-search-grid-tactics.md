## Title: Word Search Grid - Tactics

What are practical tactics for solving Word Search variations?

<!-- front -->

---

### Tactic 1: Trie Pruning for Multiple Words

**Pattern:** Remove matched words and prune dead branches from Trie

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None
        self.count = 0  # Track words in subtree

def findWords_optimized(board, words):
    # Build Trie with count tracking
    root = TrieNode()
    for word in words:
        node = root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
            node.count += 1
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
            # Decrement count up the tree
            temp = next_node
            while temp:
                temp.count -= 1
                temp = temp.parent if hasattr(temp, 'parent') else None
        
        board[r][c] = '#'
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            dfs(r+dr, c+dc, next_node)
        board[r][c] = char
        
        # Prune: remove if no more words below
        if next_node.count == 0:
            node.children.pop(char)
    
    for r in range(m):
        for c in range(n):
            dfs(r, c, root)
    
    return result
```

**Benefit:** Pruning eliminates entire subtrees once all words found.

---

### Tactic 2: Frequency-Based Start Selection

**Pattern:** Start DFS from less frequent characters

```python
def exist_optimized(board, word):
    from collections import Counter
    
    # Count character frequencies
    flat_board = ''.join(''.join(row) for row in board)
    board_freq = Counter(flat_board)
    
    # Quick rejection
    word_freq = Counter(word)
    for char, count in word_freq.items():
        if board_freq[char] < count:
            return False
    
    # Optimization: search from rarer end
    if board_freq[word[-1]] < board_freq[word[0]]:
        word = word[::-1]
    
    # Try starting cells in order of frequency
    # Less frequent = fewer starting points = faster
    def get_start_cells(char):
        cells = []
        for r in range(len(board)):
            for c in range(len(board[0])):
                if board[r][c] == char:
                    cells.append((r, c))
        return cells
    
    # ... rest of DFS
```

---

### Tactic 3: A* Heuristic for Long Words

**Pattern:** Use heuristic to prioritize promising paths

```python
import heapq

def exist_astar(board, word):
    m, n = len(board), len(board[0])
    
    def heuristic(r, c, idx):
        # Estimate: Manhattan distance to cells with next char
        next_char = word[idx + 1] if idx + 1 < len(word) else None
        if not next_char:
            return 0
        
        min_dist = float('inf')
        for i in range(m):
            for j in range(n):
                if board[i][j] == next_char:
                    dist = abs(r - i) + abs(c - j)
                    min_dist = min(min_dist, dist)
        return min_dist
    
    def dfs_astar(r, c, idx, visited):
        if idx == len(word) - 1:
            return True
        
        # Priority queue: (heuristic + steps, steps, r, c)
        pq = []
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            nr, nc = r + dr, c + dc
            if (0 <= nr < m and 0 <= nc < n and 
                (nr, nc) not in visited and
                board[nr][nc] == word[idx + 1]):
                h = heuristic(nr, nc, idx + 1)
                heapq.heappush(pq, (h, nr, nc))
        
        while pq:
            _, nr, nc = heapq.heappop(pq)
            if dfs_astar(nr, nc, idx + 1, visited | {(nr, nc)}):
                return True
        return False
```

---

### Tactic 4: Parallel Search for Multiple Starts

**Pattern:** When many starting points, use iterative deepening

```python
def exist_iddfs(board, word):
    """Iterative Deepening DFS for long words"""
    m, n = len(board), len(board[0])
    
    def dls(r, c, idx, depth_limit, visited):
        """Depth Limited Search"""
        if idx == len(word):
            return True
        if depth_limit == 0:
            return False
        
        if not (0 <= r < m and 0 <= c < n):
            return False
        if (r, c) in visited or board[r][c] != word[idx]:
            return False
        
        new_visited = visited | {(r, c)}
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            if dls(r+dr, c+dc, idx+1, depth_limit-1, new_visited):
                return True
        return False
    
    # Try increasing depth limits
    for max_depth in range(len(word), m * n + 1):
        for r in range(m):
            for c in range(n):
                if board[r][c] == word[0]:
                    if dls(r, c, 0, max_depth, set()):
                        return True
    return False
```

---

### Tactic 5: Bitmask for Small Boards

**Pattern:** Use bitmask for O(1) visited tracking

```python
def exist_bitmask(board, word):
    """Use when m*n <= 64 (fits in integer)"""
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
        if visited_mask & (1 << cell_id):
            return False
        if board[r][c] != word[idx]:
            return False
        
        new_mask = visited_mask | (1 << cell_id)
        
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            if dfs(r+dr, c+dc, idx+1, new_mask):
                return True
        return False
    
    for r in range(m):
        for c in range(n):
            if board[r][c] == word[0]:
                if dfs(r, c, 0, 0):
                    return True
    return False
```

**Benefit:** O(1) copy of visited state vs O(L) for set copy.

<!-- back -->
