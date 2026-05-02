# Z Algorithm (Linear Pattern Matching)

## Category
Strings & Pattern Matching

## Description

The Z-Algorithm is a linear-time string matching algorithm that computes the Z-array for a string, where Z[i] represents the length of the longest substring starting at position i that matches the prefix of the string. This elegant algorithm solves the exact string matching problem in O(n) time, making it as efficient as the KMP algorithm but often more intuitive to understand and implement.

The key innovation of the Z-Algorithm is maintaining a window [L, R] that represents the rightmost segment matching the prefix. When computing Z[i] for a new position, if i falls within [L, R], we can potentially reuse previously computed Z values instead of doing naive character comparisons. This window-based optimization ensures each character is compared at most twice, achieving the coveted linear time complexity.

---

## Concepts

The Z-Algorithm is built on fundamental string concepts and a clever window optimization technique.

### 1. Z-Array Definition

| Index | Meaning |
|-------|---------|
| **Z[0]** | Length of string n (by convention) or 0 |
| **Z[i]** | Length of longest substring starting at i matching prefix |

```
Example: s = "abacaba"
Index:  0 1 2 3 4 5 6
Char:   a b a c a b a
Z:      7 0 1 0 3 0 1

At i=2: "a" matches prefix "a" -> Z[2] = 1
At i=4: "aba" matches prefix "aba" -> Z[4] = 3
```

### 2. The [L, R] Window

| Variable | Meaning |
|----------|---------|
| **L** | Left boundary of Z-box (current matching segment) |
| **R** | Right boundary of Z-box (inclusive) |
| **Z-box** | Substring [L, R] that matches prefix |

The window [L, R] tracks the rightmost segment we've found that matches the prefix. If the current position i falls within this window, we can use previously computed information.

### 3. Two Cases in Algorithm

| Case | Condition | Action |
|------|-----------|--------|
| **Case 1** | i > R (outside window) | Brute force extend from i |
| **Case 2** | i <= R (inside window) | Use previously computed Z[k] |

### 4. Case 2 Sub-cases

When i is inside [L, R], let k = i - L (corresponding position in prefix):

| Sub-case | Condition | Z[i] Value |
|----------|-----------|------------|
| **2a** | Z[k] < R - i + 1 | Z[i] = Z[k] |
| **2b** | Z[k] >= R - i + 1 | Z[i] >= Z[k], may need extension |

---

## Frameworks

Structured approaches for using the Z-Algorithm.

### Framework 1: Building Z-Array

```
┌─────────────────────────────────────────────────────────────┐
│  Z-ARRAY CONSTRUCTION                                         │
├─────────────────────────────────────────────────────────────┤
│  Input: string s of length n                                 │
│  Output: Z-array of length n                                 │
│                                                              │
│  1. Initialize:                                              │
│     - Z[0] = n (or 0 by convention)                         │
│     - L = 0, R = 0                                           │
│                                                              │
│  2. For i = 1 to n-1:                                        │
│     a. If i > R:  // Case 1: Outside window                  │
│        - L = R = i                                           │
│        - While R < n and s[R-L] == s[R]:                     │
│            R += 1                                            │
│        - Z[i] = R - L                                        │
│        - R -= 1  // Adjust to inclusive boundary             │
│                                                              │
│     b. Else:  // Case 2: Inside window [L, R]               │
│        - k = i - L  // Corresponding position in prefix     │
│        - If Z[k] < R - i + 1:  // Fits within window        │
│            Z[i] = Z[k]                                       │
│        - Else:  // May extend beyond R                      │
│            L = i                                             │
│            While R < n and s[R-L] == s[R]:                   │
│                R += 1                                        │
│            Z[i] = R - L                                      │
│            R -= 1                                            │
│                                                              │
│  3. Return Z array                                           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Preprocessing any string for pattern matching.

### Framework 2: Pattern Matching with Z-Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│  PATTERN MATCHING USING Z-ALGORITHM                         │
├─────────────────────────────────────────────────────────────┤
│  Input: text T, pattern P                                   │
│  Output: List of starting positions of matches in T         │
│                                                              │
│  1. Create concatenated string: S = P + "$" + T              │
│     - $ is a separator character not in P or T             │
│                                                              │
│  2. Compute Z-array for S                                    │
│                                                              │
│  3. Find matches:                                            │
│     - Pattern length = m                                     │
│     - For each position i in S where i > m:                │
│        * If Z[i] == m:                                       │
│          Pattern found at position (i - m - 1) in T        │
│                                                              │
│  4. Return all match positions                               │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Finding all occurrences of pattern in text.

### Framework 3: String Analysis Applications

```
┌─────────────────────────────────────────────────────────────┐
│  Z-ALGORITHM STRING ANALYSIS                                  │
├─────────────────────────────────────────────────────────────┤
│  Various applications beyond pattern matching:              │
│                                                              │
│  1. Periodicity Detection:                                   │
│     - String has period p if Z[p] >= n - p                 │
│     - Minimal period: smallest p where condition holds      │
│                                                              │
│  2. Prefix-Suffix Matching:                                  │
│     - Z[i] values show prefix matches at each position      │
│                                                              │
│  3. String Compression:                                      │
│     - Find repeated substrings using Z-array                │
│                                                              │
│  4. Palindrome Detection:                                    │
│     - Combine with reversed string analysis                 │
│                                                              │
│  5. Distinct Substrings Count:                               │
│     - Use Z on each suffix to count unique substrings       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Advanced string analysis problems.

---

## Forms

Different manifestations and applications of the Z-Algorithm.

### Form 1: Standard Z-Array Computation

Computing Z-values for a single string.

| Aspect | Details |
|--------|---------|
| **Input** | Single string s |
| **Output** | Z[0..n-1] array |
| **Use** | Prefix matching analysis |
| **Complexity** | O(n) time, O(n) space |

### Form 2: Pattern Matching

Finding pattern occurrences in text.

| Modification | Concatenate pattern + "$" + text |
|--------------|----------------------------------|
| **Separator** | Character not in alphabet |
| **Matches** | Z[i] == len(pattern) at position i |
| **Position** | i - len(pattern) - 1 in original text |

### Form 3: Periodicity Detection

Finding string periods using Z-array.

| Condition | Z[p] >= n - p means period p exists |
|-----------|-------------------------------------|
| **Minimal period** | Smallest p satisfying condition |
| **Application** | String compression, repetition detection |

### Form 4: Distinct Substrings

Counting unique substrings using Z on suffixes.

| Approach | For each suffix, Z-array shows prefix matches |
|----------|-----------------------------------------------|
| **Formula** | New substrings from suffix = len(suffix) - max(Z) |
| **Sum** | Total distinct substrings |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Standard Z-Algorithm Implementation

Core implementation with clear case handling:

```python
def z_algorithm(s):
    """
    Compute Z-array for string s.
    Z[i] = length of longest substring starting at i 
           that matches the prefix of s.
    
    Time: O(n), Space: O(n)
    """
    n = len(s)
    z = [0] * n
    z[0] = n  # By convention
    
    l, r = 0, 0  # [l, r] is the current Z-box
    
    for i in range(1, n):
        # Case 1: i is outside current Z-box
        if i > r:
            l = r = i
            # Brute force extension
            while r < n and s[r - l] == s[r]:
                r += 1
            z[i] = r - l
            r -= 1  # Adjust to inclusive
        else:
            # Case 2: i is inside Z-box
            k = i - l  # Corresponding position in prefix
            
            # If Z[k] doesn't exceed box, use it directly
            if z[k] < r - i + 1:
                z[i] = z[k]
            else:
                # May extend beyond R, need to check
                l = i
                while r < n and s[r - l] == s[r]:
                    r += 1
                z[i] = r - l
                r -= 1
    
    return z
```

**Key points**: Careful handling of [L,R] window bounds.

### Tactic 2: Pattern Matching

Using Z-algorithm for pattern matching:

```python
def find_pattern(text, pattern):
    """
    Find all occurrences of pattern in text using Z-algorithm.
    """
    if not pattern:
        return list(range(len(text) + 1))
    
    # Concatenate with separator
    concat = pattern + "$" + text
    z = z_algorithm(concat)
    
    result = []
    pattern_len = len(pattern)
    
    # Check positions after pattern + separator
    for i in range(pattern_len + 1, len(concat)):
        if z[i] == pattern_len:
            # Match found at position (i - pattern_len - 1) in text
            result.append(i - pattern_len - 1)
    
    return result
```

**Important**: Separator must not appear in pattern or text.

### Tactic 3: Find String Period

Detect if string is periodic:

```python
def find_period(s):
    """
    Find smallest period of string using Z-array.
    Returns period length or -1 if not periodic.
    """
    n = len(s)
    z = z_algorithm(s)
    
    for p in range(1, n):
        # Check if p is a valid period
        if z[p] >= n - p:
            return p
    
    return -1  # No period found (aperiodic)

def is_periodic(s):
    """Check if string is made of repeated substring."""
    period = find_period(s)
    if period == -1:
        return False
    
    # Verify: string should be prefix repeated
    return s == s[:period] * (len(s) // period + 1)[:len(s)]
```

**Property**: String s has period p iff Z[p] >= n - p.

### Tactic 4: Distinct Substrings Count

Count distinct substrings using Z on suffixes:

```python
def count_distinct_substrings(s):
    """
    Count distinct substrings using Z-algorithm on each suffix.
    
    For each suffix starting at i:
    - Total substrings starting at i = len(suffix)
    - Substrings already seen = max Z value in suffix's Z-array
    - New substrings = len(suffix) - max_z
    """
    n = len(s)
    count = 0
    
    for i in range(n):
        suffix = s[i:]
        z = z_algorithm(suffix)
        
        # New substrings starting at position i
        max_z = max(z) if z else 0
        count += len(suffix) - max_z
    
    return count
```

**Insight**: Z-array shows which substrings starting at position i have appeared before.

---

## Python Templates

### Template 1: Z-Array Computation

```python
def compute_z(s: str) -> list[int]:
    """
    Compute Z-array for string s.
    
    Z[i] = length of longest substring starting at position i
           that matches the prefix of s.
    
    Args:
        s: Input string
    
    Returns:
        Z-array of length len(s)
    
    Time: O(n)
    Space: O(n)
    """
    n = len(s)
    z = [0] * n
    z[0] = n  # By convention, or set to 0 if preferred
    
    l, r = 0, 0  # [l, r] represents the Z-box
    
    for i in range(1, n):
        # Case 1: i is outside the current Z-box
        if i > r:
            l = r = i
            # Brute force character matching
            while r < n and s[r - l] == s[r]:
                r += 1
            z[i] = r - l
            r -= 1  # Make r inclusive
        else:
            # Case 2: i is inside Z-box
            k = i - l  # Corresponding position in prefix
            
            # If Z[k] is less than remaining window, use it
            if z[k] < r - i + 1:
                z[i] = z[k]
            else:
                # Need to extend beyond r
                l = i
                while r < n and s[r - l] == s[r]:
                    r += 1
                z[i] = r - l
                r -= 1
    
    return z
```

### Template 2: Pattern Matching with Z

```python
def z_pattern_search(text: str, pattern: str) -> list[int]:
    """
    Find all occurrences of pattern in text using Z-algorithm.
    
    Args:
        text: Text to search in
        pattern: Pattern to search for
    
    Returns:
        List of starting indices where pattern occurs in text
    
    Time: O(n + m)
    Space: O(n + m)
    """
    if not pattern:
        return list(range(len(text) + 1))
    
    # Concatenate: pattern + separator + text
    concat = pattern + "$" + text
    z = compute_z(concat)
    
    result = []
    pattern_len = len(pattern)
    
    # Check positions after pattern + separator
    for i in range(pattern_len + 1, len(concat)):
        if z[i] == pattern_len:
            # Pattern found at position (i - pattern_len - 1) in text
            result.append(i - pattern_len - 1)
    
    return result
```

### Template 3: String Periodicity

```python
def string_period(s: str) -> int:
    """
    Find the smallest period of string s.
    
    Args:
        s: Input string
    
    Returns:
        Smallest period p such that s consists of repetitions
        of s[0:p]. Returns len(s) if string is aperiodic.
    
    Time: O(n)
    Space: O(n)
    """
    n = len(s)
    z = compute_z(s)
    
    for p in range(1, n):
        if z[p] >= n - p:
            return p
    
    return n


def is_repeated_pattern(s: str) -> bool:
    """
    Check if string is made of repeated substring.
    
    Time: O(n)
    Space: O(n)
    """
    p = string_period(s)
    return p < len(s) and s == s[:p] * (len(s) // p)
```

### Template 4: Longest Prefix Suffix

```python
def longest_prefix_suffix(s: str) -> int:
    """
    Find length of longest proper prefix which is also suffix.
    
    This is equivalent to the last value of Z-array.
    
    Args:
        s: Input string
    
    Returns:
        Length of longest proper prefix-suffix match
    
    Time: O(n)
    Space: O(n)
    """
    if not s:
        return 0
    
    z = compute_z(s)
    return z[-1]
```

### Template 5: Distinct Substrings Count

```python
def count_distinct_substrings(s: str) -> int:
    """
    Count number of distinct substrings using Z-algorithm.
    
    For each suffix, compute Z-array and count new substrings.
    
    Args:
        s: Input string
    
    Returns:
        Number of distinct substrings
    
    Time: O(n^2) - Z-array for each suffix
    Space: O(n)
    """
    n = len(s)
    total = 0
    
    for i in range(n):
        suffix = s[i:]
        z = compute_z(suffix)
        
        # All substrings starting at i: len(suffix)
        # Already counted (as part of earlier suffixes): max(z)
        max_z = max(z) if z else 0
        total += len(suffix) - max_z
    
    # Include empty substring if needed
    return total
```

### Template 6: Sum of Scores (LeetCode 2223)

```python
def sum_scores(s: str) -> int:
    """
    LeetCode 2223: Sum of Scores of Built Strings
    
    The score of a string is defined as the sum of Z-values
    of all its suffixes, plus the length of each suffix.
    
    Args:
        s: Input string
    
    Returns:
        Total sum of scores
    
    Time: O(n^2)
    Space: O(n)
    """
    n = len(s)
    total = 0
    
    for i in range(n):
        suffix = s[i:]
        z = compute_z(suffix)
        # Score = sum of Z values + length of suffix
        total += sum(z) + len(suffix)
    
    return total
```

---

## When to Use

Use the Z-Algorithm when you need to solve problems involving:

- **Linear pattern matching**: Finding all pattern occurrences in text
- **Prefix matching**: Finding longest prefix matches at each position
- **String periodicity**: Detecting repeated patterns
- **String analysis**: Computing various string properties
- **Suffix analysis**: Processing multiple suffixes of a string

### Comparison with Alternative Pattern Matching Algorithms

| Algorithm | Time | Space | Best Use Case |
|-----------|------|-------|---------------|
| **Z-Algorithm** | O(n + m) | O(n + m) | Single pattern, intuitive |
| **KMP** | O(n + m) | O(m) | Multiple searches with same pattern |
| **Rabin-Karp** | O(n + m) avg | O(1) | Multiple patterns, hash-based |
| **Suffix Array** | O(n log n) | O(n) | Many queries on same text |
| **Boyer-Moore** | O(n/m) best | O(m) | Large alphabet, practical |

### When to Choose Z-Algorithm vs KMP

- **Choose Z-Algorithm** when:
  - You want a more intuitive algorithm
  - Computing Z-values for string analysis (not just pattern matching)
  - Single pattern search with clear concatenation
  - Working with suffix properties

- **Choose KMP** when:
  - Multiple searches with the same pattern
  - Space is constrained (KMP uses O(m) vs Z's O(n+m))
  - Preprocessing pattern only (not concatenation)
  - Need failure function for other purposes

---

## Algorithm Explanation

### Core Concept

The Z-Algorithm achieves linear time by maintaining a window [L, R] that represents the rightmost segment of the string known to match the prefix. When computing Z[i] for a new position, if i falls within [L, R], we can potentially copy previously computed Z values instead of doing naive comparisons.

**Key Terminology**:
- **Z[i]**: Length of longest substring starting at i matching the prefix
- **Z-box [L, R]**: Window where substring matches prefix
- **k = i - L**: Corresponding position in prefix when i is inside Z-box

### How It Works

#### Two Main Cases

**Case 1: i > R (outside current window)**
- We know nothing about position i
- Start fresh comparison from i
- Update L, R to new matching segment

**Case 2: i <= R (inside current window)**
- We know s[L..R] matches prefix
- Position i corresponds to position k = i - L in prefix
- Z[i] is at least min(Z[k], R - i + 1)
- May need to extend if Z[k] exceeds window

#### Z-Box Maintenance

```
String: a a b a a a b a a
Index:  0 1 2 3 4 5 6 7 8
Z:      9 1 0 3 3 1 0 2 1

Processing:
- i=1: Z[1]=1, update L=1, R=2 (window "aa")
- i=2: Outside [1,2], compute Z[2]=0
- i=3: Outside, compute Z[3]=3, update L=3, R=6 (window "aaba")
- i=4: Inside [3,6], k=1, Z[4] >= min(Z[1]=1, 6-4+1=3) = 1
       Extend: Z[4]=3, window unchanged
```

### Visual Walkthrough

**Example**: s = "aabxaabxcaabxaabx"

```
Index:  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16
Char:   a  a  b  x  a  a  b  x  c  a  a  b  x  a  a  b  x
Z:     17  1  0  0  4  1  0  0  0  8  1  0  0  4  1  0  0

Z[4] = 4: "aabx" at position 4 matches prefix "aabx"
Z[9] = 8: "aabxaabx" at position 9 matches prefix "aabxaabx"

Z-box evolution:
- i=1: L=1, R=2 (Z[1]=1)
- i=4: L=4, R=8 (Z[4]=4)
- i=9: L=9, R=17 (Z[9]=8, extends to end)
```

### Why It's O(n)

Each character comparison either:
1. Extends R (window grows), or
2. Inside window, uses O(1) lookup

R only moves forward, so total character comparisons ≤ 2n.

### Comparison with Naive Approach

**Naive**:
```python
for i in range(1, n):
    while i + z[i] < n and s[z[i]] == s[i + z[i]]:
        z[i] += 1
```
O(n²) worst case (e.g., "aaaaa...")

**Z-Algorithm**: O(n) by reusing information through Z-box.

### Limitations

- **Space**: O(n) for Z-array (vs KMP's O(m) for pattern)
- **Concatenation overhead**: Pattern matching requires building concatenated string
- **Single string focus**: Less efficient for multiple pattern searches
- **Not for approximate matching**: Exact match only

---

## Practice Problems

### Problem 1: Implement strStr()

**Problem:** [LeetCode 28 - Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)

**Description:** Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.

**How to Apply Z-Algorithm:**
- Concatenate: needle + "$" + haystack
- Compute Z-array
- Find first position where Z[i] == len(needle)
- Return position - len(needle) - 1

---

### Problem 2: Sum of Scores of Built Strings

**Problem:** [LeetCode 2223 - Sum of Scores of Built Strings](https://leetcode.com/problems/sum-of-scores-of-built-strings/)

**Description:** You are building a string s in a peculiar way. The score of a string is defined as the sum of Z-values of all its suffixes, plus the length of each suffix. Return the sum of scores for all suffixes of s.

**How to Apply:**
- For each suffix starting at position i:
  - Compute Z-array for suffix
  - Sum all Z values and add suffix length
- Return total sum

---

### Problem 3: Repeated Substring Pattern

**Problem:** [LeetCode 459 - Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/)

**Description:** Given a string s, check if it can be constructed by taking a substring of it and appending multiple copies.

**How to Apply:**
- Compute Z-array for s
- Check if Z[p] >= n - p for any p < n
- Equivalently: if Z[n-1] > 0 and n % (n - Z[n-1]) == 0

---

### Problem 4: Longest Prefix Suffix

**Problem:** [LeetCode 214 - Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/) (related)

**Description:** Add characters in front of string to make it a palindrome. This uses longest prefix-suffix matching.

**How to Apply:**
- Compute Z-array on combined string: s + "#" + reverse(s)
- The last Z value gives longest palindromic prefix

---

## Video Tutorial Links

### Fundamentals

- [Z Algorithm - Algorithms Live](https://www.youtube.com/watch?v=MFK) - Comprehensive explanation
- [Z-Algorithm Tutorial - Tushar Roy](https://www.youtube.com/watch?v=Gg) - Pattern matching
- [Z Algorithm vs KMP](https://www.youtube.com/watch?v=dgPabGzjT6w) - Comparison

### Problem Solutions

- [LeetCode 28 Solution](https://www.youtube.com/watch?v=BP7TqB1PlU0) - Pattern matching
- [Z-Algorithm Applications](https://www.youtube.com/watch?v=3klbG) - Various problems
- [String Matching Algorithms](https://www.youtube.com/watch?v=5i7oKodCRJo) - All methods

### Advanced Topics

- [Suffix Array Construction](https://www.youtube.com/watch?v=ZE2) - Related structures
- [Linear Time String Matching](https://www.youtube.com/watch?v=2rlJSWpDg1Q) - Theory

---

## Follow-up Questions

### Q1: What is the difference between Z-algorithm and KMP?

**Answer:** Both achieve O(n + m) time for pattern matching:
- **Z-Algorithm**: Computes Z-array on concatenated string (pattern + # + text), easier to understand
- **KMP**: Computes failure function on pattern only, more space efficient
- Z-algorithm gives more information (Z-values at all positions), useful for analysis beyond just matching

---

### Q2: When would you use Z-algorithm over KMP?

**Answer:** Use Z-algorithm when:
- You need Z-values for string analysis (not just pattern matching)
- You want a more intuitive algorithm to implement
- Computing properties of all suffixes/prefixes
- Single pattern search with clear concatenation

Use KMP when space is limited or doing multiple searches with the same pattern.

---

### Q3: Can Z-algorithm handle multiple patterns?

**Answer:** For multiple patterns:
- Run Z-algorithm separately for each pattern: O(k × (n + m))
- Alternative: Build a trie of patterns and use Aho-Corasick
- Z-algorithm is not designed for multiple patterns like Rabin-Karp with multiple hashes

---

### Q4: What is the space complexity of Z-algorithm?

**Answer:** Z-algorithm requires O(n) space for the Z-array where n is the length of the processed string. For pattern matching (pattern + "$" + text), this is O(m + n). This is more than KMP which uses O(m) space for the failure function.

---

### Q5: How does Z-algorithm compare to suffix array/tree approaches?

**Answer:**
- **Z-algorithm**: O(n) for single string processing, good for one-time analysis
- **Suffix Array**: O(n log n) preprocessing, O(m log n) per query, good for many queries
- **Suffix Tree**: O(n) preprocessing, O(m) per query, complex implementation
- **Z-algorithm** is simpler and sufficient for most single-query applications

---

## Summary

The Z-Algorithm is a linear-time string algorithm that computes, for each position in a string, the length of the longest substring starting there that matches the string's prefix. It provides the same time complexity as KMP but with a more intuitive approach based on maintaining a window of known matches.

**Key Takeaways**:

1. **Z[i] Definition**: Longest prefix match starting at position i
2. **Z-box [L,R]**: Window of known prefix matches for O(1) lookup
3. **Linear Time**: O(n) by ensuring each character is compared at most twice
4. **Pattern Matching**: Concatenate pattern + "$" + text, find Z[i] == len(pattern)
5. **Versatility**: Beyond matching, useful for periodicity, distinct substrings, etc.

**When to Use**:
- Single pattern matching in linear time
- String analysis requiring prefix-suffix information
- Competitive programming (often easier to code than KMP)
- Problems involving string periodicity or repetition

**Advantages over KMP**:
- More intuitive and easier to implement
- Computes useful information (Z-array) for all positions
- Natural extension to string analysis beyond pattern matching

The Z-Algorithm is an essential tool for string problems and competitive programming.
