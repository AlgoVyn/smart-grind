# Modular Inverse

## Category
Math & Number Theory

## Description

The **modular multiplicative inverse** of an integer `a` modulo `m` is an integer `x` such that `a × x ≡ 1 (mod m)`. This is the equivalent of division in modular arithmetic—multiplying by `a^(-1)` is the same as dividing by `a` under modulo `m`. The modular inverse exists if and only if `gcd(a, m) = 1`, meaning `a` and `m` must be coprime.

This concept is essential for competitive programming and cryptographic applications. When computing combinations, linear congruences, or performing division under modulo constraints, the modular inverse enables operations that would otherwise be impossible in modular arithmetic.

---

## Concepts

The modular inverse is built on several fundamental concepts from number theory.

### 1. Division Problem in Modular Arithmetic

In regular arithmetic, dividing by `a` equals multiplying by `1/a`. In modular arithmetic:

```
(a / b) mod m = (a × b⁻¹) mod m
```

| Operation | Regular Arithmetic | Modular Arithmetic |
|-----------|-------------------|-------------------|
| Addition | `a + b` | `(a + b) mod m` |
| Subtraction | `a - b` | `(a - b + m) mod m` |
| Multiplication | `a × b` | `(a × b) mod m` |
| Division | `a / b` | `(a × b⁻¹) mod m` |

### 2. Existence Condition

The modular inverse of `a` modulo `m` exists **if and only if** `gcd(a, m) = 1`.

| Condition | Result |
|-----------|--------|
| `gcd(a, m) = 1` | Inverse exists (unique) |
| `gcd(a, m) > 1` | Inverse does not exist |
| `a = 0` | Inverse never exists |

### 3. Computing Methods

| Method | Time | Requirements | Best For |
|--------|------|--------------|----------|
| Extended Euclidean | O(log(min(a, m))) | `gcd(a, m) = 1` | Any modulus |
| Fermat's Little Theorem | O(log m) | `m` prime | Prime modulus (fastest) |
| Precomputation | O(n) preprocessing | `m` prime | Multiple inverses |

---

## Frameworks

### Framework 1: Extended Euclidean Algorithm

```
┌─────────────────────────────────────────────────────┐
│  EXTENDED EUCLIDEAN FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│  1. Apply extended GCD: find g, x, y where          │
│     ax + my = g = gcd(a, m)                         │
│  2. Verify existence: if g ≠ 1, inverse DNE         │
│  3. Normalize result: return (x % m + m) % m        │
└─────────────────────────────────────────────────────┘
```

**When to use**: General-purpose, works for any modulus where inverse exists.

### Framework 2: Fermat's Little Theorem

```
┌─────────────────────────────────────────────────────┐
│  FERMAT'S LITTLE THEOREM FRAMEWORK                  │
├─────────────────────────────────────────────────────┤
│  Precondition: m is prime, a not divisible by m     │
│                                                     │
│  1. Verify m is prime (usually known)               │
│  2. Compute: a^(-1) ≡ a^(m-2) (mod m)               │
│  3. Use fast exponentiation: O(log m) time          │
│  4. Return result                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: When modulus is prime (common: 10⁹+7, 998244353).

### Framework 3: Precomputation for Multiple Queries

```
┌─────────────────────────────────────────────────────┐
│  PRECOMPUTATION FRAMEWORK                           │
├─────────────────────────────────────────────────────┤
│  Precondition: m is prime, need inverses 1..n     │
│                                                     │
│  1. Initialize: inv[1] = 1                          │
│  2. For i = 2 to n:                                 │
│     inv[i] = m - (m // i) × inv[m % i] % m         │
│  3. Answer queries: O(1) per inverse              │
└─────────────────────────────────────────────────────┘
```

**When to use**: Many queries, bounded values, prime modulus.

---

## Forms

### Form 1: Single Inverse Computation

Compute one inverse at a time, optimal for occasional operations.

| Use Case | Method | Time | Space |
|----------|--------|------|-------|
| Prime modulus | Fermat's | O(log m) | O(1) |
| Composite modulus | Extended GCD | O(log m) | O(1) |
| Unknown modulus | Extended GCD | O(log m) | O(1) |

### Form 2: nCr with Modular Inverse

Combinations require division: `nCr = n! / (r! × (n-r)!)`

```
Precompute: fact[0..n], inv_fact[0..n]
nCr = fact[n] × inv_fact[r] × inv_fact[n-r] mod m
```

### Form 3: Linear Congruence Solving

Solve `ax ≡ b (mod m)` using modular inverse when `gcd(a, m) = 1`.

```
x ≡ a⁻¹ × b (mod m)
```

### Form 4: Precomputed Inverse Array

For problems requiring all inverses from 1 to n.

| Property | Value |
|----------|-------|
| Preprocessing | O(n) |
| Per query | O(1) |
| Space | O(n) |
| Formula | `inv[i] = m - (m//i) × inv[m%i] % m` |

---

## Tactics

### Tactic 1: Extended GCD Implementation

```python
def extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """Returns (g, x, y) where ax + by = g = gcd(a, b)."""
    if b == 0:
        return (a, 1, 0)
    g, x1, y1 = extended_gcd(b, a % b)
    return (g, y1, x1 - (a // b) * y1)


def mod_inverse(a: int, m: int) -> int | None:
    """Returns modular inverse or None if doesn't exist."""
    g, x, _ = extended_gcd(a % m, m)
    if g != 1:
        return None
    return (x % m + m) % m
```

### Tactic 2: Iterative Extended GCD (Space Efficient)

```python
def mod_inverse_iterative(a: int, m: int) -> int | None:
    """Iterative version - O(1) space."""
    a = a % m
    if a == 0:
        return None if m != 1 else 0
    
    x0, x1 = 1, 0
    original_m = m
    
    while m != 0:
        q = a // m
        a, m = m, a - q * m
        x0, x1 = x1, x0 - q * x1
    
    if a != 1:
        return None
    return (x0 % original_m + original_m) % original_m
```

### Tactic 3: Fermat's Little Theorem

```python
def mod_inverse_fermat(a: int, m: int) -> int:
    """Using Fermat's - requires m to be prime."""
    return pow(a, m - 2, m)
```

### Tactic 4: Handling No Inverse

```python
def safe_divide(a: int, b: int, m: int) -> int | None:
    """Compute (a / b) mod m safely."""
    inv_b = mod_inverse(b, m)
    if inv_b is None:
        return None  # Division not possible
    return (a * inv_b) % m
```

### Tactic 5: Precomputation Formula

```python
def precompute_inverses(n: int, mod: int) -> list[int]:
    """Precompute inverses 1 to n when mod is prime."""
    inv = [0] * (n + 1)
    inv[1] = 1
    for i in range(2, n + 1):
        inv[i] = mod - (mod // i) * inv[mod % i] % mod
    return inv
```

---

## Python Templates

### Template 1: Extended Euclidean Modular Inverse

```python
def mod_inverse(a: int, m: int) -> int | None:
    """
    Compute modular inverse using Extended Euclidean Algorithm.
    Returns None if inverse doesn't exist.
    
    Time: O(log(min(a, m)))
    Space: O(log(min(a, m))) - recursion stack
    """
    def extended_gcd(a: int, b: int) -> tuple[int, int, int]:
        if b == 0:
            return (a, 1, 0)
        g, x1, y1 = extended_gcd(b, a % b)
        return (g, y1, x1 - (a // b) * y1)
    
    g, x, _ = extended_gcd(a % m, m)
    if g != 1:
        return None
    return (x % m + m) % m
```

### Template 2: Iterative Modular Inverse

```python
def mod_inverse_iterative(a: int, m: int) -> int | None:
    """
    Iterative modular inverse - O(1) space.
    
    Time: O(log(min(a, m)))
    Space: O(1)
    """
    a = a % m
    if a == 0:
        return None if m != 1 else 0
    
    x0, x1 = 1, 0
    original_m = m
    
    while m != 0:
        q = a // m
        a, m = m, a - q * m
        x0, x1 = x1, x0 - q * x1
    
    if a != 1:
        return None
    return (x0 % original_m + original_m) % original_m
```

### Template 3: Fermat's Little Theorem (Prime Modulus)

```python
def mod_inverse_fermat(a: int, m: int) -> int:
    """
    Compute inverse using Fermat's Little Theorem.
    REQUIRES: m is prime, a not divisible by m.
    
    Time: O(log m)
    Space: O(1)
    """
    return pow(a, m - 2, m)


# For common competitive programming moduli
MOD = 10**9 + 7

def mod_inv(a: int) -> int:
    """Inverse under MOD = 10^9 + 7."""
    return pow(a, MOD - 2, MOD)
```

### Template 4: Precompute All Inverses

```python
def precompute_inverses(n: int, mod: int) -> list[int]:
    """
    Precompute modular inverses for 1 to n.
    REQUIRES: mod is prime.
    
    Time: O(n)
    Space: O(n)
    """
    inv = [0] * (n + 1)
    inv[1] = 1
    
    for i in range(2, n + 1):
        inv[i] = mod - (mod // i) * inv[mod % i] % mod
    
    return inv


# Example: Precompute and use
inv = precompute_inverses(100000, 10**9 + 7)
# inv[i] gives i^(-1) mod 10^9+7
```

### Template 5: Binomial Coefficients with Precomputation

```python
class BinomialCoefficients:
    """Compute nCr mod prime with O(1) queries after O(n) preprocessing."""
    
    def __init__(self, max_n: int, mod: int = 10**9 + 7):
        self.mod = mod
        self.max_n = max_n
        
        # Precompute factorials
        self.fact = [1] * (max_n + 1)
        for i in range(1, max_n + 1):
            self.fact[i] = (self.fact[i - 1] * i) % mod
        
        # Precompute inverse factorials
        self.inv_fact = [1] * (max_n + 1)
        self.inv_fact[max_n] = pow(self.fact[max_n], mod - 2, mod)
        for i in range(max_n - 1, -1, -1):
            self.inv_fact[i] = (self.inv_fact[i + 1] * (i + 1)) % mod
    
    def nCr(self, n: int, r: int) -> int:
        """Compute C(n, r) mod mod."""
        if r < 0 or r > n or n > self.max_n:
            return 0
        return (self.fact[n] * self.inv_fact[r] % self.mod * 
                self.inv_fact[n - r]) % self.mod
```

### Template 6: Linear Congruence Solver

```python
def solve_linear_congruence(a: int, b: int, m: int) -> int | None:
    """
    Solve ax ≡ b (mod m).
    Returns smallest non-negative solution or None.
    
    Time: O(log(min(a, m)))
    """
    from math import gcd
    
    g = gcd(a, m)
    if b % g != 0:
        return None
    
    # Reduce to: (a/g)x ≡ (b/g) (mod m/g)
    a_reduced = a // g
    b_reduced = b // g
    m_reduced = m // g
    
    # Find inverse of a_reduced mod m_reduced
    def extended_gcd(a, b):
        if b == 0:
            return (a, 1, 0)
        g, x, y = extended_gcd(b, a % b)
        return (g, y, x - (a // b) * y)
    
    _, inv, _ = extended_gcd(a_reduced, m_reduced)
    inv = (inv % m_reduced + m_reduced) % m_reduced
    
    x = (b_reduced * inv) % m_reduced
    return x
```

---

## When to Use

Use modular inverse when you need to:
- Perform division under modulo constraints
- Compute binomial coefficients mod m
- Solve linear congruences
- Implement cryptographic algorithms

### Comparison of Methods

| Method | Time | Space | Requirements | Best Use Case |
|--------|------|-------|--------------|---------------|
| Extended Euclidean | O(log m) | O(1) | `gcd(a,m)=1` | General purpose |
| Fermat's Theorem | O(log m) | O(1) | `m` prime | Prime modulus |
| Precomputation | O(n) prep | O(n) | `m` prime | Many queries |

### When to Choose Each Method

- **Choose Extended Euclidean** when:
  - The modulus is not prime
  - You need a general-purpose solution
  - Guaranteed O(log m) performance required

- **Choose Fermat's Little Theorem** when:
  - The modulus is prime (10⁹+7, 998244353)
  - You need the fastest single inverse computation
  - Using Python's built-in `pow(a, m-2, m)`

- **Choose Precomputation** when:
  - You need inverses for many values 1 to n
  - Space is not a constraint
  - Multiple queries on same modulus

---

## Algorithm Explanation

### Core Concept

The modular inverse extends the concept of division to modular arithmetic. While we cannot directly divide in modular arithmetic, we can multiply by the modular inverse to achieve the same result.

**Key Insight**: If `a × x ≡ 1 (mod m)`, then multiplying any number `b` by `x` is equivalent to dividing `b` by `a` under modulo `m`.

### How It Works

#### Extended Euclidean Algorithm:
1. Find integers `x` and `y` such that `ax + my = gcd(a, m)`
2. If `gcd(a, m) = 1`, then `ax ≡ 1 (mod m)`
3. Therefore, `x` is the modular inverse of `a`

#### Fermat's Little Theorem (Prime Modulus):
1. If `m` is prime: `a^(m-1) ≡ 1 (mod m)`
2. Multiply both sides by `a^(-1)`: `a^(m-2) ≡ a^(-1) (mod m)`
3. Compute `a^(m-2) mod m` using fast exponentiation

### Visual Representation

Finding inverse of 3 mod 11:

```
We need: 3 × x ≡ 1 (mod 11)

Testing values:
3 × 1 = 3  ≡ 3 (mod 11)
3 × 2 = 6  ≡ 6 (mod 11)
3 × 3 = 9  ≡ 9 (mod 11)
3 × 4 = 12 ≡ 1 (mod 11) ✓

Therefore: 3^(-1) ≡ 4 (mod 11)
Verification: 3 × 4 = 12 = 11 + 1 ≡ 1 (mod 11)
```

### Why It Works

**Extended Euclidean**: Bézout's identity guarantees that if `gcd(a, m) = 1`, there exist integers `x` and `y` such that `ax + my = 1`. Taking modulo `m` eliminates `my`, leaving `ax ≡ 1 (mod m)`.

**Fermat's Theorem**: For prime `m`, the multiplicative group has order `m-1`. By Lagrange's theorem, `a^(m-1) ≡ 1`, so `a^(m-2)` is the inverse.

### Limitations

- **Existence**: Inverse only exists when `gcd(a, m) = 1`
- **Zero**: 0 has no modular inverse
- **Composite moduli**: Fermat's theorem only works for primes
- **Large numbers**: Must use arbitrary precision or careful modulo operations

---

## Practice Problems

### Problem 1: Count Ways to Make Array With Product

**Problem:** [LeetCode 1735 - Count Ways to Make Array With Product](https://leetcode.com/problems/count-ways-to-make-array-with-product/)

**Description:** Given queries `[ni, ki]`, find the number of ways to place positive integers into an array of size `ni` such that the product is `ki`.

**How to Apply Modular Inverse:**
- Use prime factorization of `ki`
- Apply stars and bars counting with modular division
- Use modular inverse for dividing by factorials

---

### Problem 2: Number of Ways to Reorder Array to Get Same BST

**Problem:** [LeetCode 1569 - Number of Ways to Reorder Array to Get Same BST](https://leetcode.com/problems/number-of-ways-to-reorder-array-to-get-same-bst/)

**Description:** Given a permutation array representing a BST, return the number of ways to reorder it such that the constructed BST is identical.

**How to Apply Modular Inverse:**
- Use Catalan numbers and binomial coefficients
- Calculate combinations nCr using modular inverses
- Precompute factorials and inverse factorials

---

### Problem 3: Factorial Trailing Zeroes

**Problem:** [LeetCode 172 - Factorial Trailing Zeroes](https://leetcode.com/problems/factorial-trailing-zeroes/)

**Description:** Given an integer `n`, return the number of trailing zeroes in `n!`.

**How to Apply Modular Inverse (Advanced):**
- Understand prime factorization which is key to modular inverse calculations
- Extend to compute n! mod p efficiently using Wilson's theorem
- Use modular inverse for computing combinations in modular space

---

### Problem 4: Count Arrays Which Can be Sorted by Swapping Adjacent Elements

**Problem:** [LeetCode 2495 - Number of Subarrays Having Even Product](https://leetcode.com/problems/number-of-subarrays-having-even-product/)

**Description:** Given an array of integers, count subarrays with even product.

**How to Apply Modular Inverse:**
- Use inclusion-exclusion principle with counting
- Apply modular arithmetic for large counts
- Use precomputed inverses for combination calculations

---

### Problem 5: Super Pow

**Problem:** [LeetCode 372 - Super Pow](https://leetcode.com/problems/super-pow/)

**Description:** Calculate `a^b mod 1337` where `b` is a very large number represented as an array.

**How to Apply Modular Inverse:**
- Use properties of modular exponentiation
- Apply Euler's theorem for modular inverse calculations
- Handle large exponents using modular arithmetic

---

## Video Tutorial Links

### Fundamentals

- [Modular Multiplicative Inverse (Extended Euclidean Algorithm)](https://www.youtube.com/watch?v=shaQZg8bqUM) - Detailed explanation of Extended Euclidean method
- [Modular Inverse using Fermat's Little Theorem](https://www.youtube.com/watch?v=2rU8i2EGG1U) - Fast method for prime moduli
- [Competitive Programming - Modular Arithmetic](https://www.youtube.com/watch?v=9fTb8NKB9a8) - Practical guide for CP

### Advanced Topics

- [Binary Exponentiation for Modular Inverse](https://www.youtube.com/watch?v=nO7_quN7UhU) - Fast exponentiation techniques
- [Precomputing Modular Inverses](https://www.youtube.com/watch?v=YKrdmHjHMSM) - O(n) method for multiple inverses
- [Number Theory for Competitive Programming](https://www.youtube.com/watch?v=XPNm5NF8WjA) - Comprehensive coverage

---

## Follow-up Questions

### Q1: Why does Fermat's Little Theorem only work for prime moduli?

**Answer:** Fermat's theorem states `a^(p-1) ≡ 1 (mod p)` for prime `p` because the multiplicative group modulo a prime has order `p-1`. For composite `m`, we use Euler's theorem: `a^φ(m) ≡ 1 (mod m)`. The general formula `a^(-1) ≡ a^(φ(m)-1) (mod m)` works when `gcd(a, m) = 1`, but computing `φ(m)` requires factorization, which is expensive (O(√m)). Extended Euclidean is preferred for composite moduli.

---

### Q2: What if I need to compute inverse of 0?

**Answer:** 0 has no modular inverse. By definition, we'd need `0 × x ≡ 1 (mod m)`, which is impossible since `0 × x = 0` for all `x`. In code, always check if `a % m == 0` before computing the inverse.

---

### Q3: Can I use modular inverse for non-prime moduli?

**Answer:** Yes, using the Extended Euclidean Algorithm. Fermat's method only works for primes, but Extended Euclidean works for any modulus as long as `gcd(a, m) = 1`. This is why Extended Euclidean is the general-purpose solution.

---

### Q4: Why is modular inverse important for nCr?

**Answer:** `nCr = n! / (r!(n-r)!)`. In modular arithmetic, division becomes multiplication by the modular inverse. So: `nCr mod m = n! × (r!)^(-1) × ((n-r)!)^(-1) mod m`. Without modular inverses, we couldn't compute combinations under modulo.

---

### Q5: Which method should I use in competitive programming?

**Answer:**
- **For prime modulus (10⁹+7, 998244353)**: Use Fermat's with `pow(a, m-2, m)` - fastest and simplest
- **For unknown/composite modulus**: Use Extended Euclidean - always works when inverse exists
- **For many queries on same modulus**: Precompute all inverses in O(n) then answer in O(1)
- **For nCr calculations**: Precompute factorials and inverse factorials for O(1) per query

---

## Summary

The modular inverse is a fundamental operation in modular arithmetic that enables "division" under a modulus. Key takeaways:

- **Exists only when** `gcd(a, m) = 1` - always check this condition
- **Extended Euclidean** works for any valid case, O(log(min(a, m)))
- **Fermat's Little Theorem** is faster (O(log m)) but requires prime modulus
- **Essential for** combinations, linear congruences, and cryptography
- **Precomputation** can answer multiple inverse queries in O(1) after O(n) preprocessing

### When to Use Each Method

| Scenario | Recommended Method |
|----------|-------------------|
| Single inverse, prime modulus | Fermat's Little Theorem |
| Single inverse, composite modulus | Extended Euclidean |
| Multiple inverses (1 to n) | Precomputation O(n) |
| nCr calculations | Precompute fact + inv_fact |
| Linear congruences | Extended Euclidean |

This algorithm is essential for competitive programming and technical interviews, especially in problems involving counting under modulo constraints.
