## Title: Karatsuba Framework

What is the standard framework for applying Karatsuba multiplication?

<!-- front -->

---

### Algorithm Structure
```
karatsuba(X, Y, n):
  if n <= threshold: return naive_multiply(X, Y)
  
  split at m = ceil(n/2)
  X = x1·B^m + x0
  Y = y1·B^m + y0
  
  z0 = karatsuba(x0, y0, m)
  z2 = karatsuba(x1, y1, m)
  z1 = karatsuba(x0+x1, y0+y1, m+1) - z0 - z2
  
  return z2·B^2m + z1·B^m + z0
```

---

### Key Components
| Component | Purpose |
|-----------|---------|
| Split | Divide numbers into high/low halves |
| 3 recursive calls | Reduce multiplications from 4 to 3 |
| Middle term | Compute via (x0+x1)(y0+y1) trick |
| Recombine | Shift and add partial results |

---

### Variations
| Variant | Modification |
|---------|--------------|
| Toom-Cook | Split into k parts (Toom-3: 5 mults) |
| FFT-based | Schönhage-Strassen for very large n |
| In-place | Reduce memory overhead |
| Parallel | Recursive calls independent |

### Practical Thresholds
- n < 32-128: Use grade-school O(n²)
- n < 10⁴: Karatsuba
- n > 10⁴: FFT-based algorithms

<!-- back -->
