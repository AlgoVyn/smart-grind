## Sliding Window - Character Frequency: Forms

What are the different variations of character frequency matching?

<!-- front -->

---

### Form 1: Find All Anagrams

```python
def find_anagrams(s, p):
    from collections import Counter
    
    p_count = Counter(p)
    window = Counter(s[:len(p) - 1])
    result = []
    
    for i in range(len(p) - 1, len(s)):
        window[s[i]] += 1
        
        if window == p_count:
            result.append(i - len(p) + 1)
        
        window[s[i - len(p) + 1]] -= 1
        if window[s[i - len(p) + 1]] == 0:
            del window[s[i - len(p) + 1]]
    
    return result
```

---

### Form 2: Permutation in String

```python
def check_inclusion(s1, s2):
    from collections import Counter
    
    len1, len2 = len(s1), len(s2)
    if len1 > len2:
        return False
    
    count1 = Counter(s1)
    window = Counter()
    
    for i, char in enumerate(s2):
        window[char] += 1
        
        if i >= len1:
            window[s2[i - len1]] -= 1
            if window[s2[i - len1]] == 0:
                del window[s2[i - len1]]
        
        if i >= len1 - 1 and window == count1:
            return True
    
    return False
```

---

### Form 3: Letter Case Permutation Matching

```python
def is_anagram_case_insensitive(s, t):
    """Check if t is case-insensitive anagram of s."""
    if len(s) != len(t):
        return False
    
    count = {}
    
    for char in s.lower():
        count[char] = count.get(char, 0) + 1
    
    for char in t.lower():
        count[char] = count.get(char, 0) - 1
        if count[char] < 0:
            return False
    
    return all(v == 0 for v in count.values())
```

---

### Form 4: Unicode/Extended ASCII

```python
def is_anagram_unicode(s, t):
    """Handle extended character sets."""
    from collections import defaultdict
    
    if len(s) != len(t):
        return False
    
    count = defaultdict(int)
    
    for char in s:
        count[char] += 1
    
    for char in t:
        count[char] -= 1
        if count[char] < 0:
            return False
    
    return all(v == 0 for v in count.values())
```

---

### Form Comparison

| Form | Alphabet | Comparison | Use Case |
|------|----------|------------|----------|
| Basic | Hash map | Direct | General |
| Array | Fixed 26 | Array equality | Lowercase only |
| Case-insensitive | Lowered | With transform | Case variations |
| Unicode | Hash map | Direct | International chars |

<!-- back -->
