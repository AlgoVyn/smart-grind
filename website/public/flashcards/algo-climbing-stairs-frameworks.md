## Climbing Stairs: Algorithm Framework

What are the complete implementations for solving climbing stairs with different approaches?

<!-- front -->

---

### Standard DP (Tabulation)

```python
def climb_stairs(n: int) -> int:
    """
    Time: O(n), Space: O(n)
    Bottom-up dynamic programming
    """
    if n <= 1:
        return 1
    
    dp = [0] * (n + 1)
    dp[0] = 1  # Ground
    dp[1] = 1  # First step
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]
```

---

### Space-Optimized DP

```python
def climb_stairs_optimized(n: int) -> int:
    """
    Time: O(n), Space: O(1)
    Only need last two values
    """
    if n <= 1:
        return 1
    
    prev2, prev1 = 1, 1  # dp[i-2], dp[i-1]
    
    for _ in range(2, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1
```

---

### Memoization (Top-Down)

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def climb_stairs_memo(n: int) -> int:
    """
    Time: O(n), Space: O(n)
    Recursive with memoization
    """
    if n <= 1:
        return 1
    return climb_stairs_memo(n-1) + climb_stairs_memo(n-2)

# Manual memoization version
def climb_stairs_manual(n: int) -> int:
    memo = {0: 1, 1: 1}
    
    def helper(k):
        if k in memo:
            return memo[k]
        memo[k] = helper(k-1) + helper(k-2)
        return memo[k]
    
    return helper(n)
```

---

### Matrix Exponentiation (O(log n))

```python
def climb_stairs_matrix(n: int) -> int:
    """
    Time: O(log n), Space: O(1)
    For very large n (n > 10^6)
    """
    if n <= 1:
        return 1
    
    def matrix_mult(A, B):
        """Multiply two 2x2 matrices"""
        return [
            [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
            [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]
        ]
    
    def matrix_pow(M, power):
        """Binary exponentiation"""
        if power == 1:
            return M
        if power % 2 == 0:
            half = matrix_pow(M, power // 2)
            return matrix_mult(half, half)
        else:
            return matrix_mult(M, matrix_pow(M, power - 1))
    
    # Transformation matrix for Fibonacci
    M = [[1, 1], [1, 0]]
    result = matrix_pow(M, n)
    
    # result[0][0] = F(n+1), but we want F(n+1) for our indexing
    return result[0][0]
```

---

### Modular Version (For Large Results)

```python
def climb_stairs_mod(n: int, mod: int = 10**9 + 7) -> int:
    """
    Return answer modulo mod (common in competitions)
    """
    if n <= 1:
        return 1
    
    prev2, prev1 = 1, 1
    
    for _ in range(2, n + 1):
        current = (prev1 + prev2) % mod
        prev2 = prev1
        prev1 = current
    
    return prev1
```

<!-- back -->
