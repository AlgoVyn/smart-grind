## Rabin-Karp: Forms & Variations

What are the different forms and variations of Rabin-Karp pattern matching?

<!-- front -->

---

### Form 1: Exact String Matching

```python
# Standard use case:
# Find "pattern" in "text" and return all starting positions

def find_pattern(text, pattern):
    """Basic exact match using Rabin-Karp."""
    indices = rabin_karp(text, pattern)
    return indices  # List of match positions

# Example: find_pattern("hello world", "world") → [6]
```

---

### Form 2: Longest Repeated Substring

```python
def longest_repeated_substring(s):
    """
    Find longest substring that appears at least twice.
    Binary search on length + Rabin-Karp.
    """
    n = len(s)
    
    def has_repeated_of_length(length):
        """Check if any substring of length repeats."""
        seen = set()
        base, mod = 256, 10**9 + 7
        h = pow(base, length - 1, mod)
        
        # First window
        window_hash = 0
        for i in range(length):
            window_hash = (window_hash * base + ord(s[i])) % mod
        seen.add(window_hash)
        
        # Check remaining windows
        for i in range(n - length):
            window_hash = (window_hash - ord(s[i]) * h) % mod
            window_hash = (window_hash * base) % mod
            window_hash = (window_hash + ord(s[i + length])) % mod
            
            if window_hash in seen:
                return True
            seen.add(window_hash)
        
        return False
    
    # Binary search for maximum length
    low, high = 1, n
    result = 0
    while low <= high:
        mid = (low + high) // 2
        if has_repeated_of_length(mid):
            result = mid
            low = mid + 1
        else:
            high = mid - 1
    
    return result
```

---

### Form 3: Anagram Detection

```python
def find_anagrams(s, pattern):
    """
    Find all anagrams of pattern in s.
    Use character frequency hash.
    """
    from collections import Counter
    
    m, n = len(pattern), len(s)
    if m > n:
        return []
    
    pattern_count = Counter(pattern)
    window_count = Counter(s[:m])
    
    results = []
    if window_count == pattern_count:
        results.append(0)
    
    for i in range(m, n):
        # Add new char
        window_count[s[i]] += 1
        # Remove old char
        window_count[s[i - m]] -= 1
        if window_count[s[i - m]] == 0:
            del window_count[s[i - m]]
        
        if window_count == pattern_count:
            results.append(i - m + 1)
    
    return results
```

---

### Form 4: K-Mismatch Matching

```python
def k_mismatch_match(text, pattern, k):
    """
    Find matches with at most k character differences.
    """
    # Use multiple Rabin-Karp for different masks
    # or sliding window with mismatch count
    
    results = []
    n, m = len(text), len(pattern)
    
    for i in range(n - m + 1):
        mismatches = sum(1 for j in range(m) 
                        if text[i + j] != pattern[j])
        if mismatches <= k:
            results.append(i)
    
    return results

# Optimization: Use bit-parallel for faster k-mismatch
```

---

### Form 5: Longest Common Substring

```python
def longest_common_substring(s1, s2):
    """
    Find longest substring common to both strings.
    Binary search + Rabin-Karp.
    """
    if len(s1) > len(s2):
        s1, s2 = s2, s1
    
    n1, n2 = len(s1), len(s2)
    
    def has_common_of_length(length):
        """Check if common substring of length exists."""
        base, mod = 256, 10**9 + 7
        h = pow(base, length - 1, mod)
        
        # Hash all substrings of s1
        hashes = set()
        
        if length > n1:
            return False
        
        window_hash = 0
        for i in range(length):
            window_hash = (window_hash * base + ord(s1[i])) % mod
        hashes.add(window_hash)
        
        for i in range(n1 - length):
            window_hash = (window_hash - ord(s1[i]) * h) % mod
            window_hash = (window_hash * base) % mod
            window_hash = (window_hash + ord(s1[i + length])) % mod
            hashes.add(window_hash)
        
        # Check s2 substrings
        window_hash = 0
        for i in range(length):
            window_hash = (window_hash * base + ord(s2[i])) % mod
        if window_hash in hashes:
            return True
        
        for i in range(n2 - length):
            window_hash = (window_hash - ord(s2[i]) * h) % mod
            window_hash = (window_hash * base) % mod
            window_hash = (window_hash + ord(s2[i + length])) % mod
            if window_hash in hashes:
                return True
        
        return False
    
    # Binary search
    low, high = 0, n1
    result = 0
    while low <= high:
        mid = (low + high) // 2
        if has_common_of_length(mid):
            result = mid
            low = mid + 1
        else:
            high = mid - 1
    
    return result
```

<!-- back -->
