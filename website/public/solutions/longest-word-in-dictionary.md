# Longest Word In Dictionary

## Problem Description

Given an array of strings `words` representing an English Dictionary, return the longest word in `words` that can be built one character at a time by other words in `words`.

If there is more than one possible answer, return the longest word with the smallest lexicographical order. If there is no answer, return the empty string.

Note that the word should be built from left to right with each additional character being added to the end of a previous word.

---

## Examples

**Example 1:**

**Input:** `words = ["w","wo","wor","worl","world"]`

**Output:** `"world"`

**Explanation:** The word `"world"` can be built one character at a time by `"w"`, `"wo"`, `"wor"`, and `"worl"`.

**Example 2:**

**Input:** `words = ["a","banana","app","appl","ap","apply","apple"]`

**Output:** `"apple"`

**Explanation:** Both `"apply"` and `"apple"` can be built from other words in the dictionary. However, `"apple"` is lexicographically smaller than `"apply"`.

---

## Constraints

- `1 <= words.length <= 1000`
- `1 <= words[i].length <= 30`
- `words[i]` consists of lowercase English letters.

---

## Pattern: Trie + DFS / Hash Set

This problem demonstrates the **Trie (Prefix Tree)** pattern combined with DFS. The key insight is that a word is "buildable" if all its prefixes exist in the dictionary.

### Core Concept

- **Buildable Word**: A word that can be formed by adding one character at a time from other words in the dictionary
- **Prefix Check**: For each word, all its prefixes (except the full word itself) must exist in the dictionary
- **Priority**: Longest word first, then lexicographically smallest

---

## Intuition

The key insight is understanding what makes a word "buildable":

1. **Prefix Requirement**: A word is buildable if every prefix (except the full word) exists in the dictionary
2. **Sorting Strategy**: Sort words by length (longest first) to find the answer quickly
3. **Early Termination**: Once we find a valid longest word, we can return immediately

### Alternative Views

- **Trie Approach**: Build a Trie and perform DFS to find the longest path where all nodes are valid words
- **Hash Set Approach**: Use a set for O(1) prefix lookup after sorting

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Sort + Hash Set** - Sort by length and check prefixes - O(n log n)
2. **Trie + DFS** - Build Trie and perform DFS - O(n × L)
3. **Prefix Map** - Use a hash map to track valid prefixes - O(n × L)

---

## Approach 1: Sort + Hash Set (Optimal)

### Algorithm Steps

1. Put all words in a HashSet for O(1) lookup
2. Sort words by length (descending) and lexicographical order (ascending)
3. For each word in sorted order, check if all prefixes exist in the set
4. Return the first valid word found (guaranteed to be longest with smallest lexicographical order)

### Why It Works

Sorting ensures we check the longest words first. Since we return immediately upon finding a valid word, we get the longest word with smallest lexicographical order due to the sorting key.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def longestWord(self, words: List[str]) -> str:
        """
        Find the longest word that can be built one character at a time.
        
        Args:
            words: List of words representing dictionary
            
        Returns:
            The longest buildable word, or empty string if none
        """
        # Create a set for O(1) lookup
        word_set = set(words)
        
        # Sort by length (descending), then lexicographically (ascending)
        words.sort(key=lambda x: (-len(x), x))
        
        # Check each word for buildability
        for word in words:
            valid = True
            # Check all prefixes except the full word
            for i in range(1, len(word)):
                if word[:i] not in word_set:
                    valid = False
                    break
            if valid:
                return word
        
        return ""
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <unordered_set>
#include <algorithm>

class Solution {
public:
    string longestWord(vector<string>& words) {
        // Create a set for O(1) lookup
        unordered_set<string> word_set(words.begin(), words.end());
        
        // Sort by length (descending), then lexicographically (ascending)
        sort(words.begin(), words.end(), [](const string& a, const string& b) {
            if (a.length() != b.length()) return a.length() > b.length();
            return a < b;
        });
        
        // Check each word for buildability
        for (const string& word : words) {
            bool valid = true;
            // Check all prefixes except the full word
            for (int i = 1; i < word.length(); i++) {
                if (word_set.find(word.substr(0, i)) == word_set.end()) {
                    valid = false;
                    break;
                }
            }
            if (valid) return word;
        }
        
        return "";
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public String longestWord(String[] words) {
        // Create a set for O(1) lookup
        Set<String> wordSet = new HashSet<>(Arrays.asList(words));
        
        // Sort by length (descending), then lexicographically (ascending)
        Arrays.sort(words, (a, b) -> {
            if (a.length() != b.length()) return b.length() - a.length();
            return a.compareTo(b);
        });
        
        // Check each word for buildability
        for (String word : words) {
            boolean valid = true;
            // Check all prefixes except the full word
            for (int i = 1; i < word.length(); i++) {
                if (!wordSet.contains(word.substring(0, i))) {
                    valid = false;
                    break;
                }
            }
            if (valid) return word;
        }
        
        return "";
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string[]} words
 * @return {string}
 */
var longestWord = function(words) {
    // Create a set for O(1) lookup
    const wordSet = new Set(words);
    
    // Sort by length (descending), then lexicographically (ascending)
    words.sort((a, b) => {
        if (a.length !== b.length) return b.length - a.length;
        return a.localeCompare(b);
    });
    
    // Check each word for buildability
    for (const word of words) {
        let valid = true;
        // Check all prefixes except the full word
        for (let i = 1; i < word.length; i++) {
            if (!wordSet.has(word.slice(0, i))) {
                valid = false;
                break;
            }
        }
        if (valid) return word;
    }
    
    return "";
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) for sorting + O(n × L) for checking prefixes, where L ≤ 30 |
| **Space** | O(n) for the hash set |

---

## Approach 2: Trie + DFS

### Algorithm Steps

1. Insert all words into a Trie
2. For each root-to-leaf path, track valid words (words where all prefixes exist)
3. Perform DFS to find the longest valid word
4. Return the longest valid word found

### Why It Works

The Trie naturally stores all prefixes. By performing DFS, we explore all possible paths and find the longest word where every node on the path represents a valid word.

### Code Implementation

````carousel
```python
from typing import List

class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None

class Solution:
    def longestWord(self, words: List[str]) -> str:
        """Find longest word using Trie and DFS."""
        # Build Trie
        root = TrieNode()
        for word in words:
            node = root
            for char in word:
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
            node.word = word
        
        # DFS to find longest valid word
        def dfs(node: TrieNode) -> str:
            result = node.word or ""
            for child in node.children.values():
                if child.word:  # Only explore if it's a valid word
                    candidate = dfs(child)
                    if len(candidate) > len(result) or (len(candidate) == len(result) and candidate < result):
                        result = candidate
            return result
        
        return dfs(root)
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <unordered_map>
using namespace std;

struct TrieNode {
    unordered_map<char, TrieNode*> children;
    string word = "";
};

class Solution {
private:
    TrieNode* root;
    
public:
    Solution() { root = new TrieNode(); }
    
    string longestWord(vector<string>& words) {
        // Build Trie
        for (const string& word : words) {
            TrieNode* node = root;
            for (char c : word) {
                if (node->children.find(c) == node->children.end()) {
                    node->children[c] = new TrieNode();
                }
                node = node->children[c];
            }
            node->word = word;
        }
        
        // DFS to find longest valid word
        return dfs(root);
    }
    
private:
    string dfs(TrieNode* node) {
        string result = node->word;
        for (auto& [c, child] : node->children) {
            if (child->word != "") {
                string candidate = dfs(child);
                if (candidate.length() > result.length() || 
                    (candidate.length() == result.length() && candidate < result)) {
                    result = candidate;
                }
            }
        }
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    private class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        String word = null;
    }
    
    private TrieNode root;
    
    public String longestWord(String[] words) {
        root = new TrieNode();
        
        // Build Trie
        for (String word : words) {
            TrieNode node = root;
            for (char c : word.toCharArray()) {
                node.children.putIfAbsent(c, new TrieNode());
                node = node.children.get(c);
            }
            node.word = word;
        }
        
        // DFS to find longest valid word
        return dfs(root);
    }
    
    private String dfs(TrieNode node) {
        String result = node.word;
        for (TrieNode child : node.children.values()) {
            if (child.word != null) {
                String candidate = dfs(child);
                if (candidate.length() > result.length() || 
                    (candidate.length() == result.length() && candidate.compareTo(result) < 0)) {
                    result = candidate;
                }
            }
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string[]} words
 * @return {string}
 */
var longestWord = function(words) {
    // Build Trie
    const root = {};
    for (const word of words) {
        let node = root;
        for (const char of word) {
            if (!node[char]) node[char] = {};
            node = node[char];
        }
        node.word = word;
    }
    
    // DFS to find longest valid word
    function dfs(node) {
        let result = node.word || "";
        for (const key in node) {
            if (key !== 'word' && node[key].word) {
                const candidate = dfs(node[key]);
                if (candidate.length > result.length || 
                    (candidate.length === result.length && candidate.localeCompare(result) < 0)) {
                    result = candidate;
                }
            }
        }
        return result;
    }
    
    return dfs(root);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × L) to build Trie + O(n × L) for DFS |
| **Space** | O(n × L) for Trie storage |

---

## Approach 3: Prefix Map

### Algorithm Steps

1. Group words by their length
2. Iterate from longest to shortest length
3. For each word at current length, check if all shorter prefixes exist
4. Return the first valid word found

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def longestWord(self, words: List[str]) -> str:
        """Find longest word using prefix grouping."""
        # Group words by length
        length_groups = defaultdict(list)
        for word in words:
            length_groups[len(word)].append(word)
        
        # Get all possible lengths sorted
        max_len = max(length_groups.keys())
        
        # Track valid words of each length
        valid_words = set()
        
        # Start from length 1 and build up
        for length in range(1, max_len + 1):
            current_valid = set()
            for word in length_groups[length]:
                # Check if all prefixes exist
                if length == 1 or word[:-1] in valid_words:
                    current_valid.add(word)
            
            if length == max_len and current_valid:
                return min(current_valid)  # Return lexicographically smallest
            
            valid_words.update(current_valid)
        
        return ""
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <unordered_set>
#include <algorithm>
using namespace std;

class Solution {
public:
    string longestWord(vector<string>& words) {
        unordered_set<string> valid_words;
        int max_len = 0;
        
        for (const string& word : words) {
            max_len = max(max_len, (int)word.length());
        }
        
        for (int length = 1; length <= max_len; length++) {
            vector<string> current_level;
            for (const string& word : words) {
                if (word.length() == length) {
                    current_level.push_back(word);
                }
            }
            
            for (string& word : current_level) {
                if (length == 1 || valid_words.count(word.substr(0, length - 1))) {
                    valid_words.insert(word);
                    if (length == max_len) {
                        return word;
                    }
                }
            }
        }
        
        return "";
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public String longestWord(String[] words) {
        Set<String> validWords = new HashSet<>();
        int maxLen = 0;
        
        for (String word : words) {
            maxLen = Math.max(maxLen, word.length());
        }
        
        for (int length = 1; length <= maxLen; length++) {
            List<String> currentLevel = new ArrayList<>();
            for (String word : words) {
                if (word.length() == length) {
                    currentLevel.add(word);
                }
            }
            
            Collections.sort(currentLevel);
            
            for (String word : currentLevel) {
                if (length == 1 || validWords.contains(word.substring(0, length - 1))) {
                    validWords.add(word);
                    if (length == maxLen) {
                        return word;
                    }
                }
            }
        }
        
        return "";
    }
}
```

<!-- slide -->
```javascript
var longestWord = function(words) {
    const validWords = new Set();
    const maxLen = Math.max(...words.map(w => w.length));
    
    for (let length = 1; length <= maxLen; length++) {
        const currentLevel = words.filter(w => w.length === length).sort();
        
        for (const word of currentLevel) {
            if (length === 1 || validWords.has(word.slice(0, -1))) {
                validWords.add(word);
                if (length === maxLen) {
                    return word;
                }
            }
        }
    }
    
    return "";
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × L) with sorting O(n log n) |
| **Space** | O(n) for set storage |

---

## Comparison of Approaches

| Aspect | Sort + Hash Set | Trie + DFS | Prefix Map |
|--------|-----------------|------------|------------|
| **Time Complexity** | O(n log n + nL) | O(nL) | O(nL + n log n) |
| **Space Complexity** | O(n) | O(nL) | O(n) |
| **Implementation** | Simple | Moderate | Moderate |
| **Best For** | Most cases | Memory efficient | Incremental building |

**Best Approach:** The Sort + Hash Set approach (Approach 1) is recommended for its simplicity and efficiency.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Frequently asked in technical interviews
- **Companies**: Google, Amazon, Meta, Apple
- **Difficulty**: Medium (but can be Easy with proper approach)
- **Concepts Tested**: Hash Set, Sorting, Trie, DFS

### Learning Outcomes

1. **Understanding Buildability**: Learn to check prefix requirements
2. **Sorting Strategy**: Use sorting to simplify the search
3. **Trie Application**: See how Trie helps with prefix problems
4. **Multiple Solutions**: Compare different approaches

---

## Related Problems

Based on similar themes (prefix handling, Trie, string building):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Longest Common Prefix | [Link](https://leetcode.com/problems/longest-common-prefix/) | Find common prefix among strings |
| Valid Palindrome | [Link](https://leetcode.com/problems/valid-palindrome/) | String processing with two pointers |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Replace Words | [Link](https://leetcode.com/problems/replace-words/) | Trie-based prefix replacement |
| Word Search II | [Link](https://leetcode.com/problems/word-search-ii/) | Trie with DFS for word search |
| Implement Trie | [Link](https://leetcode.com/problems/implement-trie-prefix-tree/) | Basic Trie implementation |
| Prefix and Suffix Search | [Link](https://leetcode.com/problems/prefix-and-suffix-search/) | Multiple prefix/suffix queries |

### Pattern Reference

For more detailed explanations of the Trie pattern and its variations, see:
- **[Trie Pattern](/patterns/trie)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

## Approach Tutorials

- [NeetCode - Longest Word in Dictionary](https://www.youtube.com/watch?v=4R0bX6ISkyE) - Clear explanation with examples
- [Longest Word in Dictionary - LeetCode 720](https://www.youtube.com/watch?v=6B3J5hT72Mc) - Detailed walkthrough
- [Back to Back SWE - Longest Word](https://www.youtube.com/watch?v=8gWFy6mTz8M) - Comprehensive solution

### Related Concepts

- [Trie Data Structure Explained](https://www.youtube.com/watch?v=7X2aC5jK1Go) - Understanding Trie
- [Hash Set Operations](https://www.youtube.com/watch?v=gPL5WgLteNI) - Hash set fundamentals

---

## Follow-up Questions

### Q1: What is the time and space complexity of the optimal approach?

**Answer:** Time complexity is O(n log n + n × L) where n is the number of words and L is the maximum word length. Space complexity is O(n) for the hash set.

---

### Q2: How would you modify the solution to return all longest buildable words?

**Answer:** Instead of returning immediately when finding a valid word, collect all words with the maximum length that are valid, then return them sorted lexicographically.

---

### Q3: Can you solve this using a Trie without DFS?

**Answer:** Yes, you can perform a BFS (level-order traversal) starting from the root, only exploring children that represent valid words. Track the maximum depth reached and collect all words at that depth.

---

### Q4: What if you need to handle uppercase letters or special characters?

**Answer:** Convert all words to lowercase before processing and use the same character set consistently. For special characters, adjust the Trie children storage accordingly.

---

### Q5: How would you optimize memory usage for very large dictionaries?

**Answer:** Use a compressed Trie or consider the hash set approach. You could also implement lazy loading of Trie nodes only when needed.

---

### Q6: What edge cases should be tested?

**Answer:**
- Empty dictionary
- Single word in dictionary
- Words with no valid prefixes (like "a")
- All words of the same length
- Words that are prefixes of each other
- Duplicate words in input

---

### Q7: How would you handle the case where multiple words have the same length?

**Answer:** The sorting key `(-len(x), x)` ensures that among words of the same length, the lexicographically smallest one comes first, satisfying the requirement.

---

### Q8: What is the difference between using a Trie vs Hash Set?

**Answer:** Trie provides O(L) prefix lookup and naturally stores all prefixes. Hash Set requires checking each prefix individually but is simpler to implement. Trie uses more memory but can be more efficient for prefix-heavy operations.

---

## Common Pitfalls

### 1. Not Checking All Prefixes
**Issue**: Forgetting to check that ALL prefixes (not just the immediate predecessor) exist.

**Solution**: Iterate through all prefixes from position 1 to len(word)-1.

### 2. Incorrect Sorting
**Issue**: Not sorting by length descending, which can miss the longest word.

**Solution**: Use `sort(key=lambda x: (-len(x), x))` for proper ordering.

### 3. Empty String Handling
**Issue**: Not returning empty string when no valid word exists.

**Solution**: Always have a fallback return value of "".

### 4. Time Limit Exceeded
**Issue**: Using inefficient string slicing in loops.

**Solution**: The current approach is optimal, but ensure you're not re-checking prefixes unnecessarily.

---

## Summary

The **Longest Word in Dictionary** problem demonstrates several important concepts:

- **Prefix Checking**: Validating that all prefixes exist in the dictionary
- **Sorting Strategy**: Using length and lexicographical order to simplify the search
- **Multiple Approaches**: Hash Set, Trie + DFS, and Prefix Map
- **Optimal Solution**: Sort + Hash Set provides the best balance of simplicity and efficiency

Key takeaways:
1. Sort words by length (descending) to find longest first
2. Use a Hash Set for O(1) prefix lookup
3. Check all prefixes for each word
4. Return immediately upon finding the first valid word

This problem is excellent for understanding prefix-based validation and different data structure choices.

### Pattern Summary

This problem exemplifies the **Prefix Validation** pattern, which is characterized by:
- Checking that all prefixes of a word exist
- Using Hash Set or Trie for prefix lookup
- Sorting to simplify the search process
- Achieving O(n log n) or O(nL) time complexity

For more details on this pattern and its variations, see the **[Trie Pattern](/patterns/trie)** and **[Hash Set Pattern](/patterns/hash-set)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/longest-word-in-dictionary/discuss/) - Community solutions
- [Trie - GeeksforGeeks](https://www.geeksforgeeks.org/trie-insert-and-search/) - Trie implementation
- [Hash Set - GeeksforGeeks](https://www.geeksforgeeks.org/hash-set-in-java/) - Hash Set operations
- [Pattern: Trie](/patterns/trie) - Comprehensive pattern guide
- [Pattern: Hash Set](/patterns/hash-set) - Hash Set pattern guide
