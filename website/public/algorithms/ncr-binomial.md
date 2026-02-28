# Binomial Coefficients (nCr)

## Category
Math & Number Theory

## Description

The **binomial coefficient** `C(n, r)` or `nCr` represents the number of ways to choose `r` elements from a set of `n` distinct elements without regard to order. It's read as "n choose r" and is fundamental in combinatorics, probability, and counting problems.

```
C(n, r) = n! / (r! × (n-r)!)
```

The binomial coefficients form **Pascal's Triangle** and appear in the expansion of `(a + b)^n`.

---

## When to Use

Use binomial coefficients when you need to count:

- **Combinations**: Ways to select items where order doesn't matter
- **Paths in Grids**: Number of paths from (0,0) to (m,n) moving only right/up
- **Probability**: Binomial distribution calculations
- **Subsets**: Number of r-element subsets of an n-element set
- **Catalan Numbers**: Related counting problems

### Common Patterns

- **Unique Paths**: Grid traversal problems
- **Team Selection**: Choosing k people from n
- **Coin Change Variations**: Counting ways to make change
- **Probability**: Success/failure scenarios

---

## Algorithm Explanation

### Direct Formula

```
C(n, r) = n! / (r! × (n-r)!)
```

This is straightforward but has issues:
- Factorials grow extremely fast
- Overflow for moderate n (n > 20 in 64-bit integers)

### Optimized Computation

```
C(n, r) = n × (n-1) × ... × (n-r+1) / (r × (r-1) × ... × 1)
```

Compute by iterating and multiplying/dividing step by step to keep numbers small.

### Symmetry Property

```
C(n, r) = C(n, n-r)
```

Always use `r = min(r, n-r)` to minimize iterations.

### Pascal's Identity

```
C(n, r) = C(n-1, r-1) + C(n-1, r)
```

Useful for DP-based computation.

---

## Implementation

### Template Code

````carousel
```python
from math import comb  # Python 3.8+


def nCr(n: int, r: int) -> int:
    """
    Compute binomial coefficient C(n, r) using iterative method.
    
    Time Complexity: O(r)
    Space Complexity: O(1)
    
    Note: May overflow for large n, r. Use modular version for competitive programming.
    """
    if r < 0 or r > n:
        return 0
    
    # Use symmetry: C(n, r) = C(n, n-r)
    r = min(r, n - r)
    
    result = 1
    for i in range(r):
        result = result * (n - i) // (i + 1)
    
    return result


def nCr_mod(n: int, r: int, mod: int) -> int:
    """
    Compute C(n, r) mod 'mod' using modular inverse.
    
    Time Complexity: O(r + log(mod))
    Space Complexity: O(1)
    
    Requires 'mod' to be prime for Fermat's inverse method.
    """
    if r < 0 or r > n:
        return 0
    
    r = min(r, n - r)
    
    numerator = 1
    for i in range(n, n - r, -1):
        numerator = (numerator * i) % mod
    
    denominator = 1
    for i in range(1, r + 1):
        denominator = (denominator * i) % mod
    
    # Modular inverse using Fermat's Little Theorem (mod must be prime)
    def mod_inv(a, m):
        return pow(a, m - 2, m)
    
    return (numerator * mod_inv(denominator, mod)) % mod


# Precompute factorials and inverse factorials for multiple queries
class BinomialCoefficients:
    def __init__(self, max_n: int, mod: int = 10**9 + 7):
        """
        Precompute factorials and inverse factorials up to max_n.
        
        Time: O(max_n)
        Space: O(max_n)
        """
        self.mod = mod
        self.max_n = max_n
        
        self.fact = [1] * (max_n + 1)
        for i in range(1, max_n + 1):
            self.fact[i] = (self.fact[i-1] * i) % mod
        
        self.inv_fact = [1] * (max_n + 1)
        self.inv_fact[max_n] = pow(self.fact[max_n], mod - 2, mod)
        
        for i in range(max_n - 1, -1, -1):
            self.inv_fact[i] = (self.inv_fact[i + 1] * (i + 1)) % mod
    
    def nCr(self, n: int, r: int) -> int:
        """Compute C(n, r) mod 'mod' in O(1)."""
        if r < 0 or r > n or n > self.max_n:
            return 0
        return (self.fact[n] * self.inv_fact[r] % self.mod * 
                self.inv_fact[n - r]) % self.mod


# Pascal's Triangle DP approach
def nCr_pascal(max_n: int) -> list[list[int]]:
    """
    Build Pascal's Triangle up to row max_n.
    
    Time: O(max_n²)
    Space: O(max_n²)
    """
    C = [[0] * (i + 1) for i in range(max_n + 1)]
    
    for i in range(max_n + 1):
        C[i][0] = C[i][i] = 1
        for j in range(1, i):
            C[i][j] = C[i-1][j-1] + C[i-1][j]
    
    return C


# Example usage
if __name__ == "__main__":
    print(f"C(5, 2) = {nCr(5, 2)}")  # 10
    print(f"C(10, 3) = {nCr(10, 3)}")  # 120
    
    # Using precomputation
    bc = BinomialCoefficients(1000)
    print(f"C(100, 50) mod 1e9+7 = {bc.nCr(100, 50)}")
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

/**
 * Compute C(n, r) iteratively
 * Time: O(r), Space: O(1)
 */
long long nCr(int n, int r) {
    if (r < 0 || r > n) return 0;
    
    r = min(r, n - r);
    long long result = 1;
    
    for (int i = 0; i < r; i++) {
        result = result * (n - i) / (i + 1);
    }
    
    return result;
}

/**
 * nCr mod prime using Fermat's Little Theorem
 */
long long power(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = (result * base) % mod;
        base = (base * base) % mod;
        exp >>= 1;
    }
    return result;
}

long long nCrMod(int n, int r, int mod) {
    if (r < 0 || r > n) return 0;
    
    r = min(r, n - r);
    long long numerator = 1, denominator = 1;
    
    for (int i = 0; i < r; i++) {
        numerator = (numerator * (n - i)) % mod;
        denominator = (denominator * (i + 1)) % mod;
    }
    
    return (numerator * power(denominator, mod - 2, mod)) % mod;
}

/**
 * Precomputation class for multiple queries
 */
class BinomialCoefficients {
private:
    vector<long long> fact, invFact;
    int mod;
    
public:
    BinomialCoefficients(int maxN, int m = 1e9 + 7) : mod(m) {
        fact.resize(maxN + 1);
        invFact.resize(maxN + 1);
        
        fact[0] = 1;
        for (int i = 1; i <= maxN; i++) {
            fact[i] = (fact[i-1] * i) % mod;
        }
        
        invFact[maxN] = power(fact[maxN], mod - 2, mod);
        for (int i = maxN - 1; i >= 0; i--) {
            invFact[i] = (invFact[i+1] * (i+1)) % mod;
        }
    }
    
    long long nCr(int n, int r) {
        if (r < 0 || r > n) return 0;
        return fact[n] * invFact[r] % mod * invFact[n-r] % mod;
    }
};
```

<!-- slide -->
```java
public class BinomialCoefficients {
    private long[] fact, invFact;
    private int mod;
    
    public BinomialCoefficients(int maxN, int mod) {
        this.mod = mod;
        fact = new long[maxN + 1];
        invFact = new long[maxN + 1];
        
        fact[0] = 1;
        for (int i = 1; i <= maxN; i++) {
            fact[i] = (fact[i-1] * i) % mod;
        }
        
        invFact[maxN] = power(fact[maxN], mod - 2);
        for (int i = maxN - 1; i >= 0; i--) {
            invFact[i] = (invFact[i+1] * (i+1)) % mod;
        }
    }
    
    private long power(long base, long exp) {
        long result = 1;
        while (exp > 0) {
            if ((exp & 1) == 1) result = (result * base) % mod;
            base = (base * base) % mod;
            exp >>= 1;
        }
        return result;
    }
    
    public long nCr(int n, int r) {
        if (r < 0 || r > n) return 0;
        return fact[n] * invFact[r] % mod * invFact[n-r] % mod;
    }
    
    // Static method for single computation
    public static long computeNCR(int n, int r) {
        if (r < 0 || r > n) return 0;
        r = Math.min(r, n - r);
        long result = 1;
        for (int i = 0; i < r; i++) {
            result = result * (n - i) / (i + 1);
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Compute C(n, r) iteratively
 */
function nCr(n, r) {
    if (r < 0 || r > n) return 0;
    
    r = Math.min(r, n - r);
    let result = 1n;
    
    for (let i = 0; i < r; i++) {
        result = result * BigInt(n - i) / BigInt(i + 1);
    }
    
    return result;
}

/**
 * nCr mod prime
 */
function power(base, exp, mod) {
    let result = 1n;
    base = BigInt(base) % BigInt(mod);
    exp = BigInt(exp);
    mod = BigInt(mod);
    
    while (exp > 0n) {
        if (exp & 1n) result = (result * base) % mod;
        base = (base * base) % mod;
        exp >>= 1n;
    }
    return Number(result);
}

function nCrMod(n, r, mod) {
    if (r < 0 || r > n) return 0;
    
    r = Math.min(r, n - r);
    let numerator = 1, denominator = 1;
    
    for (let i = 0; i < r; i++) {
        numerator = (numerator * (n - i)) % mod;
        denominator = (denominator * (i + 1)) % mod;
    }
    
    return (numerator * power(denominator, mod - 2, mod)) % mod;
}

/**
 * Precomputation class
 */
class BinomialCoefficients {
    constructor(maxN, mod = 1e9 + 7) {
        this.mod = mod;
        this.fact = new Array(maxN + 1);
        this.invFact = new Array(maxN + 1);
        
        this.fact[0] = 1;
        for (let i = 1; i <= maxN; i++) {
            this.fact[i] = (this.fact[i-1] * i) % mod;
        }
        
        this.invFact[maxN] = power(this.fact[maxN], mod - 2, mod);
        for (let i = maxN - 1; i >= 0; i--) {
            this.invFact[i] = (this.invFact[i+1] * (i+1)) % mod;
        }
    }
    
    nCr(n, r) {
        if (r < 0 || r > n) return 0;
        return this.fact[n] * this.invFact[r] % this.mod * 
               this.invFact[n-r] % this.mod;
    }
}
```
````

---

## Important Properties

```
1. C(n, 0) = C(n, n) = 1
2. C(n, r) = C(n, n-r)                    (Symmetry)
3. C(n, r) = C(n-1, r-1) + C(n-1, r)      (Pascal's Identity)
4. Σ C(n, k) for k=0 to n = 2^n           (Sum of row in Pascal's Triangle)
5. Σ C(n, k)² for k=0 to n = C(2n, n)     (Vandermonde's Identity special case)
```

---

## Applications

### 1. Grid Paths

```python
def count_paths(m: int, n: int) -> int:
    """
    Count paths from (0,0) to (m,n) moving only right or up.
    Need exactly m right and n up moves: C(m+n, m)
    """
    return nCr(m + n, m)
```

### 2. Binomial Distribution

```python
def binomial_probability(n: int, k: int, p: float) -> float:
    """P(X = k) where X ~ Binomial(n, p)"""
    return nCr(n, k) * (p ** k) * ((1 - p) ** (n - k))
```

### 3. Stars and Bars

```python
def stars_and_bars(n: int, k: int) -> int:
    """
    Ways to distribute n identical items into k distinct bins.
    C(n+k-1, k-1) or C(n+k-1, n)
    """
    return nCr(n + k - 1, k - 1)
```

---

## Time & Space Complexity

| Approach | Time | Space | Use Case |
|----------|------|-------|----------|
| Iterative | O(r) | O(1) | Single query, small n |
| Precomputation | O(max_n) | O(max_n) | Multiple queries |
| Pascal's Triangle | O(n²) | O(n²) | Need all values |
| Lucas Theorem | O(log_p n) | O(1) | n large, mod small prime |

---

## Practice Problems

### Problem 1: Unique Paths
**Problem**: [LeetCode 62 - Unique Paths](https://leetcode.com/problems/unique-paths/)

**Solution**: `C(m+n-2, m-1)` or `C(m+n-2, n-1)`

### Problem 2: Number of Ways to Build Sturdy Brick Wall
**Problem**: [LeetCode 2183 - Count Array Pairs Divisible by K](https://leetcode.com/problems/count-array-pairs-divisible-by-k/)

**Solution**: Use combinatorics and modular arithmetic.

### Problem 3: Number of Ways to Form a Target String
**Problem**: [LeetCode 1639 - Number of Ways to Form a Target String](https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary/)

**Solution**: DP with combinatorics.

---

## Follow-up Questions

### Q1: What if n is very large (n > 10^9) and mod is small?

**Answer**: Use **Lucas Theorem**. It states that for prime p:
```
C(n, r) mod p = Π C(n_i, r_i) mod p
```
where `n_i` and `r_i` are digits of n and r in base p.

### Q2: How to handle non-prime moduli?

**Answer**: Factor the modulus and use Chinese Remainder Theorem, or compute using prime factorization of the factorial terms.

### Q3: What's the maximum n for 64-bit integers?

**Answer**: `C(66, 33)` ≈ 7.2 × 10^18 is the largest that fits in unsigned 64-bit. For signed 64-bit, `C(60, 30)` is safe.

### Q4: When should I precompute vs compute on the fly?

**Answer**: Precompute when:
- You have multiple queries (Q > max_n)
- n is bounded by a reasonable value (n ≤ 10^6 or 10^7)

Compute on the fly when:
- Single or few queries
- n is very large but r is small

---

## Summary

Binomial coefficients are essential for counting problems. Key strategies:

1. **Use symmetry**: `C(n, r) = C(n, n-r)`
2. **Precompute for many queries**: Factorials + inverse factorials
3. **Use modular arithmetic** for large numbers
4. **Consider Lucas Theorem** for very large n with small prime modulus

---

## Related Algorithms

- [Catalan Numbers](./catalan-numbers.md) - Special case of binomial coefficients
- [Modular Inverse](./modular-inverse.md) - Essential for modular computation
- [Pascal's Triangle](./pascals-triangle.md) - Structure of binomial coefficients