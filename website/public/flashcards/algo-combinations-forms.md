## Combinations (nCr): Problem Forms

What are the variations and applications of combinations?

<!-- front -->

---

### Multinomial Coefficients

```
C(n; n₁, n₂, ..., nₖ) = n! / (n₁! × n₂! × ... × nₖ!)

Where n₁ + n₂ + ... + nₖ = n
```

```python
def multinomial(n, groups):
    """
    Number of ways to partition n items into specified groups
    """
    result = 1
    remaining = n
    for g in groups:
        result *= nCr(remaining, g)
        remaining -= g
    return result

# Example: "MISSISSIPPI" permutations
# M:1, I:4, S:4, P:2
# Total = 11! / (1! × 4! × 4! × 2!)
```

---

### Combinations with Replacement

```
C(n + r - 1, r) = ways to choose r from n with repetition

Stars and bars: ★★|★★★|★ = 2 in bin1, 3 in bin2, 1 in bin3
```

```python
def nCr_replacement(n, r):
    """C(n+r-1, r): choose r from n with repetition allowed"""
    return nCr(n + r - 1, r)

# Example: buy 3 fruits from {apple, banana, orange}
# Ways = C(3+3-1, 3) = C(5,3) = 10
```

---

### Grid Path Counting

```python
def grid_paths(m, n):
    """
    Paths from (0,0) to (m,n) moving only right/down
    = C(m+n, m) = C(m+n, n)
    """
    return nCr(m + n, min(m, n))

# Example: 2×2 grid
# RRDD, RDRD, RDDR, DRRD, DRDR, DDRR
# Total: C(4,2) = 6 paths
```

---

### Binomial Distribution

```python
def binomial_probability(n, k, p):
    """
    Probability of k successes in n trials with prob p
    P(X=k) = C(n,k) × p^k × (1-p)^(n-k)
    """
    return nCr(n, k) * (p ** k) * ((1-p) ** (n-k))

def binomial_cdf(n, k, p):
    """P(X ≤ k)"""
    return sum(binomial_probability(n, i, p) for i in range(k + 1))
```

---

### Catalan Numbers (Restricted Paths)

```
Catalan(n) = C(2n, n) / (n + 1)
           = C(2n, n) - C(2n, n+1)
```

Applications:
| Problem | Catalan Interpretation |
|---------|------------------------|
| Valid parentheses | Never close more than open |
| BST count | Binary search tree shapes |
| Mountain ranges | Ups before downs |
| Non-crossing chords | Circle with 2n points |

```python
def catalan(n):
    """C(2n,n) / (n+1)"""
    return nCr(2*n, n) // (n + 1)
```

<!-- back -->
