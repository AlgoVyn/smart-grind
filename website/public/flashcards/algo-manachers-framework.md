## Title: Manacher's Framework

What is the standard framework for Manacher's Algorithm?

<!-- front -->

---

### Manacher's Framework
```
MANACHER(s):
  // Phase 1: Transform
  t = '#' + '#'.join(s) + '#'
  n = length(t)
  d = [0] * n  // radius array
  
  // Phase 2: Compute palindrome radii
  c = 0  // center of rightmost palindrome
  r = 0  // right boundary
  
  for i = 0 to n-1:
    mirror = 2*c - i
    
    // Case 1: i within right boundary
    if i < r:
      d[i] = min(r - i, d[mirror])
    
    // Case 2: Expand (always needed)
    while can_expand(i, d[i]):
      d[i] += 1
    
    // Case 3: Update boundary
    if i + d[i] > r:
      c = i
      r = i + d[i]
  
  return d

// Helper
can_expand(i, radius):
  left = i - radius - 1
  right = i + radius + 1
  return left >= 0 and right < n and t[left] == t[right]
```

---

### Key Cases
| Case | Condition | Action |
|------|-----------|--------|
| i >= r | Outside boundary | Start fresh expansion |
| i < r, d[mirror] small | Fits in boundary | d[i] = d[mirror] |
| i < r, d[mirror] large | Extends past r | d[i] = r - i, then expand |

### Applications
| Application | How to Compute |
|-------------|----------------|
| Longest palindrome | max(d[i]) |
| Count palindromes | sum(d[i] // 2) for original positions |
| Palindrome centers | d[i] > 1 indicates center |

---

### Interpreting Results
```python
def count_palindromes(d):
    """Total palindromic substrings"""
    # For transformed string: each d[i] gives 2*d[i]-1 chars palindrome
    # In original: floor(d[i]/2) gives count at that center
    return sum(x // 2 for x in d)

def get_longest(t, d):
    """Extract longest palindrome substring"""
    max_r = max(d)
    center = d.index(max_r)
    # In transformed string, radius includes center
    # Actual substring: (center - max_r + 1) to (center + max_r - 1)
    return t[center - max_r + 1 : center + max_r].replace('#', '')
```

<!-- back -->
