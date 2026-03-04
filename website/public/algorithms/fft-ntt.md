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

### Comparison: FFT vs NTT vs Naive

| Aspect | FFT | NTT | Naive |
|--------|-----|-----|-------|
| Domain | Complex numbers | Integers mod prime | Integers |
| Precision | Floating point errors | Exact (integer) | Exact |
| Speed | Very fast | Fast | Slow |
| Use when | Scientific computing | Competitive programming | Small inputs |
| Time Complexity | O(n log n) | O(n log n) | O(n²) |
| Space Complexity | O(n) | O(n) | O(n) |

### When to Choose FFT vs NTT

- **Choose FFT** when:
  - Working with real/complex numbers
  - Scientific computing applications
  - Precision loss is acceptable
  - Need maximum speed on floating-point hardware

- **Choose NTT** when:
  - Working with integers only
  - Exact results are required
  - Competitive programming contests
  - Working modulo a prime

---

## Algorithm Explanation

### Core Concept

The fundamental insight behind FFT is that **polynomial multiplication is O(n) in point-value form**. The strategy is:

1. **Evaluate**: Convert coefficient form → point-value form at special points (roots of unity)
2. **Multiply**: Pointwise multiplication in O(n)
3. **Interpolate**: Convert back to coefficient form using Inverse FFT

This transforms O(n²) coefficient multiplication into O(n log n) operations.

### Polynomial Representation

A polynomial can be represented in two ways:

1. **Coefficient form**: P(x) = a₀ + a₁x + a₂x² + ... + aₙxⁿ
2. **Point-value form**: {(x₀, P(x₀)), (x₁, P(x₁)), ..., (xₙ, P(xₙ))}

**Key insight**: Multiplication is O(n) in point-value form!

### Roots of Unity

The n-th roots of unity are solutions to ωⁿ = 1:
```
ω_k = e^(2πik/n) for k = 0, 1, ..., n-1
```

Properties:
- ωₙ^n = 1
- ωₙ^(n/2) = -1
- ωₙ^k = ωₙ^(k mod n)
- ωₙ^(k+n/2) = -ωₙ^k

### Cooley-Tukey Algorithm

The divide-and-conquer approach splits the polynomial into even and odd coefficients:

```
DFT(a)[k] = DFT(even)(k) + ω^k × DFT(odd)(k)
DFT(a)[k + n/2] = DFT(even)(k) - ω^k × DFT(odd)(k)
```

This gives us the famous butterfly operation pattern.

### Number Theoretic Transform (NTT)

For modulus p where p = k×2^m + 1 (like 998244353 = 119×2^23 + 1):

- Use primitive root g where g^((p-1)/2^m) is a 2^m-th root of unity
- All operations are exact modular arithmetic

Common NTT primes:
- 998244353 = 119×2^23 + 1, primitive root = 3
- 1004535809 = 479×2^21 + 1, primitive root = 3
- 469762049 = 7×2^26 + 1, primitive root = 3

### Visual Representation

For a polynomial P(x) = 3 + 4x + 2x² + x³:

```
Coefficient form: [3, 4, 2, 1]
          ↓ FFT
Point-value form: [(1, 10), (i, 3-3i), (-1, 0), (-i, 3+3i)]
          ↓ Pointwise Multiply with Q(x)
Result points: [...]
          ↓ Inverse FFT
Product polynomial coefficients: [...]
```

---

## Algorithm Steps

### FFT/NTT Transform

1. **Bit-reversal permutation**: Rearrange array so indices are in bit-reversed order
2. **Butterfly operations**: For each level from 2 to n:
   - Compute root of unity for this level
   - Apply butterfly operations to combine pairs
3. **Scaling** (for inverse): Divide each element by n

### Polynomial Multiplication

1. **Determine size**: Find smallest power of 2 ≥ (deg(A) + deg(B) + 1)
2. **Pad arrays**: Add zeros to make both arrays size n
3. **Forward FFT/NTT**: Transform both arrays
4. **Pointwise multiply**: Multiply corresponding elements
5. **Inverse FFT/NTT**: Transform back to coefficient form
6. **Trim result**: Remove trailing zeros

---

## Implementation

### Template Code

````carousel
```python
import math
import cmath
from typing import List

# NTT Constants
MOD = 998244353  # 119 * 2^23 + 1
PRIMITIVE_ROOT = 3

def ntt(a: List[int], invert: bool) -> None:
    """
    In-place iterative Number Theoretic Transform.
    
    Args:
        a: Coefficient array (modified in place)
        invert: True for inverse NTT
    
    Time Complexity: O(n log n)
    Space Complexity: O(1) extra
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


def multiply_polynomials_ntt(a: List[int], b: List[int]) -> List[int]:
    """
    Multiply two polynomials using NTT.
    
    Args:
        a: Coefficients of first polynomial [a₀, a₁, ..., aₙ]
        b: Coefficients of second polynomial [b₀, b₁, ..., bₘ]
    
    Returns:
        Coefficients of product polynomial
    
    Time Complexity: O(n log n)
    Space Complexity: O(n)
    """
    if not a or not b:
        return []
    
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


def convolution(a: List[int], b: List[int]) -> List[int]:
    """
    Compute convolution of two arrays.
    c[k] = sum(a[i] * b[k-i]) for all valid i
    
    Time Complexity: O(n log n)
    """
    return multiply_polynomials_ntt(a, b)


# FFT for floating-point (when modulus not needed)
def fft(a: List[complex], invert: bool) -> None:
    """
    Cooley-Tukey FFT algorithm.
    
    Args:
        a: Array of complex numbers (modified in place)
        invert: True for inverse FFT
    
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


def multiply_polynomials_fft(a: List[float], b: List[float]) -> List[int]:
    """
    Multiply polynomials using FFT (floating point).
    Note: May have precision issues for large numbers.
    """
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
def string_match_with_wildcard(text: str, pattern: str, wildcard: str = '?') -> List[int]:
    """
    Find all positions where pattern matches text (with wildcard support).
    Uses FFT for O(n log n) matching.
    """
    n, m = len(text), len(pattern)
    if m > n:
        return []
    
    matches = [0] * n
    
    # For each character, create binary arrays
    chars = set(text + pattern)
    if wildcard in chars:
        chars.remove(wildcard)
    
    for c in chars:
        a = [1 if x == c else 0 for x in text]
        b = [1 if x == c else 0 for x in reversed(pattern)]
        
        conv = convolution(a, b)
        
        for i in range(len(conv)):
            if i < len(matches):
                matches[i] += conv[i]
    
    # Find positions with full match
    result = []
    wildcards_in_pattern = pattern.count(wildcard)
    for i in range(m - 1, n):
        if matches[i] == m - wildcards_in_pattern:
            result.append(i - m + 1)
    
    return result


# Example usage
if __name__ == "__main__":
    # Polynomial multiplication
    a = [1, 2, 3]  # 1 + 2x + 3x^2
    b = [4, 5]     # 4 + 5x
    result = multiply_polynomials_ntt(a, b)
    print(f"({a}) * ({b}) = {result}")  # [4, 13, 22, 15]
    
    # Convolution
    c = [1, 2, 3]
    d = [1, 1, 1]
    conv = convolution(c, d)
    print(f"Convolution: {conv}")  # [1, 3, 6, 5, 3]
```

<!-- slide -->
```cpp
#include <bits/stdc++.h>
using namespace std;

const int MOD = 998244353;
const int PRIMITIVE_ROOT = 3;

/**
 * Compute base^exp % mod using binary exponentiation
 */
int mod_pow(int base, int exp, int mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        base = (long long)base * base % mod;
        exp >>= 1;
    }
    return (int)result;
}

/**
 * In-place iterative Number Theoretic Transform
 * 
 * Time Complexity: O(n log n)
 * Space Complexity: O(1) extra
 * 
 * @param a: Coefficient array (modified in place)
 * @param invert: True for inverse NTT
 */
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
                int v = (int)(w * a[i + j + len/2] % MOD);
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

/**
 * Multiply two polynomials using NTT
 * 
 * @param a: Coefficients of first polynomial
 * @param b: Coefficients of second polynomial
 * @return: Coefficients of product polynomial
 * 
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
vector<int> multiply_polynomials(const vector<int>& a, const vector<int>& b) {
    if (a.empty() || b.empty()) return {};
    
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

/**
 * Compute convolution of two arrays
 */
vector<int> convolution(const vector<int>& a, const vector<int>& b) {
    return multiply_polynomials(a, b);
}

// FFT implementation for complex numbers
void fft(vector<complex<double>>& a, bool invert) {
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
        double ang = 2 * M_PI / len * (invert ? -1 : 1);
        complex<double> wlen(cos(ang), sin(ang));
        
        for (int i = 0; i < n; i += len) {
            complex<double> w(1);
            for (int j = 0; j < len / 2; j++) {
                auto u = a[i + j];
                auto v = a[i + j + len/2] * w;
                a[i + j] = u + v;
                a[i + j + len/2] = u - v;
                w *= wlen;
            }
        }
    }
    
    if (invert) {
        for (auto& x : a) x /= n;
    }
}

vector<int> multiply_fft(const vector<double>& a, const vector<double>& b) {
    int n = 1;
    while (n < (int)a.size() + (int)b.size() - 1) n <<= 1;
    
    vector<complex<double>> fa(n), fb(n);
    for (int i = 0; i < (int)a.size(); i++) fa[i] = a[i];
    for (int i = 0; i < (int)b.size(); i++) fb[i] = b[i];
    
    fft(fa, false);
    fft(fb, false);
    
    for (int i = 0; i < n; i++) fa[i] *= fb[i];
    
    fft(fa, true);
    
    vector<int> result(a.size() + b.size() - 1);
    for (int i = 0; i < (int)result.size(); i++) 
        result[i] = (int)(fa[i].real() + 0.5);
    return result;
}

int main() {
    vector<int> a = {1, 2, 3};  // 1 + 2x + 3x^2
    vector<int> b = {4, 5};     // 4 + 5x
    
    vector<int> result = multiply_polynomials(a, b);
    
    cout << "Polynomial multiplication result: ";
    for (int x : result) cout << x << " ";
    cout << endl;  // [4, 13, 22, 15]
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.Arrays;

/**
 * Number Theoretic Transform (NTT) Implementation
 * 
 * Time Complexity: O(n log n) for all operations
 * Space Complexity: O(n)
 */
public class NTT {
    static final int MOD = 998244353;
    static final int PRIMITIVE_ROOT = 3;
    
    /**
     * Compute base^exp % mod using binary exponentiation
     */
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
    
    /**
     * In-place iterative Number Theoretic Transform
     * 
     * @param a: Coefficient array (modified in place)
     * @param invert: True for inverse NTT
     */
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
    
    /**
     * Multiply two polynomials using NTT
     * 
     * @param a: Coefficients of first polynomial
     * @param b: Coefficients of second polynomial
     * @return: Coefficients of product polynomial
     */
    static int[] multiply(int[] a, int[] b) {
        if (a == null || b == null || a.length == 0 || b.length == 0) {
            return new int[0];
        }
        
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
    
    /**
     * Compute convolution of two arrays
     */
    static int[] convolution(int[] a, int[] b) {
        return multiply(a, b);
    }
    
    // FFT Implementation for complex numbers
    static class Complex {
        double real, imag;
        Complex(double r, double i) { real = r; imag = i; }
        Complex(double r) { real = r; imag = 0; }
        Complex() { real = 0; imag = 0; }
        
        Complex add(Complex o) { return new Complex(real + o.real, imag + o.imag); }
        Complex sub(Complex o) { return new Complex(real - o.real, imag - o.imag); }
        Complex mul(Complex o) { 
            return new Complex(real * o.real - imag * o.imag, real * o.imag + imag * o.real); 
        }
        Complex div(double d) { return new Complex(real / d, imag / d); }
        static Complex polar(double r, double theta) {
            return new Complex(r * Math.cos(theta), r * Math.sin(theta));
        }
    }
    
    static void fft(Complex[] a, boolean invert) {
        int n = a.length;
        
        // Bit-reversal permutation
        for (int i = 1, j = 0; i < n; i++) {
            int bit = n >> 1;
            for (; (j & bit) != 0; bit >>= 1) j ^= bit;
            j ^= bit;
            if (i < j) {
                Complex temp = a[i];
                a[i] = a[j];
                a[j] = temp;
            }
        }
        
        // Transform
        for (int len = 2; len <= n; len <<= 1) {
            double ang = 2 * Math.PI / len * (invert ? -1 : 1);
            Complex wlen = new Complex(Math.cos(ang), Math.sin(ang));
            
            for (int i = 0; i < n; i += len) {
                Complex w = new Complex(1);
                for (int j = 0; j < len / 2; j++) {
                    Complex u = a[i + j];
                    Complex v = a[i + j + len/2].mul(w);
                    a[i + j] = u.add(v);
                    a[i + j + len/2] = u.sub(v);
                    w = w.mul(wlen);
                }
            }
        }
        
        if (invert) {
            for (int i = 0; i < n; i++) a[i] = a[i].div(n);
        }
    }
    
    static int[] multiplyFFT(double[] a, double[] b) {
        int n = 1;
        while (n < a.length + b.length - 1) n <<= 1;
        
        Complex[] fa = new Complex[n];
        Complex[] fb = new Complex[n];
        for (int i = 0; i < n; i++) {
            fa[i] = new Complex(i < a.length ? a[i] : 0);
            fb[i] = new Complex(i < b.length ? b[i] : 0);
        }
        
        fft(fa, false);
        fft(fb, false);
        
        for (int i = 0; i < n; i++) fa[i] = fa[i].mul(fb[i]);
        
        fft(fa, true);
        
        int[] result = new int[a.length + b.length - 1];
        for (int i = 0; i < result.length; i++) 
            result[i] = (int)(fa[i].real + 0.5);
        return result;
    }
    
    public static void main(String[] args) {
        int[] a = {1, 2, 3};  // 1 + 2x + 3x^2
        int[] b = {4, 5};     // 4 + 5x
        
        int[] result = multiply(a, b);
        
        System.out.println("Polynomial multiplication result: " + Arrays.toString(result));
        // Output: [4, 13, 22, 15]
    }
}
```

<!-- slide -->
```javascript
/**
 * Number Theoretic Transform (NTT) and FFT Implementation
 * 
 * Time Complexity: O(n log n) for all operations
 * Space Complexity: O(n)
 */

const MOD = 998244353;
const PRIMITIVE_ROOT = 3;

/**
 * Compute base^exp % mod using binary exponentiation
 * @param {number} base 
 * @param {number} exp 
 * @param {number} mod 
 * @returns {number}
 */
function modPow(base, exp, mod) {
    let result = 1n;
    let b = BigInt(base) % BigInt(mod);
    let e = BigInt(exp);
    const m = BigInt(mod);
    
    while (e > 0n) {
        if (e & 1n) result = result * b % m;
        b = b * b % m;
        e >>= 1n;
    }
    return Number(result);
}

/**
 * In-place iterative Number Theoretic Transform
 * 
 * @param {number[]} a - Coefficient array (modified in place)
 * @param {boolean} invert - True for inverse NTT
 * 
 * Time Complexity: O(n log n)
 * Space Complexity: O(1) extra
 */
function ntt(a, invert) {
    const n = a.length;
    
    // Bit-reversal permutation
    let j = 0;
    for (let i = 1; i < n; i++) {
        let bit = n >> 1;
        while (j & bit) {
            j ^= bit;
            bit >>= 1;
        }
        j ^= bit;
        if (i < j) {
            [a[i], a[j]] = [a[j], a[i]];
        }
    }
    
    // Transform
    for (let len = 2; len <= n; len <<= 1) {
        let wlen = modPow(PRIMITIVE_ROOT, (MOD - 1) / len, MOD);
        if (invert) {
            wlen = modPow(wlen, MOD - 2, MOD);
        }
        
        for (let i = 0; i < n; i += len) {
            let w = 1;
            const half = len >> 1;
            for (let j = 0; j < half; j++) {
                const u = a[i + j];
                const v = a[i + j + half] * w % MOD;
                a[i + j] = (u + v) % MOD;
                a[i + j + half] = (u - v + MOD) % MOD;
                w = w * wlen % MOD;
            }
        }
    }
    
    if (invert) {
        const nInv = modPow(n, MOD - 2, MOD);
        for (let i = 0; i < n; i++) {
            a[i] = a[i] * nInv % MOD;
        }
    }
}

/**
 * Multiply two polynomials using NTT
 * 
 * @param {number[]} a - Coefficients of first polynomial
 * @param {number[]} b - Coefficients of second polynomial
 * @returns {number[]} Coefficients of product polynomial
 * 
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
function multiplyPolynomials(a, b) {
    if (!a.length || !b.length) return [];
    
    // Find appropriate size (power of 2)
    let n = 1;
    while (n < a.length + b.length - 1) {
        n <<= 1;
    }
    
    // Pad with zeros
    const fa = [...a, ...new Array(n - a.length).fill(0)];
    const fb = [...b, ...new Array(n - b.length).fill(0)];
    
    // Forward NTT
    ntt(fa, false);
    ntt(fb, false);
    
    // Pointwise multiply
    for (let i = 0; i < n; i++) {
        fa[i] = fa[i] * fb[i] % MOD;
    }
    
    // Inverse NTT
    ntt(fa, true);
    
    // Trim to correct size
    return fa.slice(0, a.length + b.length - 1);
}

/**
 * Compute convolution of two arrays
 * @param {number[]} a 
 * @param {number[]} b 
 * @returns {number[]}
 */
function convolution(a, b) {
    return multiplyPolynomials(a, b);
}

// FFT Implementation for complex numbers
/**
 * Cooley-Tukey FFT algorithm
 * @param {Complex[]} a - Array of complex numbers (modified in place)
 * @param {boolean} invert - True for inverse FFT
 */
function fft(a, invert) {
    const n = a.length;
    
    // Bit-reversal permutation
    let j = 0;
    for (let i = 1; i < n; i++) {
        let bit = n >> 1;
        while (j & bit) {
            j ^= bit;
            bit >>= 1;
        }
        j ^= bit;
        if (i < j) {
            [a[i], a[j]] = [a[j], a[i]];
        }
    }
    
    // Transform
    for (let len = 2; len <= n; len <<= 1) {
        const ang = 2 * Math.PI / len * (invert ? -1 : 1);
        const wlen = { real: Math.cos(ang), imag: Math.sin(ang) };
        
        for (let i = 0; i < n; i += len) {
            let w = { real: 1, imag: 0 };
            const half = len >> 1;
            for (let j = 0; j < half; j++) {
                const u = a[i + j];
                const v = multiplyComplex(a[i + j + half], w);
                a[i + j] = addComplex(u, v);
                a[i + j + half] = subtractComplex(u, v);
                w = multiplyComplex(w, wlen);
            }
        }
    }
    
    if (invert) {
        for (let i = 0; i < n; i++) {
            a[i].real /= n;
            a[i].imag /= n;
        }
    }
}

// Complex number helpers
function addComplex(a, b) {
    return { real: a.real + b.real, imag: a.imag + b.imag };
}

function subtractComplex(a, b) {
    return { real: a.real - b.real, imag: a.imag - b.imag };
}

function multiplyComplex(a, b) {
    return {
        real: a.real * b.real - a.imag * b.imag,
        imag: a.real * b.imag + a.imag * b.real
    };
}

/**
 * Multiply polynomials using FFT (floating point)
 * @param {number[]} a 
 * @param {number[]} b 
 * @returns {number[]}
 */
function multiplyPolynomialsFFT(a, b) {
    let n = 1;
    while (n < a.length + b.length - 1) n <<= 1;
    
    const fa = new Array(n).fill(null).map((_, i) => ({
        real: i < a.length ? a[i] : 0,
        imag: 0
    }));
    const fb = new Array(n).fill(null).map((_, i) => ({
        real: i < b.length ? b[i] : 0,
        imag: 0
    }));
    
    fft(fa, false);
    fft(fb, false);
    
    for (let i = 0; i < n; i++) {
        fa[i] = multiplyComplex(fa[i], fb[i]);
    }
    
    fft(fa, true);
    
    return fa.slice(0, a.length + b.length - 1).map(c => Math.round(c.real));
}

// Example usage
const a = [1, 2, 3];  // 1 + 2x + 3x^2
const b = [4, 5];     // 4 + 5x

const result = multiplyPolynomials(a, b);
console.log(`(${a}) * (${b}) = [${result.join(', ')}]`);  // [4, 13, 22, 15]

// Convolution example
const c = [1, 2, 3];
const d = [1, 1, 1];
const conv = convolution(c, d);
console.log(`Convolution: [${conv.join(', ')}]`);  // [1, 3, 6, 5, 3]
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Space Complexity | Description |
|-----------|----------------|------------------|-------------|
| **NTT/FFT Transform** | O(n log n) | O(n) | Single forward or inverse transform |
| **Polynomial Multiply** | O(n log n) | O(n) | Two transforms + pointwise multiply + inverse |
| **Convolution** | O(n log n) | O(n) | Same as polynomial multiplication |
| **Large Number Multiply** | O(n log n) | O(n) | NTT + carry handling |
| **String Matching** | O(n log n × |Σ|) | O(n) | One convolution per character |

### Detailed Breakdown

**NTT/FFT Transform (O(n log n)):**
- Bit-reversal permutation: O(n)
- Main transform loop: Σ(n/2^k) for k=1 to log n = O(n log n)
- Each level processes n elements with constant work

**Polynomial Multiplication (O(n log n)):**
- Two forward NTTs: 2 × O(n log n)
- Pointwise multiply: O(n)
- One inverse NTT: O(n log n)
- Total: O(n log n)

**Space Complexity:**
- Input arrays: O(n)
- Temporary arrays for padded inputs: O(n)
- No recursion stack (iterative implementation)

---

## Space Complexity Analysis

| Component | Space | Notes |
|-----------|-------|-------|
| **Input Arrays** | O(n) | Original polynomial coefficients |
| **Padded Arrays** | O(n) | Extended to power of 2 |
| **Temporary Storage** | O(1) | In-place transforms |
| **Total** | O(n) | Linear space requirement |

### Space Optimization

For memory-constrained environments:
1. **In-place transforms**: Reuse the same array for forward/inverse
2. **Chunked processing**: Process large polynomials in blocks
3. **Single array approach**: Store both polynomials interleaved temporarily

---

## Common Variations

### 1. Large Number Multiplication

Multiply numbers with thousands of digits using NTT:

````carousel
```python
def multiply_large_numbers(a: str, b: str) -> str:
    """
    Multiply two large numbers using NTT.
    Handles numbers with thousands of digits.
    
    Time Complexity: O(n log n) where n is number of digits
    """
    if a == "0" or b == "0":
        return "0"
    
    # Convert to digit arrays (reversed for least significant first)
    digits_a = [int(c) for c in reversed(a)]
    digits_b = [int(c) for c in reversed(b)]
    
    # Multiply using NTT
    result_digits = multiply_polynomials_ntt(digits_a, digits_b)
    
    # Handle carries
    carry = 0
    for i in range(len(result_digits)):
        result_digits[i] += carry
        carry = result_digits[i] // 10
        result_digits[i] %= 10
    
    while carry:
        result_digits.append(carry % 10)
        carry //= 10
    
    # Remove leading zeros and convert back
    while len(result_digits) > 1 and result_digits[-1] == 0:
        result_digits.pop()
    
    return ''.join(str(d) for d in reversed(result_digits))


# Example: Multiply 123456789 × 987654321
num1 = "123456789"
num2 = "987654321"
print(f"{num1} × {num2} = {multiply_large_numbers(num1, num2)}")
# Output: 121932631112635269
```
````

### 2. Subset Sum Counting

Count the number of ways to achieve each possible sum:

````carousel
```python
def count_subset_sums(nums: List[int], target: int) -> int:
    """
    Count ways to achieve target sum using FFT for faster computation.
    
    Time Complexity: O(n × max_sum log(max_sum))
    Space Complexity: O(max_sum)
    """
    if not nums:
        return 1 if target == 0 else 0
    
    max_sum = sum(nums)
    if target > max_sum:
        return 0
    
    # Start with polynomial representing empty subset
    poly = [1] + [0] * max_sum
    
    for num in nums:
        # Create polynomial (1 + x^num)
        term = [1] + [0] * num
        if num <= len(term):
            term[num] = 1
        poly = multiply_polynomials_ntt(poly, term)
    
    return poly[target] if target < len(poly) else 0


def count_subset_sums_all(nums: List[int]) -> List[int]:
    """
    Return array where result[i] = number of ways to get sum i.
    """
    max_sum = sum(nums)
    poly = [1] + [0] * max_sum
    
    for num in nums:
        term = [1] + [0] * num
        if num < len(term):
            term[num] = 1
        poly = multiply_polynomials_ntt(poly, term)
    
    return poly
```
````

### 3. String Matching with Wildcards

Pattern matching with '?' wildcard support:

````carousel
```python
def string_match_wildcard_optimized(text: str, pattern: str, wildcard: str = '?') -> List[int]:
    """
    Find all positions where pattern matches text with wildcards.
    Uses FFT for O(n log n) complexity.
    
    Args:
        text: Text to search in
        pattern: Pattern to search for
        wildcard: Character that matches any character
    
    Returns:
        List of starting positions where pattern matches
    """
    n, m = len(text), len(pattern)
    if m > n:
        return []
    
    # Count non-wildcard characters needed for match
    required_matches = m - pattern.count(wildcard)
    matches = [0] * n
    
    # Process each character separately
    for c in set(text + pattern.replace(wildcard, '')):
        # Create binary arrays
        text_arr = [1 if x == c else 0 for x in text]
        pattern_arr = [1 if x == c else 0 for x in reversed(pattern)]
        
        # Convolve
        conv = convolution(text_arr, pattern_arr)
        
        # Accumulate matches
        for i in range(m - 1, n):
            matches[i] += conv[i]
    
    # Return positions with full match
    return [i - m + 1 for i in range(m - 1, n) if matches[i] == required_matches]
```
````

### 4. 2D Convolution for Image Processing

Apply NTT for 2D operations:

````carousel
```python
def convolve_2d(image: List[List[int]], kernel: List[List[int]]) -> List[List[int]]:
    """
    Apply 2D convolution using separable NTT transforms.
    Useful for image processing operations.
    
    Time Complexity: O(n² log n)
    Space Complexity: O(n²)
    """
    rows = len(image)
    cols = len(image[0]) if rows > 0 else 0
    k_rows = len(kernel)
    k_cols = len(kernel[0]) if k_rows > 0 else 0
    
    # Find size for NTT
    n_rows = 1
    while n_rows < rows + k_rows - 1:
        n_rows <<= 1
    n_cols = 1
    while n_cols < cols + k_cols - 1:
        n_cols <<= 1
    
    # Flatten and pad
    flat_image = [0] * (n_rows * n_cols)
    flat_kernel = [0] * (n_rows * n_cols)
    
    for i in range(rows):
        for j in range(cols):
            flat_image[i * n_cols + j] = image[i][j]
    
    for i in range(k_rows):
        for j in range(k_cols):
            # Flip kernel for convolution
            flat_kernel[(k_rows - 1 - i) * n_cols + (k_cols - 1 - j)] = kernel[i][j]
    
    # Perform 2D NTT (row then column transforms)
    # ... (implementation details)
    
    result = [[0] * (cols + k_cols - 1) for _ in range(rows + k_rows - 1)]
    # Unpack result...
    
    return result
```
````

### 5. Multiple Modulus NTT (CRT)

Handle results larger than single modulus using Chinese Remainder Theorem:

````carousel
```python
class MultiModulusNTT:
    """
    NTT using multiple moduli for results exceeding single modulus.
    Combines results using Chinese Remainder Theorem.
    """
    
    MODS = [
        (998244353, 3),      # 119 * 2^23 + 1
        (1004535809, 3),     # 479 * 2^21 + 1
        (469762049, 3),      # 7 * 2^26 + 1
    ]
    
    def __init__(self):
        self.ntts = []
        for mod, root in self.MODS:
            self.ntts.append(self._create_ntt(mod, root))
    
    def _create_ntt(self, mod, root):
        # Returns NTT functions bound to specific modulus
        def ntt_transform(a, invert):
            # Implementation with given mod/root
            pass
        return ntt_transform
    
    def multiply(self, a, b):
        """
        Multiply polynomials with result accurate to product of moduli.
        """
        results = []
        for ntt in self.ntts:
            # Multiply with each modulus
            results.append(self._multiply_with_ntt(a, b, ntt))
        
        # Combine using CRT
        return self._chinese_remainder_combine(results)
    
    def _chinese_remainder_combine(self, remainders):
        """
        Combine results from multiple moduli using CRT.
        """
        # Garner's algorithm or direct CRT
        pass
```
````

---

## Practice Problems

### Problem 1: Closest Subsequence Sum

**Problem:** [LeetCode 1755 - Closest Subsequence Sum](https://leetcode.com/problems/closest-subsequence-sum/)

**Description:** You are given an integer array `nums` and an integer `goal`. You want to choose a subsequence of `nums` such that the sum of its elements is the closest possible to `goal`. Return the minimum possible absolute difference.

**How to Apply FFT/NTT:**
- Use FFT to efficiently compute all possible subset sums
- Represent the array as a polynomial where x^num has coefficient 1
- Polynomial multiplication gives all subset sum combinations
- Find the closest sum to goal in O(2^(n/2)) with meet-in-the-middle or use FFT for O(n × max_sum log max_sum)

---

### Problem 2: Multiply Strings

**Problem:** [LeetCode 43 - Multiply Strings](https://leetcode.com/problems/multiply-strings/)

**Description:** Given two non-negative integers `num1` and `num2` represented as strings, return the product of `num1` and `num2`, also represented as a string. Note: You must not use any built-in BigInteger library or convert the inputs to integer directly.

**How to Apply FFT/NTT:**
- Convert strings to digit arrays
- Use NTT for O(n log n) multiplication instead of O(n²) grade school algorithm
- Handle carries after the NTT-based multiplication
- Essential for very large numbers (200+ digits)

---

### Problem 3: Maximum Number of Ways to Partition an Array

**Problem:** [LeetCode 2025 - Maximum Number of Ways to Partition an Array](https://leetcode.com/problems/maximum-number-of-ways-to-partition-an-array/)

**Description:** You are given a 0-indexed integer array `nums` of length `n`. The number of ways to partition `nums` is the number of pivot indices that satisfy both conditions. You are also given an integer `k`. You can change one element in nums to `k`. Return the maximum possible number of ways to partition nums after changing at most one element.

**How to Apply FFT/NTT:**
- Use convolution to count frequency differences
- FFT helps compute prefix-sum related quantities efficiently
- Handle large constraints with O(n log n) approach

---

### Problem 4: Subtree Removal Game with Fibonacci Tree

**Problem:** [LeetCode 2005 - Subtree Removal Game with Fibonacci Tree](https://leetcode.com/problems/subtree-removal-game-with-fibonacci-tree/)

**Description:** A Fibonacci tree is a binary tree created using the order function `order(n)`. Return the number of nodes Alice can remove if both players play optimally in a game on a Fibonacci tree of order `n`.

**How to Apply FFT/NTT:**
- Use polynomial exponentiation with NTT
- Compute Fibonacci-like recurrences with convolution
- Optimize large state transitions using FFT

---

### Problem 5: Count Pairs Of Nodes With Connection

**Problem:** [LeetCode 1782 - Count Pairs Of Nodes With Connection](https://leetcode.com/problems/count-pairs-of-nodes-with-connection/)

**Description:** You are given an undirected graph defined by `n` nodes numbered from `1` to `n`, and an edge list `edges`. You are also given a queries array. For each query, find the number of pairs of nodes (a, b) that satisfy the condition.

**How to Apply FFT/NTT:**
- Use convolution to count degree pair frequencies
- FFT accelerates the frequency counting from O(n²) to O(n log n)
- Handle edge cases with degree distribution analysis

---

## Video Tutorial Links

### Fundamentals

- [FFT Introduction (Take U Forward)](https://www.youtube.com/watch?v=h7apO7q16V0) - Comprehensive introduction to FFT concepts
- [Number Theoretic Transform (Errichto)](https://www.youtube.com/watch?v=1vZsw8Lpx14) - NTT explained with code
- [FFT Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=Ty0JcR-cD-0) - Visual explanation of Cooley-Tukey
- [Polynomial Multiplication using FFT (Codeforces)](https://www.youtube.com/watch?v=FAUkq8DWKjg) - Competitive programming focus

### Advanced Topics

- [NTT Implementation Deep Dive (CP-Algorithms)](https://cp-algorithms.com/algebra/fft.html) - Detailed implementation guide
- [FFT for String Matching](https://www.youtube.com/watch?v=6KCSJdD8r7s) - Pattern matching applications
- [2D FFT for Image Processing](https://www.youtube.com/watch?v=Gv_8dK-OXYs) - Image convolution examples
- [Chinese Remainder Theorem with NTT](https://www.youtube.com/watch?v=zOxUnKXB4Xc) - Handling large moduli

---

## Follow-up Questions

### Q1: When should I use NTT over FFT?

**Answer:** Use NTT when:
- You need **exact integer results** (no floating-point errors)
- Working in **competitive programming** where precision matters
- All values fit within a **modular arithmetic system**
- The modulus is of form k×2^m + 1 (e.g., 998244353)

Use FFT when:
- Working with **real/complex numbers**
- **Scientific computing** applications
- You have **hardware floating-point acceleration**
- Precision loss is acceptable for your use case

### Q2: What if the result exceeds the NTT modulus?

**Answer:** Several solutions:

1. **Multiple NTT moduli + CRT**: Use 2-3 different primes and combine with Chinese Remainder Theorem
2. **128-bit FFT**: Use long double/double-double FFT with careful rounding
3. **Split coefficients**: Split each number into high/low parts and combine
4. **Use larger modulus**: Find a larger suitable prime (rare)

Example with two moduli:
```python
# Compute result mod 998244353 and mod 1004535809
# Then combine using CRT to get result mod (998244353 × 1004535809)
```

### Q3: Why must n be a power of 2?

**Answer:** The Cooley-Tukey algorithm requires:
- **Divide and conquer**: Splitting the problem in half at each step
- **Butterfly operations**: Pairs of elements are combined
- **Complete binary tree**: log₂(n) levels of recursion/iteration

If n is not a power of 2:
1. **Pad with zeros** to next power of 2 (simplest)
2. **Bluestein's algorithm** for arbitrary sizes
3. **Mixed-radix FFT** for composite sizes

Padding is O(n) and doesn't affect asymptotic complexity.

### Q4: How do I handle precision issues in FFT?

**Answer:** Mitigation strategies:

1. **Rounding**: `int(round(real_part))` after inverse FFT
2. **Error tolerance**: Check if value is within 0.5 of nearest integer
3. **Use NTT when possible**: Exact arithmetic, no precision issues
4. **Higher precision**: Use long double (80-bit) instead of double
5. **Split numbers**: For large values, split into smaller chunks

```python
# Safe rounding with tolerance
def safe_round(x):
    rounded = round(x)
    if abs(x - rounded) > 0.1:  # Too much error
        raise PrecisionError()
    return int(rounded)
```

### Q5: What's the maximum polynomial degree FFT/NTT can handle?

**Answer:** Practical limits depend on implementation:

- **Time**: O(n log n) means up to ~10^7 coefficients feasible
- **Memory**: O(n) space → ~10^8 elements with 4GB RAM
- **NTT modulus**: Result must fit in modulus, or use CRT
- **FFT precision**: Rounding errors accumulate with size

Typical competitive programming limits:
- n ≤ 2^20 (about 1 million) for standard implementations
- n ≤ 2^23 for optimized implementations

### Q6: Can FFT/NTT be parallelized?

**Answer:** Yes! Several levels of parallelism:

1. **Bit-reversal**: Independent swaps can be parallel
2. **Butterfly stages**: Within each stage, operations are independent
3. **Multiple transforms**: Different transforms on different cores
4. **GPU acceleration**: FFT is highly parallel, excellent for GPUs

Modern FFT libraries (FFTW, cuFFT) exploit all these levels.

---

## Summary

FFT/NTT is a powerful algorithmic technique for:

- **Polynomial multiplication** in O(n log n) instead of O(n²)
- **Convolution** operations for signal processing
- **String matching** with wildcards in sub-quadratic time
- **Large number arithmetic** for competitive programming

**Key Takeaways:**

- **Choose NTT for CP**: Exact results, no precision issues
- **Choose FFT for real numbers**: When working with continuous data
- **Power of 2**: Always pad to next power of 2
- **O(n log n)**: Exponentially faster than naive for large inputs
- **In-place**: Can be implemented with O(1) extra space

**When to use:**
- ✅ Polynomial degrees > 1000
- ✅ Large integer multiplication (> 200 digits)
- ✅ Convolution with large arrays
- ✅ String matching with large alphabets
- ❌ Small inputs (overhead not worth it)
- ❌ When exact integer results not needed (use FFT)

Mastering FFT/NTT is essential for advanced competitive programming and algorithmic problem solving involving polynomial operations and convolutions.

---

## Related Algorithms

- [Karatsuba](./karatsuba.md) - Alternative O(n^1.585) multiplication
- [Chinese Remainder Theorem](./chinese-remainder.md) - For large NTT results
- [Modular Inverse](./modular-inverse.md) - Used in inverse NTT
- [Sparse Table](./sparse-table.md) - Another advanced data structure
- [Segment Tree](./segment-tree.md) - For different types of range queries
