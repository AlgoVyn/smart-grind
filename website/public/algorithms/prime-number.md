# Prime Number (Primality Testing)

## Category
Number Theory & Mathematics

## Description

Prime numbers are the building blocks of number theory and play a crucial role in cryptography, hashing, and algorithm design. Primality testing determines whether a given number is prime, with algorithms ranging from simple trial division to sophisticated probabilistic tests like Miller-Rabin.

The study of prime numbers dates back to ancient Greece, with the Sieve of Eratosthenes (circa 200 BCE) being one of the oldest algorithms still in use today. Modern applications rely on efficient primality tests for large numbers, particularly in public-key cryptography where security depends on the difficulty of factoring products of large primes.

---

## Concepts

Prime number algorithms are built on fundamental number theory concepts that ensure both correctness and efficiency.

### 1. Prime Number Properties

| Property | Description |
|----------|-------------|
| **Definition** | Natural number > 1 with exactly two divisors: 1 and itself |
| **Fundamental Theorem** | Every integer > 1 has a unique prime factorization |
| **Distribution** | π(n) ≈ n/ln(n) primes less than n (Prime Number Theorem) |
| **Twin Primes** | Pairs (p, p+2) where both are prime |

### 2. Trial Division Optimization

Basic trial division can be significantly optimized:

| Optimization | Time | Description |
|-------------|------|-------------|
| **Basic** | O(n) | Check all numbers up to n |
| **Square Root** | O(√n) | Only check up to √n |
| **Even Skip** | O(√n/2) | Skip even numbers after 2 |
| **6k ± 1** | O(√n/3) | Check only 6k ± 1 forms |

**6k ± 1 Optimization**: All primes > 3 are of the form 6k ± 1 because:
- 6k is divisible by 6
- 6k + 2 is divisible by 2
- 6k + 3 is divisible by 3
- 6k + 4 is divisible by 2

### 3. Probabilistic Testing

| Test | Accuracy | Use Case |
|------|----------|----------|
| **Fermat** | Can fail (Carmichael numbers) | Simple screening |
| **Miller-Rabin** | Deterministic for 64-bit | Cryptography |
| **AKS** | Deterministic, polynomial | Theoretical |

### 4. Sieve of Eratosthenes

Classic algorithm for generating all primes up to n:

| Step | Action |
|------|--------|
| 1 | Mark all numbers as prime |
| 2 | Start with p = 2 |
| 3 | Mark all multiples of p as composite |
| 4 | Find next unmarked number > p |
| 5 | Repeat until p² > n |
| 6 | Remaining unmarked numbers are prime |

---

## Frameworks

Structured approaches for prime number problems.

### Framework 1: Trial Division Primality Test

```
┌─────────────────────────────────────────────────────────────┐
│  TRIAL DIVISION PRIMALITY TEST                              │
├─────────────────────────────────────────────────────────────┤
│  Input: integer n                                            │
│  Output: True if n is prime, False otherwise                 │
│                                                              │
│  1. If n < 2: return False                                   │
│  2. If n == 2 or n == 3: return True                        │
│  3. If n % 2 == 0: return False                           │
│  4. For i from 3 to √n (step 2):                          │
│     a. If n % i == 0: return False                          │
│  5. Return True                                              │
│                                                              │
│  Optimization: Check 6k ± 1 forms instead of all odd       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Small numbers (n < 10⁹) or single primality tests.

### Framework 2: Sieve of Eratosthenes

```
┌─────────────────────────────────────────────────────────────┐
│  SIEVE OF ERATOSTHENES                                       │
├─────────────────────────────────────────────────────────────┤
│  Input: upper bound n                                        │
│  Output: boolean array is_prime[0..n]                       │
│                                                              │
│  1. Initialize: is_prime[i] = True for all i ≥ 2          │
│  2. Mark is_prime[0] = is_prime[1] = False                  │
│  3. For i from 2 to √n:                                     │
│     a. If is_prime[i] is True:                              │
│        - For j from i² to n (step i):                       │
│          * Mark is_prime[j] = False                         │
│  4. Return is_prime array                                    │
│                                                              │
│  Time: O(n log log n), Space: O(n)                         │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Need all primes up to n, or multiple primality queries.

### Framework 3: Miller-Rabin Primality Test

```
┌─────────────────────────────────────────────────────────────┐
│  MILLER-RABIN PRIMALITY TEST                                │
├─────────────────────────────────────────────────────────────┤
│  Input: odd integer n > 2, number of rounds k                │
│  Output: "composite" or "probably prime"                    │
│                                                              │
│  1. Write n-1 as 2^r × d where d is odd                     │
│  2. Repeat k times:                                         │
│     a. Choose random a in [2, n-2]                          │
│     b. Compute x = a^d mod n                                │
│     c. If x == 1 or x == n-1: continue to next round       │
│     d. For i from 1 to r-1:                                 │
│        - x = x² mod n                                       │
│        - If x == n-1: break inner loop                      │
│     e. If loop completed without x == n-1:                   │
│        - Return "composite"                                  │
│  3. Return "probably prime"                                  │
│                                                              │
│  With specific bases: deterministic for n < 2^64           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Large numbers, cryptography, when deterministic result needed for 64-bit integers.

### Framework 4: Prime Factorization

```
┌─────────────────────────────────────────────────────────────┐
│  PRIME FACTORIZATION (TRIAL DIVISION)                       │
├─────────────────────────────────────────────────────────────┤
│  Input: integer n                                            │
│  Output: list of prime factors                               │
│                                                              │
│  1. Initialize: factors = []                                 │
│  2. While n % 2 == 0:                                       │
│     a. factors.append(2)                                     │
│     b. n //= 2                                               │
│  3. For i from 3 to √n (step 2):                            │
│     a. While n % i == 0:                                    │
│        - factors.append(i)                                   │
│        - n //= i                                            │
│  4. If n > 2: factors.append(n)                             │
│  5. Return factors                                           │
│                                                              │
│  Note: Last factor (if > 2) is prime by elimination          │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Need prime factorization, computing GCD/LCM.

---

## Forms

Different manifestations and variations of prime algorithms.

### Form 1: Basic Trial Division

Simplest primality test for small numbers.

| Aspect | Details |
|--------|---------|
| **Time** | O(√n) |
| **Space** | O(1) |
| **Best for** | n < 10⁶, single tests |
| **Limitation** | Slow for large numbers |

### Form 2: Optimized 6k ± 1

Checks only numbers of form 6k ± 1.

| Aspect | Details |
|--------|---------|
| **Time** | O(√n) with ~3x fewer checks |
| **Space** | O(1) |
| **Best for** | n < 10⁹ |
| **Why it works** | All primes > 3 are 6k ± 1 |

### Form 3: Sieve of Eratosthenes

Generates all primes up to n.

| Aspect | Details |
|--------|---------|
| **Time** | O(n log log n) |
| **Space** | O(n) |
| **Best for** | Multiple queries, n < 10⁷ |
| **Variants** | Segmented sieve for large n |

### Form 4: Miller-Rabin Probabilistic

Deterministic for 64-bit integers with specific bases.

| Aspect | Details |
|--------|---------|
| **Time** | O(k log³n) |
| **Accuracy** | Error probability 4^(-k) |
| **Best for** | Large numbers, cryptography |
| **Bases for 64-bit** | [2, 325, 9375, 28178, 450775, 9780504, 1795265022] |

### Form 5: Segmented Sieve

For finding primes in a range [L, R] where R is large.

| Aspect | Details |
|--------|---------|
| **Time** | O((R-L+1) log log R + √R log log √R) |
| **Space** | O(R-L+1) |
| **Best for** | Large ranges, parallel processing |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Optimized Trial Division

6k ± 1 optimization for practical primality testing:

```python
import math

def is_prime_optimized(n):
    """
    Optimized trial division primality test.
    Time: O(√n), Space: O(1)
    """
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    
    # Check 6k ± 1 forms
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    
    return True
```

**Why it works**: All primes > 3 can be written as 6k ± 1, so we only need to check these forms.

### Tactic 2: Fermat Primality Test

Simple probabilistic test (note: Carmichael numbers pass):

```python
import random

def fermat_test(n, k=5):
    """
    Fermat's little theorem primality test.
    Note: Carmichael numbers fool this test.
    """
    if n < 2:
        return False
    if n in (2, 3):
        return True
    
    for _ in range(k):
        a = random.randrange(2, n - 1)
        if pow(a, n - 1, n) != 1:
            return False
    
    return True
```

**Limitation**: Carmichael numbers (like 561, 1105, 1729) satisfy a^(n-1) ≡ 1 (mod n) for all a coprime to n, fooling the test.

### Tactic 3: Miller-Rabin Implementation

Deterministic for 64-bit integers:

```python
def miller_rabin(n, k=5):
    """
    Miller-Rabin primality test.
    Deterministic for 64-bit integers with specific bases.
    """
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0:
        return False
    
    # Write n-1 as 2^r * d
    r, d = 0, n - 1
    while d % 2 == 0:
        r += 1
        d //= 2
    
    # Witnesses for deterministic test (n < 3,317,044,064,679,887,385,961,981)
    witnesses = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
    
    for a in witnesses[:k]:
        if a >= n:
            continue
        
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        
        for _ in range(r - 1):
            x = pow(x, 2, n)
            if x == n - 1:
                break
        else:
            return False
    
    return True
```

**Why it's better**: No Carmichael number equivalents exist for Miller-Rabin.

### Tactic 4: Prime Factorization

Extract all prime factors:

```python
def prime_factors(n):
    """
    Return prime factorization as list.
    Time: O(√n), Space: O(log n) for factors
    """
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

**Application**: Computing divisors, GCD, LCM, Euler's totient function.

### Tactic 5: Finding Nth Prime

Using sieve with upper bound estimation:

```python
def nth_prime(n):
    """
    Find the nth prime using sieve.
    Time: O(n log log n), Space: O(n log n)
    """
    if n == 1:
        return 2
    
    # Estimate upper bound: n * (ln n + ln ln n) for n >= 6
    import math
    if n < 6:
        upper = 15
    else:
        upper = int(n * (math.log(n) + math.log(math.log(n))))
    
    # Sieve
    sieve = [True] * (upper + 1)
    sieve[0] = sieve[1] = False
    
    for i in range(2, int(math.isqrt(upper)) + 1):
        if sieve[i]:
            for j in range(i * i, upper + 1, i):
                sieve[j] = False
    
    primes = [i for i, is_p in enumerate(sieve) if is_p]
    return primes[n - 1]
```

**Upper bound**: For n ≥ 6, the nth prime is less than n(ln n + ln ln n).

---

## Python Templates

### Template 1: Basic Primality Test

```python
import math

def is_prime(n: int) -> bool:
    """
    Check if n is prime using trial division.
    
    Time: O(√n), Space: O(1)
    """
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0:
        return False
    
    # Check odd divisors up to √n
    for i in range(3, int(math.isqrt(n)) + 1, 2):
        if n % i == 0:
            return False
    
    return True
```

### Template 2: Optimized Primality Test (6k ± 1)

```python
def is_prime_optimized(n: int) -> bool:
    """
    Optimized trial division using 6k ± 1 forms.
    
    Time: O(√n), Space: O(1)
    About 3x faster than basic trial division.
    """
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    
    # Check 6k ± 1 forms
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    
    return True
```

### Template 3: Miller-Rabin Primality Test

```python
def is_prime_miller_rabin(n: int) -> bool:
    """
    Miller-Rabin primality test.
    Deterministic for 64-bit integers.
    
    Time: O(k log³n), Space: O(1)
    """
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0:
        return False
    
    # Write n-1 as 2^r * d
    r, d = 0, n - 1
    while d % 2 == 0:
        r += 1
        d //= 2
    
    # Deterministic bases for n < 2^64
    bases = [2, 325, 9375, 28178, 450775, 9780504, 1795265022]
    
    for a in bases:
        if a % n == 0:
            continue
        
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        
        for _ in range(r - 1):
            x = pow(x, 2, n)
            if x == n - 1:
                break
        else:
            return False
    
    return True
```

### Template 4: Sieve of Eratosthenes

```python
def sieve_of_eratosthenes(n: int) -> list:
    """
    Generate all primes up to n using Sieve of Eratosthenes.
    
    Returns boolean array where is_prime[i] indicates if i is prime.
    
    Time: O(n log log n), Space: O(n)
    """
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i * i, n + 1, i):
                is_prime[j] = False
    
    return is_prime

def get_primes(n: int) -> list:
    """Return list of all primes up to n."""
    is_prime = sieve_of_eratosthenes(n)
    return [i for i in range(2, n + 1) if is_prime[i]]
```

### Template 5: Prime Factorization

```python
def prime_factorization(n: int) -> list:
    """
    Return prime factorization of n as list of factors.
    
    Time: O(√n), Space: O(log n)
    """
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

def prime_factorization_with_count(n: int) -> dict:
    """Return prime factorization as {prime: count} dict."""
    factors = {}
    d = 2
    
    while d * d <= n:
        while n % d == 0:
            factors[d] = factors.get(d, 0) + 1
            n //= d
        d += 1
    
    if n > 1:
        factors[n] = factors.get(n, 0) + 1
    
    return factors
```

### Template 6: Nth Prime Number

```python
def find_nth_prime(n: int) -> int:
    """
    Find the nth prime number.
    
    Time: O(n log log n), Space: O(n log n)
    """
    if n == 1:
        return 2
    
    # Estimate upper bound using n * (ln n + ln ln n)
    import math
    if n < 6:
        upper = 15
    else:
        upper = int(n * (math.log(n) + math.log(math.log(n))))
    
    # Generate primes up to upper bound
    is_prime = sieve_of_eratosthenes(upper)
    primes = [i for i in range(2, upper + 1) if is_prime[i]]
    
    return primes[n - 1]
```

---

## When to Use

Use prime number algorithms when you need to solve problems involving:

- **Primality testing**: Checking if a number is prime
- **Prime generation**: Finding all primes up to n
- **Cryptography**: RSA, Diffie-Hellman key exchange
- **Hashing**: Hash table size selection
- **Number theory**: GCD, LCM, modular arithmetic
- **Competitive programming**: Prime factorization problems

### Comparison of Primality Tests

| Test | Time | Accuracy | Best For |
|------|------|----------|----------|
| **Trial Division** | O(√n) | Exact | Small n (< 10⁹) |
| **6k ± 1** | O(√n) | Exact | Medium n, practical |
| **Fermat** | O(k log n) | Probabilistic | Simple screening |
| **Miller-Rabin** | O(k log³n) | Deterministic (64-bit) | Large n, crypto |
| **AKS** | O(log⁶n) | Exact | Theoretical only |

### When to Choose Which Algorithm

- **Trial division**: Single tests, small numbers, simplicity needed
- **Sieve**: Multiple queries, all primes up to n needed
- **Miller-Rabin**: Large numbers, cryptography, 64-bit integers
- **Segmented sieve**: Very large range [L, R] where R >> L

---

## Algorithm Explanation

### Core Concept

Prime numbers are natural numbers greater than 1 with exactly two distinct positive divisors: 1 and the number itself. The fundamental challenge in primality testing is determining whether a number has any divisors other than these trivial ones.

### How Trial Division Works

#### Step 1: Handle Small Cases
```python
if n < 2: return False      # 0 and 1 are not prime
if n == 2 or n == 3: return True  # 2 and 3 are prime
if n % 2 == 0: return False  # Even numbers > 2 are not prime
```

#### Step 2: Check Odd Divisors
```python
for i in range(3, √n + 1, 2):
    if n % i == 0:
        return False
return True
```

**Why √n?** If n has a factor greater than √n, the corresponding co-factor must be less than √n. So we only need to check up to √n.

### How Sieve of Eratosthenes Works

**Visual Representation for n = 30:**

```
Initial: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]

Step 1: Mark multiples of 2 (except 2)
Result: [2, 3, _, 5, _, 7, _, 9, _, 11, _, 13, _, 15, _, 17, _, 19, _, 21, _, 23, _, 25, _, 27, _, 29, _]

Step 2: Mark multiples of 3 (except 3)
Result: [2, 3, _, 5, _, 7, _, _, _, 11, _, 13, _, _, _, 17, _, 19, _, _, _, 23, _, 25, _, _, _, 29, _]

Step 3: Next unmarked is 5, mark multiples
Continue...

Final primes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```

### How Miller-Rabin Works

Based on a contrapositive of Fermat's Little Theorem:

**Witness Test**: For odd n, write n-1 = 2^r × d. If there exists a such that:
- a^d ≢ 1 (mod n), AND
- a^(2^j × d) ≢ n-1 (mod n) for all 0 ≤ j < r

Then n is composite.

**Accuracy**: For random a, probability of false positive ≤ 1/4. With k rounds, error ≤ 4^(-k).

---

## Practice Problems

### Problem 1: Count Primes

**Problem:** [LeetCode 204 - Count Primes](https://leetcode.com/problems/count-primes/)

**Description:** Given an integer `n`, return the number of prime numbers that are strictly less than `n`.

**How to Apply:**
- Use Sieve of Eratosthenes
- Count True values in is_prime[0..n-1]

---

### Problem 2: Prime Palindrome

**Problem:** [LeetCode 866 - Prime Palindrome](https://leetcode.com/problems/prime-palindrome/)

**Description:** Find the smallest prime palindrome greater than or equal to N.

**How to Apply:**
- Check palindrome property
- Use optimized trial division for primality
- Iterate until found

---

### Problem 3: K-th Smallest Prime Fraction

**Problem:** [LeetCode 786 - K-th Smallest Prime Fraction](https://leetcode.com/problems/k-th-smallest-prime-fraction/)

**Description:** A sorted list contains all prime numbers. Find the k-th smallest fraction.

**How to Apply:**
- Generate primes using sieve
- Use binary search or heap to find kth smallest

---

### Problem 4: Nth Digit

**Problem:** [LeetCode 400 - Nth Digit](https://leetcode.com/problems/nth-digit/)

**Description:** Find the nth digit of the infinite integer sequence.

**How to Apply:**
- Uses prime-related digit counting concepts
- Mathematical computation without generating sequence

---

## Video Tutorial Links

### Fundamentals

- [Prime Numbers Explained](https://www.youtube.com/watch?v=klcIk8llN5Q) - Basic concepts
- [Sieve of Eratosthenes](https://www.youtube.com/watch?v=klcIk8llN5Q) - Algorithm visualization
- [Miller-Rabin Primality Test](https://www.youtube.com/watch?v=qdylc6P0NFs) - Advanced testing

### Competitive Programming

- [Prime Numbers in CP](https://www.youtube.com/watch?v=1rRaC243_lk) - Common patterns
- [Sieve Variations](https://www.youtube.com/watch?v=fRaPSMF5ZXw) - Optimized implementations
- [Number Theory for CP](https://www.youtube.com/watch?v=e0B_DJ6CWWQ) - Comprehensive coverage

---

## Follow-up Questions

### Q1: Why does the 6k ± 1 optimization work?

**Answer:** All integers can be written as 6k, 6k+1, 6k+2, 6k+3, 6k+4, or 6k+5. Among these:
- 6k is divisible by 6
- 6k+2 = 2(3k+1) is even
- 6k+3 = 3(2k+1) is divisible by 3
- 6k+4 = 2(3k+2) is even

Only 6k+1 and 6k+5 (= 6k-1) can potentially be prime. Since all primes > 3 are in these forms, we only need to check them.

### Q2: What are Carmichael numbers and why do they matter?

**Answer:** Carmichael numbers are composite numbers n that satisfy a^(n-1) ≡ 1 (mod n) for all integers a coprime to n. They fool Fermat's primality test. The smallest is 561 = 3 × 11 × 17. This is why Miller-Rabin is preferred - it has no analog of Carmichael numbers.

### Q3: When should I use sieve vs trial division?

**Answer:**
- **Sieve**: When you need all primes up to n or will make many primality queries
- **Trial division**: When testing single numbers or numbers are very large (>> sieve memory limit)
- **Hybrid**: Sieve up to √max, then trial division with those primes

### Q4: How does Miller-Rabin achieve deterministic results for 64-bit integers?

**Answer**: It has been proven that testing specific sets of bases is sufficient to make Miller-Rabin deterministic for certain ranges. For 64-bit integers, testing bases [2, 325, 9375, 28178, 450775, 9780504, 1795265022] guarantees correctness.

### Q5: Can we factor large numbers efficiently?

**Answer:** No known polynomial-time algorithm exists for factoring large numbers. This is the basis of RSA cryptography. The best known algorithms (Quadratic Sieve, General Number Field Sieve) are sub-exponential but still infeasible for numbers with 200+ digits.

---

## Summary

Prime number algorithms are fundamental tools in computer science with applications ranging from competitive programming to cryptography. Understanding the trade-offs between simple trial division and sophisticated probabilistic tests is essential for effective problem-solving.

**Key Takeaways:**

1. **Trial Division**: Simple and exact, best for small numbers
2. **6k ± 1 Optimization**: ~3x faster, practical for medium numbers
3. **Sieve of Eratosthenes**: Best for generating all primes up to n
4. **Miller-Rabin**: Preferred for large numbers and cryptography
5. **Prime Factorization**: Foundation for many number theory problems

**When to Use:**
- Small numbers (< 10⁹): Optimized trial division
- Multiple queries: Sieve of Eratosthenes
- Large numbers/cryptography: Miller-Rabin
- Prime generation: Segmented sieve for large ranges

Understanding primality testing and prime factorization is essential for algorithmic problem solving and forms the foundation of modern cryptography.
