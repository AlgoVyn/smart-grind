## Two Pointers - Expanding From Center (Palindromes): Core Concepts

What are the fundamental principles of the Expanding From Center pattern for palindromes?

<!-- front -->

---

### Core Concept

Use **two pointers expanding outward from each position** to find palindromic substrings centered at that position.

**Key insight**: Every palindrome has symmetric structure around a center. A center can be:
- **Odd length**: Single character (e.g., "aba" centered at 'b')
- **Even length**: Between two characters (e.g., "abba" centered between 'bb')

---

### The Pattern

```
String: "babad"

Odd centers (single character):
  Position 0: 'b' → expand: "b" (match)
  Position 1: 'a' → expand: "bab" (match) → expand: no match
  Position 2: 'b' → expand: "aba" (match) → expand: no match
  Position 3: 'a' → expand: "a" (match)
  Position 4: 'd' → expand: "d" (match)

Even centers (between characters):
  0|1: "ba" → no match
  1|2: "ab" → no match
  2|3: "ba" → no match
  3|4: "ad" → no match

Result: "bab" or "aba" (both length 3)
```

---

### Why It Works

| Center Type | Palindrome Length | Formula |
|-------------|-------------------|---------|
| Single char | Odd (2k+1) | left = i-k, right = i+k |
| Between chars | Even (2k) | left = i-k+1, right = i+k |

**Symmetry property**: If `s[i-k..i+k]` is a palindrome, check if `s[i-k-1] == s[i+k+1]` to extend.

**Total centers**: 2n - 1 (n single character centers + n-1 between character centers)

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| Longest Palindrome | Find longest palindromic substring | Longest Palindromic Substring (LC 5) |
| Count Palindromes | Count all palindromic substrings | Palindromic Substrings (LC 647) |
| Palindrome Partitioning | Split into palindrome substrings | Palindrome Partitioning (LC 131) |
| Valid Palindrome II | Check with one deletion allowed | Valid Palindrome II (LC 680) |
| Manacher's Algorithm | O(n) time longest palindrome | Advanced optimization |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n²) | n centers × O(n) expansion worst case |
| Space | O(1) | Only using pointers |
| Optimized | O(n) | Manacher's algorithm (rarely needed) |

**Why O(n²) time?**
- For each of n positions, we expand outward
- In worst case (all same chars), expansion is O(n) per center
- Total: O(n × n) = O(n²)

<!-- back -->
