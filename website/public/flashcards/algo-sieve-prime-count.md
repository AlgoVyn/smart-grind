## Sieve of Eratosthenes

**Question:** How do you efficiently find all prime numbers up to n?

<!-- front -->

---

## Answer: Mark Multiples

### Algorithm
```python
def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            # Mark all multiples of i as not prime
            for j in range(i*i, n + 1, i):
                is_prime[j] = False
    
    return [i for i in range(2, n + 1) if is_prime[i]]
```

### Visual Walkthrough (n=20)
```
Start:  [F,F,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T]
i=2:    [F,F,T,T,F,T,F,T,F,T,F,T,F,T,F,T,F,T,F,T]
i=3:    [F,F,T,T,F,T,F,T,F,F,F,T,F,T,F,T,F,T,F,T]
i=4:    (skipped - not prime)
Result: Primes: 2,3,5,7,11,13,17,19
```

### Complexity
- **Time:** O(n log log n) - very efficient!
- **Space:** O(n)

### Optimizations
1. **Only iterate to √n:** After √n, all multiples already marked
2. **Start from i²:** Smaller multiples were already marked by smaller primes
3. **Odd-only sieve:** Save 50% space

### ⚠️ Common Mistakes
- Forgetting `is_prime[0] = is_prime[1] = False`
- Starting loop from 2 instead of 2
- Not using `int(n**0.5) + 1`

### Variations
- Segmented Sieve (for very large n)
- Linear Sieve (O(n))

<!-- back -->
