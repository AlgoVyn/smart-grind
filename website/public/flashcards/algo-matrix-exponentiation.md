## Matrix Exponentiation

**Question:** Compute nth term of linear recurrence in O(log n)?

<!-- front -->

---

## Answer: Convert Recurrence to Matrix Power

### Fibonacci Example
```
F(n) = F(n-1) + F(n-2)

Matrix form:
[ F(n)   ]   [ 1  1 ] ^ (n-1)   [ F(2) ]
[ F(n-1) ] = [ 1  0 ]         × [ F(1) ]
```

### Solution
```python
def matrix_mult(A, B):
    rows_A, cols_A = len(A), len(A[0])
    rows_B, cols_B = len(B), len(B[0])
    
    result = [[0] * cols_B for _ in range(rows_A)]
    
    for i in range(rows_A):
        for j in range(cols_B):
            for k in range(cols_A):
                result[i][j] += A[i][k] * B[k][j]
    
    return result

def matrix_power(M, n):
    # Identity matrix
    result = [[1 if i == j else 0 for j in range(len(M))] 
              for i in range(len(M))]
    
    base = M
    
    while n > 0:
        if n % 2 == 1:
            result = matrix_mult(result, base)
        base = matrix_mult(base, base)
        n //= 2
    
    return result

def fibonacci(n):
    if n <= 1:
        return n
    
    base = [[1, 1], [1, 0]]
    power = matrix_power(base, n - 1)
    
    return power[0][0]  # F(n)
```

### Visual: Matrix Power
```
base^n = base × base × ... × base (n times)

Binary exponentiation:
- 13 = 1101 (binary)
- base^13 = base^8 × base^4 × base^1

Each step squares the matrix
```

### ⚠️ Tricky Parts

#### 1. Setting Up Matrix
```python
# For F(n) = F(n-1) + F(n-2):
# [F(n), F(n-1)]^T = [[1,1],[1,0]] × [F(n-1), F(n-2)]^T

# General: create matrix where:
# - First row has coefficients
# - Rest is identity shifted
```

#### 2. Initial Vector Position
```python
# For F(n) where n >= 2:
# Need F(2) and F(1) in initial vector

# Result is first row of (M^(n-1) × init_vector)
```

### Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Matrix multiply | O(k³) | O(k²) |
| Matrix power | O(k³ log n) | O(k²) |

k = matrix dimension (usually small, like 2-3)

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong matrix setup | Check first row coefficients |
| Wrong power | Use n-1, not n |
| Wrong initial vector | Use F(2), F(1) for Fibonacci |

<!-- back -->
