## FFT/NTT: Core Concepts

What are FFT and NTT, and when are they used for polynomial multiplication?

<!-- front -->

---

### Fundamental Definition

**FFT (Fast Fourier Transform):** Algorithm to compute DFT/IDFT in O(n log n) using divide-and-conquer with complex roots of unity.

**NTT (Number Theoretic Transform):** FFT variant using modular arithmetic with primitive roots instead of complex numbers.

| Transform | Domain | Use Case |
|-----------|--------|----------|
| **FFT** | Complex numbers | General polynomial multiplication, signal processing |
| **NTT** | Finite field Z_p | Exact integer polynomial multiplication |

---

### Key Insight: Convolution via Pointwise Multiplication

Polynomial multiplication = **convolution** of coefficients:

```
A(x) = a₀ + a₁x + a₂x² + ... + aₙxⁿ
B(x) = b₀ + b₁x + b₂x² + ... + bₘxᵐ

C(x) = A(x)·B(x) where cₖ = Σᵢ aᵢ·bₖ₋ᵢ

Direct: O(n²)
FFT: O(n log n)
```

**FFT approach:**
1. Evaluate A, B at 2n points (DFT) - O(n log n)
2. Multiply pointwise - O(n)
3. Interpolate back to coefficients (IDFT) - O(n log n)

---

### FFT vs NTT Selection

| Factor | Choose FFT | Choose NTT |
|--------|------------|------------|
| **Floating point OK?** | ✓ | ✗ Exact integers |
| **Modular result?** | Needs rounding | ✓ Exact |
| **Large coefficients?** | Precision issues | ✓ Handles large |
| **Prime modulus?** | - | Need suitable prime |
| **Implementation ease** | Complex math | Modular arithmetic |

---

### Complexity Analysis

| Aspect | Value |
|--------|-------|
| **Naive convolution** | O(n²) |
| **FFT/NTT convolution** | O(n log n) |
| **Padding requirement** | Next power of 2 ≥ 2n |
| **Precision (FFT)** | ~1e-9 relative error |

**Speedup:** FFT wins for n > 64 typically.

<!-- back -->
