# Word Squares

## Problem Description

Given a set of words (without duplicates), return all word squares. A word square is a sequence of words of length `k` such that for every `i` from `0` to `k-1`, the `i`-th row and the `i`-th column are the same word.

**Link to problem:** [Word Squares - LeetCode 425](https://leetcode.com/problems/word-squares/)

## Constraints
- `1 <= words.length <= 1000`
- `1 <= words[i].length <= 4`
- `words[i]` consists of lowercase English letters

---

## Pattern: Trie + Backtracking

This problem follows the **Trie + Backtracking** pattern for prefix-based construction.

### Core Concept

- **Trie Structure**: Store words with prefix information for quick lookup
- **Prefix Building**: Each row's prefix determines candidates for next row
- **Backtracking**: Try candidates, build square, undo on failure

### When to Use This Pattern

This pattern is applicable when:
1. Building words row by row with prefix constraints
2. Problems requiring prefix matching
3. Word grid construction problems

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| HashMap | Use prefix -> words mapping |
| Brute Force | Check all combinations |

---

## Intuition

The key insight is that in a word square, each row forms a prefix for the next row. For example, in a 5-letter word square:
- Row 0: "ball" → defines prefix for row 1
- Row 1: "area" → the first letter 'a' comes from column 0
- Row 2: "lead" → columns 0-1 form "le" from rows 0-1
- And so on...

This means we can build the square row by row:
1. Start with any word as the first row
2. For each subsequent row, build a prefix from the letters at position `i` of all previous rows
3. Use a Trie to quickly find all words starting with that prefix
4. Backtrack when no words match the prefix

The Trie is crucial for efficiency - it allows O(1) prefix lookup instead of scanning all words.

---

## Examples

### Example

**Input:** words = ["area","lead","wall","lady","ball"]

**Output:** [["ball","area","lead","wall","lady"],["wall","area","lead","lady","ball"]]

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Trie + Backtracking** - Optimal solution using Trie for prefix lookup
2. **HashMap-based** - Alternative using hash maps instead of Trie

---

## Approach 1: Trie + Backtracking (Optimal)

````carousel
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.words = []

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
            node.words.append(word)
    
    def search(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return []
            node = node.children[char]
        return node.words

def wordSquares(words):
    trie = Trie()
    for word in words:
        trie.insert(word)
    
    n = len(words[0]) if words else 0
    result = []
    
    def backtrack(square):
        if len(square) == n:
            result.append(square[:])
            return
        prefix = ''.join(square[i][len(square)] for i in range(len(square)))
        candidates = trie.search(prefix)
        for cand in candidates:
            square.append(cand)
            backtrack(square)
            square.pop()
    
    for word in words:
        backtrack([word])
    
    return result
```

<!-- slide -->
```cpp
struct TrieNode {
    unordered_map<char, TrieNode*> children;
    vector<string> words;
};

class Trie {
public:
    TrieNode* root;
    Trie() { root = new TrieNode(); }
    
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children[c]) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
            node->words.push_back(word);
        }
    }
    
    vector<string> search(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (!node->children[c]) return {};
            node = node->children[c];
        }
        return node->words;
    }
};

class Solution {
public:
    vector<vector<string>> wordSquares(vector<string>& words) {
        Trie trie;
        for (string w : words) trie.insert(w);
        
        int n = words[0].size();
        vector<vector<string>> result;
        vector<string> square;
        
        function<void()> backtrack = [&]() {
            if (square.size() == n) {
                result.push_back(square);
                return;
            }
            string prefix;
            for (int i = 0; i < square.size(); i++) {
                prefix += square[i][square.size()];
            }
            for (string cand : trie.search(prefix)) {
                square.push_back(cand);
                backtrack();
                square.pop_back();
            }
        };
        
        for (string w : words) {
            square = {w};
            backtrack();
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        List<String> words = new ArrayList<>();
    }
    
    class Trie {
        TrieNode root = new TrieNode();
        
        void insert(String word) {
            TrieNode node = root;
            for (char c : word.toCharArray()) {
                node.children.putIfAbsent(c, new TrieNode());
                node = node.children.get(c);
                node.words.add(word);
            }
        }
        
        List<String> search(String prefix) {
            TrieNode node = root;
            for (char c : prefix.toCharArray()) {
                if (!node.children.containsKey(c)) return new ArrayList<>();
                node = node.children.get(c);
            }
            return node.words;
        }
    }
    
    public List<List<String>> wordSquares(String[] words) {
        Trie trie = new Trie();
        for (String w : words) trie.insert(w);
        
        List<List<String>> result = new ArrayList<>();
        int n = words[0].length();
        
        backtrack(words, trie, n, new ArrayList<>(), result);
        return result;
    }
    
    private void backtrack(String[] words, Trie trie, int n, 
                          List<String> square, List<List<String>> result) {
        if (square.size() == n) {
            result.add(new ArrayList<>(square));
            return;
        }
        
        StringBuilder prefix = new StringBuilder();
        for (String w : square) {
            prefix.append(w.charAt(square.size()));
        }
        
        for (String cand : trie.search(prefix.toString())) {
            square.add(cand);
            backtrack(words, trie, n, square, result);
            square.remove(square.size() - 1);
        }
    }
}
```

<!-- slide -->
```javascript
var wordSquares = function(words) {
    // Build Trie
    const trie = {};
    for (const word of words) {
        let node = trie;
        for (const char of word) {
            if (!node[char]) node[char] = { words: [] };
            node = node[char];
            node.words.push(word);
        }
    }
    
    const search = (prefix) => {
        let node = trie;
        for (const char of prefix) {
            if (!node[char]) return [];
            node = node[char];
        }
        return node.words || [];
    };
    
    const n = words[0].length;
    const result = [];
    
    const backtrack = (square) => {
        if (square.length === n) {
            result.push([...square]);
            return;
        }
        
        let prefix = '';
        for (const w of square) {
            prefix += w[square.length];
        }
        
        for (const cand of search(prefix)) {
            square.push(cand);
            backtrack(square);
            square.pop();
        }
    };
    
    for (const word of words) {
        backtrack([word]);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × m²) |
| **Space** | O(n × m) |

---

## Approach 2: HashMap-Based (Alternative)

### Algorithm Steps

1. Build a HashMap mapping each prefix to all words that start with that prefix
2. For each word, generate all possible prefixes and store in the map
3. Use backtracking to build the word square
4. For each subsequent row, look up words that match the required prefix in the HashMap

### Why It Works

The HashMap approach works because:
- We pre-compute all possible prefixes and store corresponding words
- This gives O(1) lookup for prefixes during backtracking
- The trade-off is more memory usage compared to Trie

### Code Implementation

````carousel
```python
from collections import defaultdict

def wordSquares(words):
    if not words:
        return []
    
    n = len(words[0])
    prefix_map = defaultdict(set)
    
    # Build prefix map
    for word in words:
        for i in range(1, n):
            prefix_map[word[:i]].add(word)
    
    result = []
    
    def backtrack(square):
        if len(square) == n:
            result.append(square[:])
            return
        
        # Build prefix for next row
        prefix = ''.join(word[len(square)] for word in square)
        
        # Get candidates from prefix map
        for candidate in list(prefix_map[prefix]):
            square.append(candidate)
            backtrack(square)
            square.pop()
    
    for word in words:
        backtrack([word])
    
    return result
```

<!-- slide -->
```cpp
#include <unordered_map>
#include <unordered_set>
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    vector<vector<string>> wordSquares(vector<string>& words) {
        if (words.empty()) return {};
        
        int n = words[0].size();
        unordered_map<string, unordered_set<string>> prefixMap;
        
        for (const string& word : words) {
            for (int i = 1; i < n; i++) {
                prefixMap[word.substr(0, i)].insert(word);
            }
        }
        
        vector<vector<string>> result;
        vector<string> square;
        
        function<void()> backtrack = [&]() {
            if (square.size() == n) {
                result.push_back(square);
                return;
            }
            
            string prefix;
            for (const string& w : square) {
                prefix += w[square.size()];
            }
            
            if (prefixMap.find(prefix) == prefixMap.end()) return;
            
            for (const string& cand : prefixMap[prefix]) {
                square.push_back(cand);
                backtrack();
                square.pop_back();
            }
        };
        
        for (const string& word : words) {
            square = {word};
            backtrack();
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<String>> wordSquares(String[] words) {
        if (words.length == 0) return new ArrayList<>();
        
        int n = words[0].length();
        Map<String, Set<String>> prefixMap = new HashMap<>();
        
        for (String word : words) {
            for (int i = 1; i < n; i++) {
                String prefix = word.substring(0, i);
                prefixMap.computeIfAbsent(prefix, k -> new HashSet<>()).add(word);
            }
        }
        
        List<List<String>> result = new ArrayList<>();
        List<String> square = new ArrayList<>();
        
        backtrack(words, prefixMap, n, square, result);
        return result;
    }
    
    private void backtrack(String[] words, Map<String, Set<String>> prefixMap, 
                          int n, List<String> square, List<List<String>> result) {
        if (square.size() == n) {
            result.add(new ArrayList<>(square));
            return;
        }
        
        StringBuilder prefix = new StringBuilder();
        for (String w : square) {
            prefix.append(w.charAt(square.size()));
        }
        
        Set<String> candidates = prefixMap.get(prefix.toString());
        if (candidates == null) return;
        
        for (String cand : candidates) {
            square.add(cand);
            backtrack(words, prefixMap, n, square, result);
            square.remove(square.size() - 1);
        }
    }
}
```

<!-- slide -->
```javascript
var wordSquares = function(words) {
    if (!words || words.length === 0) return [];
    
    const n = words[0].length;
    const prefixMap = new Map();
    
    // Build prefix map
    for (const word of words) {
        for (let i = 1; i < n; i++) {
            const prefix = word.substring(0, i);
            if (!prefixMap.has(prefix)) {
                prefixMap.set(prefix, new Set());
            }
            prefixMap.get(prefix).add(word);
        }
    }
    
    const result = [];
    
    const backtrack = (square) => {
        if (square.length === n) {
            result.push([...square]);
            return;
        }
        
        let prefix = '';
        for (const w of square) {
            prefix += w[square.length];
        }
        
        const candidates = prefixMap.get(prefix);
        if (!candidates) return;
        
        for (const cand of candidates) {
            square.push(cand);
            backtrack(square);
            square.pop();
        }
    };
    
    for (const word of words) {
        backtrack([word]);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × m²) |
| **Space** | O(n × m) |

---

## Summary

The **Word Squares** problem demonstrates **Trie + Backtracking**:
- Use Trie for efficient prefix search
- Build squares using backtracking
- O(n × m²) time complexity

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Valid Word Square | [Link](https://leetcode.com/problems/valid-word-square/) | Similar structure |
| Word Search | [Link](https://leetcode.com/problems/word-search/) | Backtracking |
| Prefix and Suffix Search | [Link](https://leetcode.com/problems/prefix-and-suffix-search/) | Trie variations |

---

## Video Tutorial Links

- [NeetCode - Word Squares](https://www.youtube.com/watch?v=SuJyGk1kG5E) - Clear explanation
- [Trie + Backtracking](https://www.youtube.com/watch?v=qH0bgiMuj9U) - Detailed walkthrough
- [LeetCode Official](https://www.youtube.com/watch?v=3Q_o3J3qGiY) - Official solution

---

## Follow-up Questions

### Q1: What if words had different lengths?

**Answer:** Group words by length. Only words of the same length can form squares together.

### Q2: How would you count the number of squares without storing them?

**Answer:** Instead of storing results, increment a counter in the base case.

### Q3: What if we needed the lexicographically smallest squares?

**Answer:** Sort the initial word list and iterate in order. The first found squares will be lexicographically smallest.

### Q4: How would you optimize for very large word lists?

**Answer:** Use a hash map instead of Trie for prefix lookup. Trade memory for speed.

---

## Common Pitfalls

### 1. Trie Memory Usage
**Issue**: Trie can use significant memory for large word lists.

**Solution**: Consider using a hash map of prefix to word list for smaller datasets.

### 2. Prefix Building
**Issue**: Incorrect prefix calculation for next row.

**Solution**: Build prefix by taking the i-th character from each of the first i rows.

### 3. Backtracking Depth
**Issue**: Deep recursion can cause stack overflow for long words.

**Solution:** Use iterative approach or increase recursion limit.

### 4. Empty Word List
**Issue:** Not handling empty input.

**Solution:** Return empty result for empty word list.

---

## Summary

The **Word Squares** problem demonstrates **Trie + Backtracking**:
- Use Trie for efficient prefix search
- Build squares using backtracking
- Each row's prefix determines candidates for next row
- O(n × m²) time complexity

This problem is an excellent example of combining data structures (Trie) with algorithmic techniques (backtracking) to solve complex pattern matching problems.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/word-squares/discuss/) - Community solutions
- [Trie Data Structure - GeeksforGeeks](https://www.geeksforgeeks.org/trie-insert-and-search/)
