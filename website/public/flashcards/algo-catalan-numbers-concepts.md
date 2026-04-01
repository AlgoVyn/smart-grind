## Catalan Numbers: Core Concepts

What are Catalan numbers, what do they count, and how are they computed?

<!-- front -->

---

### Fundamental Definition

Catalan numbers form a sequence of natural numbers with numerous combinatorial interpretations.

**Formula:**
```
Cₙ = (1/(n+1)) × C(2n, n) = (2n)! / ((n+1)! × n!)
```

**First few values:**
| n | Cₙ | Application |
|---|-----|-------------|
| 0 | 1 | Base case |
| 1 | 1 | Single pair |
| 2 | 2 | Two configurations |
| 3 | 5 | Five trees/parentheses |
| 4 | 14 | More complex structures |
| 5 | 42 | Many interpretations |

---

### Recursive Definition

```
C₀ = 1
Cₙ₊₁ = Σ (Cᵢ × Cₙ₋ᵢ) for i = 0 to n

     C₀×Cₙ + C₁×Cₙ₋₁ + ... + Cₙ×C₀
```

**Recurrence intuition:** Split problem at each possible point, multiply subproblems.

---

### Combinatorial Interpretations

| Structure | Counted by Cₙ |
|-----------|---------------|
| **Balanced parentheses** | Valid sequences of n pairs () |
| **Binary trees** | Full binary trees with n+1 leaves |
| **BSTs** | BSTs that can be formed with n nodes |
| **Triangulations** | Ways to triangulate (n+2)-gon |
| **Dyck paths** | Paths from (0,0) to (2n,0) that never go below x-axis |
| **Mountain ranges** | Ups and downs never below start |
| **Stack sortable** | Permutations sortable with one stack |

---

### Asymptotic Behavior

```
Cₙ ~ 4ⁿ / (n^(3/2) × √π)
```

**Growth rate:** Roughly 4ⁿ, grows exponentially but slower than 4ⁿ exactly.

**Practical implication:** Cₙ fits in 64-bit up to n=33, then needs big integers.

---

### When to Recognize Catalan

| ✅ Catalan Applies | Pattern |
|-------------------|---------|
| Recursive structure with two subproblems | Cₙ = Σ Cᵢ × Cₙ₋ᵢ |
| Parentheses matching | Valid nesting |
| Binary tree counting | Left and right subtrees |
| Non-crossing structures | Chords, paths, partitions |
| Stack discipline | Push/pop constraints |

<!-- back -->
