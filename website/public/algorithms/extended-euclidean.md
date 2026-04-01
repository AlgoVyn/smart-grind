# Extended Euclidean Algorithm

## Category
Math & Number Theory

## Description

The Extended Euclidean Algorithm is an extension to the Euclidean Algorithm that not only finds the **Greatest Common Divisor (GCD)** of two integers `a` and `b`, but also finds the **Bézout coefficients** `x` and `y` such that:

```
ax + by = gcd(a, b)
```

This algorithm is fundamental in number theory and has critical applications in cryptography, modular arithmetic, and solving linear Diophantine equations.

---

## Concepts

### 1. Bézout's Identity

For any integers `a` and `b`, there exist integers `x` and `y` such that:

```
ax + by = gcd(a, b)
```

| Input | Output | Meaning |
|-------|--------|---------|
| a, b | g = gcd(a, b) | Greatest common divisor |
| a, b | x, y | Coefficients: ax + by = g |

### 2. Euclidean Algorithm Steps

Standard Euclidean algorithm computes gcd recursively:

```
gcd(a, b) = gcd(b, a mod b)
Base case: gcd(a, 0) = a
```

### 3. Back Substitution

The extended version works backwards to find coefficients:

```
If: g = b·x₁ + (a mod b)·y₁
And: a mod b = a - ⌊a/b⌋·b
Then: g = a·y₁ + b·(x₁ - ⌊a/b⌋·y₁)

Therefore: x = y₁, y = x₁ - ⌊a/b⌋·y₁
```

### 4. Modular Inverse

When gcd(a, m) = 1, the modular inverse of `a` modulo `m` exists:

```
a·x ≡ 1 (mod m)
⇒ a·x + m·y = 1
⇒ x mod m is the inverse
```

---

## Frameworks

### Framework 1: Recursive Extended GCD

```
┌─────────────────────────────────────────────────────┐
│  RECURSIVE EXTENDED GCD FRAMEWORK                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  extended_gcd(a, b):                                │
│    1. If b == 0:                                    │
│       Return (a, 1, 0)                             │
│       # Since a·1 + 0·0 = a = gcd(a, 0)            │
│                                                     │
│    2. Recursively compute:                          │
│       (g, x₁, y₁) = extended_gcd(b, a % b)          │
│                                                     │
│    3. Back substitution:                            │
│       x = y₁                                        │
│       y = x₁ - (a // b) · y₁                        │
│                                                     │
│    4. Return (g, x, y)                              │
│                                                     │
│  Time: O(log(min(a, b))), Space: O(log(min(a, b))) │
└─────────────────────────────────────────────────────┘
```

**When to use**: Clean, readable implementation. Best for understanding.

### Framework 2: Iterative Extended GCD

```
┌─────────────────────────────────────────────────────┐
│  ITERATIVE EXTENDED GCD FRAMEWORK                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  iterative_gcd(a, b):                               │
│    1. Initialize:                                   │
│       x₀, x₁ = 1, 0                                 │
│       y₀, y₁ = 0, 1                                 │
│                                                     │
│    2. While b != 0:                                 │
│       q = a // b                                    │
│       a, b = b, a - q·b                            │
│       x₀, x₁ = x₁, x₀ - q·x₁                       │
│       y₀, y₁ = y₁, y₀ - q·y₁                       │
│                                                     │
│    3. Return (a, x₀, y₀)                            │
│                                                     │
│  Time: O(log(min(a, b))), Space: O(1)              │
└─────────────────────────────────────────────────────┘
```

**When to use**: Space-constrained environments, stack overflow prevention.

### Framework 3: Modular Inverse Extraction

```
┌─────────────────────────────────────────────────────┐
│  MODULAR INVERSE FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  mod_inverse(a, m):                                 │
│    1. Compute (g, x, _) = extended_gcd(a, m)        │
│                                                     │
│    2. If g != 1:                                    │
│       Return None  # Inverse doesn't exist         │
│                                                     │
│    3. Return (x % m + m) % m  # Ensure positive     │
│                                                     │
│  Property: a · mod_inverse(a, m) ≡ 1 (mod m)       │
└─────────────────────────────────────────────────────┘
```

**When to use**: Cryptography, division in modular arithmetic.

---

## Forms

### Form 1: Standard Extended GCD

Returns (gcd, x, y) where ax + by = gcd.

| Input | Output | Use Case |
|-------|--------|----------|
| (30, 12) | (6, 1, -2) | 30·1 + 12·(-2) = 6 |
| (17, 5) | (1, -2, 7) | 17·(-2) + 5·7 = 1 |
| (7, 3) | (1, 1, -2) | 7·1 + 3·(-2) = 1 |

### Form 2: Modular Inverse Only

Returns the modular inverse or None if it doesn't exist.

```
mod_inverse(3, 11) = 4   # 3·4 = 12 ≡ 1 (mod 11)
mod_inverse(7, 26) = 15  # 7·15 = 105 ≡ 1 (mod 26)
mod_inverse(6, 9) = None # gcd(6, 9) = 3 ≠ 1
```

### Form 3: Diophantine Equation Solver

Solve ax + by = c for integer solutions.

```
Condition: Solution exists iff c % gcd(a, b) == 0

One solution: (x₀, y₀) = (x·(c/g), y·(c/g))
All solutions: x = x₀ + (b/g)·t, y = y₀ - (a/g)·t
```

### Form 4: RSA Key Generation

Use extended GCD to find private exponent.

```
Given: primes p, q, public exponent e (often 65537)
Compute: n = p·q, φ = (p-1)(q-1)
Find: d = mod_inverse(e, φ)
Result: Public key (n, e), Private key (n, d)
```

### Form 5: GCD-only (Standard Euclidean)

If only GCD is needed, use simpler algorithm.

```python
def gcd(a: int, b: int) -> int:
    """Standard Euclidean algorithm."""
    while b:
        a, b = b, a % b
    return a
```

---

## Tactics

### Tactic 1: Handling Negative Numbers

```python
def extended_gcd_abs(a: int, b: int) -> tuple[int, int, int]:
    """Extended GCD with sign handling."""
    g, x, y = extended_gcd(abs(a), abs(b))
    
    if a < 0:
        x = -x
    if b < 0:
        y = -y
    
    return (g, x, y)
```

### Tactic 2: Batch GCD Computation

```python
from functools import reduce

def gcd_multiple(numbers: list[int]) -> int:
    """Compute GCD of multiple numbers."""
    return reduce(gcd, numbers)

def extended_gcd_multiple(numbers: list[int]) -> tuple[int, list[int]]:
    """Find GCD and express as linear combination of all numbers."""
    # Pairwise approach or use matrix methods
    # Returns (gcd, coefficients)
    pass
```

### Tactic 3: Fast Modular Inverse for Primes

When modulus is prime, can use Fermat's Little Theorem:

```python
def mod_inverse_prime(a: int, p: int) -> int:
    """
    Compute a^(-1) mod p using Fermat's Little Theorem.
    Only works when p is prime.
    a^(p-1) ≡ 1 (mod p) ⇒ a^(p-2) ≡ a^(-1) (mod p)
    """
    return pow(a, p - 2, p)
```

**Note**: This is O(log p) but requires p to be prime. Extended GCD works for any modulus where inverse exists.

### Tactic 4: Chinese Remainder Theorem Helper

```python
def crt_two(a1: int, m1: int, a2: int, m2: int) -> tuple[int, int]:
    """
    Solve system:
        x ≡ a1 (mod m1)
        x ≡ a2 (mod m2)
    Returns (solution, lcm(m1, m2)) or (None, None) if no solution.
    """
    g, p, q = extended_gcd(m1, m2)
    
    if (a2 - a1) % g != 0:
        return (None, None)  # No solution
    
    # Combine solutions
    lcm = m1 // g * m2
    x = (a1 + (a2 - a1) // g * p % (m2 // g) * m1) % lcm
    
    return (x if x >= 0 else x + lcm, lcm)
```

---

## Python Templates

### Template 1: Recursive Extended GCD

```python
def extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """
    Extended Euclidean Algorithm.
    
    Returns (g, x, y) such that ax + by = g = gcd(a, b)
    
    Args:
        a: First integer
        b: Second integer
        
    Returns:
        Tuple of (gcd, x_coefficient, y_coefficient)
        
    Time Complexity: O(log(min(a, b)))
    Space Complexity: O(log(min(a, b))) for recursion stack
    """
    if b == 0:
        return (a, 1, 0)
    
    # Recursive call
    g, x1, y1 = extended_gcd(b, a % b)
    
    # Back substitution
    x = y1
    y = x1 - (a // b) * y1
    
    return (g, x, y)


# Example usage
if __name__ == "__main__":
    a, b = 30, 12
    g, x, y = extended_gcd(a, b)
    print(f"gcd({a}, {b}) = {g}")
    print(f"{a} × {x} + {b} × {y} = {a * x + b * y}")
    
    # Verify
    assert a * x + b * y == g
    print("✓ Bézout identity verified!")
```

### Template 2: Iterative Extended GCD

```python
def iterative_extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """
    Iterative version of Extended Euclidean Algorithm.
    
    More space efficient than recursive version.
    
    Time Complexity: O(log(min(a, b)))
    Space Complexity: O(1)
    """
    x0, x1 = 1, 0
    y0, y1 = 0, 1
    
    while b != 0:
        q = a // b
        a, b = b, a - q * b
        x0, x1 = x1, x0 - q * x1
        y0, y1 = y1, y0 - q * y1
    
    return (a, x0, y0)
```

### Template 3: Modular Inverse

```python
def mod_inverse(a: int, m: int) -> int | None:
    """
    Returns modular inverse of a under modulo m.
    Returns None if inverse doesn't exist.
    
    Args:
        a: Number to find inverse for
        m: Modulus
        
    Returns:
        Modular inverse if it exists, None otherwise
        
    Time Complexity: O(log(min(a, m)))
    """
    g, x, _ = extended_gcd(a % m, m)
    if g != 1:
        return None  # Inverse doesn't exist
    return (x % m + m) % m  # Ensure positive result


# Example: inverse of 3 mod 11
# 3 × 4 = 12 ≡ 1 (mod 11)
print(mod_inverse(3, 11))  # Output: 4

# Example: inverse of 7 mod 26 (for Caesar cipher)
# 7 × 15 = 105 ≡ 1 (mod 26)
print(mod_inverse(7, 26))  # Output: 15
```

### Template 4: Linear Diophantine Equation Solver

```python
def solve_diophantine(a: int, b: int, c: int) -> tuple[int, int] | None:
    """
    Finds one solution to ax + by = c.
    Returns (x, y) or None if no solution exists.
    
    All solutions: x = x0 + (b/g)*t, y = y0 - (a/g)*t for any integer t
    
    Args:
        a, b: Coefficients
        c: Target value
        
    Returns:
        One particular solution (x, y) or None
    """
    g, x0, y0 = extended_gcd(abs(a), abs(b))
    
    if c % g != 0:
        return None  # No solution exists
    
    # Scale the solution
    x0 *= c // g
    y0 *= c // g
    
    # Adjust signs based on original a, b
    if a < 0:
        x0 = -x0
    if b < 0:
        y0 = -y0
    
    return (x0, y0)


def all_solutions(a: int, b: int, c: int, x0: int, y0: int, g: int):
    """Generate all solutions to ax + by = c."""
    t = 0
    while True:
        x = x0 + (b // g) * t
        y = y0 - (a // g) * t
        yield (x, y)
        t += 1


# Example: 2x + 3y = 5
# Solutions: x = -4 + 3t, y = 3 - 2t
sol = solve_diophantine(2, 3, 5)
print(f"Solution: {sol}")  # Output: (2, 1) because 2*2 + 3*1 = 7 ≠ 5...
```

### Template 5: RSA Key Generation

```python
def rsa_key_generation(p: int, q: int, e: int = 65537) -> tuple[int, int]:
    """
    Simplified RSA key generation using Extended GCD.
    
    Args:
        p, q: Two prime numbers
        e: Public exponent (commonly 65537)
    
    Returns:
        (n, d): Public modulus n and private exponent d
    """
    n = p * q
    phi = (p - 1) * (q - 1)
    
    # Find private exponent d such that e*d ≡ 1 (mod phi)
    # This is the modular inverse of e modulo phi
    g, d, _ = extended_gcd(e, phi)
    
    if g != 1:
        raise ValueError("Invalid e value - must be coprime to phi")
    
    d = d % phi
    if d < 0:
        d += phi
    
    return n, d


# Example: Generate RSA keys for small primes
p, q = 61, 53  # Example primes
n, d = rsa_key_generation(p, q)
print(f"Public modulus n = p*q = {n}")
print(f"Private exponent d = {d}")
print(f"Verification: 65537 * {d} mod {(p-1)*(q-1)} = {(65537 * d) % ((p-1)*(q-1))}")
```

---

## When to Use

Use the Extended Euclidean Algorithm when you need to:

- **Find Modular Inverse**: Compute `a^(-1) mod m` when `gcd(a, m) = 1`
- **Solve Linear Diophantine Equations**: Find integer solutions to `ax + by = c`
- **Compute Bézout Coefficients**: Express GCD as a linear combination
- **Cryptographic Applications**: RSA, elliptic curve cryptography

### Comparison with Standard GCD

| Algorithm | GCD Only | Bézout Coefficients | Modular Inverse | Diophantine Solutions |
|-----------|----------|---------------------|-----------------|----------------------|
| **Standard Euclidean** | ✅ | ❌ | ❌ | ❌ |
| **Extended Euclidean** | ✅ | ✅ | ✅ | ✅ |

### Key Insight

While the standard Euclidean algorithm only gives `gcd(a, b)`, the extended version also provides the coefficients that express this GCD as a linear combination of `a` and `b`.

---

## Algorithm Explanation

### Mathematical Foundation

**Bézout's Identity**: For any integers `a` and `b`, there exist integers `x` and `y` such that:
```
ax + by = gcd(a, b)
```

### How It Works

The algorithm works backwards through the Euclidean algorithm steps. If we know:
```
gcd(a, b) = gcd(b, a mod b)
```

And we have coefficients for the recursive call:
```
b·x₁ + (a mod b)·y₁ = gcd(a, b)
```

We can substitute `a mod b = a - ⌊a/b⌋·b` to get:
```
a·y₁ + b·(x₁ - ⌊a/b⌋·y₁) = gcd(a, b)
```

Therefore:
- `x = y₁`
- `y = x₁ - ⌊a/b⌋·y₁`

### Visual Walkthrough

For `a = 30, b = 12`:

```
Step 1: 30 = 2 × 12 + 6     → gcd(30, 12) = gcd(12, 6)
Step 2: 12 = 2 × 6 + 0      → gcd = 6

Working backwards:
From Step 1: 6 = 30 - 2 × 12

So: 30 × (1) + 12 × (-2) = 6
    ↑x              ↑y      ↑gcd
```

### Algorithm Steps

1. **Base Case**: If `b = 0`, return `(a, 1, 0)` since `a·1 + 0·0 = a = gcd(a, 0)`
2. **Recursive Step**: Compute `(g, x₁, y₁) = extended_gcd(b, a mod b)`
3. **Back Substitution**:
   - `x = y₁`
   - `y = x₁ - ⌊a/b⌋ × y₁`
4. **Return**: `(g, x, y)` where `g = gcd(a, b)` and `ax + by = g`

### Why It Works

The algorithm works because:
1. **Recursive structure**: The Euclidean algorithm's recursive structure allows us to build solutions bottom-up
2. **Back substitution**: Working backwards from the base case, we can combine solutions
3. **Linear combination preservation**: Each step maintains the invariant that `ax + by = gcd(a, b)`

### Limitations

- **Integer overflow**: For very large numbers, intermediate values can overflow
- **Not for multiple variables**: Only solves for two variables; multi-variable requires different approaches
- **Existence condition**: Solution to `ax + by = c` only exists if `c` is divisible by `gcd(a, b)`

---

## Practice Problems

### Problem 1: Check if Good Array

**Problem:** [LeetCode 1250 - Check If It Is a Good Array](https://leetcode.com/problems/check-if-it-is-a-good-array/)

**Description:** An array is "good" if GCD of all elements is 1. Use Extended GCD to verify.

**How to Apply Extended Euclidean Algorithm:**
- Compute pairwise GCD of all elements using extended Euclidean algorithm
- If the overall GCD is 1, the array is good
- The extended version helps understand if elements can combine to form 1

---

### Problem 2: Pour Water Between Buckets

**Problem:** [LeetCode 365 - Water and Jug Problem](https://leetcode.com/problems/water-and-jug-problem/)

**Description:** Given two buckets of sizes m and n, can you measure exactly d liters? This is a classic application known as the "Water Jug Problem".

**How to Apply Extended Euclidean Algorithm:**
- Possible iff d is a multiple of gcd(m, n) and d ≤ max(m, n)
- Use extended GCD to find the coefficients that show this relationship
- Solution exists when gcd(m, n) divides d

---

### Problem 3: Linear Combination

**Problem:** [LeetCode 1250 - Check If It Is a Good Array](https://leetcode.com/problems/check-if-it-is-a-good-array/)

**Description:** Find if target can be formed as a linear combination of given numbers.

**How to Apply Extended Euclidean Algorithm:**
- Use Extended GCD to find coefficients for the linear combination
- Check if target is achievable by the GCD relationship
- Extended algorithm provides the exact coefficients needed

---

### Problem 4: Modular Inverse

**Problem:** [LeetCode 1976 - Number of Ways to Arrive at Destination](https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/)

**Description:** Compute modular inverse for counting problems with large numbers.

**How to Apply Extended Euclidean Algorithm:**
- The extended GCD directly gives us the coefficients to compute modular inverse
- If gcd(a, m) = 1, the coefficient of a gives us a^(-1) mod m
- Essential for counting problems with modulo constraints

---

### Problem 5: Chinese Remainder Theorem

**Problem:** [LeetCode 2748 - Number of Beautiful Pairs](https://leetcode.com/problems/number-of-beautiful-pairs/)

**Description:** Solve systems of congruences using number theory concepts.

**How to Apply Extended Euclidean Algorithm:**
- CRT requires computing modular inverses
- Extended Euclidean Algorithm provides these inverses efficiently
- Used in many competitive programming problems involving modular systems

---

## Video Tutorial Links

### Fundamentals

- [Extended Euclidean Algorithm (Take U Forward)](https://www.youtube.com/watch?v=2F4r0N2u4vU) - Comprehensive introduction
- [Extended Euclidean Algorithm Implementation (WilliamFiset)](https://www.youtube.com/watch?v=zb72gK9jGNY) - Detailed explanation with visualizations
- [Modular Inverse using Extended GCD (NeetCode)](https://www.youtube.com/watch?v=2W2y2X8X7Qw) - Practical implementation guide

### Advanced Topics

- [Bézout's Identity Explained](https://www.youtube.com/watch?v=xuoQq4f3-Js) - Theoretical foundation
- [RSA Cryptography - Extended Euclidean](https://www.youtube.com/watch?v=v0dJ4x4Y4cM) - Cryptographic applications
- [Chinese Remainder Theorem](https://www.youtube.com/watch?v=3aVPh70xT3M) - CRT with extended GCD

---

## Follow-up Questions

### Q1: Why do we need the Extended version? Can't we just use regular GCD?

**Answer:** Regular GCD only gives the greatest common divisor. The Extended version provides the Bézout coefficients, which are essential for:
- Modular inverses (needed in cryptography and competitive programming)
- Solving linear Diophantine equations
- Proving theoretical results in number theory

### Q2: What happens when gcd(a, b) ≠ 1? Can we still find a modular inverse?

**Answer:** No. The modular inverse of `a` modulo `m` exists **if and only if** `gcd(a, m) = 1`. When they share a common factor, no integer `x` satisfies `ax ≡ 1 (mod m)`.

### Q3: Can the coefficients x and y be negative?

**Answer:** Yes! The Bézout coefficients can be negative. The algorithm guarantees `ax + by = gcd(a, b)`, but `x` and `y` can be any integers (positive, negative, or zero) that satisfy this equation.

### Q4: Are the Bézout coefficients unique?

**Answer:** No. If `(x, y)` is one solution, then for any integer `t`:
- `x' = x + (b/gcd)·t`
- `y' = y - (a/gcd)·t`

is also a solution. There are infinitely many solutions.

### Q5: What is the Chinese Remainder Theorem and how does it use Extended GCD?

**Answer:** The Chinese Remainder Theorem (CRT) solves systems of congruences:
```
x ≡ a₁ (mod m₁)
x ≡ a₂ (mod m₂)
...
```

Extended GCD is used to:
1. Check if solutions exist (requires pairwise coprime moduli)
2. Compute the modular inverses needed to combine congruences
3. Construct the final solution from individual solutions

For two congruences:
```
x = a₁ + m₁·((a₂-a₁)·(m₁⁻¹ mod m₂) mod m₂)
```

The `m₁⁻¹ mod m₂` is computed using Extended GCD.

---

## Summary

The Extended Euclidean Algorithm is a powerful tool that extends the basic GCD computation to find the Bézout coefficients. It's essential for:

- **Modular arithmetic**: Computing inverses for division under modulo
- **Cryptography**: RSA and other public-key systems
- **Number theory**: Solving Diophantine equations
- **Competitive programming**: Many problems reduce to finding these coefficients

**Key Takeaway**: When you need more than just the GCD—when you need to express that GCD as a linear combination—use the Extended Euclidean Algorithm.

| Property | Value |
|----------|-------|
| **Time Complexity** | O(log(min(a, b))) |
| **Space Complexity** | O(log(min(a, b))) recursive, O(1) iterative |
| **Main Output** | (gcd, x, y) where ax + by = gcd |
| **Key Application** | Modular inverse, Diophantine equations |

### Quick Reference

```python
# Extended GCD
g, x, y = extended_gcd(a, b)  # ax + by = g

# Modular Inverse (when gcd(a, m) = 1)
inv = mod_inverse(a, m)  # a * inv ≡ 1 (mod m)

# Diophantine Equation ax + by = c
sol = solve_diophantine(a, b, c)  # Returns (x, y) or None
```

---

## Related Algorithms

- [GCD (Euclidean)](./gcd-euclidean.md) - Basic GCD computation
- [Modular Inverse](./modular-inverse.md) - Application of Extended GCD
- [Chinese Remainder Theorem](./chinese-remainder.md) - Uses modular inverses
- [Modular Exponentiation](./modular-exponentiation.md) - Fast power with mod
- [Euler's Totient](./euler-totient.md) - For cryptographic applications
