# Chinese Remainder Theorem (CRT)

## Category
Math & Number Theory

## Description

The **Chinese Remainder Theorem (CRT)** is a fundamental result in number theory that provides a unique solution to a system of simultaneous congruences with pairwise coprime moduli. Dating back to ancient China (3rd century CE, Sunzi Suanjing), this theorem remains crucial in modern cryptography, computer science, and competitive programming.

Given a system of congruences where `m₁, m₂, ..., mₙ` are **pairwise coprime**, CRT guarantees a unique solution modulo `M = m₁ × m₂ × ... × mₙ`. Instead of solving one complex congruence with a large modulus, CRT allows us to solve several simpler congruences with smaller moduli and combine the results efficiently. This "divide and conquer" approach is the cornerstone of many efficient algorithms.

---

## Concepts

### 1. Pairwise Coprime Moduli

Two numbers are **coprime** (relatively prime) if their greatest common divisor is 1. For CRT, we need all pairs of moduli to be coprime:

| Property | Description |
|----------|-------------|
| **gcd(mᵢ, mⱼ) = 1** | For all i ≠ j |
| **Product = LCM** | Since coprime, product equals least common multiple |
| **Solution Space** | No redundancy, complete coverage modulo M |

### 2. Modular Inverses

The **modular inverse** of `a` modulo `m` is a number `a⁻¹` such that `a × a⁻¹ ≡ 1 (mod m)`. CRT relies heavily on computing modular inverses using the Extended Euclidean Algorithm.

| Inverse Property | Condition |
|------------------|-----------|
| **Existence** | `gcd(a, m) = 1` |
| **Uniqueness** | Unique modulo m |
| **Computation** | Extended Euclidean Algorithm in O(log m) |

### 3. CRT Construction

The solution is constructed as a weighted sum:

```
x = Σ (aᵢ × Mᵢ × yᵢ) mod M

Where:
- M = m₁ × m₂ × ... × mₙ (product of all moduli)
- Mᵢ = M / mᵢ (product of all moduli except mᵢ)
- yᵢ = Mᵢ⁻¹ mod mᵢ (modular inverse of Mᵢ modulo mᵢ)
```

### 4. Variants of CRT

| Variant | Use Case | Complexity |
|---------|----------|------------|
| **Standard CRT** | Pairwise coprime moduli | O(k² log M) |
| **Iterative CRT** | Better numerical stability | O(k log M) |
| **General CRT** | Non-coprime moduli (when consistent) | O(k² log M) |
| **Garner's Algorithm** | Multiple queries, same moduli | O(k²) precompute, O(k) query |

---

## Frameworks

### Framework 1: Standard CRT

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD CRT FRAMEWORK                                     │
├─────────────────────────────────────────────────────────────┤
│  1. Verify moduli are pairwise coprime (optional)          │
│  2. Compute M = product of all moduli                      │
│  3. For each congruence i:                                 │
│     a. Compute Mᵢ = M / mᵢ                                 │
│     b. Find yᵢ = modular_inverse(Mᵢ, mᵢ)                   │
│     c. Add term: aᵢ × Mᵢ × yᵢ to result                    │
│  4. Return result mod M                                    │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: One-time solution with pairwise coprime moduli.

### Framework 2: Iterative CRT

```
┌─────────────────────────────────────────────────────────────┐
│  ITERATIVE CRT FRAMEWORK                                    │
├─────────────────────────────────────────────────────────────┤
│  1. Start with x = a₁, M = m₁                              │
│  2. For each additional congruence (aᵢ, mᵢ):               │
│     a. Need: x + M×t ≡ aᵢ (mod mᵢ)                         │
│     b. Compute: t = (aᵢ - x) × M⁻¹ (mod mᵢ)                │
│     c. Update: x = x + M × t                               │
│     d. Update: M = M × mᵢ                                  │
│  3. Return (x mod M, M)                                    │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Better numerical stability, sequential processing.

### Framework 3: General CRT for Non-Coprime Moduli

```
┌─────────────────────────────────────────────────────────────┐
│  GENERAL CRT FRAMEWORK                                      │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize x = a₁, M = m₁                              │
│  2. For each congruence (aᵢ, mᵢ):                          │
│     a. Compute g = gcd(M, mᵢ)                            │
│     b. Check: (aᵢ - x) % g == 0 (consistency)              │
│     c. If inconsistent: return "No solution"               │
│     d. Merge: x = solution to both congruences             │
│     e. M = lcm(M, mᵢ) = M × mᵢ / g                         │
│  3. Return (x mod M, M)                                    │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Moduli may not be pairwise coprime.

---

## Forms

### Form 1: Classical Sunzi Problem

The original problem: Find x such that:
- x ≡ 2 (mod 3)
- x ≡ 3 (mod 5)  
- x ≡ 2 (mod 7)

| Congruence | aᵢ | mᵢ | Mᵢ | yᵢ = Mᵢ⁻¹ (mod mᵢ) |
|------------|-----|-----|-----|---------------------|
| x ≡ 2 (mod 3) | 2 | 3 | 35 | 2 |
| x ≡ 3 (mod 5) | 3 | 5 | 21 | 1 |
| x ≡ 2 (mod 7) | 2 | 7 | 15 | 1 |

Solution: x = 2×35×2 + 3×21×1 + 2×15×1 = 233 ≡ 23 (mod 105)

### Form 2: RSA Decryption Optimization

CRT provides ~4x speedup in RSA decryption by computing modulo p and q separately:

```
Standard: m = c^d mod (p×q)  [slow, large modulus]
CRT:      m_p = c^d mod p    [fast, small modulus]
          m_q = c^d mod q    [fast, small modulus]
          m = CRT(m_p, m_q, p, q)
```

### Form 3: Large Number Representation

Represent numbers too large for native types using multiple moduli:

```
Number N → [N mod m₁, N mod m₂, ..., N mod mₖ]
Operations performed component-wise, then reconstruct
```

### Form 4: Polynomial Interpolation

CRT applies to polynomials: Find p(x) such that:
- p(x) ≡ a₁(x) (mod m₁(x))
- p(x) ≡ a₂(x) (mod m₂(x))

---

## Tactics

### Tactic 1: Extended Euclidean Algorithm for Modular Inverse

```python
def extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """Returns (g, x, y) such that ax + by = g = gcd(a, b)."""
    if b == 0:
        return (a, 1, 0)
    g, x1, y1 = extended_gcd(b, a % b)
    return (g, y1, x1 - (a // b) * y1)


def mod_inverse(a: int, m: int) -> int | None:
    """Returns modular inverse of a modulo m, or None if it doesn't exist."""
    g, x, _ = extended_gcd(a % m, m)
    if g != 1:
        return None
    return (x % m + m) % m
```

### Tactic 2: Iterative CRT for Numerical Stability

```python
def iterative_crt(a: list[int], m: list[int]) -> tuple[int, int] | None:
    """Iterative CRT with better numerical stability."""
    if not a or not m or len(a) != len(m):
        return None
    
    x = a[0] % m[0]
    M = m[0]
    
    for i in range(1, len(a)):
        diff = (a[i] - x) % m[i]
        inv = mod_inverse(M % m[i], m[i])
        if inv is None:
            return None
        t = (diff * inv) % m[i]
        x = x + M * t
        M *= m[i]
        x %= M
    
    return (x, M)
```

### Tactic 3: Garner's Algorithm for Multiple Queries

```python
def garner_precompute(m: list[int]) -> list[list[int]]:
    """Precompute inverse table for Garner's algorithm."""
    k = len(m)
    inv = [[0] * k for _ in range(k)]
    for i in range(k):
        for j in range(i):
            inv[j][i] = mod_inverse(m[j] % m[i], m[i])
    return inv


def garner_solve(a: list[int], m: list[int], 
                 inv: list[list[int]], mod: int) -> int:
    """Solve CRT with precomputed inverses."""
    k = len(a)
    x = [0] * k
    
    for i in range(k):
        x[i] = a[i]
        for j in range(i):
            x[i] = (x[i] - x[j]) * inv[j][i] % m[i]
    
    result = 0
    mult = 1
    for i in range(k):
        result = (result + x[i] * mult) % mod
        mult = (mult * m[i]) % mod
    
    return result
```

### Tactic 4: Consistency Check for General CRT

```python
def general_crt(a: list[int], m: list[int]) -> tuple[int, int] | None:
    """CRT for non-coprime moduli with consistency checking."""
    import math
    
    x, M = a[0], m[0]
    
    for i in range(1, len(a)):
        g = math.gcd(M, m[i])
        
        # Check consistency
        if (a[i] - x) % g != 0:
            return None
        
        # Merge congruences
        M_g = M // g
        m_g = m[i] // g
        diff = (a[i] - x) // g
        
        inv = mod_inverse(M_g % m_g, m_g)
        if inv is None:
            return None
        
        t = (diff * inv) % m_g
        x = x + M * t
        M = M * m_g  # LCM
        x %= M
    
    return (x, M)
```

---

## Python Templates

### Template 1: Extended Euclidean Algorithm

```python
def extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """
    Extended Euclidean Algorithm.
    Returns (g, x, y) such that ax + by = g = gcd(a, b).
    Time: O(log(min(a, b)))
    """
    if b == 0:
        return (a, 1, 0)
    g, x1, y1 = extended_gcd(b, a % b)
    return (g, y1, x1 - (a // b) * y1)
```

### Template 2: Modular Inverse

```python
def mod_inverse(a: int, m: int) -> int | None:
    """
    Returns modular inverse of a modulo m, or None if it doesn't exist.
    Inverse exists iff gcd(a, m) = 1.
    Time: O(log(min(a, m)))
    """
    g, x, _ = extended_gcd(a % m, m)
    if g != 1:
        return None
    return (x % m + m) % m
```

### Template 3: Standard CRT

```python
def chinese_remainder_theorem(a: list[int], m: list[int]) -> tuple[int, int] | None:
    """
    Solve system of congruences using Chinese Remainder Theorem.
    System: x ≡ a[i] (mod m[i]) for all i
    Returns: (solution, combined_modulus) or None if no solution.
    Time: O(k² × log(M))
    """
    k = len(a)
    if len(m) != k:
        return None
    if k == 0:
        return (0, 1)
    
    # Compute M = product of all moduli
    M = 1
    for mi in m:
        M *= mi
    
    result = 0
    for i in range(k):
        Mi = M // m[i]
        yi = mod_inverse(Mi, m[i])
        if yi is None:
            return None
        result = (result + a[i] * Mi * yi) % M
    
    return (result, M)
```

### Template 4: Iterative CRT

```python
def chinese_remainder_iterative(a: list[int], m: list[int]) -> tuple[int, int] | None:
    """
    Iterative CRT: merge congruences two at a time.
    More numerically stable than standard approach.
    Time: O(k × log(M))
    """
    if not a or not m or len(a) != len(m):
        return None
    
    x = a[0] % m[0]
    M = m[0]
    
    for i in range(1, len(a)):
        diff = (a[i] - x) % m[i]
        inv = mod_inverse(M % m[i], m[i])
        if inv is None:
            return None
        t = (diff * inv) % m[i]
        x = x + M * t
        M *= m[i]
        x %= M
    
    return (x, M)
```

### Template 5: General CRT for Non-Coprime Moduli

```python
import math

def general_crt(a: list[int], m: list[int]) -> tuple[int, int] | None:
    """
    Solve CRT system even when moduli are not pairwise coprime.
    Solution exists iff a[i] ≡ a[j] (mod gcd(m[i], m[j])) for all i, j.
    Returns solution modulo LCM of all moduli.
    """
    if not a or not m or len(a) != len(m):
        return None
    
    x, M = a[0], m[0]
    
    for i in range(1, len(a)):
        g = math.gcd(M, m[i])
        
        # Check consistency
        if (a[i] - x) % g != 0:
            return None
        
        # Merge the congruences
        M_g = M // g
        m_g = m[i] // g
        diff = (a[i] - x) // g
        
        inv = mod_inverse(M_g % m_g, m_g)
        if inv is None:
            return None
        
        t = (diff * inv) % m_g
        x = x + M * t
        M = M * m_g  # LCM
        x %= M
    
    return (x, M)
```

### Template 6: Garner's Algorithm

```python
def garner_algorithm(a: list[int], m: list[int], 
                     precomputed_inv: list[list[int]] = None) -> int:
    """
    Garner's algorithm for CRT with optional precomputation.
    Efficient when solving multiple systems with the same moduli.
    Time: O(k²) without precomputation, O(k) with precomputation.
    """
    k = len(a)
    
    # Get or compute inverses
    if precomputed_inv is None:
        inv = [[0] * k for _ in range(k)]
        for i in range(k):
            for j in range(i):
                inv[j][i] = mod_inverse(m[j] % m[i], m[i])
    else:
        inv = precomputed_inv
    
    # Mixed radix representation
    x = [0] * k
    for i in range(k):
        x[i] = a[i]
        for j in range(i):
            x[i] = (x[i] - x[j]) * inv[j][i] % m[i]
    
    # Convert to standard form
    result = 0
    mult = 1
    for i in range(k):
        result = (result + x[i] * mult) % (m[0] * m[i] if i > 0 else m[0])
        mult *= m[i]
    
    return result
```

### Template 7: RSA Decryption with CRT

```python
def rsa_decrypt_crt(ciphertext: int, d: int, p: int, q: int) -> int:
    """
    RSA decryption using CRT optimization.
    Approximately 4x faster than standard decryption.
    """
    # Compute partial decryptions with smaller exponents
    dp = d % (p - 1)
    dq = d % (q - 1)
    
    mp = pow(ciphertext, dp, p)
    mq = pow(ciphertext, dq, q)
    
    # Combine using CRT
    result, _ = chinese_remainder_iterative([mp, mq], [p, q])
    return result
```

---

## When to Use

Use the Chinese Remainder Theorem when you need to solve problems involving:

- **Systems of Congruences**: Finding x that satisfies multiple modular conditions simultaneously
- **Large Modulus Operations**: Breaking down computations with large moduli into smaller parts
- **Cryptographic Applications**: RSA optimization, secret sharing schemes
- **Reconstruction Problems**: Rebuilding numbers from their remainders modulo coprime bases
- **Periodic Constraints**: Problems with multiple periodic conditions

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|-----------------|------------------|---------------|
| **Brute Force Search** | O(M) | O(1) | Only for very small moduli |
| **Standard CRT** | O(k² log M) | O(k) | Pairwise coprime moduli, one-time solution |
| **Iterative CRT** | O(k log M) | O(1) | Better numerical stability |
| **Garner's Algorithm** | O(k²) precompute, O(k) query | O(k²) | Multiple queries, same moduli |
| **General CRT** | O(k² log M) | O(k) | Non-coprime moduli (when solvable) |

### When to Choose Each CRT Variant

- **Choose Standard CRT** when you have pairwise coprime moduli and need a one-time solution
- **Choose Iterative CRT** when you're concerned about numerical overflow or processing sequentially
- **Choose Garner's Algorithm** when solving multiple systems with the same moduli
- **Choose General CRT** when moduli are not pairwise coprime and you need to check consistency

---

## Algorithm Explanation

### Core Concept

The key insight behind CRT is that instead of solving one complex congruence with a large modulus, we can solve several simpler congruences with smaller moduli and combine the results efficiently. The construction uses partial products and modular inverses to create a weighted sum where each term contributes to exactly one congruence.

### How It Works

#### Standard CRT:
1. Compute the product M of all moduli
2. For each congruence, compute Mᵢ = M/mᵢ
3. Find the modular inverse yᵢ of Mᵢ modulo mᵢ
4. Construct solution as weighted sum: x = Σ(aᵢ × Mᵢ × yᵢ) mod M

#### Iterative CRT:
1. Start with the first congruence as the initial solution
2. Merge in each additional congruence one at a time
3. Update the solution and combined modulus using the formula
4. Result is unique modulo the LCM of all moduli

### Visual Representation

#### Two-Congruence Case

```
System: x ≡ a₁ (mod m₁), x ≡ a₂ (mod m₂)

Step 1: Compute M = m₁ × m₂
Step 2: Compute M₁ = m₂, M₂ = m₁
Step 3: Find y₁ = M₁⁻¹ (mod m₁), y₂ = M₂⁻¹ (mod m₂)
Step 4: x = a₁×M₁×y₁ + a₂×M₂×y₂ (mod M)

       ┌───────────────────────────────────────┐
       │   term₁      +      term₂            │
       │  (contributes    (contributes         │
       │   to mod m₁)      to mod m₂)         │
       └─────────────────────────────────────┘
```

### Why It Works

1. **Existence**: The construction x = Σ(aᵢ × Mᵢ × yᵢ) satisfies each congruence because Mⱼ ≡ 0 (mod mᵢ) for all j ≠ i
2. **Uniqueness**: If x and x' are both solutions, then x - x' ≡ 0 (mod mᵢ) for all i, so x - x' ≡ 0 (mod M)
3. **Modular Inverses**: Since moduli are coprime, Mᵢ and mᵢ are coprime, so Mᵢ⁻¹ exists

### Limitations

- **Pairwise Coprime Requirement**: Standard CRT requires gcd(mᵢ, mⱼ) = 1 for all i ≠ j
- **Large Intermediate Values**: M can be extremely large (product of all moduli)
- **Overflow Risk**: Use arbitrary-precision arithmetic or iterative methods for large inputs
- **General CRT Complexity**: Non-coprime moduli require consistency checking and are more complex

---

## Practice Problems

### Problem 1: Minimum Deletions to Make Array Divisible

**Problem:** [LeetCode 2344 - Minimum Deletions to Make Array Divisible](https://leetcode.com/problems/minimum-deletions-to-make-array-divisible/)

**Description:** You are given two positive integer arrays `nums` and `numsDivide`. You can delete any number of elements from `nums`. Return the minimum number of deletions such that the smallest element in `nums` divides all the elements of `numsDivide`.

**How to Apply CRT:**
- Find the GCD of `numsDivide`
- Find the smallest element in `nums` that divides this GCD
- The CRT connection: understanding modular arithmetic and divisibility

---

### Problem 2: Construct Target Array With Multiple Sums

**Problem:** [LeetCode 1354 - Construct Target Array With Multiple Sums](https://leetcode.com/problems/construct-target-array-with-multiple-sums/)

**Description:** Given an array `target` of n integers, starting from an array A of n 1's, you can let x be the sum of all elements, choose index i, and set A[i] = x. Return True if it is possible to construct the target array.

**How to Apply CRT:**
- Work backwards from the target using modular arithmetic
- At each step: previous_value = current_value - sum_of_others
- This involves: `prev ≡ curr (mod sum_of_others)`

---

### Problem 3: Find the Student that Will Replace the Chalk

**Problem:** [LeetCode 1894 - Find the Student that Will Replace the Chalk](https://leetcode.com/problems/find-the-student-that-will-replace-the-chalk/)

**Description:** There are `n` students with chalk requirements. Students replace chalk one by one in a circle. Return the index of the student that will replace the chalk.

**How to Apply CRT:**
- Compute total chalk, find remainder after full rounds using modular reduction
- Similar to finding `x ≡ remainder (mod total)`

---

### Problem 4: Maximum Number of Weeks You Can Work

**Problem:** [LeetCode 1953 - Maximum Number of Weeks You Can Work](https://leetcode.com/problems/maximum-number-of-weeks-you-can-work/)

**Description:** There are `n` projects with milestones. You finish one milestone per week. You cannot work on the same project for two consecutive weeks. Return the maximum number of weeks you can work.

**How to Apply CRT:**
- The problem involves balancing constraints and distributing items
- Key insight relates to pairing and remainders

---

### Problem 5: Maximum Sum of Two Non-Overlapping Subarrays

**Problem:** [LeetCode 1031 - Maximum Sum of Two Non-Overlapping Subarrays](https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays/)

**Description:** Given an array A of non-negative integers, return the maximum sum of elements in two non-overlapping (contiguous) subarrays, which have lengths L and M.

**How to Apply CRT Concepts:**
- Uses prefix sums related to modular arithmetic
- Understanding remainders and modular constraints helps with optimization

---

## Video Tutorial Links

### Fundamentals

- [Chinese Remainder Theorem Explained (WilliamFiset)](https://www.youtube.com/watch?v=ru7mWZJlRQg) - Comprehensive visual explanation
- [CRT - Introduction and Proof (Numberphile)](https://www.youtube.com/watch?v=6zvpI4Q1300) - Mathematical foundations
- [Modular Arithmetic & CRT (MIT OpenCourseWare)](https://www.youtube.com/watch?v=8Cw24TjA8n8) - Academic approach

### Advanced Topics

- [RSA Decryption using CRT](https://www.youtube.com/watch?v=kYasb426) - Cryptographic applications
- [Garner's Algorithm Explained](https://www.youtube.com/watch?v=7VdGJ5rL) - Multiple query optimization
- [CRT for Large Numbers](https://www.youtube.com/watch?v=Q2aT4r9-4-0) - Arbitrary precision arithmetic
- [General CRT for Non-Coprime Moduli](https://www.youtube.com/watch?v=9TJV9L) - Extended theorem

---

## Follow-up Questions

### Q1: What happens if the moduli are not pairwise coprime?

**Answer:** The standard CRT doesn't apply directly. For non-coprime moduli:

1. **Check Consistency**: A solution exists iff `aᵢ ≡ aⱼ (mod gcd(mᵢ, mⱼ))` for all pairs
2. **Merge Congruences**: Combine congruences two at a time using LCM
3. **Solution Space**: If solvable, the solution is unique modulo `LCM(m₁, m₂, ..., mₙ)`

Example: System `x ≡ 2 (mod 4)`, `x ≡ 6 (mod 8)` is consistent since 2 ≡ 6 (mod 2), solution is x ≡ 6 (mod 8).

---

### Q2: How do I avoid overflow when computing the product M?

**Answer:** Several strategies:

1. **Use BigInt/Arbitrary Precision**: Built-in support in Python, Java BigInteger, C++ boost::multiprecision
2. **Iterative CRT**: Merge congruences one at a time, keeping numbers smaller
3. **Modular Arithmetic**: If you only need result mod some value, compute everything modulo that value
4. **Careful Ordering**: Process smaller moduli first to keep intermediate products manageable

---

### Q3: Why is CRT useful for RSA decryption?

**Answer:** RSA decryption computes `m = c^d mod n` where `n = p × q`:

**Without CRT**: One modular exponentiation with modulus n (~2048 bits), complexity O(log³ n)

**With CRT**: Two modular exponentiations with moduli p and q (~1024 bits each), complexity ≈ O(log³ n) / 4

**Speedup**: Approximately 4x faster in practice!

---

### Q4: How does Garner's algorithm compare to standard CRT?

**Answer:**

| Aspect | Standard CRT | Garner's Algorithm |
|--------|-------------|-------------------|
| Precomputation | None | O(k²) |
| Single Query | O(k²) | O(k²) or O(k) with precomputation |
| Multiple Queries | O(k²) each | O(k) each after precomputation |
| Numerical Stability | Moderate | Better |

**Recommendation**: Use Garner's when solving 3+ systems with identical moduli.

---

### Q5: Can CRT be extended to polynomials or other algebraic structures?

**Answer:** Yes! The abstract CRT applies to any principal ideal domain:

1. **Polynomial CRT**: Find polynomial p(x) such that `p(x) ≡ aᵢ(x) (mod mᵢ(x))` where mᵢ(x) are coprime polynomials
2. **Ring Theory**: CRT holds for commutative rings with coprime ideals
3. **Applications**: Polynomial interpolation (Lagrange is a special case!), secret sharing schemes, error-correcting codes

---

## Summary

The **Chinese Remainder Theorem** is a powerful tool for solving systems of modular congruences with wide applications in cryptography, number theory, and computer science.

### Key Takeaways

1. **Standard CRT**: Solves `x ≡ aᵢ (mod mᵢ)` for pairwise coprime moduli, unique solution modulo `M = m₁ × m₂ × ... × mₙ`

2. **Construction**: `x = Σ(aᵢ × Mᵢ × yᵢ) mod M` where `yᵢ = (M/mᵢ)⁻¹ mod mᵢ`

3. **Variants**:
   - **Iterative CRT**: Better numerical stability, O(k log M)
   - **General CRT**: Handles non-coprime moduli (when consistent)
   - **Garner's Algorithm**: Efficient for multiple queries

4. **Applications**: RSA decryption (~4x speedup), large number representation, reconstruction from redundant data

### When to Use

- ✅ Solving systems of modular congruences
- ✅ Optimizing large modulus operations (cryptography)
- ✅ Reconstructing numbers from remainders
- ✅ Problems with multiple periodic constraints
- ❌ Single modular equation (direct solution better)
- ❌ Non-coprime moduli without consistency checking

### Related Algorithms

- [Extended Euclidean Algorithm](./extended-euclidean.md) - For modular inverses
- [Modular Exponentiation](./modular-exponentiation.md) - Used in RSA
- [GCD / Euclidean Algorithm](./gcd-euclidean.md) - Checking coprimality
