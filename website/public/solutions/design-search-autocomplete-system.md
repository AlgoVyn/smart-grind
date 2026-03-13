# Design Search Autocomplete System

## Problem Description

Design a search autocomplete system that returns the top 3 hot sentences for each query character.

When a character is typed, the system should return up to 3 sentences that have the prefix formed by all characters typed so far, sorted by their frequency (descending). If two sentences have the same frequency, they should be sorted lexicographically (ascending).

When the character '#' is typed, it indicates the end of a sentence. The sentence should be added to the autocomplete system with a frequency count of 1.

Implement the following methods:
- `AutocompleteSystem(sentences: List[str], times: List[int])`: Initialize the system with given sentences and their initial frequencies.
- `input(c: str) -> List[str]`: Input the next character c and return the top 3 hot sentences.

**Link to problem:** [Design Search Autocomplete System - LeetCode 642](https://leetcode.com/problems/design-search-autocomplete-system/)

---

## Pattern: Trie + Priority Queue

This problem demonstrates the **Trie** pattern combined with **Priority Queue** for ranking results.

### Core Concept

- **Trie**: Store sentences character by character for efficient prefix matching
- **Priority Queue**: Rank results by frequency and lexicographical order
- **Dynamic Updates**: Add new sentences when '#' is typed

---

## Examples

### Example

**Input:**
```
["AutocompleteSystem", "input", "input", "input", "input", "input", "input"]
[["i love you", "island", "iroman"], [5, 3, 2]]
```

After initialization, the system stores:
- "i love you": 5 times
- "island": 3 times
- "iroman": 2 times

**Input:** 'i'
**Output:** ["i love you", "island", "iroman"]
**Explanation:** All three sentences start with 'i'.

---

## Constraints

- `1 <= sentences.length <= 100`
- `1 <= sentences[i].length <= 100`
- `1 <= times.length == sentences.length`
- `1 <= times[i] <= 10^3`

---

## Intuition

The key is to:
1. Build a Trie with all sentences, storing frequency at each node
2. For each input character, traverse the Trie to find matching sentences
3. Sort and return top 3 results

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Trie + Priority Queue (Optimal)** - O(L + M log M) per query
2. **Simple HashMap Approach** - O(L × N) per query, simpler but less efficient

---

## Approach 1: Trie + Priority Queue (Optimal)

---

## Approach: Trie + Priority Queue (Optimal)

This is the standard and most efficient approach.

### Algorithm Steps

1. Build a Trie where each node stores:
   - Children (character -> TrieNode)
   - Sentences dictionary (sentence -> frequency)
2. For input character:
   - If '#': add current sentence to Trie with frequency +1
   - Otherwise: traverse Trie to current prefix
   - Collect all sentences under current node
   - Sort by (-frequency, sentence) and return top 3

### Code Implementation

````carousel
```python
import heapq
from typing import List

class TrieNode:
    def __init__(self):
        self.children = {}
        self.sentences = {}  # sentence -> count

class AutocompleteSystem:

    def __init__(self, sentences: List[str], times: List[int]):
        self.root = TrieNode()
        self.current = ""
        self.node = self.root
        for s, t in zip(sentences, times):
            self._insert(s, t)

    def _insert(self, sentence: str, times: int):
        node = self.root
        for char in sentence:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.sentences[sentence] = node.sentences.get(sentence, 0) + times

    def input(self, c: str) -> List[str]:
        if c == '#':
            self._insert(self.current, 1)
            self.current = ""
            self.node = self.root
            return []
        self.current += c
        if c not in self.node.children:
            self.node = TrieNode()  # dummy node
            return []
        self.node = self.node.children[c]
        # Get all sentences under this node
        candidates = []
        self._collect(self.node, self.current, candidates)
        # Sort by times desc, then lex asc
        candidates.sort(key=lambda x: (-x[1], x[0]))
        return [s for s, _ in candidates[:3]]

    def _collect(self, node: TrieNode, prefix: str, candidates: List):
        for s, count in node.sentences.items():
            candidates.append((s, count))
        for char, child in node.children.items():
            self._collect(child, prefix + char, candidates)
```

<!-- slide -->
```cpp
struct TrieNode {
    unordered_map<char, TrieNode*> children;
    unordered_map<string, int> sentences;
};

class AutocompleteSystem {
private:
    TrieNode* root;
    string current;
    TrieNode* node;
    
public:
    AutocompleteSystem(vector<string> sentences, vector<int> times) {
        root = new TrieNode();
        current = "";
        node = root;
        
        for (int i = 0; i < sentences.size(); i++) {
            insert(sentences[i], times[i]);
        }
    }
    
    void insert(string sentence, int times) {
        TrieNode* curr = root;
        for (char c : sentence) {
            if (!curr->children[c]) {
                curr->children[c] = new TrieNode();
            }
            curr = curr->children[c];
            curr->sentences[sentence] += times;
        }
    }
    
    vector<string> input(char c) {
        if (c == '#') {
            insert(current, 1);
            current = "";
            node = root;
            return {};
        }
        
        current += c;
        if (!node->children[c]) {
            node = new TrieNode();
            return {};
        }
        
        node = node->children[c];
        
        // Collect all sentences
        vector<pair<string, int>> candidates;
        collect(node, current, candidates);
        
        // Sort by frequency desc, then lexicographically asc
        sort(candidates.begin(), candidates.end(), 
             [](const pair<string,int>& a, const pair<string,int>& b) {
                 if (a.second != b.second) return a.second > b.second;
                 return a.first < b.first;
             });
        
        vector<string> result;
        for (int i = 0; i < min(3, (int)candidates.size()); i++) {
            result.push_back(candidates[i].first);
        }
        return result;
    }
    
    void collect(TrieNode* n, string prefix, vector<pair<string,int>>& candidates) {
        for (auto& p : n->sentences) {
            candidates.push_back(p);
        }
        for (auto& child : n->children) {
            collect(child.second, prefix + child.first, candidates);
        }
    }
};
```

<!-- slide -->
```java
class AutocompleteSystem {
    class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        Map<String, Integer> sentences = new HashMap<>();
    }
    
    TrieNode root;
    StringBuilder current;
    TrieNode node;
    
    public AutocompleteSystem(String[] sentences, int[] times) {
        root = new TrieNode();
        current = new StringBuilder();
        node = root;
        
        for (int i = 0; i < sentences.length; i++) {
            insert(sentences[i], times[i]);
        }
    }
    
    private void insert(String sentence, int times) {
        TrieNode curr = root;
        for (char c : sentence.toCharArray()) {
            curr.children.putIfAbsent(c, new TrieNode());
            curr = curr.children.get(c);
            curr.sentences.merge(sentence, times, Integer::sum);
        }
    }
    
    public List<String> input(char c) {
        if (c == '#') {
            insert(current.toString(), 1);
            current = new StringBuilder();
            node = root;
            return new ArrayList<>();
        }
        
        current.append(c);
        if (!node.children.containsKey(c)) {
            node = new TrieNode();
            return new ArrayList<>();
        }
        
        node = node.children.get(c);
        
        // Collect candidates
        List<Map.Entry<String, Integer>> candidates = new ArrayList<>(node.sentences.entrySet());
        
        // Sort by frequency desc, then lexicographically asc
        candidates.sort((a, b) -> {
            int freqCompare = b.getValue().compareTo(a.getValue());
            if (freqCompare != 0) return freqCompare;
            return a.getKey().compareTo(b.getKey());
        });
        
        List<String> result = new ArrayList<>();
        for (int i = 0; i < Math.min(3, candidates.size()); i++) {
            result.add(candidates.get(i).getKey());
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
var AutocompleteSystem = function(sentences, times) {
    this.root = {};
    this.current = "";
    this.node = this.root;
    
    for (let i = 0; i < sentences.length; i++) {
        this.insert(sentences[i], times[i]);
    }
};

AutocompleteSystem.prototype.insert = function(sentence, times) {
    let node = this.root;
    for (const char of sentence) {
        if (!node[char]) node[char] = {};
        node = node[char];
        node[sentence] = (node[sentence] || 0) + times;
    }
};

AutocompleteSystem.prototype.input = function(c) {
    if (c === '#') {
        this.insert(this.current, 1);
        this.current = "";
        this.node = this.root;
        return [];
    }
    
    this.current += c;
    if (!this.node[c]) {
        this.node = { '#': true };  // dummy
        return [];
    }
    
    this.node = this.node[c];
    
    // Collect candidates
    const candidates = [];
    this.collect(this.node, this.current, candidates);
    
    // Sort by frequency desc, then lex asc
    candidates.sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0]);
    });
    
    return candidates.slice(0, 3).map(c => c[0]);
};

AutocompleteSystem.prototype.collect = function(node, prefix, candidates) {
    for (const key in node) {
        if (key === '#') continue;
        if (typeof node[key] === 'number') {
            candidates.push([prefix + key, node[key]]);
        } else {
            this.collect(node[key], prefix + key, candidates);
        }
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(L + M log M) where L is query length, M is number of matching sentences |
| **Space** | O(N × L) for the Trie |

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Implement Trie | [Link](https://leetcode.com/problems/implement-trie-prefix-tree/) | Basic Trie implementation |
| Top K Frequent Words | [Link](https://leetcode.com/problems/top-k-frequent-words/) | Similar ranking problem |
| Word Filter | [Link](https://leetcode.com/problems/prefix-and-suffix-search/) | Trie with prefix and suffix |

---

## Video Tutorial Links

- [NeetCode - Design Search Autocomplete System](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation
- [Trie Data Structure](https://www.youtube.com/watch?v=7C_f7fD2p14) - Understanding tries

---

## Follow-up Questions

### Q1: How would you handle case sensitivity?

**Answer:** Normalize all sentences to lowercase during insertion and querying.

### Q2: What if you need to support fuzzy matching?

**Answer:** Use edit distance or Trie with wildcard support.

### Q3: How would you handle very large datasets?

**Answer:** Consider using caching, limiting search depth, or using a more compact data structure.

---

## Common Pitfalls

### 1. Memory Usage
**Issue**: Trie can use a lot of memory for large datasets.
**Solution**: Consider using a compressed Trie or hash map for less frequent prefixes.

### 2. Sorting on Every Input
**Issue**: Sorting all candidates on each keystroke is expensive.
**Solution**: Use a min-heap of size 3 to maintain top 3 results efficiently.

### 3. Missing Prefix Handling
**Issue**: Not handling cases where no sentences match the prefix.
**Solution**: Return empty list when prefix doesn't exist in Trie.

### 4. Sentence Frequency Updates
**Issue**: Not updating frequency correctly when '#' is typed.
**Solution**: Increment frequency by 1 for new sentences or existing ones.

---

## Summary

The **Design Search Autocomplete System** problem demonstrates the **Trie + Priority Queue** pattern:
- Use Trie for efficient prefix matching
- Store sentence frequencies at each node
- Sort and return top 3 results per query
- Handle new sentence insertions with '#'

This is a classic system design problem that appears in real-world applications like search engines and messaging apps.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/design-search-autocomplete-system/discuss/)
- [Trie - GeeksforGeeks](https://www.geeksforgeeks.org/trie-insert-and-search/)
