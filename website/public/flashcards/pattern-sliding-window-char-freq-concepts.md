## Sliding Window - Character Frequency: Core Concepts

What are the fundamental principles of character frequency matching with sliding window?

<!-- front -->

---

### Core Concept

Use **sliding window with character frequency counters** to efficiently find substrings that are permutations (anagrams) of a target pattern.

**Key insight**: Two strings are permutations if they have identical character frequency counts.

---

### The Pattern

```
Find anagrams of "abc" in "cbaebabacd"

Pattern: a=1, b=1, c=1

Window "cba": a=1, b=1, c=1 → Match! ✓
Window "bae": a=1, b=1, e=1 → No match
Window "aeb": a=1, b=1, e=1 → No match
Window "eba": a=1, b=1, e=1 → No match
Window "bab": a=1, b=2 → No match
Window "aba": a=2, b=1 → No match
Window "bac": a=1, b=1, c=1 → Match! ✓
Window "acd": a=1, c=1, d=1 → No match

Result: [0, 6]
```

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| Find Anagrams | All starting indices | Find All Anagrams |
| Permutation Check | Contains permutation | Permutation in String |
| String Comparison | Compare without sorting | Anagram Check |
| DNA Sequences | Repeated patterns | Repeated DNA Sequences |
| Letter Cases | Case-insensitive matching | Case variations |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Single pass, O(1) counter updates |
| Space | O(1) | At most 26/256 characters |
| Comparison | O(1) | Fixed-size alphabet |

<!-- back -->
