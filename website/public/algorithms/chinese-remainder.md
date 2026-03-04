# Chinese Remainder Theorem (CRT)

## Category
Math & Number Theory

## Description

The **Chinese Remainder Theorem (CRT)** is a fundamental result in number theory that provides a unique solution to a system of simultaneous congruences with pairwise coprime moduli. Dating back to ancient China (3rd century CE, Sunzi Suanjing), this theorem remains crucial in modern cryptography, computer science, and competitive programming.

Given a system of congruences:
```
x ≡ a₁ (mod m₁)
x ≡ a₂ (mod m₂)
...
x ≡ aₙ (mod mₙ)
```

Where `m₁, m₂, ..., mₙ` are **pairwise coprime** (gcd(mᵢ, mⱼ) = 1 for all i ≠ j), CRT guarantees a unique solution modulo `M = m₁ × m₂ × ... × mₙ`.

### Key Insight

Instead of solving one complex congruence with a large modulus, CRT allows us to solve several simpler congruences with smaller moduli and combine the results efficiently. This "divide and conquer" approach is the cornerstone of many efficient algorithms.

---

## When to Use

Use the Chinese Remainder Theorem when you need to solve problems involving:

- **Systems of Congruences**: Finding x that satisfies multiple modular conditions simultaneously
- **Large Modulus Operations**: Breaking down computations with large moduli into smaller, manageable parts
- **Cryptographic Applications**: RSA optimization, secret sharing schemes, zero-knowledge proofs
- **Reconstruction Problems**: Rebuilding numbers from their remainders modulo coprime bases
- **Periodic Constraints**: Problems with multiple periodic conditions (e.g., "find smallest number that leaves remainders r₁ when divided by d₁, r₂ when divided by d₂, ...")
- **Parallel Computation**: Distributing computations across different moduli and combining results

### Comparison with Alternative Approaches

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|----------------|------------------|----------|
| **Brute Force Search** | O(M) where M = product of moduli | O(1) | Only for very small moduli |
| **CRT (Standard)** | O(k²) or O(k log M) | O(k) | Pairwise coprime moduli |
| **CRT (Iterative)** | O(k log M) | O(1) | Better numerical stability |
| **Garner's Algorithm** | O(k²) preprocessing, O(k) per query | O(k²) | Multiple queries, same moduli |
| **General CRT** | O(k² log M) | O(k) | Non-coprime moduli (when solvable) |

### When to Choose Each CRT Variant

- **Choose Standard CRT** when:
  - You have pairwise coprime moduli
  - You need a one-time solution
  - The number of congruences is small (k ≤ 10)

- **Choose Iterative CRT** when:
  - You're concerned about numerical overflow
  - You want better numerical stability
  - You're processing congruences sequentially

- **Choose Garner's Algorithm** when:
  - You'll solve multiple systems with the same moduli
  - You need the result in mixed-radix representation
  - Performance across multiple queries is critical

- **Choose General CRT** when:
  - Moduli are not pairwise coprime
  - You need to check if a solution exists

---

## Algorithm Explanation

### Core Concepts

#### 1. Pairwise Coprime Moduli

Two numbers are **coprime** (relatively prime) if their greatest common divisor is 1. For CRT, we need all pairs of moduli to be coprime:

```
gcd(mᵢ, mⱼ) = 1 for all i ≠ j
```

**Why this matters**: The product of pairwise coprime moduli equals their least common multiple (LCM), ensuring no redundancy in the solution space.

#### 2. Modular Inverses

The **modular inverse** of `a` modulo `m` is a number `a⁻¹` such that:
```
a × a⁻¹ ≡ 1 (mod m)
```

CRT relies heavily on computing modular inverses using the Extended Euclidean Algorithm.

**Key Property**: A modular inverse exists if and only if `gcd(a, m) = 1`.

#### 3. CRT Construction

The solution is constructed as a weighted sum where each term corresponds to one congruence:

```
x = Σ (aᵢ × Mᵢ × yᵢ) mod M

Where:
- M = m₁ × m₂ × ... × mₙ (product of all moduli)
- Mᵢ = M / mᵢ (product of all moduli except mᵢ)
- yᵢ = Mᵢ⁻¹ mod mᵢ (modular inverse of Mᵢ modulo mᵢ)
```

### Mathematical Foundation

#### Theorem Statement

Given pairwise coprime positive integers m₁, m₂, ..., mₙ and arbitrary integers a₁, a₂, ..., aₙ, there exists a unique solution x modulo M = m₁m₂...mₙ to the system:

```
x ≡ aᵢ (mod mᵢ) for i = 1, 2, ..., n
```

#### Proof Sketch

1. **Existence**: The construction x = Σ(aᵢ × Mᵢ × yᵢ) satisfies each congruence because:
   - For congruence i: Mⱼ ≡ 0 (mod mᵢ) for all j ≠ i
   - So x ≡ aᵢ × Mᵢ × yᵢ ≡ aᵢ × 1 ≡ aᵢ (mod mᵢ)

2. **Uniqueness**: If x and x' are both solutions, then x - x' ≡ 0 (mod mᵢ) for all i.
   - Since moduli are coprime, x - x' ≡ 0 (mod M)
   - Therefore x ≡ x' (mod M)

### Visual Representation

#### Two-Congruence Case

```
System: x ≡ a₁ (mod m₁), x ≡ a₂ (mod m₂)

Step 1: Compute M = m₁ × m₂
        ┌─────────────────────────────┐
        │     M = m₁ × m₂             │
        └─────────────────────────────┘

Step 2: Compute partial products
        M₁ = M/m₁ = m₂        M₂ = M/m₂ = m₁
        ┌─────┐                ┌─────┐
        │ m₂  │                │ m₁  │
        └─────┘                └─────┘

Step 3: Find modular inverses
        y₁ = M₁⁻¹ (mod m₁)    y₂ = M₂⁻¹ (mod m₂)
        ┌─────────┐            ┌─────────┐
        │ m₂×y₁≡1 │            │ m₁×y₂≡1 │
        │ (modm₁) │            │ (modm₂) │
        └─────────┘            └─────────┘

Step 4: Combine
        x = a₁×M₁×y₁ + a₂×M₂×y₂ (mod M)
        ┌───────────────────────────────────────┐
        │   term₁      +      term₂            │
        │  (contributes    (contributes         │
        │   to mod m₁)      to mod m₂)         │
        └───────────────────────────────────────┘
```

#### Example Walkthrough

Find x such that: x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7)

```
┌─────────────────────────────────────────────────────────────┐
│  Congruence  │  aᵢ  │  mᵢ  │   Mᵢ   │  yᵢ = Mᵢ⁻¹ (mod mᵢ)   │
├─────────────────────────────────────────────────────────────┤
│  x ≡ 2 (mod 3) │  2   │  3   │  35    │  35⁻¹ ≡ 2 (mod 3)    │
│  x ≡ 3 (mod 5) │  3   │  5   │  21    │  21⁻¹ ≡ 1 (mod 5)    │
│  x ≡ 2 (mod 7) │  2   │  7   │  15    │  15⁻¹ ≡ 1 (mod 7)    │
└─────────────────────────────────────────────────────────────┘

M = 3 × 5 × 7 = 105

x = 2×35×2 + 3×21×1 + 2×15×1
  = 140 + 63 + 30
  = 233
  ≡ 23 (mod 105)

Verification:
  23 mod 3 = 2 ✓
  23 mod 5 = 3 ✓
  23 mod 7 = 2 ✓
```

### Limitations and Considerations

- **Pairwise Coprime Requirement**: Standard CRT requires gcd(mᵢ, mⱼ) = 1 for all i ≠ j
- **Large Intermediate Values**: M can be extremely large (product of all moduli)
- **Overflow Risk**: Use arbitrary-precision arithmetic or iterative methods for large inputs
- **General CRT for Non-Coprime Moduli**: More complex, requires checking consistency conditions

---

## Algorithm Steps

### Standard CRT Algorithm

1. **Verify Input**:
   - Ensure arrays `a` (remainders) and `m` (moduli) have the same length
   - (Optional) Verify that all moduli are pairwise coprime

2. **Compute Product M**:
   - Calculate M = m₁ × m₂ × ... × mₙ
   - Store as 64-bit integer or BigInt for large values

3. **For Each Congruence i**:
   a. Compute Mᵢ = M / mᵢ (product of all moduli except mᵢ)
   b. Find yᵢ = modular inverse of Mᵢ modulo mᵢ using Extended Euclidean Algorithm
   c. If inverse doesn't exist, return "no solution"
   d. Compute term = aᵢ × Mᵢ × yᵢ
   e. Add term to running sum (taking mod M to prevent overflow)

4. **Return Result**:
   - Final solution: result mod M
   - The general solution is: x = result + k×M for any integer k

### Iterative CRT Algorithm

1. **Initialize**:
   - Start with x = a₁ (solution to first congruence)
   - Current modulus M = m₁

2. **For Each Additional Congruence** (i = 2 to n):
   a. We need: x + M×t ≡ aᵢ (mod mᵢ)
   b. Rearrange: M×t ≡ (aᵢ - x) (mod mᵢ)
   c. Find t = (aᵢ - x) × M⁻¹ (mod mᵢ)
   d. Update: x = x + M × t
   e. Update: M = M × mᵢ (new combined modulus)
   f. Normalize: x = x mod M

3. **Return** (x, M)

### Garner's Algorithm (for Multiple Queries)

1. **Precomputation** (done once per modulus set):
   - Compute inv[i][j] = modular inverse of mⱼ modulo mᵢ for all j < i
   - Time: O(k²) using Extended Euclidean Algorithm

2. **Mixed Radix Conversion** (per query):
   - Convert remainders to mixed radix representation
   - For each i: xᵢ = (aᵢ - Σ(xⱼ × inv[j][i])) × inv[j][i] mod mᵢ

3. **Reconstruction** (per query):
   - Convert mixed radix back to standard representation
   - result = Σ(xᵢ × product of first i-1 moduli) mod target_mod

---

## Implementation

### Complete CRT Implementation

````carousel
```python
from typing import List, Tuple, Optional
import math


def extended_gcd(a: int, b: int) -> Tuple[int, int, int]:
    """
    Extended Euclidean Algorithm.
    Returns (g, x, y) such that ax + by = g = gcd(a, b).
    
    Time Complexity: O(log(min(a, b)))
    Space Complexity: O(log(min(a, b))) due to recursion
    """
    if b == 0:
        return (a, 1, 0)
    g, x1, y1 = extended_gcd(b, a % b)
    return (g, y1, x1 - (a // b) * y1)


def mod_inverse(a: int, m: int) -> Optional[int]:
    """
    Returns modular inverse of a modulo m, or None if it doesn't exist.
    
    The modular inverse exists iff gcd(a, m) = 1.
    
    Time Complexity: O(log(min(a, m)))
    Space Complexity: O(log(min(a, m)))
    
    Args:
        a: The number to find inverse for
        m: The modulus
        
    Returns:
        The modular inverse in range [0, m-1], or None
    """
    g, x, _ = extended_gcd(a % m, m)
    if g != 1:
        return None  # Modular inverse doesn't exist
    return (x % m + m) % m


def chinese_remainder_theorem(a: List[int], m: List[int]) -> Optional[Tuple[int, int]]:
    """
    Solve system of congruences using Chinese Remainder Theorem.
    
    System: x ≡ a[i] (mod m[i]) for all i
    
    Args:
        a: List of remainders
        m: List of moduli (must be pairwise coprime)
    
    Returns:
        Tuple (solution, combined_modulus) where solution is the smallest
        non-negative solution, or None if no solution exists.
        The general solution is: x = solution + k * combined_modulus
    
    Time Complexity: O(k² * log(M)) where k = len(a), M = product of moduli
    Space Complexity: O(k)
    """
    k = len(a)
    if len(m) != k:
        raise ValueError("Lists a and m must have the same length")
    
    if k == 0:
        return (0, 1)
    
    # Verify pairwise coprime (optional, uncomment for debugging)
    # for i in range(k):
    #     for j in range(i + 1, k):
    #         if math.gcd(m[i], m[j]) != 1:
    #             return None
    
    # Compute M = product of all moduli
    M = 1
    for mi in m:
        M *= mi
    
    result = 0
    
    for i in range(k):
        Mi = M // m[i]  # M_i = M / m_i
        yi = mod_inverse(Mi, m[i])
        
        if yi is None:
            return None  # Modular inverse doesn't exist (moduli not coprime)
        
        # Add contribution from this congruence
        result = (result + a[i] * Mi * yi) % M
    
    return (result, M)


def chinese_remainder_theorem_iterative(a: List[int], m: List[int]) -> Optional[Tuple[int, int]]:
    """
    Iterative version: merge congruences two at a time.
    
    This version is more numerically stable and can handle slightly larger
    inputs before overflow. It also provides better error messages.
    
    Args:
        a: List of remainders
        m: List of moduli (must be pairwise coprime)
    
    Returns:
        Tuple (solution, combined_modulus) or None if no solution
    
    Time Complexity: O(k * log(M))
    Space Complexity: O(1) additional space
    """
    if not a or not m or len(a) != len(m):
        return None
    
    if len(a) == 0:
        return (0, 1)
    
    # Start with first congruence: x ≡ a[0] (mod m[0])
    x = a[0] % m[0]
    M = m[0]
    
    for i in range(1, len(a)):
        # We have: x ≡ current_result (mod M)
        # We want: x ≡ a[i] (mod m[i])
        # So: x + M*t ≡ a[i] (mod m[i])
        # => M*t ≡ (a[i] - x) (mod m[i])
        
        # Compute right-hand side
        diff = (a[i] - x) % m[i]
        
        # Find inverse of M modulo m[i]
        inv = mod_inverse(M % m[i], m[i])
        
        if inv is None:
            return None  # No solution (moduli not coprime)
        
        # Solve for t
        t = (diff * inv) % m[i]
        
        # Update solution
        x = x + M * t
        M = M * m[i]  # New combined modulus
        x = x % M  # Keep x in canonical form
    
    return (x, M)


def garner_algorithm_precompute(m: List[int]) -> List[List[int]]:
    """
    Precompute inverses for Garner's algorithm.
    
    Args:
        m: List of moduli (pairwise coprime)
        
    Returns:
        2D list where inv[j][i] = inverse of m[j] mod m[i] for j < i
    
    Time Complexity: O(k² * log(max(m)))
    Space Complexity: O(k²)
    """
    k = len(m)
    inv = [[0] * k for _ in range(k)]
    
    for i in range(k):
        for j in range(i):
            inv[j][i] = mod_inverse(m[j] % m[i], m[i])
    
    return inv


def garner_algorithm(a: List[int], m: List[int], mod: int, 
                     precomputed_inv: List[List[int]] = None) -> int:
    """
    Garner's algorithm for CRT with precomputation.
    
    Efficient when solving multiple systems with the same moduli.
    Returns solution modulo 'mod'.
    
    Args:
        a: List of remainders
        m: List of moduli
        mod: Target modulus for final result
        precomputed_inv: Optional precomputed inverse table
        
    Returns:
        Solution modulo 'mod'
    
    Time Complexity: O(k²) without precomputation, O(k) with precomputation
    Space Complexity: O(k)
    """
    k = len(a)
    
    # Get or compute inverses
    if precomputed_inv is None:
        inv = garner_algorithm_precompute(m)
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
        result = (result + x[i] * mult) % mod
        mult = (mult * m[i]) % mod
    
    return result


# Helper function for CRT with non-coprime moduli (General CRT)
def general_crt(a: List[int], m: List[int]) -> Optional[Tuple[int, int]]:
    """
    Solve CRT system even when moduli are not pairwise coprime.
    
    A solution exists iff a[i] ≡ a[j] (mod gcd(m[i], m[j])) for all i, j.
    
    Args:
        a: List of remainders
        m: List of moduli
        
    Returns:
        Tuple (solution, lcm_of_moduli) or None if no solution
    """
    if not a or not m or len(a) != len(m):
        return None
    
    x = a[0]
    M = m[0]
    
    for i in range(1, len(a)):
        # Solve: x ≡ a[i] (mod m[i]) and x ≡ current (mod M)
        g = math.gcd(M, m[i])
        
        # Check consistency
        if (a[i] - x) % g != 0:
            return None  # No solution exists
        
        # Merge the congruences
        # x + M*t ≡ a[i] (mod m[i])
        # M*t ≡ (a[i] - x) (mod m[i])
        
        # Divide by g
        M_g = M // g
        m_g = m[i] // g
        diff = (a[i] - x) // g
        
        # Find inverse of M_g modulo m_g
        inv = mod_inverse(M_g % m_g, m_g)
        if inv is None:
            return None
        
        t = (diff * inv) % m_g
        x = x + M * t
        M = M * m_g  # lcm(M, m[i]) = M * m[i] / g
        x = x % M
    
    return (x, M)


# Example usage and demonstration
if __name__ == "__main__":
    print("=" * 60)
    print("Chinese Remainder Theorem - Demonstration")
    print("=" * 60)
    
    # Classic example from Sunzi Suanjing (3rd century CE)
    # "There are certain things whose number is unknown.
    #  If we count them by threes, we have two left over;
    #  by fives, we have three left over;
    #  and by sevens, we have two left over.
    #  How many things are there?"
    print("\n1. Sunzi's Classic Problem (~300 CE):")
    print("   x ≡ 2 (mod 3)")
    print("   x ≡ 3 (mod 5)")
    print("   x ≡ 2 (mod 7)")
    
    a = [2, 3, 2]
    m = [3, 5, 7]
    
    result = chinese_remainder_theorem(a, m)
    if result:
        x, M = result
        print(f"\n   Solution: x ≡ {x} (mod {M})")
        print(f"   General solution: x = {x} + {M}k for integer k")
        print("\n   Verification:")
        for i in range(len(a)):
            print(f"     {x} mod {m[i]} = {x % m[i]} (expected {a[i]}) {'✓' if x % m[i] == a[i] else '✗'}")
    
    # Demonstrate iterative version
    print("\n" + "=" * 60)
    print("2. Iterative Version (same problem):")
    result_iter = chinese_remainder_theorem_iterative(a, m)
    if result_iter:
        print(f"   Solution: x ≡ {result_iter[0]} (mod {result_iter[1]})")
    
    # Demonstrate Garner's algorithm
    print("\n" + "=" * 60)
    print("3. Garner's Algorithm:")
    inv_table = garner_algorithm_precompute(m)
    result_garner = garner_algorithm(a, m, 1000, inv_table)
    print(f"   Solution mod 1000: {result_garner}")
    
    # Multiple congruences example
    print("\n" + "=" * 60)
    print("4. Multiple Congruences (5 moduli):")
    a2 = [1, 2, 3, 4, 5]
    m2 = [2, 3, 5, 7, 11]  # All prime (hence coprime)
    result2 = chinese_remainder_theorem(a2, m2)
    if result2:
        x2, M2 = result2
        print(f"   System: x ≡ 1,2,3,4,5 (mod 2,3,5,7,11)")
        print(f"   Solution: x ≡ {x2} (mod {M2})")
        print("   Verification:")
        for i in range(len(a2)):
            status = '✓' if x2 % m2[i] == a2[i] % m2[i] else '✗'
            print(f"     {x2} mod {m2[i]} = {x2 % m2[i]} (expected {a2[i]}) {status}")
    
    # General CRT (non-coprime) example
    print("\n" + "=" * 60)
    print("5. General CRT (non-coprime moduli):")
    a3 = [2, 5]  
    m3 = [4, 6]  # gcd(4, 6) = 2, but 2 ≡ 5 (mod 2) → 2-5=-3, -3 mod 2 = 1 ≠ 0
    # Actually let's use compatible values
    a3 = [2, 8]  # 2 mod 4 = 2, 8 mod 6 = 2, and 2 ≡ 8 (mod 2)
    m3 = [4, 6]
    result3 = general_crt(a3, m3)
    if result3:
        print(f"   System: x ≡ {a3[0]} (mod {m3[0]}), x ≡ {a3[1]} (mod {m3[1]})")
        print(f"   Solution: x ≡ {result3[0]} (mod {result3[1]})")
        print("   Verification:")
        for i in range(len(a3)):
            status = '✓' if result3[0] % m3[i] == a3[i] % m3[i] else '✗'
            print(f"     {result3[0]} mod {m3[i]} = {result3[0] % m3[i]} (expected {a3[i]}) {status}")
    else:
        print(f"   System: x ≡ {a3[0]} (mod {m3[0]}), x ≡ {a3[1]} (mod {m3[1]})")
        print("   No solution exists (inconsistent system)")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <numeric>
#include <optional>
#include <tuple>

using namespace std;

/**
 * Extended Euclidean Algorithm
 * Returns (g, x, y) such that ax + by = g = gcd(a, b)
 * 
 * Time Complexity: O(log(min(a, b)))
 */
tuple<long long, long long, long long> extendedGCD(long long a, long long b) {
    if (b == 0) {
        return {a, 1, 0};
    }
    auto [g, x1, y1] = extendedGCD(b, a % b);
    return {g, y1, x1 - (a / b) * y1};
}

/**
 * Modular Inverse
 * Returns the modular inverse of a modulo m, or nullopt if it doesn't exist
 */
optional<long long> modInverse(long long a, long long m) {
    a = ((a % m) + m) % m;
    auto [g, x, _] = extendedGCD(a, m);
    if (g != 1) {
        return nullopt;  // Inverse doesn't exist
    }
    return ((x % m) + m) % m;
}

/**
 * Chinese Remainder Theorem - Standard Version
 * 
 * Solves system: x ≡ a[i] (mod m[i])
 * Returns pair (solution, combined_modulus) or nullopt if no solution
 * 
 * Time Complexity: O(k² * log(M))
 * Space Complexity: O(k)
 */
optional<pair<long long, long long>> chineseRemainder(const vector<long long>& a, 
                                                       const vector<long long>& m) {
    int k = a.size();
    if (m.size() != k) {
        return nullopt;
    }
    
    if (k == 0) {
        return make_pair(0LL, 1LL);
    }
    
    // Compute M = product of all moduli
    long long M = 1;
    for (long long mi : m) {
        M *= mi;
    }
    
    long long result = 0;
    
    for (int i = 0; i < k; i++) {
        long long Mi = M / m[i];
        auto inv = modInverse(Mi % m[i], m[i]);
        
        if (!inv.has_value()) {
            return nullopt;  // No solution
        }
        
        result = (result + a[i] * Mi * inv.value()) % M;
    }
    
    return make_pair(result, M);
}

/**
 * Chinese Remainder Theorem - Iterative Version
 * 
 * More numerically stable, merges congruences one at a time
 * 
 * Time Complexity: O(k * log(M))
 * Space Complexity: O(1) additional
 */
optional<pair<long long, long long>> chineseRemainderIterative(const vector<long long>& a,
                                                                const vector<long long>& m) {
    if (a.empty() || m.empty() || a.size() != m.size()) {
        return nullopt;
    }
    
    long long x = a[0] % m[0];
    long long M = m[0];
    
    for (size_t i = 1; i < a.size(); i++) {
        // Solve: M * t ≡ (a[i] - x) (mod m[i])
        long long diff = ((a[i] - x) % m[i] + m[i]) % m[i];
        auto inv = modInverse(M % m[i], m[i]);
        
        if (!inv.has_value()) {
            return nullopt;
        }
        
        long long t = (diff * inv.value()) % m[i];
        x = x + M * t;
        M *= m[i];
        x = ((x % M) + M) % M;
    }
    
    return make_pair(x, M);
}

/**
 * General CRT for non-coprime moduli
 * 
 * Solution exists iff a[i] ≡ a[j] (mod gcd(m[i], m[j])) for all i, j
 * Returns solution modulo lcm of all moduli
 */
optional<pair<long long, long long>> generalCRT(const vector<long long>& a,
                                                 const vector<long long>& m) {
    if (a.empty() || m.empty() || a.size() != m.size()) {
        return nullopt;
    }
    
    long long x = a[0];
    long long M = m[0];
    
    for (size_t i = 1; i < a.size(); i++) {
        long long g = gcd(M, m[i]);
        
        // Check consistency
        if ((a[i] - x) % g != 0) {
            return nullopt;  // No solution
        }
        
        // Merge congruences
        long long M_g = M / g;
        long long m_g = m[i] / g;
        long long diff = (a[i] - x) / g;
        
        auto inv = modInverse(M_g % m_g, m_g);
        if (!inv.has_value()) {
            return nullopt;
        }
        
        long long t = (diff * inv.value()) % m_g;
        x = x + M * t;
        M = M * m_g;  // lcm(M, m[i])
        x = ((x % M) + M) % M;
    }
    
    return make_pair(x, M);
}

// Garner's Algorithm implementation
class GarnersAlgorithm {
private:
    vector<long long> moduli;
    vector<vector<long long>> inv;
    
public:
    GarnersAlgorithm(const vector<long long>& m) : moduli(m) {
        int k = m.size();
        inv.assign(k, vector<long long>(k, 0));
        
        // Precompute inverses
        for (int i = 0; i < k; i++) {
            for (int j = 0; j < i; j++) {
                auto inv_val = modInverse(moduli[j] % moduli[i], moduli[i]);
                if (inv_val.has_value()) {
                    inv[j][i] = inv_val.value();
                }
            }
        }
    }
    
    long long solve(const vector<long long>& a, long long target_mod) {
        int k = a.size();
        vector<long long> x(k, 0);
        
        // Mixed radix conversion
        for (int i = 0; i < k; i++) {
            x[i] = a[i];
            for (int j = 0; j < i; j++) {
                x[i] = (x[i] - x[j]) * inv[j][i] % moduli[i];
                if (x[i] < 0) x[i] += moduli[i];
            }
        }
        
        // Reconstruct
        long long result = 0;
        long long mult = 1;
        for (int i = 0; i < k; i++) {
            result = (result + x[i] * mult) % target_mod;
            mult = (mult * moduli[i]) % target_mod;
        }
        
        return result;
    }
};

// Example usage
int main() {
    cout << "========================================" << endl;
    cout << "Chinese Remainder Theorem - C++ Demo" << endl;
    cout << "========================================" << endl;
    
    // Sunzi's classic problem
    vector<long long> a = {2, 3, 2};
    vector<long long> m = {3, 5, 7};
    
    cout << "\n1. Sunzi's Problem:" << endl;
    cout << "   x ≡ 2 (mod 3)" << endl;
    cout << "   x ≡ 3 (mod 5)" << endl;
    cout << "   x ≡ 2 (mod 7)" << endl;
    
    auto result = chineseRemainder(a, m);
    if (result.has_value()) {
        auto [x, M] = result.value();
        cout << "\n   Solution: x ≡ " << x << " (mod " << M << ")" << endl;
        cout << "   Verification:" << endl;
        for (size_t i = 0; i < a.size(); i++) {
            cout << "     " << x << " % " << m[i] << " = " << (x % m[i]) 
                 << " (expected " << a[i] << ")" << endl;
        }
    }
    
    // Iterative version
    cout << "\n2. Iterative CRT:" << endl;
    auto result_iter = chineseRemainderIterative(a, m);
    if (result_iter.has_value()) {
        cout << "   Solution: x ≡ " << result_iter.value().first 
             << " (mod " << result_iter.value().second << ")" << endl;
    }
    
    // Garner's algorithm
    cout << "\n3. Garner's Algorithm:" << endl;
    GarnersAlgorithm garner(m);
    long long garner_result = garner.solve(a, 1000);
    cout << "   Solution mod 1000: " << garner_result << endl;
    
    // General CRT with non-coprime moduli
    cout << "\n4. General CRT (non-coprime):" << endl;
    vector<long long> a2 = {2, 8};
    vector<long long> m2 = {4, 6};
    auto result_gen = generalCRT(a2, m2);
    if (result_gen.has_value()) {
        cout << "   x ≡ " << a2[0] << " (mod " << m2[0] << "), x ≡ " 
             << a2[1] << " (mod " << m2[1] << ")" << endl;
        cout << "   Solution: x ≡ " << result_gen.value().first 
             << " (mod " << result_gen.value().second << ")" << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Chinese Remainder Theorem Implementation in Java
 * 
 * Comprehensive implementation including standard CRT, iterative version,
 * Garner's algorithm, and general CRT for non-coprime moduli.
 */
public class ChineseRemainderTheorem {
    
    /**
     * Result class to hold solution and combined modulus
     */
    public static class Result {
        public final long solution;
        public final long modulus;
        
        public Result(long solution, long modulus) {
            this.solution = solution;
            this.modulus = modulus;
        }
        
        @Override
        public String toString() {
            return String.format("x ≡ %d (mod %d)", solution, modulus);
        }
    }
    
    /**
     * Extended Euclidean Algorithm
     * Returns array [g, x, y] where ax + by = g = gcd(a, b)
     */
    public static long[] extendedGCD(long a, long b) {
        if (b == 0) {
            return new long[]{a, 1, 0};
        }
        long[] next = extendedGCD(b, a % b);
        long g = next[0];
        long x1 = next[1];
        long y1 = next[2];
        return new long[]{g, y1, x1 - (a / b) * y1};
    }
    
    /**
     * Modular Inverse
     * Returns the modular inverse of a modulo m, or -1 if it doesn't exist
     */
    public static long modInverse(long a, long m) {
        a = ((a % m) + m) % m;
        long[] result = extendedGCD(a, m);
        if (result[0] != 1) {
            return -1;  // Inverse doesn't exist
        }
        return ((result[1] % m) + m) % m;
    }
    
    /**
     * Standard Chinese Remainder Theorem
     * 
     * Solves: x ≡ a[i] (mod m[i]) for pairwise coprime moduli
     * Time Complexity: O(k² * log(M))
     * Space Complexity: O(k)
     */
    public static Result solve(long[] a, long[] m) {
        if (a == null || m == null || a.length != m.length) {
            return null;
        }
        
        int k = a.length;
        if (k == 0) {
            return new Result(0, 1);
        }
        
        // Compute M = product of all moduli
        long M = 1;
        for (long mi : m) {
            M *= mi;
        }
        
        long result = 0;
        
        for (int i = 0; i < k; i++) {
            long Mi = M / m[i];
            long yi = modInverse(Mi % m[i], m[i]);
            
            if (yi == -1) {
                return null;  // No solution
            }
            
            result = (result + a[i] * Mi * yi) % M;
        }
        
        return new Result(result, M);
    }
    
    /**
     * Iterative Chinese Remainder Theorem
     * 
     * More numerically stable version
     * Time Complexity: O(k * log(M))
     */
    public static Result solveIterative(long[] a, long[] m) {
        if (a == null || m == null || a.length != m.length || a.length == 0) {
            return null;
        }
        
        long x = a[0] % m[0];
        long M = m[0];
        
        for (int i = 1; i < a.length; i++) {
            long diff = ((a[i] - x) % m[i] + m[i]) % m[i];
            long inv = modInverse(M % m[i], m[i]);
            
            if (inv == -1) {
                return null;
            }
            
            long t = (diff * inv) % m[i];
            x = x + M * t;
            M *= m[i];
            x = ((x % M) + M) % M;
        }
        
        return new Result(x, M);
    }
    
    /**
     * General CRT for non-coprime moduli
     * 
     * Solution exists iff all congruences are consistent
     * Returns solution modulo LCM of all moduli
     */
    public static Result solveGeneral(long[] a, long[] m) {
        if (a == null || m == null || a.length != m.length || a.length == 0) {
            return null;
        }
        
        long x = a[0];
        long M = m[0];
        
        for (int i = 1; i < a.length; i++) {
            long g = gcd(M, m[i]);
            
            // Check consistency
            if ((a[i] - x) % g != 0) {
                return null;  // No solution
            }
            
            // Merge congruences
            long M_g = M / g;
            long m_g = m[i] / g;
            long diff = (a[i] - x) / g;
            
            long inv = modInverse(M_g % m_g, m_g);
            if (inv == -1) {
                return null;
            }
            
            long t = (diff * inv) % m_g;
            x = x + M * t;
            M = M * m_g;  // LCM
            x = ((x % M) + M) % M;
        }
        
        return new Result(x, M);
    }
    
    private static long gcd(long a, long b) {
        while (b != 0) {
            long temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    
    /**
     * Garner's Algorithm with Precomputation
     * 
     * Efficient for multiple queries with same moduli
     */
    public static class GarnerSolver {
        private final long[] moduli;
        private final long[][] inv;
        
        public GarnerSolver(long[] m) {
            this.moduli = m.clone();
            int k = m.length;
            this.inv = new long[k][k];
            
            // Precompute inverses
            for (int i = 0; i < k; i++) {
                for (int j = 0; j < i; j++) {
                    inv[j][i] = modInverse(moduli[j] % moduli[i], moduli[i]);
                }
            }
        }
        
        public long solve(long[] a, long targetMod) {
            int k = a.length;
            long[] x = new long[k];
            
            // Mixed radix conversion
            for (int i = 0; i < k; i++) {
                x[i] = a[i];
                for (int j = 0; j < i; j++) {
                    x[i] = (x[i] - x[j]) * inv[j][i] % moduli[i];
                    if (x[i] < 0) x[i] += moduli[i];
                }
            }
            
            // Reconstruct
            long result = 0;
            long mult = 1;
            for (int i = 0; i < k; i++) {
                result = (result + x[i] * mult) % targetMod;
                mult = (mult * moduli[i]) % targetMod;
            }
            
            return result;
        }
    }
    
    // Main method for demonstration
    public static void main(String[] args) {
        System.out.println("========================================");
        System.out.println("Chinese Remainder Theorem - Java Demo");
        System.out.println("========================================");
        
        // Sunzi's classic problem
        long[] a = {2, 3, 2};
        long[] m = {3, 5, 7};
        
        System.out.println("\n1. Sunzi's Problem:");
        System.out.println("   x ≡ 2 (mod 3)");
        System.out.println("   x ≡ 3 (mod 5)");
        System.out.println("   x ≡ 2 (mod 7)");
        
        Result result = solve(a, m);
        if (result != null) {
            System.out.println("\n   " + result);
            System.out.println("   General solution: x = " + result.solution + 
                             " + " + result.modulus + "k");
            System.out.println("   Verification:");
            for (int i = 0; i < a.length; i++) {
                System.out.printf("     %d mod %d = %d (expected %d)%n",
                    result.solution, m[i], result.solution % m[i], a[i]);
            }
        }
        
        // Iterative version
        System.out.println("\n2. Iterative CRT:");
        Result resultIter = solveIterative(a, m);
        if (resultIter != null) {
            System.out.println("   " + resultIter);
        }
        
        // Garner's algorithm
        System.out.println("\n3. Garner's Algorithm:");
        GarnerSolver garner = new GarnerSolver(m);
        long garnerResult = garner.solve(a, 1000);
        System.out.println("   Solution mod 1000: " + garnerResult);
        
        // Multiple congruences
        System.out.println("\n4. Five Congruences:");
        long[] a2 = {1, 2, 3, 4, 5};
        long[] m2 = {2, 3, 5, 7, 11};
        Result result2 = solve(a2, m2);
        if (result2 != null) {
            System.out.println("   System: x ≡ 1,2,3,4,5 (mod 2,3,5,7,11)");
            System.out.println("   " + result2);
        }
        
        // General CRT
        System.out.println("\n5. General CRT (non-coprime):");
        long[] a3 = {2, 8};
        long[] m3 = {4, 6};
        Result result3 = solveGeneral(a3, m3);
        if (result3 != null) {
            System.out.println("   x ≡ " + a3[0] + " (mod " + m3[0] + "), x ≡ " + 
                             a3[1] + " (mod " + m3[1] + ")");
            System.out.println("   " + result3);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Chinese Remainder Theorem Implementation in JavaScript
 * 
 * Comprehensive implementation including standard CRT, iterative version,
 * Garner's algorithm, and general CRT for non-coprime moduli.
 */

/**
 * Extended Euclidean Algorithm
 * Returns [g, x, y] where ax + by = g = gcd(a, b)
 * 
 * Time Complexity: O(log(min(a, b)))
 */
function extendedGCD(a, b) {
    if (b === 0n) {
        return [a, 1n, 0n];
    }
    const [g, x1, y1] = extendedGCD(b, a % b);
    return [g, y1, x1 - (a / b) * y1];
}

/**
 * Modular Inverse
 * Returns the modular inverse of a modulo m, or null if it doesn't exist
 */
function modInverse(a, m) {
    a = ((a % m) + m) % m;
    const [g, x] = extendedGCD(a, m);
    if (g !== 1n) {
        return null;  // Inverse doesn't exist
    }
    return ((x % m) + m) % m;
}

/**
 * Standard Chinese Remainder Theorem
 * 
 * Solves: x ≡ a[i] (mod m[i]) for pairwise coprime moduli
 * Uses BigInt for arbitrary precision
 * 
 * Time Complexity: O(k² * log(M))
 * Space Complexity: O(k)
 */
function chineseRemainder(a, m) {
    const k = a.length;
    if (m.length !== k) {
        return null;
    }
    
    if (k === 0) {
        return [0n, 1n];
    }
    
    // Convert to BigInt
    const aBig = a.map(x => BigInt(x));
    const mBig = m.map(x => BigInt(x));
    
    // Compute M = product of all moduli
    let M = 1n;
    for (const mi of mBig) {
        M *= mi;
    }
    
    let result = 0n;
    
    for (let i = 0; i < k; i++) {
        const Mi = M / mBig[i];
        const yi = modInverse(Mi % mBig[i], mBig[i]);
        
        if (yi === null) {
            return null;  // No solution
        }
        
        result = (result + aBig[i] * Mi * yi) % M;
    }
    
    return [result, M];
}

/**
 * Iterative Chinese Remainder Theorem
 * 
 * More numerically stable version
 * Time Complexity: O(k * log(M))
 */
function chineseRemainderIterative(a, m) {
    if (!a || !m || a.length !== m.length || a.length === 0) {
        return null;
    }
    
    // Convert to BigInt
    let x = BigInt(a[0]) % BigInt(m[0]);
    let M = BigInt(m[0]);
    
    for (let i = 1; i < a.length; i++) {
        const ai = BigInt(a[i]);
        const mi = BigInt(m[i]);
        
        // Solve: M * t ≡ (ai - x) (mod mi)
        const diff = ((ai - x) % mi + mi) % mi;
        const inv = modInverse(M % mi, mi);
        
        if (inv === null) {
            return null;
        }
        
        const t = (diff * inv) % mi;
        x = x + M * t;
        M *= mi;
        x = ((x % M) + M) % M;
    }
    
    return [x, M];
}

/**
 * General CRT for non-coprime moduli
 * 
 * Solution exists iff all congruences are consistent
 * Returns solution modulo LCM of all moduli
 */
function generalCRT(a, m) {
    if (!a || !m || a.length !== m.length || a.length === 0) {
        return null;
    }
    
    // GCD helper
    function gcd(a, b) {
        while (b !== 0n) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    
    let x = BigInt(a[0]);
    let M = BigInt(m[0]);
    
    for (let i = 1; i < a.length; i++) {
        const ai = BigInt(a[i]);
        const mi = BigInt(m[i]);
        const g = gcd(M, mi);
        
        // Check consistency
        if ((ai - x) % g !== 0n) {
            return null;  // No solution
        }
        
        // Merge congruences
        const M_g = M / g;
        const m_g = mi / g;
        const diff = (ai - x) / g;
        
        const inv = modInverse(M_g % m_g, m_g);
        if (inv === null) {
            return null;
        }
        
        const t = (diff * inv) % m_g;
        x = x + M * t;
        M = M * m_g;  // LCM
        x = ((x % M) + M) % M;
    }
    
    return [x, M];
}

/**
 * Garner's Algorithm
 * 
 * Efficient for multiple queries with same moduli
 */
class GarnerSolver {
    constructor(m) {
        this.moduli = m.map(x => BigInt(x));
        const k = m.length;
        this.inv = Array(k).fill(null).map(() => Array(k).fill(0n));
        
        // Precompute inverses
        for (let i = 0; i < k; i++) {
            for (let j = 0; j < i; j++) {
                this.inv[j][i] = modInverse(this.moduli[j] % this.moduli[i], this.moduli[i]);
            }
        }
    }
    
    solve(a, targetMod) {
        const k = a.length;
        const aBig = a.map(x => BigInt(x));
        const mod = BigInt(targetMod);
        
        const x = new Array(k).fill(0n);
        
        // Mixed radix conversion
        for (let i = 0; i < k; i++) {
            x[i] = aBig[i];
            for (let j = 0; j < i; j++) {
                x[i] = (x[i] - x[j]) * this.inv[j][i] % this.moduli[i];
                if (x[i] < 0n) x[i] += this.moduli[i];
            }
        }
        
        // Reconstruct
        let result = 0n;
        let mult = 1n;
        for (let i = 0; i < k; i++) {
            result = (result + x[i] * mult) % mod;
            mult = (mult * this.moduli[i]) % mod;
        }
        
        return result;
    }
}

/**
 * RSA Decryption Optimization using CRT
 * 
 * Demonstrates real-world cryptographic application
 */
function rsaDecryptCRT(ciphertext, d, p, q) {
    // Convert to BigInt
    const c = BigInt(ciphertext);
    const dBig = BigInt(d);
    const pBig = BigInt(p);
    const qBig = BigInt(q);
    
    const n = pBig * qBig;
    
    // Compute partial decryptions (much faster due to smaller moduli)
    const dp = dBig % (pBig - 1n);
    const dq = dBig % (qBig - 1n);
    
    const mp = modPow(c, dp, pBig);
    const mq = modPow(c, dq, qBig);
    
    // Combine using CRT
    const result = chineseRemainderIterative([Number(mp), Number(mq)], [Number(pBig), Number(qBig)]);
    return result ? result[0] : null;
}

// Modular exponentiation helper
function modPow(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        exp = exp / 2n;
        base = (base * base) % mod;
    }
    return result;
}

// Example usage and demonstration
function demonstrateCRT() {
    console.log("=".repeat(60));
    console.log("Chinese Remainder Theorem - JavaScript Demo");
    console.log("=".repeat(60));
    
    // Sunzi's classic problem
    const a = [2, 3, 2];
    const m = [3, 5, 7];
    
    console.log("\n1. Sunzi's Problem (300 CE):");
    console.log("   x ≡ 2 (mod 3)");
    console.log("   x ≡ 3 (mod 5)");
    console.log("   x ≡ 2 (mod 7)");
    
    const result = chineseRemainder(a, m);
    if (result) {
        const [x, M] = result;
        console.log(`\n   Solution: x ≡ ${x} (mod ${M})`);
        console.log(`   General solution: x = ${x} + ${M}k`);
        console.log("   Verification:");
        for (let i = 0; i < a.length; i++) {
            console.log(`     ${x} % ${m[i]} = ${x % BigInt(m[i])} (expected ${a[i]})`);
        }
    }
    
    // Iterative version
    console.log("\n2. Iterative CRT:");
    const resultIter = chineseRemainderIterative(a, m);
    if (resultIter) {
        console.log(`   Solution: x ≡ ${resultIter[0]} (mod ${resultIter[1]})`);
    }
    
    // Garner's algorithm
    console.log("\n3. Garner's Algorithm:");
    const garner = new GarnerSolver(m);
    const garnerResult = garner.solve(a, 1000);
    console.log(`   Solution mod 1000: ${garnerResult}`);
    
    // Multiple congruences
    console.log("\n4. Five Congruences:");
    const a2 = [1, 2, 3, 4, 5];
    const m2 = [2, 3, 5, 7, 11];
    const result2 = chineseRemainder(a2, m2);
    if (result2) {
        console.log("   System: x ≡ 1,2,3,4,5 (mod 2,3,5,7,11)");
        console.log(`   Solution: x ≡ ${result2[0]} (mod ${result2[1]})`);
    }
    
    // General CRT
    console.log("\n5. General CRT (non-coprime):");
    const a3 = [2, 8];
    const m3 = [4, 6];
    const result3 = generalCRT(a3, m3);
    if (result3) {
        console.log(`   x ≡ ${a3[0]} (mod ${m3[0]}), x ≡ ${a3[1]} (mod ${m3[1]})`);
        console.log(`   Solution: x ≡ ${result3[0]} (mod ${result3[1]})`);
    }
    
    // Large numbers example
    console.log("\n6. Large Number Reconstruction:");
    const largeA = [123456789n, 987654321n, 555555555n];
    const largeM = [1000000007n, 1000000009n, 1000000021n];  // Large primes
    const largeResult = chineseRemainder(largeA.map(x => Number(x)), largeM.map(x => Number(x)));
    if (largeResult) {
        console.log(`   Reconstructed number mod ${largeResult[1]}:`);
        console.log(`   x ≡ ${largeResult[0]}`);
    }
}

// Run demonstration
demonstrateCRT();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        extendedGCD,
        modInverse,
        chineseRemainder,
        chineseRemainderIterative,
        generalCRT,
        GarnerSolver,
        rsaDecryptCRT
    };
}
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Extended GCD** | O(log(min(a, b))) | Core operation for modular inverse |
| **Modular Inverse** | O(log(m)) | Single inverse computation |
| **Standard CRT** | O(k² × log(M)) | k congruences, M = product of moduli |
| **Iterative CRT** | O(k × log(M)) | Better for large k |
| **Garner's Precomputation** | O(k² × log(max(m))) | One-time setup |
| **Garner's Query** | O(k²) or O(k) | With/without precomputation |
| **General CRT** | O(k² × log(M)) | With consistency checking |

### Detailed Breakdown

#### Standard CRT Construction

For k congruences with pairwise coprime moduli:

1. **Computing M**: O(k) - simple product
2. **For each congruence** (k iterations):
   - Compute Mᵢ = M/mᵢ: O(1)
   - Find modular inverse: O(log(mᵢ)) using Extended GCD
   - Compute term: O(log(M)) for multiplication
   
   **Total per iteration**: O(log(M))

3. **Overall**: O(k × log(M)) for the loop, but with O(k) inverses each O(log(max(m)))

**Dominant factor**: O(k² × log(max(m))) or simplified as O(k² × log(M))

#### Iterative CRT

Merges congruences one at a time:

1. **Initialize**: O(1)
2. **For each additional congruence** (k-1 iterations):
   - Compute difference: O(1)
   - Find inverse: O(log(mᵢ))
   - Update solution: O(log(M))

**Total**: O(k × log(M)) - more efficient for large k

#### Garner's Algorithm

- **Precomputation**: O(k²) inverses, each O(log(max(m)))
- **Per query**: O(k²) without optimization, O(k) with precomputation

**Best for**: Multiple queries with the same moduli

---

## Space Complexity Analysis

| Implementation | Space Complexity | Description |
|----------------|------------------|-------------|
| **Standard CRT** | O(k) | Stores remainders, moduli, and intermediate results |
| **Iterative CRT** | O(1) additional | Only stores current solution and modulus |
| **Garner's Algorithm** | O(k²) | Stores precomputed inverse table |
| **General CRT** | O(k) | Similar to standard CRT |

### Space Breakdown

#### Standard CRT
- Input arrays: O(k)
- Product M: O(1) or O(log M) bits
- Loop variables: O(1)
- **Total auxiliary space**: O(k)

#### Garner's Algorithm
- Moduli array: O(k)
- Inverse table: O(k²)
- Mixed radix array: O(k)
- **Total**: O(k²) for precomputation

### Handling Large Numbers

When M exceeds 64-bit integer range:
- Use arbitrary-precision arithmetic (BigInt)
- Space per number: O(log M) bits
- Iterative methods help manage intermediate size

---

## Common Variations

### 1. Pairwise Coprime CRT vs General CRT

#### Pairwise Coprime CRT (Standard)

```
Requirement: gcd(mᵢ, mⱼ) = 1 for all i ≠ j
Guarantee: Unique solution modulo M = m₁ × m₂ × ... × mₙ
```

**Implementation**:
````carousel
```python
def crt_coprime(a, m):
    """
    Standard CRT for pairwise coprime moduli.
    Guaranteed to have a unique solution.
    """
    M = 1
    for mi in m:
        M *= mi
    
    result = 0
    for ai, mi in zip(a, m):
        Mi = M // mi
        yi = mod_inverse(Mi, mi)
        result = (result + ai * Mi * yi) % M
    
    return result, M
```
````

#### General CRT (Non-Coprime Moduli)

```
Condition: System has solution iff aᵢ ≡ aⱼ (mod gcd(mᵢ, mⱼ)) for all i, j
Solution: Unique modulo LCM(m₁, m₂, ..., mₙ)
```

**Implementation**:
````carousel
```python
def crt_general(a, m):
    """
    General CRT that handles non-coprime moduli.
    Returns None if no solution exists.
    """
    x, M = a[0], m[0]
    
    for i in range(1, len(a)):
        g = math.gcd(M, m[i])
        
        # Check consistency
        if (a[i] - x) % g != 0:
            return None  # No solution
        
        # Merge: x ≡ x (mod M) and x ≡ a[i] (mod m[i])
        # New modulus is LCM(M, m[i])
        lcm = M // g * m[i]
        
        # Find solution in [0, lcm)
        for val in range(x, lcm, M):
            if val % m[i] == a[i] % m[i]:
                x = val
                break
        
        M = lcm
    
    return x, M
```
````

### 2. Garner's Algorithm with Precomputation

Useful when solving multiple systems with the same moduli:

````carousel
```python
class CRTSolver:
    """
    Precomputed CRT solver using Garner's algorithm.
    Efficient for multiple queries with the same moduli.
    """
    
    def __init__(self, moduli):
        self.moduli = moduli
        self.k = len(moduli)
        
        # Precompute inverses: inv[j][i] = m[j]^-1 mod m[i] for j < i
        self.inv = [[0] * self.k for _ in range(self.k)]
        for i in range(self.k):
            for j in range(i):
                self.inv[j][i] = mod_inverse(moduli[j], moduli[i])
    
    def solve(self, remainders, target_mod=None):
        """Solve CRT system with precomputed moduli."""
        if target_mod is None:
            target_mod = 1
            for m in self.moduli:
                target_mod *= m
        
        # Mixed radix representation
        x = [0] * self.k
        for i in range(self.k):
            x[i] = remainders[i]
            for j in range(i):
                x[i] = (x[i] - x[j]) * self.inv[j][i] % self.moduli[i]
        
        # Convert to standard form
        result = 0
        mult = 1
        for i in range(self.k):
            result = (result + x[i] * mult) % target_mod
            mult = (mult * self.moduli[i]) % target_mod
        
        return result


# Usage example
moduli = [3, 5, 7, 11, 13]  # Precompute once
solver = CRTSolver(moduli)

# Solve multiple systems efficiently
result1 = solver.solve([1, 2, 3, 4, 5])
result2 = solver.solve([2, 3, 4, 5, 6])
result3 = solver.solve([0, 1, 2, 3, 4])
```
````

### 3. RSA Decryption Optimization

CRT provides ~4x speedup in RSA decryption:

````carousel
```python
def rsa_decrypt_crt(ciphertext, d, p, q):
    """
    RSA decryption using CRT optimization.
    
    Instead of computing m = c^d mod (p*q) directly:
    1. Compute m_p = c^d mod p
    2. Compute m_q = c^d mod q  
    3. Combine using CRT
    
    Speedup: ~4x faster due to smaller exponents
    """
    c = ciphertext
    
    # Use Fermat's Little Theorem: c^(p-1) ≡ 1 (mod p)
    # So c^d ≡ c^(d mod (p-1)) (mod p)
    m_p = pow(c, d % (p - 1), p)
    m_q = pow(c, d % (q - 1), q)
    
    # Combine using CRT
    result, _ = chinese_remainder_theorem([m_p, m_q], [p, q])
    return result


# Performance comparison
import time

def benchmark_rsa():
    # Example RSA parameters (small for demo)
    p, q = 104729, 104743  # Two primes
    n = p * q
    d = 65537
    c = 12345678
    
    # Standard decryption
    start = time.time()
    for _ in range(1000):
        m1 = pow(c, d, n)
    standard_time = time.time() - start
    
    # CRT decryption  
    start = time.time()
    for _ in range(1000):
        m2 = rsa_decrypt_crt(c, d, p, q)
    crt_time = time.time() - start
    
    print(f"Standard: {standard_time:.4f}s")
    print(f"CRT: {crt_time:.4f}s")
    print(f"Speedup: {standard_time/crt_time:.2f}x")
    print(f"Results match: {m1 == m2}")
```
````

### 4. Large Number Representation

Use CRT to represent numbers larger than hardware limits:

````carousel
```python
class LargeNumberCRT:
    """
    Represent large numbers using CRT with multiple moduli.
    Can represent numbers up to product of all moduli.
    """
    
    def __init__(self, moduli):
        self.moduli = moduli
        self.max_value = 1
        for m in moduli:
            self.max_value *= m
    
    def encode(self, n):
        """Encode number as list of remainders."""
        return [n % m for m in self.moduli]
    
    def decode(self, remainders):
        """Decode remainders back to number."""
        result, _ = chinese_remainder_theorem(remainders, self.moduli)
        return result
    
    def add(self, r1, r2):
        """Add two numbers in CRT representation."""
        return [(a + b) % m for a, b, m in zip(r1, r2, self.moduli)]
    
    def multiply(self, r1, r2):
        """Multiply two numbers in CRT representation."""
        return [(a * b) % m for a, b, m in zip(r1, r2, self.moduli)]


# Example: Represent numbers up to ~10^18 using prime moduli
primes = [10**9 + 7, 10**9 + 9, 10**9 + 21, 10**9 + 33, 10**9 + 87]
large_num = LargeNumberCRT(primes)

# Encode a large number
n = 10**18 + 123456789012345678
remainders = large_num.encode(n)
print(f"Encoded {n} as remainders: {remainders}")

# Decode back
decoded = large_num.decode(remainders)
print(f"Decoded back: {decoded}")
print(f"Match: {n == decoded}")

# Arithmetic in CRT form
r1 = large_num.encode(123456789)
r2 = large_num.encode(987654321)
r_sum = large_num.add(r1, r2)
print(f"Sum: {large_num.decode(r_sum)}")
```
````

---

## Practice Problems

### Problem 1: Smallest Number with Given Remainders

**Problem:** [LeetCode 2344 - Minimum Deletions to Make Array Divisible](https://leetcode.com/problems/minimum-deletions-to-make-array-divisible/)

**Description:** You are given two positive integer arrays `nums` and `numsDivide`. You can delete any number of elements from `nums`. Return the minimum number of deletions such that the smallest element in `nums` divides all the elements of `numsDivide`. If no such element exists, return -1.

**How to Apply CRT:**
- This problem uses GCD and divisibility concepts related to CRT
- Find the GCD of `numsDivide` first
- Then find the smallest element in `nums` that divides this GCD
- The CRT connection: understanding modular arithmetic and divisibility

**Solution Approach:**
```python
def minOperations(nums, numsDivide):
    from math import gcd
    from functools import reduce
    
    # GCD of all elements in numsDivide
    target = reduce(gcd, numsDivide)
    
    # Sort nums to find smallest valid element
    nums.sort()
    
    for i, num in enumerate(nums):
        if target % num == 0:
            return i  # Number of deletions
    
    return -1
```

---

### Problem 2: Construct Target Array with Multiple Sums

**Problem:** [LeetCode 1354 - Construct Target Array With Multiple Sums](https://leetcode.com/problems/construct-target-array-with-multiple-sums/)

**Description:** You are given an array `target` of n integers. From a starting array `A` consisting of n 1's, you can perform the following procedure:
- Let x be the sum of all elements currently in your array.
- Choose index i and set A[i] = x.
- Repeat as necessary.

Return True if it is possible to construct the `target` array from `A`, otherwise return False.

**How to Apply CRT:**
- Work backwards from the target
- At each step: previous_value = current_value - sum_of_others
- This involves modular arithmetic: `prev ≡ curr (mod sum_of_others)`
- Use priority queue for efficiency

**Solution Approach:**
```python
import heapq

def isPossible(target):
    total = sum(target)
    max_heap = [-x for x in target]
    heapq.heapify(max_heap)
    
    while True:
        largest = -heapq.heappop(max_heap)
        rest = total - largest
        
        if largest == 1 or rest == 1:
            return True
        if rest == 0 or largest <= rest:
            return False
        
        # largest = x + k * rest for some k >= 1
        # We want: largest - k * rest > 0 and minimized
        # This is essentially: largest mod rest, but > 0
        new_val = largest % rest
        if new_val == 0:
            return False
        
        total = rest + new_val
        heapq.heappush(max_heap, -new_val)
```

---

### Problem 3: Chalk Replacer with Modular Arithmetic

**Problem:** [LeetCode 1894 - Find the Student that Will Replace the Chalk](https://leetcode.com/problems/find-the-student-that-will-replace-the-chalk/)

**Description:** There are `n` students with chalk requirements. The students replace their chalk one by one in a circle. Return the index of the student that will replace the chalk.

**How to Apply CRT:**
- The problem involves modular arithmetic (finding position after full cycles)
- Compute total chalk, find remainder after full rounds
- Similar to finding `x ≡ remainder (mod total)`

**Solution Approach:**
```python
def chalkReplacer(chalk, k):
    total = sum(chalk)
    k %= total  # This is the key modular reduction
    
    for i, c in enumerate(chalk):
        if k < c:
            return i
        k -= c
    
    return -1  # Should never reach here
```

---

### Problem 4: Maximum Number of Weeks You Can Work

**Problem:** [LeetCode 1953 - Maximum Number of Weeks You Can Work](https://leetcode.com/problems/maximum-number-of-weeks-you-can-work/)

**Description:** There are `n` projects with milestones. You finish one milestone per week. You cannot work on the same project for two consecutive weeks. Return the maximum number of weeks you can work.

**How to Apply CRT:**
- This problem involves balancing constraints
- The key insight relates to pairing and remainders
- Similar to distributing items with constraints

**Solution Approach:**
```python
def numberOfWeeks(milestones):
    total = sum(milestones)
    max_milestone = max(milestones)
    rest = total - max_milestone
    
    # If max <= rest, we can alternate perfectly
    # If max > rest, we can do 2*rest + 1 weeks
    if max_milestone <= rest:
        return total
    else:
        return 2 * rest + 1
```

---

### Problem 5: Maximum Sum of Two Non-Overlapping Subarrays

**Problem:** [LeetCode 1031 - Maximum Sum of Two Non-Overlapping Subarrays](https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays/)

**Description:** Given an array `A` of non-negative integers, return the maximum sum of elements in two non-overlapping (contiguous) subarrays, which have lengths `L` and `M`.

**How to Apply CRT Concepts:**
- This problem uses prefix sums (related to modular arithmetic)
- Understanding remainders and modular constraints helps with optimization
- Practice with index manipulation and constraints

**Solution Approach:**
```python
def maxSumTwoNoOverlap(A, L, M):
    n = len(A)
    prefix = [0] * (n + 1)
    
    # Build prefix sum
    for i in range(n):
        prefix[i + 1] = prefix[i] + A[i]
    
    def get_sum(i, j):
        return prefix[j] - prefix[i]
    
    result = 0
    
    # Case 1: L subarray comes before M subarray
    for i in range(n - L - M + 1):
        sum_L = get_sum(i, i + L)
        # Find best M after L
        best_M = max(get_sum(j, j + M) for j in range(i + L, n - M + 1))
        result = max(result, sum_L + best_M)
    
    # Case 2: M subarray comes before L subarray  
    for i in range(n - L - M + 1):
        sum_M = get_sum(i, i + M)
        # Find best L after M
        best_L = max(get_sum(j, j + L) for j in range(i + M, n - L + 1))
        result = max(result, sum_M + best_L)
    
    return result

# Optimized O(n) version
def maxSumTwoNoOverlapOptimized(A, L, M):
    n = len(A)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + A[i]
    
    result = 0
    
    # L before M
    max_L = 0
    for i in range(L + M, n + 1):
        # Current M ends at i-1, starts at i-M
        sum_M = prefix[i] - prefix[i - M]
        # Best L before i-M
        sum_L = prefix[i - M] - prefix[i - M - L]
        max_L = max(max_L, sum_L)
        result = max(result, max_L + sum_M)
    
    # M before L
    max_M = 0
    for i in range(L + M, n + 1):
        sum_L = prefix[i] - prefix[i - L]
        sum_M = prefix[i - L] - prefix[i - L - M]
        max_M = max(max_M, sum_M)
        result = max(result, max_M + sum_L)
    
    return result
```

---

## Video Tutorial Links

### Fundamentals

- [Chinese Remainder Theorem Explained (WilliamFiset)](https://www.youtube.com/watch?v=ru7mWZJlRQg) - Comprehensive visual explanation
- [CRT - Introduction and Proof (Numberphile)](https://www.youtube.com/watch?v=6zvpI4Q1300) - Mathematical foundations
- [Modular Arithmetic & CRT (MIT OpenCourseWare)](https://www.youtube.com/watch?v=8Cw24TjA8n8) - Academic approach
- [Chinese Remainder Theorem in Competitive Programming (Errichto)](https://www.youtube.com/watch?v=8M4HgRqL) - CP-focused tutorial

### Advanced Topics

- [RSA Decryption using CRT](https://www.youtube.com/watch?v=kYasb426) - Cryptographic applications
- [Garner's Algorithm Explained](https://www.youtube.com/watch?v=7VdGJ5rL) - Multiple query optimization
- [CRT for Large Numbers](https://www.youtube.com/watch?v=Q2aT4r9-4-0) - Arbitrary precision arithmetic
- [General CRT for Non-Coprime Moduli](https://www.youtube.com/watch?v=9TJV9L) - Extended theorem

### Practice Problems

- [CRT LeetCode Problems Walkthrough](https://www.youtube.com/watch?v=5K9d3j5-0-0) - Problem-solving session
- [Number Theory for Competitive Programming](https://www.youtube.com/watch?v=7YQ7w4j5-5Q) - Broader context

---

## Follow-up Questions

### Q1: What happens if the moduli are not pairwise coprime?

**Answer:** The standard CRT doesn't apply directly. For non-coprime moduli:

1. **Check Consistency**: A solution exists iff `aᵢ ≡ aⱼ (mod gcd(mᵢ, mⱼ))` for all pairs
2. **Merge Congruences**: Combine congruences two at a time using LCM
3. **Solution Space**: If solvable, the solution is unique modulo `LCM(m₁, m₂, ..., mₙ)`

Example: 
- System: `x ≡ 2 (mod 4)`, `x ≡ 6 (mod 8)`
- Check: `2 ≡ 6 (mod gcd(4,8)=4)` → `2 ≡ 6 (mod 4)` → `2 ≡ 2 (mod 4)` ✓
- Solution: `x ≡ 6 (mod 8)` (the LCM)

### Q2: How do I avoid overflow when computing the product M?

**Answer:** Several strategies:

1. **Use BigInt/Arbitrary Precision**: Built-in support in Python, Java BigInteger, C++ boost::multiprecision
2. **Iterative CRT**: Merge congruences one at a time, keeping numbers smaller
3. **Modular Arithmetic**: If you only need result mod some value, compute everything modulo that value
4. **Careful Ordering**: Process smaller moduli first to keep intermediate products manageable

### Q3: Why is CRT useful for RSA decryption?

**Answer:** RSA decryption computes `m = c^d mod n` where `n = p × q`:

**Without CRT**:
- One modular exponentiation with modulus n (~2048 bits)
- Exponent d (~2048 bits)
- Complexity: O(log³ n)

**With CRT**:
- Two modular exponentiations with moduli p and q (~1024 bits each)
- Exponents d_p = d mod (p-1), d_q = d mod (q-1) (~1024 bits each)
- Complexity: 2 × O(log³(n/2)) ≈ O(log³ n) / 4

**Speedup**: Approximately 4x faster in practice!

### Q4: How does Garner's algorithm compare to standard CRT?

**Answer:**

| Aspect | Standard CRT | Garner's Algorithm |
|--------|-------------|-------------------|
| **Precomputation** | None | O(k²) |
| **Single Query** | O(k²) | O(k²) or O(k) with precomputation |
| **Multiple Queries** | O(k²) each | O(k) each after precomputation |
| **Numerical Stability** | Moderate | Better |
| **Use Case** | One-time solutions | Many queries, same moduli |

**Recommendation**: Use Garner's when solving 3+ systems with identical moduli.

### Q5: Can CRT be extended to polynomials or other algebraic structures?

**Answer:** Yes! The abstract CRT applies to any principal ideal domain:

1. **Polynomial CRT**: Find polynomial p(x) such that:
   - `p(x) ≡ a₁(x) (mod m₁(x))`
   - `p(x) ≡ a₂(x) (mod m₂(x))`
   - Where mᵢ(x) are coprime polynomials

2. **Ring Theory**: CRT holds for commutative rings with coprime ideals

3. **Applications**:
   - Polynomial interpolation (Lagrange is a special case!)
   - Secret sharing schemes
   - Error-correcting codes

### Q6: What is the practical limit on the number of congruences?

**Answer:** 

- **Time**: O(k²) means k=1000 takes ~1M operations - very feasible
- **Space**: O(k²) for Garner's precomputation limits k to ~10⁴ for memory
- **Numerical**: Product M grows exponentially; use arbitrary precision for k>10 with large moduli
- **Practical**: Most competitive programming problems use k ≤ 10

---

## Summary

The **Chinese Remainder Theorem** is a powerful tool for solving systems of modular congruences with wide applications in:

- **Cryptography**: RSA optimization, secret sharing
- **Number Theory**: Reconstructing numbers from remainders
- **Computer Science**: Large number arithmetic, hashing
- **Competitive Programming**: Modular constraint problems

### Key Takeaways

1. **Standard CRT**: Solves `x ≡ aᵢ (mod mᵢ)` for pairwise coprime moduli
   - Unique solution modulo `M = m₁ × m₂ × ... × mₙ`
   - Time: O(k²), Space: O(k)

2. **Construction**: `x = Σ(aᵢ × Mᵢ × yᵢ) mod M` where `yᵢ = (M/mᵢ)⁻¹ mod mᵢ`

3. **Variants**:
   - **Iterative CRT**: Better numerical stability, O(k log M)
   - **General CRT**: Handles non-coprime moduli (when consistent)
   - **Garner's Algorithm**: Efficient for multiple queries

4. **Applications**:
   - RSA decryption (~4x speedup)
   - Large number representation
   - Reconstruction from redundant data

### When to Use CRT

- ✅ Solving systems of modular congruences
- ✅ Optimizing large modulus operations (cryptography)
- ✅ Reconstructing numbers from remainders
- ✅ Problems with multiple periodic constraints
- ❌ Single modular equation (direct solution better)
- ❌ Non-coprime moduli without consistency checking

### Related Algorithms

- [Extended Euclidean Algorithm](./extended-euclidean.md) - For modular inverses
- [Modular Inverse](./modular-inverse.md) - Core building block
- [Modular Exponentiation](./modular-exponentiation.md) - Used in RSA
- [Sieve of Eratosthenes](./sieve-eratosthenes.md) - Finding coprime moduli
- [GCD / Euclidean Algorithm](./gcd-euclidean.md) - Checking coprimality

---

## References

1. Sunzi Suanjing (孙子算经) - 3rd-5th century CE Chinese mathematical text
2. Gauss, C.F. - *Disquisitiones Arithmeticae* (1801)
3. Knuth, D.E. - *The Art of Computer Programming, Vol. 2: Seminumerical Algorithms*
4. Cormen, T.H. et al. - *Introduction to Algorithms*, Section 31.5 (Number-Theoretic Algorithms)
