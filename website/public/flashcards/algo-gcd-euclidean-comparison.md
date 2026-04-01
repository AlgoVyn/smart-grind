## GCD Euclidean: Comparison with Alternatives

How does Euclidean GCD compare to other GCD computation methods?

<!-- front -->

---

### Euclidean vs Binary vs Subtractive

| Method | Time | Operations | Best For |
|--------|------|------------|----------|
| **Euclidean** | O(log min(a,b)) | Division | General purpose |
| **Binary** | O(log min(a,b)) | Shifts, subtractions | Large integers |
| **Subtractive** | O(max(a,b)) | Subtractions | Never use |
| **Built-in** | Hardware optimized | Varies | Production code |

```python
# Euclidean - fastest in practice for most cases
def gcd_euclidean(a, b):
    while b:
        a, b = b, a % b
    return a

# Binary - competitive for very large integers
def gcd_binary(a, b):
    # Uses bit operations only
    pass

# Python built-in - fastest
def gcd_builtin(a, b):
    return math.gcd(a, b)  # Implemented in C
```

---

### When to Use Each Approach

| Scenario | Recommended | Why |
|----------|-------------|-----|
| **Standard integers** | `math.gcd` | Optimized C implementation |
| **Big integers (Python)** | `math.gcd` | Still uses Euclidean |
| **Cryptographic (C/C++)** | Binary | Avoids division overhead |
| **Educational** | Euclidean | Clear and efficient |
| **Very large numbers** | Lehmer's | Reduces large divisions |

---

### Built-in vs Custom Implementation

| Feature | `math.gcd` | Custom |
|---------|------------|--------|
| **Speed** | Fastest | Slower |
| **Extended GCD** | Not available | Can implement |
| **Multiple args** | 3.9+: `math.gcd(*args)` | Manual reduce |
| **LCM** | `math.lcm` (3.9+) | Manual |

```python
# Python 3.9+ has multiple argument support
from math import gcd, lcm

gcd(12, 18, 24)  # = 6
lcm(4, 6, 8)     # = 24

# For older Python
from functools import reduce
gcd_multi = lambda *args: reduce(gcd, args)
```

---

### Extended GCD: Recursive vs Iterative

| Aspect | Recursive | Iterative |
|--------|-----------|-----------|
| **Code clarity** | Cleaner | More verbose |
| **Stack depth** | O(log n) | O(1) |
| **Speed** | Similar | Similar |
| **Coefficients** | Direct | Track separately |

```python
# Recursive - easier to understand
def ext_gcd_recursive(a, b):
    if b == 0:
        return (a, 1, 0)
    g, x1, y1 = ext_gcd_recursive(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return (g, x, y)

# Iterative - no recursion limit issues
def ext_gcd_iterative(a, b):
    old_r, r = a, b
    old_s, s = 1, 0
    old_t, t = 0, 1
    
    while r:
        q = old_r // r
        old_r, r = r, old_r - q * r
        old_s, s = s, old_s - q * s
        old_t, t = t, old_t - q * t
    
    return (old_r, old_s, old_t)
```

**Recommendation:** Iterative for production, recursive for understanding.

<!-- back -->
