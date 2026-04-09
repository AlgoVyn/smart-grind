## Trie: Framework

What is the complete code template for implementing a Trie?

<!-- front -->

---

### Framework: Trie Implementation

```
┌─────────────────────────────────────────────────────────────┐
│  TRIE - TEMPLATE                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Key Insight: Tree where each node represents a character     │
│                                                             │
│  Node Structure:                                            │
│    - children: array[26] or HashMap (char -> node)          │
│    - is_end_of_word: boolean marker                         │
│                                                             │
│  Core Operations:                                           │
│    1. Insert(word):                                         │
│       - Start at root                                       │
│       - For each char: create node if missing               │
│       - Move to child                                       │
│       - Mark final node as end-of-word                      │
│                                                             │
│    2. Search(word):                                         │
│       - Traverse following characters                       │
│       - Return False if path broken                         │
│       - Return is_end_of_word at final node                 │
│                                                             │
│    3. StartsWith(prefix):                                 │
│       - Same traversal as search                            │
│       - Return True if entire prefix exists                 │
│       - No need to check is_end_of_word                    │
│                                                             │
│  DFS Operations:                                            │
│    - To get all words: DFS from root                        │
│    - To get words with prefix: DFS from prefix node         │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: Standard Trie (Array)

```python
class TrieNode:
    def __init__(self):
        self.children = [None] * 26  # For lowercase English
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def _char_to_index(self, ch: str) -> int:
        return ord(ch) - ord('a')
    
    def insert(self, word: str) -> None:
        current = self.root
        for char in word:
            index = self._char_to_index(char)
            if current.children[index] is None:
                current.children[index] = TrieNode()
            current = current.children[index]
        current.is_end_of_word = True
    
    def search(self, word: str) -> bool:
        node = self._find_node(word)
        return node is not None and node.is_end_of_word
    
    def starts_with(self, prefix: str) -> bool:
        return self._find_node(prefix) is not None
    
    def _find_node(self, word: str):
        current = self.root
        for char in word:
            index = self._char_to_index(char)
            if current.children[index] is None:
                return None
            current = current.children[index]
        return current
```

---

### Implementation: HashMap Trie (Flexible Character Set)

```python
class TrieNodeHash:
    def __init__(self):
        self.children = {}  # HashMap: char -> TrieNodeHash
        self.is_end_of_word = False

class TrieHash:
    def __init__(self):
        self.root = TrieNodeHash()
    
    def insert(self, word: str) -> None:
        current = self.root
        for char in word:
            if char not in current.children:
                current.children[char] = TrieNodeHash()
            current = current.children[char]
        current.is_end_of_word = True
    
    def search(self, word: str) -> bool:
        node = self._find_node(word)
        return node is not None and node.is_end_of_word
    
    def starts_with(self, prefix: str) -> bool:
        return self._find_node(prefix) is not None
    
    def _find_node(self, word: str):
        current = self.root
        for char in word:
            if char not in current.children:
                return None
            current = current.children[char]
        return current
```

---

### Key Framework Elements

| Element | Purpose | Array vs HashMap |
|---------|---------|------------------|
| `children` | Navigate to next character | Array: O(1) index, fixed size; HashMap: O(1) hash, flexible |
| `is_end_of_word` | Distinguish words from prefixes | Same for both |
| `_find_node()` | Helper for search and prefix check | Same logic, different access |
| `insert()` | Build the trie structure | Same logic, different creation |

---

### Complexity Summary

| Operation | Array Time | HashMap Time | Space |
|-----------|------------|--------------|-------|
| Insert | O(m) | O(m) | O(n × m) |
| Search | O(m) | O(m) | - |
| StartsWith | O(m) | O(m) | - |

Where m = word length, n = number of words

<!-- back -->
