## Trie: Tactics

What tactical strategies can be applied when solving problems with Tries?

<!-- front -->

---

### Tactic 1: Build Once, Query Many

When searching multiple words in a grid, build the trie once and use it for all searches.

```python
def find_words_in_grid(board, words):
    # Build trie from all words (O(total_chars))
    trie = Trie()
    for word in words:
        trie.insert(word)
    
    results = []
    # For each cell, search using the trie
    for i in range(len(board)):
        for j in range(len(board[0])):
            dfs(board, i, j, trie.root, "", results)
    
    return results
```

**Key insight**: Amortize the build cost across many queries.

---

### Tactic 2: Prune with Prefix Check

During DFS/backtracking, abort early if current path is not a valid prefix.

```python
def dfs(board, i, j, node, path, results):
    # PRUNE: Not a valid prefix
    if node is None:
        return
    
    # Found a complete word
    if node.is_end_of_word:
        results.append(path)
        node.is_end_of_word = False  # Avoid duplicates
    
    # Continue DFS in 4 directions...
```

**Key insight**: Trie tells you immediately if current path can lead to any valid word.

---

### Tactic actic 3: Node Augmentation

Add extra data to nodes for advanced queries.

| Augmentation | Use Case |
|--------------|----------|
| **word** | Store complete word for easy retrieval |
| **count** | Track number of words through this node |
| **frequency** | For autocomplete ranking by popularity |
| **index** | Track which original word(s) end here |

```python
class TrieNodeAugmented:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.word = None      # Store complete word
        self.frequency = 0    # For ranking suggestions
```

---

### Tactic 4: Delete Words During Search

Remove found words to avoid duplicates and prune future searches.

```python
def dfs(board, i, j, node, path, results):
    if node.is_end_of_word:
        results.append(path)
        node.is_end_of_word = False  # Delete/Disable
        # Optional: prune empty branches
```

**Key insight**: Especially useful in Word Search II to prevent duplicate results.

---

### Tactic 5: Wildcard Search (Dot Matching)

Support '.' wildcards by recursively exploring all children.

```python
def search_with_wildcard(node, word, index):
    if index == len(word):
        return node.is_end_of_word
    
    char = word[index]
    if char == '.':
        # Try ALL children
        for child in node.children.values():
            if search_with_wildcard(child, word, index + 1):
                return True
        return False
    else:
        # Normal exact match
        if char not in node.children:
            return False
        return search_with_wildcard(node.children[char], word, index + 1)
```

**Complexity**: O(26^m) worst case vs O(m) for exact match.

---

### Tactic 6: Top-K Autocomplete

Use a min-heap to track top suggestions during DFS.

```python
import heapq

def get_top_k_suggestions(node, prefix, k):
    heap = []  # Min-heap of (frequency, word)
    
    def dfs(node, current):
        if node.is_end_of_word:
            heapq.heappush(heap, (node.frequency, current))
            if len(heap) > k:
                heapq.heappop(heap)  # Remove lowest freq
        
        for char, child in node.children.items():
            dfs(child, current + char)
    
    dfs(node, prefix)
    return [word for freq, word in sorted(heap, reverse=True)]
```

---

### Quick Decision Guide

| Problem Feature | Tactic to Apply |
|-----------------|-----------------|
| Multiple word search | Build once, query many |
| Grid search | Prune with prefix check |
| Autocomplete ranking | Node augmentation + heap |
| Duplicate prevention | Delete words during search |
| Wildcard pattern | Recursive all-child search |
| Need word retrieval | Store word in end nodes |

<!-- back -->
