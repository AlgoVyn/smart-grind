## Title: KMP Forms

What are the different forms and applications of the KMP algorithm?

<!-- front -->

---

### Standard String Matching
```python
# Find all occurrences
positions = kmp_search(text, pattern)
```

### Autocorrect / String Analysis
| Application | Use |
|-------------|-----|
| Find border | π[m-1] gives longest border |
| String period | m - π[m-1] if m % (m-π[m-1]) == 0 |
| Minimal rotation | Concatenate, find pattern |
| Repeated pattern | Check if string = power of substring |

---

### Extended KMP (Z-Function)
```python
# Z[i] = longest prefix of S starting at i
# that matches prefix of S

def z_function(s):
    n = len(s)
    z = [0] * n
    l = r = 0
    for i in range(1, n):
        if i <= r:
            z[i] = min(r - i + 1, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] - 1 > r:
            l, r = i, i + z[i] - 1
    return z
```

Z-function equivalent to prefix function but often more intuitive.

---

### Aho-Corasick (Multi-pattern KMP)
```
Build trie of multiple patterns
Add failure links (like π) between trie nodes
Simultaneously match all patterns in O(n + matches)
```

### Form Comparison
| Form | Use Case | Complexity |
|------|----------|------------|
| KMP | Single pattern | O(n+m) |
| Z-function | Prefix-suffix queries | O(n) |
| Aho-Corasick | Multiple patterns | O(n + occ) |
| Manacher | Palindromes | O(n) |

<!-- back -->
