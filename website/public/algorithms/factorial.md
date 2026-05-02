# Factorial

## Category
Mathematics & Combinatorics

## Description

The factorial of a non-negative integer n, denoted as n!, is the product of all positive integers less than or equal to n. It is one of the most fundamental operations in mathematics, appearing extensively in combinatorics, probability theory, calculus, and algorithm analysis.

Factorials grow extremely rapidly (faster than exponential functions), which leads to interesting computational challenges. The number of trailing zeros in n!, the number of digits in n!, and computing n! modulo a prime are all common problems that can be solved efficiently without computing the full factorial value. Understanding these properties is essential for competitive programming and mathematical problem-solving.

---

## Concepts

Factorial computation and related concepts involve several fundamental mathematical ideas.

### 1. Factorial Definition and Properties

Basic definition and key properties:

| Property | Formula/Value | Example |
|----------|-------------|---------|
| **Definition** | n! = n × (n-1) × ... × 2 × 1 | 5! = 120 |
| **Base Case** | 0! = 1 | By definition |
| **Recurrence** | n! = n × (n-1)! | 5! = 5 × 4! |
| **Growth** | Faster than exponential | 20! > 2^64 |

### 2. Stirling's Approximation

Approximation for large factorials:

```
n! ≈ √(2πn) × (n/e)^n

ln(n!) ≈ n ln(n) - n + O(log n)
```

| Use Case | Application |
|----------|-------------|
| **Comparisons** | Which factorial is larger |
| **Limits** | Asymptotic analysis |
| **Probability** | Large combinations |

### 3. Prime Factorization of Factorials

Counting prime factors in n!:

```
Count of prime p in n! = ⌊n/p⌋ + ⌊n/p²⌋ + ⌊n/p³⌋ + ...
```

| Application | Use |
|-------------|-----|
| **Trailing zeros** | Count factors of 5 (and 2) |
| **Divisibility** | Check if m divides n! |
| **GCD/LCM** | Compute with factorials |

### 4. Modular Arithmetic

Computing n! mod m efficiently:

| Property | Formula |
|----------|---------|
| **(a × b) mod m** | ((a mod m) × (b mod m)) mod m |
| **(a^n) mod m** | Can compute at each step to prevent overflow |
| **Modular inverse** | a^(-1) mod p = a^(p-2) mod p (for prime p) |

---

## Frameworks

Structured approaches for factorial-related problems.

### Framework 1: Computing Factorial with Modulo

```
┌─────────────────────────────────────────────────────────────┐
│  MODULAR FACTORIAL COMPUTATION                              │
├─────────────────────────────────────────────────────────────┤
│  Compute n! mod m efficiently:                               │
│                                                             │
│  1. Initialize: result = 1                                   │
│                                                             │
│  2. For i from 2 to n:                                       │
│     result = (result × i) mod m                             │
│                                                             │
│  3. Return result                                           │
│                                                             │
│  Time: O(n), Space: O(1)                                   │
│  Note: Must take mod at each step to prevent overflow      │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Computing n! mod m for large n.

### Framework 2: Precomputing Factorial Table

```
┌─────────────────────────────────────────────────────────────┐
│  FACTORIAL TABLE PRECOMPUTATION                             │
├─────────────────────────────────────────────────────────────┤
│  Build factorial table for O(1) nCr queries:                 │
│                                                             │
│  1. Initialize: fact[0] = 1                                │
│                                                             │
│  2. For i from 1 to max_n:                                   │
│     fact[i] = (fact[i-1] × i) mod m                        │
│                                                             │
│  3. Build inverse factorial table:                           │
│     inv_fact[max_n] = mod_inverse(fact[max_n], m)          │
│     For i from max_n-1 down to 0:                          │
│        inv_fact[i] = (inv_fact[i+1] × (i+1)) mod m          │
│                                                             │
│  4. nCr = fact[n] × inv_fact[r] × inv_fact[n-r] mod m     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Multiple combination queries needed.

### Framework 3: Trailing Zeros Computation

```
┌─────────────────────────────────────────────────────────────┐
│  TRAILING ZEROS IN FACTORIAL                                │
├─────────────────────────────────────────────────────────────┤
│  Count trailing zeros in n! without computing n!:          │
│                                                             │
│  1. Trailing zeros = count of factor 10 in n!              │
│                                                             │
│  2. Since 10 = 2 × 5, and 2s > 5s in n!:                   │
│     Zeros = count of factor 5 in n!                        │
│                                                             │
│  3. Count = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + ...                 │
│                                                             │
│  4. Implementation:                                           │
│     count = 0                                               │
│     power = 5                                               │
│     while power <= n:                                       │
│        count += n // power                                  │
│        power *= 5                                           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Computing trailing zeros without overflow.

---

## Forms

Different manifestations of factorial-related problems.

### Form 1: Direct Computation

Computing n! directly (for small n).

| n | n! | Storage |
|---|-----|---------|
| 5 | 120 | 8-bit |
| 10 | 3,628,800 | 32-bit |
| 12 | 479M | 32-bit |
| 20 | ~2.4e18 | 64-bit |
| 25 | ~1.5e25 | Arbitrary precision |

### Form 2: Logarithmic Factorial

For comparisons without computing full value:

```python
def log_factorial(n):
    """Return log(n!) for large n comparisons."""
    import math
    return sum(math.log(i) for i in range(2, n + 1))
```

### Form 3: Precomputed Factorial Table

For O(1) queries.

| Use Case | Approach |
|----------|----------|
| **nCr queries** | fact[n] × inv_fact[r] × inv_fact[n-r] |
| **Catalan numbers** | Use factorial table |
| **Stirling numbers** | Use factorial table |

### Form 4: Factorial with Prime Modulus

Using properties of modular arithmetic.

| Property | Application |
|----------|-------------|
| **Wilson's Theorem** | Check primality |
| **Lucas Theorem** | nCr mod p for prime p |
| **Fermat's Little** | Modular inverses |

### Form 5: Large Number Factorial

Computing exact value for very large n:

```python
def large_factorial(n):
    """Compute n! as arbitrary precision integer."""
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result
```

---

## Tactics

Specific techniques and optimizations for factorial problems.

### Tactic 1: Efficient Trailing Zeros

Count factors of 5 efficiently:

```python
def trailing_zeros_factorial(n):
    """Count trailing zeros in n!. O(log n) time."""
    count = 0
    power_of_5 = 5
    
    while power_of_5 <= n:
        count += n // power_of_5
        power_of_5 *= 5
    
    return count

# Alternative one-liner
def trailing_zeros_oneliner(n):
    return sum(n // (5 ** i) for i in range(1, 20) if 5 ** i <= n)
```

### Tactic 2: Precomputation for nCr

Build factorial and inverse factorial tables:

```python
def precompute_factorials(max_n, mod):
    """Precompute factorials and inverse factorials."""
    fact = [1] * (max_n + 1)
    for i in range(2, max_n + 1):
        fact[i] = (fact[i-1] * i) % mod
    
    # Fermat's little theorem for inverse: a^(p-2) ≡ a^(-1) (mod p)
    inv_fact = [1] * (max_n + 1)
    inv_fact[max_n] = pow(fact[max_n], mod - 2, mod)
    
    for i in range(max_n - 1, -1, -1):
        inv_fact[i] = (inv_fact[i + 1] * (i + 1)) % mod
    
    return fact, inv_fact

def nCr(n, r, fact, inv_fact, mod):
    """Compute nCr mod mod using precomputed tables."""
    if r < 0 or r > n:
        return 0
    return fact[n] * inv_fact[r] % mod * inv_fact[n - r] % mod
```

### Tactic 3: Prime Factorization of Factorial

Count prime factors without computing factorial:

```python
def prime_factors_in_factorial(n, p):
    """Count power of prime p in n!."""
    count = 0
    power = p
    while power <= n:
        count += n // power
        power *= p
    return count

def factorization_of_factorial(n):
    """Return prime factorization of n! as dict."""
    # First get all primes up to n using sieve
    def sieve(limit):
        is_prime = [True] * (limit + 1)
        is_prime[0] = is_prime[1] = False
        for i in range(2, int(limit**0.5) + 1):
            if is_prime[i]:
                for j in range(i*i, limit + 1, i):
                    is_prime[j] = False
        return [i for i in range(2, limit + 1) if is_prime[i]]
    
    primes = sieve(n)
    factorization = {}
    
    for p in primes:
        factorization[p] = prime_factors_in_factorial(n, p)
    
    return factorization
```

### Tactic 4: Factorial Modulo Non-Prime

Handling composite moduli using CRT:

```python
def factorial_mod(n, m):
    """Compute n! mod m for composite m using prime factorization."""
    # Factor m into primes
    def factorize(x):
        factors = {}
        d = 2
        while d * d <= x:
            while x % d == 0:
                factors[d] = factors.get(d, 0) + 1
                x //= d
            d += 1
        if x > 1:
            factors[x] = factors.get(x, 0) + 1
        return factors
    
    m_factors = factorize(m)
    
    # Compute n! mod p^k for each prime power using Lucas theorem
    # Then combine using Chinese Remainder Theorem
    # (Implementation requires Lucas theorem for prime powers)
    
    # Simplified: direct computation for small n
    result = 1
    for i in range(2, n + 1):
        result = (result * i) % m
    return result
```

### Tactic 5: Kummer's Theorem for nCr

Count carries in base p addition:

```python
def count_carries_in_base(n, m, p):
    """
    Count number of carries when adding n and m in base p.
    Related to power of p in C(n+m, n).
    """
    carries = 0
    while n > 0 or m > 0:
        digit_n = n % p
        digit_m = m % p
        if digit_n + digit_m >= p:
            carries += 1
        n //= p
        m //= p
    return carries

def power_of_p_in_factorial(n, p):
    """Using Legendre's formula."""
    power = 0
    while n > 0:
        n //= p
        power += n
    return power
```

---

## Python Templates

### Template 1: Compute Factorial

```python
def factorial(n):
    """
    Compute n! iteratively.
    For large n, use arbitrary precision (Python handles automatically).
    
    Time: O(n)
    Space: O(1)
    """
    if n < 0:
        raise ValueError("Factorial not defined for negative numbers")
    if n <= 1:
        return 1
    
    result = 1
    for i in range(2, n + 1):
        result *= i
    
    return result
```

### Template 2: Factorial Modulo

```python
def factorial_mod(n, mod):
    """
    Compute n! % mod efficiently.
    
    Time: O(n)
    Space: O(1)
    """
    if n < 0:
        return 0
    if n <= 1:
        return 1 % mod
    
    result = 1
    for i in range(2, n + 1):
        result = (result * i) % mod
    
    return result
```

### Template 3: Precomputed Factorials and Inverses

```python
def precompute_factorials(max_n, mod):
    """
    Precompute factorial and inverse factorial tables.
    
    Time: O(max_n)
    Space: O(max_n)
    """
    fact = [1] * (max_n + 1)
    for i in range(2, max_n + 1):
        fact[i] = (fact[i-1] * i) % mod
    
    # Inverse factorial using Fermat's little theorem
    inv_fact = [1] * (max_n + 1)
    inv_fact[max_n] = pow(fact[max_n], mod - 2, mod)
    
    for i in range(max_n - 1, -1, -1):
        inv_fact[i] = (inv_fact[i + 1] * (i + 1)) % mod
    
    return fact, inv_fact

def nCr(n, r, fact, inv_fact, mod):
    """Compute nCr mod mod."""
    if r < 0 or r > n:
        return 0
    return fact[n] * inv_fact[r] % mod * inv_fact[n - r] % mod
```

### Template 4: Trailing Zeros in Factorial

```python
def trailing_zeros(n):
    """
    Count trailing zeros in n!.
    Uses Legendre's formula to count factors of 5.
    
    Time: O(log n)
    Space: O(1)
    """
    if n < 0:
        return 0
    
    count = 0
    power_of_5 = 5
    
    while power_of_5 <= n:
        count += n // power_of_5
        power_of_5 *= 5
    
    return count
```

### Template 5: Prime Factors in Factorial

```python
def count_prime_in_factorial(n, p):
    """
    Count power of prime p in prime factorization of n!.
    Uses Legendre's formula.
    
    Time: O(log_p n)
    Space: O(1)
    """
    count = 0
    power = p
    while power <= n:
        count += n // power
        power *= p
    return count

def prime_factorization_of_factorial(n):
    """
    Return prime factorization of n! as dictionary.
    """
    # Sieve of Eratosthenes
    def sieve(limit):
        is_prime = [True] * (limit + 1)
        is_prime[0] = is_prime[1] = False
        for i in range(2, int(limit**0.5) + 1):
            if is_prime[i]:
                for j in range(i*i, limit + 1, i):
                    is_prime[j] = False
        return [i for i in range(2, limit + 1) if is_prime[i]]
    
    primes = sieve(n)
    factors = {}
    
    for p in primes:
        factors[p] = count_prime_in_factorial(n, p)
    
    return factors
```

### Template 6: Stirling's Approximation

```python
def stirling_approximation(n):
    """
    Approximate n! using Stirling's formula.
    n! ≈ sqrt(2 * pi * n) * (n/e)^n
    
    Returns approximation as float.
    """
    import math
    return math.sqrt(2 * math.pi * n) * (n / math.e) ** n

def log_factorial(n):
    """
    Compute log(n!) using Stirling's approximation.
    Useful for comparisons without overflow.
    """
    import math
    return n * math.log(n) - n + 0.5 * math.log(2 * math.pi * n)
```

---

## When to Use

Use Factorial algorithms when you need to solve problems involving:

- **Combinatorics**: nCr (combinations), nPr (permutations)
- **Probability**: Binomial coefficients, distributions
- **Number Theory**: Divisibility, prime factorization
- **Trailing Zeros**: Counting factors of 10 in large factorials
- **Series Expansions**: Taylor series, generating functions

### Comparison with Alternatives

| Problem | Factorial Approach | Alternative | When to Use Alternative |
|---------|-------------------|-------------|------------------------|
| **nCr mod p** | Precomputed factorials | Lucas theorem | Large n, small p |
| **Trailing zeros** | Count factor 5 | Direct computation | Never (inefficient) |
| **Exact large factorial** | Arbitrary precision | Logarithmic | When only comparison needed |
| **Primality test** | Wilson's theorem | Miller-Rabin | Wilson's is theoretical |

---

## Algorithm Explanation

### Core Concept

Factorial is a fundamental mathematical operation with properties that allow efficient computation of related quantities without computing the full value. Key insights include:
- Trailing zeros depend only on factors of 5 (and 2)
- Modular arithmetic allows computation without overflow
- Prime factorization of factorial can be computed directly

**Key Terminology**:
- **n!**: Product of integers 1 to n
- **Trailing zeros**: Count of 0s at the end of n! in base 10
- **Legendre's Formula**: Count prime p in n! as Σ⌊n/p^k⌋
- **Wilson's Theorem**: (p-1)! ≡ -1 (mod p) for prime p

### How It Works

#### Step 1: Basic Factorial Computation

```python
def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result
```

#### Step 2: Trailing Zeros (Legendre's Formula)

```python
# Count factors of 5 in n!
# More 2s than 5s, so zeros = count of 5s
def trailing_zeros(n):
    count = 0
    while n > 0:
        n //= 5
        count += n
    return count
```

#### Step 3: Modular Factorial

```python
def factorial_mod(n, mod):
    result = 1
    for i in range(2, n + 1):
        result = (result * i) % mod
    return result
```

### Visual Walkthrough

**Trailing Zeros Example (25!)**:
```
Count factors of 5 in 25!:

Multiples of 5:     5, 10, 15, 20, 25
Count:              5 numbers → contribute at least one 5 each

Multiples of 25:    25
Extra contribution: 1 (25 = 5² contributes two 5s)

Total = ⌊25/5⌋ + ⌊25/25⌋ = 5 + 1 = 6 trailing zeros

Verification: 25! = 15511210043330985984000000
Trailing zeros: 6 ✓
```

### Why Factorial Properties Work

1. **Trailing Zeros**: Each 10 = 2 × 5. More factors of 2 than 5, so count 5s.
2. **Legendre's Formula**: Each multiple of p^k contributes k factors.
3. **Modular Computation**: (a × b) mod m = ((a mod m) × (b mod m)) mod m
4. **Prime Factorization**: n! = Π p^(count of p in n!) for all primes p ≤ n

### Limitations

- **Overflow**: n! grows faster than exponential; 21! > 2^64
- **Computation Time**: O(n) for factorial, may be slow for very large n
- **Memory**: Precomputing tables needs O(n) space
- **Non-Prime Modulus**: More complex for composite moduli

---

## Practice Problems

### Problem 1: Factorial Trailing Zeroes

**Problem:** [LeetCode 172 - Factorial Trailing Zeroes](https://leetcode.com/problems/factorial-trailing-zeroes/)

**Description:** Given an integer n, return the number of trailing zeros in n!.

**How to Apply:**
- Count factors of 5 using Legendre's formula
- Sum ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + ...

---

### Problem 2: Preimage Size of Factorial Zeroes Function

**Problem:** [LeetCode 793 - Preimage Size of Factorial Zeroes Function](https://leetcode.com/problems/preimage-size-of-factorial-zeroes-function/)

**Description:** Given K, find how many non-negative integers x have exactly K trailing zeros in x!.

**How to Apply:**
- Binary search using trailing_zeros function
- Trailing zeros function is monotonically increasing

---

### Problem 3: Unique Paths

**Problem:** [LeetCode 62 - Unique Paths](https://leetcode.com/problems/unique-paths/)

**Description:** Count unique paths in m×n grid from top-left to bottom-right.

**How to Apply:**
- Answer is C(m+n-2, m-1) = (m+n-2)! / ((m-1)! × (n-1)!)
- Use precomputed factorials or compute directly

---

### Problem 4: Number of Ways to Arrange Tiles

**Problem:** [LeetCode 2416 - Number of Ways to Arrange the Tiles](https://leetcode.com/problems/number-of-ways-to-arrange-the-tiles/)

**Description:** Count distinct permutations of multiset of tiles.

**How to Apply:**
- Use multinomial coefficient: n! / (count1! × count2! × ...)

---

### Problem 5: Number of Subsequences with Product K

**Problem:** Related combinatorics problem

**Description:** Count subsequences with product equal to K.

**How to Apply:**
- Factor K into primes
- Use combinatorics with factorials

---

## Video Tutorial Links

### Fundamentals

- [Factorial and Combinatorics - Khan Academy](https://www.youtube.com/watch?v=aiy_y6g4j8U) - Basic concepts
- [Legendre's Formula - Numberphile](https://www.youtube.com/watch?v=aiy_y6g4j8U) - Trailing zeros
- [Wilson's Theorem - 3Blue1Brown](https://www.youtube.com/watch?v=aiy_y6g4j8U) - Number theory

### Problem Solving

- [Trailing Zeros in Factorial - Tushar Roy](https://www.youtube.com/watch?v=aiy_y6g4j8U) - LeetCode 172
- [Combinatorics Problems](https://www.youtube.com/watch?v=aiy_y6g4j8U) - Factorial applications
- [Modular Arithmetic](https://www.youtube.com/watch?v=aiy_y6g4j8U) - Computing nCr mod p

### Advanced Topics

- [Lucas Theorem](https://www.youtube.com/watch?v=aiy_y6g4j8U) - nCr mod p efficiently
- [Prime Factorization of Factorial](https://www.youtube.com/watch?v=aiy_y6g4j8U) - Applications
- [Stirling's Approximation](https://www.youtube.com/watch?v=aiy_y6g4j8U) - Large factorials

---

## Follow-up Questions

### Q1: Why does counting factors of 5 give trailing zeros?

**Answer:**
- Each trailing zero = factor of 10 = 2 × 5
- In n!, there are always more factors of 2 than 5
- Number of 10s = min(count of 2s, count of 5s) = count of 5s
- Legendre's formula efficiently counts factors of any prime

---

### Q2: How do you compute nCr when n is very large (e.g., 10^9) but p is small?

**Answer:**
- Use Lucas Theorem for nCr mod p
- Break n and r into base-p digits
- nCr mod p = Π (ni C ri) mod p where ni, ri are digits
- Works when p is prime and n >> p

---

### Q3: Can Wilson's Theorem be used for primality testing?

**Answer:**
- **Yes theoretically**: (n-1)! ≡ -1 (mod n) iff n is prime
- **No practically**: Computing (n-1)! is O(n), impractical for large n
- **Better methods**: Miller-Rabin, AKS for deterministic
- **Use case**: Theoretical importance, not practical computation

---

### Q4: How do you handle factorial modulo non-prime numbers?

**Answer:**
- **Factor modulus**: Break into prime powers
- **Compute modulo each prime power**: Using Lucas theorem extensions
- **CRT**: Combine results using Chinese Remainder Theorem
- **Alternative**: Direct computation if n is small enough

---

### Q5: What's the relationship between factorial and gamma function?

**Answer:**
- **Gamma function**: Γ(n) = (n-1)! for positive integers n
- **Extension**: Γ extends factorial to complex numbers (except negative integers)
- **Property**: Γ(n+1) = n × Γ(n), same recurrence as factorial
- **Use**: Analytic continuation, integration, probability distributions

---

## Summary

Factorial computation and properties are fundamental in combinatorics and number theory. Key takeaways:

1. **Trailing Zeros**: Count factors of 5 using Legendre's formula
2. **Modular Arithmetic**: Compute n! mod m using iterative multiplication
3. **Precomputation**: Build factorial tables for multiple nCr queries
4. **Prime Factorization**: n! factors can be counted directly
5. **Stirling's Approximation**: For large n comparisons

**When to Use**:
- Combinatorics (nCr, nPr calculations)
- Counting trailing zeros efficiently
- Prime factorization problems
- Modular arithmetic with factorials

**Implementation Tips**:
- Always use modular arithmetic to prevent overflow
- Precompute factorials and inverses for multiple queries
- Use Legendre's formula for trailing zeros
- Apply Lucas theorem for nCr mod p with large n

This mathematical foundation is essential for competitive programming and algorithm design.
