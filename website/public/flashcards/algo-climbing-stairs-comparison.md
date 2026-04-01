## Climbing Stairs: Comparison Guide

How does climbing stairs compare to other counting and Fibonacci problems?

<!-- front -->

---

### Sequence Relationship

| Problem | Recurrence | Sequence |
|---------|------------|----------|
| **Climbing stairs** | f(n) = f(n-1) + f(n-2) | F(n+1) |
| **Tribonacci** | f(n) = f(n-1) + f(n-2) + f(n-3) | Tribonacci |
| **Coin change (ways)** | Sum over coins | Non-Fibonacci |
| **Catalan** | C(n) = Σ C(i)C(n-1-i) | Catalan |
| **Padovan** | P(n) = P(n-2) + P(n-3) | Padovan |

**Key difference:** Climbing stairs is the simplest Fibonacci with just 2 previous terms.

---

### DP Approaches Comparison

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Naive recursion** | O(2ⁿ) | O(n) | Never use |
| **Memoization** | O(n) | O(n) | When subproblems not all needed |
| **Tabulation** | O(n) | O(n) | Standard approach |
| **Space optimized** | O(n) | O(1) | Best for linear recurrences |
| **Matrix exp** | O(log n) | O(1) | n > 10⁶ |
| **Fast doubling** | O(log n) | O(1) | n > 10⁶, less overhead |
| **Closed form** | O(1) | O(1) | Small n only (precision) |

**Recommendation:** Space-optimized for n < 10⁶, fast doubling for larger.

---

### Similar Problems

| Problem | Difference from Climbing Stairs |
|---------|--------------------------------|
| **House robber** | Add constraint: cannot take adjacent |
| **Min cost stairs** | Minimize instead of count |
| **Decode ways** | String parsing with constraints |
| **Unique paths** | 2D grid instead of 1D line |
| **Partition equal subset** | Subset sum constraint |

---

### Recurrence Type Comparison

```
Linear recurrences (like climbing stairs):
  f(n) = a₁f(n-1) + a₂f(n-2) + ... + aₖf(n-k)
  → Matrix exponentiation works
  → Characteristic polynomial method
  → O(k³ log n) with matrix, O(k² log n) optimized

Non-linear recurrences:
  f(n) = f(n/2) + f(n/3) + n
  → Divide and conquer
  → No matrix method

Convolution recurrences (Catalan-like):
  f(n) = Σ f(i)f(n-i)
  → Usually requires O(n²) or generating functions
```

---

### When to Use Each Optimization

```
n ≤ 100:      Any method works
n ≤ 10⁶:      Use space-optimized O(n)
n ≤ 10⁹:      Use fast doubling O(log n)
n ≤ 10¹⁸:     Fast doubling with big integers
Need mod m:   Pisano period + fast doubling
Many queries: Precompute prefix table
```

<!-- back -->
