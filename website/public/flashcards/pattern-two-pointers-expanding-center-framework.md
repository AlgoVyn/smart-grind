## Two Pointers - Expanding from Center: Framework

What is the complete code template for expanding from center palindrome solutions?

<!-- front -->

---

### Framework 1: Basic Expansion Template

```
┌─────────────────────────────────────────────────────┐
│  EXPANDING FROM CENTER - BASIC TEMPLATE              │
├─────────────────────────────────────────────────────┤
│  For each center in string:                          │
│    1. Odd length: center at index i                 │
│       left = right = i                               │
│       While in bounds AND s[left] == s[right]:      │
│          Process palindrome s[left:right+1]          │
│          left--, right++                             │
│                                                      │
│    2. Even length: center between i and i+1          │
│       left = i, right = i + 1                        │
│       While in bounds AND s[left] == s[right]:      │
│          Process palindrome s[left:right+1]          │
│          left--, right++                             │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def longest_palindrome(s):
    """Find longest palindromic substring."""
    if len(s) < 2:
        return s
    
    start, max_len = 0, 1
    
    for i in range(len(s)):
        # Odd length
        left, right = i, i
        while left >= 0 and right < len(s) and s[left] == s[right]:
            if right - left + 1 > max_len:
                start = left
                max_len = right - left + 1
            left -= 1
            right += 1
        
        # Even length
        left, right = i, i + 1
        while left >= 0 and right < len(s) and s[left] == s[right]:
            if right - left + 1 > max_len:
                start = left
                max_len = right - left + 1
            left -= 1
            right += 1
    
    return s[start:start + max_len]
```

---

### Framework 2: Count Palindromes Template

```python
def count_substrings(s):
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

### Key Pattern Elements

| Element | Value | Purpose |
|---------|-------|---------|
| Odd center | left = right = i | Single character center |
| Even center | left = i, right = i+1 | Between two characters |
| Expansion | left--, right++ | Grow outward |
| Termination | Out of bounds or mismatch | Stop expanding |

<!-- back -->
