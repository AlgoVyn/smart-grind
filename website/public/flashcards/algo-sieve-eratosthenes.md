## Sieve of Eratosthenes: Prime Number Generation

**Question:** How does the Sieve of Eratosthenes work and what are the common optimizations?

<!-- front -->

---

## Answer: Mark Multiples of Each Prime

### Basic Implementation
```python
def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            # Mark all multiples of i starting from i*i
            for j in range(i * i, n + 1, i):
                is_prime[j] = False
    
    return [i for i in range(2, n + 1) if is_prime[i]]
```

### Optimized Implementation
```python
def sieve(n):
    if n < 2:
        return []
    
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    # Only need to check up to sqrt(n)
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            # Start from i*i (smaller multiples already marked)
            # Use slice assignment for speed
            is_prime[i*i:n+1:i] = [False] * len(range(i*i, n+1, i))
    
    return [i for i in range(2, n + 1) if is_prime[i]]
```

### Visual: How Sieve Works
```
n = 30

Initial:  [F, F, T, T, T, T, T, T, T, T, ...]
           0  1  2  3  4  5  6  7  8  9

Step i=2: Mark 4, 6, 8, 10, 12, ...
Step i=3: Mark 9, 12, 15, 18, 21, 24, 27, 30
Step i=5: Mark 25, 30
(Stop at sqrt(30) ≈ 5.4)

Final primes ≤ 30: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```

### ⚠️ Tricky Parts

#### 1. Starting from i*i
```python
# WRONG - inefficient, marks same numbers multiple times
for j in range(2 * i, n + 1, i):

# CORRECT - start from i*i
for j in range(i * i, n + 1, i):
# 2*i already marked by 2, 3*i by 3, etc.
```

#### 2. Not Checking sqrt(n)
```python
# WRONG - goes through entire array unnecessarily
for i in range(2, n):

# CORRECT - only need to check up to sqrt(n)
for i in range(2, int(n**0.5) + 1):
```

#### 3. Edge Cases
```python
# n < 2 returns empty list
if n < 2:
    return []

# 0 and 1 are not prime
is_prime[0] = is_prime[1] = False
```

### Segmented Sieve (For Large n)
```python
def segmented_sieve(n):
    # Get primes up to sqrt(n) using simple sieve
    limit = int(n**0.5) + 1
    base_primes = sieve(limit)
    
    is_prime = [True] * (n + 1)
    
    # Segment the range [limit, n]
    low = limit
    high = min(2 * limit, n)
    
    while low < n:
        # Mark primes in current segment
        for p in base_primes:
            start = ((low + p - 1) // p) * p
            if start == p:
                start = p * p
            
            for j in range(start, high + 1, p):
                is_prime[j] = False
        
        # Move to next segment
        low = high + 1
        high = min(high + limit, n)
    
    return [i for i in range(2, n) if is_prime[i]]
```

### Time Complexity

| Version | Time | Space |
|---------|------|-------|
| Basic | O(n log log n) | O(n) |
| Segmented | O(n log log n) | O(√n + n) |

### Common Applications

| Use Case | Description |
|----------|-------------|
| Prime counting | Count primes ≤ n |
| Prime factorization | Factor numbers using primes |
| Finding prime factors | Factor any number ≤ n² |

### Variations

| Variation | Purpose |
|-----------|---------|
| Linear sieve | O(n) time, stores smallest prime factor |
| Bit sieve | Memory efficient (1 bit per number) |
| Segmented sieve | For very large n |

<!-- back -->
