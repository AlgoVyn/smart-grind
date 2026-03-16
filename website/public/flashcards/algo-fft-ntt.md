## Fast Fourier Transform (FFT)

**Question:** Multiply polynomials in O(n log n)?

<!-- front -->

---

## Answer: Divide and Conquer DFT

### Polynomial Multiplication
```python
import cmath

def fft(a, invert=False):
    n = len(a)
    
    # Bit reversal permutation
    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        
        if i < j:
            a[i], a[j] = a[j], a[i]
    
    # Cooley-Tukey
    length = 2
    while length <= n:
        angle = (2 * cmath.pi / length) * (-1 if invert else 1)
        wlen = cmath.exp(1j * angle)
        
        for i in range(0, n, length):
            w = 1
            for j in range(i, i + length // 2):
                u = a[j]
                v = a[j + length // 2] * w
                a[j] = u + v
                a[j + length // 2] = u - v
                w *= wlen
        
        length *= 2
    
    if invert:
        for i in range(n):
            a[i] /= n
    
    return a

def multiply_polynomials(a, b):
    # Pad to power of 2
    n = 1
    while n < len(a) + len(b):
        n *= 2
    
    fa = a + [0] * (n - len(a))
    fb = b + [0] * (n - len(b))
    
    fft(fa, False)
    fft(fb, False)
    
    for i in range(n):
        fa[i] *= fb[i]
    
    fft(fa, True)
    
    return [int(round(fa[i].real)) for i in range(len(a) + len(b) - 1)]
```

### Visual: FFT Process
```
Polynomial: A(x) = a0 + a1x + a2x² + ...

FFT: Convert to point values
     A(ω⁰), A(ω¹), A(ω²), ...

Pointwise multiplication: O(n)
IFFT: Convert back to coefficients

Total: O(n log n)
```

### ⚠️ Tricky Parts

#### 1. Root of Unity
```python
# ω = e^(2πi/n) is nth root of unity
# ω^n = 1, ω^k ≠ 1 for 0 < k < n

# Inversion uses ω^(-1) = conj(ω)
```

#### 2. Bit Reversal
```python
# Required for in-place FFT
# Rearrange indices so LSB becomes MSB

# Example: 001 → 100 (1 → 4)
```

### Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| FFT | O(n log n) | O(n) |
| Multiply | O(n) | O(n) |
| Total | O(n log n) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong sign | Use -1 for forward, +1 for inverse |
| Not rounding | Round to nearest int |
| Size not power of 2 | Pad to next power of 2 |

<!-- back -->
