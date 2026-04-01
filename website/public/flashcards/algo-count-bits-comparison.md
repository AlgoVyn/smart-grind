## Count Bits: Comparison Guide

How does bit counting compare to other bit manipulation techniques?

<!-- front -->

---

### Popcount Algorithms Comparison

| Algorithm | Time | Best For | Implementation |
|-----------|------|----------|----------------|
| **Built-in** | O(1) | Production | `x.bit_count()` |
| **Shift and check** | O(log x) | Clarity | Simple loop |
| **Kernighan** | O(popcount) | Sparse data | `x &= x-1` |
| **SWAR/Parallel** | O(1) | 32/64-bit | Bit manipulation |
| **Lookup table** | O(1) | Large arrays | 8/16-bit chunks |
| **DP for range** | O(n) | All 0..n | Recurrence |

---

### Related Bit Operations

| Operation | Expression | Use Case |
|-----------|------------|----------|
| **Popcount** | `x.bit_count()` | Count set bits |
| **LSB** | `x & -x` | Isolate lowest bit |
| **Clear LSB** | `x & (x-1)` | Remove lowest bit |
| **MSB** | `x.bit_length() - 1` | Find highest bit |
| **Parity** | `popcount(x) & 1` | Even/odd 1s |
| **Reverse** | Bit reversal | Endianness |

---

### DP Patterns for Count Bits

| Pattern | Recurrence | Intuition |
|---------|------------|-----------|
| **Right shift** | `dp[i] = dp[i>>1] + (i&1)` | Remove LSB, add it back |
| **Clear LSB** | `dp[i] = dp[i&(i-1)] + 1` | Remove lowest 1, count it |
| **MSB** | `dp[i] = dp[i-msb] + 1` | Power of 2 decomposition |
| **XOR** | `dp[i] = dp[i>>1] + dp[i&1]` | Split and combine |

---

### When to Use Each Approach

```
Single popcount:
  Small value → Built-in or shift
  Sparse → Kernighan
  32/64-bit → SWAR

Range 0..n popcount:
  n < 10^6 → Any DP pattern
  n > 10^6 with queries → Precompute
  Space constrained → Streaming compute

Large scale:
  GPU → Parallel bit_count
  Distributed → MapReduce with lookup
```

---

### Hamming Weight in Different Contexts

| Context | Name | Purpose |
|---------|------|---------|
| **Binary strings** | Hamming weight | Population count |
| **Error correction** | Parity bit | Detect single-bit errors |
| **Cryptography** | Hamming distance | XOR difference measure |
| **Information theory** | Entropy related | Information content |
| **Neural networks** | Binary activation | Sparsity measurement |

<!-- back -->
