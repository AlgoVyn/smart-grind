## Inclusion-Exclusion: Tactics & Applications

What tactical patterns leverage inclusion-exclusion?

<!-- front -->

---

### Tactic 1: Counting Square-Free Numbers

```python
def count_square_free(n):
    """
    Count numbers <= n that are square-free
    (not divisible by any p^2)
    """
    # Get all primes up to sqrt(n)
    primes = sieve(int(n**0.5) + 1)
    
    # Use PIE on conditions: divisible by p^2 for each prime p
    from itertools import combinations
    
    result = n
    
    for k in range(1, len(primes) + 1):
        for combo in combinations(primes, k):
            # Product of squares
            product = 1
            for p in combo:
                product *= p * p
                if product > n:
                    break
            
            if product > n:
                continue
            
            # Count multiples of product
            count = n // product
            sign = (-1)**k
            result += sign * count
    
    return result

def sieve(n):
    """Generate primes up to n using sieve of Eratosthenes"""
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n+1, i):
                is_prime[j] = False
    
    return [i for i, p in enumerate(is_prime) if p]
```

---

### Tactic 2: GCD/LCM Counting

```python
def count_pairs_with_gcd(n, target_gcd):
    """
    Count pairs (i, j) with 1 <= i, j <= n and gcd(i, j) = target_gcd
    """
    # gcd(i, j) = d iff d|i and d|j and gcd(i/d, j/d) = 1
    # Count = count_coprime_pairs(n // d)
    
    m = n // target_gcd
    return count_coprime_pairs(m)

def count_coprime_pairs(n):
    """
    Count pairs (i, j) with 1 <= i, j <= n and gcd(i, j) = 1
    """
    total = 0
    
    # For each i, count j coprime to i
    for i in range(1, n + 1):
        total += euler_totient(i) * (n // i)
    
    # Alternative using summatory totient
    return total

def count_with_lcm(n, target_lcm):
    """
    Count pairs with LCM equal to target
    """
    # Factor target
    # Use inclusion-exclusion on prime power conditions
    pass
```

---

### Tactic 3: Forbidden Position Problems

```python
def count_valid_permutations(n, forbidden):
    """
    forbidden[i] = set of positions where element i cannot go
    Count valid permutations
    """
    # Use inclusion-exclusion on violating conditions
    # Condition (i, p): element i at forbidden position p
    
    from itertools import combinations
    
    total = math.factorial(n)
    
    # Generate all violation conditions
    conditions = []
    for i in range(n):
        for p in forbidden[i]:
            conditions.append((i, p))
    
    m = len(conditions)
    
    for k in range(1, m + 1):
        sign = (-1)**k
        
        for combo in combinations(conditions, k):
            # Check if combo is valid (no conflicts)
            elements = set()
            positions = set()
            valid = True
            
            for e, p in combo:
                if e in elements or p in positions:
                    valid = False
                    break
                elements.add(e)
                positions.add(p)
            
            if not valid:
                continue
            
            # Count permutations satisfying these violations
            remaining = n - k
            count = math.factorial(remaining)
            total += sign * count
    
    return total
```

---

### Tactic 4: Sieve of Eratosthenes with PIE

```python
def count_primes_in_range(l, r):
    """
    Count primes in range [l, r]
    Using segmented sieve with PIE for small factor elimination
    """
    # Get primes up to sqrt(r)
    small_primes = sieve(int(r**0.5) + 1)
    
    # Create boolean array for [l, r]
    is_prime = [True] * (r - l + 1)
    
    for p in small_primes:
        # Find first multiple of p in range
        start = ((l + p - 1) // p) * p
        if start == p:  # Skip the prime itself if in range
            start += p
        
        # Mark multiples
        for j in range(start, r + 1, p):
            is_prime[j - l] = False
    
    return sum(is_prime)

def count_almost_primes(n, k):
    """
    Count numbers with exactly k prime factors (with multiplicity)
    """
    # Use generating function with inclusion-exclusion
    pass
```

---

### Tactic 5: Probability Union Bounds

```python
def union_bound_bonferroni(events_probabilities):
    """
    Bonferroni inequalities provide bounds on union probability
    """
    # Lower bound: P(∪ Aᵢ) >= Σ P(Aᵢ) - Σ P(Aᵢ ∩ Aⱼ)
    # Upper bound: P(∪ Aᵢ) <= Σ P(Aᵢ)
    
    # First order (Boole's inequality / union bound):
    upper_bound = sum(events_probabilities)
    
    # Second order (inclusion-exclusion first correction):
    # Need pairwise probabilities
    # lower_bound = sum(singles) - sum(pairs)
    
    return {'upper': min(upper_bound, 1.0)}

def principle_of_inclusion_exclusion_prob(events):
    """
    Exact probability of union using PIE
    """
    from itertools import combinations
    
    result = 0
    n = len(events)
    
    for k in range(1, n + 1):
        sign = (-1)**(k + 1)
        
        for combo in combinations(events, k):
            # Assume independence for calculation
            prob = 1.0
            for e in combo:
                prob *= e.probability
            
            result += sign * prob
    
    return result
```

<!-- back -->
