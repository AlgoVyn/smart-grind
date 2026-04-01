## Title: KMP Tactics

What are the key implementation tactics and optimizations for KMP?

<!-- front -->

---

### Implementation Tactics

| Tactic | Benefit |
|--------|---------|
| Use 0-indexed arrays | Cleaner logic |
| Pre-allocate prefix array | Avoid dynamic resizing |
| Inline prefix computation | Reduce function call overhead |
| Early termination | Stop if pattern > remaining text |

---

### Common Patterns

**Finding Period:**
```python
def get_period(s, pi):
    n = len(s)
    k = n - pi[n-1]
    if n % k == 0:
        return k  # string = (substring)^rep
    return n  # no period
```

**String Power:**
```python
def is_power(s, pi):
    return len(s) % (len(s) - pi[-1]) == 0
```

**Border Decomposition:**
```python
# All borders by following π chain
def all_borders(s, pi):
    borders = []
    k = pi[-1]
    while k > 0:
        borders.append(k)
        k = pi[k-1]
    return borders
```

---

### Pitfalls
| Mistake | Fix |
|---------|-----|
| Off-by-one in π | π[0] always 0 |
| Not resetting j | Set j = π[j-1] after match |
| Wrong fallback | Use π[j-1] not π[j] |
| Empty pattern | Return [0..n] or handle separately |

<!-- back -->
