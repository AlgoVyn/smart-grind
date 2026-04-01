# Trie (Prefix Tree)

## Category
Trees & BSTs

## Description

A Trie (pronounced "try"), also known as a Prefix Tree, is a tree data structure used for efficient string operations. It excels at prefix-based searches and is commonly used for autocomplete, spell checking, IP routing, and word games. The key advantage of a Trie is that it provides O(m) time complexity for insertion, searching, and prefix operations, where m is the length of the key.

This pattern is fundamental in competitive programming and technical interviews for solving a wide range of string and prefix-based problems efficiently.

---

## Concepts

The Trie data structure is built on several fundamental concepts that make it powerful for solving string problems.

### 1. Node Structure

Each node in a Trie represents a character or prefix and contains:

| Component | Type | Description |
|-----------|------|-------------|
| **children** | Map/Dict | Edges to child nodes (char -> node) |
| **is_end** | Boolean | Marks if this node completes a word |
| **word** | String | Stores complete word (optional, for retrieval) |

### 2. Prefix Sharing

Tries share common prefixes to save space:

```
Words: "apple", "app", "application"

        root
         |
         a
         |
         p
         |
         p
       / | \
      l  e   l
      |      |
      e      i
      |      |
     (end)   c
             |
             a
             |
             t
             |
            (end)
```

The prefix "app" is stored only once for all three words.

### 3. Edge Traversal

Each edge represents a character transition:

```
New State = Traverse edge labeled with character
If edge doesn't exist: Word/Prefix not found
```

### 4. Search Types

Tries support different search operations:

| Search Type | Description | Time |
|-------------|-------------|------|
| **Exact Match** | Find complete word | O(m) |
| **Prefix Search** | Check if prefix exists | O(m) |
| **Autocomplete** | Find all words with prefix | O(m + k) |

---

## Frameworks

Structured approaches for solving Trie problems.

### Framework 1: Basic Trie Operations

```
┌─────────────────────────────────────────────────────┐
│  BASIC TRIE OPERATIONS FRAMEWORK                      │
├─────────────────────────────────────────────────────┤
│  INSERT(word):                                       │
│    1. Start at root                                  │
│    2. For each char in word:                         │
│       a. If char not in children, create new node   │
│       b. Move to child node                          │
│    3. Mark final node as is_end = true               │
│                                                      │
│  SEARCH(word):                                       │
│    1. Start at root                                  │
│    2. For each char in word:                         │
│       a. If char not in children, return False      │
│       b. Move to child node                          │
│    3. Return node.is_end                               │
│                                                      │
│  STARTS_WITH(prefix):                                │
│    1. Same as SEARCH but ignore is_end check        │
│    2. Return True if all chars found                  │
└─────────────────────────────────────────────────────┘
```

**When to use**: Standard Trie implementation with basic operations.

### Framework 2: Trie with Autocomplete

```
┌─────────────────────────────────────────────────────┐
│  TRIE AUTOCOMPLETE FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Build Trie by inserting all dictionary words     │
│  2. GET_WORDS_WITH_PREFIX(prefix):                   │
│     a. Traverse to node representing prefix          │
│     b. If node doesn't exist, return empty list     │
│     c. Perform DFS/BFS from this node:              │
│        - If node.is_end, add node.word to results    │
│        - Recursively visit all children              │
│  3. Return collected words                             │
└─────────────────────────────────────────────────────┘
```

**When to use**: Implementing autocomplete or prefix-based suggestions.

### Framework 3: Trie for Word Games

```
┌─────────────────────────────────────────────────────┐
│  TRIE FOR WORD SEARCH / BOGGLE FRAMEWORK              │
├─────────────────────────────────────────────────────┤
│  1. Build Trie with all valid dictionary words     │
│  2. DFS from each cell in the board:                 │
│     a. Track current word being built               │
│     b. Check if current prefix exists in Trie      │
│     c. If prefix doesn't exist, prune this path    │
│     d. If complete word found, add to results      │
│     e. Backtrack: remove last char, mark cell unvisited │
│  3. Return all found words                             │
│                                                      │
│  Key Optimization: Early termination on invalid prefix │
└─────────────────────────────────────────────────────┘
```

**When to use**: Word search problems, Boggle, finding words in a grid.

---

## Forms

Different manifestations of the Trie pattern.

### Form 1: Standard Trie (Hash-based Children)

Uses dictionary/map for children - memory efficient for sparse alphabets.

| Aspect | Implementation | When to Use |
|--------|---------------|-------------|
| **Children** | `Dict[char, TrieNode]` | Large/unpredictable alphabets |
| **Space** | O(total chars in all words) | Memory-constrained |
| **Access** | O(1) average per char | Dynamic alphabets |

### Form 2: Array-based Trie (Fixed Alphabet)

Uses fixed-size array for children - faster for small alphabets.

| Aspect | Implementation | When to Use |
|--------|---------------|-------------|
| **Children** | `TrieNode[26]` or `TrieNode[128]` | Known small alphabet |
| **Space** | O(26 × nodes) | 26 lowercase letters |
| **Access** | O(1) guaranteed | ASCII characters |

### Form 3: Compressed Trie (Radix/Patricia)

Compresses single-child chains to save space:

```
Before:  a -> p -> p -> l -> e
After:   "apple" -> (end)
```

| Aspect | Benefit | Trade-off |
|--------|---------|-----------|
| **Space** | Reduced by 30-50% | More complex insertion |
| **Traversal** | Faster for long shared prefixes | Slower deletion |

### Form 4: Ternary Search Tree (TST)

Hybrid structure with 3 pointers per node:

```
Node contains:
- char: single character
- left: chars less than current
- mid: chars equal to current (continue word)
- right: chars greater than current
```

| Aspect | Benefit | Trade-off |
|--------|---------|-----------|
| **Space** | O(nodes) not O(nodes × alphabet) | O(m) time vs O(m) for standard |
| **Search** | Similar to binary search tree | Slightly slower |

### Form 5: Bitwise Trie

For numeric data (XOR problems, bit manipulation):

```
Children: [0, 1] representing bit values
Height: 31 (for 32-bit integers)
Use: Find max XOR, find closest number
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Trie Node with Word Count

Track frequency for weighted autocomplete:

```python
class TrieNodeWithCount:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.count = 0  # Frequency of word ending here
        self.word = ""

class AutocompleteTrie:
    def insert(self, word, count=1):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNodeWithCount()
            node = node.children[char]
        node.is_end = True
        node.word = word
        node.count += count
    
    def get_top_k(self, prefix, k=3):
        """Get top k most frequent words with prefix."""
        node = self._find_node(prefix)
        if not node:
            return []
        
        words = []
        self._collect_all(node, words)
        words.sort(key=lambda x: x[1], reverse=True)
        return [w[0] for w in words[:k]]
```

### Tactic 2: Word Deletion with Cleanup

Delete words and remove unused nodes:

```python
def delete(self, word: str) -> bool:
    """Delete word and cleanup unused nodes."""
    def _delete_helper(node, word, depth):
        if depth == len(word):
            if not node.is_end:
                return False
            node.is_end = False
            return len(node.children) == 0
        
        char = word[depth]
        if char not in node.children:
            return False
        
        should_delete_child = _delete_helper(
            node.children[char], word, depth + 1
        )
        
        if should_delete_child:
            del node.children[char]
            return len(node.children) == 0 and not node.is_end
        
        return False
    
    return _delete_helper(self.root, word, 0)
```

### Tactic 3: Finding Longest Common Prefix

Use Trie to find LCP among all words:

```python
def longest_common_prefix(strs: list[str]) -> str:
    """Find longest common prefix using Trie."""
    if not strs:
        return ""
    
    trie = Trie()
    for word in strs:
        trie.insert(word)
    
    # Traverse until we find a branch or word end
    prefix = []
    node = trie.root
    
    while len(node.children) == 1 and not node.is_end:
        char = list(node.children.keys())[0]
        prefix.append(char)
        node = node.children[char]
    
    return "".join(prefix)
```

### Tactic 4: Pattern Matching with Wildcards

Support '.' wildcard in search:

```python
class WordDictionary:
    def __init__(self):
        self.root = TrieNode()
    
    def search_with_wildcard(self, word: str) -> bool:
        """Search word where '.' matches any character."""
        def dfs(node, index):
            if index == len(word):
                return node.is_end
            
            char = word[index]
            if char == '.':
                # Try all children
                for child in node.children.values():
                    if dfs(child, index + 1):
                        return True
                return False
            else:
                if char not in node.children:
                    return False
                return dfs(node.children[char], index + 1)
        
        return dfs(self.root, 0)
```

### Tactic 5: Replace Words with Shortest Root

Replace words with their shortest prefix root:

```python
def replace_words(dictionary: list[str], sentence: str) -> str:
    """Replace each word with shortest root from dictionary."""
    trie = Trie()
    for root in dictionary:
        trie.insert(root)
    
    words = sentence.split()
    result = []
    
    for word in words:
        # Find shortest root
        node = trie.root
        replacement = []
        
        for char in word:
            if char not in node.children or node.is_end:
                break
            replacement.append(char)
            node = node.children[char]
        
        if node.is_end:
            result.append("".join(replacement))
        else:
            result.append(word)
    
    return " ".join(result)
```

---

## Python Templates

### Template 1: Basic Trie Implementation

```python
from typing import Dict, List, Optional


class TrieNode:
    """A node in the Trie structure."""
    
    def __init__(self):
        self.children: Dict[str, 'TrieNode'] = {}
        self.is_end: bool = False
        self.word: str = ""


class Trie:
    """
    Basic Trie implementation for efficient string operations.
    
    Time Complexities:
        - Insert: O(m) where m is word length
        - Search: O(m)
        - StartsWith: O(m)
    
    Space Complexity: O(total characters in all words)
    """
    
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        """Insert a word into the trie."""
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
        node.word = word
    
    def search(self, word: str) -> bool:
        """Search for exact word in trie."""
        node = self._find_node(word)
        return node is not None and node.is_end
    
    def starts_with(self, prefix: str) -> bool:
        """Check if any word starts with given prefix."""
        return self._find_node(prefix) is not None
    
    def _find_node(self, prefix: str) -> Optional[TrieNode]:
        """Find node corresponding to prefix."""
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
    
    def get_words_with_prefix(self, prefix: str) -> List[str]:
        """Get all words starting with given prefix."""
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
```

### Template 2: Trie with Deletion

```python
class TrieWithDelete:
    """Trie with word deletion and node cleanup."""
    
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        """Insert a word into the trie."""
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
        node.word = word
    
    def search(self, word: str) -> bool:
        """Search for exact word in trie."""
        node = self._find_node(word)
        return node is not None and node.is_end
    
    def delete(self, word: str) -> bool:
        """Delete a word from trie and cleanup unused nodes."""
        def _delete_helper(node: TrieNode, word: str, depth: int) -> bool:
            if depth == len(word):
                if not node.is_end:
                    return False
                node.is_end = False
                return len(node.children) == 0
            
            char = word[depth]
            if char not in node.children:
                return False
            
            should_delete_child = _delete_helper(
                node.children[char], word, depth + 1
            )
            
            if should_delete_child:
                del node.children[char]
                return len(node.children) == 0 and not node.is_end
            
            return False
        
        return _delete_helper(self.root, word, 0)
    
    def _find_node(self, prefix: str) -> Optional[TrieNode]:
        """Find node corresponding to prefix."""
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
```

### Template 3: Trie for Word Search II (Boggle)

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None  # Store complete word at end node


class WordSearchTrie:
    """Trie optimized for word search in grid."""
    
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        """Insert word into trie."""
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.word = word  # Mark end with complete word
    
    def find_words(self, board: List[List[str]]) -> List[str]:
        """Find all words from dictionary in the board."""
        if not board or not board[0]:
            return []
        
        result = set()
        rows, cols = len(board), len(board[0])
        
        def dfs(node, i, j):
            char = board[i][j]
            if char not in node.children:
                return
            
            child = node.children[char]
            if child.word:
                result.add(child.word)
                child.word = None  # Avoid duplicates
            
            # Mark as visited
            board[i][j] = '#'
            
            # Explore neighbors
            for di, dj in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                ni, nj = i + di, j + dj
                if 0 <= ni < rows and 0 <= nj < cols and board[ni][nj] != '#':
                    dfs(child, ni, nj)
            
            # Restore
            board[i][j] = char
        
        for i in range(rows):
            for j in range(cols):
                dfs(self.root, i, j)
        
        return list(result)
```

### Template 4: Bitwise Trie for Maximum XOR

```python
class BitTrieNode:
    def __init__(self):
        self.children = [None, None]  # 0 and 1


class BitwiseTrie:
    """Trie for efficient bit manipulation operations."""
    
    def __init__(self, max_bits: int = 31):
        self.root = BitTrieNode()
        self.max_bits = max_bits
    
    def insert(self, num: int) -> None:
        """Insert number into trie."""
        node = self.root
        for i in range(self.max_bits, -1, -1):
            bit = (num >> i) & 1
            if not node.children[bit]:
                node.children[bit] = BitTrieNode()
            node = node.children[bit]
    
    def find_max_xor(self, num: int) -> int:
        """Find number in trie that maximizes XOR with num."""
        node = self.root
        result = 0
        
        for i in range(self.max_bits, -1, -1):
            bit = (num >> i) & 1
            # Try opposite bit for maximum XOR
            opposite = 1 - bit
            
            if node.children[opposite]:
                result |= (1 << i)
                node = node.children[opposite]
            else:
                node = node.children[bit]
        
        return result


def find_maximum_xor(nums: List[int]) -> int:
    """Find maximum XOR of any two numbers in array."""
    if not nums:
        return 0
    
    trie = BitwiseTrie()
    max_xor = 0
    
    trie.insert(nums[0])
    for num in nums[1:]:
        max_xor = max(max_xor, trie.find_max_xor(num))
        trie.insert(num)
    
    return max_xor
```

### Template 5: Trie with Wildcard Support

```python
class WordDictionary:
    """Trie that supports '.' wildcard matching."""
    
    def __init__(self):
        self.root = TrieNode()
    
    def add_word(self, word: str) -> None:
        """Add word to dictionary."""
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word: str) -> bool:
        """
        Search word with wildcards.
        '.' matches any single character.
        """
        def dfs(node: TrieNode, index: int) -> bool:
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
                if char not in node.children:
                    return False
                return dfs(node.children[char], index + 1)
        
        return dfs(self.root, 0)
```

### Template 6: Longest Common Prefix Using Trie

```python
def longest_common_prefix(strs: List[str]) -> str:
    """
    Find longest common prefix among all strings using Trie.
    
    Time: O(S) where S is sum of all characters
    Space: O(S)
    """
    if not strs:
        return ""
    
    # Build Trie
    root = TrieNode()
    for word in strs:
        node = root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    # Find LCP
    prefix = []
    node = root
    
    while len(node.children) == 1 and not node.is_end:
        char = list(node.children.keys())[0]
        prefix.append(char)
        node = node.children[char]
    
    return "".join(prefix)
```

---

## When to Use

Use the Trie data structure when you need to solve problems involving:

- **Autocomplete Systems**: When you need to suggest words based on a prefix
- **Spell Checkers**: When checking if a word exists in a dictionary
- **IP Routing**: When looking up routing prefixes in network tables
- **Word Games**: Like Boggle, where you need to find all words in a grid
- **Phone Directory**: When searching contacts by name prefix
- **Longest Prefix Matching**: When finding the longest matching prefix

### Comparison with Alternatives

| Data Structure | Search Time | Insert Time | Space | Best Use Case |
|----------------|-------------|-------------|-------|---------------|
| **Trie** | O(m) | O(m) | O(ALPHABET_SIZE × m × n) | Prefix searches |
| **Hash Table** | O(m) avg | O(m) avg | O(m × n) | Exact match lookup |
| **Binary Search Tree** | O(m log n) | O(m log n) | O(m × n) | Ordered traversal |
| **Suffix Tree** | O(m) | O(m) | O(m) | Substring searches |

### When to Choose Trie vs Hash Table

- **Choose Trie** when:
  - You need prefix-based searches (autocomplete)
  - You need to enumerate all words with a given prefix
  - You need longest common prefix operations
  - You need alphabetical ordering of results

- **Choose Hash Table** when:
  - You only need exact match lookups
  - Memory is very constrained
  - You don't need prefix operations

---

## Algorithm Explanation

### Core Concept

The key insight behind the Trie is that it stores strings by their characters along a tree structure, where:
- Each **node** represents a character or prefix
- Each **edge** represents a character connecting nodes
- The **root** represents an empty string/prefix
- Each node has a **word end marker** (boolean flag) to indicate complete words

### How It Works

#### Structure:
```
        root
       / | \
      a  b  c
     /   |   \
    p    a    a
   /|\   |   / \
  p l y  n  t   r
```

For words: "apple", "app", "banana", "band"

#### Operations:

1. **Insert**: 
   - Start at root
   - For each character in the word:
     - If edge doesn't exist, create a new node
     - Move to the child node
   - Mark the final node as end of word

2. **Search**:
   - Start at root
   - For each character, traverse to child node
   - If at any point child doesn't exist, return False
   - After processing all characters, check if current node marks end of word

3. **Prefix Search (startsWith)**:
   - Same as search, but don't check end marker
   - Return True if we can traverse the entire prefix

4. **Delete**:
   - Recursive deletion from the deepest node
   - Remove nodes that are not prefixes of other words

### Visual Representation

For inserting words ["apple", "app", "application", "apply", "banana", "band"]:

```
                        root
                       /    \
                      a      b
                     /        \
                    p          a
                   / \          \
                  p   l          n
                 /   / \          \
                l   e   y         a
               /    |   \          \
              e     t   (end)     n
             /      |              \
            (end)   i               a
                   / \                \
                  c   o               (end)
                 /     \
                t       n
               /         \
             (end)       (end)
```

### Why Tries Work Well

- **Shared Prefixes**: Common prefixes are stored only once
- **O(m) Operations**: Time complexity depends only on key length, not number of keys
- **Alphabetical Order**: Words are naturally sorted lexicographically when traversed

### Limitations

- **High Space Complexity**: Each node needs storage for all possible children (or use hash-based children)
- **Memory Intensive**: For large alphabets (e.g., Unicode), memory usage can be significant
- **No Built-in Ordering**: Unlike BST, doesn't maintain any inherent ordering without explicit traversal

---

## Practice Problems

### Problem 1: Implement Trie (Prefix Tree)

**Problem:** [LeetCode 208 - Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)

**Description:** Implement a trie with insert, search, and startsWith methods.

**How to Apply Trie:**
- Use the standard Trie structure with children maps
- Insert: traverse/create nodes, mark end
- Search: traverse and check end marker
- StartsWith: just traverse, no end check needed

---

### Problem 2: Word Search II

**Problem:** [LeetCode 212 - Word Search II](https://leetcode.com/problems/word-search-ii/)

**Description:** Given a 2D board and a list of words, find all words in the board.

**How to Apply Trie:**
- Build a Trie with all dictionary words first
- Use DFS from each cell, pruning when no prefix exists in Trie
- Mark found words in Trie to avoid duplicates

---

### Problem 3: Design Add and Search Words Data Structure

**Problem:** [LeetCode 211 - Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/)

**Description:** Design a data structure that supports adding new words and searching for words with wildcards (. matches any letter).

**How to Apply Trie:**
- Standard Trie structure with DFS for wildcard matching
- When encountering '.', explore all children recursively
- Use backtracking to explore all possible paths

---

### Problem 4: Replace Words

**Problem:** [LeetCode 648 - Replace Words](https://leetcode.com/problems/replace-words/)

**Description:** In English, we have root words that can form new words. Given a dictionary of root words and a sentence, replace all words with their shortest root.

**How to Apply Trie:**
- Build Trie from all root words
- For each word in sentence, traverse Trie to find shortest root
- If no root found, keep original word

---

### Problem 5: Maximum XOR of Two Numbers in an Array

**Problem:** [LeetCode 421 - Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/)

**Description:** Given an integer array, find the maximum XOR of any two numbers.

**How to Apply Trie:**
- Use Bitwise Trie to store all numbers
- For each number, find the number that maximizes XOR
- At each bit, prefer opposite bit to maximize XOR value

---

### Problem 6: Concatenated Words

**Problem:** [LeetCode 472 - Concatenated Words](https://leetcode.com/problems/concatenated-words/)

**Description:** Given an array of strings, find all concatenated words. A concatenated word is defined as a string that is comprised entirely of at least two shorter words in the given array.

**How to Apply Trie:**
- Build Trie from all words
- Use DFS with memoization to check if word can be formed by other words

---

## Video Tutorial Links

### Fundamentals

- [Trie (Prefix Tree) - Introduction (Take U Forward)](https://www.youtube.com/watch?v=AXICaR41j2w) - Comprehensive introduction to tries
- [Trie Implementation (WilliamFiset)](https://www.youtube.com/watch?v=0I6IL1jGLM4) - Detailed explanation with visualizations
- [LeetCode 208 - Implement Trie (NeetCode)](https://www.youtube.com/watch?v=0xT2DGQ-U7I) - Practical implementation guide

### Advanced Topics

- [Word Search II - Trie Solution](https://www.youtube.com/watch?v=asfV34ZjDOk) - Using Trie for backtracking
- [Maximum XOR in Array - Bitwise Trie](https://www.youtube.com/watch?v=m8I3xXPY3M8) - Bitwise trie for XOR problems
- [Ternary Search Tree](https://www.youtube.com/watch?v=Y8dt5M4GC7U) - Space-optimized variant

---

## Follow-up Questions

### Q1: How would you optimize a Trie for very large alphabets?

**Answer:** For large alphabets (like Unicode), consider:
- **Hash-based children**: Use `Map` or `HashMap` instead of arrays - only stores existing edges
- **Double-array Trie (DAWG)**: More compact representation for large dictionaries
- **Finite-state transducer**: For more complex prefix matching

---

### Q2: Can Trie be used for numeric data?

**Answer:** Yes! Tries can work with any sequential data:
- **Numbers**: Convert to binary representation (Bitwise Trie)
- **DNA sequences**: A, C, G, T as alphabet
- **File paths**: Use '/' as delimiter
- **Time series**: Discretize values into buckets

---

### Q3: How does Trie compare to Hash Table for dictionary lookup?

**Answer:** 
- **Hash Table**: O(m) average for lookup, no prefix support
- **Trie**: O(m) worst-case, supports prefix operations, ordered results
- **Trade-off**: Trie uses more memory but provides additional functionality

---

### Q4: How do you handle case sensitivity in Trie?

**Answer:** Options include:
- Convert all input to lowercase/uppercase before insertion/lookup
- Store both versions with separate branches
- Use a case-insensitive index that normalizes during traversal
- Allow case-sensitive search with separate flag

---

### Q5: What is the space complexity of a Trie and how can you reduce it?

**Answer:** 
- **Worst case**: O(ALPHABET_SIZE × m × n)
- **Reduction strategies**:
  - Use dictionary-based children (only store existing edges)
  - Compress single-child paths (Radix Trie)
  - Use ternary search tree
  - Implement lazy loading with memory pool

---

## Summary

The Trie (Prefix Tree) is an essential data structure for **string operations** requiring efficient **prefix-based searches**. Key takeaways:

- **O(m) Operations**: All basic operations run in time proportional to word length
- **Prefix Power**: Excellent for autocomplete, spell checking, and prefix matching
- **Space Tradeoff**: Uses more memory than hash tables but provides additional functionality
- **Versatile**: Can be adapted for bitwise operations, numeric data, and space optimization

When to use:
- ✅ Autocomplete and prefix suggestions
- ✅ Spell checking and dictionary lookup
- ✅ IP routing and prefix matching
- ✅ Word games (Boggle, Scrabble)
- ❌ When memory is severely constrained (use hash table)
- ❌ When only exact match lookups are needed

This data structure is essential for competitive programming and technical interviews, especially in problems involving string prefix operations and autocomplete systems.
