## Title: Matrix Exponentiation Framework

What is the standard framework for matrix exponentiation?

<!-- front -->

---

### Framework
```
MATRIX_EXPONENTIATION(recurrence, n):
  
  // Step 1: Build transition matrix T
  // For F(n) = a1*F(n-1) + a2*F(n-2) + ... + ak*F(n-k)
  // T is k×k companion matrix:
  
  T = [[a1, a2, ..., ak],
       [1,  0,  ...,  0 ],
       [0,  1,  ...,  0 ],
       ...
       [0,  0,  ...,  0 ]]
  
  // Step 2: Compute T^(n-k)
  T_n = mat_pow(T, n-k+1)
  
  // Step 3: Multiply by base cases
  base = [F(k-1), F(k-2), ..., F(0)]^T
  result = mat_mult(T_n, base)
  
  return result[0]  // F(n)
```

---

### Common Transition Matrices
| Recurrence | Matrix |
|------------|--------|
| F(n)=F(n-1)+F(n-2) | [[1,1],[1,0]] |
| F(n)=2F(n-1)+3F(n-2) | [[2,3],[1,0]] |
| F(n)=F(n-1)+F(n-2)+F(n-3) | [[1,1,1],[1,0,0],[0,1,0]] |

### Graph Applications
```python
def count_paths(adj, k, start, end, mod):
    """Count walks of length k from start to end"""
    n = len(adj)
    adj_k = mat_pow(adj, k, mod)
    return adj_k[start][end]

def count_paths_at_most(adj, k, start, end, mod):
    """Count walks of length <= k"""
    # Augment matrix to count cumulative
    n = len(adj)
    # Build (n+1)×(n+1) matrix with cumulative sum
    # ... or use repeated squaring with accumulation
```

---

### Min-Plus Matrix (Shortest Paths)
```python
def min_plus_mat_mult(A, B):
    """For shortest paths with exactly k edges"""
    n = len(A)
    C = [[float('inf')] * n for _ in range(n)]
    for i in range(n):
        for k in range(n):
            for j in range(n):
                C[i][j] = min(C[i][j], A[i][k] + B[k][j])
    return C
```

<!-- back -->
