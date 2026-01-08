# Word Squares

## Problem Description
[Link to problem](https://leetcode.com/problems/word-squares/)

## Solution

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

## Explanation
This problem finds all word squares from a list of words using backtracking and a trie for efficient prefix searches.

### Step-by-Step Approach:
1. **Build Trie:**
   - Insert all words into a trie where each node stores words passing through it.

2. **Backtracking:**
   - Start with each word as the first row.
   - For each step, build prefix from current column and find candidates.
   - Recurse until square is complete.

3. **Collect Results:**
   - When square has n rows, add to result.

### Time Complexity:
- O(n * m^2), where n is number of words, m is word length, due to backtracking and trie searches.

### Space Complexity:
- O(n * m), for trie and recursion stack.
