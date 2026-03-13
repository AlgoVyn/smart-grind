# Prefix and Suffix Search

## Problem Description

Design a special dictionary that searches the words in it by a prefix and a suffix.

Implement the WordFilter class:
- `WordFilter(string[] words)` Initializes the object with the words in the dictionary.
- `f(string pref, string suff)` Returns the index of the word in the dictionary, which has the prefix `pref` and the suffix `suff`. If there is more than one valid index, return the largest of them. If there is no such word in the dictionary, return `-1`.

**Link to problem:** [Prefix and Suffix Search - LeetCode 745](https://leetcode.com/problems/prefix-and-suffix-search/)

## Constraints
- `1 <= words.length <= 10^4`
- `1 <= words[i].length <= 7`
- `1 <= pref.length, suff.length <= 7`
- `words[i], pref and suff` consist of lowercase English letters only
- At most `10^4` calls will be made to the function `f`

---

## Pattern: Trie with Combined Keys

This problem uses the **Trie (Prefix Tree)** pattern combined with a clever key combination technique. The key insight is to combine prefix and suffix into a single key for O(1) lookup.

### Core Concept

The key insight is:
- Generate all possible prefix-suffix combinations for each word
- Use a special separator character (#) to distinguish prefix from suffix
- Store in a dictionary for O(1) lookup
- Dictionary overwrites ensure largest index is stored

---

## Examples

### Example

**Input:**
```
["WordFilter", "f"]
[["apple"], ["a", "e"]]
```

**Output:**
```
[null, 0]
```

**Explanation:**
- WordFilter wordFilter = new WordFilter(["apple"]);
- wordFilter.f("a", "e"); // return 0, because the word at index 0 has prefix = "a" and suffix = "e".

### Example 2

**Input:**
```
WordFilter(["apple", "banana", "pear"])
f("a", "e")  // "apple" has prefix "a" and suffix "e" → return 0
f("b", "a")  // "banana" has prefix "b" and suffix "a" → return 1
f("p", "r")  // "pear" has prefix "p" and suffix "r" → return 2
```

### Example 3

**Input:**
```
WordFilter(["apple", "apply", "ape"])
f("ap", "e")  // Both "apple", "apply", "ape" match → return index 1 (largest)
```

---

## Intuition

The key insight is:

1. **Combined Key**: Create keys by combining prefix + separator + suffix
2. **Precomputation**: Generate all combinations during initialization
3. **Dictionary Storage**: Use hash map for O(1) query time
4. **Index Handling**: Since dict overwrites, the last (largest) index is stored

### Why It Works

By precomputing all possible prefix-suffix combinations:
- Query becomes a simple dictionary lookup
- The larger index automatically overwrites smaller ones
- Time complexity is O(1) for queries after O(n × L²) preprocessing

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Hash Map with Combined Keys (Optimal)** - O(1) query, O(n × L²) preprocessing
2. **Two Tries Approach** - O(L) query with more complex structure

---

## Approach 1: Hash Map with Combined Keys (Optimal)

This is the standard solution using a hash map with combined prefix-suffix keys.

### Algorithm Steps

1. Create an empty dictionary
2. For each word at index i:
   - For each possible prefix length (0 to word.length):
     - For each possible suffix length (0 to word.length):
       - Create key = prefix + '#' + suffix
       - Store i in dictionary (overwrites for same key)
3. For query f(pref, suff):
   - Create key = pref + '#' + suff
   - Return dictionary[key] or -1

### Why It Works

The preprocessing ensures all possible combinations are stored. The dictionary lookup is O(1). Since we process words in order and overwrite, the largest index is automatically stored.

### Code Implementation

````carousel
```python
from typing import List

class WordFilter:
    def __init__(self, words: List[str]):
        """
        Initialize WordFilter with words.
        
        Args:
            words: List of words to store in dictionary
        """
        self.d = {}
        
        for i, word in enumerate(words):
            # Generate all prefix-suffix combinations
            word_len = len(word)
            for j in range(word_len + 1):  # prefix length
                for k in range(word_len + 1):  # suffix length
                    # Create key: prefix + '#' + suffix
                    key = word[:j] + '#' + word[k:]
                    self.d[key] = i
    
    def f(self, pref: str, suff: str) -> int:
        """
        Find index of word with given prefix and suffix.
        
        Args:
            pref: Prefix to search for
            suff: Suffix to search for
            
        Returns:
            Index of word with prefix and suffix, or -1
        """
        key = pref + '#' + suff
        return self.d.get(key, -1)
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <unordered_map>

class WordFilter {
public:
    /**
     * Initialize WordFilter with words.
     * 
     * @param words List of words to store in dictionary
     */
    WordFilter(vector<string> words) {
        for (int i = 0; i < words.size(); i++) {
            const string& word = words[i];
            int wordLen = word.length();
            
            // Generate all prefix-suffix combinations
            for (int j = 0; j <= wordLen; j++) {  // prefix length
                for (int k = 0; k <= wordLen; k++) {  // suffix length
                    // Create key: prefix + '#' + suffix
                    string key = word.substr(0, j) + "#" + word.substr(k);
                    d[key] = i;
                }
            }
        }
    }
    
    /**
     * Find index of word with given prefix and suffix.
     * 
     * @param pref Prefix to search for
     * @param suff Suffix to search for
     * @return Index of word with prefix and suffix, or -1
     */
    int f(string pref, string suff) {
        string key = pref + "#" + suff;
        if (d.find(key) != d.end()) {
            return d[key];
        }
        return -1;
    }
    
private:
    unordered_map<string, int> d;
};
```

<!-- slide -->
```java
import java.util.HashMap;
import java.util.Map;

class WordFilter {
    private Map<String, Integer> d;
    
    /**
     * Initialize WordFilter with words.
     * 
     * @param words List of words to store in dictionary
     */
    public WordFilter(String[] words) {
        d = new HashMap<>();
        
        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            int wordLen = word.length();
            
            // Generate all prefix-suffix combinations
            for (int j = 0; j <= wordLen; j++) {  // prefix length
                for (int k = 0; k <= wordLen; k++) {  // suffix length
                    // Create key: prefix + '#' + suffix
                    String key = word.substring(0, j) + "#" + word.substring(k);
                    d.put(key, i);
                }
            }
        }
    }
    
    /**
     * Find index of word with given prefix and suffix.
     * 
     * @param pref Prefix to search for
     * @param suff Suffix to search for
     * @return Index of word with prefix and suffix, or -1
     */
    public int f(String pref, String suff) {
        String key = pref + "#" + suff;
        return d.getOrDefault(key, -1);
    }
}
```

<!-- slide -->
```javascript
/**
 * Initialize WordFilter with words.
 * 
 * @param {string[]} words - List of words to store in dictionary
 */
var WordFilter = function(words) {
    this.d = {};
    
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const wordLen = word.length;
        
        // Generate all prefix-suffix combinations
        for (let j = 0; j <= wordLen; j++) {  // prefix length
            for (let k = 0; k <= wordLen; k++) {  // suffix length
                // Create key: prefix + '#' + suffix
                const key = word.substring(0, j) + '#' + word.substring(k);
                this.d[key] = i;
            }
        }
    }
};

/**
 * Find index of word with given prefix and suffix.
 * 
 * @param {string} pref - Prefix to search for
 * @param {string} suff - Suffix to search for
 * @return {number} - Index of word with prefix and suffix, or -1
 */
WordFilter.prototype.f = function(pref, suff) {
    const key = pref + '#' + suff;
    return this.d[key] !== undefined ? this.d[key] : -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | Init: O(n × L²), Query: O(1) |
| **Space** | O(n × L²) - For storing all combinations |

---

## Approach 2: Two Tries Approach

This approach uses two - one for prefix tries and one for suffix, then finds intersection.

### Algorithm Steps

1. Build prefix trie with (word, index) pairs
2. Build suffix trie with (word, index) pairs  
3. For query: traverse both tries and find intersection of indices
4. Return largest index from intersection

### Code Implementation

````carousel
```python
from typing import List, Set, Tuple

class TrieNode:
    def __init__(self):
        self.children = {}
        self.indices = set()

class WordFilter:
    def __init__(self, words: List[str]):
        self.prefix_trie = TrieNode()
        self.suffix_trie = TrieNode()
        
        for i, word in enumerate(words):
            # Insert into prefix trie
            node = self.prefix_trie
            for char in word:
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
                node.indices.add(i)
            
            # Insert into suffix trie
            node = self.suffix_trie
            for char in reversed(word):
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
                node.indices.add(i)
    
    def f(self, pref: str, suff: str) -> int:
        # Find indices matching prefix
        node = self.prefix_trie
        for char in pref:
            if char not in node.children:
                return -1
            node = node.children[char]
        prefix_indices = node.indices
        
        # Find indices matching suffix
        node = self.suffix_trie
        for char in reversed(suff):
            if char not in node.children:
                return -1
            node = node.children[char]
        suffix_indices = node.indices
        
        # Find intersection
        common = prefix_indices & suffix_indices
        return max(common) if common else -1
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_set>

struct TrieNode {
    std::unordered_map<char, TrieNode*> children;
    std::unordered_set<int> indices;
};

class WordFilter {
public:
    WordFilter(vector<string> words) {
        prefixTrie = new TrieNode();
        suffixTrie = new TrieNode();
        
        for (int i = 0; i < words.size(); i++) {
            // Insert into prefix trie
            TrieNode* node = prefixTrie;
            for (char c : words[i]) {
                if (node->children.find(c) == node->children.end()) {
                    node->children[c] = new TrieNode();
                }
                node = node->children[c];
                node->indices.insert(i);
            }
            
            // Insert into suffix trie
            node = suffixTrie;
            for (int j = words[i].size() - 1; j >= 0; j--) {
                char c = words[i][j];
                if (node->children.find(c) == node->children.end()) {
                    node->children[c] = new TrieNode();
                }
                node = node->children[c];
                node->indices.insert(i);
            }
        }
    }
    
    int f(string pref, string suff) {
        // Find indices matching prefix
        TrieNode* node = prefixTrie;
        for (char c : pref) {
            if (node->children.find(c) == node->children.end()) {
                return -1;
            }
            node = node->children[c];
        }
        
        // Find indices matching suffix
        node = suffixTrie;
        for (int i = suff.size() - 1; i >= 0; i--) {
            char c = suff[i];
            if (node->children.find(c) == node->children.end()) {
                return -1;
            }
            node = node->children[c];
        }
        
        // Find intersection
        int result = -1;
        for (int idx : node->indices) {
            result = max(result, idx);
        }
        return result;
    }
    
private:
    TrieNode* prefixTrie;
    TrieNode* suffixTrie;
};
```

<!-- slide -->
```java
import java.util.*;

class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    Set<Integer> indices = new HashSet<>();
}

class WordFilter {
    private TrieNode prefixTrie;
    private TrieNode suffixTrie;
    
    public WordFilter(String[] words) {
        prefixTrie = new TrieNode();
        suffixTrie = new TrieNode();
        
        for (int i = 0; i < words.length; i++) {
            // Insert into prefix trie
            TrieNode node = prefixTrie;
            for (char c : words[i].toCharArray()) {
                node.children.putIfAbsent(c, new TrieNode());
                node = node.children.get(c);
                node.indices.add(i);
            }
            
            // Insert into suffix trie
            node = suffixTrie;
            for (int j = words[i].length() - 1; j >= 0; j--) {
                char c = words[i].charAt(j);
                node.children.putIfAbsent(c, new TrieNode());
                node = node.children.get(c);
                node.indices.add(i);
            }
        }
    }
    
    public int f(String pref, String suff) {
        // Find indices matching prefix
        TrieNode node = prefixTrie;
        for (char c : pref.toCharArray()) {
            if (!node.children.containsKey(c)) {
                return -1;
            }
            node = node.children.get(c);
        }
        Set<Integer> prefixIndices = node.indices;
        
        // Find indices matching suffix
        node = suffixTrie;
        for (int i = suff.length() - 1; i >= 0; i--) {
            char c = suff.charAt(i);
            if (!node.children.containsKey(c)) {
                return -1;
            }
            node = node.children.get(c);
        }
        Set<Integer> suffixIndices = node.indices;
        
        // Find intersection
        int result = -1;
        for (int idx : suffixIndices) {
            if (prefixIndices.contains(idx)) {
                result = Math.max(result, idx);
            }
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
class TrieNode {
    constructor() {
        this.children = {};
        this.indices = new Set();
    }
}

var WordFilter = function(words) {
    this.prefixTrie = new TrieNode();
    this.suffixTrie = new TrieNode();
    
    for (let i = 0; i < words.length; i++) {
        // Insert into prefix trie
        let node = this.prefixTrie;
        for (const char of words[i]) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
            node.indices.add(i);
        }
        
        // Insert into suffix trie
        node = this.suffixTrie;
        for (let j = words[i].length - 1; j >= 0; j--) {
            const char = words[i][j];
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
            node.indices.add(i);
        }
    }
};

WordFilter.prototype.f = function(pref, suff) {
    // Find indices matching prefix
    let node = this.prefixTrie;
    for (const char of pref) {
        if (!node.children[char]) {
            return -1;
        }
        node = node.children[char];
    }
    const prefixIndices = node.indices;
    
    // Find indices matching suffix
    node = this.suffixTrie;
    for (let i = suff.length - 1; i >= 0; i--) {
        const char = suff[i];
        if (!node.children[char]) {
            return -1;
        }
        node = node.children[char];
    }
    const suffixIndices = node.indices;
    
    // Find intersection
    let result = -1;
    for (const idx of suffixIndices) {
        if (prefixIndices.has(idx)) {
            result = Math.max(result, idx);
        }
    }
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | Init: O(n × L), Query: O(L + m) where m is intersection size |
| **Space** | O(n × L) for trie storage |

---

## Comparison of Approaches

| Aspect | Hash Map | Two Tries |
|--------|----------|-----------|
| **Query Time** | O(1) | O(L + m) |
| **Preprocessing** | O(n × L²) | O(n × L) |
| **Space** | O(n × L²) | O(n × L) |
| **Implementation** | Simpler | More complex |
| **Best For** | Many queries | Memory constrained |

**Best Approach:** The hash map approach is optimal for most cases with O(1) query time.

---

## Why Use '#' as Separator?

We use '#' (or any character not in 'a'-'z') as a separator to:
- Clearly separate prefix and suffix in the key
- Prevent ambiguity (e.g., "ab" + "c" vs "a" + "bc")
- Ensure unique keys for lookup

---

## Related Problems

Based on similar themes (trie, prefix-suffix, dictionary):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Prefix and Suffix Search | [Link](https://leetcode.com/problems/prefix-and-suffix-search/) | This problem |
| Implement Trie | [Link](https://leetcode.com/problems/implement-trie-prefix-tree/) | Basic Trie implementation |
| Search Suggestions System | [Link](https://leetcode.com/problems/search-suggestions-system/) | Trie with suggestions |

### Pattern Reference

For more detailed explanations of the Trie pattern, see:
- **[Trie - Prefix Tree](/patterns/trie-prefix-tree)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Hash Map Approach

- [NeetCode - Prefix and Suffix Search](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation
- [WordFilter Solution](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough

### Related Concepts

- [Trie Data Structure](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Understanding tries
- [Hash Map Optimization](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Using hash maps efficiently

---

## Follow-up Questions

### Q1: Why is the time complexity O(n × L²) for preprocessing?

**Answer:** For each of n words with length L, there are (L+1) possible prefix lengths and (L+1) possible suffix lengths, giving (L+1)² ≈ L² combinations.

---

### Q2: Can you reduce the space complexity?

**Answer:** Yes, use the two-tries approach which uses O(n × L) space but has O(L + m) query time where m is the number of matching indices.

---

### Q3: What if words can have length up to 10?

**Answer:** The algorithm scales similarly. The preprocessing becomes O(n × L²) which is still manageable for n = 10⁴ and L = 10.

---

### Q4: How do you handle empty prefix or suffix?

**Answer:** Empty prefix/suffix is handled naturally since we generate combinations for all lengths from 0 to L. Empty string is a valid prefix/suffix.

---

### Q5: What is the maximum number of keys stored?

**Answer:** For words with length L, there are (L+1)² combinations. For n words, total keys ≤ n × max(L+1)². With L ≤ 7, this is at most n × 64 = 640,000.

---

### Q6: Why does the hash map store the largest index?

**Answer:** Since we process words in order and overwrite the key each time, the last (largest) index automatically remains in the dictionary.

---

### Q7: Can you use this for Unicode characters?

**Answer:** The current approach uses '#' as separator. For Unicode, you'd need a separator that doesn't appear in the input. The algorithm works the same.

---

### Q8: What edge cases should be tested?

**Answer:**
- Empty prefix or suffix
- Empty word list (though constraints say at least 1)
- All words identical
- Single character words
- No matching prefix-suffix combination

---

## Common Pitfalls

### 1. Off-by-One in Prefix/Suffix Length
**Issue:** Not including empty prefix/suffix (length 0).

**Solution:** Use range 0 to word.length (inclusive) for both prefix and suffix.

### 2. Wrong Separator Choice
**Issue:** Using a character that might appear in words.

**Solution:** Use '#' which is not a lowercase letter.

### 3. Not Overwriting Keys
**Issue:** Using different data structure that doesn't overwrite.

**Solution:** Use dictionary/hashmap which overwrites by default.

### 4. Memory Issues
**Issue:** Storing too many combinations.

**Solution:** For very large word lists, consider the trie approach.

---

## Summary

The **Prefix and Suffix Search** problem demonstrates the power of preprocessing with combined keys:

- **Optimal Solution**: O(1) query with O(n × L²) preprocessing
- **Key Insight**: Precompute all prefix-suffix combinations
- **Storage**: Use hash map for O(1) lookup

The key insight is preprocessing all possible prefix-suffix combinations and storing them in a hash map. This makes queries O(1) at the cost of higher preprocessing time and space.

### Pattern Summary

This problem exemplifies the **Hash Map with Combined Keys** pattern, which is characterized by:
- Preprocessing all combinations
- Using separator character
- Dictionary for O(1) lookup
- Trading space for time

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/prefix-and-suffix-search/discuss/) - Community solutions
- [Trie - GeeksforGeeks](https://www.geeksforgeeks.org/trie-insert-and-search/) - Understanding tries
- [Hash Map - GeeksforGeeks](https://www.geeksforgeeks.org/hashing-data-structure/) - Hash map operations
- [Pattern: Trie - Prefix Tree](/patterns/trie-prefix-tree) - Related pattern guide
