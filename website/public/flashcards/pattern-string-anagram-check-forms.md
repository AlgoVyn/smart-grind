## String - Anagram Check: Forms

What are the different forms and variations of anagram-related problems?

<!-- front -->

---

### Problem Variations Overview

| Variation | Key Twist | Core Pattern Extension |
|-----------|-----------|------------------------|
| **Valid Anagram** | Basic equality check | Frequency comparison (==) |
| **Group Anagrams** | Multiple strings grouping | Signature as hash key |
| **Find All Anagrams** | Substring matching | Sliding window + frequency |
| **Ransom Note** | Subset check (can use?) | Frequency inequality (<=) |
| **Palindrome Permutation** | Odd count check | At most 1 odd frequency |
| **Permutation in String** | Contains permutation | Sliding window + frequency |
| **Min Steps to Anagram** | Transform cost | Sum of differences / 2 |

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


# Hash map version (general case)
def is_anagram_general(s: str, t: str) -> bool:
    from collections import Counter
    return Counter(s) == Counter(t)


# Example:
# is_anagram("anagram", "nagaram") → True
# is_anagram("rat", "car") → False
```

**Key:** Exact frequency match required.

---

### Form 2: Group Anagrams

```python
from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    """
    LeetCode 49: Group Anagrams
    Group all anagrams together from a list.
    """
    groups = defaultdict(list)
    
    for word in strs:
        # Use sorted string as hashable signature
        signature = tuple(sorted(word))
        groups[signature].append(word)
    
    return list(groups.values())


# Alternative: Frequency tuple as signature
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

**Key:** Create a canonical signature for each word.

---

### Form 3: Find All Anagrams in a String

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
    
    # Slide window through s
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
# ("cba" at index 0, "bac" at index 6)
```

**Key:** Sliding window maintaining frequency counts.

---

### Form 4: Ransom Note (Subset Frequency)

```python
def can_construct(ransom_note: str, magazine: str) -> bool:
    """
    LeetCode 383: Ransom Note
    Check if magazine can form ransom note (subset check).
    Key difference: Need <= not ==
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


# Hash map version
def can_construct_general(ransom_note: str, magazine: str) -> bool:
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

**Key:** Magazine frequencies must be >= ransom frequencies.

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


# Bit manipulation version (O(1) space)
def can_permute_palindrome_bit(s: str) -> bool:
    """
    Uses bit vector to track odd/even counts.
    """
    bit_vector = 0
    
    for c in s:
        if c.isalpha():
            idx = ord(c.lower()) - ord('a')
            bit_vector ^= (1 << idx)  # Toggle bit
    
    # At most 1 bit set → palindrome possible
    # Check: 0 bits set OR exactly 1 bit set
    return bit_vector == 0 or (bit_vector & (bit_vector - 1)) == 0


# Example:
# can_permute_palindrome("code") → False (4 odd counts)
# can_permute_palindrome("aab") → True (1 odd count)
# can_permute_palindrome("carerac") → True (1 odd count)
```

**Key:** At most 1 character can have an odd frequency.

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

**Key:** Boolean version of "Find All Anagrams" - return early on first match.

---

### Form 7: Minimum Steps to Make Anagram

```python
def min_steps(s: str, t: str) -> int:
    """
    LeetCode 1347: Minimum Number of Steps to Make Two Strings Anagram
    Count changes needed to transform s into t's anagram.
    """
    from collections import Counter
    
    s_count = Counter(s)
    t_count = Counter(t)
    
    steps = 0
    
    # For each unique character in both strings
    all_chars = set(s) | set(t)
    
    for char in all_chars:
        # Add absolute difference divided by 2
        # (each misplaced char needs one change)
        steps += abs(s_count[char] - t_count[char])
    
    return steps // 2


# Alternative using array
def min_steps_array(s: str, t: str) -> int:
    freq = [0] * 26
    
    for c in s:
        freq[ord(c) - ord('a')] += 1
    
    for c in t:
        freq[ord(c) - ord('a')] -= 1
    
    # Sum of positive differences = changes needed
    # Divide by 2 because each swap fixes two mismatches
    return sum(abs(x) for x in freq) // 2


# Example:
# min_steps("bab", "aba") → 1
# min_steps("leetcode", "practice") → 5
# min_steps("anagram", "mangaar") → 0
```

**Key:** Half the sum of absolute frequency differences.

---

### Decision Flowchart

```
Read problem statement
│
├─ "Check if two strings are anagrams?"
│   └─→ Valid Anagram (frequency comparison ==)
│
├─ "Group words by anagram relationship"
│   └─→ Group Anagrams (signature as hash key)
│
├─ "Find all anagram substrings in string"
│   └─→ Find All Anagrams (sliding window)
│
├─ "Check if word can be formed from letters"
│   └─→ Ransom Note (subset frequency <=)
│
├─ "Can any permutation form a palindrome?"
│   └─→ Palindrome Permutation (odd count <= 1)
│
├─ "Does string contain permutation of s1?"
│   └─→ Permutation in String (sliding window boolean)
│
└─ "Minimum changes to make anagram"
    └─→ Min Steps (sum abs diff / 2)
```

---

### Quick Reference: LeetCode Problems

| # | Problem | Form | Key Pattern |
|---|---------|------|-------------|
| 242 | Valid Anagram | Basic check | Frequency == |
| 49 | Group Anagrams | Grouping | Signature key |
| 438 | Find All Anagrams | Substring search | Sliding window |
| 383 | Ransom Note | Subset check | Frequency <= |
| 266 | Palindrome Permutation | Odd count | Count odds <= 1 |
| 567 | Permutation in String | Contains check | Sliding window |
| 1347 | Min Steps to Anagram | Transform cost | Sum abs diff / 2 |

---

### Pattern Extensions Summary

| Base Pattern | Extension | Change Required |
|--------------|-----------|-----------------|
| Frequency count (==) | Group Anagrams | Use as dict key |
| Frequency count (==) | Find All Anagrams | Add sliding window |
| Frequency count (==) | Ransom Note | Change to (<=) |
| Frequency count (==) | Palindrome Permutation | Check odd counts |
| Frequency count (==) | Min Steps | Calculate differences |

<!-- back -->
