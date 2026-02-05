# Trie (Prefix Tree)

## Pattern Overview

The **Trie** pattern (also known as a Prefix Tree or Digital Tree) is a specialized tree-like data structure used to efficiently store and retrieve strings. Tries excel at operations like prefix matching, autocomplete, and dictionary lookups, making them fundamental for string-based problems.

**Core Challenge:** Efficiently store a collection of strings and enable fast queries for prefix existence, complete word lookup, and character-by-character traversal.

---

## Problem Description

A Trie is a multi-way tree structure where each node represents a character. The root represents an empty string, and each path from the root to a node represents a prefix or complete word. Tries enable O(m) time complexity for insertions, deletions, and searches, where m is the length of the string.

### Key Properties

1. **Node Structure:** Each node contains:
   - `children`: A map/array of child nodes (characters)
   - `isEndOfWord`: A boolean flag indicating if this node marks the end of a valid word

2. **Root Node:** The root node is empty and serves as the starting point

3. **Path Representation:** Each path from root to any node represents a prefix

4. **Alphabet Size:** Can be fixed (26 for lowercase letters) or dynamic (using hash maps)

### Problem Statement

Design a Trie that supports:
- `insert(word)`: Insert a word into the trie
- `search(word)`: Return true if the word is in the trie
- `startsWith(prefix)`: Return true if there is any word in the trie that starts with the prefix

---

## Examples

**Example 1:**
```
Input: ["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
       [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
Output: [null, null, true, false, true, null, true]
```

**Example 2:**
```
Trie operations:
insert("apple")
search("apple")   → true
search("app")     → false
startsWith("app") → true
insert("app")
search("app")     → true
```

**Example 3:**
```
insert("car")
insert("care")
insert("cat")
startsWith("c")   → true
startsWith("ca")  → true
startsWith("car") → true
startsWith("cb")  → false
```

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 ≤ word.length, prefix.length ≤ 2000` | String lengths can be substantial |
| `1 ≤ number of operations ≤ 10^5` | Many operations may be performed |
| Only lowercase English letters | All characters are 'a' through 'z' |
| All inputs are non-empty strings | No empty string operations |

---

## Intuition

The core insight behind using a Trie is:

> **A Trie organizes strings in a tree structure where common prefixes share nodes, enabling efficient prefix-based queries and word lookups.**

This leads to several key advantages:

### Why Tries Work

1. **Prefix Sharing:** Words with common prefixes share nodes, saving space
2. **O(m) Operations:** Search, insert, and delete are O(m) where m is word length
3. **Prefix Queries:** `startsWith` is naturally supported by traversing the prefix
4. **No Hash Collisions:** Direct character-based navigation avoids hash overhead

### Alternative Perspectives

- **As a Tree:** Each level represents a character position
- **As a Digital Search Tree:** Digit (character) determines path
- **As a Prefix Map:** Maps prefixes to their existence

---

## Approach 1: Basic Trie with Array Children ⭐

### Algorithm

1. **Node Structure:**
   - Create a `TrieNode` class with:
     - `children`: Array of 26 null values (for each letter)
     - `isEnd`: Boolean flag for word end

2. **Insert Operation:**
   - Start at root
   - For each character in the word:
     - Calculate index (`char - 'a'`)
     - Create new node if it doesn't exist
     - Move to child node
   - Mark the final node as end of word

3. **Search Operation:**
   - Traverse through each character
   - If at any point the child doesn't exist, return false
   - If all characters found, return the node's `isEnd` flag

4. **StartsWith Operation:**
   - Traverse through each character
   - If at any point the child doesn't exist, return false
   - Return true if all characters found (no need to check `isEnd`)

### Why This Works

The array-based approach provides O(1) access to child nodes by using direct indexing. This makes it highly efficient for fixed alphabets like lowercase English letters.

### Code Templates

````carousel
<!-- slide -->
```python
class TrieNode:
    """
    A node in the Trie.
    
    Attributes:
        children: Array of 26 child nodes
        isEnd: Boolean indicating if this node marks the end of a word
    """
    def __init__(self):
        self.children = [None] * 26  # Fixed size for 26 lowercase letters
        self.isEnd = False


class Trie:
    """
    Trie data structure for efficient string operations.
    
    Time Complexity: O(m) for insert, search, and startsWith
    Space Complexity: O(m * n) in worst case, where m is word length and n is number of words
    """
    
    def __init__(self):
        """Initialize the Trie with a root node."""
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        """
        Insert a word into the trie.
        
        Args:
            word: The word to insert
        """
        node = self.root
        
        for char in word:
            index = ord(char) - ord('a')
            if node.children[index] is None:
                node.children[index] = TrieNode()
            node = node.children[index]
        
        node.isEnd = True
    
    def search(self, word: str) -> bool:
        """
        Returns true if the word is in the trie.
        
        Args:
            word: The word to search for
            
        Returns:
            True if the word exists, False otherwise
        """
        node = self._traverse(word)
        return node is not None and node.isEnd
    
    def startsWith(self, prefix: str) -> bool:
        """
        Returns true if there is any word in the trie that starts with the prefix.
        
        Args:
            prefix: The prefix to check
            
        Returns:
            True if any word starts with the prefix, False otherwise
        """
        return self._traverse(prefix) is not None
    
    def _traverse(self, prefix: str):
        """
        Helper method to traverse the trie for a given prefix.
        
        Args:
            prefix: The prefix to traverse
            
        Returns:
            The node at the end of the prefix, or None if path doesn't exist
        """
        node = self.root
        for char in prefix:
            index = ord(char) - ord('a')
            if node.children[index] is None:
                return None
            node = node.children[index]
        return node
```
<!-- slide -->
```java
class TrieNode {
    /** Array of child nodes for 26 lowercase letters */
    TrieNode[] children;
    /** Boolean indicating if this node marks the end of a word */
    boolean isEnd;
    
    /** Initialize the TrieNode with empty children array */
    public TrieNode() {
        children = new TrieNode[26];
        isEnd = false;
    }
}


class Trie {
    private TrieNode root;
    
    /** Initialize the Trie with an empty root node */
    public Trie() {
        root = new TrieNode();
    }
    
    /**
     * Inserts a word into the trie.
     * 
     * @param word The word to insert
     */
    public void insert(String word) {
        TrieNode node = root;
        
        for (char c : word.toCharArray()) {
            int index = c - 'a';
            if (node.children[index] == null) {
                node.children[index] = new TrieNode();
            }
            node = node.children[index];
        }
        
        node.isEnd = true;
    }
    
    /**
     * Returns true if the word is in the trie.
     * 
     * @param word The word to search for
     * @return True if the word exists, False otherwise
     */
    public boolean search(String word) {
        TrieNode node = traverse(word);
        return node != null && node.isEnd;
    }
    
    /**
     * Returns true if there is any word in the trie that starts with the prefix.
     * 
     * @param prefix The prefix to check
     * @return True if any word starts with the prefix, False otherwise
     */
    public boolean startsWith(String prefix) {
        return traverse(prefix) != null;
    }
    
    /**
     * Helper method to traverse the trie for a given prefix.
     * 
     * @param prefix The prefix to traverse
     * @return The node at the end of the prefix, or null if path doesn't exist
     */
    private TrieNode traverse(String prefix) {
        TrieNode node = root;
        
        for (char c : prefix.toCharArray()) {
            int index = c - 'a';
            if (node.children[index] == null) {
                return null;
            }
            node = node.children[index];
        }
        
        return node;
    }
}
```
<!-- slide -->
```cpp
#include <vector>
#include <string>

class TrieNode {
public:
    /** Array of child nodes for 26 lowercase letters */
    std::vector<TrieNode*> children;
    /** Boolean indicating if this node marks the end of a word */
    bool isEnd;
    
    /** Initialize the TrieNode with empty children array */
    TrieNode() : children(26, nullptr), isEnd(false) {}
    
    /** Destructor to clean up children */
    ~TrieNode() {
        for (auto child : children) {
            delete child;
        }
    }
};


class Trie {
private:
    TrieNode* root;
    
public:
    /** Initialize the Trie with an empty root node */
    Trie() : root(new TrieNode()) {}
    
    /** Destructor to clean up the entire trie */
    ~Trie() {
        delete root;
    }
    
    /**
     * Inserts a word into the trie.
     * 
     * @param word The word to insert
     */
    void insert(std::string word) {
        TrieNode* node = root;
        
        for (char c : word) {
            int index = c - 'a';
            if (node->children[index] == nullptr) {
                node->children[index] = new TrieNode();
            }
            node = node->children[index];
        }
        
        node->isEnd = true;
    }
    
    /**
     * Returns true if the word is in the trie.
     * 
     * @param word The word to search for
     * @return True if the word exists, False otherwise
     */
    bool search(std::string word) {
        TrieNode* node = traverse(word);
        return node != nullptr && node->isEnd;
    }
    
    /**
     * Returns true if there is any word in the trie that starts with the prefix.
     * 
     * @param prefix The prefix to check
     * @return True if any word starts with the prefix, False otherwise
     */
    bool startsWith(std::string prefix) {
        return traverse(prefix) != nullptr;
    }
    
private:
    /**
     * Helper method to traverse the trie for a given prefix.
     * 
     * @param prefix The prefix to traverse
     * @return The node at the end of the prefix, or nullptr if path doesn't exist
     */
    TrieNode* traverse(std::string prefix) {
        TrieNode* node = root;
        
        for (char c : prefix) {
            int index = c - 'a';
            if (node->children[index] == nullptr) {
                return nullptr;
            }
            node = node->children[index];
        }
        
        return node;
    }
};
```
<!-- slide -->
```javascript
/**
 * TrieNode class for the Trie data structure.
 */
class TrieNode {
    constructor() {
        /** Array of child nodes for 26 lowercase letters */
        this.children = new Array(26).fill(null);
        /** Boolean indicating if this node marks the end of a word */
        this.isEnd = false;
    }
}

/**
 * Trie data structure for efficient string operations.
 */
class Trie {
    constructor() {
        /** Initialize the Trie with an empty root node */
        this.root = new TrieNode();
    }
    
    /**
     * Inserts a word into the trie.
     * 
     * @param {string} word - The word to insert
     */
    insert(word) {
        let node = this.root;
        
        for (let i = 0; i < word.length; i++) {
            const index = word.charCodeAt(i) - 'a'.charCodeAt(0);
            if (node.children[index] === null) {
                node.children[index] = new TrieNode();
            }
            node = node.children[index];
        }
        
        node.isEnd = true;
    }
    
    /**
     * Returns true if the word is in the trie.
     * 
     * @param {string} word - The word to search for
     * @return {boolean} - True if the word exists, False otherwise
     */
    search(word) {
        const node = this._traverse(word);
        return node !== null && node.isEnd;
    }
    
    /**
     * Returns true if there is any word in the trie that starts with the prefix.
     * 
     * @param {string} prefix - The prefix to check
     * @return {boolean} - True if any word starts with the prefix, False otherwise
     */
    startsWith(prefix) {
        return this._traverse(prefix) !== null;
    }
    
    /**
     * Helper method to traverse the trie for a given prefix.
     * 
     * @param {string} prefix - The prefix to traverse
     * @return {TrieNode|null} - The node at the end of the prefix, or null if path doesn't exist
     */
    _traverse(prefix) {
        let node = this.root;
        
        for (let i = 0; i < prefix.length; i++) {
            const index = prefix.charCodeAt(i) - 'a'.charCodeAt(0);
            if (node.children[index] === null) {
                return null;
            }
            node = node.children[index];
        }
        
        return node;
    }
}
```
````

### Time Complexity

| Operation | Time Complexity | Description |
|-----------|-----------------|-------------|
| Insert | O(m) | Traverse/create m nodes |
| Search | O(m) | Traverse m nodes, check isEnd |
| startsWith | O(m) | Traverse m nodes only |

### Space Complexity

**O(m × n)** in worst case, where m is the average word length and n is the number of words. This occurs when words have no common prefixes.

### Pros

- ✅ O(m) time complexity for all operations
- ✅ Simple and intuitive implementation
- ✅ Efficient for fixed alphabets
- ✅ No hash collisions
- ✅ Cache-friendly due to array access

### Cons

- ❗ Fixed array size even if few children exist
- ❗ Memory intensive for sparse tries
- ❗ Only works for fixed character sets

---

## Approach 2: Trie with Hash Map Children ⭐⭐

### Algorithm

The hash map approach replaces the fixed-size array with a dynamic dictionary/map. This provides flexibility for:

- Variable character sets (unicode, mixed case)
- Sparse tries (many missing children)
- Memory-efficient storage

### Why This Works

Hash maps only store existing children, making them ideal when:
- The character set is large or unknown
- Many nodes have few children
- Memory efficiency is important

### Code Templates

````carousel
<!-- slide -->
```python
from typing import Dict, Optional


class TrieNode:
    """
    A node in the Trie using hash map for children.
    
    Attributes:
        children: Dictionary mapping characters to child nodes
        isEnd: Boolean indicating if this node marks the end of a word
    """
    def __init__(self):
        self.children: Dict[str, 'TrieNode'] = {}
        self.isEnd = False


class Trie:
    """
    Trie data structure using hash map for children.
    
    Time Complexity: O(m) for insert, search, and startsWith
    Space Complexity: O(m * n) in worst case, more memory efficient for sparse tries
    """
    
    def __init__(self):
        """Initialize the Trie with a root node."""
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        """
        Insert a word into the trie.
        
        Args:
            word: The word to insert
        """
        node = self.root
        
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        
        node.isEnd = True
    
    def search(self, word: str) -> bool:
        """
        Returns true if the word is in the trie.
        
        Args:
            word: The word to search for
            
        Returns:
            True if the word exists, False otherwise
        """
        node = self._traverse(word)
        return node is not None and node.isEnd
    
    def startsWith(self, prefix: str) -> bool:
        """
        Returns true if there is any word in the trie that starts with the prefix.
        
        Args:
            prefix: The prefix to check
            
        Returns:
            True if any word starts with the prefix, False otherwise
        """
        return self._traverse(prefix) is not None
    
    def _traverse(self, prefix: str) -> Optional[TrieNode]:
        """
        Helper method to traverse the trie for a given prefix.
        
        Args:
            prefix: The prefix to traverse
            
        Returns:
            The node at the end of the prefix, or None if path doesn't exist
        """
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
```
<!-- slide -->
```java
import java.util.HashMap;
import java.util.Map;


class TrieNode {
    /** Map of child nodes keyed by character */
    Map<Character, TrieNode> children;
    /** Boolean indicating if this node marks the end of a word */
    boolean isEnd;
    
    /** Initialize the TrieNode with empty children map */
    public TrieNode() {
        children = new HashMap<>();
        isEnd = false;
    }
}


class Trie {
    private TrieNode root;
    
    /** Initialize the Trie with an empty root node */
    public Trie() {
        root = new TrieNode();
    }
    
    /**
     * Inserts a word into the trie.
     * 
     * @param word The word to insert
     */
    public void insert(String word) {
        TrieNode node = root;
        
        for (char c : word.toCharArray()) {
            if (!node.children.containsKey(c)) {
                node.children.put(c, new TrieNode());
            }
            node = node.children.get(c);
        }
        
        node.isEnd = true;
    }
    
    /**
     * Returns true if the word is in the trie.
     * 
     * @param word The word to search for
     * @return True if the word exists, False otherwise
     */
    public boolean search(String word) {
        TrieNode node = traverse(word);
        return node != null && node.isEnd;
    }
    
    /**
     * Returns true if there is any word in the trie that starts with the prefix.
     * 
     * @param prefix The prefix to check
     * @return True if any word starts with the prefix, False otherwise
     */
    public boolean startsWith(String prefix) {
        return traverse(prefix) != null;
    }
    
    /**
     * Helper method to traverse the trie for a given prefix.
     * 
     * @param prefix The prefix to traverse
     * @return The node at the end of the prefix, or null if path doesn't exist
     */
    private TrieNode traverse(String prefix) {
        TrieNode node = root;
        
        for (char c : prefix.toCharArray()) {
            if (!node.children.containsKey(c)) {
                return null;
            }
            node = node.children.get(c);
        }
        
        return node;
    }
}
```
<!-- slide -->
```cpp
#include <unordered_map>
#include <string>

class TrieNode {
public:
    /** Map of child nodes keyed by character */
    std::unordered_map<char, TrieNode*> children;
    /** Boolean indicating if this node marks the end of a word */
    bool isEnd;
    
    /** Initialize the TrieNode with empty children map */
    TrieNode() : isEnd(false) {}
    
    /** Destructor to clean up children */
    ~TrieNode() {
        for (auto& pair : children) {
            delete pair.second;
        }
    }
};


class Trie {
private:
    TrieNode* root;
    
public:
    /** Initialize the Trie with an empty root node */
    Trie() : root(new TrieNode()) {}
    
    /** Destructor to clean up the entire trie */
    ~Trie() {
        delete root;
    }
    
    /**
     * Inserts a word into the trie.
     * 
     * @param word The word to insert
     */
    void insert(std::string word) {
        TrieNode* node = root;
        
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        
        node->isEnd = true;
    }
    
    /**
     * Returns true if the word is in the trie.
     * 
     * @param word The word to search for
     * @return True if the word exists, False otherwise
     */
    bool search(std::string word) {
        TrieNode* node = traverse(word);
        return node != nullptr && node->isEnd;
    }
    
    /**
     * Returns true if there is any word in the trie that starts with the prefix.
     * 
     * @param prefix The prefix to check
     * @return True if any word starts with the prefix, False otherwise
     */
    bool startsWith(std::string prefix) {
        return traverse(prefix) != nullptr;
    }
    
private:
    /**
     * Helper method to traverse the trie for a given prefix.
     * 
     * @param prefix The prefix to traverse
     * @return The node at the end of the prefix, or nullptr if path doesn't exist
     */
    TrieNode* traverse(std::string prefix) {
        TrieNode* node = root;
        
        for (char c : prefix) {
            if (node->children.find(c) == node->children.end()) {
                return nullptr;
            }
            node = node->children[c];
        }
        
        return node;
    }
};
```
<!-- slide -->
```javascript
/**
 * TrieNode class for the Trie data structure using Map for children.
 */
class TrieNode {
    constructor() {
        /** Map of child nodes keyed by character */
        this.children = new Map();
        /** Boolean indicating if this node marks the end of a word */
        this.isEnd = false;
    }
}

/**
 * Trie data structure using hash map for children.
 */
class Trie {
    constructor() {
        /** Initialize the Trie with an empty root node */
        this.root = new TrieNode();
    }
    
    /**
     * Inserts a word into the trie.
     * 
     * @param {string} word - The word to insert
     */
    insert(word) {
        let node = this.root;
        
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        
        node.isEnd = true;
    }
    
    /**
     * Returns true if the word is in the trie.
     * 
     * @param {string} word - The word to search for
     * @return {boolean} - True if the word exists, False otherwise
     */
    search(word) {
        const node = this._traverse(word);
        return node !== null && node.isEnd;
    }
    
    /**
     * Returns true if there is any word in the trie that starts with the prefix.
     * 
     * @param {string} prefix - The prefix to check
     * @return {boolean} - True if any word starts with the prefix, False otherwise
     */
    startsWith(prefix) {
        return this._traverse(prefix) !== null;
    }
    
    /**
     * Helper method to traverse the trie for a given prefix.
     * 
     * @param {string} prefix - The prefix to traverse
     * @return {TrieNode|null} - The node at the end of the prefix, or null if path doesn't exist
     */
    _traverse(prefix) {
        let node = this.root;
        
        for (let i = 0; i < prefix.length; i++) {
            const char = prefix[i];
            if (!node.children.has(char)) {
                return null;
            }
            node = node.children.get(char);
        }
        
        return node;
    }
}
```
````

### Time Complexity

| Operation | Time Complexity | Description |
|-----------|-----------------|-------------|
| Insert | O(m) | Hash map operations are O(1) average |
| Search | O(m) | Hash map lookups |
| startsWith | O(m) | Hash map traversals |

### Space Complexity

**O(m × n)** but more memory efficient than array approach for sparse tries. Only stores existing children.

### Pros

- ✅ Flexible character sets (unicode, mixed case)
- ✅ Memory efficient for sparse tries
- ✅ Dynamic growth without fixed limits
- ✅ No wasted space for missing children

### Cons

- ❗ Hash map overhead compared to arrays
- ❗ Hash collisions (though rare)
- ❗ Slightly slower than array access

---

## Approach 3: Trie with Count Tracking ⭐⭐⭐

### Algorithm

This advanced Trie maintains a `count` field at each node to track how many words pass through that node. This enables:

- **Prefix Counting:** Count how many words start with a prefix
- **Word Deletion:** Safely remove words while maintaining structure
- **Autocomplete:** Find k most frequent completions

### Code Templates

````carousel
<!-- slide -->
```python
from typing import Optional


class TrieNode:
    """
    A node in the Trie with count tracking.
    
    Attributes:
        children: Array of 26 child nodes
        count: Number of words that pass through this node
        isEnd: Boolean indicating if this node marks the end of a word
    """
    def __init__(self):
        self.children = [None] * 26
        self.count = 0  # Number of words with this prefix
        self.isEnd = False


class Trie:
    """
    Trie data structure with count tracking.
    
    Enables prefix counting and word deletion.
    """
    
    def __init__(self):
        """Initialize the Trie with a root node."""
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        """
        Insert a word into the trie, incrementing counts along the path.
        
        Args:
            word: The word to insert
        """
        node = self.root
        
        for char in word:
            index = ord(char) - ord('a')
            if node.children[index] is None:
                node.children[index] = TrieNode()
            node = node.children[index]
            node.count += 1  # Increment count for this prefix
        
        node.isEnd = True
    
    def search(self, word: str) -> bool:
        """
        Returns true if the word is in the trie.
        
        Args:
            word: The word to search for
            
        Returns:
            True if the word exists, False otherwise
        """
        node = self._traverse(word)
        return node is not None and node.isEnd
    
    def startsWith(self, prefix: str) -> bool:
        """
        Returns true if there is any word in the trie that starts with the prefix.
        
        Args:
            prefix: The prefix to check
            
        Returns:
            True if any word starts with the prefix, False otherwise
        """
        return self._traverse(prefix) is not None
    
    def prefixCount(self, prefix: str) -> int:
        """
        Returns the number of words that start with the given prefix.
        
        Args:
            prefix: The prefix to check
            
        Returns:
            Number of words with this prefix, 0 if prefix doesn't exist
        """
        node = self._traverse(prefix)
        return node.count if node else 0
    
    def delete(self, word: str) -> bool:
        """
        Deletes a word from the trie if it exists.
        
        Args:
            word: The word to delete
            
        Returns:
            True if the word was deleted, False if it didn't exist
        """
        # First check if word exists
        if not self.search(word):
            return False
        
        node = self.root
        
        # Decrement counts along the path
        for char in word:
            index = ord(char) - ord('a')
            node.children[index].count -= 1
            node = node.children[index]
        
        node.isEnd = False
        return True
    
    def _traverse(self, prefix: str) -> Optional[TrieNode]:
        """
        Helper method to traverse the trie for a given prefix.
        
        Args:
            prefix: The prefix to traverse
            
        Returns:
            The node at the end of the prefix, or None if path doesn't exist
        """
        node = self.root
        for char in prefix:
            index = ord(char) - ord('a')
            if node.children[index] is None:
                return None
            node = node.children[index]
        return node
```
<!-- slide -->
```java
class TrieNode {
    /** Array of child nodes for 26 lowercase letters */
    TrieNode[] children;
    /** Number of words that pass through this node */
    int count;
    /** Boolean indicating if this node marks the end of a word */
    boolean isEnd;
    
    /** Initialize the TrieNode with empty children array */
    public TrieNode() {
        children = new TrieNode[26];
        count = 0;
        isEnd = false;
    }
}


class Trie {
    private TrieNode root;
    
    /** Initialize the Trie with an empty root node */
    public Trie() {
        root = new TrieNode();
    }
    
    /**
     * Inserts a word into the trie, incrementing counts along the path.
     * 
     * @param word The word to insert
     */
    public void insert(String word) {
        TrieNode node = root;
        
        for (char c : word.toCharArray()) {
            int index = c - 'a';
            if (node.children[index] == null) {
                node.children[index] = new TrieNode();
            }
            node = node.children[index];
            node.count++;
        }
        
        node.isEnd = true;
    }
    
    /**
     * Returns true if the word is in the trie.
     * 
     * @param word The word to search for
     * @return True if the word exists, False otherwise
     */
    public boolean search(String word) {
        TrieNode node = traverse(word);
        return node != null && node.isEnd;
    }
    
    /**
     * Returns true if there is any word in the trie that starts with the prefix.
     * 
     * @param prefix The prefix to check
     * @return True if any word starts with the prefix, False otherwise
     */
    public boolean startsWith(String prefix) {
        return traverse(prefix) != null;
    }
    
    /**
     * Returns the number of words that start with the given prefix.
     * 
     * @param prefix The prefix to check
     * @return Number of words with this prefix, 0 if prefix doesn't exist
     */
    public int prefixCount(String prefix) {
        TrieNode node = traverse(prefix);
        return node != null ? node.count : 0;
    }
    
    /**
     * Deletes a word from the trie if it exists.
     * 
     * @param word The word to delete
     * @return True if the word was deleted, False if it didn't exist
     */
    public boolean delete(String word) {
        if (!search(word)) {
            return false;
        }
        
        TrieNode node = root;
        
        for (char c : word.toCharArray()) {
            int index = c - 'a';
            node.children[index].count--;
            node = node.children[index];
        }
        
        node.isEnd = false;
        return true;
    }
    
    private TrieNode traverse(String prefix) {
        TrieNode node = root;
        
        for (char c : prefix.toCharArray()) {
            int index = c - 'a';
            if (node.children[index] == null) {
                return null;
            }
            node = node.children[index];
        }
        
        return node;
    }
}
```
<!-- slide -->
```cpp
#include <vector>
#include <string>

class TrieNode {
public:
    std::vector<TrieNode*> children;
    int count;
    bool isEnd;
    
    TrieNode() : children(26, nullptr), count(0), isEnd(false) {}
    
    ~TrieNode() {
        for (auto child : children) {
            delete child;
        }
    }
};


class Trie {
private:
    TrieNode* root;
    
public:
    Trie() : root(new TrieNode()) {}
    
    ~Trie() {
        delete root;
    }
    
    void insert(std::string word) {
        TrieNode* node = root;
        
        for (char c : word) {
            int index = c - 'a';
            if (node->children[index] == nullptr) {
                node->children[index] = new TrieNode();
            }
            node = node->children[index];
            node->count++;
        }
        
        node->isEnd = true;
    }
    
    bool search(std::string word) {
        TrieNode* node = traverse(word);
        return node != nullptr && node->isEnd;
    }
    
    bool startsWith(std::string prefix) {
        return traverse(prefix) != nullptr;
    }
    
    int prefixCount(std::string prefix) {
        TrieNode* node = traverse(prefix);
        return node != nullptr ? node->count : 0;
    }
    
    bool deleteWord(std::string word) {
        if (!search(word)) {
            return false;
        }
        
        TrieNode* node = root;
        
        for (char c : word) {
            int index = c - 'a';
            node->children[index]->count--;
            node = node->children[index];
        }
        
        node->isEnd = false;
        return true;
    }
    
private:
    TrieNode* traverse(std::string prefix) {
        TrieNode* node = root;
        
        for (char c : prefix) {
            int index = c - 'a';
            if (node->children[index] == nullptr) {
                return nullptr;
            }
            node = node->children[index];
        }
        
        return node;
    }
};
```
<!-- slide -->
```javascript
/**
 * TrieNode class for the Trie data structure with count tracking.
 */
class TrieNode {
    constructor() {
        this.children = new Array(26).fill(null);
        this.count = 0;
        this.isEnd = false;
    }
}

/**
 * Trie data structure with count tracking.
 */
class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    /**
     * Inserts a word into the trie, incrementing counts along the path.
     * 
     * @param {string} word - The word to insert
     */
    insert(word) {
        let node = this.root;
        
        for (let i = 0; i < word.length; i++) {
            const index = word.charCodeAt(i) - 'a'.charCodeAt(0);
            if (node.children[index] === null) {
                node.children[index] = new TrieNode();
            }
            node = node.children[index];
            node.count++;
        }
        
        node.isEnd = true;
    }
    
    /**
     * Returns true if the word is in the trie.
     * 
     * @param {string} word - The word to search for
     * @return {boolean} - True if the word exists, False otherwise
     */
    search(word) {
        const node = this._traverse(word);
        return node !== null && node.isEnd;
    }
    
    /**
     * Returns true if there is any word in the trie that starts with the prefix.
     * 
     * @param {string} prefix - The prefix to check
     * @return {boolean} - True if any word starts with the prefix, False otherwise
     */
    startsWith(prefix) {
        return this._traverse(prefix) !== null;
    }
    
    /**
     * Returns the number of words that start with the given prefix.
     * 
     * @param {string} prefix - The prefix to check
     * @return {number} - Number of words with this prefix
     */
    prefixCount(prefix) {
        const node = this._traverse(prefix);
        return node !== null ? node.count : 0;
    }
    
    /**
     * Deletes a word from the trie if it exists.
     * 
     * @param {string} word - The word to delete
     * @return {boolean} - True if deleted, False otherwise
     */
    delete(word) {
        if (!this.search(word)) {
            return false;
        }
        
        let node = this.root;
        
        for (let i = 0; i < word.length; i++) {
            const index = word.charCodeAt(i) - 'a'.charCodeAt(0);
            node.children[index].count--;
            node = node.children[index];
        }
        
        node.isEnd = false;
        return true;
    }
    
    _traverse(prefix) {
        let node = this.root;
        
        for (let i = 0; i < prefix.length; i++) {
            const index = prefix.charCodeAt(i) - 'a'.charCodeAt(0);
            if (node.children[index] === null) {
                return null;
            }
            node = node.children[index];
        }
        
        return node;
    }
}
```
````

### Time Complexity

| Operation | Time Complexity | Description |
|-----------|-----------------|-------------|
| Insert | O(m) | Traverse and increment count |
| Search | O(m) | Standard search |
| startsWith | O(m) | Standard prefix check |
| prefixCount | O(m) | Return stored count |
| Delete | O(m) | Traverse and decrement count |

### Space Complexity

**O(m × n)** plus O(1) per node for the count field. Negligible overhead.

### Pros

- ✅ Enables prefix counting
- ✅ Supports safe deletion
- ✅ Foundation for autocomplete
- ✅ Can track word frequency

### Cons

- ❗ Slightly more memory per node
- ❗ Requires careful deletion logic
- ❗ Count may need updating on insert/delete

---

## Step-by-Step Example

Let's trace through inserting "apple", "app", and "banana" into a basic Trie:

### Initial State
```
root: {}
```

### Insert "apple"

```
Step 1: 'a' → create node, root.children['a'] = node_a
Step 2: 'p' → create node, node_a.children['p'] = node_p
Step 3: 'p' → create node, node_p.children['p'] = node_p2
Step 4: 'l' → create node, node_p2.children['l'] = node_l
Step 5: 'e' → create node, node_l.children['e'] = node_e
         → mark node_e.isEnd = True
```

### Insert "app"

```
Step 1: 'a' → node_a already exists
Step 2: 'p' → node_p already exists
Step 3: 'p' → node_p2 already exists
         → mark node_p2.isEnd = True
```

### Insert "banana"

```
Step 1: 'b' → create node, root.children['b'] = node_b
Step 2: 'a' → create node, node_b.children['a'] = node_ba
Step 3: 'n' → create node, node_ba.children['n'] = node_ban
Step 4: 'a' → create node, node_ban.children['a'] = node_bana
Step 5: 'n' → create node, node_bana.children['n'] = node_banan
Step 6: 'a' → create node, node_banan.children['a'] = node_banana
         → mark node_banana.isEnd = True
```

### Final Trie Structure

```
root
├── 'a' → node_a (isEnd: false)
│        └── 'p' → node_p (isEnd: false)
│                └── 'p' → node_p2 (isEnd: true)
│                        └── 'l' → node_l (isEnd: false)
│                                └── 'e' → node_e (isEnd: true)
└── 'b' → node_b (isEnd: false)
         └── 'a' → node_ba (isEnd: false)
                 └── 'n' → node_ban (isEnd: false)
                         └── 'a' → node_bana (isEnd: false)
                                 └── 'n' → node_banan (isEnd: false)
                                         └── 'a' → node_banana (isEnd: true)
```

### Search Operations

| Search | Result | Path |
|--------|--------|------|
| "apple" | true | Follow 'a'→'p'→'p'→'l'→'e', isEnd=true |
| "app" | true | Follow 'a'→'p'→'p', isEnd=true |
| "banana" | true | Full path exists |
| "ap" | false | Path exists but no word ends here |
| "cat" | false | 'c' doesn't exist at root |

### Prefix Operations

| startsWith | Result | Reason |
|-------------|--------|--------|
| "app" | true | Path 'a'→'p'→'p' exists |
| "apple" | true | Full path exists |
| "ban" | true | Path exists |
| "b" | true | Single 'b' child exists |
| "c" | false | No 'c' child |

---

## Time Complexity Comparison

| Approach | Insert | Search | startsWith | Space | Best For |
|----------|--------|--------|------------|-------|----------|
| Array-based | O(m) | O(m) | O(m) | Fixed overhead | Fixed alphabet, performance critical |
| Hash Map | O(m) | O(m) | O(m) | Dynamic | Variable alphabet, sparse tries |
| Count Tracking | O(m) | O(m) | O(m) | +O(1)/node | Prefix counting, deletion |

For standard lowercase English letters, the **array-based approach** is typically optimal. For variable character sets or unicode, use the **hash map approach**.

---

## When to Use This Pattern

Use the Trie pattern when you need to:

1. **Prefix Matching** - Find all words starting with a prefix
2. **Autocomplete** - Suggest completions based on partial input
3. **Dictionary Operations** - Store and lookup words efficiently
4. **Spell Checking** - Verify word existence and suggest corrections
5. **IP Routing** - Longest prefix matching in networking
6. **Word Games** - Scrabble, Boggle, crossword solvers

### Real-World Applications

- **Search Engines** - Autocomplete and suggestion systems
- **Code Editors** - IntelliSense and code completion
- **Spell Checkers** - Verify and suggest corrections
- **DNA Sequencing** - Pattern matching in biological sequences
- **Network Routing** - Longest prefix match for IP routing
- **Contact Lists** - Fast contact searching by name

---

## Related Problems

| Problem | Difficulty | Description | LeetCode Link |
|---------|------------|-------------|---------------|
| Implement Trie (Prefix Tree) | Medium | Basic Trie implementation | [Link](https://leetcode.com/problems/implement-trie-prefix-tree/) |
| Design Add and Search Words Data Structure | Medium | Trie with wildcard search | [Link](https://leetcode.com/problems/design-add-and-search-words-data-structure/) |
| Word Search II | Hard | Find words in a board using Trie | [Link](https://leetcode.com/problems/word-search-ii/) |
| Replace Words | Medium | Replace words with shortest root | [Link](https://leetcode.com/problems/replace-words/) |
| Maximum XOR of Two Numbers in an Array | Medium | Trie for bit manipulation | [Link](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/) |
| Concatenated Words | Hard | Form words from other words | [Link](https://leetcode.com/problems/concatenated-words/) |
| Longest Word in Dictionary | Easy | Build dictionary with common prefixes | [Link](https://leetcode.com/problems/longest-word-in-dictionary/) |
| Magic Dictionary | Medium | Build dictionary with one edit | [Link](https://leetcode.com/problems/implement-magic-dictionary/) |
| Search Suggestions System | Medium | Product search autocomplete | [Link](https://leetcode.com/problems/search-suggestions-system/) |
| Count Substrings with Only One Distinct Character | Medium | Trie for substring problems | [Link](https://leetcode.com/problems/count-substrings-with-only-one-distinct-character/) |

---

## Video Tutorials

| Tutorial | Platform | Link |
|----------|----------|------|
| NeetCode - Implement Trie | YouTube | [Watch](https://www.youtube.com/watch?v=7X7n5h6zGCk) |
| Back to Back SWE - Trie Introduction | YouTube | [Watch](https://www.youtube.com/watch?v=zx3Sw6W3GO8) |
| LeetCode Official - Implement Trie | YouTube | [Watch](https://www.youtube.com/watch?v=7X7n5h6zGCk) |
| Trie Patterns - Word Search II | YouTube | [Watch](https://www.youtube.com/watch?v=asbc861a5vQ) |
| Trie for Maximum XOR | YouTube | [Watch](https://www.youtube.com/watch?v=4qVOMvm1qAU) |

---

## Follow-up Questions

**1. How would you implement autocomplete using a Trie?**

Use DFS/BFS from the prefix node to collect all words. You can also maintain a priority queue for frequency-based suggestions.

**2. How do you handle memory efficiently in a Trie?**

Use a hash map instead of arrays for sparse tries. Consider node pooling for frequently created/destroyed tries.

**3. How would you implement word deletion safely?**

Track the count of words passing through each node. Only remove nodes when count reaches zero.

**4. How do you handle case-insensitive searches?**

Convert all input to lowercase before insertion and searching.

**5. How would you support wildcard characters (like '.') in search?**

Implement DFS from the current position, exploring all child branches when encountering a wildcard.

**6. What is the difference between a Trie and a Hash Map for string lookups?**

Trie preserves prefix information and enables prefix-based queries. Hash Map provides O(1) lookups but doesn't support prefix operations efficiently.

**7. How would you serialize and deserialize a Trie?**

Perform DFS to save nodes with their markers. Reconstruct by reading the serialized data.

**8. How do you optimize Tries for mobile/embedded systems?**

Use compressed tries (Patricia tries) to reduce memory footprint. Consider bit-packed children arrays.

---

## Common Mistakes to Avoid

1. **❌ Forgetting to mark end-of-word**
   - Always set `isEnd` after inserting the last character
   - Don't forget to check it during search

2. **❌ Memory leaks in C++**
   - Properly delete nodes in destructors
   - Use smart pointers for automatic memory management

3. **❌ Off-by-one errors in array indexing**
   - Remember: `index = char - 'a'` (not `char - 'a' + 1`)
   - Range should be 0-25 for 'a'-'z'

4. **❌ Not handling empty strings**
   - Edge case: empty prefix should return true for startsWith
   - Root node is the result for empty string

5. **❌ Assuming all children exist**
   - Always check if child node exists before accessing
   - Use null/None checks appropriately

6. **❌ Inefficient traversal for autocomplete**
   - Use early termination when all words are found
   - Consider limiting search depth for performance

7. **❌ Not handling concurrent access**
   - Tries are not thread-safe by default
   - Add locking for concurrent insert/search

---

## References

- [LeetCode 208 - Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)
- [Trie - Wikipedia](https://en.wikipedia.org/wiki/Trie)
- [Prefix Tree - GeeksforGeeks](https://www.geeksforgeeks.org/trie-insert-and-search/)
- [Dictionary Implementation using Trie](https://www.geeksforgeeks.org/dictionary-implementation-using-trie/)
