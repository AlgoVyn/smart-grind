## String - Anagram Check: Comparison

When should you use different approaches for anagram checking?

<!-- front -->

---

### Frequency Array vs Hash Map

| Aspect | Frequency Array | Hash Map |
|--------|-----------------|----------|
| **Space** | O(1) - fixed 26 elements | O(k) - k unique chars |
| **Time** | O(n) | O(n) average |
| **Character set** | Limited (a-z) | Unlimited (Unicode) |
| **Cache efficiency** | ✅ Excellent (array) | ❌ Hash collisions possible |
| **Code simplicity** | Slightly more (index math) | Clean with Counter/dict |
| **Worst-case time** | Guaranteed O(n) | O(n×k) if many collisions |
| **Memory overhead** | Minimal | Hash table overhead |

**Rule of thumb:** Use array for a-z, hash map for everything else.

---

### Frequency Count vs Sorting

| Aspect | Frequency Count | Sorting |
|--------|-----------------|---------|
| **Time** | O(n) | O(n log n) |
| **Space** | O(1) or O(k) | O(n) for arrays/strings |
| **Implementation** | Slightly longer | One-liner in Python |
| **Interview preference** | Shows understanding | Quick to write |
| **Real-world performance** | ✅ Much faster for large n | Acceptable for small n |
| **Stability** | In-place counting | Creates new sorted copies |

**Winner:** Frequency count for interviews (shows optimal thinking).

---

### Single-Pass vs Two-Pass Counting

| Approach | Method | Efficiency |
|----------|--------|------------|
| **Two-pass** | Count s, count t, compare | 2n iterations + comparison |
| **Single-pass** | Increment s[i], decrement t[i] | n iterations + 26 checks |

**Single-pass is cleaner and slightly more cache-friendly.**

```python
# Two-pass (less preferred)
def two_pass(s, t):
    count_s, count_t = {}, {}
    for c in s: count_s[c] = count_s.get(c, 0) + 1
    for c in t: count_t[c] = count_t.get(c, 0) + 1
    return count_s == count_t

# Single-pass (preferred)
def single_pass(s, t):
    freq = [0] * 26
    for i in range(len(s)):
        freq[ord(s[i]) - ord('a')] += 1
        freq[ord(t[i]) - ord('a')] -= 1
    return all(c == 0 for c in freq)
```

---

### Counter vs Manual Hash Map

| Aspect | collections.Counter | Manual dict |
|--------|---------------------|-------------|
| **Code length** | 1 line | 5-10 lines |
| **Readability** | ✅ Very clear | Verbose but explicit |
| **Performance** | Slight overhead | Slightly faster |
| **Control** | Limited | Full control over logic |
| **Interview** | Acceptable | Better for showing work |

```python
# Counter (concise)
from collections import Counter
def is_anagram_counter(s, t):
    return Counter(s) == Counter(t)

# Manual (explicit)
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

### Decision Matrix

| Situation | Approach | Space | Why |
|-----------|----------|-------|-----|
| Lowercase a-z guaranteed | Frequency array | O(1) | Fastest, simplest |
| Mixed case / Unicode | Hash map | O(k) | Handles all characters |
| Interview quick solution | Sorting | O(n) | Easiest to remember |
| Production code | Counter | O(k) | Pythonic, readable |
| Embedded/memory constrained | Array + bit manipulation | O(1) | Minimal footprint |
| Very long strings | Streaming + external sort | O(1) external | Can't fit in memory |

---

### Related Problem Patterns

| Problem | Variation | Approach Extension |
|---------|-----------|-------------------|
| **Group Anagrams** | Multiple strings | Signature as hash key |
| **Find All Anagrams** | Substring search | Sliding window + freq compare |
| **Ransom Note** | Subset check | Frequency >= instead of == |
| **Palindrome Permutation** | Odd count check | Count odds <= 1 |
| **Minimum Window Substring** | Contains all chars | Two-pointer + freq tracking |

---

### Performance Comparison (Theoretical)

| n | Sorting O(n log n) | Frequency O(n) | Speedup |
|---|-------------------|----------------|---------|
| 10 | ~33 ops | 10 ops | 3.3x |
| 100 | ~664 ops | 100 ops | 6.6x |
| 10^6 | ~20M ops | 1M ops | 20x |
| 10^9 | ~30B ops | 1B ops | 30x |

**Frequency count dominates for large inputs.**

<!-- back -->
