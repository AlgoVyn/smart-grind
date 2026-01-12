# Tries

## Overview

A Trie (also known as a prefix tree) is a tree-like data structure that stores a dynamic set of strings, where each node represents a common prefix. Tries are particularly efficient for operations involving prefixes, such as autocomplete, spell checking, and IP routing. The key advantage of a trie is that it allows for fast retrieval of strings that share common prefixes, making it ideal for dictionary-like operations.

When to use this pattern:
- When you need to store and search a large set of strings efficiently
- For autocomplete functionality where prefix matching is required
- In scenarios involving word validation, spell checking, or finding words with common prefixes
- When implementing routing tables or dictionaries with prefix-based lookups

Benefits:
- Fast prefix searches (O(m) time where m is string length)
- Space-efficient for storing strings with common prefixes
- Supports ordered traversal of stored strings
- Enables efficient implementation of autocomplete and spell-checking features

## Key Concepts

- **Root Node**: The starting point of the trie, representing an empty string
- **Child Nodes**: Each node can have multiple children, one for each possible character
- **End of Word Marker**: A flag or special marker to indicate the end of a complete word
- **Prefix Sharing**: Nodes are shared among words that have common prefixes, reducing redundancy
- **Traversal**: Moving through the trie character by character to perform operations
- **Compression**: In some implementations, tries can be compressed to save space (Patricia trees)

## Template

```python
class TrieNode:
    """
    A node in the Trie data structure.
    Each node contains a dictionary of children and a flag for end of word.
    """
    
    def __init__(self):
        """
        Initialize a TrieNode.
        children: dictionary mapping characters to child nodes
        is_end_of_word: boolean indicating if this node marks the end of a word
        """
        self.children = {}
        self.is_end_of_word = False

class Trie:
    """
    Trie data structure for efficient string operations.
    """
    
    def __init__(self):
        """
        Initialize the Trie with a root node.
        """
        self.root = TrieNode()
    
    def insert(self, word):
        """
        Insert a word into the Trie.
        Time complexity: O(m) where m is the length of the word.
        """
        node = self.root
        for char in word:
            # If the character doesn't exist, create a new node
            if char not in node.children:
                node.children[char] = TrieNode()
            # Move to the next node
            node = node.children[char]
        # Mark the end of the word
        node.is_end_of_word = True
    
    def search(self, word):
        """
        Search for a complete word in the Trie.
        Returns True if the word exists, False otherwise.
        Time complexity: O(m) where m is the length of the word.
        """
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        # Check if this is the end of a word
        return node.is_end_of_word
    
    def starts_with(self, prefix):
        """
        Check if any word in the Trie starts with the given prefix.
        Returns True if such a word exists, False otherwise.
        Time complexity: O(m) where m is the length of the prefix.
        """
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True
    
    def get_words_with_prefix(self, prefix):
        """
        Get all words in the Trie that start with the given prefix.
        This is useful for autocomplete functionality.
        Time complexity: O(N) where N is the number of nodes in the subtree.
        """
        def dfs(node, current_word, result):
            if node.is_end_of_word:
                result.append(current_word)
            for char, child_node in node.children.items():
                dfs(child_node, current_word + char, result)
        
        node = self.root
        for char in prefix:
            if char not in node.children:
                return []
            node = node.children[char]
        
        result = []
        dfs(node, prefix, result)
        return result

# Usage example
trie = Trie()
trie.insert("apple")
trie.insert("app")
trie.insert("application")

print(trie.search("app"))  # True
print(trie.search("apple"))  # True
print(trie.search("appl"))  # False
print(trie.starts_with("app"))  # True
print(trie.get_words_with_prefix("app"))  # ["app", "apple", "application"]
```

## Example Problems

1. **Word Search II**: Given a 2D board and a list of words, find all words on the board. Tries are used to efficiently store and search for words during the DFS traversal of the board.

2. **Implement Trie (Prefix Tree)**: Design a data structure that supports insert, search, and startsWith operations. This is the fundamental trie implementation problem.

3. **Replace Words**: Given a dictionary of root words and a sentence, replace words in the sentence with their shortest root equivalent. Tries enable efficient prefix matching to find the shortest root for each word.

## Time and Space Complexity

- **Time Complexity**:
  - Insert: O(m), where m is the length of the word being inserted
  - Search: O(m), where m is the length of the word being searched
  - Starts with: O(m), where m is the length of the prefix
  - Get words with prefix: O(N), where N is the number of nodes in the subtree rooted at the prefix node

- **Space Complexity**: O(N), where N is the total number of characters stored across all words. Space is optimized because common prefixes are shared among words. In the worst case (no common prefixes), it could be O(N * M) where M is the average word length.

Note: The space complexity can be improved using compressed tries (Patricia trees), but this increases implementation complexity.

## Common Pitfalls

- **Memory Usage**: Tries can consume significant memory for large datasets, especially with sparse character sets. Consider using compressed tries for memory optimization.
- **Case Sensitivity**: Ensure consistent handling of uppercase/lowercase characters, or normalize input to avoid mismatches.
- **Unicode Support**: Be careful with Unicode characters; ensure the implementation handles multi-byte characters correctly.
- **Empty Strings**: Handle insertion and search of empty strings appropriately, as they may cause issues with root node logic.
- **Deletion**: Implementing deletion can be complex, especially when nodes are shared. Ensure proper cleanup to avoid memory leaks.
- **Thread Safety**: If the trie is accessed concurrently, implement proper synchronization mechanisms.
- **Performance with Large Alphabets**: For alphabets with many characters (like Unicode), consider using maps instead of arrays for children to avoid wasted space.