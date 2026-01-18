# String Matching - Naive / KMP / Rabin-Karp

## Overview

The String Matching pattern is used to find occurrences of a substring (pattern) within a larger string (text). Three common approaches are the naive approach, the KMP algorithm, and the Rabin-Karp algorithm, each with different time complexity trade-offs.

## Key Concepts

- **Pattern and Text**: The substring to find and the string to search in.
- **Naive Approach**: Check every possible starting index in text for pattern match.
- **KMP Algorithm**: Uses a prefix function to skip unnecessary comparisons.
- **Rabin-Karp Algorithm**: Uses hashing to compare substrings quickly.

## Templates

```python
# Naive Approach
def naive_string_match(text, pattern):
    n, m = len(text), len(pattern)
    matches = []
    
    for i in range(n - m + 1):
        match = True
        for j in range(m):
            if text[i + j] != pattern[j]:
                match = False
                break
        if match:
            matches.append(i)
    
    return matches

# KMP Algorithm
def kmp_string_match(text, pattern):
    n, m = len(text), len(pattern)
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
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    
    return matches

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
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    
    return lps

# Rabin-Karp Algorithm
def rabin_karp_string_match(text, pattern, base=256, prime=101):
    n, m = len(text), len(pattern)
    matches = []
    p_hash = 0
    t_hash = 0
    h = 1
    
    for i in range(m - 1):
        h = (h * base) % prime
    
    for i in range(m):
        p_hash = (base * p_hash + ord(pattern[i])) % prime
        t_hash = (base * t_hash + ord(text[i])) % prime
    
    for i in range(n - m + 1):
        if p_hash == t_hash:
            match = True
            for j in range(m):
                if text[i + j] != pattern[j]:
                    match = False
                    break
            if match:
                matches.append(i)
        
        if i < n - m:
            t_hash = (base * (t_hash - ord(text[i]) * h) + ord(text[i + m])) % prime
            if t_hash < 0:
                t_hash += prime
    
    return matches
```

## Example Problems

1. **Implement strStr() (LeetCode 28)**: Find the index of the first occurrence of a substring.
2. **Find All Anagrams in a String (LeetCode 438)**: Find all starting indices of anagrams.
3. **Repeated Substring Pattern (LeetCode 459)**: Check if string is repeated substring.

## Time and Space Complexity

- **Naive Approach**: O(n*m) time, O(1) space.
- **KMP Algorithm**: O(n + m) time, O(m) space for LPS array.
- **Rabin-Karp Algorithm**: O(n + m) average time, O(1) space.

## Common Pitfalls

- **Naive approach for large strings**: Inefficient for large inputs.
- **Incorrect LPS array computation**: Causes KMP to fail.
- **Hash collisions in Rabin-Karp**: Can lead to incorrect matches.
- **Off-by-one errors in loop bounds**: Forgetting to adjust for pattern length.
- **Not handling empty pattern**: Trivial case needs special handling.
