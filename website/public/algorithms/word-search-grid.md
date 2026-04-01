# Word Search Grid

## Category
Backtracking

## Description

The **Word Search Grid** algorithm solves the problem of finding whether a word exists in a 2D grid of characters. The word can be constructed from letters of sequentially adjacent cells, where "adjacent" cells are those horizontally or vertically neighboring. The same letter cell may not be used more than once in a single word.

This classic backtracking problem demonstrates the power of Depth-First Search (DFS) combined with careful state management to explore all possible paths through a grid. The algorithm appears frequently in technical interviews and competitive programming competitions.

---

## Concepts

The Word Search algorithm is built on several fundamental concepts that make it powerful for solving grid-based pathfinding problems.

### 1. DFS with Backtracking

The core pattern for exploring paths:

| Step | Action | Purpose |
|------|--------|---------|
| **Mark** | Mark current cell as visited | Prevent reuse |
| **Explore** | Recurse on neighbors | Continue path |
| **Unmark** | Restore cell when backtracking | Allow other paths |
| **Base Case** | All characters matched | Success |

### 2. Direction Vectors

Standard 4-directional movement:

| Direction | Delta Row | Delta Col | Vector |
|-----------|-----------|-----------|--------|
| **Down** | +1 | 0 | (1, 0) |
| **Up** | -1 | 0 | (-1, 0) |
| **Right** | 0 | +1 | (0, 1) |
| **Left** | 0 | -1 | (0, -1) |

### 3. In-Place Marking

Space optimization technique:

| Approach | Space | Trade-off |
|----------|-------|-----------|
| **Visited set** | O(L) | Extra memory, no grid modification |
| **In-place** | O(1) | Modifies input, restores on backtrack |

### 4. Early Termination

Optimizations to stop early:

| Check | When | Benefit |
|-------|------|---------|
| **First character** | Before DFS | Skip cells not matching word[0] |
| **Frequency** | Global check | Skip if grid lacks required characters |
| **Match found** | During DFS | Return immediately on success |

---

## Frameworks

Structured approaches for solving word search problems.

### Framework 1: Standard DFS Backtracking Template

```
┌─────────────────────────────────────────────────────┐
│  STANDARD WORD SEARCH FRAMEWORK                     │
├─────────────────────────────────────────────────────┤
│  1. For each cell in grid as starting position:    │
│     a. If cell matches word[0]:                    │
│        - Call dfs(row, col, index=0)              │
│        - If returns True: return True             │
│  2. Return False (word not found)                 │
│                                                     │
│  DFS(row, col, index):                            │
│  1. If index == len(word): return True             │
│  2. If out of bounds or mismatch: return False     │
│  3. Mark cell as visited (temporarily modify)     │
│  4. For each of 4 directions:                     │
│     a. If DFS(next_row, next_col, index+1):      │
│        - return True                               │
│  5. Unmark cell (restore original)                 │
│  6. Return False                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Single word search, standard problem.

### Framework 2: Optimized Word Search Template

```
┌─────────────────────────────────────────────────────┐
│  OPTIMIZED WORD SEARCH FRAMEWORK                    │
├─────────────────────────────────────────────────────┤
│  1. Frequency pruning:                             │
│     a. Count characters in word and grid           │
│     b. If grid lacks any required char: return False│
│  2. For each cell matching word[0]:                │
│     a. Run optimized DFS                            │
│     b. Return immediately on success               │
│                                                     │
│  Optimizations:                                     │
│  - Start from rarer characters                     │
│ - Check bounds before recursion                   │
│ - Early termination on match                        │
└─────────────────────────────────────────────────────┘
```

**When to use**: Performance critical, long words.

### Framework 3: Multiple Words Template (Word Search II)

```
┌─────────────────────────────────────────────────────┐
│  MULTIPLE WORDS FRAMEWORK                           │
├─────────────────────────────────────────────────────┤
│  1. Build Trie from all words to find              │
│  2. DFS from each cell, traversing Trie:           │
│     a. If Trie node is word end: add to result     │
│     b. Mark word as found (avoid duplicates)       │
│     c. Continue DFS on Trie children               │
│  3. Prune Trie leaves that lead nowhere             │
│  4. Return all found words                          │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding multiple words simultaneously.

---

## Forms

Different manifestations of the word search pattern.

### Form 1: Standard Word Search

Find single word in grid with 4-direction movement.

| Feature | Specification |
|---------|---------------|
| Movement | 4-direction (up, down, left, right) |
| Reuse | Not allowed |
| Output | Boolean (exists or not) |
| Complexity | O(M×N×4^L) |

### Form 2: Word Search with Diagonals

Allow 8-directional movement including diagonals.

| Directions | Vectors |
|------------|---------|
| Cardinal | (±1, 0), (0, ±1) |
| Diagonal | (±1, ±1) |
| Total | 8 directions |

### Form 3: Word Search II (Multiple Words)

Find multiple words efficiently using Trie.

| Feature | Benefit |
|---------|---------|
| Trie structure | Share prefix exploration |
| Early termination | Stop if no prefix match |
| Pruning | Remove dead Trie branches |

### Form 4: Count All Paths

Count all distinct paths forming the word.

| Modification | Change |
|--------------|--------|
| Return | Count instead of boolean |
| Early termination | Removed (count all) |
| Accumulation | Increment counter at base case |

### Form 5: Word Search with Wildcards

Support wildcard characters matching any cell.

```python
def matches(board_char, word_char):
    return word_char == '.' or board_char == word_char
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Frequency Pruning

```python
def exist_with_pruning(board: list[list[str]], word: str) -> bool:
    """Optimized version with frequency pruning."""
    if not board or not board[0] or not word:
        return False
    
    from collections import Counter
    
    # Frequency pruning
    board_count = Counter()
    for row in board:
        board_count.update(row)
    
    word_count = Counter(word)
    for char, count in word_count.items():
        if board_count[char] < count:
            return False
    
    rows, cols = len(board), len(board[0])
    
    def dfs(r: int, c: int, index: int) -> bool:
        if index == len(word):
            return True
        
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            board[r][c] != word[index]):
            return False
        
        temp = board[r][c]
        board[r][c] = '#'
        
        found = (dfs(r + 1, c, index + 1) or
                 dfs(r - 1, c, index + 1) or
                 dfs(r, c + 1, index + 1) or
                 dfs(r, c - 1, index + 1))
        
        board[r][c] = temp
        return found
    
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0] and dfs(r, c, 0):
                return True
    
    return False
```

### Tactic 2: Starting from Rarer Character

```python
def exist_optimized_start(board: list[list[str]], word: str) -> bool:
    """Start DFS from the less frequent character in word."""
    from collections import Counter
    
    word_count = Counter(word)
    # Start from the less frequent end
    if word_count[word[0]] > word_count[word[-1]]:
        word = word[::-1]  # Reverse word
    
    # ... rest of standard DFS
```

### Tactic 3: Iterative DFS (Stack-Based)

```python
def exist_iterative(board: list[list[str]], word: str) -> bool:
    """Iterative DFS to avoid recursion depth issues."""
    if not board or not board[0] or not word:
        return False
    
    rows, cols = len(board), len(board[0])
    
    for r0 in range(rows):
        for c0 in range(cols):
            if board[r0][c0] != word[0]:
                continue
            
            # Stack: (row, col, index, visited_set)
            stack = [(r0, c0, 0, {(r0, c0)})]
            
            while stack:
                r, c, idx, visited = stack.pop()
                
                if idx == len(word) - 1:
                    return True
                
                for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
                    nr, nc = r + dr, c + dc
                    if (0 <= nr < rows and 0 <= nc < cols and
                        (nr, nc) not in visited and
                        board[nr][nc] == word[idx + 1]):
                        new_visited = visited | {(nr, nc)}
                        stack.append((nr, nc, idx + 1, new_visited))
    
    return False
```

### Tactic 4: Word Search with Trie

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None

class Solution:
    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:
        # Build Trie
        root = TrieNode()
        for word in words:
            node = root
            for char in word:
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
            node.word = word
        
        result = []
        rows, cols = len(board), len(board[0])
        
        def dfs(r: int, c: int, node: TrieNode) -> None:
            char = board[r][c]
            if char not in node.children:
                return
            
            next_node = node.children[char]
            if next_node.word:
                result.append(next_node.word)
                next_node.word = None
            
            board[r][c] = '#'
            
            for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                    dfs(nr, nc, next_node)
            
            board[r][c] = char
            
            # Prune empty leaves
            if not next_node.children:
                del node.children[char]
        
        for r in range(rows):
            for c in range(cols):
                dfs(r, c, root)
        
        return result
```

### Tactic 5: BFS Alternative

```python
from collections import deque

def exist_bfs(board: list[list[str]], word: str) -> bool:
    """BFS approach - finds shortest path to construct word."""
    if not board or not board[0] or not word:
        return False
    
    rows, cols = len(board), len(board[0])
    
    for r0 in range(rows):
        for c0 in range(cols):
            if board[r0][c0] != word[0]:
                continue
            
            # Queue: (row, col, index, visited_set)
            queue = deque([(r0, c0, 0, {(r0, c0)})])
            
            while queue:
                r, c, idx, visited = queue.popleft()
                
                if idx == len(word) - 1:
                    return True
                
                for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
                    nr, nc = r + dr, c + dc
                    if (0 <= nr < rows and 0 <= nc < cols and
                        (nr, nc) not in visited and
                        board[nr][nc] == word[idx + 1]):
                        queue.append((nr, nc, idx + 1, visited | {(nr, nc)}))
    
    return False
```

---

## Python Templates

### Template 1: Standard Word Search

```python
def exist(board: list[list[str]], word: str) -> bool:
    """
    Find if word exists in the grid using DFS backtracking.
    
    Args:
        board: 2D grid of characters
        word: Word to search for
    
    Returns:
        True if word exists in grid
    
    Time Complexity: O(M * N * 4^L) where M,N = grid dimensions, L = word length
    Space Complexity: O(L) for recursion stack
    """
    if not board or not board[0] or not word:
        return False
    
    rows, cols = len(board), len(board[0])
    
    def dfs(r: int, c: int, index: int) -> bool:
        # Base case: all characters matched
        if index == len(word):
            return True
        
        # Boundary and character check
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            board[r][c] != word[index]):
            return False
        
        # Mark as visited (temporarily change to None)
        temp = board[r][c]
        board[r][c] = None
        
        # Explore all 4 directions
        found = (dfs(r + 1, c, index + 1) or  # Down
                 dfs(r - 1, c, index + 1) or  # Up
                 dfs(r, c + 1, index + 1) or  # Right
                 dfs(r, c - 1, index + 1))    # Left
        
        # Backtrack: restore the character
        board[r][c] = temp
        
        return found
    
    # Try starting from each cell
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0]:
                if dfs(r, c, 0):
                    return True
    
    return False
```

### Template 2: Word Search with Frequency Pruning

```python
def exist_optimized(board: list[list[str]], word: str) -> bool:
    """
    Optimized version with frequency pruning.
    """
    if not board or not board[0] or not word:
        return False
    
    rows, cols = len(board), len(board[0])
    
    # Pruning: count characters
    from collections import Counter
    board_count = Counter()
    for row in board:
        board_count.update(row)
    
    word_count = Counter(word)
    for char, count in word_count.items():
        if board_count[char] < count:
            return False
    
    def dfs(r: int, c: int, index: int) -> bool:
        if index == len(word):
            return True
        
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            board[r][c] != word[index]):
            return False
        
        temp = board[r][c]
        board[r][c] = '#'
        
        found = (dfs(r + 1, c, index + 1) or
                 dfs(r - 1, c, index + 1) or
                 dfs(r, c + 1, index + 1) or
                 dfs(r, c - 1, index + 1))
        
        board[r][c] = temp
        return found
    
    # Try starting from each matching cell
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0]:
                if dfs(r, c, 0):
                    return True
    
    return False
```

### Template 3: Word Search II (Multiple Words with Trie)

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None  # Store complete word at end node

class Solution:
    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:
        """
        Find all words in the board using Trie + DFS.
        
        Time: O(M * N * 4^L) where L is max word length
        Space: O(K) where K is total characters in all words
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
        
        result = []
        rows, cols = len(board), len(board[0])
        
        def dfs(r: int, c: int, node: TrieNode) -> None:
            char = board[r][c]
            if char not in node.children:
                return
            
            next_node = node.children[char]
            if next_node.word:
                result.append(next_node.word)
                next_node.word = None  # Avoid duplicates
            
            board[r][c] = '#'  # Mark visited
            
            for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                    dfs(nr, nc, next_node)
            
            board[r][c] = char  # Backtrack
            
            # Optimization: Remove leaf nodes
            if not next_node.children:
                del node.children[char]
        
        for r in range(rows):
            for c in range(cols):
                dfs(r, c, root)
        
        return result
```

### Template 4: Count All Paths

```python
def count_paths(board: list[list[str]], word: str) -> int:
    """
    Count all distinct paths that form the word.
    
    Time: O(M * N * 4^L)
    Space: O(L) for recursion
    """
    if not board or not board[0] or not word:
        return 0
    
    rows, cols = len(board), len(board[0])
    count = 0
    
    def dfs(r: int, c: int, index: int) -> None:
        nonlocal count
        
        if index == len(word):
            count += 1
            return
        
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            board[r][c] != word[index]):
            return
        
        temp = board[r][c]
        board[r][c] = '#'
        
        dfs(r + 1, c, index + 1)
        dfs(r - 1, c, index + 1)
        dfs(r, c + 1, index + 1)
        dfs(r, c - 1, index + 1)
        
        board[r][c] = temp
    
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0]:
                dfs(r, c, 0)
    
    return count
```

### Template 5: Word Search with Diagonal Movement

```python
def exist_with_diagonal(board: list[list[str]], word: str) -> bool:
    """
    Word search allowing diagonal movement (8 directions).
    
    Time: O(M * N * 8^L)
    Space: O(L)
    """
    if not board or not board[0] or not word:
        return False
    
    rows, cols = len(board), len(board[0])
    
    # 8 directions: down, up, right, left, and 4 diagonals
    directions = [
        (1, 0), (-1, 0), (0, 1), (0, -1),   # Cardinal
        (1, 1), (1, -1), (-1, 1), (-1, -1)  # Diagonal
    ]
    
    def dfs(r: int, c: int, index: int) -> bool:
        if index == len(word):
            return True
        
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            board[r][c] != word[index]):
            return False
        
        temp = board[r][c]
        board[r][c] = '#'
        
        found = False
        for dr, dc in directions:
            if dfs(r + dr, c + dc, index + 1):
                found = True
                break
        
        board[r][c] = temp
        return found
    
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0] and dfs(r, c, 0):
                return True
    
    return False
```

### Template 6: Word Search with Wildcards

```python
def exist_with_wildcard(board: list[list[str]], word: str) -> bool:
    """
    Word search where '.' in word matches any character.
    
    Time: O(M * N * 4^L)
    Space: O(L)
    """
    if not board or not board[0] or not word:
        return False
    
    rows, cols = len(board), len(board[0])
    
    def matches(board_char: str, word_char: str) -> bool:
        return word_char == '.' or board_char == word_char
    
    def dfs(r: int, c: int, index: int) -> bool:
        if index == len(word):
            return True
        
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            not matches(board[r][c], word[index])):
            return False
        
        temp = board[r][c]
        board[r][c] = '#'
        
        found = (dfs(r + 1, c, index + 1) or
                 dfs(r - 1, c, index + 1) or
                 dfs(r, c + 1, index + 1) or
                 dfs(r, c - 1, index + 1))
        
        board[r][c] = temp
        return found
    
    for r in range(rows):
        for c in range(cols):
            if matches(board[r][c], word[0]) and dfs(r, c, 0):
                return True
    
    return False
```

---

## When to Use

Use the Word Search algorithm when you need to solve problems involving:

- **Grid Path Finding**: Finding specific sequences in 2D character grids
- **Pattern Matching in 2D**: Searching for words or patterns in matrices
- **Backtracking Exploration**: Problems requiring exhaustive search with constraints
- **Board Games**: Word-based puzzles like Boggle, Scrabble variants
- **Constraint Satisfaction**: Problems with "no revisit" constraints

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|----------------|------------------|----------|
| **DFS Backtracking** | O(M × N × 4^L) | O(L) | Single word search, grid traversal |
| **DFS + Trie** | O(M × N × 4^L) | O(L + K) | Multiple words, dictionary-based |
| **BFS** | O(M × N × 4^L) | O(M × N) | Shortest path, level-order exploration |
| **Dynamic Programming** | O(M × N × L) | O(M × N × L) | Count paths, not existence |

### When to Choose Which Approach

- **Choose DFS Backtracking** when:
  - Searching for a single word
  - Need to find existence (not count paths)
  - Memory is limited
  
- **Choose DFS + Trie** when:
  - Searching for multiple words simultaneously
  - Have a dictionary of words to find
  - Need to find all matching words (like Word Search II)

- **Choose BFS** when:
  - Need shortest path to construct word
  - Want level-by-level exploration
  - Not concerned with path reconstruction

---

## Algorithm Explanation

### Core Concept

The Word Search algorithm uses **Depth-First Search with Backtracking** to explore all possible paths through the grid:

1. **Start from every cell**: The word could begin anywhere in the grid
2. **DFS Exploration**: From each starting position, recursively explore all 4 directions
3. **State Management**: Mark cells as visited to prevent reuse, then unmark (backtrack) when returning
4. **Early Termination**: Stop as soon as the word is found

### How It Works

#### Search Phase:
- Iterate through each cell in the grid as a potential starting point
- For each cell matching the first character of the word, begin DFS

#### DFS Phase:
At each step with current position `(r, c)` and word index `i`:
1. **Base Case**: If `i == len(word)`, all characters matched → return True
2. **Boundary Check**: Ensure `(r, c)` is within grid bounds
3. **Character Match**: Check if `grid[r][c] == word[i]`
4. **Mark Visited**: Temporarily modify cell to prevent revisiting
5. **Explore Neighbors**: Recursively check all 4 adjacent cells with `i + 1`
6. **Backtrack**: Restore original cell value
7. **Return Result**: True if any neighbor path succeeds

### Visual Representation

For grid `[['A','B','C'],['S','F','C'],['A','D','E']]` and word "ABCCED":

```
Step 1: Start at A(0,0) - matches 'A'
    A → B → C
    S   F   C
    A   D   E

Step 2: From B(0,1) - matches 'B'
    A → B → C
    S   F   C
    A   D   E

Step 3: From C(0,2) - matches 'C'
    A → B → C
    S   F   C
    A   D   E

Step 4: From C(1,2) - matches 'C'
    A → B → C
    S   F ↓ C
    A   D   E

Step 5: From E(2,2) - matches 'E'
    A → B → C
    S   F   C
    A   D ← E

Step 6: From D(2,1) - matches 'D'
    A → B → C
    S   F   C
    A → D ← E

Word found! Path: A→B→C→C→E→D
```

### Key Optimizations

1. **In-place marking**: Instead of a separate visited set, temporarily change the cell to a sentinel value (e.g., `None` or `'#'`)
2. **Early termination**: If the first character doesn't match, skip immediately
3. **Word length check**: If word is longer than total cells, return False immediately
4. **Pruning**: Count character frequencies to eliminate impossible searches early

### Limitations

- **Exponential time**: O(M × N × 4^L) worst case
- **Long words**: Performance degrades with very long words
- **Dense grids**: Many matching first characters increase starting positions
- **No polynomial solution**: Requires exhaustive search in worst case

---

## Practice Problems

### Problem 1: Word Search

**Problem:** [LeetCode 79 - Word Search](https://leetcode.com/problems/word-search/)

**Description:** Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.

**How to Apply:**
- Direct application of DFS backtracking
- Start from each cell, explore 4 directions, backtrack when stuck
- Use in-place marking to avoid O(mn) extra space

---

### Problem 2: Word Search II

**Problem:** [LeetCode 212 - Word Search II](https://leetcode.com/problems/word-search-ii/)

**Description:** Given an `m x n` `board` of characters and a list of strings `words`, return all words on the board.

**How to Apply:**
- Combine Word Search with Trie data structure
- Build Trie from word list for O(L) lookup
- DFS from each cell, traversing Trie simultaneously
- Remove found words from Trie to avoid duplicates

---

### Problem 3: Unique Paths III

**Problem:** [LeetCode 980 - Unique Paths III](https://leetcode.com/problems/unique-paths-iii/)

**Description:** On a 2-dimensional `grid`, there are 4 types of squares: starting square, ending square, empty squares, and obstacles. Return the number of 4-directional walks from the starting square to the ending square, that walk over every non-obstacle square exactly once.

**How to Apply:**
- Similar backtracking approach
- DFS from starting position
- Track visited cells
- Count paths that visit all empty squares
- Backtrack after each exploration

---

### Problem 4: Flood Fill

**Problem:** [LeetCode 733 - Flood Fill](https://leetcode.com/problems/flood-fill/)

**Description:** An image is represented by an `m x n` integer grid `image`. You are given three integers `sr`, `sc`, and `color`. Perform a flood fill starting from pixel `(sr, sc)` and return the modified image.

**How to Apply:**
- Simplified DFS without backtracking
- Start from given position
- Recursively fill connected same-color region
- No need to backtrack since we're modifying permanently

---

### Problem 5: Number of Islands

**Problem:** [LeetCode 200 - Number of Islands](https://leetcode.com/problems/number-of-islands/)

**Description:** Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.

**How to Apply:**
- DFS/BFS for connected components
- Iterate through grid
- When land found, DFS to mark entire island
- Count each DFS initiation as one island

---

## Video Tutorial Links

### Fundamentals

- [Word Search - Backtracking Algorithm (NeetCode)](https://www.youtube.com/watch?v=pfiQ_PS1g8E) - Clear explanation with visualization
- [Word Search II - Trie + Backtracking (NeetCode)](https://www.youtube.com/watch?v=asbcE9mZz_U) - Advanced technique for multiple words
- [Backtracking Introduction (Abdul Bari)](https://www.youtube.com/watch?v=DKCbsiDBN6c) - General backtracking concepts

### Grid Search Patterns

- [Flood Fill Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=aehEcTEPtCs) - Grid traversal fundamentals
- [Number of Islands - DFS/BFS (Back To Back SWE)](https://www.youtube.com/watch?v=__98uLdkwVw) - Connected components in grids
- [Matrix DFS Pattern (Tech With Tim)](https://www.youtube.com/watch?v=KiCBXu4P-2Y) - Common grid patterns

### Advanced Topics

- [Word Search - Optimizations (Nick White)](https://www.youtube.com/watch?v=vYYNp0JrdvY) - Pruning techniques
- [Trie Data Structure (HackerRank)](https://www.youtube.com/watch?v=AXjmTQ8LEoI) - Essential for Word Search II
- [Backtracking Time Complexity Analysis](https://www.youtube.com/watch?v=Zq4upTEaIyo) - Understanding 4^L factor

---

## Follow-up Questions

### Q1: Can we optimize the O(M × N × 4^L) time complexity?

**Answer:** The worst-case time complexity cannot be improved asymptotically because we may need to explore all paths. However, practical optimizations include:

- **Frequency pruning**: Check if board has enough of each character before searching
- **Starting from rarest character**: Begin DFS from cells matching the least frequent character in the word
- **Early termination**: Return immediately when word is found
- **Trie optimization** (for multiple words): Share prefix exploration across words

These don't change Big-O but significantly improve average-case performance.

---

### Q2: Why use in-place marking instead of a visited set?

**Answer:** In-place marking has several advantages:

1. **Space efficiency**: O(1) extra space vs O(L) or O(M × N) for a set
2. **Cache friendly**: No hash lookups, direct array access
3. **Simpler code**: No need to pass around a separate data structure

Trade-offs:
- Modifies input (usually acceptable)
- Requires restoring original value (backtracking)
- Works because input characters are from limited set (usually uppercase letters)

---

### Q3: Can we use BFS instead of DFS for Word Search?

**Answer:** Yes, but DFS is preferred because:

**DFS advantages:**
- Natural for path finding (go deep first)
- Space efficient: O(L) vs O(M × N) for BFS
- Easier to implement with backtracking
- Early termination when word found

**BFS advantages:**
- Finds shortest path (if multiple paths exist)
- Better for very wide grids with short words
- No recursion stack overflow risk

For standard Word Search, DFS is the standard approach due to lower space complexity.

---

### Q4: How do we handle the case where the word can be longer than the grid?

**Answer:** Add an early check:

```python
if len(word) > rows * cols:
    return False
```

Additionally:
- If word length exceeds path constraints (e.g., > M × N), impossible
- Frequency pruning catches most impossible cases
- Consider word structure: if it has repeating patterns, may need revisiting (which isn't allowed)

---

### Q5: What if the grid is extremely large but the word is short?

**Answer:** For large grids with short words (L ≤ 5):

1. **Index by first character**: Pre-process grid into a map of character → list of positions
2. **Start from matching cells only**: Skip cells that don't match word[0]
3. **Parallel search**: Search from multiple starting positions in parallel
4. **Early exit**: Most short words will be found quickly

Time becomes closer to O(K × 4^L) where K = occurrences of word[0], rather than O(M × N × 4^L).

---

## Summary

The **Word Search Grid** algorithm demonstrates the power of **Depth-First Search with Backtracking** for exploring constrained paths in 2D grids. Key takeaways:

### Core Concepts
- **DFS Backtracking**: Systematically explore all paths, undoing choices when they don't lead to solution
- **In-place Marking**: Use the grid itself for visited tracking to save space
- **Early Termination**: Stop as soon as the word is found

### Time & Space Complexity
- **Time**: O(M × N × 4^L) worst case, but pruning helps in practice
- **Space**: O(L) for recursion stack only

### When to Use
- ✅ Finding words/patterns in 2D character grids
- ✅ Path existence problems with "no revisit" constraints
- ✅ Backtracking practice and understanding
- ❌ When grid is extremely large and word is very long (consider alternatives)
- ❌ When you need to count paths (requires different approach)

### Common Variations
- **Word Search II**: Use Trie for multiple words
- **Diagonal allowed**: Expand to 8 directions
- **Count paths**: Remove early termination
- **Wildcards**: Match any character

This algorithm is a fundamental pattern for grid-based problems and serves as excellent practice for understanding backtracking, recursion, and state management.
