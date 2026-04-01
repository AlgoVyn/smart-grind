## Combinations (nCr): Tactics & Tricks

What are the essential tactics for computing combinations efficiently?

<!-- front -->

---

### Tactic 1: Use Symmetry to Minimize Iterations

```python
def nCr_optimized(n, r):
    # Always choose the smaller of r and n-r
    r = min(r, n - r)
    
    # Now iterate only r times instead of potentially n/2 more
    result = 1
    for i in range(r):
        result = result * (n - i) // (i + 1)
    return result

# Example: C(100, 98) = C(100, 2)
# Without: 98 iterations
# With: 2 iterations (66x faster)
```

---

### Tactic 2: Compute with Early Reduction

```python
def nCr_reduce_early(n, r):
    """
    Keep intermediate results small by dividing early
    """
    r = min(r, n - r)
    numer = []  # Numerator factors
    denom = []  # Denominator factors
    
    # Build factor lists
    for i in range(r):
        numer.append(n - i)
        denom.append(i + 1)
    
    # Cancel common factors
    for d in denom:
        for i, num in enumerate(numer):
            g = gcd(num, d)
            if g > 1:
                numer[i] //= g
                d //= g
                if d == 1:
                    break
    
    # Multiply remaining
    result = 1
    for num in numer:
        result *= num
    return result
```

---

### Tactic 3: Pascal's Triangle Precomputation

```python
def precompute_nCr(max_n, mod=10**9 + 7):
    """
    Precompute all C(n,r) for n ≤ max_n
    Space efficient: only store one row at a time if needed
    """
    # C[n][r] stored in triangular form
    C = [[1] * (i + 1) for i in range(max_n + 1)]
    
    for n in range(2, max_n + 1):
        for r in range(1, n):
            C[n][r] = (C[n-1][r-1] + C[n-1][r]) % mod
    
    return C

# Query in O(1) after O(max_n²) preprocessing
```

---

### Tactic 4: Lucas Theorem for Huge n

```python
def nCr_mod_large(n, r, p=10**9 + 7):
    """
    When n can be up to 10^18 but p is manageable
    """
    # Precompute factorials up to p-1
    fact = [1] * p
    for i in range(1, p):
        fact[i] = fact[i-1] * i % p
    
    def nCr_mod_prime(n_small, r_small):
        if r_small > n_small:
            return 0
        return fact[n_small] * pow(fact[r_small] * fact[n_small - r_small] % p, p-2, p) % p
    
    result = 1
    while n > 0 or r > 0:
        ni = n % p
        ri = r % p
        result = result * nCr_mod_prime(ni, ri) % p
        n //= p
        r //= p
    
    return result
```

---

### Tactic 5: Generating Function Coefficient

```python
def nCr_via_polynomial(n, r):
    """
    C(n,r) = coefficient of x^r in (1+x)^n
    Can use FFT for very large n
    """
    # (1+x)^n expanded
    # Only need x^r term
    
    # For actual implementation:
    # Use the multiplicative formula
    # Or use binary exponentiation of polynomial
    
    # Practical: just use standard formula
    return nCr(n, r)
```

**Note:** FFT-based polynomial multiplication is rarely needed for nCr unless n is astronomically large and you need all coefficients.

<!-- back -->
