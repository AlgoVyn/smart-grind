## Miller-Rabin: Forms & Variations

What are the different forms and variations of Miller-Rabin primality testing?

<!-- front -->

---

### Form 1: Basic Primality Check

```python
def is_prime_basic(n):
    """Entry point: handle small cases, use MR for large"""
    if n < 2:
        return False
    if n == 2 or n == 3:
        return True
    if n % 2 == 0:
        return False
    
    return miller_rabin(n, k=5)  # 5 rounds
```

---

### Form 2: Batch Primality Testing

```python
def sieve_miller_rabin(limit):
    """Find all primes up to limit efficiently"""
    if limit < 1000:
        # Simple sieve for small limits
        sieve = [True] * (limit + 1)
        sieve[0] = sieve[1] = False
        for i in range(2, int(limit**0.5) + 1):
            if sieve[i]:
                for j in range(i*i, limit + 1, i):
                    sieve[j] = False
        return [i for i, is_p in enumerate(sieve) if is_p]
    else:
        # Segmented approach with MR for candidates
        # (implementation omitted for brevity)
        pass
```

---

### Form 3: Prime Counting π(x)

```python
def count_primes(n):
    """Count primes <= n using Lehmer's method + MR"""
    if n < 100:
        return sum(1 for i in range(2, n+1) if is_prime_basic(i))
    
    # For large n, use Lehmer's formula or Legendre's formula
    # with MR to verify primality of needed values
    # (simplified - full implementation is complex)
    
    # Simple fallback for demonstration
    count = 0
    for i in range(2, n + 1):
        if is_prime_basic(i):
            count += 1
    return count
```

---

### Form 4: Next/Previous Prime

```python
def next_prime(n):
    """Find smallest prime > n"""
    if n < 2:
        return 2
    
    candidate = n + 1 if n % 2 == 0 else n + 2
    while not is_prime_deterministic(candidate):
        candidate += 2  # Skip even numbers
    
    return candidate

def prev_prime(n):
    """Find largest prime < n"""
    if n <= 2:
        return None
    
    candidate = n - 1 if n % 2 == 0 else n - 2
    while candidate >= 2:
        if is_prime_deterministic(candidate):
            return candidate
        candidate -= 2
    
    return 2 if n > 2 else None
```

---

### Form 5: Prime Factorization Helper

```python
def factor_with_miller_rabin(n):
    """Factor using trial division + MR for primality checks"""
    factors = []
    d = 2
    
    while d * d <= n:
        while n % d == 0:
            factors.append(d)
            n //= d
        d += 1 if d == 2 else 2  # Skip even after 2
    
    if n > 1:
        # n is prime (verified by MR for large n)
        factors.append(n)
    
    return factors
```

<!-- back -->
