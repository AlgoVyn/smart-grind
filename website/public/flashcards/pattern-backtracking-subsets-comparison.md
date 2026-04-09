## Backtracking - Subsets: Comparison

When should you use different subset generation approaches?

<!-- front -->

---

### Recursive vs Iterative vs Bitmask

| Aspect | Recursive | Iterative | Bitmask |
|--------|-----------|-----------|---------|
| **Code clarity** | High | High | Medium |
| **Performance** | Good | Good | Best |
| **Space** | O(n) stack | O(2^n) | O(1) extra |
| **Flexibility** | High | Medium | Low |
| **Interview use** | Preferred | Acceptable | Show-off |

**Winner**: Recursive for interviews, Bitmask for speed

---

### When to Use Each Approach

**Recursive Backtracking**:
- Clean, intuitive code
- Interview standard
- Easy to add constraints (sum, size, etc.)
- Handle duplicates naturally

**Iterative (Cascading)**:
- Simple to understand
- No recursion stack
- Good for learning

**Bitmask**:
- Maximum performance
- Compact code
- When you need to iterate all subsets quickly

---

### Comparison for Constrained Subsets

| Constraint | Best Approach | Modification |
|------------|---------------|--------------|
| Target sum | Recursive + pruning | Add sum check |
| Fixed size k | Recursive + early stop | Check `len(current)` |
| Duplicates | Recursive + skip | Sort, skip duplicates |
| Lexicographic | Any + sort input | Sort first |

---

### Decision Tree

```
Need all subsets?
├── Space constrained?
│   ├── Yes → Bitmask approach
│   └── No → Continue
├── Need constraints?
│   ├── Yes → Recursive backtracking
│   │   ├── Sum constraint → Add sum tracking
│   │   ├── Size constraint → Check length
│   │   └── Duplicates → Sort and skip
│   └── No → Simple iterative
└── Interview?
    └── Yes → Recursive (most readable)
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Basic subsets | Recursive | Clean, standard |
| Performance critical | Bitmask | O(1) space, fast |
| Subset sum | Recursive + pruning | Early termination |
| Size k subsets | Recursive | Easy length check |
| Duplicates present | Recursive | Natural handling |

<!-- back -->
