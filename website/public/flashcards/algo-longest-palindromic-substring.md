## Longest Palindromic Substring

**Question:** Find longest palindromic substring in string?

<!-- front -->

---

## Answer: Expand Around Center

### Solution
```python
def longestPalindrome(s):
    if not s:
        return ""
    
    start, end = 0, 0
    
    for i in range(len(s)):
        len1 = expand(s, i, i)      # Odd length
        len2 = expand(s, i, i + 1)  # Even length
        max_len = max(len1, len2)
        
        if max_len > end - start:
            start = i - (max_len - 1) // 2
            end = i + max_len // 2
    
    return s[start:end + 1]

def expand(s, left, right):
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return right - left - 1
```

### Visual: Expand Around Center
```
String: "babad"

Center at 'b' (index 1):
- Odd: "bab" ← expands to palindrome
- Even: "ba" ← not palindrome

Center at 'a' (index 2):
- Odd: "aba" ← expands to palindrome

Result: "bab" or "aba"
```

### ⚠️ Tricky Parts

#### 1. Two Center Types
```python
# Odd length: single center character
#   a|b|c → center is 'b'

# Even length: between two characters  
#   a|b|b|c → center is between 'b's
```

#### 2. Start Calculation
```python
# After expansion, left is one before palindrome
# right is one after palindrome
# palindrome is from left+1 to right-1

# Length = right - left - 1
# start = i - (length-1)//2
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Expand around center | O(n²) | O(1) |
| DP approach | O(n²) | O(n²) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Only checking odd | Check both odd and even |
| Wrong start index | Use correct formula |
| Not updating start | Update start and end |

<!-- back -->
