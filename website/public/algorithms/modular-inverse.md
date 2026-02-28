# Modular Inverse

## Category
Math & Number Theory

## Description

The **modular multiplicative inverse** of an integer `a` modulo `m` is an integer `x` such that:

```
a × x ≡ 1 (mod m)
```

This is written as `a^(-1) mod m` or `a⁻¹ (mod m)`. The modular inverse is the equivalent of division in modular arithmetic—multiplying by `a^(-1)` is the same as dividing by `a` under modulo `m`.

---

## When to Use

Use modular inverse when you need to:

- **Perform Division Under Modulo**: Calculate `(a/b) mod m` when `m` is not prime
- **Compute Combinations (nCr)**: `nCr = n! / (r! × (n-r)!)` requires modular division
- **Solve Linear Congruences**: Find `x` in equations like `ax ≡ b (mod m)`
- **Cryptography**: RSA encryption/decryption, Diffie-Hellman key exchange
- **Competitive Programming**: Counting problems with modulo constraints

### Existence Condition

The modular inverse of `a` modulo `m` **exists if and only if**:
```
gcd(a, m) = 1
```

This means `a` and `m` must be **coprime** (relatively prime).

---

## Algorithm Explanation

### Method 1: Using Extended Euclidean Algorithm (General Case)

The Extended Euclidean Algorithm finds `x` and `y` such that:
```
ax + my = gcd(a, m) = 1
```

Taking modulo `m` on both sides:
```
ax ≡ 1 (mod m)
```

Therefore, `x` is the modular inverse of `a`.

### Method 2: Using Fermat's Little Theorem (When m is Prime)

If `m` is prime and `a` is not divisible by `m`:
```
a^(m-1) ≡ 1 (mod m)
a^(m-2) ≡ a^(-1) (mod m)
```

So the inverse is `a^(m-2) mod m`, computable with fast exponentiation in O(log m).

### Method 3: Euler's Theorem (Generalization)

If `gcd(a, m) = 1`:
```
a^φ(m) ≡ 1 (mod m)
a^(φ(m)-1) ≡ a^(-1) (mod m)
```

Where `φ(m)` is Euler's totient function.

---

## Implementation

### Template Code

````carousel
```python
def extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """Extended Euclidean Algorithm. Returns (g, x, y) where ax + by = g."""
    if b == 0:
        return (a, 1, 0)
    g, x1, y1 = extended_gcd(b, a % b)
    return (g, y1, x1 - (a // b) * y1)


def mod_inverse(a: int, m: int) -> int | None:
    """
    Returns modular inverse of a under modulo m using Extended Euclidean Algorithm.
    Returns None if inverse doesn't exist.
    
    Time Complexity: O(log(min(a, m)))
    Space Complexity: O(log(min(a, m)))
    """
    g, x, _ = extended_gcd(a % m, m)
    if g != 1:
        return None  # Inverse doesn't exist
    return (x % m + m) % m  # Ensure positive result


def mod_inverse_fermat(a: int, m: int) -> int:
    """
    Returns modular inverse using Fermat's Little Theorem.
    Only works when m is prime.
    
    Time Complexity: O(log m)
    Space Complexity: O(1)
    """
    return pow(a, m - 2, m)


def mod_inverse_iterative(a: int, m: int) -> int | None:
    """
    Iterative version of modular inverse using Extended Euclidean Algorithm.
    More space efficient.
    
    Time Complexity: O(log(min(a, m)))
    Space Complexity: O(1)
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
        return None  # Inverse doesn't exist
    
    return (x0 % original_m + original_m) % original_m


# Example usage
if __name__ == "__main__":
    a, m = 3, 11
    inv = mod_inverse(a, m)
    print(f"Inverse of {a} mod {m} = {inv}")
    print(f"Verification: {a} × {inv} = {(a * inv) % m} ≡ 1 (mod {m})")
    
    # Using Fermat (m is prime)
    inv_fermat = mod_inverse_fermat(a, m)
    print(f"Using Fermat: {inv_fermat}")
```

<!-- slide -->
```cpp
#include <iostream>
using namespace std;

/**
 * Extended Euclidean Algorithm
 */
tuple<int, int, int> extendedGCD(int a, int b) {
    if (b == 0) return {a, 1, 0};
    auto [g, x1, y1] = extendedGCD(b, a % b);
    return {g, y1, x1 - (a / b) * y1};
}

/**
 * Modular Inverse using Extended Euclidean Algorithm
 * Time: O(log(min(a, m)))
 * Returns -1 if inverse doesn't exist
 */
int modInverse(int a, int m) {
    auto [g, x, _] = extendedGCD((a % m + m) % m, m);
    if (g != 1) return -1;  // Inverse doesn't exist
    return (x % m + m) % m;  // Ensure positive
}

/**
 * Fast exponentiation for Fermat's Little Theorem
 * Time: O(log n)
 */
long long power(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = (result * base) % mod;
        base = (base * base) % mod;
        exp >>= 1;
    }
    return result;
}

/**
 * Modular Inverse using Fermat's Little Theorem
 * Only works when mod is prime
 */
int modInverseFermat(int a, int m) {
    return power(a, m - 2, m);
}

int main() {
    int a = 3, m = 11;
    int inv = modInverse(a, m);
    
    cout << "Inverse of " << a << " mod " << m << " = " << inv << endl;
    cout << "Verification: " << a << " × " << inv << " = " << (1LL * a * inv) % m << endl;
    
    return 0;
}
```

<!-- slide -->
```java
public class ModularInverse {
    
    /**
     * Extended GCD result
     */
    public static class Result {
        int gcd, x, y;
        Result(int gcd, int x, int y) {
            this.gcd = gcd; this.x = x; this.y = y;
        }
    }
    
    /**
     * Extended Euclidean Algorithm
     */
    public static Result extendedGCD(int a, int b) {
        if (b == 0) return new Result(a, 1, 0);
        Result next = extendedGCD(b, a % b);
        return new Result(next.gcd, next.y, next.x - (a / b) * next.y);
    }
    
    /**
     * Modular Inverse using Extended Euclidean
     * Returns -1 if inverse doesn't exist
     */
    public static int modInverse(int a, int m) {
        Result result = extendedGCD(((a % m) + m) % m, m);
        if (result.gcd != 1) return -1;
        return ((result.x % m) + m) % m;
    }
    
    /**
     * Fast exponentiation
     */
    public static long power(long base, long exp, long mod) {
        long result = 1;
        base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = (result * base) % mod;
            base = (base * base) % mod;
            exp >>= 1;
        }
        return result;
    }
    
    /**
     * Modular Inverse using Fermat's Little Theorem
     * Only works when mod is prime
     */
    public static long modInverseFermat(long a, long m) {
        return power(a, m - 2, m);
    }
    
    public static void main(String[] args) {
        int a = 3, m = 11;
        int inv = modInverse(a, m);
        
        System.out.printf("Inverse of %d mod %d = %d%n", a, m, inv);
        System.out.printf("Verification: %d × %d ≡ %d (mod %d)%n", 
            a, inv, (a * inv) % m, m);
    }
}
```

<!-- slide -->
```javascript
/**
 * Extended Euclidean Algorithm
 */
function extendedGCD(a, b) {
    if (b === 0) return [a, 1, 0];
    const [g, x1, y1] = extendedGCD(b, a % b);
    return [g, y1, x1 - Math.floor(a / b) * y1];
}

/**
 * Modular Inverse using Extended Euclidean
 * Returns null if inverse doesn't exist
 */
function modInverse(a, m) {
    const [g, x] = extendedGCD(((a % m) + m) % m, m);
    if (g !== 1) return null;
    return ((x % m) + m) % m;
}

/**
 * Fast exponentiation
 */
function power(base, exp, mod) {
    let result = 1n;
    base = BigInt(base) % BigInt(mod);
    exp = BigInt(exp);
    mod = BigInt(mod);
    
    while (exp > 0n) {
        if (exp & 1n) result = (result * base) % mod;
        base = (base * base) % mod;
        exp >>= 1n;
    }
    return Number(result);
}

/**
 * Modular Inverse using Fermat's Little Theorem
 * Only works when mod is prime
 */
function modInverseFermat(a, m) {
    return power(a, m - 2, m);
}

// Example usage
const a = 3, m = 11;
const inv = modInverse(a, m);
console.log(`Inverse of ${a} mod ${m} = ${inv}`);
console.log(`Verification: ${a} × ${inv} ≡ ${(a * inv) % m} (mod ${m})`);
```
````

---

## Precomputation for Multiple Inverses

When computing many modular inverses (e.g., for all numbers 1 to n), use this O(n) approach:

```python
def precompute_inverses(n: int, mod: int) -> list[int]:
    """
    Precompute modular inverses for all numbers 1 to n.
    
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    inv = [0] * (n + 1)
    inv[1] = 1
    
    for i in range(2, n + 1):
        # inv[i] = mod - (mod // i) * inv[mod % i] % mod
        inv[i] = mod - (mod // i) * inv[mod % i] % mod
    
    return inv


# Example: Precompute all inverses mod 13
mod = 13
inverses = precompute_inverses(12, mod)
for i in range(1, 13):
    print(f"{i}^(-1) ≡ {inverses[i]} (mod {mod})")
```

---

## Applications

### 1. Computing nCr (Binomial Coefficients)

```python
MOD = 10**9 + 7

def mod_inverse(a, m=MOD):
    return pow(a, m - 2, m)  # Fermat's, since MOD is prime

def nCr(n, r, mod=MOD):
    """Compute binomial coefficient nCr mod prime."""
    if r < 0 or r > n:
        return 0
    
    # nCr = n! / (r! * (n-r)!)
    numerator = 1
    for i in range(n, n - r, -1):
        numerator = (numerator * i) % mod
    
    denominator = 1
    for i in range(1, r + 1):
        denominator = (denominator * i) % mod
    
    return (numerator * mod_inverse(denominator, mod)) % mod
```

### 2. Solving Linear Congruence

```python
def solve_linear_congruence(a: int, b: int, m: int) -> int | None:
    """
    Solve ax ≡ b (mod m).
    Returns smallest non-negative solution or None if no solution.
    """
    from math import gcd
    
    g = gcd(a, m)
    if b % g != 0:
        return None  # No solution
    
    # Reduce to: (a/g)x ≡ (b/g) (mod m/g)
    a_reduced = a // g
    b_reduced = b // g
    m_reduced = m // g
    
    # Find inverse of a_reduced mod m_reduced
    inv = mod_inverse(a_reduced, m_reduced)
    if inv is None:
        return None
    
    x = (b_reduced * inv) % m_reduced
    return x
```

---

## Time & Space Complexity

| Method | Time | Space | Notes |
|--------|------|-------|-------|
| Extended Euclidean | O(log(min(a, m))) | O(1) | Works for any coprime a, m |
| Fermat's Little | O(log m) | O(1) | Requires m to be prime |
| Euler's Theorem | O(√m) + O(log m) | O(1) | General but needs φ(m) |
| Precompute (1..n) | O(n) | O(n) | For multiple inverses |

---

## Practice Problems

### Problem 1: Division Under Modulo
**Problem**: Compute `(a/b) mod m` where `b` and `m` are coprime.

**Solution**: `(a × b^(-1)) mod m`

### Problem 2: Unique Paths with Obstacles
**Problem**: [LeetCode 63 - Unique Paths II](https://leetcode.com/problems/unique-paths-ii/)

**Advanced**: Count paths modulo large prime using combinations.

### Problem 3: Check If Array Can Be Divided
**Problem**: Determine if array can be partitioned with certain properties.

**Hint**: Use modular inverse to handle division constraints.

---

## Follow-up Questions

### Q1: Why does Fermat's Little Theorem only work for prime moduli?

**Answer**: Fermat's theorem states `a^(p-1) ≡ 1 (mod p)` for prime `p`. For composite `m`, we use Euler's theorem: `a^φ(m) ≡ 1 (mod m)`. The general formula `a^(-1) ≡ a^(φ(m)-1) (mod m)` works when `gcd(a, m) = 1`, but computing `φ(m)` requires factorization, which is expensive.

### Q2: What if I need to compute inverse of 0?

**Answer**: 0 has no modular inverse. By definition, we'd need `0 × x ≡ 1 (mod m)`, which is impossible since `0 × x = 0` for all `x`.

### Q3: Can I use modular inverse for non-prime moduli?

**Answer**: Yes, using the Extended Euclidean Algorithm. Fermat's method only works for primes, but Extended Euclidean works for any modulus as long as `gcd(a, m) = 1`.

### Q4: Why is modular inverse important for nCr?

**Answer**: `nCr = n! / (r!(n-r)!)`. In modular arithmetic, division becomes multiplication by the modular inverse. So: `nCr mod m = n! × (r!)^(-1) × ((n-r)!)^(-1) mod m`.

---

## Summary

The modular inverse is a fundamental operation in modular arithmetic that enables "division" under a modulus. Key points:

- **Exists only when** `gcd(a, m) = 1`
- **Extended Euclidean** works for any valid case
- **Fermat's Little Theorem** is faster but requires prime modulus
- **Essential for** combinations, linear congruences, and cryptography

---

## Related Algorithms

- [Extended Euclidean](./extended-euclidean.md) - Foundation for modular inverse
- [Binomial Coefficients](./ncr-binomial.md) - Uses modular inverse extensively
- [Modular Exponentiation](./modular-exponentiation.md) - Used in Fermat's method