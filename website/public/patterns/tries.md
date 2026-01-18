# Tries

## Overview

The Tries pattern is used to solve problems involving string prefixes, autocomplete, and word search. A trie (prefix tree) is a tree-like data structure where each node represents a character, and paths from root to nodes represent strings or prefixes. This pattern allows for efficient prefix-based operations.

## Key Concepts

- **Trie Structure**: Tree where each node has 26 children (for lowercase letters) and a boolean flag indicating end of word.
- **Insert Operation**: Add a string to the trie by traversing and creating nodes as needed.
- **Search Operation**: Check if a string exists in the trie.
- **Prefix Search**: Check if any string in the trie starts with a given prefix.

## Template

```python
class TrieNode:
    def __init__(self):
        self.children = [None] * 26
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = self.get_node()
    
    def get_node(self):
        return TrieNode()
    
    def _char_to_index(self, ch):
        return ord(ch) - ord('a')
    
    def insert(self, key):
        p_crawl = self.root
        length = len(key)
        
        for level in range(length):
            index = self._char_to_index(key[level])
            if not p_crawl.children[index]:
                p_crawl.children[index] = self.get_node()
            p_crawl = p_crawl.children[index]
        
        p_crawl.is_end_of_word = True
    
    def search(self, key):
        p_crawl = self.root
        length = len(key)
        
        for level in range(length):
            index = self._char_to_index(key[level])
            if not p_crawl.children[index]:
                return False
            p_crawl = p_crawl.children[index]
        
        return p_crawl.is_end_of_word
    
    def starts_with(self, prefix):
        p_crawl = self.root
        length = len(prefix)
        
        for level in range(length):
            index = self._char_to_index(prefix[level])
            if not p_crawl.children[index]:
                return False
            p_crawl = p_crawl.children[index]
        
        return True
```

## Example Problems

1. **Implement Trie (Prefix Tree) (LeetCode 208)**: Implement trie data structure.
2. **Add and Search Word (LeetCode 211)**: Add words and search with wildcard characters.
3. **Word Search II (LeetCode 212)**: Find all words from a list in a grid.
4. **Prefix and Suffix Search (LeetCode 745)**: Search for words with specific prefix and suffix.

## Time and Space Complexity

- **Insert/Search/Starts With**: O(m) time, where m is the length of the key.
- **Space Complexity**: O(n * m), where n is the number of words and m is average word length.

## Common Pitfalls

- **Not handling case sensitivity**: Assuming all characters are lowercase without checking.
- **Memory efficiency issues**: Using large arrays for children (e.g., 26 characters) when not needed.
- **Forgetting to mark end of word**: Causes search to return false positives.
- **Not handling empty string**: Trivial case needs special handling.
- **Incorrect character to index conversion**: Off-by-one errors in ASCII value subtraction.
