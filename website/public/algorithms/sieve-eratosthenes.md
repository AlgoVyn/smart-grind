# Sieve of Eratosthenes

## Category
Math & Number Theory

## Description

The Sieve of Eratosthenes is an ancient and efficient algorithm for finding all prime numbers up to a given limit n. Dating back to ancient Greece (circa 240 BC), it remains one of the most efficient algorithms for prime generation and is fundamental to number theory problems in competitive programming.

The algorithm works by iteratively marking the multiples of each prime starting from 2. The key insight is that every composite number has at least one prime factor less than or equal to its square root, allowing us to eliminate all non-prime numbers efficiently with a time complexity of O(n log log n).

---

## Concepts

The Sieve of Eratosthenes is built on several fundamental concepts that make it powerful for prime generation and number theory applications.

### 1. Prime and Composite Numbers

| Type | Definition | Example |
|------|------------|---------|
| **Prime** | Number with exactly two divisors: 1 and itself | 2, 3, 5, 7, 11 |
| **Composite** | Number with more than two divisors | 4, 6, 8, 9, 10 |
| **Neither** | 0 and 1 are neither prime nor composite | 0, 1 |

### 2. Sieve Principle

Instead of checking each number individually for primality (O(n√n)), the sieve marks multiples of known primes:

```
For each prime p found:
    Mark all multiples of p (2p, 3p, 4p, ...) as composite
```

### 3. Optimization: Start from p²

When marking multiples of prime p, we can start from p² instead of 2p:

- Multiples 2p, 3p, ..., (p-1)p were already marked by smaller primes
- Starting from p² avoids redundant work
- This is crucial for achieving O(n log log n) complexity

### 4. Square Root Bound

We only need to sieve up to √n:

- Any composite number c ≤ n has a prime factor p ≤ √c ≤ √n
- After processing all primes up to √n, all composites are marked
- Remaining unmarked numbers are primes

---

## Frameworks

Structured approaches for implementing and using the Sieve of Eratosthenes.

### Framework 1: Basic Sieve Template

```
┌─────────────────────────────────────────────────────┐
│  BASIC SIEVE OF ERATOSTHENES FRAMEWORK                │
├─────────────────────────────────────────────────────┤
│  1. Create boolean array is_prime[0...n], init True  │
│  2. Mark is_prime[0] = is_prime[1] = False           │
│  3. For p from 2 to √n:                              │
│     a. If is_prime[p] is True:                       │
│        - Mark all multiples from p² to n as False    │
│  4. Collect all indices where is_prime[i] is True   │
│  5. Return list of primes                            │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding all primes up to n, basic prime generation.

### Framework 2: Optimized Sieve (Odd Numbers Only)

```
┌─────────────────────────────────────────────────────┐
│  OPTIMIZED SIEVE FRAMEWORK (Odd Numbers Only)         │
├─────────────────────────────────────────────────────┤
│  1. Handle n < 2: return []                          │
│  2. If n >= 2: start with [2]                       │
│  3. Create boolean array for odd numbers only     │
│     - Index i represents number 2i + 3              │
│  4. For i from 0 to (√n - 3) / 2:                  │
│     a. If is_prime[i] is True:                     │
│        - p = 2i + 3                                 │
│        - Mark multiples starting from (p²-3)/2      │
│  5. Convert indices back to numbers and return      │
└─────────────────────────────────────────────────────┘
```

**When to use**: Memory-constrained environments, ~2x speedup.

### Framework 3: SPF (Smallest Prime Factor) Sieve

```
┌─────────────────────────────────────────────────────┐
│  SMALLEST PRIME FACTOR (SPF) SIEVE FRAMEWORK         │
├─────────────────────────────────────────────────────┤
│  1. Initialize spf[i] = i for all i (each number    │
│     is its own smallest prime factor initially)    │
│  2. For i from 2 to √n:                              │
│     a. If spf[i] == i (i is prime):                 │
│        - For j from i² to n, step i:               │
│          - If spf[j] == j: set spf[j] = i          │
│  3. Return spf array                                │
│  4. Use spf for O(log n) factorization              │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you need prime factorization queries after sieve.

---

## Forms

Different manifestations and applications of the sieve pattern.

### Form 1: Prime Generation Sieve

Standard sieve for generating all primes up to n.

| Variant | Time | Space | Use Case |
|---------|------|-------|----------|
| Basic | O(n log log n) | O(n) | General purpose |
| Odd-only | O(n log log n) | O(n/2) | Memory optimization |
| Segmented | O(n log log n) | O(√n) | Very large n |

### Form 2: Prime Counting Sieve

Count primes less than n without storing all primes.

```python
def count_primes(n):
    if n <= 2: return 0
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    for p in range(2, int(n**0.5) + 1):
        if is_prime[p]:
            for i in range(p*p, n, p):
                is_prime[i] = False
    return sum(is_prime)
```

### Form 3: Factorization Sieve (SPF Array)

Precompute smallest prime factor for fast factorization.

```python
# After SPF sieve, factorize in O(log n)
def factorize(x, spf):
    factors = []
    while x > 1:
        factors.append(spf[x])
        x //= spf[x]
    return factors
```

### Form 4: Segmented Sieve

For finding primes in a range [low, high] where high is very large.

```
1. Generate base primes up to √high using standard sieve
2. Create boolean array for range [low, high]
3. For each base prime p:
   - Find first multiple in range
   - Mark all multiples in range
4. Return unmarked numbers in range
```

### Form 5: Bitwise Sieve

Memory-optimized version using bits instead of bytes.

| Standard | Bitwise | Savings |
|----------|---------|---------|
| 1 byte per number | 1 bit per number | 8x memory reduction |
| 100MB for n=10⁸ | 12.5MB for n=10⁸ | Significant for large n |

---

## Tactics

Specific techniques and optimizations for sieve implementation.

### Tactic 1: Efficient Composite Marking

Mark multiples starting from p², not 2p:

```python
for p in range(2, int(n**0.5) + 1):
    if is_prime[p]:
        # Start from p*p, not 2*p
        for multiple in range(p * p, n + 1, p):
            is_prime[multiple] = False
```

**Why this works**: Smaller multiples (2p, 3p, ..., (p-1)p) have smaller prime factors and were already marked.

### Tactic 2: Sieve Only Odd Numbers

Skip all even numbers except 2:

```python
def sieve_odd_only(n):
    if n < 2: return []
    if n == 2: return [2]
    
    # Only track odd numbers: index i represents 2i + 3
    size = (n - 3) // 2 + 1
    is_prime = [True] * size
    
    limit = int(n**0.5)
    for i in range((limit - 3) // 2 + 1):
        if is_prime[i]:
            p = 2 * i + 3
            # Start marking from p²
            start = (p * p - 3) // 2
            for j in range(start, size, p):
                is_prime[j] = False
    
    primes = [2]
    for i in range(size):
        if is_prime[i]:
            primes.append(2 * i + 3)
    return primes
```

### Tactic 3: Linear Sieve for O(n)

When you need optimal O(n) time and smallest prime factors:

```python
def linear_sieve(n):
    """O(n) sieve that also computes smallest prime factors."""
    spf = [0] * (n + 1)
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    primes = []
    
    for i in range(2, n + 1):
        if is_prime[i]:
            primes.append(i)
            spf[i] = i
        
        for p in primes:
            if i * p > n:
                break
            is_prime[i * p] = False
            spf[i * p] = p
            if i % p == 0:  # Critical optimization
                break
    
    return primes, spf
```

### Tactic 4: Segmented Sieve for Large Ranges

When n > 10⁷ and memory is constrained:

```python
def segmented_sieve(low, high):
    """Find primes in [low, high] using O(√high) memory."""
    import math
    
    if low < 2: low = 2
    limit = int(math.sqrt(high)) + 1
    base_primes = sieve(limit)
    
    size = high - low + 1
    is_prime = [True] * size
    
    for p in base_primes:
        # Find first multiple of p in [low, high]
        start = max(p * p, ((low + p - 1) // p) * p)
        for j in range(start, high + 1, p):
            is_prime[j - low] = False
    
    return [i for i in range(low, high + 1) if is_prime[i - low]]
```

### Tactic 5: Precompute Prime Counts with Prefix Sum

For O(1) prime counting queries:

```python
def sieve_with_prefix(n):
    """Returns primes and prefix count array for O(1) queries."""
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for p in range(2, int(n**0.5) + 1):
        if is_prime[p]:
            for i in range(p * p, n + 1, p):
                is_prime[i] = False
    
    # Prefix sum: prime_prefix[i] = number of primes ≤ i
    prime_prefix = [0] * (n + 1)
    for i in range(1, n + 1):
        prime_prefix[i] = prime_prefix[i-1] + (1 if is_prime[i] else 0)
    
    return [i for i in range(2, n+1) if is_prime[i]], prime_prefix

# O(1) query: count primes in [l, r]
def count_primes_range(l, r, prime_prefix):
    return prime_prefix[r] - prime_prefix[l-1]
```

---

## Python Templates

### Template 1: Basic Sieve of Eratosthenes

```python
def sieve_basic(n: int) -> list[int]:
    """
    Template for basic Sieve of Eratosthenes.
    Returns list of all primes up to n.
    
    Time: O(n log log n)
    Space: O(n)
    """
    if n < 2:
        return []
    
    # Initialize: assume all numbers are prime
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    # Sieve: only need to check up to sqrt(n)
    for p in range(2, int(n ** 0.5) + 1):
        if is_prime[p]:
            # Mark multiples starting from p*p
            for multiple in range(p * p, n + 1, p):
                is_prime[multiple] = False
    
    # Collect primes
    return [i for i in range(2, n + 1) if is_prime[i]]
```

### Template 2: Prime Counting (LeetCode 204)

```python
def count_primes(n: int) -> int:
    """
    Count primes strictly less than n.
    LeetCode 204 solution template.
    
    Time: O(n log log n)
    Space: O(n)
    """
    if n <= 2:
        return 0
    
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    
    for p in range(2, int(n ** 0.5) + 1):
        if is_prime[p]:
            for multiple in range(p * p, n, p):
                is_prime[multiple] = False
    
    return sum(is_prime)
```

### Template 3: Smallest Prime Factor (SPF) Sieve

```python
def sieve_spf(n: int) -> list[int]:
    """
    Compute smallest prime factor for each number up to n.
    Enables O(log n) factorization.
    
    Time: O(n log log n)
    Space: O(n)
    """
    spf = [0] * (n + 1)
    
    # Initialize: each number is its own SPF
    for i in range(n + 1):
        spf[i] = i
    
    # Sieve: update SPF for composites
    for i in range(2, int(n ** 0.5) + 1):
        if spf[i] == i:  # i is prime
            for j in range(i * i, n + 1, i):
                if spf[j] == j:  # Not yet assigned
                    spf[j] = i
    
    return spf


def factorize(x: int, spf: list[int]) -> list[int]:
    """Factorize x using SPF array. Time: O(log x)"""
    factors = []
    while x > 1:
        factors.append(spf[x])
        x //= spf[x]
    return factors


def factorize_with_exponents(x: int, spf: list[int]) -> dict[int, int]:
    """Factorize x and return {prime: exponent}. Time: O(log x)"""
    factors = {}
    while x > 1:
        p = spf[x]
        factors[p] = factors.get(p, 0) + 1
        x //= p
    return factors
```

### Template 4: Optimized Sieve (Odd Numbers Only)

```python
def sieve_optimized(n: int) -> list[int]:
    """
    Optimized sieve using only odd numbers.
    ~2x faster and ~2x less memory than basic sieve.
    
    Time: O(n log log n)
    Space: O(n/2)
    """
    if n < 2:
        return []
    if n == 2:
        return [2]
    
    # Only track odd numbers >= 3
    # Index i represents number 2*i + 3
    size = (n - 3) // 2 + 1
    is_prime = [True] * size
    
    limit = int(n ** 0.5)
    for i in range((limit - 3) // 2 + 1):
        if is_prime[i]:
            p = 2 * i + 3
            # Start marking from p*p
            # Position of p*p in odd number array
            start = (p * p - 3) // 2
            for j in range(start, size, p):
                is_prime[j] = False
    
    # Collect primes
    primes = [2]
    for i in range(size):
        if is_prime[i]:
            primes.append(2 * i + 3)
    
    return primes
```

### Template 5: Segmented Sieve for Large Ranges

```python
def segmented_sieve(low: int, high: int) -> list[int]:
    """
    Find primes in range [low, high] using O(√high) memory.
    Useful when high > 10^7 or when memory is constrained.
    
    Time: O((high-low+1) log log high + √high log log √high)
    Space: O(√high)
    """
    import math
    
    if low < 2:
        low = 2
    
    # Generate base primes up to √high
    limit = int(math.sqrt(high)) + 1
    base_primes = sieve_basic(limit)
    
    # Create segment
    size = high - low + 1
    is_prime = [True] * size
    
    # Mark composites in segment
    for p in base_primes:
        # Find first multiple of p in [low, high]
        start = max(p * p, ((low + p - 1) // p) * p)
        for j in range(start, high + 1, p):
            is_prime[j - low] = False
    
    return [low + i for i in range(size) if is_prime[i]]
```

### Template 6: Prime Prefix Sum for Range Queries

```python
def sieve_with_prefix(n: int) -> tuple[list[int], list[int]]:
    """
    Build sieve and prefix sum array for O(1) prime counting queries.
    
    Returns:
        - primes: List of all primes up to n
        - prefix: prefix[i] = count of primes ≤ i
    
    Time: O(n log log n)
    Space: O(n)
    """
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for p in range(2, int(n ** 0.5) + 1):
        if is_prime[p]:
            for i in range(p * p, n + 1, p):
                is_prime[i] = False
    
    # Build prefix sum
    prefix = [0] * (n + 1)
    for i in range(1, n + 1):
        prefix[i] = prefix[i - 1] + (1 if is_prime[i] else 0)
    
    primes = [i for i in range(2, n + 1) if is_prime[i]]
    return primes, prefix


def count_primes_in_range(l: int, r: int, prefix: list[int]) -> int:
    """Count primes in [l, r] in O(1) time."""
    if l > r:
        return 0
    if l <= 0:
        return prefix[r]
    return prefix[r] - prefix[l - 1]
```

### Template 7: Sieve for Multiplicative Functions

```python
def sieve_multiplicative(n: int) -> dict:
    """
    Compute multiplicative functions using sieve.
    Returns phi (Euler's totient), mu (Möbius), d (divisor count).
    
    Time: O(n log log n)
    Space: O(n)
    """
    spf = list(range(n + 1))
    
    # Sieve for SPF
    for i in range(2, int(n ** 0.5) + 1):
        if spf[i] == i:
            for j in range(i * i, n + 1, i):
                if spf[j] == j:
                    spf[j] = i
    
    # Initialize functions
    phi = list(range(n + 1))  # Euler's totient
    mu = [1] * (n + 1)        # Möbius function
    is_square_free = [True] * (n + 1)
    
    for i in range(2, n + 1):
        if spf[i] == i:  # i is prime
            # Update multiples of prime i
            for j in range(i, n + 1, i):
                phi[j] -= phi[j] // i
                mu[j] *= -1
            
            # Mark multiples of i² as not square-free
            i_sq = i * i
            for j in range(i_sq, n + 1, i_sq):
                is_square_free[j] = False
    
    for i in range(n + 1):
        if not is_square_free[i]:
            mu[i] = 0
    
    return {'phi': phi, 'mu': mu, 'spf': spf}
```

---

## When to Use

Use the Sieve of Eratosthenes when you need to solve problems involving:

- **Prime Number Generation**: Finding all primes up to n
- **Prime Counting**: Counting primes less than n
- **Factorization Preprocessing**: Precomputing smallest prime factors
- **Multiplicative Functions**: Computing Euler's totient, Möbius function
- **Range Prime Queries**: Multiple queries about primes in ranges

### Comparison with Alternatives

| Algorithm | Time Complexity | Space | Best Use Case |
|-----------|----------------|-------|---------------|
| **Sieve of Eratosthenes** | O(n log log n) | O(n) | Finding all primes up to n |
| **Linear Sieve** | O(n) | O(n) | Need SPF or O(n) guarantee |
| **Segmented Sieve** | O(n log log n) | O(√n) | Large ranges, memory constraints |
| **Naive Prime Check** | O(√n) per number | O(1) | Single/few prime checks |
| **Miller-Rabin** | O(k log³n) | O(1) | Very large numbers (n > 10¹⁸) |

### When to Choose Sieve vs Alternatives

- **Choose Standard Sieve** when:
  - You need all primes up to n (n ≤ 10⁷ typically)
  - Memory is not a constraint (O(n) space)
  - You need to answer multiple prime-related queries

- **Choose Linear Sieve** when:
  - You need smallest prime factors
  - O(n) time is required
  - Computing multiplicative functions

- **Choose Segmented Sieve** when:
  - n is very large (n > 10⁸)
  - Memory is limited
  - You only need primes in a specific range

- **Choose Naive Check** when:
  - You only need a few prime numbers
  - n is very small
  - Memory is extremely constrained

---

## Algorithm Explanation

### Core Concept

The key insight behind the Sieve of Eratosthenes is that **every composite number has at least one prime factor less than or equal to its square root**. By iteratively marking multiples of each prime as composite, we can eliminate all non-prime numbers efficiently.

### How It Works

#### Step-by-Step Process:

1. **Initialization**: Create a boolean array of size n+1, initially assuming all numbers are prime (True)

2. **Mark 0 and 1**: These are not prime by definition

3. **Iterate from 2 to √n**:
   - For each prime p found, mark all multiples of p (starting from p²) as composite
   - We start from p² because smaller multiples would have been already marked by smaller primes

4. **Collection**: All indices still marked as True are prime numbers

### Visual Representation

For n = 30:

```
Initial:     [F, F, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
              0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30

After p=2:   [F, F, T, T, F, T, F, T, F, T, F, T, F, T, F, T, F, T, F, T, F, T, F, T, F, T, F, T, F, T]
              Mark 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30

After p=3:   [F, F, T, T, F, T, F, T, F, F, F, T, F, T, F, F, F, T, F, T, F, F, F, T, F, T, F, F, F, T]
              Mark 9, 15, 21, 27

After p=5:   [F, F, T, T, F, T, F, T, F, F, F, T, F, T, F, F, F, T, F, T, F, F, F, T, F, F, F, F, F, F]
              Mark 25

Result:      Primes at indices: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29
```

### Why Start from p²?

Consider p = 5:
- Multiples: 5×2=10, 5×3=15, 5×4=20, 5×5=25, ...
- 10, 15, 20 were already marked by p=2 and p=3
- Only 25 and beyond need to be marked
- Starting from p² avoids redundant work

### Mathematical Foundation

- **Theorem**: If n is composite, it has a prime factor p ≤ √n
- **Proof**: If n = a × b with a ≤ b, then a² ≤ a × b = n, so a ≤ √n
- **Implication**: We only need to process primes up to √n to eliminate all composites

### Why It Works

- **No redundant calculations**: Each composite is marked only by its smallest prime factor
- **Efficient**: Total operations are O(n log log n)
- **Simple**: Basic implementation is straightforward

### Limitations

- **Memory constraint**: Requires O(n) space
- **Range limitation**: For n > 10⁸, memory becomes problematic
- **Single shot**: Preprocesses entire range; not ideal for sparse queries
- **Not for large single numbers**: For testing primality of a single large number (n > 10¹⁸), use Miller-Rabin instead

---

## Practice Problems

### Problem 1: Count Primes

**Problem:** [LeetCode 204 - Count Primes](https://leetcode.com/problems/count-primes/)

**Description:** Given an integer n, return the number of prime numbers that are strictly less than n.

**How to Apply Sieve:**
- Use the Sieve of Eratosthenes to mark all primes up to n-1
- Count the remaining true values in the boolean array
- Time: O(n log log n), Space: O(n)

---

### Problem 2: Prime Arrangements

**Problem:** [LeetCode 1175 - Prime Arrangements](https://leetcode.com/problems/prime-arrangements/)

**Description:** Return the number of ways to arrange the first n numbers such that all primes are in odd positions (1-indexed).

**How to Apply Sieve:**
- First, count primes up to n using sieve
- Calculate factorial for prime and non-prime counts
- Result = (prime_count)! × (n - prime_count)! mod 10⁹+7

---

### Problem 3: Ugly Number II

**Problem:** [LeetCode 264 - Ugly Number II](https://leetcode.com/problems/ugly-number-ii/)

**Description:** An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5. Given n, return the nth ugly number.

**How to Apply Sieve:**
- Sieve is not directly used, but understanding of prime factors helps
- Alternatively, can use SPF sieve to check if a number has only 2, 3, 5 as factors

---

### Problem 4: Sum of Four Divisors

**Problem:** [LeetCode 1390 - Sum of Four Divisors](https://leetcode.com/problems/sum-of-four-divisors/)

**Description:** Given an integer array nums, return the sum of divisors of the integers in nums that have exactly four divisors.

**How to Apply Sieve:**
- Precompute SPF up to max(nums)
- For each number, factorize using SPF and check if it has exactly 4 divisors
- A number has exactly 4 divisors if it's either p³ or p×q (distinct primes)

---

### Problem 5: Distinct Prime Factors of Product of Array

**Problem:** [LeetCode 2521 - Distinct Prime Factors of Product of Array](https://leetcode.com/problems/distinct-prime-factors-of-product-of-array/)

**Description:** You are given an array of positive integers nums. Return the number of distinct prime factors in the product of the elements of nums.

**How to Apply Sieve:**
- Precompute SPF up to max(nums)
- For each number, get unique prime factors using SPF
- Use a set to track distinct primes across all numbers

---

## Video Tutorial Links

### Fundamentals

- [Sieve of Eratosthenes - Introduction (Take U Forward)](https://www.youtube.com/watch?v=6-eGg7u9Sgc) - Comprehensive introduction to sieve
- [Prime Number Sieve Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=jaSux1q2z9s) - Detailed explanation with visualizations
- [Count Primes - LeetCode Solution (NeetCode)](https://www.youtube.com/watch?v=US8c0W2DpxM) - Practical implementation

### Advanced Topics

- [Segmented Sieve](https://www.youtube.com/watch?v=fByR4R4CE3Y) - For large ranges
- [Linear Sieve (Euler's Sieve)](https://www.youtube.com/watch?v=0j5lXz2h3YQ) - O(n) algorithm
- [Sieve for Smallest Prime Factor](https://www.youtube.com/watch?v=v4_9Z-nEA4c) - Factorization queries

### Problem Solving

- [Prime Arrangements LeetCode Solution](https://www.youtube.com/watch?v=8mWzXFlM3K8) - Combinatorics with sieve
- [Sum of Four Divisors Solution](https://www.youtube.com/watch?v=4pHpQ5M4DRg) - SPF application

---

## Follow-up Questions

### Q1: What is the time complexity of the Sieve of Eratosthenes and why?

**Answer:** O(n log log n) - This comes from the harmonic series of primes. We mark n/p multiples for each prime p, and the sum of reciprocals of primes converges to log log n. This is much better than O(n²) naive checking.

### Q2: Can Sieve handle n up to 10⁸?

**Answer:** With standard O(n) space:
- Memory: 10⁸ bytes ≈ 100MB (acceptable in most environments)
- Time: ~1-2 seconds on modern hardware
- For larger n, use segmented sieve (O(√n) space)

### Q3: How do you optimize the Sieve for memory?

**Answer:** Several optimizations:
1. **Odd-only tracking**: Halve memory by skipping even numbers
2. **Bit array**: Use 1 bit per number (8x less memory)
3. **Segmented sieve**: Process in chunks
4. **Run-length encoding**: For sparse prime distributions

### Q4: What is the difference between Eratosthenes and Linear Sieve?

**Answer:**
- **Eratosthenes**: O(n log log n), simpler implementation
- **Linear Sieve**: O(n), computes smallest prime factors, more complex
- Linear Sieve marks each composite exactly once by its smallest prime factor
- Use Linear Sieve when you need SPF or guaranteed O(n)

### Q5: When should you use Segmented Sieve over standard Sieve?

**Answer:** Use Segmented Sieve when:
- n is very large (n > 10⁸)
- Memory is limited (uses O(√n) space)
- You only need primes in a specific range [low, high]
- Finding primes in a window far from 0

---

## Summary

The Sieve of Eratosthenes is a foundational algorithm in number theory for generating prime numbers. Key takeaways:

- **Efficient**: O(n log log n) time complexity is remarkably fast
- **Simple**: Basic implementation is straightforward
- **Versatile**: Can be adapted for various prime-related queries
- **Space trade-off**: Uses O(n) space but enables O(1) prime queries after preprocessing
- **Historical significance**: Still relevant after 2000+ years

When to use:
- ✅ Generating all primes up to n (n ≤ 10⁷)
- ✅ Counting primes less than n
- ✅ Preprocessing for factorization queries
- ✅ Any problem requiring multiple prime checks
- ❌ Very large n with memory constraints (use segmented sieve)
- ❌ Single prime check (use naive O(√n) check)

This algorithm is essential for competitive programming and technical interviews, especially in problems involving prime numbers, factorization, and number theory.
