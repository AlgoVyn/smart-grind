## Title: Karatsuba Forms

What are the different forms and representations of Karatsuba multiplication?

<!-- front -->

---

### Standard Form
```
XY = z₂·B^(2m) + z₁·B^m + z₀

z₀ = x₀y₀
z₁ = (x₀+x₁)(y₀+y₁) - z₀ - z₂  
z₂ = x₁y₁
```

### Alternative: Direct Middle
```
z₁ = x₀y₁ + x₁y₀    # requires 4 mults naively

Optimized: z₁ = (x₀+x₁)(y₀+y₁) - x₀y₀ - x₁y₁
```

---

### Polynomial Form
For polynomials A(x), B(x) of degree n:
```
A(x) = A₁·x^m + A₀
B(x) = B₁·x^m + B₀

A·B = A₁B₁·x^(2m) + [(A₀+A₁)(B₀+B₁)-A₀B₀-A₁B₁]·x^m + A₀B₀
```

### Matrix Form (Strassen's base)
```
[ z₀ ]   [ 1  0  0  0 ] [ x₀y₀ ]
[ z₁ ] = [ 0  1 -1 -1 ] [ x₀y₁ ]
[ z₂ ]   [ 0  0  0  1 ] [ x₁y₀ ]
                        [ x₁y₁ ]
```

---

### Representation Comparison
| Form | Use Case | Advantage |
|------|----------|-----------|
| Integer | Big integer libraries | Direct arithmetic |
| Polynomial | FFT prep, NTT | Symbolic manipulation |
| Bit-level | Binary arithmetic | Hardware optimization |
| Modular | Cryptography | Fixed-width operations |

### Implementation Variants
| Variant | Memory | Speed |
|---------|--------|-------|
| Recursive | O(log n) stack | Clean |
| Iterative | O(1) stack | Complex |
| Hybrid | Adaptive | Practical |

<!-- back -->
