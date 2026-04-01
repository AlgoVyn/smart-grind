## Title: KMP Algorithm

What is the Knuth-Morris-Pratt (KMP) algorithm and what problem does it solve?

<!-- front -->

---

### Definition
Linear-time string matching algorithm that finds all occurrences of a pattern P in text T. Preprocesses pattern to avoid re-checking characters.

### Core Insight
When a mismatch occurs at position j in pattern, we already know T[i-j..i-1] matched P[0..j-1]. Use this info to skip ahead without re-checking.

### Key Property
The failure function (prefix function) π[j] = length of longest proper prefix of P[0..j] that is also a suffix.

---

### Algorithm Overview
```
Phase 1: Build prefix function π (O(m))
Phase 2: Match pattern to text (O(n))
Total: O(n + m) time, O(m) space
```

### Prefix Function
```python
def compute_prefix(pattern):
    m = len(pattern)
    pi = [0] * m
    for i in range(1, m):
        j = pi[i-1]
        while j > 0 and pattern[i] != pattern[j]:
            j = pi[j-1]
        if pattern[i] == pattern[j]:
            j += 1
        pi[i] = j
    return pi
```

---

### KMP Matching
```python
def kmp_search(text, pattern):
    n, m = len(text), len(pattern)
    pi = compute_prefix(pattern)
    j = 0  # pattern index
    matches = []
    
    for i in range(n):
        while j > 0 and text[i] != pattern[j]:
            j = pi[j-1]
        if text[i] == pattern[j]:
            j += 1
        if j == m:
            matches.append(i - m + 1)
            j = pi[j-1]
    return matches
```

<!-- back -->
