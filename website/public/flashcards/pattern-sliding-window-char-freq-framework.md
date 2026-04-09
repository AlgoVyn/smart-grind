## Sliding Window - Character Frequency: Framework

What is the complete code template for character frequency matching?

<!-- front -->

---

### Framework 1: Frequency Matching Template

```
┌─────────────────────────────────────────────────────┐
│  CHARACTER FREQUENCY MATCHING TEMPLATE               │
├─────────────────────────────────────────────────────┤
│  1. Build target frequency map                       │
│  2. Initialize window frequency map                   │
│  3. Slide window:                                    │
│     a. Add new character (right side)               │
│     b. Remove old character (left side)              │
│     c. Compare window with target                   │
│     d. If match: record result                       │
│  4. Return all matches                               │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def find_anagrams(s, p):
    """Find all anagram start indices in s matching pattern p."""
    from collections import Counter
    
    p_count = Counter(p)
    s_count = Counter()
    
    result = []
    left = 0
    
    for right in range(len(s)):
        s_count[s[right]] += 1
        
        # Window exceeds size, remove left
        if right - left + 1 > len(p):
            s_count[s[left]] -= 1
            if s_count[s[left]] == 0:
                del s_count[s[left]]
            left += 1
        
        # Check match when window size equals pattern
        if right - left + 1 == len(p):
            if s_count == p_count:
                result.append(left)
    
    return result
```

---

### Framework 2: Optimized with Match Counter

```python
def check_inclusion_optimized(s1, s2):
    """Check if s2 contains permutation of s1."""
    if len(s1) > len(s2):
        return False
    
    # Frequency arrays (26 letters)
    count1 = [0] * 26
    count2 = [0] * 26
    
    for char in s1:
        count1[ord(char) - ord('a')] += 1
    
    # Initial window
    for i in range(len(s1)):
        count2[ord(s2[i]) - ord('a')] += 1
    
    if count1 == count2:
        return True
    
    # Slide window
    for i in range(len(s1), len(s2)):
        count2[ord(s2[i]) - ord('a')] += 1
        count2[ord(s2[i - len(s1)]) - ord('a')] -= 1
        
        if count1 == count2:
            return True
    
    return False
```

---

### Key Pattern Elements

| Element | Type | Purpose |
|---------|------|---------|
| Counter/Array | Hash or array | Track frequencies |
| Add | Increment | New char enters window |
| Remove | Decrement | Old char leaves window |
| Compare | Equality check | Match detection |

<!-- back -->
