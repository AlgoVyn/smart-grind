## Chinese Remainder: Tactics & Tricks

What are the essential tactics for applying and optimizing Chinese Remainder Theorem solutions?

<!-- front -->

---

### Tactic 1: Precompute Inverses

When solving multiple CRT problems with same moduli:

```python
class CRTSolver:
    def __init__(self, moduli):
        self.moduli = moduli
        self.M = 1
        for m in moduli:
            self.M *= m
        
        # Precompute M_i and inverses
        self.M_i = []
        self.inverses = []
        for m in moduli:
            M_i = self.M // m
            self.M_i.append(M_i)
            self.inverses.append(mod_inverse(M_i, m))
    
    def solve(self, remainders):
        """O(n) after O(n log max(m)) preprocessing"""
        result = 0
        for i, r in enumerate(remainders):
            result = (result + r * self.M_i[i] * self.inverses[i]) % self.M
        return result
```

---

### Tactic 2: Handle Negative Remainders

Always normalize remainders to [0, m-1]:

```python
def normalize_remainders(remainders, moduli):
    """Ensure 0 <= r < m for all remainders"""
    return [(r % m + m) % m for r, m in zip(remainders, moduli)]

# Common bug:
# x ≡ -1 (mod 5) should be treated as x ≡ 4 (mod 5)
```

---

### Tactic 3: Early Consistency Check

For non-coprime moduli, check before computing:

```python
def check_consistency(rems, mods):
    """Verify solution might exist (O(n²))"""
    n = len(rems)
    for i in range(n):
        for j in range(i + 1, n):
            g = gcd(mods[i], mods[j])
            if (rems[i] - rems[j]) % g != 0:
                return False, (i, j)  # Conflicting pair
    return True, None
```

---

### Tactic 4: Modulo During Construction

Keep intermediate values small:

```python
def crt_safe(rems, mods):
    """CRT with intermediate modulo to prevent overflow"""
    M = 1
    for m in mods:
        M *= m
    
    result = 0
    for r, m in zip(rems, mods):
        M_i = M // m
        inv = mod_inverse(M_i % m, m)
        # Add modulo at each step
        term = (r % M) * (M_i % M) % M
        term = term * (inv % M) % M
        result = (result + term) % M
    
    return result
```

---

### Tactic 5: Iterative Merging for Large n

Instead of one large CRT, merge congruences pairwise:

```python
def iterative_crt(rems, mods):
    """More numerically stable for many congruences"""
    if not rems:
        return 0, 1
    
    x, m = rems[0], mods[0]
    
    for rem, mod in zip(rems[1:], mods[1:]):
        # Solve: x ≡ rem (mod mod) with current x mod m
        g = gcd(m, mod)
        
        if (rem - x) % g != 0:
            return None, None
        
        # New modulus is lcm(m, mod)
        new_m = m // g * mod
        
        # Find coefficient t
        # x + m*t ≡ rem (mod mod)
        diff = (rem - x) // g
        m_div_g = m // g
        mod_div_g = mod // g
        
        inv = mod_inverse(m_div_g % mod_div_g, mod_div_g)
        t = (diff * inv) % mod_div_g
        
        x = (x + m * t) % new_m
        m = new_m
    
    return x, m
```

<!-- back -->
