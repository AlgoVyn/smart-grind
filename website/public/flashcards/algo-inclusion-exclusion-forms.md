## Inclusion-Exclusion: Forms & Variations

What are the different forms and applications of inclusion-exclusion?

<!-- front -->

---

### Standard Union Size Form

```python
# |A ∪ B ∪ C| = |A| + |B| + |C| - |A∩B| - |A∩C| - |B∩C| + |A∩B∩C|
def union_size_standard(sets):
    """Standard PIE for union cardinality"""
    from itertools import combinations
    
    n = len(sets)
    result = 0
    
    for k in range(1, n + 1):
        sign = (-1)**(k + 1)
        for combo in combinations(sets, k):
            intersection = set.intersection(*combo)
            result += sign * len(intersection)
    
    return result
```

---

### Complement Form (None Satisfy)

```python
def count_satisfying_none(conditions, total, count_fn):
    """
    Count elements where NONE of the conditions hold
    = total - |union of conditions|
    """
    n = len(conditions)
    result = total
    
    for k in range(1, n + 1):
        from itertools import combinations
        
        for combo in combinations(range(n), k):
            # Count satisfying all conditions in combo
            count = count_fn(combo)
            sign = (-1)**k
            result += sign * count
    
    return result

# Example: Count numbers not divisible by any in primes
def count_coprime(n, primes):
    def count_fn(combo):
        lcm = 1
        for i in combo:
            lcm = lcm * primes[i] // math.gcd(lcm, primes[i])
        return n // lcm
    
    return count_satisfying_none(primes, n, count_fn)
```

---

### Exactly K Conditions Form

```python
def count_exactly_k_conditions(n, conditions, count_fn):
    """
    Count elements satisfying exactly k out of n conditions
    """
    from itertools import combinations
    
    # Use generating functions or direct enumeration
    # For small n, can enumerate all 2^n possibilities
    
    result = 0
    
    # Choose which k conditions are satisfied
    for satisfied in combinations(range(n), k):
        # Must satisfy these k
        # Must NOT satisfy the others
        
        # Count satisfying 'satisfied' set
        count_satisfied = count_fn(satisfied)
        
        # Subtract those that also satisfy additional conditions
        # Apply PIE on remaining conditions
        remaining = [i for i in range(n) if i not in satisfied]
        
        exclusion = 0
        for extra in range(1, len(remaining) + 1):
            for combo in combinations(remaining, extra):
                all_conditions = satisfied + combo
                sign = (-1)**extra
                exclusion += sign * count_fn(all_conditions)
        
        result += count_satisfied - exclusion
    
    return result
```

---

### Mobius Inversion Form

```python
def mobius_inversion(n, f):
    """
    If F(n) = Σ f(d) for all d|n,
    then f(n) = Σ μ(d) × F(n/d) for all d|n
    
    μ: Mobius function
    μ(n) = 1 if n is square-free with even prime factors
    μ(n) = -1 if n is square-free with odd prime factors
    μ(n) = 0 if n has squared prime factor
    """
    def mobius(n):
        if n == 1:
            return 1
        
        factors = prime_factors(n)
        
        # Check for square factors
        if len(factors) != len(set(factors)):
            return 0
        
        # Count distinct prime factors
        return -1 if len(set(factors)) % 2 == 1 else 1
    
    # Get all divisors
    divisors = get_divisors(n)
    
    result = 0
    for d in divisors:
        result += mobius(d) * f(n // d)
    
    return result

def get_divisors(n):
    divisors = []
    i = 1
    while i * i <= n:
        if n % i == 0:
            divisors.append(i)
            if i != n // i:
                divisors.append(n // i)
        i += 1
    return sorted(divisors)
```

---

### Generating Function Form

```python
def pie_generating_function(conditions, total):
    """
    Represent PIE using generating functions
    Product over conditions: (1 + x × indicator)
    Coefficient of x^k = elements satisfying exactly k conditions
    """
    # For each element, compute how many conditions it satisfies
    # Then aggregate
    
    counts = {}  # k -> count of elements satisfying exactly k
    
    for element in total:
        k = sum(1 for cond in conditions if cond(element))
        counts[k] = counts.get(k, 0) + 1
    
    return counts

# Probability version
def pie_probability(events):
    """
    P(∪ Aᵢ) = ΣP(Aᵢ) - ΣP(Aᵢ∩Aⱼ) + ΣP(Aᵢ∩Aⱼ∩Aₖ) - ...
    """
    from itertools import combinations
    
    result = 0
    n = len(events)
    
    for k in range(1, n + 1):
        sign = (-1)**(k + 1)
        for combo in combinations(events, k):
            # P(intersection of combo)
            prob = 1  # Compute based on independence
            result += sign * prob
    
    return result
```

<!-- back -->
