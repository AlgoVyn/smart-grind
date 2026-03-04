# Trie (Prefix Tree)

## Category
Trees & BSTs

## Description

A Trie (pronounced "try"), also known as a Prefix Tree, is a tree data structure used for efficient string operations. It excels at prefix-based searches and is commonly used for autocomplete, spell checking, IP routing, and word games. The key advantage of a Trie is that it provides O(m) time complexity for insertion, searching, and prefix operations, where m is the length of the key.

---

## When to Use

Use the Trie data structure when you need to solve problems involving:

- **Autocomplete Systems**: When you need to suggest words based on a prefix
- **Spell Checkers**: When checking if a word exists in a dictionary
- **IP Routing**: When looking up routing prefixes in network tables
- **Word Games**: Like Boggle, where you need to find all words in a grid
- **Phone Directory**: When searching contacts by name prefix
- **Longest Prefix Matching**: When finding the longest matching prefix

### Comparison with Alternatives

| Data Structure | Search Time | Insert Time | Space | Best Use Case |
|----------------|-------------|-------------|-------|---------------|
| **Trie** | O(m) | O(m) | O(ALPHABET_SIZE × m × n) | Prefix searches |
| **Hash Table** | O(m) avg | O(m) avg | O(m × n) | Exact match lookup |
| **Binary Search Tree** | O(m log n) | O(m log n) | O(m × n) | Ordered traversal |
| **Suffix Tree** | O(m) | O(m) | O(m) | Substring searches |

### When to Choose Trie vs Hash Table

- **Choose Trie** when:
  - You need prefix-based searches (autocomplete)
  - You need to enumerate all words with a given prefix
  - You need longest common prefix operations
  - You need alphabetical ordering of results

- **Choose Hash Table** when:
  - You only need exact match lookups
  - Memory is very constrained
  - You don't need prefix operations

---

## Algorithm Explanation

### Core Concept

The key insight behind the Trie is that it stores strings by their characters along a tree structure, where:
- Each **node** represents a character or prefix
- Each **edge** represents a character connecting nodes
- The **root** represents an empty string/prefix
- Each node has a **word end marker** (boolean flag) to indicate complete words

### How It Works

#### Structure:
```
        root
       / | \
      a  b  c
     /   |   \
    p    a    a
   /|\   |   / \
  p l y  n  t   r
```

For words: "apple", "app", "banana", "band"

#### Operations:

1. **Insert**: 
   - Start at root
   - For each character in the word:
     - If edge doesn't exist, create a new node
     - Move to the child node
   - Mark the final node as end of word

2. **Search**:
   - Start at root
   - For each character, traverse to child node
   - If at any point child doesn't exist, return False
   - After processing all characters, check if current node marks end of word

3. **Prefix Search (startsWith)**:
   - Same as search, but don't check end marker
   - Return True if we can traverse the entire prefix

4. **Delete**:
   - Recursive deletion from the deepest node
   - Remove nodes that are not prefixes of other words

### Visual Representation

For inserting words ["apple", "app", "application", "apply", "banana", "band"]:

```
                        root
                       /    \
                      a      b
                     /        \
                    p          a
                   / \          \
                  p   l          n
                 /   / \          \
                l   e   y         a
               /    |   \          \
              e     t   (end)     n
             /      |              \
            (end)   i               a
                   / \                \
                  c   o               (end)
                 /     \
                t       n
               /         \
             (end)       (end)
```

### Why Tries Work Well

- **Shared Prefixes**: Common prefixes are stored only once
- **O(m) Operations**: Time complexity depends only on key length, not number of keys
- **Alphabetical Order**: Words are naturally sorted lexicographically when traversed

### Limitations

- **High Space Complexity**: Each node needs storage for all possible children (or use hash-based children)
- **Memory Intensive**: For large alphabets (e.g., Unicode), memory usage can be significant
- **No Built-in Ordering**: Unlike BST, doesn't maintain any inherent ordering without explicit traversal

---

## Algorithm Steps

### Inserting a Word

1. Start at the root node
2. For each character in the word:
   - If the current node doesn't have an edge for this character, create a new child node
   - Move to the child node
3. After processing all characters, mark the current node as end of word
4. Store the complete word at the node (optional, for retrieval)

### Searching for a Word

1. Start at the root node
2. For each character in the word:
   - If the current node doesn't have an edge for this character, return False
   - Move to the child node
3. After processing all characters, check if current node is marked as end of word
4. Return True if marked as end, False otherwise

### Finding All Words with Prefix

1. Traverse to the node representing the prefix
2. If prefix doesn't exist, return empty list
3. Perform DFS/BFS from this node to collect all words:
   - If node is end of word, add to results
   - Recursively visit all children

### Deleting a Word

1. First, verify the word exists (search)
2. Use recursive deletion:
   - If we've processed all characters, unmark end of word
   - Recursively delete child if it's not an end of another word and has no children
   - Return True if current node should be deleted

---

## Implementation

### Template Code

````carousel
```python
from typing import Dict, List, Optional


class TrieNode:
    """A node in the Trie structure."""
    
    def __init__(self):
        self.children: Dict[str, 'TrieNode'] = {}
        self.is_end: bool = False
        self.word: str = ""


class Trie:
    """
    Trie (Prefix Tree) implementation for efficient string operations.
    
    Time Complexities:
        - Insert: O(m) where m is the length of the word
        - Search: O(m)
        - Prefix Search: O(m)
        - Get All Words with Prefix: O(m + k) where k is number of matches
    
    Space Complexities:
        - Insert: O(m) worst case (new nodes)
        - Overall: O(ALPHABET_SIZE × m × n) where n is number of words
    """
    
    def __init__(self):
        """Initialize the Trie with an empty root node."""
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        """
        Insert a word into the trie.
        
        Args:
            word: Word to insert
            
        Time: O(m) where m is word length
        """
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
        node.word = word
    
    def search(self, word: str) -> bool:
        """
        Search for exact word in trie.
        
        Args:
            word: Word to search
        
        Returns:
            True if word exists in trie
            
        Time: O(m)
        """
        node = self._find_node(word)
        return node is not None and node.is_end
    
    def starts_with(self, prefix: str) -> bool:
        """
        Check if any word starts with given prefix.
        
        Args:
            prefix: Prefix to search
        
        Returns:
            True if prefix exists in trie
            
        Time: O(m)
        """
        return self._find_node(prefix) is not None
    
    def _find_node(self, prefix: str) -> Optional[TrieNode]:
        """Find node corresponding to prefix."""
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
    
    def get_all_words_with_prefix(self, prefix: str) -> List[str]:
        """
        Get all words starting with given prefix.
        
        Args:
            prefix: Prefix to search
        
        Returns:
            List of words with prefix
            
        Time: O(m + k) where k is number of matches
        """
        node = self._find_node(prefix)
        if not node:
            return []
        
        words = []
        self._collect_words(node, words)
        return words
    
    def _collect_words(self, node: TrieNode, words: List[str]) -> None:
        """Recursively collect all words from node."""
        if node.is_end:
            words.append(node.word)
        for child in node.children.values():
            self._collect_words(child, words)
    
    def delete(self, word: str) -> bool:
        """
        Delete a word from trie.
        
        Args:
            word: Word to delete
        
        Returns:
            True if word was deleted
            
        Time: O(m)
        """
        def _delete(node: TrieNode, word: str, depth: int) -> bool:
            if depth == len(word):
                if not node.is_end:
                    return False
                node.is_end = False
                return len(node.children) == 0
            
            char = word[depth]
            if char not in node.children:
                return False
            
            should_delete_child = _delete(node.children[char], word, depth + 1)
            
            if should_delete_child:
                del node.children[char]
                return len(node.children) == 0 and not node.is_end
            
            return False
        
        if self.search(word):
            _delete(self.root, word, 0)
            return True
        return False


# Example usage and demonstration
if __name__ == "__main__":
    trie = Trie()
    
    words = ["apple", "app", "application", "apply", "banana", "band", "bandana"]
    for word in words:
        trie.insert(word)
    
    print("=" * 60)
    print("Trie Operations Demonstration")
    print("=" * 60)
    print(f"\nWords inserted: {words}")
    print()
    
    # Search operations
    print("--- Search Operations ---")
    print(f"Search 'app': {trie.search('app')}")
    print(f"Search 'appl': {trie.search('appl')}")
    print(f"Search 'application': {trie.search('application')}")
    print()
    
    # Prefix operations
    print("--- Prefix Operations ---")
    print(f"Starts with 'ban': {trie.starts_with('ban')}")
    print(f"Starts with 'cat': {trie.starts_with('cat')}")
    print(f"Starts with 'app': {trie.starts_with('app')}")
    print()
    
    # Get all words with prefix
    print("--- Words with Prefix ---")
    print(f"Words with prefix 'ban': {trie.get_all_words_with_prefix('ban')}")
    print(f"Words with prefix 'app': {trie.get_all_words_with_prefix('app')}")
    print(f"Words with prefix 'z': {trie.get_all_words_with_prefix('z')}")
    print()
    
    # Delete operation
    print("--- Delete Operation ---")
    print(f"Delete 'app': {trie.delete('app')}")
    print(f"Search 'app' after delete: {trie.search('app')}")
    print(f"Starts with 'app' after delete: {trie.starts_with('app')}")
    print(f"Words with prefix 'app': {trie.get_all_words_with_prefix('app')}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
using namespace std;

/**
 * Trie (Prefix Tree) implementation for efficient string operations.
 * 
 * Time Complexities:
 *     - Insert: O(m) where m is the length of the word
 *     - Search: O(m)
 *     - Prefix Search: O(m)
 * 
 * Space Complexities:
 *     - Overall: O(ALPHABET_SIZE × m × n) where n is number of words
 */
class TrieNode {
public:
    unordered_map<char, TrieNode*> children;
    bool is_end;
    string word;
    
    TrieNode() {
        is_end = false;
    }
};

class Trie {
private:
    TrieNode* root;
    
    TrieNode* findNode(const string& prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (node->children.find(c) == node->children.end()) {
                return nullptr;
            }
            node = node->children[c];
        }
        return node;
    }
    
    void collectWords(TrieNode* node, vector<string>& words) {
        if (node->is_end) {
            words.push_back(node->word);
        }
        for (auto& pair : node->children) {
            collectWords(pair.second, words);
        }
    }
    
    bool deleteHelper(TrieNode* node, const string& word, int depth) {
        if (depth == word.length()) {
            if (!node->is_end) {
                return false;
            }
            node->is_end = false;
            return node->children.empty();
        }
        
        char c = word[depth];
        if (node->children.find(c) == node->children.end()) {
            return false;
        }
        
        TrieNode* child = node->children[c];
        bool shouldDeleteChild = deleteHelper(child, word, depth + 1);
        
        if (shouldDeleteChild) {
            delete child;
            node->children.erase(c);
            return node->children.empty() && !node->is_end;
        }
        
        return false;
    }
    
    void deleteTrie(TrieNode* node) {
        for (auto& pair : node->children) {
            deleteTrie(pair.second);
        }
        delete node;
    }
    
public:
    Trie() {
        root = new TrieNode();
    }
    
    ~Trie() {
        deleteTrie(root);
    }
    
    /**
     * Insert a word into the trie.
     * Time: O(m) where m is word length
     */
    void insert(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->is_end = true;
        node->word = word;
    }
    
    /**
     * Search for exact word in trie.
     * Time: O(m)
     */
    bool search(const string& word) {
        TrieNode* node = findNode(word);
        return node != nullptr && node->is_end;
    }
    
    /**
     * Check if any word starts with given prefix.
     * Time: O(m)
     */
    bool starts_with(const string& prefix) {
        return findNode(prefix) != nullptr;
    }
    
    /**
     * Get all words starting with given prefix.
     * Time: O(m + k) where k is number of matches
     */
    vector<string> get_all_words_with_prefix(const string& prefix) {
        vector<string> words;
        TrieNode* node = findNode(prefix);
        if (node) {
            collectWords(node, words);
        }
        return words;
    }
    
    /**
     * Delete a word from trie.
     * Time: O(m)
     */
    bool deleteWord(const string& word) {
        if (search(word)) {
            deleteHelper(root, word, 0);
            return true;
        }
        return false;
    }
};


int main() {
    Trie trie;
    
    vector<string> words = {"apple", "app", "application", "apply", "banana", "band", "bandana"};
    for (const string& word : words) {
        trie.insert(word);
    }
    
    cout << "=" << 60 << endl;
    cout << "Trie Operations Demonstration" << endl;
    cout << "=" << 60 << endl;
    cout << "\nWords inserted: ";
    for (const string& w : words) cout << w << " ";
    cout << endl << endl;
    
    // Search operations
    cout << "--- Search Operations ---" << endl;
    cout << "Search 'app': " << (trie.search("app") ? "true" : "false") << endl;
    cout << "Search 'appl': " << (trie.search("appl") ? "true" : "false") << endl;
    cout << "Search 'application': " << (trie.search("application") ? "true" : "false") << endl;
    cout << endl;
    
    // Prefix operations
    cout << "--- Prefix Operations ---" << endl;
    cout << "Starts with 'ban': " << (trie.starts_with("ban") ? "true" : "false") << endl;
    cout << "Starts with 'cat': " << (trie.starts_with("cat") ? "true" : "false") << endl;
    cout << "Starts with 'app': " << (trie.starts_with("app") ? "true" : "false") << endl;
    cout << endl;
    
    // Get all words with prefix
    cout << "--- Words with Prefix ---" << endl;
    vector<string> banWords = trie.get_all_words_with_prefix("ban");
    cout << "Words with prefix 'ban': ";
    for (const string& w : banWords) cout << w << " ";
    cout << endl;
    
    vector<string> appWords = trie.get_all_words_with_prefix("app");
    cout << "Words with prefix 'app': ";
    for (const string& w : appWords) cout << w << " ";
    cout << endl;
    cout << endl;
    
    // Delete operation
    cout << "--- Delete Operation ---" << endl;
    cout << "Delete 'app': " << (trie.deleteWord("app") ? "true" : "false") << endl;
    cout << "Search 'app' after delete: " << (trie.search("app") ? "true" : "false") << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Trie (Prefix Tree) implementation for efficient string operations.
 * 
 * Time Complexities:
 *     - Insert: O(m) where m is the length of the word
 *     - Search: O(m)
 *     - Prefix Search: O(m)
 * 
 * Space Complexities:
 *     - Overall: O(ALPHABET_SIZE × m × n) where n is number of words
 */
class TrieNode {
    Map<Character, TrieNode> children;
    boolean isEnd;
    String word;
    
    TrieNode() {
        children = new HashMap<>();
        isEnd = false;
    }
}

public class Trie {
    private TrieNode root;
    
    public Trie() {
        root = new TrieNode();
    }
    
    /**
     * Insert a word into the trie.
     * Time: O(m) where m is word length
     */
    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node.children.putIfAbsent(c, new TrieNode());
            node = node.children.get(c);
        }
        node.isEnd = true;
        node.word = word;
    }
    
    /**
     * Search for exact word in trie.
     * Time: O(m)
     */
    public boolean search(String word) {
        TrieNode node = findNode(word);
        return node != null && node.isEnd;
    }
    
    /**
     * Check if any word starts with given prefix.
     * Time: O(m)
     */
    public boolean startsWith(String prefix) {
        return findNode(prefix) != null;
    }
    
    private TrieNode findNode(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            if (!node.children.containsKey(c)) {
                return null;
            }
            node = node.children.get(c);
        }
        return node;
    }
    
    /**
     * Get all words starting with given prefix.
     * Time: O(m + k) where k is number of matches
     */
    public List<String> getAllWordsWithPrefix(String prefix) {
        List<String> words = new ArrayList<>();
        TrieNode node = findNode(prefix);
        if (node != null) {
            collectWords(node, words);
        }
        return words;
    }
    
    private void collectWords(TrieNode node, List<String> words) {
        if (node.isEnd) {
            words.add(node.word);
        }
        for (TrieNode child : node.children.values()) {
            collectWords(child, words);
        }
    }
    
    /**
     * Delete a word from trie.
     * Time: O(m)
     */
    public boolean delete(String word) {
        if (search(word)) {
            deleteHelper(root, word, 0);
            return true;
        }
        return false;
    }
    
    private boolean deleteHelper(TrieNode node, String word, int depth) {
        if (depth == word.length()) {
            if (!node.isEnd) {
                return false;
            }
            node.isEnd = false;
            return node.children.isEmpty();
        }
        
        char c = word.charAt(depth);
        TrieNode child = node.children.get(c);
        if (child == null) {
            return false;
        }
        
        boolean shouldDeleteChild = deleteHelper(child, word, depth + 1);
        
        if (shouldDeleteChild) {
            node.children.remove(c);
            return node.children.isEmpty() && !node.isEnd;
        }
        
        return false;
    }
    
    public static void main(String[] args) {
        Trie trie = new Trie();
        
        String[] words = {"apple", "app", "application", "apply", "banana", "band", "bandana"};
        for (String word : words) {
            trie.insert(word);
        }
        
        System.out.println("=".repeat(60));
        System.out.println("Trie Operations Demonstration");
        System.out.println("=".repeat(60));
        System.out.println("\nWords inserted: " + Arrays.toString(words));
        System.out.println();
        
        // Search operations
        System.out.println("--- Search Operations ---");
        System.out.println("Search 'app': " + trie.search("app"));
        System.out.println("Search 'appl': " + trie.search("appl"));
        System.out.println("Search 'application': " + trie.search("application"));
        System.out.println();
        
        // Prefix operations
        System.out.println("--- Prefix Operations ---");
        System.out.println("Starts with 'ban': " + trie.startsWith("ban"));
        System.out.println("Starts with 'cat': " + trie.startsWith("cat"));
        System.out.println("Starts with 'app': " + trie.startsWith("app"));
        System.out.println();
        
        // Get all words with prefix
        System.out.println("--- Words with Prefix ---");
        System.out.println("Words with prefix 'ban': " + trie.getAllWordsWithPrefix("ban"));
        System.out.println("Words with prefix 'app': " + trie.getAllWordsWithPrefix("app"));
        System.out.println();
        
        // Delete operation
        System.out.println("--- Delete Operation ---");
        System.out.println("Delete 'app': " + trie.delete("app"));
        System.out.println("Search 'app' after delete: " + trie.search("app"));
    }
}
```

<!-- slide -->
```javascript
/**
 * Trie (Prefix Tree) implementation for efficient string operations.
 * 
 * Time Complexities:
 *     - Insert: O(m) where m is the length of the word
 *     - Search: O(m)
 *     - Prefix Search: O(m)
 * 
 * Space Complexities:
 *     - Overall: O(ALPHABET_SIZE × m × n) where n is number of words
 */
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEnd = false;
        this.word = "";
    }
}

class Trie {
    /**
     * Initialize the Trie with an empty root node.
     */
    constructor() {
        this.root = new TrieNode();
    }
    
    /**
     * Insert a word into the trie.
     * @param {string} word - Word to insert
     * Time: O(m) where m is word length
     */
    insert(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        node.isEnd = true;
        node.word = word;
    }
    
    /**
     * Search for exact word in trie.
     * @param {string} word - Word to search
     * @returns {boolean} True if word exists in trie
     * Time: O(m)
     */
    search(word) {
        const node = this._findNode(word);
        return node !== null && node.isEnd;
    }
    
    /**
     * Check if any word starts with given prefix.
     * @param {string} prefix - Prefix to search
     * @returns {boolean} True if prefix exists in trie
     * Time: O(m)
     */
    startsWith(prefix) {
        return this._findNode(prefix) !== null;
    }
    
    /**
     * Find node corresponding to prefix.
     * @param {string} prefix - Prefix to find
     * @returns {TrieNode|null} Node or null if not found
     * @private
     */
    _findNode(prefix) {
        let node = this.root;
        for (const char of prefix) {
            if (!node.children.has(char)) {
                return null;
            }
            node = node.children.get(char);
        }
        return node;
    }
    
    /**
     * Get all words starting with given prefix.
     * @param {string} prefix - Prefix to search
     * @returns {string[]} List of words with prefix
     * Time: O(m + k) where k is number of matches
     */
    getAllWordsWithPrefix(prefix) {
        const words = [];
        const node = this._findNode(prefix);
        if (node) {
            this._collectWords(node, words);
        }
        return words;
    }
    
    /**
     * Recursively collect all words from node.
     * @param {TrieNode} node - Current node
     * @param {string[]} words - Array to store words
     * @private
     */
    _collectWords(node, words) {
        if (node.isEnd) {
            words.push(node.word);
        }
        for (const child of node.children.values()) {
            this._collectWords(child, words);
        }
    }
    
    /**
     * Delete a word from trie.
     * @param {string} word - Word to delete
     * @returns {boolean} True if word was deleted
     * Time: O(m)
     */
    delete(word) {
        const deleteHelper = (node, word, depth) => {
            if (depth === word.length) {
                if (!node.isEnd) {
                    return false;
                }
                node.isEnd = false;
                return node.children.size === 0;
            }
            
            const char = word[depth];
            const child = node.children.get(char);
            if (!child) {
                return false;
            }
            
            const shouldDeleteChild = deleteHelper(child, word, depth + 1);
            
            if (shouldDeleteChild) {
                node.children.delete(char);
                return node.children.size === 0 && !node.isEnd;
            }
            
            return false;
        };
        
        if (this.search(word)) {
            deleteHelper(this.root, word, 0);
            return true;
        }
        return false;
    }
}


// Example usage and demonstration
const trie = new Trie();

const words = ["apple", "app", "application", "apply", "banana", "band", "bandana"];
for (const word of words) {
    trie.insert(word);
}

console.log("=".repeat(60));
console.log("Trie Operations Demonstration");
console.log("=".repeat(60));
console.log("\nWords inserted:", words);
console.log();

// Search operations
console.log("--- Search Operations ---");
console.log("Search 'app':", trie.search("app"));
console.log("Search 'appl':", trie.search("appl"));
console.log("Search 'application':", trie.search("application"));
console.log();

// Prefix operations
console.log("--- Prefix Operations ---");
console.log("Starts with 'ban':", trie.startsWith("ban"));
console.log("Starts with 'cat':", trie.startsWith("cat"));
console.log("Starts with 'app':", trie.startsWith("app"));
console.log();

// Get all words with prefix
console.log("--- Words with Prefix ---");
console.log("Words with prefix 'ban':", trie.getAllWordsWithPrefix("ban"));
console.log("Words with prefix 'app':", trie.getAllWordsWithPrefix("app"));
console.log();

// Delete operation
console.log("--- Delete Operation ---");
console.log("Delete 'app':", trie.delete("app"));
console.log("Search 'app' after delete:", trie.search("app"));
console.log("Starts with 'app' after delete:", trie.startsWith("app"));
console.log("Words with prefix 'app':", trie.getAllWordsWithPrefix("app"));
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Insert** | O(m) | Traverse/create m nodes for word of length m |
| **Search** | O(m) | Traverse m nodes, check end marker |
| **Prefix Search** | O(m) | Traverse m nodes for prefix |
| **Delete** | O(m) | Recursive traversal and cleanup |
| **Get All Words with Prefix** | O(m + k) | m for prefix, k for all matching words |
| **Get Longest Prefix** | O(m) | Traverse until node with no children |

### Detailed Breakdown

- **Insert**: For each character in the word, we either find an existing child or create a new node
- **Search**: Must check each character to ensure path exists, then verify word end marker
- **Prefix Search**: Same as search but without checking word end marker
- **Delete**: Requires traversing the entire word, then potentially cleaning up unused nodes

---

## Space Complexity Analysis

| Component | Space Complexity | Description |
|-----------|----------------|-------------|
| **Overall** | O(ALPHABET_SIZE × m × n) | Worst case with all unique prefixes |
| **Per Node** | O(ALPHABET_SIZE) | If using fixed array, O(1) if using hash map |

### Space Optimization Strategies

1. **Dictionary-based Children**: Use `Map` or `HashMap` instead of fixed arrays - only stores existing edges
2. **Compression**: Use ternary search tree or radix trie for space efficiency
3. **Memory Pool**: Pre-allocate nodes to reduce allocation overhead
4. **Alpha reduction**: Store only lowercase or use case-insensitive indexing

---

## Common Variations

### 1. Ternary Search Tree (TST)

A more space-efficient variant where each node stores a single character with three pointers:
- Left: characters less than current
- Middle: characters equal to current
- Right: characters greater than current

````carousel
```python
class TSTNode:
    def __init__(self, char):
        self.char = char
        self.left = None
        self.mid = None
        self.right = None
        self.is_end = False
        self.word = ""


class TernarySearchTree:
    """Space-optimized Trie using ternary search tree structure."""
    
    def __init__(self):
        self.root = None
    
    def insert(self, word):
        self.root = self._insert(self.root, word, 0)
    
    def _insert(self, node, word, depth):
        char = word[depth]
        if not node:
            node = TSTNode(char)
        
        if char < node.char:
            node.left = self._insert(node.left, word, depth)
        elif char > node.char:
            node.right = self._insert(node.right, word, depth)
        else:
            if depth + 1 == len(word):
                node.is_end = True
                node.word = word
            else:
                node.mid = self._insert(node.mid, word, depth + 1)
        
        return node
    
    def search(self, word):
        node = self._search(self.root, word, 0)
        return node and node.is_end
    
    def _search(self, node, word, depth):
        if not node:
            return None
        char = word[depth]
        
        if char < node.char:
            return self._search(node.left, word, depth)
        elif char > node.char:
            return self._search(node.right, word, depth)
        else:
            if depth + 1 == len(word):
                return node
            return self._search(node.mid, word, depth + 1)
```

### 2. Radix Trie (Patricia Trie)

Compresses paths with single child nodes to save space:

````carousel
```python
class RadixNode:
    def __init__(self, prefix=""):
        self.prefix = prefix
        self.children = {}
        self.is_end = False
        self.word = ""


class RadixTrie:
    """Space-optimized Trie that compresses single-child paths."""
    
    def __init__(self):
        self.root = RadixNode()
    
    def insert(self, word):
        self._insert(self.root, word)
    
    def _insert(self, node, word, depth=0):
        # Find matching child
        for child in node.children:
            if word.startswith(child, depth):
                # Found matching prefix
                remaining = word[depth + len(child):]
                if remaining:
                    if child in node.children:
                        self._insert(node.children[child], word, depth + len(child))
                else:
                    node.children[child].is_end = True
                    node.children[child].word = word
                return
        
        # No match found, create new branch
        node.children[word[depth:]] = RadixNode(word[depth:])
        node.children[word[depth:]].is_end = True
        node.children[word[depth:]].word = word
```

### 3. Trie with Counters

Add frequency counters for autocomplete with most frequent suggestions:

````carousel
```python
class TrieNodeWithCount:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.word = ""
        self.count = 0  # Frequency counter


class AutocompleteTrie:
    """Trie with frequency counters for autocomplete."""
    
    def __init__(self):
        self.root = TrieNodeWithCount()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNodeWithCount()
            node = node.children[char]
        node.is_end = True
        node.word = word
        node.count += 1
    
    def get_top_k(self, prefix, k=3):
        """Get top k most frequent words with prefix."""
        node = self._find_node(prefix)
        if not node:
            return []
        
        # Collect all words and sort by frequency
        words = []
        self._collect_all(node, words)
        words.sort(key=lambda x: x[1], reverse=True)
        
        return [w[0] for w in words[:k]]
```

### 4. Bitwise Trie

Used for efficient bit manipulation operations:

````carousel
```python
class BitTrieNode:
    def __init__(self):
        self.children = [None, None]  # 0 and 1
        self.is_end = False


class BitwiseTrie:
    """Trie for efficient bit manipulation operations."""
    
    def __init__(self, max_bits=31):
        self.root = BitTrieNode()
        self.max_bits = max_bits
    
    def insert(self, num):
        node = self.root
        for i in range(self.max_bits, -1, -1):
            bit = (num >> i) & 1
            if not node.children[bit]:
                node.children[bit] = BitTrieNode()
            node = node.children[bit]
        node.is_end = True
    
    def find_max_xor(self, num):
        """Find number in trie that maximizes xor with num."""
        node = self.root
        result = 0
        for i in range(self.max_bits, -1, -1):
            bit = (num >> i) & 1
            # Try to go opposite bit for max xor
            toggle = 1 - bit
            if node.children[toggle]:
                result |= (1 << i)
                node = node.children[toggle]
            else:
                node = node.children[bit]
        return result
```

---

## Practice Problems

### Problem 1: Implement Trie (Prefix Tree)

**Problem:** [LeetCode 208 - Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)

**Description:** Implement a trie with insert, search, and startsWith methods.

**How to Apply Trie:**
- Use the standard Trie structure with children maps
- Insert: traverse/create nodes, mark end
- Search: traverse and check end marker
- StartsWith: just traverse, no end check needed

---

### Problem 2: Word Search II

**Problem:** [LeetCode 212 - Word Search II](https://leetcode.com/problems/word-search-ii/)

**Description:** Given a 2D board and a list of words, find all words in the board.

**How to Apply Trie:**
- Build a Trie with all dictionary words first
- Use DFS from each cell, pruning when no prefix exists in Trie
- Mark found words in Trie to avoid duplicates

---

### Problem 3: Design Add and Search Words Data Structure

**Problem:** [LeetCode 211 - Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/)

**Description:** Design a data structure that supports adding new words and searching for words with wildcards (. matches any letter).

**How to Apply Trie:**
- Standard Trie structure with DFS for wildcard matching
- When encountering '.', explore all children recursively
- Use backtracking to explore all possible paths

---

### Problem 4: Replace Words

**Problem:** [LeetCode 648 - Replace Words](https://leetcode.com/problems/replace-words/)

**Description:** In English, we have root words that can form new words. Given a dictionary of root words and a sentence, replace all words with their shortest root.

**How to Apply Trie:**
- Build Trie from all root words
- For each word in sentence, traverse Trie to find shortest root
- If no root found, keep original word

---

### Problem 5: Maximum XOR of Two Numbers in an Array

**Problem:** [LeetCode 421 - Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/)

**Description:** Given an integer array, find the maximum XOR of any two numbers.

**How to Apply Trie:**
- Use Bitwise Trie to store all numbers
- For each number, find the number that maximizes XOR
- At each bit, prefer opposite bit to maximize XOR value

---

## Video Tutorial Links

### Fundamentals

- [Trie (Prefix Tree) - Introduction (Take U Forward)](https://www.youtube.com/watch?v=AXICaR41j2w) - Comprehensive introduction to tries
- [Trie Implementation (WilliamFiset)](https://www.youtube.com/watch?v=0I6IL1jGLM4) - Detailed explanation with visualizations
- [LeetCode 208 - Implement Trie (NeetCode)](https://www.youtube.com/watch?v=0xT2DGQ-U7I) - Practical implementation guide

### Advanced Topics

- [Word Search II - Trie Solution](https://www.youtube.com/watch?v=asfV34ZjDOk) - Using Trie for backtracking
- [Maximum XOR in Array - Bitwise Trie](https://www.youtube.com/watch?v=m8I3xXPY3M8) - Bitwise trie for XOR problems
- [Ternary Search Tree](https://www.youtube.com/watch?v=Y8dt5M4GC7U) - Space-optimized variant

---

## Follow-up Questions

### Q1: How would you optimize a Trie for very large alphabets?

**Answer:** For large alphabets (like Unicode), consider:
- **Hash-based children**: Use `Map` or `HashMap` instead of arrays - only stores existing edges
- **Double-array Trie (DAWG)**: More compact representation for large dictionaries
- **Finite-state transducer**: For more complex prefix matching

### Q2: Can Trie be used for numeric data?

**Answer:** Yes! Tries can work with any sequential data:
- **Numbers**: Convert to binary representation (Bitwise Trie)
- **DNA sequences**: A, C, G, T as alphabet
- **File paths**: Use '/' as delimiter
- **Time series**: Discretize values into buckets

### Q3: How does Trie compare to Hash Table for dictionary lookup?

**Answer:** 
- **Hash Table**: O(m) average for lookup, no prefix support
- **Trie**: O(m) worst-case, supports prefix operations, ordered results
- **Trade-off**: Trie uses more memory but provides additional functionality

### Q4: How do you handle case sensitivity in Trie?

**Answer:** Options include:
- Convert all input to lowercase/uppercase before insertion/lookup
- Store both versions with separate branches
- Use a case-insensitive index that normalizes during traversal
- Allow case-sensitive search with separate flag

### Q5: What is the space complexity of a Trie and how can you reduce it?

**Answer:** 
- **Worst case**: O(ALPHABET_SIZE × m × n)
- **Reduction strategies**:
  - Use dictionary-based children (only store existing edges)
  - Compress single-child paths (Radix Trie)
  - Use ternary search tree
  - Implement lazy loading with memory pool

---

## Summary

The Trie (Prefix Tree) is an essential data structure for **string operations** requiring efficient **prefix-based searches**. Key takeaways:

- **O(m) Operations**: All basic operations run in time proportional to word length
- **Prefix Power**: Excellent for autocomplete, spell checking, and prefix matching
- **Space Tradeoff**: Uses more memory than hash tables but provides additional functionality
- **Versatile**: Can be adapted for bitwise operations, numeric data, and space optimization

When to use:
- ✅ Autocomplete and prefix suggestions
- ✅ Spell checking and dictionary lookup
- ✅ IP routing and prefix matching
- ✅ Word games (Boggle, Scrabble)
- ❌ When memory is severely constrained (use hash table)
- ❌ When only exact match lookups are needed

This data structure is essential for competitive programming and technical interviews, especially in problems involving string prefix operations and autocomplete systems.

---

## Related Algorithms

- [Binary Search Tree](./binary-search-tree.md) - Ordered key-value storage
- [Hash Table](./hash-table.md) - Fast exact match lookups
- [Radix Tree](./radix-tree.md) - Space-optimized prefix tree
- [Suffix Tree](./suffix-tree.md) - All substring queries
