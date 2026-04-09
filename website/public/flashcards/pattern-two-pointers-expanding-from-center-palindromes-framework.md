## Two Pointers - Expanding From Center (Palindromes): Framework

What is the complete code template for solving palindrome problems using expand around center?

<!-- front -->

---

### Framework: Expand Around Center Template

```
┌─────────────────────────────────────────────────────────────────┐
│  EXPAND AROUND CENTER - PALINDROME TEMPLATE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Handle both center types:                                      │
│     - Odd:  center at index i → expand(i, i)                     │
│     - Even: center between i,i+1 → expand(i, i+1)                  │
│                                                                   │
│  2. Expansion function:                                           │
│     while left >= 0 and right < len and s[left] == s[right]:     │
│         left -= 1                                                  │
│         right += 1                                                 │
│     return s[left+1 : right]  (or length)                          │
│                                                                   │
│  3. Iterate all centers:                                          │
│     for i in range(len(s)):                                       │
│         odd = expand(i, i)                                        │
│         even = expand(i, i+1)                                     │
│         update best result                                         │
│                                                                   │
│  Total centers: 2n - 1 (n odd + n-1 even)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Longest Palindromic Substring

```python
def longest_palindrome(s):
    """Find longest palindromic substring."""
    if not s or len(s) == 1:
        return s
    
    def expand(left, right):
        """Expand while characters match."""
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1:right]  # Overshot by 1
    
    result = ""
    for i in range(len(s)):
        # Check odd length
        odd = expand(i, i)
        if len(odd) > len(result):
            result = odd
        
        # Check even length
        even = expand(i, i + 1)
        if len(even) > len(result):
            result = even
    
    return result
```

---

### Implementation: Count Palindromic Substrings

```python
def count_palindromes(s):
    """Count all palindromic substrings."""
    count = 0
    
    for i in range(len(s)):
        # Odd length
        left, right = i, i
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
        
        # Even length
        left, right = i, i + 1
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
    
    return count
```

---

### Implementation: Return Length Version

```python
def expand_length(s, left, right):
    """Return length instead of substring."""
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return right - left - 1  # Length of palindrome

def longest_palindrome_optimized(s):
    """Version that tracks start/end indices."""
    if not s:
        return ""
    
    start, end = 0, 0
    
    for i in range(len(s)):
        len1 = expand_length(s, i, i)      # Odd
        len2 = expand_length(s, i, i + 1)  # Even
        max_len = max(len1, len2)
        
        if max_len > end - start:
            start = i - (max_len - 1) // 2
            end = i + max_len // 2
    
    return s[start:end + 1]
```

---

### Key Framework Elements

| Element | Purpose | Example |
|---------|---------|---------|
| `expand(left, right)` | Core expansion function | Returns palindrome string |
| `expand(i, i)` | Odd length center | "aba" centered at 'b' |
| `expand(i, i+1)` | Even length center | "abba" centered between 'bb' |
| `left >= 0` | Left boundary check | Prevent underflow |
| `right < len(s)` | Right boundary check | Prevent overflow |
| `s[left] == s[right]` | Palindrome validation | Character match check |
| `s[left+1:right]` | Return substring | Exclude overshoot positions |

---

### Decision Tree: Which Pattern?

```
Problem type?
├── Find longest palindromic substring
│   └── Expand around center
│   └── Track max length palindrome
│   └── Time: O(n²), Space: O(1)
│
├── Count all palindromic substrings
│   └── Expand around center
│   └── Increment counter on each expansion
│   └── Time: O(n²), Space: O(1)
│
├── Check if palindrome possible with deletions
│   └── Two pointers converging + expansion
│   └── Try skip left or right on mismatch
│   └── Time: O(n), Space: O(1)
│
└── Need O(n) time guaranteed
    └── Manacher's algorithm
    └── Transform string with separators
    └── Linear time with radius array
```

<!-- back -->
