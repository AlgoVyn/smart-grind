## nCr Binomial: Framework

What are the complete implementations for binomial coefficient computation?

<!-- front -->

---

### Pascal's Triangle DP (All nCr up to N)

```python
def binomial_coefficients(max_n, mod):
    """
    Precompute all nCr for 0 ≤ n ≤ max_n.
    Time: O(max_n²), Space: O(max_n²) or O(max_n).
    """
    # Space-optimized: keep only previous row
    prev = [1]  # n=0 row
    
    for n in range(1, max_n + 1):
        curr = [1] * (n + 1)
        for r in range(1, n):
            curr[r] = (prev[r - 1] + prev[r]) % mod
        prev = curr
    
    return prev  # Last row contains nC* for n=max_n
```

---

### Factorial Precomputation (Prime Modulus)

```python
def precompute_ncr(max_n, mod):
    """
    O(max_n) precompute for O(1) nCr queries.
    Requires mod to be prime.
    """
    fact = [1] * (max_n + 1)
    for i in range(2, max_n + 1):
        fact[i] = fact[i-1] * i % mod
    
    # Fermat's little theorem for inverse
    inv_fact = [1] * (max_n + 1)
    inv_fact[max_n] = pow(fact[max_n], mod - 2, mod)
    
    for i in range(max_n - 1, -1, -1):
        inv_fact[i] = inv_fact[i + 1] * (i + 1) % mod
    
    def nCr(n, r):
        if r < 0 or r > n:
            return 0
        return fact[n] * inv_fact[r] % mod * inv_fact[n-r] % mod
    
    return nCr
```

---

### Single nCr (Multiplicative Formula)

```python
def nCr_single(n, r, mod):
    """
    Compute single nCr without precomputation.
    Time: O(r), Space: O(1).
    """
    if r < 0 or r > n:
        return 0
    
    r = min(r, n - r)  # Use symmetry
    
    numerator = 1
    denominator = 1
    
    for i in range(r):
        numerator = numerator * (n - i) % mod
        denominator = denominator * (i + 1) % mod
    
    # denominator⁻¹ mod mod
    return numerator * pow(denominator, mod - 2, mod) % mod
```

---

### Lucas Theorem (Large n, Prime Mod)

```python
def lucas_theorem(n, r, p):
    """
    Compute nCr mod p where p is prime and n may be large.
    Based on: nCr ≡ Π n_i C r_i (mod p)
    where n_i, r_i are digits of n, r in base p.
    """
    if r < 0 or r > n:
        return 0
    
    result = 1
    while n > 0 or r > 0:
        ni = n % p
        ri = r % p
        
        if ri > ni:
            return 0
        
        # Compute ni C ri mod p using precomputed or small formula
        result = result * small_nCr(ni, ri, p) % p
        
        n //= p
        r //= p
    
    return result

def small_nCr(n, r, p):
    """Compute nCr mod p for small n (< p)"""
    if r > n:
        return 0
    
    num = 1
    den = 1
    for i in range(r):
        num = num * (n - i) % p
        den = den * (i + 1) % p
    
    return num * pow(den, p - 2, p) % p
```

---

### Binomial with Large n (Approximation)

```python
import math

def nCr_approx(n, r):
    """
    Approximate nCr using logarithms for very large n.
    Returns log(nCr) or uses Stirling's approximation.
    """
    if r < 0 or r > n:
        return 0
    
    r = min(r, n - r)
    
    # log(nCr) = log(n!) - log(r!) - log((n-r)!)
    # Using Stirling or log gamma
    log_result = (math.lgamma(n + 1) - 
                  math.lgamma(r + 1) - 
                  math.lgamma(n - r + 1))
    
    return math.exp(log_result)
```

<!-- back -->
