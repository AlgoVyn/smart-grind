## KMP - Longest Prefix Suffix (LPS)

**Question:** What does LPS array represent and how is it computed?

<!-- front -->

---

## KMP: LPS Array

### LPS Definition
`lps[i]` = length of longest proper prefix that is also suffix in `pattern[0..i]`

```
Pattern: \"ABABAC\"
Index:     0 1 2 3 4 5
LPS:       0 0 1 2 3 0

For i=4 (pattern[4]="A"):
- \"ABAB\" → prefix \"AB\" = suffix \"AB\" ✓ → lps[4] = 2
```

### Computing LPS
```python
def compute_lps(pattern):
    m = len(pattern)
    lps = [0] * m
    length = 0  # length of previous lps
    i = 1
    
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]  # Try shorter prefix
            else:
                lps[i] = 0
                i += 1
    
    return lps
```

### Using LPS for Search
```python
def kmp_search(text, pattern):
    n, m = len(text), len(pattern)
    lps = compute_lps(pattern)
    
    i = j = 0
    while i < n:
        if pattern[j] == text[i]:
            i += 1
            j += 1
        
        if j == m:
            print(f\"Found at {i-j}\")
            j = lps[j-1]  # Continue searching
        elif i < n and pattern[j] != text[i]:
            j = lps[j-1] if j != 0 else 0
            if j == 0:
                i += 1
```

### Complexity: O(n + m)

<!-- back -->
