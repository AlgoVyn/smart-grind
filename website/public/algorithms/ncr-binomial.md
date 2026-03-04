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

### Comparison with Computation Methods

| Method | Precompute Time | Query Time | Space | Use Case |
|--------|----------------|------------|-------|----------|
| **Iterative** | O(r) | O(r) | O(1) | Single query, small r |
| **Precomputed Factorials** | O(max_n) | O(1) | O(max_n) | Multiple queries |
| **Pascal's Triangle** | O(n²) | O(1) | O(n²) | Need all nCr values |
| **Lucas Theorem** | O(p) | O(log_p n) | O(p) | Large n, small prime mod |

### When to Choose Each Method

- **Choose Iterative** when:
  - You have a single query or few queries
  - `r` is small (r ≤ 1000)
  - Memory is limited

- **Choose Precomputed Factorials** when:
  - You have many queries (Q > max_n)
  - `n` is bounded by a reasonable value (n ≤ 10^6)
  - Need O(1) query time

- **Choose Pascal's Triangle** when:
  - You need all binomial coefficients up to n
  - Space is not a constraint
  - Building DP table for related problems

- **Choose Lucas Theorem** when:
  - `n` is very large (n > 10^9)
  - Working modulo a small prime
  - Standard methods overflow

---

## Algorithm Explanation

### Core Concept

The key insight behind binomial coefficient computation is that we can calculate `C(n, r)` without computing full factorials, which would cause overflow. Instead, we use:

1. **Symmetry Property**: `C(n, r) = C(n, n-r)` - Always work with the smaller value
2. **Iterative Multiplication**: Build the result step by step to keep numbers small
3. **Modular Arithmetic**: Use modular inverses for large numbers under modulo

### How It Works

#### Direct Formula:
```
C(n, r) = n! / (r! × (n-r)!)
```

This is mathematically correct but has issues:
- Factorials grow extremely fast
- Overflow for moderate n (n > 20 in 64-bit integers)

#### Optimized Computation:
```
C(n, r) = n × (n-1) × ... × (n-r+1) / (r × (r-1) × ... × 1)
```

Compute by iterating and multiplying/dividing step by step to keep numbers small.

#### Pascal's Identity:
```
C(n, r) = C(n-1, r-1) + C(n-1, r)
```

Useful for DP-based computation and building Pascal's Triangle.

### Visual Representation

Pascal's Triangle showing binomial coefficients:

```
n=0:        1
n=1:      1   1
n=2:    1   2   1
n=3:  1   3   3   1
n=4: 1   4   6   4   1
```

Each number is the sum of the two numbers above it (Pascal's Identity).

### Limitations

- **Overflow**: Standard 64-bit integers can only hold `C(66, 33)` ≈ 7.2 × 10^18
- **Computational limits**: Direct factorial computation fails for n > 20
- **Modular constraints**: Fermat's Little Theorem requires prime modulus

---

## Algorithm Steps

### Iterative Computation (Single Query)

1. **Handle edge cases**: Return 0 if r < 0 or r > n
2. **Apply symmetry**: Set `r = min(r, n - r)` to minimize iterations
3. **Initialize result**: `result = 1`
4. **Iterate**: For `i` from 0 to `r-1`:
   - Multiply: `result = result * (n - i)`
   - Divide: `result = result // (i + 1)`
5. **Return result**

### Precomputation Method (Multiple Queries)

1. **Precompute factorials**: `fact[i] = fact[i-1] * i % mod` for i from 1 to max_n
2. **Precompute inverse factorials**: `inv_fact[max_n] = pow(fact[max_n], mod-2, mod)`
3. **Fill inverse factorials backwards**: `inv_fact[i] = inv_fact[i+1] * (i+1) % mod`
4. **Query**: Return `fact[n] * inv_fact[r] % mod * inv_fact[n-r] % mod`

### Pascal's Triangle Construction

1. **Initialize triangle**: Create 2D array where `C[i][0] = C[i][i] = 1`
2. **Fill using identity**: For each `i` from 2 to n, and `j` from 1 to i-1:
   - `C[i][j] = C[i-1][j-1] + C[i-1][j]`
3. **Result**: `C[n][r]` contains the answer

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

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Iterative nCr** | O(r) | Where r = min(r, n-r), single query |
| **Precomputation (build)** | O(max_n) | Build factorial tables once |
| **Precomputation (query)** | O(1) | Constant time lookup |
| **Pascal's Triangle** | O(n²) | Build entire triangle up to n |
| **Lucas Theorem** | O(log_p n) | For large n with small prime p |

### Detailed Breakdown

- **Iterative computation**: Multiply r terms, each O(1)
  - Total: O(r) = O(min(r, n-r)) due to symmetry
  
- **Precomputation method**:
  - Build factorials: O(max_n) multiplications
  - Build inverse factorials: O(max_n) using Fermat's Little Theorem
  - Each query: O(1) - just 3 array lookups and 2 multiplications
  
- **Pascal's Triangle**: Fill n rows, each with up to n elements
  - Total: O(n²) time and space

---

## Space Complexity Analysis

| Method | Space | Description |
|--------|-------|-------------|
| **Iterative** | O(1) | Only stores result and loop variables |
| **Precomputation** | O(max_n) | Two arrays: fact[] and inv_fact[] |
| **Pascal's Triangle** | O(n²) | Full 2D triangle storage |
| **Lucas Theorem** | O(p) | Precompute factorials up to prime p |

### Space Optimization

For memory-constrained environments:
1. **Iterative**: Always O(1) space - preferred for single queries
2. **Pascal's Triangle**: Can reduce to O(n) by keeping only previous row
3. **Modular**: Use int instead of long long if mod < 2^31

---

## Common Variations

### 1. Lucas Theorem (Large n, Small Mod)

When n is very large (n > 10^9) and mod is a small prime:

````carousel
```python
def lucas_theorem(n, r, p):
    """
    Compute C(n, r) mod p using Lucas Theorem.
    
    Lucas Theorem: C(n, r) mod p = Π C(n_i, r_i) mod p
    where n_i, r_i are digits of n, r in base p.
    
    Time: O(p + log_p(n))
    Space: O(p)
    """
    # Precompute factorials and inverse factorials up to p-1
    fact = [1] * p
    for i in range(1, p):
        fact[i] = (fact[i-1] * i) % p
    
    def mod_inv(a, m):
        return pow(a, m - 2, m)
    
    inv_fact = [1] * p
    inv_fact[p-1] = mod_inv(fact[p-1], p)
    for i in range(p-2, -1, -1):
        inv_fact[i] = (inv_fact[i+1] * (i+1)) % p
    
    def nCr_small(n, r):
        """Compute C(n, r) mod p where 0 <= n, r < p"""
        if r < 0 or r > n:
            return 0
        return fact[n] * inv_fact[r] % p * inv_fact[n-r] % p
    
    result = 1
    while n > 0 or r > 0:
        ni = n % p
        ri = r % p
        result = (result * nCr_small(ni, ri)) % p
        n //= p
        r //= p
    
    return result
```
````

### 2. nCr with Non-Prime Modulus

When modulus is not prime, use prime factorization or Chinese Remainder Theorem:

````carousel
```python
def nCr_non_prime_mod(n, r, mod):
    """
    Compute C(n, r) mod mod where mod may not be prime.
    Uses prime factorization approach.
    
    Time: O(n * log(n))
    Space: O(n)
    """
    def prime_factors(x):
        """Return prime factorization as {prime: count}"""
        factors = {}
        d = 2
        while d * d <= x:
            while x % d == 0:
                factors[d] = factors.get(d, 0) + 1
                x //= d
            d += 1
        if x > 1:
            factors[x] = factors.get(x, 0) + 1
        return factors
    
    def count_prime_in_factorial(p, n):
        """Count power of prime p in n!"""
        count = 0
        power = p
        while power <= n:
            count += n // power
            power *= p
        return count
    
    # Get prime factorization of mod
    mod_factors = prime_factors(mod)
    
    # Use CRT: compute C(n,r) mod p^k for each prime power
    # Then combine results
    # (Full implementation would include CRT combination)
    
    # Simplified: compute directly if mod is small
    result = 1
    for i in range(r):
        result = (result * (n - i)) % mod
    
    for i in range(1, r + 1):
        # Compute modular inverse using extended Euclidean
        def extended_gcd(a, b):
            if b == 0:
                return (a, 1, 0)
            g, x, y = extended_gcd(b, a % b)
            return (g, y, x - (a // b) * y)
        
        def mod_inv(a, m):
            g, x, _ = extended_gcd(a % m, m)
            if g != 1:
                return None  # No inverse exists
            return (x % m + m) % m
        
        inv = mod_inv(i, mod)
        if inv is None:
            # Handle case where i and mod are not coprime
            # Requires more complex handling
            return None
        result = (result * inv) % mod
    
    return result
```
````

### 3. Catalan Numbers (Special Case)

Catalan numbers are a special case of binomial coefficients:

````carousel
```python
def catalan_number(n):
    """
    Compute nth Catalan number using binomial coefficient.
    
    Catalan(n) = C(2n, n) / (n + 1)
    
    Time: O(n)
    Space: O(1)
    """
    # C(2n, n) / (n + 1)
    return nCr(2 * n, n) // (n + 1)


def catalan_number_mod(n, mod):
    """
    Compute nth Catalan number modulo prime.
    
    Time: O(n + log(mod))
    Space: O(1)
    """
    # Catalan(n) = C(2n, n) * inv(n+1) mod mod
    numerator = 1
    for i in range(n):
        numerator = (numerator * (2 * n - i)) % mod
    
    denominator = 1
    for i in range(1, n + 1):
        denominator = (denominator * i) % mod
    denominator = (denominator * (n + 1)) % mod
    
    return (numerator * pow(denominator, mod - 2, mod)) % mod
```
````

---

## Practice Problems

### Problem 1: Unique Paths

**Problem:** [LeetCode 62 - Unique Paths](https://leetcode.com/problems/unique-paths/)

**Description:** There is a robot on an `m x n` grid. The robot is initially located at the top-left corner (i.e., `grid[0][0]`). The robot tries to move to the bottom-right corner (i.e., `grid[m-1][n-1]`). The robot can only move either down or right at any point in time. Given the two integers `m` and `n`, return the number of possible unique paths.

**How to Apply Binomial Coefficients:**
- To reach from (0,0) to (m-1,n-1), need exactly (m-1) down moves and (n-1) right moves
- Total moves = (m-1) + (n-1) = m + n - 2
- Answer: `C(m+n-2, m-1)` or equivalently `C(m+n-2, n-1)`

---

### Problem 2: Unique Paths II

**Problem:** [LeetCode 63 - Unique Paths II](https://leetcode.com/problems/unique-paths-ii/)

**Description:** You are given an `m x n` integer array `grid`. There is a robot initially located at the top-left corner. The robot tries to move to the bottom-right corner. The robot can only move either down or right at any point in time. An obstacle and space are marked as `1` or `0` respectively in `grid`. A path that the robot takes cannot include any square that is an obstacle. Return the number of possible unique paths.

**How to Apply Binomial Coefficients:**
- Standard combinatorics won't work due to obstacles
- Use DP with binomial coefficient insights for optimization
- Alternative: Use inclusion-exclusion principle with combinatorics

---

### Problem 3: Number of Ways to Form a Target String

**Problem:** [LeetCode 1639 - Number of Ways to Form a Target String Given a Dictionary](https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-database/)

**Description:** You are given a list of strings of the same length `words` and a string `target`. Your task is to form `target` using the given `words` under the following rules:
- `target` should be formed from left to right
- To form the `i`th character (0-indexed) of `target`, you can choose the `k`th character of the `j`th string in `words` if `target[i] = words[j][k]`
- Once you use the `k`th character of the `j`th string of `words`, you can no longer use the `x`th character of any string in `words` where `x <= k`

**How to Apply Binomial Coefficients:**
- Count occurrences of each character at each position
- Use DP with combinatorics to count ways to choose positions
- Precompute factorials for combination calculations

---

### Problem 4: Number of Ways to Reorder Array to Get Same BST

**Problem:** [LeetCode 1569 - Number of Ways to Reorder Array to Get Same BST](https://leetcode.com/problems/number-of-ways-to-reorder-array-to-get-same-bst/)

**Description:** Given an array `nums` that represents a permutation of integers from `1` to `n`, we are going to construct a binary search tree (BST) by inserting the elements of `nums` in order into an initially empty BST. Return the number of different ways to reorder `nums` so that the constructed BST is identical to that formed from the original array `nums`.

**How to Apply Binomial Coefficients:**
- Use recursive divide and conquer with combinatorics
- For each root, count ways to interleave left and right subtrees: `C(left_size + right_size, left_size)`
- Multiply recursively for all nodes

---

### Problem 5: Count Number of Ways to Place Houses

**Problem:** [LeetCode 2320 - Count Number of Ways to Place Houses](https://leetcode.com/problems/count-number-of-ways-to-place-houses/)

**Description:** There is a street with `n * 2` plots, where there are `n` plots on each side of the street. The plots on each side are numbered from `1` to `n`. On each plot, you can place a house. No two houses can occupy adjacent plots on the same side of the street. Return the total number of ways to place houses such that no two houses are adjacent.

**How to Apply Binomial Coefficients:**
- Equivalent to placing non-attacking kings on a 2 x n board
- Use Fibonacci-like recurrence with combinatorial counting
- Can be solved using binomial coefficients and inclusion-exclusion

---

## Video Tutorial Links

### Fundamentals

- [Binomial Coefficients and Pascal's Triangle (Khan Academy)](https://www.youtube.com/watch?v=9FtHB7VStwo) - Comprehensive introduction to binomial coefficients
- [nCr and nPr Explained (Neso Academy)](https://www.youtube.com/watch?v=4MS14h1VsXI) - Clear explanation of combinations and permutations
- [Binomial Theorem (3Blue1Brown)](https://www.youtube.com/watch?v=9FtHB7VStwo) - Visual intuition behind binomial coefficients

### Competitive Programming

- [Computing nCr mod p (Errichto)](https://www.youtube.com/watch?v=6pO7d55l5S8) - Efficient computation for competitive programming
- [Lucas Theorem (CodeNCode)](https://www.youtube.com/watch?v=KgfA3P2Z1_8) - Handling large n with small prime modulus
- [Precomputing Factorials for nCr (WilliamFiset)](https://www.youtube.com/watch?v=9k4D14t7eUk) - Optimization techniques

### Advanced Topics

- [Catalan Numbers and Binomial Coefficients](https://www.youtube.com/watch?v=qeGhpeB3K5o) - Special applications
- [Combinatorics in Competitive Programming](https://www.youtube.com/watch?v=0C9HkF9Axj4) - Advanced counting problems
- [Modular Inverse and nCr](https://www.youtube.com/watch?v=MHbF1U5q4Po) - Deep dive into modular arithmetic

---

## Follow-up Questions

### Q1: What if n is very large (n > 10^9) and mod is small?

**Answer**: Use **Lucas Theorem**. It states that for prime p:
```
C(n, r) mod p = Π C(n_i, r_i) mod p
```
where `n_i` and `r_i` are digits of n and r in base p.

This reduces the problem to computing nCr for small values (< p) and combining them.

### Q2: How to handle non-prime moduli?

**Answer**: Factor the modulus and use **Chinese Remainder Theorem**, or compute using prime factorization of the factorial terms:

1. Factor the modulus into prime powers
2. Compute nCr mod p^k for each prime power using Lucas theorem generalization
3. Combine results using CRT

Alternative: Direct computation with careful handling of GCD cancellations.

### Q3: What's the maximum n for 64-bit integers?

**Answer**: `C(66, 33)` ≈ 7.2 × 10^18 is the largest that fits in unsigned 64-bit. For signed 64-bit, `C(60, 30)` is safe.

For larger values, you must use:
- Arbitrary precision integers (Python's native big integers)
- Modular arithmetic
- Approximation formulas

### Q4: When should I precompute vs compute on the fly?

**Answer**: Precompute when:
- You have multiple queries (Q > max_n)
- n is bounded by a reasonable value (n ≤ 10^6 or 10^7)
- Query time is critical (need O(1))

Compute on the fly when:
- Single or few queries
- n is very large but r is small
- Memory is limited

### Q5: How do you compute nCr when r > n/2 efficiently?

**Answer**: Use the **symmetry property**: `C(n, r) = C(n, n-r)`

Always set `r = min(r, n - r)` before computing. This:
- Reduces iterations from O(r) to O(min(r, n-r))
- Keeps intermediate values smaller
- Reduces overflow risk

---

## Summary

Binomial coefficients are essential for counting problems. Key strategies:

1. **Use symmetry**: `C(n, r) = C(n, n-r)` - always work with smaller r
2. **Precompute for many queries**: Factorials + inverse factorials for O(1) queries
3. **Use modular arithmetic** for large numbers to prevent overflow
4. **Consider Lucas Theorem** for very large n with small prime modulus
5. **Choose the right method** based on constraints: single vs multiple queries, memory limits, and modulus properties

When to use each approach:
- ✅ **Iterative**: Single query, small r, memory-constrained
- ✅ **Precomputation**: Many queries, bounded n, fast query needed
- ✅ **Lucas Theorem**: Very large n (> 10^9), small prime mod
- ❌ **Direct factorials**: Never use - always causes overflow

---

## Related Algorithms

- [Catalan Numbers](./catalan-numbers.md) - Special case of binomial coefficients
- [Modular Inverse](./modular-inverse.md) - Essential for modular computation
- [Pascal's Triangle](./pascals-triangle.md) - Structure of binomial coefficients
- [Extended Euclidean](./extended-euclidean.md) - For modular inverses with non-prime mod
