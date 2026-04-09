## String - Anagram Check: Comparison

When should you use different approaches for anagram checking?

<!-- front -->

---

### Approach Comparison Matrix

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Frequency Array (26)** | O(n) | O(1) | **Lowercase English - Optimal** |
| **Hash Map** | O(n) | O(k) | Unicode, unknown character sets |
| **Sorting** | O(n log n) | O(n) | Quick implementation, interviews |
| **Prime Multiplication** | O(n) | O(1) | Mathematical elegance (overflow risk) |

---

### Frequency Array vs Hash Map

| Aspect | Frequency Array | Hash Map |
|--------|-----------------|----------|
| **Space** | O(1) - fixed 26 elements | O(k) - k unique chars |
| **Time** | O(n) - guaranteed | O(n) average, O(n×k) worst |
| **Character set** | Limited (a-z) | Unlimited (Unicode) |
| **Cache efficiency** | ✅ Excellent (contiguous array) | ❌ Hash collisions possible |
| **Code complexity** | Index math `ord(c) - ord('a')` | Clean with Counter/dict |
| **Memory overhead** | Minimal (26 integers) | Hash table overhead |
| **Preconditions** | Must validate lowercase | Handles any hashable type |

**Rule of thumb:**
- Interview says "lowercase English letters" → Use **array**
- Unicode, mixed case, special chars → Use **hash map**

---

### Frequency Count vs Sorting

| Aspect | Frequency Count | Sorting |
|--------|-----------------|---------|
| **Time** | O(n) - optimal | O(n log n) |
| **Space** | O(1) or O(k) | O(n) for sorted copies |
| **Code length** | 10-15 lines | 1 line in Python |
| **Interview preference** | ✅ Shows optimal thinking | Quick but suboptimal |
| **Real-world performance** | ✅ Much faster for large n | Acceptable for small n |
| **Stability** | In-place counting | Creates new sorted arrays |
| **Extension** | Easy to modify counts | Hard to adapt |

**Winner:** Frequency count for production and interviews.

**Sorting acceptable when:**
- String length < 1000
- Quick one-off check needed
- Interview time pressure

---

### Single-Pass vs Two-Pass Counting

| Approach | Method | Efficiency |
|----------|--------|------------|
| **Two-pass** | Count s fully, then count t, then compare | 2n iterations + 26 checks |
| **Single-pass** | Increment s[i], decrement t[i] together | n iterations + 26 checks |
| **Single-pass (final check)** | Combined loop, verify all zeros at end | n iterations + 26 checks |

**Single-pass is preferred** - cleaner code and slightly more cache-friendly.

```python
# Two-pass (less preferred)
def two_pass(s, t):
    if len(s) != len(t):
        return False
    count_s = [0] * 26
    count_t = [0] * 26
    for c in s:
        count_s[ord(c) - ord('a')] += 1
    for c in t:
        count_t[ord(c) - ord('a')] += 1
    return count_s == count_t

# Single-pass (preferred)
def single_pass(s, t):
    if len(s) != len(t):
        return False
    count = [0] * 26
    for i in range(len(s)):
        count[ord(s[i]) - ord('a')] += 1
        count[ord(t[i]) - ord('a')] -= 1
    return all(c == 0 for c in count)
```

---

### Counter vs Manual Hash Map

| Aspect | `collections.Counter` | Manual dict |
|--------|----------------------|-------------|
| **Code length** | 1-3 lines | 10-15 lines |
| **Readability** | ✅ Very clear | Verbose but explicit |
| **Performance** | Slight overhead | Slightly faster |
| **Control** | Limited | Full control |
| **Interview** | Acceptable | Better for showing work |
| **Production** | ✅ Pythonic, readable | Rarely needed |

```python
# Counter (concise - good for production)
from collections import Counter
def is_anagram_counter(s, t):
    return Counter(s) == Counter(t)

# Manual (explicit - good for interviews)
def is_anagram_manual(s, t):
    if len(s) != len(t):
        return False
    freq = {}
    for c in s:
        freq[c] = freq.get(c, 0) + 1
    for c in t:
        if c not in freq or freq[c] == 0:
            return False
        freq[c] -= 1
    return True
```

---

### Decision Flowchart

```
Input: Two strings s and t
│
├─ Are they different lengths?
│  └─→ Return False (O(1) early exit)
│
├─ Are they guaranteed lowercase a-z?
│  ├─ Yes → Use Frequency Array (O(n) time, O(1) space)
│  └─ No → Continue...
│
├─ Do they contain Unicode/special chars?
│  ├─ Yes → Use Hash Map (O(n) time, O(k) space)
│  └─ No → Continue...
│
├─ Is this a quick check or interview shortcut?
│  ├─ Yes → Use Sorting (O(n log n) time, O(n) space)
│  └─ No → Use Hash Map (safest general solution)
```

---

### Scenario-Based Recommendations

| Situation | Approach | Space | Why |
|-----------|----------|-------|-----|
| LeetCode "Valid Anagram" | Frequency array | O(1) | Constraints guarantee a-z |
| Unicode text processing | Hash map | O(k) | Handles all characters |
| Interview quick solution | Sorting | O(n) | Easiest to remember |
| Production Python code | Counter | O(k) | Pythonic, readable |
| Memory-constrained embedded | Array + bit ops | O(1) | Minimal footprint |
| Case-insensitive matching | Array + lowercase | O(1) | Normalize then count |
| Very long strings (streaming) | External sort | O(1) external | Can't fit in memory |
| Mathematical puzzle | Prime product | O(1) | Elegant but risky |

---

### Performance Comparison (Theoretical)

| n | Sorting O(n log n) | Frequency O(n) | Speedup |
|---|-------------------|----------------|---------|
| 10 | ~33 ops | 10 ops | 3.3x |
| 100 | ~664 ops | 100 ops | 6.6x |
| 1,000 | ~10,000 ops | 1,000 ops | 10x |
| 10^6 | ~20M ops | 1M ops | 20x |
| 10^9 | ~30B ops | 1B ops | 30x |

**Frequency count dominates for large inputs.**

---

### Related Problem Pattern Extensions

| Problem | Variation | Approach Modification |
|---------|-----------|------------------------|
| **Group Anagrams** | Multiple strings | Use signature as hash key |
| **Find All Anagrams** | Substring search | Sliding window + frequency compare |
| **Ransom Note** | Subset check | Frequency >= instead of == |
| **Palindrome Permutation** | Odd count check | Count odds <= 1 |
| **Minimum Window** | Contains all chars | Two-pointer + frequency tracking |
| **Anagram Distance** | Min changes needed | Sum of abs differences / 2 |

---

### Language-Specific Recommendations

| Language | Recommended Approach | Notes |
|----------|---------------------|-------|
| **Python** | `Counter` or array | `Counter` most Pythonic |
| **Java** | Array or HashMap | Array preferred for a-z |
| **C++** | Array or `unordered_map` | Array fastest |
| **JavaScript** | Array or object/Map | Array for a-z, Map for Unicode |
| **Go** | Array or map[rune]int | Array for ASCII |

<!-- back -->
