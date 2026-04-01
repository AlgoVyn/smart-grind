## Catalan Numbers: Problem Forms

What are the specific problem forms and variations involving Catalan numbers?

<!-- front -->

---

### Parentheses Forms

| Problem | Description | Catalan Application |
|---------|-------------|---------------------|
| **Valid parentheses** | n pairs of balanced () | Cₙ sequences |
| **Mountain ranges** | Ups/Downs, never negative | Same as parentheses |
| **Dyck paths** | Grid paths staying above diagonal | Cₙ paths |
| **Ballot problem** | A always ahead of B in voting | Related to Catalan |

**Parentheses enumeration:**
```python
def generate_parentheses(n):
    """Generate all Cₙ valid parentheses sequences"""
    result = []
    
    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:
            result.append(current)
            return
        
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)
    
    backtrack('', 0, 0)
    return result  # Length = Cₙ
```

---

### Tree Structures

| Structure | Count | Formula |
|-----------|-------|---------|
| **Binary trees** | n nodes | Cₙ |
| **Full binary trees** | n+1 leaves | Cₙ |
| **Plane trees** | n edges | Cₙ |
| **Ordered trees** | n nodes | Cₙ₋₁ |
| **BSTs** | n keys | Cₙ |

**BST count intuition:**
```
For keys {1,2,...,n}, pick root k:
- Left subtree: k-1 nodes → C(k-1) ways
- Right subtree: n-k nodes → C(n-k) ways
Total: C(n) = Σ C(k-1) × C(n-k) for k=1 to n
```

---

### Polygon Triangulation

Ways to triangulate a convex (n+2)-gon:

```
Triangle (3-gon): C₁ = 1 way (already triangle)
Quadrilateral (4-gon): C₂ = 2 ways
Pentagon (5-gon): C₃ = 5 ways
Hexagon (6-gon): C₄ = 14 ways
```

**Recurrence:** Pick a root edge, triangulation divides polygon into two smaller ones.

---

### Stack and Permutation

| Problem | Count | Description |
|---------|-------|-------------|
| **Stack-sortable** | Cₙ | Permutations sortable with one stack |
| **231-avoiding** | Cₙ | No pattern 2-3-1 |
| **Non-crossing matching** | Cₙ | n chords, no intersections |

**231-avoiding permutations:** No three indices i<j<k with pattern where a[k] < a[i] < a[j]

---

### Generalized Catalan

| Generalization | Formula | Description |
|----------------|---------|-------------|
| **k-Catalan** | Cₙ⁽ᵏ⁾ | k-ary trees, Fuss-Catalan |
| **Motzkin** | Mₙ | Paths with horizontal steps allowed |
| **Narayana** | N(n,k) | Catalan refined by peaks |
| **q-Catalan** | [n+1]⁻¹ [2n choose n] | Quantum version |
| **Super-Catalan** | s(n) | More complex structures |

**Fuss-Catalan (k-ary):**
```
Cₙ⁽ᵏ⁾ = 1/((k-1)n + 1) × C(kn, n)
Standard Catalan: k=2
```

<!-- back -->
