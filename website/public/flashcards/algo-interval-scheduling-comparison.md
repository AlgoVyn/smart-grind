## Interval Scheduling: Comparison with Alternatives

How does interval scheduling compare to other optimization approaches?

<!-- front -->

---

### Greedy vs DP vs ILP

| Approach | Time | Optimal | Use When |
|----------|------|---------|----------|
| **Greedy (earliest finish)** | O(n log n) | ✓ For unweighted | Maximum cardinality |
| **Dynamic programming** | O(n log n) or O(n²) | ✓ For weighted | Weighted intervals |
| **Integer linear programming** | Exponential | ✓ | Complex constraints |
| **Approximation** | O(n) | Within factor | Large instances |

```python
# Greedy: Simple and optimal for unweighted
def greedy_optimal(intervals):
    intervals.sort(key=lambda x: x[1])
    result = []
    last_end = 0
    for s, e in intervals:
        if s >= last_end:
            result.append((s, e))
            last_end = e
    return result

# DP: Required for weighted
def dp_optimal(intervals):
    # Binary search + DP
    # O(n log n)
    pass

# ILP: Overkill but flexible
# maximize sum(x_i * w_i)
# subject to: x_i + x_j <= 1 for overlapping i,j
# x_i in {0, 1}
```

---

### Different Greedy Strategies

| Strategy | Optimal? | Counterexample |
|----------|----------|----------------|
| **Earliest finish** | ✓ Yes | - |
| **Earliest start** | ✗ No | [(1,10), (2,3), (4,5)] → picks (1,10), misses 2 |
| **Shortest duration** | ✗ No | [(1,4), (3,6), (5,8)] → picks (3,6), misses 2 |
| **Fewest conflicts** | ✗ No | Can be constructed |

```python
def earliest_start_greedy(intervals):
    """Suboptimal - do not use"""
    intervals.sort()  # By start time
    result = []
    for s, e in intervals:
        if not result or s >= result[-1][1]:
            result.append((s, e))
    return result

# Fails on:
# intervals = [(1, 10), (2, 3), (4, 5)]
# Greedy picks (1, 10), optimal picks (2, 3), (4, 5)
```

---

### Weighted vs Unweighted Trade-offs

| Problem | Algorithm | Key Insight |
|---------|-----------|-------------|
| **Unweighted** | Greedy O(n log n) | Earliest finish always optimal |
| **Weighted, small n** | DP O(n²) | Try all subsets efficiently |
| **Weighted, large n** | DP + binary search O(n log n) | Precompute non-conflicting |
| **Weighted, online** | Competitive algorithms | Can't see future intervals |

```python
# Weighted interval decision:
def choose_weighted_algorithm(n, constraint):
    if constraint == "must be optimal":
        if n < 1000:
            return "DP O(n^2)"
        else:
            return "DP + binary search O(n log n)"
    else:
        return "Greedy approximation"
```

---

### Interval Scheduling vs Graph Problems

| Aspect | Interval Scheduling | Maximum Independent Set |
|--------|---------------------|------------------------|
| **Graph type** | Interval graphs | General graphs |
| **Complexity** | O(n log n) | NP-hard (general) |
| **Greedy works** | Yes | No |
| **Structure** | Perfect ordering | Arbitrary |

```python
# Interval graph is perfect:
# - Maximum independent set (interval scheduling)
# - Chromatic number (interval partitioning)
# - Clique number (max overlap)
# All solvable in polynomial time

# General graph:
# - Maximum independent set: NP-hard
# - Chromatic number: NP-hard
# - Need approximation or exponential algorithms
```

**Key insight:** Interval scheduling is easy because interval graphs have perfect structure.

<!-- back -->
