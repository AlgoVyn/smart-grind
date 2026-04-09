## Trie - Prefix Tree: Forms

What are the different variations and specialized forms of Tries?

<!-- front -->

---

### Form 1: Basic Trie (Standard)

Standard implementation with end-of-word flag.

```python
class TrieNode:
    def __init__(self):
        self.children = [None] * 26
        self.isEnd = False
```

**Use for**: Basic prefix matching, word existence queries (LeetCode 208).

---

### Form 2: Trie with Word Storage

Store the complete word in end nodes for easy retrieval.

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.isEnd = False
        self.word = None  # Store complete word

def insert(root, word):
    node = root
    for char in word:
        if char not in node.children:
            node.children[char] = TrieNode()
        node = node.children[char]
    node.isEnd = True
    node.word = word  # Store full word at end node
```

**Use for**: Word Search II - return found words without reconstructing path.

---

### Form 3: Trie with Count Tracking

Track count of words passing through each node.

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.isEnd = False
        self.count = 0  # Words with this prefix

def insert(root, word):
    node = root
    for char in word:
        if char not in node.children:
            node.children[char] = TrieNode()
        node = node.children[char]
        node.count += 1  # Increment count
    node.isEnd = True

def prefixCount(root, prefix):
    node = traverse(root, prefix)
    return node.count if node else 0
```

**Use for**: Counting words with given prefix, safe deletion.

---

### Form 4: Binary Trie (Bitwise)

For number-based problems using binary representation.

```python
class BinaryTrieNode:
    def __init__(self):
        self.children = [None, None]  # 0 and 1
        self.count = 0

class BinaryTrie:
    def insert(self, num: int) -> None:
        node = self.root
        for i in range(31, -1, -1):  # 32 bits
            bit = (num >> i) & 1
            if node.children[bit] is None:
                node.children[bit] = BinaryTrieNode()
            node = node.children[bit]
            node.count += 1
    
    def findMaxXOR(self, num: int) -> int:
        node = self.root
        result = 0
        for i in range(31, -1, -1):
            bit = (num >> i) & 1
            opposite = 1 - bit
            if node.children[opposite]:
                result |= (1 << i)
                node = node.children[opposite]
            else:
                node = node.children[bit]
        return result
```

**Use for**: Maximum XOR of Two Numbers, bitwise prefix problems.

---

### Form 5: Trie with Wildcard Support

Modified search to handle '.' wildcards.

```python
class TrieWildcard:
    def search(self, word: str) -> bool:
        return self._searchHelper(self.root, word, 0)
    
    def _searchHelper(self, node, word, index):
        if index == len(word):
            return node.isEnd
        
        char = word[index]
        if char == '.':
            # Try ALL possible children
            for child in node.children.values():
                if child and self._searchHelper(child, word, index + 1):
                    return True
            return False
        else:
            if char not in node.children:
                return False
            return self._searchHelper(node.children[char], word, index + 1)
```

**Use for**: Design Add and Search Words Data Structure (LeetCode 211).

---

### Form 6: Suffix Trie / Reversed Trie

Store reversed words for suffix matching.

```python
class ReversedTrie:
    """Insert reversed words to support suffix queries."""
    
    def insert(self, word: str) -> None:
        # Insert word reversed
        reversed_word = word[::-1]
        # ... normal insert logic with reversed_word
    
    def hasSuffix(self, suffix: str) -> bool:
        # Check reversed suffix as prefix
        reversed_suffix = suffix[::-1]
        return self.startsWith(reversed_suffix)
```

**Use for**: Prefix and Suffix Search problems.

---

### Form Selection Guide

| Problem Type | Form to Use |
|--------------|-------------|
| Basic implement trie | Standard Trie |
| Return found words from grid | Trie with word storage |
| Count words with prefix | Trie with count tracking |
| Maximum XOR / bitwise ops | Binary Trie |
| Wildcard matching ('.') | Trie with wildcard support |
| Suffix search | Reversed Trie |
| Autocomplete with ranking | Trie with frequency counts |
| Word deletion support | Trie with count tracking |

<!-- back -->
