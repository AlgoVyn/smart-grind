## Trie: Forms

What are the different variations and specialized forms of Tries?

<!-- front -->

---

### Form 1: Basic Trie (Standard)

Standard implementation with end-of-word flag.

```python
class TrieNode:
    def __init__(self):
        self.children = [None] * 26
        self.is_end_of_word = False
```

**Use for**: Basic prefix matching, word existence queries.

---

### Form 2: Trie with Word Storage

Store the complete word in end nodes for easy retrieval.

```python
class TrieNodeWithWord:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.word = None  # Store complete word

def insert_with_word(root, word):
    current = root
    for char in word:
        if char not in current.children:
            current.children[char] = TrieNodeWithWord()
        current = current.children[char]
    current.is_end = True
    current.word = word  # Store full word
```

**Use for**: Word Search II where you need to return found words.

---

### Form 3: Trie with Frequency Count

Track frequency for autocomplete ranking.

```python
class TrieNodeWithFreq:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.frequency = 0  # Search frequency
        self.word = None

def insert_with_freq(root, word):
    current = root
    for char in word:
        if char not in current.children:
            current.children[char] = TrieNodeWithFreq()
        current = current.children[char]
    current.is_end = True
    current.word = word

def increase_frequency(root, word):
    node = find_node(root, word)
    if node:
        node.frequency += 1
```

**Use for**: Autocomplete systems with hot/suggested rankings.

---

### Form 4: Binary Trie (Bitwise)

For number-based problems using binary representation.

```python
class BinaryTrieNode:
    def __init__(self):
        self.children = [None, None]  # 0 and 1
        self.count = 0  # Numbers passing through

class BinaryTrie:
    def __init__(self):
        self.root = BinaryTrieNode()
    
    def insert(self, num: int) -> None:
        current = self.root
        for i in range(31, -1, -1):  # 32 bits
            bit = (num >> i) & 1
            if current.children[bit] is None:
                current.children[bit] = BinaryTrieNode()
            current = current.children[bit]
            current.count += 1
    
    def find_max_xor(self, num: int) -> int:
        """Find number in trie that maximizes XOR with num."""
        current = self.root
        result = 0
        for i in range(31, -1, -1):
            bit = (num >> i) & 1
            opposite = 1 - bit
            if current.children[opposite]:
                result |= (1 << i)
                current = current.children[opposite]
            else:
                current = current.children[bit]
        return result
```

**Use for**: Maximum XOR of Two Numbers, bitwise prefix problems.

---

### Form 5: Trie with Wildcard Support

Modified search to handle '.' wildcards.

```python
class TrieWithWildcard:
    def search(self, word: str) -> bool:
        return self._search_helper(self.root, word, 0)
    
    def _search_helper(self, node, word, index):
        if index == len(word):
            return node.is_end_of_word
        
        char = word[index]
        if char == '.':
            # Try all possible children
            for child in node.children:
                if child is not None:
                    if self._search_helper(child, word, index + 1):
                        return True
            return False
        else:
            idx = ord(char) - ord('a')
            if node.children[idx] is None:
                return False
            return self._search_helper(node.children[idx], word, index + 1)
```

**Use for**: Add and Search Word - Data structure design (LeetCode 211).

---

### Form 6: Suffix Trie / Reversed Trie

Store reversed words for suffix matching.

```python
class ReversedTrie:
    """Insert reversed words to support suffix queries."""
    
    def insert(self, word: str) -> None:
        # Insert reversed
        reversed_word = word[::-1]
        # ... normal insert logic
    
    def has_suffix(self, suffix: str) -> bool:
        # Check reversed suffix as prefix
        reversed_suffix = suffix[::-1]
        return self.starts_with(reversed_suffix)
```

**Use for**: Prefix and Suffix Search problems.

---

### Quick Reference: Form Selection

| Problem Type | Form to Use |
|--------------|-------------|
| Basic prefix/word check | Standard Trie |
| Return found words | Trie with word storage |
| Autocomplete with ranking | Trie with frequency |
| Maximum XOR / bitwise | Binary Trie |
| Wildcard pattern matching | Trie with wildcard support |
| Suffix search | Reversed Trie |
| Multiple results needed | Any with DFS enumeration |

<!-- back -->
