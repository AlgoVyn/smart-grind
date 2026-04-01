## Title: Manacher's Algorithm

What is Manacher's Algorithm and what problem does it solve?

<!-- front -->

---

### Definition
Linear-time algorithm for finding all palindromic substrings in a string. Finds longest palindromic substring in O(n) time.

### Core Insight
Transform string to handle even-length palindromes:
```
"abba" → "#a#b#b#a#"
```
All palindromes become odd-length with center at # or letter.

### Algorithm Overview
```
d[i] = radius of palindrome centered at position i
       (including center, so "aba" has d=2 at 'b')

Maintain center c and right boundary r of rightmost palindrome.
For each position i:
  mirror = 2*c - i  (reflection of i around c)
  
  if i < r:
    d[i] = min(r - i, d[mirror])  # within boundary
  else:
    d[i] = 1  # start with just the center character
  
  # Expand around center i
  while i-d[i] >= 0 and i+d[i] < n and s[i-d[i]] == s[i+d[i]]:
    d[i] += 1
  
  # Update rightmost boundary
  if i + d[i] > r:
    c, r = i, i + d[i]
```

---

### Implementation
```python
def manacher(s):
    # Transform: insert # between chars and at ends
    t = '#' + '#'.join(s) + '#'
    n = len(t)
    d = [0] * n
    
    c = r = 0  # center and right boundary
    for i in range(n):
        mirror = 2 * c - i
        
        if i < r:
            d[i] = min(r - i, d[mirror])
        
        # Expand
        while i - d[i] - 1 >= 0 and i + d[i] + 1 < n and \
              t[i - d[i] - 1] == t[i + d[i] + 1]:
            d[i] += 1
        
        # Update center if expanded past r
        if i + d[i] > r:
            c, r = i, i + d[i]
    
    return t, d  # d[i] is radius (number of steps from center)

# Find longest palindrome
def longest_palindrome(s):
    t, d = manacher(s)
    max_len = max(d)
    center = d.index(max_len)
    
    start = (center - max_len) // 2  # map back to original string
    length = max_len  # d includes # so actual length = d[i]-1 roughly
    
    # Calculate actual length in original string
    actual_len = max_len - 1 if t[center] != '#' else max_len // 2 * 2
    
    return s[start:start + actual_len]
```

---

### Complexity
| Aspect | Value |
|--------|-------|
| Time | O(n) - each position expanded at most once |
| Space | O(n) for transformed string and array |

<!-- back -->
