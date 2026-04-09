## Binary Search - Rotated Array: Comparison

When should you use binary search on rotated arrays versus other approaches?

<!-- front -->

---

### Modified Binary Search vs Find Pivot + Standard Search

| Aspect | Modified Binary | Two-Step |
|--------|-----------------|----------|
| **Time** | O(log n) | O(log n) |
| **Code complexity** | More complex | Simpler logic |
| **Readability** | Harder to follow | Clear separation |
| **Comparison count** | Fewer | More (two passes) |
| **Interview** | Preferred (optimal) | Acceptable |

**Winner**: Modified binary for single pass elegance

---

### When to Use Rotated Array Binary Search

**Use when:**
- Array is sorted but rotated
- Need O(log n) search time
- Can't modify the array (otherwise could sort)
- Finding minimum/rotation point

**Don't use when:**
- Can sort the array first
- Array is not rotated (use standard binary search)
- Many duplicates make O(n) inevitable

---

### Comparison with Other Rotated Array Approaches

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Modified Binary** | O(log n) | O(1) | Single pass elegance |
| **Find Pivot + Search** | O(log n) | O(1) | Clearer logic |
| **Linear Scan** | O(n) | O(1) | Small arrays, dups |
| **Sort First** | O(n log n) | O(1) or O(n) | Multiple searches |

---

### Decision Tree

```
Array is sorted and rotated?
├── Yes → Many duplicates expected?
│   ├── Yes → Handle dups (may degrade to O(n))
│   └── No → MODIFIED BINARY SEARCH
│       → Need minimum or search?
│           → Choose appropriate variant
└── No → Standard BINARY SEARCH
```

---

### Key Trade-offs

| Consideration | Modified Binary Wins | Find Pivot + Search Wins |
|-------------|---------------------|-------------------------|
| Single pass efficiency | ✓ | - |
| Code clarity | - | ✓ |
| Interview elegance | ✓ | - |
| Teaching/understanding | - | ✓ |

<!-- back -->
