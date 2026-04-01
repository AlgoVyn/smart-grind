## Title: Karatsuba Algorithm

What is the Karatsuba algorithm and what problem does it solve?

<!-- front -->

---

### Definition
Divide-and-conquer algorithm for fast integer multiplication. Reduces complexity from O(n²) to O(n^log₂3) ≈ O(n^1.585).

### Core Insight
Instead of 4 multiplications for n-digit numbers, performs only 3 recursive multiplications using:
- z₀ = x₀ × y₀ (low parts)
- z₂ = x₁ × y₁ (high parts)  
- z₁ = (x₀+x₁)(y₀+y₁) - z₀ - z₂ (middle)

### Formula
For X = x₁·B^m + x₀ and Y = y₁·B^m + y₀:
```
XY = z₂·B^(2m) + z₁·B^m + z₀

where:
  z₀ = x₀·y₀
  z₂ = x₁·y₁
  z₁ = (x₀+x₁)(y₀+y₁) - z₀ - z₂
```

---

### Complexity Analysis
| Aspect | Value |
|--------|-------|
| Time | O(n^1.585) |
| Space | O(n) for recursion |
| Base case | Switch to grade-school below ~64 digits |

### Recurrence
```
T(n) = 3T(n/2) + O(n)
     = O(n^log₂3) by Master Theorem
```

---

### Implementation Skeleton
```python
def karatsuba(x, y):
    if x < 10 or y < 10:
        return x * y
    
    n = max(len(str(x)), len(str(y)))
    m = n // 2
    
    x1, x0 = divmod(x, 10**m)
    y1, y0 = divmod(y, 10**m)
    
    z0 = karatsuba(x0, y0)
    z2 = karatsuba(x1, y1)
    z1 = karatsuba(x0+x1, y0+y1) - z0 - z2
    
    return z2 * 10**(2*m) + z1 * 10**m + z0
```

<!-- back -->
