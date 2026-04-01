## Title: Trie - Tactics

What are specific techniques and optimizations for Tries?

<!-- front -->

---

### Tactic 1: Trie Node with Word Count

Track frequency for weighted autocomplete:

```python
class TrieNodeWithCount:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.count = 0  # Frequency of word ending here
        self.word = ""

class AutocompleteTrie:
    def insert(self, word, count=1):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNodeWithCount()
            node = node.children[char]
        node.is_end = True
        node.word = word
        node.count += count
    
    def get_top_k(self, prefix, k=3):
        """Get top k most frequent words with prefix."""
        node = self._find_node(prefix)
        if not node:
            return []
        
        words = []
        self._collect_all(node, words)
        words.sort(key=lambda x: x[1], reverse=True)
        return [w[0] for w in words[:k]]
```

---

### Tactic 2: Finding Longest Common Prefix

```python
def longest_common_prefix(strs):
    """Find longest common prefix among all strings using Trie."""
    if not strs:
        return ""
    
    # Build Trie
    root = TrieNode()
    for word in strs:
        node = root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    # Find LCP
    prefix = []
    node = root
    
    while len(node.children) == 1 and not node.is_end:
        char = list(node.children.keys())[0]
        prefix.append(char)
        node = node.children[char]
    
    return "".join(prefix)
```

---

### Tactic 3: Pattern Matching with Wildcards

```python
class WordDictionary:
    def search_with_wildcard(self, word):
        """Search word where '.' matches any character."""
        def dfs(node, index):
            if index == len(word):
                return node.is_end
            
            char = word[index]
            if char == '.':
                # Try all children
                for child in node.children.values():
                    if dfs(child, index + 1):
                        return True
                return False
            else:
                if char not in node.children:
                    return False
                return dfs(node.children[char], index + 1)
        
        return dfs(self.root, 0)
```

---

### Tactic 4: Replace Words with Shortest Root

```python
def replace_words(dictionary, sentence):
    """Replace each word with shortest root from dictionary."""
    trie = Trie()
    for root in dictionary:
        trie.insert(root)
    
    words = sentence.split()
    result = []
    
    for word in words:
        # Find shortest root
        node = trie.root
        replacement = []
        
        for char in word:
            if char not in node.children or node.is_end:
                break
            replacement.append(char)
            node = node.children[char]
        
        if node.is_end:
            result.append("".join(replacement))
        else:
            result.append(word)
    
    return " ".join(result)
```

---

### Tactic 5: Comparison with Alternatives

| Data Structure | Search | Insert | Space | Best Use Case |
|----------------|--------|--------|-------|---------------|
| **Trie** | O(m) | O(m) | O(ALPHABET × m × n) | Prefix searches |
| **Hash Table** | O(m) avg | O(m) avg | O(m × n) | Exact match lookup |
| **Binary Search Tree** | O(m log n) | O(m log n) | O(m × n) | Ordered traversal |
| **Suffix Tree** | O(m) | O(m) | O(m) | Substring searches |

**Choose Trie when:**
- You need prefix-based searches (autocomplete)
- You need to enumerate all words with a given prefix
- You need longest common prefix operations
- You need alphabetical ordering of results

<!-- back -->
