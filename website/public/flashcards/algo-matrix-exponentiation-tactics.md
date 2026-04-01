## Title: Matrix Exponentiation Tactics

What are the key implementation tactics for matrix exponentiation?

<!-- front -->

---

### Optimization Tactics

| Tactic | Benefit |
|--------|---------|
| Mod after each op | Prevent overflow |
| Sparse matrix optimization | Skip zeros |
| Strassen algorithm | O(n^2.807) for large matrices |
| SIMD vectorization | Hardware acceleration |
| Cache-friendly loops | i-k-j ordering |

### Fast Matrix Multiplication
```python
def mat_mult_fast(A, B, mod):
    """Optimized with cache locality"""
    n = len(A)
    C = [[0] * n for _ in range(n)]
    
    for i in range(n):
        for k in range(n):
            if A[i][k]:  # skip zero
                aik = A[i][k]
                for j in range(n):
                    C[i][j] = (C[i][j] + aik * B[k][j]) % mod
    return C
```

---

### Iterative Binary Exponentiation
```python
def mat_pow_iter(M, n, mod):
    """Iterative version avoids recursion limit"""
    size = len(M)
    # Initialize result as identity
    result = [[1 if i == j else 0 for j in range(size)] 
              for i in range(size)]
    
    base = [row[:] for row in M]
    
    while n > 0:
        if n & 1:
            result = mat_mult(result, base, mod)
        base = mat_mult(base, base, mod)
        n >>= 1
    
    return result
```

---

### Common Pitfalls
| Pitfall | Issue | Fix |
|---------|-------|-----|
| Integer overflow | Huge numbers | Use mod after each operation |
| Wrong identity matrix | Wrong result | 1s on diagonal, 0s elsewhere |
| Order of multiplication | Non-commutative | AB ≠ BA, be consistent |
| Recursion depth | Stack overflow | Use iterative |
| 0^0 ambiguity | Edge case | Define as identity |

### Fibonacci Fast Doubling
```python
def fib_fast_doubling(n, mod):
    """O(log n) without full matrix"""
    if n == 0:
        return (0, 1)
    
    a, b = fib_fast_doubling(n >> 1)
    c = (a * ((b << 1) - a)) % mod
    d = (a * a + b * b) % mod
    
    if n & 1:
        return (d, (c + d) % mod)
    else:
        return (c, d)
```

<!-- back -->
