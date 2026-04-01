## Title: Linear Sieve

What is the Linear Sieve and how does it generate primes efficiently?

<!-- front -->

---

### Definition
Sieve of Eratosthenes variant that achieves O(n) time complexity by ensuring each composite number is crossed out exactly once by its smallest prime factor.

### Core Insight
Every composite number has a unique representation as:
```
n = p × m  where p is the smallest prime factor of n
```

By iterating through primes and marking multiples only up to the point where the current prime divides the multiplier, we ensure O(n) total operations.

### Algorithm
```python
def linear_sieve(n):
    primes = []
    is_composite = [False] * (n + 1)
    spf = [0] * (n + 1)  # smallest prime factor
    
    for i in range(2, n + 1):
        if not is_composite[i]:
            primes.append(i)
            spf[i] = i
        
        for p in primes:
            if p > spf[i] or i * p > n:
                break
            is_composite[i * p] = True
            spf[i * p] = p
    
    return primes, spf
```

---

### Why O(n)?
| Sieve Type | Time | Why |
|------------|------|-----|
| Classic | O(n log log n) | Multiple marking per composite |
| Linear | O(n) | Each composite marked exactly once |

Each composite x = p × i is marked when processing i with p = spf[x].

### Applications
- Prime generation up to n
- Smallest prime factor (SPF) table
- Prime factorization in O(log n)
- Multiplicative function computation

<!-- back -->
