## Title: Sliding Window - Tactics

What are specific techniques and optimizations for sliding window problems?

<!-- front -->

---

### Tactic 1: Two-Hashmap Comparison

For anagram/pattern matching problems:

```python
def are_maps_equal(map1, map2):
    """Check if two frequency maps are equal."""
    if len(map1) != len(map2):
        return False
    for key in map1:
        if map1[key] != map2.get(key, 0):
            return False
    return True
```

**Optimization:** Use "have/need" counters instead of full comparison.

---

### Tactic 2: Character Array vs Hashmap

For ASCII/256-character strings:

```python
# Faster than dict for small charsets
freq = [0] * 256  # or 128 for ASCII
freq[ord(c)] += 1
```

---

### Tactic 3: Match Count Instead of Full Comparison

```python
def min_window_optimized(s, t):
    """Optimized minimum window using match count."""
    target_count = [0] * 128
    window_count = [0] * 128
    match_count = 0
    unique_chars = 0
    
    for char in t:
        if target_count[ord(char)] == 0:
            unique_chars += 1
        target_count[ord(char)] += 1
    
    left = 0
    min_len = float('inf')
    min_start = 0
    
    for right in range(len(s)):
        char = ord(s[right])
        window_count[char] += 1
        
        # Check if we satisfied a character requirement
        if window_count[char] == target_count[char]:
            match_count += 1
        
        # Shrink while valid
        while match_count == unique_chars:
            if right - left + 1 < min_len:
                min_len = right - left + 1
                min_start = left
            
            left_char = ord(s[left])
            window_count[left_char] -= 1
            if window_count[left_char] < target_count[left_char]:
                match_count -= 1
            left += 1
    
    return s[min_start:min_start + min_len] if min_len != float('inf') else ""
```

---

### Tactic 4: Filtered String Optimization

For minimum window substring problems, filter the source string:

```python
def min_window_filtered(s, t):
    """Filter s to only include characters present in t."""
    from collections import Counter
    
    dict_t = Counter(t)
    # Filter s to only include characters present in t
    filtered_s = [(i, char) for i, char in enumerate(s) if char in dict_t]
    
    # Now apply sliding window on filtered_s instead of s
    # This reduces window size significantly
```

**When to use:** When the pattern contains few distinct characters compared to the source string.

---

### Tactic 5: Comparison with Alternatives

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Sliding Window** | O(n) | O(k) or O(1) | Fixed/variable windows |
| **Brute Force** | O(n×k) | O(1) | Small inputs |
| **Prefix Sum + Window** | O(n) | O(n) | Random access to sums |
| **Two Pointers** | O(n) | O(1) | Sorted arrays |

**When to use Sliding Window:**
- Subarray/Substring problems with contiguous elements
- Window size given or can be determined
- Need O(n) instead of O(n×k)

<!-- back -->
