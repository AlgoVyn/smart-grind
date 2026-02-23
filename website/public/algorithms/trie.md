# Trie (Prefix Tree)

## Category
Trees & BSTs

## Description
Efficient data structure for string storage and prefix-based searches.

---

## Algorithm Explanation
A Trie (pronounced "try"), also known as a Prefix Tree, is a tree data structure used for efficient string operations. It excels at prefix-based searches and is commonly used for autocomplete, spell checking, and IP routing.

### Key Concepts:
- **Nodes**: Each node represents a character/prefix
- **Edges**: Represent characters connecting nodes
- **Root**: Empty string/prefix
- **Word End Marker**: Flag to indicate complete word
- **O(m) Operations**: Where m is the length of the key

### Operations:
1. **Insert**: Traverse/create nodes for each character, mark end
2. **Search**: Traverse nodes for each character, check end flag
3. **Prefix Search**: Traverse nodes, return true if path exists
4. **Delete**: Recursive removal of nodes (if no other words use them)

### Space Optimization:
- Use dictionary for children (sparse alphabet)
- Can compress paths (radix trie) for space efficiency

## When to Use
Use this algorithm when you need to solve problems involving:
- trees & bsts related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Implementation

```python
from typing import Dict, List, Optional

class TrieNode:
    def __init__(self):
        self.children: Dict[str, 'TrieNode'] = {}
        self.is_end: bool = False
        self.word: str = ""


class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        """
        Insert a word into the trie.
        
        Args:
            word: Word to insert
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


# Example usage
if __name__ == "__main__":
    trie = Trie()
    
    words = ["apple", "app", "application", "apply", "banana", "band", "bandana"]
    for word in words:
        trie.insert(word)
    
    print("Words inserted:", words)
    print()
    print("Search 'app':", trie.search("app"))
    print("Search 'appl':", trie.search("appl"))
    print("Starts with 'ban':", trie.starts_with("ban"))
    print("Starts with 'cat':", trie.starts_with("cat"))
    print()
    print("Words with prefix 'ban':", trie.get_all_words_with_prefix("ban"))
    print("Words with prefix 'app':", trie.get_all_words_with_prefix("app"))
```

```javascript
function trie() {
    // Trie (Prefix Tree) implementation
    // Time: O(m) for operations where m is key length
    // Space: O(n*m)
}
```

---

## Example

**Input:**
```
words = ["apple", "app", "application", "apply", "banana", "band", "bandana"]
```

**Output:**
```
Words inserted: ['apple', 'app', 'application', 'apply', 'banana', 'band', 'bandana']

Search 'app': True
Search 'appl': False
Starts with 'ban': True
Starts with 'cat': False

Words with prefix 'ban': ['banana', 'band', 'bandana']
Words with prefix 'app': ['apple', 'app', 'application', 'apply']
```

**Explanation:**
- Insert: Creates nodes for each character in the word
- Search: Traverses the path, checks is_end flag
- Prefix search: Traverses to prefix node, collects all words from there
- 'ban' prefix finds banana, band, bandana

---

## Time Complexity
**O(m) for operations where m is key length**

---

## Space Complexity
**O(n*m)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
