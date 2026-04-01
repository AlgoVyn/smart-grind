# Word Break

## Category
Dynamic Programming

## Description

The Word Break problem is a classic dynamic programming problem where we need to determine if a string can be segmented into a sequence of one or more words from a given dictionary. This problem appears frequently in text processing, natural language processing, and autocomplete systems.

The algorithm uses dynamic programming where each state represents whether a prefix of the string can be segmented into dictionary words. By building up solutions for smaller substrings, we can efficiently determine if the entire string can be validly segmented without exhaustive search.

---

## Concepts

The Word Break technique is built on several fundamental concepts that make it powerful for solving string segmentation problems.

### 1. DP State Definition

The state represents whether a prefix can be segmented:

| State | Definition | Initialization |
|-------|------------|----------------|
| **dp[i]** | True if substring `s[0:i]` can be segmented | `dp[0] = True` (empty string) |
| **Transition** | `dp[i] = dp[j] AND s[j:i] in dict` | For all j < i |

### 2. Substring Validation

Checking if a substring exists in the dictionary:

| Approach | Lookup Time | Space | Best For |
|----------|-------------|-------|----------|
| **Hash Set** | O(1) average | O(dict size) | Small to medium dictionaries |
| **Trie** | O(L) where L = word length | O(total chars) | Large dictionaries, prefix matching |
| **Hash Map** | O(1) average | O(dict size) | When need additional word info |

### 3. Optimal Substructure

The key property enabling DP:

```
If s[0:j] can be segmented AND s[j:i] is a word
→ Then s[0:i] can be segmented
```

### 4. Early Termination

Optimization to stop checking once a valid segmentation is found:

```python
if dp[i]:
    break  # No need to check other j values
```

---

## Frameworks

Structured approaches for solving word break problems.

### Framework 1: Bottom-Up DP Template

```
┌─────────────────────────────────────────────────────┐
│  BOTTOM-UP WORD BREAK FRAMEWORK                     │
├─────────────────────────────────────────────────────┤
│  1. Convert wordDict to set for O(1) lookup        │
│  2. Initialize dp[0] = True (empty string valid)   │
│  3. For each position i from 1 to n:             │
│     a. For each break point j from 0 to i-1:      │
│        - If dp[j] AND s[j:i] in wordSet:          │
│          dp[i] = True, break (early term)         │
│  4. Return dp[n]                                  │
└─────────────────────────────────────────────────────┘
```

**When to use**: Standard word break, need boolean result.

### Framework 2: BFS/Graph Template

```
┌─────────────────────────────────────────────────────┐
│  BFS WORD BREAK FRAMEWORK                           │
├─────────────────────────────────────────────────────┤
│  1. Initialize queue with position 0              │
│  2. Initialize visited set to track explored     │
│  3. While queue not empty:                        │
│     a. Dequeue position 'start'                   │
│     b. If start == n: return True                 │
│     c. If visited[start]: continue                │
│     d. Mark visited[start] = True                 │
│     e. For each end from start+1 to n:            │
│        - If s[start:end] in dict: enqueue end     │
│  4. Return False (no valid path)                  │
└─────────────────────────────────────────────────────┘
```

**When to use**: Need path information, prefer iterative approach.

### Framework 3: All Segmentations Template

```
┌─────────────────────────────────────────────────────┐
│  ALL SEGMENTATIONS FRAMEWORK                        │
├─────────────────────────────────────────────────────┤
│  1. dp[i] = list of all ways to segment s[0:i]   │
│  2. Initialize dp[0] = [[]] (empty list of words) │
│  3. For each position i from 1 to n:               │
│     a. For each break point j from 0 to i-1:      │
│        - word = s[j:i]                            │
│        - If dp[j] not empty AND word in dict:     │
│          For each segmentation in dp[j]:          │
│            dp[i].append(segmentation + [word])    │
│  4. Return dp[n] (all valid segmentations)          │
└─────────────────────────────────────────────────────┘
```

**When to use**: Need all possible word break sequences.

---

## Forms

Different manifestations of the word break pattern.

### Form 1: Boolean Word Break

Determine if segmentation is possible (yes/no).

| Feature | Specification |
|---------|---------------|
| Output | Boolean |
| DP Type | 1D Boolean array |
| Space | O(n) |
| Time | O(n²) with hash set |

### Form 2: All Possible Segmentations

Return all ways to segment the string.

| Feature | Specification |
|---------|---------------|
| Output | List of word lists |
| DP Type | 1D list of lists |
| Space | O(n × output_size) |
| Time | O(n² × output_size) |

### Form 3: Minimum Words Break

Find the segmentation using fewest words.

| DP State | Definition |
|----------|------------|
| **dp[i]** | Minimum words to segment s[0:i], or infinity |
| **Transition** | `dp[i] = min(dp[i], dp[j] + 1)` if s[j:i] in dict |

### Form 4: Word Break with Trie

Use Trie for efficient prefix-based dictionary lookup.

| Feature | Benefit |
|---------|---------|
| Prefix sharing | Reduced memory for common prefixes |
| Early termination | Stop when no prefix matches |
| Character-by-char | Efficient for very long words |

### Form 5: Word Break with Length Constraints

Only consider words within specific length bounds.

```python
for j in range(max(0, i - max_len), i):
    if i - j < min_len:
        continue
    # Check s[j:i] in dict
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Hash Set Optimization

```python
def word_break_set(s: str, word_dict: list[str]) -> bool:
    """Optimized with hash set for O(1) lookups."""
    word_set = set(word_dict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break  # Early termination
    
    return dp[n]
```

### Tactic 2: Length-Based Pruning

```python
def word_break_pruned(s: str, word_dict: list[str]) -> bool:
    """Only check relevant word lengths."""
    word_set = set(word_dict)
    word_lengths = {len(word) for word in word_dict}
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for length in word_lengths:
            if i >= length and dp[i - length]:
                if s[i - length:i] in word_set:
                    dp[i] = True
                    break
    
    return dp[n]
```

### Tactic 3: Memoization (Top-Down)

```python
from functools import lru_cache

def word_break_memo(s: str, word_dict: list[str]) -> bool:
    """Top-down approach with memoization."""
    word_set = set(word_dict)
    
    @lru_cache(maxsize=None)
    def can_break(start: int) -> bool:
        if start == len(s):
            return True
        
        for end in range(start + 1, len(s) + 1):
            if s[start:end] in word_set and can_break(end):
                return True
        return False
    
    return can_break(0)
```

### Tactic 4: BFS Approach

```python
from collections import deque

def word_break_bfs(s: str, word_dict: list[str]) -> bool:
    """BFS approach for word break."""
    word_set = set(word_dict)
    n = len(s)
    visited = [False] * (n + 1)
    queue = deque([0])
    
    while queue:
        start = queue.popleft()
        
        if start == n:
            return True
        
        if visited[start]:
            continue
        
        visited[start] = True
        
        for end in range(start + 1, n + 1):
            if s[start:end] in word_set:
                queue.append(end)
    
    return False
```

### Tactic 5: Trie-Based Optimization

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_word = True

def word_break_trie(s: str, word_dict: list[str]) -> bool:
    """Word break using Trie for efficient matching."""
    trie = Trie()
    for word in word_dict:
        trie.insert(word)
    
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        node = trie.root
        for j in range(i - 1, -1, -1):
            char = s[j]
            if char not in node.children:
                break
            node = node.children[char]
            if node.is_word and dp[j]:
                dp[i] = True
                break
    
    return dp[n]
```

---

## Python Templates

### Template 1: Basic Word Break (Bottom-Up DP)

```python
def word_break(s: str, word_dict: list[str]) -> bool:
    """
    Determine if a string can be segmented into dictionary words.
    
    Time: O(n² × m) where n = len(s), m = max word length
    Space: O(n + k) where k = total characters in dictionary
    """
    # Convert to set for O(1) lookup
    word_set = set(word_dict)
    n = len(s)
    
    # dp[i] = True if s[0:i] can be segmented into dictionary words
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string can always be segmented
    
    for i in range(1, n + 1):
        for j in range(i):
            # If we can segment up to position j AND s[j:i] is a word
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break  # Early termination
    
    return dp[n]
```

### Template 2: Word Break with All Segmentations

```python
def word_break_all(s: str, word_dict: list[str]) -> list[list[str]]:
    """
    Return ALL possible word segmentations.
    
    Time: O(n² × output_size)
    Space: O(n × output_size)
    """
    word_set = set(word_dict)
    n = len(s)
    
    # dp[i] = list of all ways to segment s[0:i]
    dp = [[] for _ in range(n + 1)]
    dp[0] = [[]]  # One way to segment empty string: no words
    
    for i in range(1, n + 1):
        for j in range(i):
            word = s[j:i]
            if dp[j] and word in word_set:
                for partial in dp[j]:
                    dp[i].append(partial + [word])
    
    return dp[n]
```

### Template 3: Minimum Word Break

```python
def word_break_min_words(s: str, word_dict: list[str]) -> int:
    """
    Find minimum number of words needed to segment the string.
    
    Returns: Minimum number of words, or -1 if not possible
    Time: O(n²)
    Space: O(n)
    """
    word_set = set(word_dict)
    n = len(s)
    
    # dp[i] = minimum words to segment s[0:i], or infinity if not possible
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    
    for i in range(1, n + 1):
        for j in range(i):
            word = s[j:i]
            if dp[j] != float('inf') and word in word_set:
                dp[i] = min(dp[i], dp[j] + 1)
    
    return dp[n] if dp[n] != float('inf') else -1
```

### Template 4: Word Break II (All Sentences)

```python
def word_break_ii(s: str, word_dict: list[str]) -> list[str]:
    """
    Return all sentences formed by segmenting the string.
    Each sentence is a space-separated string of dictionary words.
    
    Time: O(n² × output_size)
    Space: O(n × output_size)
    """
    word_set = set(word_dict)
    n = len(s)
    
    dp = [[] for _ in range(n + 1)]
    dp[0] = [""]  # Empty sentence for empty string
    
    for i in range(1, n + 1):
        for j in range(i):
            word = s[j:i]
            if word in word_set and dp[j]:
                for sentence in dp[j]:
                    dp[i].append((sentence + " " + word).strip())
    
    return dp[n]
```

### Template 5: Word Break with Length Optimization

```python
def word_break_optimized(s: str, word_dict: list[str]) -> bool:
    """
    Optimized word break using word length pre-processing.
    Only checks substrings of lengths present in dictionary.
    
    Time: O(n × L × avg_lookup) where L = number of unique lengths
    Space: O(n + k)
    """
    word_set = set(word_dict)
    word_lengths = {len(word) for word in word_dict}
    n = len(s)
    
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for length in word_lengths:
            if i >= length and dp[i - length]:
                if s[i - length:i] in word_set:
                    dp[i] = True
                    break
    
    return dp[n]
```

### Template 6: Concatenated Words Detection

```python
def find_concatenated_words(words: list[str]) -> list[str]:
    """
    Find all words that can be formed by concatenating other words in the list.
    
    Time: O(n × L²) where n = number of words, L = average length
    Space: O(n × L)
    """
    word_set = set(words)
    result = []
    
    def can_form(word: str) -> bool:
        """Check if word can be formed by concatenating other words."""
        n = len(word)
        dp = [False] * (n + 1)
        dp[0] = True
        
        for i in range(1, n + 1):
            for j in range(i):
                if dp[j] and word[j:i] in word_set and word[j:i] != word:
                    dp[i] = True
                    break
        
        return dp[n]
    
    # Sort by length to ensure shorter words are processed first
    for word in sorted(words, key=len):
        if can_form(word):
            result.append(word)
        # Don't add to word_set until after checking
    
    return result
```

---

## When to Use

Use the Word Break algorithm when you need to solve problems involving:

- **Text Segmentation**: Breaking text into meaningful words
- **Dictionary Matching**: Checking if text can be formed from dictionary words
- **String Partitioning**: Dividing a string into valid segments
- **Autocomplete Systems**: Validating user input against a dictionary
- **Spell Checking**: Determining if text can be broken into valid words

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|-----------------|------------------|---------------|
| **DP (Bottom-up)** | O(n² × m) | O(n) | Most cases, simple implementation |
| **DP with Trie** | O(n²) avg, O(n × m) best | O(n + m) | Dictionary-heavy, long words |
| **BFS/DFS** | O(n²) | O(n) | Finding all segmentations |
| **Memoization** | O(n²) | O(n) | Recursive, top-down approach |

### When to Choose Each Approach

- **Choose Basic DP** when:
  - Dictionary is small to medium
  - Simplicity is preferred
  - Need quick implementation

- **Choose BFS/DFS** when:
  - Need to find all possible segmentations
  - Memory is constrained
  - Working with graphs/tree structures

- **Choose Trie-based** when:
  - Dictionary is very large
  - Words have common prefixes
  - Need optimized lookups

---

## Algorithm Explanation

### Core Concept

The key insight behind the Word Break problem is that we can determine if a string can be segmented by building up solutions for smaller substrings. We use dynamic programming where each state represents whether a prefix of the string can be segmented into dictionary words.

### How It Works

#### Dynamic Programming Approach:

1. **Define DP State**: `dp[i]` = True if the substring `s[0:i]` can be segmented into dictionary words
2. **Initialize**: `dp[0]` = True (empty string can always be segmented)
3. **Transition**: For each position i from 1 to n:
   - Check all positions j from 0 to i-1
   - If `dp[j]` is True AND `s[j:i]` is in the dictionary, then `dp[i]` = True
4. **Result**: Return `dp[n]`

### Visual Representation

For string `s = "leetcode"` and dictionary `["leet", "code"]`:

```
Index:    0    1    2    3    4    5    6    7    8
String:   l    e    e    t    c    o    d    e
          ├────┤
          dp[4]=True (leet)
                   ├────┤
                   dp[8]=True (code)
                   
dp[0] = True (empty string)
dp[4] = True (s[0:4] = "leet" is in dict)
dp[8] = True (s[4:8] = "code" is in dict AND dp[4]=True)
```

### Why This Works

- **Optimal Substructure**: If we can segment up to position j, and substring from j to i is a word, then we can segment up to i
- **Overlapping Subproblems**: We consider all possible break points, avoiding redundant computation
- **Building Up**: We progressively build solutions for longer prefixes from shorter ones

### Optimization Techniques

1. **Set-based Lookup**: Convert dictionary to a hash set for O(1) word lookup
2. **Early Termination**: Stop checking once `dp[i]` becomes True
3. **Trie Structure**: Use Trie for efficient prefix matching
4. **Length-based Pruning**: Only check words that could fit

### Limitations

- **Time Complexity**: O(n²) can be slow for very long strings
- **Space**: Uses O(n) space for DP array
- **Dictionary Size**: Performance depends on dictionary size and word lengths

---

## Practice Problems

### Problem 1: Word Break (Classic)

**Problem:** [LeetCode 139 - Word Break](https://leetcode.com/problems/word-break/)

**Description:** Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of dictionary words.

**How to Apply Word Break:**
- Use DP where `dp[i]` represents if `s[0:i]` can be segmented
- Convert dictionary to set for O(1) lookup
- Iterate through all possible break points

---

### Problem 2: Word Break II

**Problem:** [LeetCode 140 - Word Break II](https://leetcode.com/problems/word-break-ii/)

**Description:** Given a string `s` and a dictionary of strings `wordDict`, add spaces to construct a sentence where each word is in the dictionary. Return all such possible sentences.

**How to Apply Word Break:**
- Extend the DP approach to store all possible segmentations
- Use backtracking or DP to build all sentences
- Consider memoization for optimization

---

### Problem 3: Concatenated Words

**Problem:** [LeetCode 472 - Concatenated Words](https://leetcode.com/problems/concatenated-words/)

**Description:** Given an array of strings `words`, return all concatenated words in the given list of words. A concatenated word is defined as a word that can be constructed by taking two or more other words from the list.

**How to Apply Word Break:**
- Sort words by length
- For each word, check if it can be broken using previously processed shorter words
- Use the same DP approach with the dictionary being previously processed words

---

### Problem 4: Palindrome Partitioning IV

**Problem:** [LeetCode 1745 - Palindrome Partitioning IV](https://leetcode.com/problems/palindrome-partitioning-iv/)

**Description:** Given a string `s`, return true if you can partition `s` such that each substring of the partition is a palindrome, with the constraint that you can use at most `k` substrings.

**How to Apply Word Break:**
- Combine word break logic with palindrome checking
- Use DP to track both valid segmentation and count
- Precompute palindrome table for O(1) lookups

---

### Problem 5: Minimum Number of Operations to Make Array Equal

**Problem:** [LeetCode 1775 - Minimum Number of Operations to Make Array Equal](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-equal/)

**Description:** You are given two arrays of integers `nums1` and `nums2`, possibly of different lengths. The values in the arrays are between 1 and 6, inclusive. In one operation, you can change any integer's value in any of the arrays to any value between 1 and 6, inclusive. Return the minimum number of operations required to make the sum of values in `nums1` equal to the sum of values in `nums2`.

**How to Apply Word Break:**
- Adapt the DP approach to work with difference tracking
- Similar state building: can we achieve a certain difference?
- Use the minimum operations variant pattern

---

## Video Tutorial Links

### Fundamentals

- [Word Break Problem - Dynamic Programming (Take U Forward)](https://www.youtube.com/watch?v=Sx9NNgInc3E) - Comprehensive introduction
- [Word Break LeetCode Solution (NeetCode)](https://www.youtube.com/watch?v=hL1pm8X4uD8) - Practical implementation
- [Dynamic Programming Pattern (BacktoBack SWE)](https://www.youtube.com/watch?v=ythL3bA29vc) - DP patterns

### Advanced Topics

- [Word Break II - All Segmentations](https://www.youtube.com/watch?v=puXav0wD1_I) - Generating all solutions
- [Trie-based Word Break](https://www.youtube.com/watch?v=2mxMXqT3G6E) - Optimized approach
- [Word Break with BFS](https://www.youtube.com/watch?v=Wq8bG3cK1fU) - Graph-based solution

---

## Follow-up Questions

### Q1: Can Word Break be solved without DP?

**Answer:** Yes, there are alternative approaches:
- **BFS/DFS**: Treat the string as a graph where edges connect valid word boundaries
- **Recursive with Memoization**: Top-down approach that caches results
- **Trie-based**: Use Trie for efficient prefix matching
- However, DP is often the most intuitive and commonly used approach

---

### Q2: How do you handle very large dictionaries?

**Answer:** For large dictionaries:
- **Use Trie**: Efficient for prefix matching, especially with common prefixes
- **Sort and Binary Search**: Sort dictionary, use binary search for lookups
- **Hash-based**: Use hash set for O(1) lookups
- **Filter irrelevant words**: Remove words longer than the input string

---

### Q3: What is the time complexity if dictionary contains very long words?

**Answer:** With long words in dictionary:
- Substring extraction becomes more expensive: O(m) where m is word length
- Total: O(n² × m) where m is max word length
- Optimization: Pre-compute substring hashes, use rolling hash for O(1) comparison

---

### Q4: How does Word Break relate to other DP problems?

**Answer:** Word Break is foundational for:
- **House Robber**: Similar DP structure, choosing or not choosing
- **Coin Change**: Partition problem variant
- **Palindrome Partitioning**: Uses similar breaking point approach
- **Climbing Stairs**: Basic 1D DP pattern

---

### Q5: Can Word Break be solved in O(n × max_word_length)?

**Answer:** Yes, with optimization:
- Instead of checking all j positions, only check words that could fit
- Pre-process dictionary by length
- Use Trie to only traverse valid prefixes
- This reduces complexity from O(n²) to O(n × L) where L is max word length

---

## Summary

The Word Break problem is a fundamental dynamic programming problem with many practical applications in text processing and natural language processing. Key takeaways:

- **DP Approach**: Build solutions for smaller substrings progressively
- **Time Complexity**: O(n²) with hash set, can be optimized to O(n × L)
- **Space Complexity**: O(n) for DP array plus O(k) for dictionary
- **Variations**: Multiple extensions including all segmentations, minimum words
- **Optimization**: Use Trie or length-based pruning for large dictionaries

### When to use:
- ✅ Text segmentation and word validation
- ✅ Dictionary-based string processing
- ✅ Autocomplete and spell checking
- ✅ Problems requiring string partitioning
- ❌ When order doesn't matter (use combination problems instead)

This algorithm is essential for competitive programming and technical interviews, particularly in companies working with text processing, search engines, or language applications.
