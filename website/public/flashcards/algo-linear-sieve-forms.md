## Title: Linear Sieve Forms

What are the different forms and applications of the Linear Sieve?

<!-- front -->

---

### Multiplicative Functions
| Function | Formula | Sieve Computation |
|----------|---------|-------------------|
| φ(n) | n × Π(1-1/p) | phi[i*p] = phi[i] × (p-1) if p∤i, else phi[i] × p |
| μ(n) | Möbius | mu[i*p] = -mu[i] if p∤i, else 0 |
| d(n) | Divisor count | d[i*p] = d[i] × 2 if p∤i |
| σ(n) | Sum of divisors | Similar pattern |

### Computing Phi with Linear Sieve
```python
def sieve_phi(n):
    primes = []
    is_composite = [False] * (n + 1)
    phi = list(range(n + 1))  # phi[i] = i initially
    
    for i in range(2, n + 1):
        if not is_composite[i]:
            primes.append(i)
            phi[i] = i - 1  # prime: φ(p) = p-1
        
        for p in primes:
            if i * p > n:
                break
            is_composite[i * p] = True
            
            if i % p == 0:
                phi[i * p] = phi[i] * p  # p divides i
                break
            else:
                phi[i * p] = phi[i] * (p - 1)  # p doesn't divide i
    
    return phi
```

---

### Segmented Sieve
```python
def segmented_sieve(low, high):
    """Sieve range [low, high] using primes up to √high"""
    limit = int(high**0.5) + 1
    base_primes, _ = linear_sieve(limit)
    
    is_prime = [True] * (high - low + 1)
    
    for p in base_primes:
        start = max(p * p, (low + p - 1) // p * p)
        for j in range(start, high + 1, p):
            is_prime[j - low] = False
    
    if low == 1:
        is_prime[0] = False
    
    return [i for i, p in enumerate(is_prime, low) if p]
```

---

### Form Comparison
| Form | Range | Memory | Time |
|------|-------|--------|------|
| Linear | n ≤ 10⁷ | O(n) | O(n) |
| Segmented | n ≤ 10¹² | O(√n + segment) | O(n log log n) |
| Probabilistic | Any | O(log n) | Miller-Rabin |

<!-- back -->
