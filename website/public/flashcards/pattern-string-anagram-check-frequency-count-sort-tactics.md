## String - Anagram Check: Tactics

What are the advanced techniques and optimizations for anagram checking?

<!-- front -->

---

### Tactic 1: Simultaneous Count with Early Exit

```python
def is_anagram_early_exit(s: str, t: str) -> bool:
    """
    Exit as soon as mismatch found - no need to scan all.
    """
    if len(s) != len(t):
        return False
    
    freq = [0] * 26
    
    for i in range(len(s)):
        freq[ord(s[i]) - ord('a')] += 1
        freq[ord(t[i]) - ord('a')] -= 1
    
    # Early exit: return on first non-zero
    for count in freq:
        if count != 0:
            return False
    return True


def is_anagram_super_early(s: str, t: str) -> bool:
    """
    Check during iteration - exit immediately on imbalance.
    (Slightly more complex, rarely needed)
    """
    if len(s) != len(t):
        return False
    
    freq = [0] * 26
    
    for i in range(len(s)):
        freq[ord(s[i]) - ord('a')] += 1
        freq[ord(t[i]) - ord('a')] -= 1
        
        # Check if any count exceeds possible remaining
        # (Optimization for very long strings with early divergence)
        if abs(freq[ord(s[i]) - ord('a')]) > len(s) - i:
            return False
    
    return all(c == 0 for c in freq)
```

---

### Tactic 2: Group Anagrams Using Signature

```python
def group_anagrams(strs: list[str]) -> list[list[str]]:
    """
    Group words by their anagram relationship.
    Key insight: Same frequency signature = same group.
    """
    from collections import defaultdict
    
    groups = defaultdict(list)
    
    for word in strs:
        # Signature: sorted string (hashable)
        signature = tuple(sorted(word))
        groups[signature].append(word)
        
        # Alternative: frequency tuple
        # freq = [0] * 26
        # for c in word:
        #     freq[ord(c) - ord('a')] += 1
        # groups[tuple(freq)].append(word)
    
    return list(groups.values())


# Example:
# Input: ["eat", "tea", "tan", "ate", "nat", "bat"]
# Output: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
```

---

### Tactic 3: Sliding Window for Anagram Search

```python
def find_anagrams(s: str, p: str) -> list[int]:
    """
    Find all start indices of p's anagrams in s.
    Uses sliding window with frequency comparison.
    """
    from collections import Counter
    
    result = []
    p_count = Counter(p)
    window_count = Counter()
    
    for i, char in enumerate(s):
        # Add current character
        window_count[char] += 1
        
        # Remove leftmost character if window too big
        if i >= len(p):
            left_char = s[i - len(p)]
            window_count[left_char] -= 1
            if window_count[left_char] == 0:
                del window_count[left_char]
        
        # Compare frequency maps
        if i >= len(p) - 1 and window_count == p_count:
            result.append(i - len(p) + 1)
    
    return result


# Optimized version with fixed-size array
def find_anagrams_optimized(s: str, p: str) -> list[int]:
    result = []
    if len(p) > len(s):
        return result
    
    p_freq = [0] * 26
    window_freq = [0] * 26
    
    # Initialize
    for i in range(len(p)):
        p_freq[ord(p[i]) - ord('a')] += 1
        window_freq[ord(s[i]) - ord('a')] += 1
    
    if p_freq == window_freq:
        result.append(0)
    
    # Slide window
    for i in range(len(p), len(s)):
        # Add new char
        window_freq[ord(s[i]) - ord('a')] += 1
        # Remove old char
        window_freq[ord(s[i - len(p)]) - ord('a')] -= 1
        
        if p_freq == window_freq:
            result.append(i - len(p) + 1)
    
    return result
```

---

### Tactic 4: Ransom Note (Subset Check)

```python
def can_construct(ransom_note: str, magazine: str) -> bool:
    """
    Check if magazine can form ransom note.
    Key: ransom frequencies must be <= magazine frequencies.
    """
    from collections import Counter
    
    ransom_count = Counter(ransom_note)
    magazine_count = Counter(magazine)
    
    # Check if magazine has enough of each character
    for char, count in ransom_count.items():
        if magazine_count[char] < count:
            return False
    
    return True


# Array version for a-z
def can_construct_array(ransom_note: str, magazine: str) -> bool:
    if len(ransom_note) > len(magazine):
        return False
    
    freq = [0] * 26
    
    # Count magazine
    for c in magazine:
        freq[ord(c) - ord('a')] += 1
    
    # Subtract ransom note
    for c in ransom_note:
        idx = ord(c) - ord('a')
        freq[idx] -= 1
        if freq[idx] < 0:
            return False
    
    return True
```

---

### Tactic 5: Preprocessing for Complex Inputs

```python
import re

def preprocess_anagram_check(s: str, t: str) -> bool:
    """
    Handle real-world strings with spaces, punctuation, case.
    """
    def clean(string):
        # Remove non-alphabetic characters, lowercase
        return re.sub(r'[^a-zA-Z]', '', string).lower()
    
    s_clean = clean(s)
    t_clean = clean(t)
    
    return is_anagram_frequency(s_clean, t_clean)


# "Astronomer" vs "Moon starer" → True
# "The eyes" vs "They see" → True
```

---

### Tactic 6: Common Implementation Pitfalls

| Pitfall | Bug | Fix |
|---------|-----|-----|
| Character out of range | `IndexError` on non a-z | Validate or use hash map |
| Integer overflow | Rare with 26 chars | Use appropriate int type |
| Not handling empty strings | Edge case issues | Add explicit checks |
| Modifying while iterating | Corrupted counts | Iterate on copy |
| Case sensitivity mismatch | "A" vs "a" different | Normalize case first |
| Unicode normalization | é != é (different forms) | Use `unicodedata.normalize` |

---

### Tactic 7: Memory-Efficient Variants

```python
def is_anagram_memory_efficient(s: str, t: str) -> bool:
    """
    O(1) space guarantee by modifying s (if allowed).
    """
    if len(s) != len(t):
        return False
    
    # Sort both in-place if mutable
    s_list, t_list = list(s), list(t)
    s_list.sort()
    t_list.sort()
    
    return s_list == t_list


# For extremely large strings - streaming approach
def is_anagram_streaming(s_iterator, t_iterator) -> bool:
    """
    Process without loading entire strings into memory.
    Assumes sorted character streams.
    """
    # Requires external sorting or multiple passes
    # Use external merge sort + comparison
    pass
```

<!-- back -->
