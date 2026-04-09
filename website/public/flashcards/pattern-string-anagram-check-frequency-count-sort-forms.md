## String - Anagram Check: Forms

What are the different forms and variations of anagram-related problems?

<!-- front -->

---

### Problem Variations

| Variation | Key Twist | Approach |
|-----------|-----------|----------|
| **Valid Anagram** | Basic check | Frequency array/map |
| **Group Anagrams** | Multiple strings | Signature hashing |
| **Find All Anagrams** | Substring matching | Sliding window |
| **Ransom Note** | Subset check (can use) | Frequency >= check |
| **Palindrome Permutation** | Odd count check | Count odds <= 1 |
| **Anagram with Wildcard** | '*' matches anything | Adjusted counting |

---

### Form 1: Valid Anagram (Basic)

```python
def is_anagram(s: str, t: str) -> bool:
    """
    LeetCode 242: Valid Anagram
    Basic anagram check with frequency count.
    """
    if len(s) != len(t):
        return False
    
    freq = [0] * 26
    for i in range(len(s)):
        freq[ord(s[i]) - ord('a')] += 1
        freq[ord(t[i]) - ord('a')] -= 1
    
    return all(c == 0 for c in freq)

# Example:
# is_anagram("anagram", "nagaram") → True
# is_anagram("rat", "car") → False
```

---

### Form 2: Group Anagrams

```python
def group_anagrams(strs: list[str]) -> list[list[str]]:
    """
    LeetCode 49: Group Anagrams
    Group all anagrams together.
    """
    from collections import defaultdict
    
    groups = defaultdict(list)
    
    for word in strs:
        # Use sorted string as signature
        key = tuple(sorted(word))
        groups[key].append(word)
    
    return list(groups.values())


# Alternative: Frequency tuple as key
def group_anagrams_freq(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    
    for word in strs:
        freq = [0] * 26
        for c in word:
            freq[ord(c) - ord('a')] += 1
        groups[tuple(freq)].append(word)
    
    return list(groups.values())

# Example:
# Input: ["eat", "tea", "tan", "ate", "nat", "bat"]
# Output: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]
```

---

### Form 3: Find All Anagrams in String

```python
def find_anagrams(s: str, p: str) -> list[int]:
    """
    LeetCode 438: Find All Anagrams in a String
    Find all start indices of p's anagrams in s.
    """
    result = []
    if len(p) > len(s):
        return result
    
    p_freq = [0] * 26
    window_freq = [0] * 26
    
    # Initialize frequency arrays
    for i in range(len(p)):
        p_freq[ord(p[i]) - ord('a')] += 1
        window_freq[ord(s[i]) - ord('a')] += 1
    
    if p_freq == window_freq:
        result.append(0)
    
    # Slide window
    for i in range(len(p), len(s)):
        # Add new character
        window_freq[ord(s[i]) - ord('a')] += 1
        # Remove leftmost character
        window_freq[ord(s[i - len(p)]) - ord('a')] -= 1
        
        if p_freq == window_freq:
            result.append(i - len(p) + 1)
    
    return result

# Example:
# find_anagrams("cbaebabacd", "abc") → [0, 6]
# ("cba" at 0, "bac" at 6)
```

---

### Form 4: Ransom Note (Subset Frequency)

```python
def can_construct(ransom_note: str, magazine: str) -> bool:
    """
    LeetCode 383: Ransom Note
    Check if magazine can form ransom note (subset check).
    Key: Need <= not ==.
    """
    if len(ransom_note) > len(magazine):
        return False
    
    freq = [0] * 26
    
    # Count magazine (supply)
    for c in magazine:
        freq[ord(c) - ord('a')] += 1
    
    # Subtract ransom note (demand)
    for c in ransom_note:
        idx = ord(c) - ord('a')
        freq[idx] -= 1
        if freq[idx] < 0:  # Not enough supply
            return False
    
    return True


# Hash map version for Unicode
def can_construct_unicode(ransom_note: str, magazine: str) -> bool:
    from collections import Counter
    
    ransom_count = Counter(ransom_note)
    magazine_count = Counter(magazine)
    
    for char, needed in ransom_count.items():
        if magazine_count[char] < needed:
            return False
    return True

# Example:
# can_construct("a", "b") → False
# can_construct("aa", "ab") → False
# can_construct("aa", "aab") → True
```

---

### Form 5: Palindrome Permutation

```python
def can_permute_palindrome(s: str) -> bool:
    """
    Check if any permutation of s can form a palindrome.
    Key insight: Palindrome has at most 1 character with odd count.
    """
    freq = [0] * 26
    
    for c in s:
        if c.isalpha():
            freq[ord(c.lower()) - ord('a')] += 1
    
    odd_count = sum(1 for count in freq if count % 2 == 1)
    
    return odd_count <= 1


# Bit manipulation version (more efficient)
def can_permute_palindrome_bit(s: str) -> bool:
    """Uses bit vector to track odd/even counts."""
    bit_vector = 0
    
    for c in s:
        if c.isalpha():
            idx = ord(c.lower()) - ord('a')
            bit_vector ^= (1 << idx)  # Toggle bit
    
    # At most 1 bit set → palindrome possible
    return bit_vector == 0 or (bit_vector & (bit_vector - 1)) == 0

# Example:
# can_permute_palindrome("code") → False (c:1, o:1, d:1, e:1 - 4 odds)
# can_permute_palindrome("aab") → True (a:2, b:1 - 1 odd)
# can_permute_palindrome("carerac") → True (c:2, a:2, r:2, e:1 - 1 odd)
```

---

### Form 6: Permutation in String

```python
def check_inclusion(s1: str, s2: str) -> bool:
    """
    LeetCode 567: Permutation in String
    Check if s2 contains a substring that is a permutation of s1.
    """
    if len(s1) > len(s2):
        return False
    
    s1_freq = [0] * 26
    window_freq = [0] * 26
    
    # Initialize
    for i in range(len(s1)):
        s1_freq[ord(s1[i]) - ord('a')] += 1
        window_freq[ord(s2[i]) - ord('a')] += 1
    
    if s1_freq == window_freq:
        return True
    
    # Slide window
    for i in range(len(s1), len(s2)):
        window_freq[ord(s2[i]) - ord('a')] += 1
        window_freq[ord(s2[i - len(s1)]) - ord('a')] -= 1
        
        if s1_freq == window_freq:
            return True
    
    return False

# Example:
# check_inclusion("ab", "eidbaooo") → True ("ba" is permutation)
# check_inclusion("ab", "eidboaoo") → False
```

---

### Decision Flowchart

```
Read problem statement
│
├─ "Two strings are anagrams?"
│   └─→ Valid Anagram (frequency comparison)
│
├─ "Group words by anagram"
│   └─→ Group Anagrams (signature hashing)
│
├─ "Find all anagram substrings"
│   └─→ Find All Anagrams (sliding window)
│
├─ "Can form word from magazine"
│   └─→ Ransom Note (subset frequency check)
│
├─ "Any permutation is palindrome"
│   └─→ Palindrome Permutation (odd count check)
│
└─ "Contains permutation of s1"
    └─→ Permutation in String (sliding window)
```

---

### Quick Reference Table

| LeetCode | Problem | Key Twist | Pattern Extension |
|----------|---------|-----------|-------------------|
| 242 | Valid Anagram | Basic check | Frequency comparison |
| 49 | Group Anagrams | Multiple strings | Signature as key |
| 438 | Find All Anagrams | Substring search | Sliding window |
| 383 | Ransom Note | Subset/supply | >= instead of == |
| 266 | Palindrome Permutation | Odd count check | At most 1 odd |
| 567 | Permutation in String | Contains check | Sliding window |
| 1347 | Min Steps Anagram | Transform cost | Sum of abs diffs / 2 |

<!-- back -->
