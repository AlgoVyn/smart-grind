## Binary Search - On Sorted Array/List: Comparison

How do different binary search approaches compare?

<!-- front -->

---

### Binary Search Variations Comparison

| Approach | Time | Space | Use Case |
|----------|------|-------|----------|
| **Standard Binary Search** | O(log n) | O(1) | Finding any occurrence |
| **Recursive Binary Search** | O(log n) | O(log n) | Elegant, small inputs |
| **Lower Bound** | O(log n) | O(1) | First `>=` target |
| **Upper Bound** | O(log n) | O(1) | First `>` target |
| **First/Last Occurrence** | O(log n) | O(1) | Range of duplicates |
| **Linear Search** | O(n) | O(1) | Small or unsorted arrays |

---

### When to Use Each Approach

**Standard Binary Search**
- Just need to know if target exists
- Return any valid index
- Simplest implementation

**Lower Bound (`lower_bound`)**
- Find insertion position
- Find first element `>=` target
- Starting point of range queries

**Upper Bound (`upper_bound`)**
- Find position after target
- Count occurrences: `upper - lower`
- End point of range queries

**First/Last Occurrence**
- Find exact range of duplicates
- Need both boundaries
- LeetCode 34 pattern

---

### Iterative vs Recursive

| Aspect | Iterative | Recursive |
|--------|-----------|-----------|
| **Space** | O(1) | O(log n) |
| **Code clarity** | Verbose | Clean |
| **Stack overflow risk** | None | Large arrays |
| **Interview preference** | Preferred | Show you know both |

**Winner**: Iterative for production, either for interviews

---

### Binary Search vs Linear Search

| Scenario | Binary Search | Linear Search |
|----------|---------------|---------------|
| Sorted array, 1000 elements | ~10 steps | 1000 steps |
| Unsorted array | Not applicable | Only option |
| Single lookup | Sort + O(log n) may lose | O(n) might win |
| Multiple lookups | Sort once, query many | O(k × n) |

**Key insight**: Binary search requires sorted data. If data isn't sorted, consider if sorting once enables many fast queries.

---

### Trade-off Summary

| Situation | Best Choice | Why |
|-----------|-------------|-----|
| Interview standard | Iterative standard | Most commonly expected |
| Need insertion point | Lower bound | Returns position regardless of presence |
| Count duplicates | Lower + Upper bound | Two O(log n) searches |
| Code golf / elegance | Recursive | Fewer lines |
| Space constrained | Iterative | No call stack overhead |

<!-- back -->
