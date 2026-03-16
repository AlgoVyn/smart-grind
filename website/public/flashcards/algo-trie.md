## Trie (Prefix Tree)

**Question:** Implement a trie with insert, search, and startsWith?

<!-- front -->

---

## Answer: Node-Based Structure

### Solution
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

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
    
    def startsWith(self, prefix):
        return self._find_node(prefix) is not None
    
    def _find_node(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
```

### Visual: Trie Structure
```
Insert: "apple", "app", "appl", "apply"

root
 └── a
      └── p
           ├── p (appl)
           │    └── l (appl)
           │         └── e (apple)
           │              └── y (apply)
           └── p (app) *

* = is_end = True
```

### ⚠️ Tricky Parts

#### 1. When is End Marked
```python
# Mark is_end only at last character
# "app" ends at 'p'
# "apple" ends at 'e'

# Search "app" → finds node with is_end=True ✓
# Search "appl" → finds node with is_end=False ✗
```

#### 2. Prefix vs Full Search
```python
# Both use _find_node helper
# Search: check is_end after finding
# startsWith: just check node exists

def searchPrefix(self, prefix):
    node = self._find_node(prefix)
    return node is not None  # Doesn't check is_end
```

#### 3. Auto-complete
```python
def autocomplete(prefix):
    node = self._find_node(prefix)
    if not node:
        return []
    
    results = []
    self._dfs(node, prefix, results)
    return results

def _dfs(self, node, path, results):
    if node.is_end:
        results.append(path)
    
    for char, child in node.children.items():
        self._dfs(child, path + char, results)
```

### Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Insert | O(m) | O(m) |
| Search | O(m) | O(1) |
| startsWith | O(m) | O(1) |

(m = word/prefix length)

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Forgetting is_end | Set at last character |
| Wrong return | Check is_end for search |
| Space usage | Use dict per node |

<!-- back -->
