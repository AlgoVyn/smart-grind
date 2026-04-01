# Rabin-Karp

## Category
Advanced

## Description

Rabin-Karp is a string matching algorithm that uses **rolling hash** to find patterns in text efficiently. It combines the power of hashing with the sliding window technique to search for one or more patterns in a larger text string in average O(n + m) time complexity.

The algorithm is particularly effective for multiple pattern search scenarios and forms the foundation for many plagiarism detection systems, DNA sequence matching, and other applications requiring efficient substring search.

---

## Concepts

The Rabin-Karp algorithm is built on several fundamental concepts that enable efficient string matching.

### 1. Rolling Hash

A hash function where the input is processed in a sliding window:

```
Hash of window at position i: h[i] = hash(text[i:i+m])

Rolling update: h[i+1] can be computed from h[i] in O(1)
Instead of rehashing the entire window from scratch
```

### 2. Polynomial Rolling Hash

Compute hash using a polynomial formula:

```
hash("s[0...m-1]") = (s[0] × d^(m-1) + s[1] × d^(m-2) + ... + s[m-1] × d^0) mod q

Where:
- d = base (number of possible characters, typically 256 for ASCII)
- q = large prime number (modulus to prevent overflow)
```

### 3. Rolling Hash Update Formula

Efficiently update hash when sliding window:

```
hash("s[i+1...i+m]") = (d × (hash("s[i...i+m-1]") - s[i] × h) + s[i+m]) mod q

Where h = d^(m-1) mod q (precomputed)
```

### 4. Hash Collisions and Verification

| Scenario | Action | Reason |
|----------|--------|--------|
| **Hashes differ** | Skip comparison | Strings definitely different |
| **Hashes match** | Verify character-by-character | Handle hash collisions |
| **Verification passes** | Report match | Confirmed match |
| **Verification fails** | Continue (spurious hit) | False positive due to collision |

---

## Frameworks

Structured approaches for string matching with Rabin-Karp.

### Framework 1: Single Pattern Matching

```
┌─────────────────────────────────────────────────────┐
│  SINGLE PATTERN RABIN-KARP FRAMEWORK                 │
├─────────────────────────────────────────────────────┤
│  1. Choose parameters:                              │
│     - d = base (e.g., 256 for ASCII)                │
│     - q = large prime (e.g., 101, 1000003)          │
│  2. Precompute h = d^(m-1) mod q                   │
│  3. Calculate pattern hash                          │
│  4. Calculate hash of first text window             │
│  5. For each position i from 0 to n-m:              │
│     a. If pattern_hash == text_hash:               │
│        - Verify: compare text[i:i+m] with pattern   │
│        - If match: add i to results                │
│     b. If i < n-m: update hash using rolling formula│
│  6. Return all match positions                       │
└─────────────────────────────────────────────────────┘
```

**When to use**: Single pattern search, simple implementation needed.

### Framework 2: Multiple Pattern Matching

```
┌─────────────────────────────────────────────────────┐
│  MULTIPLE PATTERN RABIN-KARP FRAMEWORK               │
├─────────────────────────────────────────────────────┤
│  1. Group patterns by length                        │
│  2. For each length group:                          │
│     a. Compute hash for all patterns of that length │
│     b. Store in hash table: hash → list of patterns │
│  3. Slide through text once per unique length:      │
│     a. Compute rolling hash for current window       │
│     b. If hash in table: verify each pattern       │
│     c. Report matches                                 │
│  4. Return results organized by pattern              │
└─────────────────────────────────────────────────────┘
```

**When to use**: Multiple patterns, Rabin-Karp's key advantage.

### Framework 3: Two-Dimensional Pattern Matching

```
┌─────────────────────────────────────────────────────┐
│  2D RABIN-KARP FRAMEWORK                             │
├─────────────────────────────────────────────────────┤
│  1. Compute hash for each row of pattern            │
│  2. Combine row hashes to get pattern fingerprint   │
│  3. Compute rolling hashes for each text row         │
│  4. For each row position:                          │
│     a. Form column of row hashes                    │
│     b. Apply rolling hash vertically               │
│     c. Compare with pattern fingerprint             │
│  5. Verify matches with direct comparison           │
└─────────────────────────────────────────────────────┘
```

**When to use**: Image matching, 2D pattern search.

---

## Forms

Different manifestations of the Rabin-Karp pattern.

### Form 1: Single Pattern Search

Standard string matching:

| Phase | Time | Description |
|-------|------|-------------|
| Preprocessing | O(m) | Compute pattern hash |
| Initial window | O(m) | Hash first text window |
| Rolling search | O(n-m) | O(1) per position |
| Verification | O(m) per match | Character comparison |
| **Total Average** | **O(n + m)** | With good hash |
| **Total Worst** | **O(nm)** | Many spurious hits |

### Form 2: Multiple Pattern Search

Search for k patterns simultaneously:

```
Time: O(n + m1 + m2 + ... + mk) average
Space: O(total pattern length)

Key advantage: One pass through text checks all patterns
```

### Form 3: Fingerprint Matching

Compare file/document similarity:

```
Approach:
1. Compute hash of all k-length substrings in document A
2. Compute hash of all k-length substrings in document B
3. Count common hash values
4. High overlap indicates similarity
```

### Form 4: DNA Sequence Matching

Optimized for small alphabet (A, C, G, T):

```
Base d = 4 (only 4 characters)
Direct character to value mapping: {'A': 0, 'C': 1, 'G': 2, 'T': 3}
More efficient than general ASCII approach
```

### Form 5: Double Hashing

Use two different hash functions to reduce collisions:

```
Pattern matches only if:
- hash1(text[i:i+m]) == hash1(pattern) AND
- hash2(text[i:i+m]) == hash2(pattern)

Collision probability drops from 1/q to 1/(q1*q2)
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Efficient Rolling Hash Update

Implement O(1) hash update:

```python
def update_hash(old_hash, text, i, m, h, d, q):
    """
    Update hash when sliding window by 1.
    Remove leftmost char, add rightmost char.
    """
    # Remove contribution of leftmost character
    new_hash = (old_hash - ord(text[i]) * h) % q
    
    # Shift (multiply by d) and add new character
    new_hash = (new_hash * d + ord(text[i + m])) % q
    
    return new_hash
```

### Tactic 2: Precomputation for Speed

Precompute powers of base:

```python
def precompute_powers(d, m, q):
    """Precompute d^(m-1) mod q for rolling hash."""
    h = 1
    for _ in range(m - 1):
        h = (h * d) % q
    return h
```

### Tactic 3: Handling Large Text

Process text in chunks for memory efficiency:

```python
def rabin_karp_streaming(pattern, text_stream, chunk_size=10000):
    """
    Process large text in streaming fashion.
    Yields match positions as found.
    """
    m = len(pattern)
    pattern_hash = compute_hash(pattern)
    
    # Initialize with first chunk
    buffer = next(text_stream)
    window_hash = compute_hash(buffer[:m])
    
    position = 0
    while buffer:
        # Process current buffer
        while position <= len(buffer) - m:
            if window_hash == pattern_hash:
                if buffer[position:position+m] == pattern:
                    yield position
            
            # Update for next position
            if position < len(buffer) - m:
                window_hash = update_hash(window_hash, ...)
            position += 1
        
        # Load next chunk
        new_buffer = next(text_stream, '')
        if not new_buffer:
            break
        
        # Handle overlap between chunks
        overlap = buffer[-m+1:] if m > 1 else ''
        buffer = overlap + new_buffer
        position = 0
        window_hash = compute_hash(buffer[:m])
```

### Tactic 4: Multiple Pattern Optimization

Group patterns by length for efficiency:

```python
def rabin_karp_multi(text, patterns):
    """Search for multiple patterns efficiently."""
    from collections import defaultdict
    
    # Group patterns by length
    by_length = defaultdict(list)
    for pattern in patterns:
        by_length[len(pattern)].append(pattern)
    
    results = {p: [] for p in patterns}
    
    # Search each length group
    for length, pattern_list in by_length.items():
        if length > len(text):
            continue
        
        # Build hash table for this length
        pattern_hashes = defaultdict(list)
        for p in pattern_list:
            h = compute_hash(p)
            pattern_hashes[h].append(p)
        
        # Slide through text
        window_hash = compute_hash(text[:length])
        for i in range(len(text) - length + 1):
            if window_hash in pattern_hashes:
                # Verify all patterns with this hash
                for pattern in pattern_hashes[window_hash]:
                    if text[i:i+length] == pattern:
                        results[pattern].append(i)
            
            # Update hash
            if i < len(text) - length:
                window_hash = update_hash(window_hash, ...)
    
    return results
```

### Tactic 5: Double Hash for Safety

Use two hash functions to reduce collision risk:

```python
def rabin_karp_double_hash(text, pattern):
    """Rabin-Karp with double hashing."""
    # Two different parameter sets
    d1, q1 = 256, 1000003
    d2, q2 = 256, 1000033
    
    m = len(pattern)
    
    # Precompute for both
    h1 = pow(d1, m - 1, q1)
    h2 = pow(d2, m - 1, q2)
    
    # Compute both hashes for pattern
    p_hash1 = compute_hash(pattern, d1, q1)
    p_hash2 = compute_hash(pattern, d2, q2)
    
    # Initial window hashes
    t_hash1 = compute_hash(text[:m], d1, q1)
    t_hash2 = compute_hash(text[:m], d2, q2)
    
    results = []
    for i in range(len(text) - m + 1):
        # Both hashes must match
        if t_hash1 == p_hash1 and t_hash2 == p_hash2:
            if text[i:i+m] == pattern:
                results.append(i)
        
        # Update both hashes
        if i < len(text) - m:
            t_hash1 = update_hash(t_hash1, text, i, m, h1, d1, q1)
            t_hash2 = update_hash(t_hash2, text, i, m, h2, d2, q2)
    
    return results
```

---

## Python Templates

### Template 1: Single Pattern Rabin-Karp

```python
def rabin_karp(text: str, pattern: str) -> list[int]:
    """
    Template 1: Find all occurrences of pattern in text using Rabin-Karp.
    
    Time: O(n + m) average, O(nm) worst case
    Space: O(1)
    """
    n, m = len(text), len(pattern)
    
    # Edge cases
    if m == 0:
        return [0]
    if n < m:
        return []
    
    # Base and modulus
    d = 256          # Number of characters in alphabet
    q = 101          # Large prime number
    
    # Precompute d^(m-1) mod q
    h = 1
    for _ in range(m - 1):
        h = (h * d) % q
    
    # Calculate initial hash values
    pattern_hash = 0
    text_hash = 0
    
    for i in range(m):
        pattern_hash = (d * pattern_hash + ord(pattern[i])) % q
        text_hash = (d * text_hash + ord(text[i])) % q
    
    # Slide the pattern over the text
    results = []
    
    for i in range(n - m + 1):
        # Check if hashes match
        if pattern_hash == text_hash:
            # Verify the actual strings (handle collisions)
            if text[i:i + m] == pattern:
                results.append(i)
        
        # Calculate hash for next window
        if i < n - m:
            # Remove leftmost character, add rightmost
            text_hash = (d * (text_hash - ord(text[i]) * h) + ord(text[i + m])) % q
            
            # Handle negative hash value
            if text_hash < 0:
                text_hash += q
    
    return results
```

### Template 2: Multiple Pattern Rabin-Karp

```python
from collections import defaultdict

def rabin_karp_multi(text: str, patterns: list[str]) -> dict[str, list[int]]:
    """
    Template 2: Search for multiple patterns simultaneously.
    
    Time: O(n + total_pattern_length) average
    Space: O(total_pattern_length)
    """
    if not text or not patterns:
        return {p: [] for p in patterns} if patterns else {}
    
    # Group patterns by length
    by_length = defaultdict(list)
    for pattern in patterns:
        by_length[len(pattern)].append(pattern)
    
    results = {p: [] for p in patterns}
    
    d = 256
    q = 101
    
    # Process each length group
    for length, pattern_list in by_length.items():
        if length > len(text):
            continue
        
        # Build hash table for patterns of this length
        pattern_hashes = defaultdict(list)
        for p in pattern_list:
            h = 0
            for ch in p:
                h = (d * h + ord(ch)) % q
            pattern_hashes[h].append(p)
        
        # Precompute h = d^(length-1) mod q
        h_power = 1
        for _ in range(length - 1):
            h_power = (h_power * d) % q
        
        # Calculate hash of first window
        window_hash = 0
        for i in range(length):
            window_hash = (d * window_hash + ord(text[i])) % q
        
        # Slide through text
        for i in range(len(text) - length + 1):
            if window_hash in pattern_hashes:
                # Verify all patterns with this hash
                for pattern in pattern_hashes[window_hash]:
                    if text[i:i+length] == pattern:
                        results[pattern].append(i)
            
            # Update hash
            if i < len(text) - length:
                window_hash = (d * (window_hash - ord(text[i]) * h_power) 
                                + ord(text[i + length])) % q
                if window_hash < 0:
                    window_hash += q
    
    return results
```

### Template 3: DNA Sequence Rabin-Karp

```python
def rabin_karp_dna(text: str, pattern: str) -> list[int]:
    """
    Template 3: Optimized for DNA sequences (A, C, G, T).
    
    Time: O(n + m), Space: O(1)
    """
    # Map DNA bases to numbers
    dna_map = {'A': 0, 'C': 1, 'G': 2, 'T': 3}
    
    n, m = len(text), len(pattern)
    if m == 0 or n < m:
        return [] if m > 0 else [0]
    
    d = 4  # Only 4 possible characters
    q = 1000003
    
    # Precompute d^(m-1) mod q
    h = pow(d, m - 1, q)
    
    # Calculate hashes
    pattern_hash = 0
    text_hash = 0
    
    for i in range(m):
        pattern_hash = (d * pattern_hash + dna_map.get(pattern[i], 0)) % q
        text_hash = (d * text_hash + dna_map.get(text[i], 0)) % q
    
    results = []
    for i in range(n - m + 1):
        if pattern_hash == text_hash and text[i:i+m] == pattern:
            results.append(i)
        
        if i < n - m:
            text_hash = (d * (text_hash - dna_map.get(text[i], 0) * h) 
                        + dna_map.get(text[i + m], 0)) % q
    
    return results
```

---

## When to Use

Use the Rabin-Karp algorithm when you need to solve problems involving:

- **Single Pattern Matching**: Find a pattern within a text string
- **Multiple Pattern Search**: Search for multiple patterns simultaneously (the algorithm's key advantage)
- **Plagiarism Detection**: Compare documents for similarity
- **String Searching in DNA Sequences**: Find substrings in biological data
- **Text Editing**: Find and replace operations

### Comparison with Alternatives

| Algorithm | Best Case | Average Case | Worst Case | Space | Multiple Patterns |
|-----------|-----------|--------------|-------------|-------|-------------------|
| **Rabin-Karp** | O(n + m) | O(n + m) | O(nm) | O(1) | ✅ Yes |
| **Naive** | O(m) | O(nm) | O(nm) | O(1) | ❌ No |
| **KMP** | O(n + m) | O(n + m) | O(n + m) | O(m) | ❌ No |
| **Boyer-Moore** | O(n/m) | O(n/m) | O(nm) | O(m) | ❌ No |

### When to Choose Rabin-Karp vs Other Algorithms

- **Choose Rabin-Karp** when:
  - You need to search for multiple patterns at once
  - You want a simple implementation with good average performance
  - Hash collisions can be handled with verification

- **Choose KMP** when:
  - You need guaranteed linear time performance
  - You only search for a single pattern
  - Worst-case guarantee matters more than average case

- **Choose Boyer-Moore** when:
  - Alphabet size is large
  - Patterns are long
  - You want best practical performance for single pattern

---

## Algorithm Explanation

### Core Concept

The Rabin-Karp algorithm uses the concept of **rolling hash** - a hash function where the input is hashed in a window that slides through the text. Instead of comparing strings character by character, we compare their hash values. If hash values match, we verify the actual strings to handle hash collisions.

### How It Works

#### Rolling Hash Formula:
```
hash("s[0...m-1]") = s[0] × d^(m-1) + s[1] × d^(m-2) + ... + s[m-1] × d^0 (mod q)

Where:
- d = base (number of possible characters, e.g., 256 for ASCII)
- q = large prime number (modulus to prevent overflow)
```

#### Rolling Update:
```
hash("s[i+1...i+m]") = (d × (hash("s[i...i+m-1]") - s[i] × h) + s[i+m]) mod q

Where h = d^(m-1) mod q
```

### Algorithm Steps

1. **Precompute**: Calculate hash value of the pattern
2. **Initialize**: Calculate hash of the first window in text (same length as pattern)
3. **Compare**: For each position, if hash values match, verify with direct string comparison
4. **Roll**: Efficiently update hash using the rolling formula for next window
5. **Repeat**: Continue until end of text

### Visual Representation

```
Text: "AABAACAADAABAABA"
Pattern: "AABA"

Step 1: Calculate pattern hash
hash("AABA") → some hash value based on characters

Step 2: Slide through text
Position 0: "AABA" → hash matches → verify ✓ → found at index 0
Position 1: "ABAA" → hash doesn't match
Position 2: "BAAC" → hash doesn't match
...
Position 9: "AABA" → hash matches → verify ✓ → found at index 9
Position 12: "AABA" → hash matches → verify ✓ → found at index 12

Result: [0, 9, 12]
```

### Why Verification is Important

Since multiple strings can have the same hash value (collision), we must verify the actual strings when hashes match. This ensures correctness at the cost of only O(1) extra check per potential match.

### Why It Works

- **Rolling hash**: O(1) window updates instead of O(m) rehashing
- **Fingerprint comparison**: Fast hash comparison eliminates most positions
- **Verification**: Ensures correctness despite possible collisions
- **Average case**: Good hash function makes collisions rare

### Limitations

- **Hash Collisions**: Can cause false positives (mitigated by verification)
- **Worst Case**: O(nm) when many spurious hits occur
- **Prime Selection**: Choosing a good prime affects collision rate
- **Numerical Overflow**: Use modulo to prevent overflow

---

## Practice Problems

### Problem 1: Implement strStr()

**Problem:** [LeetCode 28 - Implement strStr()](https://leetcode.com/problems/implement-strstr/)

**Description:** Return the index of the first occurrence of `needle` in `haystack`, or -1 if `needle` is not part of `haystack`.

**How to Apply Rabin-Karp:**
- Use Rabin-Karp to find the first occurrence of needle
- Rolling hash enables efficient O(n + m) search
- Handle edge cases: empty needle returns 0

---

### Problem 2: Repeated String Match

**Problem:** [LeetCode 686 - Repeated String Match](https://leetcode.com/problems/repeated-string-match/)

**Description:** Given strings A and B, find the minimum number of times A should be repeated such that B is a substring of the repeated string.

**How to Apply Rabin-Karp:**
- Use Rabin-Karp to check if B exists in repeated A
- Optimize by limiting search to reasonable number of repetitions
- Hash comparison helps quickly rule out non-matches

---

### Problem 3: Shortest Palindrome

**Problem:** [LeetCode 214 - Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/)

**Description:** Add characters in front of the string to make it a palindrome.

**How to Apply Rabin-Karp:**
- Use rolling hash to find longest palindromic prefix
- Hash forward and reverse strings for efficient comparison
- Can combine with KMP for guaranteed linear time

---

### Problem 4: Count Unique Substrings

**Problem:** [LeetCode 1160 - Count Unique Substrings](https://leetcode.com/problems/count-unique-substrings-of-a-given-string/)

**Description:** Given a string s, return the number of unique substrings of length k.

**How to Apply Rabin-Karp:**
- Use rolling hash to generate all substring hashes
- Use a set to track unique hashes
- O(n) time to count all k-length substrings

---

### Problem 5: Find All Anagrams in a String

**Problem:** [LeetCode 438 - Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/)

**Description:** Find all start indices of p's anagrams in s.

**How to Apply Rabin-Karp:**
- Use rolling hash with character frequency
- Compare hash of pattern with hash of each window
- Note: Requires modified hash that considers character counts

---

## Video Tutorial Links

### Fundamentals

- [Rabin-Karp Algorithm - Introduction (Take U Forward)](https://www.youtube.com/watch?v=rohK5c5JjgA) - Comprehensive introduction
- [Rabin-Karp Algorithm Explained (WilliamFiset)](https://www.youtube.com/watch?v=qQ8v0xqnGuE) - Detailed explanation with code
- [Rolling Hash - Rabin Karp (NeetCode)](https://www.youtube.com/watch?v=5co5G4D2wGA) - Practical implementation

### Advanced Topics

- [Multiple Pattern Matching with Rabin-Karp](https://www.youtube.com/watch?v=BSJKjgtakE0) - Using Rabin-Karp for multiple patterns
- [Rabin Karp vs KMP vs Boyer-Moore](https://www.youtube.com/watch?v=1w7gqSY7oAQ) - Algorithm comparison
- [Rolling Hash Implementation Tips](https://www.youtube.com/watch?v=4fR6nV7al_k) - Common pitfalls and solutions

---

## Follow-up Questions

### Q1: What makes Rabin-Karp better than KMP for multiple pattern search?

**Answer:** Rabin-Karp naturally extends to multiple patterns because:
- Each pattern gets its own hash
- One pass through text can check all patterns
- Adding a new pattern doesn't require reprocessing the text
- KMP would require running the algorithm separately for each pattern

---

### Q2: How do you choose the prime number q?

**Answer:** Consider these factors:
- **Size**: Larger prime = fewer collisions but more overflow risk
- **Common choices**: 101, 1000003, 1000000007
- **Avoid**: Powers of 2 (can cause issues with modulo)
- **Trade-off**: q affects collision probability vs. performance

---

### Q3: Can Rabin-Karp be used for approximate matching?

**Answer:** Yes, with modifications:
- Use multiple hash functions with different bases
- Allow k mismatches by checking hashes within a window
- More complex but possible for fuzzy matching

---

### Q4: Why is verification necessary even when hashes match?

**Answer:** Because hash functions can have collisions:
- Two different strings can produce same hash
- This is called a "spurious hit"
- Verification ensures correctness at minimal cost
- With good hash function, false positives are rare

---

### Q5: How does base d affect performance?

**Answer:** Base selection matters:
- **Too small**: More collisions, slower verification
- **Too large**: Faster overflow, need larger modulus
- **Common**: 256 for ASCII, 911382323 for polynomial
- **DNA**: 4 works well for small alphabets

---

## Summary

Rabin-Karp is a versatile string matching algorithm that uses **rolling hash** for efficient pattern searching. Key takeaways:

- **Average O(n + m)**: Much better than naive O(nm) in practice
- **Multi-pattern support**: Unique advantage over KMP and Boyer-Moore
- **Rolling hash**: Enables O(1) window updates
- **Verification step**: Required for correctness (handles collisions)
- **Space efficient**: O(1) space for single pattern

When to use:
- ✅ Multiple pattern matching (primary use case)
- ✅ General string searching with good average case
- ✅ DNA sequence matching with small alphabets
- ❌ When worst-case guarantee is critical (use KMP)
- ❌ Very long patterns with poor hash function

This algorithm is essential for competitive programming and technical interviews, especially for problems involving string searching and pattern matching.