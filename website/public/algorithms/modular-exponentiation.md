# Modular Exponentiation

## Category
Math & Number Theory

## Description

Modular Exponentiation (also known as **Binary Exponentiation** or **Fast Exponentiation**) is an efficient algorithm to compute `(base^exp) % mod` in **O(log exp)** time complexity. This is essential in cryptography, competitive programming, and mathematical applications where dealing with extremely large numbers is necessary.

The algorithm leverages the binary representation of the exponent to break down the computation into a series of squaring operations, dramatically reducing the number of multiplications needed from O(exp) to O(log exp).

---

## Concepts

The Modular Exponentiation technique is built on several fundamental concepts.

### 1. Binary Representation of Exponent

The key insight is breaking down the exponent using its binary representation:

```
exp = b_k × 2^k + b_{k-1} × 2^{k-1} + ... + b_1 × 2^1 + b_0 × 2^0

Where each b_i is either 0 or 1 (the binary digits).

Therefore:
base^exp = base^(b_k × 2^k) × base^(b_{k-1} × 2^{k-1}) × ... × base^(b_0 × 2^0)
```

This means we only need to compute powers of the form `base^(2^i)` and multiply the relevant ones together.

### 2. Modular Arithmetic Properties

Essential properties for efficient computation:

| Property | Formula | Usage |
|----------|---------|-------|
| **Mod of product** | (a × b) mod m = ((a mod m) × (b mod m)) mod m | Keep intermediate results small |
| **Mod of power** | (a^b) mod m = ((a mod m)^b) mod m | Reduce base first |
| **Associativity** | ((a mod m) × (b mod m)) mod m = (a × b) mod m | Order of operations |

### 3. Repeated Squaring

Compute powers efficiently by squaring:

```
base^1    = base
base^2    = (base)^2
base^4    = (base^2)^2
base^8    = (base^4)^2
base^16   = (base^8)^2
...
```

Each power is computed from the previous by one squaring operation.

### 4. Combining Results

Multiply selected powers based on binary representation:

```
Example: base^13 where 13 = 1101_2 = 8 + 4 + 1

base^13 = base^8 × base^4 × base^1
        = (base^8) × (base^4) × (base)
```

---

## Frameworks

Structured approaches for modular exponentiation.

### Framework 1: Iterative Binary Exponentiation

```
┌─────────────────────────────────────────────────────┐
│  ITERATIVE BINARY EXPONENTIATION FRAMEWORK          │
├─────────────────────────────────────────────────────┤
│  1. Handle edge cases:                              │
│     - If mod == 1, return 0                         │
│     - If exp == 0, return 1                         │
│  2. Reduce base: base = base % mod                  │
│  3. Initialize result = 1                           │
│  4. While exp > 0:                                  │
│     a. If exp is odd (exp & 1):                    │
│        - result = (result × base) % mod            │
│     b. Square base: base = (base × base) % mod      │
│     c. Halve exp: exp = exp >> 1                  │
│  5. Return result                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: General case, O(1) space needed, production code.

### Framework 2: Recursive Binary Exponentiation

```
┌─────────────────────────────────────────────────────┐
│  RECURSIVE BINARY EXPONENTIATION FRAMEWORK          │
├─────────────────────────────────────────────────────┤
│  1. Base cases:                                     │
│     - If exp == 0, return 1                         │
│     - If mod == 1, return 0                         │
│  2. Reduce base: base = base % mod                  │
│  3. If exp is even:                                 │
│     - Return power(base^2 mod mod, exp/2, mod)     │
│  4. If exp is odd:                                  │
│     - Return (base × power(base^2 mod mod,         │
│       (exp-1)/2, mod)) % mod                        │
└─────────────────────────────────────────────────────┘
```

**When to use**: Clean code, mathematical clarity, when recursion depth acceptable.

### Framework 3: Modular Inverse using Fermat's Little Theorem

```
┌─────────────────────────────────────────────────────┐
│  MODULAR INVERSE FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  For prime mod: a^(-1) ≡ a^(mod-2) (mod mod)        │
│                                                     │
│  1. Verify mod is prime (or gcd(a, mod) = 1)       │
│  2. Compute inverse = power(a, mod-2, mod)         │
│  3. Verify: (a × inverse) % mod == 1               │
│  4. Return inverse                                  │
└─────────────────────────────────────────────────────┘
```

**When to use**: Division in modular arithmetic, modular inverse needed.

---

## Forms

Different manifestations of modular exponentiation.

### Form 1: Standard Modular Exponentiation

Compute (base^exp) % mod:

| Implementation | Time | Space | Best For |
|---------------|------|-------|----------|
| **Iterative** | O(log exp) | O(1) | General use |
| **Recursive** | O(log exp) | O(log exp) | Clean code |
| **Built-in** | O(log exp) | O(1) | Python's pow(base, exp, mod) |

### Form 2: Modular Inverse

Compute multiplicative inverse:

```
For prime mod:
a^(-1) mod mod = a^(mod-2) mod mod

Example:
7^(-1) mod 13 = 7^11 mod 13 = 2
Verification: 7 × 2 = 14 ≡ 1 (mod 13) ✓
```

### Form 3: Large Factorial mod p

Compute n! % mod:

```python
def mod_factorial(n, mod):
    result = 1
    for i in range(2, n + 1):
        result = (result * i) % mod
    return result
```

### Form 4: Binomial Coefficient mod p

Compute C(n, r) % mod:

```
C(n, r) = n! / (r! × (n-r)!)

In modular arithmetic:
C(n, r) mod p = n! × (r!)^(-1) × ((n-r)!)^(-1) mod p
```

### Form 5: Matrix Exponentiation

Apply to matrix powers for linear recurrences:

```
Compute M^exp mod mod for matrix M:
- Same binary exponentiation algorithm
- Matrix multiplication instead of integer multiplication
- Time: O(k³ log exp) for k×k matrix
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Python Built-in Optimization

Use Python's optimized built-in:

```python
# Python's built-in pow with 3 arguments is optimized
result = pow(base, exp, mod)  # Computes (base^exp) % mod

# Much faster than:
# result = (base ** exp) % mod  # This can overflow!
```

### Tactic 2: Handling Negative Exponents

When you need to compute `base^(-exp) mod mod`:

```python
def power_negative(base: int, exp: int, mod: int) -> int:
    """
    Compute (base^exp) % mod, handling negative exponents.
    Requires: base and mod are coprime, mod is prime
    """
    if exp >= 0:
        return power_iterative(base, exp, mod)
    else:
        # base^(-exp) = (base^(-1))^exp = (base^(mod-2))^exp (mod mod)
        inv = mod_inverse(base, mod)
        return power_iterative(inv, -exp, mod)
```

### Tactic 3: Precomputation for Multiple Queries

When answering many queries with the same base:

```python
class PrecomputedPower:
    """Precompute powers for fast O(log exp) queries."""
    
    def __init__(self, base, mod):
        self.mod = mod
        self.base = base % mod
        self.precomputed = [1, self.base]  # base^0, base^1
        
        # Precompute base^(2^i) for i up to log2(max_exp)
        for i in range(1, 64):  # Up to 2^64
            next_pow = (self.precomputed[-1] * self.precomputed[-1]) % mod
            self.precomputed.append(next_pow)
    
    def query(self, exp):
        """Answer query in O(log exp) with fewer multiplications."""
        result = 1
        i = 0
        while exp > 0:
            if exp & 1:
                result = (result * self.precomputed[i + 1]) % self.mod
            exp >>= 1
            i += 1
        return result
```

### Tactic 4: Euler's Theorem Optimization

Reduce exponent when base and mod are coprime:

```
If gcd(base, mod) = 1:
    base^exp ≡ base^(exp % φ(mod)) (mod mod)

Where φ is Euler's totient function.

For prime p:
    φ(p) = p - 1
    base^exp ≡ base^(exp % (p-1)) (mod p)
```

### Tactic 5: Matrix Exponentiation for Recurrences

Solve linear recurrences efficiently:

```python
def matrix_mult(A, B, mod):
    """Multiply two matrices modulo mod."""
    n = len(A)
    result = [[0] * n for _ in range(n)]
    for i in range(n):
        for k in range(n):
            for j in range(n):
                result[i][j] = (result[i][j] + A[i][k] * B[k][j]) % mod
    return result

def matrix_power(M, exp, mod):
    """Compute M^exp mod mod using binary exponentiation."""
    n = len(M)
    # Initialize result as identity matrix
    result = [[1 if i == j else 0 for j in range(n)] for i in range(n)]
    
    base = M
    while exp > 0:
        if exp & 1:
            result = matrix_mult(result, base, mod)
        base = matrix_mult(base, base, mod)
        exp >>= 1
    
    return result
```

---

## Python Templates

### Template 1: Iterative Modular Exponentiation

```python
def mod_pow_iterative(base: int, exp: int, mod: int) -> int:
    """
    Template 1: Iterative binary exponentiation.
    Time: O(log exp), Space: O(1)
    """
    if mod == 1:
        return 0
    
    result = 1
    base = base % mod
    
    while exp > 0:
        # If exp is odd, multiply result by base
        if exp & 1:
            result = (result * base) % mod
        
        # Square the base
        base = (base * base) % mod
        
        # Halve the exponent
        exp >>= 1
    
    return result
```

### Template 2: Recursive Modular Exponentiation

```python
def mod_pow_recursive(base: int, exp: int, mod: int) -> int:
    """
    Template 2: Recursive binary exponentiation.
    Time: O(log exp), Space: O(log exp)
    """
    if mod == 1:
        return 0
    if exp == 0:
        return 1
    
    base = base % mod
    
    if exp & 1:  # Odd
        return (base * mod_pow_recursive((base * base) % mod, exp // 2, mod)) % mod
    else:  # Even
        return mod_pow_recursive((base * base) % mod, exp // 2, mod)
```

### Template 3: Modular Inverse

```python
def mod_inverse(a: int, mod: int) -> int:
    """
    Template 3: Modular multiplicative inverse using Fermat's Little Theorem.
    Requires: mod is prime, a and mod are coprime
    
    a^(-1) ≡ a^(mod-2) (mod mod)
    
    Time: O(log mod)
    """
    if mod == 1:
        return 0
    return mod_pow_iterative(a % mod, mod - 2, mod)
```

### Template 4: Binomial Coefficient

```python
def mod_factorial(n: int, mod: int) -> int:
    """Compute n! % mod."""
    result = 1
    for i in range(2, n + 1):
        result = (result * i) % mod
    return result

def mod_ncr(n: int, r: int, mod: int) -> int:
    """
    Template 4: Compute nCr % mod using modular arithmetic.
    nCr = n! / (r! × (n-r)!)
    
    Time: O(n log mod)
    """
    if r > n or r < 0:
        return 0
    if r == 0 or r == n:
        return 1
    
    # Use Fermat's Little Theorem for division
    num = mod_factorial(n, mod)
    den = (mod_factorial(r, mod) * mod_factorial(n - r, mod)) % mod
    
    return (num * mod_inverse(den, mod)) % mod
```

### Template 5: Matrix Exponentiation

```python
def matrix_mult(A: list[list[int]], B: list[list[int]], mod: int) -> list[list[int]]:
    """Multiply two matrices modulo mod."""
    n = len(A)
    m = len(B[0])
    p = len(B)
    
    result = [[0] * m for _ in range(n)]
    for i in range(n):
        for k in range(p):
            for j in range(m):
                result[i][j] = (result[i][j] + A[i][k] * B[k][j]) % mod
    return result

def matrix_pow(M: list[list[int]], exp: int, mod: int) -> list[list[int]]:
    """
    Template 5: Compute M^exp mod mod using binary exponentiation.
    Time: O(n³ log exp) for n×n matrix
    """
    n = len(M)
    # Initialize result as identity matrix
    result = [[1 if i == j else 0 for j in range(n)] for i in range(n)]
    
    base = M
    while exp > 0:
        if exp & 1:
            result = matrix_mult(result, base, mod)
        base = matrix_mult(base, base, mod)
        exp >>= 1
    
    return result
```

---

## When to Use

Use Modular Exponentiation when you need to solve problems involving:

- **Large Power Computations**: Computing `a^b mod m` where `b` is very large (up to 10^18 or more)
- **Cryptographic Applications**: RSA encryption, Diffie-Hellman key exchange, modular inverse calculations
- **Number Theory Problems**: Fermat's Little Theorem applications, computing modular inverses
- **Combinatorics**: Computing nCr mod p, factorial mod p for large n
- **Matrix Exponentiation**: Fast computation of matrix powers for linear recurrences
- **Cycle Detection**: Problems involving repeated modular operations

### Comparison with Alternatives

| Method | Time Complexity | Space Complexity | Use Case |
|--------|-----------------|------------------|----------|
| **Naive Multiplication** | O(exp) | O(1) | Only for very small exponents |
| **Binary Exponentiation** | O(log exp) | O(1) iterative, O(log exp) recursive | Standard approach for large exponents |
| **Precomputation** | O(√exp) preprocessing, O(1) query | O(√exp) | When same base, multiple queries |
| **Euler's Theorem** | O(log exp) with reduction | O(1) | When base and mod are coprime |

### When to Choose Which Approach

- **Choose Binary Exponentiation** when:
  - You need to compute single or few power operations
  - The exponent is large (up to 10^18)
  - Memory is constrained

- **Choose Precomputation** when:
  - You have many queries with the same base
  - Query time is more critical than preprocessing time

- **Apply Euler's Theorem** when:
  - `base` and `mod` are coprime
  - You can reduce `exp` to `exp % φ(mod)` for faster computation

---

## Algorithm Explanation

### Core Concept

The key insight behind Modular Exponentiation is that we can break down the exponent using its **binary representation**:

```
exp = b_k × 2^k + b_{k-1} × 2^{k-1} + ... + b_1 × 2^1 + b_0 × 2^0

Where each b_i is either 0 or 1 (the binary digits).
```

Therefore:
```
base^exp = base^(b_k × 2^k) × base^(b_{k-1} × 2^{k-1}) × ... × base^(b_0 × 2^0)
```

This means we only need to compute powers of the form `base^(2^i)` and multiply the relevant ones together.

### How It Works

#### Iterative Approach:

1. **Initialize**: `result = 1`, `base = base % mod`
2. **While exp > 0**:
   - If `exp` is **odd**: `result = (result × base) % mod`
   - `base = (base × base) % mod` (square the base)
   - `exp = exp // 2` (halve the exponent)
3. **Return** `result`

#### Recursive Approach:

The recursive solution follows the same logic:
- **Base case**: If `exp == 0`, return 1
- **If exp is even**: return `power(base^2 mod mod, exp/2, mod)`
- **If exp is odd**: return `(base × power(base^2 mod mod, (exp-1)/2, mod)) % mod`

### Visual Representation

Computing `3^13 mod 100`:

```
Binary representation of 13: 1101_2 = 8 + 4 + 1

3^13 = 3^8 × 3^4 × 3^1

Step-by-step building:
  3^1 = 3                      (use: yes, bit 0 is 1)
  3^2 = 9                      (use: no,  bit 1 is 0)
  3^4 = 81                     (use: yes, bit 2 is 1)
  3^8 = 6561 ≡ 61 (mod 100)   (use: yes, bit 3 is 1)

Result: 3 × 81 × 61 = 14823 ≡ 23 (mod 100)
```

### Why It Works

- **Binary decomposition**: Any number can be written as sum of powers of 2
- **Repeated squaring**: Each power is computed from previous by one multiplication
- **Modular reduction**: Keep intermediate results small to prevent overflow
- **Correctness**: Follows from properties of modular arithmetic

### Limitations

- **Overflow risk**: Without modulo, intermediate results grow exponentially
- **Negative exponents**: Require modular inverse (only exists if coprime)
- **Non-coprime case**: Euler's theorem only applies when gcd(base, mod) = 1
- **Matrix size**: Matrix exponentiation is O(n³ log exp) - expensive for large matrices

---

## Practice Problems

### Problem 1: Pow(x, n)

**Problem:** [LeetCode 50 - Pow(x, n)](https://leetcode.com/problems/powx-n/)

**Description:** Implement `pow(x, n)`, which calculates `x` raised to the power `n` (i.e., `x^n`). Handle negative exponents.

**How to Apply Modular Exponentiation:**
- This is the classic application - implement binary exponentiation
- Handle negative `n` by computing `1/x^|n|`
- Be careful with edge cases: `n = 0`, `x = 0`, `x = 1`, `x = -1`

---

### Problem 2: Super Pow

**Problem:** [LeetCode 372 - Super Pow](https://leetcode.com/problems/super-pow/)

**Description:** Your task is to calculate `a^b mod 1337` where `a` is a positive integer and `b` is an extremely large positive integer given in the form of an array.

**How to Apply Modular Exponentiation:**
- Use property: `a^b mod m = (a^(b/10))^10 × a^(b%10) mod m`
- Process digits of `b` from left to right
- Apply modular exponentiation at each step

---

### Problem 3: Count Good Numbers

**Problem:** [LeetCode 1922 - Count Good Numbers](https://leetcode.com/problems/count-good-numbers/)

**Description:** A digit string is good if the digits at even indices are even and digits at odd indices are prime (2, 3, 5, 7). Return the total number of good digit strings of length `n` modulo `10^9 + 7`.

**How to Apply Modular Exponentiation:**
- Even positions: 5 choices (0, 2, 4, 6, 8)
- Odd positions: 4 choices (2, 3, 5, 7)
- Answer: `5^ceil(n/2) × 4^floor(n/2) mod (10^9 + 7)`
- Use fast exponentiation for large powers

---

### Problem 4: Find the Value of the Partition

**Problem:** [LeetCode 2748 - Find the Value of the Partition](https://leetcode.com/problems/find-the-value-of-the-partition/)

**Description:** (Follow-up) This problem requires understanding of number theory and can be extended using modular arithmetic for large number handling.

**Related Problem:** [LeetCode 2455 - Average Value of Even Numbers That Are Divisible by Three](https://leetcode.com/problems/average-value-of-even-numbers-that-are-divisible-by-three/)

**How to Apply Modular Exponentiation:**
- While not directly about exponentiation, understanding modular arithmetic is crucial
- Practice modular inverse for division operations

---

### Problem 5: Matrix Block Sum

**Problem:** [LeetCode 1314 - Matrix Block Sum](https://leetcode.com/problems/matrix-block-sum/)

**Related Advanced Problem:** [LeetCode 1220 - Count Vowels Permutation](https://leetcode.com/problems/count-vowels-permutation/)

**Description:** Given an integer `n`, return the number of strings of length `n` that consist only of vowels (a, e, i, o, u) and are lexicographically sorted. This is a matrix exponentiation problem.

**How to Apply Modular Exponentiation:**
- Build transition matrix representing valid vowel sequences
- Use matrix exponentiation to compute `M^n` in O(log n) time
- Each matrix multiplication is standard modular arithmetic

---

## Video Tutorial Links

### Fundamentals

- [Modular Exponentiation - Binary Exponentiation (Take U Forward)](https://www.youtube.com/watch?v=tTuVa1P65lE) - Comprehensive introduction with code
- [Fast Exponentiation (WilliamFiset)](https://www.youtube.com/watch?v=4H0tXCLv044) - Detailed explanation with visualizations
- [Modular Arithmetic (NeetCode)](https://www.youtube.com/watch?v=4iPrBzuDCBc) - Practical applications in competitive programming

### Advanced Topics

- [Matrix Exponentiation for Linear Recurrences](https://www.youtube.com/watch?v=VLi2n16V3L0) - Solving Fibonacci and similar problems
- [Modular Inverse using Fermat's Little Theorem](https://www.youtube.com/watch?v=60yA6xHpMJ8) - Division in modular arithmetic
- [Euler's Theorem and Totient Function](https://www.youtube.com/watch?v=OuH2NyCDH1s) - Advanced optimizations

### Competitive Programming

- [Number Theory for Competitive Programming](https://www.youtube.com/watch?v=HO2aRo2eZDc) - Comprehensive number theory course
- [CP-Algorithms: Binary Exponentiation](https://cp-algorithms.com/algebra/binary-exp.html) - Written reference with problems

---

## Follow-up Questions

### Q1: Why does modular exponentiation work? Can you prove its correctness?

**Answer:** 
The correctness follows from these mathematical properties:

1. **(a × b) mod m = ((a mod m) × (b mod m)) mod m**
   - This allows us to take mod at each step

2. **Binary decomposition**: Any number can be written as sum of powers of 2
   - `exp = Σ(b_i × 2^i)` where `b_i ∈ {0, 1}`
   - `base^exp = Π(base^(b_i × 2^i))`

3. **Induction proof**:
   - Base case: `exp = 0`, returns 1 ✓
   - Inductive step: Algorithm correctly handles both even and odd cases

---

### Q2: How do you handle division in modular arithmetic?

**Answer:**
In modular arithmetic, division is multiplication by the **modular multiplicative inverse**:
- `a / b ≡ a × b^(-1) (mod m)`
- `b^(-1)` exists iff `gcd(b, m) = 1`
- Using Fermat's Little Theorem (when m is prime): `b^(-1) ≡ b^(m-2) (mod m)`

Example: `7 / 3 mod 11 = 7 × 3^(-1) mod 11 = 7 × 4 mod 11 = 6`

---

### Q3: What's the difference between modular exponentiation and matrix exponentiation?

**Answer:**
- **Modular Exponentiation**: Computes `a^n mod m` for integers
- **Matrix Exponentiation**: Computes `M^n` for matrices
  - Uses the same binary exponentiation algorithm
  - Matrix multiplication replaces integer multiplication
  - Time: O(k³ log n) for k×k matrices
  - Applications: Linear recurrences (Fibonacci), graph paths

---

### Q4: How do you compute `a^b^c mod m` efficiently?

**Answer:**
Use **Euler's theorem** to reduce the exponent:
1. Compute `exp = b^c mod φ(m)` (if a and m are coprime)
2. Compute `a^exp mod m`

If not coprime, use **Carmichael function** or handle carefully with Chinese Remainder Theorem.

This is known as **tetration** or iterated exponentiation.

---

### Q5: Can we do better than O(log n) for single queries?

**Answer:**
For a single query, **O(log n) is optimal** because:
- We need to examine each bit of the exponent
- There are log₂(n) bits in n
- Each bit potentially affects the result

However, with **preprocessing**:
- O(√n) preprocessing allows O(1) queries (baby-step giant-step)
- Useful when many queries share the same base

---

## Summary

Modular Exponentiation is a fundamental algorithm for efficiently computing large powers modulo a number. Key takeaways:

- **Binary decomposition**: Break exponent into binary representation
- **Repeated squaring**: Square base at each step
- **Modular reduction**: Keep numbers small by applying mod at each step
- **Time**: O(log exp), Space: O(1) iterative, O(log exp) recursive

When to use:
- ✅ Computing large powers (e.g., `a^b mod m` where b > 10^9)
- ✅ Cryptographic applications (RSA, Diffie-Hellman)
- ✅ Number theory problems (modular inverses, nCr)
- ✅ Matrix exponentiation for linear recurrences

When NOT to use:
- ❌ Small exponents (naive multiplication is fine)
- ❌ When overflow isn't a concern
- ❌ Without understanding modular arithmetic properties

Mastering modular exponentiation is essential for competitive programming and technical interviews, as it forms the foundation for many advanced algorithms in number theory and cryptography.