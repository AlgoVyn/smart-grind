## String - Anagram Check: Core Concepts

What are the fundamental concepts and insights behind anagram checking?

<!-- front -->

---

### Fundamental Definition

**Problem:** Determine if two strings are anagrams - words formed by rearranging the same letters with identical frequencies.

| Aspect | Description |
|--------|-------------|
| **Input** | Two strings to compare |
| **Output** | Boolean: true if anagrams, false otherwise |
| **Key Property** | Identical character frequency fingerprint |
| **Example** | "listen" and "silent" are anagrams |

---

### Key Insight: The "Fingerprint" Concept

```
String: "listen"
┌─────────────────────────────────────┐
│  a  b  c  d  e  f  g  h  i  j  k   │
│  0  0  0  0  1  0  0  0  1  0  0   │
├─────────────────────────────────────┤
│  l  m  n  o  p  q  r  s  t  u  v   │
│  1  0  1  0  0  0  0  1  1  0  0   │
├─────────────────────────────────────┤
│  w  x  y  z                         │
│  0  0  0  0                         │
└─────────────────────────────────────┘

String: "silent"
Same fingerprint! → ANAGRAM ✓

Any string with this fingerprint is an anagram of "listen".
```

**Critical observation:** Character order is irrelevant - only frequency matters.

---

### The "Aha!" Moments

1. **Why frequency equality works:**
   - Anagram = rearrangement = same multiset of characters
   - "listen" has: {e:1, i:1, l:1, n:1, s:1, t:1}
   - "silent" has: {e:1, i:1, l:1, n:1, s:1, t:1}
   - Identical multisets = anagrams

2. **Early termination insight:**
   - Different lengths → impossible to be anagrams
   - O(1) check saves O(n) processing

3. **Single-pass optimization:**
   - Instead of: count s, count t, then compare
   - Do: increment for s[i], decrement for t[i]
   - Net effect: zero if balanced

---

### Mathematical Foundation

```
Definition: Strings s and t are anagrams iff:
  ∀c ∈ Σ: count(s, c) = count(t, c)

Where:
  - Σ = character set (alphabet)
  - count(s, c) = frequency of char c in string s

This is equivalent to:
  s_sorted = t_sorted
  
But sorting is O(n log n) vs frequency count O(n)
```

---

### Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| **Frequency Array** | O(n) | O(1) (26 chars) | Lowercase a-z, optimal |
| **Hash Map** | O(n) | O(k) unique chars | Unicode/unknown charset |
| **Sorting** | O(n log n) | O(n) | Quick interview solution |
| **Prime Product** | O(n) | O(1) | Theoretical, collision risk |

---

### Common Pitfalls

| Pitfall | Issue | Solution |
|---------|-------|----------|
| Skip length check | Wastes computation | Always check `len(s) != len(t)` first |
| Off-by-one indexing | `char - 'a'` overflow | Ensure input only contains a-z |
| Unicode handling | Hash map needed | Use dict/Map for non-ASCII |
| Modifying original | Side effects | Create copies if sorting |
| Case sensitivity | "Listen" vs "silent" | Convert to lower/upper first |
| Ignoring spaces/punctuation | "Astronomer" vs "Moon starer" | Preprocess to remove non-letters |

---

### Extensions of the Pattern

1. **Group Anagrams:** Use sorted string or frequency tuple as hash key
2. **Find All Anagrams in String:** Sliding window with frequency matching
3. **Ransom Note:** Check if magazine frequencies cover ransom frequencies
4. **Valid Palindrome Permutation:** At most one character has odd count

<!-- back -->
