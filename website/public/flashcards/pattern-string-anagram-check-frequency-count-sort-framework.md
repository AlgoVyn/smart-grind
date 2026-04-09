## String - Anagram Check: Framework

What is the complete code template for checking if two strings are anagrams?

<!-- front -->

---

### Framework: Anagram Check (Frequency Count)

```
┌─────────────────────────────────────────────────────────────┐
│  ANAGRAM CHECK - TEMPLATE                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Key Insight: Anagrams have identical character            │
│               frequency fingerprints                       │
│                                                             │
│  1. Early termination check:                                │
│     - if len(s) != len(t): return False                     │
│                                                             │
│  2. Frequency counting (array for a-z):                  │
│     - freq = [0] * 26                                      │
│     - for each char pair (s[i], t[i]):                     │
│         freq[ord(s[i]) - ord('a')] += 1                     │
│         freq[ord(t[i]) - ord('a')] -= 1                    │
│                                                             │
│  3. Verify all zero:                                       │
│     - for count in freq:                                   │
│         if count != 0: return False                        │
│     - return True                                          │
│                                                             │
│  4. Hash map variant (Unicode support):                     │
│     - freq = {}                                            │
│     - Increment for s, decrement for t                    │
│     - Check for negative or missing keys                  │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: Frequency Array (Optimal for a-z)

```python
def is_anagram_frequency(s: str, t: str) -> bool:
    """
    O(n) time, O(1) space for lowercase English letters.
    """
    # Early termination: different lengths cannot be anagrams
    if len(s) != len(t):
        return False
    
    # Frequency array for 26 lowercase letters
    freq = [0] * 26
    
    # Count characters in both strings simultaneously
    for i in range(len(s)):
        freq[ord(s[i]) - ord('a')] += 1
        freq[ord(t[i]) - ord('a')] -= 1
    
    # Check if all frequencies are zero
    for count in freq:
        if count != 0:
            return False
    
    return True
```

---

### Implementation: Hash Map (Unicode Support)

```python
def is_anagram_hashmap(s: str, t: str) -> bool:
    """
    O(n) time, O(k) space where k = unique characters.
    Supports any character set including Unicode.
    """
    if len(s) != len(t):
        return False
    
    freq = {}
    
    # Count characters in first string
    for char in s:
        freq[char] = freq.get(char, 0) + 1
    
    # Decrement counts for second string
    for char in t:
        if char not in freq:
            return False
        freq[char] -= 1
        if freq[char] < 0:
            return False
    
    return True


# Pythonic one-liner using Counter
from collections import Counter

def is_anagram_counter(s: str, t: str) -> bool:
    """Most concise, but slightly more overhead."""
    return len(s) == len(t) and Counter(s) == Counter(t)
```

---

### Implementation: Sorting (Simple but Slower)

```python
def is_anagram_sort(s: str, t: str) -> bool:
    """
    O(n log n) time, O(n) space.
    Conceptually simple but less efficient.
    """
    if len(s) != len(t):
        return False
    
    return sorted(s) == sorted(t)
```

---

### Key Framework Elements

| Element | Purpose | Example |
|---------|---------|---------|
| Length check | O(1) early termination | `if len(s) != len(t)` |
| `ord(char) - ord('a')` | Map 'a'-'z' to 0-25 | `ord('c') - ord('a') = 2` |
| Simultaneous +/- | Single pass efficiency | `+=1` for s, `-=1` for t |
| Zero check | Verify balance | All counts must be 0 |
| Hash map `.get()` | Safe default value | `freq.get(char, 0)` |

---

### C++ / Java / JavaScript Templates

```cpp
// C++ Frequency Array
bool isAnagram(string s, string t) {
    if (s.length() != t.length()) return false;
    int freq[26] = {0};
    for (int i = 0; i < s.length(); i++) {
        freq[s[i] - 'a']++;
        freq[t[i] - 'a']--;
    }
    for (int i = 0; i < 26; i++) {
        if (freq[i] != 0) return false;
    }
    return true;
}
```

```java
// Java Frequency Array
public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] freq = new int[26];
    for (int i = 0; i < s.length(); i++) {
        freq[s.charAt(i) - 'a']++;
        freq[t.charAt(i) - 'a']--;
    }
    for (int count : freq) {
        if (count != 0) return false;
    }
    return true;
}
```

```javascript
// JavaScript Frequency Array
function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    const freq = new Array(26).fill(0);
    for (let i = 0; i < s.length; i++) {
        freq[s.charCodeAt(i) - 'a'.charCodeAt(0)]++;
        freq[t.charCodeAt(i) - 'a'.charCodeAt(0)]--;
    }
    return freq.every(count => count === 0);
}
```

<!-- back -->
