## Combinations (nCr): Comparison Guide

How do different combination computation methods compare?

<!-- front -->

---

### Method Comparison

| Method | Preprocessing | Query Time | Space | Best For |
|--------|---------------|------------|-------|----------|
| **Direct** | None | O(r) | O(1) | Single query, r small |
| **DP (Pascal)** | O(n²) | O(1) | O(n²) | Many queries, n ≤ 1000 |
| **Factorial mod** | O(n) | O(log mod) | O(n) | Many queries mod prime |
| **Lucas** | O(p) | O(logₚ n × p) | O(p) | n huge, p small |
| **Lucas+FFT** | O(p log p) | O(logₚ n × log p) | O(p) | n huge, p moderate |

---

### When to Use Each Approach

```
Single C(50, 25):        Direct O(r)
Multiple queries ≤ 1000:  Precompute Pascal table
Many queries, mod prime:  Factorial + inverse
n > 10^9, p = 10^9+7:    Lucas theorem
n > 10^18, p small:      Lucas or Garner's algorithm
Non-prime modulus:       Lucas + CRT or prime factorization
```

---

### Similar Problems

| Problem | Relation |
|---------|----------|
| **Permutations P(n,r)** | C(n,r) × r! |
| **Stirling numbers** | Partitions of sets |
| **Bell numbers** | Sum of Stirling numbers |
| **Partitions** | Integer partitions (unrestricted) |
| **Multinomial** | Generalization of binomial |

---

### Complexity Theory

| Operation | Complexity | Notes |
|-----------|------------|-------|
| nCr mod prime | O(r log n) | Schoolbook |
| nCr mod prime | O(M(log n) log r) | With fast multiplication |
| All C(n,k) for fixed n | O(n log n) | Via recurrence |
| Range nCr queries | O(n) space, O(1) query | Preprocessing dominant |

---

### Common Pitfalls

| Pitfall | Issue | Solution |
|---------|-------|----------|
| Integer overflow | n! exceeds 64-bit | Use mod or big integers |
| Wrong loop order | Incorrect update in DP | Update backwards for 1D |
| Forgetting symmetry | Unnecessary iterations | r = min(r, n-r) |
| Modulo non-prime | Inverse doesn't exist | Use Lucas+CRT or prime factor |
| Precision loss | Float division | Stay in integers |

<!-- back -->
