## Title: Karatsuba Tactics

What are the key implementation tactics and optimizations for Karatsuba?

<!-- front -->

---

### Optimization Strategies

| Tactic | Impact | Implementation |
|--------|--------|----------------|
| Threshold switching | 20-40% faster | Use grade-school for n < 64 |
| In-place computation | -50% memory | Overwrite input arrays |
| Signed arithmetic | Simpler | Allow negative middle terms |
| Bit-aligned splits | Faster | Split at power-of-2 boundaries |

---

### Common Pitfalls
| Issue | Solution |
|-------|----------|
| Integer overflow | Use wider type or arbitrary precision |
| Negative z₁ | Handle signed correctly in recombination |
| Odd-length inputs | Pad or adjust split point |
| Stack overflow | Convert to iterative for deep recursion |

---

### Implementation Tips
```python
# 1. Use threshold
THRESHOLD = 64

# 2. Pre-allocate result arrays
# 3. Use bit shifts instead of * when B=2
# 4. Parallel recursive calls (3 are independent until combine)

# 5. Memory-efficient: compute z0, z2 first,
#    reuse their storage for intermediate
```

### Libraries Using Karatsuba
- GMP (GNU Multiple Precision)
- OpenSSL (BN library)
- Java BigInteger
- Python's long (automatic)

<!-- back -->
