## FFT/NTT: Comparison with Alternatives

How do FFT/NTT compare to naive and other polynomial multiplication methods?

<!-- front -->

---

### Polynomial Multiplication: Naive vs FFT vs NTT

| Method | Time | Space | Accuracy | Use Case |
|--------|------|-------|----------|----------|
| **Naive** | O(n²) | O(n) | Exact | n < 64 |
| **Karatsuba** | O(n^1.585) | O(n) | Exact | Medium n |
| **FFT** | O(n log n) | O(n) | Floating error | Floating OK |
| **NTT** | O(n log n) | O(n) | Exact | Integer, modulus |

```python
# Threshold-based selection
def multiply_poly(a, b):
    n, m = len(a), len(b)
    
    if n * m < 5000:  # Threshold
        # Naive O(n²)
        result = [0] * (n + m - 1)
        for i in range(n):
            for j in range(m):
                result[i + j] += a[i] * b[j]
        return result
    else:
        # FFT/NTT O(n log n)
        return multiply_polynomials(a, b)
```

---

### Karatsuba Algorithm

```python
def karatsuba(a, b):
    """
    Divide-and-conquer multiplication
    T(n) = 3T(n/2) + O(n) = O(n^log2(3)) ≈ O(n^1.585)
    """
    n = max(len(a), len(b))
    
    if n <= 64:
        # Base case: naive
        result = [0] * (len(a) + len(b))
        for i in range(len(a)):
            for j in range(len(b)):
                result[i + j] += a[i] * b[j]
        return result
    
    # Pad to equal length, power of 2
    m = n // 2
    
    # Split: a = a1 * 10^m + a0, b = b1 * 10^m + b0
    a_low = a[:m]
    a_high = a[m:]
    b_low = b[:m]
    b_high = b[m:]
    
    # Three multiplications instead of four
    z0 = karatsuba(a_low, b_low)           # a0 * b0
    z2 = karatsuba(a_high, b_high)         # a1 * b1
    z1 = karatsuba([x + y for x, y in zip(a_low, a_high)],
                    [x + y for x, y in zip(b_low, b_high)])
    
    # z1 = (a0+a1)(b0+b1) - z0 - z2 = a0*b1 + a1*b0
    z1 = [z1[i] - z0[i] - z2[i] for i in range(len(z1))]
    
    # Combine
    result = [0] * (len(a) + len(b))
    for i in range(len(z0)):
        result[i] += z0[i]
    for i in range(len(z1)):
        result[i + m] += z1[i]
    for i in range(len(z2)):
        result[i + 2*m] += z2[i]
    
    return result
```

---

### When to Use Each Approach

| Coefficient Size | Best Method | Reason |
|------------------|-------------|--------|
| **Small (<100), integers** | Naive | Overhead not worth it |
| **Medium (100-1000)** | Karatsuba | Good trade-off |
| **Large (>1000), floating** | FFT | Fast, acceptable error |
| **Large (>1000), exact int** | NTT | Exact result |
| **Arbitrary big ints** | FFT + splitting | Handle precision |

---

### FFT Precision Considerations

| Issue | Solution |
|-------|----------|
| **Rounding errors** | Round to nearest int, verify |
| **Large values** | Split into smaller chunks (base 10^4) |
| **Complex overhead** | Use real FFT for real inputs |
| **Numerical stability** | Iterative > recursive |

```python
# Precision-safe FFT multiplication
def safe_fft_multiply(a, b, chunk_bits=15):
    """
    Split numbers to control precision
    """
    base = 1 << chunk_bits
    
    # Split into chunks
    a_chunks = []
    for x in a:
        a_chunks.extend([x & (base-1), x >> chunk_bits])
    
    b_chunks = []
    for x in b:
        b_chunks.extend([x & (base-1), x >> chunk_bits])
    
    # Multiply with FFT
    result = multiply_polynomials(a_chunks, b_chunks)
    
    # Recombine with carries
    carry = 0
    final = []
    for i in range(len(result)):
        val = result[i] + carry
        final.append(val & (base - 1))
        carry = val >> chunk_bits
    
    # Pack back
    return [(final[i] + (final[i+1] << chunk_bits)) 
            for i in range(0, len(final), 2)]
```

<!-- back -->
