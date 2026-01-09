# Word Search II

## Problem Description

Given an `m x n` board of characters and a list of strings `words`, return all words on the board.

Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.

### Examples

**Example 1:**

**Input:**
```python
board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]
```

**Output:**
```python
["eat","oath"]
```

**Example 2:**

**Input:**
```python
board = [["a","b"],["c","d"]], words = ["abcb"]
```

**Output:**
```python
[]
```

### Constraints

- `m == board.length`
- `n == board[i].length`
- `1 <= m, n <= 12`
- `board[i][j]` is a lowercase English letter.
- `1 <= words.length <= 3 * 10^4`
- `1 <= words[i].length <= 10`
- `words[i]` consists of lowercase English letters.
- All the strings of `words` are unique.

---

## Solution

```python
from typing import List

class TrieNode:
    def __init__(self):
        self.children = {}
        self.isEnd = False

def findWords(board: List[List[str]], words: List[str]) -> List[str]:
    if not board or not board[0]:
        return []

    # Build Trie
    root = TrieNode()
    for word in words:
        node = root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.isEnd = True

    result = set()

    def dfs(i, j, node, path):
        if node.isEnd:
            result.add(path)
        if 0 <= i < len(board) and 0 <= j < len(board[0]) and board[i][j] in node.children:
            temp = board[i][j]
            board[i][j] = '#'  # Mark visited
            for di, dj in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                dfs(i + di, j + dj, node.children[temp], path + temp)
            board[i][j] = temp  # Backtrack

    for i in range(len(board)):
        for j in range(len(board[0])):
            dfs(i, j, root, "")

    return list(result)
```

---

## Explanation

To find all words from the list that can be formed in the board using adjacent letters without reuse, use a Trie and DFS.

1. Build a Trie with all words.
2. For each cell in the board, perform DFS:
   - If current Trie node marks end of word, add to result.
   - If cell char in current node's children, mark cell visited (`'#'`), recurse to adjacent cells, then backtrack.
3. Use a set for result to avoid duplicates, return as list.

This efficiently prunes invalid paths with Trie.

### Time Complexity

- **O(m*n*4^L)**, m,n board size, L max word length, but Trie reduces.

### Space Complexity

- **O(N*L + m*n)**, N words, for Trie and recursion.
