## Backtracking - Combination Sum: Comparison

When should you use different combination sum approaches?

<!-- front -->

---

### Backtracking vs DP

| Aspect | Backtracking | DP |
|--------|--------------|-----|
| **Goal** | Enumerate all solutions | Count solutions only |
| **Time** | Exponential | O(target × n) |
| **Space** | O(target/min) | O(target) |
| **Use case** | Need actual combinations | Just need count |
| **Implementation** | Recursive | Iterative |

**Winner**: Backtracking for listing, DP for counting

---

### Unbounded vs Bounded

| Aspect | Unbounded (I) | Bounded (II) |
|--------|---------------|--------------|
| **Reuse** | Allowed | Not allowed |
| **Recursive call** | `backtrack(i, ...)` | `backtrack(i+1, ...)` |
| **Duplicates in input** | Doesn't matter | Sort + skip |
| **Example** | [2,3,6,7] target 7 | [10,1,2,7,6,1,5] target 8 |

---

### Decision Tree

```
Combination sum problem?
├── Need all combinations?
│   ├── Yes → Backtracking
│   └── No → Just count?
│       └── Yes → DP (faster)
├── Reuse allowed?
│   ├── Yes → Pass index i
│   └── No → Pass index i+1
├── Duplicates in input?
│   ├── Yes → Sort + skip dups
│   └── No → Sort for pruning
└── Exactly k numbers?
    └── Yes → Add count parameter
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| List all combos | Backtracking | Natural enumeration |
| Count only | DP | Much faster |
| Minimum elements | Backtracking + pruning | Early termination |
| Large target | DP | Polynomial vs exponential |

<!-- back -->
