## Miller-Rabin Primality Test

**Question:** Probabilistic prime test in O(k × log³n)?

<!-- front -->

---

## Answer: Fermat + Square Roots

### Algorithm
```python
import random

def mul_mod(a, b, mod):
    return (a * b) % mod

def power_mod(a, d, mod):
    result = 1
    base = a % mod
    
    while d > 0:
        if d % 2 == 1:
            result = mul_mod(result, base, mod)
        base = mul_mod(base, base, mod)
        d //= 2
    
    return result

def miller_rabin(n, k=5):
    if n < 2:
        return False
    if n == 2 or n == 3:
        return True
    if n % 2 == 0:
        return False
    
    # Write n-1 as 2^r × d
    r, d = 0, n - 1
    while d % 2 == 0:
        r += 1
        d //= 2
    
    # Witness loop
    for _ in range(k):
        a = random.randint(2, n - 2)
        x = power_mod(a, d, n)
        
        if x == 1 or x == n - 1:
            continue
        
        for _ in range(r - 1):
            x = mul_mod(x, x, n)
            if x == n - 1:
                break
        else:
            return False  # Composite
    
    return True  # Probably prime
```

### Visual: Test Process
```
n-1 = d × 2^r

Check: a^d, a^(2d), a^(4d), ..., a^(2^r × d)

If any equals n-1 → continue
If none equals n-1 → composite
```

### ⚠️ Tricky Parts

#### 1. Decomposition Step
```python
# Write n-1 = d × 2^r
# where d is odd

# This is crucial for modular exponentiation
```

#### 2. Deterministic Variants
```python
# For n < 3,317,044,064,679,887,385,961,981
# Only need to check: 2, 3, 5, 7, 11, 13, 17

# These bases guarantee correct result
```

### Time & Accuracy

| Aspect | Value |
|--------|-------|
| Time | O(k × log³n) |
| Error | (1/4)^k per test |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not handling small n | Check n < 4 first |
| Even n | Reject immediately |
| Wrong random range | Use [2, n-2] |

<!-- back -->
