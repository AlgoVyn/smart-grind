## Cyclic Sort: Comparison Guide

How does cyclic sort compare to other sorting and searching approaches?

<!-- front -->

---

### Sorting Algorithms for Known Ranges

| Algorithm | Time | Space | Stability | Best For |
|-----------|------|-------|-----------|----------|
| **Cyclic** | O(n) | O(1) | No | [1,n], unique-ish |
| **Counting** | O(n+k) | O(k) | Yes | Small range, duplicates |
| **Bucket** | O(n) avg | O(n+k) | Yes | Uniform distribution |
| **Radix** | O(d(n+k)) | O(n+k) | Yes | Fixed-width numbers |
| **Quick** | O(n log n) | O(log n) | No | General purpose |

**Cyclic sort wins:** When values map 1-to-1 with indices and range is [1,n].

---

### Missing Number Approaches

| Approach | Time | Space | Modifies Input? |
|----------|------|-------|-----------------|
| **Cyclic sort** | O(n) | O(1) | Yes |
| **Sum formula** | O(n) | O(1) | No |
| **XOR** | O(n) | O(1) | No |
| **Hash set** | O(n) | O(n) | No |
| **Binary search** | O(n log n) | O(1) | No |

**Trade-offs:**
- Cyclic sort: fastest but modifies array
- Sum/XOR: O(1) space, no modification, but single missing only
- Hash set: handles duplicates, more memory

---

### Duplicate Detection Methods

| Method | Time | Space | Input Constraints |
|--------|------|-------|-------------------|
| **Cyclic sort** | O(n) | O(1) | Values in [1,n], can modify |
| **Floyd's** | O(n) | O(1) | Values in [1,n], read-only |
| **Hash set** | O(n) | O(n) | None |
| **Sorting** | O(n log n) | O(1) or O(n) | None |
| **Bit vector** | O(n) | O(n/8) | n known |

---

### When to Choose Cyclic Sort

```
Can you modify the input?
  ├─ NO → Use Floyd's (single duplicate) or hash set
  └─ YES → Continue...

Are values in [1, n] or can be mapped to indices?
  ├─ YES → Use cyclic sort (O(n) time, O(1) space)
  └─ NO → Use counting sort or other

Do you need to find missing/duplicate?
  ├─ YES → Cyclic sort + linear scan
  └─ NO → Consider if cyclic sort helps at all
```

---

### Related Patterns

| Pattern | Relation to Cyclic Sort |
|---------|------------------------|
| **Floyd's cycle** | Alternative for read-only arrays |
| **In-place swap** | Core technique of cyclic sort |
| **Pigeonhole principle** | Theoretical basis |
| **Index as hash** | Values encode their position |
| **Two pointers** | Similar swap logic in sorted arrays |

<!-- back -->
