## String Matching (Naive / KMP / Rabin-Karp): Forms

What are the different implementations and forms of string matching algorithms?

<!-- front -->

---

### Form 1: Naive String Matching

Simple brute-force approach checking every position.

```python
def naive_string_match(text: str, pattern: str) -> list[int]:
    """
    Find all occurrences of pattern in text.
    Time: O(n × m), Space: O(1)
    """
    n, m = len(text), len(pattern)
    matches = []
    
    # Edge case: empty pattern matches at every position
    if m == 0:
        return list(range(n + 1))
    
    # Check each possible starting position
    for i in range(n - m + 1):
        match = True
        for j in range(m):
            if text[i + j] != pattern[j]:
                match = False
                break
        if match:
            matches.append(i)
    
    return matches
```

**Space**: O(1), **Time**: O(n × m)

---

### Form 2: KMP with Full Array (All Matches)

Standard KMP returning all starting indices of matches.

```python
def kmp_all_matches(text: str, pattern: str) -> list[int]:
    """
    Find all occurrences using KMP.
    Time: O(n + m), Space: O(m)
    """
    def compute_lps(pattern):
        m = len(pattern)
        lps = [0] * m
        length = 0
        i = 1
        while i < m:
            if pattern[i] == pattern[length]:
                length += 1
                lps[i] = length
                i += 1
            else:
                length = lps[length - 1] if length != 0 else 0
                if length == 0:
                    lps[i] = 0
                    i += 1
        return lps
    
    n, m = len(text), len(pattern)
    if m == 0: return list(range(n + 1))
    if m > n: return []
    
    lps = compute_lps(pattern)
    matches = []
    i = j = 0
    
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == m:
                matches.append(i - j)
                j = lps[j - 1]
        else:
            j = lps[j - 1] if j != 0 else 0
            if j == 0:
                i += 1
    
    return matches
```

**Use case**: Need all match positions (e.g., find-and-replace)

---

### Form 3: KMP - First Match Only (strStr)

Optimized for finding just the first occurrence (LeetCode 28).

```python
def kmp_first_match(text: str, pattern: str) -> int:
    """
    Return first index of pattern in text, or -1.
    Slightly optimized for single match.
    """
    def compute_lps(pattern):
        m = len(pattern)
        lps = [0] * m
        length = 0
        i = 1
        while i < m:
            if pattern[i] == pattern[length]:
                length += 1
                lps[i] = length
                i += 1
            else:
                length = lps[length - 1] if length != 0 else 0
                if length == 0:
                    lps[i] = 0
                    i += 1
        return lps
    
    n, m = len(text), len(pattern)
    if m == 0: return 0
    if m > n: return -1
    
    lps = compute_lps(pattern)
    i = j = 0
    
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == m:
                return i - j  # Return immediately on first match
        else:
            j = lps[j - 1] if j != 0 else 0
            if j == 0:
                i += 1
    
    return -1
```

**Optimization**: Returns immediately on first match (no array building).

---

### Form 4: Rabin-Karp Rolling Hash

Hash-based string matching with rolling window.

```python
def rabin_karp_match(text: str, pattern: str, base: int = 256, prime: int = 101) -> list[int]:
    """
    Find all matches using rolling hash.
    Time: O(n + m) avg, Space: O(1)
    """
    n, m = len(text), len(pattern)
    matches = []
    
    if m == 0:
        return list(range(n + 1))
    if m > n:
        return []
    
    # Precompute base^(m-1) % prime
    h = pow(base, m - 1, prime)
    
    # Compute initial hashes
    p_hash = 0
    t_hash = 0
    for i in range(m):
        p_hash = (base * p_hash + ord(pattern[i])) % prime
        t_hash = (base * t_hash + ord(text[i])) % prime
    
    # Slide window
    for i in range(n - m + 1):
        if p_hash == t_hash:
            # Verify collision
            if text[i:i+m] == pattern:
                matches.append(i)
        
        # Roll hash to next window
        if i < n - m:
            t_hash = (base * (t_hash - ord(text[i]) * h) + ord(text[i + m])) % prime
            if t_hash < 0:
                t_hash += prime
    
    return matches
```

**Best for**: Multiple pattern scenarios, fingerprinting

---

### Form 5: Count Matches Only (Space Optimized)

When you only need the count, not positions.

```python
def count_matches_kmp(text: str, pattern: str) -> int:
    """
    Count occurrences without storing indices.
    Space: O(m) for LPS only, no matches array.
    """
    def compute_lps(pattern):
        m = len(pattern)
        lps = [0] * m
        length = 0
        i = 1
        while i < m:
            if pattern[i] == pattern[length]:
                length += 1
                lps[i] = length
                i += 1
            else:
                length = lps[length - 1] if length != 0 else 0
                if length == 0:
                    i += 1
        return lps
    
    n, m = len(text), len(pattern)
    if m == 0: return n + 1
    if m > n: return 0
    
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
        else:
            j = lps[j - 1] if j != 0 else 0
            if j == 0:
                i += 1
    
    return count
```

**Space**: O(m) only (no matches list)

---

### Form 6: Case-Insensitive Matching

Wrapper for case-insensitive search.

```python
def kmp_case_insensitive(text: str, pattern: str) -> list[int]:
    """
    Case-insensitive string matching using KMP.
    """
    # Preprocess both to lowercase
    text_lower = text.lower()
    pattern_lower = pattern.lower()
    
    # Use standard KMP on lowercase versions
    matches = kmp_all_matches(text_lower, pattern_lower)
    
    # Return indices from original text
    return matches
```

---

### Form Comparison

| Form | Space | Time | Best For |
|------|-------|------|----------|
| Naive | O(1) | O(n × m) | Learning, small inputs |
| KMP All Matches | O(m + k) | O(n + m) | Finding all positions |
| KMP First Match | O(m) | O(n + m) | `strStr()` problems |
| KMP Count Only | O(m) | O(n + m) | Just need count |
| Rabin-Karp | O(1) | O(n + m) avg | Multiple patterns |
| Case-Insensitive | O(n + m) | O(n + m) | Text search engines |

(k = number of matches)

---

### Form Selection Guide

| Requirement | Recommended Form |
|-------------|------------------|
| Find all positions | KMP All Matches |
| Just need count | KMP Count Only |
| First occurrence only | KMP First Match |
| Multiple patterns | Rabin-Karp |
| Case-insensitive | Case-Insensitive Wrapper |
| Unicode/ASCII handling | KMP (more reliable than hash) |
| Very large text | KMP or Rabin-Karp |
| Teaching/learning | Naive → KMP progression |

<!-- back -->
