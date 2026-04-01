# Fast Fourier Transform (FFT) and Number Theoretic Transform (NTT)

## Category
Advanced Algorithms / Mathematics

## Description

The **Fast Fourier Transform (FFT)** is an algorithm to compute the **Discrete Fourier Transform (DFT)** in O(n log n) time, compared to O(n²) for the naive approach. It transforms polynomial multiplication from O(n²) to O(n log n), revolutionizing fields from signal processing to competitive programming.

**Number Theoretic Transform (NTT)** is the integer equivalent of FFT that works under modular arithmetic, avoiding floating-point precision issues. NTT is preferred in competitive programming because it provides exact results and works with standard integer types.

---

## Concepts

### 1. Polynomial Representation

A polynomial can be represented in two equivalent forms:

| Form | Representation | Operations |
|------|----------------|------------|
| **Coefficient** | P(x) = a₀ + a₁x + a₂x² + ... + aₙxⁿ | Addition: O(n), Multiplication: O(n²) |
| **Point-Value** | {(x₀,P(x₀)), (x₁,P(x₁)), ..., (xₙ,P(xₙ))} | Addition: O(n), Multiplication: O(n) |

The key insight: **multiplication is O(n) in point-value form!**

### 2. Roots of Unity

The n-th roots of unity are complex numbers ω where ωⁿ = 1:

```
ω_k = e^(2πik/n) for k = 0, 1, ..., n-1
```

**Properties:**
- ωₙ^n = 1
- ωₙ^(n/2) = -1
- ωₙ^(k+n/2) = -ωₙ^k (conjugate pair property)

### 3. Butterfly Operations

The Cooley-Tukey FFT uses divide-and-conquer:

```
DFT(a)[k] = DFT(even)(k) + ω^k × DFT(odd)(k)
DFT(a)[k + n/2] = DFT(even)(k) - ω^k × DFT(odd)(k)
```

This gives the butterfly pattern that enables O(n log n) complexity.

### 4. NTT Primes

For modulus p where p = k×2^m + 1:

| Prime | Factorization | Max Power | Primitive Root |
|-------|---------------|-----------|----------------|
| 998244353 | 119×2²³ + 1 | 2²³ | 3 |
| 1004535809 | 479×2²¹ + 1 | 2²¹ | 3 |
| 469762049 | 7×2²⁶ + 1 | 2²⁶ | 3 |

---

## Frameworks

### Framework 1: Polynomial Multiplication with NTT

```
┌─────────────────────────────────────────────────────────┐
│  NTT POLYNOMIAL MULTIPLICATION FRAMEWORK                │
├─────────────────────────────────────────────────────────┤
│  1. Determine size:                                     │
│     n = smallest power of 2 ≥ (deg(A) + deg(B) + 1)     │
│                                                          │
│  2. Pad arrays with zeros to length n                   │
│                                                          │
│  3. Forward NTT: Transform both arrays                  │
│     a. Bit-reversal permutation                           │
│     b. Butterfly operations for each level               │
│                                                          │
│  4. Pointwise multiply: C[i] = A[i] × B[i] mod p        │
│                                                          │
│  5. Inverse NTT: Transform result back                   │
│     a. Same as forward but with inverse roots            │
│     b. Divide each element by n                          │
│                                                          │
│  6. Trim trailing zeros from result                     │
└─────────────────────────────────────────────────────────┘
```

### Framework 2: Convolution Framework

```
┌─────────────────────────────────────────────────────────┐
│  CONVOLUTION FRAMEWORK                                  │
├─────────────────────────────────────────────────────────┤
│  Convolution: (a * b)[k] = Σ a[i] × b[k-i]               │
│                                                          │
│  1. Pad both arrays to power of 2                       │
│  2. Apply NTT to both                                   │
│  3. Multiply pointwise                                  │
│  4. Apply inverse NTT                                   │
│  5. Result is the convolution                           │
│                                                          │
│  Applications:                                          │
│  - Signal processing                                    │
│  - String matching with wildcards                       │
│  - Large number multiplication                          │
└─────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Complex FFT (Floating Point)

Uses complex roots of unity. May have precision issues.

| Aspect | Details |
|--------|---------|
| **Domain** | Complex numbers |
| **Precision** | Floating point (may have rounding errors) |
| **Speed** | Very fast on FP hardware |
| **Use case** | Scientific computing, signal processing |

### Form 2: Number Theoretic Transform (Integer)

Uses modular arithmetic with primitive roots.

| Aspect | Details |
|--------|---------|
| **Domain** | Integers mod prime |
| **Precision** | Exact (no errors) |
| **Speed** | Fast with modular arithmetic |
| **Use case** | Competitive programming, exact computation |

### Form 3: Comparison: FFT vs NTT vs Naive

| Aspect | FFT | NTT | Naive |
|--------|-----|-----|-------|
| **Time** | O(n log n) | O(n log n) | O(n²) |
| **Precision** | Floating point | Exact | Exact |
| **Implementation** | Moderate | Moderate | Simple |
| **Best for** | Real numbers | Integers | Small inputs |

---

## Tactics

### Tactic 1: Bit-Reversal Permutation

```python
def bit_reverse(a):
    """Rearrange array so indices are in bit-reversed order."""
    n = len(a)
    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]
```

**Why**: Optimizes memory access pattern for butterfly operations.

### Tactic 2: Handling Multiple Moduli (CRT)

```python
def multiply_large_modulus(a, b):
    """Multiply polynomials with result exceeding single modulus."""
    # Use multiple NTT-friendly primes
    primes = [998244353, 1004535809, 469762049]
    
    results = []
    for p in primes:
        ntt = NTT(p)
        results.append(ntt.multiply(a, b))
    
    # Combine using Chinese Remainder Theorem
    return chinese_remainder_combine(results, primes)
```

### Tactic 3: String Matching with Wildcards

```python
def string_match_fft(text, pattern, wildcard='?'):
    """Find pattern in text using FFT for O(n log n) matching."""
    n, m = len(text), len(pattern)
    
    # For each character, create binary arrays
    matches = [0] * n
    chars = set(text + pattern) - {wildcard}
    
    for c in chars:
        text_arr = [1 if x == c else 0 for x in text]
        pattern_arr = [1 if x == c else 0 for x in reversed(pattern)]
        conv = convolution(text_arr, pattern_arr)
        for i in range(len(conv)):
            if i < len(matches):
                matches[i] += conv[i]
    
    # Find full matches
    required = m - pattern.count(wildcard)
    return [i - m + 1 for i in range(m-1, n) if matches[i] == required]
```

### Tactic 4: Large Number Multiplication

```python
def multiply_large_numbers(num1: str, num2: str) -> str:
    """Multiply big integers using NTT."""
    # Convert to digit arrays (reversed)
    a = [int(c) for c in reversed(num1)]
    b = [int(c) for c in reversed(num2)]
    
    # Multiply using NTT
    result = multiply_polynomials_ntt(a, b)
    
    # Handle carries
    carry = 0
    for i in range(len(result)):
        result[i] += carry
        carry = result[i] // 10
        result[i] %= 10
    
    while carry:
        result.append(carry % 10)
        carry //= 10
    
    # Convert back to string
    return ''.join(str(d) for d in reversed(result))
```

---

## Python Templates

### Template 1: Number Theoretic Transform

```python
MOD = 998244353  # 119 * 2^23 + 1
PRIMITIVE_ROOT = 3

def mod_pow(base, exp, mod):
    """Fast modular exponentiation."""
    result = 1
    base %= mod
    while exp > 0:
        if exp & 1:
            result = result * base % mod
        base = base * base % mod
        exp >>= 1
    return result

def ntt(a, invert):
    """
    In-place iterative Number Theoretic Transform.
    
    Args:
        a: List of coefficients (modified in place)
        invert: True for inverse NTT
    """
    n = len(a)
    
    # Bit-reversal permutation
    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]
    
    # Transform
    length = 2
    while length <= n:
        wlen = mod_pow(PRIMITIVE_ROOT, (MOD - 1) // length, MOD)
        if invert:
            wlen = mod_pow(wlen, MOD - 2, MOD)
        
        for i in range(0, n, length):
            w = 1
            half = length >> 1
            for j in range(i, i + half):
                u = a[j]
                v = a[j + half] * w % MOD
                a[j] = (u + v) % MOD
                a[j + half] = (u - v + MOD) % MOD
                w = w * wlen % MOD
        
        length <<= 1
    
    if invert:
        n_inv = mod_pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = a[i] * n_inv % MOD


def multiply_polynomials_ntt(a, b):
    """
    Multiply two polynomials using NTT.
    
    Args:
        a, b: Lists of coefficients [a0, a1, a2, ...]
    
    Returns:
        List of coefficients of the product
    """
    if not a or not b:
        return []
    
    # Find power of 2 size
    n = 1
    while n < len(a) + len(b) - 1:
        n <<= 1
    
    # Pad arrays
    fa = a + [0] * (n - len(a))
    fb = b + [0] * (n - len(b))
    
    # Forward NTT
    ntt(fa, False)
    ntt(fb, False)
    
    # Pointwise multiply
    for i in range(n):
        fa[i] = fa[i] * fb[i] % MOD
    
    # Inverse NTT
    ntt(fa, True)
    
    # Trim result
    return fa[:len(a) + len(b) - 1]
```

### Template 2: Fast Fourier Transform (Complex)

```python
import math
import cmath

def fft(a, invert):
    """
    Cooley-Tukey FFT algorithm.
    
    Args:
        a: List of complex numbers (modified in place)
        invert: True for inverse FFT
    """
    n = len(a)
    
    # Bit-reversal permutation
    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]
    
    # Transform
    length = 2
    while length <= n:
        ang = 2 * math.pi / length * (-1 if invert else 1)
        wlen = complex(math.cos(ang), math.sin(ang))
        
        for i in range(0, n, length):
            w = 1
            half = length >> 1
            for j in range(i, i + half):
                u = a[j]
                v = a[j + half] * w
                a[j] = u + v
                a[j + half] = u - v
                w *= wlen
        
        length <<= 1
    
    if invert:
        for i in range(n):
            a[i] /= n


def multiply_polynomials_fft(a, b):
    """
    Multiply polynomials using FFT.
    Note: May have precision issues for large numbers.
    """
    n = 1
    while n < len(a) + len(b) - 1:
        n <<= 1
    
    fa = [complex(x, 0) for x in a] + [0j] * (n - len(a))
    fb = [complex(x, 0) for x in b] + [0j] * (n - len(b))
    
    fft(fa, False)
    fft(fb, False)
    
    for i in range(n):
        fa[i] *= fb[i]
    
    fft(fa, True)
    
    # Round to nearest integer
    result = [int(round(fa[i].real)) for i in range(len(a) + len(b) - 1)]
    return result
```

### Template 3: Convolution

```python
def convolution(a, b):
    """
    Compute convolution of two arrays.
    c[k] = sum(a[i] * b[k-i]) for all valid i
    
    Time: O(n log n) using NTT
    """
    return multiply_polynomials_ntt(a, b)


def circular_convolution(a, b):
    """Circular convolution (for same-length arrays)."""
    n = len(a)
    result = [0] * n
    for i in range(n):
        for j in range(n):
            result[(i + j) % n] += a[i] * b[j]
    return result
```

### Template 4: Large Number Multiplication

```python
def multiply_large_numbers(num1: str, num2: str) -> str:
    """
    Multiply two large numbers (as strings) using NTT.
    Handles numbers with thousands of digits.
    """
    if num1 == "0" or num2 == "0":
        return "0"
    
    # Convert to digit arrays (reversed for least significant first)
    a = [int(c) for c in reversed(num1)]
    b = [int(c) for c in reversed(num2)]
    
    # Multiply using NTT
    result = multiply_polynomials_ntt(a, b)
    
    # Handle carries
    carry = 0
    for i in range(len(result)):
        result[i] += carry
        carry = result[i] // 10
        result[i] %= 10
    
    while carry:
        result.append(carry % 10)
        carry //= 10
    
    # Remove leading zeros and convert back
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    
    return ''.join(str(d) for d in reversed(result))
```

### Template 5: String Matching with FFT

```python
def string_match_with_wildcard(text, pattern, wildcard='?'):
    """
    Find all positions where pattern matches text (with wildcard support).
    Uses FFT for O(n log n) matching.
    """
    n, m = len(text), len(pattern)
    if m > n:
        return []
    
    matches = [0] * n
    chars = set(text + pattern)
    if wildcard in chars:
        chars.remove(wildcard)
    
    for c in chars:
        # Create binary arrays
        a = [1 if x == c else 0 for x in text]
        b = [1 if x == c else 0 for x in reversed(pattern)]
        
        conv = convolution(a, b)
        
        for i in range(len(conv)):
            if i < len(matches):
                matches[i] += conv[i]
    
    # Find positions with full match
    required = m - pattern.count(wildcard)
    return [i - m + 1 for i in range(m - 1, n) if matches[i] == required]
```

---

## When to Use

Use FFT/NTT when you need to:

- **Multiply Large Polynomials**: Degrees > 1000
- **Compute Convolutions**: Signal processing, probability distributions
- **String Pattern Matching**: With wildcard matching in O(n log n)
- **Large Integer Multiplication**: Numbers with 200+ digits
- **Count Subset Sums**: For large sets

### Comparison: FFT vs NTT vs Naive

| Aspect | FFT | NTT | Naive |
|--------|-----|-----|-------|
| Domain | Complex | Integers mod prime | Integers |
| Precision | Floating errors | Exact | Exact |
| Speed | Very fast | Fast | Slow |
| Best for | Scientific computing | Competitive programming | Small inputs |
| Time | O(n log n) | O(n log n) | O(n²) |

### When to Choose FFT vs NTT

- **Choose FFT** when:
  - Working with real/complex numbers
  - Scientific computing applications
  - Precision loss is acceptable

- **Choose NTT** when:
  - Working with integers only
  - Exact results required
  - Competitive programming

---

## Algorithm Explanation

### Core Concept

The fundamental insight is that **polynomial multiplication is O(n) in point-value form**. The strategy is:

1. **Evaluate**: Convert coefficient form → point-value form at roots of unity
2. **Multiply**: Pointwise multiplication in O(n)
3. **Interpolate**: Convert back using Inverse FFT

### How It Works

**Forward Transform (Evaluation):**
1. Bit-reversal permutation for cache efficiency
2. Butterfly operations combining pairs of values
3. Each level doubles the interval size

**Pointwise Multiplication:**
- Multiply corresponding values: C[i] = A[i] × B[i]

**Inverse Transform (Interpolation):**
1. Same as forward but with inverse roots
2. Divide by n at the end

### Visual Representation

```
Polynomial A(x) = 1 + 2x + 3x²
Polynomial B(x) = 4 + 5x

Coefficient form:
A = [1, 2, 3]
B = [4, 5]

Pad to size 4 (next power of 2):
A = [1, 2, 3, 0]
B = [4, 5, 0, 0]

    ↓ NTT (Forward)
    
Point-value form at 4th roots of unity:
Â = [6, -2-2i, 2, -2+2i]
B̂ = [9, 4-5i, -1, 4+5i]

    ↓ Pointwise Multiply
    
Ĉ = [54, -18+2i, -2, -18-2i]

    ↓ Inverse NTT
    
C = [4, 13, 22, 15] representing 4 + 13x + 22x² + 15x³ ✓
```

### Why It Works

- **Roots of unity**: Special points where polynomial evaluation is efficient
- **Divide and conquer**: Splitting problem in half at each level
- **Butterfly pattern**: Exploits symmetry of roots for efficiency
- **Convolution theorem**: Multiplication in time domain = convolution in frequency domain

### Limitations

- **Size must be power of 2**: Standard Cooley-Tukey requires this
- **Precision issues**: FFT with floating point may have rounding errors
- **Modulus constraints**: NTT requires special primes
- **Overhead**: For small inputs (n < 100), naive O(n²) is faster

---

## Practice Problems

### Problem 1: Multiply Strings

**Problem:** [LeetCode 43 - Multiply Strings](https://leetcode.com/problems/multiply-strings/)

**Description:** Given two non-negative integers `num1` and `num2` represented as strings, return the product of `num1` and `num2`, also represented as a string. Note: You must not use any built-in BigInteger library.

**How to Apply FFT/NTT:**
- Convert strings to digit arrays
- Use NTT for O(n log n) multiplication
- Handle carries after multiplication
- Essential for very large numbers (200+ digits)

---

### Problem 2: Closest Subsequence Sum

**Problem:** [LeetCode 1755 - Closest Subsequence Sum](https://leetcode.com/problems/closest-subsequence-sum/)

**Description:** You are given an integer array `nums` and an integer `goal`. You want to choose a subsequence of `nums` such that the sum of its elements is the closest possible to `goal`. Return the minimum possible absolute difference.

**How to Apply FFT/NTT:**
- Use FFT to efficiently compute all possible subset sums
- Represent array as polynomial where x^num has coefficient 1
- Polynomial multiplication gives all subset sum combinations

---

### Problem 3: Maximum Number of Ways to Partition an Array

**Problem:** [LeetCode 2025 - Maximum Number of Ways to Partition an Array](https://leetcode.com/problems/maximum-number-of-ways-to-partition-an-array/)

**Description:** You are given a 0-indexed integer array `nums` of length `n`. The number of ways to partition `nums` is the number of pivot indices that satisfy both conditions. You are also given an integer `k`. You can change one element in nums to `k`. Return the maximum possible number of ways to partition nums after changing at most one element.

**How to Apply FFT/NTT:**
- Use convolution to count frequency differences
- FFT helps compute prefix-sum related quantities efficiently
- Handle large constraints with O(n log n) approach

---

### Problem 4: Subtree Removal Game with Fibonacci Tree

**Problem:** [LeetCode 2005 - Subtree Removal Game with Fibonacci Tree](https://leetcode.com/problems/subtree-removal-game-with-fibonacci-tree/)

**Description:** A Fibonacci tree is a binary tree created using the order function `order(n)`. Return the number of nodes Alice can remove if both players play optimally in a game on a Fibonacci tree of order `n`.

**How to Apply FFT/NTT:**
- Use polynomial exponentiation with NTT
- Compute Fibonacci-like recurrences with convolution
- Optimize large state transitions using FFT

---

### Problem 5: Count Pairs Of Nodes With Connection

**Problem:** [LeetCode 1782 - Count Pairs Of Nodes With Connection](https://leetcode.com/problems/count-pairs-of-nodes-with-connection/)

**Description:** You are given an undirected graph defined by `n` nodes numbered from `1` to `n`, and an edge list `edges`. You are also given a queries array. For each query, find the number of pairs of nodes (a, b) that satisfy the condition.

**How to Apply FFT/NTT:**
- Use convolution to count degree pair frequencies
- FFT accelerates the frequency counting from O(n²) to O(n log n)
- Handle edge cases with degree distribution analysis

---

## Video Tutorial Links

### Fundamentals

- [FFT Introduction (Take U Forward)](https://www.youtube.com/watch?v=h7apO7q16V0)
- [Number Theoretic Transform (Errichto)](https://www.youtube.com/watch?v=1vZsw8Lpx14)
- [FFT Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=Ty0JcR-cD-0)
- [Polynomial Multiplication using FFT](https://www.youtube.com/watch?v=FAUkq8DWKjg)

### Advanced Topics

- [NTT Implementation Deep Dive (CP-Algorithms)](https://cp-algorithms.com/algebra/fft.html)
- [FFT for String Matching](https://www.youtube.com/watch?v=6KCSJdD8r7s)
- [Chinese Remainder Theorem with NTT](https://www.youtube.com/watch?v=zOxUnKXB4Xc)

### Competitive Programming

- [FFT for CP (Codeforces)](https://www.youtube.com/watch?v=2gA3Ezm3POk)
- [Convolution Problems](https://www.youtube.com/watch?v=h7apO7l1j4o)

---

## Follow-up Questions

### Q1: When should I use NTT over FFT?

**Answer:** Use NTT when you need **exact integer results** with no floating-point errors. Use FFT when working with real/complex numbers in scientific computing. NTT is preferred in competitive programming because it provides exact arithmetic under modular constraints.

### Q2: What if the result exceeds the NTT modulus?

**Answer:** Use multiple NTT-friendly primes and combine results using the Chinese Remainder Theorem. Common approach: use 2-3 primes like 998244353, 1004535809, 469762049, then combine. Alternatively, use 128-bit FFT with careful rounding for intermediate steps.

### Q3: Why must n be a power of 2?

**Answer:** The Cooley-Tukey algorithm requires divide-and-conquer splitting in half at each step. The butterfly operations rely on this structure. If n is not a power of 2, pad with zeros to the next power of 2. Alternative algorithms (Bluestein's) exist for arbitrary sizes but are more complex.

### Q4: How do I handle precision issues in FFT?

**Answer:** Use `int(round(x))` after inverse FFT. Check if values are within 0.5 of nearest integer. Use `long double` (80-bit) instead of double for better precision. For best results, use NTT which has no precision issues.

### Q5: What's the maximum polynomial degree FFT/NTT can handle?

**Answer:** Practical limits depend on implementation:
- Time O(n log n) allows up to ~10^7 coefficients
- Memory O(n) allows ~10^8 elements with sufficient RAM
- NTT modulus limits final result size
- Typical CP limit: n ≤ 2^20 (~1 million)

---

## Summary

FFT/NTT is a powerful algorithmic technique for polynomial multiplication, convolution, and large number arithmetic.

**Key Takeaways:**
- **Polynomial multiplication**: O(n log n) vs O(n²)
- **Choose NTT for CP**: Exact results, no precision issues
- **Power of 2**: Always pad to next power of 2
- **O(n log n)**: Exponentially faster for large inputs

**When to use:**
- ✅ Polynomial degrees > 1000
- ✅ Large integer multiplication (> 200 digits)
- ✅ Convolution with large arrays
- ✅ String matching with wildcards
- ❌ Small inputs (overhead not worth it)
- ❌ When exact integer results not needed (use FFT)

Mastering FFT/NTT is essential for advanced competitive programming and algorithmic problem solving.
