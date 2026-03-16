## Binomial Coefficients (nCr)

**Question:** Calculate nCr (n choose r) efficiently?

<!-- front -->

---

## Answer: Pascal's Triangle DP

### Solution: Pascal's Triangle
```python
def nCr(n, r):
    if r > n:
        return 0
    r = min(r, n - r)  # Optimization
    
    # Using 1D DP
    dp = [1] * (r + 1)
    
    for i in range(1, n + 1):
        for j in range(min(i, r), 0, -1):
            dp[j] = dp[j] + dp[j - 1]
    
    return dp[r]
```

### Solution: Factorial with Modular
```python
def nCr_mod(n, r, mod):
    # Need factorial and inverse factorial
    fact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i % mod
    
    # Modular inverse using Fermat's little theorem
    def mod_pow(a, e, m):
        res = 1
        while e:
            if e & 1:
                res = res * a % m
            a = a * a % m
            e >>= 1
        return res
    
    inv_fact = [1] * (n + 1)
    inv_fact[n] = mod_pow(fact[n], mod - 2, mod)
    for i in range(n, 0, -1):
        inv_fact[i - 1] = inv_fact[i] * i % mod
    
    return fact[n] * inv_fact[r] % mod * inv_fact[n - r] % mod
```

### Visual: Pascal's Triangle
```
Row 0:     1
Row 1:    1 1
Row 2:   1 2 1
Row 3:  1 3 3 1
Row 4: 1 4 6 4 1

nCr = sum of relevant path values

C(4,2) = 6
```

### ⚠️ Tricky Parts

#### 1. Why r = min(r, n-r)?
```python
# nCr = nC(n-r)
# Use smaller value for efficiency
# C(100, 98) = C(100, 2)
```

#### 2. 1D DP Works Because
```python
# Each cell = cell above + cell to left
# dp[j] = dp[j] + dp[j-1]
# Must iterate backwards to not overwrite needed values
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| 1D DP | O(n×r) | O(r) |
| Factorial | O(n + log MOD) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Overflow | Use mod for large n |
| Wrong iteration | Go backwards in DP |
| r > n | Return 0 |

<!-- back -->
