# Miller-Rabin Primality Test

## Category
Math & Number Theory

## Description

The **Miller-Rabin primality test** is a probabilistic algorithm to determine if a number is prime. Unlike deterministic tests that become impractically slow for large numbers, Miller-Rabin is efficient and works well for numbers up to cryptographic sizes (hundreds or thousands of digits).

The algorithm is based on algebraic properties of prime numbers and uses randomization to achieve high confidence in its results. When Miller-Rabin declares a number "composite", the number is **definitely composite**; when it declares a number "prime", there's a small probability of error that can be made arbitrarily small by repeating the test with different random bases.

---

## Concepts

The Miller-Rabin test is built on several fundamental number theory concepts.

### 1. Fermat's Little Theorem

If `p` is prime and `a` is any integer such that 1 ≤ a < p:

```
a^(p-1) ≡ 1 (mod p)
```

This means that for a prime `p`, raising any valid base `a` to the power of `p-1` gives 1 modulo `p`.

### 2. Strong Pseudoprime Test

For a prime `p > 2`, write `p - 1 = d × 2^s` where `d` is odd. For any base `a` where 1 ≤ a < p, one of the following must be true:

```
Either: a^d ≡ 1 (mod p)
Or:     a^(d×2^r) ≡ -1 (mod p) for some 0 ≤ r < s
```

This is called the **strong pseudoprime test**. If `n` is composite but passes this test for some base `a`, then `n` is called a **strong pseudoprime** to base `a`.

### 3. Witnesses and Liars

| Term | Definition | Effect |
|------|------------|--------|
| **Witness** | Base `a` that proves `n` is composite | Fails strong pseudoprime test |
| **Strong Liar** | Base `a` that incorrectly suggests `n` is prime | Passes test despite `n` being composite |

**Key Theorem**: For an odd composite `n`, at most 1/4 of all bases are strong liars. This means at least 3/4 of bases are witnesses.

### 4. Deterministic Variants

For numbers below certain bounds, testing against specific bases is **provably deterministic**:

| Upper Bound for n | Sufficient Bases |
|-------------------|------------------|
| n < 2,047 | {2} |
| n < 1,373,653 | {2, 3} |
| n < 3,215,031,751 | {2, 3, 5, 7} |
| n < 2^64 | {2, 325, 9375, 28178, 450775, 9780504, 1795265022} |

---

## Frameworks

Structured approaches for primality testing.

### Framework 1: Probabilistic Miller-Rabin

```
┌─────────────────────────────────────────────────────┐
│  PROBABILISTIC MILLER-RABIN FRAMEWORK               │
├─────────────────────────────────────────────────────┤
│  1. Handle edge cases:                              │
│     - If n < 2: return False (not prime)            │
│     - If n == 2 or n == 3: return True            │
│     - If n is even: return False                  │
│  2. Write n-1 as d × 2^s where d is odd:          │
│     - d = n - 1                                    │
│     - While d is even: d = d / 2, s += 1          │
│  3. Witness loop (repeat k times):                │
│     a. Choose random base a in [2, n-2]            │
│     b. Compute x = a^d mod n (modular pow)         │
│     c. If x == 1 or x == n-1: continue (passes)   │
│     d. For r in range(s-1):                        │
│        - x = x^2 mod n                              │
│        - If x == n-1: break (passes)               │
│     e. If loop completes: return False (composite) │
│  4. Return True (probably prime after k rounds)     │
└─────────────────────────────────────────────────────┘
```

**When to use**: Large numbers, probabilistic result acceptable, need flexibility.

### Framework 2: Deterministic Miller-Rabin (64-bit)

```
┌─────────────────────────────────────────────────────┐
│  DETERMINISTIC MILLER-RABIN (64-bit) FRAMEWORK      │
├─────────────────────────────────────────────────────┤
│  1. Handle small primes and edge cases             │
│  2. Check divisibility by small primes first       │
│     - Test against primes up to 37                 │
│  3. Write n-1 as d × 2^s                           │
│  4. For each base a in {2, 325, 9375, 28178,        │
│     450775, 9780504, 1795265022}:                 │
│     a. Skip if a % n == 0                          │
│     b. Run strong pseudoprime test                 │
│     c. If any base proves composite: return False │
│  5. Return True (definitely prime for n < 2^64)   │
└─────────────────────────────────────────────────────┘
```

**When to use**: 64-bit integers, guaranteed correctness needed.

### Framework 3: Hybrid Approach

```
┌─────────────────────────────────────────────────────┐
│  HYBRID PRIMALITY TEST FRAMEWORK                    │
├─────────────────────────────────────────────────────┤
│  1. Small number check (n < 10^6):                 │
│     - Use trial division with primes up to sqrt(n) │
│  2. Medium number check (10^6 <= n < 2^64):      │
│     - Use deterministic Miller-Rabin                 │
│  3. Large number check (n >= 2^64):                 │
│     - Use probabilistic Miller-Rabin with k=40+   │
│  4. Return result                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: General purpose, handling various input sizes optimally.

---

## Forms

Different manifestations of primality testing.

### Form 1: Probabilistic Testing

Multiple rounds with random bases:

| Rounds (k) | Error Probability | Use Case |
|------------|-------------------|----------|
| 5 | < 0.1% | Fast checks, non-critical |
| 10 | < 0.0001% | Standard competitive programming |
| 20 | < 10^-12 | Scientific computing |
| 40 | < 10^-24 | Cryptographic applications |

### Form 2: Deterministic for 32-bit

For n < 2^32, only 3 bases needed: {2, 7, 61}

```
Guaranteed correct for all 32-bit integers
Time: O(log³ n) with just 3 rounds
Space: O(1)
```

### Form 3: Deterministic for 64-bit

For n < 2^64, use 7 specific bases:
{2, 325, 9375, 28178, 450775, 9780504, 1795265022}

```
Guaranteed correct for all 64-bit integers
Time: O(log³ n) with 7 rounds
Space: O(1)
```

### Form 4: Batch Testing

Test multiple numbers efficiently:

```
Strategy:
1. Precompute small primes up to 1000
2. For each number, check small factors first
3. Run Miller-Rabin only if no small factors found
4. Cache results for repeated queries
```

### Form 5: Prime Generation

Generate random primes for cryptographic use:

```
Algorithm:
1. Generate random odd number with desired bit length
2. Test with Miller-Rabin
3. If not prime, increment by 2 and retest
4. Return when prime found
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Fast Modular Exponentiation

Efficiently compute a^d mod n:

```python
def mod_pow(base: int, exp: int, mod: int) -> int:
    """Fast modular exponentiation using binary exponentiation."""
    result = 1
    base %= mod
    while exp > 0:
        if exp & 1:  # If exp is odd
            result = (result * base) % mod
        base = (base * base) % mod
        exp >>= 1  # Divide exp by 2
    return result
```

Time: O(log exp)

### Tactic 2: Small Prime Pre-check

Check small primes first for efficiency:

```python
def is_prime_64(n: int) -> bool:
    """Deterministic primality test for 64-bit integers."""
    if n < 2:
        return False
    
    # Small primes check
    small_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
    for p in small_primes:
        if n == p:
            return True
        if n % p == 0:
            return False
    
    # ... continue with Miller-Rabin
```

### Tactic 3: Handling Large Exponents

For very large exponents, use Python's built-in:

```python
# Python's pow with three arguments is optimized
x = pow(base, d, n)  # Computes (base^d) % n efficiently
```

### Tactic 4: Batch Testing with Shared Precomputation

Test multiple numbers sharing small prime checks:

```python
def batch_is_prime(numbers: list[int]) -> list[bool]:
    """Test multiple numbers efficiently."""
    small_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
    results = []
    
    for n in numbers:
        is_composite = False
        for p in small_primes:
            if p * p > n:
                break
            if n % p == 0:
                is_composite = (n != p)
                break
        
        if is_composite:
            results.append(False)
        elif n in small_primes:
            results.append(True)
        else:
            results.append(is_prime_64(n))
    
    return results
```

### Tactic 5: Parallel Testing

Multiple Miller-Rabin rounds are independent:

```python
from concurrent.futures import ThreadPoolExecutor
import random

def parallel_miller_rabin(n: int, k: int = 20, workers: int = 4) -> bool:
    """Parallel Miller-Rabin using multiple threads."""
    def test_single_round(args):
        n, _ = args
        a = random.randrange(2, n - 1)
        return single_round_test(n, a)  # Returns True if passes
    
    with ThreadPoolExecutor(max_workers=workers) as executor:
        results = list(executor.map(
            test_single_round, 
            [(n, i) for i in range(k)]
        ))
    
    return all(results)  # All rounds must pass
```

### Tactic 6: Baillie-PSW Test

Combine Miller-Rabin with Lucas test (no known counterexamples):

```python
def baillie_psw(n: int) -> bool:
    """
    Baillie-PSW primality test.
    No known composite passes this test.
    """
    # Step 1: Trial division for small primes
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0:
        return False
    
    # Step 2: Miller-Rabin with base 2
    if not miller_rabin_single(n, 2):
        return False
    
    # Step 3: Lucas primality test
    # (Implementation of Lucas test here)
    return lucas_test(n)
```

---

## Python Templates

### Template 1: Modular Exponentiation

```python
def mod_pow(base: int, exp: int, mod: int) -> int:
    """
    Template 1: Fast modular exponentiation using binary exponentiation.
    Computes (base^exp) % mod efficiently.
    
    Time: O(log exp), Space: O(1)
    """
    result = 1
    base %= mod
    while exp > 0:
        # If exp is odd, multiply base with result
        if exp & 1:
            result = (result * base) % mod
        # exp must be even now
        base = (base * base) % mod
        exp >>= 1
    return result
```

### Template 2: Probabilistic Miller-Rabin

```python
import random

def miller_rabin(n: int, k: int = 5) -> bool:
    """
    Template 2: Probabilistic Miller-Rabin primality test.
    
    Args:
        n: Number to test for primality
        k: Number of rounds (higher = more accurate, default 5)
    
    Returns:
        False if n is definitely composite
        True if n is probably prime (error probability < 4^(-k))
    
    Time: O(k × log³ n), Space: O(1)
    """
    # Handle edge cases
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0:
        return False
    
    # Write n-1 as d * 2^s where d is odd
    d = n - 1
    s = 0
    while d % 2 == 0:
        d //= 2
        s += 1
    
    # Witness loop - test k random bases
    for _ in range(k):
        # Choose random base a in range [2, n-2]
        a = random.randrange(2, n - 1)
        x = mod_pow(a, d, n)
        
        # If x == 1 or x == n-1, this base passes
        if x == 1 or x == n - 1:
            continue
        
        # Square x up to s-1 times
        for _ in range(s - 1):
            x = (x * x) % n
            if x == n - 1:
                break
        else:
            # If we never hit n-1, a is a witness to compositeness
            return False
    
    # Probably prime after k rounds
    return True
```

### Template 3: Deterministic Miller-Rabin (64-bit)

```python
def is_prime_64(n: int) -> bool:
    """
    Template 3: Deterministic primality test for 64-bit integers.
    Fastest implementation for competitive programming.
    Uses 7 bases proven sufficient by Jim Sinclair.
    
    Time: O(log³ n), Space: O(1)
    """
    if n < 2:
        return False
    
    # Small primes check
    small_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
    for p in small_primes:
        if n == p:
            return True
        if n % p == 0:
            return False
    
    # Write n-1 as d * 2^s
    d = n - 1
    s = 0
    while d % 2 == 0:
        d //= 2
        s += 1
    
    # Bases sufficient for n < 2^64
    bases = [2, 325, 9375, 28178, 450775, 9780504, 1795265022]
    
    for a in bases:
        if a % n == 0:
            continue
        
        x = mod_pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        
        for _ in range(s - 1):
            x = (x * x) % n
            if x == n - 1:
                break
        else:
            return False
    
    return True
```

### Template 4: Prime Generation

```python
def generate_large_prime(bits: int, k: int = 40) -> int:
    """
    Template 4: Generate a random prime number with specified bit length.
    
    Args:
        bits: Number of bits for the prime
        k: Number of Miller-Rabin rounds (default 40 for high confidence)
    
    Returns:
        A random prime number with the specified bit length
    
    Time: O(bits × k × log³ n) expected
    """
    while True:
        # Generate random odd number with exact bit length
        n = random.getrandbits(bits)
        # Set MSB to ensure correct bit length, LSB to ensure odd
        n |= (1 << (bits - 1)) | 1
        
        if miller_rabin(n, k):
            return n
```

### Template 5: Optimized 32-bit Test

```python
def is_prime_32(n: int) -> bool:
    """
    Template 5: Deterministic Miller-Rabin for 32-bit integers.
    Only 3 bases needed for guaranteed correctness.
    
    Time: O(log³ n), Space: O(1)
    """
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0:
        return False
    
    # Check small primes
    for p in [3, 5, 7, 11, 13, 17, 19, 23, 29, 31]:
        if n == p:
            return True
        if n % p == 0:
            return False
    
    # Write n-1 as d * 2^s
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2
        s += 1
    
    # 3 bases sufficient for n < 2,152,302,898,747
    for a in [2, 7, 61]:
        if a >= n:
            continue
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(s - 1):
            x = (x * x) % n
            if x == n - 1:
                break
        else:
            return False
    return True
```

---

## When to Use

Use the Miller-Rabin primality test when you need to solve problems involving:

- **Very Large Numbers**: When n > 10^12 (too large for trial division)
- **Cryptographic Applications**: Generating large primes for RSA, Diffie-Hellman key exchange, elliptic curve cryptography
- **Competitive Programming**: Problems with large prime constraints (n up to 10^18)
- **Primality Testing in Real-time**: Quick checks with controllable error probability
- **Randomized Algorithms**: When deterministic tests are too slow

### Comparison with Alternative Primality Tests

| Test Type | Use Case | Time Complexity | Error Probability | Practical Limit |
|-----------|----------|-----------------|-------------------|-----------------|
| **Trial Division** | n < 10^6 | O(√n) | 0 (deterministic) | ~10^6 |
| **Sieve of Eratosthenes** | Generate all primes ≤ n | O(n log log n) | 0 | ~10^7 |
| **Miller-Rabin (probabilistic)** | n > 10^12 | O(k × log³ n) | < 4^-k | Unlimited |
| **Miller-Rabin (deterministic)** | n < 2^64 | O(log³ n) | 0 | 2^64 |
| **AKS Primality Test** | Theoretical | O(log^6 n) | 0 | Impractical |
| **Lucas-Lehmer** | Mersenne primes | O(k × log² n) | 0 | 2^p - 1 form only |

### When to Choose Miller-Rabin vs Deterministic Methods

**Choose Miller-Rabin when:**
- Testing individual large numbers (> 10^12)
- High performance is required
- Small error probability (e.g., < 10^-30) is acceptable
- Working with cryptographic-sized numbers (1024+ bits)

**Choose Trial Division when:**
- Testing small numbers (< 10^6)
- Guaranteed correctness is required without complex implementation
- Memory is extremely limited

**Choose Sieve when:**
- Need to test many numbers in a range
- Can precompute primes up to √max_value
- Range is not too large (≤ 10^7)

---

## Algorithm Explanation

### Core Concept: The Strong Pseudoprime Test

For a prime `p > 2`, we can write `p - 1 = d × 2^s` where `d` is odd. For any base `a` where 1 ≤ a < p, one of the following must be true:

```
Either: a^d ≡ 1 (mod p)
Or:     a^(d×2^r) ≡ -1 (mod p) for some 0 ≤ r < s
```

This is called the **strong pseudoprime test**.

### How It Works

1. **Handle edge cases**: Small numbers and even numbers
2. **Factor n-1**: Write as d × 2^s where d is odd
3. **Witness loop**: For each round:
   - Choose random base a
   - Compute x = a^d mod n
   - If x == 1 or x == n-1, base passes
   - Otherwise, square x up to s-1 times, checking if x == n-1
   - If never reach n-1, found a witness (composite)
4. **Result**: After k rounds with no witnesses, n is probably prime

### Visual Representation

```
Testing n = 561 (a Carmichael number, composite)

Step 1: Factor n-1 = 560 = 35 × 2^4
        So d = 35, s = 4

Step 2: Choose base a = 2
        Compute x = 2^35 mod 561
        
        2^35 mod 561 = 263
        
        Since 263 ≠ 1 and 263 ≠ 560:
          Square: 263² mod 561 = 166
          Square: 166² mod 561 = 67
          Square: 67² mod 561 = 1
        
        We never hit -1 (560), so 2 is a WITNESS!
        561 is definitely COMPOSITE.

Step 3: If no witness found after k rounds,
        n is PROBABLY PRIME (error < 4^-k)
```

### Why Miller-Rabin Works

- **Fermat's Little Theorem**: Forms the foundation
- **Strong pseudoprime test**: Tighter condition than Fermat
- **Witness density**: At least 3/4 of bases are witnesses for composites
- **Error probability**: < 4^-k after k rounds

### Limitations

- **Probabilistic nature**: Can produce false positives (rarely)
- **Never false negatives**: Composite declaration is always correct
- **Parameter selection**: Number of rounds affects accuracy
- **Carmichael numbers**: Can fool Fermat test but not Miller-Rabin

---

## Practice Problems

### Problem 1: Prime Palindrome

**Problem:** [LeetCode 866 - Prime Palindrome](https://leetcode.com/problems/prime-palindrome/)

**Description:** Find the smallest prime palindrome greater than or equal to n.

**How to Apply Miller-Rabin:**
- Generate palindromes efficiently by mirroring digits
- Use Miller-Rabin to test each palindrome for primality
- The deterministic version ensures accuracy for all test cases

---

### Problem 2: Count Primes

**Problem:** [LeetCode 204 - Count Primes](https://leetcode.com/problems/count-primes/)

**Description:** Count the number of primes less than n.

**How to Apply Miller-Rabin:**
- For small n (< 10^6), use Sieve of Eratosthenes
- For segment counting with large ranges, use Miller-Rabin to test candidates
- Segmented sieve with Miller-Rabin for base primes when n is very large

---

### Problem 3: Closest Prime Numbers in Range

**Problem:** [LeetCode 2523 - Closest Prime Numbers in Range](https://leetcode.com/problems/closest-prime-numbers-in-range/)

**Description:** Given two positive integers left and right, find the two closest prime numbers in the range [left, right].

**How to Apply Miller-Rabin:**
- Iterate through the range and use Miller-Rabin for primality testing
- Track the closest pair as you find primes
- The O(1) space of Miller-Rabin is advantageous for large ranges

---

### Problem 4: Construct Product Matrix

**Problem:** [LeetCode 2906 - Construct Product Matrix](https://leetcode.com/problems/construct-product-matrix/)

**Description:** Given a 2D grid, construct a product matrix. This problem requires modular inverse computation.

**How to Apply Miller-Rabin:**
- Use Miller-Rabin to find large primes for modulus selection
- Generate a prime modulus > 10^9 to prevent overflow
- Use `is_prime_64()` to verify generated primes

---

### Problem 5: kth Smallest Prime Fraction

**Problem:** [LeetCode 786 - K-th Smallest Prime Fraction](https://leetcode.com/problems/k-th-smallest-prime-fraction/)

**Description:** Given a sorted array of prime numbers, find the k-th smallest prime fraction.

**How to Apply Miller-Rabin:**
- First generate all primes up to the maximum value using a sieve
- Verify primes with Miller-Rabin for larger values
- Binary search on fraction values combined with two-pointer technique

---

## Video Tutorial Links

### Fundamentals

- [Miller-Rabin Primality Test (Numberphile)](https://www.youtube.com/watch?v=8G75aHkC6-I) - Intuitive introduction with visualizations
- [Miller-Rabin Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=8tW2zY3bJ7k) - Detailed step-by-step implementation
- [Primality Testing (MIT OpenCourseWare)](https://www.youtube.com/watch?v=znfKo0N1-KY) - Theoretical foundations

### Advanced Topics

- [Deterministic Miller-Rabin for 64-bit](https://www.youtube.com/watch?v=2gA3Ezm3POk) - Implementation details for competitive programming
- [Cryptographic Prime Generation](https://www.youtube.com/watch?v=1RC3SfxwYhQ) - RSA key generation using Miller-Rabin
- [AKS vs Miller-Rabin](https://www.youtube.com/watch?v=dQw4w9WgXcQ) - Comparing deterministic and probabilistic approaches

### Competitive Programming

- [Prime Numbers in CP (Codeforces)](https://www.youtube.com/watch?v=2G7RzlxTnpI) - Practical CP applications
- [Fast Primality Testing (Tushar Roy)](https://www.youtube.com/watch?v=2gA3Ezm3POk) - Implementation strategies
- [Number Theory for CP (Errichto)](https://www.youtube.com/watch?v=1CGfP3nValA) - Comprehensive number theory including primality

---

## Follow-up Questions

### Q1: What is the exact error probability of Miller-Rabin?

**Answer:** For a composite odd number `n`, at most **1/4** of all bases in the range [2, n-2] are strong liars. Therefore:
- Single round error probability: ≤ 1/4
- k rounds error probability: ≤ (1/4)^k = 4^-k

**Practical examples:**
- k=5: error < 0.1%
- k=10: error < 0.0001%
- k=20: error < 10^-12
- k=40: error < 10^-24 (cryptographic standard)

For truly paranoid applications, use the deterministic variant with known bases.

---

### Q2: Is there any composite number that passes all Miller-Rabin tests?

**Answer:** **Yes** - Carmichael numbers (like 561, 41041, 825265) are composites that are "pseudoprime" to many bases. However:
- No composite number passes Miller-Rabin for **all** bases
- For any composite n, at least 3/4 of bases are witnesses
- The deterministic variants use mathematically proven sets of bases that catch all composites below specific bounds

**Carmichael numbers** are the reason we need multiple rounds - a single base might be a liar, but finding k consecutive liars is extremely unlikely (probability < 4^-k).

---

### Q3: When should I use trial division instead of Miller-Rabin?

**Answer:** Use trial division when:
1. **n < 10^6**: Trial division with primes up to √n is faster
2. **Memory is extremely limited**: Trial division uses O(1) space without big integer support
3. **Deterministic result required**: And implementing deterministic Miller-Rabin is too complex
4. **Simpler code is priority**: Trial division is easier to write correctly

**Hybrid approach:** Use trial division for small factors first, then Miller-Rabin:
```python
def is_prime_hybrid(n):
    # Trial division for small primes
    for p in small_primes:
        if n % p == 0:
            return n == p
    # Miller-Rabin for remaining (no small factors)
    return is_prime_64(n)
```

---

### Q4: How do I choose the number of rounds k?

**Answer:** Choose k based on your error tolerance:

| Application | Recommended k | Reason |
|-------------|---------------|--------|
| Competitive Programming | 5-10 | Fast, negligible error |
| Hash table sizing | 5-10 | Non-critical application |
| Cryptography (RSA) | 40+ | Security critical |
| Scientific computing | 20-30 | Publication quality |
| 64-bit integers | Use deterministic | Zero error, same speed |

**Trade-off:** Each additional round multiplies runtime by ~1.3x but reduces error by 4x.

---

### Q5: Can Miller-Rabin be parallelized?

**Answer:** **Yes**, the rounds are completely independent:

```python
from concurrent.futures import ThreadPoolExecutor

def parallel_miller_rabin(n, k=20, workers=4):
    """Parallel Miller-Rabin using multiple threads."""
    def test_single_round(args):
        n, _ = args
        a = random.randrange(2, n - 1)
        return single_round_test(n, a)  # Returns True if passes
    
    with ThreadPoolExecutor(max_workers=workers) as executor:
        results = list(executor.map(
            test_single_round, 
            [(n, i) for i in range(k)]
        ))
    
    return all(results)  # All rounds must pass
```

**Benefits:**
- Near-linear speedup with cores for large n
- Each thread needs minimal memory
- Perfect for cryptographic applications testing very large numbers

**Note:** For 64-bit integers, the deterministic version (7 bases) is already so fast that parallelization offers little benefit.

---

## Summary

The **Miller-Rabin primality test** is the most versatile and widely-used primality testing algorithm, offering an excellent balance of speed, accuracy, and simplicity.

### Key Takeaways

| Aspect | Key Point |
|--------|-----------|
| **Type** | Probabilistic (can be made deterministic for fixed ranges) |
| **Accuracy** | Error < 4^-k for k rounds (practically zero for k≥20) |
| **Speed** | O(k × log³ n) - polynomial in number of bits |
| **Space** | O(1) extra space beyond the number itself |
| **Best for** | Large numbers (n > 10^12), cryptographic applications |

### When to Use

- ✅ **Cryptographic prime generation** - Generate 1024+ bit primes
- ✅ **Competitive programming** - Test numbers up to 10^18 efficiently
- ✅ **Probabilistic algorithms** - When tiny error probability is acceptable
- ✅ **Large number factorization** - As a subroutine in Pollard's Rho
- ❌ **Small numbers** (< 10^6) - Use trial division instead
- ❌ **Generating all primes up to n** - Use Sieve of Eratosthenes instead

### Deterministic Variants

For critical applications requiring 100% accuracy:
- **64-bit integers**: Use 7 specific bases for guaranteed correctness
- **32-bit integers**: Use only 3 bases for faster testing
- **Arbitrary precision**: Use Baillie-PSW (no known counterexamples)

### Final Recommendation

For **competitive programming** and **technical interviews**, use the deterministic 64-bit variant with the 7 bases. It's:
- Just as fast as the probabilistic version
- 100% accurate for all test cases
- Simple to implement and remember

For **cryptographic applications**, use 40+ rounds of the probabilistic test or the deterministic variant appropriate for your key size.