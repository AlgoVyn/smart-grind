# Binomial Coefficients (nCr)

## Category
Math & Number Theory

## Description

The **binomial coefficient** `C(n, r)` or `nCr` represents the number of ways to choose `r` elements from a set of `n` distinct elements without regard to order. It's read as "n choose r" and is fundamental in combinatorics, probability, and counting problems. The formula `C(n, r) = n! / (r! × (n-r)!)` forms Pascal's Triangle and appears in the expansion of `(a + b)^n`.

Computing binomial coefficients efficiently is crucial in competitive programming where direct factorial computation causes overflow. The key insight is to use symmetry, iterative multiplication, and modular inverses to compute values without overflow. This pattern appears frequently in counting paths, probability calculations, and subset enumeration problems.

---

## Concepts

The binomial coefficient computation relies on several mathematical concepts.

### 1. Symmetry Property

Always work with the smaller value: `C(n, r) = C(n, n-r)`.

| n | r | C(n, r) | C(n, n-r) | Min Iterations |
|---|-----|---------|-----------|----------------|
| 10 | 3 | 120 | C(10, 7) = 120 | 3 |
| 10 | 7 | 120 | C(10, 3) = 120 | 3 (not 7) |
| 100 | 98 | 4950 | C(100, 2) = 4950 | 2 (not 98) |

### 2. Iterative Computation

Build the result step by step to keep numbers small:

```
C(n, r) = n × (n-1) × ... × (n-r+1) / (r × (r-1) × ... × 1)
```

| Step | Operation | Result |
|------|-----------|--------|
| 1 | 10 / 1 | 10 |
| 2 | 10 × 9 / 2 | 45 |
| 3 | 45 × 8 / 3 | 120 |
| Final | C(10, 3) | 120 |

### 3. Pascal's Identity

```
C(n, r) = C(n-1, r-1) + C(n-1, r)
```

Useful for DP-based computation and building Pascal's Triangle.

### 4. Modular Computation

For large values, compute under modulo using modular inverses:

```
C(n, r) mod m = n! × (r!)^(-1) × ((n-r)!)^(-1) mod m
```

---

## Frameworks

### Framework 1: Single Query Iterative

```
┌─────────────────────────────────────────────────────┐
│  SINGLE QUERY ITERATIVE FRAMEWORK                   │
├─────────────────────────────────────────────────────┤
│  1. Handle edge cases: return 0 if r < 0 or r > n   │
│  2. Apply symmetry: r = min(r, n - r)               │
│  3. Initialize result = 1                           │
│  4. For i from 0 to r-1:                           │
│     - result = result × (n - i)                     │
│     - result = result // (i + 1)                    │
│  5. Return result                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Single query, small r, no modulo needed.

### Framework 2: Precomputation for Multiple Queries

```
┌─────────────────────────────────────────────────────┐
│  PRECOMPUTATION FRAMEWORK                           │
├─────────────────────────────────────────────────────┤
│  Precondition: n bounded, prime modulus           │
│                                                     │
│  1. Precompute factorials: fact[i] = i! mod m     │
│  2. Precompute inverse factorials:                 │
│     inv_fact[n] = fact[n]^(m-2) mod m             │
│     inv_fact[i] = inv_fact[i+1] × (i+1) mod m     │
│  3. Query: C(n,r) = fact[n] × inv_fact[r] ×       │
│     inv_fact[n-r] mod m                           │
└─────────────────────────────────────────────────────┘
```

**When to use**: Multiple queries, bounded n, prime modulus.

### Framework 3: Lucas Theorem (Large n)

```
┌─────────────────────────────────────────────────────┐
│  LUCAS THEOREM FRAMEWORK                            │
├─────────────────────────────────────────────────────┤
│  Precondition: n very large, small prime modulus    │
│                                                     │
│  1. Write n and r in base p: n = n_k...n_0,         │
│     r = r_k...r_0                                   │
│  2. Lucas Theorem: C(n,r) mod p = Π C(n_i, r_i)   │
│  3. Precompute C(n_i, r_i) for 0 ≤ n_i, r_i < p   │
│  4. Multiply all components mod p                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Very large n (n > 10^9), small prime modulus.

---

## Forms

### Form 1: Direct Computation

Compute C(n, r) directly for small values.

| Property | Value |
|----------|-------|
| Time | O(r) where r = min(r, n-r) |
| Space | O(1) |
| Overflow limit | C(66, 33) for 64-bit integers |
| Use case | Single query, small r |

### Form 2: Precomputed Factorials

Precompute for O(1) queries after O(n) preprocessing.

| Property | Value |
|----------|-------|
| Preprocessing | O(n) |
| Per query | O(1) |
| Space | O(n) |
| Requirements | Prime modulus |
| Use case | Multiple queries |

### Form 3: Pascal's Triangle DP

Build full triangle for all nCr values.

| Property | Value |
|----------|-------|
| Time | O(n²) |
| Space | O(n²) or O(n) optimized |
| Use case | Need all values, small n |

### Form 4: Lucas Theorem

For large n with small prime modulus.

| Property | Value |
|----------|-------|
| Time | O(p + log_p(n)) |
| Space | O(p) |
| Requirements | Small prime p |
| Use case | n > 10^9, nCr mod small prime |

### Form 5: Catalan Numbers (Special Case)

Catalan numbers are a special case: `Catalan(n) = C(2n, n) / (n+1)`.

---

## Tactics

### Tactic 1: Symmetry Optimization

```python
def nCr(n: int, r: int) -> int:
    """Compute nCr with symmetry optimization."""
    if r < 0 or r > n:
        return 0
    r = min(r, n - r)  # Use symmetry
    
    result = 1
    for i in range(r):
        result = result * (n - i) // (i + 1)
    return result
```

### Tactic 2: Modular nCr with Precomputation

```python
MOD = 10**9 + 7

def precompute(max_n: int):
    fact = [1] * (max_n + 1)
    for i in range(1, max_n + 1):
        fact[i] = fact[i-1] * i % MOD
    
    inv_fact = [1] * (max_n + 1)
    inv_fact[max_n] = pow(fact[max_n], MOD - 2, MOD)
    for i in range(max_n - 1, -1, -1):
        inv_fact[i] = inv_fact[i + 1] * (i + 1) % MOD
    
    return fact, inv_fact

def nCr_mod(n: int, r: int, fact, inv_fact) -> int:
    if r < 0 or r > n:
        return 0
    return fact[n] * inv_fact[r] % MOD * inv_fact[n-r] % MOD
```

### Tactic 3: Lucas Theorem Implementation

```python
def lucas_theorem(n: int, r: int, p: int) -> int:
    """Compute C(n, r) mod p using Lucas Theorem."""
    # Precompute factorials and inverses up to p-1
    fact = [1] * p
    for i in range(1, p):
        fact[i] = fact[i-1] * i % p
    
    inv_fact = [1] * p
    inv_fact[p-1] = pow(fact[p-1], p - 2, p)
    for i in range(p - 2, -1, -1):
        inv_fact[i] = inv_fact[i + 1] * (i + 1) % p
    
    def nCr_small(n, r):
        if r < 0 or r > n:
            return 0
        return fact[n] * inv_fact[r] % p * inv_fact[n-r] % p
    
    result = 1
    while n > 0 or r > 0:
        ni, ri = n % p, r % p
        result = result * nCr_small(ni, ri) % p
        n //= p
        r //= p
    
    return result
```

### Tactic 4: Catalan Number Computation

```python
def catalan_number(n: int, mod: int = None) -> int:
    """Compute nth Catalan number."""
    # Catalan(n) = C(2n, n) / (n + 1)
    if mod is None:
        from math import comb
        return comb(2 * n, n) // (n + 1)
    else:
        # With modulo - need modular inverse of (n+1)
        inv_n_plus_1 = pow(n + 1, mod - 2, mod)
        # Compute C(2n, n) mod mod using precomputation
        # ... (implementation depends on available fact/inv_fact)
        pass
```

---

## Python Templates

### Template 1: Iterative nCr (No Modulo)

```python
def nCr(n: int, r: int) -> int:
    """
    Compute binomial coefficient C(n, r).
    May overflow for large n (n > 66 for 64-bit).
    
    Time: O(r) where r = min(r, n-r)
    Space: O(1)
    """
    if r < 0 or r > n:
        return 0
    
    # Use symmetry: C(n, r) = C(n, n-r)
    r = min(r, n - r)
    
    result = 1
    for i in range(r):
        result = result * (n - i) // (i + 1)
    
    return result
```

### Template 2: Modular nCr (Single Query)

```python
def nCr_mod(n: int, r: int, mod: int) -> int:
    """
    Compute C(n, r) mod 'mod' using modular inverse.
    Requires 'mod' to be prime for Fermat's inverse method.
    
    Time: O(r + log(mod))
    Space: O(1)
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
    
    # Modular inverse using Fermat's Little Theorem
    return numerator * pow(denominator, mod - 2, mod) % mod
```

### Template 3: Precomputation Class for Multiple Queries

```python
class BinomialCoefficients:
    """
    Precompute factorials and inverse factorials for O(1) nCr queries.
    REQUIRES: mod is prime (common: 10^9 + 7)
    """
    
    def __init__(self, max_n: int, mod: int = 10**9 + 7):
        self.mod = mod
        self.max_n = max_n
        
        # Precompute factorials
        self.fact = [1] * (max_n + 1)
        for i in range(1, max_n + 1):
            self.fact[i] = (self.fact[i - 1] * i) % mod
        
        # Precompute inverse factorials
        self.inv_fact = [1] * (max_n + 1)
        self.inv_fact[max_n] = pow(self.fact[max_n], mod - 2, mod)
        for i in range(max_n - 1, -1, -1):
            self.inv_fact[i] = (self.inv_fact[i + 1] * (i + 1)) % mod
    
    def nCr(self, n: int, r: int) -> int:
        """Compute C(n, r) mod mod in O(1)."""
        if r < 0 or r > n or n > self.max_n:
            return 0
        return (self.fact[n] * self.inv_fact[r] % self.mod * 
                self.inv_fact[n - r]) % self.mod
```

### Template 4: Pascal's Triangle Construction

```python
def build_pascals_triangle(max_n: int) -> list[list[int]]:
    """
    Build Pascal's Triangle up to row max_n.
    C[n][r] gives binomial coefficient.
    
    Time: O(max_n^2)
    Space: O(max_n^2)
    """
    C = [[0] * (i + 1) for i in range(max_n + 1)]
    
    for i in range(max_n + 1):
        C[i][0] = C[i][i] = 1
        for j in range(1, i):
            C[i][j] = C[i-1][j-1] + C[i-1][j]
    
    return C


# Space-optimized version (only previous row)
def nCr_from_pascal(n: int, r: int) -> int:
    """Compute nCr using space-optimized Pascal's Triangle."""
    if r < 0 or r > n:
        return 0
    
    prev = [1]
    for i in range(1, n + 1):
        curr = [1] * (i + 1)
        for j in range(1, i):
            curr[j] = prev[j-1] + prev[j]
        prev = curr
    
    return prev[r]
```

### Template 5: Lucas Theorem (Large n, Small Prime Mod)

```python
def lucas_theorem(n: int, r: int, p: int) -> int:
    """
    Compute C(n, r) mod p using Lucas Theorem.
    For large n (n > 10^9) with small prime p.
    
    Lucas: C(n, r) mod p = Π C(n_i, r_i) mod p
    where n_i, r_i are base-p digits.
    
    Time: O(p + log_p(n))
    Space: O(p)
    """
    # Precompute factorials and inverse factorials up to p-1
    fact = [1] * p
    for i in range(1, p):
        fact[i] = (fact[i-1] * i) % p
    
    inv_fact = [1] * p
    inv_fact[p-1] = pow(fact[p-1], p - 2, p)
    for i in range(p - 2, -1, -1):
        inv_fact[i] = (inv_fact[i+1] * (i+1)) % p
    
    def nCr_small(ni: int, ri: int) -> int:
        """Compute C(ni, ri) mod p where 0 <= ni, ri < p."""
        if ri < 0 or ri > ni:
            return 0
        return fact[ni] * inv_fact[ri] % p * inv_fact[ni-ri] % p
    
    result = 1
    while n > 0 or r > 0:
        ni = n % p
        ri = r % p
        result = (result * nCr_small(ni, ri)) % p
        n //= p
        r //= p
    
    return result
```

### Template 6: Catalan Numbers

```python
def catalan_number(n: int, mod: int = None) -> int:
    """
    Compute nth Catalan number.
    Catalan(n) = C(2n, n) / (n + 1)
    
    Time: O(n) or O(1) with precomputation
    """
    if mod is None:
        # Direct computation
        from math import comb
        return comb(2 * n, n) // (n + 1)
    else:
        # With modulo
        # Need: C(2n, n) * inv(n+1) mod mod
        numerator = 1
        for i in range(n):
            numerator = (numerator * (2 * n - i)) % mod
        
        denominator = 1
        for i in range(1, n + 1):
            denominator = (denominator * i) % mod
        denominator = (denominator * (n + 1)) % mod
        
        return numerator * pow(denominator, mod - 2, mod) % mod


# Using precomputed binomial coefficients
class CatalanNumbers:
    def __init__(self, max_n: int, mod: int = 10**9 + 7):
        self.mod = mod
        self.bc = BinomialCoefficients(2 * max_n, mod)
        self.max_n = max_n
    
    def catalan(self, n: int) -> int:
        """Catalan(n) = C(2n, n) * inv(n+1) mod mod."""
        if n > self.max_n:
            return 0
        c_2n_n = self.bc.nCr(2 * n, n)
        inv_n_plus_1 = pow(n + 1, self.mod - 2, self.mod)
        return c_2n_n * inv_n_plus_1 % self.mod
```

---

## When to Use

Use binomial coefficients when you need to count:
- Combinations (ways to select items where order doesn't matter)
- Paths in grids (from (0,0) to (m,n) moving only right/up)
- Subsets (r-element subsets of n elements)
- Catalan-related problems

### Comparison with Computation Methods

| Method | Precompute Time | Query Time | Space | Use Case |
|--------|----------------|------------|-------|----------|
| Iterative | O(r) | O(r) | O(1) | Single query, small r |
| Precomputed Factorials | O(max_n) | O(1) | O(max_n) | Multiple queries |
| Pascal's Triangle | O(n²) | O(1) | O(n²) | Need all values |
| Lucas Theorem | O(p) | O(log_p n) | O(p) | Large n, small prime mod |

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

### Why It Works

**Symmetry**: Choosing r elements from n is the same as choosing which n-r elements to exclude. Both operations produce the same count.

**Iterative Computation**: By building the result incrementally, we avoid computing large intermediate factorials. The division at each step keeps the result as an integer because binomial coefficients are always integers.

**Lucas Theorem**: Decomposing n and r into base-p digits leverages the property that C(n, r) mod p can be computed digit by digit when p is prime.

### Limitations

- **Overflow**: Standard 64-bit integers can only hold `C(66, 33)` ≈ 7.2 × 10^18
- **Computational limits**: Direct factorial computation fails for n > 20
- **Modular constraints**: Fermat's Little Theorem requires prime modulus
- **Large n with composite mod**: Requires Chinese Remainder Theorem or other advanced techniques

---

## Practice Problems

### Problem 1: Unique Paths

**Problem:** [LeetCode 62 - Unique Paths](https://leetcode.com/problems/unique-paths/)

**Description:** Robot on an `m x n` grid starts at top-left and wants to reach bottom-right. Robot can only move down or right. Return number of possible unique paths.

**How to Apply Binomial Coefficients:**
- To reach from (0,0) to (m-1,n-1), need exactly (m-1) down moves and (n-1) right moves
- Total moves = (m-1) + (n-1) = m + n - 2
- Answer: `C(m+n-2, m-1)` or equivalently `C(m+n-2, n-1)`

---

### Problem 2: Unique Paths II

**Problem:** [LeetCode 63 - Unique Paths II](https://leetcode.com/problems/unique-paths-ii/)

**Description:** Same as Unique Paths but with obstacles. Grid contains 0 (space) and 1 (obstacle). Return number of unique paths avoiding obstacles.

**How to Apply Binomial Coefficients:**
- Standard combinatorics won't work due to obstacles
- Use DP with binomial coefficient insights for optimization
- Alternative: Use inclusion-exclusion principle with combinatorics

---

### Problem 3: Number of Ways to Form a Target String

**Problem:** [LeetCode 1639 - Number of Ways to Form a Target String Given a Dictionary](https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-database/)

**Description:** Given a list of strings `words` and a string `target`, form `target` using characters from `words` with constraints on position usage.

**How to Apply Binomial Coefficients:**
- Count occurrences of each character at each position
- Use DP with combinatorics to count ways to choose positions
- Precompute factorials for combination calculations

---

### Problem 4: Number of Ways to Reorder Array to Get Same BST

**Problem:** [LeetCode 1569 - Number of Ways to Reorder Array to Get Same BST](https://leetcode.com/problems/number-of-ways-to-reorder-array-to-get-same-bst/)

**Description:** Given a permutation array, return the number of ways to reorder it so that the constructed BST is identical to the original.

**How to Apply Binomial Coefficients:**
- Use recursive divide and conquer with combinatorics
- For each root, count ways to interleave left and right subtrees: `C(left_size + right_size, left_size)`
- Multiply recursively for all nodes

---

### Problem 5: Count Number of Ways to Place Houses

**Problem:** [LeetCode 2320 - Count Number of Ways to Place Houses](https://leetcode.com/problems/count-number-of-ways-to-place-houses/)

**Description:** Street with `n * 2` plots (n on each side). Place houses with no two adjacent on same side. Return total number of ways.

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

---

### Q2: How to handle non-prime moduli?

**Answer**: Factor the modulus and use **Chinese Remainder Theorem**, or compute using prime factorization of the factorial terms:

1. Factor the modulus into prime powers
2. Compute nCr mod p^k for each prime power using Lucas theorem generalization
3. Combine results using CRT

Alternative: Direct computation with careful handling of GCD cancellations.

---

### Q3: What's the maximum n for 64-bit integers?

**Answer**: `C(66, 33)` ≈ 7.2 × 10^18 is the largest that fits in unsigned 64-bit. For signed 64-bit, `C(60, 30)` is safe.

For larger values, you must use:
- Arbitrary precision integers (Python's native big integers)
- Modular arithmetic
- Approximation formulas

---

### Q4: When should I precompute vs compute on the fly?

**Answer**: Precompute when:
- You have multiple queries (Q > max_n)
- n is bounded by a reasonable value (n ≤ 10^6 or 10^7)
- Query time is critical (need O(1))

Compute on the fly when:
- Single or few queries
- n is very large but r is small
- Memory is limited

---

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

### When to Use Each Approach

| Scenario | Approach | Time | Space |
|----------|----------|------|-------|
| Single query, small r | Iterative | O(r) | O(1) |
| Multiple queries, bounded n | Precomputation | O(1) | O(n) |
| Very large n (>10^9), small prime mod | Lucas Theorem | O(log_p n) | O(p) |
| Need all nCr values up to n | Pascal's Triangle | O(n²) | O(n²) |

This algorithm is essential for competitive programming and technical interviews, appearing frequently in combinatorics problems.
