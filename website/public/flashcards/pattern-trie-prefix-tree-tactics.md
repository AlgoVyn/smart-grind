## Trie - Prefix Tree: Tactics

What tactical strategies can be applied when solving problems with Tries?

<!-- front -->

---

### Tactic 1: Build Once, Query Many

Build the trie from all words first, then use it for multiple searches.

```python
def findWords(board, words):
    # Build trie once: O(total_chars)
    trie = Trie()
    for word in words:
        trie.insert(word)
    
    # Search grid using trie for pruning
    results = []
    for i in range(len(board)):
        for j in range(len(board[0])):
            dfs(board, i, j, trie.root, "", results)
    return results
```

**Key insight**: Amortize O(total_chars) build cost across many grid searches.

---

### Tactic 2: Prune with Prefix Check

During DFS/backtracking, abort early if path is not a valid prefix.

```python
def dfs(board, i, j, node, path, results):
    # PRUNE: Not a valid prefix in trie
    if node is None:
        return
    
    # Found complete word
    if node.isEnd:
        results.append(path)
        node.isEnd = False  # Prevent duplicates
    
    # Continue DFS in 4 directions...
    for di, dj in [(-1,0), (1,0), (0,-1), (0,1)]:
        ni, nj = i + di, j + dj
        if valid(ni, nj):
            char = board[ni][nj]
            idx = ord(char) - ord('a')
            dfs(board, ni, nj, node.children[idx], path + char, results)
```

**Key insight**: Trie immediately tells you if current path can lead to any valid word.

---

### Tactic 3: Node Augmentation

Add extra data to nodes for advanced queries.

| Augmentation | Use Case | Example |
|--------------|----------|---------|
| **word** | Store complete word | Easy retrieval in Word Search II |
| **count** | Track words through node | Prefix counting, deletion safety |
| **frequency** | Search popularity | Autocomplete ranking |

```python
class TrieNodeAugmented:
    def __init__(self):
        self.children = {}
        self.isEnd = False
        self.word = None      # Store complete word
        self.count = 0        # Words with this prefix
```

---

### Tactic 4: Count Tracking for Deletion

Track word counts to enable safe deletion and prefix queries.

```python
def insert(self, word):
    node = self.root
    for char in word:
        if char not in node.children:
            node.children[char] = TrieNode()
        node = node.children[char]
        node.count += 1  # Increment on each node
    node.isEnd = True

def prefixCount(self, prefix):
    node = self._traverse(prefix)
    return node.count if node else 0

def delete(self, word):
    if not self.search(word):
        return False
    node = self.root
    for char in word:
        node.children[char].count -= 1
        node = node.children[char]
    node.isEnd = False
    return True
```

---

### Tactic 5: Wildcard Search

Support '.' wildcards by recursively exploring all children.

```python
def search(self, word):
    return self._searchWildcard(self.root, word, 0)

def _searchWildcard(self, node, word, index):
    if index == len(word):
        return node.isEnd
    
    char = word[index]
    if char == '.':
        # Try ALL children
        for child in node.children.values():
            if self._searchWildcard(child, word, index + 1):
                return True
        return False
    else:
        if char not in node.children:
            return False
        return self._searchWildcard(node.children[char], word, index + 1)
```

**Complexity**: O(26^m) worst case with wildcards vs O(m) exact match.

---

### Tactic 6: Binary Trie for XOR Problems

Use bitwise tries for maximum XOR and number prefix problems.

```python
class BinaryTrie:
    def insert(self, num):
        node = self.root
        for i in range(31, -1, -1):  # 32 bits
            bit = (num >> i) & 1
            if node.children[bit] is None:
                node.children[bit] = TrieNode()
            node = node.children[bit]
    
    def maxXOR(self, num):
        node = self.root
        result = 0
        for i in range(31, -1, -1):
            bit = (num >> i) & 1
            opposite = 1 - bit
            if node.children[opposite]:  # Prefer opposite bit
                result |= (1 << i)
                node = node.children[opposite]
            else:
                node = node.children[bit]
        return result
```

---

### Decision Guide

| Problem Feature | Tactic to Apply |
|-----------------|-----------------|
| Multiple word search in grid | Build once, query many |
| Word Search II | Prune + delete found words |
| Prefix counting | Node count augmentation |
| Autocomplete ranking | Frequency tracking + heap |
| Wildcard pattern ('.') | Recursive all-child search |
| Maximum XOR / bitwise | Binary trie (0/1 children) |

<!-- back -->
