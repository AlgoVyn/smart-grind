# GCD (Euclidean Algorithm)

## Category
Math & Number Theory

## Description

The Euclidean Algorithm is one of the oldest and most efficient algorithms for computing the Greatest Common Divisor (GCD) of two integers. Dating back to ancient Greece (circa 300 BC), it uses a beautiful mathematical property to reduce the problem size exponentially at each step, making it remarkably fast even for very large numbers.

The algorithm is fundamental in number theory and has widespread applications in cryptography, simplifying fractions, computing modular inverses, and solving Diophantine equations. Its O(log(min(a, b))) time complexity makes it the preferred method for GCD computation in all practical scenarios.

---

## Concepts

The Euclidean Algorithm is built on several fundamental concepts that make it efficient and elegant.

### 1. Divisibility and Common Divisors

| Term | Definition | Example |
|------|------------|---------|
| **Divisor** | d divides a if a = d×k for some integer k | 3 divides 12 (12 = 3×4) |
| **Common Divisor** | d divides both a and b | 4 is a common divisor of 12 and 20 |
| **GCD** | Largest common divisor of a and b | gcd(12, 20) = 4 |
| **Coprime** | gcd(a, b) = 1 (no common factors except 1) | 8 and 15 are coprime |

### 2. The Key Property

The fundamental property that makes the algorithm work:

```
gcd(a, b) = gcd(b, a mod b)
```

Any common divisor of a and b must also divide a mod b.

### 3. Convergence

At each step, the second number becomes significantly smaller:

| Step | a | b | a mod b |
|------|---|---|---------|
| 1 | 48 | 18 | 12 |
| 2 | 18 | 12 | 6 |
| 3 | 12 | 6 | 0 |
| Result | 6 | 0 | - |

The algorithm terminates when b = 0, and a is the GCD.

### 4. LCM Relationship

The relationship between GCD and LCM:

```
gcd(a, b) × lcm(a, b) = |a × b|
lcm(a, b) = |a × b| / gcd(a, b)
```

---

## Frameworks

Structured approaches for implementing and using the Euclidean Algorithm.

### Framework 1: Iterative GCD Template

```
┌─────────────────────────────────────────────────────┐
│  ITERATIVE EUCLIDEAN ALGORITHM FRAMEWORK             │
├─────────────────────────────────────────────────────┤
│  1. Take absolute values of inputs                   │
│  2. While b ≠ 0:                                     │
│     a. temp = b                                      │
│     b. b = a mod b                                   │
│     c. a = temp                                      │
│  3. Return a (the GCD)                               │
└─────────────────────────────────────────────────────┘
```

**When to use**: Standard GCD computation, production code, O(1) space.

### Framework 2: Extended GCD Template

```
┌─────────────────────────────────────────────────────┐
│  EXTENDED EUCLIDEAN ALGORITHM FRAMEWORK                │
├─────────────────────────────────────────────────────┤
│  1. Base case: if b = 0, return (a, 1, 0)           │
│  2. Recursive: (g, x1, y1) = extended_gcd(b, a%b)   │
│  3. Compute:                                         │
│     - x = y1                                         │
│     - y = x1 - (a//b) × y1                          │
│  4. Return (g, x, y) where ax + by = g               │
└─────────────────────────────────────────────────────┘
```

**When to use**: Modular inverse, Diophantine equations, Bézout coefficients.

### Framework 3: Array GCD Template

```
┌─────────────────────────────────────────────────────┐
│  ARRAY GCD COMPUTATION FRAMEWORK                      │
├─────────────────────────────────────────────────────┤
│  1. If array is empty, return 0                      │
│  2. Initialize result = array[0]                    │
│  3. For each element in array[1:]:                  │
│     a. result = gcd(result, element)                 │
│     b. If result = 1: break (early exit)            │
│  4. Return result                                    │
└─────────────────────────────────────────────────────┘
```

**When to use**: Computing GCD of multiple numbers.

---

## Forms

Different manifestations and applications of the Euclidean Algorithm.

### Form 1: Basic GCD Computation

Standard two-number GCD computation.

| Implementation | Time | Space | Use Case |
|----------------|------|-------|----------|
| Iterative | O(log(min(a,b))) | O(1) | Production code |
| Recursive | O(log(min(a,b))) | O(log(min(a,b))) | Educational, cleaner code |

### Form 2: Extended GCD

Compute GCD and Bézout coefficients simultaneously.

```python
# Returns (g, x, y) such that ax + by = g = gcd(a, b)
def extended_gcd(a, b):
    if b == 0:
        return (a, 1, 0)
    g, x1, y1 = extended_gcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return (g, x, y)
```

### Form 3: Binary GCD (Stein's Algorithm)

Division-free variant using bit operations:

```
1. If both even: gcd(2a, 2b) = 2 × gcd(a, b)
2. If one even: gcd(2a, b) = gcd(a, b) when b is odd
3. If both odd: gcd(a, b) = gcd(|a-b|/2, min(a, b))
```

### Form 4: Array GCD

GCD of multiple numbers using associativity:

```
gcd(a, b, c) = gcd(gcd(a, b), c)
```

### Form 5: LCM via GCD

Compute LCM using the GCD-LCM relationship:

```python
def lcm(a, b):
    if a == 0 or b == 0:
        return 0
    return abs(a * b) // gcd(a, b)
```

---

## Tactics

Specific techniques and optimizations for GCD computation.

### Tactic 1: Iterative vs Recursive

Iterative is preferred for production:

```python
# Iterative - O(1) space, preferred for production
def gcd_iterative(a, b):
    a, b = abs(a), abs(b)
    while b != 0:
        a, b = b, a % b
    return a

# Recursive - cleaner but O(log n) stack space
def gcd_recursive(a, b):
    return abs(a) if b == 0 else gcd_recursive(b, a % b)
```

**Recommendation**: Use iterative to avoid stack overflow for large inputs.

### Tactic 2: Handling Edge Cases

```python
def gcd_robust(a, b):
    """Handle all edge cases properly."""
    # Handle zeros
    if a == 0 and b == 0:
        return 0  # Mathematically undefined, but return 0
    if a == 0:
        return abs(b)
    if b == 0:
        return abs(a)
    
    # Handle negatives
    a, b = abs(a), abs(b)
    
    # Standard Euclidean algorithm
    while b != 0:
        a, b = b, a % b
    
    return a
```

### Tactic 3: Extended GCD for Modular Inverse

```python
def mod_inverse(a, m):
    """
    Compute modular inverse of a modulo m.
    Returns x such that (a * x) % m = 1.
    Returns None if inverse doesn't exist.
    """
    def extended_gcd(a, b):
        if b == 0:
            return (a, 1, 0)
        g, x1, y1 = extended_gcd(b, a % b)
        x = y1
        y = x1 - (a // b) * y1
        return (g, x, y)
    
    g, x, _ = extended_gcd(a % m, m)
    if g != 1:
        return None  # Inverse doesn't exist
    return (x % m + m) % m  # Ensure positive result


# Example: 3 × 4 = 12 ≡ 1 (mod 11)
print(mod_inverse(3, 11))  # Output: 4
```

### Tactic 4: Early Termination for Array GCD

```python
def gcd_array(numbers):
    """Compute GCD with early termination optimization."""
    if not numbers:
        return 0
    
    result = numbers[0]
    for num in numbers[1:]:
        result = gcd(result, num)
        if result == 1:
            return 1  # Early exit - GCD can't get smaller
    
    return result
```

### Tactic 5: Binary GCD (Stein's Algorithm)

Use when division is expensive:

```python
def gcd_binary(a, b):
    """
    Stein's Binary GCD Algorithm.
    Uses only subtraction, bit shifts, and comparisons.
    Useful when division is expensive.
    """
    a, b = abs(a), abs(b)
    
    if a == 0:
        return b
    if b == 0:
        return a
    
    # Find common factor of 2
    shift = 0
    while ((a | b) & 1) == 0:  # Both even
        shift += 1
        a >>= 1
        b >>= 1
    
    # Remove remaining factors of 2 from a
    while (a & 1) == 0:
        a >>= 1
    
    # Main loop
    while b != 0:
        while (b & 1) == 0:
            b >>= 1
        
        if a > b:
            a, b = b, a
        
        b = b - a
    
    return a << shift
```

---

## Python Templates

### Template 1: Basic GCD (Iterative)

```python
def gcd(a: int, b: int) -> int:
    """
    Compute GCD using iterative Euclidean algorithm.
    
    Args:
        a, b: Two integers (can be negative or zero)
    
    Returns:
        Greatest Common Divisor of a and b (always non-negative)
    
    Time: O(log(min(a, b)))
    Space: O(1)
    """
    a, b = abs(a), abs(b)
    
    while b != 0:
        a, b = b, a % b
    
    return a
```

### Template 2: Extended GCD

```python
def extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """
    Extended Euclidean Algorithm.
    
    Returns (g, x, y) where:
    - g = gcd(a, b)
    - x, y are Bézout coefficients: ax + by = g
    
    Used for modular inverse and solving Diophantine equations.
    
    Time: O(log(min(a, b)))
    Space: O(log(min(a, b))) for recursion stack
    """
    if b == 0:
        return (abs(a), 1 if a >= 0 else -1, 0)
    
    g, x1, y1 = extended_gcd(b, a % b)
    
    x = y1
    y = x1 - (a // b) * y1
    
    return (g, x, y)


# Iterative version (more space efficient)
def extended_gcd_iterative(a: int, b: int) -> tuple[int, int, int]:
    """
    Iterative Extended Euclidean Algorithm.
    Space: O(1)
    """
    x0, x1 = 1, 0
    y0, y1 = 0, 1
    
    a, b = abs(a), abs(b)
    original_a = a
    
    while b != 0:
        q = a // b
        a, b = b, a - q * b
        x0, x1 = x1, x0 - q * x1
        y0, y1 = y1, y0 - q * y1
    
    if original_a < 0:
        x0 = -x0
    
    return (a, x0, y0)
```

### Template 3: LCM and Array GCD

```python
def lcm(a: int, b: int) -> int:
    """
    Least Common Multiple using GCD.
    
    Formula: lcm(a, b) = |a * b| / gcd(a, b)
    
    Time: O(log(min(a, b)))
    """
    if a == 0 or b == 0:
        return 0
    return abs(a * b) // gcd(a, b)


def gcd_array(numbers: list[int]) -> int:
    """
    Compute GCD of an array of numbers.
    Uses associativity: gcd(a, b, c) = gcd(gcd(a, b), c)
    
    Time: O(n × log(max))
    Space: O(1)
    """
    if not numbers:
        return 0
    
    result = numbers[0]
    for num in numbers[1:]:
        result = gcd(result, num)
        if result == 1:
            return 1  # Early exit
    
    return result


def lcm_array(numbers: list[int]) -> int:
    """
    Compute LCM of an array of numbers.
    Uses associativity: lcm(a, b, c) = lcm(lcm(a, b), c)
    
    Time: O(n × log(max))
    Space: O(1)
    """
    if not numbers:
        return 0
    
    result = numbers[0]
    for num in numbers[1:]:
        result = lcm(result, num)
    
    return result
```

### Template 4: Modular Inverse

```python
def mod_inverse(a: int, m: int) -> int | None:
    """
    Compute modular multiplicative inverse of a under modulo m.
    
    Returns x such that (a * x) % m = 1.
    Returns None if inverse doesn't exist (when gcd(a, m) ≠ 1).
    
    Time: O(log m)
    """
    def extended_gcd(a, b):
        if b == 0:
            return (a, 1, 0)
        g, x1, y1 = extended_gcd(b, a % b)
        x = y1
        y = x1 - (a // b) * y1
        return (g, x, y)
    
    g, x, _ = extended_gcd(a % m, m)
    
    if g != 1:
        return None  # Inverse doesn't exist
    
    return (x % m + m) % m  # Ensure positive result


# Using Fermat's Little Theorem (when m is prime)
def mod_inverse_prime(a: int, m: int) -> int:
    """
    Compute inverse when m is prime using Fermat's Little Theorem.
    a^(-1) ≡ a^(m-2) (mod m)
    Requires modular exponentiation.
    """
    def mod_pow(base, exp, mod):
        result = 1
        base %= mod
        while exp > 0:
            if exp & 1:
                result = (result * base) % mod
            base = (base * base) % mod
            exp >>= 1
        return result
    
    return mod_pow(a, m - 2, m)
```

### Template 5: Diophantine Equation Solver

```python
def solve_diophantine(a: int, b: int, c: int) -> tuple[int, int] | None:
    """
    Find one solution to the linear Diophantine equation: ax + by = c.
    
    Returns (x, y) or None if no solution exists.
    
    All solutions: x = x0 + (b/g)*t, y = y0 - (a/g)*t for any integer t.
    
    Time: O(log(min(a, b)))
    """
    def extended_gcd(a, b):
        if b == 0:
            return (a, 1, 0)
        g, x1, y1 = extended_gcd(b, a % b)
        x = y1
        y = x1 - (a // b) * y1
        return (g, x, y)
    
    g, x0, y0 = extended_gcd(abs(a), abs(b))
    
    # Check if solution exists
    if c % g != 0:
        return None
    
    # Scale the particular solution
    x0 *= c // g
    y0 *= c // g
    
    # Adjust signs based on original coefficients
    if a < 0:
        x0 = -x0
    if b < 0:
        y0 = -y0
    
    return (x0, y0)


def all_solutions(a: int, b: int, c: int, x0: int, y0: int):
    """
    Generator for all solutions to ax + by = c.
    Yields (x, y) pairs.
    """
    from math import gcd
    g = gcd(abs(a), abs(b))
    
    t = 0
    while True:
        x = x0 + (b // g) * t
        y = y0 - (a // g) * t
        yield (x, y)
        t += 1
        # Also yield negative t values
        if t > 0:
            x_neg = x0 - (b // g) * t
            y_neg = y0 + (a // g) * t
            yield (x_neg, y_neg)
```

---

## When to Use

Use the Euclidean Algorithm when you need to solve problems involving:

- **Finding GCD of two or more numbers**: The most common use case
- **Computing LCM (Least Common Multiple)**: Using the relationship lcm(a, b) = |a × b| / gcd(a, b)
- **Simplifying fractions**: Reduce a/b to lowest terms by dividing by gcd(a, b)
- **Modular arithmetic**: Finding modular inverses using Extended Euclidean Algorithm
- **Cryptography**: RSA encryption relies heavily on GCD computations
- **Number theory problems**: Diophantine equations, coprime checking, etc.

### Comparison with Alternative Approaches

| Method | Time Complexity | Space Complexity | When to Use |
|--------|----------------|------------------|-------------|
| **Euclidean Algorithm** | O(log(min(a, b))) | O(1) | ✅ Always preferred |
| **Prime Factorization** | O(√n) | O(log n) | Small numbers only |
| **Brute Force** | O(min(a, b)) | O(1) | ❌ Never for large numbers |
| **Binary GCD (Stein's)** | O(log(min(a, b))) | O(1) | Hardware without fast division |

### When to Choose Euclidean vs Other Approaches

- **Choose Euclidean Algorithm** when:
  - You need to compute GCD of large numbers
  - Performance is critical
  - Standard arithmetic operations are available

- **Choose Binary GCD (Stein's)** when:
  - Division operations are expensive (embedded systems)
  - Working with very large integers on specific hardware
  - Bit operations are faster than modulo

---

## Algorithm Explanation

### Core Concept

The Euclidean algorithm is based on a fundamental mathematical property:

```
gcd(a, b) = gcd(b, a mod b)
```

This means the GCD of two numbers doesn't change if you replace the larger number with the remainder of dividing the larger by the smaller.

### How It Works

#### Why It Works

**Key Insight**: Any common divisor of a and b must also divide a mod b.

**Proof**:
- Let d = gcd(a, b)
- We can write: a = b × q + r where r = a mod b and 0 ≤ r < b
- Since d divides both a and b, it must also divide r = a - b × q
- Conversely, any divisor of b and r also divides a = b × q + r
- Therefore, gcd(a, b) = gcd(b, r)

### Visual Representation

For gcd(48, 18):

```
gcd(48, 18)
    ↓ 48 = 18 × 2 + 12
gcd(18, 12)
    ↓ 18 = 12 × 1 + 6
gcd(12, 6)
    ↓ 12 = 6 × 2 + 0
gcd(6, 0) = 6 ✓
```

At each step, the second number becomes significantly smaller (at least halved on average), leading to logarithmic time complexity.

### Mathematical Foundation

- **Bézout's Identity**: For any integers a and b, there exist integers x and y such that ax + by = gcd(a, b)
- **LCM-GCD Relationship**: gcd(a, b) × lcm(a, b) = |a × b|
- **Worst Case**: Consecutive Fibonacci numbers give the maximum number of steps

### Why It Works

- **Exponential reduction**: The second number at least halves every two iterations
- **Logarithmic time**: Number of iterations is bounded by 2 × log₂(min(a, b))
- **Simple**: Only requires basic arithmetic operations

### Limitations

- **Overflow in multiplication**: When computing LCM, a × b might overflow; use a // gcd × b instead
- **Not for single large number testing**: Use Miller-Rabin for primality testing, not GCD
- **Recursive depth**: Recursive implementation has O(log n) stack depth; use iterative for safety

---

## Practice Problems

### Problem 1: Greatest Common Divisor of Strings

**Problem:** [LeetCode 1071 - Greatest Common Divisor of Strings](https://leetcode.com/problems/greatest-common-divisor-of-strings/)

**Description:** For two strings str1 and str2, return the largest string x such that x divides both str1 and str2 (both can be formed by repeating x).

**How to Apply GCD:**
- Use GCD on string lengths to find candidate length
- Verify if a substring of that length can form both strings
- Leverage the property: if str1 + str2 == str2 + str1, a GCD exists

---

### Problem 2: Replace Non-Coprime Numbers in Array

**Problem:** [LeetCode 2197 - Replace Non-Coprime Numbers in Array](https://leetcode.com/problems/replace-non-coprime-numbers-in-array/)

**Description:** Replace adjacent non-coprime numbers with their LCM repeatedly until all adjacent pairs are coprime.

**How to Apply GCD:**
- Direct application of GCD to check coprimality
- Use LCM formula involving GCD: lcm(a, b) = a × b / gcd(a, b)
- Stack-based approach to handle replacements

---

### Problem 3: Check if It Is a Good Array

**Problem:** [LeetCode 1250 - Check If It Is a Good Array](https://leetcode.com/problems/check-if-it-is-a-good-array/)

**Description:** An array is "good" if you can make some subset of its elements sum to 1. Return true if the array is good.

**How to Apply GCD:**
- By Bézout's identity, you can form 1 as a linear combination iff GCD of all elements is 1
- Compute GCD of entire array
- Return True if GCD equals 1

---

### Problem 4: Minimize the Maximum of Two Arrays

**Problem:** [LeetCode 2513 - Minimize the Maximum of Two Arrays](https://leetcode.com/problems/minimize-the-maximum-of-two-arrays/)

**Description:** Construct two arrays with specific divisibility constraints and minimize the maximum number used.

**How to Apply GCD:**
- Binary search on the answer
- Use LCM and GCD to validate if a candidate maximum works
- Apply inclusion-exclusion principle with LCM

---

### Problem 5: Water and Jug Problem

**Problem:** [LeetCode 365 - Water and Jug Problem](https://leetcode.com/problems/water-and-jug-problem/)

**Description:** You are given two jugs with capacities x and y liters. Determine if you can measure exactly target liters using these jugs.

**How to Apply GCD:**
- By number theory, you can measure any multiple of gcd(x, y)
- Solution exists iff target is a multiple of gcd(x, y) and target ≤ x + y
- This is a direct application of Bézout's identity

---

## Video Tutorial Links

### Fundamentals

- [Euclidean Algorithm - Number Theory](https://www.youtube.com/watch?v=H1AE2Se8A5E) - Comprehensive explanation with proofs
- [Extended Euclidean Algorithm](https://www.youtube.com/watch?v=hB34-GSDT3k) - Finding modular inverses
- [GCD and LCM Explained](https://www.youtube.com/watch?v=pTaVdNVXK0w) - Basic to advanced concepts

### Advanced Topics

- [Binary GCD Algorithm (Stein's)](https://www.youtube.com/watch?v=vz95H7VwBbw) - Division-free approach
- [Applications of GCD in Competitive Programming](https://www.youtube.com/watch?v=8h4oMSzDdhs) - Real contest problems
- [Modular Arithmetic & GCD](https://www.youtube.com/watch?v=7VsylygkODs) - Cryptography applications

### Problem Solving

- [LeetCode GCD Problems Walkthrough](https://www.youtube.com/watch?v=8h4oMSzDdhs) - Step-by-step solutions
- [GCD of Strings Explained](https://www.youtube.com/watch?v=i5I_wM8oQPM) - LeetCode 1071 deep dive
- [Number Theory for Competitive Programming](https://www.youtube.com/watch?v=5yJ_3Qj-eFI) - GCD and beyond

---

## Follow-up Questions

### Q1: Why is the Euclidean algorithm so efficient compared to finding all divisors?

**Answer:** The Euclidean algorithm reduces the problem size exponentially at each step by using the modulo operation. Finding all divisors requires checking up to √n numbers (O(√n)), while Euclidean runs in O(log(min(a, b))), which is significantly faster for large numbers.

### Q2: Can the Euclidean algorithm handle negative numbers? Zero?

**Answer:**
- **Negative numbers**: Yes, GCD is typically defined as a positive number, so we take absolute values first
- **Zero**: gcd(a, 0) = |a| and gcd(0, 0) is typically defined as 0 (though mathematically undefined)
- **Implementation**: Always use abs() at the start or check for zero cases

### Q3: What is the Extended Euclidean Algorithm used for?

**Answer:** The Extended Euclidean Algorithm finds integers x and y such that ax + by = gcd(a, b). Key applications:
- **Modular multiplicative inverse**: Finding a⁻¹ (mod m) when gcd(a, m) = 1
- **Cryptography**: RSA encryption/decryption relies on modular inverses
- **Diophantine equations**: Solving equations of the form ax + by = c
- **Linear congruences**: Solving ax ≡ b (mod m)

### Q4: When should I use the Binary GCD (Stein's) algorithm instead?

**Answer:** Use Binary GCD when:
- Division operations are expensive (certain embedded systems)
- Working with very large integers on hardware without fast division
- Bit operations are significantly faster than arithmetic operations
- Implementing in hardware where subtraction and bit shifts are cheaper

For most modern CPUs, the standard Euclidean algorithm is faster due to optimized division hardware.

### Q5: How does GCD relate to LCM? What's the formula?

**Answer:** The fundamental relationship is:
```
gcd(a, b) × lcm(a, b) = |a × b|
```

Therefore:
```
lcm(a, b) = |a × b| / gcd(a, b)
```

This is useful because:
- Computing GCD is O(log(min(a, b))) while naive LCM requires prime factorization
- For large numbers, direct multiplication might overflow; use: lcm(a, b) = a / gcd(a, b) × b
- For multiple numbers: lcm(a, b, c) = lcm(lcm(a, b), c)

---

## Summary

The Euclidean Algorithm is one of the most elegant and efficient algorithms in computer science and mathematics:

### Key Takeaways

- **O(log(min(a, b))) time complexity** - incredibly fast even for very large numbers
- **O(1) space with iterative version** - memory efficient
- **Based on simple mathematical property**: gcd(a, b) = gcd(b, a mod b)
- **Foundation for many applications**: LCM, modular arithmetic, cryptography

### When to Use

- ✅ Finding GCD of any two integers
- ✅ Computing LCM efficiently
- ✅ Simplifying fractions to lowest terms
- ✅ Finding modular multiplicative inverses (with Extended GCD)
- ✅ Solving Diophantine equations
- ✅ Cryptographic applications (RSA, etc.)

### Implementation Tips

1. **Prefer iterative over recursive** for production code (avoids stack overflow)
2. **Always handle negative inputs** by taking absolute values
3. **Use early termination** when computing GCD of arrays (if result becomes 1)
4. **Watch for integer overflow** when computing LCM of large numbers

### Related Algorithms

- **Extended Euclidean Algorithm** - For modular inverses and Bézout coefficients
- **Binary GCD (Stein's)** - Division-free alternative
- **Prime Factorization** - Alternative for small numbers
- **Chinese Remainder Theorem** - Uses GCD for solving congruences

Mastering the Euclidean Algorithm is essential for competitive programming and technical interviews, as it forms the foundation of many number theory problems.
