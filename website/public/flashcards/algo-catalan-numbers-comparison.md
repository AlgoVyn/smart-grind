## Catalan Numbers: Comparison Guide

How do Catalan numbers compare to other combinatorial sequences and counting methods?

<!-- front -->

---

### Combinatorial Sequence Comparison

| Sequence | Formula | Growth | Applications |
|----------|---------|--------|--------------|
| **Catalan** | C(2n,n)/(n+1) | ~4ⁿ/n^(3/2) | Trees, parentheses, triangulations |
| **Fibonacci** | Fₙ = Fₙ₋₁ + Fₙ₋₂ | ~φⁿ | Recursion, rabbit problem |
| **Binomial** | C(n,k) | Varies | Subsets, combinations |
| **Bell** | Bₙ₊₁ = Σ C(n,k)Bₖ | n^(n(1+o(1))) | Set partitions |
| **Stirling 2nd** | S(n,k) | Varies | Set partitions into k parts |
| **Partition** | p(n) | ~exp(π√(2n/3)) | Integer partitions |
| **Factorial** | n! | nⁿ | Permutations |
| **Central binomial** | C(2n,n) | ~4ⁿ/√n | Lattice paths |

---

### Catalan vs Central Binomial

| Aspect | Catalan C(2n,n)/(n+1) | Central Binomial C(2n,n) |
|--------|----------------------|--------------------------|
| **Formula** | With (n+1) divisor | Without divisor |
| **Growth** | ~4ⁿ/n^(3/2) | ~4ⁿ/√n |
| **Ratio** | Cₙ / C(2n,n) = 1/(n+1) | — |
| **Counting** | Constrained structures | All paths |
| **Example** | Valid parentheses | All parentheses strings |

**Key insight:** Catalan is "constrained" central binomial - divides by (n+1) to account for constraint.

---

### Related Lattice Path Counts

| Path Type | Formula | Constraint |
|-----------|---------|------------|
| **All paths** | C(2n,n) | None |
| **Dyck paths** | Cₙ | Never go below diagonal |
| **Ballot paths** | (a-b)/(a+b) × C(a+b,a) | A always ahead |
| **Motzkin** | Mₙ | Allow horizontal steps |
| **Schröder** | rₙ | Allow horizontal of length 2 |

---

### When to Use Each Counting Method

| Structure | Count | Method |
|-----------|-------|--------|
| Unconstrained binary strings | 2ⁿ | Direct |
| Subsets of n elements | 2ⁿ | Power set |
| Permutations | n! | Factorial |
| Combinations | C(n,k) | Binomial |
| Balanced parentheses | Cₙ | Catalan recurrence |
| Binary trees | Cₙ | Catalan |
| Labeled trees | nⁿ⁻² | Cayley's formula |
| Spanning trees | Matrix-Tree thm | Determinant |

---

### Complexity in Counting Problems

| Problem Type | Typical Approach | Complexity |
|--------------|-----------------|------------|
| Direct formula | Closed form | O(1) to O(n) |
| Recurrence | DP | O(n²) to O(n) |
| Bijection | Map to known | Proof complexity |
| Generating function | Algebra | Extract coefficient |
| Inclusion-exclusion | Count complement | 2ⁿ terms |
| Burnside/Polya | Group actions | |G| iterations |

**Catalan sits at sweet spot:** Clean formula, many interpretations, tractable computation.

<!-- back -->
