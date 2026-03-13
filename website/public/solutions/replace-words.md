# Replace Words

## Problem Description

In English, we have a concept called root, which can be followed by some other word to form another longer word - let's call this word derivative. For example, when the root "help" is followed by the word "ful", we can form a derivative "helpful".

Given a dictionary consisting of many roots and a sentence consisting of words separated by spaces, replace all the derivatives in the sentence with the root forming it. If a derivative can be replaced by more than one root, replace it with the root that has the shortest length.

Return the sentence after the replacement.

**LeetCode Link:** [LeetCode 648 - Replace Words](https://leetcode.com/problems/replace-words/)

---

## Examples

### Example 1

**Input:**
```python
dictionary = ["cat", "bat", "rat"]
sentence = "the cattle was rattled by the battery"
```

**Output:**
```python
"the cat was rat by the bat"
```

### Example 2

**Input:**
```python
dictionary = ["a", "b", "c"]
sentence = "aadsfasf absbs bbab cadsfafs"
```

**Output:**
```python
"a a b c"
```

---

## Constraints

- `1 <= dictionary.length <= 1000`
- `1 <= dictionary[i].length <= 100`
- `dictionary[i]` consists of only lower-case letters.
- `1 <= sentence.length <= 10^6`
- `sentence` consists of only lower-case letters and spaces.
- The number of words in `sentence` is in the range `[1, 1000]`.
- The length of each word in `sentence` is in the range `[1, 1000]`.
- Every two consecutive words in `sentence` will be separated by exactly one space.
- `sentence` does not have leading or trailing spaces.

---

## Pattern: Trie or Prefix Checking

This problem uses **Trie** or simple **Prefix Checking**. Build trie from dictionary for efficient prefix lookup, or iterate roots checking startswith.

---

## Intuition

The key insight for this problem is finding the **shortest root** that is a prefix of each word:

> For each word in the sentence, find the shortest root from the dictionary that the word starts with.

### Key Observations

1. **Shortest Root**: When multiple roots match, we must use the shortest one to satisfy the problem requirement.

2. **Prefix Matching**: We only care if a root is a prefix of the word, not the full word.

3. **No Replacement**: If no root matches, keep the original word unchanged.

4. **Efficiency**: With large sentence and dictionary, we need efficient prefix lookup. A **Trie** provides O(L) lookup where L is the word length.

### Algorithm Overview

**Approach 1: Set-based (Simple)**
1. Put all dictionary roots in a set
2. For each word, check all possible prefixes
3. Find the shortest matching prefix

**Approach 2: Trie (Optimal)**
1. Build a Trie from dictionary roots
2. For each word, traverse the Trie
3. If we hit a word-end marker, use that root
4. Otherwise, keep the original word

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Set-based Prefix Check** - Simple approach
2. **Trie-based** - Optimal for large inputs

---

## Approach 1: Set-based Prefix Check

### Algorithm Steps

1. Add all dictionary roots to a set
2. For each word in sentence:
   - Check all possible prefixes from length 1 to word length
   - Find the shortest prefix that exists in the set
   - If found, replace; otherwise keep original word
3. Join and return result

### Why It Works

The approach directly implements the problem definition: find the shortest root that is a prefix of the word.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def replaceWords(self, dictionary: List[str], sentence: str) -> str:
        """
        Replace words with shortest root using set lookup.
        
        Args:
            dictionary: List of root words
            sentence: Input sentence
            
        Returns:
            Sentence with words replaced by roots
        """
        # Add all roots to a set for O(1) lookup
        roots = set(dictionary)
        
        # Split sentence into words
        words = sentence.split()
        result = []
        
        for word in words:
            replacement = word
            # Check all possible prefixes
            for i in range(1, len(word) + 1):
                prefix = word[:i]
                if prefix in roots:
                    replacement = prefix
                    break  # Found shortest root
            result.append(replacement)
        
        return ' '.join(result)
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_set>
using namespace std;

class Solution {
public:
    string replaceWords(vector<string>& dictionary, string sentence) {
        unordered_set<string> roots(dictionary.begin(), dictionary.end());
        
        string result = "";
        string word = "";
        int n = sentence.length();
        
        for (int i = 0; i <= n; i++) {
            if (i < n && sentence[i] != ' ') {
                word += sentence[i];
            } else {
                // Process word
                string replacement = word;
                for (int j = 1; j <= word.length(); j++) {
                    string prefix = word.substr(0, j);
                    if (roots.find(prefix) != roots.end()) {
                        replacement = prefix;
                        break;
                    }
                }
                result += replacement;
                if (i < n) result += ' ';
                word = "";
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String replaceWords(List<String> dictionary, String sentence) {
        Set<String> roots = new HashSet<>(dictionary);
        
        StringBuilder result = new StringBuilder();
        String[] words = sentence.split(" ");
        
        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            String replacement = word;
            
            for (int j = 1; j <= word.length(); j++) {
                String prefix = word.substring(0, j);
                if (roots.contains(prefix)) {
                    replacement = prefix;
                    break;
                }
            }
            
            result.append(replacement);
            if (i < words.length - 1) result.append(" ");
        }
        
        return result.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string[]} dictionary
 * @param {string} sentence
 * @return {string}
 */
var replaceWords = function(dictionary, sentence) {
    const roots = new Set(dictionary);
    
    const words = sentence.split(' ');
    const result = [];
    
    for (const word of words) {
        let replacement = word;
        
        for (let i = 1; i <= word.length; i++) {
            const prefix = word.substring(0, i);
            if (roots.has(prefix)) {
                replacement = prefix;
                break;
            }
        }
        
        result.push(replacement);
    }
    
    return result.join(' ');
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(S × L) where S is sentence length, L is max word length |
| **Space** | O(D) for the set |

---

## Approach 2: Trie-based (Optimal)

### Algorithm Steps

1. Build a Trie from dictionary roots
2. For each word, traverse the Trie character by character
3. If we encounter a word-end node, use that root
4. If we reach a node without children, keep original word

### Why It Works

The Trie provides O(L) lookup per word, making it optimal for large inputs. We also automatically get the shortest matching prefix.

### Code Implementation

````carousel
```python
from typing import List

class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def find_root(self, word: str) -> str:
        """Find shortest root that is a prefix of word."""
        node = self.root
        root = []
        
        for char in word:
            if char not in node.children:
                break
            node = node.children[char]
            root.append(char)
            if node.is_end:
                return ''.join(root)
        
        return word  # No root found, return original


class Solution:
    def replaceWords(self, dictionary: List[str], sentence: str) -> str:
        # Build Trie
        trie = Trie()
        for root in dictionary:
            trie.insert(root)
        
        # Process each word
        words = sentence.split()
        result = [trie.find_root(word) for word in words]
        
        return ' '.join(result)
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
using namespace std;

struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool is_end = false;
};

class Trie {
public:
    TrieNode* root;
    
    Trie() {
        root = new TrieNode();
    }
    
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c)) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->is_end = true;
    }
    
    string findRoot(string word) {
        TrieNode* node = root;
        string prefix = "";
        
        for (char c : word) {
            if (!node->children.count(c)) break;
            node = node->children[c];
            prefix += c;
            if (node->is_end) return prefix;
        }
        
        return word;
    }
};

class Solution {
public:
    string replaceWords(vector<string>& dictionary, string sentence) {
        Trie trie;
        for (string root : dictionary) {
            trie.insert(root);
        }
        
        string result = "";
        string word = "";
        for (char c : sentence) {
            if (c == ' ') {
                result += trie.findRoot(word) + " ";
                word = "";
            } else {
                word += c;
            }
        }
        result += trie.findRoot(word);
        
        return result;
    }
};
```

<!-- slide -->
```java
class TrieNode {
    Map<Character, TrieNode> children;
    boolean is_end;
    
    TrieNode() {
        children = new HashMap<>();
        is_end = false;
    }
}

class Trie {
    TrieNode root;
    
    Trie() {
        root = new TrieNode();
    }
    
    void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node.children.putIfAbsent(c, new TrieNode());
            node = node.children.get(c);
        }
        node.is_end = true;
    }
    
    String findRoot(String word) {
        TrieNode node = root;
        StringBuilder prefix = new StringBuilder();
        
        for (char c : word.toCharArray()) {
            if (!node.children.containsKey(c)) break;
            node = node.children.get(c);
            prefix.append(c);
            if (node.is_end) return prefix.toString();
        }
        
        return word;
    }
}

class Solution {
    public String replaceWords(List<String> dictionary, String sentence) {
        Trie trie = new Trie();
        for (String root : dictionary) {
            trie.insert(root);
        }
        
        StringBuilder result = new StringBuilder();
        String[] words = sentence.split(" ");
        
        for (int i = 0; i < words.length; i++) {
            result.append(trie.findRoot(words[i]));
            if (i < words.length - 1) result.append(" ");
        }
        
        return result.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string[]} dictionary
 * @param {string} sentence
 * @return {string}
 */
var replaceWords = function(dictionary, sentence) {
    // Build Trie
    const trie = {};
    
    for (const word of dictionary) {
        let node = trie;
        for (const char of word) {
            if (!node[char]) node[char] = {};
            node = node[char];
        }
        node.isEnd = true;
    }
    
    function findRoot(word) {
        let node = trie;
        let prefix = '';
        
        for (const char of word) {
            if (!node[char]) break;
            prefix += char;
            node = node[char];
            if (node.isEnd) return prefix;
        }
        
        return word;
    }
    
    const words = sentence.split(' ');
    const result = words.map(word => findRoot(word));
    
    return result.join(' ');
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(D + S × L) - building Trie + processing sentence |
| **Space** | O(D × L) for Trie storage |

---

## Comparison of Approaches

| Aspect | Set-based | Trie-based |
|--------|-----------|------------|
| **Time Complexity** | O(S × L²) | O(D + S × L) |
| **Space Complexity** | O(D) | O(D × L) |
| **Implementation** | Simple | More complex |
| **Best For** | Small inputs | Large inputs |

**Best Approach:** Use Trie for optimal performance, especially with large inputs.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Amazon
- **Difficulty**: Medium
- **Concepts Tested**: Trie, Prefix Matching, String Manipulation

### Learning Outcomes

1. **Trie Mastery**: Learn to implement and use Trie data structure
2. **Prefix Matching**: Understand how to efficiently find prefixes
3. **Optimization**: Learn when to use Trie vs simpler approaches

---

## Related Problems

Based on similar themes (Trie, Prefix):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Implement Trie | [Link](https://leetcode.com/problems/implement-trie-prefix-tree/) | Trie implementation |
| Longest Common Prefix | [Link](https://leetcode.com/problems/longest-common-prefix/) | Find common prefix |
| Word Search | [Link](https://leetcode.com/problems/word-search/) | Grid search |

### Pattern Reference

For more details on the Trie pattern, see:
- **[Trie Pattern](/patterns/trie)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Replace Words](https://www.youtube.com/watch?v=example)** - Clear explanation
2. **[Trie Explained](https://www.youtube.com/watch?v=example)** - Understanding Trie
3. **[LeetCode 648 Solution](https://www.youtube.com/watch?v=example)** - Full solution

---

## Follow-up Questions

### Q1: How would you modify to return the longest matching root?

**Answer:** Change the logic to keep searching for longer matches instead of breaking early.

---

### Q2: What if dictionary is very large (millions of words)?

**Answer:** Consider using a hash-based approach or a compressed Trie.

---

### Q3: How would you handle case-insensitive matching?

**Answer:** Convert all words and dictionary to lowercase before processing.

---

## Common Pitfalls

### 1. Shortest Root
**Issue**: Not finding the shortest root when multiple match.

**Solution**: Break early once a match is found, or track minimum length.

### 2. No Replacement
**Issue**: Not handling the case where no root matches.

**Solution**: Keep the original word unchanged.

### 3. Space in Result
**Issue**: Using double spaces when joining.

**Solution**: Use `' '.join(result)` or single space explicitly.

---

## Summary

The **Replace Words** problem demonstrates the power of **Trie** for prefix-based operations.

Key takeaways:
1. Find shortest root that is a prefix of each word
2. Use Trie for efficient prefix lookup
3. Keep original word if no root matches

This problem is essential for understanding Trie applications in string processing.

### Pattern Summary

This problem exemplifies the **Trie** pattern, characterized by:
- Efficient prefix matching
- O(L) lookup per word
- Building a prefix tree from dictionary

For more details on this pattern, see the **[Trie Pattern](/patterns/trie)**.

---

## Additional Resources

- [LeetCode Problem 648](https://leetcode.com/problems/replace-words/) - Official problem page
- [Trie - GeeksforGeeks](https://www.geeksforgeeks.org/trie-insert-and-search/) - Detailed explanation
- [Pattern: Trie](/patterns/trie) - Comprehensive pattern guide
