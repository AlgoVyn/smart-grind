## Title: Manacher's Tactics

What are the key implementation tactics for Manacher's Algorithm?

<!-- front -->

---

### Implementation Tactics

| Tactic | Benefit |
|--------|---------|
| Character padding | Handle even/odd uniformly |
| Use list for t | Faster string building |
| 1-indexed arrays | Simpler boundary checks |
| Precompute valid ranges | Skip impossible centers |

### Optimized Implementation
```python
def manacher_optimized(s):
    # Build transformed array faster
    n = len(s)
    t = ['#'] * (2 * n + 1)
    for i, c in enumerate(s):
        t[2 * i + 1] = c
    
    m = len(t)
    d = [0] * m
    c = r = 0
    
    for i in range(m):
        mirror = 2 * c - i
        if i < r:
            d[i] = min(r - i, d[mirror])
        
        # Expand
        l, ri = i - d[i] - 1, i + d[i] + 1
        while l >= 0 and ri < m and t[l] == t[ri]:
            d[i] += 1
            l -= 1
            ri += 1
        
        if i + d[i] > r:
            c, r = i, i + d[i]
    
    return t, d
```

---

### Common Pitfalls
| Pitfall | Issue | Fix |
|---------|-------|-----|
| Wrong radius definition | Off by one | Clarify if inclusive |
| Boundary checks | Array out of bounds | Check before access |
| String indexing | Off by one in transform | Map correctly |
| Even palindromes | Missing | Use # padding |
| Center vs boundary | Confusing indices | Comment clearly |

### Validation
```python
def verify_manacher(s, d, t):
    """Verify d[i] is correct for all i"""
    for i in range(len(d)):
        r = d[i]
        # Check it's maximal
        assert i - r < 0 or i + r >= len(t) or t[i-r] != t[i+r]
        # Check palindrome property
        for j in range(r):
            assert t[i-j] == t[i+j]
```

<!-- back -->
