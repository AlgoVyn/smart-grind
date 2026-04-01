## Inclusion-Exclusion: Frameworks

What are the standard implementations for inclusion-exclusion problems?

<!-- front -->

---

### Basic PIE Framework

```python
def inclusion_exclusion(sets, total):
    """
    Compute |union of sets| using PIE
    sets: list of sets
    """
    from itertools import combinations
    
    n = len(sets)
    result = 0
    
    for k in range(1, n + 1):
        # Sum over all k-sized subsets
        for subset in combinations(range(n), k):
            # Intersection of all sets in subset
            intersection = set.intersection(*(sets[i] for i in subset))
            
            # Add with sign (-1)^(k+1)
            sign = 1 if k % 2 == 1 else -1
            result += sign * len(intersection)
    
    return result
```

---

### Bitmask PIE Framework

```python
def pie_bitmask(conditions, count_fn):
    """
    PIE using bitmask for subset iteration
    count_fn(mask): count elements satisfying all conditions in mask
    """
    n = len(conditions)
    result = 0
    
    for mask in range(1, 1 << n):
        bits = bin(mask).count('1')
        sign = 1 if bits % 2 == 1 else -1
        
        result += sign * count_fn(mask)
    
    return result

# Example: Count numbers divisible by any of given primes
def count_divisible_by_any(n, primes):
    def count_fn(mask):
        """Count of numbers <= n divisible by all primes in mask"""
        product = 1
        for i in range(len(primes)):
            if mask & (1 << i):
                product *= primes[i]
        return n // product
    
    return pie_bitmask(primes, count_fn)
```

---

### Coprime Counting Framework (Euler's Totient)

```python
def euler_totient(n):
    """
    Count of numbers from 1 to n coprime with n
    Using PIE on prime factors
    """
    # Factor n
    factors = prime_factors(n)
    unique_factors = list(set(factors))
    
    result = n
    
    # Apply PIE: subtract multiples of each prime
    for k in range(1, len(unique_factors) + 1):
        from itertools import combinations
        
        for subset in combinations(unique_factors, k):
            product = 1
            for p in subset:
                product *= p
            
            # Inclusion-exclusion sign
            if k % 2 == 1:
                result -= n // product
            else:
                result += n // product
    
    return result

def prime_factors(n):
    """Return list of prime factors"""
    factors = []
    d = 2
    while d * d <= n:
        while n % d == 0:
            factors.append(d)
            n //= d
        d += 1
    if n > 1:
        factors.append(n)
    return factors
```

---

### Derangement Framework

```python
def derangements(n):
    """
    Count permutations where no element in original position
    Using PIE
    """
    # Total permutations: n!
    # Subtract permutations where at least one fixed point
    
    import math
    
    result = math.factorial(n)
    
    for k in range(1, n + 1):
        # Choose k positions to be fixed: C(n, k)
        # Arrange remaining (n-k) elements: (n-k)!
        sign = -1 if k % 2 == 1 else 1
        
        ways = math.comb(n, k) * math.factorial(n - k)
        result += sign * ways
    
    return result

# Alternative: direct formula
def derangements_direct(n):
    import math
    result = 0
    for k in range(n + 1):
        result += (-1)**k / math.factorial(k)
    return round(math.factorial(n) * result)
```

---

### Surjective Functions Framework

```python
def count_surjective(n, m):
    """
    Count surjective (onto) functions from n elements to m elements
    """
    # Total functions: m^n
    # Subtract functions missing at least one element in codomain
    
    import math
    
    result = 0
    for k in range(m + 1):
        # Choose k elements to exclude: C(m, k)
        # Functions to remaining (m-k) elements: (m-k)^n
        sign = (-1)**k
        result += sign * math.comb(m, k) * ((m - k) ** n)
    
    return result

# Stirling numbers of second kind
def stirling2(n, k):
    """
    Count ways to partition n elements into k non-empty subsets
    Related to surjective functions
    """
    if n == 0 and k == 0:
        return 1
    if n == 0 or k == 0:
        return 0
    
    # S(n, k) = (1/k!) × Σ(-1)^(k-i) × C(k, i) × i^n
    import math
    result = 0
    for i in range(k + 1):
        sign = (-1)**(k - i)
        result += sign * math.comb(k, i) * (i ** n)
    
    return result // math.factorial(k)
```

<!-- back -->
