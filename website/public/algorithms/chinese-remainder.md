# Chinese Remainder Theorem (CRT)

## Category
Math & Number Theory

## Description

The **Chinese Remainder Theorem (CRT)** is a fundamental result in number theory that provides a unique solution to a system of simultaneous congruences with pairwise coprime moduli.

Given:
```
x ≡ a₁ (mod m₁)
x ≡ a₂ (mod m₂)
...
x ≡ aₙ (mod mₙ)
```

Where `m₁, m₂, ..., mₙ` are **pairwise coprime**, CRT guarantees a unique solution modulo `M = m₁ × m₂ × ... × mₙ`.

---

## When to Use

Use CRT when you need to:

- **Solve Systems of Congruences**: Find x satisfying multiple modular conditions
- **Work with Large Moduli**: Break down problems into smaller, coprime moduli
- **Cryptography**: RSA optimization, secret sharing schemes
- **Competitive Programming**: Problems with periodic constraints
- **Reconstruct Numbers**: From remainders modulo coprime bases

### Key Insight

Instead of solving one complex congruence, solve several simpler ones and combine the results.

---

## Algorithm Explanation

### Two-Modulus Case

Given:
```
x ≡ a₁ (mod m₁)
x ≡ a₂ (mod m₂)
```

Where `gcd(m₁, m₂) = 1`.

**Solution:**
```
x = a₁ × M₁ × y₁ + a₂ × M₂ × y₂ (mod M)

Where:
- M = m₁ × m₂
- M₁ = M / m₁ = m₂
- M₂ = M / m₂ = m₁
- y₁ = M₁^(-1) mod m₁  (modular inverse)
- y₂ = M₂^(-1) mod m₂  (modular inverse)
```

### General Case

For n congruences:
```
x ≡ aᵢ (mod mᵢ) for i = 1 to n

Solution:
x = Σ aᵢ × Mᵢ × yᵢ (mod M)

Where:
- M = m₁ × m₂ × ... × mₙ
- Mᵢ = M / mᵢ
- yᵢ = Mᵢ^(-1) mod mᵢ
```

### Step-by-Step Algorithm

1. **Compute M**: Product of all moduli
2. **For each congruence i**:
   - Compute Mᵢ = M / mᵢ
   - Find yᵢ = modular inverse of Mᵢ modulo mᵢ
   - Add term `aᵢ × Mᵢ × yᵢ` to the sum
3. **Return** `sum mod M`

---

## Implementation

### Template Code

````carousel
```python
def extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """Returns (g, x, y) such that ax + by = g = gcd(a, b)."""
    if b == 0:
        return (a, 1, 0)
    g, x1, y1 = extended_gcd(b, a % b)
    return (g, y1, x1 - (a // b) * y1)


def mod_inverse(a: int, m: int) -> int | None:
    """Returns modular inverse of a mod m, or None if it doesn't exist."""
    g, x, _ = extended_gcd(a % m, m)
    if g != 1:
        return None
    return (x % m + m) % m


def chinese_remainder_theorem(a: list[int], m: list[int]) -> tuple[int, int] | None:
    """
    Solve system of congruences: x ≡ a[i] (mod m[i])
    
    Args:
        a: List of remainders
        m: List of moduli (must be pairwise coprime)
    
    Returns:
        (solution, combined_modulus) or None if no solution
        The solution is unique modulo combined_modulus
    
    Time Complexity: O(k²) where k is number of congruences
    Space Complexity: O(k)
    """
    k = len(a)
    if len(m) != k:
        raise ValueError("Lists a and m must have same length")
    
    # Verify pairwise coprime (optional, for debugging)
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
            return None  # Modular inverse doesn't exist
        
        result = (result + a[i] * Mi * yi) % M
    
    return (result, M)


def chinese_remainder_theorem_iterative(a: list[int], m: list[int]) -> tuple[int, int] | None:
    """
    Iterative version: merge congruences two at a time.
    More efficient for large k and allows non-coprime moduli handling.
    """
    if not a or not m or len(a) != len(m):
        return None
    
    # Start with first congruence
    x = a[0]
    M = m[0]
    
    for i in range(1, len(a)):
        # Merge: x ≡ current_result (mod M) and x ≡ a[i] (mod m[i])
        # Find t such that: x + M*t ≡ a[i] (mod m[i])
        # => M*t ≡ (a[i] - x) (mod m[i])
        
        diff = (a[i] - x) % m[i]
        inv = mod_inverse(M % m[i], m[i])
        
        if inv is None:
            return None  # No solution
        
        t = (diff * inv) % m[i]
        x = x + M * t
        M = M * m[i]  # New combined modulus
        x %= M
    
    return (x, M)


# Garner's Algorithm - optimized for multiple evaluations
def garner_algorithm(a: list[int], m: list[int], mod: int) -> int:
    """
    Garner's algorithm for CRT with precomputation.
    Useful when solving multiple systems with same moduli.
    
    Returns solution modulo 'mod'.
    """
    k = len(a)
    
    # Precompute inverses
    inv = [[0] * k for _ in range(k)]
    for i in range(k):
        for j in range(i):
            inv[j][i] = mod_inverse(m[j], m[i])
    
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


# Example usage
if __name__ == "__main__":
    # Example: x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7)
    # Solution: x ≡ 23 (mod 105)
    a = [2, 3, 2]
    m = [3, 5, 7]
    
    result = chinese_remainder_theorem(a, m)
    if result:
        x, M = result
        print(f"Solution: x ≡ {x} (mod {M})")
        # Verify
        for i in range(len(a)):
            print(f"  x mod {m[i]} = {x % m[i]} (expected {a[i]})")
    
    # Famous example from Sunzi Suanjing
    # x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7)
    # Answer: x = 23 + 105k for any integer k
    print("\nSunzi's problem:")
    a_sunzi = [2, 3, 2]
    m_sunzi = [3, 5, 7]
    result = chinese_remainder_theorem(a_sunzi, m_sunzi)
    if result:
        print(f"x ≡ {result[0]} (mod {result[1]})")
```

<!-- slide -->
```cpp
#include <vector>
#include <numeric>
using namespace std;

tuple<int, int, int> extendedGCD(int a, int b) {
    if (b == 0) return {a, 1, 0};
    auto [g, x1, y1] = extendedGCD(b, a % b);
    return {g, y1, x1 - (a / b) * y1};
}

int modInverse(int a, int m) {
    auto [g, x, _] = extendedGCD((a % m + m) % m, m);
    if (g != 1) return -1;
    return (x % m + m) % m;
}

/**
 * Chinese Remainder Theorem
 * Returns pair (solution, combined_modulus)
 * Returns (-1, -1) if no solution
 */
pair<long long, long long> chineseRemainder(vector<int>& a, vector<int>& m) {
    int k = a.size();
    
    // Compute M = product of all moduli
    long long M = 1;
    for (int mi : m) M *= mi;
    
    long long result = 0;
    
    for (int i = 0; i < k; i++) {
        long long Mi = M / m[i];
        long long yi = modInverse(Mi % m[i], m[i]);
        
        if (yi == -1) return {-1, -1};
        
        result = (result + a[i] * Mi * yi) % M;
    }
    
    return {result, M};
}

/**
 * Iterative version
 */
pair<long long, long long> chineseRemainderIterative(vector<int>& a, vector<int>& m) {
    long long x = a[0];
    long long M = m[0];
    
    for (size_t i = 1; i < a.size(); i++) {
        long long diff = ((a[i] - x) % m[i] + m[i]) % m[i];
        long long inv = modInverse(M % m[i], m[i]);
        
        if (inv == -1) return {-1, -1};
        
        long long t = (diff * inv) % m[i];
        x = x + M * t;
        M *= m[i];
        x = ((x % M) + M) % M;
    }
    
    return {x, M};
}

// Garner's algorithm
long long garnerAlgorithm(vector<int>& a, vector<int>& m, long long mod) {
    int k = a.size();
    vector<vector<long long>> inv(k, vector<long long>(k));
    
    for (int i = 0; i < k; i++) {
        for (int j = 0; j < i; j++) {
            inv[j][i] = modInverse(m[j] % m[i], m[i]);
        }
    }
    
    vector<long long> x(k);
    for (int i = 0; i < k; i++) {
        x[i] = a[i];
        for (int j = 0; j < i; j++) {
            x[i] = (x[i] - x[j]) * inv[j][i] % m[i];
            if (x[i] < 0) x[i] += m[i];
        }
    }
    
    long long result = 0, mult = 1;
    for (int i = 0; i < k; i++) {
        result = (result + x[i] * mult) % mod;
        mult = (mult * m[i]) % mod;
    }
    
    return result;
}
```

<!-- slide -->
```java
public class ChineseRemainderTheorem {
    
    public static class Result {
        long solution, modulus;
        Result(long s, long m) { solution = s; modulus = m; }
    }
    
    private static long[] extendedGCD(long a, long b) {
        if (b == 0) return new long[]{a, 1, 0};
        long[] next = extendedGCD(b, a % b);
        return new long[]{next[0], next[2], next[1] - (a / b) * next[2]};
    }
    
    private static long modInverse(long a, long m) {
        long[] result = extendedGCD(((a % m) + m) % m, m);
        if (result[0] != 1) return -1;
        return ((result[1] % m) + m) % m;
    }
    
    public static Result solve(long[] a, long[] m) {
        long M = 1;
        for (long mi : m) M *= mi;
        
        long result = 0;
        for (int i = 0; i < a.length; i++) {
            long Mi = M / m[i];
            long yi = modInverse(Mi % m[i], m[i]);
            
            if (yi == -1) return null;
            
            result = (result + a[i] * Mi * yi) % M;
        }
        
        return new Result(result, M);
    }
    
    public static Result solveIterative(long[] a, long[] m) {
        long x = a[0];
        long M = m[0];
        
        for (int i = 1; i < a.length; i++) {
            long diff = ((a[i] - x) % m[i] + m[i]) % m[i];
            long inv = modInverse(M % m[i], m[i]);
            
            if (inv == -1) return null;
            
            long t = (diff * inv) % m[i];
            x = x + M * t;
            M *= m[i];
            x = ((x % M) + M) % M;
        }
        
        return new Result(x, M);
    }
}
```

<!-- slide -->
```javascript
function extendedGCD(a, b) {
    if (b === 0) return [a, 1, 0];
    const [g, x1, y1] = extendedGCD(b, a % b);
    return [g, y1, x1 - Math.floor(a / b) * y1];
}

function modInverse(a, m) {
    const [g, x] = extendedGCD(((a % m) + m) % m, m);
    if (g !== 1) return null;
    return ((x % m) + m) % m;
}

function chineseRemainder(a, m) {
    const k = a.length;
    
    // Compute M
    let M = 1n;
    for (const mi of m) M *= BigInt(mi);
    
    let result = 0n;
    
    for (let i = 0; i < k; i++) {
        const Mi = M / BigInt(m[i]);
        const yi = modInverse(Number(Mi % BigInt(m[i])), m[i]);
        
        if (yi === null) return null;
        
        result += BigInt(a[i]) * Mi * BigInt(yi);
    }
    
    return [Number(result % M), Number(M)];
}

function chineseRemainderIterative(a, m) {
    let x = BigInt(a[0]);
    let M = BigInt(m[0]);
    
    for (let i = 1; i < a.length; i++) {
        const diff = ((BigInt(a[i]) - x) % BigInt(m[i]) + BigInt(m[i])) % BigInt(m[i]);
        const inv = modInverse(Number(M % BigInt(m[i])), m[i]);
        
        if (inv === null) return null;
        
        const t = (diff * BigInt(inv)) % BigInt(m[i]);
        x = x + M * t;
        M *= BigInt(m[i]);
        x = ((x % M) + M) % M;
    }
    
    return [Number(x), Number(M)];
}

// Example
const a = [2, 3, 2];
const mods = [3, 5, 7];
console.log(chineseRemainder(a, mods));  // [23, 105]
```
````

---

## Applications

### 1. Large Number Representation

```python
def represent_large_number(remainders, bases):
    """
    Reconstruct a large number from its remainders modulo coprime bases.
    Useful for representing numbers larger than hardware limits.
    """
    result, modulus = chinese_remainder_theorem(remainders, bases)
    return result

# Example: Represent a number by its remainders mod 1000, 1001, 1002, etc.
# Can uniquely represent numbers up to product of bases
```

### 2. RSA Optimization

```python
def rsa_decrypt_optimized(ciphertext, d, p, q):
    """
    RSA decryption using CRT for ~4x speedup.
    
    Instead of computing m = c^d mod pq directly,
    compute m_p = c^d mod p and m_q = c^d mod q,
    then combine using CRT.
    """
    # Compute partial decryptions
    m_p = pow(ciphertext, d % (p - 1), p)  # Using Fermat
    m_q = pow(ciphertext, d % (q - 1), q)
    
    # Combine using CRT
    result, _ = chinese_remainder_theorem([m_p, m_q], [p, q])
    return result
```

### 3. Periodicity Problems

```python
def find_number_with_remainders():
    """
    Find smallest positive number with given remainders.
    Classic application of CRT.
    """
    # x ≡ 1 (mod 2), x ≡ 2 (mod 3), x ≡ 3 (mod 5)
    a = [1, 2, 3]
    m = [2, 3, 5]
    result, _ = chinese_remainder_theorem(a, m)
    return result  # 53
```

---

## Time & Space Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(k²) or O(k log M) | k = number of congruences |
| Space | O(k) | For storing intermediate values |
| Precomputation (Garner) | O(k²) | One-time for same moduli |

---

## Practice Problems

### Problem 1: Chalk Replacement
**Problem**: [LeetCode 1894 - Find the Student that Will Replace the Chalk](https://leetcode.com/problems/find-the-student-that-will-replace-the-chalk/)

**Solution**: Find cumulative sum modulo total chalk.

### Problem 2: Construct Target Array
**Problem**: [LeetCode 1354 - Construct Target Array With Multiple Sums](https://leetcode.com/problems/construct-target-array-with-multiple-sums/)

**Solution**: Work backwards using modular arithmetic.

### Problem 3: Card Deck
**Problem**: Find arrangement where cards satisfy multiple modular conditions.

**Solution**: Use CRT to satisfy all constraints simultaneously.

---

## Follow-up Questions

### Q1: What if the moduli are not coprime?

**Answer**: The system has a solution iff `aᵢ ≡ aⱼ (mod gcd(mᵢ, mⱼ))` for all i, j. The solution is unique modulo `lcm(m₁, m₂, ..., mₙ)`.

### Q2: Can I use CRT when the number of congruences is large?

**Answer**: Yes, but be careful of overflow. Use the iterative version and take modulo at each step. For very large k, Garner's algorithm is more numerically stable.

### Q3: What's the practical limit for the combined modulus M?

**Answer**: M can be extremely large (product of all moduli). In practice, you often want the result modulo some smaller value, or you need arbitrary-precision arithmetic.

### Q4: How is CRT used in RSA decryption?

**Answer**: RSA decryption computes `m = c^d mod n` where `n = pq`. Using CRT:
1. Compute `m_p = c^d mod p` and `m_q = c^d mod q` (faster, smaller exponents)
2. Combine using CRT to get `m mod n`

This provides approximately 4x speedup.

---

## Summary

The Chinese Remainder Theorem is powerful for:

- **Solving systems** of modular congruences
- **Efficient computation** with large moduli
- **Cryptographic optimizations** (especially RSA)
- **Reconstructing numbers** from remainders

**Key Points:**
1. Requires pairwise coprime moduli (for standard CRT)
2. Solution is unique modulo the product of all moduli
3. Garner's algorithm for multiple evaluations with same moduli
4. Iterative merging for better numerical stability

---

## Related Algorithms

- [Extended Euclidean](./extended-euclidean.md) - For modular inverses
- [Modular Inverse](./modular-inverse.md) - Core component of CRT
- [Modular Exponentiation](./modular-exponentiation.md) - Used in RSA optimization