## Catalan Numbers: Core Concepts

What are the fundamental concepts and mathematical properties of Catalan numbers?

<!-- front -->

---

### Definition

Catalan numbers form a sequence of natural numbers that appear in **counting problems involving recursively-defined objects**.

**Closed form:**
$$C(n) = \frac{1}{n+1} \binom{2n}{n} = \frac{(2n)!}{(n+1)! \times n!}$$

**Recurrence:**
$$C(n) = \sum_{i=0}^{n-1} C(i) \times C(n-1-i)$$

---

### Core Insight: Recursive Decomposition

The "aha!" moment: Catalan problems decompose into **two independent subproblems**:

```
        C(n)
       /    \
   C(i)      C(n-1-i)
   (left)    (right)
   
C(n) = Σ C(left) × C(right) for all possible splits
```

**Key property:** Left and right subproblems are **completely independent** → solutions multiply.

---

### Base Cases (Critical!)

| n | C(n) | Interpretation |
|---|------|----------------|
| 0 | 1 | Empty structure (1 way to do nothing) |
| 1 | 1 | Single element structure |

**Why C(0) = 1?** There's exactly one way to have an empty structure.

---

### Growth Rate

Catalan numbers grow as:

$$C(n) \sim \frac{4^n}{n^{3/2}\sqrt{\pi}}$$

**Practical implications:**
- C(20) ≈ 6.5 billion (overflows 32-bit)
- Use `long`/`long long` for n ≥ 15
- Consider modulo for competitive programming

---

### Common Problem Categories

| Category | Example | Structure |
|----------|---------|-----------|
| **Parentheses** | Valid parentheses combinations | `(` + left + `)` + right |
| **Binary Trees** | Unique BSTs with n nodes | root + left_subtree + right_subtree |
| **Triangulation** | Polygon triangulations | triangle splits polygon into two |
| **Paths** | Dyck paths (don't cross diagonal) | first return splits path |
| **Stack Sortable** | Permutations sortable by one stack | stack operations create structure |

---

### Pattern Recognition Triggers

Watch for these keywords:
- "valid combinations"
- "unique structures"
- "non-crossing"
- "ways to pair"
- "binary tree shapes"
- "parentheses matching"
- "recursive decomposition"

<!-- back -->
