# Linear Sieve (Euler's Sieve)

## Category
Math & Number Theory

## Description

The Linear Sieve, also known as Euler's Sieve, is the most efficient algorithm for generating all prime numbers up to a given limit n. Unlike the classic Sieve of Eratosthenes which runs in O(n log log n) time complexity, the Linear Sieve achieves optimal O(n) time complexity.

The key innovation is that each composite number is marked exactly once by its smallest prime factor (SPF). This guarantees linear time complexity while also providing valuable auxiliary information - the smallest prime factor for every number up to n - which enables O(log n) factorization of any number in the range.

---

## Concepts

The Linear Sieve is built on several fundamental concepts that make it the optimal prime generation algorithm.

### 1. Smallest Prime Factor (SPF)

Every composite number x can be uniquely represented as x = p × k, where p is the smallest prime factor of x.

| Number | Smallest Prime Factor | Factorization |
|--------|----------------------|---------------|
| 4 | 2 | 2 × 2 |
| 6 | 2 | 2 × 3 |
| 9 | 3 | 3 × 3 |
| 12 | 2 | 2 × 6 (not 3 × 4) |
| 15 | 3 | 3 × 5 |

### 2. Exactly Once Property

The Linear Sieve ensures each composite is marked exactly once:

```
For each composite c:
    c is marked when processing (c/spf[c], spf[c])
    Because spf[c] is the smallest prime factor
    The condition (i % p == 0) break prevents redundant marking
```

### 3. Multiplicative Functions

The Linear Sieve can compute multiplicative functions efficiently:

| Function | Symbol | Meaning | Formula |
|----------|--------|---------|---------|
| Euler's Totient | φ(n) | Count of coprimes ≤ n | n × Π(1 - 1/p) |
| Möbius Function | μ(n) | (-1)^k if n has k distinct primes, 0 if square | μ(n) |
| Divisor Count | d(n) | Number of divisors | Π(ei + 1) |
| Divisor Sum | σ(n) | Sum of divisors | Π(p^(ei+1) - 1)/(p - 1) |

### 4. The Breaking Condition

The critical optimization that makes it O(n):

```
for p in primes:
    if i * p > n: break
    is_prime[i * p] = False
    spf[i * p] = p
    if i % p == 0:  # CRITICAL: ensures each composite marked once
        break
```

---

## Frameworks

Structured approaches for implementing and using the Linear Sieve.

### Framework 1: Basic Linear Sieve Template

```
┌─────────────────────────────────────────────────────┐
│  LINEAR SIEVE FRAMEWORK                               │
├─────────────────────────────────────────────────────┤
│  1. Initialize arrays:                                │
│     - is_prime[0...n] = True (except 0,1 = False)   │
│     - spf[0...n] = 0                                  │
│     - primes = []                                     │
│  2. For i from 2 to n:                                │
│     a. If is_prime[i]: add to primes, spf[i] = i     │
│     b. For each prime p in primes:                    │
│        - If i * p > n: break                         │
│        - Mark is_prime[i*p] = False                 │
│        - Set spf[i*p] = p                           │
│        - If i % p == 0: break (CRITICAL)             │
│  3. Return primes, spf                                  │
└─────────────────────────────────────────────────────┘
```

**When to use**: Prime generation with SPF, factorization preprocessing.

### Framework 2: Multiplicative Functions Template

```
┌─────────────────────────────────────────────────────┐
│  MULTIPLICATIVE FUNCTIONS FRAMEWORK                   │
├─────────────────────────────────────────────────────┤
│  1. Run linear sieve to get primes and spf          │
│  2. Initialize function values:                      │
│     - phi[i] = i, mu[i] = 1, d[i] = 1, sigma[i] = 1 │
│  3. For each prime p:                                 │
│     a. For multiples of p: update phi[j] -= phi[j]/p│
│     b. For multiples of p: mu[j] *= -1               │
│     c. Mark p² multiples: is_square_free[j] = False │
│  4. Set mu[i] = 0 for non-square-free numbers        │
│  5. Return function arrays                            │
└─────────────────────────────────────────────────────┘
```

**When to use**: Computing Euler's totient, Möbius, or other multiplicative functions.

### Framework 3: Online Factorization Template

```
┌─────────────────────────────────────────────────────┐
│  FAST FACTORIZATION FRAMEWORK                         │
├─────────────────────────────────────────────────────┤
│  1. Precompute SPF array using linear sieve          │
│  2. To factorize x:                                   │
│     a. While x > 1:                                   │
│        - p = spf[x]                                   │
│        - count = 0                                    │
│        - while x % p == 0: x //= p, count += 1      │
│        - add (p, count) to factors                  │
│  3. Return factor list                                │
│  Time: O(log x) per factorization                     │
└─────────────────────────────────────────────────────┘
```

**When to use**: Multiple factorization queries on preprocessed range.

---

## Forms

Different manifestations and applications of the Linear Sieve.

### Form 1: Standard Prime Generation

Generates all primes up to n with O(n) time complexity.

| Metric | Value |
|--------|-------|
| Time | O(n) |
| Space | O(n) |
| Primes generated | ~n/ln(n) |
| Operations | Exactly n - π(n) composites marked once |

### Form 2: SPF (Smallest Prime Factor) Array

Provides O(log n) factorization capability.

```python
# After sieve, factorize any number in O(log n)
def factorize(x, spf):
    factors = []
    while x > 1:
        factors.append(spf[x])
        x //= spf[x]
    return factors
```

### Form 3: Multiplicative Function Computation

Compute multiple number-theoretic functions in one pass:

```python
# Functions computable:
# - Euler's totient φ(n)
# - Möbius function μ(n)
# - Divisor count d(n)
# - Divisor sum σ(n)
```

### Form 4: Segmented Linear Sieve

For very large n where memory is constrained:

```
1. Generate base primes up to √n using linear sieve
2. Process segments of size S
3. For each segment, mark composites using base primes
4. Maintain SPF for segment
```

### Form 5: Range Query Preprocessing

Build prefix sums for O(1) queries:

| Query Type | Preprocessing | Query Time |
|------------|---------------|------------|
| Is x prime? | O(n) | O(1) |
| Count primes ≤ x | O(n) | O(1) |
| Factorize x | O(n) | O(log x) |
| φ(x), μ(x), etc. | O(n) | O(1) |

---

## Tactics

Specific techniques and optimizations for Linear Sieve implementation.

### Tactic 1: Understanding the Breaking Condition

The critical `if i % p == 0: break` ensures O(n) complexity:

```python
def linear_sieve(n):
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
            # CRITICAL: Stop when p divides i
            # This ensures i*p is marked only by its smallest prime factor
            if i % p == 0:
                break
    
    return primes, spf
```

**Why it works**: When p divides i, i = p × k, so i × p = p² × k. The next prime would mark it with a larger factor, but p² × k should only be marked by p (its smallest factor).

### Tactic 2: Computing Euler's Totient Function

```python
def euler_totient_linear(n, primes):
    """Compute φ(n) for all n up to limit using linear sieve primes."""
    phi = list(range(n + 1))  # phi[i] = i initially
    
    for p in primes:
        if p > n:
            break
        for j in range(p, n + 1, p):
            phi[j] -= phi[j] // p
    
    return phi
```

**Formula**: If n = p₁^e₁ × p₂^e₂ × ..., then φ(n) = n × (1 - 1/p₁) × (1 - 1/p₂) × ...

### Tactic 3: Computing Möbius Function

```python
def mobius_function_linear(n, primes):
    """Compute μ(n) for all n up to limit."""
    mu = [1] * (n + 1)
    is_square_free = [True] * (n + 1)
    
    for p in primes:
        if p > n:
            break
        # Multiply by -1 for each prime factor
        for j in range(p, n + 1, p):
            mu[j] *= -1
        
        # Mark multiples of p² as not square-free
        p_square = p * p
        for j in range(p_square, n + 1, p_square):
            is_square_free[j] = False
    
    for i in range(n + 1):
        if not is_square_free[i]:
            mu[i] = 0
    
    return mu
```

**Definition**:
- μ(n) = 1 if n is square-free with even number of prime factors
- μ(n) = -1 if n is square-free with odd number of prime factors
- μ(n) = 0 if n has a squared prime factor

### Tactic 4: Divisor Count and Sum

```python
def divisor_functions_linear(n, spf):
    """Compute d(n) and σ(n) using SPF array."""
    d = [1] * (n + 1)       # Divisor count
    sigma = [1] * (n + 1)   # Divisor sum
    sigma[0] = 0
    
    # Helper: count of p in i, power of p in i
    count = [0] * (n + 1)
    p_power = [1] * (n + 1)
    
    for i in range(2, n + 1):
        p = spf[i]
        m = i // p
        
        if m % p == 0:  # p^e continues
            count[i] = count[m] + 1
            p_power[i] = p_power[m] * p
            d[i] = d[m] // (count[m] + 1) * (count[i] + 1)
            sigma[i] = sigma[m] + p_power[i]
        else:  # New prime factor
            count[i] = 1
            p_power[i] = p
            d[i] = d[m] * 2
            sigma[i] = sigma[m] * (1 + p)
    
    return d, sigma
```

### Tactic 5: Combining with Prefix Sums

```python
class LinearSieve:
    """Complete Linear Sieve with prefix sums for fast queries."""
    
    def __init__(self, n):
        self.n = n
        self.primes, self.spf = self._build_sieve()
        self._build_prefix_sums()
    
    def _build_sieve(self):
        spf = [0] * (self.n + 1)
        is_prime = [True] * (self.n + 1)
        is_prime[0] = is_prime[1] = False
        primes = []
        
        for i in range(2, self.n + 1):
            if is_prime[i]:
                primes.append(i)
                spf[i] = i
            for p in primes:
                if i * p > self.n:
                    break
                is_prime[i * p] = False
                spf[i * p] = p
                if i % p == 0:
                    break
        
        return primes, spf
    
    def _build_prefix_sums(self):
        self.is_prime_arr = [False] * (self.n + 1)
        for p in self.primes:
            self.is_prime_arr[p] = True
        
        self.prime_prefix = [0] * (self.n + 1)
        for i in range(1, self.n + 1):
            self.prime_prefix[i] = self.prime_prefix[i-1] + (1 if self.is_prime_arr[i] else 0)
    
    def is_prime(self, x):
        return self.is_prime_arr[x]
    
    def count_primes(self, l, r):
        return self.prime_prefix[r] - self.prime_prefix[l-1]
```

---

## Python Templates

### Template 1: Basic Linear Sieve

```python
def linear_sieve(n: int) -> tuple[list[int], list[int]]:
    """
    Template for Linear Sieve (Euler's Sieve).
    Returns (primes, spf) where spf is smallest prime factor.
    
    Time: O(n)
    Space: O(n)
    """
    if n < 2:
        return [], [0] * (n + 1)
    
    primes = []
    spf = [0] * (n + 1)  # Smallest prime factor
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, n + 1):
        if is_prime[i]:
            primes.append(i)
            spf[i] = i  # Prime's smallest factor is itself
        
        for p in primes:
            if i * p > n:
                break
            
            is_prime[i * p] = False
            spf[i * p] = p
            
            # CRITICAL OPTIMIZATION: Stop when p divides i
            # This ensures each composite is marked exactly once
            if i % p == 0:
                break
    
    return primes, spf
```

### Template 2: Linear Sieve Class with Factorization

```python
class LinearSieve:
    """
    Complete Linear Sieve implementation with factorization support.
    """
    
    def __init__(self, n: int):
        """Initialize sieve up to n. Time: O(n)"""
        self.n = n
        self.primes = []
        self.spf = [0] * (n + 1)
        self._build_sieve()
    
    def _build_sieve(self):
        is_prime = [True] * (self.n + 1)
        is_prime[0] = is_prime[1] = False
        
        for i in range(2, self.n + 1):
            if is_prime[i]:
                self.primes.append(i)
                self.spf[i] = i
            
            for p in self.primes:
                if i * p > self.n:
                    break
                is_prime[i * p] = False
                self.spf[i * p] = p
                if i % p == 0:
                    break
    
    def is_prime(self, x: int) -> bool:
        """Check if x is prime. Time: O(1)"""
        if x > self.n:
            raise ValueError(f"x={x} exceeds limit n={self.n}")
        return self.spf[x] == x and x >= 2
    
    def factorize(self, x: int) -> list[tuple[int, int]]:
        """
        Factorize x into (prime, exponent) pairs.
        Time: O(log x)
        """
        if x > self.n or x < 1:
            raise ValueError(f"x={x} out of range [1, {self.n}]")
        
        factors = []
        while x > 1:
            p = self.spf[x]
            count = 0
            while x % p == 0:
                x //= p
                count += 1
            factors.append((p, count))
        return factors
    
    def get_prime_factors(self, x: int) -> list[int]:
        """Get list of prime factors (with repetition). Time: O(log x)"""
        factors = []
        while x > 1:
            p = self.spf[x]
            factors.append(p)
            x //= p
        return factors
    
    def get_unique_prime_factors(self, x: int) -> set[int]:
        """Get set of unique prime factors. Time: O(log x)"""
        factors = set()
        while x > 1:
            p = self.spf[x]
            factors.add(p)
            x //= p
        return factors
```

### Template 3: Euler's Totient with Linear Sieve

```python
def linear_sieve_with_phi(n: int) -> tuple[list[int], list[int]]:
    """
    Linear Sieve that also computes Euler's totient function.
    Returns (primes, phi) where phi[i] = Euler's totient of i.
    
    Time: O(n)
    Space: O(n)
    """
    primes = []
    spf = [0] * (n + 1)
    phi = [0] * (n + 1)
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    phi[0] = 0
    phi[1] = 1
    
    for i in range(2, n + 1):
        if is_prime[i]:
            primes.append(i)
            spf[i] = i
            phi[i] = i - 1  # φ(p) = p - 1 for prime p
        
        for p in primes:
            if i * p > n:
                break
            
            is_prime[i * p] = False
            spf[i * p] = p
            
            if i % p == 0:
                # p divides i, so i*p has same prime factors as i
                # φ(i*p) = φ(i) * p
                phi[i * p] = phi[i] * p
                break
            else:
                # p doesn't divide i, coprime case
                # φ(i*p) = φ(i) * (p - 1)
                phi[i * p] = phi[i] * (p - 1)
    
    return primes, phi
```

### Template 4: Complete Multiplicative Functions

```python
def linear_sieve_multiplicative(n: int) -> dict:
    """
    Compute multiple multiplicative functions in one pass.
    Returns dict with: primes, spf, phi, mu, d, sigma
    
    Time: O(n)
    Space: O(n)
    """
    spf = [0] * (n + 1)
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    primes = []
    
    # Multiplicative functions
    phi = list(range(n + 1))    # Euler's totient
    mu = [1] * (n + 1)          # Möbius function
    d = [1] * (n + 1)           # Divisor count
    sigma = [1] * (n + 1)       # Divisor sum
    sigma[0] = 0
    
    # Helper arrays
    p_power = [1] * (n + 1)     # Highest power of spf dividing i
    exp_count = [0] * (n + 1)   # Exponent of spf in i
    
    for i in range(2, n + 1):
        if is_prime[i]:
            primes.append(i)
            spf[i] = i
            phi[i] = i - 1
            mu[i] = -1
            d[i] = 2
            sigma[i] = 1 + i
            p_power[i] = i
            exp_count[i] = 1
        
        for p in primes:
            if i * p > n:
                break
            
            is_prime[i * p] = False
            spf[i * p] = p
            
            if i % p == 0:
                # p divides i, extending power of p
                p_power[i * p] = p_power[i] * p
                exp_count[i * p] = exp_count[i] + 1
                
                phi[i * p] = phi[i] * p
                mu[i * p] = 0  # Has squared prime factor
                d[i * p] = d[i] // (exp_count[i] + 1) * (exp_count[i * p] + 1)
                sigma[i * p] = sigma[i] + p_power[i * p]
                break
            else:
                # p doesn't divide i, coprime case
                p_power[i * p] = p
                exp_count[i * p] = 1
                
                phi[i * p] = phi[i] * (p - 1)
                mu[i * p] = mu[i] * (-1)
                d[i * p] = d[i] * 2
                sigma[i * p] = sigma[i] * (1 + p)
    
    return {
        'primes': primes,
        'spf': spf,
        'phi': phi,
        'mu': mu,
        'd': d,
        'sigma': sigma
    }
```

### Template 5: Prime Range Query Class

```python
class PrimeRangeQuery:
    """
    Handle multiple prime-related range queries efficiently.
    Preprocesses with linear sieve for O(1) queries.
    """
    
    def __init__(self, n: int):
        self.n = n
        self.sieve = LinearSieve(n)
        
        # Prefix sum of primes for count queries
        self.prime_prefix = [0] * (n + 1)
        for i in range(1, n + 1):
            self.prime_prefix[i] = self.prime_prefix[i-1] + (1 if self.sieve.is_prime(i) else 0)
    
    def count_primes_in_range(self, l: int, r: int) -> int:
        """Count primes in [l, r]. Time: O(1)"""
        if l > r:
            return 0
        l = max(l, 1)
        r = min(r, self.n)
        return self.prime_prefix[r] - self.prime_prefix[l-1]
    
    def is_prime(self, x: int) -> bool:
        """Check if x is prime. Time: O(1)"""
        return self.sieve.is_prime(x)
    
    def factorize(self, x: int) -> list[tuple[int, int]]:
        """Factorize x. Time: O(log x)"""
        return self.sieve.factorize(x)
    
    def get_kth_prime(self, k: int) -> int:
        """Get the kth prime (1-indexed). Time: O(1) if k <= len(primes)"""
        if k < 1 or k > len(self.sieve.primes):
            return -1
        return self.sieve.primes[k - 1]
```

---

## When to Use

Use the Linear Sieve when you need to solve problems involving:

- **Prime Generation**: Finding all primes up to large limits (n ≤ 10⁷ efficiently)
- **Prime Factorization**: Fast factorization of multiple numbers using precomputed SPF
- **Multiplicative Functions**: Computing Euler's totient φ(n), Möbius function μ(n), divisor count d(n), or divisor sum σ(n)
- **Number Theory Problems**: Problems requiring frequent primality checks or factorization
- **Competitive Programming**: When performance is critical and preprocessing is feasible

### Comparison with Alternatives

| Algorithm | Time Complexity | Space Complexity | Each Composite Crossed | Provides SPF |
|-----------|----------------|------------------|------------------------|--------------|
| **Trial Division** | O(n√n) | O(1) | N/A | ❌ No |
| **Sieve of Eratosthenes** | O(n log log n) | O(n) | Multiple times | ❌ No |
| **Segmented Sieve** | O(n log log n) | O(√n) | Multiple times | ❌ No |
| **Linear Sieve** | **O(n)** | **O(n)** | **Exactly once** | ✅ **Yes** |

### When to Choose Linear Sieve vs Sieve of Eratosthenes

**Choose Linear Sieve when:**
- You need to factorize numbers (requires SPF)
- You're computing multiplicative functions
- n > 10⁶ and performance matters
- Memory is sufficient for O(n) storage

**Choose Sieve of Eratosthenes when:**
- You only need primality testing
- n is relatively small (< 10⁶)
- Simplicity is preferred over performance
- Memory is constrained

---

## Algorithm Explanation

### Core Concept

Every composite number x can be uniquely represented as:

```
x = p × k
```

where p is the smallest prime factor of x, and k is some integer ≥ p.

The Linear Sieve ensures each composite is generated exactly once by its smallest prime factor, guaranteeing O(n) total operations.

### How It Works

The algorithm maintains three arrays:
1. **is_prime[]**: Boolean array marking primality
2. **spf[]**: Smallest prime factor for each number
3. **primes[]**: List of discovered primes

#### Key Insight: The Breaking Condition

When iterating through primes p for each number i:
- Mark i × p as composite
- Set spf[i × p] = p
- **Critical**: If p divides i (i.e., i % p == 0), **break immediately**

This ensures i × p is marked only by its smallest prime factor.

### Visual Representation

For n = 30, let's trace how composites are marked:

```
Numbers:  2   3   4   5   6   7   8   9   10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30
          ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓
SPF:      2   3   2   5   2   7   2   3   2   11  2   13  2   3   2   17  2   19  2   3   2   23  2   5   2   3   2   29  2

Composites marked by their smallest prime factor:
4  = 2 × 2    (marked when i=2, p=2)
6  = 2 × 3    (marked when i=3, p=2)
8  = 2 × 4    (marked when i=4, p=2)
9  = 3 × 3    (marked when i=3, p=3)
10 = 2 × 5    (marked when i=5, p=2)
12 = 2 × 6    (marked when i=6, p=2) ← Note: 12 = 3 × 4, but 2 is smaller
...
30 = 2 × 15   (marked when i=15, p=2)
```

### Why It's O(n)

Each composite number has exactly one smallest prime factor, so each composite is marked exactly once. With O(n) primes and O(n) composites, total operations are O(n).

```
Total marks = Σ (composites marked by each prime)
            = Number of composites
            = O(n)
```

### Limitations

- **Memory constraint**: Requires O(n) space for SPF array
- **Large n**: For n > 10⁸, memory (~400MB for SPF) may be problematic
- **Single range**: Preprocesses entire [1, n] range
- **Not for single queries**: If you only need to check a few numbers, Miller-Rabin may be better

---

## Practice Problems

### Problem 1: Count Primes

**Problem:** [LeetCode 204 - Count Primes](https://leetcode.com/problems/count-primes/)

**Description:** Given an integer n, return the number of prime numbers that are strictly less than n.

**How to Apply Linear Sieve:**
- Build linear sieve up to n
- Count primes in the generated list
- Time: O(n) for sieve, O(1) for count

---

### Problem 2: Sum of Four Divisors

**Problem:** [LeetCode 1390 - Sum of Four Divisors](https://leetcode.com/problems/sum-of-four-divisors/)

**Description:** Given an integer array nums, return the sum of divisors of the integers in nums that have exactly four divisors.

**How to Apply Linear Sieve:**
- Precompute SPF up to max(nums)
- For each number, factorize using SPF and check if it has exactly 4 divisors
- A number has exactly 4 divisors if it's either p³ or p×q (distinct primes)

---

### Problem 3: Distinct Prime Factors of Product of Array

**Problem:** [LeetCode 2521 - Distinct Prime Factors of Product of Array](https://leetcode.com/problems/distinct-prime-factors-of-product-of-array/)

**Description:** You are given an array of positive integers nums. Return the number of distinct prime factors in the product of the elements of nums.

**How to Apply Linear Sieve:**
- Precompute SPF up to max(nums)
- For each number, get unique prime factors using SPF
- Use a set to track distinct primes across all numbers

---

### Problem 4: K-th Smallest Prime Fraction

**Problem:** [LeetCode 786 - K-th Smallest Prime Fraction](https://leetcode.com/problems/k-th-smallest-prime-fraction/)

**Description:** You are given a sorted integer array arr containing 1 and prime numbers. Return the k-th smallest fraction of the form arr[i] / arr[j] where arr[i] < arr[j].

**How to Apply Linear Sieve:**
- Generate all primes up to max(arr) using linear sieve
- Use binary search or heap to find k-th smallest fraction
- The sorted list of primes enables efficient fraction comparison

---

### Problem 5: Prime Subtraction Operation

**Problem:** [LeetCode 2601 - Prime Subtraction Operation](https://leetcode.com/problems/prime-subtraction-operation/)

**Description:** You are given a 0-indexed integer array nums. You can perform operations where you pick an index i and a prime p strictly less than nums[i], then subtract p from nums[i]. Return true if you can make nums strictly increasing.

**How to Apply Linear Sieve:**
- Generate all primes up to max(nums) using linear sieve
- For each element, try subtracting primes to make it smaller than the next element
- Greedily process from right to left

---

## Video Tutorial Links

### Fundamentals

- [Linear Sieve Algorithm Explained (Competitive Programming)](https://www.youtube.com/watch?v=0J9xS_Dbcv0) - Complete walkthrough with examples
- [Euler's Sieve / Linear Sieve (WilliamFiset)](https://www.youtube.com/watch?v=NAx0d0Oa0p4) - Visual explanation of the algorithm
- [Prime Sieve Algorithms Comparison](https://www.youtube.com/watch?v=fByR4R4CE3Y) - Comparing different sieve algorithms

### Advanced Topics

- [Multiplicative Functions with Linear Sieve](https://www.youtube.com/watch?v=3I6O6nRJxZc) - Computing φ(n), μ(n), d(n)
- [Number Theory for Competitive Programming](https://www.youtube.com/watch?v=fP9hKkMfTao) - Comprehensive number theory course
- [Prime Factorization Techniques](https://www.youtube.com/watch?v=ak3T_9QBegY) - Fast factorization methods

### Problem Solving

- [Count Primes - Linear Sieve Solution](https://www.youtube.com/watch?v=O-7X0e8c7vc) - LeetCode 204
- [Sum of Four Divisors Solution](https://www.youtube.com/watch?v=4pHpQ5M4DRg) - SPF application

---

## Follow-up Questions

### Q1: Why does the condition `if (i % p == 0) break` make it linear?

**Answer:** This condition ensures each composite is marked exactly once by its smallest prime factor. Without it:
- Composite 12 would be marked as 2×6 (i=6, p=2) and 3×4 (i=4, p=3)
- With the condition: 12 is only marked as 2×6 (when i=6, p=2, and 6%2==0 so we break)
- Since each composite has exactly one smallest prime factor, it's marked exactly once
- This makes total operations O(n) instead of O(n log log n)

### Q2: Can Linear Sieve handle n = 10⁸?

**Answer:** Technically yes, but memory becomes the bottleneck:
- is_prime[]: ~100 MB (100M bytes)
- spf[]: ~400 MB (100M × 4 bytes)
- Total: ~500 MB which may exceed memory limits

**Alternatives for large n:**
1. **Segmented Sieve**: Use O(√n) memory
2. **Bitset optimization**: Reduce memory by 8×
3. **External memory**: Process in chunks

### Q3: How does Linear Sieve compare to Segmented Sieve?

**Answer:**

| Aspect | Linear Sieve | Segmented Sieve |
|--------|-------------|-----------------|
| Time | O(n) | O(n log log n) |
| Space | O(n) | O(√n) |
| Provides SPF | ✅ Yes | ❌ No |
| Best for | n ≤ 10⁷ | n > 10⁷ |
| Cache efficiency | Good | Better for large n |

### Q4: What are multiplicative functions and why do they work with Linear Sieve?

**Answer:** A function f is multiplicative if f(ab) = f(a) × f(b) when gcd(a,b) = 1.

**Examples:**
- φ(n) - Euler's totient
- μ(n) - Möbius function
- d(n) - Divisor count
- σ(n) - Divisor sum

They work with Linear Sieve because:
1. When we find a new prime p, we know f(p^e) formula
2. When p doesn't divide i, we use f(i × p) = f(i) × f(p)
3. When p divides i, we extend the power: f(i × p) = f(i) × correction

### Q5: How can I optimize Linear Sieve for competitive programming?

**Answer:**

1. **Use static arrays** instead of dynamic allocation
2. **Pre-allocate** vectors with reserve(n / log(n))
3. **Use bitset** for is_prime to save memory
4. **Process offline** when multiple test cases share max n
5. **Skip even numbers**: Store only odd numbers, handle 2 separately (2× speedup)

```cpp
// Optimized version skipping evens
void linearSieve(int n) {
    vector<int> primes;
    vector<int> spf(n + 1);
    
    for (int i = 2; i <= n; i++) {
        if (spf[i] == 0) {
            spf[i] = i;
            primes.push_back(i);
        }
        for (int p : primes) {
            if (p > spf[i] || 1LL * i * p > n) break;
            spf[i * p] = p;
        }
    }
}
```

---

## Summary

The Linear Sieve is the optimal algorithm for prime generation and multiplicative function computation:

**Key Advantages:**
- **O(n) time complexity**: Fastest possible sieve algorithm
- **Provides SPF**: Enables O(log n) factorization
- **Multiplicative functions**: Compute φ(n), μ(n), d(n), σ(n) in O(n)
- **Exactly one mark per composite**: Minimal operations

**When to Use:**
- ✅ Prime generation with n up to 10⁷
- ✅ Multiple factorization queries
- ✅ Computing multiplicative functions
- ✅ Number theory problems requiring SPF

**When NOT to Use:**
- ❌ Very large n (> 10⁸) - use segmented sieve
- ❌ Memory-constrained environments
- ❌ Single primality check - use Miller-Rabin
- ❌ Only counting primes - simpler sieves may suffice

**Key Takeaways:**
1. The `if (i % p == 0) break` condition is crucial for O(n) complexity
2. Smallest Prime Factor (SPF) array enables fast factorization
3. Multiplicative functions can be computed during sieve construction
4. Linear Sieve is essential for competitive programming number theory problems
