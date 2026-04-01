## Permutations: Comparison

How do different permutation approaches compare?

<!-- front -->

---

### Generation Method Comparison

| Method | Time | Space | Use Case |
|--------|------|-------|----------|
| Backtracking | O(n × n!) | O(n) | All permutations |
| Next permutation | O(n!) | O(1) | Iterative generation |
| Heap's | O(n!) | O(n) | Minimal swaps |
| Factorial number | O(n^2) | O(n) | Direct k-th access |

---

### Lexicographic vs Other Orderings

| Ordering | Pattern | Use When |
|----------|---------|----------|
| Lexicographic | Dictionary order | Standard, intuitive |
| Steinhaus-Johnson-Trotter | Adjacent swaps | Minimal changes |
| Heap's | Track c[i] | Minimal swaps |

---

### Rank/Unrank Complexity

| Operation | With Array | With BIT/Fenwick | With Precompute |
|-----------|-----------|------------------|-----------------|
| Rank | O(n^2) | O(n log n) | O(n) |
| Unrank | O(n^2) | O(n log n) | O(n) |
| Space | O(n) | O(n) | O(n^2) |

---

### Handling Duplicates

| Approach | Complexity | Notes |
|----------|-----------|-------|
| Sort + skip | O(n! / d!) where d duplicates | Most common |
| Set filter | O(n!) then deduplicate | Inefficient |
| Multiset counting | Direct formula | Mathematical |

---

### Problem-Specific Recommendations

| Problem Type | Recommended Approach | Complexity |
|--------------|---------------------|------------|
| Generate all | Backtracking | O(n × n!) |
| Iterate through | Next permutation | O(n) per step |
| Get k-th | Factorial number system | O(n^2) or O(n log n) |
| Count with duplicates | Multinomial coefficient | O(1) with formula |
| Sort with swaps | Cycle decomposition | O(n) |

<!-- back -->
