# Trie - Tries / Prefix Trees

## Problem Description

The **Trie (Prefix Tree)** pattern is used to solve problems involving string prefixes, autocomplete, and efficient word storage/retrieval. A trie is a tree-like data structure where each node represents a character, and paths from root to nodes represent strings or prefixes. This pattern allows for efficient prefix-based operations.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Input** | Words/strings to store or query |
| **Output** | Boolean (exists), prefix matches, or autocomplete suggestions |
| **Key Insight** | Share common prefixes to save space and enable fast prefix operations |
| **Time Complexity** | O(m) for insert/search, where m = word length |
| **Space Complexity** | O(n × m) in worst case, but typically less due to prefix sharing |

### When to Use

- **Prefix matching**: Finding all words with a given prefix
- **Autocomplete systems**: Type-ahead search suggestions
- **Spell checking**: Dictionary implementations
- **Word search in grids**: Efficiently checking multiple words against a grid
- **IP routing**: Longest prefix matching
- **DNA sequence analysis**: Bioinformatics applications

---

## Intuition

### Core Insight

The key insight behind tries is that **sharing common prefixes saves space and enables efficient prefix operations**:

1. **Common prefix sharing**: Words like "cat", "car", "card" share the "ca" prefix in the trie
2. **Path represents string**: The path from root to any node spells out a prefix
3. **End-of-word marking**: Nodes have a flag indicating if they complete a valid word
4. **O(m) operations**: Insert, search, and prefix check all take time proportional to word length

### The "Aha!" Moments

1. **Why not just use a HashMap?** HashMaps can't efficiently answer "what words start with prefix X?" You'd need to scan all keys. Tries naturally group by prefix.

2. **How does space compare to HashMap?** Tries can use less space when there are many shared prefixes. In worst case (no shared prefixes), tries use more space due to node overhead.

3. **Why 26 children per node?** For lowercase English letters. You can use HashMap for children if the alphabet is large or unknown, trading some speed for space flexibility.

### Trie Structure Visualization

```
Inserting: "cat", "car", "card", "dog"

        root
       /    \
      c      d
     /        \
    a          o
   / \          \
  t   r*         g*
       \
        d*

* marks end of word

Search "car": Follow c→a→r, found end marker ✓
Search "care": Follow c→a→r, no 'e' child ✗
Prefix "ca": Follow c→a, node exists ✓
```

---

## Solution Approaches

### Approach 1: Standard Trie with Array ⭐

The classic implementation using a fixed-size array for children (26 for lowercase English).

#### Algorithm

**Insert(word)**:
1. Start at root
2. For each character in word:
   - Calculate index: `char - 'a'`
   - If child doesn't exist, create new node
   - Move to child node
3. Mark final node as end-of-word

**Search(word)**:
1. Start at root
2. For each character:
   - If child doesn't exist, return False
   - Move to child
3. Return whether current node is end-of-word

**StartsWith(prefix)**:
1. Same as search, but don't need end-of-word check
2. Return True if we can traverse entire prefix

#### Implementation

````carousel
```python
class TrieNode:
    def __init__(self):
        self.children = [None] * 26  # For lowercase English letters
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def _char_to_index(self, ch: str) -> int:
        return ord(ch) - ord('a')
    
    def insert(self, word: str) -> None:
        """Insert a word into the trie."""
        current = self.root
        for char in word:
            index = self._char_to_index(char)
            if current.children[index] is None:
                current.children[index] = TrieNode()
            current = current.children[index]
        current.is_end_of_word = True
    
    def search(self, word: str) -> bool:
        """Return True if word exists in trie."""
        node = self._find_node(word)
        return node is not None and node.is_end_of_word
    
    def starts_with(self, prefix: str) -> bool:
        """Return True if any word starts with prefix."""
        return self._find_node(prefix) is not None
    
    def _find_node(self, word: str) -> TrieNode:
        """Helper: Find node corresponding to word/prefix."""
        current = self.root
        for char in word:
            index = self._char_to_index(char)
            if current.children[index] is None:
                return None
            current = current.children[index]
        return current
    
    def delete(self, word: str) -> bool:
        """Delete word from trie. Returns True if deleted."""
        def _delete(node, word, depth):
            if node is None:
                return False
            
            if depth == len(word):
                # Word found
                if not node.is_end_of_word:
                    return False  # Word doesn't exist
                node.is_end_of_word = False
                # Return True if node has no children (can be deleted)
                return all(child is None for child in node.children)
            
            index = self._char_to_index(word[depth])
            should_delete_child = _delete(node.children[index], word, depth + 1)
            
            if should_delete_child:
                node.children[index] = None
                # Return True if current node can be deleted
                return not node.is_end_of_word and all(child is None for child in node.children)
            
            return False
        
        return _delete(self.root, word, 0)
    
    def get_all_words(self) -> list:
        """Return all words in trie."""
        words = []
        def dfs(node, prefix):
            if node.is_end_of_word:
                words.append(prefix)
            for i, child in enumerate(node.children):
                if child:
                    dfs(child, prefix + chr(ord('a') + i))
        dfs(self.root, "")
        return words
    
    def get_words_with_prefix(self, prefix: str) -> list:
        """Return all words starting with prefix."""
        words = []
        node = self._find_node(prefix)
        if not node:
            return words
        
        def dfs(node, current):
            if node.is_end_of_word:
                words.append(current)
            for i, child in enumerate(node.children):
                if child:
                    dfs(child, current + chr(ord('a') + i))
        
        dfs(node, prefix)
        return words
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
using namespace std;

class TrieNode {
public:
    TrieNode* children[26];
    bool isEndOfWord;
    
    TrieNode() {
        for (int i = 0; i < 26; i++) {
            children[i] = nullptr;
        }
        isEndOfWord = false;
    }
};

class Trie {
private:
    TrieNode* root;
    
    TrieNode* findNode(const string& word) {
        TrieNode* current = root;
        for (char ch : word) {
            int index = ch - 'a';
            if (!current->children[index]) {
                return nullptr;
            }
            current = current->children[index];
        }
        return current;
    }
    
public:
    Trie() {
        root = new TrieNode();
    }
    
    void insert(const string& word) {
        TrieNode* current = root;
        for (char ch : word) {
            int index = ch - 'a';
            if (!current->children[index]) {
                current->children[index] = new TrieNode();
            }
            current = current->children[index];
        }
        current->isEndOfWord = true;
    }
    
    bool search(const string& word) {
        TrieNode* node = findNode(word);
        return node != nullptr && node->isEndOfWord;
    }
    
    bool startsWith(const string& prefix) {
        return findNode(prefix) != nullptr;
    }
};
```

<!-- slide -->
```java
class TrieNode {
    TrieNode[] children;
    boolean isEndOfWord;
    
    public TrieNode() {
        children = new TrieNode[26];
        isEndOfWord = false;
    }
}

class Trie {
    private TrieNode root;
    
    public Trie() {
        root = new TrieNode();
    }
    
    public void insert(String word) {
        TrieNode current = root;
        for (char ch : word.toCharArray()) {
            int index = ch - 'a';
            if (current.children[index] == null) {
                current.children[index] = new TrieNode();
            }
            current = current.children[index];
        }
        current.isEndOfWord = true;
    }
    
    public boolean search(String word) {
        TrieNode node = findNode(word);
        return node != null && node.isEndOfWord;
    }
    
    public boolean startsWith(String prefix) {
        return findNode(prefix) != null;
    }
    
    private TrieNode findNode(String word) {
        TrieNode current = root;
        for (char ch : word.toCharArray()) {
            int index = ch - 'a';
            if (current.children[index] == null) {
                return null;
            }
            current = current.children[index];
        }
        return current;
    }
}
```

<!-- slide -->
```javascript
/**
 * Initialize your data structure here.
 */
var Trie = function() {
    this.root = {};
};

/**
 * Inserts a word into the trie. 
 * @param {string} word
 * @return {void}
 */
Trie.prototype.insert = function(word) {
    let current = this.root;
    for (const char of word) {
        if (!current[char]) {
            current[char] = {};
        }
        current = current[char];
    }
    current.isEnd = true;
};

/**
 * Returns if the word is in the trie. 
 * @param {string} word
 * @return {boolean}
 */
Trie.prototype.search = function(word) {
    const node = this.findNode(word);
    return node !== null && node.isEnd === true;
};

/**
 * Returns if there is any word in the trie that starts with the given prefix. 
 * @param {string} prefix
 * @return {boolean}
 */
Trie.prototype.startsWith = function(prefix) {
    return this.findNode(prefix) !== null;
};

/**
 * Helper to find node for word/prefix
 * @param {string} word
 * @return {object|null}
 */
Trie.prototype.findNode = function(word) {
    let current = this.root;
    for (const char of word) {
        if (!current[char]) {
            return null;
        }
        current = current[char];
    }
    return current;
};
```
````

---

### Approach 2: Trie with HashMap

More flexible implementation using HashMap for children, supporting any character set.

#### Implementation

````carousel
```python
from collections import defaultdict

class TrieNodeHash:
    def __init__(self):
        self.children = {}  # HashMap instead of array
        self.is_end_of_word = False
        # Can also store additional data like word count, index, etc.

class TrieHash:
    """Trie using HashMap - supports any characters."""
    
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
    
    def count_words_with_prefix(self, prefix: str) -> int:
        """Count words starting with prefix (if nodes track count)."""
        node = self._find_node(prefix)
        if not node:
            return 0
        
        count = 0
        def dfs(node):
            nonlocal count
            if node.is_end_of_word:
                count += 1
            for child in node.children.values():
                dfs(child)
        
        dfs(node)
        return count
```

<!-- slide -->
```cpp
#include <unordered_map>
#include <string>
using namespace std;

class TrieNodeHash {
public:
    unordered_map<char, TrieNodeHash*> children;
    bool isEndOfWord;
    
    TrieNodeHash() : isEndOfWord(false) {}
};

class TrieHash {
private:
    TrieNodeHash* root;
    
public:
    TrieHash() {
        root = new TrieNodeHash();
    }
    
    void insert(const string& word) {
        TrieNodeHash* current = root;
        for (char ch : word) {
            if (current->children.find(ch) == current->children.end()) {
                current->children[ch] = new TrieNodeHash();
            }
            current = current->children[ch];
        }
        current->isEndOfWord = true;
    }
    
    bool search(const string& word) {
        TrieNodeHash* node = findNode(word);
        return node != nullptr && node->isEndOfWord;
    }
    
    bool startsWith(const string& prefix) {
        return findNode(prefix) != nullptr;
    }
    
private:
    TrieNodeHash* findNode(const string& word) {
        TrieNodeHash* current = root;
        for (char ch : word) {
            if (current->children.find(ch) == current->children.end()) {
                return nullptr;
            }
            current = current->children[ch];
        }
        return current;
    }
};
```

<!-- slide -->
```java
import java.util.HashMap;
import java.util.Map;

class TrieNodeHash {
    Map<Character, TrieNodeHash> children;
    boolean isEndOfWord;
    
    public TrieNodeHash() {
        children = new HashMap<>();
        isEndOfWord = false;
    }
}

class TrieHash {
    private TrieNodeHash root;
    
    public TrieHash() {
        root = new TrieNodeHash();
    }
    
    public void insert(String word) {
        TrieNodeHash current = root;
        for (char ch : word.toCharArray()) {
            current.children.putIfAbsent(ch, new TrieNodeHash());
            current = current.children.get(ch);
        }
        current.isEndOfWord = true;
    }
    
    public boolean search(String word) {
        TrieNodeHash node = findNode(word);
        return node != null && node.isEndOfWord;
    }
    
    public boolean startsWith(String prefix) {
        return findNode(prefix) != null;
    }
    
    private TrieNodeHash findNode(String word) {
        TrieNodeHash current = root;
        for (char ch : word.toCharArray()) {
            if (!current.children.containsKey(ch)) {
                return null;
            }
            current = current.children.get(ch);
        }
        return current;
    }
}
```

<!-- slide -->
```javascript
var TrieHash = function() {
    this.root = new TrieNodeHash();
};

function TrieNodeHash() {
    this.children = new Map();
    this.isEndOfWord = false;
}

TrieHash.prototype.insert = function(word) {
    let current = this.root;
    for (const char of word) {
        if (!current.children.has(char)) {
            current.children.set(char, new TrieNodeHash());
        }
        current = current.children.get(char);
    }
    current.isEndOfWord = true;
};

TrieHash.prototype.search = function(word) {
    const node = this.findNode(word);
    return node !== null && node.isEndOfWord;
};

TrieHash.prototype.startsWith = function(prefix) {
    return this.findNode(prefix) !== null;
};

TrieHash.prototype.findNode = function(word) {
    let current = this.root;
    for (const char of word) {
        if (!current.children.has(char)) {
            return null;
        }
        current = current.children.get(char);
    }
    return current;
};
```
````

---

## Complexity Analysis

| Operation | Array Implementation | HashMap Implementation |
|-----------|---------------------|----------------------|
| **Insert** | O(m) time, O(m) space | O(m) time, O(m) space |
| **Search** | O(m) time | O(m) time |
| **StartsWith** | O(m) time | O(m) time |
| **Space** | O(n × m × 26) | O(n × m) |

**Where:**
- `n` = number of words
- `m` = average word length

**Trade-offs:**
- **Array**: Faster access (index vs hash), more memory for sparse tries
- **HashMap**: Flexible character set, less memory for sparse tries

---

## Related Problems

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Implement Trie (Prefix Tree)** | [Link](https://leetcode.com/problems/implement-trie-prefix-tree/) | Basic trie implementation |
| **Longest Common Prefix** | [Link](https://leetcode.com/problems/longest-common-prefix/) | Find common prefix using trie |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Add and Search Word** | [Link](https://leetcode.com/problems/add-and-search-word-data-structure-design/) | Trie with wildcard (.) support |
| **Replace Words** | [Link](https://leetcode.com/problems/replace-words/) | Replace with shortest root |
| **Design Search Autocomplete System** | [Link](https://leetcode.com/problems/design-search-autocomplete-system/) | Hot suggestions |
| **Maximum XOR of Two Numbers** | [Link](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/) | Binary trie |
| **Map Sum Pairs** | [Link](https://leetcode.com/problems/map-sum-pairs/) | Trie with value tracking |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Word Search II** | [Link](https://leetcode.com/problems/word-search-ii/) | Find multiple words in grid |
| **Prefix and Suffix Search** | [Link](https://leetcode.com/problems/prefix-and-suffix-search/) | Combined prefix/suffix search |
| **Palindrome Pairs** | [Link](https://leetcode.com/problems/palindrome-pairs/) | Find palindrome pairs |
| **Concatenated Words** | [Link](https://leetcode.com/problems/concatenated-words/) | Words made of other words |

---

## Video Tutorial Links

1. [Implement Trie - NeetCode](https://www.youtube.com/watch?v=oobqoCJlHA0) - Complete trie implementation
2. [Trie Data Structure - Abdul Bari](https://www.youtube.com/watch?v=AXjmTQ8LEoI) - Conceptual explanation
3. [Word Search II - Backtracking + Trie](https://www.youtube.com/watch?v=asbcE9mZz_U) - Advanced application
4. [Autocomplete System Design](https://www.youtube.com/watch?v=us0qySiKPKQ) - Real-world application

---

## Summary

### Key Takeaways

1. **Tries excel at prefix operations** - O(m) time for prefix search
2. **Share common prefixes** - Saves space when words have common beginnings
3. **Two implementations** - Array (fast) vs HashMap (flexible)
4. **End-of-word marking** - Essential to distinguish words from prefixes
5. **DFS for word enumeration** - Traverse to get all words with prefix

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Forgetting end-of-word flag** | Always mark when inserting complete word |
| **Case sensitivity** | Convert to consistent case before operations |
| **Not handling empty string** | Decide if "" is a valid word in your use case |
| **Memory leaks in C++** | Implement destructor to delete nodes |
| **Confusing search with startsWith** | Search requires end-of-word check |

### Follow-up Questions

**Q1: How do you implement autocomplete with frequency?**

Store frequency count at each end-of-word node. During DFS for suggestions, collect words with their frequencies, then sort by frequency or use a heap to get top k.

**Q2: How do you support wildcard search (e.g., "c.t")?**

Modify search to handle '.': when encountering '.', recursively search all children. This changes search from O(m) to O(26^m) in worst case.

**Q3: Can you compress a trie?**

Yes! **Radix Tree (Compressed Trie)** merges chains of single-child nodes. This reduces space significantly for sparse tries.

**Q4: How is this used in Word Search II?**

Build a trie of all words, then DFS on the grid. At each cell, check if current path is a valid prefix in the trie. If not, prune that branch. If it's a complete word, add to results.

---

## Pattern Source

For more string and tree patterns, see:
- **[String - Anagram Check](/patterns/string-anagram-check-frequency-count-sort)**
- **[Backtracking - Word Search Grid](/patterns/backtracking-word-search-path-finding-in-grid)**
- **[Heap - Top K Elements](/patterns/heap-top-k-elements-selection-frequency)**
- **[Design - General/Specific](/patterns/design-general-specific)**

---

## Additional Resources

- [LeetCode Implement Trie](https://leetcode.com/problems/implement-trie-prefix-tree/)
- [GeeksforGeeks Trie](https://www.geeksforgeeks.org/trie-insert-and-search/)
- [Wikipedia - Trie](https://en.wikipedia.org/wiki/Trie)
- [Suffix Trees](https://www.geeksforgeeks.org/pattern-searching-using-suffix-tree/) - Advanced trie variant
