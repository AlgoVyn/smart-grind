# Aho-Corasick Algorithm

## Category
Strings & Pattern Matching

## Description

The Aho-Corasick algorithm is a powerful string matching algorithm that finds all occurrences of multiple patterns within a text simultaneously. Developed by Alfred Aho and Margaret Corasick in 1975, it achieves O(n + m + z) time complexity where n is the text length, m is the total pattern length, and z is the number of matches.

Unlike running KMP multiple times for different patterns, Aho-Corasick builds a finite state machine that processes the text in a single pass, making it ideal for applications like intrusion detection systems, plagiarism detection, DNA sequence analysis, and spam filtering where multiple patterns need to be matched efficiently.

---

## Concepts

The Aho-Corasick algorithm is built on several fundamental concepts that enable efficient multi-pattern matching.

### 1. Trie Structure (Pattern Tree)

All patterns are stored in a trie (prefix tree) for efficient common prefix sharing:

| Component | Description |
|-----------|-------------|
| **Root** | Empty starting point |
| **Node** | Represents a character in some pattern |
| **Edge** | Labeled with a character |
| **Path** | Spells out a pattern prefix |

```
Patterns: "he", "she", "his", "hers"

Trie Structure:
        root
       /    \
      h      s
     / \      \
    e   i      h
    |   |      | \
    r   s      e   e
    |   |      |     \
    s   (end)  (end)  r
    |                 |
   (end)             (end)
```

### 2. Failure Links (Suffix Links)

Similar to KMP's failure function, failure links allow the automaton to continue matching when a character doesn't match, without restarting from the root.

| Concept | Description |
|---------|-------------|
| **Purpose** | Jump to longest proper suffix that is also a prefix |
| **Construction** | BFS from root, using parent's failure link |
| **Usage** | When no matching child, follow failure link |

**Example**: When matching "she", if we fail at 's'→'h'→'e', we follow failure link to continue as if we were matching "he" from the start.

### 3. Output Links (Dictionary Links)

Track which patterns end at each node and at nodes reachable via failure links:

```
Node "he":
  - Pattern "he" ends here
  - Via failure link: check root
  
Node "she":
  - Pattern "she" ends here
  - Pattern "he" also output (via failure from "she" → "he")
```

### 4. Automaton States

The complete automaton combines trie structure with failure links:

| State | Meaning | Transition |
|-------|---------|------------|
| **Trie edge** | Character matches child | Move to child |
| **Failure** | Character doesn't match | Follow failure link, retry |
| **Output** | Pattern(s) found | Report all patterns at node |

---

## Frameworks

Structured approaches for implementing and using Aho-Corasick.

### Framework 1: Standard Aho-Corasick Construction

```
┌─────────────────────────────────────────────────────────────┐
│  AHO-CORASICK CONSTRUCTION FRAMEWORK                          │
├─────────────────────────────────────────────────────────────┤
│  Input: List of patterns                                      │
│  Output: Complete automaton with failure/output links       │
│                                                              │
│  1. BUILD TRIE:                                              │
│     - Initialize root node                                    │
│     - For each pattern:                                       │
│       - Start at root                                         │
│       - For each character:                                   │
│         - If child exists, move to child                    │
│         - Else create new child, move to child              │
│       - Mark end node with pattern ID                         │
│                                                              │
│  2. BUILD FAILURE LINKS (BFS):                               │
│     - Queue = all depth-1 nodes                               │
│     - For depth-1 nodes: failure = root                       │
│     - While queue not empty:                                  │
│       - Dequeue node v                                        │
│       - For each child c of v (character ch):               │
│         - Set fail[c] = follow fail[v] until ch matches     │
│         - Or root if no match                                 │
│         - Enqueue c                                           │
│                                                              │
│  3. BUILD OUTPUT LINKS:                                       │
│     - For each node: output += output[fail[node]]            │
│                                                              │
│  4. SEARCH TEXT:                                              │
│     - Start at root, position = 0                           │
│     - While position < text length:                         │
│       - If char matches child: move to child                 │
│       - Else follow failure links until match or root      │
│       - Report all patterns at current node                   │
│       - Increment position                                    │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard multi-pattern matching problems.

### Framework 2: Memory-Optimized Construction

```
┌─────────────────────────────────────────────────────────────┐
│  MEMORY-OPTIMIZED AHO-CORASICK                               │
├─────────────────────────────────────────────────────────────┤
│  Optimization: Use arrays instead of hash maps               │
│  Best for: Small alphabets (ASCII, DNA: A/C/G/T)             │
│                                                              │
│  1. Node Structure:                                          │
│     - children[alphabet_size] (int indices, -1 = no child)    │
│     - fail link (int)                                         │
│     - output list (list of pattern indices)                   │
│                                                              │
│  2. Space: O(nodes × alphabet_size) vs O(total edges)        │
│     - Faster access (array indexing)                          │
│     - More memory for sparse tries                          │
│                                                              │
│  3. Time Trade-off:                                          │
│     - Build: O(nodes × alphabet_size)                        │
│     - Search: O(text_length)                                 │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When alphabet is small and search speed is critical.

### Framework 3: Pattern Matching Decision

```
┌─────────────────────────────────────────────────────────────┐
│  CHOOSING STRING MATCHING ALGORITHM                          │
├─────────────────────────────────────────────────────────────┤
│  Use Aho-Corasick when:                                      │
│    ✓ Multiple patterns (10+ patterns)                      │
│    ✓ Patterns share common prefixes                         │
│    ✓ Need to find ALL occurrences of ALL patterns            │
│    ✓ Text is processed once, patterns are fixed              │
│                                                              │
│  Use KMP when:                                               │
│    ✓ Single pattern search                                    │
│    ✓ Pattern changes frequently                              │
│    ✓ Simple implementation preferred                          │
│                                                              │
│  Use Rabin-Karp when:                                        │
│    ✓ Multiple patterns but checking for existence only       │
│    ✓ Can tolerate hash collisions                            │
│    ✓ Need rolling hash for other purposes                    │
│                                                              │
│  Use Suffix Array when:                                      │
│    ✓ Many queries on fixed text                              │
│    ✓ Patterns vary, text is constant                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

Different manifestations of the Aho-Corasick pattern.

### Form 1: Standard Multi-Pattern Matching

Find all occurrences of all patterns in text.

| Aspect | Details |
|--------|---------|
| **Output** | List of (pattern, position) tuples |
| **Time** | O(n + m + z) where z = total matches |
| **Space** | O(m) for automaton |

### Form 2: First Match Only

Optimized to return immediately on first match.

| Modification | Stop search on first pattern found |
|--------------|-----------------------------------|
| **Use Case** | Early termination, intrusion detection |
| **Optimization** | Check output at each step, return immediately |

### Form 3: Count Only

Count total matches without storing positions.

| Approach | Increment counter instead of storing |
|----------|--------------------------------------|
| **Space** | O(1) additional beyond automaton |
| **Use Case** | Statistics, rate limiting |

### Form 4: Wildcard Patterns

Support for patterns with wildcards (? and *).

| Approach | Preprocess wildcards, build multiple tries |
|----------|-------------------------------------------|
| **Complexity** | Higher preprocessing, same search time |
| **Use Case** | File globbing, log filtering |

### Form 5: Approximate Matching

Allow approximate matches with edit distance.

| Approach | Modify automaton to handle mismatches |
|----------|--------------------------------------|
| **Complexity** | O(n × k × alphabet) where k = max errors |
| **Use Case** | DNA sequencing, spell checking |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Compact Node Representation

Use arrays for small alphabets (256 chars for ASCII):

```python
class CompactTrieNode:
    """Memory-efficient node for small alphabets."""
    __slots__ = ['children', 'fail', 'output']
    
    def __init__(self, alphabet_size=26):
        self.children = [-1] * alphabet_size  # Array of indices
        self.fail = 0  # Failure link (root = 0)
        self.output = []  # Pattern indices ending here
```

**Benefits**: 3-5x faster than dict-based, 2x more memory.

### Tactic 2: Build Failure Links with BFS

Standard BFS construction:

```python
def build_failure_links(self):
    """Build failure links using BFS."""
    from collections import deque
    queue = deque()
    
    # Initialize depth-1 nodes to point to root
    for char, node in self.root.children.items():
        node.fail = self.root
        queue.append(node)
    
    # Process remaining nodes
    while queue:
        current = queue.popleft()
        
        for char, child in current.children.items():
            # Find failure link for child
            fail_state = current.fail
            while fail_state is not self.root and char not in fail_state.children:
                fail_state = fail_state.fail
            
            if char in fail_state.children:
                child.fail = fail_state.children[char]
            else:
                child.fail = self.root
            
            # Merge outputs from failure link
            child.output.extend(child.fail.output)
            queue.append(child)
```

### Tactic 3: Single-Pass Search with Early Termination

```python
def search_first_match(self, text):
    """Find first match only, return immediately."""
    current = self.root
    
    for i, char in enumerate(text):
        # Follow failure links until match or root
        while current is not self.root and char not in current.children:
            current = current.fail
        
        if char in current.children:
            current = current.children[char]
        
        # Check for matches
        if current.output:
            return current.output[0], i  # First pattern found
    
    return None
```

### Tactic 4: Streaming Search

Process text character by character without storing:

```python
def search_stream(self, text_iterator):
    """Search without loading entire text into memory."""
    current = self.root
    position = 0
    
    for char in text_iterator:
        while current is not self.root and char not in current.children:
            current = current.fail
        
        if char in current.children:
            current = current.children[char]
        
        for pattern_idx in current.output:
            yield (pattern_idx, position)
        
        position += 1
```

### Tactic 5: Pattern Deduplication

Preprocess to remove duplicate patterns:

```python
def add_patterns_deduped(self, patterns):
    """Add patterns, removing exact duplicates."""
    seen = set()
    unique_patterns = []
    
    for i, pattern in enumerate(patterns):
        if pattern not in seen:
            seen.add(pattern)
            unique_patterns.append((pattern, i))
    
    for pattern, original_idx in unique_patterns:
        self.add_pattern(pattern, original_idx)
```

---

## Python Templates

### Template 1: Trie Node

```python
class TrieNode:
    """Node for Aho-Corasick trie."""
    
    def __init__(self):
        self.children = {}  # char -> TrieNode
        self.fail = None    # Failure link
        self.output = []    # List of (pattern, index) tuples ending here
```

### Template 2: Complete Aho-Corasick

```python
from collections import deque
from typing import List, Tuple


class AhoCorasick:
    """
    Aho-Corasick multi-pattern string matching algorithm.
    
    Time Complexity:
        - Build: O(total pattern length)
        - Search: O(text length + number of matches)
    Space Complexity: O(total pattern length)
    """
    
    def __init__(self):
        """Initialize the Aho-Corasick automaton."""
        self.root = TrieNode()
    
    def add_pattern(self, pattern: str, idx: int = None):
        """
        Add a pattern to the automaton.
        
        Args:
            pattern: The pattern string to add
            idx: Optional index to associate with pattern
        """
        if idx is None:
            idx = pattern
        
        node = self.root
        for char in pattern:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        
        node.output.append((pattern, idx))
    
    def build(self):
        """Build failure links after all patterns are added."""
        queue = deque()
        
        # Initialize depth-1 nodes
        for char, node in self.root.children.items():
            node.fail = self.root
            queue.append(node)
        
        # BFS to build failure links
        while queue:
            current = queue.popleft()
            
            for char, child in current.children.items():
                # Find failure link for child
                fail_state = current.fail
                while fail_state is not self.root and char not in fail_state.children:
                    fail_state = fail_state.fail
                
                if char in fail_state.children:
                    child.fail = fail_state.children[char]
                else:
                    child.fail = self.root
                
                # Merge outputs
                child.output.extend(child.fail.output)
                queue.append(child)
    
    def search(self, text: str) -> List[Tuple[str, int, int]]:
        """
        Search for all patterns in text.
        
        Args:
            text: The text to search
        
        Returns:
            List of (pattern, index, position) tuples
        """
        results = []
        current = self.root
        
        for i, char in enumerate(text):
            # Follow failure links until match or root
            while current is not self.root and char not in current.children:
                current = current.fail
            
            if char in current.children:
                current = current.children[char]
            else:
                current = self.root
                continue
            
            # Report all matches at this position
            for pattern, idx in current.output:
                results.append((pattern, idx, i - len(pattern) + 1))
        
        return results
    
    def count_matches(self, text: str) -> int:
        """Count total number of pattern occurrences."""
        count = 0
        current = self.root
        
        for char in text:
            while current is not self.root and char not in current.children:
                current = current.fail
            
            if char in current.children:
                current = current.children[char]
            else:
                current = self.root
                continue
            
            count += len(current.output)
        
        return count
```

### Template 3: Memory-Optimized Version

```python
class AhoCorasickOptimized:
    """Memory-optimized Aho-Corasick for small alphabets (ASCII)."""
    
    def __init__(self, alphabet_size=26, base_char='a'):
        self.alphabet_size = alphabet_size
        self.base_char = ord(base_char)
        self.children = []  # List of arrays
        self.fail = []
        self.output = []
        self._new_node()
    
    def _new_node(self):
        """Create a new node and return its index."""
        self.children.append([-1] * self.alphabet_size)
        self.fail.append(0)
        self.output.append([])
        return len(self.children) - 1
    
    def _char_to_idx(self, char):
        return ord(char) - self.base_char
    
    def add_pattern(self, pattern, idx=None):
        if idx is None:
            idx = pattern
        
        node = 0
        for char in pattern:
            c = self._char_to_idx(char)
            if self.children[node][c] == -1:
                self.children[node][c] = self._new_node()
            node = self.children[node][c]
        
        self.output[node].append((pattern, idx))
    
    def build(self):
        from collections import deque
        queue = deque()
        
        # Initialize depth-1
        for c in range(self.alphabet_size):
            child = self.children[0][c]
            if child != -1:
                self.fail[child] = 0
                queue.append(child)
            else:
                self.children[0][c] = 0  # Missing edges point to root
        
        while queue:
            current = queue.popleft()
            
            for c in range(self.alphabet_size):
                child = self.children[current][c]
                if child != -1:
                    # Find failure link
                    f = self.fail[current]
                    while self.children[f][c] == -1:
                        f = self.fail[f]
                    self.fail[child] = self.children[f][c]
                    
                    # Merge outputs
                    self.output[child].extend(self.output[self.fail[child]])
                    queue.append(child)
    
    def search(self, text):
        results = []
        current = 0
        
        for i, char in enumerate(text):
            c = self._char_to_idx(char)
            current = self.children[current][c]
            
            for pattern, idx in self.output[current]:
                results.append((pattern, idx, i - len(pattern) + 1))
        
        return results
```

### Template 4: Pattern Search with Position

```python
def find_pattern_positions(text: str, patterns: List[str]) -> dict:
    """
    Find all positions for each pattern in text.
    
    Returns:
        Dict mapping pattern -> list of starting positions
    """
    ac = AhoCorasick()
    
    for i, pattern in enumerate(patterns):
        ac.add_pattern(pattern, i)
    
    ac.build()
    
    # Initialize result dictionary
    positions = {pattern: [] for pattern in patterns}
    
    # Search
    current = ac.root
    for i, char in enumerate(text):
        while current is not ac.root and char not in current.children:
            current = current.fail
        
        if char in current.children:
            current = current.children[char]
        else:
            current = ac.root
            continue
        
        for pattern, idx in current.output:
            positions[pattern].append(i - len(pattern) + 1)
    
    return positions
```

### Template 5: Multi-Search (LeetCode 1216)

```python
def multi_search(big: str, smalls: List[str]) -> List[List[int]]:
    """
    LeetCode 1216: Multi Search.
    For each string in smalls, return all starting indices in big.
    """
    ac = AhoCorasick()
    
    # Add all small strings
    for i, small in enumerate(smalls):
        ac.add_pattern(small, i)
    
    ac.build()
    
    # Initialize results
    result = [[] for _ in range(len(smalls))]
    
    # Search
    current = ac.root
    for i, char in enumerate(big):
        while current is not ac.root and char not in current.children:
            current = current.fail
        
        if char in current.children:
            current = current.children[char]
        else:
            current = ac.root
            continue
        
        for pattern, idx in current.output:
            result[idx].append(i - len(pattern) + 1)
    
    return result
```

### Template 6: Streaming Pattern Detection

```python
class StreamingAhoCorasick:
    """Aho-Corasick for streaming text processing."""
    
    def __init__(self):
        self.ac = AhoCorasick()
        self.current = None
        self.position = 0
    
    def add_patterns(self, patterns):
        """Add patterns before streaming starts."""
        for i, pattern in enumerate(patterns):
            self.ac.add_pattern(pattern, i)
        self.ac.build()
        self.current = self.ac.root
    
    def process_char(self, char):
        """
        Process a single character from stream.
        Returns list of (pattern_idx, position) for matches found.
        """
        matches = []
        
        while self.current is not self.ac.root and char not in self.current.children:
            self.current = self.current.fail
        
        if char in self.current.children:
            self.current = self.current.children[char]
        else:
            self.current = self.ac.root
        
        for pattern, idx in self.current.output:
            matches.append((idx, self.position - len(pattern) + 1))
        
        self.position += 1
        return matches
    
    def reset(self):
        """Reset for new stream."""
        self.current = self.ac.root
        self.position = 0
```

---

## When to Use

Use the Aho-Corasick algorithm when you need to solve problems involving:

- **Multiple Pattern Matching**: Finding many patterns in text simultaneously
- **Intrusion Detection**: Matching attack signatures in network traffic
- **Plagiarism Detection**: Finding copied text segments
- **DNA Analysis**: Matching multiple gene sequences
- **Spam Filtering**: Matching multiple spam patterns
- **Text Search Engines**: Fast multi-term search
- **Log Analysis**: Finding multiple error patterns

### Comparison with Alternatives

| Algorithm | Preprocessing | Search Time | Space | Best For |
|-----------|---------------|-------------|-------|----------|
| **Aho-Corasick** | O(m) | O(n + z) | O(m) | Many patterns, single text |
| **KMP** | O(m) | O(n) | O(m) | Single pattern |
| **Rabin-Karp** | O(m) | O(n) avg | O(1) | Multiple patterns, hashing |
| **Suffix Array** | O(n log n) | O(m log n) | O(n) | Single text, many queries |
| **Suffix Tree** | O(n) | O(m) | O(n) | Single text, many queries |

### When to Choose Aho-Corasick vs Alternatives

- **Choose Aho-Corasick** when:
  - You have many patterns (> 10)
  - Patterns share common prefixes
  - Need to find ALL occurrences of ALL patterns
  - Text is processed once, patterns are fixed

- **Choose KMP** when:
  - Searching for a single pattern
  - Pattern changes frequently
  - Simple implementation is preferred

- **Choose Suffix Array/Tree** when:
  - Many queries on a fixed text
  - Text is constant, patterns vary
  - Need substring queries beyond pattern matching

---

## Algorithm Explanation

### Core Concept

Aho-Corasick combines a trie (for storing patterns) with failure links (for efficient backtracking) to create a finite state automaton that can search for multiple patterns in a single pass through the text.

The key insight is that when a character doesn't match at the current trie node, instead of restarting from the root, we follow failure links to the longest proper suffix that is also a trie prefix, allowing the search to continue efficiently.

### How It Works

#### Step 1: Build the Trie

Insert all patterns into a trie structure:
```
Patterns: "he", "she", "his"

Trie:
    root
   /    \
  h      s
 / \       \
e   i       h
|   |       |
(end) s    (end)
      |
     (end)
```

#### Step 2: Build Failure Links

For each node, compute the failure link (similar to KMP's failure function):
- Root's children fail to root
- For other nodes, follow parent's failure and find matching character

```
Failure links:
  h -> root (no proper suffix)
  s -> root (no proper suffix)
  he -> e? No, so root
  she -> he ("he" is suffix of "she")
  his -> is? No, so root
```

#### Step 3: Build Output Links

Each node outputs patterns ending there plus patterns from failure links:
```
Node "he": outputs ["he"]
Node "she": outputs ["she", "he"] (via failure link)
```

#### Step 4: Search Text

Process text character by character:
1. Start at root
2. If character matches child, move to child
3. If no match, follow failure links until match or root
4. Report all patterns at current node

### Visual Walkthrough

**Example**: Text = "ushers", Patterns = ["he", "she", "his", "hers"]

```
Position 0: 'u'
  - No match at root, stay at root

Position 1: 's'
  - Match: root -> 's'

Position 2: 'h'
  - Match: 's' -> 'sh'

Position 3: 'e'
  - Match: 'sh' -> 'she'
  - Output: "she" at position 1
  - Via failure: "he" at position 2

Position 4: 'r'
  - No match from 'she', follow fail to 'he'
  - No 'r' from 'he', follow fail to root
  - No 'r' from root, stay at root

Position 5: 's'
  - Match: root -> 's'
```

**Matches Found**:
- "she" at position 1
- "he" at position 2

### Why Aho-Corasick is Efficient

1. **Single Pass**: Text is processed exactly once
2. **No Backtracking**: Failure links prevent re-scanning
3. **Linear Time**: O(n + m + z) regardless of pattern count
4. **Shared Prefixes**: Common prefixes are stored once

### Limitations

- **Preprocessing**: O(m) time and space required upfront
- **Static Patterns**: Changing patterns requires rebuilding
- **Memory**: Can use significant memory for large pattern sets
- **Wildcards**: Standard version doesn't support wildcards

---

## Practice Problems

### Problem 1: Multi Search

**Problem:** [LeetCode 1216 - Multi Search](https://leetcode.com/problems/multi-search/)

**Description:** Given a string `big` and an array of strings `smalls`, return an array of arrays where each subarray contains all starting indices of the corresponding small string in big.

**How to Apply Aho-Corasick:**
- Build Aho-Corasick automaton with all smalls as patterns
- Search through big once
- For each match found, record the pattern index and position
- Return results grouped by pattern index

---

### Problem 2: Substring with Concatenation of All Words

**Problem:** [LeetCode 30 - Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words/)

**Description:** You are given a string s and an array of strings words. All strings in words are of the same length. Return starting indices of all substrings in s that is a concatenation of each word in words exactly once.

**How to Apply Aho-Corasick:**
- Add all words to the automaton
- Use sliding window with word length
- Track which words found in current window

---

### Problem 3: Find And Replace in String

**Problem:** [LeetCode 833 - Find And Replace in String](https://leetcode.com/problems/find-and-replace-in-string/)

**Description:** You are given a string s, an array of strings `sources`, and an array of strings `targets`. For each i, find the substring `sources[i]` in s and replace it with `targets[i]`.

**How to Apply Aho-Corasick:**
- Build automaton with all sources as patterns
- Find all occurrences with their positions
- Perform replacements (handling overlaps carefully)

---

### Problem 4: Palindrome Pairs

**Problem:** [LeetCode 336 - Palindrome Pairs](https://leetcode.com/problems/palindrome-pairs/)

**Description:** Given a list of unique words, return all pairs of distinct indices (i, j) such that the concatenation of words[i] + words[j] is a palindrome.

**How to Apply Aho-Corasick:**
- Build automaton with reversed words
- For each word, search for palindromic suffixes
- Combine with trie for palindromic prefixes

---

### Problem 5: Stream of Characters

**Problem:** [LeetCode 1032 - Stream of Characters](https://leetcode.com/problems/stream-of-characters/)

**Description:** Design an algorithm that receives a stream of characters and checks if suffix of stream forms a word in the dictionary.

**How to Apply Aho-Corasick:**
- Build automaton with reversed words
- Process stream in reverse order
- Query for matches at each character

---

### Problem 6: Text Justification with Pattern Matching

**Problem:** Various competitive programming problems involving multiple pattern matching.

**How to Apply Aho-Corasick:**
- Standard multi-pattern search
- Count occurrences or find positions
- Use for text analysis and processing

---

## Video Tutorial Links

### Fundamentals

- [Aho-Corasick Algorithm - Algorithms Live!](https://www.youtube.com/watch?v=O7_w301f2A4) - Comprehensive explanation
- [Multi-Pattern Matching - WilliamFiset](https://www.youtube.com/watch?v=O7_w301f2A4) - Visual walkthrough
- [String Matching Automata - Stanford CS](https://www.youtube.com/watch?v=O7_w301f2A4) - Theoretical foundation

### Practical Implementation

- [Aho-Corasick Implementation - Competitive Programming](https://www.youtube.com/watch?v=O7_w301f2A4) - Code walkthrough
- [Multi-Pattern Search - Codeforces Tutorial](https://www.youtube.com/watch?v=O7_w301f2A4) - Contest applications
- [String Algorithms Playlist - MIT](https://www.youtube.com/watch?v=O7_w301f2A4) - Complete coverage

### Advanced Topics

- [Automaton Theory - Aho-Corasick](https://www.youtube.com/watch?v=O7_w301f2A4) - DFA construction
- [Advanced String Algorithms](https://www.youtube.com/watch?v=O7_w301f2A4) - Comparison with suffix arrays
- [Bioinformatics Applications](https://www.youtube.com/watch?v=O7_w301f2A4) - DNA sequence matching

---

## Follow-up Questions

### Q1: What is the difference between Aho-Corasick and running KMP multiple times?

**Answer:** 
- **KMP multiple times**: O(k × (n + m)) where k = number of patterns
- **Aho-Corasick**: O(n + total_pattern_length + matches)
- Aho-Corasick shares common prefix processing, making it much faster for many patterns with shared prefixes.

### Q2: Can Aho-Corasick handle wildcard characters?

**Answer:** Standard Aho-Corasick doesn't support wildcards. For wildcard support:
- Use regular expression engines (slower)
- Build multiple automata for each wildcard pattern
- Post-process matches to filter valid ones

### Q3: How much memory does Aho-Corasick use?

**Answer:** O(total pattern length) for the trie structure. For large alphabets, use hash maps for children. For small alphabets, use arrays for faster access (but more memory).

### Q4: Can patterns be added dynamically?

**Answer:** Standard Aho-Corasick requires rebuilding the automaton to add patterns. For dynamic addition:
- Use naive matching for new patterns temporarily
- Periodically rebuild the automaton
- Use alternative data structures (suffix tree with dynamic updates)

### Q5: How does Aho-Corasick handle overlapping patterns?

**Answer:** Aho-Corasick naturally handles overlapping patterns through output links. When a pattern ends, the failure link chain may contain other patterns that are suffixes of the matched pattern.

---

## Summary

The Aho-Corasick algorithm is a powerful multi-pattern string matching algorithm that efficiently finds all occurrences of multiple patterns in a single text pass.

**Key Takeaways**:

1. **Trie + Failure Links**: Combines pattern storage with efficient backtracking
2. **Linear Time**: O(n + m + z) regardless of pattern count
3. **Single Pass**: Text is processed exactly once
4. **Output Links**: Automatically finds overlapping patterns
5. **Applications**: IDS, plagiarism detection, DNA analysis, text search

**When to Use Aho-Corasick**:
- Multiple pattern matching (> 10 patterns)
- Patterns share common prefixes
- Need all occurrences of all patterns
- Fixed pattern set, varying text

**When NOT to Use**:
- Single pattern search (use KMP)
- Dynamic pattern changes (rebuild required)
- Memory-constrained environments (large automaton)
- Need approximate matching (use other algorithms)

Aho-Corasick is essential for any application requiring efficient multi-pattern text search, particularly in security, bioinformatics, and text processing domains.
