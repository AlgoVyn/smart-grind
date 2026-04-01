## Title: Sieve of Eratosthenes - Core Concepts

What is the Sieve of Eratosthenes and how does it work?

<!-- front -->

---

### Definition
Ancient algorithm (circa 240 BC) for finding all prime numbers up to a given limit n. Works by iteratively marking multiples of each prime starting from 2.

| Aspect | Details |
|--------|---------|
| **Time** | O(n log log n) |
| **Space** | O(n) |
| **Key Insight** | Every composite has a prime factor ≤ √n |

---

### Prime and Composite Numbers

| Type | Definition | Example |
|------|------------|---------|
| **Prime** | Exactly two divisors: 1 and itself | 2, 3, 5, 7, 11 |
| **Composite** | More than two divisors | 4, 6, 8, 9, 10 |
| **Neither** | 0 and 1 | 0, 1 |

### Sieve Principle

Instead of checking each number individually for primality (O(n√n)), the sieve marks multiples of known primes:

```
For each prime p found:
    Mark all multiples of p (2p, 3p, 4p, ...) as composite
```

---

### Optimization: Start from p²

When marking multiples of prime p, start from p² instead of 2p:

- Multiples 2p, 3p, ..., (p-1)p were already marked by smaller primes
- Starting from p² avoids redundant work
- Crucial for achieving O(n log log n) complexity

```python
for p in range(2, int(n**0.5) + 1):
    if is_prime[p]:
        # Start from p*p, not 2*p
        for multiple in range(p * p, n + 1, p):
            is_prime[multiple] = False
```

---

### Square Root Bound

Only need to sieve up to √n:

- Any composite number c ≤ n has a prime factor p ≤ √c ≤ √n
- After processing all primes up to √n, all composites are marked
- Remaining unmarked numbers are primes

<!-- back -->
