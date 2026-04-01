## Miller-Rabin: Framework

What are the complete implementations of the Miller-Rabin primality test?

<!-- front -->

---

### Core Miller-Rabin Single Round

```python
def miller_rabin_single(n, a):
    """
    Single round of Miller-Rabin test.
    Returns False if n is definitely composite.
    Returns True if n is probably prime (witness a passed).
    """
    # Write n-1 as d * 2^s
    d = n - 1
    s = 0
    while d % 2 == 0:
        d //= 2
        s += 1
    
    # Compute a^d mod n
    x = pow(a, d, n)
    
    if x == 1 or x == n - 1:
        return True
    
    # Square up to s-1 times
    for _ in range(s - 1):
        x = pow(x, 2, n)
        if x == n - 1:
            return True
        if x == 1:
            return False
    
    return False
```

---

### Complete Miller-Rabin (Probabilistic)

```python
import random

def is_prime(n, k=10):
    """
    Miller-Rabin primality test.
    k = number of rounds (higher = more accurate).
    """
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0:
        return False
    
    # Test k random bases
    for _ in range(k):
        a = random.randrange(2, n - 1)
        if not miller_rabin_single(n, a):
            return False
    
    return True
```

---

### Deterministic Miller-Rabin (n < 2^64)

```python
def is_prime_deterministic(n):
    """
    Deterministic for all n < 2^64.
    Uses specific set of bases proven sufficient.
    """
    if n < 2:
        return False
    for p in [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]:
        if n % p == 0:
            return n == p
    
    # Bases from research paper (Jaeschke 1993, extended)
    bases = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
    
    for a in bases:
        if a >= n:
            continue
        if not miller_rabin_single(n, a):
            return False
    
    return True
```

---

### Optimized Small Number Check

```python
def is_prime_optimized(n):
    """Fast path for small numbers, MR for large"""
    small_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
    
    # Quick checks
    if n < 2:
        return False
    for p in small_primes:
        if n % p == 0:
            return n == p
    
    # Trial division up to cube root for medium numbers
    # Then Miller-Rabin for large
    if n < 10**6:
        i = 29
        while i * i <= n:
            if n % i == 0:
                return False
            i += 2
        return True
    
    return is_prime_deterministic(n)
```

---

### Finding Large Primes

```python
def find_prime(bits):
    """Find a random prime with given bit length"""
    while True:
        # Generate random odd number
        n = random.getrandbits(bits) | 1 | (1 << (bits - 1))
        if is_prime_deterministic(n):
            return n

# Generate 512-bit prime for RSA
large_prime = find_prime(512)
```

<!-- back -->
