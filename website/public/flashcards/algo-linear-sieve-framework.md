## Title: Linear Sieve Framework

What is the standard framework for the Linear Sieve?

<!-- front -->

---

### Linear Sieve Framework
```
LINEAR_SIEVE(n):
  primes = empty list
  is_composite = [false] * (n+1)
  spf = [0] * (n+1)
  
  for i = 2 to n:
    if not is_composite[i]:
      primes.append(i)
      spf[i] = i
    
    for p in primes:
      if p > spf[i] or i*p > n:
        break
      
      is_composite[i*p] = true
      spf[i*p] = p       // p is smallest prime factor of i*p
  
  return primes, spf
```

---

### Key Invariants
| Invariant | Meaning |
|-----------|---------|
| `p <= spf[i]` | Ensures p is smallest factor for new composite |
| `spf[i*p] = p` | Set smallest prime factor |
| `break when p > spf[i]` | Stop to avoid duplicate marking |

### Comparison
| Sieve | Time | Space | Use |
|-------|------|-------|-----|
| Classic | O(n log log n) | O(n) | Simple implementation |
| Linear | O(n) | O(n) | Need SPF, many queries |
| Segmented | O(n log log n) | O(√n) | Large n, memory constrained |
| Bitwise | O(n log log n) | O(n/8) | Minimize memory |

---

### SPF Applications
```python
def factorize(x, spf):
    """O(log x) prime factorization"""
    factors = {}
    while x > 1:
        p = spf[x]
        while x % p == 0:
            factors[p] = factors.get(p, 0) + 1
            x //= p
    return factors

def euler_phi(n, spf):
    """Compute φ(n) using spf"""
    result = n
    x = n
    while x > 1:
        p = spf[x]
        result -= result // p
        while x % p == 0:
            x //= p
    return result
```

<!-- back -->
