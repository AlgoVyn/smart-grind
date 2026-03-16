## String Anagram Detection

**Question:** How do you efficiently check for anagrams in strings?

<!-- front -->

---

## Answer: Use Character Frequency Counter

### Solution Template
```python
from collections import Counter

def findAnagrams(s, p):
    result = []
    need = Counter(p)
    window = Counter()
    
    for i, char in enumerate(s):
        window[char] += 1
        
        # Remove from left if window too large
        if i >= len(p):
            left_char = s[i - len(p)]
            window[left_char] -= 1
            if window[left_char] == 0:
                del window[left_char]
        
        # Check match
        if window == need:
            result.append(i - len(p) + 1)
    
    return result
```

### Visual: Sliding Window
```
s = "cbaebabacb", p = "abc"

Window size = 3

c b a e b a b a c b
      ↓
c b a → Counter: {a:1,b:1,c:1} = {a:1,b:1,c:1} ✓

b a e → {a:1,b:1,e:1} ≠ {a:1,b:1,c:1}

...

c b a → ✓ at index 6
```

### ⚠️ Tricky Parts

#### 1. Window Size Management
```python
# WRONG - window grows infinitely
window[char] += 1

# CORRECT - maintain fixed window size
window[char] += 1
if i >= len(p):
    # Remove element that slides out
    old = s[i - len(p)]
    window[old] -= 1
```

#### 2. Counter Comparison
```python
# WRONG - may miss zero counts
if window == need:  # May not work!

# Better - use subtraction
if len(window) == len(need):
    # Check if all chars match
    all(window[c] == need[c] for c in need)
```

#### 3. Python Counter Behavior
```python
# Counter with zero values
c = Counter('aab')
c['b'] -= 1  # c['b'] = 0 but still in Counter!

# Need to delete zero entries
if c['b'] == 0:
    del c['b']
```

### Alternative: Array-Based (Faster)
```python
def findAnagrams(s, p):
    if len(s) < len(p):
        return []
    
    result = []
    need = [0] * 26
    window = [0] * 26
    
    # Initialize need
    for c in p:
        need[ord(c) - ord('a')] += 1
    
    for i, c in enumerate(s):
        window[ord(c) - ord('a')] += 1
        
        if i >= len(p):
            window[ord(s[i - len(p)]) - ord('a')] -= 1
        
        if window == need:
            result.append(i - len(p) + 1)
    
    return result
```

### Anagram Variations

| Problem | Key Logic |
|---------|-----------|
| Valid Anagram | Compare sorted or Counter |
| Group Anagrams | Group by sorted string |
| Find Anagrams | Sliding window + Counter |
| Find Permutations | Same as anagrams |

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Counter | O(n × k) | O(k) |
| Array | O(n) | O(1) |

Where n = len(s), k = alphabet size

### Common Mistakes

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Not removing old char | Window too big | Slide window properly |
| Zero entries | Wrong comparison | Delete zero entries |
| Wrong indices | Wrong start position | i - len(p) + 1 |

<!-- back -->
