# Design Add And Search Words Data Structure

## Problem Description

Design a data structure that supports adding new words and finding if a string matches any previously added string.
Implement the WordDictionary class:

- `WordDictionary()` Initializes the object.
- `void addWord(word)` Adds word to the data structure, it can be matched later.
- `bool search(word)` Returns true if there is any string in the data structure that matches word or false otherwise. word may contain dots '.' where dots can be matched with any letter.

**Link to problem:** [Design Add and Search Words Data Structure - LeetCode 211](https://leetcode.com/problems/design-add-and-search-words-data-structure/)

---

## Examples

**Example 1:**

**Input:**
```python
["WordDictionary","addWord","addWord","addWord","search","search","search","search"]
[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]
```

**Output:**
```python
[null,null,null,null,false,true,true,true]
```

**Explanation:**
```python
WordDictionary wordDictionary = new WordDictionary();
wordDictionary.addWord("bad");
wordDictionary.addWord("dad");
wordDictionary.addWord("mad");
wordDictionary.search("pad"); // return False
wordDictionary.search("bad"); // return True
wordDictionary.search(".ad"); // return True
wordDictionary.search("b.."); // return True
```

---

## Constraints

- `1 <= word.length <= 25`
- `word` in addWord consists of lowercase English letters.
- `word` in search consist of '.' or lowercase English letters.
- There will be at most 2 dots in word for search queries.
- At most 10^4 calls will be made to addWord and search.

---

## Pattern: Trie with DFS Backtracking

This problem uses a **Trie (Prefix Tree)** data structure for efficient word storage and retrieval. For wildcard searches with '.', depth-first search (DFS) is used to explore all possible matching paths.

### Core Concept

- **Trie Structure**: Each node represents a character, with edges to child nodes
- **Word End Marker**: A flag to indicate complete words
- **DFS for Wildcards**: Recursive search when encountering dots

### When to Use This Pattern

This pattern is applicable when:
1. Implementing prefix-based search
2. Handling wildcard pattern matching
3. Building autocomplete systems

---

## Intuition

The key insight for this problem is understanding how to efficiently store and search for words:

1. **Trie for Storage**: A Trie (prefix tree) is perfect for this use case because:
   - It allows O(m) time complexity for insertion where m is the word length
   - It naturally handles prefix-based operations
   - It provides efficient memory usage for words with common prefixes

2. **Handling Wildcards**: The '.' character can match any letter. When we encounter a '.', we need to try all possible paths in the Trie:
   - Use Depth-First Search (DFS) to explore all branches
   - If any branch leads to a match, return true

3. **Why DFS**: Since the maximum number of dots is limited to 2, DFS provides an efficient way to explore all possible matching paths without exponential blowup.

### Key Observations

- Each node in the Trie has up to 26 children (one for each letter)
- The search operation must check all branches when encountering a dot
- We need to track whether a node represents the end of a word

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Trie with DFS (Optimal)** - Best for most cases
2. **Hash Map by Length** - Alternative approach

---

## Approach 1: Trie with DFS (Optimal)

This is the most efficient approach using a Trie with depth-first search for wildcard matching.

### Why It Works

The Trie structure allows efficient word storage and prefix-based operations. For wildcard searches, DFS explores all possible paths matching the pattern. Since there are at most 2 dots, the search remains efficient.

### Code Implementation

````carousel
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class WordDictionary:
    def __init__(self):
        self.root = TrieNode()

    def addWord(self, word: str) -> None:
        """
        Adds a word to the data structure.
        
        Args:
            word: The word to add
        """
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def search(self, word: str) -> bool:
        """
        Searches for a word in the data structure.
        
        Args:
            word: The word to search (may contain '.' wildcards)
            
        Returns:
            True if word is found, False otherwise
        """
        def dfs(node, index):
            # Base case: reached end of word
            if index == len(word):
                return node.is_end
            
            char = word[index]
            
            if char == '.':
                # Try all possible children
                for child in node.children.values():
                    if dfs(child, index + 1):
                        return True
                return False
            else:
                # Specific character - check if path exists
                if char not in node.children:
                    return False
                return dfs(node.children[char], index + 1)
        
        return dfs(self.root, 0)
```

<!-- slide -->
```cpp
class TrieNode {
public:
    unordered_map<char, TrieNode*> children;
    bool isEnd;
    
    TrieNode() {
        isEnd = false;
    }
};

class WordDictionary {
private:
    TrieNode* root;
    
public:
    WordDictionary() {
        root = new TrieNode();
    }
    
    void addWord(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->isEnd = true;
    }
    
    bool search(string word) {
        return dfs(root, word, 0);
    }
    
private:
    bool dfs(TrieNode* node, const string& word, int index) {
        if (index == word.length()) {
            return node->isEnd;
        }
        
        char c = word[index];
        if (c == '.') {
            for (auto& pair : node->children) {
                if (dfs(pair.second, word, index + 1)) {
                    return true;
                }
            }
            return false;
        } else {
            if (node->children.find(c) == node->children.end()) {
                return false;
            }
            return dfs(node->children[c], word, index + 1);
        }
    }
};
```

<!-- slide -->
```java
class TrieNode {
    Map<Character, TrieNode> children;
    boolean isEnd;
    
    TrieNode() {
        children = new HashMap<>();
        isEnd = false;
    }
}

class WordDictionary {
    private TrieNode root;
    
    public WordDictionary() {
        root = new TrieNode();
    }
    
    public void addWord(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node.children.putIfAbsent(c, new TrieNode());
            node = node.children.get(c);
        }
        node.isEnd = true;
    }
    
    public boolean search(String word) {
        return dfs(root, word, 0);
    }
    
    private boolean dfs(TrieNode node, String word, int index) {
        if (index == word.length()) {
            return node.isEnd;
        }
        
        char c = word.charAt(index);
        if (c == '.') {
            for (TrieNode child : node.children.values()) {
                if (dfs(child, word, index + 1)) {
                    return true;
                }
            }
            return false;
        } else {
            TrieNode child = node.children.get(c);
            if (child == null) {
                return false;
            }
            return dfs(child, word, index + 1);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Initialize your data structure here.
 */
var WordDictionary = function() {
    this.root = new TrieNode();
};

/**
 * Adds a word to the data structure. 
 * @param {string} word
 * @return {void}
 */
WordDictionary.prototype.addWord = function(word) {
    let node = this.root;
    for (const char of word) {
        if (!node.children[char]) {
            node.children[char] = new TrieNode();
        }
        node = node.children[char];
    }
    node.isEnd = true;
};

/**
 * Returns if the word is in the data structure. 
 * @param {string} word
 * @return {boolean}
 */
WordDictionary.prototype.search = function(word) {
    return this.dfs(this.root, word, 0);
};

WordDictionary.prototype.dfs = function(node, word, index) {
    if (index === word.length) {
        return node.isEnd;
    }
    
    const char = word[index];
    if (char === '.') {
        for (const childKey in node.children) {
            if (this.dfs(node.children[childKey], word, index + 1)) {
                return true;
            }
        }
        return false;
    } else {
        if (!node.children[char]) {
            return false;
        }
        return this.dfs(node.children[char], word, index + 1);
    }
};

function TrieNode() {
    this.children = {};
    this.isEnd = false;
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | addWord: O(m), search: O(26^d) worst case where d is number of dots |
| **Space** | O(total characters) for Trie storage |

---

## Approach 2: Hash Map by Length

### Algorithm Steps

1. **Store words by length**: Use a hash map where keys are word lengths
2. **For search**: Get all words of the same length and compare manually
3. **Handle dots**: When comparing, treat '.' as a wildcard that matches any character

### Why It Works

This approach simplifies the problem by grouping words by their length. During search, we only need to compare with words of the same length, reducing the search space.

### Code Implementation

````carousel
```python
class WordDictionary:
    def __init__(self):
        self.words = {}  # Map length to list of words

    def addWord(self, word: str) -> None:
        length = len(word)
        if length not in self.words:
            self.words[length] = []
        self.words[length].append(word)

    def search(self, word: str) -> bool:
        length = len(word)
        if length not in self.words:
            return False
        
        for w in self.words[length]:
            if self._matches(w, word):
                return True
        return False
    
    def _matches(self, w: str, pattern: str) -> bool:
        for i in range(len(w)):
            if pattern[i] != '.' and pattern[i] != w[i]:
                return False
        return True
```

<!-- slide -->
```cpp
class WordDictionary {
private:
    unordered_map<int, vector<string>> words;
    
public:
    WordDictionary() {
        // Initialize
    }
    
    void addWord(string word) {
        words[word.length()].push_back(word);
    }
    
    bool search(string word) {
        int length = word.length();
        if (words.find(length) == words.end()) {
            return false;
        }
        
        for (const string& w : words[length]) {
            if (matches(w, word)) {
                return true;
            }
        }
        return false;
    }
    
private:
    bool matches(const string& w, const string& pattern) {
        for (int i = 0; i < w.length(); i++) {
            if (pattern[i] != '.' && pattern[i] != w[i]) {
                return false;
            }
        }
        return true;
    }
};
```

<!-- slide -->
```java
class WordDictionary {
    private Map<Integer, List<String>> words;
    
    public WordDictionary() {
        words = new HashMap<>();
    }
    
    public void addWord(String word) {
        int len = word.length();
        words.computeIfAbsent(len, k -> new ArrayList<>()).add(word);
    }
    
    public boolean search(String word) {
        int len = word.length();
        if (!words.containsKey(len)) {
            return false;
        }
        
        for (String w : words.get(len)) {
            if (matches(w, word)) {
                return true;
            }
        }
        return false;
    }
    
    private boolean matches(String w, String pattern) {
        for (int i = 0; i < w.length(); i++) {
            if (pattern.charAt(i) != '.' && pattern.charAt(i) != w.charAt(i)) {
                return false;
            }
        }
        return true;
    }
}
```

<!-- slide -->
```javascript
/**
 * Initialize your data structure here.
 */
var WordDictionary = function() {
    this.words = {};
};

/**
 * Adds a word to the data structure. 
 * @param {string} word
 * @return {void}
 */
WordDictionary.prototype.addWord = function(word) {
    const len = word.length;
    if (!this.words[len]) {
        this.words[len] = [];
    }
    this.words[len].push(word);
};

/**
 * Returns if the word is in the data structure. 
 * @param {string} word
 * @return {boolean}
 */
WordDictionary.prototype.search = function(word) {
    const len = word.length;
    if (!this.words[len]) {
        return false;
    }
    
    for (const w of this.words[len]) {
        if (this.matches(w, word)) {
            return true;
        }
    }
    return false;
};

WordDictionary.prototype.matches = function(w, pattern) {
    for (let i = 0; i < w.length; i++) {
        if (pattern[i] !== '.' && pattern[i] !== w[i]) {
            return false;
        }
    }
    return true;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | addWord: O(1), search: O(26^d × n) where n is number of words with same length |
| **Space** | O(n × m) where n is number of words and m is average word length |

---

## Comparison of Approaches

| Aspect | Trie + DFS | Hash Map by Length |
|--------|------------|-------------------|
| **Time Complexity** | O(26^d × m) | O(n × m) worst case |
| **Space Complexity** | O(total chars) | O(n × m) |
| **Implementation** | Moderate | Simple |
| **Best For** | Large datasets with many searches | Small datasets |

**Best Approach:** Use Approach 1 (Trie + DFS) for most cases as it provides better space efficiency and faster lookups for larger datasets.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Trie data structure, DFS, String matching

### Learning Outcomes

1. **Trie Mastery**: Learn to implement and use Trie data structure
2. **DFS Pattern**: Understand recursive search with backtracking
3. **Wildcard Handling**: Learn efficient wildcard pattern matching
4. **Space-Time Tradeoffs**: Understand different approach tradeoffs

---

## Related Problems

### Similar Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Implement Trie | [Link](https://leetcode.com/problems/implement-trie-prefix-tree/) | Basic Trie implementation |
| Word Search II | [Link](https://leetcode.com/problems/word-search-ii/) | Trie with DFS for grid search |
| Prefix and Suffix Search | [Link](https://leetcode.com/problems/prefix-and-suffix-search/) | Advanced Trie usage |
| Replace Words | [Link](https://leetcode.com/problems/replace-words/) | Trie for prefix matching |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Design Add and Search Words](https://www.youtube.com/watch?v=6xLSN1F1C88)** - Clear explanation with visual examples
2. **[Word Dictionary - LeetCode 211](https://www.youtube.com/watch?v=BTf05dk_4fM)** - Detailed walkthrough
3. **[Trie Data Structure](https://www.youtube.com/watch?v=8X3E5yT4j8Q)** - Understanding Trie

---

## Follow-up Questions

### Q1: How would you modify the solution to support more than 2 dots?

**Answer:** The Trie + DFS approach already supports any number of dots. However, for very large numbers of dots, the search could become slow. You could add caching/memoization to store intermediate results for subpatterns.

---

### Q2: How would you implement autocomplete functionality?

**Answer:** Add a method that finds all words with a given prefix. In the Trie, each node could store all words that pass through it, allowing efficient prefix-based autocomplete.

---

### Q3: Can you implement this using a hash map instead of Trie?

**Answer:** Yes, you could store all words in a hash map and filter during search. However, this would be less efficient for prefix-based operations and wildcard searches.

---

### Q4: How would you handle case-insensitive searches?

**Answer:** Convert all words to lowercase before storing and searching. This is a simple change that doesn't affect the core algorithm.

---

### Q5: What changes would be needed to support Unicode characters?

**Answer:** Replace the fixed-size array of 26 children with a hash map that can handle any character. The time complexity remains similar, but memory usage may increase.

---

## Common Pitfalls

### 1. Not Resetting Search Properly
**Issue**: Starting DFS from the wrong node for each search.

**Solution**: Always start DFS from the root node for each new search operation.

### 2. Exponential Time with Many Dots
**Issue**: With many dots, DFS explores all possible branches leading to exponential time.

**Solution**: The constraint limits dots to 2, so this is manageable. For more dots, consider using BFS or adding memoization.

### 3. Not Marking Word Endings
**Issue**: Not distinguishing between "ab" as a prefix vs. a complete word.

**Solution**: Always set and check the `is_end` flag to mark complete words in the Trie.

### 4. Memory Usage
**Issue**: Large number of words leads to significant memory usage.

**Solution**: Consider using compression techniques or storing only necessary information in Trie nodes.

### 5. Incorrect Base Case
**Issue**: Not checking if the current node represents the end of a word when reaching the end of the search pattern.

**Solution**: In DFS, when `index == len(word)`, return `node.is_end`.

---

## Summary

The **Design Add and Search Words Data Structure** problem demonstrates the power of **Trie with DFS** for efficient word storage and wildcard matching:

- **Trie + DFS**: Optimal solution with O(m) add and O(26^d) search
- **Hash Map Approach**: Alternative with simpler implementation
- **Key Insight**: Use Trie for efficient prefix operations and DFS for wildcard matching

Key takeaways:
1. Trie provides efficient word storage and prefix operations
2. DFS handles wildcard matching by exploring all possible paths
3. The constraint of at most 2 dots keeps the search efficient
4. Always mark word endings to distinguish prefixes from complete words

This problem is excellent for learning Trie data structures and is frequently asked in technical interviews to test your ability to design efficient data structures.

---

## Additional Resources

- [LeetCode Problem 211](https://leetcode.com/problems/design-add-and-search-words-data-structure/) - Official problem page
- [Trie - GeeksforGeeks](https://www.geeksforgeeks.org/trie-insert-and-search/) - Detailed Trie explanation
- [DFS Backtracking](https://en.wikipedia.org/wiki/Depth-first_search) - DFS fundamentals
