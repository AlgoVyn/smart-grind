## Title: Sieve of Eratosthenes - Tactics

What are specific techniques and optimizations for sieve implementation?

<!-- front -->

---

### Tactic 1: Efficient Composite Marking

Mark multiples starting from p², not 2p:

```python
for p in range(2, int(n**0.5) + 1):
    if is_prime[p]:
        # Start from p*p, not 2*p
        for multiple in range(p * p, n + 1, p):
            is_prime[multiple] = False
```

**Why this works:** Smaller multiples (2p, 3p, ..., (p-1)p) have smaller prime factors and were already marked.

---

### Tactic 2: Sieve Only Odd Numbers

Skip all even numbers except 2:

```python
def sieve_odd_only(n):
    if n < 2:
        return []
    if n == 2:
        return [2]
    
    # Only track odd numbers >= 3
    # Index i represents number 2i + 3
    size = (n - 3) // 2 + 1
    is_prime = [True] * size
    
    limit = int(n**0.5)
    for i in range((limit - 3) // 2 + 1):
        if is_prime[i]:
            p = 2 * i + 3
            # Start marking from p²
            start = (p * p - 3) // 2
            for j in range(start, size, p):
                is_prime[j] = False
    
    primes = [2]
    for i in range(size):
        if is_prime[i]:
            primes.append(2 * i + 3)
    
    return primes
```

---

### Tactic 3: Linear Sieve for O(n)

When you need optimal O(n) time and smallest prime factors:

```python
def linear_sieve(n):
    """O(n) sieve that also computes smallest prime factors."""
    spf = [0] * (n + 1)
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    primes = []
    
    for i in range(2, n + 1):
        if is_prime[i]:
            primes.append(i)
            spf[i] = i
        
        for p in primes:
            if i * p > n:
                break
            is_prime[i * p] = False
            spf[i * p] = p
            if i % p == 0:  # Critical optimization
                break
    
    return primes, spf
```

---

### Tactic 4: Precompute Prime Counts with Prefix Sum

For O(1) prime counting queries:

```python
def sieve_with_prefix(n):
    """Returns primes and prefix count array for O(1) queries."""
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for p in range(2, int(n**0.5) + 1):
        if is_prime[p]:
            for i in range(p * p, n + 1, p):
                is_prime[i] = False
    
    # Prefix sum: prime_prefix[i] = number of primes ≤ i
    prime_prefix = [0] * (n + 1)
    for i in range(1, n + 1):
        prime_prefix[i] = prime_prefix[i-1] + (1 if is_prime[i] else 0)
    
    primes = [i for i in range(2, n+1) if is_prime[i]]
    return primes, prime_prefix

# O(1) query: count primes in [l, r]
def count_primes_range(l, r, prime_prefix):
    return prime_prefix[r] - prime_prefix[l-1]
```

---

### Tactic 5: Algorithm Comparison

| Algorithm | Time | Space | Best Use Case |
|-----------|------|-------|---------------|
| **Sieve of Eratosthenes** | O(n log log n) | O(n) | Finding all primes up to n |
| **Linear Sieve** | O(n) | O(n) | Need SPF or O(n) guarantee |
| **Segmented Sieve** | O(n log log n) | O(√n) | Large ranges, memory constraints |
| **Naive Prime Check** | O(√n) per number | O(1) | Single/few prime checks |
| **Miller-Rabin** | O(k log³n) | O(1) | Very large numbers (n > 10¹⁸) |

**Key Insight:** Sieve of Eratosthenes is the most practical for competitive programming.

<!-- back -->
