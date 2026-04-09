## Backtracking - Permutations: Comparison

When should you use different permutation approaches?

<!-- front -->

---

### Swap-based vs Used-array

| Aspect | Swap-based | Used-array |
|--------|------------|------------|
| **Code** | Shorter | Longer |
| **Duplicates** | Harder to handle | Easier with skip logic |
| **Performance** | Same | Same |
| **Use case** | Distinct elements | Handle duplicates |

**Winner**: Swap-based for distinct, Used-array for duplicates

---

### Backtracking vs Next Permutation

| Aspect | Backtracking | Next Permutation |
|--------|--------------|------------------|
| **Goal** | All permutations | Single next |
| **Time** | O(n × n!) | O(n) |
| **Use case** | Enumeration | Iteration |
| **Memory** | O(n) stack | O(1) |

---

### Decision Tree

```
Permutation problem?
├── Distinct elements?
│   ├── Yes → Swap-based backtracking
│   └── No → Used-array with sorting
├── Need all permutations?
│   ├── Yes → Backtracking
│   └── No → Next/previous permutation
├── Find k-th?
│   └── Yes → Factorial number system
└── Count permutations?
    └── Yes → Factorial (n!)
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Distinct elements | Swap-based | Cleaner code |
| Duplicates | Used-array + sort | Natural handling |
| Iterate in order | Next permutation | O(n) per step |
| Random access k-th | Factorial system | O(n²) total |

<!-- back -->
