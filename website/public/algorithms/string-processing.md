# String Processing Techniques

## Category
Strings & Text Processing

## Description

String processing encompasses fundamental techniques for efficient string manipulation, including building, searching, transforming, and analyzing text data. These operations form the foundation for more complex string algorithms like KMP, Z-algorithm, and suffix arrays.

Efficient string handling is crucial in modern software development, from building large text outputs without O(n²) complexity to preparing strings for pattern matching algorithms. Understanding these techniques prevents common pitfalls like inefficient concatenation and helps optimize performance-critical text processing code.

---

## Concepts

String processing relies on fundamental computer science concepts for text manipulation.

### 1. String Immutability

| Language | String Type | Implication |
|----------|-------------|-------------|
| **Python** | Immutable | Each "modification" creates new string |
| **Java** | Immutable | StringBuilder needed for efficiency |
| **C++** | Mutable | Can modify in-place with care |
| **JavaScript** | Immutable | Array join pattern for building |

### 2. Efficient String Building

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Concatenation in loop** | O(n²) | O(n) | Small strings only |
| **List + join()** | O(n) | O(n) | Python, most cases |
| **StringBuilder** | O(n) | O(n) | Java, C# |
| **StringIO** | O(n) | O(n) | Very large strings |
| **Array join** | O(n) | O(n) | JavaScript |

### 3. Character Operations

| Operation | Python | Java | C++ | JavaScript |
|-----------|--------|------|-----|------------|
| **Get char** | s[i] | s.charAt(i) | s[i] | s[i] |
| **Substring** | s[i:j] | s.substring(i,j) | s.substr(i,len) | s.slice(i,j) |
| **Length** | len(s) | s.length() | s.length() | s.length |
| **Compare** | s == t | s.equals(t) | s == t | s === t |

### 4. Common Encodings

| Encoding | Characters | Bytes per char | Use Case |
|----------|------------|----------------|----------|
| **ASCII** | 128 | 1 | English text |
| **UTF-8** | All Unicode | 1-4 | Web, modern apps |
| **UTF-16** | All Unicode | 2-4 | Java, Windows |

---

## Frameworks

Structured approaches for string processing.

### Framework 1: Efficient String Building

```
┌─────────────────────────────────────────────────────────────┐
│  EFFICIENT STRING CONSTRUCTION                               │
├─────────────────────────────────────────────────────────────┤
│  Python: Use list + join()                                   │
│  1. Initialize: chars = []                                   │
│  2. For each part:                                           │
│     - chars.append(part)                                    │
│  3. Return: ''.join(chars)                                  │
│                                                              │
│  Java: Use StringBuilder                                     │
│  1. Initialize: sb = new StringBuilder()                     │
│  2. For each part:                                           │
│     - sb.append(part)                                       │
│  3. Return: sb.toString()                                    │
│                                                              │
│  JavaScript: Use array + join()                            │
│  1. Initialize: parts = []                                   │
│  2. For each part:                                           │
│     - parts.push(part)                                      │
│  3. Return: parts.join('')                                  │
│                                                              │
│  Avoid: Repeated concatenation in loops (O(n²))             │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Building strings from multiple parts in loops.

### Framework 2: Two-Pointer String Processing

```
┌─────────────────────────────────────────────────────────────┐
│  TWO-POINTER STRING TECHNIQUES                               │
├─────────────────────────────────────────────────────────────┤
│  Pattern 1: Palindrome check                                 │
│   left = 0, right = len(s) - 1                             │
│   while left < right:                                        │
│     - Compare s[left] and s[right]                          │
│     - left++, right--                                       │
│                                                              │
│  Pattern 2: Reversal                                         │
│   while left < right:                                        │
│     - Swap s[left] and s[right]                            │
│     - left++, right--                                       │
│                                                              │
│  Pattern 3: Filtering (skip unwanted chars)                 │
│   while left <= right:                                       │
│     - Skip non-target chars from left                       │
│     - Skip non-target chars from right                      │
│     - Process valid chars                                    │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Palindromes, reversal, filtering, merging.

### Framework 3: String Preprocessing for Algorithms

```
┌─────────────────────────────────────────────────────────────┐
│  PREPARING STRINGS FOR PATTERN MATCHING                      │
├─────────────────────────────────────────────────────────────┤
│  1. Normalization:                                           │
│     - Case: text.lower() or text.upper()                    │
│     - Whitespace: text.strip()                               │
│     - Special chars: remove or normalize                    │
│                                                              │
│  2. Character array conversion:                             │
│     - chars = list(text) for in-place operations           │
│                                                              │
│  3. Encoding handling:                                      │
│     - Ensure consistent encoding (UTF-8)                    │
│     - Handle multi-byte characters carefully                │
│                                                              │
│  4. Boundary markers:                                       │
│     - Add sentinel values for algorithms                     │
│     - Example: '#' separator for KMP                        │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Before applying string algorithms.

---

## Forms

Different manifestations of string processing.

### Form 1: String Building Patterns

| Pattern | Python | Java | JavaScript |
|---------|--------|------|------------|
| **List join** | `''.join(parts)` | N/A | `parts.join('')` |
| **StringBuilder** | (use io.StringIO) | `StringBuilder` | (use array) |
| **Concat** | `a + b` (limited) | `a + b` (limited) | `a + b` (limited) |

### Form 2: Reversal Techniques

| Approach | Time | Space | In-place |
|----------|------|-------|----------|
| **Slicing** | O(n) | O(n) | No |
| **Two-pointer swap** | O(n) | O(1) | Yes (char array) |
| **Recursive** | O(n) | O(n) | No |

### Form 3: Comparison Methods

| Method | Case-sensitive | Unicode-aware | Use Case |
|--------|----------------|---------------|----------|
| **== / equals** | Yes | Yes | Exact match |
| **equalsIgnoreCase** | No | Yes | Case-insensitive |
| **localeCompare** | Configurable | Yes | Sorting |
| **Collator** | Configurable | Yes | Proper sorting |

---

## Tactics

Specific techniques for string processing.

### Tactic 1: Efficient String Building in Python

Avoid O(n²) concatenation:

```python
# Python: Use list + join (most efficient)
def build_string_efficiently(parts):
    """
    Build string from multiple parts efficiently.
    Time: O(n), Space: O(n)
    """
    chars = []
    for part in parts:
        chars.append(part)
    return ''.join(chars)

# Or use io.StringIO for large strings
from io import StringIO

def build_large_string(chunks):
    """
    Efficient for very large string construction.
    """
    buffer = StringIO()
    for chunk in chunks:
        buffer.write(chunk)
    return buffer.getvalue()

# Compare: Inefficient vs Efficient
def inefficient_concat(items):
    """O(n²) - creates new string each iteration"""
    result = ""
    for item in items:
        result += item  # New string created each time!
    return result

def efficient_concat(items):
    """O(n) - linear time"""
    return ''.join(items)
```

**Why**: Python strings are immutable; += creates new string objects.

### Tactic 2: String Reversal

Multiple approaches:

```python
def reverse_string(s):
    """
    Reverse string using slicing.
    Time: O(n), Space: O(n) for new string
    """
    return s[::-1]

def reverse_in_place(chars):
    """
    In-place reversal for mutable char arrays.
    Time: O(n), Space: O(1)
    """
    left, right = 0, len(chars) - 1
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
    return chars

def reverse_words(sentence):
    """
    Reverse each word in a sentence.
    """
    words = sentence.split()
    reversed_words = [word[::-1] for word in words]
    return ' '.join(reversed_words)
```

### Tactic 3: Palindrome Check

Two-pointer technique:

```python
def is_palindrome(s):
    """
    Check if string is palindrome.
    Time: O(n), Space: O(1)
    """
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True

def is_palindrome_clean(s):
    """
    Check palindrome ignoring non-alphanumeric and case.
    """
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]
```

**Optimization**: Filter first, then check.

### Tactic 4: String Compression

Run-length encoding:

```python
def compress_run_length(s):
    """
    Run-length encoding.
    Time: O(n), Space: O(n)
    """
    if not s:
        return ""
    
    result = []
    count = 1
    
    for i in range(1, len(s)):
        if s[i] == s[i-1]:
            count += 1
        else:
            result.append(s[i-1] + str(count))
            count = 1
    
    result.append(s[-1] + str(count))
    return ''.join(result)

def decompress_run_length(s):
    """
    Decompress RLE string like "a3b2" -> "aaabb".
    """
    result = []
    i = 0
    while i < len(s):
        char = s[i]
        i += 1
        count = 0
        while i < len(s) and s[i].isdigit():
            count = count * 10 + int(s[i])
            i += 1
        result.append(char * count)
    return ''.join(result)
```

**Application**: Simple compression schemes.

### Tactic 5: Anagram Check

Character frequency comparison:

```python
from collections import Counter

def is_anagram_hashmap(s, t):
    """
    Using hash map counter.
    Time: O(n), Space: O(k) where k = unique chars
    """
    return Counter(s) == Counter(t)

def is_anagram_array(s, t):
    """
    Using fixed-size array for lowercase letters.
    Time: O(n), Space: O(1)
    """
    if len(s) != len(t):
        return False
    
    count = [0] * 26
    for c in s:
        count[ord(c) - ord('a')] += 1
    for c in t:
        count[ord(c) - ord('a')] -= 1
        if count[ord(c) - ord('a')] < 0:
            return False
    return True
```

**Trade-off**: Hashmap is more general, array is faster for ASCII.

---

## Python Templates

### Template 1: Efficient String Builder

```python
def build_string_efficiently(parts):
    """
    Build string from multiple parts efficiently.
    
    Uses list append + join() pattern which is O(n) total.
    Avoids O(n²) string concatenation in loops.
    
    Time: O(n)
    Space: O(n)
    """
    chars = []
    for part in parts:
        chars.append(part)
    return ''.join(chars)
```

### Template 2: String Reversal

```python
def reverse_string(s: str) -> str:
    """
    Reverse string using slicing.
    
    Time: O(n)
    Space: O(n) for new string
    """
    return s[::-1]

def reverse_in_place(chars: list) -> list:
    """
    In-place reversal for mutable char array.
    
    Time: O(n)
    Space: O(1)
    """
    left, right = 0, len(chars) - 1
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
    return chars
```

### Template 3: Palindrome Check

```python
def is_palindrome(s: str) -> bool:
    """
    Check if string is palindrome.
    
    Time: O(n)
    Space: O(1)
    """
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True
```

### Template 4: Anagram Check

```python
def is_anagram(s: str, t: str) -> bool:
    """
    Check if two strings are anagrams.
    
    Uses character counting with array (for lowercase a-z).
    
    Time: O(n)
    Space: O(1) - fixed 26-element array
    """
    if len(s) != len(t):
        return False
    
    count = [0] * 26
    for c in s:
        count[ord(c) - ord('a')] += 1
    for c in t:
        idx = ord(c) - ord('a')
        count[idx] -= 1
        if count[idx] < 0:
            return False
    return True
```

### Template 5: Run-Length Encoding

```python
def compress_run_length(s: str) -> str:
    """
    Run-length encoding of string.
    
    Example: "aaabbc" -> "a3b2c1"
    
    Time: O(n)
    Space: O(n)
    """
    if not s:
        return ""
    
    result = []
    count = 1
    
    for i in range(1, len(s)):
        if s[i] == s[i-1]:
            count += 1
        else:
            result.append(s[i-1] + str(count))
            count = 1
    
    result.append(s[-1] + str(count))
    return ''.join(result)
```

---

## When to Use

Use these string processing techniques when you need to:

- **Build large strings efficiently**: Avoid O(n²) concatenation
- **Check for palindromes**: Two-pointer technique
- **Compare strings**: Case handling, Unicode considerations
- **Transform strings**: Reversal, compression, filtering
- **Preprocess for algorithms**: Normalization, encoding

### Common String Processing Patterns

| Pattern | Use Case | Complexity |
|---------|----------|------------|
| **List + join** | Building strings | O(n) |
| **Two pointers** | Palindromes, reversal | O(n) |
| **Character counting** | Anagrams, frequency | O(n) |
| **StringIO** | Very large strings | O(n) |
| **Slicing** | Substring, reversal | O(k) |

---

## Algorithm Explanation

### Core Concept

Efficient string processing requires understanding:
1. **Immutability implications** - Every "modification" may create new objects
2. **Building patterns** - Accumulate in list/array, join at end
3. **Two-pointer technique** - Process from both ends simultaneously

### Why StringBuilder Pattern Works

```
Inefficient: result += part (creates new string each time)
             Total: n + (n-1) + ... + 1 = O(n²)

Efficient:  parts.append(part) (amortized O(1))
            ''.join(parts) (O(n) once at end)
            Total: O(n)
```

### Visual Walkthrough

**Two-Pointer Palindrome**:
```
String: "radar"

Step 1: left=0 ('r'), right=4 ('r')
        Match! left=1, right=3

Step 2: left=1 ('a'), right=3 ('a')
        Match! left=2, right=2

Step 3: left == right, done
        Return True ✓
```

---

## Practice Problems

### Problem 1: String Compression

**Problem:** [LeetCode 443 - String Compression](https://leetcode.com/problems/string-compression/)

**Description:** Compress array of characters using run-length encoding.

**How to Apply:**
- Two-pointer technique
- In-place compression
- Count consecutive characters

---

### Problem 2: Valid Anagram

**Problem:** [LeetCode 242 - Valid Anagram](https://leetcode.com/problems/valid-anagram/)

**Description:** Given two strings s and t, return true if t is an anagram of s.

**How to Apply:**
- Character frequency counting
- Use array or hash map
- Early termination on mismatch

---

### Problem 3: Group Anagrams

**Problem:** [LeetCode 49 - Group Anagrams](https://leetcode.com/problems/group-anagrams/)

**Description:** Given an array of strings, group anagrams together.

**How to Apply:**
- Sort characters or count frequency as key
- Hash map grouping
- String processing for key generation

---

### Problem 4: Valid Palindrome

**Problem:** [LeetCode 125 - Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)

**Description:** Determine if a string is a palindrome, considering only alphanumeric characters.

**How to Apply:**
- Two pointers with filtering
- Skip non-alphanumeric
- Case-insensitive comparison

---

### Problem 5: Reverse String

**Problem:** [LeetCode 344 - Reverse String](https://leetcode.com/problems/reverse-string/)

**Description:** Write a function that reverses a string in-place.

**How to Apply:**
- Two-pointer swap technique
- In-place modification of character array
- O(n/2) swaps

---

## Video Tutorial Links

### Fundamentals

- [String Processing in Python](https://www.youtube.com/watch?v=P8wYhN.tYFg) - Efficient techniques
- [Two Pointer Technique](https://www.youtube.com/watch?v=OnUj3bOmsYw) - String problems
- [String Builder Pattern](https://www.youtube.com/watch?v=h9R4O8_Lk08) - Performance

### Problem Solutions

- [LeetCode 443 Solution](https://www.youtube.com/watch?v=8n_wt7_N3R4) - String Compression
- [LeetCode 242 Solution](https://www.youtube.com/watch?v=IRvMo6E_4xg) - Valid Anagram
- [LeetCode 49 Solution](https://www.youtube.com/watch?v=vzdNOKWlO0Q) - Group Anagrams

---

## Follow-up Questions

### Q1: Why is string concatenation O(n²) in Python?

**Answer**: Strings in Python are immutable. Each `+=` operation creates a new string object by copying all characters from the left string and appending the right string. For n operations adding characters one by one, the total work is n + (n-1) + (n-2) + ... + 1 = O(n²).

### Q2: When should I use StringIO vs list + join()?

**Answer**: 
- **List + join()**: Most Pythonic, fastest for typical cases
- **StringIO**: Better for very large strings, file-like interface, or when you need to interleave reads and writes

### Q3: How do I handle Unicode characters in string processing?

**Answer**: 
- Use Python 3's native Unicode strings
- Be careful with len() on multi-byte characters (it counts code points)
- Use grapheme clusters for true "character" counting
- Consider using libraries like `unicodedata` for normalization

### Q4: What's the most efficient way to reverse a string?

**Answer**: 
- **Python**: Slicing `s[::-1]` is optimized in C
- **Java**: StringBuilder(s).reverse()
- **C++**: std::reverse(s.begin(), s.end()) for mutable strings
- **General**: Two-pointer swap for in-place reversal

### Q5: How do I compare strings properly across different cases?

**Answer**:
- For ASCII: Convert both to lower (or upper) case first
- For Unicode: Use casefold() for case-insensitive comparison
- For locale-aware: Use locale-specific comparison functions
- Remember: normalization may be needed for Unicode equivalence

---

## Summary

String processing techniques form the foundation for efficient text manipulation and preparation for advanced algorithms. Understanding immutability implications and efficient building patterns is essential for writing performant string code.

**Key Takeaways:**

1. **Avoid loop concatenation**: Use list + join() pattern
2. **Two-pointer technique**: Efficient for palindromes and reversal
3. **Immutability matters**: Every "modification" creates new objects
4. **Character arrays**: Convert for in-place modifications
5. **Unicode awareness**: Handle multi-byte characters properly

**When to Use:**
- Building large strings from parts
- Palindrome checking and string reversal
- Anagram and frequency problems
- Preprocessing for pattern matching
- Any text transformation tasks

These fundamental techniques are prerequisites for advanced string algorithms and are frequently tested in technical interviews.
