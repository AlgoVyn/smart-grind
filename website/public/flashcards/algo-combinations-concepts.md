## Combinations (nCr): Core Concepts

What are the mathematical and computational aspects of computing n choose r?

<!-- front -->

---

### Mathematical Definition

```
C(n, r) = n! / (r! × (n-r)!)

        = n × (n-1) × ... × (n-r+1)
          ─────────────────────────────
          r × (r-1) × ... × 1
```

**Properties:**
- C(n, 0) = C(n, n) = 1
- C(n, r) = C(n, n-r) (symmetry)
- C(n, r) = C(n-1, r-1) + C(n-1, r) (Pascal's identity)

---

### Computational Challenges

| Challenge | Issue | Solution |
|-----------|-------|----------|
| Factorial overflow | n! grows extremely fast | Compute iteratively, reduce early |
| Integer overflow | Intermediate values large | Use 64-bit or big integers |
| Precision loss | Floating point inaccurate | Stay in integers |
| Modulo required | Large results | Precompute factorials mod p |

---

### Pascal's Triangle Connection

```
        C(0,0)
      C(1,0) C(1,1)
    C(2,0) C(2,1) C(2,2)
  C(3,0) C(3,1) C(3,2) C(3,3)
```

**DP recurrence:** `C(n,r) = C(n-1,r-1) + C(n-1,r)`

---

### Common Applications

| Application | How nCr Used |
|-------------|--------------|
| Binomial expansion | Coefficients of (a+b)ⁿ |
| Path counting | Grid paths, Catalan-like |
| Probability | Binomial distribution |
| Subset enumeration | Choose r from n |
| Committee problems | Selection without order |

---

### Complexity Overview

| Method | Time | Space | Best For |
|--------|------|-------|----------|
| Direct formula | O(r) | O(1) | Single computation, small r |
| DP table | O(n²) | O(n²) | Many queries |
| Precompute factorials | O(n) prep, O(1) query | O(n) | Modulo prime, many queries |
| Lucas theorem | O(logₚ n) | O(1) | n large, p small prime |

<!-- back -->
