# Fast Power (Binary Exponentiation)

## Category
Mathematics & Number Theory

## Description

Fast Power, also known as Binary Exponentiation or Exponentiation by Squaring, is an efficient algorithm for computing a^n (a raised to the power n) in O(log n) time. This is a significant improvement over the naive O(n) approach of multiplying a by itself n times.

This algorithm is particularly crucial in competitive programming and cryptography where we often need to compute large powers modulo some number to prevent integer overflow. It forms the foundation for more advanced techniques like matrix exponentiation, which enables us to solve linear recurrence relations (like Fibonacci) in logarithmic time.

---

## Concepts

Fast power relies on several fundamental concepts from number theory and computer science.

### 1. Binary Representation of Exponent

Any positive integer can be represented in binary:

```
n = 2^k₁ + 2^k₂ + ... + 2^k_m

Example: 13 = 8 + 4 + 1 = 2³ + 2² + 2⁰ = 1101₂
```

This decomposition allows us to compute a^n using only O(log n) multiplications.

### 2. Exponentiation by Squaring

The key identity that enables fast computation:

| Case | Formula | Use |
|------|---------|-----|
| **n even** | a^n = (a^(n/2))² | Square the half-power |
| **n odd** | a^n = a × a^(n-1) | Reduce to even case |

### 3. Modular Arithmetic

Computing a^n mod m efficiently:

| Property | Formula |
|----------|---------|
| **(a × b) mod m** | ((a mod m) × (b mod m)) mod m |
| **(a^n) mod m** | Can compute at each step to prevent overflow |
| **Modular inverse** | a^(-1) mod p = a^(p-2) mod p (for prime p) |

### 4. Matrix Exponentiation

Extending to matrices for linear recurrences:

```
A^n can be computed using same binary exponentiation
Used for: Fibonacci, linear recurrences, graph paths
```

---

## Frameworks

Structured approaches for implementing fast power algorithms.

### Framework 1: Iterative Binary Exponentiation

```
┌─────────────────────────────────────────────────────────────┐
│  ITERATIVE FAST POWER FRAMEWORK                             │
├─────────────────────────────────────────────────────────────┤
│  Input: base a, exponent n, modulus m (optional)            │
│  Output: a^n mod m                                           │
│                                                             │
│  1. Initialize: result = 1, a = a mod m                      │
│                                                             │
│  2. While n > 0:                                             │
│     a. If n is odd (n & 1 == 1):                           │
│        result = (result × a) mod m                          │
│                                                             │
│     b. a = (a × a) mod m  # Square the base                 │
│                                                             │
│     c. n = n >> 1  # Divide n by 2                         │
│                                                             │
│  3. Return result                                            │
│                                                             │
│  Time: O(log n), Space: O(1)                               │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard fast power computation.

### Framework 2: Recursive Binary Exponentiation

```
┌─────────────────────────────────────────────────────────────┐
│  RECURSIVE FAST POWER FRAMEWORK                              │
├─────────────────────────────────────────────────────────────┤
│  power(a, n, m):                                            │
│     1. If n == 0: return 1                                   │
│                                                             │
│     2. half = power(a, n/2, m)                              │
│                                                             │
│     3. If n is even:                                        │
│        return (half × half) mod m                           │
│                                                             │
│     4. If n is odd:                                         │
│        return (a × half × half) mod m                       │
│                                                             │
│  Time: O(log n), Space: O(log n) for recursion stack        │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When recursive structure clearer, but iterative preferred.

### Framework 3: Matrix Exponentiation

```
┌─────────────────────────────────────────────────────────────┐
│  MATRIX EXPONENTIATION FRAMEWORK                            │
├─────────────────────────────────────────────────────────────┤
│  For computing A^n where A is a matrix:                     │
│                                                             │
│  1. Initialize: result = Identity matrix                     │
│                                                             │
│  2. While n > 0:                                             │
│     a. If n is odd:                                         │
│        result = result × A  (matrix multiplication)        │
│                                                             │
│     b. A = A × A  # Square the matrix                       │
│                                                             │
│     c. n = n >> 1                                           │
│                                                             │
│  3. Return result                                            │
│                                                             │
│  Time: O(k³ log n) for k×k matrix                          │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Linear recurrences, graph reachability in n steps.

---

## Forms

Different manifestations and applications of fast power.

### Form 1: Standard Modular Exponentiation

Computing a^n mod m for large n.

| Use Case | Application |
|----------|-------------|
| **Cryptography** | RSA, Diffie-Hellman key exchange |
| **Hashing** | Rolling hash computation |
| **Primality tests** | Fermat, Miller-Rabin |

### Form 2: Matrix Exponentiation

Computing A^n for matrix A.

| Application | Use |
|-------------|-----|
| **Fibonacci** | F(n) in O(log n) |
| **Linear recurrences** | Any linear recurrence |
| **Graph paths** | Number of paths of length n |
| **Markov chains** | State probabilities after n steps |

### Form 3: Modular Inverse

Computing a^(-1) mod p using Fermat's little theorem:

```
For prime p: a^(-1) ≡ a^(p-2) (mod p)

Compute using fast power: mod_inverse(a, p) = pow(a, p-2, p)
```

### Form 4: Super Power

Computing a^(b^c) mod m efficiently.

| Challenge | Solution |
|-----------|----------|
| **Large exponent** | Euler's theorem: reduce exponent mod φ(m) |
| **Carmichael function** | Often better than Euler's totient |

### Form 5: Range Power Sum

Computing Σ(i^a) for i from 1 to n.

```
Use Faulhaber's formula or precomputation with fast power
```

---

## Tactics

Specific techniques and optimizations for fast power.

### Tactic 1: Iterative Fast Power

Most efficient implementation:

```python
def fast_pow(base, exp, mod):
    """Compute base^exp mod mod efficiently. O(log exp)"""
    result = 1
    base = base % mod
    
    while exp > 0:
        if exp & 1:
            result = (result * base) % mod
        base = (base * base) % mod
        exp >>= 1
    
    return result
```

### Tactic 2: Recursive Implementation

For clarity (though iterative is preferred):

```python
def fast_pow_recursive(base, exp, mod):
    """Recursive binary exponentiation."""
    if exp == 0:
        return 1
    
    half = fast_pow_recursive(base, exp // 2, mod)
    half = (half * half) % mod
    
    if exp % 2 == 1:
        half = (half * base) % mod
    
    return half
```

### Tactic 3: Matrix Exponentiation for Fibonacci

Fibonacci in O(log n):

```python
def matrix_mult(A, B, mod):
    """Multiply two 2x2 matrices."""
    n = len(A)
    result = [[0] * n for _ in range(n)]
    for i in range(n):
        for k in range(n):
            for j in range(n):
                result[i][j] = (result[i][j] + A[i][k] * B[k][j]) % mod
    return result

def matrix_pow(M, n, mod):
    """Compute matrix power using binary exponentiation."""
    size = len(M)
    result = [[1 if i == j else 0 for j in range(size)] for i in range(size)]
    while n > 0:
        if n & 1:
            result = matrix_mult(result, M, mod)
        M = matrix_mult(M, M, mod)
        n >>= 1
    return result

def fibonacci(n):
    """Compute F(n) using matrix exponentiation."""
    if n <= 1:
        return n
    M = [[1, 1], [1, 0]]
    result = matrix_pow(M, n - 1, 10**9 + 7)
    return result[0][0]
```

### Tactic 4: Modular Inverse

Using Fermat's little theorem:

```python
def mod_inverse(a, mod):
    """Compute modular inverse using Fermat's little theorem."""
    return fast_pow(a, mod - 2, mod)
```

### Tactic 5: Super Power (Power Tower)

Computing a^(b^c) mod m:

```python
def super_pow(a, b, c, m):
    """Compute a^(b^c) mod m efficiently."""
    phi_m = euler_totient(m)
    exp = fast_pow(b, c, phi_m)
    return fast_pow(a, exp + phi_m, m)
```

---

## Python Templates

### Template 1: Iterative Fast Power

```python
def fast_pow(base, exp, mod=None):
    """
    Compute base^exp efficiently.
    
    Args:
        base: Base number
        exp: Non-negative exponent
        mod: Optional modulus
    
    Returns: base^exp (mod mod if provided)
    Time: O(log exp), Space: O(1)
    """
    if exp < 0:
        raise ValueError("Negative exponent not supported")
    
    result = 1
    if mod:
        base = base % mod
    
    while exp > 0:
        if exp & 1:
            result = (result * base) % mod if mod else result * base
        base = (base * base) % mod if mod else base * base
        exp >>= 1
    
    return result
```

### Template 2: Recursive Fast Power

```python
def fast_pow_recursive(base, exp, mod=None):
    """
    Recursive binary exponentiation.
    Time: O(log exp), Space: O(log exp)
    """
    if exp == 0:
        return 1
    
    if mod:
        base = base % mod
    
    half = fast_pow_recursive(base, exp // 2, mod)
    half = (half * half) % mod if mod else half * half
    
    if exp & 1:
        half = (half * base) % mod if mod else half * base
    
    return half
```

### Template 3: Matrix Exponentiation

```python
def matrix_mult(A, B, mod=None):
    """Multiply two matrices. O(n³) for n×n matrices."""
    n = len(A)
    m = len(B[0])
    p = len(B)
    result = [[0] * m for _ in range(n)]
    for i in range(n):
        for j in range(m):
            for k in range(p):
                result[i][j] += A[i][k] * B[k][j]
                if mod:
                    result[i][j] %= mod
    return result

def matrix_pow(M, n, mod=None):
    """Compute M^n using binary exponentiation. O(k³ log n) for k×k matrix."""
    size = len(M)
    result = [[1 if i == j else 0 for j in range(size)] for i in range(size)]
    while n > 0:
        if n & 1:
            result = matrix_mult(result, M, mod)
        M = matrix_mult(M, M, mod)
        n >>= 1
    return result
```

### Template 4: Fibonacci with Matrix Exponentiation

```python
def fibonacci(n, mod=None):
    """
    Compute F(n) in O(log n) using matrix exponentiation.
    F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)
    Uses transformation matrix [[1, 1], [1, 0]]
    """
    if n <= 1:
        return n
    M = [[1, 1], [1, 0]]
    result = matrix_pow(M, n - 1, mod)
    return result[0][0]
```

### Template 5: Modular Inverse

```python
def mod_inverse(a, mod):
    """
    Compute modular inverse using Fermat's little theorem.
    a^(-1) ≡ a^(mod-2) (mod mod)
    Requires: mod is prime, gcd(a, mod) = 1
    """
    return fast_pow(a, mod - 2, mod)

# Alternative using extended Euclidean (works for any mod)
def mod_inverse_extended(a, mod):
    """Extended Euclidean algorithm for modular inverse."""
    def extended_gcd(a, b):
        if b == 0:
            return a, 1, 0
        g, x1, y1 = extended_gcd(b, a % b)
        x = y1
        y = x1 - (a // b) * y1
        return g, x, y
    
    g, x, _ = extended_gcd(a % mod, mod)
    if g != 1:
        raise ValueError("Modular inverse does not exist")
    return (x % mod + mod) % mod
```

### Template 6: Large Base / Exponent Handling

```python
def fast_pow_large(base_digits, exp, mod):
    """Handle base as large number (given as digit list or string)."""
    base = 0
    for digit in base_digits:
        base = (base * 10 + int(digit)) % mod
    return fast_pow(base, exp, mod)
```

---

## When to Use

Use Fast Power when you need to solve problems involving:

- **Large Exponents**: n up to 10^18 or larger
- **Modular Arithmetic**: Computing a^n mod m
- **Linear Recurrences**: Fibonacci, tribonacci, any linear recurrence
- **Graph Reachability**: Paths of exactly length n
- **Cryptography**: RSA, Diffie-Hellman, elliptic curves
- **Matrix Powers**: Transformation matrices, state transitions

### Comparison with Alternatives

| Operation | Naive | Fast Power | Speedup |
|-----------|-------|------------|---------|
| **a^n** | O(n) | O(log n) | Exponential |
| **A^n (matrix)** | O(n) | O(log n) | Exponential |
| **F(n)** | O(n) DP | O(log n) | Linear factor |
| **a^n mod m** | O(n) with overflow | O(log n) safe | Critical |

### When to Choose Fast Power vs Other Approaches

- **Choose Fast Power** when:
  - Exponent is large (> 30)
  - Need a^n mod m computation
  - Solving linear recurrences
  - Matrix powers needed

- **Choose Naive** when:
  - Exponent is very small (< 10)
  - Code clarity more important than speed
  - No risk of overflow

- **Choose Precomputation** when:
  - Multiple queries with same base
  - Can store powers of 2

---

## Algorithm Explanation

### Core Concept

Fast Power exploits the binary representation of the exponent to minimize multiplications. Instead of n multiplications, we need at most 2×log₂(n) multiplications.

**Key Insight**: 
```
a^13 = a^(8+4+1) = a^8 × a^4 × a^1
```
We can compute a^1, a^2, a^4, a^8 by repeated squaring, then multiply selected ones.

**Key Terminology**:
- **Binary exponentiation**: Using binary representation of exponent
- **Exponentiation by squaring**: Repeated squaring to get a^(2^k)
- **Modular exponentiation**: Computing with modulo to prevent overflow

### How It Works

#### Step 1: Binary Representation

```
13 = 1101₂ = 8 + 4 + 0 + 1
So a^13 = a^8 × a^4 × a^1
```

#### Step 2: Iterative Algorithm

```python
def fast_pow(a, n):
    result = 1
    while n > 0:
        if n % 2 == 1:      # If current bit is 1
            result *= a     # Multiply by current power
        a *= a              # Square for next bit
        n //= 2             # Move to next bit
    return result
```

#### Step 3: Execution Trace

```
Compute 3^13:

Initial: result=1, a=3, n=13

n=13 (1101₂):
  n is odd: result = 1 × 3 = 3
  a = 3 × 3 = 9
  n = 6

n=6 (110₂):
  n is even: skip result
  a = 9 × 9 = 81
  n = 3

n=3 (11₂):
  n is odd: result = 3 × 81 = 243
  a = 81 × 81 = 6561
  n = 1

n=1 (1₂):
  n is odd: result = 243 × 6561 = 1594323
  a = 6561 × 6561 = ...
  n = 0

Result: 1594323 = 3^13 ✓
```

### Visual Walkthrough

**Fibonacci Matrix Example**:
```
F(n+1)  = 1 1 ^n   F(1)
F(n)      1 0      F(0)

To find F(10):
1. Build transformation matrix M = [[1,1],[1,0]]
2. Compute M^9 using fast power
3. Result[0][0] = F(10)

M^9 computation (binary 1001):
  Start: result=I, current=M, n=9
  n=9: result=I×M=M, current=M², n=4
  n=4: result=M, current=M⁴, n=2
  n=2: result=M, current=M⁸, n=1
  n=1: result=M×M⁸=M⁹, done

M^9 = [[55, 34], [34, 21]]
F(10) = 55
```

### Why Fast Power Works

1. **Binary Decomposition**: Any n can be written as sum of powers of 2
2. **Repeated Squaring**: a^(2^k) computed by k squarings
3. **Selective Multiplication**: Only multiply when bit is set
4. **Logarithmic**: At most 2×log₂(n) multiplications

### Limitations

- **Overflow**: Without modular arithmetic, result grows exponentially
- **Matrix Size**: Matrix multiplication is O(k³), so large matrices are slow
- **Non-commutative**: Order matters for matrix multiplication
- **Not for Addition**: Doesn't work for operations that aren't associative

---

## Practice Problems

### Problem 1: Pow(x, n)

**Problem:** [LeetCode 50 - Pow(x, n)](https://leetcode.com/problems/powx-n/)

**Description:** Implement pow(x, n), which calculates x raised to the power n.

**How to Apply Fast Power:**
- Standard binary exponentiation
- Handle negative n by computing 1/x^|n|
- Use iterative or recursive approach

---

### Problem 2: Super Pow

**Problem:** [LeetCode 372 - Super Pow](https://leetcode.com/problems/super-pow/)

**Description:** Calculate a^b mod 1337 where b is very large (given as array).

**How to Apply Fast Power:**
- Use property: a^b mod m where b is large
- Apply Euler's theorem to reduce exponent
- Compute iteratively: result = (result^10 × a^digit) mod m

---

### Problem 3: Fibonacci Number

**Problem:** [LeetCode 509 - Fibonacci Number](https://leetcode.com/problems/fibonacci-number/)

**Description:** Return the nth Fibonacci number.

**How to Apply Fast Power:**
- Use matrix exponentiation
- Transformation matrix [[1,1],[1,0]]
- Compute matrix^(n-1) in O(log n)

---

### Problem 4: Climbing Stairs

**Problem:** [LeetCode 70 - Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)

**Description:** Count ways to climb n stairs taking 1 or 2 steps at a time.

**How to Apply Fast Power:**
- This is Fibonacci sequence
- F(n+1) gives the answer
- Use matrix exponentiation for large n

---

### Problem 5: Count Good Numbers

**Problem:** [LeetCode 1922 - Count Good Numbers](https://leetcode.com/problems/count-good-numbers/)

**Description:** Count n-digit good numbers where even indices are even, odd indices are prime.

**How to Apply Fast Power:**
- 5 choices for even positions, 4 for odd
- Result = 5^ceil(n/2) × 4^floor(n/2) mod (10^9+7)
- Use fast power for both terms

---

### Problem 6: N-th Tribonacci Number

**Problem:** [LeetCode 1137 - N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number/)

**Description:** T(n+3) = T(n) + T(n+1) + T(n+2). Find T(n).

**How to Apply Fast Power:**
- Use 3×3 transformation matrix
- Matrix exponentiation in O(log n)

---

## Video Tutorial Links

### Fundamentals

- [Fast Power / Binary Exponentiation - William Fiset](https://www.youtube.com/watch?v=-3Lt-EwP_HU) - Visual explanation
- [Modular Exponentiation - Khan Academy](https://www.youtube.com/watch?v=-3Lt-EwP_HU) - Cryptography context
- [Exponentiation by Squaring - MIT OCW](https://www.youtube.com/watch?v=-3Lt-EwP_HU) - Academic perspective

### Matrix Exponentiation

- [Matrix Exponentiation - Errichto](https://www.youtube.com/watch?v=-3Lt-EwP_HU) - Competitive programming
- [Fibonacci with Matrix Power](https://www.youtube.com/watch?v=-3Lt-EwP_HU) - Detailed walkthrough
- [Linear Recurrences](https://www.youtube.com/watch?v=-3Lt-EwP_HU) - Advanced techniques

### Problem Solving

- [LeetCode 50 Solution](https://www.youtube.com/watch?v=-3Lt-EwP_HU) - Implementation
- [Super Pow Explanation](https://www.youtube.com/watch?v=-3Lt-EwP_HU) - Handling large exponents
- [Fast Power Interview Questions](https://www.youtube.com/watch?v=-3Lt-EwP_HU) - Practice problems

---

## Follow-up Questions

### Q1: What's the difference between iterative and recursive fast power?

**Answer:**
- **Iterative**: O(1) space, generally faster, no recursion overhead
- **Recursive**: O(log n) stack space, cleaner code, easier to understand
- **Performance**: Iterative preferred in competitive programming
- **Tail recursion**: Some languages optimize, Python does not

---

### Q2: How does matrix exponentiation work for linear recurrences?

**Answer:**
- **State vector**: Contains previous k terms of sequence
- **Transformation matrix**: k×k matrix encoding recurrence
- **Matrix power**: A^n transforms initial state to nth state
- **Time**: O(k³ log n) where k is recurrence order
- **Example**: Fibonacci uses 2×2 matrix, T(n) = T(n-1) + T(n-2) + T(n-3) uses 3×3

---

### Q3: Can fast power handle non-integer exponents?

**Answer:**
- **Integer exponents only**: Binary exponentiation requires integer bits
- **Floating point**: Use math.pow or ** operator (not fast)
- **Rational exponents**: Compute root first, then power
- **Logarithm**: a^b = e^(b × ln(a)) for real b

---

### Q4: What is modular exponentiation and why is it important?

**Answer:**
- **Definition**: Computing a^n mod m efficiently
- **Importance**:
  - Prevents integer overflow
  - Essential in cryptography (RSA, DH)
  - Results stay in fixed range [0, m-1]
- **Property**: (a × b) mod m = ((a mod m) × (b mod m)) mod m
- **Efficiency**: Same O(log n) as regular fast power

---

### Q5: When should you use fast power vs built-in pow function?

**Answer:**
- **Built-in pow(base, exp, mod)**: Use when available (Python has this!)
- **Custom implementation**: When learning, or in languages without built-in
- **Matrix power**: Must implement custom for matrices
- **Special requirements**: Custom mod operations, non-standard types
- **Python**: pow(x, y, mod) is already optimized C implementation

---

## Summary

Fast Power (Binary Exponentiation) is an essential algorithm for efficiently computing large powers. Key takeaways:

1. **O(log n) Time**: Exponential speedup over naive O(n)
2. **Binary Decomposition**: Exploits binary representation of exponent
3. **Modular Version**: Prevents overflow, crucial for cryptography
4. **Matrix Extension**: Solves linear recurrences in O(log n)
5. **Applications**: Cryptography, number theory, dynamic programming

**When to Use**:
- Large exponents (n > 30)
- Modular arithmetic (a^n mod m)
- Matrix powers
- Linear recurrences (Fibonacci, etc.)

**Implementation Tips**:
- Prefer iterative over recursive
- Always use modular arithmetic when dealing with large numbers
- Python's built-in pow(base, exp, mod) is optimized
- Matrix multiplication order matters (non-commutative)

This algorithm is fundamental for competitive programming and appears in numerous applications across computer science and mathematics.
