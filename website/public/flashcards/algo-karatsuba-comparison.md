## Title: Karatsuba Comparison

How does Karatsuba compare to other multiplication algorithms?

<!-- front -->

---

### Algorithm Comparison
| Algorithm | Time | Space | Practical Range |
|-----------|------|-------|-----------------|
| Grade-school | O(n²) | O(1) | n < 64-128 |
| Karatsuba | O(n^1.585) | O(n) | 64 < n < 10⁴ |
| Toom-Cook-k | O(n^1.465) | O(n) | 10³ < n < 10⁵ |
| FFT/NTT | O(n log n) | O(n) | n > 10⁴ |
| Schönhage-Strassen | O(n log n log log n) | O(n) | n > 10⁴ |

---

### Trade-off Analysis
| Factor | Karatsuba Advantage | Limitation |
|--------|---------------------|------------|
| Constants | Low overhead | Beats naive only at n > 64 |
| Simplicity | Easier than FFT | Harder than naive |
| Memory | Minimal extra | More than naive |
| Parallelism | 3 independent calls | Synchronization overhead |

### When to Use Each
```
n < 64:        Grade-school (better cache)
64 < n < 10⁴:  Karatsuba
10⁴ < n:       FFT-based (Schönhage-Strassen)
Crypto:        Montgomery + specialized
```

<!-- back -->
