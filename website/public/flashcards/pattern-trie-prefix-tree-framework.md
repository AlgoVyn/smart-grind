## Trie - Prefix Tree: Framework

What is the complete code template for implementing a Trie (Prefix Tree)?

<!-- front -->

---

### Framework: Trie Implementation

```
┌─────────────────────────────────────────────────────────────┐
│  TRIE (PREFIX TREE) - TEMPLATE                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Key Insight: Tree where each node represents a character  │
│                                                             │
│  Node Structure:                                            │
│    - children: array[26] or HashMap<char, TrieNode>         │
│    - isEnd: boolean flag marking end of valid word          │
│    - count: (optional) track words passing through node     │
│                                                             │
│  Core Operations:                                           │
│    1. insert(word):                                         │
│       - Start at root                                       │
│       - For each char: create node if missing               │
│       - Move to child node                                  │
│       - Mark final node isEnd = True                        │
│                                                             │
│    2. search(word):                                         │
│       - Traverse following characters                       │
│       - Return False if any child missing                   │
│       - Return isEnd flag at final node                     │
│                                                             │
│    3. startsWith(prefix):                                   │
│       - Same traversal as search                            │
│       - Return True if entire prefix path exists            │
│       - No need to check isEnd flag                         │
│                                                             │
│  Helper: _traverse(prefix)                                  │
│    - Shared traversal logic for search and startsWith       │
│    - Returns node at end of prefix or None                  │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: Array-Based Trie

```python
class TrieNode:
    def __init__(self):
        self.children = [None] * 26  # Fixed: lowercase 'a'-'z'
        self.isEnd = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            index = ord(char) - ord('a')
            if node.children[index] is None:
                node.children[index] = TrieNode()
            node = node.children[index]
        node.isEnd = True
    
    def search(self, word: str) -> bool:
        node = self._traverse(word)
        return node is not None and node.isEnd
    
    def startsWith(self, prefix: str) -> bool:
        return self._traverse(prefix) is not None
    
    def _traverse(self, prefix: str):
        node = self.root
        for char in prefix:
            index = ord(char) - ord('a')
            if node.children[index] is None:
                return None
            node = node.children[index]
        return node
```

---

### Implementation: HashMap Trie

```python
class TrieNode:
    def __init__(self):
        self.children = {}  # Flexible: any character set
        self.isEnd = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.isEnd = True
    
    def search(self, word: str) -> bool:
        node = self._traverse(word)
        return node is not None and node.isEnd
    
    def startsWith(self, prefix: str) -> bool:
        return self._traverse(prefix) is not None
    
    def _traverse(self, prefix: str):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
```

---

### Framework Elements

| Element | Purpose | Array vs HashMap |
|---------|---------|------------------|
| `children` | Navigate to next character | Array: O(1) index, fixed size; HashMap: flexible, O(1) avg |
| `isEnd` | Distinguish complete words from prefixes | Same for both |
| `_traverse()` | Shared traversal helper | Same logic, different access pattern |
| `insert()` | Build trie structure | Same logic, different node creation |

---

### Complexity Summary

| Operation | Array Time | HashMap Time | Space |
|-----------|------------|--------------|-------|
| Insert | O(m) | O(m) | O(n × m) worst case |
| Search | O(m) | O(m) | - |
| startsWith | O(m) | O(m) | - |

**m** = word length, **n** = number of words

<!-- back -->
