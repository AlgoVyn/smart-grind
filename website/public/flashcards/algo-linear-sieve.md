## Linear Sieve (Euler's Sieve)

**Question:** How to find primes up to n in O(n)?

<!-- front -->

---

## Answer: Sieve with Marked Primes

### Solution
```python
def linear_sieve(n):
    primes = []
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, n + 1):
        if is_prime[i]:
            primes.append(i)
        
        for p in primes:
            if i * p > n:
                break
            
            is_prime[i * p] = False
            
            # Key: break when p divides i
            # This ensures each composite is marked once
            if i % p == 0:
                break
    
    return primes
```

### Visual: Linear Sieve
```
n = 10

i=2: primes=[2], mark 2*2=4
     i%2==0 break

i=3: primes=[2,3], mark 2*3=6, 3*3=9
     i%3!=0 continue

i=4: primes=[2,3], mark 2*4=8
     i%2==0 break

i=5: primes=[2,3,5], mark 2*5=10
     i%5!=0

Result: [2,3,5,7]
```

### ⚠️ Tricky Parts

#### 1. Why O(n)?
```python
# Each composite number is marked exactly once
# Unlike regular sieve which marks multiples multiple times

# The break condition i % p == 0 is key:
# - p is the smallest prime factor of i
# - So i * p' where p' > p will be marked when i' = i/p'
```

#### 2. Regular Sieve (for comparison)
```python
def regular_sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n + 1, i):
                is_prime[j] = False
    
    return [i for i in range(2, n + 1) if is_prime[i]]

# Time: O(n log log n) - not truly linear
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Linear Sieve | O(n) | O(n) |
| Regular Sieve | O(n log log n) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong break | Use i % p == 0 |
| Not marking 0,1 | Initialize correctly |
| Overflow | Check i * p <= n |

<!-- back -->
