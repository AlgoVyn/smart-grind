## Cyclic Sort: Core Concepts

What is cyclic sort and when is it the optimal sorting approach?

<!-- front -->

---

### Fundamental Principle

Cyclic sort places each element at its **correct index** in a single pass by following a cycle:

```
For array values in range [1, n]:
  - Element with value x belongs at index x-1
  - Follow the cycle: swap elements until each is in place
```

**Key insight:** When values map directly to indices, we can sort in-place with minimal swaps.

---

### Algorithm Properties

| Property | Value |
|----------|-------|
| **Time complexity** | O(n) - optimal |
| **Space complexity** | O(1) - in-place |
| **Number of writes** | O(n) - minimal |
| **Stability** | Not stable |
| **Comparison-based** | No - uses value-index mapping |

---

### When Cyclic Sort Applies

| Requirement | Explanation |
|-------------|-------------|
| **Known range** | Values in [min, max] with known bounds |
| **Unique mapping** | Each value maps to exactly one index |
| **Dense data** | Most values in range are present (optional but efficient) |

**Ideal problems:**
- Find missing number in [1, n]
- Find duplicate in [1, n]
- Find first missing positive

---

### Cycle Detection Pattern

```
Array: [3, 1, 5, 4, 2]
Index:  0  1  2  3  4

Cycle starting at index 0:
  3 belongs at index 2, swap with 5
  5 belongs at index 4, swap with 2
  2 belongs at index 1, swap with 1
  1 belongs at index 0, done!

Result: [1, 2, 3, 4, 5]
```

---

### Comparison to Other Sorts

| Algorithm | Time | Space | When to Use |
|-----------|------|-------|-------------|
| **Cyclic** | O(n) | O(1) | Values in [1,n], known range |
| **Counting** | O(n+k) | O(k) | Small integer range, duplicates ok |
| **Radix** | O(d×(n+k)) | O(n+k) | Fixed-width integers |
| **Quick** | O(n log n) | O(log n) | General purpose |
| **Merge** | O(n log n) | O(n) | Stable sort needed |

<!-- back -->
