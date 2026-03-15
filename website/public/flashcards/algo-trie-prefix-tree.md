## Trie (Prefix Tree) - Implementation

**Question:** What is the structure of a Trie node and how do you implement insert and search?

<!-- front -->

---

## Trie Implementation

### Trie Node Structure
```python
class TrieNode:
    def __init__(self):
        self.children = {}  # char -> TrieNode
        self.is_end = False  # Marks end of word
```

### Trie Class
```python
class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word):
        node = self._find_node(word)
        return node is not None and node.is_end
    
    def starts_with(self, prefix):
        return self._find_node(prefix) is not None
    
    def _find_node(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
```

### Complexity
| Operation | Time | Space |
|-----------|------|-------|
| Insert | O(m) | O(m) |
| Search | O(m) | O(1) |
| Prefix Search | O(m) | O(1) |

Where m = length of word/prefix

### 💡 Space Optimization
- Use array of size 26 for English letters
- Or use dictionary for any character

<!-- back -->
