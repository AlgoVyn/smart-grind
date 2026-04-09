## String Matching (Naive / KMP / Rabin-Karp): Framework

What is the complete KMP algorithm template for efficient string matching?

<!-- front -->

---

### Framework: KMP String Matching

```
┌─────────────────────────────────────────────────────────────────┐
│  KMP ALGORITHM - TEMPLATE                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Key Insight: LPS array prevents backtracking in text         │
│                                                                 │
│  1. Preprocess pattern to compute LPS array:                    │
│     - lps[i] = length of longest proper prefix which is       │
│       also a suffix for pattern[0..i]                         │
│                                                                 │
│  2. Pattern matching with two pointers:                        │
│     - i: text index (never decreases)                         │
│     - j: pattern index (can decrease using lps)               │
│                                                                 │
│  3. Match case:                                                │
│     - if text[i] == pattern[j]: i++, j++                      │
│     - if j == m: found match at i-j, j = lps[j-1]            │
│                                                                 │
│  4. Mismatch case:                                             │
│     - if j > 0: j = lps[j-1]  (skip ahead in pattern)        │
│     - if j == 0: i++  (advance in text only)                 │
│                                                                 │
│  5. Time: O(n + m), Space: O(m)                                │
└─────────────────────────────────────────────────────────────────┘
```

---

### LPS Array Computation

```python
def compute_lps(pattern: str) -> list[int]:
    """
    Compute LPS (Longest Prefix Suffix) array.
    lps[i] = length of longest proper prefix which is also suffix.
    """
    m = len(pattern)
    lps = [0] * m
    length = 0  # length of previous longest prefix suffix
    i = 1
    
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]  # Fall back
            else:
                lps[i] = 0
                i += 1
    
    return lps
```

**Example LPS computation for "ABABC":**
- `lps[0] = 0` (no proper prefix)
- `lps[1] = 0` ("B" has no matching prefix/suffix)
- `lps[2] = 1` ("A" is prefix and suffix of "ABA")
- `lps[3] = 2` ("AB" is prefix and suffix of "ABAB")
- `lps[4] = 0` ("C" has no matching prefix/suffix)

**Result**: `lps = [0, 0, 1, 2, 0]`

---

### Complete KMP Implementation

```python
def kmp_string_match(text: str, pattern: str) -> list[int]:
    """
    Find all occurrences of pattern in text using KMP.
    Time: O(n + m), Space: O(m)
    """
    n, m = len(text), len(pattern)
    
    # Edge cases
    if m == 0:
        return list(range(n + 1))
    if n == 0 or m > n:
        return []
    
    # Preprocess pattern
    lps = compute_lps(pattern)
    
    matches = []
    i = j = 0  # i: text index, j: pattern index
    
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
            
            if j == m:  # Full pattern match
                matches.append(i - j)
                j = lps[j - 1]  # Continue searching
        else:
            if j != 0:
                j = lps[j - 1]  # Use LPS to skip
            else:
                i += 1  # Advance text only
    
    return matches
```

---

### Key Framework Elements

| Element | Purpose | Example |
|---------|---------|---------|
| `lps[]` | Skip redundant comparisons | `lps = [0,0,1,2,0]` for "ABABC" |
| `i` | Text pointer (never backtracks) | Scans text left to right |
| `j` | Pattern pointer (can reset) | Uses lps[j-1] on mismatch |
| `j = lps[j-1]` | Skip ahead in pattern | Avoids restarting from 0 |
| `j == m` | Match found | Record match, continue with lps |

---

### LeetCode 28: Implement strStr()

```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        """Return first index of needle in haystack, or -1."""
        matches = kmp_string_match(haystack, needle)
        return matches[0] if matches else -1
```

<!-- back -->
