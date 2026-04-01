## Modular Inverse: Tactics & Techniques

What are the tactical patterns for modular inverse computation?

<!-- front -->

---

### Tactic 1: Choose Method Based on Modulus

| Situation | Method | Code |
|-----------|--------|------|
| m prime | Fermat | `pow(a, m-2, m)` |
| m composite, coprime | Extended Euclid | `mod_inverse(a, m)` |
| Many queries, small range | Precompute | `inverse_range(n, m)` |
| Unknown if coprime | Check gcd | `egcd` then verify |

```python
def smart_inverse(a, m):
    """Auto-select best method"""
    if is_prime(m):  # Pre-check or known
        return pow(a, m - 2, m)
    return mod_inverse(a, m)  # Extended Euclid
```

---

### Tactic 2: Verify Inverse Exists First

```python
def safe_inverse(a, m):
    """Check existence before computing"""
    from math import gcd
    
    if gcd(a % m, m) != 1:
        return None  # No inverse
    
    return mod_inverse(a, m)
```

---

### Tactic 3: Handle Large-Scale Problems

**Problem**: Computing nCk mod p for many queries.

**Solution**: Precompute factorials and their inverses.

```python
def precompute_factorial_inverses(n, mod):
    """O(n) precompute for O(1) nCr queries"""
    fact = [1] * (n + 1)
    for i in range(2, n + 1):
        fact[i] = fact[i-1] * i % mod
    
    # Fermat's for inverse of factorial[n]
    inv_fact = [1] * (n + 1)
    inv_fact[n] = pow(fact[n], mod - 2, mod)
    
    # Work backwards
    for i in range(n - 1, -1, -1):
        inv_fact[i] = inv_fact[i + 1] * (i + 1) % mod
    
    return fact, inv_fact

def nCr(n, r, fact, inv_fact, mod):
    """O(1) combination using precomputed inverses"""
    if r < 0 or r > n:
        return 0
    return fact[n] * inv_fact[r] % mod * inv_fact[n-r] % mod
```

---

### Tactic 4: Chinese Remainder for Composite

When modulus factors, compute inverse mod each factor.

```python
def inverse_crt(a, factors):
    """
    Compute a⁻¹ mod m where m = product of factors.
    Factors must be pairwise coprime.
    """
    remainders = []
    for p in factors:
        inv = mod_inverse(a % p, p)
        if inv is None:
            return None
        remainders.append(inv)
    
    # Combine with CRT
    return chinese_remainder(remainders, factors)
```

---

### Tactic 5: Euler's Theorem Generalization

When a and m not coprime, use generalized approach.

```python
def mod_inverse_generalized(a, m):
    """
    Find x where ax ≡ gcd(a,m) (mod m).
    Divide by gcd for reduced equation.
    """
    g, x, y = egcd(a, m)
    
    # ax + my = g
    # So ax ≡ g (mod m)
    
    if g == 1:
        return (x % m + m) % m  # Standard inverse
    
    # a/g × x ≡ 1 (mod m/g)
    # Gives solution to reduced equation
    a_reduced = a // g
    m_reduced = m // g
    
    inv = mod_inverse(a_reduced % m_reduced, m_reduced)
    return (inv * (x % m)) % m
```

<!-- back -->
