## nCr Binomial: Forms & Variations

What are the different forms and variations of binomial coefficient problems?

<!-- front -->

---

### Form 1: Single Query (Small n)

```python
# Direct computation for small n
def nCr_small(n, r):
    from math import comb  # Python 3.8+
    return comb(n, r)

# Or manual calculation
def nCr_manual(n, r):
    r = min(r, n - r)
    result = 1
    for i in range(1, r + 1):
        result = result * (n - r + i) // i
    return result
```

---

### Form 2: Multiple Queries (Same n, different r)

```python
def all_ncr_for_n(n, mod):
    """Compute nC0, nC1, ..., nCn efficiently"""
    result = [1] * (n + 1)
    
    # Use recurrence: nCr = nC(r-1) * (n-r+1) / r
    for r in range(1, n + 1):
        result[r] = result[r-1] * (n - r + 1) // r
        if mod:
            result[r] %= mod
    
    return result

# Example: all_ncr_for_n(5) = [1, 5, 10, 10, 5, 1]
```

---

### Form 3: Row of Pascal's Triangle

```python
def pascal_row(n, mod=None):
    """Generate nth row of Pascal's triangle"""
    row = [1]
    
    for k in range(1, n + 1):
        # next_val = prev_val * (n-k+1) // k
        next_val = row[-1] * (n - k + 1) // k
        if mod:
            next_val %= mod
        row.append(next_val)
    
    return row

# Usage: pascal_row(5) = [1, 5, 10, 10, 5, 1]
```

---

### Form 4: nCr Mod Prime Power

```python
def nCr_prime_power(n, r, p, k):
    """
    Compute nCr mod p^k using Lucas theorem extension.
    Requires Garner's algorithm or similar for reconstruction.
    """
    mod = p ** k
    
    # Compute exponent of p in nCr
    def vp_factorial(n, p):
        count = 0
        while n > 0:
            n //= p
            count += n
        return count
    
    exp_p = vp_factorial(n, p) - vp_factorial(r, p) - vp_factorial(n-r, p)
    
    if exp_p >= k:
        return 0
    
    # Compute p-adic components and combine
    # (simplified - full implementation is complex)
    return lucas_extension(n, r, p, k)
```

---

### Form 5: Binomial Sum Queries

```python
def sum_ncr_range(n, r1, r2, mod):
    """
    Compute sum of nCr for r in [r1, r2].
    Uses prefix sums or special identities.
    """
    # Method 1: Direct for small ranges
    # return sum(nCr(n, r) for r in range(r1, r2+1)) % mod
    
    # Method 2: Use identity: sum_{r=0}^k nCr = C(n, <=k)
    # Requires cumulative binomial tables
    
    # Method 3: Hockey-stick identity for special cases
    # sum_{i=r}^n iCr = (n+1)C(r+1)
    
    # Simplified implementation
    result = 0
    nCr = precompute_ncr(n, mod)
    for r in range(r1, min(r2, n) + 1):
        result = (result + nCr(n, r)) % mod
    return result
```

<!-- back -->
