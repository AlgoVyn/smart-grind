## Title: Matrix Exponentiation

What is Matrix Exponentiation and what problems does it solve?

<!-- front -->

---

### Definition
Technique to compute M^n in O(log n) matrix multiplications using binary exponentiation. Used to solve linear recurrences and graph path counting.

### Core Insight
Linear recurrences can be represented as matrix powers:
```
[F(n+1)]   [1 1]   [F(n)  ]
[F(n)  ] = [1 0] * [F(n-1)]

So: [F(n+1)]   [1 1]^n   [F(1)]
    [F(n)  ] = [1 0]   * [F(0)]
```

### Applications
| Problem | Matrix Form |
|---------|-------------|
| Fibonacci | 2×2 matrix |
| Tribonacci | 3×3 matrix |
| Linear recurrences | k×k companion matrix |
| Graph paths | Adjacency matrix |
| DP optimization | State transition matrix |

---

### Matrix Multiplication
```python
def mat_mult(A, B, mod):
    n = len(A)
    m = len(B[0])
    p = len(B)
    
    C = [[0] * m for _ in range(n)]
    for i in range(n):
        for k in range(p):
            if A[i][k]:
                for j in range(m):
                    C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % mod
    return C

def mat_pow(M, n, mod):
    """Binary exponentiation for matrices"""
    if n == 1:
        return M
    
    if n % 2 == 0:
        half = mat_pow(M, n // 2, mod)
        return mat_mult(half, half, mod)
    else:
        return mat_mult(M, mat_pow(M, n - 1, mod), mod)
```

---

### Fibonacci Example
```python
def fib(n, mod=10**9+7):
    if n <= 1:
        return n
    
    M = [[1, 1], [1, 0]]
    M_n = mat_pow(M, n, mod)
    
    # M^n * [F(1), F(0)]^T = [F(n+1), F(n)]^T
    return M_n[0][1]  # F(n)
```

### Complexity
| Operation | Time |
|-----------|------|
| Matrix multiply (n×n) | O(n³) or O(n^ω) with Strassen |
| Matrix exponentiation | O(n³ log k) for power k |
| Fibonacci | O(log n) with 2×2 matrices |

<!-- back -->
