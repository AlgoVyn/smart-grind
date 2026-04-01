## Inclusion-Exclusion: Comparison with Alternatives

How does inclusion-exclusion compare to other counting techniques?

<!-- front -->

---

### PIE vs Direct Counting vs DP

| Technique | Time | Space | Use When |
|-----------|------|-------|----------|
| **Direct counting** | Problem-dependent | O(1) | Simple constraints |
| **PIE** | O(2ⁿ × intersection cost) | O(n) | Overlapping conditions |
| **DP (subset)** | O(2ⁿ × n) | O(2ⁿ) | Complex dependencies |
| **Generating functions** | Problem-dependent | O(1) | Analytic solution |

```python
# Direct counting (when possible)
def count_direct(n, conditions):
    count = 0
    for i in range(n):
        if all(not cond(i) for cond in conditions):
            count += 1
    return count

# PIE (for overlapping, structured conditions)
def count_pie(n, conditions, count_intersection):
    # O(2^n) with efficient intersection counting
    pass

# DP over subsets
def count_dp_subsets(conditions):
    # When conditions have structure
    pass
```

---

### PIE vs Möbius Inversion

| Aspect | PIE | Möbius Inversion |
|--------|-----|------------------|
| **Domain** | Set systems | Divisor lattices |
| **Structure** | Arbitrary sets | Partially ordered |
| **Computation** | Direct summation | Divisor enumeration |
| **Examples** | Union cardinality | Euler's totient |

```python
# PIE for union
pie_result = sum((-1)**(k+1) * intersection_size for k-sized subsets)

# Möbius for divisor poset
def mobius_sum(n):
    result = 0
    for d in divisors(n):
        result += mobius(d) * f(n // d)
    return result

# Connection: Both are special cases of Möbius inversion on posets
```

---

### When PIE Becomes Impractical

| Issue | Solution |
|-------|----------|
| **Too many conditions (n > 20)** | Use approximations, sampling, or structure-specific methods |
| **Intersection counting expensive** | Precompute, use approximation, or find alternative formulation |
| **Need exact count for large n** | Consider generating functions or asymptotic approximations |
| **Complex dependencies** | Factor into independent components, use conditional PIE |

```python
# When n is too large for 2^n enumeration
def pie_approximation(n, conditions, samples=10000):
    """
    Monte Carlo estimation when exact PIE is infeasible
    """
    import random
    count = 0
    for _ in range(samples):
        element = random.choice(universe)
        if any(cond(element) for cond in conditions):
            count += 1
    
    return (count / samples) * len(universe)
```

---

### Bonferroni Inequalities (Partial PIE)

```python
def bonferroni_bounds(events, order=2):
    """
    Partial PIE provides bounds when exact computation is expensive
    """
    from itertools import combinations
    
    n = len(events)
    
    if order == 1:
        # Boole's inequality: P(∪) <= Σ P(Aᵢ)
        return {'upper': sum(events)}
    
    # First two terms
    sum_single = sum(events)
    sum_pairs = sum(a * b for a, b in combinations(events, 2))
    
    if order == 2:
        # P(∪) >= Σ P(Aᵢ) - Σ P(Aᵢ ∩ Aⱼ)
        # P(∪) <= Σ P(Aᵢ)
        return {
            'lower': sum_single - sum_pairs,
            'upper': sum_single
        }
    
    # Higher orders provide tighter bounds
    # Odd orders: lower bounds
    # Even orders: upper bounds
    pass
```

**Trade-off:** Tighter bounds require more computation.

<!-- back -->
