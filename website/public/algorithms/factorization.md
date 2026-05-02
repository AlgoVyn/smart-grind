# Prime Factorization

## Category
Number Theory

## Description

Prime factorization is the process of breaking down a composite number into a product of prime numbers. It is one of the most fundamental operations in number theory with applications in cryptography, simplifying fractions, computing GCD and LCM, and solving various mathematical problems.

The security of many cryptographic systems, including RSA, relies on the difficulty of factoring large numbers. For competitive programming and algorithmic problems, efficient factorization algorithms are essential for solving problems involving divisibility, counting divisors, and working with modular arithmetic.

---

## Concepts

Prime factorization relies on several fundamental concepts from number theory.

### 1. Fundamental Theorem of Arithmetic

Every integer greater than 1 has a unique prime factorization:

```
n = p₁^a₁ × p₂^a₂ × ... × pₖ^aₖ

where p₁, p₂, ..., pₖ are distinct primes
and a₁, a₂, ..., aₖ are positive integers
```

### 2. Trial Division

Basic method of finding factors:

| Step | Action | Range |
|------|--------|-------|
| 1 | Divide by 2 until odd | Remove all factors of 2 |
| 2 | Check odd numbers up to √n | Find remaining factors |
| 3 | If n > 1, it's prime | Last factor |

### 3. Smallest Prime Factor (SPF) Sieve

Precompute smallest prime factor for fast factorization:

| Operation | Time | Use |
|-----------|------|-----|
| **Build SPF table** | O(n log log n) | One-time preprocessing |
| **Factorize using SPF** | O(log n) | Per query |

### 4. Divisor Functions

Using factorization to compute divisor properties:

| Function | Formula | Use |
|----------|---------|-----|
| **Number of divisors** | Π(aᵢ + 1) | Count divisors |
| **Sum of divisors** | Π((pᵢ^(aᵢ+1) - 1) / (pᵢ - 1)) | Sum divisors |
| **Euler's totient** | n × Π(1 - 1/pᵢ) | Count coprimes |

---

## Frameworks

Structured approaches for prime factorization problems.

### Framework 1: Trial Division

```
┌─────────────────────────────────────────────────────────────┐
│  TRIAL DIVISION FACTORIZATION                               │
├─────────────────────────────────────────────────────────────┤
│  Input: Integer n                                            │
│  Output: Dictionary of prime factors and their exponents    │
│                                                             │
│  1. Initialize: factors = {}                                  │
│                                                             │
│  2. Check factor 2:                                          │
│     while n % 2 == 0:                                       │
│        factors[2] = factors.get(2, 0) + 1                    │
│        n //= 2                                              │
│                                                             │
│  3. Check odd factors from 3 to √n:                         │
│     for d from 3 to √n, step 2:                            │
│        while n % d == 0:                                    │
│           factors[d] = factors.get(d, 0) + 1                 │
│           n //= d                                           │
│                                                             │
│  4. If n > 1:                                               │
│     factors[n] = 1  # n is prime                            │
│                                                             │
│  5. Return factors                                           │
│                                                             │
│  Time: O(√n)                                                 │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Single number factorization, n < 10^12.

### Framework 2: SPF Sieve Precomputation

```
┌─────────────────────────────────────────────────────────────┐
│  SMALLEST PRIME FACTOR (SPF) SIEVE                          │
├─────────────────────────────────────────────────────────────┤
│  Input: Maximum number max_n                               │
│  Output: Array spf where spf[i] = smallest prime factor    │
│                                                             │
│  1. Initialize: spf[i] = i for all i from 0 to max_n      │
│                                                             │
│  2. For i from 2 to √max_n:                                 │
│     if spf[i] == i:  # i is prime                          │
│        for j from i*i to max_n, step i:                    │
│           if spf[j] == j:                                  │
│              spf[j] = i  # i is smallest factor              │
│                                                             │
│  3. Factorize using SPF:                                    │
│     while n > 1:                                            │
│        p = spf[n]                                           │
│        count factors of p                                   │
│        n //= p                                              │
│                                                             │
│  Time: O(max_n log log max_n) to build, O(log n) per query │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Multiple factorization queries, n < 10^7.

### Framework 3: Count Divisors Using Factorization

```
┌─────────────────────────────────────────────────────────────┐
│  DIVISOR COUNTING VIA FACTORIZATION                         │
├─────────────────────────────────────────────────────────────┤
│  Input: Integer n                                            │
│  Output: Number of divisors of n                             │
│                                                             │
│  1. Factorize n: n = p₁^a₁ × p₂^a₂ × ... × pₖ^aₖ           │
│                                                             │
│  2. Number of divisors = (a₁ + 1) × (a₂ + 1) × ... × (aₖ + 1) │
│                                                             │
│  3. Return product                                           │
│                                                             │
│  Example: n = 12 = 2² × 3¹                                  │
│  Number of divisors = (2+1) × (1+1) = 6                     │
│  Divisors: 1, 2, 3, 4, 6, 12                                │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Counting divisors without enumeration.

---

## Forms

Different manifestations and applications of prime factorization.

### Form 1: Single Number Factorization

Factor one number at a time.

| Method | Time | Best For |
|--------|------|----------|
| **Trial Division** | O(√n) | Single large n |
| **Pollard's Rho** | O(n^(1/4)) | Very large n (cryptography) |
| **Fermat's** | O(√n) | n = p × q, p ≈ q |

### Form 2: SPF-based Factorization

Precompute for fast queries.

```python
# Precompute SPF
spf = compute_spf(max_n)

# Factorize any n quickly
def factorize(n):
    factors = {}
    while n > 1:
        p = spf[n]
        while n % p == 0:
            factors[p] = factors.get(p, 0) + 1
            n //= p
    return factors
```

### Form 3: Counting Divisors

Compute divisor count from factorization.

```python
def count_divisors(factors):
    """factors is dict {p: count}"""
    result = 1
    for count in factors.values():
        result *= (count + 1)
    return result
```

### Form 4: Sum of Divisors

Using formula based on factorization.

```python
def sum_of_divisors(factors):
    """factors is dict {p: count}"""
    result = 1
    for p, count in factors.items():
        # (p^(count+1) - 1) / (p - 1)
        term = (p ** (count + 1) - 1) // (p - 1)
        result *= term
    return result
```

### Form 5: Euler's Totient Function

Count integers up to n that are coprime to n.

```python
def euler_totient(factors):
    """factors is dict {p: count}"""
    result = 1
    for p in factors:
        result *= (p - 1)
    n = 1
    for p, count in factors.items():
        n *= p ** count
    return n * result // (n // result)  # Or simpler:
    # n * product(1 - 1/p for p in factors)
```

---

## Tactics

Specific techniques and optimizations for factorization.

### Tactic 1: Optimized Trial Division

Check only up to √n and handle 2 separately:

```python
def prime_factorization(n):
    """Factor n using trial division. O(√n)"""
    factors = {}
    d = 2
    
    while d * d <= n:
        while n % d == 0:
            factors[d] = factors.get(d, 0) + 1
            n //= d
        d += 1 if d == 2 else 2  # Check 2, then odd numbers
    
    if n > 1:
        factors[n] = factors.get(n, 0) + 1
    
    return factors
```

### Tactic 2: SPF Sieve Implementation

Build smallest prime factor array:

```python
def compute_spf(max_n):
    """Compute smallest prime factor for all numbers up to max_n."""
    spf = list(range(max_n + 1))
    spf[0] = spf[1] = 0
    
    for i in range(2, int(max_n**0.5) + 1):
        if spf[i] == i:  # i is prime
            for j in range(i * i, max_n + 1, i):
                if spf[j] == j:
                    spf[j] = i
    
    return spf

def factorize_with_spf(n, spf):
    """Factorize n using precomputed SPF table. O(log n)"""
    factors = {}
    while n > 1:
        p = spf[n]
        while n % p == 0:
            factors[p] = factors.get(p, 0) + 1
            n //= p
    return factors
```

### Tactic 3: Generate All Divisors

From prime factorization:

```python
def get_divisors_from_factors(factors):
    """Generate all divisors from prime factorization."""
    divisors = [1]
    
    for prime, count in factors.items():
        new_divisors = []
        for d in divisors:
            power = 1
            for _ in range(count):
                power *= prime
                new_divisors.append(d * power)
        divisors.extend(new_divisors)
    
    return sorted(divisors)
```

### Tactic 4: Factorial Factorization

Count prime factors in n! without computing n!:

```python
def count_prime_in_factorial(n, p):
    """Count power of prime p in n! using Legendre's formula."""
    count = 0
    power = p
    while power <= n:
        count += n // power
        power *= p
    return count

def factorial_factorization(n):
    """Return prime factorization of n! as dict."""
    # First get primes up to n
    def sieve(limit):
        is_prime = [True] * (limit + 1)
        is_prime[0] = is_prime[1] = False
        for i in range(2, int(limit**0.5) + 1):
            if is_prime[i]:
                for j in range(i*i, limit + 1, i):
                    is_prime[j] = False
        return [i for i in range(2, limit + 1) if is_prime[i]]
    
    primes = sieve(n)
    return {p: count_prime_in_factorial(n, p) for p in primes}
```

### Tactic 5: GCD from Factorization

Compute GCD using shared prime factors:

```python
def gcd_from_factorization(factors_a, factors_b):
    """Compute GCD from prime factorizations."""
    gcd_factors = {}
    for p in factors_a:
        if p in factors_b:
            gcd_factors[p] = min(factors_a[p], factors_b[p])
    
    result = 1
    for p, exp in gcd_factors.items():
        result *= p ** exp
    return result
```

---

## Python Templates

### Template 1: Trial Division Factorization

```python
def prime_factorization(n):
    """
    Return prime factorization as dictionary {prime: count}.
    
    Time: O(sqrt(n))
    Space: O(log n) for result
    """
    factors = {}
    d = 2
    
    # Check 2 separately, then only odd numbers
    while d * d <= n:
        while n % d == 0:
            factors[d] = factors.get(d, 0) + 1
            n //= d
        d += 1 if d == 2 else 2
    
    if n > 1:
        factors[n] = factors.get(n, 0) + 1
    
    return factors
```

### Template 2: SPF Sieve

```python
def compute_spf(max_n):
    """
    Compute smallest prime factor for all numbers up to max_n.
    
    Time: O(max_n log log max_n)
    Space: O(max_n)
    """
    spf = list(range(max_n + 1))
    spf[0] = spf[1] = 0
    
    for i in range(2, int(max_n**0.5) + 1):
        if spf[i] == i:  # i is prime
            for j in range(i * i, max_n + 1, i):
                if spf[j] == j:
                    spf[j] = i
    
    return spf

def factorize_with_spf(n, spf):
    """
    Factorize n using precomputed SPF table.
    
    Time: O(log n)
    """
    factors = {}
    while n > 1:
        p = spf[n]
        while n % p == 0:
            factors[p] = factors.get(p, 0) + 1
            n //= p
    return factors
```

### Template 3: Count Divisors

```python
def count_divisors_from_factors(factors):
    """
    Count number of divisors from prime factorization.
    
    If n = p₁^a₁ × p₂^a₂ × ... × pₖ^aₖ
    Then number of divisors = (a₁ + 1) × (a₂ + 1) × ... × (aₖ + 1)
    """
    result = 1
    for count in factors.values():
        result *= (count + 1)
    return result

def count_divisors(n):
    """Count divisors by factorizing first."""
    factors = prime_factorization(n)
    return count_divisors_from_factors(factors)
```

### Template 4: Sum of Divisors

```python
def sum_of_divisors_from_factors(factors):
    """
    Compute sum of divisors from prime factorization.
    
    If n = p₁^a₁ × p₂^a₂ × ... × pₖ^aₖ
    Then sum of divisors = Π((pᵢ^(aᵢ+1) - 1) / (pᵢ - 1))
    """
    result = 1
    for prime, count in factors.items():
        # Sum of geometric series: 1 + p + p² + ... + p^count
        term = (prime ** (count + 1) - 1) // (prime - 1)
        result *= term
    return result
```

### Template 5: Generate All Divisors

```python
def get_all_divisors(factors):
    """
    Generate all divisors from prime factorization.
    
    Time: O(number of divisors)
    """
    divisors = [1]
    
    for prime, count in factors.items():
        new_divisors = []
        for d in divisors:
            power = 1
            for _ in range(count):
                power *= prime
                new_divisors.append(d * power)
        divisors.extend(new_divisors)
    
    return sorted(divisors)
```

### Template 6: Euler's Totient Function

```python
def euler_totient(n):
    """
    Count integers from 1 to n that are coprime to n.
    
    φ(n) = n × Π(1 - 1/p) for all distinct prime factors p of n
    
    Time: O(sqrt(n))
    """
    result = n
    p = 2
    temp = n
    
    while p * p <= temp:
        if temp % p == 0:
            while temp % p == 0:
                temp //= p
            result -= result // p
        p += 1 if p == 2 else 2
    
    if temp > 1:
        result -= result // temp
    
    return result

def euler_totient_from_factors(factors):
    """Compute totient from prime factorization."""
    result = 1
    for p, exp in factors.items():
        result *= (p - 1) * (p ** (exp - 1))
    return result
```

---

## When to Use

Use Prime Factorization when you need to solve problems involving:

- **Divisor Counting**: Number of divisors without enumeration
- **GCD/LCM**: Computing from shared prime factors
- **Modular Arithmetic**: Operations involving coprimes
- **Cryptography**: RSA, discrete logarithms
- **Diophantine Equations**: Solving with factor constraints

### Comparison with Alternatives

| Operation | With Factorization | Without Factorization | When to Use Alternative |
|-----------|-------------------|----------------------|------------------------|
| **GCD** | O(log n) from factors | Euclidean: O(log n) | Euclidean is simpler |
| **LCM** | O(log n) from factors | GCD-based: O(log n) | Both work similarly |
| **Divisor count** | O(log n) | Enumeration: O(√n) | Factorization much faster |
| **Coprime check** | Check shared factors | Euclidean: O(log n) | Euclidean for single check |

### When to Choose Factorization vs Other Approaches

- **Choose Factorization** when:
  - Multiple operations on same number needed
  - Working with divisor functions
  - Number theory problems require prime structure

- **Choose Euclidean Algorithm** when:
  - Only GCD needed
  - Single operation on large numbers
  - Implementation simplicity preferred

---

## Algorithm Explanation

### Core Concept

Prime factorization breaks down numbers into their fundamental building blocks - prime numbers. This decomposition reveals the structure of a number and enables efficient computation of many number-theoretic functions.

**Key Terminology**:
- **Prime**: Number > 1 with exactly two divisors
- **Composite**: Number with more than two divisors
- **SPF**: Smallest prime factor of a number
- **Trial Division**: Testing successive integers as potential factors

### How It Works

#### Step 1: Trial Division

```python
def trial_division(n):
    factors = {}
    d = 2
    while d * d <= n:
        while n % d == 0:
            factors[d] = factors.get(d, 0) + 1
            n //= d
        d += 1 if d == 2 else 2
    if n > 1:
        factors[n] = 1
    return factors
```

#### Step 2: SPF Sieve

```python
def build_spf(max_n):
    spf = list(range(max_n + 1))
    for i in range(2, int(max_n**0.5) + 1):
        if spf[i] == i:  # Prime
            for j in range(i*i, max_n + 1, i):
                if spf[j] == j:
                    spf[j] = i
    return spf
```

#### Step 3: Divisor Count

```python
def count_divisors(factors):
    result = 1
    for exp in factors.values():
        result *= (exp + 1)
    return result
```

### Visual Walkthrough

**Example: Factorization of 360**:
```
360 ÷ 2 = 180
180 ÷ 2 = 90
90 ÷ 2 = 45     ← Three factors of 2

45 ÷ 3 = 15
15 ÷ 3 = 5      ← Two factors of 3

5 ÷ 5 = 1       ← One factor of 5

360 = 2³ × 3² × 5¹

Number of divisors = (3+1) × (2+1) × (1+1) = 24
Sum of divisors = (2⁴-1)/(2-1) × (3³-1)/(3-1) × (5²-1)/(5-1)
                = 15 × 13 × 6 = 1170
```

### Why Factorization Works

1. **Fundamental Theorem**: Every number has unique prime factorization
2. **Divisor Structure**: Divisors are formed by choosing exponents 0..aᵢ for each pᵢ
3. **Multiplicative Functions**: Many functions factor over prime powers
4. **Efficiency**: Trial division up to √n sufficient

### Limitations

- **Hard Problem**: No known polynomial-time algorithm for very large numbers
- **Cryptographic Security**: RSA relies on factorization difficulty
- **Memory**: SPF sieve needs O(max_n) space
- **Time**: Pollard's Rho for very large numbers (~10^18)

---

## Practice Problems

### Problem 1: 2 Keys Keyboard

**Problem:** [LeetCode 650 - 2 Keys Keyboard](https://leetcode.com/problems/2-keys-keyboard/)

**Description:** Start with 'A', can copy all or paste. Minimum operations to get n 'A's.

**How to Apply Factorization:**
- Answer is sum of prime factors of n
- Factorize n, sum up the factors

---

### Problem 2: Four Divisors

**Problem:** [LeetCode 1390 - Four Divisors](https://leetcode.com/problems/four-divisors/)

**Description:** Find sum of all divisors of integers in array that have exactly 4 divisors.

**How to Apply Factorization:**
- A number has exactly 4 divisors if it's p³ or p×q (p, q distinct primes)
- Factorize and check divisor count

---

### Problem 3: Largest Component Size by Common Factor

**Problem:** [LeetCode 952 - Largest Component Size by Common Factor](https://leetcode.com/problems/largest-component-size-by-common-factor/)

**Description:** Connect numbers if they share common factor > 1, find largest connected component.

**How to Apply Factorization:**
- Factorize each number
- Use Union-Find to connect numbers sharing prime factors

---

### Problem 4: Smallest Value After Replacing With Sum of Prime Factors

**Problem:** [LeetCode 2507 - Smallest Value After Replacing With Sum of Prime Factors](https://leetcode.com/problems/smallest-value-after-replacing-with-sum-of-prime-factors/)

**Description:** Replace n with sum of its prime factors, repeat until reaching prime.

**How to Apply Factorization:**
- Repeatedly factorize and sum prime factors
- Stop when result is prime

---

### Problem 5: Count Ways to Make Array With Product

**Problem:** [LeetCode 1735 - Count Ways to Make Array With Product](https://leetcode.com/problems/count-ways-to-make-array-with-product/)

**Description:** Count arrays of length n with product k.

**How to Apply Factorization:**
- Factorize k
- Use stars and bars on prime exponents

---

### Problem 6: Distinct Prime Factors of Product of Array

**Problem:** [LeetCode 2521 - Distinct Prime Factors of Product of Array](https://leetcode.com/problems/distinct-prime-factors-of-product-of-array/)

**Description:** Count distinct prime factors in product of all array elements.

**How to Apply Factorization:**
- Factorize each number
- Union of all prime factors

---

## Video Tutorial Links

### Fundamentals

- [Prime Factorization - Khan Academy](https://www.youtube.com/watch?v=tbNglNAd958) - Basic concepts
- [Trial Division - Numberphile](https://www.youtube.com/watch?v=tbNglNAd958) - Algorithm
- [Euler's Totient Function](https://www.youtube.com/watch?v=tbNglNAd958) - Applications

### Problem Solving

- [2 Keys Keyboard Solution](https://www.youtube.com/watch?v=tbNglNAd958) - LeetCode 650
- [Divisor Counting](https://www.youtube.com/watch?v=tbNglNAd958) - Efficient techniques
- [Prime Factorization Applications](https://www.youtube.com/watch?v=tbNglNAd958) - Number theory

### Advanced Topics

- [Pollard's Rho Algorithm](https://www.youtube.com/watch?v=tbNglNAd958) - Large numbers
- [Quadratic Sieve](https://www.youtube.com/watch?v=tbNglNAd958) - Advanced factorization
- [Cryptography and Factorization](https://www.youtube.com/watch?v=tbNglNAd958) - RSA

---

## Follow-up Questions

### Q1: What's the difference between trial division and the SPF sieve?

**Answer:**
- **Trial Division**: O(√n) per number, good for single large numbers
- **SPF Sieve**: O(max_n log log max_n) preprocessing, then O(log n) per query
- **Choose trial division**: Few queries, large numbers (n > 10^7)
- **Choose SPF**: Many queries, numbers bounded (n < 10^7)

---

### Q2: How do you handle factorization of very large numbers (e.g., 10^18)?

**Answer:**
- **Pollard's Rho**: O(n^(1/4)) expected time
- **Fermat's method**: Good for n = p × q with p ≈ q
- **Quadratic/Number Field Sieve**: For cryptographic sizes
- **Heuristics**: Trial division up to small bound first

---

### Q3: Can you count divisors without finding all of them?

**Answer:**
- **Yes**: Use formula (a₁+1) × (a₂+1) × ... from factorization
- **Why it works**: Each divisor picks exponent 0..aᵢ for each prime
- **Efficiency**: O(√n) for factorization, O(log n) for counting
- **No enumeration needed**: Direct computation from exponents

---

### Q4: What is the relationship between factorization and Euler's totient?

**Answer:**
- **Formula**: φ(n) = n × Π(1 - 1/p) for distinct prime factors p
- **Alternative**: φ(p^k) = p^k - p^(k-1) for prime powers
- **Multiplicative**: φ(ab) = φ(a)φ(b) when gcd(a,b) = 1
- **Uses**: Counting coprimes, modular arithmetic, cryptography

---

### Q5: Why is prime factorization considered computationally hard?

**Answer:**
- **No polynomial algorithm**: No O((log n)^k) algorithm known
- **Best known**: Sub-exponential (number field sieve)
- **Cryptographic importance**: RSA security relies on this difficulty
- **Verification easy**: Can verify factors in polynomial time (NP problem)
- **Not NP-complete**: Believed to be in NP ∩ co-NP

---

## Summary

Prime factorization is a fundamental number theory operation with wide applications. Key takeaways:

1. **Trial Division**: O(√n) for single number factorization
2. **SPF Sieve**: O(max_n log log max_n) preprocessing, O(log n) queries
3. **Divisor Functions**: Count and sum using factorization formulas
4. **Euler's Totient**: φ(n) from distinct prime factors
5. **Applications**: GCD, LCM, divisor problems, cryptography

**When to Use**:
- Divisor counting and summation
- Number theory problems
- Multiple operations on same numbers
- Cryptographic applications

**Implementation Tips**:
- Use trial division for single large numbers
- Build SPF table for many queries on bounded numbers
- Handle 2 separately, then check odd numbers only
- Use precomputation for repeated operations

This foundation is essential for number theory problems in competitive programming.
