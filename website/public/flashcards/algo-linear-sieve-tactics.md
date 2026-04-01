## Title: Linear Sieve Tactics

What are the key implementation tactics for the Linear Sieve?

<!-- front -->

---

### Optimization Tactics

| Tactic | Benefit |
|--------|---------|
| Pre-allocate arrays | Avoid dynamic resizing |
| Use array.array('b') | 1 byte per bool vs Python bool |
| Skip even numbers | 2x speedup |
| Bit packing | 8x memory reduction |

### Even-Number Optimization
```python
def linear_sieve_odd(n):
    """Only sieve odd numbers"""
    if n >= 2:
        primes = [2]
    else:
        primes = []
    
    size = (n + 1) // 2
    is_composite = [False] * size
    
    for i in range(1, size):
        if not is_composite[i]:
            p = 2 * i + 1
            primes.append(p)
            for j in range((p * p) // 2, size, p):
                is_composite[j] = True
    
    return primes
```

---

### Common Pitfalls
| Pitfall | Issue | Fix |
|---------|-------|-----|
| Integer overflow | i*p > int limit | Check before multiply |
| Off-by-one | Array bounds | Allocate n+1 not n |
| Wrong break condition | p > spf[i] not p >= | Use strict > |
| Forgetting spf[i] = i | Uninitialized | Set for primes |
| 1 is not prime | Wrong base case | Start from 2 |

### Python-Specific Tips
```python
# Faster loops with local variables
def sieve_fast(n):
    is_comp = [False] * (n + 1)
    primes = []
    append = primes.append  # local reference
    
    for i in range(2, n):
        if not is_comp[i]:
            append(i)
        for p in primes:
            ip = i * p
            if ip >= n:
                break
            is_comp[ip] = True
            if i % p == 0:
                break
    return primes
```

<!-- back -->
