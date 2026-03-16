## Karatsuba Multiplication

**Question:** Multiply large numbers faster than O(n²)?

<!-- front -->

---

## Answer: Divide into Three Parts

### Algorithm
```python
def karatsuba(x, y):
    # Base case
    if len(str(x)) <= 1 or len(str(y)) <= 1:
        return x * y
    
    # Find max length
    n = max(len(str(x)), len(str(y)))
    m = n // 2
    
    # Split numbers
    a = x // (10 ** m)
    b = x % (10 ** m)
    c = y // (10 ** m)
    d = y % (10 ** m)
    
    # Compute three products
    ac = karatsuba(a, c)
    bd = karatsuba(b, d)
    ad_bc = karatsuba(a + b, c + d) - ac - bd
    
    # Combine: ac × 10^(2m) + (ad_bc) × 10^m + bd
    return ac * (10 ** (2 * m)) + ad_bc * (10 ** m) + bd
```

### Visual: Split
```
x = 1234, y = 5678, m = 2

a = 12, b = 34
c = 56, d = 78

Products:
- ac = 12 × 56 = 672
- bd = 34 × 78 = 2652
- (a+b)(c+d) = 46 × 134 = 6164
- ad_bc = 6164 - 672 - 2652 = 2840

Result = 672×10⁴ + 2840×10² + 2652
       = 6720000 + 284000 + 2652
       = 7006652 ✓
```

### ⚠️ Tricky Parts

#### 1. The Three Products Trick
```python
# Naive: (a×10^m + b) × (c×10^m + d)
#       = ac×10^(2m) + (ad+bd)×10^m + bd
#       = 4 multiplications!

# Karatsuba:
# ad + bc = (a+b)(c+d) - ac - bd
# Only 3 multiplications!
```

#### 2. When to Stop
```python
# Below certain threshold, use schoolbook
# Overhead of recursion not worth it for small numbers

# Typically: threshold around 10-50 digits
```

### Time Complexity

| Method | Complexity |
|--------|------------|
| Schoolbook | O(n²) |
| Karatsuba | O(n^log₂3) ≈ O(n^1.585) |
| Toom-Cook | O(n^1.58) |
| FFT | O(n log n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong split point | Use n // 2 |
| Negative intermediate | Ensure (a+b)(c+d) ≥ ac + bd |
| Base case too small | Set minimum threshold |

<!-- back -->
