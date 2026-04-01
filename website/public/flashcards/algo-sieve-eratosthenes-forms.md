## Title: Sieve of Eratosthenes - Forms

What are the different manifestations of the sieve pattern?

<!-- front -->

---

### Form 1: Prime Generation Sieve

Standard sieve for generating all primes up to n.

| Variant | Time | Space | Use Case |
|---------|------|-------|----------|
| Basic | O(n log log n) | O(n) | General purpose |
| Odd-only | O(n log log n) | O(n/2) | Memory optimization |
| Segmented | O(n log log n) | O(√n) | Very large n |

```python
def sieve_basic(n):
    """Generate all primes up to n."""
    if n < 2:
        return []
    
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for p in range(2, int(n**0.5) + 1):
        if is_prime[p]:
            for i in range(p * p, n + 1, p):
                is_prime[i] = False
    
    return [i for i in range(2, n + 1) if is_prime[i]]
```

---

### Form 2: Prime Counting Sieve

Count primes less than n without storing all primes.

```python
def count_primes(n):
    """Count primes strictly less than n."""
    if n <= 2:
        return 0
    
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    
    for p in range(2, int(n**0.5) + 1):
        if is_prime[p]:
            for i in range(p * p, n, p):
                is_prime[i] = False
    
    return sum(is_prime)
```

---

### Form 3: Factorization Sieve (SPF Array)

Precompute smallest prime factor for fast factorization.

```python
def sieve_spf(n):
    """Compute smallest prime factor for each number."""
    spf = list(range(n + 1))
    
    for i in range(2, int(n**0.5) + 1):
        if spf[i] == i:  # i is prime
            for j in range(i * i, n + 1, i):
                if spf[j] == j:
                    spf[j] = i
    
    return spf

# O(log n) factorization using SPF
def factorize(x, spf):
    factors = []
    while x > 1:
        factors.append(spf[x])
        x //= spf[x]
    return factors
```

---

### Form 4: Segmented Sieve

For finding primes in a range [low, high] where high is very large.

```
1. Generate base primes up to √high using standard sieve
2. Create boolean array for range [low, high]
3. For each base prime p:
   - Find first multiple in range
   - Mark all multiples in range
4. Return unmarked numbers in range
```

```python
def segmented_sieve(low, high):
    """Find primes in [low, high] using O(√high) memory."""
    if low < 2:
        low = 2
    
    limit = int(high**0.5) + 1
    base_primes = sieve_basic(limit)
    
    is_prime = [True] * (high - low + 1)
    
    for p in base_primes:
        start = max(p * p, ((low + p - 1) // p) * p)
        for j in range(start, high + 1, p):
            is_prime[j - low] = False
    
    return [i for i in range(low, high + 1) if is_prime[i - low]]
```

---

### Form 5: Bitwise Sieve

Memory-optimized version using bits instead of bytes.

| Standard | Bitwise | Savings |
|----------|---------|---------|
| 1 byte per number | 1 bit per number | 8x memory reduction |
| 100MB for n=10⁸ | 12.5MB for n=10⁸ | Significant for large n |

<!-- back -->
