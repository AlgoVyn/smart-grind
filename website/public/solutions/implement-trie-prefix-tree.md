# Implement Trie (Prefix Tree)

## Problem Description

A **Trie** (pronounced "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Common applications include autocomplete suggestions, spell checkers, and IP routing (longest prefix matching).

Implement the `Trie` class with the following methods:

- `Trie()` - Initializes the trie object.
- `void insert(String word)` - Inserts the string `word` into the trie.
- `boolean search(String word)` - Returns `true` if the string `word` is in the trie (i.e., was inserted before), and `false` otherwise.
- `boolean startsWith(String prefix)` - Returns `true` if there is any previously inserted string that has the prefix `prefix`, and `false` otherwise.

---

## Examples

### Example 1

**Input:**
```python
["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
```

**Output:**
```python
[null, null, true, false, true, null, true]
```

**Explanation:**
```python
Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");    // return true
trie.search("app");      // return false (prefix but not complete word)
trie.startsWith("app");  // return true (prefix exists)
trie.insert("app");
trie.search("app");      // return true (now "app" is a complete word)
```

### Example 2

**Input:**
```python
["Trie", "insert", "search", "startsWith"]
[[], ["hello"], ["hello"], ["hell"]]
```

**Output:**
```python
[null, null, true, true]
```

### Example 3

**Input:**
```python
["Trie", "search", "startsWith", "insert", "search", "startsWith"]
[[], ["a"], ["ab"], ["ab"], ["ab"], ["a"]]
```

**Output:**
```python
[null, false, false, null, true, true]
```

---

## Constraints

- `1 <= word.length, prefix.length <= 2000`
- `word` and `prefix` consist only of lowercase English letters (`'a'` to `'z'`).
- At most `3 * 10⁴` calls in total will be made to `insert`, `search`, and `startsWith`.
- Methods `search` and `startsWith` will be called on at most `3000` different words or prefixes.

---

## Intuition

The key insight behind a Trie is to leverage the structure of strings to enable efficient prefix-based operations:

1. **Tree Structure**: Each node in the trie represents a character. The root represents an empty string, and paths from root to nodes represent prefixes.

2. **Shared Prefixes**: Words with common prefixes share the same nodes, making storage efficient for datasets with many related words.

3. **Early Termination**: During search operations, we can quickly determine if a prefix exists by traversing the tree character by character.

4. **End-of-Word Marker**: Each node needs a flag to indicate whether it marks the end of a valid word (distinguishing "app" from "apple").

---

## Approach 1: Hash Map-based Trie ⭐

### Algorithm

This approach uses a dictionary/hash map to store child nodes, providing flexibility and ease of implementation.

1. **Node Structure**: Each node contains:
   - `children`: A dictionary mapping characters to child nodes
   - `is_end`: A boolean flag indicating if this node completes a word

2. **Insert**: Traverse/create nodes for each character, mark `is_end = True` at the end.

3. **Search**: Traverse characters, check if path exists and if final node has `is_end = True`.

4. **startsWith**: Traverse characters, only check if path exists (don't verify `is_end`).

````carousel
<!-- slide -->
```python
class Trie:
    def __init__(self):
        self.children = {}  # Maps character to child Trie node
        self.is_end = False  # Marks the end of a word

    def insert(self, word: str) -> None:
        """Inserts the string word into the trie."""
        node = self
        for c in word:
            if c not in node.children:
                node.children[c] = Trie()
            node = node.children[c]
        node.is_end = True

    def search(self, word: str) -> bool:
        """Returns true if the string word is in the trie."""
        node = self
        for c in word:
            if c not in node.children:
                return False
            node = node.children[c]
        return node.is_end

    def startsWith(self, prefix: str) -> bool:
        """Returns true if there is a word with the given prefix."""
        node = self
        for c in prefix:
            if c not in node.children:
                return False
            node = node.children[c]
        return True
```

<!-- slide -->
```cpp
class Trie {
    
private:
    struct TrieNode {
        unordered_map<char, TrieNode*> children;
        bool is_end = false;
    };
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
        node->is_end = true;
    }
    
    bool search(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                return false;
            }
            node = node->children[c];
        }
        return node->is_end;
    }
    
    bool startsWith(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (node->children.find(c) == node->children.end()) {
                return false;
            }
            node = node->children[c];
        }
        return true;
    }
};
```

<!-- slide -->
```java
class Trie {
    private class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean is_end = false;
    }
    
    private TrieNode root;
    
    public Trie() {
        root = new TrieNode();
    }
    
    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node.children.putIfAbsent(c, new TrieNode());
            node = node.children.get(c);
        }
        node.is_end = true;
    }
    
    public boolean search(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            if (!node.children.containsKey(c)) {
                return false;
            }
            node = node.children.get(c);
        }
        return node.is_end;
    }
    
    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            if (!node.children.containsKey(c)) {
                return false;
            }
            node = node.children.get(c);
        }
        return true;
    }
}
```

<!-- slide -->
```javascript
class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    insert(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        node.is_end = true;
    }
    
    search(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (!node.children.has(char)) {
                return false;
            }
            node = node.children.get(char);
        }
        return node.is_end;
    }
    
    startsWith(prefix) {
        let node = this.root;
        for (let i = 0; i < prefix.length; i++) {
            const char = prefix[i];
            if (!node.children.has(char)) {
                return false;
            }
            node = node.children.get(char);
        }
        return true;
    }
}

class TrieNode {
    constructor() {
        this.children = new Map();
        this.is_end = false;
    }
}
```
````
---

### Time Complexity

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Insert | O(m) | O(m) where m is word length |
| Search | O(m) | O(1) |
| startsWith | O(m) | O(1) |

### Space Complexity

**Overall:** O(n * m) where n is the number of words and m is the average word length.

---

## Approach 2: Array-based Trie

### Algorithm

This approach uses a fixed-size array (size 26 for lowercase letters) to store child nodes, providing faster access at the cost of more memory.

1. **Node Structure**: Each node contains:
   - `children`: An array of size 26, initialized to `null`
   - `is_end`: A boolean flag

2. **Index Calculation**: `index = ord(char) - ord('a')` to map characters to array indices.

````carousel
<!-- slide -->
```python
class Trie:
    def __init__(self):
        self.children = [None] * 26
        self.is_end = False

    def insert(self, word: str) -> None:
        node = self
        for c in word:
            idx = ord(c) - ord('a')
            if not node.children[idx]:
                node.children[idx] = Trie()
            node = node.children[idx]
        node.is_end = True

    def search(self, word: str) -> bool:
        node = self
        for c in word:
            idx = ord(c) - ord('a')
            if not node.children[idx]:
                return False
            node = node.children[idx]
        return node.is_end

    def startsWith(self, prefix: str) -> bool:
        node = self
        for c in prefix:
            idx = ord(c) - ord('a')
            if not node.children[idx]:
                return False
            node = node.children[idx]
        return True
```

<!-- slide -->
```cpp
class Trie {

private:
    struct TrieNode {
        TrieNode* children[26];
        bool is_end;
        TrieNode() {
            for (int i = 0; i < 26; i++) {
                children[i] = nullptr;
            }
            is_end = false;
        }
    };
    TrieNode* root;

public:
    Trie() {
        root = new TrieNode();
    }
    
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) {
                node->children[idx] = new TrieNode();
            }
            node = node->children[idx];
        }
        node->is_end = true;
    }
    
    bool search(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) {
                return false;
            }
            node = node->children[idx];
        }
        return node->is_end;
    }
    
    bool startsWith(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            int idx = c - 'a';
            if (!node->children[idx]) {
                return false;
            }
            node = node->children[idx];
        }
        return true;
    }
};
```

<!-- slide -->
```java
class Trie {
    private class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean is_end = false;
    }
    
    private TrieNode root;
    
    public Trie() {
        root = new TrieNode();
    }
    
    public void insert(String word) {
        TrieNode node = root;
        for (int i = 0; i < word.length(); i++) {
            int idx = word.charAt(i) - 'a';
            if (node.children[idx] == null) {
                node.children[idx] = new TrieNode();
            }
            node = node.children[idx];
        }
        node.is_end = true;
    }
    
    public boolean search(String word) {
        TrieNode node = root;
        for (int i = 0; i < word.length(); i++) {
            int idx = word.charAt(i) - 'a';
            if (node.children[idx] == null) {
                return false;
            }
            node = node.children[idx];
        }
        return node.is_end;
    }
    
    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (int i = 0; i < prefix.length(); i++) {
            int idx = prefix.charAt(i) - 'a';
            if (node.children[idx] == null) {
                return false;
            }
            node = node.children[idx];
        }
        return true;
    }
}
```

<!-- slide -->
```javascript
class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    insert(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            const idx = word.charCodeAt(i) - 97;
            if (!node.children[idx]) {
                node.children[idx] = new TrieNode();
            }
            node = node.children[idx];
        }
        node.is_end = true;
    }
    
    search(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            const idx = word.charCodeAt(i) - 97;
            if (!node.children[idx]) {
                return false;
            }
            node = node.children[idx];
        }
        return node.is_end;
    }
    
    startsWith(prefix) {
        let node = this.root;
        for (let i = 0; i < prefix.length; i++) {
            const idx = prefix.charCodeAt(i) - 97;
            if (!node.children[idx]) {
                return false;
            }
            node = node.children[idx];
        }
        return true;
    }
}

class TrieNode {
    constructor() {
        this.children = new Array(26).fill(null);
        this.is_end = false;
    }
}
```
````
---

### Time Complexity

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Insert | O(m) | O(m) where m is word length |
| Search | O(m) | O(1) |
| startsWith | O(m) | O(1) |

### Space Complexity

**Overall:** O(n * m) but with higher constant factor due to fixed 26-element arrays even when not needed.

---

## Approach 3: Trie with Counters (Prefix Frequency)

### Algorithm

Enhanced trie that maintains a count of how many words pass through each node, useful for autocomplete ranking.

1. **Node Structure**: Each node contains:
   - `children`: Dictionary mapping characters to child nodes
   - `is_end`: Boolean flag for end of word
   - `count`: Integer tracking how many words have this prefix

2. **Insert**: Increment count at each node along the path.

3. **Search Prefix with Count**: Return the count for a prefix.

````carousel
<!-- slide -->
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.count = 0  # Number of words with this prefix

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
            node.count += 1  # Increment count for this prefix
        node.is_end = True
    
    def search(self, word: str) -> bool:
        node = self.root
        for c in word:
            if c not in node.children:
                return False
            node = node.children[c]
        return node.is_end
    
    def startsWith(self, prefix: str) -> bool:
        node = self.root
        for c in prefix:
            if c not in node.children:
                return False
            node = node.children[c]
        return True
    
    def prefixCount(self, prefix: str) -> int:
        """Returns the number of words with the given prefix."""
        node = self.root
        for c in prefix:
            if c not in node.children:
                return 0
            node = node.children[c]
        return node.count
```

<!-- slide -->
```cpp
class Trie {

private:
    struct TrieNode {
        unordered_map<char, TrieNode*> children;
        bool is_end = false;
        int count = 0;
    };
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
            node->count++;
        }
        node->is_end = true;
    }
    
    bool search(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                return false;
            }
            node = node->children[c];
        }
        return node->is_end;
    }
    
    bool startsWith(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (node->children.find(c) == node->children.end()) {
                return false;
            }
            node = node->children[c];
        }
        return true;
    }
    
    int prefixCount(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (node->children.find(c) == node->children.end()) {
                return 0;
            }
            node = node->children[c];
        }
        return node->count;
    }
};
```

<!-- slide -->
```java
class Trie {
    private class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean is_end = false;
        int count = 0;
    }
    
    private TrieNode root;
    
    public Trie() {
        root = new TrieNode();
    }
    
    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node.children.putIfAbsent(c, new TrieNode());
            node = node.children.get(c);
            node.count++;
        }
        node.is_end = true;
    }
    
    public boolean search(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            if (!node.children.containsKey(c)) {
                return false;
            }
            node = node.children.get(c);
        }
        return node.is_end;
    }
    
    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            if (!node.children.containsKey(c)) {
                return false;
            }
            node = node.children.get(c);
        }
        return true;
    }
    
    public int prefixCount(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            if (!node.children.containsKey(c)) {
                return 0;
            }
            node = node.children.get(c);
        }
        return node.count;
    }
}
```

<!-- slide -->
```javascript
class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    insert(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
            node.count++;
        }
        node.is_end = true;
    }
    
    search(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (!node.children.has(char)) {
                return false;
            }
            node = node.children.get(char);
        }
        return node.is_end;
    }
    
    startsWith(prefix) {
        let node = this.root;
        for (let i = 0; i < prefix.length; i++) {
            const char = prefix[i];
            if (!node.children.has(char)) {
                return false;
            }
            node = node.children.get(char);
        }
        return true;
    }
    
    prefixCount(prefix) {
        let node = this.root;
        for (let i = 0; i < prefix.length; i++) {
            const char = prefix[i];
            if (!node.children.has(char)) {
                return 0;
            }
            node = node.children.get(char);
        }
        return node.count;
    }
}

class TrieNode {
    constructor() {
        this.children = new Map();
        this.is_end = false;
        this.count = 0;
    }
}
```
````
---

### Time Complexity

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| Insert | O(m) | O(m) |
| Search | O(m) | O(1) |
| startsWith | O(m) | O(1) |
| prefixCount | O(m) | O(1) |

### Space Complexity

**Overall:** O(n * m) for all word storage plus O(m) for counts.

---

## Step-by-Step Example

Let's trace through inserting and searching words in a Trie:

### Step 1: Initialize Empty Trie
```
root: {is_end: false, children: {}}
```

### Step 2: Insert "apple"
```
root -> 'a': {is_end: false, children: {}}
'a' -> 'p': {is_end: false, children: {}}
'p' -> 'p': {is_end: false, children: {}}
'p' -> 'l': {is_end: false, children: {}}
'l' -> 'e': {is_end: true, children: {}}
```

### Step 3: Insert "app"
```
root -> 'a': {is_end: false, children: {}}
'a' -> 'p': {is_end: false, children: {}}
'p' -> 'p': {is_end: true, children: {}}  # Marked as end
```

### Step 4: Search "apple"
- Traverse 'a' → 'p' → 'p' → 'l' → 'e'
- Check `is_end` at 'e': `true`
- Return `true` ✓

### Step 5: Search "app"
- Traverse 'a' → 'p' → 'p'
- Check `is_end` at second 'p': `true`
- Return `true` ✓

### Step 6: Search "ap" (prefix only)
- Traverse 'a' → 'p'
- Check `is_end` at 'p': `false`
- Return `false` ✓

### Step 7: startsWith("ap")
- Traverse 'a' → 'p'
- Path exists: return `true` ✓

---

## Key Optimizations

1. **Hash Map vs Array**: Use hash maps for sparse alphabets (memory efficient), arrays for dense alphabets (faster access).

2. **Early Termination**: Stop traversal immediately when a character is not found.

3. **Lazy Node Creation**: Only create nodes when needed during insertion.

4. **End-of-Word Flag**: Efficiently distinguishes between prefixes and complete words.

---

## Time Complexity Comparison

| Approach | Insert | Search | startsWith | Space | Best For |
|----------|--------|--------|------------|-------|----------|
| Hash Map | O(m) | O(m) | O(m) | O(n*m) | General use, memory efficiency |
| Array | O(m) | O(m) | O(m) | O(26*n*m) | Fixed alphabet, speed priority |
| With Counters | O(m) | O(m) | O(m) | O(n*m) | Autocomplete, frequency queries |

---

## Related Problems

1. **[Design Add And Search Words Data Structure](design-add-and-search-words-data-structure.md)** - Trie with wildcard support
2. **[Word Search II](https://leetcode.com/problems/word-search-ii/)** - Find all words in a grid using Trie
3. **[Prefix and Suffix Search](https://leetcode.com/problems/prefix-and-suffix-search/)** - Find words with given prefix and suffix
4. **[Longest Word in Dictionary](longest-word-in-dictionary.md)** - Build words character by character
5. **[Replace Words](https://leetcode.com/problems/replace-words/)** - Replace words with shortest matching root
6. **[Implement Magic Dictionary](https://leetcode.com/problems/implement-magic-dictionary/)** - Trie with one-character difference

---

## Video Tutorials

- [NeetCode - Implement Trie (Prefix Tree)](https://www.youtube.com/watch?v=0I1IqUN-2nM)
- [Back to Back SWE - Trie Introduction](https://www.youtube.com/watch?v=nK3LfUvEeO4)
- [LeetCode Official Solution](https://www.youtube.com/watch?v=br7tDBg7On0)
- [Abdul Bari - Trie Data Structure](https://www.youtube.com/watch?v=ocN9sC93dLU)
- [Eric Programming - Trie Visualization](https://www.youtube.com/watch?v=wT7i94-aJ5U)

---

## Follow-up Questions

1. **How would you modify the Trie to support uppercase letters and other characters?**
   - Expand the alphabet size in array-based implementation or use maps with appropriate key mapping for hash map approach.

2. **How would you delete a word from the Trie?**
   - Traverse to the word's nodes, mark `is_end = false`, and recursively delete nodes that have no children and aren't end-of-word markers.

3. **How would you count the number of words with a given prefix?**
   - Add a `count` field to each node that increments during insertion, allowing O(m) prefix count queries.

4. **How would you find all words with a given prefix?**
   - Traverse to the prefix node, then perform DFS/BFS to collect all words from that node.

5. **How would you serialize and deserialize a Trie?**
   - Use preorder traversal to store nodes, including character, end-of-word flag, and children information.

6. **What are the trade-offs between array-based and hash map-based Trie implementations?**
   - Arrays: O(1) access but waste space for unused children. Hash maps: memory efficient but O(1) average access with overhead.

7. **How would you optimize a Trie for very long strings (e.g., DNA sequences)?**
   - Consider compression techniques like Patricia Trie (radix tree) to reduce space.

---

## Common Mistakes to Avoid

1. **Forgetting to mark end-of-word**: Causes "app" to be found when searching for "apple"
2. **Not handling empty strings**: Decide whether to support empty string insertion
3. **Memory leaks in C++**: Remember to delete dynamically allocated nodes
4. **Index out of bounds in array approach**: Validate character range before array access
5. **Not checking for null children**: Causes null pointer exceptions during traversal
6. **Assuming all inputs are lowercase**: Validate or normalize input characters
7. **Not handling case where prefix equals complete word**: Both `search("app")` and `startsWith("app")` should work correctly

---

## References

- [LeetCode 208 - Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)
- Trie (Prefix Tree) - [Wikipedia](https://en.wikipedia.org/wiki/Trie)
- [GeeksforGeeks - Trie Data Structure](https://www.geeksforgeeks.org/trie-insert-and-search/)
- [Introduction to Algorithms (CLRS) - Chapter 5: Hash Tables and Tries
