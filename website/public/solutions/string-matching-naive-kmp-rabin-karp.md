# String Matching - Naive / KMP / Rabin-Karp

## Overview

Find occurrences of a pattern in a text string using different algorithms. Naive is brute force, KMP uses prefix table for efficiency, Rabin-Karp uses hashing. Use when searching substrings. Benefits: Varying time complexities for different scenarios.

## Key Concepts

- **Naive**: Check every position.
- **KMP**: Build prefix table to skip characters.
- **Rabin-Karp**: Hash substrings for quick comparison.

## Template

```python
# Naive
def naive_search(text: str, pattern: str) -> list[int]:
    result = []
    for i in range(len(text) - len(pattern) + 1):
        if text[i:i+len(pattern)] == pattern:
            result.append(i)
    return result

# KMP
def kmp_search(text: str, pattern: str) -> list[int]:
    def compute_lps(pattern):
        lps = [0] * len(pattern)
        length = 0
        i = 1
        while i < len(pattern):
            if pattern[i] == pattern[length]:
                length += 1
                lps[i] = length
                i += 1
            else:
                if length != 0:
                    length = lps[length - 1]
                else:
                    lps[i] = 0
                    i += 1
        return lps
    
    lps = compute_lps(pattern)
    i = 0
    j = 0
    result = []
    while i < len(text):
        if pattern[j] == text[i]:
            i += 1
            j += 1
        if j == len(pattern):
            result.append(i - j)
            j = lps[j - 1]
        elif i < len(text) and pattern[j] != text[i]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    return result

# Rabin-Karp
def rabin_karp(text: str, pattern: str) -> list[int]:
    if not pattern:
        return []
    base = 256
    mod = 10**9 + 7
    n, m = len(text), len(pattern)
    pattern_hash = 0
    text_hash = 0
    h = 1
    for i in range(m-1):
        h = (h * base) % mod
    for i in range(m):
        pattern_hash = (pattern_hash * base + ord(pattern[i])) % mod
        text_hash = (text_hash * base + ord(text[i])) % mod
    result = []
    for i in range(n - m + 1):
        if pattern_hash == text_hash:
            if text[i:i+m] == pattern:
                result.append(i)
        if i < n - m:
            text_hash = (text_hash - ord(text[i]) * h) % mod
            text_hash = (text_hash * base + ord(text[i+m])) % mod
            if text_hash < 0:
                text_hash += mod
    return result
```

## Example Problems

- **Implement strStr**: Return index of first occurrence.
- **Find All Anagrams in a String**: Find anagram positions.
- **Repeated String Match**: Find minimum repeats to contain pattern.

## Time and Space Complexity

- **Naive**: O((n-m+1)*m) worst case.
- **KMP**: O(n + m).
- **Rabin-Karp**: O(n + m) average, O((n-m+1)*m) worst.

## Common Pitfalls

- Hash collisions in Rabin-Karp.
- Incorrect LPS computation in KMP.
- Not handling empty strings.