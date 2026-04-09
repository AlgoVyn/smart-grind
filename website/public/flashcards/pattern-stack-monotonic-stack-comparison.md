## Stack - Monotonic Stack: Comparison

When should you use different approaches for Monotonic Stack problems?

<!-- front -->

---

### Right-to-Left vs Left-to-Right Iteration

| Aspect | Right-to-Left | Left-to-Right |
|--------|---------------|---------------|
| **Direction** | `range(n-1, -1, -1)` | `range(n)` |
| **Stack order** | Decreasing | Decreasing |
| **Finds** | Next greater to the right | Previous greater to the left |
| **Also finds** | Future elements | Past elements |
| **Best for** | NGE problems | Distance/days problems |
| **Default value** | -1 (no greater found) | -1 or 0 |

**Key difference:** Direction determines which "side" of the array we search.

---

### Decreasing vs Increasing Stack

| Aspect | Decreasing Stack | Increasing Stack |
|--------|------------------|------------------|
| **Order (bottom→top)** | High to low values | Low to high values |
| **Comparison** | Pop when `<=` | Pop when `>=` |
| **Finds** | Next/previous greater | Next/previous smaller |
| **Examples** | NGE, Daily Temperatures | Next Smaller, Largest Rectangle |
| **When to use** | Greater element needed | Smaller element needed |

```
Decreasing: [5, 3, 2]  → new 4 pops 2,3 → [5, 4]
Increasing: [2, 3, 5]  → new 4 pops 5 → [2, 3, 4]
```

---

### Comparison: Variations Summary

| Variation | Iteration | Stack Order | Pop Condition | Finds | Default |
|-----------|-----------|-------------|---------------|-------|---------|
| Next Greater (right) | R-to-L | Decreasing | `<=` | First greater right | -1 |
| Previous Greater | L-to-R | Decreasing | `<=` | First greater left | -1 |
| Next Smaller (right) | R-to-L | Increasing | `>=` | First smaller right | -1 |
| Previous Smaller | L-to-R | Increasing | `>=` | First smaller left | -1 |
| Daily Temperatures | L-to-R | Decreasing | `<` | Days until warmer | 0 |
| Largest Rectangle | L-to-R | Increasing | `>` | Width boundaries | N/A |

---

### Brute Force vs Monotonic Stack

| Aspect | Brute Force | Monotonic Stack |
|--------|-------------|-----------------|
| **Time** | O(n²) | O(n) |
| **Space** | O(1) | O(n) |
| **Approach** | Nested loops | Single pass with stack |
| **Optimal** | ❌ No | ✅ Yes |
| **Readability** | Simple | Requires understanding |
| **When to use** | Small n, debugging | Production, large n |

**Trade-off:** We use O(n) extra space to achieve O(n) time instead of O(n²).

---

### Monotonic Stack vs Other Patterns

| Pattern | Time | Space | Use Case | vs Monotonic Stack |
|---------|------|-------|----------|-------------------|
| Brute Force | O(n²) | O(1) | Understanding | MS is O(n) time |
| Segment Tree | O(n log n) | O(n) | Range queries | MS is simpler for NGE |
| Sparse Table | O(n log n) prep, O(1) query | O(n log n) | Many queries | MS for single pass |
| Monotonic Queue | O(n) | O(k) | Sliding window max | Similar idea, different structure |

---

### Decision Matrix

| Situation | Approach | Direction | Stack Order |
|-----------|----------|-----------|-------------|
| Next greater to right | Monotonic | R-to-L | Decreasing |
| Previous greater to left | Monotonic | L-to-R | Decreasing |
| Days until condition | Monotonic | L-to-R | Decreasing |
| Next smaller to right | Monotonic | R-to-L | Increasing |
| Build smallest number | Monotonic | L-to-R | Increasing |
| Circular array | Monotonic | 2× R-to-L | Decreasing |

<!-- back -->
