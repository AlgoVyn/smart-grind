# Fast Fourier Transform (FFT) and NTT

## Category
Advanced / Math & Number Theory

## Description

The **Fast Fourier Transform (FFT)** is an algorithm to compute the **Discrete Fourier Transform (DFT)** in O(n log n) time, compared to O(n²) for the naive approach. It's used for:

- **Polynomial multiplication**: Multiply two polynomials in O(n log n)
- **Convolution**: Efficient signal processing
- **String matching**: Find patterns using convolution
- **Large number multiplication**: Karatsuba alternative for very large numbers

**Number Theoretic Transform (NTT)** is the integer equivalent of FFT that works under modular arithmetic, avoiding floating-point precision issues.

---

## When to Use

Use FFT/NTT when you need to:

- **Multiply Large Polynomials**: Degrees > 1000
- **Compute Convolutions**: Signal processing, probability distributions
- **String Pattern Matching**: With wildcard matching
- **Count Subset Sums**: For large sets
- **Large Integer Multiplication**: Numbers with thousands of digits

### FFT vs NTT

| Aspect | FFT | NTT |
|--------|-----|-----|
| Domain | Complex numbers | Integers mod prime |
| Precision | Floating point errors | Exact (integer) |
| Speed | Very fast | Fast |
| Use when | Scientific computing | Competitive programming |
| Requirement | Primitive root of unity | Suitable prime modulus |

---

## Algorithm Explanation

### Polynomial Representation

A polynomial can be represented in two ways:

1. **Coefficient form**: P(x) = a₀ + a₁x + a₂x² + ... + aₙxⁿ
2. **Point-value form**: {(x₀, P(x₀)), (x₁, P(x₁)), ..., (xₙ, P(xₙ))}

**Key insight**: Multiplication is O(n) in point-value form!

### The FFT Process

1. **Evaluate (FFT)**: Convert coefficient → point-value at roots of unity
2. **Pointwise multiply**: Multiply values at each point (O(n))
3. **Interpolate (IFFT)**: Convert back to coefficient form

### Roots of Unity

The n-th roots of unity are solutions to ωⁿ = 1:
```
ω_k = e^(2πik/n) for k = 0, 1, ..., n-1
```

Properties:
- ωₙ^n = 1
- ωₙ^(n/2) = -1
- ωₙ^k = ωₙ^(k mod n)

### Cooley-Tukey Algorithm

Divide-and-conquer using the property:
```
DFT(a)[k] = DFT(even)(k) + ω^k × DFT(odd)(k)
```

### Number Theoretic Transform (NTT)

For modulus p where p = k×2^m + 1 (like 998244353 = 119×2^23 + 1):

- Use primitive root g where g^((p-1)/2^m) is a 2^m-th root of unity
- All operations are exact modular arithmetic

Common NTT primes:
- 998244353 = 119×2^23 + 1, primitive root = 3
- 1004535809 = 479×2^21 + 1, primitive root = 3
- 469762049 = 7×2^26 + 1, primitive root = 3

---

## Implementation

### Template Code

````carousel
```python
MOD = 998244353  # 119 * 2^23 + 1
PRIMITIVE_ROOT = 3

def ntt(a: list[int], invert: bool) -> None:
    """
    In-place iterative Number Theoretic Transform.
    
    Args:
        a: Coefficient array (modified in place)
        invert: True for inverse NTT
    
    Time Complexity: O(n log n)
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
        wlen = pow(PRIMITIVE_ROOT, (MOD - 1) // length, MOD)
        if invert:
            wlen = pow(wlen, MOD - 2, MOD)
        
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
        n_inv = pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = a[i] * n_inv % MOD


def multiply_polynomials(a: list[int], b: list[int]) -> list[int]:
    """
    Multiply two polynomials using NTT.
    
    Time Complexity: O(n log n)
    """
    # Find appropriate size (power of 2)
    n = 1
    while n < len(a) + len(b) - 1:
        n <<= 1
    
    # Pad with zeros
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
    
    # Trim to correct size
    result = fa[:len(a) + len(b) - 1]
    return result


def convolution(a: list[int], b: list[int]) -> list[int]:
    """
    Compute convolution of two arrays.
    c[k] = sum(a[i] * b[k-i]) for all valid i
    """
    return multiply_polynomials(a, b)


# FFT for floating-point (when modulus not needed)
import cmath
import math

def fft(a: list[complex], invert: bool) -> None:
    """Cooley-Tukey FFT algorithm."""
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


def multiply_polynomials_fft(a: list[float], b: list[float]) -> list[int]:
    """Multiply polynomials using FFT (floating point)."""
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
    
    result = [int(round(fa[i].real)) for i in range(len(a) + len(b) - 1)]
    return result


# String matching with wildcards
def string_match_with_wildcard(text: str, pattern: str, wildcard: str = '?') -> list[int]:
    """
    Find all positions where pattern matches text (with wildcard support).
    Uses FFT for O(n log n) matching.
    """
    n, m = len(text), len(pattern)
    
    # Create numeric representations
    # Use multiple convolutions for character matching
    matches = []
    
    # For each character, create binary arrays
    for c in set(text + pattern):
        if c == wildcard:
            continue
        
        a = [1 if x == c else 0 for x in text]
        b = [1 if x == c else 0 for x in reversed(pattern)]
        
        conv = convolution(a, b)  # Using NTT
        
        # Accumulate matches
        while len(matches) < len(conv):
            matches.append(0)
        for i in range(len(conv)):
            matches[i] += conv[i]
    
    # Find positions with full match
    result = []
    for i in range(m - 1, n):
        if matches[i] == m - pattern.count(wildcard):
            result.append(i - m + 1)
    
    return result


# Example usage
if __name__ == "__main__":
    # Polynomial multiplication
    a = [1, 2, 3]  # 1 + 2x + 3x^2
    b = [4, 5]     # 4 + 5x
    result = multiply_polynomials(a, b)
    print(f"({a}) * ({b}) = {result}")  # [4, 13, 22, 15]
    
    # Convolution
    c = [1, 2, 3]
    d = [1, 1, 1]
    conv = convolution(c, d)
    print(f"Convolution: {conv}")  # [1, 3, 6, 5, 3]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

const int MOD = 998244353;
const int PRIMITIVE_ROOT = 3;

int mod_pow(int base, int exp, int mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        base = (long long)base * base % mod;
        exp >>= 1;
    }
    return result;
}

void ntt(vector<int>& a, bool invert) {
    int n = a.size();
    
    // Bit-reversal permutation
    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    
    // Transform
    for (int len = 2; len <= n; len <<= 1) {
        int wlen = mod_pow(PRIMITIVE_ROOT, (MOD - 1) / len, MOD);
        if (invert) wlen = mod_pow(wlen, MOD - 2, MOD);
        
        for (int i = 0; i < n; i += len) {
            long long w = 1;
            for (int j = 0; j < len / 2; j++) {
                int u = a[i + j];
                int v = w * a[i + j + len/2] % MOD;
                a[i + j] = (u + v) % MOD;
                a[i + j + len/2] = (u - v + MOD) % MOD;
                w = w * wlen % MOD;
            }
        }
    }
    
    if (invert) {
        int n_inv = mod_pow(n, MOD - 2, MOD);
        for (int& x : a) x = (long long)x * n_inv % MOD;
    }
}

vector<int> multiply(const vector<int>& a, const vector<int>& b) {
    vector<int> fa(a.begin(), a.end()), fb(b.begin(), b.end());
    int n = 1;
    while (n < (int)a.size() + (int)b.size() - 1) n <<= 1;
    
    fa.resize(n);
    fb.resize(n);
    
    ntt(fa, false);
    ntt(fb, false);
    
    for (int i = 0; i < n; i++) 
        fa[i] = (long long)fa[i] * fb[i] % MOD;
    
    ntt(fa, true);
    
    fa.resize(a.size() + b.size() - 1);
    return fa;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

public class NTT {
    static final int MOD = 998244353;
    static final int PRIMITIVE_ROOT = 3;
    
    static int modPow(int base, int exp, int mod) {
        long result = 1;
        long b = base % mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = result * b % mod;
            b = b * b % mod;
            exp >>= 1;
        }
        return (int)result;
    }
    
    static void ntt(int[] a, boolean invert) {
        int n = a.length;
        
        // Bit-reversal permutation
        for (int i = 1, j = 0; i < n; i++) {
            int bit = n >> 1;
            for (; (j & bit) != 0; bit >>= 1) j ^= bit;
            j ^= bit;
            if (i < j) {
                int temp = a[i];
                a[i] = a[j];
                a[j] = temp;
            }
        }
        
        // Transform
        for (int len = 2; len <= n; len <<= 1) {
            int wlen = modPow(PRIMITIVE_ROOT, (MOD - 1) / len, MOD);
            if (invert) wlen = modPow(wlen, MOD - 2, MOD);
            
            for (int i = 0; i < n; i += len) {
                long w = 1;
                for (int j = 0; j < len / 2; j++) {
                    int u = a[i + j];
                    int v = (int)(w * a[i + j + len/2] % MOD);
                    a[i + j] = (u + v) % MOD;
                    a[i + j + len/2] = (u - v + MOD) % MOD;
                    w = w * wlen % MOD;
                }
            }
        }
        
        if (invert) {
            int n_inv = modPow(n, MOD - 2, MOD);
            for (int i = 0; i < n; i++) 
                a[i] = (int)((long)a[i] * n_inv % MOD);
        }
    }
    
    static int[] multiply(int[] a, int[] b) {
        int n = 1;
        while (n < a.length + b.length - 1) n <<= 1;
        
        int[] fa = new int[n];
        int[] fb = new int[n];
        System.arraycopy(a, 0, fa, 0, a.length);
        System.arraycopy(b, 0, fb, 0, b.length);
        
        ntt(fa, false);
        ntt(fb, false);
        
        for (int i = 0; i < n; i++) 
            fa[i] = (int)((long)fa[i] * fb[i] % MOD);
        
        ntt(fa, true);
        
        int[] result = new int[a.length + b.length - 1];
        System.arraycopy(fa, 0, result, 0, result.length);
        return result;
    }
}
```
````

---

## Applications

### 1. Large Number Multiplication

```python
def multiply_large_numbers(a: str, b: str) -> str:
    """Multiply two large numbers using NTT."""
    # Convert to digit arrays
    digits_a = [int(c) for c in reversed(a)]
    digits_b = [int(c) for c in reversed(b)]
    
    # Multiply polynomials
    result_digits = multiply_polynomials(digits_a, digits_b)
    
    # Handle carries
    carry = 0
    for i in range(len(result_digits)):
        result_digits[i] += carry
        carry = result_digits[i] // 10
        result_digits[i] %= 10
    
    while carry:
        result_digits.append(carry % 10)
        carry //= 10
    
    # Convert back to string
    return ''.join(str(d) for d in reversed(result_digits))
```

### 2. Subset Sum Counting

```python
def count_subset_sums(nums: list[int], target: int) -> int:
    """
    Count ways to achieve each sum using FFT for faster computation.
    """
    max_sum = sum(nums)
    
    # Create polynomial where x^num has coefficient 1
    poly = [0] * (max_sum + 1)
    poly[0] = 1  # Empty subset
    
    for num in nums:
        # Multiply by (1 + x^num)
        term = [1] + [0] * num
        term[num] = 1
        poly = multiply_polynomials(poly, term)
    
    return poly[target] if target <= max_sum else 0
```

---

## Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| NTT/FFT | O(n log n) | O(n) |
| Polynomial multiply | O(n log n) | O(n) |
| Convolution | O(n log n) | O(n) |
| Large number multiply | O(n log n) | O(n) |

---

## Practice Problems

### Problem 1: Closest Subsequence Sum
**Problem**: [LeetCode 1755 - Closest Subsequence Sum](https://leetcode.com/problems/closest-subsequence-sum/)

**Solution**: Use FFT for subset sum convolution.

### Problem 2: String Matching with Wildcards
**Problem**: Find pattern matches with '?' wildcards.

**Solution**: Multiple FFT convolutions for character matching.

---

## Follow-up Questions

### Q1: When should I use NTT over FFT?

**Answer**: Use NTT for competitive programming and exact integer results. Use FFT for floating-point applications and scientific computing.

### Q2: What if the result exceeds the NTT modulus?

**Answer**: Use multiple NTT moduli and combine with Chinese Remainder Theorem, or use 128-bit FFT with rounding.

### Q3: Why must n be a power of 2?

**Answer**: The Cooley-Tukey algorithm requires dividing the problem in half recursively. Pad with zeros to the next power of 2.

---

## Summary

FFT/NTT is essential for:

- **Polynomial multiplication** in O(n log n)
- **Convolution** operations
- **String matching** with wildcards
- **Large number arithmetic**

**Use NTT** for exact integer arithmetic in competitive programming.

---

## Related Algorithms

- [Karatsuba](./karatsuba.md) - Alternative multiplication algorithm
- [Chinese Remainder Theorem](./chinese-remainder.md) - For large results
- [Modular Inverse](./modular-inverse.md) - Used in inverse NTT