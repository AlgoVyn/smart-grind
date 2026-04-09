## String - Anagram Check: Tactics

What are the advanced techniques and optimizations for anagram checking?

<!-- front -->

---

### Tactic 1: Early Exit Optimizations

```python
def is_anagram_early_length(s: str, t: str) -> bool:
    """
    O(1) early rejection - always check this first!
    """
    if len(s) != len(t):
        return False
    # ... continue with counting


def is_anagram_early_negative(s: str, t: str) -> bool:
    """
    Exit immediately when count goes negative.
    """
    if len(s) != len(t):
        return False
    
    count = [0] * 26
    
    for char in s:
        count[ord(char) - ord('a')] += 1
    
    for char in t:
        count[ord(char) - ord('a')] -= 1
        if count[ord(char) - ord('a')] < 0:
            return False  # Early exit!
    
    return True


def is_anagram_single_pass(s: str, t: str) -> bool:
    """
    Increment and decrement in one loop.
    """
    if len(s) != len(t):
        return False
    
    count = [0] * 26
    
    for i in range(len(s)):
        count[ord(s[i]) - ord('a')] += 1
        count[ord(t[i]) - ord('a')] -= 1
    
    return all(c == 0 for c in count)
```

---

### Tactic 2: Hash Map with Early Exit

```python
def is_anagram_hash_early(s: str, t: str) -> bool:
    """
    Hash map approach with early termination.
    Better for Unicode/unknown character sets.
    """
    if len(s) != len(t):
        return False
    
    from collections import defaultdict
    count = defaultdict(int)
    
    # Count first string
    for c in s:
        count[c] += 1
    
    # Subtract second string with early exit
    for c in t:
        count[c] -= 1
        if count[c] < 0:
            return False
    
    return True


# Even simpler with Counter
def is_anagram_counter(s: str, t: str) -> bool:
    """
    Most concise Python solution.
    Good for production, acceptable for interviews.
    """
    from collections import Counter
    return Counter(s) == Counter(t)
```

---

### Tactic 3: Sorting with Space Optimization

```python
def is_anagram_sort_inplace(s: str, t: str) -> bool:
    """
    Sorting approach - modify copies in-place.
    """
    if len(s) != len(t):
        return False
    
    s_list, t_list = list(s), list(t)
    s_list.sort()
    t_list.sort()
    
    return s_list == t_list


# Python one-liner
def is_anagram_sort_oneliner(s: str, t: str) -> bool:
    """
    Shortest possible solution.
    Time: O(n log n), Space: O(n)
    """
    return sorted(s) == sorted(t)
```

---

### Tactic 4: Prime Number Multiplication (Mathematical)

```python
# Assign prime to each letter, multiply all
# Equal products = anagrams (Fundamental Theorem of Arithmetic)

def is_anagram_prime(s: str, t: str) -> bool:
    """
    Mathematical approach using prime numbers.
    Warning: Product overflow for long strings!
    """
    if len(s) != len(t):
        return False
    
    primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 
              31, 37, 41, 43, 47, 53, 59, 61, 67, 
              71, 73, 79, 83, 89, 97, 101]
    
    product1 = product2 = 1
    
    for c in s:
        product1 *= primes[ord(c) - ord('a')]
    
    for c in t:
        product2 *= primes[ord(c) - ord('a')]
    
    return product1 == product2


# JavaScript with BigInt (handles overflow)
def is_anagram_prime_js_compatible(s, t):
    """
    Use BigInt for arbitrary precision.
    """
    if len(s) != len(t):
        return False
    
    primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
              31, 37, 41, 43, 47, 53, 59, 61, 67,
              71, 73, 79, 83, 89, 97, 101]
    
    # Python doesn't need BigInt, but for very long strings
    # this approach becomes impractical anyway
    product1 = 1
    product2 = 1
    
    for c in s:
        product1 *= primes[ord(c) - ord('a')]
    
    for c in t:
        product2 *= primes[ord(c) - ord('a')]
    
    return product1 == product2
```

---

### Tactic 5: Unicode and Case-Insensitive Handling

```python
import unicodedata

def is_anagram_unicode(s: str, t: str) -> bool:
    """
    Handle any Unicode characters.
    """
    if len(s) != len(t):
        return False
    
    from collections import Counter
    
    # Normalize Unicode forms first
    s = unicodedata.normalize('NFC', s)
    t = unicodedata.normalize('NFC', t)
    
    return Counter(s) == Counter(t)


def is_anagram_case_insensitive(s: str, t: str) -> bool:
    """
    Case-insensitive anagram check.
    """
    if len(s) != len(t):
        return False
    
    count = [0] * 26
    
    for c in s:
        count[ord(c.lower()) - ord('a')] += 1
    
    for c in t:
        count[ord(c.lower()) - ord('a')] -= 1
        if count[ord(c.lower()) - ord('a')] < 0:
            return False
    
    return True


def is_anagram_alphanumeric_only(s: str, t: str) -> bool:
    """
    Ignore non-alphanumeric characters.
    """
    import re
    
    s_clean = re.sub(r'[^a-zA-Z0-9]', '', s).lower()
    t_clean = re.sub(r'[^a-zA-Z0-9]', '', t).lower()
    
    return is_anagram_case_insensitive(s_clean, t_clean)


# Example: "Astronomer" vs "Moon starer" → True
# Example: "The eyes" vs "They see" → True
```

---

### Tactic 6: Memory-Conscious Variants

```python
def is_anagram_256_chars(s: str, t: str) -> bool:
    """
    Extended ASCII (0-255) - still O(1) space.
    """
    if len(s) != len(t):
        return False
    
    count = [0] * 256  # Extended ASCII
    
    for c in s:
        count[ord(c)] += 1
    
    for c in t:
        count[ord(c)] -= 1
        if count[ord(c)] < 0:
            return False
    
    return True


def is_anagram_bit_manipulation(s: str, t: str) -> bool:
    """
    For palindrome check variation only.
    Uses bit vector to track odd counts.
    """
    if len(s) != len(t):
        return False
    
    # Only works for checking if palindrome possible
    # Not a full anagram check
    bit_vector = 0
    
    for c in s:
        idx = ord(c.lower()) - ord('a')
        bit_vector ^= (1 << idx)
    
    for c in t:
        idx = ord(c.lower()) - ord('a')
        bit_vector ^= (1 << idx)
    
    return bit_vector == 0  # All counts match
```

---

### Tactic 7: Common Pitfalls and Fixes

| Pitfall | Bug | Fix |
|---------|-----|-----|
| **Missing length check** | Process unnecessarily | Always `if len(s) != len(t): return False` |
| **Off-by-one indexing** | Wrong character counted | Verify `char - 'a'` gives 0-25 |
| **Case sensitivity** | "A" != "a" | Normalize with `.lower()` or `.upper()` |
| **Unicode handling** | `IndexError` on é, ñ | Use hash map, not array |
| **Integer overflow** | In prime multiplication | Use BigInt or avoid for long strings |
| **Empty strings** | Edge case bugs | Test `s="", t=""` returns True |
| **Single character** | Logic errors | Test `s="a", t="a"` and `s="a", t="b"` |
| **Identical strings** | False positives | Ensure same-string check still works |

---

### Tactic 8: Testing Checklist

```python
def test_anagram_functions():
    """
    Comprehensive test cases for anagram functions.
    """
    test_cases = [
        # (s, t, expected)
        ("anagram", "nagaram", True),
        ("rat", "car", False),
        ("listen", "silent", True),
        ("", "", True),
        ("a", "a", True),
        ("a", "b", False),
        ("ab", "ba", True),
        ("abc", "def", False),
        ("AAAA", "aaaa", False),  # Case-sensitive
        ("aaabbb", "ababab", True),
        ("xxyyzz", "xyzxyz", True),
        ("abcdef", "abcdeg", False),
    ]
    
    for s, t, expected in test_cases:
        result = is_anagram_early_negative(s, t)
        assert result == expected, f"Failed on ({s}, {t}): got {result}, expected {expected}"
    
    print("All tests passed!")
```

<!-- back -->
