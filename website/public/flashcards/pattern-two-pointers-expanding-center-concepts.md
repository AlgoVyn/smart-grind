## Two Pointers - Expanding from Center: Core Concepts

What are the fundamental principles of the Expanding from Center pattern for palindromes?

<!-- front -->

---

### Core Concept

Use **two pointers expanding outward from each position** to find palindromic substrings centered at that position.

**Key insight**: Every palindrome has a center (one character for odd length, between two for even), and we can expand while characters match.

---

### The Pattern

```
Find palindromes in: "abba"

Odd length (center at each char):
  a → expand: "a" (palindrome)
  b → expand: "b" → "abb"? no → "b"
  b → expand: "b" → "bba"? no → "b"
  a → expand: "a" (palindrome)

Even length (center between chars):
  a|b → "ab"? no
  b|b → expand: "bb" → "abba"? yes
  b|a → "ba"? no

Longest: "abba" (even center between positions 1-2)
```

---

### Why It Works

| Center Type | Palindrome Length | Expansion |
|-------------|-------------------|-----------|
| Single char | Odd (2k+1) | left = i-k, right = i+k |
| Between chars | Even (2k) | left = i-k+1, right = i+k |

**Total centers**: 2n - 1 (n single + n-1 between)

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| Longest Palindrome | Find longest palindromic substring | Longest Palindromic Substring |
| Count Palindromes | Count all palindromic substrings | Count Palindromic Substrings |
| Palindrome Partitions | Split into palindromes | Palindrome Partitioning |
| Manacher's Algorithm | Linear time longest palindrome | Advanced optimization |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n²) | n centers × O(n) expansion |
| Space | O(1) | No extra storage |
| Optimized | O(n) | Manacher's algorithm |

<!-- back -->
