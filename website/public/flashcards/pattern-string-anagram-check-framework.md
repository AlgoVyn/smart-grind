## String - Anagram Check: Framework

What is the complete code template for anagram checking?

<!-- front -->

---

### Framework 1: Frequency Array (Lowercase)

```
┌─────────────────────────────────────────────────────┐
│  ANAGRAM CHECK - FREQUENCY ARRAY TEMPLATE            │
├─────────────────────────────────────────────────────┤
│  1. If lengths differ: return False                 │
│  2. Initialize count[26] = {0}                       │
│  3. For each char in string1:                       │
│     count[char - 'a']++                              │
│  4. For each char in string2:                       │
│     count[char - 'a']--                              │
│  5. For each count:                                 │
│     If count != 0: return False                     │
│  6. Return True                                      │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Frequency Array

```python
def is_anagram(s, t):
    """Check if t is anagram of s (lowercase)."""
    if len(s) != len(t):
        return False
    
    count = [0] * 26
    
    for char in s:
        count[ord(char) - ord('a')] += 1
    
    for char in t:
        count[ord(char) - ord('a')] -= 1
        # Early exit optimization
        if count[ord(char) - ord('a')] < 0:
            return False
    
    return True

# Even simpler: compare counts directly
def is_anagram_simple(s, t):
    return len(s) == len(t) and sorted(s) == sorted(t)
```

---

### Implementation: Unicode/General

```python
from collections import Counter

def is_anagram_unicode(s, t):
    """Works for any characters."""
    return Counter(s) == Counter(t)
```

---

### Implementation: Group Anagrams

```python
def group_anagrams(strs):
    """Group strings by anagram equivalence."""
    groups = {}
    
    for s in strs:
        # Use sorted string as key
        key = ''.join(sorted(s))
        groups.setdefault(key, []).append(s)
    
    return list(groups.values())
```

---

### Key Pattern Elements

| Element | Purpose | Optimization |
|---------|---------|--------------|
| Length check | Early rejection | O(1) |
| Count array | O(1) space | Fixed size 26 |
| Early exit | Fail fast | Check during decrement |
| Sorted key | For grouping | O(k log k) per string |

<!-- back -->
