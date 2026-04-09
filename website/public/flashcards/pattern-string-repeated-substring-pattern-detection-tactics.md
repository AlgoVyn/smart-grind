## String - Repeated Substring Pattern Detection: Tactics

What are the advanced techniques and variations for repeated substring pattern detection?

<!-- front -->

---

### Tactic 1: Finding the Smallest Repeating Unit

```python
def find_smallest_unit(s: str) -> str:
    """
    Find the smallest substring that repeats to form s.
    Returns original string if no pattern exists.
    """
    n = len(s)
    if n <= 1:
        return s
    
    # Compute KMP prefix function
    prefix = [0] * n
    for i in range(1, n):
        j = prefix[i - 1]
        while j > 0 and s[i] != s[j]:
            j = prefix[j - 1]
        if s[i] == s[j]:
            j += 1
        prefix[i] = j
    
    lps = prefix[-1]
    pattern_len = n - lps
    
    # Check if valid pattern exists
    if lps > 0 and n % pattern_len == 0:
        return s[:pattern_len]
    
    return s  # No repeating pattern

# Examples:
# find_smallest_unit("abcabcabc") → "abc"
# find_smallest_unit("ababab") → "ab"
# find_smallest_unit("abcd") → "abcd"
```

---

### Tactic 2: Counting Pattern Repetitions

```python
def count_repetitions(s: str) -> int:
    """
    Return how many times the smallest unit repeats.
    Returns 1 if no pattern exists.
    """
    n = len(s)
    if n <= 1:
        return 1
    
    prefix = [0] * n
    for i in range(1, n):
        j = prefix[i - 1]
        while j > 0 and s[i] != s[j]:
            j = prefix[j - 1]
        if s[i] == s[j]:
            j += 1
        prefix[i] = j
    
    lps = prefix[-1]
    pattern_len = n - lps
    
    if lps > 0 and n % pattern_len == 0:
        return n // pattern_len
    
    return 1

# Examples:
# count_repetitions("abcabcabc") → 3
# count_repetitions("aaaaaa") → 6
# count_repetitions("abcd") → 1
```

---

### Tactic 3: Finding All Divisors (Brute Force Optimization)

```python
def get_divisors(n: int) -> list:
    """Get all divisors of n in ascending order."""
    divisors = []
    i = 1
    while i * i <= n:
        if n % i == 0:
            divisors.append(i)
            if i != n // i:
                divisors.append(n // i)
        i += 1
    return sorted(divisors)

def repeated_pattern_all_candidates(s: str) -> list:
    """
    Return all possible pattern lengths that could form s.
    """
    n = len(s)
    candidates = []
    
    for d in get_divisors(n):
        if d == n:  # Skip full length
            continue
        substring = s[:d]
        if substring * (n // d) == s:
            candidates.append(d)
    
    return candidates

# Example: repeated_pattern_all_candidates("abcabcabc")
# Divisors of 9: [1, 3, 9]
# Check: "a" * 9 = "aaaaaaaaa" ≠ "abcabcabc" ❌
# Check: "abc" * 3 = "abcabcabc" ✓
# Return: [3]
```

---

### Tactic 4: O(1) Space Variation (Character-by-Character Check)

```python
def repeated_substring_pattern_o1_space(s: str) -> bool:
    """
    Check for repeated pattern using O(1) extra space.
    Time: O(n²), Space: O(1)
    """
    n = len(s)
    
    for pattern_len in range(1, n // 2 + 1):
        if n % pattern_len != 0:
            continue
        
        # Check if pattern repeats without building string
        is_pattern = True
        for i in range(pattern_len, n):
            if s[i] != s[i % pattern_len]:
                is_pattern = False
                break
        
        if is_pattern:
            return True
    
    return False

# This avoids creating the repeated string, using O(1) space
# Trade-off: More comparisons but no string allocation
```

---

### Tactic 5: Common Pitfalls & Fixes

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Not checking `len(s) <= 1`** | Single char returns True incorrectly | Add explicit check: `if len(s) <= 1: return False` |
| **Wrong slice in concatenation** | Using `[1:]` or `[:-1]` only | Must use `[1:-1]` to remove BOTH ends |
| **Integer overflow in KMP** | None in Python, but in C++/Java | Use proper data types |
| **Empty string handling** | Edge case undefined | Return False (no pattern possible) |
| **Off-by-one in KMP** | Wrong loop bounds | `range(1, n)` starts from index 1 |
| **Not checking `lps > 0`** | Full string as "pattern" | Must have proper prefix-suffix |
| **Modulo with zero** | When `lps == n` | Check `lps > 0` before computing |

---

### Tactic 6: Rolling Hash Alternative

```python
def repeated_substring_pattern_rolling_hash(s: str) -> bool:
    """
    Alternative using rolling hash (Rabin-Karp style).
    Time: O(n), Space: O(n) for hash table.
    """
    n = len(s)
    if n <= 1:
        return False
    
    BASE = 26  # For lowercase letters
    MOD = 10**9 + 7
    
    # Precompute powers
    pow_base = [1] * (n + 1)
    for i in range(1, n + 1):
        pow_base[i] = (pow_base[i-1] * BASE) % MOD
    
    # Compute prefix hashes
    prefix_hash = [0] * (n + 1)
    for i in range(n):
        prefix_hash[i+1] = (prefix_hash[i] * BASE + ord(s[i]) - ord('a')) % MOD
    
    def get_hash(l, r):
        """Get hash of s[l:r] (0-indexed, r exclusive)."""
        return (prefix_hash[r] - prefix_hash[l] * pow_base[r-l]) % MOD
    
    # Try all valid pattern lengths
    for pattern_len in range(1, n // 2 + 1):
        if n % pattern_len != 0:
            continue
        
        pattern_hash = get_hash(0, pattern_len)
        is_valid = True
        
        for start in range(pattern_len, n, pattern_len):
            if get_hash(start, start + pattern_len) != pattern_hash:
                is_valid = False
                break
        
        if is_valid:
            return True
    
    return False
```

---

### Tactic 7: Extension - Multiple String Pattern Matching

```python
def all_strings_share_pattern(strings: list) -> tuple:
    """
    Check if all strings in list can be formed by repeating
    the same base pattern.
    Returns (bool, base_pattern) or (False, None).
    """
    if not strings:
        return (False, None)
    
    # Find smallest unit of first string
    first_unit = find_smallest_unit(strings[0])
    
    for s in strings[1:]:
        unit = find_smallest_unit(s)
        if unit != first_unit:
            return (False, None)
    
    return (True, first_unit)

# Example: all_strings_share_pattern(["abcabc", "abc", "abcabcabc"])
# Returns: (True, "abc")
```

<!-- back -->
