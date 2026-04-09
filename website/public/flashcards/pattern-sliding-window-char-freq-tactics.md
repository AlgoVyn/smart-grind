## Sliding Window - Character Frequency: Tactics

What are the advanced techniques for character frequency matching?

<!-- front -->

---

### Tactic 1: Optimized Counter Comparison

**Problem**: Counter equality check is O(k) where k is alphabet size

**Optimization**: Track number of matching characters

```python
def check_inclusion_optimized(s1, s2):
    if len(s1) > len(s2):
        return False
    
    count = [0] * 26
    for c in s1:
        count[ord(c) - ord('a')] += 1
    for c in s2[:len(s1)]:
        count[ord(c) - ord('a')] -= 1
    
    # Track how many characters have matching counts
    matches = sum(1 for x in count if x == 0)
    
    if matches == 26:
        return True
    
    for i in range(len(s1), len(s2)):
        # Add new character
        idx = ord(s2[i]) - ord('a')
        count[idx] -= 1
        if count[idx] == 0:
            matches += 1
        elif count[idx] == -1:
            matches -= 1
        
        # Remove old character
        idx = ord(s2[i - len(s1)]) - ord('a')
        count[idx] += 1
        if count[idx] == 0:
            matches += 1
        elif count[idx] == 1:
            matches -= 1
        
        if matches == 26:
            return True
    
    return False
```

---

### Tactic 2: Rolling Character Hash

```python
def find_anagrams_rolling(s, p):
    """Use rolling hash instead of frequency map."""
    if len(p) > len(s):
        return []
    
    # Prime-based hash for ordering independence
    primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37,
              41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101]
    
    def hash_string(string):
        h = 1
        for c in string:
            h *= primes[ord(c) - ord('a')]
        return h
    
    p_hash = hash_string(p)
    window_hash = hash_string(s[:len(p)])
    result = []
    
    if window_hash == p_hash:
        result.append(0)
    
    for i in range(len(p), len(s)):
        # Update hash: divide by leaving char, multiply by entering char
        window_hash = (window_hash // primes[ord(s[i - len(p)]) - ord('a')]) * 
                       primes[ord(s[i]) - ord('a')]
        
        if window_hash == p_hash:
            result.append(i - len(p) + 1)
    
    return result
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Not removing zero counts** | Memory leak | del counter[key] when 0 |
| **Wrong window size** | Off-by-one | Check right - left + 1 |
| **Unicode handling** | Extended chars | Use defaultdict or dict |
| **Case sensitivity** | Unexpected mismatch | Normalize case |
| **Empty pattern** | Edge case | Return all indices or handle specially |

---

### Tactic 4: DNA Sequence Matching

```python
def find_repeated_dna_sequences(s):
    """Find 10-letter sequences that appear multiple times."""
    if len(s) <= 10:
        return []
    
    # Encode as 2-bit values: A=0, C=1, G=2, T=3
    encode = {'A': 0, 'C': 1, 'G': 2, 'T': 3}
    
    seen = set()
    repeated = set()
    
    # Encode first 10 characters
    hash_val = 0
    for i in range(10):
        hash_val = (hash_val << 2) | encode[s[i]]
    
    seen.add(hash_val)
    
    # Slide window
    for i in range(10, len(s)):
        # Remove leftmost 2 bits, add new char
        hash_val = ((hash_val << 2) & 0xFFFFF) | encode[s[i]]
        
        if hash_val in seen:
            repeated.add(s[i-9:i+1])
        else:
            seen.add(hash_val)
    
    return list(repeated)
```

---

### Tactic 5: Multiset Comparison

```python
def is_multiset_equal(counter1, counter2):
    """Optimized comparison for large alphabets."""
    if len(counter1) != len(counter2):
        return False
    
    for key, val in counter1.items():
        if counter2.get(key) != val:
            return False
    
    return True
```

<!-- back -->
