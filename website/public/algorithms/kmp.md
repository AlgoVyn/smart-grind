# KMP Algorithm (Knuth-Morris-Pratt)

## Category
Strings & Pattern Matching

## Description

The Knuth-Morris-Pratt (KMP) algorithm is an efficient string matching algorithm that finds all occurrences of a pattern string within a text string in O(n + m) time, where n is the text length and m is the pattern length. It was discovered by Donald Knuth, James H. Morris, and Vaughan Pratt in 1977.

Unlike naive string matching which re-starts from the beginning of the pattern after each mismatch, KMP uses a pre-computed failure function (also called LPS array) to intelligently skip characters that have already been matched, ensuring no character is compared more than once.

---

## Concepts

The KMP algorithm is built on several fundamental concepts that make it powerful for string matching.

### 1. LPS Array (Longest Prefix Suffix)

The LPS array stores the length of the longest proper prefix which is also a suffix for each position:

| Index | Pattern | LPS | Meaning |
|-------|---------|-----|---------|
| 0 | A | 0 | No proper prefix |
| 1 | B | 0 | No matching prefix-suffix |
| 2 | A | 1 | "A" is both prefix and suffix |
| 3 | B | 2 | "AB" is both prefix and suffix |
| 4 | C | 0 | No matching prefix-suffix |

For pattern "ABABC":
```
Pattern: A B A B C
LPS:     0 0 1 2 0
```

### 2. Proper Prefix and Suffix

- **Proper Prefix**: All prefixes except the string itself
  - For "ABC": "", "A", "AB"
- **Proper Suffix**: All suffixes except the string itself
  - For "ABC": "", "C", "BC"

### 3. Failure Function

When a mismatch occurs at position `j` in pattern:
```
New j = LPS[j-1]  // Length of longest proper prefix that matches suffix
```

This tells us how much of the pattern we can reuse without rechecking.

### 4. Border Concept

A border is a string that is both a proper prefix and suffix:

```
Pattern: ABACABA
Borders: "A", "ABA", "ABACABA" (not proper)
Proper borders: "A", "ABA"

LPS at last position = 3 ("ABA")
```

---

## Frameworks

Structured approaches for solving string matching problems.

### Framework 1: Building LPS Array

```
┌─────────────────────────────────────────────────────┐
│  LPS ARRAY CONSTRUCTION                               │
├─────────────────────────────────────────────────────┤
│  Input: pattern of length m                          │
│  Output: lps array of length m                       │
│                                                      │
│  1. Initialize: lps[0] = 0, length = 0, i = 1      │
│  2. While i < m:                                      │
│     a. If pattern[i] == pattern[length]:            │
│        - length += 1                                 │
│        - lps[i] = length                             │
│        - i += 1                                      │
│     b. Else if length != 0:                         │
│        - length = lps[length - 1]                    │
│        - Don't increment i                           │
│     c. Else:                                         │
│        - lps[i] = 0                                  │
│        - i += 1                                      │
│  3. Return lps array                                 │
└─────────────────────────────────────────────────────┘
```

**When to use**: Preprocessing phase before pattern matching.

### Framework 2: KMP Pattern Matching

```
┌─────────────────────────────────────────────────────┐
│  KMP PATTERN MATCHING                                 │
├─────────────────────────────────────────────────────┤
│  Input: text (length n), pattern (length m)          │
│  Output: list of starting indices of matches         │
│                                                      │
│  1. Compute lps array for pattern                    │
│  2. Initialize: i = 0 (text index), j = 0 (pattern)  │
│  3. While i < n:                                     │
│     a. If text[i] == pattern[j]:                    │
│        - i += 1, j += 1                              │
│        - If j == m: Match found at i-j!              │
│          → Add (i-j) to results                      │
│          → j = lps[j-1] (continue searching)        │
│     b. Else if j != 0:                               │
│        - j = lps[j-1] (use failure function)         │
│     c. Else:                                         │
│        - i += 1 (move to next character in text)     │
│  4. Return all match positions                       │
└─────────────────────────────────────────────────────┘
```

**When to use**: Main pattern matching phase after LPS construction.

### Framework 3: String Matching Decision

```
┌─────────────────────────────────────────────────────┐
│  CHOOSING STRING MATCHING ALGORITHM                   │
├─────────────────────────────────────────────────────┤
│  Use KMP when:                                       │
│    ✓ Guaranteed O(n+m) needed                        │
│    ✓ Pattern preprocessing is acceptable              │
│    ✓ Multiple searches with same pattern            │
│    ✓ Pattern contains repeated subpatterns          │
│                                                      │
│  Use Naive when:                                     │
│    ✓ Very short strings                             │
│    ✓ Simple implementation needed                   │
│    ✓ No repeated patterns expected                  │
│                                                      │
│  Use Rabin-Karp when:                                │
│    ✓ Multiple pattern search needed                 │
│    ✓ Can tolerate hash collisions                   │
│    ✓ Need rolling hash for other purposes           │
└─────────────────────────────────────────────────────┘
```

---

## Forms

Different manifestations of the KMP pattern.

### Form 1: Find All Occurrences

Returns all starting indices of pattern in text.

| Type | Return Value | Use Case |
|------|--------------|----------|
| **All matches** | List of indices | Finding all occurrences |
| **First match** | Single index or -1 | `strStr()` implementation |
| **Count only** | Integer | Counting occurrences |

### Form 2: Repeated Substring Detection

Uses LPS array to check if string is made of repeated substrings:

```
If lps[n-1] > 0 and n % (n - lps[n-1]) == 0:
    String is repeated!

Example: "abcabcabc"
LPS: [0, 0, 0, 1, 2, 3, 4, 5, 6]
lps[8] = 6, n - lps[8] = 3
9 % 3 == 0 → Repeated pattern of length 3
```

### Form 3: Shortest Palindrome Construction

Uses KMP to find longest palindromic prefix:

```
Concatenate: s + '#' + reverse(s)
Build LPS, last value gives longest palindromic prefix length
```

### Form 4: String Rotation Check

Check if one string is rotation of another:

```
s2 is rotation of s1 iff s2 is substring of s1+s1
Use KMP to search for s2 in s1+s1
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: First Occurrence Only

Optimized search that returns immediately on first match:

```python
def kmp_first_occurrence(text: str, pattern: str) -> int:
    """Find first occurrence, return -1 if not found."""
    n, m = len(text), len(pattern)
    if m == 0:
        return 0
    if n == 0 or m > n:
        return -1
    
    lps = compute_lps(pattern)
    i = j = 0
    
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == m:
                return i - j
        elif j != 0:
            j = lps[j - 1]
        else:
            i += 1
    
    return -1
```

### Tactic 2: Count Occurrences (Space Optimized)

Count without storing all positions:

```python
def kmp_count(text: str, pattern: str) -> int:
    """Count total occurrences without storing positions."""
    n, m = len(text), len(pattern)
    if m == 0:
        return n + 1
    if n == 0 or m > n:
        return 0
    
    lps = compute_lps(pattern)
    count = 0
    i = j = 0
    
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == m:
                count += 1
                j = lps[j - 1]
        elif j != 0:
            j = lps[j - 1]
        else:
            i += 1
    
    return count
```

### Tactic 3: Non-Overlapping Matches

Find matches that don't overlap:

```python
def kmp_non_overlapping(text: str, pattern: str) -> list[int]:
    """Find non-overlapping occurrences only."""
    n, m = len(text), len(pattern)
    if m == 0:
        return list(range(n + 1))
    if n == 0 or m > n:
        return []
    
    lps = compute_lps(pattern)
    result = []
    i = j = 0
    
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == m:
                result.append(i - j)
                j = 0  # Reset for non-overlapping
        elif j != 0:
            j = lps[j - 1]
        else:
            i += 1
    
    return result
```

### Tactic 4: Check Repeated Substring Pattern

Use LPS to check if string is made of repeated substring:

```python
def is_repeated_substring(s: str) -> bool:
    """Check if string is made of repeated substring."""
    n = len(s)
    if n <= 1:
        return False
    
    lps = compute_lps(s)
    length = lps[n - 1]
    
    # String is repeated if:
    # 1. LPS of last position > 0 (there is a border)
    # 2. Length is divisible by (n - border_length)
    return length > 0 and n % (n - length) == 0
```

### Tactic 5: Shortest Palindrome Using KMP

Add minimum characters to front to make palindrome:

```python
def shortest_palindrome(s: str) -> str:
    """Add minimum characters to front to make palindrome."""
    if not s:
        return s
    
    # Create combined string: s + '#' + reverse(s)
    rev = s[::-1]
    combined = s + '#' + rev
    
    # Build LPS array
    lps = compute_lps(combined)
    
    # Length of longest palindromic prefix
    palindrome_len = lps[-1]
    
    # Characters to add = reverse of remaining suffix
    to_add = rev[:len(s) - palindrome_len]
    
    return to_add + s
```

---

## Python Templates

### Template 1: Compute LPS Array

```python
def compute_lps(pattern: str) -> list[int]:
    """
    Compute the LPS (Longest Prefix Suffix) array for KMP.
    
    lps[i] = length of longest proper prefix that is also suffix
             for pattern[0..i]
    
    Time: O(m) where m = pattern length
    Space: O(m)
    """
    m = len(pattern)
    lps = [0] * m
    length = 0  # Length of previous longest prefix suffix
    
    i = 1
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                # Try shorter prefix
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    
    return lps
```

### Template 2: KMP Pattern Matching (All Occurrences)

```python
def kmp_search(text: str, pattern: str) -> list[int]:
    """
    Find all occurrences of pattern in text using KMP.
    
    Returns list of starting indices where pattern occurs.
    
    Time: O(n + m)
    Space: O(m) for LPS array
    """
    n, m = len(text), len(pattern)
    
    # Edge cases
    if m == 0:
        return list(range(n + 1))
    if n == 0 or m > n:
        return []
    
    # Step 1: Build LPS array
    lps = compute_lps(pattern)
    
    # Step 2: Search for pattern
    result = []
    i = 0  # Index for text
    j = 0  # Index for pattern
    
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
            
            if j == m:
                # Full match found
                result.append(i - j)
                j = lps[j - 1]  # Continue searching
        
        elif j != 0:
            # Mismatch: use failure function
            j = lps[j - 1]
        
        else:
            # j == 0 and mismatch, move to next character in text
            i += 1
    
    return result
```

### Template 3: KMP for First Occurrence (strStr)

```python
def str_str(haystack: str, needle: str) -> int:
    """
    LeetCode 28: Implement strStr()
    Return the index of the first occurrence of needle in haystack,
    or -1 if needle is not part of haystack.
    
    Time: O(n + m)
    Space: O(m)
    """
    n, m = len(haystack), len(needle)
    
    if m == 0:
        return 0
    if n == 0 or m > n:
        return -1
    
    lps = compute_lps(needle)
    i = j = 0
    
    while i < n:
        if haystack[i] == needle[j]:
            i += 1
            j += 1
            if j == m:
                return i - j
        elif j != 0:
            j = lps[j - 1]
        else:
            i += 1
    
    return -1
```

### Template 4: Repeated Substring Pattern Check

```python
def repeated_substring_pattern(s: str) -> bool:
    """
    LeetCode 459: Repeated Substring Pattern
    Check if string can be constructed by taking a substring
    and appending multiple copies.
    
    Time: O(n)
    Space: O(n)
    """
    n = len(s)
    if n <= 1:
        return False
    
    lps = compute_lps(s)
    
    # Length of longest proper prefix that is also suffix
    length = lps[n - 1]
    
    # String is repeated if:
    # 1. There is a border (length > 0)
    # 2. String length is divisible by (n - border_length)
    return length > 0 and n % (n - length) == 0
```

### Template 5: Shortest Palindrome Construction

```python
def shortest_palindrome(s: str) -> str:
    """
    LeetCode 214: Shortest Palindrome
    Add characters in front to make the string a palindrome.
    
    Time: O(n)
    Space: O(n)
    """
    if not s:
        return s
    
    # Create combined string: s + '#' + reverse(s)
    rev = s[::-1]
    combined = s + '#' + rev
    
    # Build LPS array
    lps = compute_lps(combined)
    
    # Length of longest palindromic prefix of s
    palindrome_len = lps[-1]
    
    # Characters needed to add to front
    to_add = rev[:len(s) - palindrome_len]
    
    return to_add + s
```

### Template 6: String Rotation Check

```python
def is_rotation(s1: str, s2: str) -> bool:
    """
    Check if s2 is a rotation of s1.
    Example: 'erbottlewat' is rotation of 'waterbottle'
    
    Time: O(n)
    Space: O(n)
    """
    if len(s1) != len(s2):
        return False
    if len(s1) == 0:
        return True
    
    # s2 is rotation of s1 iff s2 is substring of s1+s1
    return len(kmp_search(s1 + s1, s2)) > 0
```

---

## When to Use

Use the KMP algorithm when you need to solve problems involving:

- **Pattern Searching**: Finding all occurrences of a pattern within a text
- **String Matching**: Checking if a pattern exists in a larger string
- **Repeated Pattern Detection**: Identifying repeating substrings
- **Border Problems**: Finding proper prefixes that are also suffixes
- **Text Processing**: Large-scale text searching in editors, search engines
- **Bioinformatics**: DNA pattern matching in computational biology

### Comparison with Alternatives

| Algorithm | Time Complexity | Space Complexity | Best Use Case |
|-----------|-----------------|-------------------|---------------|
| **Naive** | O(n × m) | O(1) | Small strings, simple implementation |
| **KMP** | O(n + m) | O(m) | Large strings, guaranteed optimal |
| **Rabin-Karp** | O(n + m) avg | O(1) | Multiple patterns, hash-based filtering |
| **Z-Algorithm** | O(n + m) | O(n) | Similar to KMP, different preprocessing |

### When to Choose KMP vs Other Approaches

- **Choose KMP** when:
  - You need guaranteed O(n+m) worst-case performance
  - Pattern is searched multiple times (preprocess once)
  - Pattern contains repeated subpatterns
  - You need to handle border-related problems

- **Choose Naive** when:
  - Strings are very short
  - Simple implementation is preferred
  - No repeated patterns in pattern

- **Choose Rabin-Karp** when:
  - Searching for multiple patterns simultaneously
  - Rolling hash provides additional benefits
  - Average case performance is acceptable

---

## Algorithm Explanation

### Core Concept

The KMP algorithm's key insight is that when a mismatch occurs, we can use information from the already-matched portion to determine where to resume matching, without backtracking in the text.

**Key Terminology**:
- **Text (T)**: The string to search in
- **Pattern (P)**: The string to search for
- **LPS Array**: Longest Proper Prefix which is also Suffix - stores the length of the longest proper prefix that is also a suffix for each position
- **Border**: A string that is both a proper prefix and a suffix of another string

### How It Works

#### Step 1: Build the LPS Array

```python
function computeLPS(pattern):
    m = length(pattern)
    lps = array of size m, initialized to 0
    length = 0  // length of previous longest prefix suffix
    i = 1
    
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]  // try shorter border
            else:
                lps[i] = 0
                i += 1
    
    return lps
```

#### Step 2: Search Using KMP

```python
function kmpSearch(text, pattern):
    n = length(text)
    m = length(pattern)
    lps = computeLPS(pattern)
    
    i = 0  // index for text
    j = 0  // index for pattern
    result = []
    
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
        
        if j == m:
            result.append(i - j)  // match found at position i-j
            j = lps[j - 1]  // continue searching for more matches
        else if i < n and text[i] != pattern[j]:
            if j != 0:
                j = lps[j - 1]  // use LPS to skip characters
            else:
                i += 1  // move to next character in text
    
    return result
```

### Visual Walkthrough

**Example**: Find "ABABC" in "ABABDABABCDABABCABAB"

```
Text:     A B A B D A B A C D A B A B C A B A B
Pattern:  A B A B C
          | | | | |
          0 1 2 3 4  ← Matched up to index 3

Mismatch at text[4]='D' vs pattern[4]='C'
Using lps[3]=2, shift pattern by 2 positions

Text:     A B A B D A B A C D A B A B C A B A B
Pattern:        A B A B C
                      | | | | |
                      Found at index 10!
```

### Why KMP is Efficient

Consider searching for pattern "ABAB" in text "ABABAB":

1. **Naive approach** checks each position, wasting comparisons when partial matches fail
2. **KMP** uses the LPS array to skip unnecessary comparisons by knowing that after "ABAB" fails at the last character, we still have "AB" at the beginning that matches

This prevents the O(n × m) worst-case behavior and guarantees O(n + m) time complexity.

### Limitations

- **Preprocessing overhead**: O(m) time and space for LPS array
- **Not best for multiple patterns**: Aho-Corasick is better for many patterns
- **Complex implementation**: More complex than naive or Rabin-Karp
- **Not useful for fuzzy matching**: Exact match only

---

## Practice Problems

### Problem 1: Implement strStr()

**Problem:** [LeetCode 28 - Implement strStr()](https://leetcode.com/problems/implement-strstr/)

**Description:** Given two strings `haystack` and `needle`, return the index of the first occurrence of `needle` in `haystack`, or -1 if `needle` is not part of `haystack`.

**How to Apply KMP:**
- Build LPS array for the needle pattern
- Search through haystack using the KMP algorithm
- Return first match index or -1 if no match

---

### Problem 2: Repeated Substring Pattern

**Problem:** [LeetCode 459 - Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/)

**Description:** Given a string `s`, check if it can be constructed by taking a substring of it and appending multiple copies of it.

**How to Apply KMP:**
- Build LPS array for string s
- Check if `lps[n-1] > 0` and `n % (n - lps[n-1]) == 0`
- If true, string is made of repeated pattern of length `n - lps[n-1]`

---

### Problem 3: Repeated String Match

**Problem:** [LeetCode 686 - Repeated String Match](https://leetcode.com/problems/repeated-string-match/)

**Description:** Given two strings `a` and `b`, return the minimum number of times `a` has to be repeated so that `b` is a substring of it.

**How to Apply KMP:**
- Concatenate a with itself (or more times) to create text
- Use KMP to search for pattern b in the concatenated string
- Find minimum repetitions needed

---

### Problem 4: Shortest Palindrome

**Problem:** [LeetCode 214 - Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/)

**Description:** Add minimum characters to the front of string s to make it a palindrome.

**How to Apply KMP:**
- Create string `s + '#' + reverse(s)`
- Build LPS array
- The last value of LPS gives the longest palindromic prefix
- Reverse remaining suffix and append to front

---

### Problem 5: Longest Prefix That Is Also Suffix

**Problem:** [GeeksforGeeks - Longest Prefix Suffix](https://practice.geeksforgeeks.org/problems/longest-prefix-suffix2527/1)

**Description:** Find the length of the longest prefix which is also a suffix in the given string.

**How to Apply KMP:**
- Build LPS array for the string
- The answer is `lps[n-1]` where n is string length

---

### Problem 6: Find the Index of the First Occurrence in a String

**Problem:** [LeetCode 28 - Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)

**Description:** Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.

**How to Apply KMP:**
- Classic string matching problem
- Preprocess needle with LPS array
- Use KMP to find first match in O(n+m) time

---

## Video Tutorial Links

### Fundamentals

- [KMP Algorithm - Abdul Bari](https://www.youtube.com/watch?v=4jY57Ehc14Y) - Comprehensive explanation with visualizations
- [KMP Algorithm Explained - CodeHelp](https://www.youtube.com/watch?v=GTJr8OvyEVQ) - Detailed tutorial with examples
- [KMP Algorithm - GeeksforGeeks](https://www.youtube.com/watch?v=Vg5mJK4moeE) - GFG explanation

### Practical Implementation

- [LeetCode 28 Solution - strStr](https://www.youtube.com/watch?v=BP7TqB1PlU0) - Complete walkthrough
- [KMP Pattern Matching - Nick White](https://www.youtube.com/watch?v=qMkyrr1cqEk) - Implementation guide
- [Repeated Substring Pattern - KMP Approach](https://www.youtube.com/watch?v=naf2y1wSp8w) - Problem solution

### Advanced Topics

- [Z-Algorithm vs KMP](https://www.youtube.com/watch?v=dgPabGzjT6w) - Comparison of string matching algorithms
- [String Matching Overview](https://www.youtube.com/watch?v=5i7oKodCRJo) - All methods compared

---

## Follow-up Questions

### Q1: What is the difference between KMP and Z-algorithm?

**Answer:** Both achieve O(n + m) time complexity:
- **KMP**: Computes LPS array on the pattern separately, then searches
- **Z-Algorithm**: Computes Z-array on the concatenated string (pattern + # + text)
- KMP is often preferred for pattern-only preprocessing; Z-algorithm is more intuitive for some problems

---

### Q2: Why is KMP better than naive string matching?

**Answer:** Naive approach can degrade to O(n × m) in worst case (e.g., "aaa...a" vs "aa...b"). KMP guarantees O(n + m) by using the LPS array to skip characters, ensuring no character in the text is compared more than once.

---

### Q3: Can KMP handle multiple patterns simultaneously?

**Answer:** For multiple patterns, consider:
- Building a trie of patterns and using KMP-like failure function (Aho-Corasick)
- Running KMP separately for each pattern (O(total pattern length + text length))
- Using Rabin-Karp for multiple patterns

---

### Q4: What is the space-time trade-off in KMP?

**Answer:** KMP trades O(m) space for O(n + m) time. The LPS array allows O(n) search time but requires O(m) auxiliary space. For memory-constrained environments, you could compute LPS on-the-fly (more complex implementation).

---

### Q5: How does KMP handle edge cases?

**Answer:** Key edge cases:
- Empty pattern: Return all indices (including position after last char)
- Pattern longer than text: Return empty/no match
- Single character pattern: Works normally
- All same characters: LPS array grows incrementally, search still O(n)

---

## Summary

The Knuth-Morris-Pratt (KMP) algorithm is a fundamental string matching algorithm that achieves optimal O(n + m) time complexity by preprocessing the pattern into an LPS (Longest Prefix Suffix) array. This preprocessing allows the algorithm to skip redundant character comparisons when mismatches occur.

**Key Takeaways**:

1. **LPS Array**: The heart of KMP - stores the longest proper prefix that is also a suffix for each position
2. **No Backtracking**: Text pointer never moves backward, ensuring linear time
3. **Preprocessing**: O(m) time to build LPS, then O(n) to search
4. **Space Trade-off**: O(m) auxiliary space for O(n + m) time guarantee
5. **Applications**: Beyond pattern matching, used in repeated substring detection, palindrome problems, and as a building block for more complex algorithms

**When to Use KMP**:
- Large text and pattern sizes
- Guaranteed linear time required
- Pattern is searched multiple times (preprocess once)
- Problems involving borders, prefixes, and suffixes

KMP is an essential algorithm for any programmer's toolkit and frequently appears in technical interviews at major tech companies.
