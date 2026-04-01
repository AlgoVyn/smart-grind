## Miller-Rabin: Tactics & Techniques

What are the tactical patterns and problem-solving techniques for Miller-Rabin primality testing?

<!-- front -->

---

### Tactic 1: Pre-screen with Small Primes

**Why**: Eliminates ~85% of composites before expensive MR test.

```python
small_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 
                31, 37, 41, 43, 47]

def fast_prime_check(n):
    # Quick divisibility test
    for p in small_primes:
        if n % p == 0:
            return n == p
    
    # Miller-Rabin for survivors
    return miller_rabin(n, k=5)
```

**Performance**: For random 64-bit numbers, only ~5% need full MR.

---

### Tactic 2: Optimal Base Selection

| Range | Minimum Bases Required |
|-------|------------------------|
| n < 2,047 | {2} |
| n < 1,373,653 | {2, 3} |
| n < 9,080,191 | {31, 73} |
| n < 25,326,001 | {2, 3, 5} |
| n < 3,215,031,751 | {2, 3, 5, 7} |
| n < 2^64 | {2,3,5,7,11,13,17,19,23,29,31,37} |

```python
def get_bases_for_range(n):
    if n < 2047:
        return [2]
    elif n < 1373653:
        return [2, 3]
    elif n < 25326001:
        return [2, 3, 5]
    else:
        return [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
```

---

### Tactic 3: Modular Exponentiation (Built-in)

Use Python's `pow(base, exp, mod)` - it's optimized in C.

```python
# Fast
x = pow(a, d, n)  # O(log d) time

# Slow - don't do this
x = (a ** d) % n  # Computes huge number first
```

**Performance**: `pow(a, d, n)` is ~1000x faster for large numbers.

---

### Tactic 4: Parallel Witness Testing

For very high confidence, test multiple bases in parallel.

```python
from concurrent.futures import ThreadPoolExecutor

def parallel_miller_rabin(n, bases):
    """Test multiple bases in parallel"""
    with ThreadPoolExecutor() as executor:
        results = executor.map(
            lambda a: miller_rabin_single(n, a), 
            bases
        )
    return all(results)
```

---

### Tactic 5: Combining with Other Tests

**Lucas-Lehmer + Miller-Rabin**: For extra certainty on Mersenne candidates.

```python
def is_mersenne_prime(p):
    """Check if 2^p - 1 is prime (p must be prime)"""
    if not is_prime_basic(p):
        return False
    
    # Lucas-Lehmer test for Mersenne numbers
    mp = (1 << p) - 1
    s = 4
    for _ in range(p - 2):
        s = (s * s - 2) % mp
    
    return s == 0
```

**Rule**: Use Lucas-Lehmer for Mersenne numbers, MR for general.

<!-- back -->
