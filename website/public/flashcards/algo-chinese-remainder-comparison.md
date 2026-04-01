## Chinese Remainder: Comparison Guide

How does CRT compare to other approaches for solving congruences and handling large numbers?

<!-- front -->

---

### Solving Simultaneous Congruences

| Method | Time | Space | Moduli Requirements |
|--------|------|-------|---------------------|
| **Naive enumeration** | O(M) where M = product | O(1) | None |
| **CRT (coprime)** | O(n log M) | O(1) | Pairwise coprime |
| **Generalized CRT** | O(n² log max(m)) | O(1) | Consistent system |
| **Hensel lifting** | O(n log m) | O(1) | Prime power moduli |

**When to use each:**
```
Moduli are coprime? → Standard CRT (fastest)
Small product M? → Naive enumeration (simplest)
Non-coprime but consistent? → Generalized CRT
Prime powers? → Hensel lifting
```

---

### Large Number Representation

| Approach | Operations | Conversion | Use Case |
|----------|------------|------------|----------|
| **Big integers** | Slow, built-in | None | General purpose |
| **CRT representation** | Parallel, fast | Slow (need CRT) | Many ops, rare conversion |
| **FFT-based** | Very fast | Expensive | Specific algorithms (NTT) |

**CRT advantage:** Do k parallel computations mod small primes, combine once at end.

---

### RSA Implementation Comparison

| Method | Decryption Time | Memory | Security |
|--------|-----------------|--------|----------|
| **Standard RSA** | T | Low | Standard |
| **CRT-RSA** | ~T/4 | Medium | Standard |
| **Montgomery** | ~T/5 | Medium | Standard |
| **Sliding window** | ~T/6 | Higher | Standard |

CRT-RSA is the standard optimization in all production libraries.

---

### Garner vs Direct CRT

| Aspect | Direct CRT | Garner's Algorithm |
|--------|------------|-------------------|
| Precomputation | None | Inverse table |
| Runtime | O(n²) or O(n log M) | O(n²) |
| Numerical stability | Risk of overflow | Better |
| Reconstruction | Final modulo only | Mixed-radix form |
| Use case | Single problem | Multiple evaluations |

---

### Secret Sharing Schemes

| Scheme | Recovery | Threshold | Information Theory |
|--------|----------|-----------|-------------------|
| **Shamir (polynomial)** | Lagrange interpolation | Any k of n | Perfect security |
| **CRT-based** | CRT reconstruction | Any k of n | Perfect security |
| **XOR-based** | XOR sum | All n | Perfect security |
| **Blakley (hyperplanes)** | Intersection | Any k of n | Perfect security |

**CRT advantage:** Simpler than Shamir, no polynomial operations needed.

<!-- back -->
