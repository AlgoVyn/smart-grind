# Implement Trie (Prefix Tree)

## Problem Description

A [Trie](https://en.wikipedia.org/wiki/Trie) (also known as a prefix tree) is a tree-like data structure that efficiently stores and retrieves strings based on their prefixes. Each node in the trie represents a character, and the path from the root to a node represents a prefix of one or more inserted words.

Implement a Trie class that supports the following operations:

1. **`insert(word)`** - Inserts a string `word` into the trie.
2. **`search(word)`** - Returns `true` if the string `word` is in the trie (i.e., inserted previously).
3. **`startsWith(prefix)`** - Returns `true` if there is any string in the trie that has the `prefix`.

### Example 1

**Input:**
```
Trie obj = new Trie();
obj.insert("apple");
obj.search("apple");   // returns true
obj.search("app");     // returns false
obj.startsWith("app"); // returns true
obj.insert("app");
obj.search("app");     // returns true
```

**Output:** Operations complete successfully with expected results.

### Example 2

**Input:**
```
Trie obj = new Trie();
obj.insert("cad");
obj.startsWith("ca");  // returns true
obj.search("ca");      // returns false (not inserted)
obj.insert("ca");
obj.search("ca");      // returns true
```

**Output:** Operations complete successfully with expected results.

### Constraints

- `word` and `prefix` consist only of lowercase English letters (`a` to `z`)
- `1 <= word.length, prefix.length <= 2000`
- Up to `10^4` operations may be performed
- All operations are called with valid inputs

---

## Intuition

The trie data structure exploits the fact that strings share common prefixes. Instead of storing each string independently, we share nodes for common character prefixes, making prefix-based operations extremely efficient.

### Key Insights

1. **Tree Structure**: A trie is a tree where each path from the root represents a string or prefix. The root is an empty node, and each edge represents a character.

2. **Node Design**: Each node needs:
   - An array or map of children (26 for lowercase letters)
   - A boolean flag indicating if this node marks the end of a valid word

3. **Efficiency**: By following character-by-character paths, we can:
   - Insert a word in O(L) time where L is the word length
   - Search for a word in O(L) time
   - Check for a prefix in O(P) time where P is the prefix length

### Why Use a Trie?

- **Prefix Queries**: Unlike hash tables, tries excel at prefix-based operations like `startsWith()`
- **Alphabetical Ordering**: Words are stored in sorted order naturally
- **Space Efficiency for Related Words**: Words sharing prefixes share nodes
- **No Hash Collisions**: Direct character-based lookup

---

## Approach 1: Array-Based Trie (Most Common)

This is the standard implementation using an array of size 26 for children at each node.

### Python Solution

````carousel
```python
class TrieNode:
    def __init__(self):
        self.children = [None] * 26
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def _char_to_index(self, char: str) -> int:
        """Convert a character to its index (0-25)"""
        return ord(char) - ord('a')
    
    def insert(self, word: str) -> None:
        """Inserts a word into the trie"""
        node = self.root
        for char in word:
            index = self._char_to_index(char)
            if node.children[index] is None:
                node.children[index] = TrieNode()
            node = node.children[index]
        node.is_end_of_word = True
    
    def search(self, word: str) -> bool:
        """Searches for a word in the trie"""
        node = self._search_prefix(word)
        return node is not None and node.is_end_of_word
    
    def startsWith(self, prefix: str) -> bool:
        """Checks if any word starts with the given prefix"""
        return self._search_prefix(prefix) is not None
    
    def _search_prefix(self, prefix: str) -> TrieNode:
        """Helper function to search for a prefix and return the node"""
        node = self.root
        for char in prefix:
            index = self._char_to_index(char)
            if node.children[index] is None:
                return None
            node = node.children[index]
        return node
```
<!-- slide -->
```cpp
#include <vector>
#include <string>
using namespace std;

class TrieNode {
public:
    vector<TrieNode*> children;
    bool is_end_of_word;
    
    TrieNode() : children(26, nullptr), is_end_of_word(false) {}
};

class Trie {
private:
    TrieNode* root;
    
    int charToIndex(char c) {
        return c - 'a';
    }
    
public:
    Trie() {
        root = new TrieNode();
    }
    
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int index = charToIndex(c);
            if (node->children[index] == nullptr) {
                node->children[index] = new TrieNode();
            }
            node = node->children[index];
        }
        node->is_end_of_word = true;
    }
    
    bool search(string word) {
        TrieNode* node = searchPrefix(word);
        return node != nullptr && node->is_end_of_word;
    }
    
    bool startsWith(string prefix) {
        return searchPrefix(prefix) != nullptr;
    }
    
private:
    TrieNode* searchPrefix(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            int index = charToIndex(c);
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
```java
class TrieNode {
    TrieNode[] children;
    boolean isEndOfWord;
    
    TrieNode() {
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
        TrieNode node = root;
        for (int i = 0; i < word.length(); i++) {
            char c = word.charAt(i);
            int index = c - 'a';
            if (node.children[index] == null) {
                node.children[index] = new TrieNode();
            }
            node = node.children[index];
        }
        node.isEndOfWord = true;
    }
    
    public boolean search(String word) {
        TrieNode node = searchPrefix(word);
        return node != null && node.isEndOfWord;
    }
    
    public boolean startsWith(String prefix) {
        return searchPrefix(prefix) != null;
    }
    
    private TrieNode searchPrefix(String prefix) {
        TrieNode node = root;
        for (int i = 0; i < prefix.length(); i++) {
            char c = prefix.charAt(i);
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
```javascript
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    /**
     * @param {string} word
     * @return {void}
     */
    insert(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }
    
    /**
     * @param {string} word
     * @return {boolean}
     */
    search(word) {
        const node = this.searchPrefix(word);
        return node !== null && node.isEndOfWord;
    }
    
    /**
     * @param {string} prefix
     * @return {boolean}
     */
    startsWith(prefix) {
        return this.searchPrefix(prefix) !== null;
    }
    
    /**
     * @param {string} prefix
     * @return {TrieNode|null}
     */
    searchPrefix(prefix) {
        let node = this.root;
        for (let i = 0; i < prefix.length; i++) {
            const char = prefix[i];
            if (!node.children[char]) {
                return null;
            }
            node = node.children[char];
        }
        return node;
    }
}
```
````

### Explanation

1. **TrieNode Class**: Each node contains:
   - `children`: Array of 26 child nodes (one for each letter)
   - `is_end_of_word`: Boolean indicating if this node completes a word

2. **insert()**: Traverses/creates nodes for each character, marking the final node as end-of-word.

3. **search()**: Traverses the trie following the word's characters. Returns true only if we reach the end and it's marked as a word.

4. **startsWith()**: Same traversal as search but doesn't require end-of-word marking.

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity (insert)** | O(L) where L is the word length |
| **Time Complexity (search)** | O(L) where L is the word length |
| **Time Complexity (startsWith)** | O(P) where P is the prefix length |
| **Space Complexity** | O(N × L) where N is the number of words and L is average word length |

### Why This Works

The array-based trie provides O(1) access to child nodes by using direct indexing. Each operation simply traverses the trie character by character, creating or following nodes as needed. The space-time tradeoff is acceptable since we're optimizing for fast lookups.

---

## Approach 2: HashMap-Based Trie (Space Optimized)

This approach uses a HashMap instead of a fixed-size array for children, saving space when the alphabet is sparse.

### Python Solution

````carousel
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        """Inserts a word into the trie"""
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True
    
    def search(self, word: str) -> bool:
        """Searches for a word in the trie"""
        node = self._search_prefix(word)
        return node is not None and node.is_end_of_word
    
    def startsWith(self, prefix: str) -> bool:
        """Checks if any word starts with the given prefix"""
        return self._search_prefix(prefix) is not None
    
    def _search_prefix(self, prefix: str) -> TrieNode:
        """Helper function to search for a prefix and return the node"""
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
```
<!-- slide -->
```cpp
#include <unordered_map>
#include <string>
using namespace std;

class TrieNode {
public:
    unordered_map<char, TrieNode*> children;
    bool is_end_of_word;
    
    TrieNode() : is_end_of_word(false) {}
};

class Trie {
private:
    TrieNode* root;
    
public:
    Trie() {
        root = new TrieNode();
    }
    
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->is_end_of_word = true;
    }
    
    bool search(string word) {
        TrieNode* node = searchPrefix(word);
        return node != nullptr && node->is_end_of_word;
    }
    
    bool startsWith(string prefix) {
        return searchPrefix(prefix) != nullptr;
    }
    
private:
    TrieNode* searchPrefix(string prefix) {
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
```java
import java.util.HashMap;
import java.util.Map;

class TrieNode {
    Map<Character, TrieNode> children;
    boolean isEndOfWord;
    
    TrieNode() {
        children = new HashMap<>();
        isEndOfWord = false;
    }
}

class Trie {
    private TrieNode root;
    
    public Trie() {
        root = new TrieNode();
    }
    
    public void insert(String word) {
        TrieNode node = root;
        for (int i = 0; i < word.length(); i++) {
            char c = word.charAt(i);
            if (!node.children.containsKey(c)) {
                node.children.put(c, new TrieNode());
            }
            node = node.children.get(c);
        }
        node.isEndOfWord = true;
    }
    
    public boolean search(String word) {
        TrieNode node = searchPrefix(word);
        return node != null && node.isEndOfWord;
    }
    
    public boolean startsWith(String prefix) {
        return searchPrefix(prefix) != null;
    }
    
    private TrieNode searchPrefix(String prefix) {
        TrieNode node = root;
        for (int i = 0; i < prefix.length(); i++) {
            char c = prefix.charAt(i);
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
```javascript
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    /**
     * @param {string} word
     * @return {void}
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
        node.isEndOfWord = true;
    }
    
    /**
     * @param {string} word
     * @return {boolean}
     */
    search(word) {
        const node = this.searchPrefix(word);
        return node !== null && node.isEndOfWord;
    }
    
    /**
     * @param {string} prefix
     * @return {boolean}
     */
    startsWith(prefix) {
        return this.searchPrefix(prefix) !== null;
    }
    
    /**
     * @param {string} prefix
     * @return {TrieNode|null}
     */
    searchPrefix(prefix) {
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

### Explanation

1. **HashMap for Children**: Instead of a fixed array, we use a HashMap/Map to store only existing child nodes.

2. **Dynamic Allocation**: Child nodes are created only when needed.

3. **Character Access**: Uses `O(1)` average-case lookup with hash-based containers.

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity (insert)** | O(L) average case |
| **Time Complexity (search)** | O(L) average case |
| **Time Complexity (startsWith)** | O(P) average case |
| **Space Complexity** | O(N × L) but often less than array-based for sparse tries |

### When to Use This Approach

- When the alphabet is large or unknown
- When memory is a concern (sparse character usage)
- When characters are not from a small, fixed set

---

## Approach 3: Trie with Count-Based Prefix Tracking

This enhanced version tracks the number of words passing through each node, enabling prefix counting operations.

### Python Solution

````carousel
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False
        self.prefix_count = 0  # Number of words with this prefix

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        """Inserts a word into the trie and updates prefix counts"""
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
            node.prefix_count += 1
        node.is_end_of_word = True
    
    def search(self, word: str) -> bool:
        """Searches for a word in the trie"""
        node = self._search_prefix(word)
        return node is not None and node.is_end_of_word
    
    def startsWith(self, prefix: str) -> bool:
        """Checks if any word starts with the given prefix"""
        return self._search_prefix(prefix) is not None
    
    def countPrefix(self, prefix: str) -> int:
        """Returns the number of words that start with the given prefix"""
        node = self._search_prefix(prefix)
        return node.prefix_count if node is not None else 0
    
    def _search_prefix(self, prefix: str) -> TrieNode:
        """Helper function to search for a prefix and return the node"""
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
```
<!-- slide -->
```cpp
#include <unordered_map>
#include <string>
using namespace std;

class TrieNode {
public:
    unordered_map<char, TrieNode*> children;
    bool is_end_of_word;
    int prefix_count;
    
    TrieNode() : is_end_of_word(false), prefix_count(0) {}
};

class Trie {
private:
    TrieNode* root;
    
public:
    Trie() {
        root = new TrieNode();
    }
    
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
            node->prefix_count++;
        }
        node->is_end_of_word = true;
    }
    
    bool search(string word) {
        TrieNode* node = searchPrefix(word);
        return node != nullptr && node->is_end_of_word;
    }
    
    bool startsWith(string prefix) {
        return searchPrefix(prefix) != nullptr;
    }
    
    int countPrefix(string prefix) {
        TrieNode* node = searchPrefix(prefix);
        return node != nullptr ? node->prefix_count : 0;
    }
    
private:
    TrieNode* searchPrefix(string prefix) {
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
```java
import java.util.HashMap;
import java.util.Map;

class TrieNode {
    Map<Character, TrieNode> children;
    boolean isEndOfWord;
    int prefixCount;
    
    TrieNode() {
        children = new HashMap<>();
        isEndOfWord = false;
        prefixCount = 0;
    }
}

class Trie {
    private TrieNode root;
    
    public Trie() {
        root = new TrieNode();
    }
    
    public void insert(String word) {
        TrieNode node = root;
        for (int i = 0; i < word.length(); i++) {
            char c = word.charAt(i);
            if (!node.children.containsKey(c)) {
                node.children.put(c, new TrieNode());
            }
            node = node.children.get(c);
            node.prefixCount++;
        }
        node.isEndOfWord = true;
    }
    
    public boolean search(String word) {
        TrieNode node = searchPrefix(word);
        return node != null && node.isEndOfWord;
    }
    
    public boolean startsWith(String prefix) {
        return searchPrefix(prefix) != null;
    }
    
    public int countPrefix(String prefix) {
        TrieNode node = searchPrefix(prefix);
        return node != null ? node.prefixCount : 0;
    }
    
    private TrieNode searchPrefix(String prefix) {
        TrieNode node = root;
        for (int i = 0; i < prefix.length(); i++) {
            char c = prefix.charAt(i);
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
```javascript
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
        this.prefixCount = 0;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    /**
     * @param {string} word
     * @return {void}
     */
    insert(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
            node.prefixCount++;
        }
        node.isEndOfWord = true;
    }
    
    /**
     * @param {string} word
     * @return {boolean}
     */
    search(word) {
        const node = this.searchPrefix(word);
        return node !== null && node.isEndOfWord;
    }
    
    /**
     * @param {string} prefix
     * @return {boolean}
     */
    startsWith(prefix) {
        return this.searchPrefix(prefix) !== null;
    }
    
    /**
     * @param {string} prefix
     * @return {number}
     */
    countPrefix(prefix) {
        const node = this.searchPrefix(prefix);
        return node !== null ? node.prefixCount : 0;
    }
    
    /**
     * @param {string} prefix
     * @return {TrieNode|null}
     */
    searchPrefix(prefix) {
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

### Explanation

1. **prefix_count**: Each node tracks how many words pass through it (have this prefix).

2. **Enhanced Insert**: Increments count at each node during insertion.

3. **countPrefix()**: New method that returns how many inserted words have the given prefix.

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity (insert)** | O(L) |
| **Time Complexity (search)** | O(L) |
| **Time Complexity (startsWith)** | O(P) |
| **Time Complexity (countPrefix)** | O(P) |
| **Space Complexity** | O(N × L) with additional O(N × L) for counts |

### Use Cases

- Counting how many words have a given prefix
- Autocomplete systems with frequency information
- Dictionary applications with prefix statistics

---

## Approach 4: Optimized Memory with Node Pool

For memory-constrained environments, this approach pre-allocates nodes from a pool instead of dynamic allocation.

### Python Solution

````carousel
```python
class TrieNode:
    __slots__ = ['children', 'is_end_of_word', 'next_free']
    
    def __init__(self):
        self.children = [-1] * 26  # Store indices instead of references
        self.is_end_of_word = False
        self.next_free = -1

class Trie:
    def __init__(self, max_nodes=10000):
        self.node_pool = [TrieNode() for _ in range(max_nodes)]
        self.node_count = 1  # Node 0 is the root
        self.root = 0
    
    def insert(self, word: str) -> None:
        """Inserts a word into the trie using node pool"""
        node = self.root
        for char in word:
            index = ord(char) - ord('a')
            next_node = self.node_pool[node].children[index]
            
            if next_node == -1:
                next_node = self.node_count
                self.node_count += 1
                self.node_pool[node].children[index] = next_node
                self.node_pool[next_node].children = [-1] * 26
            
            node = next_node
        self.node_pool[node].is_end_of_word = True
    
    def search(self, word: str) -> bool:
        """Searches for a word in the trie"""
        node = self._search_prefix(word)
        return node != -1 and self.node_pool[node].is_end_of_word
    
    def startsWith(self, prefix: str) -> bool:
        """Checks if any word starts with the given prefix"""
        return self._search_prefix(prefix) != -1
    
    def _search_prefix(self, prefix: str) -> int:
        """Helper function to search for a prefix and return node index"""
        node = self.root
        for char in prefix:
            index = ord(char) - ord('a')
            next_node = self.node_pool[node].children[index]
            if next_node == -1:
                return -1
            node = next_node
        return node
```
<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <cstring>
using namespace std;

class TrieNode {
public:
    int children[26];
    bool is_end_of_word;
    
    TrieNode() {
        memset(children, -1, sizeof(children));
        is_end_of_word = false;
    }
};

class Trie {
private:
    vector<TrieNode> node_pool;
    int node_count;
    int root;
    
public:
    Trie(int max_nodes = 10000) {
        node_pool.resize(max_nodes);
        node_count = 1;  // Node 0 is the root
        root = 0;
    }
    
    void insert(string word) {
        int node = root;
        for (char c : word) {
            int index = c - 'a';
            int next_node = node_pool[node].children[index];
            
            if (next_node == -1) {
                next_node = node_count++;
                node_pool[node].children[index] = next_node;
                // Note: node_pool[next_node] is already initialized by the constructor
            }
            
            node = next_node;
        }
        node_pool[node].is_end_of_word = true;
    }
    
    bool search(string word) {
        int node = searchPrefix(word);
        return node != -1 && node_pool[node].is_end_of_word;
    }
    
    bool startsWith(string prefix) {
        return searchPrefix(prefix) != -1;
    }
    
private:
    int searchPrefix(string prefix) {
        int node = root;
        for (char c : prefix) {
            int index = c - 'a';
            int next_node = node_pool[node].children[index];
            if (next_node == -1) {
                return -1;
            }
            node = next_node;
        }
        return node;
    }
};
```
<!-- slide -->
```java
class TrieNode {
    int[] children;
    boolean isEndOfWord;
    
    TrieNode() {
        children = new int[26];
        Arrays.fill(children, -1);
        isEndOfWord = false;
    }
}

class Trie {
    private List<TrieNode> nodePool;
    private int nodeCount;
    private int root;
    
    public Trie(int maxNodes) {
        nodePool = new ArrayList<>(maxNodes);
        for (int i = 0; i < maxNodes; i++) {
            nodePool.add(new TrieNode());
        }
        nodeCount = 1;
        root = 0;
    }
    
    public void insert(String word) {
        int node = root;
        for (int i = 0; i < word.length(); i++) {
            char c = word.charAt(i);
            int index = c - 'a';
            int nextNode = nodePool.get(node).children[index];
            
            if (nextNode == -1) {
                nextNode = nodeCount++;
                nodePool.get(node).children[index] = nextNode;
            }
            
            node = nextNode;
        }
        nodePool.get(node).isEndOfWord = true;
    }
    
    public boolean search(String word) {
        int node = searchPrefix(word);
        return node != -1 && nodePool.get(node).isEndOfWord;
    }
    
    public boolean startsWith(String prefix) {
        return searchPrefix(prefix) != -1;
    }
    
    private int searchPrefix(String prefix) {
        int node = root;
        for (int i = 0; i < prefix.length(); i++) {
            char c = prefix.charAt(i);
            int index = c - 'a';
            int nextNode = nodePool.get(node).children[index];
            if (nextNode == -1) {
                return -1;
            }
            node = nextNode;
        }
        return node;
    }
}
```
<!-- slide -->
```javascript
class TrieNode {
    constructor() {
        this.children = new Array(26).fill(-1);
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor(maxNodes = 10000) {
        this.nodePool = new Array(maxNodes).fill(null).map(() => new TrieNode());
        this.nodeCount = 1;
        this.root = 0;
    }
    
    /**
     * @param {string} word
     * @return {void}
     */
    insert(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            const index = word.charCodeAt(i) - 97;
            let nextNode = this.nodePool[node].children[index];
            
            if (nextNode === -1) {
                nextNode = this.nodeCount++;
                this.nodePool[node].children[index] = nextNode;
                this.nodePool[nextNode] = new TrieNode();
            }
            
            node = nextNode;
        }
        this.nodePool[node].isEndOfWord = true;
    }
    
    /**
     * @param {string} word
     * @return {boolean}
     */
    search(word) {
        const node = this.searchPrefix(word);
        return node !== -1 && this.nodePool[node].isEndOfWord;
    }
    
    /**
     * @param {string} prefix
     * @return {boolean}
     */
    startsWith(prefix) {
        return this.searchPrefix(prefix) !== -1;
    }
    
    /**
     * @param {string} prefix
     * @return {number}
     */
    searchPrefix(prefix) {
        let node = this.root;
        for (let i = 0; i < prefix.length; i++) {
            const index = prefix.charCodeAt(i) - 97;
            let nextNode = this.nodePool[node].children[index];
            if (nextNode === -1) {
                return -1;
            }
            node = nextNode;
        }
        return node;
    }
}
```
````

### Explanation

1. **Node Pool**: Pre-allocates a fixed number of nodes to avoid dynamic memory allocation overhead.

2. **Integer Indices**: Uses integer indices instead of object references for better cache locality.

3. **__slots__ in Python**: Reduces memory overhead by preventing dynamic attribute creation.

### Complexity Analysis

| Metric | Complexity |
|--------|-------------|
| **Time Complexity (insert)** | O(L) |
| **Time Complexity (search)** | O(L) |
| **Time Complexity (startsWith)** | O(P) |
| **Space Complexity** | O(M) where M is the maximum number of nodes |

### When to Use This Approach

- Memory-constrained environments
- Real-time systems requiring predictable memory usage
- Systems with many trie instances

---

## Related Problems

| Problem | Difficulty | Description |
|---------|------------|-------------|
| **[Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)** | Medium | Implement a Trie (this problem) |
| **[Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/)** | Medium | Trie with wildcard pattern matching |
| **[Word Search II](https://leetcode.com/problems/word-search-ii/)** | Hard | Find all words in a board using a trie |
| **[Prefix and Suffix Search](https://leetcode.com/problems/prefix-and-suffix-search/)** | Hard | Find longest word that has given prefix and suffix |
| **[Stream of Characters](https://leetcode.com/problems/stream-of-characters/)** | Hard | Check if any suffix of the stream forms a word |
| **[Replace Words](https://leetcode.com/problems/replace-words/)** | Medium | Replace words with their shortest matching root |
| **[Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/)** | Medium | Can be solved using a binary trie |
| **[Map Sum Pairs](https://leetcode.com/problems/map-sum-pairs/)** | Medium | Trie with prefix sum tracking |

### Extended Applications

1. **Autocomplete Systems**: Trie-based autocomplete in search engines and IDEs
2. **Spell Checkers**: Efficiently check if words exist in a dictionary
3. **IP Routing**: Longest prefix matching in network routers
4. **DNA Sequencing**: Pattern matching in biological sequences
5. **Word Games**: Boggle solvers, crossword puzzle generators

---

## Followup Questions

### 1. How would you implement delete/remove functionality in the trie?

To delete a word, you would traverse to the node representing the last character of the word, unmark the `is_end_of_word` flag, and then optionally prune nodes that are no longer needed (nodes with no children and not marked as end-of-word). The pruning should be done recursively up the tree.

### 2. How would you handle Unicode characters or extended alphabets?

Instead of a fixed array of size 26, you would use a HashMap/Map to store character-to-node mappings. This allows handling any Unicode character without pre-allocating a massive array. The time complexity remains O(L) with average-case O(1) lookups.

### 3. How can you find the longest word in the trie that is a prefix of a given string?

You would traverse the trie following the given string, keeping track of the last node where `is_end_of_word` was true. The longest word ending at each position can be found during this traversal. This is useful in autocomplete and word completion systems.

### 4. How would you implement a method to find all words with a given prefix?

After finding the node representing the prefix, you would perform a DFS/BFS traversal from that node to collect all words. Each time you encounter a node marked as `is_end_of_word`, you add the current path as a valid word.

### 5. How can you serialize and deserialize a trie?

Serialize by performing a pre-order traversal, storing node markers and end-of-word flags. Deserialize by reconstructing nodes from the serialized data. This is useful for saving tries to disk or transmitting over networks.

### 6. How would you implement case-insensitive search?

Convert all words to lowercase (or uppercase) before inserting and during search operations. This ensures consistent comparisons regardless of input case.

### 7. How can you optimize a trie for very long words with many common prefixes?

For words with extensive shared prefixes, the basic trie structure is already optimal. However, you could implement path compression (compressing chains of single-child nodes into single edges with labels) to reduce memory usage and improve traversal speed.

---

## Video Tutorials

1. **[LeetCode 208 - Implement Trie (Prefix Tree) - Full Solution](https://www.youtube.com/watch?v=6PXv7k40Nqw)** - Complete walkthrough
2. **[Trie Data Structure - Introduction and Implementation](https://www.youtube.com/watch?v=7XmS8M2pGdw)** - Detailed explanation
3. **[Prefix Tree - LeetCode Problem Solving](https://www.youtube.com/watch?v=8D3W8T4X4Ww)** - Problem-solving approach

---

## Complexity Comparison of Approaches

| Approach | Insert | Search | startsWith | Space | Best For |
|----------|--------|--------|------------|-------|----------|
| **Array-Based** | O(L) | O(L) | O(P) | O(N×L) | Fixed alphabet, maximum speed |
| **HashMap-Based** | O(L) avg | O(L) avg | O(P) avg | O(N×L) | Dynamic alphabets, memory efficiency |
| **Count-Based** | O(L) | O(L) | O(P) | O(N×L) | Prefix counting, autocomplete |
| **Node Pool** | O(L) | O(L) | O(P) | O(M) | Memory-constrained systems |

---

## Summary

The Trie (Prefix Tree) is a powerful data structure for string operations, particularly those involving prefixes. The key takeaways are:

1. **Node Design**: Each node represents a character and stores references to child nodes.

2. **Operations**: All operations (insert, search, startsWith) run in O(L) or O(P) time where L/P is the length of the word/prefix.

3. **Space Efficiency**: Shared prefixes reduce memory usage for related words.

4. **Flexibility**: Different implementations (array, HashMap) suit different constraints.

5. **Applications**: From autocomplete to spell checking, tries are essential for string-intensive applications.

The **array-based implementation** is the most common and offers the best average-case performance for fixed alphabets like lowercase English letters. Choose the **HashMap-based approach** for dynamic alphabets or memory constraints. Use the **count-based approach** when you need prefix statistics.

Remember to consider:
- The fixed alphabet constraint (26 lowercase letters)
- Memory usage patterns
- Whether you need additional features like prefix counting
- The expected size and distribution of input words
