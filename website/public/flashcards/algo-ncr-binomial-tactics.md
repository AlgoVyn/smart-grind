## nCr Binomial: Tactics & Techniques

What are the tactical patterns for binomial coefficient problems?

<!-- front -->

---

### Tactic 1: Use Symmetry to Minimize

Always compute with smaller r:

```python
def nCr(n, r, mod):
    r = min(r, n - r)  # O(r) instead of O(n-r)
    # ... rest of computation
```

| n | r | Use | Operations |
|---|-----|-----|------------|
| 100 | 1 | r=1 | 1 |
| 100 | 99 | r=1 (symmetry) | 1 |
| 100 | 50 | r=50 | 50 |

---

### Tactic 2: Precompute Factorials for Many Queries

```python
class BinomialCalculator:
    def __init__(self, max_n, mod):
        self.mod = mod
        self.fact = [1] * (max_n + 1)
        self.inv_fact = [1] * (max_n + 1)
        
        for i in range(2, max_n + 1):
            self.fact[i] = self.fact[i-1] * i % mod
        
        self.inv_fact[max_n] = pow(self.fact[max_n], mod-2, mod)
        for i in range(max_n - 1, -1, -1):
            self.inv_fact[i] = self.inv_fact[i+1] * (i+1) % mod
    
    def nCr(self, n, r):
        if r < 0 or r > n:
            return 0
        return (self.fact[n] * self.inv_fact[r] % self.mod * 
                self.inv_fact[n-r] % self.mod)
```

**Cost**: O(max_n) once, O(1) per query.

---

### Tactic 3: Lucas Theorem for Large n

When n ≥ mod (prime), use digit-wise decomposition:

```python
def nCr_large(n, r, mod):
    """Handle n >= mod using Lucas"""
    if n < mod:
        return nCr_small(n, r, mod)
    
    # Decompose and multiply
    result = 1
    while n > 0 or r > 0:
        ni, ri = n % mod, r % mod
        if ri > ni:
            return 0
        result = result * nCr_small(ni, ri, mod) % mod
        n //= mod
        r //= mod
    return result
```

---

### Tactic 4: Handle Non-Prime Modulus

Use Chinese Remainder Theorem:

```python
def nCr_composite(n, r, mod):
    """nCr mod composite using CRT"""
    # Factor mod into prime powers
    factors = prime_factorization(mod)
    
    remainders = []
    moduli = []
    
    for p, k in factors.items():
        pk = p ** k
        remainders.append(nCr_prime_power(n, r, p, k))
        moduli.append(pk)
    
    # Combine with CRT
    return chinese_remainder(remainders, moduli)
```

---

### Tactic 5: Avoid Division with Modular Inverse

Never divide in modular arithmetic:

```python
# WRONG
result = numerator // denominator % mod

# CORRECT
result = numerator * pow(denominator, mod-2, mod) % mod
```

**Critical**: Division requires modular inverse, only exists if gcd(denominator, mod) = 1.

<!-- back -->
