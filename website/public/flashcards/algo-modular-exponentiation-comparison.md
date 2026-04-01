## Modular Exponentiation: Comparison

How do different modular exponentiation approaches compare?

<!-- front -->

---

### Algorithm Comparison

| Method | Time | Space | Use Case | Implementation |
|--------|------|-------|----------|----------------|
| Naive | O(exp) | O(1) | Never use | Simple loop |
| Binary | O(log exp) | O(1) | General purpose | Recommended |
| Recursive | O(log exp) | O(log exp) | Educational | Stack limited |
| Slinding Window | O(log exp / k) | O(2^k) | Very large exp | Complex |
| Montgomery | O(log exp) | O(1) | Very large mod | Advanced |

---

### Built-in vs Custom

| Approach | Speed | Portability | Recommendation |
|----------|-------|-------------|----------------|
| `pow(b,e,m)` | Fastest | Python only | Always use in Python |
| Custom binary | Fast | Any language | Implement when needed |
| Math library | Fast | Language dependent | Check availability |

---

### Exponent Size Guidelines

| Exponent Range | Recommended Approach | Why |
|----------------|---------------------|-----|
| exp < 1000 | Any method works | Performance similar |
| 1e3 < exp < 1e9 | Binary exponentiation | Balance of speed/simplicity |
| exp > 1e9 | Binary with optimizations | Need O(log exp) |
| Variable, many queries | Precompute powers | Amortize cost |

---

### Memory vs Speed Tradeoffs

| Technique | Extra Memory | Speed Improvement | When Worth It |
|-----------|-------------|-------------------|---------------|
| Precomputation | O(log max_exp) | 2-3x | >1000 queries |
| Sliding window | O(2^k) | 10-20% | exp > 10^6 |
| Montgomery | O(1) | 30-50% | mod > 10^100 |

---

### Language-Specific Notes

| Language | Best Practice |
|----------|---------------|
| Python | `pow(base, exp, mod)` - always |
| C++ | `modpow()` with `int64_t` or boost |
| Java | `BigInteger.modPow()` |
| JavaScript | Implement binary, or use BigInt |
| C# | `BigInteger.ModPow()` |

**Critical**: In Python, `pow(base, exp, mod)` is significantly faster than `(base ** exp) % mod`.

<!-- back -->
