## Inclusion-Exclusion: Core Concepts

What is the Principle of Inclusion-Exclusion (PIE) and how is it applied?

<!-- front -->

---

### Fundamental Definition

**PIE** computes the size of union of sets by alternately including and excluding intersections.

```
|A ∪ B| = |A| + |B| - |A ∩ B|

|A ∪ B ∪ C| = |A| + |B| + |C|
              - |A ∩ B| - |A ∩ C| - |B ∩ C|
              + |A ∩ B ∩ C|
```

**General form:**
```
|∪ Aᵢ| = Σ|Aᵢ| - Σ|Aᵢ ∩ Aⱼ| + Σ|Aᵢ ∩ Aⱼ ∩ Aₖ| - ... + (-1)ⁿ⁺¹|∩ Aᵢ|
```

---

### Key Insight: Complementary Counting

```
Count elements satisfying NONE of the conditions:
= Total - |∪ Aᵢ|
= Total - Σ|Aᵢ| + Σ|Aᵢ ∩ Aⱼ| - Σ|Aᵢ ∩ Aⱼ ∩ Aₖ| + ...
```

**Applications:**
- Count numbers coprime to n
- Count derangements
- Count valid configurations

---

### Pattern: Bitmask Enumeration

```
For n conditions, iterate over all 2ⁿ subsets:
- Empty set: sign = +1, count = Total
- Odd-sized subsets: sign = -1
- Even-sized subsets: sign = +1

Sum: Σ (-1)^(|S|+1) × |∩ conditions in S|
```

---

### Common Applications

| Problem | PIE Application |
|---------|-----------------|
| **Coprime count** | φ(n) using prime factors |
| **Derangements** | !n = n! × Σ(-1)ᵏ/k! |
| **Surjective functions** | Count onto functions |
| **Valid permutations** | Forbidden position constraints |
| **Number theory** | Count numbers divisible by subset |

<!-- back -->
