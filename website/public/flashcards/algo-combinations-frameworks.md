## Combinations (nCr): Algorithm Framework

What are the complete implementations for computing combinations?

<!-- front -->

---

### Direct Multiplicative Formula

```python
def nCr(n: int, r: int) -> int:
    """
    Compute C(n,r) = n!/(r!(n-r)!)
    Time: O(r), Space: O(1)
    """
    if r < 0 or r > n:
        return 0
    if r == 0 or r == n:
        return 1
    
    # Use symmetry: C(n,r) = C(n, n-r), choose smaller
    r = min(r, n - r)
    
    result = 1
    for i in range(r):
        result = result * (n - i) // (i + 1)
    
    return result
```

**Key optimization:** Divide at each step to keep numbers small.

---

### Pascal's Triangle (DP Table)

```python
def nCr_pascal(n: int, r: int) -> int:
    """
    Build Pascal's triangle up to n
    Time: O(n²), Space: O(n²) or O(n) optimized
    """
    if r < 0 or r > n:
        return 0
    
    # dp[i][j] = C(i, j)
    dp = [[0] * (i + 1) for i in range(n + 1)]
    
    for i in range(n + 1):
        dp[i][0] = dp[i][i] = 1
        for j in range(1, i):
            dp[i][j] = dp[i-1][j-1] + dp[i-1][j]
    
    return dp[n][r]

# Space optimized version
def nCr_pascal_opt(n: int, r: int) -> int:
    r = min(r, n - r)
    dp = [0] * (r + 1)
    dp[0] = 1
    
    for i in range(1, n + 1):
        # Update backwards to use previous row values
        for j in range(min(i, r), 0, -1):
            dp[j] = dp[j] + dp[j-1]
    
    return dp[r]
```

---

### Precomputed Factorials (Modulo Prime)

```python
class BinomialCoefficients:
    """Fast nCr modulo prime with O(n) preprocessing"""
    
    def __init__(self, n_max: int, mod: int = 10**9 + 7):
        self.mod = mod
        self.fact = [1] * (n_max + 1)
        self.inv_fact = [1] * (n_max + 1)
        
        # Compute factorials
        for i in range(2, n_max + 1):
            self.fact[i] = self.fact[i-1] * i % mod
        
        # Compute inverse factorials using Fermat's little theorem
        self.inv_fact[n_max] = pow(self.fact[n_max], mod - 2, mod)
        for i in range(n_max - 1, -1, -1):
            self.inv_fact[i] = self.inv_fact[i + 1] * (i + 1) % mod
    
    def nCr(self, n: int, r: int) -> int:
        if r < 0 or r > n:
            return 0
        return self.fact[n] * self.inv_fact[r] % self.mod * self.inv_fact[n-r] % self.mod
```

---

### Lucas Theorem (Large n, Small Prime)

```python
def nCr_lucas(n: int, r: int, p: int) -> int:
    """
    Compute C(n,r) mod p where p is prime
    Works when n is large (up to 10^18)
    """
    def nCr_small(n, r, p):
        """Standard nCr mod p for small n < p"""
        if r < 0 or r > n:
            return 0
        r = min(r, n - r)
        num = den = 1
        for i in range(r):
            num = num * (n - i) % p
            den = den * (i + 1) % p
        return num * pow(den, p - 2, p) % p
    
    result = 1
    while n > 0 or r > 0:
        ni = n % p
        ri = r % p
        if ri > ni:
            return 0
        result = result * nCr_small(ni, ri, p) % p
        n //= p
        r //= p
    
    return result
```

---

### All Subsets of Size r (Generator)

```python
def combinations_iterative(elements, r):
    """
    Generate all r-sized combinations from elements
    Non-recursive backtracking
    """
    n = len(elements)
    if r > n:
        return
    
    # Start with first r indices
    indices = list(range(r))
    
    while True:
        yield [elements[i] for i in indices]
        
        # Find rightmost index to increment
        for i in reversed(range(r)):
            if indices[i] != i + n - r:
                break
        else:
            return  # All combinations generated
        
        indices[i] += 1
        for j in range(i + 1, r):
            indices[j] = indices[j-1] + 1
```

<!-- back -->
