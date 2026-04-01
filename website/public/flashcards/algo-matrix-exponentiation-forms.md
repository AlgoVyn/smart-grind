## Title: Matrix Exponentiation Forms

What are the different forms and applications of matrix exponentiation?

<!-- front -->

---

### Recurrence Forms
| Recurrence Type | Matrix Size | Notes |
|-----------------|-------------|-------|
| Linear homogeneous | k×k | Standard companion matrix |
| Linear non-homogeneous | (k+1)×(k+1) | Augment for constant term |
| Multiple sequences | Combined | Block diagonal or dense |

### Non-Homogeneous Example
```python
def non_homogeneous_fib(n, mod):
    """F(n) = F(n-1) + F(n-2) + c"""
    # Augment matrix to track constant
    # [F(n)  ]   [1 1 c]   [F(n-1)]
    # [F(n-1)] = [1 0 0] * [F(n-2)]
    # [1     ]   [0 0 1]   [1     ]
    
    T = [[1, 1, 1],  # assuming c=1
         [1, 0, 0],
         [0, 0, 1]]
    
    if n <= 1:
        return n
    
    T_n = mat_pow(T, n, mod)
    # T_n * [F(1), F(0), 1]^T
    return (T_n[0][0] + T_n[0][2]) % mod  # simplified
```

---

### DP Optimization with Matrix Expo
```python
# Standard DP: dp[i] depends on dp[i-k..i-1]
# O(n*k) time

# Matrix expo: O(k³ log n) time
# Better when n is huge (10^18) and k is small (10-50)

def dp_matrix_expo(transition, base, n, k):
    """
    transition: k×k matrix
    base: k vector (dp[0..k-1])
    n: target index
    """
    if n < k:
        return base[n]
    
    T_n = mat_pow(transition, n - k + 1)
    result = [0] * k
    for i in range(k):
        for j in range(k):
            result[i] += T_n[i][j] * base[k-1-j]
    
    return result[0]
```

---

### Advanced Forms
| Application | Matrix Type |
|-------------|-------------|
| Counting tilings | Transfer matrix |
| Markov chains | Transition probability |
| Graph properties | Adjacency variants |
| String automata | State machine transition |
| Fast doubling | Specialized for Fibonacci |

<!-- back -->
